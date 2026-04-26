import { useState } from 'react';

import HeaderBar from '../components/HeaderBar';
import Sidebar from '../components/Sidebar';
import StreamPost from '../components/Home/StreamPost';
import ComposeModal from '../components/Home/composeModal';
import TabHeader from '../components/TabHeader';

import penIcon from '../assets/pen-icon.png';


export default function HomePage() {
    const [isCompose, setCompose] = useState(false)

    return (
        <>
            {/* Stream Content */}
            < section className="stream-content" >
                <div id="posts-container" className="posts-container">
                    {/* Initial Post 1 */}
                    <StreamPost title='Group Project' author="Sasiporn Usanavasin" date='31 DEC' onClick />
                    {/* Initial Post 2 */}
                    <StreamPost title='Homework1' author="Sasiporn Usanavasin" date='20 DEC' />
                </div>
            </section >

            {/* Compose Button */}
            < button id="btn-compose" className="btn-compose" onClick={() => setCompose(true)
            }>
                <img src={penIcon} alt="Compose" className="pencil-icon" /> Compose
            </button >
        </>

    );
}
