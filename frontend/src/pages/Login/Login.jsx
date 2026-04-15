import './Login.css';
import FormInput from '../../components/FormInput';
import logoImg from '../../assets/logo-primary.png';

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
                <div className="form-group">
                    <FormInput
                        type="email"
                        id="email-input" 
                        placeholder="Your email......." 
                        autocomplete="email"
                    />
                </div>
                    

                <div className="form-group">
                    <FormInput                   
                        type="password"
                        id="password-input" 
                        placeholder="Password......." 
                        autocomplete="current-password"
                    />
                </div>

                {/* Button */}
                <div class="buttons-container">
                    <a href="register.html" class="btn btn-register" id="register-btn">Register</a>
                    <button type="submit" class="btn btn-login" id="login-btn">Login</button>
                </div>
            </form>
        </div>
    )
}

