import HeaderBar from "../components/HeaderBar";
import Sidebar from "../components/Sidebar";
import TabHeader from "../components/TabHeader";
import RoleHeader from "../components/People/RoleHeader";
import PeopleIcon from "../components/People/PeopleIcon.";
import PeopleRow from "../components/People/PeopleRow";
import SelectDelete from "../components/People/SelectDelete";
import InviteModal from "../components/People/InviteModal";

export default function People() {
    return (
        <section className="people-content-area people-content">

            {/**/}
            <div className="people-section-spacing people-section">
                <RoleHeader role='Leaders' />
                <div className="person-row-content person-row">
                    <PeopleRow name='Sasiporn' />
                </div>

            </div>

            {/**/}
            <div className="people-section">
                <RoleHeader role='Members' />

                <div className="members-action-bar members-actions">
                    <SelectDelete />
                </div>

                <div className="people-list-container-lg people-list">
                    {/**/}
                    <PeopleRow name='Phinnawat' isLeader />

                    {/**/}
                    <PeopleRow name='Phinnawat' isLeader />

                    {/**/}
                    <PeopleRow name='Phinnawat' isLeader />
                </div>
            </div>
        </section>
    );
}