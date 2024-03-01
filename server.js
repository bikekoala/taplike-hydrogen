// Virtual entry point for the app
import * as remixBuild from '@remix-run/dev/server-build';
import {
  createRequestHandler,
  getStorefrontHeaders,
} from '@shopify/remix-oxygen';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
} from '@shopify/hydrogen';

import {HydrogenSession} from '~/lib/session.server';
import {getLocaleFromRequest} from '~/lib/utils';

/**
 * Export a fetch handler in module format.
 */
export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @param {ExecutionContext} executionContext
   */
  async fetch(request, env, executionContext) {
    try {
      /**
       * Open a cache instance in the worker and a custom session instance.
       */
      if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
      }

      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        HydrogenSession.init(request, [env.SESSION_SECRET]),
      ]);

      /**
       * Create Hydrogen's Storefront client.
       */
      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n: getLocaleFromRequest(request),
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
      });

      const cart = createCartHandler({
        storefront,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
      });

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          session,
          waitUntil,
          storefront,
          cart,
          env,
        }),
      });

      const response = await handleRequest(request);

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({request, response, storefront});
      }

      // 将 第三方 API 域名加入到 CSP
      let cspHeader = response.headers.get('Content-Security-Policy');
      if (cspHeader) {
        if (process.env.NODE_ENV === 'development') {
          cspHeader = cspHeader.replaceAll(
            ' ws://127.0.0.1:*',
            ' ws://127.0.0.1:* 10.20.1.10:* https://seller.taplike.com https://*.clarity.ms',
          );
          cspHeader = cspHeader.replaceAll(
            " default-src 'self'",
            " default-src 'self' https://*.clarity.ms https://*.bing.com",
          );
          cspHeader +=
            "; script-src-elem 'self' 'unsafe-inline' https://*.clarity.ms http://localhost:3100";
          cspHeader += "; font-src 'self' data:;";
        } else {
          cspHeader = cspHeader.replaceAll(
            ' https://monorail-edge.shopifysvc.com',
            ' https://monorail-edge.shopifysvc.com https://seller.taplike.com https://tiklike.taplike.com https://*.clarity.ms',
          );
          cspHeader = cspHeader.replaceAll(
            " default-src 'self'",
            " default-src 'self' https://*.clarity.ms https://*.bing.com",
          );
          cspHeader +=
            "; script-src-elem 'self' 'unsafe-inline' https://*.clarity.ms https://cdn.shopify.com";
          cspHeader += "; font-src 'self' data:;";
        }
        response.headers.set('Content-Security-Policy', cspHeader);
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
