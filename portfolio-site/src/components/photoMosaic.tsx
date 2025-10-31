import galleryImages from "../../public/staticImages/gallery.json";

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

const photos = galleryImages.map((img) => ({
  src: `/staticImages/${img.filename}`,
  width: img.width,
  height: img.height,
}));

const Gallery = () => <RowsPhotoAlbum spacing={5} photos={photos} targetRowHeight={300} />;

const MAX_HEIGHT = 200;

const PhotoMosaic = () => {

  return (
    Gallery()
  )
};

export default PhotoMosaic;
