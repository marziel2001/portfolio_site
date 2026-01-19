import { useState } from "react";

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

  return (
    <>
      <RowsPhotoAlbum
        photos={thumbs}
        spacing={5}
        targetRowHeight={200}
        onClick={({ index }) => setIndex(index)}
      />

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
