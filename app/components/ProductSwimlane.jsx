import {ProductCard, Section} from '~/components';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

/**
 * 产品列表
 * @param {ProductSwimlaneProps}
 */
export function ProductSwimlane({
  products = mockProducts,
  count = 12,
  ...props
}) {
  return (
    <Section padding="y" {...props}>
      <div className="flex flex-col hiddenScroll bg-gray-100 px-4 pt-4">
        {products.nodes.map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            className="snap-start w-full bg-white rounded-md overflow-hidden drop-shadow-none mb-4"
          />
        ))}
      </div>
    </Section>
  );
}

/**
 * @typedef {HomepageFeaturedProductsQuery & {
 *   title?: string;
 *   count?: number;
 * }} ProductSwimlaneProps
 */

/** @typedef {import('storefrontapi.generated').HomepageFeaturedProductsQuery} HomepageFeaturedProductsQuery */
