import { useEffect, useState } from 'react';
import AddWebsiteComponent from '../../widgets/AddWebsiteComponent';
import ContentBlock from '../../widgets/WebsiteBlock';
import StorageType from '../../shared/types/StorageType';
import './HomePage.css'

// Completely rework the timer system

const HomePage = () => {

    const [siteList, setSiteList] = useState<StorageType[]>([]);

    const handleStoreUpdates = (changes: { [key: string]: chrome.storage.StorageChange; }) => {
        if(changes.sites) fetchSites();
    }

    const fetchSites = () => {
        chrome.storage.sync.get({sites: [] as StorageType[]}, (result: {sites: StorageType[]}) => {
            setSiteList(result.sites);
        })
    }

    useEffect(() => {
        chrome.storage.sync.onChanged.addListener(handleStoreUpdates)
        fetchSites()
        return () => chrome.storage.sync.onChanged.removeListener(handleStoreUpdates)
    }, [])

    return <div className='list-layout'>
        {siteList.map((el,i) => {
            return <ContentBlock key={i} elementId={i} siteName={el.name} siteURL={el.address} limitTime={el.limitTime} cooldownTime={el.cooldownTime}/>
        })}
        <AddWebsiteComponent/>
    </div>;
};

export default HomePage;