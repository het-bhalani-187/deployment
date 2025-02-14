import React from 'react';
import '../styles/AboutUs.css'; // Import the CSS file

const AboutUs1 = () => {
    return (
        // <div>
        <div className="about-background gradient-bg">
            <header className="header">
                <h1>About Us</h1><hr/>
            </header>
            <main className="about-container">
                <section className="about-section">
                    <h2>Who We Are</h2>
                    <p>We are a team of LawyerAI enthusiasts dedicated to creating advanced conversational agents that enhance human-computer interaction with Law.</p>
                </section>
                <section className="about-section">
                    <h2>Our Mission</h2>
                    <p>Our mission is to make LawyerAI accessible and useful for everyone, providing tools that empower users to communicate effectively and efficiently.</p>
                </section>
                <section className="about-section">
                    <h2>Our Vision</h2>
                    <p>We envision a future where LawyerAI seamlessly integrates into daily life, enhancing productivity and creativity across various domains.</p>
                </section>
            </main>
        </div>
    );
};

export default AboutUs1;