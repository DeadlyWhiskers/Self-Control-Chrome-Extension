import StorageType from "../shared/types/StorageType"

const initStorage = () => {
    // chrome.runtime.onInstalled.addListener(() => {
    //     chrome.storage.sync.set({sites: [] as StorageType[], lastUpdate: Date.now()}, () => {
    //         console.log('Setup complete!');
    //     })
    // })
}

const connectToPopup = () => {
    let sitesBuffer: {sitesList:StorageType[], lastUpdate: number} | undefined = undefined
    chrome.runtime.onConnect.addListener((port) => {
        const handleMessage = (message: {content: {sitesList: StorageType[], lastUpdate: number}, type: string}) => {
            console.log('some message')
            switch(message.type){
                case ('sendToServiceWorker'):
                    console.log(message.content)
                    sitesBuffer = structuredClone(message.content)
                    break;
                default: console.log('error')
            }
        }

        port.onMessage.addListener(handleMessage)

        port.onDisconnect.addListener(() => {
            console.log('disconnected')
            if(sitesBuffer && sitesBuffer.sitesList.length > 0) chrome.storage.sync.set({sites: sitesBuffer.sitesList, lastUpdate: sitesBuffer.lastUpdate}, () => {
                console.log('saved sites to sync storage')
                port.onMessage.removeListener(handleMessage);
            })
            // chrome.storage.local.get({ sites: [] as StorageType[], lastUpdate: Date.now() as number }, (sitesResult: { sites: StorageType[], lastUpdate: number }) => {
            //     if (sitesResult.sites && sitesResult.sites.length > 0) chrome.storage.sync.set({ sites: sitesResult.sites, lastUpdate: sitesResult.lastUpdate }, () => {
            //         console.log('saved sites to sync storage', sitesResult.sites)
            //     })
            // })
        })
    })
}


initStorage();
connectToPopup();
chrome.alarms.create('tick', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == 'tick') {
        // 1 раз в минуту обновлять данные в sync 
        console.log('background tick')
    }
})