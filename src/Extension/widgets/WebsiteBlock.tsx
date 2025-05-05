import { useRef, useState } from 'react';
import IconButton from "./IconButton";

import TrashIcon from './assets/TrashIcon.svg'
import './WebsiteBlock.css'

type ContentBlockProps = {
    elementId: number;
}

const ContentBlock = ({ elementId }: ContentBlockProps) => {

    const checkboxRef = useRef<HTMLInputElement>(null);
    const [isChecked, setChecked] = useState(() => checkboxRef.current?.checked ?? false);

    const handleCheckboxChange = () => {
        setChecked(checkboxRef.current?.checked ?? false);
    };


    return ((elementId !== undefined) &&
        <div className='content-block content-block--large'>
            <div className='dropdown-area'>
                <div className='content-upper-area'>
                    <div className='content-url-area'>
                        <input type="checkbox" className='dropdown-checkbox' id={elementId.toString()} ref={checkboxRef} onChange={handleCheckboxChange} />
                        <label className='dropdown-checkbox-label' htmlFor={elementId.toString()} />
                        <span className='content-url'>
                            reddit.com
                        </span>
                    </div>
                    <span className={`content-time ${elementId % 2 === 0 ? 'content-time--left' : 'content-time--timeout'}`}>
                        {elementId}
                    </span>
                </div>
                <div className={`dropdown-content ${isChecked ? 'dropdown-content--visible' : 'dropdown-content--invisible'}`}>
                    <div className='spacer-height-10px'/>
                    <div className='horizontal-spread-area'>
                        <div className='limits-time-area'>
                            <div className="content-block content-block--small">
                                <span className="title">
                                    Limit
                                </span>
                                <span className='regular-text'>
                                    muhahaha
                                </span>
                            </div>
                            <div className="content-block content-block--small">
                                <span className="title">
                                    Cooldown
                                </span>
                                <span className='regular-text'>
                                    nyahahahah
                                </span>
                            </div>
                        </div>
                        <div className='buttons-area'>
                            <IconButton color='var(--negative-color)' image={TrashIcon}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentBlock;