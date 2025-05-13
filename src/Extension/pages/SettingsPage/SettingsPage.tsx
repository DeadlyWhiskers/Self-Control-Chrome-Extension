import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import Slider from '../../widgets/Slider';
import './SettingsPage.css'
import { fetchSettings, fetchSites } from '../../shared/chromeGetters';
import SettingsType from '../../shared/types/SettingsType';
import { z } from 'zod';
import StorageType from '../../shared/types/StorageType';

const formSchema = z.object({
    homeURL: z.string().min(1,'This field is required').url(),
    formError: z.string().optional()
})
type FormFields = z.infer<typeof formSchema>

const SettingsPage = () => {

    const [showRemainingTime, setShowRemainingTime] = useState(false);
    const [showCooldownTime, setShowCooldownTime] = useState(false);
    const [showHomeUrl, setHomeUrl] = useState('https://www.google.com');
    const {register,  handleSubmit, setError, formState: {errors, isSubmitting}, reset} = useForm<FormFields>({resolver: zodResolver(formSchema)});
    const siteList = useRef<StorageType[]|undefined>(undefined)

    const changeShowLimit = () => {
        chrome.storage.sync.set({showLimit: !showRemainingTime}, () => {
            setShowRemainingTime(!showRemainingTime)
        })
    }

    const changeShowCooldown= () => {
        chrome.storage.sync.set({showCooldown: !showCooldownTime}, () => {
            setShowCooldownTime(!showCooldownTime)
        })
    }

    const uploadHomeURL = async(result: FormFields) => {
        const isDup = siteList.current?.some(el => 
            el.address.startsWith(result.homeURL) || result.homeURL.startsWith(el.address))
        if (isDup) {
            throw(new Error('This site is already in list'));
        }
        chrome.storage.sync.set({homeURL: result.homeURL}, () => {
            setHomeUrl(result.homeURL)
            reset()
        })
    }

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
            try{
                await uploadHomeURL(data)
                // setAddActive(0);
                reset();
            }
            catch(e){
                console.log(e)
                setError('formError', {message: (e instanceof Error) ? e.message : 'Unknown error'});
            }
        }

    useEffect(() => {

        const init = async () => {
            const settings: SettingsType = await fetchSettings();
            const siteResult = await fetchSites();
            siteList.current = siteResult.sites;
            setShowRemainingTime(settings.showLimit)
            setShowCooldownTime(settings.showCooldown)
            setHomeUrl(settings.homeURL)
        }

        init();
    }, [])

    return <div className='list-layout'>
        <div className="content-block content-block--large">
            <form className="input-line" onSubmit={handleSubmit(onSubmit)}>
                <span className="title">
                    Home page:
                </span>
                <input type="text" className="input-field" /*onKeyUp={(e) => {if(e.code === 'Enter') handleSubmit(onSubmit)}}*/ placeholder={showHomeUrl} {...register('homeURL')} disabled={isSubmitting}/>
            </form>
            {errors.homeURL && <div className='error'> {errors.homeURL.message} </div>}
            {errors.formError && <div className='error'> {errors.formError.message} </div>}
            {errors.root && <div className='error'> {errors.root.message} </div>}
        </div>
        <div className="content-block content-block--large">
            <div className="input-line">
                <span className="title">
                    Show remaining time
                </span>
                <Slider id={'remainingTimeSwitch'} checked={showRemainingTime} onChange={() => (changeShowLimit())}/>
            </div>
        </div>
        <div className="content-block content-block--large">
            <div className="input-line">
                <span className="title">
                    Show cooldown time
                </span>
                <Slider id={'cooldownTimeSwitch'} checked={showCooldownTime} onChange={() => (changeShowCooldown())}/>
            </div>
        </div>
    </div>;
};

export default SettingsPage;