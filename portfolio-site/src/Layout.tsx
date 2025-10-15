import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Menu, X } from "lucide-react";
import "./css/App.css";
import PagePadding from "./components/pagePadding";

export default function Layout() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const menuItems = (
    <ul className="flex flex-col md:flex-row gap-4 md:gap-8 text-lg text-gray-800 md:text-base">
      <li>
        <Link to="/" className="hover:text-blue-500">
          Home
        </Link>
      </li>
      <li>
        <Link to="/gallery" className="hover:text-blue-500">
          Gallery
        </Link>
      </li>
      <li>
        <Link to="/contact" className="hover:text-blue-500">
          Contact
        </Link>
      </li>
    </ul>
  );

  const logoStyle = isMobile
    ? {
        fontFamily: '"Italianno", cursive',
        fontSize: "24px",
        color: "#333",
      }
    : {
        fontFamily: '"Italianno", cursive',
        fontSize: "48px",
        color: "#333",
      };

  return (
    <>
      <nav className="w-full bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div style={logoStyle} className="text-xl font-bold text-blue-600">
            Marcel Zielinski fotografia
          </div>
          {isMobile ? (
            <div className="relative">
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
            <div className="">{menuItems}</div>
          )}
        </div>
      </nav>
      <PagePadding>
      <Outlet />
      </PagePadding>
    </>
  );
}
