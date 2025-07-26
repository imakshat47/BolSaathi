import React, { useState, useRef } from "react";

const MicButton = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // you can update this dynamically
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const speech = Array.from(event.results)
        .map((res) => res[0].transcript)
        .join("");
      setTranscript(speech);
      if (event.results[0].isFinal && onResult) {
        onResult(speech); // send final speech to parent
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={toggleMic}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition ${
          isListening ? "bg-red-500" : "bg-blue-600"
        } text-white text-xl`}
      >
        {isListening ? "🛑" : "🎤"}
      </button>
      {transcript && (
        <p className="text-sm text-gray-700 max-w-xs text-center">
          {transcript}
        </p>
      )}
    </div>
  );
};

export default MicButton;
