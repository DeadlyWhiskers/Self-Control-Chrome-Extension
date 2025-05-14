import { StorageType } from "../../types/StorageType"
import { SettingsType } from "../../types/SettingsType"

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

export {fetchSites, getActiveTabs, fetchSettings, getTabsQuantity}