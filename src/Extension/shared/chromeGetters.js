var fetchSites = function () {
    return new Promise(function (resolve) {
        chrome.storage.sync.get({ sites: [], lastUpdate: Date.now() }, function (result) {
            resolve(result);
        });
    });
};
var getActiveTabs = function () {
    return new Promise(function (resolve) {
        chrome.tabs.query(({ active: true }), function (tabs) {
            resolve(tabs);
        });
    });
};
export { fetchSites, getActiveTabs };
