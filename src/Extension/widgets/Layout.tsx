import { Link, Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Link to="">
                Home
            </Link>
            <Link to="settings">
                Settings
            </Link>
            <Outlet/>
        </>
    );
};

export default Layout;