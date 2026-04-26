import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getAllClasses } from '../services/classService';

import ClassButton from './ClassButton';
import CreateClassModal from './CreateClassModal';

export default function Sidebar() {
    const { userId } = useAuth();

    const [isCreateClass, setCreateClass] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [activeClassId, setActiveClassId] = useState(null);

    //run once when the page loads
    useEffect(() => {
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

    if (isLoading) return null;

    return (
        <aside className="sidebar">
            <div className="class-list-container">
                <ul id="class-list" className="class-list">
                    {classes.map((cls) => (
                        <ClassButton
                            key={cls.classId}
                            isActive={cls.classId === activeClassId}
                            onClick={() => setActiveClassId(cls.classId)}
                        >
                            {cls.title}
                        </ClassButton>
                    ))}
                </ul>
            </div>

            <button id="btn-create-class" className="btn-create-class-sidebar" onClick={() => setCreateClass(true)}> + Create New Class</button>

            {isCreateClass && <CreateClassModal onClose={() => setCreateClass(false)} />}
        </aside>
    );
}