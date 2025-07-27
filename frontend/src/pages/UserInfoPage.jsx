import React, { useState } from "react";

const UserInfoPage = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    age: "",
    gender: "",
    profession: "",
    place: "",
    otherDetails: "",
  });

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Info Submitted:", userInfo);
    alert("User info saved successfully!");
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
        <h2 className="text-2xl font-bold mb-2">User Info</h2>
        <p className="text-sm text-gray-700 mb-4 text-center">
          Please fill in your details to personalize your experience.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={userInfo.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="number"
            name="age"
            placeholder="Your Age"
            required
            value={userInfo.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            required
            value={userInfo.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="text"
            name="profession"
            placeholder="Profession"
            value={userInfo.profession}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="text"
            name="place"
            placeholder="Place"
            value={userInfo.place}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <textarea
            name="otherDetails"
            placeholder="Other Details"
            rows={3}
            value={userInfo.otherDetails}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          />

          <button
            type="submit"
            className="w-full bg-[#31699e] text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Save Info
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInfoPage;
