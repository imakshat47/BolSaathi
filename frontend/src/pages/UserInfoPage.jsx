// // import React, { useState } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";

// // const UserInfoPage = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // Get passed data
// //   const {
// //     name = "",
// //     gender = "",
// //     age = "",
// //     profession = "",
// //     place = "",
// //     otherDetails = "",
// //   } = location.state || {};

// //   const [userInfo, setUserInfo] = useState({
// //     name,
// //     age,
// //     gender,
// //     profession,
// //     place,
// //     otherDetails,
// //   });

// //   const handleChange = (e) => {
// //     setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log("User Info Submitted:", userInfo);

// //     navigate("/chat");
// //   };

// //   return (
// //     <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ECECEC]">
// //       <div
// //         className="flex flex-col items-center justify-center w-full max-w-md border border-gray-400 rounded-xl p-8 shadow-md bg-cover bg-center hover:border-zinc-800 cursor-pointer"
// //         style={{
// //           backgroundImage:
// //             "url('http://frankjdimaurodmd.com/wp-content/uploads/2015/03/minimalistic-white-fog-silver-digital-art-white-background-HD-Wallpapers.jpg')",
// //           backgroundColor: "rgba(255, 255, 255, 0.3)",
// //           backgroundBlendMode: "lighten",
// //         }}
// //       >
// //         <h2 className="text-2xl font-bold mb-2">User Info</h2>
// //         <p className="text-sm text-gray-700 mb-4 text-center">
// //           Please fill in your details to personalize your experience.
// //         </p>

// //         <form onSubmit={handleSubmit} className="w-full space-y-4">
// //           <input
// //             type="text"
// //             name="name"
// //             placeholder="Your Name"
// //             required
// //             value={userInfo.name}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
// //           />
// //           <input
// //             type="number"
// //             name="age"
// //             placeholder="Your Age"
// //             required
// //             value={userInfo.age}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
// //           />
// //           <input
// //             type="text"
// //             name="gender"
// //             placeholder="Gender"
// //             required
// //             value={userInfo.gender}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
// //           />
// //           <input
// //             type="text"
// //             name="profession"
// //             placeholder="Profession"
// //             value={userInfo.profession}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
// //           />
// //           <input
// //             type="text"
// //             name="place"
// //             placeholder="Place"
// //             value={userInfo.place}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
// //           />
// //           <textarea
// //             name="otherDetails"
// //             placeholder="Other Details"
// //             rows={3}
// //             value={userInfo.otherDetails}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
// //           />

// //           <button
// //             type="submit"
// //             className="w-full bg-[#31699e] text-white py-2 rounded hover:bg-blue-800 transition"
// //           >
// //             Save Info
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserInfoPage;




// import React, { useState, useRef, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import gsap from "gsap";

// const UserInfoPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const {
//     name = "",
//     gender = "",
//     age = "",
//     profession = "",
//     place = "",
//     otherDetails = "",
//   } = location.state || {};

//   const [userInfo, setUserInfo] = useState({
//     name,
//     age,
//     gender,
//     profession,
//     place,
//     otherDetails,
//   });

//   const cardRef = useRef(null);
//   const contentRefs = useRef([]);

//   useEffect(() => {
//     // Card enters from left
//     gsap.fromTo(
//       cardRef.current,
//       { x: -300, opacity: 0 },
//       {
//         x: 0,
//         opacity: 1,
//         duration: 1,
//         ease: "power2.out",
//       }
//     );

//     // Content inside moves bottom to top
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
//     setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("User Info Submitted:", userInfo);
//     navigate("/chat");
//   };

//   return (
//     <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ECECEC]">
//       <div
//         ref={cardRef}
//         className="flex flex-col items-center justify-center w-full max-w-md border border-gray-400 rounded-xl p-8 shadow-md bg-cover bg-center hover:border-zinc-800 cursor-pointer"
//         style={{
//           backgroundImage:
//             "url('http://frankjdimaurodmd.com/wp-content/uploads/2015/03/minimalistic-white-fog-silver-digital-art-white-background-HD-Wallpapers.jpg')",
//           backgroundColor: "rgba(255, 255, 255, 0.3)",
//           backgroundBlendMode: "lighten",
//         }}
//       >
//         <h2
//           className="text-2xl font-bold mb-2"
//           ref={(el) => (contentRefs.current[0] = el)}
//         >
//           User Info
//         </h2>
//         <p
//           className="text-sm text-gray-700 mb-4 text-center"
//           ref={(el) => (contentRefs.current[1] = el)}
//         >
//           Please fill in your details to personalize your experience.
//         </p>

//         <form onSubmit={handleSubmit} className="w-full space-y-4">
//           {[
//             { name: "name", placeholder: "Your Name", type: "text", required: true },
//             { name: "age", placeholder: "Your Age", type: "number", required: true },
//             { name: "gender", placeholder: "Gender", type: "text", required: true },
//             { name: "profession", placeholder: "Profession", type: "text" },
//             { name: "place", placeholder: "Place", type: "text" },
//           ].map((field, index) => (
//             <input
//               key={field.name}
//               type={field.type}
//               name={field.name}
//               required={field.required}
//               placeholder={field.placeholder}
//               value={userInfo[field.name]}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
//               ref={(el) => (contentRefs.current[index + 2] = el)}
//             />
//           ))}

//           <textarea
//             name="otherDetails"
//             placeholder="Other Details"
//             rows={3}
//             value={userInfo.otherDetails}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
//             ref={(el) => (contentRefs.current[7] = el)}
//           />

//           <button
//             type="submit"
//             className="w-full bg-[#31699e] text-white py-2 rounded hover:bg-blue-800 transition"
//             ref={(el) => (contentRefs.current[8] = el)}
//           >
//             Save Info
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserInfoPage;


import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";

const UserInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    name = "",
    gender = "",
    age = "",
    profession = "",
    place = "",
    otherDetails = "",
  } = location.state || {};

  const [userInfo, setUserInfo] = useState({
    name,
    age,
    gender,
    profession,
    place,
    otherDetails,
  });

  const cardRef = useRef(null);
  const contentRefs = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { x: -300, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      }
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
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Info Submitted:", userInfo);
    navigate("/chat");
  };

  return (
    <div className="w-full min-h-[90vh] flex items-center justify-center bg-[#ECECEC] px-2 py-6">
      <div
        ref={cardRef}
        className="w-full max-w-[250px] max-h-[60vh] sm:max-w-[250px] sm:max-h-[80vh] md:max-w-md lg:max-w-lg border border-gray-300 rounded-xl p-4 sm:p-6 mt-6 sm:mt-10 shadow-lg bg-cover bg-center hover:border-zinc-800 cursor-pointer transition-all duration-300 flex flex-col justify-center items-center"
        style={{
          backgroundImage:
            "url('http://frankjdimaurodmd.com/wp-content/uploads/2015/03/minimalistic-white-fog-silver-digital-art-white-background-HD-Wallpapers.jpg')",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h2
          className="text-xl sm:text-2xl font-bold mb-2 text-center"
          ref={(el) => (contentRefs.current[0] = el)}
        >
          User Info
        </h2>
        <p
          className="text-[10px] sm:text-[15px] text-gray-700 mb-4 text-center"
          ref={(el) => (contentRefs.current[1] = el)}
        >
          Please fill in your details to personalize your experience.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-2">
          {[
            { name: "name", placeholder: "Your Name", type: "text", required: true },
            { name: "age", placeholder: "Your Age", type: "number", required: true },
            { name: "gender", placeholder: "Gender", type: "text", required: true },
            { name: "profession", placeholder: "Profession", type: "text" },
            { name: "place", placeholder: "Place", type: "text" },
          ].map((field, index) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              value={userInfo[field.name]}
              onChange={handleChange}
              className="w-full px-3 py-2 text-[10px] sm:text-[15px] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              ref={(el) => (contentRefs.current[index + 2] = el)}
            />
          ))}

          <textarea
            name="otherDetails"
            placeholder="Other Details"
            rows={3}
            value={userInfo.otherDetails}
            onChange={handleChange}
            className="w-full px-3 text-[10px] sm:text-[15px] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            ref={(el) => (contentRefs.current[7] = el)}
          />

          <button
            type="submit"
            className="w-[40%] sm:w-[50%] bg-[#31699e] text-white py-1  sm:text-[15px] text-[10px] rounded hover:bg-blue-800 transition mx-auto block"
            ref={(el) => (contentRefs.current[8] = el)}
          >
            Save Info
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInfoPage;
