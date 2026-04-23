

export default function ClassButton({ isActive, children }) {
    return <li><a href="#" className={"class-item " + (isActive ? "active" : "")}>{children}</a></li>;
}