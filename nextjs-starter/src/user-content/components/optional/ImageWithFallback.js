'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ImageWithFallback({
  src,
  fallbackSrc = '/user-content/images/dummy_600x400.png',
  alt,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
