import StorageType from "../shared/types/StorageType"

const initStorage = () => {
    return new Promise((resolve) => {
        resolve(true)
    })
    // chrome.runtime.onInstalled.addListener(() => {
    //     chrome.storage.sync.set({sites: [] as StorageType[], lastUpdate: Date.now()}, () => {
    //         console.log('Setup complete!');
    //     })
    // })
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
                default: console.log('error')
            }
        }

        port.onMessage.addListener(handleMessage)

        port.onDisconnect.addListener(() => {
            chrome.storage.local.set({isPopupOpened: false})
            console.log('disconnected')
            if (sitesBuffer && sitesBuffer.sitesList.length > 0) chrome.storage.sync.set({ sites: sitesBuffer.sitesList, lastUpdate: sitesBuffer.lastUpdate }, () => {
                console.log('saved sites to sync storage')
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
        console.log(isPopupOpened)
        if(!isPopupOpened){
                const siteResult = await fetchSites()
                const sitesList = siteResult.sites
                const lastUpdate = siteResult.lastUpdate
                const activeTabs = await getActiveTabs()
                const now = Date.now();
                const delta = now - lastUpdate
                console.log(delta)
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
                                    console.log('the tab will be closed')
                                    chrome.tabs.remove(activeTab.id)
                                }
                            }
                        })
                    }
                    console.log(updatedEl)
                    return updatedEl
                })
                chrome.storage.sync.set({ sites: newSitesList, lastUpdate: Date.now() }, () => {
                    console.log('saved sites to sync storage on background')
                })
            }
    }
    catch(e){
        console.log(e)
    }
}

const init = async () => {
    await initStorage();
    connectToPopup();
    backgroundTick();
}

init()



chrome.tabs.onActivated.addListener(backgroundTick)
chrome.tabs.onUpdated.addListener(backgroundTick)

chrome.alarms.create('tick', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name == 'tick') {
        // 1 раз в минуту обновлять данные в sync 
        console.log('tick happened')
        backgroundTick();
    }
})