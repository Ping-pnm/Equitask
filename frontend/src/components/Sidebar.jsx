import { useState } from 'react';

import ClassButton from './ClassButton';
import CreateClassModal from './CreateClassModal';

export default function Sidebar() {
    const [isCreateClass, setCreateClass] = useState(false);

    return (
        <aside className="sidebar">
            <div className="class-list-container">
                <ul id="class-list" className="class-list">
                    <ClassButton isActive>Class 1</ClassButton>
                    <ClassButton>Class 2</ClassButton>
                </ul>
            </div>

            <button id="btn-create-class" className="btn-create-class-sidebar" onClick={() => setCreateClass(true)}> + Create New Class</button>

            {isCreateClass && <CreateClassModal onClose={() => setCreateClass(false)} />}
        </aside>
    );
}