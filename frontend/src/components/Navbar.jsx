// import React, { useContext } from "react";
// import { LanguageContext } from "../contexts/LanguageContext";
// import { useTranslation } from "react-i18next";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   const { language, changeLanguage } = useContext(LanguageContext);
//   const { t } = useTranslation();

//   return (
//     <nav
//       className="bg-[#F6F6F6] px-6 flex justify-between items-center border-b border-gray-200 shadow-md"
//       style={{ boxShadow: "0 4px 6px -1px rgb(228, 228, 231)" }} // zinc-200 = #e4e4e7
//     >
//       {/* 🌟 Logo */}
//       <img
//         src="/logo.png"
//         alt="BolSaathi Logo"
//         className="w-32 h-20  object-contain"
//       />
//       <div className="text-xl font-bold text-blue-800"></div>

//       {/* Search Bar */}
//       <input
//         type="text"
//         placeholder={t("🔍 SEARCH HERE") || "Search..."}
//         className="px-3 py-1 rounded border border-gray-300 w-1/3 text-sm hover:p-3"
//       />

//       {/* Navigation Links + Language Selector */}
//       <div className="flex items-center space-x-4">
//         <Link
//           to="/userinfo"
//           className="px-4 py-2 text-blue-700  hover:underline hover:[font-size:20px]  border-1 border-zinc-300 p-1.5 px-2 rounded-xl bg-zinc-100"
//         >
//           User Info
//         </Link>
//         <Link
//           to="/signup"
//           className="text-blue-700 hover:underline hover:[font-size:20px]  border-1 border-zinc-300 p-1.5 px-2 rounded-xl bg-zinc-100"
//         >
//           {t("signup")}
//         </Link>
//         <Link
//           to="/schemes"
//           className="text-blue-700 hover:underline hover:[font-size:20px]  border-1 border-zinc-300 p-1.5 px-2 rounded-xl bg-zinc-100"
//         >
//           {t("schemes")}
//         </Link>
//         {/* <Link to="/faq" className="text-blue-700 hover:underline">
//           {t("faq")}
//         </Link> */}

//         {/* Language Dropdown */}
//         <select
//           value={language}
//           onChange={(e) => changeLanguage(e.target.value)}
//           className="text-sm  px-2 py-2  hover:[font-size:20px]  border-1 border-zinc-300   rounded-xl bg-zinc-100"
//         >
//           <option value="en">English</option>
//           <option value="hi">हिंदी</option>
//           <option value="mr">मराठी</option>
//           <option value="gu">ગુજરાતી</option>
//           <option value="ta">தமிழ்</option>
//         </select>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useContext, useEffect, useRef } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import gsap from "gsap";

const Navbar = () => {
  const { language, changeLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();

  const navbarRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    // Fade in navbar
    gsap.fromTo(
      navbarRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );

    // Animate elements top to bottom with stagger
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
      className="bg-[#F6F6F6] px-6 flex justify-between items-center border-b border-gray-200 shadow-md"
      style={{ boxShadow: "0 4px 6px -1px rgb(228, 228, 231)" }}
    >
      {/* 🌟 Logo */}
      <img
        ref={(el) => (elementsRef.current[0] = el)}
        src="/logo.png"
        alt="BolSaathi Logo"
        className="w-32 h-20 object-contain"
      />

      {/* Search Bar */}
      <input
        ref={(el) => (elementsRef.current[1] = el)}
        type="text"
        placeholder={t("🔍 SEARCH HERE") || "Search..."}
        className="px-3 py-1 rounded border border-gray-300 w-1/3 text-sm hover:p-3"
      />

      {/* Nav Links + Language Selector */}
      <div className="flex items-center space-x-4">
        <Link
          ref={(el) => (elementsRef.current[2] = el)}
          to="/userinfo"
          className="px-4 py-2 text-blue-700 hover:underline hover:[font-size:20px] border-1 border-zinc-300 p-1.5 px-2 rounded-xl bg-zinc-100"
        >
          User Info
        </Link>
        <Link
          ref={(el) => (elementsRef.current[3] = el)}
          to="/signup"
          className="text-blue-700 hover:underline hover:[font-size:20px] border-1 border-zinc-300 p-1.5 px-2 rounded-xl bg-zinc-100"
        >
          {t("signup")}
        </Link>
        <Link
          ref={(el) => (elementsRef.current[4] = el)}
          to="/schemes"
          className="text-blue-700 hover:underline hover:[font-size:20px] border-1 border-zinc-300 p-1.5 px-2 rounded-xl bg-zinc-100"
        >
          {t("schemes")}
        </Link>

        {/* Language Selector */}
        <select
          ref={(el) => (elementsRef.current[5] = el)}
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="text-sm px-2 py-2 hover:[font-size:20px] border-1 border-zinc-300 rounded-xl bg-zinc-100"
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
