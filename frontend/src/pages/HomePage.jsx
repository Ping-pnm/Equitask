import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { useClass } from '../components/ClassContext';
import { deleteAnnouncement, deleteFile, getStreamFeed } from '../services/classService';

import WorkPost from '../components/WorkPost';
import Announcement from '../components/Home/Announcement';
import ComposeModal from '../components/Home/composeModal';
import LoadingSpinner from '../components/LoadingSpinner';

import penIcon from '../assets/pen-icon.png';


export default function HomePage() {
    const { userId } = useAuth();
    const { activeClassId, isLeader } = useClass();
    const [feeds, setFeeds] = useState([]);
    const [isCompose, setIsCompose] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStreamFeeds = useCallback(() => {
        async function loadStreamFeed() {
            if (!activeClassId) { setIsLoading(false); return }; // Don't fetch if no class is selected
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

    const handleDeleteAnnouncement = async (announcementId) => {
        if (!window.confirm("Are you sure you want to delete this announcement?")) return;
        try {
            await deleteAnnouncement(announcementId);
            fetchStreamFeeds(); // Refresh feed
        } catch (err) {
            console.error("Failed to delete announcement:", err);
            alert("Failed to delete announcement");
        }
    };

    const handleDeleteFile = async (fileId) => {
        if (!window.confirm("Are you sure you want to delete this attachment?")) return;
        try {
            await deleteFile(fileId);
            fetchStreamFeeds(); // Refresh feed to show updated attachments
        } catch (err) {
            console.error("Failed to delete file:", err);
            alert("Failed to delete attachment");
        }
    };

    useEffect(() => {
        fetchStreamFeeds();
    }, [userId, activeClassId]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <>
            {/* Stream Content */}
            < section className="stream-content" >
                <div id="posts-container" className="posts-container">
                    {feeds.length > 0 ? (
                        feeds.map((feed) => (
                            feed.type === 'announcement' ? (
                                <Announcement
                                    key={feed.announcementId || feed.id}
                                    author={`${feed.firstName} ${feed.lastName}`}
                                    date={feed.createdAt}
                                    content={feed.content}
                                    files={feed.files}
                                    canDelete={isLeader || feed.creatorId === userId}
                                    onDelete={() => handleDeleteAnnouncement(feed.announcementId)}
                                    onDeleteFile={handleDeleteFile}
                                    currentUserId={userId}
                                    creatorId={feed.creatorId}
                                />
                            ) : (
                                <WorkPost
                                    key={feed.assignmentId || feed.id}
                                    title={feed.title}
                                    author={`${feed.firstName} ${feed.lastName}`}
                                    date={new Date(feed.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    assignmentId={feed.assignmentId || feed.id}
                                    onClick={(id) => {
                                        if (isLeader) {
                                            if (feed.isGroupWork) {
                                                navigate(`/assignment/${id}`, { state: { from: 'Work' } });
                                            } else {
                                                navigate(`/leader-assignment/${id}`, { state: { from: 'Work' } });
                                            }
                                        } else {
                                            if (feed.isGroupWork) {
                                                navigate(`/assignment/${id}`, { state: { from: 'Work' } });
                                            } else {
                                                navigate(`/group-assignment/${id}`, { state: { from: 'Work' } });
                                            }
                                        }
                                    }}
                                />
                            )
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '100px 0', color: '#888' }}>
                            <p style={{ fontSize: '18px', fontWeight: '500' }}>No assignments or announcements yet.</p>
                            <p style={{ fontSize: '14px' }}>This is where you'll see updates from your teacher.</p>
                        </div>
                    )}
                </div>
            </section >

            {/* Compose Button */}
            < button id="btn-compose"
                className="btn-compose"
                onClick={() => setIsCompose(true)
                }>
                <img src={penIcon} alt="Compose" className="pencil-icon" /> Compose
            </button >

            {isCompose && <ComposeModal fetchFeeds={fetchStreamFeeds} onClose={() => setIsCompose(false)} />}
        </>

    );
}
