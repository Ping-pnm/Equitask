import FormInput from '../components/FormInput';
import logoImg from '../assets/logo-primary.png';

export default function Login() {
    return(
        <div class="login-card">
            {/* Logo */}
            <div class="logo-wrapper">
                <div class="logo-glow"></div>
                <img src={logoImg} alt="Equitask Logo" id="logo-image" class="logo-image" />
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
                <div class="buttons-container">
                    <a href="register.html" class="btn btn-register" id="register-btn">Register</a>
                    <button type="submit" class="btn btn-login" id="login-btn">Login</button>
                </div>
            </form>
        </div>
    )
}

