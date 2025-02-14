import React, { useState } from 'react';

// Login Component
const LoginLawyer = () => {
    const [Advocateid, setid] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log({ email, password});
    };

    return (
        <div className="border-2 border-blue-500 p-10 gradient-bg items-center justify-center">
            <style>
                {`
                    .form-container {
                        max-width: 400px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }
                    .form-group {
                        margin-bottom: 15px;
                    }
                    .form-group label {
                        display: block;
                        margin-bottom: 5px;
                    }
                    .form-group input {
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }
                    .submit-button {
                        background-color: #28a745;
                        color: white;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    .submit-button:hover {
                        background-color: #218838;
                    }
                `}
            </style>
            {/*<h2>Login</h2>*/}<br></br>
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-group ">
                    <label htmlFor="id">Advocate Id</label>
                    <input
                        type="text"
                        id="Advocateid"
                        value={Advocateid}
                        onChange={(e) => setid(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group ">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <a href="Homepage.jsx">
                    <button type="submit" className="submit-button">Submit</button>
                </a>
            </form>
        </div>
    );
};
export default LoginLawyer;