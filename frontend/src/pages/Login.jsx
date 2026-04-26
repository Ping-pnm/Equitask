import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';

import FormInput from '../components/LoginRegister/FormInput';
import logoImg from '../assets/logo-primary.png';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    function handleChange(id, value) {
        setFormData(prev => ({ ...prev, [id]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful!");
                navigate('/');
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Check if the server is running.");
        }
    }

    return (
        <div className="login-card">
            {/* Logo */}
            <div className="logo-wrapper">
                <div className="logo-glow"></div>
                <img src={logoImg} alt="Equitask Logo" id="logo-image" className="logo-image" />
            </div>

            {/* Form */}
            <form id="login-form" onSubmit={handleSubmit}>
                <FormInput
                    type="email"
                    id="email-input"
                    placeholder="Your email......."
                    autoComplete="email"
                    onChange={(e) => handleChange("email-input", e.target.value)}
                />


                <FormInput
                    type="password"
                    id="password-input"
                    placeholder="Password......."
                    autoComplete="current-password"
                    onChange={(e) => handleChange("password-input", e.target.value)}
                />

                {/* Button */}
                <div className="buttons-container">
                    <Link to="/register" className="btn btn-register" id="register-btn">Register</Link>
                    <button type="submit" className="btn btn-login" id="login-btn">Login</button>
                </div>
            </form>
        </div>
    )
}

