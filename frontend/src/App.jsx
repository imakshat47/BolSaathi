import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import GreetingPage from "./pages/GreetingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage"; 
import ChatPage from "./pages/ChatPage";
import UserInfoPage from "./pages/UserInfoPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/greet" element={<GreetingPage />} />
         <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
       <Route path="/schemes" element={<DashboardPage />} />
         <Route path="/chat" element={<ChatPage />} /> 
         <Route path="/userinfo" element={<UserInfoPage />} />
      </Routes>
    </>
  );
}

export default App;
