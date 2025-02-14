import React, { useEffect } from 'react';
import '../styles/App.css'; // You can customize styles here

const HomePage = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = '/Login'; // Change '/login' to your actual Login page route
        }, 2000);

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);

    return (
        <div className="Home-bg border-2 border-blue-500 p-10 gradient-bg flex items-center justify-center">
            <Content />
        </div>
    );
};

const Content = () => {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-900 mt-2">LAWYER.AI</h1>
            <h2 className="strong">Convenience<br />with Justice</h2>
        </div>
    );
};

export default HomePage;