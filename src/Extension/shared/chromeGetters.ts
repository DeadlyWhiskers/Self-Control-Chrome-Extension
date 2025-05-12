import StorageType from "./types/StorageType"

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

export {fetchSites, getActiveTabs}