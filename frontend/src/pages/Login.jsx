import FormInput from '../components/LoginRegister/FormInput';
import logoImg from '../assets/logo-primary.png';

export default function Login() {
    return(
        <div className="login-card">
            {/* Logo */}
            <div className="logo-wrapper">
                <div className="logo-glow"></div>
                <img src={logoImg} alt="Equitask Logo" id="logo-image" className="logo-image" />
            </div>

            {/* Form */}
            <form id="login-form">
                <FormInput
                    type="email"
                    id="email-input" 
                    placeholder="Your email......." 
                    autoComplete="email"
                />
                    

                <FormInput                   
                    type="password"
                    id="password-input" 
                    placeholder="Password......." 
                    autoComplete="current-password"
                />

                {/* Button */}
                <div className="buttons-container">
                    <a href="register.html" className="btn btn-register" id="register-btn">Register</a>
                    <button type="submit" className="btn btn-login" id="login-btn">Login</button>
                </div>
            </form>
        </div>
    )
}

