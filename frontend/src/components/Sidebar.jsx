import React from 'react';
import ClassButton from './ClassButton';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="class-list-container">
                <ul id="class-list" className="class-list">
                    <ClassButton isActive>Class 1</ClassButton>
                    <ClassButton>Class 2</ClassButton>
                </ul>
            </div>

            <button id="btn-create-class" className="btn-create-class-sidebar"> + Create New Class</button>
        </aside>
    );
}