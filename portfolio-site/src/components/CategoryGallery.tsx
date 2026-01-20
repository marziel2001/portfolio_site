import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { GalleryItem } from "../types/galleryItem";
import PhotoMosaic from "./photoMosaic";

export default function CategoryGallery() {
  const { category } = useParams<{ category: string }>();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetch list once
  useEffect(() => {
    let cancelled = false;
    fetch("/staticImages/gallery.json")
      .then((res) => res.json())
      .then((data: GalleryItem[]) => {
        if (!cancelled) setGallery(data);
      })
      .catch((err) => {
        console.error("❌ Error loading gallery.json:", err);
        if (!cancelled) setGallery([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // preload thumbnails for the current category and show loader until done
  useEffect(() => {
    if (!gallery || !gallery.length) return;
    let cancelled = false;
    setIsLoading(true);

    const filtered = category === "all" ? gallery : gallery.filter((img) => img.category === category);
    const urls = filtered.map((i) => i.thumb).filter(Boolean) as string[];

    const preload = (src: string) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(true);
        img.src = src;
      });

    Promise.all(urls.map((u) => preload(u))).then(() => {
      if (!cancelled) setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [gallery, category]);

  const data = category === "all" ? gallery : gallery.filter((img) => img.category === category);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-24">
        <div className="loader" aria-hidden="true">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
        <span className="sr-only">Loading images...</span>
      </div>
    );
  }

  return <PhotoMosaic images={data} />;
}
