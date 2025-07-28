// import React, { useEffect, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { LanguageContext } from "../contexts/LanguageContext";
// import { useSpeechRecognition } from "react-speech-kit";

// const GreetingPage = () => {
//   const navigate = useNavigate();
//   const { changeLanguage } = useContext(LanguageContext);
//   const [userInput, setUserInput] = useState("");
//   const [showSubmit, setShowSubmit] = useState(true);
//   const [listening, setListening] = useState(false);
//   const [hasSpokenOnClick, setHasSpokenOnClick] = useState(false);


  
//   const { listen, stop, listening: isListening, supported } = useSpeechRecognition({
//     onResult: (result) => {
//       setUserInput(result);
//       setShowSubmit(result.trim().length > 0);
//     },
//   });

//   const speakGreeting = () => {
//     const utterance = new SpeechSynthesisUtterance(
//       "Hello! Welcome to Bol Saathi. Let me detect your language."
//     );
//     utterance.lang = "en-IN";
//     speechSynthesis.cancel();
//     speechSynthesis.speak(utterance);
//   };

//   useEffect(() => {
//     const hasSpoken = sessionStorage.getItem("greetingSpoken");

//     if (!hasSpoken) {
//       if (speechSynthesis.getVoices().length === 0) {
//         speechSynthesis.onvoiceschanged = () => {
//           speakGreeting();
//           sessionStorage.setItem("greetingSpoken", "true");
//         };
//       } else {
//         speakGreeting();
//         sessionStorage.setItem("greetingSpoken", "true");
//       }
//     }

//     const timer = setTimeout(() => {
//       const browserLang = navigator.language || "en";
//       const langCode = browserLang.slice(0, 2);
//       changeLanguage(langCode);
//     }, 4000);

//     return () => clearTimeout(timer);
//   }, [changeLanguage]);

//   const extractUserInfo = (text) => {
//     const nameMatch = text.match(/I(?:'m| am)\s+([A-Za-z]+)/i);
//     const genderMatch = text.match(/\b(male|female|other)\b/i);
//     const ageMatch = text.match(/(\d{1,3})\s*(years old|yr old|y\/o|yrs old)?/i);
//     const professionMatch = text.match(/working at ([\w\s&]+)/i);
//     const placeMatch = text.match(/living in ([\w\s&]+)/i);

//     return {
//       name: nameMatch ? nameMatch[1] : "",
//       gender: genderMatch ? genderMatch[1] : "",
//       age: ageMatch ? ageMatch[1] : "",
//       profession: professionMatch ? professionMatch[1].trim() : "",
//       place: placeMatch ? placeMatch[1].trim() : "",
//       otherDetails: text,
//     };
//   };

//   const handleSubmit = () => {
//     const userData = extractUserInfo(userInput);
//     navigate("/userinfo", { state: userData });
//   };

//   const handleListenClick = () => {
//     if (isListening) {
//       stop();
//       setListening(false);
//     } else {
//       listen({ lang: "en-IN" });
//       setListening(true);
//     }
//   };

//   const handleScreenClick = () => {
//     if (!hasSpokenOnClick) {
//       speakGreeting();
//       setHasSpokenOnClick(true);
//     }
//   };

//   return (
//     <div
//       className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 space-y-6"
//       onClick={handleScreenClick}
//     >
//       <img
//         src="https://png.pngtree.com/thumb_back/fh260/background/20220617/pngtree-decent-green-water-color-background-image_1413931.jpg"
//         alt="Background"
//         className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
//       />

//       <div className="relative z-10 bg-white/70 p-10 rounded-xl shadow-lg w-full max-w-xl">
//         <h2 className="text-4xl font-semibold mb-4">Greeting you...</h2>
//         <p className="text-gray-700 dark:text-gray-300 text-xl mb-6">
//           Say or type something like: I'm Ramesh, male, 24 years old, working at DBHN company, living in Mumbai...
//         </p>

//         <textarea
//           value={userInput}
//           onChange={(e) => {
//             setUserInput(e.target.value);
//             setShowSubmit(e.target.value.trim().length > 0);
//           }}
//           placeholder=""
//           className="w-full h-32 p-4 border border-gray-300 rounded-lg text-lg"
//         />

//         {supported && (
//           <button
//             onClick={handleListenClick}
//             className={`mt-4 px-6 py-2 rounded-lg shadow text-white transition ${
//               listening ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
//             }`}
//           >
//             {listening ? "Stop Listening" : "🎙️ Listen"}
//           </button>
//         )}

//         {showSubmit && (
//           <button
//             onClick={handleSubmit}
//             className="mt-4 ml-4 px-6 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
//           >
//             Submit
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GreetingPage;


import React, { useEffect, useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../contexts/LanguageContext";
import { useSpeechRecognition } from "react-speech-kit";
import { gsap } from "gsap";

const GreetingPage = () => {
  const navigate = useNavigate();
  const { changeLanguage } = useContext(LanguageContext);
  const [userInput, setUserInput] = useState("");
  const [showSubmit, setShowSubmit] = useState(true);
  const [listening, setListening] = useState(false);
  const [hasSpokenOnClick, setHasSpokenOnClick] = useState(false);

  const { listen, stop, listening: isListening, supported } = useSpeechRecognition({
    onResult: (result) => {
      setUserInput(result);
      setShowSubmit(result.trim().length > 0);
    },
  });

  const speakGreeting = () => {
    const utterance = new SpeechSynthesisUtterance(
      "Hello! Welcome to Bol Saathi. Let me detect your language."
    );
    utterance.lang = "en-IN";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  // Refs for GSAP
  const cardRef = useRef(null);
  const greetingRef = useRef(null);
  const paraRef = useRef(null);
  const inputRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const hasSpoken = sessionStorage.getItem("greetingSpoken");

    if (!hasSpoken) {
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => {
          speakGreeting();
          sessionStorage.setItem("greetingSpoken", "true");
        };
      } else {
        speakGreeting();
        sessionStorage.setItem("greetingSpoken", "true");
      }
    }

    const timer = setTimeout(() => {
      const browserLang = navigator.language || "en";
      const langCode = browserLang.slice(0, 2);
      changeLanguage(langCode);
    }, 4000);

    return () => clearTimeout(timer);
  }, [changeLanguage]);

  useEffect(() => {
  // Set initial state before animating
  gsap.set([greetingRef.current, paraRef.current, inputRef.current, buttonsRef.current, cardRef.current], {
    opacity: 0,
    y: 40,
  });

  const tl = gsap.timeline();

  tl.to(greetingRef.current, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out",
  })
    .to(paraRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    }, "-=0.5")
    .to(inputRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    }, "-=0.6")
    .to(buttonsRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
    }, "-=0.5")
    .to(cardRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    }, "-=1");
}, []);

  const extractUserInfo = (text) => {
    const nameMatch = text.match(/I(?:'m| am)\s+([A-Za-z]+)/i);
    const genderMatch = text.match(/\b(male|female|other)\b/i);
    const ageMatch = text.match(/(\d{1,3})\s*(years old|yr old|y\/o|yrs old)?/i);
    const professionMatch = text.match(/working at ([\w\s&]+)/i);
    const placeMatch = text.match(/living in ([\w\s&]+)/i);

    return {
      name: nameMatch ? nameMatch[1] : "",
      gender: genderMatch ? genderMatch[1] : "",
      age: ageMatch ? ageMatch[1] : "",
      profession: professionMatch ? professionMatch[1].trim() : "",
      place: placeMatch ? placeMatch[1].trim() : "",
      otherDetails: text,
    };
  };

  const handleSubmit = () => {
    const userData = extractUserInfo(userInput);
    navigate("/userinfo", { state: userData });
  };

  const handleListenClick = () => {
    if (isListening) {
      stop();
      setListening(false);
    } else {
      listen({ lang: "en-IN" });
      setListening(true);
    }
  };

  const handleScreenClick = () => {
    if (!hasSpokenOnClick) {
      speakGreeting();
      setHasSpokenOnClick(true);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 space-y-6"
      onClick={handleScreenClick}
    >
      <img
        src="https://png.pngtree.com/thumb_back/fh260/background/20220617/pngtree-decent-green-water-color-background-image_1413931.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
      />

      <div
        ref={cardRef}
        className="relative z-10 bg-white/70 p-10 rounded-xl shadow-lg w-full max-w-xl opacity-100"
      >
        <h2
          ref={greetingRef}
          className="text-4xl font-semibold mb-4 opacity-100"
        >
          Greeting you...
        </h2>
        <p
          ref={paraRef}
          className="text-gray-700 dark:text-gray-300 text-xl mb-6 opacity-100"
        >
          Say or type something like: I'm Ramesh, male, 24 years old, working at DBHN company, living in Mumbai...
        </p>

        <textarea
          ref={inputRef}
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
            setShowSubmit(e.target.value.trim().length > 0);
          }}
          placeholder=""
          className="w-full h-32 p-4 border border-gray-300 rounded-lg text-lg opacity-100"
        />

        <div ref={buttonsRef} className="flex justify-center mt-4 space-x-4 opacity-100">
          {supported && (
            <button
              onClick={handleListenClick}
              className={`px-6 py-2 rounded-lg shadow text-white transition ${
                listening ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {listening ? "Stop Listening" : "🎙️ Listen"}
            </button>
          )}

          {showSubmit && (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GreetingPage;
