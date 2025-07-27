import React, { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { language, changeLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();

  return (
    <nav
      className="bg-[#F6F6F6] px-6 flex justify-between items-center border-b border-gray-200 shadow-md"
      style={{ boxShadow: "0 4px 6px -1px rgb(228, 228, 231)" }} // zinc-200 = #e4e4e7
    >
      {/* 🌟 Logo */}
      <img
        src="/logo.png"
        alt="BolSaathi Logo"
        className="w-32 h-20  object-contain"
      />
      <div className="text-xl font-bold text-blue-800"></div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder={t("🔍 SEARCH HERE") || "Search..."}
        className="px-3 py-1 rounded border border-gray-300 w-1/3 text-sm hover:p-3"
      />

      {/* Navigation Links + Language Selector */}
      <div className="flex items-center space-x-4">
        <Link
          to="/userinfo"
          className="px-4 py-2 text-blue-700  hover:underline hover:[font-size:20px]  border-1 border-zinc-300 p-1.5 px-2 rounded-xl bg-zinc-100"
        >
          User Info
        </Link>
        <Link
          to="/signup"
          className="text-blue-700 hover:underline hover:[font-size:20px]  border-1 border-zinc-300 p-1.5 px-2 rounded-xl bg-zinc-100"
        >
          {t("signup")}
        </Link>
        <Link
          to="/schemes"
          className="text-blue-700 hover:underline hover:[font-size:20px]  border-1 border-zinc-300 p-1.5 px-2 rounded-xl bg-zinc-100"
        >
          {t("schemes")}
        </Link>
        {/* <Link to="/faq" className="text-blue-700 hover:underline">
          {t("faq")}
        </Link> */}

        {/* Language Dropdown */}
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="text-sm  px-2 py-2  hover:[font-size:20px]  border-1 border-zinc-300   rounded-xl bg-zinc-100"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
          <option value="gu">ગુજરાતી</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
