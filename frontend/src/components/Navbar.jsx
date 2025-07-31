

import React, { useContext, useEffect, useRef, useState } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Menu, X } from "lucide-react"; // You can install lucide-react for icons

const Navbar = () => {
  const { language, changeLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();

  const navbarRef = useRef(null);
  const elementsRef = useRef([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );

    gsap.fromTo(
      elementsRef.current,
      { y: -40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.3,
      }
    );
  }, []);

  return (
    <nav
      ref={navbarRef}
      className="bg-[#F6F6F6] px-4 sm:px-6  flex items-center justify-between border-b border-gray-200 shadow-md"
    >
      {/* Logo */}
     <Link to="/">
  <img
    ref={(el) => (elementsRef.current[0] = el)}
    src="/logo.png"
    alt="BolSaathi Logo"
    className="w-28 h-16 sm:w-32 sm:h-20 object-contain cursor-pointer"
  />
</Link>

      {/* Desktop Search Bar */}
      <input
        ref={(el) => (elementsRef.current[1] = el)}
        type="text"
        placeholder={t("🔍 SEARCH HERE") || "Search..."}
        className="hidden md:block px-3 py-1 rounded border border-gray-300 w-1/3 text-sm transition-all duration-300"
      />

      {/* Hamburger for mobile */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <Link
          ref={(el) => (elementsRef.current[2] = el)}
          to="/userinfo"
          className="text-blue-700 hover:underline border border-zinc-300 p-2 rounded-xl bg-zinc-100 text-sm"
        >
          User Info
        </Link>
        <Link
          ref={(el) => (elementsRef.current[3] = el)}
          to="/signup"
          className="text-blue-700 hover:underline border border-zinc-300 p-2 rounded-xl bg-zinc-100 text-sm"
        >
          {t("signup")}
        </Link>
        <Link
          ref={(el) => (elementsRef.current[4] = el)}
          to="/schemes"
          className="text-blue-700 hover:underline border border-zinc-300 p-2 rounded-xl bg-zinc-100 text-sm"
        >
          {t("schemes")}
        </Link>
        <select
          ref={(el) => (elementsRef.current[5] = el)}
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="text-sm px-2 py-2 border border-zinc-300 rounded-xl bg-zinc-100"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
          <option value="gu">ગુજરાતી</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#F6F6F6] flex flex-col items-center gap-4 p-4 border-t md:hidden z-50 opacity-90">
          <input
            type="text"
            placeholder={t("🔍 SEARCH HERE") || "Search..."}
            className="px-3 py-1 rounded border border-gray-300 w-[90%] text-sm"
          />
          <Link
            to="/userinfo"
            className="text-blue-700 hover:underline border border-zinc-300 px-4 py-2 rounded-xl bg-zinc-100 w-[90%] text-center text-sm"
          >
            User Info
          </Link>
          <Link
            to="/signup"
            className="text-blue-700 hover:underline border border-zinc-300 px-4 py-2 rounded-xl bg-zinc-100 w-[90%] text-center text-sm"
          >
            {t("signup")}
          </Link>
          <Link
            to="/schemes"
            className="text-blue-700 hover:underline border border-zinc-300 px-4 py-2 rounded-xl bg-zinc-100 w-[90%] text-center text-sm"
          >
            {t("schemes")}
          </Link>
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="text-sm px-2 py-2 border border-zinc-300 rounded-xl bg-zinc-100 w-[90%]"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="gu">ગુજરાતી</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
