

// import React, { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import LanguageSwitcher from "../components/AIAgentCard";
// import { Link } from "react-router-dom";

// export default function HomePage() {
//   const bolSaathiWords = [
//     "BolSaathi", "बोलसाथी", "બોલસાથી", "বোলসাথী", "போல்சாதி", "బోల్‌సాథి", "ബോൽസാതി", "ಬೋಲ್‌ಸಾಥಿ",
//     "ਪੋਲ ਸਾਥੀ", "بول ساتھی", "ボルサーティ", "볼사티", "博尔萨蒂", "БолСаати", "بُلساثي", "בולסאתי",
//     "بول‌ساتھی", "БолСааті", "ବୋଲସାଥି", "බෝල්සාති", "ບົນສາທີ", "ဗိုလ်စသီ", "បុលសាធី", "BolSathi",
//     "BolSaathi", "ბოლსაათი", "BolSáti", "БолСаат", "بولساتي", "BolSāti", "بولساتھی", "БолСаті",
//     "БолСатый", "ボルサティ",
//   ];

//   const langRef = useRef(null);
//   const paraRef = useRef(null);
//   const btnRef = useRef(null);

//   useEffect(() => {
//     gsap.fromTo(langRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.out" });
//     gsap.fromTo(paraRef.current, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, delay: 0.4 });
//     gsap.fromTo(btnRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.8 });
//   }, []);

//   return (
//     <div className="relative min-h-screen w-full bg-[#ECECEC] overflow-hidden">
      
//       {/* 🌍 BolSaathi Cloud */}
//       <div className="absolute inset-0 z-0 flex flex-wrap items-center justify-center text-center opacity-10 pointer-events-none select-none p-6">
//         {bolSaathiWords.map((text, index) => (
//           <span
//             key={index}
//             className="m-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-700"
//             style={{
//               transform: `rotate(${(index % 3 - 1) * 10}deg) scale(${1 + (index % 4) * 0.1})`,
//               fontFamily: "sans-serif",
//             }}
//           >
//             {text}
//           </span>
//         ))}
//       </div>

//       {/* 🌐 Foreground Content */}
//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center">
        
//         <div ref={langRef} className="w-full max-w-[90%] sm:max-w-md md:max-w-lg">
//           <LanguageSwitcher />
//         </div>

//         <p
//           ref={paraRef}
//           className="mt-6 text-base sm:text-lg md:text-xl lg:text-xl text-gray-700 dark:text-gray-300 max-w-[90%] sm:max-w-md md:max-w-lg"
//         >
//           Your multilingual AI assistant for welfare schemes.
//         </p>

//         <Link
//           ref={btnRef}
//           to="/greet"
//           onClick={() => speechSynthesis.cancel()}
//           className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition duration-300"
//         >
//           Get Started
//         </Link>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import LanguageSwitcher from "../components/AIAgentCard";
import { Link } from "react-router-dom";

export default function HomePage() {
  const bolSaathiWords = [
    "BolSaathi", "बोलसाथी", "બોલસાથી", "বোলসাথী", "போல்சாதி", "బోల్‌సాథి", "ബോൽസാതി", "ಬೋಲ್‌ಸಾಥಿ",
    "ਪੋਲ ਸਾਥੀ", "بول ساتھی", "ボルサーティ", "볼사티", "博尔萨蒂", "БолСаати", "بُلساثي", "בולסאתי",
    "بول‌ساتھی", "БолСааті", "ବୋଲସାଥି", "බෝල්සාති", "ບົນສາທີ", "ဗိုလ်စသီ", "បុលសាធី", "BolSathi",
    "BolSaathi", "ბოლსაათი", "BolSáti", "БолСаат", "بولساتي", "BolSāti", "بولساتھی", "БолСаті",
    "БолСатый", "ボルサティ",
  ];

  const langRef = useRef(null);
  const paraRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(langRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.out" });
    gsap.fromTo(paraRef.current, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, delay: 0.4 });
    gsap.fromTo(btnRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.8 });
  }, []);

  return (
    <div className="relative w-full bg-[#ECECEC] overflow-hidden min-h-[80vh] sm:min-h-screen">
      {/* 🌍 Word Cloud */}
      <div className="absolute inset-0 z-0 flex flex-wrap items-center justify-center text-center opacity-10 pointer-events-none select-none p-4 sm:p-6">
        {bolSaathiWords.map((text, index) => (
          <span
            key={index}
            className="m-1 text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700"
            style={{
              transform: `rotate(${(index % 3 - 1) * 10}deg) scale(${1 + (index % 4) * 0.1})`,
              fontFamily: "sans-serif",
            }}
          >
            {text}
          </span>
        ))}
      </div>

      {/* 🌐 Foreground */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 sm:py-12 text-center min-h-[80vh] sm:min-h-screen">
        <div ref={langRef} className="w-full max-w-[90%] sm:max-w-md md:max-w-lg">
          <LanguageSwitcher />
        </div>

        <p
          ref={paraRef}
          className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-[90%] sm:max-w-md md:max-w-lg"
        >
          Your multilingual AI assistant for welfare schemes.
        </p>

        <Link
          ref={btnRef}
          to="/greet"
          onClick={() => speechSynthesis.cancel()}
          className="mt-5 sm:mt-6 px-5 py-2.5 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition duration-300 text-sm sm:text-base"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
