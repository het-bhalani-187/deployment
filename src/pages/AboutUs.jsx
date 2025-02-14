import React from 'react';
import '../styles/AboutUs.css'; // Import the CSS file

const AboutUs = () => {
    return (
        <div className="about-background gradient-bg">
            <header className="about-header">
                <h1>About Us</h1>
            </header>
            <main className="about-container">
                <section className="about-section">
                    <h2>Who We Are</h2>
                    <p>We are a team of LawyerAI enthusiasts dedicated to creating advanced conversational agents that enhance human-computer interaction with law. 
                    Our expertise spans artificial intelligence, legal frameworks, and cutting-edge technology to provide innovative solutions.</p>
                </section>
                <section className="about-section">
                    <h2>Our Mission</h2>
                    <p>Our mission is to make LawyerAI accessible and useful for everyone, providing tools that empower users to communicate effectively and efficiently. 
                    By leveraging AI, we aim to bridge the gap between legal professionals and the general public, making legal assistance more approachable.</p>
                </section>
                <section className="about-section">
                    <h2>Our Vision</h2>
                    <p>We envision a future where LawyerAI seamlessly integrates into daily life, enhancing productivity and creativity across various domains. 
                    We strive to revolutionize the way legal information is accessed and understood, making justice more transparent and equitable for all.</p>
                </section>
            </main>
        </div>
    );
};

export default AboutUs;