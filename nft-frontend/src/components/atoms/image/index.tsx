import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { mapModifiers } from 'lib/component';
import { Spinner } from 'components/atoms/spinner';

type Modifier = 'small' | 'big';

export interface ImageProps {
  modifiers?: Modifier | Modifier[];
  src: string;
  alt: string;
  style: React.CSSProperties;
  // spinner: {};
}

export const Image: React.FC<ImageProps> = props => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new window.Image();
    img.src = props.src;
    const onLoad = () => {
      setIsLoading(false);
    };
    img.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={mapModifiers('a-image', props.modifiers)}>
      {!isLoading ? <img src={props.src} loading="lazy" style={props.style} alt={props.alt} /> : <Spinner />}
    </div>
  );
};

export default hot(Image);
