import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpeechRecognition, useSpeechSynthesis } from "react-speech-kit";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", password: "" });

  const { speak } = useSpeechSynthesis();

  const { listen, stop, listening } = useSpeechRecognition({
    onResult: (speechText) => {
      const lower = speechText.toLowerCase();

      // Extract Name
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
    speak({
      text: "Welcome. Please say 'My name is...' or type your name and password manually.",
      lang: "en-IN",
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.password) {
      speak({
        text: "Both name and password are required.",
        lang: "en-IN",
      });
      return;
    }

    speak({
      text: `Thank you ${form.name}. You are signed up successfully.`,
      lang: "en-IN",
    });

    setTimeout(() => {
      navigate("/chat");
    }, 4000);
  };

  const toggleListening = () => {
    if (listening) {
      stop();
    } else {
      listen({ interim: false });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ECECEC]">
      <div
        className="flex flex-col items-center justify-center w-full max-w-md border border-gray-400 rounded-xl p-8 shadow-md bg-cover bg-center hover:border-zinc-800 cursor-pointer"
        style={{
          backgroundImage:
            "url('http://frankjdimaurodmd.com/wp-content/uploads/2015/03/minimalistic-white-fog-silver-digital-art-white-background-HD-Wallpapers.jpg')",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h2 className="text-2xl font-bold mb-2">SIGN UP</h2>
        <p className="text-sm text-gray-700 mb-4 text-center">
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
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-[#31699e] text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Sign Up
          </button>
        </form>

        <button
          onClick={toggleListening}
          className={`mt-6 px-6 py-2 rounded text-white transition ${
            listening
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {listening ? "Stop Listening" : "🎙️ Speak Now"}
        </button>

        <p className="mt-4 text-sm text-gray-700 text-center">
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
