export default function ClassButton({ onClick, isActive, children }) {
    return <li><a href="#" onClick={onClick} className={"class-item " + (isActive ? "active" : "")}>{children}</a></li>;
}