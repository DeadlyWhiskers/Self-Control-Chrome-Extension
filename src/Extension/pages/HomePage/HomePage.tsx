import { useEffect, useRef, useState } from 'react';
import AddWebsiteComponent from '../../widgets/AddWebsiteComponent';
import ContentBlock from '../../widgets/WebsiteBlock';
import StorageType from '../../shared/types/StorageType';
import './HomePage.css'

// Completely rework the timer system

const HomePage = () => {

    const [siteList, setSiteList] = useState<StorageType[]>([]);
    const activeTabs = useRef<chrome.tabs.Tab[] | null>(null);
    const updateInterval = useRef<number | undefined>(undefined);
    const lastUpdate = useRef<number>(Date.now());
    const connectPort = useRef<chrome.runtime.Port | undefined>(undefined)
    const removeTab = useRef<number | undefined>(undefined);

    const handleStoreUpdates = (changes: { [key: string]: chrome.storage.StorageChange; }) => {
        if (changes.sites) fetchSites();
    }

    const handleTabsUpdate = () => {
        getActiveTabs()
    }

    const fetchSites = () => {
        chrome.storage.sync.get({ sites: [] as StorageType[] }, (result: { sites: StorageType[], lastUpdate: number }) => {
            setSiteList(result.sites);
            lastUpdate.current = result.lastUpdate
        })
    }

    const getActiveTabs = () => {
        chrome.tabs.query(({ active: true }), (tabs) => {
            activeTabs.current = tabs;
            console.log(activeTabs.current[0].url)
        })
    }

    useEffect(() => {
        chrome.storage.sync.onChanged.addListener(handleStoreUpdates)
        chrome.tabs.onActivated.addListener(handleTabsUpdate)
        connectPort.current = chrome.runtime.connect({ name: 'sites-sync' });

        fetchSites()
        getActiveTabs()

        chrome.runtime.onSuspend.addListener(() => {
            chrome.tabs.onActivated.removeListener(handleTabsUpdate)
            chrome.storage.sync.onChanged.removeListener(handleStoreUpdates)
            clearInterval(updateInterval.current)
            chrome.storage.sync.set({ sites: siteList, lastUpdate: Date.now() }, () => {

            })
        })

        updateInterval.current = setInterval(() => {
            const now = Date.now();
            const delta = now - lastUpdate.current;
            lastUpdate.current = now;
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
                return updatedEl
            }))
            // connectPort.current?.postMessage({type: 'save list', content: [...siteList]})
        }, 1000)
        return () => {
            // only when switching extension pages, maybe useless
            chrome.tabs.onActivated.removeListener(handleTabsUpdate)
            chrome.storage.sync.onChanged.removeListener(handleStoreUpdates)
            clearInterval(updateInterval.current)
            connectPort.current?.disconnect()
            // chrome.storage.sync.set({sites: siteList}, () => {
            //     chrome.storage.sync.set({lastUpdate: Date.now()})
            // })
        }
    }, [])

    useEffect(() => {
        if (connectPort.current) connectPort.current?.postMessage({ type: 'sendToServiceWorker', content: {sitesList: siteList, lastUpdate: lastUpdate.current} })
        if (removeTab.current) {
            console.log('removing')
            chrome.tabs.remove(removeTab.current)
            removeTab.current = undefined
        }
    }, [siteList])

    return <div className='list-layout'>
        {siteList && siteList.map((el, i) => {
            return <ContentBlock key={i} elementId={i} siteName={el.name} siteURL={el.address} limitTime={el.limitTime} cooldownTime={el.cooldownTime} limitRemaining={el.limitRemaining} cooldownRemaining={el.cooldownRemaining} />
        })}
        <AddWebsiteComponent />
    </div>;
};

export default HomePage;