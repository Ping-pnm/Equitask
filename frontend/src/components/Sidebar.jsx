import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useClass } from './ClassContext';
import { getAllClasses } from '../services/classService';

import ClassButton from './ClassButton';
import CreateClassModal from './CreateClassModal';
import LoadingSpinner from './LoadingSpinner';

export default function Sidebar() {
    const { userId, logout } = useAuth();
    const { activeClassId, setActiveClassId, updateRole } = useClass();

    const [isCreateClass, setCreateClass] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [classes, setClasses] = useState([]);

    //run once when the page loads
    const fetchClasses = useCallback(() => {
        async function loadData() {
            try {
                const data = await getAllClasses(userId);
                setClasses(data);
                // Set the first class as active by default
                if (data.length > 0) setActiveClassId(data[0].classId);
            } catch (error) {
                console.error("Failed to load classes:", error);
            } finally {
                setIsLoading(false)
            }
        }
        loadData();
    }, [userId]);

    useEffect(() => {
        fetchClasses();
    }, [userId, fetchClasses]);

    // Update the global isLeader state whenever the active class changes
    useEffect(() => {
        if (activeClassId && classes.length > 0) {
            const currentClass = classes.find(c => c.classId === activeClassId);
            if (currentClass) {
                updateRole(currentClass.role);
            }
        }
    }, [activeClassId, classes, updateRole]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <aside className="sidebar">
            <div className="class-list-container">
                <ul id="class-list" className="class-list">
                    {classes.length > 0 ? (
                        classes.map((cls) => (
                            <ClassButton
                                key={cls.classId}
                                isActive={cls.classId === activeClassId}
                                onClick={() => setActiveClassId(cls.classId)}
                                title={cls.title}
                                section={cls.section}
                                subject={cls.subject}
                            />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '20px' }}>No classes joined yet.</p>
                    )}
                </ul>
            </div>

            <button id="btn-create-class" className="btn-create-class-sidebar" onClick={() => setCreateClass(true)}> + Create New Class</button>
            <button id="btn-logout" className="btn-logout-sidebar" onClick={logout}>Log Out</button>

            {isCreateClass && <CreateClassModal onClassCreated={fetchClasses} onClose={() => setCreateClass(false)} />}
        </aside>
    );
}