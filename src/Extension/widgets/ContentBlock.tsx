import { useRef, useState } from 'react';
import './ContentBlock.css'

type ContentBlockProps = {
    elementId: number;
}

const ContentBlock = ({elementId}: ContentBlockProps) => {

    const checkboxRef = useRef<HTMLInputElement>(null);
    const [isChecked, setChecked] = useState(() => checkboxRef.current?.checked ?? false);

    const handleCheckboxChange = () => {
        setChecked(checkboxRef.current?.checked ?? false);
    };


    return ( (elementId !== undefined) &&
        <div className='content-block content-block--large'>
            <div className='content-upper-area'>
                <div className='content-url-area'>
                    <input type="checkbox" className='dropdown-checkbox' id={elementId.toString()} ref={checkboxRef} onChange={handleCheckboxChange}/>
                    <label className='dropdown-checkbox-label' htmlFor={elementId.toString()} />
                    <span className='content-url'>
                        reddit.com
                    </span>
                </div>
                <span className={`content-time ${elementId%2 === 0 ? 'content-time--left' : 'content-time--timeout'}`}>
                    {elementId}
                </span>
            </div>
            <div className={`dropdown-area ${isChecked ? 'dropdown-area--visible' : 'dropdown-area--invisible'}`}>
                Анимация
            </div>
        </div>
    );
};

export default ContentBlock;