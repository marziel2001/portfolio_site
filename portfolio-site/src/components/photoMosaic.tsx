import { useEffect, useState } from "react";

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

export default function PhotoMosaic() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    fetch("/staticImages/gallery.json")
      .then((res) => res.json())
      .then((data) => setGallery(data))
      .catch((err) =>
        console.error("❌ Error loading gallery.json:", err)
      );
  }, []);

  if (!gallery.length) return <p>Loading gallery...</p>;

  const thumbnails = gallery.map((img) => ({
    src: img.thumb,
    width: img.width,
    height: img.height,
  }));

  const photos = gallery.map((img) => ({
    src: img.full,
    width: img.width,
    height: img.height,
  }));

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
        slides={photos.map((p, i) => ({
          src: p.src,
          width: p.width,
          height: p.height,
          loading: "lazy",
          thumbnail: thumbnails[i].src,
        }))}
        carousel={{
          finite: true,
          preload: 2,
        }}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </>
  );
}
