import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';
import { FaQuoteLeft, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaAndroid, FaApple, FaLinux, FaWindows } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';
import BubbleChat from './BubbleChat';

const testimonials = [
  {
    text: "I was blown away by how quickly and efficiently webtonative.com was able to convert my website into an app. The process was seamless, and the final product exceeded my expectations. Thank you for your excellent service!",
    name: "Het Shah",
    platforms: [<FaAndroid />, <FaLinux />],
  },
  {
    text: "I'm so glad I found w2n! They took care of everything from start to finish, including Playstore and Appstore publishing services. The app they developed for me has been a game-changer for my business, and the added features like Facebook events and Apps Flyer have helped me reach a wider audience. Thank you!",
    name: "Het Kikani",
    platforms: [<FaAndroid />,<FaWindows/>],
  },
  {
    text: "I was amazed at how quickly and seamlessly my website was converted into an android app. The biometric and native contacts features make it easy for my users to access my app quickly and easily. Thank you for the great service!",
    name: "Het Bhalani",
    platforms: [<FaAndroid />,<FaApple/>],
  },
];

const Dashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="dashboard">
      <div className="animated-bg"></div>
      <div className="main-content">
        <section className="hero">
          <h1>Get Professional Legal Advice</h1>
          <h1>Your trusted partner in legal matters.</h1>
          <div className="cta-buttons">
          <a href="https://lawyer-c79df0.zapier.app/" target="_blank" rel="noopener noreferrer" className="cta-primary">Start Chat</a>
            <Link to="/aboutus" className="cta-primary">About Us</Link>
          </div>
        </section>
        <center>
          <section id="testimonials" className="testimonials">
            <h2 className="text-center" data-aos="fade-up" >What Our Clients Say!</h2>
            <div className="testimonial-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial" data-aos="zoom-in">
                  <FaQuoteLeft className="quote-icon" />
                  <h4>{testimonial.text}</h4>
                  <p>{testimonial.name}</p>
                  <p className="testimonial-platforms">User Of {testimonial.platforms}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="blog" className="blog-preview">
            <h2 data-aos="zoom-in-up">Latest Blogs</h2>
            <div className="blog-grid">
              <div className="blog-post" data-aos="slide-up">
                <h3>5 Tips for Maximizing Productivity</h3>
                <p>Discover effective strategies to enhance your productivity.</p><br/>
                <button className="cta-read-more">Read More</button>
              </div>
              <div className="blog-post" data-aos="slide-up">
                <h3>The Future of Technology in Business</h3>
                <p>Explore the latest trends in technology shaping the future.</p><br/>
                <button className="cta-read-more">Read More</button>
              </div>
              <div className="blog-post" data-aos="slide-up">
                <h3>Understanding Legal Tech Innovations</h3>
                <p>How technology is transforming the legal industry.</p><br/>
                <button className="cta-read-more">Read More</button>
              </div>
            </div>
          </section>
        </center>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} LAWYER.AI</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <BubbleChat/>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;