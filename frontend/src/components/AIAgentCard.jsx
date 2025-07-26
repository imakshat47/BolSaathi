import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Greetings in 5 languages
const greetings = [
  {
    lang: "en",
    text: "Hello, Bol Saathi!",
    desc: "I’m your voice assistant. I’ll help you register and guide you through government welfare schemes.",
  },
  {
    lang: "hi",
    text: "नमस्ते, बोल साथी!",
    desc: "मैं आपकी वॉयस सहायक हूं। मैं आपको पंजीकरण में मदद करूंगी और सरकारी योजनाओं में मार्गदर्शन करूंगी।",
  },
  {
    lang: "mr",
    text: "नमस्कार, बोल साथीय!",
    desc: "मी तुमची व्हॉइस सहाय्यक आहे. मी तुम्हाला नोंदणी आणि सरकारी योजनांमध्ये मार्गदर्शन करीन.",
  },
  {
    lang: "gu",
    text: "નમસ્તે, બોલ સાથી!",
    desc: "હું તમારી વૉઇસ સહાયિકા છું. હું તમને નોંધણી અને સરકારી યોજનાઓમાં માર્ગદર્શન આપીશ.",
  },
  {
    lang: "ta",
    text: "வணக்கம், போல சாத்தி!",
    desc: "நான் உங்கள் குரல் உதவியாளர். அரசு நலத்திட்டங்களில் உங்களை வழிநடத்த உதவுவேன்.",
  },
];

const AiAgentCard = () => {
  const [index, setIndex] = useState(0);
  const [canSpeak, setCanSpeak] = useState(false);
  const isSpeakingRef = useRef(false); // 🔄 Track if agent is still speaking

  // 🖱️ Enable speech after first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setCanSpeak(true);
      window.removeEventListener("click", handleFirstInteraction);
    };
    window.addEventListener("click", handleFirstInteraction);
    return () => window.removeEventListener("click", handleFirstInteraction);
  }, []);

  // 🎤 Speak greeting and wait till it's done before switching
  useEffect(() => {
    if (!canSpeak) return;

    const { text, desc, lang } = greetings[index];
    const utterance = new SpeechSynthesisUtterance(`${text} ${desc}`);
    utterance.lang = lang;

    isSpeakingRef.current = true;
    speechSynthesis.cancel(); // Stop anything already speaking
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      isSpeakingRef.current = false;

      // ⏱️ After speaking ends, wait 1 second, then move to next
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % greetings.length);
      }, 1000);
    };
  }, [index, canSpeak]);

  // 🔁 Manually trigger first greeting when speech is enabled
  useEffect(() => {
    if (canSpeak && !isSpeakingRef.current) {
      const { text, desc, lang } = greetings[index];
      const utterance = new SpeechSynthesisUtterance(`${text} ${desc}`);
      utterance.lang = lang;

      isSpeakingRef.current = true;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);

      utterance.onend = () => {
        isSpeakingRef.current = false;
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % greetings.length);
        }, 1000);
      };
    }
  }, [canSpeak]);

  // return (
  //   <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-blue-50 rounded-2xl shadow-md">
  //     <motion.div
  //       key={greetings[index].lang}
  //       initial={{ opacity: 0, y: 10 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       exit={{ opacity: 0, y: -10 }}
  //       transition={{ duration: 0.6 }}
  //       className="text-3xl md:text-5xl font-bold text-blue-900 text-center"
  //     >
  //       {greetings[index].text}
  //     </motion.div>

  //     <p className="mt-4 text-gray-700 text-center max-w-md">
  //       {greetings[index].desc}
  //     </p>
  //   </div>
  // );

  return (
  <div className="relative flex flex-col items-center justify-center min-h-[430px] p-6 bg-blue-50 rounded-2xl shadow-md overflow-hidden ">

    {/* 🔽 Bot Image as Background */}
    <img
      src="https://as2.ftcdn.net/v2/jpg/05/44/76/17/1000_F_544761783_bjxavGyfsleqqDPve3PypgczRk00ShVu.jpg"
      alt="Bot background"
      className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0"
    />

    {/* 🔼 Greeting Content (above image) */}
    <div className="relative z-10 text-center flex flex-col items-center justify-center">
      <motion.div
        key={greetings[index].lang}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-bold text-blue-900"
      >
        {greetings[index].text}
      </motion.div>

      <p className="mt-4 text-gray-700 max-w-md">
        {greetings[index].desc}
      </p>
    </div>
  </div>
);

};

export default AiAgentCard;
