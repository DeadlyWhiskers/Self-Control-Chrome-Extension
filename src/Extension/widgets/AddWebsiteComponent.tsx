import IconButton from './IconButton'

import CrossIcon from './assets/CrossIcon.svg'
import TickIcon from './assets/TickIcon.svg'
import PlusIcon from './assets/PlusIcon.svg'
import './AddWebsiteComponent.css'
import { useState } from 'react';

const AddWebsiteComponent = () => {
    const [addActive, setAddActive] = useState(0);
    return (
        <div className="add-website-component">
            {!addActive ? <button className="button button--add-website" onClick={() => setAddActive(1)}>
                <img src={PlusIcon} alt="plus icon" />
            </button>
                :
                <div className='content-block content-block--large'>
                    <div className="input-line">
                        <span className='title'>Display name:</span>
                        <input type="text" className='input-field' />
                    </div>
                    <div className="input-line">
                        <span className='title'>Url:</span>
                        <input type="text" className='input-field' />
                    </div>
                    <div className="horizontal-spread-area">
                        <div className="add-limits-time-area">
                            <div className="input-line">
                                <span className='title'>Limit:</span>
                                <input type="text" className='input-field input-field--short' maxLength={8} minLength={2}/>
                            </div>
                            <div className="input-line">
                                <span className='title'>Cooldown:</span>
                                <input type="text" className='input-field input-field--short' maxLength={8} minLength={2}/>
                            </div>
                        </div>
                        <div className="buttons-area">
                            <IconButton image={CrossIcon} color='var(--negative-color)' onClick={() => setAddActive(0)}/>
                            <IconButton image={TickIcon} color='var(--positive-color)' onClick={() => setAddActive(0)}/>
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export default AddWebsiteComponent;