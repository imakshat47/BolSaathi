
// import React from "react";
// import LanguageSwitcher from "../components/AIAgentCard";
// import { Link } from "react-router-dom";

// export default function HomePage() {
//   return (
//     <div className="relative min-h-screen w-full overflow-hidden">
//       {/* 🌄 Full-page background image */}
//       <img
//         src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/SNc_bPaMeiw63zp8r/white-seamless-animated-background-loop_rizjvmafux_thumbnail-1080_01.png"
//         alt="Background"
//         className="absolute inset-0 w-full h-full object-cover opacity-20 z-0 pointer-events-none"
//       />

//       {/* 🌐 Foreground content */}
//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center">
//         {/* 🔤 Animated Greeting only */}
//         <LanguageSwitcher />

//         {/* Description */}
//         <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg max-w-xl">
//           Your multilingual AI assistant for welfare schemes.
//         </p>

//         {/* Button */}
//         <Link
//           to="/greet"
//           className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
//         >
//           Get Started
//         </Link>
//       </div>
//     </div>
//   );
// }

import React from "react";
import LanguageSwitcher from "../components/AIAgentCard";
import { Link } from "react-router-dom";

export default function HomePage() {
  const bolSaathiWords = [
    "BolSaathi",         // English
    "बोलसाथी",           // Hindi
    "બોલસાથી",          // Gujarati
    "বোলসাথী",           // Bengali
    "போல்சாதி",          // Tamil
    "బోల్‌సాథి",         // Telugu
    "ബോൽസാതി",          // Malayalam
    "ಬೋಲ್‌ಸಾಥಿ",         // Kannada
    "ਪੋਲ ਸਾਥੀ",          // Punjabi
    "بول ساتھی",         // Urdu
    "ボルサーティ",       // Japanese
    "볼사티",             // Korean
    "博尔萨蒂",           // Chinese (Simplified)
    "БолСаати",          // Russian
    "بُلساثي",           // Arabic
    "בולסאתי",           // Hebrew
    "بول‌ساتھی",          // Persian
    "БолСааті",          // Ukrainian
    "बोलसाथी",           // Marathi
    "ବୋଲସାଥି",          // Odia
    "බෝල්සාති",         // Sinhala
    "ບົນສາທີ",           // Lao
    "ဗိုလ်စသီ",          // Burmese
    "បុលសាធី",           // Khmer
    "BolSathi",          // Filipino (Phonetic)
    "बोलसाठी",           // Hindi (alt)
    "BolSaathi",         // Swahili (Phonetic)
    "БолСаати",          // Bulgarian
    "ბოლსაათი",           // Georgian
    "BolSáti",           // Vietnamese (Phonetic)
    "BolSaáti",          // Thai (Phonetic)
    "БолСаат",           // Kazakh
    "БолСааті",          // Uzbek (Cyrillic)
    "بولساتي",           // Kurdish
    "BolSaathi",         // Romanian (Phonetic)
    "BolSāti",           // Latvian (Phonetic)
    "بولساتھی",           // Pashto
    "БолСаті",           // Serbian
    "БолСатый",          // Belarusian
    "ボルサティ",         // Japanese (alt)
  ];

  return (
    <div className="relative min-h-screen w-full overflow-scroll bg-[#ECECEC] scrollbar-hide">

      {/* 🌍 Multilingual “BolSaathi” Cloud */}
      <div className="absolute inset-0 z-0 flex flex-wrap items-center justify-center text-center opacity-15 pointer-events-none select-none p-10">
        {bolSaathiWords.map((text, index) => (
          <span
            key={index}
            className="m-4 text-3xl sm:text-4xl font-semibold text-gray-700"
            style={{
              transform: `rotate(${(index % 3 - 1) * 10}deg) scale(${1 + (index % 4) * 0.1})`,
              fontFamily: "sans-serif",
            }}
          >
            {text}
          </span>
        ))}
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center">
        <LanguageSwitcher />

        <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg max-w-xl">
          Your multilingual AI assistant for welfare schemes.
        </p>

        <Link
          to="/greet"
          className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
