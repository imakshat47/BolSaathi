

// import React, { useState, useRef, useEffect } from "react";
// import { useSpeechRecognition } from "react-speech-kit";
// import { gsap } from "gsap";

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);
//   const chatRef = useRef(null);      // Grey block
//   const inputRef = useRef(null);     // Input and buttons

//   const { listen, stop, listening } = useSpeechRecognition({
//     onResult: (result) => {
//       setInput(result);
//     },
//   });

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMsg = { from: "user", text: input };
//     setMessages((msgs) => [...msgs, userMsg]);
//     setInput("");

//     try {
//       const headers = {
//         "Content-Type": "application/json",
//       };

//       const form_data = {
//         session_id: "john1",
//         user_input: input,
//       };

//       const res = await fetch("http://localhost:8000/query", {
//         method: "POST",
//         headers,
//         body: JSON.stringify(form_data),
//       });

//       const data = await res.json();
//       const botReply = data.data.details || "Sorry, no details found.";

//       setMessages((msgs) => [...msgs, { from: "bot", text: botReply }]);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setMessages((msgs) => [
//         ...msgs,
//         { from: "bot", text: "Error contacting the server." },
//       ]);
//     }
//   };

//   const toggleListening = () => {
//     listening ? stop() : listen({ interim: false });
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // GSAP animation on load
//   useEffect(() => {
//     gsap.fromTo(
//       chatRef.current,
//       { x: -100, opacity: 0 },
//       { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
//     );

//     gsap.fromTo(
//       inputRef.current,
//       { x: 100, opacity: 0 },
//       { x: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
//     );
//   }, []);

//   return (
//     <div className="flex flex-col h-screen p-4 bg-gray-200">
//       <h2 className="text-2xl font-bold mb-4">Chat with Bol Saathi</h2>

//       <div
//         ref={chatRef}
//         className="flex-grow border p-4 overflow-y-auto mb-4 bg-[#ECECEC] rounded shadow-sm opacity-100"
//       >
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`mb-2 ${msg.from === "user" ? "text-right" : "text-left"}`}
//           >
//             <span
//               className={`inline-block px-4 py-2 rounded-lg ${
//                 msg.from === "user"
//                   ? "bg-white text-blue-800"
//                   : "bg-white text-gray-800 border"
//               }`}
//             >
//               {msg.text}
//             </span>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div
//         ref={inputRef}
//         className="flex items-center gap-2 opacity-100"
//       >
//         <input
//           className="border p-2 rounded w-full"
//           placeholder="Ask something..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={toggleListening}
//           className={`px-4 py-2 rounded text-white ${
//             listening ? "bg-red-600" : "bg-green-600"
//           }`}
//         >
//           {listening ? "Stop" : "🎤"}
//         </button>
//         <button
//           onClick={handleSend}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
import React, { useState, useRef, useEffect } from "react";
import { useSpeechRecognition } from "react-speech-kit";
import { gsap } from "gsap";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);      // Chat area animation
  const inputRef = useRef(null);     // Input bar animation

  const { listen, stop, listening } = useSpeechRecognition({
    onResult: (result) => {
      setInput(result);
    },
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "john1",
          user_input: input,
        }),
      });

      const data = await res.json();
      const botReply = data.data.details || "Sorry, no details found.";
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
    listening ? stop() : listen({ interim: false });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial animations on mount
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

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-200">
      {/* Title OUTSIDE the grey chat block */}
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
        Chat with Bol Saathi
      </h2>

      {/* Chat Box */}
      <div
        ref={chatRef}
        className="flex flex-col flex-grow border p-4 overflow-y-auto mb-4 bg-[#ECECEC] rounded shadow-sm"
      >
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

      {/* Input & Buttons */}
      <div ref={inputRef} className="flex items-center gap-2">
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
