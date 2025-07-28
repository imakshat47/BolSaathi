

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSpeechRecognition, useSpeechSynthesis } from "react-speech-kit";
import gsap from "gsap";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", password: "" });

  const { speak } = useSpeechSynthesis();
  const spokenRef = useRef(false);
  const cardRef = useRef(null);
  const contentRefs = useRef([]);

  const { listen, stop, listening } = useSpeechRecognition({
    onResult: (speechText) => {
      const lower = speechText.toLowerCase();
      const nameMatch = lower.match(/my name is\s*(.+)/);
      if (nameMatch) {
        const name = nameMatch[1].replace(/[0-9]/g, "").trim();
        if (name) {
          setForm((f) => ({ ...f, name }));
        }
      }
    },
  });

  useEffect(() => {
    if (!spokenRef.current) {
      speak({
        text: "Welcome. Please say 'My name is...' or type your name and password manually.",
        lang: "en-IN",
      });
      spokenRef.current = true;
    }
  }, []);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { x: -300, opacity: 0 },
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.password) {
      speak({ text: "Both name and password are required.", lang: "en-IN" });
      return;
    }

   try {
  const response = await fetch("http://localhost:8000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
   body: JSON.stringify({ name: form.name, password: form.password }),

  });

  if (!response.ok) {
    // If the server returns a 404 or other error
    const errorText = await response.text(); // Read the response as plain text (not JSON)
    throw new Error(`Server Error (${response.status}): ${errorText}`);
  }

      const data = await response.json();

      if (response.ok) {
        speak({
          text: `Thank you ${form.name}. You are signed up successfully.`,
          lang: "en-IN",
        });

        setTimeout(() => {
          window.speechSynthesis.cancel();
          navigate("/greet");
        }, 1000);
      } else {
        speak({
          text: data?.message || "Registration failed. Please try again.",
          lang: "en-IN",
        });
        console.error("❌ Backend Error:", data);
      }
    } catch (error) {
      speak({
        text: "Something went wrong. Please try again.",
        lang: "en-IN",
      });
      console.error("❌ Network Error:", error);
    }
  };

  const toggleListening = () => {
    if (listening) stop();
    else listen({ interim: false });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#ECECEC]">
      <div
        ref={cardRef}
        className="flex flex-col items-center justify-center w-full max-w-md border border-gray-400 rounded-xl p-8 shadow-md bg-cover bg-center hover:border-zinc-800 cursor-pointer"
        style={{
          backgroundImage:
            "url('http://frankjdimaurodmd.com/wp-content/uploads/2015/03/minimalistic-white-fog-silver-digital-art-white-background-HD-Wallpapers.jpg')",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h2
          className="text-2xl font-bold mb-2"
          ref={(el) => (contentRefs.current[0] = el)}
        >
          SIGN UP
        </h2>
        <p
          className="text-sm text-gray-700 mb-4 text-center"
          ref={(el) => (contentRefs.current[1] = el)}
        >
          Speak or type your details below.
          <br />
          Example: “My name is Rahul”
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
            Sign Up
          </button>
        </form>

        <button
          onClick={toggleListening}
          className={`mt-6 px-6 py-2 rounded text-white transition ${
            listening ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
          ref={(el) => (contentRefs.current[5] = el)}
        >
          {listening ? "Stop Listening" : "🎙️ Speak Now"}
        </button>

        <p
          className="mt-4 text-sm text-gray-700 text-center"
          ref={(el) => (contentRefs.current[6] = el)}
        >
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;


