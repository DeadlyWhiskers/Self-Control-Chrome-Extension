import { Outlet } from "react-router-dom";
import "./Layout.css"
import LayoutHeader from "./LayoutHeader/LayoutHeader";

const Layout = () => {
    return (
        <div className="layout">
            <LayoutHeader/>
            <Outlet/>
        </div>
    );
};

export default Layout;