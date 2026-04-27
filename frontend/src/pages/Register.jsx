import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo-primary.png';
import FormInput from '../components/LoginRegister/FormInput';
import MessagePopup from '../components/MessagePopup';


export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [modalConfig, setModalConfig] = useState({ show: false, message: '', theme: 'red' });

    function handleChange(id, value) {
        setFormData(prev => ({ ...prev, [id]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setModalConfig({ show: true, message: 'Passwords do not match!', theme: 'red' });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setModalConfig({ show: true, message: 'Registration Successful!', theme: 'green' });
                setTimeout(() => navigate('/login'), 1000);
            } else {
                setModalConfig({ show: true, message: data.message || 'Registration Failed', theme: 'red' });
            }
        } catch (error) {
            console.error("Error:", error);
            setModalConfig({ show: true, message: 'An error occurred. Check if the server is running', theme: 'red' });
        }
    }

    return (
        <>
            <div className="register-page">
                <div className="logo-wrapper">
                    <div className="logo-glow"></div>
                    <img src={logoImg} alt="Equitask Logo" id="logo-image" className="logo-image" />
                </div>

                <div className="register-card">
                    <h1 className="register-title" id="register-title">Please Enter Your Personal Information</h1>

                    <form id="register-form" onSubmit={handleSubmit}>
                        <FormInput
                            id='first-name' labelClass='register-label'
                            label='First Name' type='text'
                            placeholder='Enter your first name'
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                        />

                        <FormInput
                            id='last-name' labelClass='register-label'
                            label='Last Name' type='text'
                            placeholder='Enter your last name'
                            value={formData.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                        />

                        <FormInput
                            id='email-input' labelClass='register-label'
                            label='Email' type='email'
                            placeholder='Enter your email'
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />

                        <FormInput
                            id='password-input' labelClass='register-label'
                            label='Password' type='password'
                            placeholder='Enter your password'
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                        />

                        <FormInput
                            id='confirm-password' labelClass='register-label'
                            label='Confirm Password' type='password'
                            placeholder='Re enter your password'
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        />

                        <div className="register-btn-container">
                            <button type='submit' className="btn btn-login" id="register-btn">Register</button>
                        </div>
                    </form>
                </div>
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

