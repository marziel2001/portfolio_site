import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { Menu, X, ChevronDown } from "lucide-react";
import PagePadding from "./components/pagePadding";
import "./css/App.css";

type GalleryItem = {
  filename: string;
  category: string;
};

export default function Layout() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMoreOpen, setIsDesktopMoreOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const desktopMoreRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionRef = useRef<number>(0);
  const [headerVisible, setHeaderVisible] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // adjust mobile menu max-height to match content so it naturally grows/shrinks
  useEffect(() => {
    const el = mobileMenuRef.current;
    if (!el) return;
    // when opening, set maxHeight to scrollHeight to allow transition
    if (isMenuOpen) {
      // Store current scroll position before scrolling to menu
      scrollPositionRef.current = window.scrollY;
      el.style.maxHeight = `${el.scrollHeight}px`;
      // Scroll to make menu visible after animation starts
      setTimeout(() => {
        // Scroll so the entire menu is visible
        el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
    } else {
      // when closing, set current height first, then collapse on next frame for smooth animation
      el.style.maxHeight = `${el.scrollHeight}px`;
      requestAnimationFrame(() => {
        el.style.maxHeight = `0px`;
      });
      // Restore scroll position after closing animation
      setTimeout(() => {
        window.scrollTo({ top: scrollPositionRef.current, behavior: 'smooth' });
      }, 100);
    }
  }, [isMenuOpen, categories]);

  // close mobile menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      const clickedMenu = mobileMenuRef.current?.contains(target);
      const clickedButton = menuButtonRef.current?.contains(target);
      if (!clickedMenu && !clickedButton) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isMenuOpen]);

  // close desktop more menu when clicking outside
  useEffect(() => {
    if (!isDesktopMoreOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (desktopMoreRef.current && !desktopMoreRef.current.contains(target)) {
        setIsDesktopMoreOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isDesktopMoreOpen]);

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

  // Reveal header all at once once fonts are ready (or after a short fallback timeout)
  useEffect(() => {
    let mounted = true;
    const reveal = () => mounted && setHeaderVisible(true);
    if ((document as any).fonts && (document as any).fonts.ready) {
      const timeout = setTimeout(reveal, 300);
      (document as any).fonts.ready.then(() => {
        clearTimeout(timeout);
        reveal();
      });
    } else {
      const t = setTimeout(reveal, 80);
      return () => clearTimeout(t);
    }
    return () => { mounted = false };
  }, []);

  // Render mobile menu - shows all categories in vertical layout
  const renderMobileMenu = () => (
    <ul className="flex flex-col gap-4 text-lg text-gray-800 items-center">
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

  // Render desktop menu - shows first 3 categories with "More" dropdown for overflow
  const renderDesktopMenu = () => (
    <ul className="flex flex-row gap-8 text-base text-gray-800 items-center">
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
      {categories.slice(0, 3).map((cat) => (
        <li key={cat}>
          <Link to={`/gallery/${cat}`} className="hover:text-blue-500">
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Link>
        </li>
      ))}
      {categories.length > 3 && (
        <li className="relative">
          <div ref={desktopMoreRef}>
            <button
              onClick={() => setIsDesktopMoreOpen(!isDesktopMoreOpen)}
              className="flex items-center gap-1 hover:text-blue-500 text-gray-800"
            >
              More <ChevronDown size={16} className={`transition-transform ${isDesktopMoreOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDesktopMoreOpen && (
              <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg z-50 min-w-[150px]">
                <ul className="flex flex-col py-2">
                  {categories.slice(3).map((cat) => (
                    <li key={cat}>
                      <Link
                        to={`/gallery/${cat}`}
                        className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-500"
                        onClick={() => setIsDesktopMoreOpen(false)}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </li>
      )}
    </ul>
  );

  const logoStyle = {
    // prefer the custom font, but fall back to system UI/sans to avoid cartoonish cursive flash
    fontFamily: '"Italianno", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: isMobile ? "24px" : "48px",
    color: "#333",
    ...(isMobile && {
      flex: 1,
      textAlign: "center" as const,
      display: "block",
      lineHeight: "0.8",
    }),
  };

  return (
    <>
      <nav className="w-full bg-white shadow-md p-4 sticky top-0 z-50">
        <div className={`header-wrapper ${headerVisible ? "visible" : ""}`}>
          <div>
            <div className="max-w-6xl mx-auto flex justify-between items-center relative">
             {isMobile ? (
              <>
                <div style={logoStyle} className="font-bold text-blue-600 w-full">
                  Marcel Zieliński <br /> fotografia
                </div>
                <button
                  ref={menuButtonRef}
                  onClick={toggleMenu}
                  className="p-2 rounded-md bg-transparent text-gray-700 hover:bg-gray-100 transition-colors absolute right-0"
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </>
             ):(
              <>
                <div style={logoStyle} className="font-bold text-blue-600">
                  Marcel Zieliński fotografia
                </div>
                <div className="flex items-center gap-6">
                  {renderDesktopMenu()}
                </div>
              </>
             )} 
            </div>


          </div>
        </div>
      </nav>
          {/* Mobile menu - placed in document flow under the header so it pushes content down */}
            {isMobile && (
              <div
                ref={mobileMenuRef}
                id="mobile-menu"
                className={`mobile-menu w-full bg-white border-t` + (isMenuOpen ? " open" : "")}
              >
                <div className="max-w-6xl mx-auto p-4">{renderMobileMenu()}</div>
              </div>
            )}
      <PagePadding>
        <Outlet />
      </PagePadding>
    </>
  );
}
