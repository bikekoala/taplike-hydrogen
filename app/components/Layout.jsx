import {useParams, Form, Await} from '@remix-run/react';
import {useWindowScroll} from 'react-use';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo, useState} from 'react';
import {useLocation} from 'react-use';
import {CartForm} from '@shopify/hydrogen';
import {Back, LeftC, Application, HeadsetOne} from '@icon-park/react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react';
import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
  DiscountModal,
} from '~/components';
import {useIsHomePath} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useRootLoaderData} from '~/root';

/**
 * @param {LayoutProps}
 */
export function Layout({children, layout}) {
  const {headerMenu, footerMenu} = layout || {};
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const isHome = useIsHomePath();
  const [discountModalIndex, setDiscountModalIndex] = useState(0);
  const {pathname} = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    setDiscountModalIndex(0);
  }, [pathname]);

  const onDiscountModalChange = () => {
    onOpenChange();
    setDiscountModalIndex((e) => e + 1);
  };

  const onClickMobileBuyBtn = (index) => {
    let discountCode = '';
    if (index === undefined) {
      // 没有折扣码
      discountCode = '';
    } else if (index === 0) {
      // 第一个弹窗5%的折扣
      discountCode = 'ABC5';
    } else if (index === 1) {
      // 第二个弹窗15%的折扣
      discountCode = 'DD15';
    } else {
      // 第三个弹窗20%的折扣
      discountCode = 'TT20';
    }

    dispatch({type: 'CLICK_BUY_BTN', discountCode});
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        {/* <div className="flex flex-col min-h-screen"> */}
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && layout?.shop.name && (
          <Header
            title={layout.shop.name}
            menu={headerMenu}
            onOpen={onOpen}
            onDiscountModalChange={onDiscountModalChange}
            isDiscountModalOpen={isOpen}
          />
        )}
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
        {isHome == false && <MobileFooter clickBuyBtn={onClickMobileBuyBtn} />}
      </div>
      {/* {footerMenu && <Footer menu={footerMenu} />} */}

      {/* 弹窗遮罩 */}
      <Modal
        // isOpen={true}
        size="xs"
        isOpen={isOpen}
        onOpenChange={onDiscountModalChange}
        placement={'center'}
        backdrop={'opaque'}
        className="z-50"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1"></ModalHeader>
          <ModalBody>
            <DiscountModal
              index={discountModalIndex}
              onClickBuyBtn={onClickMobileBuyBtn}
            ></DiscountModal>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

/**
 * @param {{title: string; menu?: EnhancedMenu}}
 */
function Header({
  title,
  menu,
  onOpen,
  isDiscountModalOpen,
  onDiscountModalChange,
}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={true}
        // isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
        onOpen={onOpen}
        onDiscountModalChange={onDiscountModalChange}
        isDiscountModalOpen={isDiscountModalOpen}
      />
    </>
  );
}

/**
 * @param {{isOpen: boolean; onClose: () => void}}
 */
function CartDrawer({isOpen, onClose}) {
  const rootData = useRootLoaderData();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   menu: EnhancedMenu;
 * }}
 */
export function MenuDrawer({isOpen, onClose, menu}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

/**
 * @param {{
 *   menu: EnhancedMenu;
 *   onClose: () => void;
 * }}
 */
function MenuMobileNav({menu, onClose}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

/**
 * @param {{
 *   title: string;
 *   isHome: boolean;
 *   openCart: () => void;
 *   openMenu: () => void;
 * }}
 */
function MobileHeader({
  title,
  isHome,
  onOpen,
  isDiscountModalOpen,
  onDiscountModalChange,
}) {
  const params = useParams();

  const clickBackBtn = (e) => {
    e.stopPropagation();
    if (isDiscountModalOpen === true) {
      onDiscountModalChange();
      setTimeout(() => {
        onOpen();
      }, 300);
    } else {
      onOpen();
    }
  };

  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
          : 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
      } flex items-center h-14 fixed lg:hidden backdrop-blur-lg z-999 top-0 justify-between w-full leading-none gap-4 px-2 md:px-8`}
      // } flex lg:hidden items-center h-14 sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      {/* <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div> */}

      {/* <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow h-full"
        to="/"
      > */}
      <Heading
        className="font-bold text-center leading-none"
        as={isHome ? 'h1' : 'h2'}
      >
        <div
          className="flex flex-row justify-center items-center texl-6xl"
          onClick={(e) => clickBackBtn(e)}
        >
          <LeftC theme="two-tone" size="28" fill={['#333', '#ffffff']} />
          <span className="text-2xl">BACK</span>
        </div>
        {/* {title} */}
      </Heading>
      {/* </Link> */}

      <div className="flex items-center justify-end w-full gap-4">
        {/* <AccountLink className="relative flex items-center justify-center w-8 h-8" /> */}
        {/* <CartCount isHome={isHome} openCart={openCart} /> */}
      </div>
    </header>
  );
}

/**
 *
 */
function MobileFooter({clickBuyBtn}) {
  const clickBtn = (e) => {
    clickBuyBtn();
  };
  return (
    <div className="fixed inset-x-0 bottom-0 bg-white flex flex-col justify-center items-center text-xl font-bold">
      <div className="divide-line w-screen h-px bg-gray-200">
        <div className="h-px bg-gray-200"></div>
      </div>
      <div className="flex flex-row w-full px-4 justify-between items-center h-16">
        {/* <div className="mobile-footer-left-box flex flex-row justify-center items-center mr-5">
          <Application
            theme="outline"
            size="20"
            fill="#4a4a4a"
            className="mr-3"
          />
          <HeadsetOne theme="outline" size="20" fill="#4a4a4a" />
        </div> */}
        <div
          onClick={clickBtn}
          className="mobile-footer-right-box flex justify-center items-center flex-1 h-11 bg-rose-500 rounded-sm text-white text-xl"
        >
          Buy now
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   isHome: boolean;
 *   openCart: () => void;
 *   menu?: EnhancedMenu;
 *   title: string;
 * }}
 */
function DesktopHeader({isHome, menu, openCart, title}) {
  const params = useParams();
  const {y} = useWindowScroll();
  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
          : 'bg-contrast/80 text-primary'
      } ${
        !isHome && y > 50 && ' shadow-lightHeader'
      } hidden h-nav lg:flex items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8`}
    >
      <div className="flex gap-12">
        <Link className="font-bold" to="/" prefetch="intent">
          {title}
        </Link>
        <nav className="flex gap-8">
          {/* Top level menu items */}
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch="intent"
              className={({isActive}) =>
                isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
              }
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex items-center gap-2"
        >
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
          >
            <IconSearch />
          </button>
        </Form>
        <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

/**
 * @param {{className?: string}}
 */
function AccountLink({className}) {
  const rootData = useRootLoaderData();
  const isLoggedIn = rootData?.isLoggedIn;

  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <IconAccount />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <IconLogin />
    </Link>
  );
}

/**
 * @param {{
 *   isHome: boolean;
 *   openCart: () => void;
 * }}
 */
function CartCount({isHome, openCart}) {
  const rootData = useRootLoaderData();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

/**
 * @param {{
 *   count: number;
 *   dark: boolean;
 *   openCart: () => void;
 * }}
 */
function Badge({openCart, dark, count}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary'
          } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

/**
 * @param {{menu?: EnhancedMenu}}
 */
function Footer({menu}) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}
        bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    >
      <FooterMenu menu={menu} />
      <CountrySelector />
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project.
      </div>
    </Section>
  );
}

/**
 * @param {{item: ChildEnhancedMenuItem}}
 */
function FooterLink({item}) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

/**
 * @param {{menu?: EnhancedMenu}}
 */
function FooterMenu({menu}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}

/**
 * @typedef {{
 *   children: React.ReactNode;
 *   layout?: LayoutQuery & {
 *     headerMenu?: EnhancedMenu | null;
 *     footerMenu?: EnhancedMenu | null;
 *   };
 * }} LayoutProps
 */

/** @typedef {import('storefrontapi.generated').LayoutQuery} LayoutQuery */
/** @typedef {import('~/lib/utils').EnhancedMenu} EnhancedMenu */
/** @typedef {import('~/lib/utils').ChildEnhancedMenuItem} ChildEnhancedMenuItem */
