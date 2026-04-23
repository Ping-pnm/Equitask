import React from 'react';

import HeaderBar from '../components/HeaderBar';
import Sidebar from '../components/Home/Sidebar';
import StreamPost from '../components/Home/StreamPost';
import CreateClassModal from '../components/Home/createClassModal';
import ComposeModal from '../components/Home/composeModal';

import penIcon from '../assets/pen-icon.png';


export default function HomePage() {
    return (
        <div className="homepage-body">
            <div className="layout-container">
                <HeaderBar />

                {/* Bottom layer: Sidebar + Main */}
                <div className="content-wrapper">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <main className="main-content">
                        {/* Tabs Navbar */}
                        <header className="top-nav">
                            <nav className="tabs">
                                <a href="homepage.html" className="tab-item active">Stream</a>
                                <a href="classwork.html" className="tab-item">Work</a>
                                <a href="people.html" className="tab-item">People</a>
                                <a href="dashboard.html" className="tab-item">Dashboard</a>
                            </nav>
                        </header>

                        {/* Stream Content */}
                        <section className="stream-content">
                            <div id="posts-container" className="posts-container">
                                {/* Initial Post 1 */}
                                <StreamPost title='Group Project' author="Sasiporn Usanavasin" date='31 DEC' />
                                {/* Initial Post 2 */}
                                <StreamPost title='Homework1' author="Sasiporn Usanavasin" date='20 DEC' />
                            </div>
                        </section>

                        {/* Compose Button */}
                        <button id="btn-compose" className="btn-compose" onClick="openModal('modal-compose')">
                            <img src={penIcon} alt="Compose" className="pencil-icon" /> Compose
                        </button>
                    </main>
                </div>
            </div>

            {/* Modals */}
            {/* Create Class Modal */}
            <CreateClassModal />

            {/* Compose Modal */}
            <ComposeModal />

        </div>
    );
}
