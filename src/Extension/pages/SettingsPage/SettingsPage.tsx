import { useState } from 'react';
import Slider from '../../widgets/Slider';
import './SettingsPage.css'

const SettingsPage = () => {

    const [showRemainingTime, setShowRemainingTime] = useState(false);
    const [showCooldownTime, setShowCooldownTime] = useState(false);

    return <div className='list-layout'>
        <div className="content-block content-block--large">
            <div className="input-line">
                <span className="title">
                    Home page:
                </span>
                <input type="text" className="input-field"placeholder="google.com"/>
            </div>
        </div>
        <div className="content-block content-block--large">
            <div className="input-line">
                <span className="title">
                    Show remaining time
                </span>
                <Slider id={'remainingTimeSwitch'} checked={showRemainingTime} onChange={() => (setShowRemainingTime(!showRemainingTime))}/>
            </div>
        </div>
        <div className="content-block content-block--large">
            <div className="input-line">
                <span className="title">
                    Show cooldown time
                </span>
                <Slider id={'cooldownTimeSwitch'} checked={showCooldownTime} onChange={() => (setShowCooldownTime(!showCooldownTime))}/>
            </div>
        </div>
    </div>;
};

export default SettingsPage;