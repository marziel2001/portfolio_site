import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { GalleryItem } from "../types/galleryItem";
import PhotoMosaic from "./photoMosaic";

export default function CategoryGallery() {
  const { category } = useParams<{ category: string }>();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch("/staticImages/gallery.json")
      .then((res) => res.json())
      .then((data: GalleryItem[]) => setGallery(data))
      .catch((err) => console.error("❌ Error loading gallery.json:", err));
  }, []);

const data =
  category === "all" ? gallery : gallery.filter((img) => img.category === category);

  return <PhotoMosaic images={data} />;
}
