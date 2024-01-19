/**
 * @param {LoaderFunctionArgs}
 */

import { useEffect } from 'react';
import {useLoaderData} from '@remix-run/react';

let webUrl = '';

export async function loader({params, request, context}) {
  const {variantId} = params;
  const CHECKOUT_CREATE = `#graphql
    mutation checkoutCreate {
      checkoutCreate(
        input: {
          lineItems: [
            {variantId: "gid://shopify/ProductVariant/${variantId}", quantity: 1}
          ]
        }
      ) {
        checkout {
          webUrl
        }
      }
    }
    `;

  const {checkoutCreate} = await context.storefront.mutate(CHECKOUT_CREATE);
  webUrl = checkoutCreate.checkout.webUrl;
  return webUrl;
}

function Checkout() {
  const loaderData = useLoaderData(); 

  useEffect(() => {
    if (loaderData.length > 0) {
      window.location.replace(loaderData);
    }
  }, [loaderData]);

  return <div className="px-4 py-2"></div>;
}

export default Checkout;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
