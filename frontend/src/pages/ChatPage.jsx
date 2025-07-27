import React, { useState, useRef, useEffect } from "react";
import { useSpeechRecognition } from "react-speech-kit";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  const { listen, stop, listening } = useSpeechRecognition({
    onResult: (result) => {
      setInput(result); // Live transcription to input
    },
  });

 const handleSend = async () => {
  if (!input.trim()) return;

  // const userMsg = { from: "user", text: input };

  // // Add user message
  // setMessages((msgs) => [...msgs, userMsg]);
  // setInput("");

  // // Simulated bot response
  // setTimeout(() => {
  //   setMessages((msgs) => [...msgs, { from: "bot", text: "Thanks for your message!" }]);
  // }, 1000);
  const userMsg = { from: "user", text: input };
  setMessages((msgs) => [...msgs, userMsg]);
  setInput("");

  try {
    const headers = {
      "Content-Type": "application/json"
    };

    const form_data = {
      session_id: "john1",   // You can make this dynamic as needed
      user_input: input
    };

    const res = await fetch("http://localhost:8000/query", {
      method: "POST",
      headers,
      body: JSON.stringify(form_data)
    });

    const data = await res.json();    
    const botReply = data.data.details || "Sorry, no details found."; // Ensure this matches backend key
    // console.log(botReply);

    setMessages((msgs) => [...msgs, { from: "bot", text: botReply }]);
  } catch (err) {
    console.error("Fetch error:", err);
    setMessages((msgs) => [...msgs, { from: "bot", text: "Error contacting the server." }]);
  }
};
  const toggleListening = () => {
    listening ? stop() : listen({ interim: false });
  };

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-200">
      <h2 className="text-2xl font-bold mb-4">Chat with Bol Saathi</h2>

      <div className="flex-grow border p-4 overflow-y-auto mb-4 bg-[#ECECEC]  rounded shadow-sm">
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
          {listening ? "Stop" : "🎤 "}
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
