
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import gsap from "gsap";
// import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: "", password: "" });

//   const cardRef = useRef(null);
//   const contentRefs = useRef([]);

//   // Use custom speech recognition hook
//   const { listening, toggleListening, spokenRef } = useSpeechRecognition(
//     (detectedName) => setForm((f) => ({ ...f, name: detectedName }))
//   );

//   useEffect(() => {
//     // Animate container from right to center
//     gsap.fromTo(
//       cardRef.current,
//       { x: 300, opacity: 0 },
//       { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
//     );

//     // Animate internal elements bottom to top
//     gsap.fromTo(
//       contentRefs.current,
//       { y: 40, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.6,
//         stagger: 0.1,
//         delay: 0.3,
//         ease: "power2.out",
//       }
//     );
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name || !form.password) {
//       alert("Both name and password are required.");
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
//         alert(`Welcome ${form.name}, you are logged in successfully.`);
//         setTimeout(() => navigate("/chat"), 1500);
//       } else {
//         alert(data?.message || "Login failed. Please check your credentials.");
//       }
//     } catch (error) {
//       alert("Network error. Please try again later.");
//       console.error("❌ Network Error:", error);
//     }
//   };

//   return (
//     <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ECECEC]">
//       <div
//         ref={cardRef}
//         className="flex flex-col items-center justify-center w-full max-w-md border border-gray-400 rounded-xl p-8 shadow-md bg-cover bg-center hover:border-zinc-800 cursor-pointer"
//         style={{
//           backgroundImage:
//             "url('https://wallpapercave.com/wp/wp2744093.jpg')",
//           backgroundColor: "rgba(255, 255, 255, 0.3)",
//           backgroundBlendMode: "lighten",
//         }}
//       >
//         <h2
//           className="text-2xl font-bold mb-2"
//           ref={(el) => (contentRefs.current[0] = el)}
//         >
//           LOGIN
//         </h2>
//         <p
//           className="text-sm text-gray-700 mb-4 text-center"
//           ref={(el) => (contentRefs.current[1] = el)}
//         >
//           Speak or type your credentials. Example: “My name is Rahul”
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
//             ref={(el) => (contentRefs.current[2] = el)}
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
//             value={form.password}
//             onChange={handleChange}
//             ref={(el) => (contentRefs.current[3] = el)}
//           />
//           <button
//             type="submit"
//             className="w-full bg-[#31699e] text-white py-2 rounded hover:bg-blue-800 transition"
//             ref={(el) => (contentRefs.current[4] = el)}
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
//           ref={(el) => (contentRefs.current[5] = el)}
//         >
//           {listening ? "Stop Listening" : "🎙️ Speak Now"}
//         </button>

//         <p
//           className="mt-4 text-sm text-gray-700 text-center"
//           ref={(el) => (contentRefs.current[6] = el)}
//         >
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
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import gsap from "gsap";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", password: "" });

  const cardRef = useRef(null);
  const contentRefs = useRef([]);

  const { listening, toggleListening } = useSpeechRecognition(
    (detectedName) => setForm((f) => ({ ...f, name: detectedName }))
  );

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { x: 300, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
        body: JSON.stringify({ username: form.name, password: form.password }),
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
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-2 sm:px-4 py-4 sm:py-6">
      <div
        ref={cardRef}
        className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-md md:max-w-lg border border-gray-300 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg bg-cover bg-center hover:border-gray-600 transition-all"
        style={{
          backgroundImage: "url('https://wallpapercave.com/wp/wp2744093.jpg')",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center"
          ref={(el) => (contentRefs.current[0] = el)}
        >
          LOGIN
        </h2>

        <p
          className="text-xs sm:text-sm text-gray-700 mb-3 text-center"
          ref={(el) => (contentRefs.current[1] = el)}
        >
          Speak or type your credentials. Example: “My name is Rahul”
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-3 sm:space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm"
            value={form.name}
            onChange={handleChange}
            ref={(el) => (contentRefs.current[2] = el)}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm"
            value={form.password}
            onChange={handleChange}
            ref={(el) => (contentRefs.current[3] = el)}
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 sm:py-2.5 rounded hover:bg-blue-800 transition text-xs sm:text-sm"
            ref={(el) => (contentRefs.current[4] = el)}
          >
            Login
          </button>
        </form>

        <button
          onClick={toggleListening}
          className={ `w-full mt-4 px-4 py-2 rounded text-white transition text-xs sm:text-sm ${
            listening ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
          ref={(el) => (contentRefs.current[5] = el)}
        >
          {listening ? "Stop Listening" : "🎙️ Speak Now"}
        </button>

        <p
          className="mt-3 text-xs sm:text-sm text-gray-700 text-center"
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
