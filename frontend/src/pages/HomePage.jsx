import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useClass } from '../components/ClassContext';
import { getStreamFeed } from '../services/classService';

import StreamPost from '../components/Home/StreamPost';
import Announcement from '../components/Announcement';
import ComposeModal from '../components/Home/composeModal';
import LoadingSpinner from '../components/LoadingSpinner';

import penIcon from '../assets/pen-icon.png';


export default function HomePage() {
    const { userId } = useAuth();
    const { activeClassId } = useClass();
    const [feeds, setFeeds] = useState([]);
    const [isCompose, setCompose] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStreamFeed() {
            if (!activeClassId) return; // Don't fetch if no class is selected
            setIsLoading(true);
            try {
                const res = await getStreamFeed(activeClassId);
                setFeeds(res);
            } catch (err) {
                console.error("Fail to load Stream Feed");
            } finally {
                setIsLoading(false);
            }
        }
        loadStreamFeed();
    }, [userId, activeClassId]); // Added activeClassId here

    if (isLoading) return <LoadingSpinner />;

    return (
        <>
            {/* Stream Content */}
            < section className="stream-content" >
                <div id="posts-container" className="posts-container">
                    {feeds.map((feed) => (
                        feed.type === 'announcement' ? (
                            <Announcement 
                                key={feed.announcementId || feed.id}
                                author={`${feed.firstName} ${feed.lastName}`}
                                date={feed.createdAt} 
                                content={feed.content} 
                            />
                        ) : (
                            <StreamPost 
                                key={feed.assignmentId || feed.id}
                                title={feed.title} 
                                author={`${feed.firstName} ${feed.lastName}`}
                                date={feed.createdAt} 
                            />
                        )
                    ))}
                </div>
            </section >

            {/* Compose Button */}
            < button id="btn-compose"
                className="btn-compose"
                onClick={() => setCompose(true)
                }>
                <img src={penIcon} alt="Compose" className="pencil-icon" /> Compose
            </button >
        </>

    );
}
