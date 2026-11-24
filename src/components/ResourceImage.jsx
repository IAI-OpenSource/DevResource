import { useEffect, useRef, useState } from 'react';
import styles from './ResourceImage.module.css';

/**
 * Logo tile. Shows a soft placeholder while loading and a lettered tile if
 * the image URL is broken, so a bad `imageUrl` never leaves a hole in the UI.
 */
function Logo({ src, name, size }) {
  const [status, setStatus] = useState('loading'); // loading | loaded | error
  const imageRef = useRef(null);

  // The image may already be cached/finished before React attaches handlers.
  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete) setStatus(image.naturalWidth > 0 ? 'loaded' : 'error');
  }, []);

  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div
      className={`${styles.tile} ${styles[size]} ${status === 'loading' ? styles.loading : ''}`}
      data-status={status}
    >
      {status === 'error' ? (
        <span className={styles.fallback} aria-hidden="true">
          {initial}
        </span>
      ) : (
        <img
          ref={imageRef}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={status === 'loaded' ? styles.visible : ''}
        />
      )}
    </div>
  );
}

export default function ResourceImage({ src, name, size = 'md' }) {
  // `key` resets the loading state whenever the image URL changes.
  return <Logo key={src} src={src} name={name} size={size} />;
}
