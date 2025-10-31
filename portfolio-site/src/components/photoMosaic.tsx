// import React from "react";
// import im1 from "../staticImages/image1.jpg";
// import im2 from "../staticImages/image2.jpg";
// import im3 from "../staticImages/image3.jpg";

import gallery from "../../public/staticImages/gallery.json";

// const photos = [
//   { src: im1, width: 4, height: 3 },
//   { src: im2, width: 3, height: 2 },
//   { src: im3, width: 1, height: 1 },
// ]; classic version to replace with rest calls

// const images = import.meta.glob("../assets/staticImages/**/*.{jpg,jpeg,png,webp}", { eager: true });
// const imageList = Object.values(images).map((mod) => (mod as { default: string }).default);

console.log(gallery);

// const imageList: string[] = await (async () => {
//   try {
//     const res = await fetch("http://localhost:3000/photos", { method: "GET" });
//     if (!res.ok) return ["blad"];
//     const data = await res.json();
//     if (!Array.isArray(data)) return ["blad"];
//     return data
//       .map((item) => {
//         if (typeof item === "string") return item;
//         if (item == null) return "jakis blad";
//         return (item as any).filename ?? (item as any).src ?? (item as any).path ?? "error";
//       })
//       .filter(Boolean);
//   } catch {
//     return [];
//   }
// })();

const MAX_HEIGHT = 200;

const PhotoMosaic = () => {

  return (
    <div className="grid grid-flow-col gap-2">
      {gallery.map((item, idx) => {
        console.log(item.aspectRatio.toPrecision(2));
        return (
          <div
            key={idx}
            className="rounded-md shadow-md bg-cover bg-center"
            style={{
              backgroundImage: `url(staticImages/${item.filename})`,
              width: 'auto',
              height: '200px',
              aspectRatio: item.aspectRatio,
            }}
          >{item.filename}</div>
        );
      })}
    </div>
  );
};

export default PhotoMosaic;
