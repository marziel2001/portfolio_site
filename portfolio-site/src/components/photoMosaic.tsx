import { useState, useEffect, useRef } from "react";

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { type GalleryItem } from "../types/galleryItem";


type Props = {
  images: GalleryItem[];
};

export default function PhotoMosaic({ images }: Props) {
  const [index, setIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [maxImageHeight, setMaxImageHeight] = useState('80vh');

  useEffect(() => {
    let mounted = true;
    // hide then show to trigger transition when images change
    setVisible(false);
    const t = window.setTimeout(() => {
      if (mounted) setVisible(true);
    }, 30);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [images]);

  // Calculate max image height based on actual header height and bottom padding
  useEffect(() => {
    const calculateMaxHeight = () => {
      const header = document.querySelector('nav');
      const headerHeight = header ? header.offsetHeight : 80;
      const bottomPadding = 80; // 5em in pixels (approximately)
      const calculatedHeight = window.innerHeight - headerHeight - bottomPadding;
      setMaxImageHeight(`${calculatedHeight}px`);
    };

    calculateMaxHeight();
    window.addEventListener('resize', calculateMaxHeight);
    return () => window.removeEventListener('resize', calculateMaxHeight);
  }, []);

  if (!images || !images.length) return null;

  const thumbs = images.map((img) => ({
    src: img.thumb,
    width: img.width,
    height: img.height,
    // blurDataURL: img.lqip,
  }));

  const fullPhotos = images.map((img) => ({
    src: img.full,
    width: img.width,
    height: img.height,
    placeholder: img.lqip,
  }));

  // For small galleries (1-3 images), constrain size to prevent oversized display
  const isSmallGallery = images.length <= 3;
  const containerMaxWidth = isSmallGallery ? '1200px' : '100%';

  return (
    <>
      <div 
        ref={containerRef} 
        className={`photo-mosaic ${visible ? "visible" : ""}`}
        style={{ 
          maxWidth: containerMaxWidth,
          margin: isSmallGallery ? '0 auto' : '0'
        }}
      >
        <style>{`
          .photo-mosaic img {
            max-height: ${isSmallGallery ? maxImageHeight : 'none'} !important;
            width: auto !important;
          }
        `}</style>
        <RowsPhotoAlbum
          photos={thumbs}
          spacing={5}
          targetRowHeight={200}
          onClick={({ index }) => setIndex(index)}
        />
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={fullPhotos}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        carousel={{ preload: 2 }}
      />
    </>
  );
}
