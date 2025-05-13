import StorageType from "../shared/types/StorageType"
import SettingsType from "../shared/types/SettingsType"

const initStorage = () => {
    chrome.runtime.onInstalled.addListener(() => {
        chrome.storage.sync.set({sites: [] as StorageType[], lastUpdate: Date.now(), showLimit: true, showCooldown: true, homeURL: 'https://www.google.com/'}, () => {
        })
    })
}

const fetchSites = (): Promise<{ sites: StorageType[], lastUpdate: number }> => {
    return new Promise((resolve) => {
        chrome.storage.sync.get({ sites: [] as StorageType[], lastUpdate: Date.now() as number }, (result: { sites: StorageType[], lastUpdate: number }) => {
            resolve(result)
        })
    })
}

const getActiveTabs = (): Promise<chrome.tabs.Tab[]> => {
return new Promise(resolve => {
    chrome.tabs.query(({ active: true }), (tabs) => {
        resolve(tabs)
    })    
})
}

const getTabsQuantity = (): Promise<number> => {
    return new Promise(resolve => {
        chrome.tabs.query(({}), (tabs: chrome.tabs.Tab[]) => {
            resolve(tabs.length)
        })
    })
}

const fetchSettings = (): Promise<SettingsType> => {
    return new Promise((resolve) => {
        chrome.storage.sync.get({ showLimit: true as boolean, showCooldown: true as boolean, homeURL: 'https://www.google.com/' as string }, (result: { showLimit: boolean, showCooldown: boolean, homeURL: string }) => {
            resolve(result)
        })
    })
}


const connectToPopup = () => {
    let sitesBuffer: { sitesList: StorageType[], lastUpdate: number } = {sitesList: [], lastUpdate: 0}
    chrome.runtime.onConnect.addListener((port) => {
        chrome.storage.local.set({isPopupOpened: true})
        const handleMessage = (message: { content: { sitesList: StorageType[], lastUpdate: number }, type: string }) => {
            console.log(message.content.lastUpdate, ' ', Date.now(), ' ', message.content.lastUpdate-Date.now())
            switch (message.type) {
                case ('updateSiteList'):
                    if (sitesBuffer && sitesBuffer?.lastUpdate < message.content.lastUpdate)
                        sitesBuffer = structuredClone(message.content)
                    break;
            }
        }

        port.onMessage.addListener(handleMessage)

        port.onDisconnect.addListener(() => {
            chrome.storage.local.set({isPopupOpened: false})
            if (sitesBuffer && sitesBuffer.sitesList.length > 0) chrome.storage.sync.set({ sites: sitesBuffer.sitesList, lastUpdate: sitesBuffer.lastUpdate }, () => {
                port.onMessage.removeListener(handleMessage);
            })
        })
    })
}

const getPopupOpened = () => {
    return new Promise(resolve => chrome.storage.local.get({isPopupOpened: false}, (result: {isPopupOpened: boolean}) => {
        resolve(result.isPopupOpened)
    }))
}

const backgroundTick = async () => {
    try{
        const isPopupOpened = await getPopupOpened();
        if(!isPopupOpened){
                const siteResult = await fetchSites()
                const sitesList = siteResult.sites
                const lastUpdate = siteResult.lastUpdate
                const activeTabs = await getActiveTabs()
                const tabsQuantity = await getTabsQuantity()
                const settings = await fetchSettings()
                const homeURL = settings.homeURL
                const now = Date.now();
                const delta = now - lastUpdate
                const newSitesList = sitesList.map(el => {
                    let updatedEl = { ...el };
                    if(delta > updatedEl.cooldownRemaining) {
                        const newDelta = delta%updatedEl.cooldownRemaining;
                        updatedEl.cooldownRemaining = Math.max(0, updatedEl.cooldownRemaining - newDelta);
                        updatedEl.limitRemaining = updatedEl.limitTime;
                    }
                    else updatedEl.cooldownRemaining = Math.max(0, updatedEl.cooldownRemaining - delta);
                    if (updatedEl.cooldownRemaining === 0) {
                        updatedEl.cooldownRemaining = updatedEl.cooldownTime;
                        updatedEl.limitRemaining = updatedEl.limitTime;
                    }
                    else{
                        activeTabs?.forEach((activeTab: chrome.tabs.Tab) => {
                            if (activeTab.url?.startsWith(updatedEl.address)) {
                                updatedEl.limitRemaining = Math.max(0, updatedEl.limitRemaining - delta);
                                if (updatedEl.limitRemaining === 0 && activeTab.id !== undefined) {
                                    chrome.tabs.remove(activeTab.id)
                                    if(tabsQuantity === 1){
                                        let removeId = activeTab.id
                                        chrome.tabs.create({url: homeURL}, () => {
                                            if (removeId) chrome.tabs.remove(removeId)
                                        })
                                        }
                                        else chrome.tabs.remove(activeTab.id)
                                }
                            }
                        })
                    }
                    return updatedEl
                })
                chrome.storage.sync.set({ sites: newSitesList, lastUpdate: Date.now() }, () => { })
            }
    }
    catch(e){
        console.log(e)
    }
}

const init = () => {
    initStorage();
    connectToPopup();
    backgroundTick();
}

init()



chrome.tabs.onActivated.addListener(backgroundTick)
chrome.tabs.onUpdated.addListener(backgroundTick)

chrome.alarms.create('tick', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name == 'tick') {
        backgroundTick();
    }
})