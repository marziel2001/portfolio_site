import { useState } from "react";
import galleryImages from "../../public/staticImages/gallery.json";

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

const photos = galleryImages.map((img : any) => ({
  src: img.full, // pełny rozmiar zdjęcia
  width: img.width,
  height: img.height,
}));

const thumbnails = galleryImages.map((img : any) => ({
  src: img.thumb, // miniaturka
  width: img.width,
  height: img.height,
}));

const PhotoMosaic = () => {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <RowsPhotoAlbum
        photos={thumbnails}
        spacing={5}
        targetRowHeight={300}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={photos.map((p : any, i : any) => ({
          src: p.src,
          width: p.width,
          height: p.height,
          // lazy loading — ładuje tylko aktualne zdjęcie i sąsiadujące
          loading: "lazy",
          // miniaturka dla dolnego paska
          thumbnail: thumbnails[i]?.src,
        }))}
        carousel={{
          finite: true,
          preload: 2, // ładuje tylko 2 sąsiednie zdjęcia
        }}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
              />
    </>
  );
};

export default PhotoMosaic;
