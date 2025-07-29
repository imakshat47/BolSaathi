// src/components/LanguageSwitcher.jsx
import React, { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <div className="mb-4 flex gap-2 items-center">
      <label htmlFor="language" className="text-sm font-medium">🌐 Language:</label>
      <select
        id="language"
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="mr">Marathi</option>
        {/* Add more as needed */}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
