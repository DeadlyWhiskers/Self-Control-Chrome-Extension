var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var initStorage = function () {
    chrome.runtime.onInstalled.addListener(function () {
        chrome.storage.sync.set({ sites: [], lastUpdate: Date.now(), showLimit: true, showCooldown: true, homeURL: 'https://www.google.com/' }, function () {
        });
    });
};
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
var getTabsQuantity = function () {
    return new Promise(function (resolve) {
        chrome.tabs.query(({}), function (tabs) {
            resolve(tabs.length);
        });
    });
};
var fetchSettings = function () {
    return new Promise(function (resolve) {
        chrome.storage.sync.get({ showLimit: true, showCooldown: true, homeURL: 'https://www.google.com/' }, function (result) {
            resolve(result);
        });
    });
};
var connectToPopup = function () {
    var sitesBuffer = { sitesList: [], lastUpdate: 0 };
    chrome.runtime.onConnect.addListener(function (port) {
        chrome.storage.local.set({ isPopupOpened: true });
        var handleMessage = function (message) {
            console.log(message.content.lastUpdate, ' ', Date.now(), ' ', message.content.lastUpdate - Date.now());
            switch (message.type) {
                case ('updateSiteList'):
                    if (sitesBuffer && (sitesBuffer === null || sitesBuffer === void 0 ? void 0 : sitesBuffer.lastUpdate) < message.content.lastUpdate)
                        sitesBuffer = structuredClone(message.content);
                    break;
            }
        };
        port.onMessage.addListener(handleMessage);
        port.onDisconnect.addListener(function () {
            chrome.storage.local.set({ isPopupOpened: false });
            if (sitesBuffer && sitesBuffer.sitesList.length > 0)
                chrome.storage.sync.set({ sites: sitesBuffer.sitesList, lastUpdate: sitesBuffer.lastUpdate }, function () {
                    port.onMessage.removeListener(handleMessage);
                });
        });
    });
};
var getPopupOpened = function () {
    return new Promise(function (resolve) { return chrome.storage.local.get({ isPopupOpened: false }, function (result) {
        resolve(result.isPopupOpened);
    }); });
};
var backgroundTick = function () { return __awaiter(void 0, void 0, void 0, function () {
    var isPopupOpened, siteResult, sitesList, lastUpdate, activeTabs_1, tabsQuantity_1, settings, homeURL_1, now, delta_1, newSitesList, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, getPopupOpened()];
            case 1:
                isPopupOpened = _a.sent();
                if (!!isPopupOpened) return [3 /*break*/, 6];
                return [4 /*yield*/, fetchSites()];
            case 2:
                siteResult = _a.sent();
                sitesList = siteResult.sites;
                lastUpdate = siteResult.lastUpdate;
                return [4 /*yield*/, getActiveTabs()];
            case 3:
                activeTabs_1 = _a.sent();
                return [4 /*yield*/, getTabsQuantity()];
            case 4:
                tabsQuantity_1 = _a.sent();
                return [4 /*yield*/, fetchSettings()];
            case 5:
                settings = _a.sent();
                homeURL_1 = settings.homeURL;
                now = Date.now();
                delta_1 = now - lastUpdate;
                newSitesList = sitesList.map(function (el) {
                    var updatedEl = __assign({}, el);
                    if (delta_1 > updatedEl.cooldownRemaining) {
                        var newDelta = delta_1 % updatedEl.cooldownRemaining;
                        updatedEl.cooldownRemaining = Math.max(0, updatedEl.cooldownRemaining - newDelta);
                        updatedEl.limitRemaining = updatedEl.limitTime;
                    }
                    else
                        updatedEl.cooldownRemaining = Math.max(0, updatedEl.cooldownRemaining - delta_1);
                    if (updatedEl.cooldownRemaining === 0) {
                        updatedEl.cooldownRemaining = updatedEl.cooldownTime;
                        updatedEl.limitRemaining = updatedEl.limitTime;
                    }
                    else {
                        activeTabs_1 === null || activeTabs_1 === void 0 ? void 0 : activeTabs_1.forEach(function (activeTab) {
                            var _a;
                            if ((_a = activeTab.url) === null || _a === void 0 ? void 0 : _a.startsWith(updatedEl.address)) {
                                updatedEl.limitRemaining = Math.max(0, updatedEl.limitRemaining - delta_1);
                                if (updatedEl.limitRemaining === 0 && activeTab.id !== undefined) {
                                    chrome.tabs.remove(activeTab.id);
                                    if (tabsQuantity_1 === 1) {
                                        var removeId_1 = activeTab.id;
                                        chrome.tabs.create({ url: homeURL_1 }, function () {
                                            if (removeId_1)
                                                chrome.tabs.remove(removeId_1);
                                        });
                                    }
                                    else
                                        chrome.tabs.remove(activeTab.id);
                                }
                            }
                        });
                    }
                    return updatedEl;
                });
                chrome.storage.sync.set({ sites: newSitesList, lastUpdate: Date.now() }, function () { });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
var init = function () {
    initStorage();
    connectToPopup();
    backgroundTick();
};
init();
chrome.tabs.onActivated.addListener(backgroundTick);
chrome.tabs.onUpdated.addListener(backgroundTick);
chrome.alarms.create('tick', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(function (alarm) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (alarm.name == 'tick') {
            backgroundTick();
        }
        return [2 /*return*/];
    });
}); });
export {};
