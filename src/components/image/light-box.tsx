'use client';

import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';

export default ({
  open,
  onClose,
  slides,
  startIndex,
}: {
  open: boolean;
  onClose?: () => void;
  slides: { src: string; alt?: string }[];
  startIndex?: number;
}) => {
  return (
    <Lightbox
      open={open}
      close={onClose}
      slides={slides}
      index={startIndex}
      plugins={[Zoom, Captions, Thumbnails, Counter]}
      zoom={{
        maxZoomPixelRatio: 5,
        wheelZoomDistanceFactor: 100,
        scrollToZoom: true,
      }}
      carousel={{
        preload: 2,
      }}
    />
  );
};
