import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../contexts/LanguageContext";
import { useSpeechRecognition } from "react-speech-kit";

const GreetingPage = () => {
  const navigate = useNavigate();
  const { changeLanguage } = useContext(LanguageContext);
  const [userInput, setUserInput] = useState(
    ""
  );
  const [showSubmit, setShowSubmit] = useState(true);
  const [listening, setListening] = useState(false);

  const { listen, stop, listening: isListening, supported } = useSpeechRecognition({
    onResult: (result) => {
      setUserInput(result);
      setShowSubmit(result.trim().length > 0);
    },
  });

  useEffect(() => {
    const hasSpoken = sessionStorage.getItem("greetingSpoken");

    const speakGreeting = () => {
      const utterance = new SpeechSynthesisUtterance(
        "Hello! Welcome to Bol Saathi. Let me detect your language."
      );
      utterance.lang = "en-IN";
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    };

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

  const handleSubmit = () => {
    navigate("/userinfo");
  };

  const handleListenClick = () => {
    if (isListening) {
      stop();
      setListening(false);
    } else {
      listen({ lang: "en-IN" }); // You can adjust this to the user's preferred language
      setListening(true);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 space-y-6">
      {/* Background Image */}
      <img
        src="https://png.pngtree.com/thumb_back/fh260/background/20220617/pngtree-decent-green-water-color-background-image_1413931.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
      />

      {/* Foreground Content */}
      <div className="relative z-10 bg-white/70 p-10 rounded-xl shadow-lg w-full max-w-xl">
        <h2 className="text-4xl font-semibold mb-4">Greeting you...</h2>
        <p className="text-gray-700 dark:text-gray-300 text-2xl mb-6">
         Say or type something like: I'm Ramesh, male, working at DBHN company...
        </p>

        <textarea
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
            setShowSubmit(e.target.value.trim().length > 0);
          }}
          placeholder=""
          className="w-full h-32 p-4 border border-gray-300 rounded-lg text-lg"
        />

        {/* 🎙️ Listen Button */}
        {supported && (
          <button
            onClick={handleListenClick}
            className={`mt-4 px-6 py-2 rounded-lg shadow text-white transition ${
              listening ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {listening ? "Stop Listening" : "🎙️ Listen"}
          </button>
        )}

        {/* ✅ Submit Button */}
        {showSubmit && (
          <button
            onClick={handleSubmit}
            className="mt-4 ml-4 px-6 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default GreetingPage;
