chrome.action.onClicked.addListener(function () {
    console.log('oh hi');
});
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ sites: [] }, function () {
        console.log('Setup complete!');
    });
});
export {};
