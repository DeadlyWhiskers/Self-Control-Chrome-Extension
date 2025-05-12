import { useEffect, useRef, useState } from 'react';
import AddWebsiteComponent from '../../widgets/AddWebsiteComponent';
import ContentBlock from '../../widgets/WebsiteBlock';
import StorageType from '../../shared/types/StorageType';
import SettingsType from '../../shared/types/SettingsType';
import { fetchSites, getActiveTabs, fetchSettings } from '../../shared/chromeGetters';
import './HomePage.css'
import MStoTime from '../../shared/SecondsToTime';

// Completely rework the timer system

const HomePage = () => {

    const [siteList, setSiteList] = useState<StorageType[]>([]);
    const activeTabs = useRef<chrome.tabs.Tab[] | null>(null);
    const updateInterval = useRef<number | undefined>(Date.now());
    const lastUpdate = useRef<number>(Date.now());
    const connectPort = useRef<chrome.runtime.Port | undefined>(undefined)
    const removeTab = useRef<number | undefined>(undefined);
    const settings = useRef<SettingsType | undefined>(undefined)

    const handleStoreUpdates = async (changes: { [key: string]: chrome.storage.StorageChange; }) => {
        if (changes.sites) {
            const siteResult = await fetchSites()
            setSiteList(siteResult.sites)
            lastUpdate.current = siteResult.lastUpdate
        }
    }

    const handleTabsUpdate = async () => {
        activeTabs.current = await getActiveTabs()
    }

    // Create an async function for initialization + async function fro closing tab (if possible (i don't think so))
    useEffect(() => {

        const Initialize = async () => {
            chrome.storage.sync.onChanged.addListener(handleStoreUpdates)
            chrome.tabs.onActivated.addListener(handleTabsUpdate)
            connectPort.current = chrome.runtime.connect({ name: 'sitesSync' });
            
            activeTabs.current = await getActiveTabs()
            settings.current = await fetchSettings()
            const siteResult = await fetchSites()
            setSiteList(siteResult.sites)
            // lastUpdate.current = siteResult.lastUpdate
    
            updateInterval.current = setInterval(() => {
                const now = Date.now();
                const delta = now - lastUpdate.current;
                lastUpdate.current = now;
                console.log('Interval values: now:', now, 'lastUpdate current:' ,lastUpdate.current)
                console.log(delta)
                setSiteList((prevList) => prevList.map(el => {
                    let updatedEl = { ...el };
                    activeTabs.current?.forEach((activeTab: chrome.tabs.Tab) => {
                        if (activeTab.url?.startsWith(updatedEl.address)) {
                            updatedEl.limitRemaining = Math.max(0, updatedEl.limitRemaining - delta);
                            if (updatedEl.limitRemaining === 0 && activeTab.id !== undefined) {
                                console.log('the tab will be closed')
                                removeTab.current = activeTab.id;
                            }
                        }
                    })
                    updatedEl.cooldownRemaining = Math.max(0, updatedEl.cooldownRemaining - delta);
                    if (updatedEl.cooldownRemaining === 0) {
                        updatedEl.cooldownRemaining = updatedEl.cooldownTime;
                        updatedEl.limitRemaining = updatedEl.limitTime;
                    }
                    console.log(updatedEl)
                    return updatedEl
                }))
            }, 1000)
        }

        Initialize()

        return () => {
            // only when switching extension pages
            chrome.tabs.onActivated.removeListener(handleTabsUpdate)
            chrome.storage.sync.onChanged.removeListener(handleStoreUpdates)
            clearInterval(updateInterval.current)
            connectPort.current?.disconnect()
        }
    }, [])

    useEffect(() => {
        if (connectPort.current) connectPort.current?.postMessage({ type: 'updateSiteList', content: {sitesList: siteList, lastUpdate: lastUpdate.current} })
        if (removeTab.current) {
            console.log('removing')
            chrome.tabs.remove(removeTab.current)
            removeTab.current = undefined
        }
    }, [siteList])

    return <div className='list-layout'>
        {siteList && siteList.map((el, i) => {
            return <ContentBlock 
            key={i} 
            elementId={i} 
            siteName={el.name} 
            siteURL={el.address} 
            limitTime={el.limitTime} 
            cooldownTime={el.cooldownTime} 
            limitRemaining={settings.current?.showLimit ? MStoTime(el.limitRemaining) : '●'} 
            cooldownRemaining={settings.current?.showCooldown ? MStoTime(el.cooldownRemaining) : '●'} 
            isLimitEnded={el.limitRemaining > 0} />
        })}
        <AddWebsiteComponent />
    </div>;
};

export default HomePage;