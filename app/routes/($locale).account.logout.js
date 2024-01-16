import {redirect} from '@shopify/remix-oxygen';

/**
 * @param {AppLoadContext} context
 */
export async function doLogout(context) {
  const {session} = context;
  session.unset('customerAccessToken');

  // The only file where I have to explicitly type cast i18n to pass typecheck
  return redirect(`${context.storefront.i18n.pathPrefix}/account/login`, {
    headers: {
      'Set-Cookie': await session.commit(),
    },
  });
}

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  return redirect(context.storefront.i18n.pathPrefix);
}

/**
 * @param {ActionFunctionArgs}
 */
export const action = async ({context}) => {
  return doLogout(context);
};

/** @typedef {import('@shopify/remix-oxygen').ActionFunction} ActionFunction */
/** @typedef {import('@shopify/remix-oxygen').AppLoadContext} AppLoadContext */
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
