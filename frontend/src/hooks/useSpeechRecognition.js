import { useState, useEffect, useRef } from "react";

export function useSpeechRecognition(onResult) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const spokenRef = useRef(""); // store last detected text

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.warn("❌ Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }

      transcript = transcript.trim();
      spokenRef.current = transcript;

      // If user says “My name is ___”, extract name
      const match = transcript.toLowerCase().match(/my name is\s*(.+)/);
      if (match) {
        const name = match[1].replace(/[0-9]/g, "").trim();
        onResult(name);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onResult]);

  const start = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
      console.log("🎙️ Speech recognition started");
    } catch (err) {
      console.error("Speech recognition start error:", err);
    }
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
    console.log("🛑 Speech recognition stopped");
  };

  const toggleListening = () => {
    if (listening) stop();
    else start();
  };

  return { listening, toggleListening, spokenRef };
}
