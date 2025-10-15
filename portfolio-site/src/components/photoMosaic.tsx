import React from "react";
import im1 from "../staticImages/image1.jpg";
import im2 from "../staticImages/image2.jpg";
import im3 from "../staticImages/image3.jpg";

const photos = [
  { src: im1, width: 4, height: 3 },
  { src: im2, width: 3, height: 2 },
  { src: im3, width: 1, height: 1 },
];

const MAX_HEIGHT = 200;

const PhotoMosaic = () => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {photos.map((photo, idx) => {
        const aspectRatio = photo.width / photo.height;
        const width = MAX_HEIGHT * aspectRatio;
        return (
          <div
            key={idx}
            className="rounded-md shadow-md bg-cover bg-center"
            style={{
              backgroundImage: `url(${photo.src})`,
              width: `${width}px`,
              height: `${MAX_HEIGHT}px`,
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default PhotoMosaic;
