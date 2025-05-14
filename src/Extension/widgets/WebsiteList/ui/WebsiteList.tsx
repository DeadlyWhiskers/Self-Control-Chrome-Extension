import { useEffect, useRef, useState } from "react";
import { ContentBlock } from "../../../widgets/ContentBlock";
import { StorageType } from "../../../shared/types/StorageType";
import { SettingsType } from "../../../shared/types/SettingsType";
import { fetchSettings, fetchSites, getTabsQuantity, getActiveTabs } from "../../../shared/api";
import { MStoTime } from "../../../shared/lib/math";

export const WebsiteList = () => {
    const [siteList, setSiteList] = useState<StorageType[]>([]);
    const activeTabs = useRef<chrome.tabs.Tab[] | null>(null);
    const tabsQuantity = useRef<number>(0);
    const updateInterval = useRef<number | undefined>(Date.now());
    const lastUpdate = useRef<number>(Date.now());
    const connectPort = useRef<chrome.runtime.Port | undefined>(undefined);
    const removeTab = useRef<number | undefined>(undefined);
    const settings = useRef<SettingsType | undefined>(undefined);

    const handleStoreUpdates = async (changes: {
        [key: string]: chrome.storage.StorageChange;
    }) => {
        if (changes.sites) {
            const siteResult = await fetchSites();
            setSiteList(siteResult.sites);
            lastUpdate.current = siteResult.lastUpdate;
        }
    };

    const handleTabsUpdate = async () => {
        activeTabs.current = await getActiveTabs();
        tabsQuantity.current = await getTabsQuantity();
    };

    const handlePortConnection = async () => {
        console.warn("connection failed...");
    };

    useEffect(() => {
        const Initialize = async () => {

            chrome.storage.sync.onChanged.addListener(handleStoreUpdates);
            chrome.tabs.onActivated.addListener(handleTabsUpdate);
            chrome.tabs.onUpdated.addListener(handleTabsUpdate);
            const port = chrome.runtime.connect({ name: "sitesSync" });
            port.onDisconnect.addListener(handlePortConnection);
            connectPort.current = port;
            activeTabs.current = await getActiveTabs();
            tabsQuantity.current = await getTabsQuantity();
            settings.current = await fetchSettings();
            const siteResult = await fetchSites();
            setSiteList(siteResult.sites);
            lastUpdate.current = siteResult.lastUpdate

            updateInterval.current = setInterval(() => {
                const now = Date.now();
                const delta = now - lastUpdate.current;
                // console.log(delta)
                lastUpdate.current = now;
                setSiteList((prevList) =>
                    prevList.map((el) => {
                        let updatedEl = { ...el };
                        updatedEl.cooldownRemaining = Math.max(
                            0,
                            updatedEl.cooldownRemaining - delta
                        );
                        if (updatedEl.cooldownRemaining === 0) {
                            updatedEl.cooldownRemaining = updatedEl.cooldownTime;
                            updatedEl.limitRemaining = updatedEl.limitTime;
                        } else
                            activeTabs.current?.forEach((activeTab: chrome.tabs.Tab) => {
                                if (activeTab.url?.startsWith(updatedEl.address)) {
                                    updatedEl.limitRemaining = Math.max(
                                        0,
                                        updatedEl.limitRemaining - delta
                                    );
                                    if (
                                        updatedEl.limitRemaining === 0 &&
                                        activeTab.id !== undefined
                                    ) {
                                        removeTab.current = activeTab.id;
                                    }
                                }
                            });
                        return updatedEl;
                    })
                );
            }, 1000);
        };

        Initialize();

        return () => {
            // only when switching extension pages
            if (connectPort.current) {
                connectPort.current.disconnect();
            }
            chrome.tabs.onActivated.removeListener(handleTabsUpdate);
            chrome.tabs.onUpdated.removeListener(handleTabsUpdate);
            chrome.storage.sync.onChanged.removeListener(handleStoreUpdates);
            clearInterval(updateInterval.current);
            connectPort.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        // console.warn("posting message via port", connectPort.current);
        try {
            if (connectPort.current !== undefined)
                connectPort.current?.postMessage({
                    type: "updateSiteList",
                    content: { sitesList: siteList, lastUpdate: lastUpdate.current },
                });
        } catch (e) {
            if (e instanceof Error) console.warn(e.message);
        }
        if (removeTab.current) {
            if (tabsQuantity.current === 1) {
                const removeId = removeTab.current;
                chrome.tabs.create({ url: settings.current?.homeURL }, () => {
                    if (removeId) chrome.tabs.remove(removeId);
                });
            } else chrome.tabs.remove(removeTab.current);
            removeTab.current = undefined;
        }
    }, [siteList]);

    return (
        <>
            {siteList.map((el, i) => {
                return (
                    <ContentBlock
                        key={i}
                        elementId={i}
                        siteName={el.name}
                        siteURL={el.address}
                        limitTime={el.limitTime}
                        cooldownTime={el.cooldownTime}
                        limitRemaining={
                            settings.current?.showLimit ? MStoTime(el.limitRemaining) : "●"
                        }
                        cooldownRemaining={
                            settings.current?.showCooldown
                                ? MStoTime(el.cooldownRemaining)
                                : "●"
                        }
                        isLimitEnded={el.limitRemaining > 0}
                    />
                );
            })}
        </>
    );
}