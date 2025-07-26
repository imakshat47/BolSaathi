import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpeechRecognition, useSpeechSynthesis } from "react-speech-kit";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "" });

  const { speak } = useSpeechSynthesis();

  const { listen, stop, listening } = useSpeechRecognition({
    onResult: (speechText) => {
      const lower = speechText.toLowerCase();

      // Extract phone first to avoid name conflict
      const phoneMatch = lower.match(
        /(?:my number is|mobile number is)\s*(\d{10,})/
      );
      if (phoneMatch) {
        const number = phoneMatch[1];
        if (number) {
          setForm((f) => ({ ...f, phone: number }));
          return;
        }
      }

      // Extract name
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
      text:
        t("voiceLoginGuide") ||
        "Welcome. Please say 'My name is...' and 'My mobile number is...'",
      lang: "en-IN",
    });
  }, [t]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    speak({
      text: `${t("thankYou")} ${form.name}. ${t("loginSuccess")}`,
      lang: "en-IN",
    });

    setTimeout(() => {
      navigate("/chat");
    }, 3000);
  };

  const toggleListening = () => {
    listening ? stop() : listen({ interim: false });
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
        <h2 className="text-2xl font-bold mb-2">{t("login") || "LOGIN"}</h2>
       <p className="text-sm text-gray-700 mb-4 text-center">
  Speak or type your details below. Example: “My name is Rahul” and “My mobile number is 98*******”
</p>


        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="text"
            name="name"
            required
            placeholder={t("namePlaceholder") || "Enter your name"}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            required
            placeholder={t("mobilePlaceholder") || "Enter mobile number"}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={form.phone}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-[#31699e] text-white py-2 rounded hover:bg-[#31699e] transition"
          >
            {t("login") || "Login"}
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
          {listening ? t("stopListening") || "Stop Listening" : t("speakNow") || "🎙️ Speak Now"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
