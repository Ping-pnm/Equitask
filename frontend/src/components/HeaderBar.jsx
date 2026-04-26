import { Link } from 'react-router-dom';

import equitaskLogo from '../assets/logo-primary.png';
import equitaskWord from '../assets/logo-word.png';

export default function HeaderBar() {
    return <header className="top-header">
        <div className="logo-area">
            <div className="logo-icon-wrapper">
                <Link to='/'><img src={equitaskLogo} alt="E Logo" className="side-logo-img" /></Link>
            </div>
            <Link to='/'><img src={equitaskWord} alt="Equitask" className="logo-text" /></Link>
        </div>
    </header>
}