import {useRef, Suspense} from 'react';
import {Disclosure, Listbox} from '@headlessui/react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Await} from '@remix-run/react';
import {Right} from '@icon-park/react'
import {
  AnalyticsPageType,
  Money,
  ShopPayButton,
  VariantSelector,
  getSelectedProductOptions,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';
import {
  Heading,
  IconCaret,
  IconCheck,
  IconClose,
  ProductGallery,
  ProductSwimlane,
  Section,
  Skeleton,
  Text,
  Link,
  AddToCartButton,
  Button,
} from '~/components';
import {getExcerpt} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

export const headers = routeHeaders;

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, request, context}) {
  const {productId} = params;
  const completedPid = `gid://shopify/Product/${productId}`
  invariant(productId, 'Missing productId param, check route filename');

  const variants = await context.storefront.query(VARIANTS_QUERY_BY_ID, {
    variables: {
      id: completedPid,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  const selectedOptions = variants.product.variants.nodes[0].selectedOptions;

  const {shop, product} = await context.storefront.query(PRODUCT_QUERY_BY_ID, {
    variables: {
      id: completedPid,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
      selectedOptions,
    },
  });

  // if (!product?.id) {
  //   throw new Response('product', {status: 404});
  // }

  // if (!product.selectedVariant) {
  //   throw redirectToFirstVariant({product, request});
  // }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deferred query resolves, the UI will update.

  const recommended = getRecommendedProducts(context.storefront, product.id);

  // TODO: firstVariant is never used because we will always have a selectedVariant due to redirect
  // Investigate if we can avoid the redirect for product pages with no search params for first variant
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = firstVariant;
  // const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  return defer({
    variants,
    product,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
    seo,
  });
}

/**
 * @param {{
 *   product: ProductQuery['product'];
 *   request: Request;
 * }}
 */
function redirectToFirstVariant({product, request}) {
  const searchParams = new URLSearchParams(new URL(request.url).search);
  const firstVariant = product.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  return redirect(
    `/products/${encodeURIComponent(
      product.handle,
    )}?${searchParams.toString()}`,
    302,
  );
}

/**
 * @type {ActionFunction}
 */
export const action = async ({request, context}) => {
  const formData = await request.formData();
  
};

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, shop, recommended, variants} = useLoaderData();
  const {media, title, vendor, descriptionHtml, selectedVariant} = product;
  const {shippingPolicy, refundPolicy} = shop;

  return (
    <>
      <Section className="px-0 md:px-8 lg:px-12">

        <div className="grid items-start md:gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
          <div className='h-14'></div>
          <ProductGallery
            media={media.nodes}
            className="w-full lg:col-span-2"
          />
          <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
            <section className="flex flex-col w-full max-w-xl py-0 md:mx-auto md:max-w-sm md:px-0">
              {/* 商品标题区域 */}
              <div className="grid gap-1 px-4 bg-white mb-2">
                <div className='title-area pt-4 pb-4 '>
                  <div className='current-price text-xl font-medium'>{(selectedVariant.price.currencyCode === 'USD' ? '$' : '') + selectedVariant.price.amount || ''}</div>
                  <div className='original-price text-sm text-gray-400 line-through mb-1'>{(selectedVariant.compareAtPrice.currencyCode === 'USD' ? '$' : '') + selectedVariant.compareAtPrice.amount || ''}</div>
                  <h3 className="font-bold text-base font-medium">{title}</h3>
                </div>
              </div>

              {/* 商品选项区域 */}
              <div className='product-options-box px-4 bg-white flex flex-row justify-between items-center h-12 mb-2'>
                <div className='options-box-left text-base font-medium'>Select options</div>
                <div className='options-box-right flex flex-row justify-between items-center'>
                  <div className='opt-box-right-text text-base text-gray-400'>Select</div>
                  <Right className='opt-box-right-icon' theme="outline" size="20" fill="#94a3b8"/>
                </div>
              </div>

              {/* 邮费区域 */}
              <div className='product-options-box px-4 bg-white flex flex-row justify-between items-center h-12 mb-2'>
                <div className='options-box-left text-base font-medium'>Shipping</div>
                <div className='options-box-right flex flex-row justify-between items-center'>
                  <div className='opt-box-right-text text-base text-gray-400'>$5.55</div>
                  <Right className='opt-box-right-icon' theme="outline" size="20" fill="#94a3b8"/>
                </div>
              </div>

              {/* 产品详情 */}
              <div className='product-detail-box bg-white mb-2'>
                <div className='product-options-box px-4 bg-white flex flex-row justify-between items-center h-12 mb-2'>
                  <div className='options-box-left text-base font-medium'>Specifications</div>
                  <div className='options-box-right flex flex-row justify-between items-center'>
                      <Right className='opt-box-right-icon' theme="outline" size="20" fill="#94a3b8"/>
                  </div>
                </div>
                <div className='divide-line bg-white px-4 mb-4'>
                  <div className='h-px bg-gray-200'></div>
                </div>
                <div className='product-detail px-4 flex flex-row justify-between items-center mb-3'>
                  <div className='product-detail-box-text flex text-sm text-gray-400 font-normal'>About this product</div>
                </div>

                {/* 产品详情描述区域 */}
                <div className='text-img-area px-4 py-4 text-sm '>
                  <div dangerouslySetInnerHTML={{__html: descriptionHtml}}/>
                </div>
              </div>


              {/* <Suspense fallback={<ProductForm variants={[]} />}> */}
                {/* <Await
                  errorElement="There was a problem loading related products"
                  resolve={variants}
                >
                  {(resp) => (
                    <ProductForm
                      variants={resp.product?.variants.nodes || []}
                    />
                  )}
                </Await> */}
              {/* </Suspense> */}
              {/* <div className="h-[1px] bg-primary/10 w-full"></div> */}
              {/* <div
                className="prose dark:prose-invert -mt-6 text-sm"
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
              /> */}
              {/* <div className="grid gap-4 py-4">
                {shippingPolicy?.body && (
                  <ProductDetail
                    title="Shipping"
                    content={getExcerpt(shippingPolicy.body)}
                    learnMore={`/policies/${shippingPolicy.handle}`}
                  />
                )}
                {refundPolicy?.body && (
                  <ProductDetail
                    title="Returns"
                    content={getExcerpt(refundPolicy.body)}
                    learnMore={`/policies/${refundPolicy.handle}`}
                  />
                )}
              </div> */}
            </section>
          </div>
        </div>
      </Section>
      <Suspense fallback={<Skeleton className="h-32" />}>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(products) => (
            <ProductSwimlane title="Related Products" products={products} />
          )}
        </Await>
      </Suspense>
    </>
  );
}

/**
 * @param {{
 *   variants: ProductVariantFragmentFragment[];
 * }}
 */
export function ProductForm({variants}) {
  /** @type {LoaderReturnData} */
  const {product, analytics, storeDomain} = useLoaderData();

  const closeRef = useRef(null);

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant;

  const isOutOfStock = !selectedVariant?.availableForSale;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  const productAnalytics = {
    ...analytics.products[0],
    quantity: 1,
  };

  return (
    <div className="grid gap-10">
      <div className="grid gap-4">
        <VariantSelector
          handle={product.handle}
          options={product.options}
          variants={variants}
        >
          {({option}) => {
            return (
              <div
                key={option.name}
                className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0"
              >
                <Heading as="legend" size="lead" className="min-w-[4rem]">
                  {option.name}
                </Heading>
                <div className="flex flex-wrap items-baseline gap-4">
                  {option.values.length > 7 ? (
                    <div className="relative w-full">
                      <Listbox>
                        {({open}) => (
                          <>
                            <Listbox.Button
                              ref={closeRef}
                              className={clsx(
                                'flex items-center justify-between w-full py-3 px-4 border border-primary',
                                open
                                  ? 'rounded-b md:rounded-t md:rounded-b-none'
                                  : 'rounded',
                              )}
                            >
                              <span>{option.value}</span>
                              <IconCaret direction={open ? 'up' : 'down'} />
                            </Listbox.Button>
                            <Listbox.Options
                              className={clsx(
                                'border-primary bg-contrast absolute bottom-12 z-30 grid h-48 w-full overflow-y-scroll rounded-t border px-2 py-2 transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b',
                                open ? 'max-h-48' : 'max-h-0',
                              )}
                            >
                              {option.values
                                .filter((value) => value.isAvailable)
                                .map(({value, to, isActive}) => (
                                  <Listbox.Option
                                    key={`option-${option.name}-${value}`}
                                    value={value}
                                  >
                                    {({active}) => (
                                      <Link
                                        to={to}
                                        className={clsx(
                                          'text-primary w-full p-2 transition rounded flex justify-start items-center text-left cursor-pointer',
                                          active && 'bg-primary/10',
                                        )}
                                        onClick={() => {
                                          if (!closeRef?.current) return;
                                          closeRef.current.click();
                                        }}
                                      >
                                        {value}
                                        {isActive && (
                                          <span className="ml-2">
                                            <IconCheck />
                                          </span>
                                        )}
                                      </Link>
                                    )}
                                  </Listbox.Option>
                                ))}
                            </Listbox.Options>
                          </>
                        )}
                      </Listbox>
                    </div>
                  ) : (
                    option.values.map(({value, isAvailable, isActive, to}) => (
                      <Link
                        key={option.name + value}
                        to={to}
                        preventScrollReset
                        prefetch="intent"
                        replace
                        className={clsx(
                          'leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200',
                          isActive
                            ? 'border-primary/50 text-[#EE1D52] border-[#EE1D52]'
                            : 'border-primary/0',
                          isAvailable ? 'opacity-100' : 'opacity-50',
                        )}
                      >
                        {value}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          }}
        </VariantSelector>
        {selectedVariant && (
          <div className="grid items-stretch gap-4">
            {isOutOfStock ? (
              <Button variant="secondary" disabled>
                <Text>Sold out</Text>
              </Button>
            ) : (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                  },
                ]}
                className="bg-[#EE1D52] text-white py-2 rounded font-bold"
                variant="primary"
                data-test="add-to-cart"
                analytics={{
                  products: [productAnalytics],
                  totalValue: parseFloat(productAnalytics.price),
                }}
              >
                <Text
                  as="span"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Add to Cart</span> <span>·</span>{' '}
                  <Money
                    withoutTrailingZeros
                    data={selectedVariant?.price}
                    as="span"
                  />
                  {isOnSale && (
                    <Money
                      withoutTrailingZeros
                      data={selectedVariant?.compareAtPrice}
                      as="span"
                      className="opacity-50 strike"
                    />
                  )}
                </Text>
              </AddToCartButton>
            )}
            <button
              className="bg-primary text-contrast rounded py-2 px-4 focus:shadow-outline block w-full"
              onClick={() => {
                window.location.href = `/checkout/${selectedVariant?.id.split('/')[4]}`;
              }}
            >
              Checkout
            </button>
            {!isOutOfStock && (
              <ShopPayButton
                width="100%"
                variantIds={[selectedVariant?.id]}
                storeDomain={storeDomain}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   title: string;
 *   content: string;
 *   learnMore?: string;
 * }}
 */
function ProductDetail({title, content, learnMore}) {
  return (
    <Disclosure key={title} as="div" className="grid w-full gap-2">
      {({open}) => (
        <>
          <Disclosure.Button className="text-left">
            <div className="flex justify-between">
              <Text size="lead" as="h4">
                {title}
              </Text>
              <IconClose
                className={clsx(
                  'transition-transform transform-gpu duration-200',
                  !open && 'rotate-[45deg]',
                )}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className={'pb-4 pt-2 grid gap-2'}>
            <div
              className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{__html: content}}
            />
            {learnMore && (
              <div className="">
                <Link
                  className="pb-px border-b border-primary/30 text-primary/50"
                  to={learnMore}
                >
                  Learn more
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY_BY_ID = `#graphql
query Product(
  $id: ID!,
  $country: CountryCode
  $language: LanguageCode
  $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(id: $id) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFragment
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`;

// 备份信息
// const PRODUCT_QUERY = `#graphql
// query Product(
//   $country: CountryCode
//   $language: LanguageCode
//   $handle: String!
//   $selectedOptions: [SelectedOptionInput!]!
//   ) @inContext(country: $country, language: $language) {
//     product(handle: $handle) {
//       id
//       title
//       vendor
//       handle
//       descriptionHtml
//       description
//       options {
//         name
//         values
//       }
//       selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
//         ...ProductVariantFragment
//       }
//       media(first: 7) {
//         nodes {
//           ...Media
//         }
//       }
//       variants(first: 1) {
//         nodes {
//           ...ProductVariantFragment
//         }
//       }
//       seo {
//         description
//         title
//       }
//     }
//     shop {
//       name
//       primaryDomain {
//         url
//       }
//       shippingPolicy {
//         body
//         handle
//       }
//       refundPolicy {
//         body
//         handle
//       }
//     }
//   }
//   ${MEDIA_FRAGMENT}
//   ${PRODUCT_VARIANT_FRAGMENT}
// `;

// const VARIANTS_QUERY = `#graphql
//   query variants(
//     $country: CountryCode
//     $language: LanguageCode
//     $handle: String!
//   ) @inContext(country: $country, language: $language) {
//     product(handle: $handle) {
//       variants(first: 250) {
//         nodes {
//           ...ProductVariantFragment
//         }
//       }
//     }
//   }
//   ${PRODUCT_VARIANT_FRAGMENT}
// `;

const VARIANTS_QUERY_BY_ID = `#graphql
  query variants(
    $country: CountryCode
    $language: LanguageCode
    $id: ID!
  ) @inContext(country: $country, language: $language) {
    product(id: $id) {
      variants(first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

/**
 * @param {Storefront} storefront
 * @param {string} productId
 */
async function getRecommendedProducts(storefront, productId) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}

/** @typedef {import('@shopify/remix-oxygen').ActionFunction} ActionFunction */
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/hydrogen').ShopifyAnalyticsProduct} ShopifyAnalyticsProduct */
/** @typedef {import('storefrontapi.generated').ProductQuery} ProductQuery */
/** @typedef {import('storefrontapi.generated').ProductVariantFragmentFragment} ProductVariantFragmentFragment */
/** @typedef {import('~/lib/type').Storefront} Storefront */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
