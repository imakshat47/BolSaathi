import React, { useEffect, useRef } from "react";

const phrases = [
  { lang: "en-US", text: "Bol Saathi" },
  { lang: "hi-IN", text: "बोल साथी" },
  { lang: "mr-IN", text: "बोल साथी" },
  { lang: "te-IN", text: "బోల్ సాథి" },
  { lang: "bn-IN", text: "বল সাথী" },
];

export default function SpeakBolSaathi() {
  const indexRef = useRef(0);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const speak = () => {
      const { lang, text } = phrases[indexRef.current];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      synth.speak(utterance);

      indexRef.current = (indexRef.current + 1) % phrases.length;
    };

    // Speak every 3 seconds
    const interval = setInterval(() => {
      speak();
    }, 2800);

    // Initial speak
    speak();

    return () => clearInterval(interval);
  }, []);

  return null; // no visible UI needed unless you want to show "Now speaking: Hindi"
}
