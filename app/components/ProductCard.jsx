import clsx from 'clsx';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {Text, Link, AddToCartButton, Button} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';

/**
 * @param {{
 *   product: ProductCardFragment;
 *   label?: string;
 *   className?: string;
 *   loading?: HTMLImageElement['loading'];
 *   onClick?: () => void;
 *   quickAdd?: boolean;
 * }}
 */
export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}) {
  let cardLabel;

  const cardProduct = product?.variants ? product : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const {image, price, compareAtPrice} = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price, compareAtPrice)) {
    cardLabel = '';
    // cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = '';
    // cardLabel = 'New';
  }

  const productAnalytics = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  const pidNum = product.id.split('Product/')[1]

  return (
    <div className="flex flex-col w-full gap-2 relative">

      {/* 商品列表卡片 */}
      <Link
        onClick={onClick}
        to={`/products/${pidNum}`}
        prefetch="intent"
      >
        {/* 商品列表的图片 */}
        <div className={clsx('grid', className)}>
          <div className="w-full aspect-square bg-primary/5">
            {image && (
              <div className='w-full aspect-square'>
                <img src={image.url} className=''></img>
              </div>
            )}
          </div>
          {/* 商品列表的名称和价格 */}
          <div className="grid gap-1 mx-4 my-4">
            <Text
              className="w-full overflow-hidden whitespace-nowrap text-wrap line-clamp-3 font-bold text-sm font-medium h-16"
              as="h3"
            >
              {product.title}
            </Text>
            <div className="flex gap-4">
              <Text className="flex gap-2">
                <Money withoutTrailingZeros data={price} className='text-xl font-medium' />
                {isDiscounted(price, compareAtPrice) && (
                  <CompareAtPrice
                    className={'opacity-50 text-sm line-through flex items-center'}
                    data={compareAtPrice}
                  />
                )}
              </Text>
            </div>
          </div>
        </div>
      </Link>


      {quickAdd && firstVariant.availableForSale && (
        <AddToCartButton
          lines={[
            {
              quantity: 1,
              merchandiseId: firstVariant.id,
            },
          ]}
          variant="secondary"
          className="mt-2"
          analytics={{
            products: [productAnalytics],
            totalValue: parseFloat(productAnalytics.price),
          }}
        >
          <Text as="span" className="flex items-center justify-center gap-2">
            Add to Cart
          </Text>
        </AddToCartButton>
      )}


      {quickAdd && !firstVariant.availableForSale && (
        <Button variant="secondary" className="mt-2" disabled>
          <Text as="span" className="flex items-center justify-center gap-2">
            Sold out
          </Text>
        </Button>
      )}
    </div>
  );
}

/**
 * @param {{
 *   data: MoneyV2;
 *   className?: string;
 * }}
 */
function CompareAtPrice({data, className}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx(className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}

/** @typedef {import('@shopify/hydrogen').ShopifyAnalyticsProduct} ShopifyAnalyticsProduct */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Product} Product */
/** @typedef {import('storefrontapi.generated').ProductCardFragment} ProductCardFragment */
