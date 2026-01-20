import { Outlet, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { Menu, X } from "lucide-react";
import PagePadding from "./components/pagePadding";
import "./css/App.css";

type GalleryItem = {
  filename: string;
  category: string;
};

export default function Layout() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const menuWrapperRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // close mobile menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (menuWrapperRef.current && target && !menuWrapperRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isMenuOpen]);

  // extract unique categories from gallery.json
  useEffect(() => {
    fetch("/staticImages/gallery.json")
      .then((res) => res.json())
      .then((data: GalleryItem[]) => {
        const uniqueCategories = Array.from(
          new Set(data.map((img) => img.category))
        );
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error(err));
  }, []);

  const menuItems = (
    <ul className="flex flex-col md:flex-row gap-4 md:gap-8 text-lg text-gray-800 md:text-base">
      <li>
        <Link to="/" className="hover:text-blue-500">
          Home
        </Link>
      </li>
      <li>
        <Link to="/gallery/all" className="hover:text-blue-500">
          All
        </Link>
      </li>
      {categories.map((cat) => (
        <li key={cat}>
          <Link to={`/gallery/${cat}`} className="hover:text-blue-500">
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Link>
        </li>
      ))}
    </ul>
  );

  const logoStyle = {
    // prefer the custom font, but fall back to system UI/sans to avoid cartoonish cursive flash
    fontFamily: '"Italianno", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: isMobile ? "24px" : "48px",
    color: "#333",
  };

  return (
    <>
      <nav className="w-full bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div style={logoStyle} className="font-bold text-blue-600">
            Marcel Zieliński fotografia
          </div>
          {isMobile ? (
            <div className="relative" ref={menuWrapperRef}>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md bg-transparent text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white border shadow-lg p-4 rounded-lg z-50">
                  {menuItems}
                </div>
              )}
            </div>
          ) : (
            <div>{menuItems}</div>
          )}
        </div>
      </nav>
      <PagePadding>
        <Outlet />
      </PagePadding>
    </>
  );
}
