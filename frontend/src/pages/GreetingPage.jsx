// 
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../contexts/LanguageContext";

const GreetingPage = () => {
  const navigate = useNavigate();
  const { changeLanguage } = useContext(LanguageContext);

  useEffect(() => {
    const hasSpoken = sessionStorage.getItem("greetingSpoken");

    if (!hasSpoken) {
      const utterance = new SpeechSynthesisUtterance(
        "Hello! Welcome to Bol Saathi. Let me detect your language."
      );
      utterance.lang = "en-IN";
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      sessionStorage.setItem("greetingSpoken", "true");
    }

    setTimeout(() => {
      const browserLang = navigator.language || "en";
      const langCode = browserLang.slice(0, 2);
      changeLanguage(langCode);
      navigate("/signup");
    }, 4000);
  }, [changeLanguage, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center text-center px-4">
      {/* Background Image */}
      <img
        src="https://png.pngtree.com/thumb_back/fh260/background/20220617/pngtree-decent-green-water-color-background-image_1413931.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
      />

      {/* Foreground Content */}
      <div className="relative z-10 bg-white/70 p-10 rounded-xl shadow-lg">
        <h2 className="text-4xl font-semibold mb-4">Greeting you...</h2>
        <p className="text-gray-700 dark:text-gray-300 text-2xl">
          Please wait while we detect your language and get things ready.
        </p>
      </div>
    </div>
  );
};

export default GreetingPage;
