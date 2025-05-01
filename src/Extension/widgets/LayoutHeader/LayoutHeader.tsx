import { Link } from "react-router-dom";
import SettingsIcon from './assets/Settings Button.svg'
import "./LayoutHeader.css"

const LayoutHeader = () => {
    return(
        <div className="layout-header">
            <div className="header-spacer" />
            <div className="header-title">
                Self-Control Extension
            </div>
            <Link to="settings" className="header-button">
                <img src={SettingsIcon} alt="settings" height="20" width="20"/>
            </Link>
        </div>
    );
}

export default LayoutHeader