import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { GalleryItem } from "../types/galleryItem";
import PhotoMosaic from "./photoMosaic";

export default function CategoryGallery() {
  const { category } = useParams<{ category: string }>();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [galleryLoaded, setGalleryLoaded] = useState(false);

  // fetch list once
  useEffect(() => {
    let cancelled = false;
    fetch("/staticImages/gallery.json")
      .then((res) => res.json())
      .then((data: GalleryItem[]) => {
        if (!cancelled) {
          setGallery(data);
          setGalleryLoaded(true);
        }
      })
      .catch((err) => {
        console.error("❌ Error loading gallery.json:", err);
        if (!cancelled) {
          setGallery([]);
          setGalleryLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // preload thumbnails for the current category and show loader until done
  useEffect(() => {
    if (!galleryLoaded) return;
    
    let cancelled = false;
    setIsLoading(true);

    const filtered = category === "all" ? gallery : gallery.filter((img) => img.category === category);
    
    // If no images in this category, stop loading immediately
    if (filtered.length === 0) {
      setIsLoading(false);
      return;
    }

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
  }, [galleryLoaded, gallery, category]);

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
