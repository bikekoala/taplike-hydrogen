import {Image} from '@shopify/hydrogen';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 * @param {{
 *   media: MediaFragment[];
 *   className?: string;
 * }}
 */
export function ProductGallery({media, className}) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`swimlane w-full hiddenScroll p-0 gap-0 ${className}`}
      // className={`swimlane md:grid-flow-row w-full hiddenScroll md:p-0 md:overflow-x-auto md:grid-cols-2 p-0 gap-0 ${className}`}
    >
      {media.map((med, i) => {
        const isFirst = i === 0;
        const isFourth = i === 3;
        const isFullWidth = i % 3 === 0;

        const image =
          med.__typename === 'MediaImage'
            ? {...med.image, altText: med.alt || 'Product image'}
            : null;

        const style = [
          // isFullWidth ? 'md:col-span-2' : 'md:col-span-1',
          isFirst || isFourth ? '' : '',
          'md:w-96 aspect-square snap-center card-image bg-white dark:bg-contrast/10',
        ].join(' ');
        // const style = [
        //   isFullWidth ? 'md:col-span-2' : 'md:col-span-1',
        //   isFirst || isFourth ? '' : 'md:aspect-[4/5]',
        //   'aspect-square snap-center card-image bg-white dark:bg-contrast/10 w-mobileGallery md:w-full',
        // ].join(' ');

        return (
          <div className={style} key={med.id || image?.id}>
            {image && (
              <Image
                loading={i === 0 ? 'eager' : 'lazy'}
                data={image}
                aspectRatio={!isFirst && !isFourth ? '4/5' : undefined}
                sizes={
                  isFirst || isFourth
                    ? '(min-width: 48em) 100vw, 100vw'
                    : '(min-width: 48em) 100vw, 100vw'
                }
                // sizes={
                //   isFirst || isFourth
                //     ? '(min-width: 48em) 60vw, 90vw'
                //     : '(min-width: 48em) 30vw, 90vw'
                // }
                className="object-cover w-full aspect-square fadeIn"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').MediaFragment} MediaFragment */
