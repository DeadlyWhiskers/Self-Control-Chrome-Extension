import { useEffect, useState } from 'react';
import Slider from '../../widgets/Slider';
import './SettingsPage.css'
import { fetchSettings } from '../../shared/chromeGetters';
import SettingsType from '../../shared/types/SettingsType';

const SettingsPage = () => {

    const [showRemainingTime, setShowRemainingTime] = useState(false);
    const [showCooldownTime, setShowCooldownTime] = useState(false);

    const changeShowLimit = () => {
        chrome.storage.sync.set({showLimit: !showRemainingTime}, () => {
            setShowRemainingTime(!showRemainingTime)
        })
    }

    const changeShowCooldown= () => {
        chrome.storage.sync.set({showCooldown: !showCooldownTime}, () => {
            setShowCooldownTime(!showCooldownTime)
        })
    }

    useEffect(() => {

        const init = async () => {
            const settings: SettingsType = await fetchSettings();
            setShowRemainingTime(settings.showLimit)
            setShowCooldownTime(settings.showCooldown)
            
        }

        init();
    }, [])

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
                <Slider id={'remainingTimeSwitch'} checked={showRemainingTime} onChange={() => (changeShowLimit())}/>
            </div>
        </div>
        <div className="content-block content-block--large">
            <div className="input-line">
                <span className="title">
                    Show cooldown time
                </span>
                <Slider id={'cooldownTimeSwitch'} checked={showCooldownTime} onChange={() => (changeShowCooldown())}/>
            </div>
        </div>
    </div>;
};

export default SettingsPage;