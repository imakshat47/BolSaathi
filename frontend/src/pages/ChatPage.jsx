import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const { start, stop, listening } = useSpeechRecognition(setInput);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");

    try {
      const res = await fetch("https://bolsaathi.onrender.com/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "john1",
          user_input: input,
        }),
      });

      const data = await res.json();
      const botReply = data.data?.details || "Sorry, no details found.";
      setMessages((msgs) => [...msgs, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Error contacting the server." },
      ]);
    }
  };

  const toggleListening = () => {
    if (listening) stop();
    else start();
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // GSAP animations
  useEffect(() => {
    gsap.fromTo(
      chatRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
    gsap.fromTo(
      inputRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" }
    );
  }, []);

  // Check for browser support
  const speechSupported =
    "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  if (!speechSupported) {
    return (
      <div className="p-4 text-center text-red-600">
        Sorry, your browser doesn’t support speech recognition.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-h-screen p-3 sm:p-4 bg-gray-200">
      <h2 className="text-lg sm:text-2xl font-bold mb-3 text-center text-gray-700">
        Chat with Bol Saathi
      </h2>

      <div
        ref={chatRef}
        className="flex flex-col flex-grow border p-3 sm:p-4 overflow-y-auto mb-4 bg-[#ECECEC] rounded shadow-sm"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.from === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg text-sm sm:text-base ${
                msg.from === "user"
                  ? "bg-white text-blue-800"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div ref={inputRef} className="flex flex-col sm:flex-row items-stretch gap-2">
        <input
          className="border p-2 rounded w-full text-sm"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <div className="flex gap-2 sm:gap-1">
          <button
            onClick={toggleListening}
            className={`w-full sm:w-auto px-4 py-2 text-sm rounded text-white ${
              listening ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {listening ? "Stop" : "🎤"}
          </button>
          <button
            onClick={handleSend}
            className="w-full sm:w-auto px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
