import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { useAuth } from '../components/AuthContext';

import FormInput from '../components/LoginRegister/FormInput';
import MessagePopup from '../components/MessagePopup';
import logoImg from '../assets/logo-primary.png';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loginformData, setLoginFormData] = useState({
        email: '',
        password: '',
    });
    const [modalConfig, setModalConfig] = useState({ show: false, message: '', theme: 'red' });

    function handleChange(id, value) {
        setLoginFormData(prev => ({ ...prev, [id]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginformData.email,
                    password: loginformData.password,
                })
            });

            const data = await response.json();

            if (response.ok) {
                setModalConfig({ show: true, message: 'Login Successful!', theme: 'green' });
                login(data.user.id);
                // Wait a moment so the user sees the success message before redirecting
                setTimeout(() => navigate('/'), 1500);
            } else {
                setModalConfig({ show: true, message: data.message || 'Login Failed', theme: 'red' });
            }
        } catch (error) {
            console.error("Error:", error);
            setModalConfig({ show: true, message: 'An error occurred. Check if the server is running', theme: 'red' });
        }
    }

    return (
        <>
            <div className="login-card">
                {/* ... existing card content ... */}
                {/* Logo */}
                <div className="logo-wrapper">
                    <div className="logo-glow"></div>
                    <img src={logoImg} alt="Equitask Logo" className="logo-image" />
                </div>

                {/* Form */}
                <form id="login-form" onSubmit={handleSubmit}>
                    <FormInput
                        type="email"
                        id="email-input"
                        placeholder="Your email......."
                        autoComplete="email"
                        value={loginformData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />


                    <FormInput
                        type="password"
                        id="password-input"
                        placeholder="Password......."
                        autoComplete="current-password"
                        value={loginformData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                    />

                    {/* Button */}
                    <div className="buttons-container">
                        <Link to="/register" className="btn btn-register" id="register-btn">Register</Link>
                        <button type="submit" className="btn btn-login" id="login-btn">Login</button>
                    </div>
                </form>
            </div>

            {modalConfig.show && (
                <MessagePopup
                    theme={modalConfig.theme}
                    onClose={() => setModalConfig({ ...modalConfig, show: false })}
                >
                    {modalConfig.message}
                </MessagePopup>
            )}
        </>
    );
}

