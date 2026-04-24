import logoImg from '../assets/logo-primary.png';
import FormInput from '../components/LoginRegister/FormInput';


export default function Register() {
    return(
        <div className="register-page">
            {/* Logo */}
            <div className="logo-wrapper">
                <div className="logo-glow"></div>
                <img src={logoImg} alt="Equitask Logo" id="logo-image" className="logo-image" />
            </div>

            {/* Register Card */}
            <div className="register-card">
                <h1 className="register-title" id="register-title">Please Enter Your Personal Information</h1>

                <form id="register-form">

                    <FormInput
                        id='first-name' labelClass='register-label'
                        label='First Name' type='text'
                        placeholder='Enter your first name'
                        autoComplete='given-name'
                    />

                    <FormInput 
                        id='last-name' 
                        labelClass='register-label'
                        label='Last Name' 
                        type='text'
                        placeholder='Enter your last name'
                        autoComplete='family-name'
                    />

                    <FormInput
                        id='email-input' 
                        labelClass='register-label'
                        label='Email' 
                        type='email'
                        placeholder='Enter your email'
                        autoComplete='email'
                    />

                    <FormInput
                        id='password-input' 
                        labelClass='register-label'
                        label='Password' 
                        type='password'
                        placeholder='Enter your password'
                        autoComplete='new-password'
                    />

                    <FormInput
                        id='confirm-password' 
                        labelClass='register-label'
                        label='Confirm Password' 
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
    
