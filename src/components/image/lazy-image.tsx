import React from 'react';
import { useInView } from 'react-intersection-observer';

const Image = ({ src, alt, ...rest }: { src: string; alt: string }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return <img ref={ref} {...(inView && src ? { src } : {})} alt={alt} data-type="lazy" {...rest} />;
};

const LazyImage = ({
  src,
  alt = 'hatobox',
  ...rest
}: { src: string; alt: string } & { [key: string]: any }) => {
  return <Image src={src} alt={alt} {...rest} />;
};

export default LazyImage;
