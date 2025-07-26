// import React from "react";
// import LanguageSwitcher from "../components/AIAgentCard"; // animated greeting
// import { Link } from "react-router-dom";


// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-[#ECECEC] flex flex-col items-center justify-center py-16 px-4 text-center">
//       <LanguageSwitcher />

//       <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg max-w-xl">
//         {`Your multilingual AI assistant for welfare schemes.`}
//       </p>

//       <Link
//         to="/greet"
//         className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
//       >
//         Get Started
//       </Link>
//     </div>
//   );
// }
import React from "react";
import LanguageSwitcher from "../components/AIAgentCard";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 🌄 Full-page background image */}
      <img
        src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/SNc_bPaMeiw63zp8r/white-seamless-animated-background-loop_rizjvmafux_thumbnail-1080_01.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0 pointer-events-none"
      />

      {/* 🌐 Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center">
        {/* 🔤 Animated Greeting only */}
        <LanguageSwitcher />

        {/* Description */}
        <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg max-w-xl">
          Your multilingual AI assistant for welfare schemes.
        </p>

        {/* Button */}
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
