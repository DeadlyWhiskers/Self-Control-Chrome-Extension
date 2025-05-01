import { Link, Outlet } from "react-router-dom";
import "./Layout.css"

const Layout = () => {
    return (
        <div className="layout">
            <Link to="">
                Home
            </Link>
            <Link to="settings">
                Settings
            </Link>
            <Outlet/>
        </div>
    );
};

export default Layout;