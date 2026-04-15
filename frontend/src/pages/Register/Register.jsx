import './Register.css'
import logoImg from '../../assets/logo-primary.png';
import RegisterInput from '../../components/RegisterInput';


export default function Register() {
    return(
        <div class="register-page">
            {/* Logo */}
            <div className="logo-wrapper">
                <div className="logo-glow"></div>
                <img src={logoImg} alt="Equitask Logo" id="logo-image" className="logo-image" />
            </div>

            {/* Register Card */}
            <div className="register-card">
                <h1 className="register-title" id="register-title">Please Enter Your Personal Information</h1>

                <form id="register-form">

                    <RegisterInput
                        id='first-name' labelClass='register-label'
                        labelContent='First Name' type='text'
                        placeholder='Enter your first name'
                        autoComplete='given-name'
                    />

                    <RegisterInput 
                        id='last-name' 
                        labelClass='register-label'
                        labelContent='Last Name' 
                        type='text'
                        placeholder='Enter your last name'
                        autoComplete='family-name'
                    />

                    <RegisterInput
                        id='email-input' 
                        labelClass='register-label'
                        labelContent='Email' 
                        type='email'
                        placeholder='Enter your email'
                        autoComplete='email'
                    />

                    <RegisterInput
                        id='password-input' 
                        labelClass='register-label'
                        labelContent='Password' 
                        type='password'
                        placeholder='Enter your password'
                        autoComplete='new-password'
                    />

                    <RegisterInput
                        id='confirm-password' 
                        labelClass='register-label'
                        labelContent='Confirm Password' 
                        type='password'
                        placeholder='Re enter your password'
                        autoComplete='new-password'
                    />

                    <div className="register-btn-container">
                        <a className="btn btn-login" id="register-btn">Register</a>
                    </div>
                </form>
            </div>
        </div>
        
    );
}    
    
