import HeaderBar from "../components/HeaderBar"
import Sidebar from "../components/Sidebar"
import TabHeader from "../components/TabHeader"
import WorkPost from "../components/WorkPost";
import ProjectOverview from "../components/Dashboard/ProjectOverview";
import GroupProjectDetail from "../components/Dashboard/GroupProjectDetail";
import TaskDetail from "../components/Dashboard/TaskDetail";
import EditGroupModal from "../components/Dashboard/EditGroupModal";
import AddTaskModal from "../components/Dashboard/AssTaskModal";
import Assignment from "../components/Dashboard/Assignment";

import checkListIcon from '../assets/checklist-icon.png'


export default function Dashboard() {
    return (
        < section id="dashboard-listing-view" className="stream-content" >
            <div id="assignments-container" className="posts-container">
                {/* Assignment 1: Group Project (clickable) */}
                <WorkPost title='Group Project' date='31 DEC' />

                {/* Assignment 2: Homework 1 (clickable) */}
                <WorkPost title='Homework 1' date='20 NOV' />
            </div>
        </section >

        // {/* VIEW 2: Group Project Detail (hidden by default) */}
        // <ProjectOverview title='Group Project' />

        // {/* VIEW 3: Specific Group detail (hidden by default) */}
        // <GroupProjectDetail />

        // {/* VIEW 4: Task detail (hidden by default) */}
        // <TaskDetail />

        // {/* VIEW 5: Homework 1 Detail (hidden by default) */}
        // <Assignment />
    );
}