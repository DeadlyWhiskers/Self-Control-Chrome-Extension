import StorageType from "../shared/types/StorageType"

chrome.action.onClicked.addListener(() => {
    console.log('oh hi')
})

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({sites: [] as StorageType[]}, () => {
        console.log('Setup complete!')
    })
})