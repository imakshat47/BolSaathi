import React, { useState, useRef, useEffect } from "react";
import { useSpeechRecognition } from "react-speech-kit";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const { listen, stop, listening } = useSpeechRecognition({
    onResult: (result) => {
      setInput(result); // Live transcription
    },
  });

  const toggleListening = () => {
    listening ? stop() : listen({ interim: false });
  };

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMsg = { from: "user", text: input };
  setMessages((msgs) => [...msgs, userMsg]);
  setInput("");

  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();

    const botReply = data?.data?.detials || "Sorry, I couldn't understand that.";

    const botMsg = {
      from: "bot",
      text: botReply,
    };

    setMessages((msgs) => [...msgs, botMsg]);
  } catch (error) {
    console.error("Error:", error);
    setMessages((msgs) => [
      ...msgs,
      { from: "bot", text: "⚠️ Couldn't connect to server. Try again later." },
    ]);
  }
};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-200">
      <h2 className="text-2xl font-bold mb-4">Chat with Bol Saathi</h2>

      <div className="flex-grow border p-4 overflow-y-auto mb-4 bg-[#ECECEC] rounded shadow-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.from === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
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

      <div className="flex items-center gap-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={toggleListening}
          className={`px-4 py-2 rounded text-white ${
            listening ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {listening ? "Stop" : "🎤"}
        </button>
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
