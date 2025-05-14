import { useRef, useState, memo } from 'react';
import { IconButton } from '../../../shared/ui/Input';
import { StorageType } from '../../../shared/types/StorageType';

import TrashIcon from '../../../shared/assets/TrashIcon.svg'
import './ContentBlock.css'
import { MStoTime } from '../../../shared/lib/math';

type ContentBlockProps = {
    elementId: number,
    siteName: string,
    siteURL: string,
    limitTime: number,
    cooldownTime: number,
    limitRemaining: string,
    cooldownRemaining: string,
    isLimitEnded: boolean,
    onClick?: (siteToDelete: string) => void
}

const removeSite = (url: string) => {
    chrome.storage.sync.get({sites: [] as StorageType[]}, (result: {sites: StorageType[]}) => {
        const newSite = result.sites.filter((el) => el.address !== url)
        chrome.storage.sync.set({sites: newSite}, () =>{
            chrome.storage.sync.get({sites: [] as StorageType[]}, (result: {sites: StorageType[]}) => console.log(result.sites))
        })
    })
}

const ContentBlockNoMemo = (props: ContentBlockProps) => {

    const checkboxRef = useRef<HTMLInputElement>(null);
    const [isChecked, setChecked] = useState(() => checkboxRef.current?.checked ?? false);

    const handleCheckboxChange = () => {
        setChecked(checkboxRef.current?.checked ?? false);
    };

    return ((props.elementId !== undefined) &&
        <div className='content-block content-block--large'>
            <div className='dropdown-area'>
                <div className='content-upper-area'>
                    <div className='content-url-area'>
                        <input type="checkbox" className='dropdown-checkbox' id={props.elementId.toString()} ref={checkboxRef} onChange={handleCheckboxChange} />
                        <label className='dropdown-checkbox-label' htmlFor={props.elementId.toString()} />
                        <span className='content-url'>
                            {props.siteName}
                        </span>
                    </div>
                    {props.isLimitEnded ? 
                    <span className={'content-time content-time--left'}>
                        {props.limitRemaining}
                    </span>
                    :
                    <span className={'content-time content-time--timeout'}>
                        {props.cooldownRemaining}
                    </span>}
                    
                </div>
                <div className={`dropdown-content ${isChecked ? 'dropdown-content--visible' : 'dropdown-content--invisible'}`}>
                    <div className='spacer-height-10px' />
                    <div className="vertical-list">
                        <span className="title">{props.siteURL}</span>
                        <div className='horizontal-spread-area'>
                            <div className='limits-time-area'>
                                <div className="content-block content-block--small">
                                    <span className="title">
                                        Limit
                                    </span>
                                    <span className='regular-text'>
                                        {MStoTime(props.limitTime)}
                                    </span>
                                </div>
                                <div className="content-block content-block--small">
                                    <span className="title">
                                        Cooldown
                                    </span>
                                    <span className='regular-text'>
                                        {MStoTime(props.cooldownTime)}
                                    </span>
                                </div>
                            </div>
                            <div className='buttons-area'>
                                <IconButton color='var(--negative-color)' image={TrashIcon} onClick={() => {removeSite(props.siteURL)}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ContentBlock = memo(ContentBlockNoMemo);