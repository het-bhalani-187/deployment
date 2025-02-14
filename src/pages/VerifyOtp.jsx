import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios for API requests
import '../styles/VerifyOtp.css';

const VerifyOtp = ({ email }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array to hold each digit of the OTP
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(30); // Countdown timer (in seconds)
    const [otpVerified, setOtpVerified] = useState(false);

    useEffect(() => {
        let interval;
        if (otpSent && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    const requestNewOtp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/generate-otp', { email });
            alert(response.data.message);
            setOtpSent(true);
            setTimer(30); // Reset the timer
            setOtp(['', '', '', '', '', '']); // Reset OTP input fields
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to send OTP.');
        }
    };

    const verifyOtp = async () => {
        const otpString = otp.join(''); // Join the OTP array into a string
        try {
            const response = await axios.post('http://localhost:5000/validate-otp', { email, otp: otpString });
            alert(response.data.message);
            setOtpVerified(true);
        } catch (error) {
            alert(error.response?.data?.error || 'Invalid OTP.');
        }
    };

    const handleChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;

        // Move to the next input field if the current one is filled
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }

        // Move to the previous input field if the current one is empty and the user deletes a character
        if (!value && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }

        setOtp(newOtp);
    };

    return (
        <div className="verify-container">
            <div className="verify-box">
                <h1>Verify OTP</h1>
                <p>Please verify the OTP sent to your email:</p>
                <div className="input-group">
                    <input type="email" value={email} readOnly />
                </div>
                {otpSent && (
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-input-${index}`}
                                type="text"
                                maxLength="1"
                                placeholder="-"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onFocus={(e) => e.target.select()} // Select the input text on focus
                            />
                        ))}
                    </div>
                )}
                {!otpSent ? (
                    <button className="btn btn-primary" onClick={requestNewOtp}>
                        Send OTP
                    </button>
                ) : (
                    <>
                        <button className="btn btn-success" onClick={verifyOtp} disabled={otp.some(d => d === '')}>
                            Verify OTP
                        </button>
                        {timer > 0 ? (
                            <p className="timer">You can request a new OTP in {timer}s</p>
                        ) : (
                            <button className="btn btn-secondary" onClick={requestNewOtp}>
                                Resend OTP
                            </button>
                        )}
                    </>
                )}
                {otpVerified && <p className="success-message">OTP Verified Successfully!</p>}
            </div>
        </div>
    );
};

export default VerifyOtp;