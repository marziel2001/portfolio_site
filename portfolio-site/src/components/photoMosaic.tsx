// import React from "react";
// import im1 from "../staticImages/image1.jpg";
// import im2 from "../staticImages/image2.jpg";
// import im3 from "../staticImages/image3.jpg";

// const photos = [
//   { src: im1, width: 4, height: 3 },
//   { src: im2, width: 3, height: 2 },
//   { src: im3, width: 1, height: 1 },
// ]; classic version to replace with rest calls

const images = import.meta.glob("../assets/staticImages/**/*.{jpg,jpeg,png,webp}", { eager: true });

const imageList = Object.values(images).map((mod) => (mod as { default: string }).default);

const MAX_HEIGHT = 200;

const PhotoMosaic = () => {

  console.log(imageList);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {imageList.map((src, idx) => {
        return (
          <div
            key={idx}
            className="rounded-md shadow-md bg-cover bg-center"
            style={{
              backgroundImage: `url(${src})`,
              width: '200px',
              aspectRatio: '3 / 2',
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default PhotoMosaic;
