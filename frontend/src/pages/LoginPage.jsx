// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSpeechRecognition, useSpeechSynthesis } from "react-speech-kit";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: "", password: "" });

//   const { speak } = useSpeechSynthesis();
//   const spokenRef = useRef(false);

//   const { listen, stop, listening } = useSpeechRecognition({
//     onResult: (speechText) => {
//       const lower = speechText.toLowerCase();
//       const nameMatch = lower.match(/my name is\s*(.+)/);
//       if (nameMatch) {
//         const name = nameMatch[1].replace(/[0-9]/g, "").trim();
//         if (name) {
//           setForm((f) => ({ ...f, name }));
//         }
//       }
//     },
//   });

//   useEffect(() => {
//     if (!spokenRef.current) {
//       speak({
//         text: "Welcome back. Please say 'My name is...' or type your name and password.",
//         lang: "en-IN",
//       });
//       spokenRef.current = true;
//     }
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name || !form.password) {
//       speak({ text: "Both name and password are required.", lang: "en-IN" });
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:8000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           username: form.name,
//           password: form.password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         speak({
//           text: `Welcome ${form.name}, you are logged in successfully.`,
//           lang: "en-IN",
//         });

//         setTimeout(() => {
//           navigate("/chat");
//         }, 4000);
//       } else {
//         speak({
//           text: data?.message || "Login failed. Please check your credentials.",
//           lang: "en-IN",
//         });
//         console.error("❌ Backend Error:", data);
//       }
//     } catch (error) {
//       speak({
//         text:`Welcome ${form.name}, you are logged in successfully.`,
//         lang: "en-IN",
//       });
//       console.error("❌ Network Error:", error);
//     }
//   };

//   const toggleListening = () => {
//     if (listening) stop();
//     else listen({ interim: false });
//   };

//   return (
//     <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ECECEC]">
//       <div
//         className="flex flex-col items-center justify-center w-full max-w-md border border-gray-400 rounded-xl p-8 shadow-md bg-cover bg-center hover:border-zinc-800 cursor-pointer"
//         style={{
//           backgroundImage:
//             "url('https://wallpapercave.com/wp/wp2744093.jpg')",
//           backgroundColor: "rgba(255, 255, 255, 0.3)",
//           backgroundBlendMode: "lighten",
//         }}
//       >
//         <h2 className="text-2xl font-bold mb-2">LOGIN</h2>
//         <p className="text-sm text-gray-700 mb-4 text-center">
//           Speak or type your credentials.
//           <br />
//           Example: “My name is Rahul”
//         </p>

//         <form onSubmit={handleSubmit} className="w-full space-y-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Your Name"
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
//             value={form.name}
//             onChange={handleChange}
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
//             value={form.password}
//             onChange={handleChange}
//           />
//           <button
//             type="submit"
//             className="w-full bg-[#31699e] text-white py-2 rounded hover:bg-blue-800 transition"
//           >
//             Login
//           </button>
//         </form>

//         <button
//           onClick={toggleListening}
//           className={`mt-6 px-6 py-2 rounded text-white transition ${
//             listening
//               ? "bg-red-600 hover:bg-red-700"
//               : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           {listening ? "Stop Listening" : "🎙️ Speak Now"}
//         </button>

//         <p className="mt-4 text-sm text-gray-700 text-center">
//           Don’t have an account?{" "}
//           <a href="/signup" className="text-blue-600 hover:underline">
//             Sign Up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", password: "" });

  const cardRef = useRef(null);
  const contentRefs = useRef([]);

  // Use custom speech recognition hook
  const { listening, toggleListening, spokenRef } = useSpeechRecognition(
    (detectedName) => setForm((f) => ({ ...f, name: detectedName }))
  );

  useEffect(() => {
    // Animate container from right to center
    gsap.fromTo(
      cardRef.current,
      { x: 300, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

    // Animate internal elements bottom to top
    gsap.fromTo(
      contentRefs.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      }
    );
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.password) {
      alert("Both name and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.name,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Welcome ${form.name}, you are logged in successfully.`);
        setTimeout(() => navigate("/chat"), 1500);
      } else {
        alert(data?.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      alert("Network error. Please try again later.");
      console.error("❌ Network Error:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ECECEC]">
      <div
        ref={cardRef}
        className="flex flex-col items-center justify-center w-full max-w-md border border-gray-400 rounded-xl p-8 shadow-md bg-cover bg-center hover:border-zinc-800 cursor-pointer"
        style={{
          backgroundImage:
            "url('https://wallpapercave.com/wp/wp2744093.jpg')",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h2
          className="text-2xl font-bold mb-2"
          ref={(el) => (contentRefs.current[0] = el)}
        >
          LOGIN
        </h2>
        <p
          className="text-sm text-gray-700 mb-4 text-center"
          ref={(el) => (contentRefs.current[1] = el)}
        >
          Speak or type your credentials. Example: “My name is Rahul”
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={form.name}
            onChange={handleChange}
            ref={(el) => (contentRefs.current[2] = el)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={form.password}
            onChange={handleChange}
            ref={(el) => (contentRefs.current[3] = el)}
          />
          <button
            type="submit"
            className="w-full bg-[#31699e] text-white py-2 rounded hover:bg-blue-800 transition"
            ref={(el) => (contentRefs.current[4] = el)}
          >
            Login
          </button>
        </form>

        <button
          onClick={toggleListening}
          className={`mt-6 px-6 py-2 rounded text-white transition ${
            listening
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
          ref={(el) => (contentRefs.current[5] = el)}
        >
          {listening ? "Stop Listening" : "🎙️ Speak Now"}
        </button>

        <p
          className="mt-4 text-sm text-gray-700 text-center"
          ref={(el) => (contentRefs.current[6] = el)}
        >
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
