import { Outlet } from "react-router-dom";
import "./Layout.css"
import { LayoutHeader } from "../../../shared/ui/LayoutHeader";

export const Layout = () => {
    return (
        <div className="layout">
            <LayoutHeader/>
            <Outlet/>
        </div>
    );
};
