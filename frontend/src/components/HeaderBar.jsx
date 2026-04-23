import React from 'react';

import equitaskLogo from '../assets/logo-primary.png';
import equitaskWord from '../assets/logo-word.png';

export default function HeaderBar() {
    return <header className="top-header">
        <div className="logo-area">
            <div className="logo-icon-wrapper">
                <img src={equitaskLogo} alt="E Logo" className="side-logo-img" />
            </div>
            <img src={equitaskWord} alt="Equitask" className="logo-text" />
        </div>
    </header>
}