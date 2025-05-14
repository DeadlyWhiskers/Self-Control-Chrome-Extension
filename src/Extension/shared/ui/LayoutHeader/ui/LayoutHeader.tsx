import { Link, useLocation } from "react-router-dom";

import SettingsIcon from '../../../assets/LayoutHeader/Settings Button.svg'
import CloseButton from '../../../assets/LayoutHeader/Close Button.svg'
import "./LayoutHeader.css"
import { useEffect, useState } from "react";

export const LayoutHeader = () => {

    const location = useLocation();
    const [headerButtonIcon, setHeaderButtonIcon] = useState(SettingsIcon);
    const [linkTo, setLinkTo] = useState('/');

    useEffect(() => {
        setHeaderButtonIcon(location.pathname === '/index.html' ? SettingsIcon : CloseButton);
        setLinkTo(location.pathname === '/index.html' ? 'settings' : '');
    }, [location]);

    return(
        <div className="layout-header">
            <div className="header-spacer" />
            <div className="header-title">
                Self-Control Extension
            </div>
            <Link to={linkTo} className="header-button">
                <img src={headerButtonIcon} alt="settings" height="20" width="20"/>
            </Link>
        </div>
    );
}
