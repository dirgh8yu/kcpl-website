'use client';
import { useState } from 'react';
import { images, stockUrl, type ImageKey } from '@/content/images';

export function ResponsiveImage({ image, className = '', priority = false, caption = 'Illustrative stock photography.' }: { image: ImageKey; className?: string; priority?: boolean; caption?: string }) {
  const photo = images[image];
  const [failed, setFailed] = useState(false);
  return <figure className={`photo ${className}`}>
    <div className="photo-frame">
      {failed ? <div className="photo-fallback"><span>KCPL</span><p>Freight. Customs.<br />Project logistics.</p></div> :
      // Direct responsive stock delivery avoids a server-side third-party fetch.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={stockUrl(photo.id, 1200)} srcSet={[640, 960, 1440, 1920].map(w => `${stockUrl(photo.id, w)} ${w}w`).join(', ')} sizes="(max-width: 767px) 100vw, (max-width: 1100px) 90vw, 65vw" alt={photo.alt} width={1440} height={1000} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" style={{ objectPosition: photo.position }} onError={() => setFailed(true)} />}
    </div>
    <figcaption>{caption} <a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit} / Unsplash<span className="sr-only"> (opens in a new tab)</span></a></figcaption>
  </figure>;
}
