const NextImage = jest
  .fn()
  .mockImplementation(({ alt, objectPosition, layout }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      data-objectposition={objectPosition}
      data-layout={layout}
      snapshotnote="NextImage"
    />
  ));

export default NextImage;
