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
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownMax, setDropdownMax] = useState<string>("0px");

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

  // Some routers/builds inject `data-discover` attributes into anchors/forms.
  // Remove them to avoid unexpected DOM attributes affecting styling.
  useEffect(() => {
    const strip = (root: ParentNode = document) => {
      root.querySelectorAll('[data-discover]').forEach((el) => el.removeAttribute('data-discover'));
    };

    // initial strip
    strip(document);

    // observe mutations to remove any future additions
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.addedNodes && r.addedNodes.length) {
          r.addedNodes.forEach((n) => {
            if (n instanceof Element) strip(n);
          });
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

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
    <ul className="flex flex-col md:flex-row gap-4 md:gap-8 text-lg text-gray-800 md:text-base items-center text-center">
      <li className="w-full md:w-auto">
        <Link to="/" className="hover:text-blue-500 block w-full text-center md:inline md:w-auto md:text-left" onClick={() => isMobile && setIsMenuOpen(false)}>
          Home
        </Link>
      </li>
      <li className="w-full md:w-auto">
        <Link to="/gallery/all" className="hover:text-blue-500 block w-full text-center md:inline md:w-auto md:text-left" onClick={() => isMobile && setIsMenuOpen(false)}>
          All
        </Link>
      </li>
      {categories.map((cat) => (
        <li key={cat} className="w-full md:w-auto">
          <Link to={`/gallery/${cat}`} className="hover:text-blue-500 block w-full text-center md:inline md:w-auto md:text-left" onClick={() => isMobile && setIsMenuOpen(false)}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Link>
        </li>
      ))}
    </ul>
  );

  const logoStyle = {
    fontFamily: '"Italianno", cursive',
    fontSize: isMobile ? "24px" : "48px",
    color: "#333",
  };

  // adjust dropdown max-height to content so it doesn't leave empty space
  useEffect(() => {
    const el = dropdownRef.current;
    if (!el) return;
    if (isMenuOpen) {
      // measure content height and set max-height so transition animates to exact size
      const h = el.scrollHeight;
      // add a small buffer to avoid clipping of the last item (margins/pixels)
      setDropdownMax(`${h + 16}px`);
    } else {
      setDropdownMax("0px");
    }
  }, [isMenuOpen, categories]);

  // keep measurement up-to-date on window resize when open
  useEffect(() => {
    if (!isMenuOpen) return;
    const onResize = () => {
      const el = dropdownRef.current;
      if (!el) return;
      setDropdownMax(`${el.scrollHeight + 8}px`);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMenuOpen]);

  return (
    <>
      <div ref={menuWrapperRef} className="w-full sticky top-0 z-50">
        <nav className="w-full bg-white shadow-md p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div style={logoStyle} className="site-logo font-bold text-blue-600">
              Marcel Zieliński fotografia
            </div>
            {isMobile ? (
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-md bg-transparent text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            ) : (
              <div>{menuItems}</div>
            )}
          </div>
        </nav>

        {/* Dropdown placed after nav so it is outside nav padding and pushes content down */}
        <div
          ref={dropdownRef}
          className="mobile-dropdown bg-white border-t shadow-lg z-50"
          style={{
            maxHeight: dropdownMax,
            opacity: isMenuOpen ? 1 : 0,
            padding: isMenuOpen ? "1rem" : "0px",
            borderTopWidth: isMenuOpen ? undefined : 0,
          }}
        >
          {menuItems}
        </div>
      </div>

      <PagePadding>
        <Outlet />
      </PagePadding>
    </>
  );
}
