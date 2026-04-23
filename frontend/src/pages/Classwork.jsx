import HeaderBar from "../components/HeaderBar";
import CreateClassModal from "../components/CreateClassModal";
import TabHeader from "../components/TabHeader";
import AssingmentDetail from "../components/Work/AssignmentDetail";
import AssignModal from "../components/Work/AssignModal";
import EditAssignmentModal from "../components/Work/EditAssignmentModal";
import CreateGroupModal from "../components/Work/CreateGroupModal";
import Sidebar from "../components/Sidebar";


import WorkPost from "../components/Work/WorkPost"



export default function Classwork() {
    return (
        <div className="homepage-body">
            <div className="layout-container">
                {/* Top layer: Grey rectangle */}
                <HeaderBar />

                {/* Bottom layer: Sidebar + Main */}
                <div className="content-wrapper">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <main className="main-content">
                        {/* Tabs Navbar */}
                        <TabHeader activeAt='Work' />

                        {/* Classwork Content */}
                        <section className="stream-content stream-content-scrollable">
                            <div id="assignments-container" className="posts-container">
                                {/* Assignment 1 */}
                                <WorkPost title='Group Project' date='31 DEC' />

                                {/* Assignment 2 */}
                                <WorkPost title='Homework1' date='21 SEP' />
                            </div>

                            {/* Assignment Detail View */}
                            <AssingmentDetail />
                        </section>

                        {/* Assign Button */}
                        <button id="btn-assign" className="btn-compose btn-assign-custom">
                            <span className="btn-assign-icon">+</span> Assign
                        </button>
                    </main>
                </div>
            </div>

            {/* Modals */}
            {/* Create Class Modal */}
            <CreateClassModal />

            {/* Assign Modal */}
            <AssignModal />

            {/* Edit Assignment Modal */}
            <EditAssignmentModal />

            {/* Create Group Modal */}
            <CreateGroupModal />
        </div>
    )
}