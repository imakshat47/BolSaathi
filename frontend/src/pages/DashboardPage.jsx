import React from "react";
import { useTranslation } from "react-i18next"; // For translations if you're using i18n

const schemes = [
  {
    id: 1,
    title: "PM Awas Yojana",
    description: "Affordable housing scheme for urban and rural poor in India.",
  },
  {
    id: 2,
    title: "Ayushman Bharat",
    description:
      "Health insurance of ₹5 lakh per family per year for secondary and tertiary care.",
  },
  {
    id: 3,
    title: "Kisan Samman Nidhi",
    description: "₹6,000 annual income support for small and marginal farmers.",
  },
];

const DashboardPage = () => {
  const { t } = useTranslation(); // Load translation hook

  const speakScheme = (scheme) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utter = new SpeechSynthesisUtterance(
      `${scheme.title}: ${scheme.description}`
    );
    utter.lang = "en-IN";
    speechSynthesis.speak(utter);
  };

  return (
    <div className=" bg-[#ECECEC] w-full h-screen">
      <h1 className="text-5xl font-bold mb-15 text-center pt-10">
        {t("WELFARE SCHEMES")}
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            onClick={() => speakScheme(scheme)}
            onKeyDown={(e) => e.key === "Enter" && speakScheme(scheme)}
            tabIndex={0}
            role="button"
            className="border p-4 rounded shadow hover:bg-[#F7F7F7] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h2 className="text-xl font-semibold mb-2">{scheme.title}</h2>
            <p className="text-gray-600">{scheme.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
