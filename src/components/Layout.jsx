import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar2 from './Navbar2';
import Homepage from '../pages/Homepage';
import Features from './Features';
import Profile from '../pages/Profile';
import Footer from './Footer';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AboutUs1 from '../pages/AboutUs1';
import Blog from '../pages/Blog';
import Courtroom from '../pages/Courtroom';
import Thread from '../pages/Thread';
import VerifyOtp from '../pages/VerifyOtp';

const Layout = () => {
  return (
    <div>
      <Navbar2 />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/aboutus" element={<AboutUs1 />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/courtroom" element={<Courtroom />} />
        <Route path="/thread" element={<Thread />} />
        <Route path="/verifyotp" element={<VerifyOtp />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Layout;