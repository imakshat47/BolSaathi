// // import React from "react";
// // import { useTranslation } from "react-i18next"; // For translations if you're using i18n

// // const schemes = [
// //   {
// //     id: 1,
// //     title: "PM Awas Yojana",
// //     description: "Affordable housing scheme for urban and rural poor in India.",
// //   },
// //   {
// //     id: 2,
// //     title: "Ayushman Bharat",
// //     description:
// //       "Health insurance of ₹5 lakh per family per year for secondary and tertiary care.",
// //   },
// //   {
// //     id: 3,
// //     title: "Kisan Samman Nidhi",
// //     description: "₹6,000 annual income support for small and marginal farmers.",
// //   },
// // ];

// // const DashboardPage = () => {
// //   const { t } = useTranslation(); // Load translation hook

// //   const speakScheme = (scheme) => {
// //     if (speechSynthesis.speaking) {
// //       speechSynthesis.cancel();
// //     }

// //     const utter = new SpeechSynthesisUtterance(
// //       `${scheme.title}: ${scheme.description}`
// //     );
// //     utter.lang = "en-IN";
// //     speechSynthesis.speak(utter);
// //   };

// //   return (
// //     <div className=" bg-[#ECECEC] w-full h-screen">
// //       <h1 className="text-5xl font-bold mb-15 text-center pt-10">
// //         {t("WELFARE SCHEMES")}
// //       </h1>
// //       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// //         {schemes.map((scheme) => (
// //           <div
// //             key={scheme.id}
// //             onClick={() => speakScheme(scheme)}
// //             onKeyDown={(e) => e.key === "Enter" && speakScheme(scheme)}
// //             tabIndex={0}
// //             role="button"
// //             className="border p-4 rounded shadow hover:bg-[#F7F7F7] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           >
// //             <h2 className="text-xl font-semibold mb-2">{scheme.title}</h2>
// //             <p className="text-gray-600">{scheme.description}</p>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardPage;


// import React, { useEffect, useRef } from "react";
// import { useTranslation } from "react-i18next";
// import gsap from "gsap";

// const schemes = [
//   {
//     id: 1,
//     title: "PM Awas Yojana",
//     description: "Affordable housing scheme for urban and rural poor in India.",
//   },
//   {
//     id: 2,
//     title: "Ayushman Bharat",
//     description:
//       "Health insurance of ₹5 lakh per family per year for secondary and tertiary care.",
//   },
//   {
//     id: 3,
//     title: "Kisan Samman Nidhi",
//     description: "₹6,000 annual income support for small and marginal farmers.",
//   },
// ];

// const DashboardPage = () => {
//   const { t } = useTranslation();

//   const pageRef = useRef(null);
//   const headingRef = useRef(null);
//   const cardRefs = useRef([]);

//   useEffect(() => {
//     // Initial page fade-in
//     gsap.fromTo(
//       pageRef.current,
//       { opacity: 0 },
//       { opacity: 1, duration: 1 }
//     );

//     // Heading: top to bottom
//     gsap.fromTo(
//       headingRef.current,
//       { y: -50, opacity: 0 },
//       { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
//     );

//     // Cards: bottom to top staggered
//     gsap.fromTo(
//       cardRefs.current,
//       { y: 50, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.6,
//         stagger: 0.2,
//         delay: 0.5,
//         ease: "power2.out",
//       }
//     );
//   }, []);

//   const speakScheme = (scheme) => {
//     if (speechSynthesis.speaking) {
//       speechSynthesis.cancel();
//     }

//     const utter = new SpeechSynthesisUtterance(
//       `${scheme.title}: ${scheme.description}`
//     );
//     utter.lang = "en-IN";
//     speechSynthesis.speak(utter);
//   };

//   return (
//     <div ref={pageRef} className="bg-[#ECECEC] w-full h-screen px-6 py-10">
//       <h1
//         ref={headingRef}
//         className="text-5xl font-bold text-center mb-12"
//       >
//         {t("WELFARE SCHEMES")}
//       </h1>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {schemes.map((scheme, index) => (
//           <div
//             key={scheme.id}
//             ref={(el) => (cardRefs.current[index] = el)}
//             onClick={() => speakScheme(scheme)}
//             onKeyDown={(e) => e.key === "Enter" && speakScheme(scheme)}
//             tabIndex={0}
//             role="button"
//             className="border p-4 rounded shadow hover:bg-[#F7F7F7] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//           >
//             <h2 className="text-xl font-semibold mb-2">{scheme.title}</h2>
//             <p className="text-gray-600">{scheme.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;


import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";

const schemes = [
  {
    id: 1,
    title: "PM Awas Yojana",
    description: "Affordable housing scheme for urban and rural poor in India.",
  },
  {
    id: 2,
    title: "Ayushman Bharat",
    description:
      "Health insurance of ₹5 lakh per family per year for secondary and tertiary care.",
  },
  {
    id: 3,
    title: "Kisan Samman Nidhi",
    description: "₹6,000 annual income support for small and marginal farmers.",
  },
];

const DashboardPage = () => {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  const headingRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );
    gsap.fromTo(
      headingRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
    );
    gsap.fromTo(
      cardRefs.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        delay: 0.5,
        ease: "power2.out",
      }
    );
  }, []);

  const speakScheme = (scheme) => {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(
      `${scheme.title}: ${scheme.description}`
    );
    utter.lang = "en-IN";
    speechSynthesis.speak(utter);
  };

  return (
    <div
      ref={pageRef}
      className="bg-[#ECECEC] w-full min-h-screen px-4 py-6 sm:px-6 lg:px-12 overflow-auto"
    >
      <h1
        ref={headingRef}
        className="text-2xl sm:text-3xl lg:text-5xl font-bold text-center mb-10 sm:mb-12"
      >
        {t("WELFARE SCHEMES")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {schemes.map((scheme, index) => (
          <div
            key={scheme.id}
            ref={(el) => (cardRefs.current[index] = el)}
            onClick={() => speakScheme(scheme)}
            onKeyDown={(e) => e.key === "Enter" && speakScheme(scheme)}
            tabIndex={0}
            role="button"
            className="bg-white border p-4 sm:p-6 rounded shadow hover:bg-[#F7F7F7] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h2 className=" sm:text-xl text-[15px]  font-semibold mb-2">
              {scheme.title}
            </h2>
            <p className="text-gray-600 text-[12px] sm:text-base">
              {scheme.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
