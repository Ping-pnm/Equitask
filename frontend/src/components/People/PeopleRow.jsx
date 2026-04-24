import PeopleIcon from "./PeopleIcon.";

export default function PeopleRow({ name, isLeader }) {
    return (
        <div className="person-row-content person-row">
            {isLeader && <div className="custom-checkbox-box-interactive member-checkbox" data-selected="false"></div>}

            <PeopleIcon />

            <span className="person-name">{name}</span>
        </div>
    );
}