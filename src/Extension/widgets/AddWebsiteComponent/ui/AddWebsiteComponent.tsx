import { IconButton } from '../../../shared/ui/Input'

import CrossIcon from '../../../shared/assets/CrossIcon.svg'
import TickIcon from '../../../shared/assets/TickIcon.svg'
import PlusIcon from '../../../shared/assets/PlusIcon.svg'
import './AddWebsiteComponent.css'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { StorageType } from '../../../shared/types/StorageType'
import { timeToMS } from '../../../shared/lib/math'

const uploadWebsite = (data: FormFields) => {
    return new Promise<void>((resolve, reject) => {
        chrome.storage.sync.get({sites: [] as StorageType[], homeUrl: 'https://www.google.com/' as string}, (result: {sites: StorageType[], homeUrl: string}) => {
            const urlToUpload = new URL(data.address);
            for(const el of result.sites){
                try{
                    if(new URL(el.address).origin === urlToUpload.origin) {
                        reject(new Error('This website is already added!'));
                        return true;
                    }
                }catch{
                    {reject(new Error(`Invalid url was saved: ${el.address}, reinstall the extension`));
                    return true;
                }
                }
            }
            if(result.homeUrl.startsWith(urlToUpload.origin) || urlToUpload.origin.startsWith(result.homeUrl)) {
                reject(new Error('This is a home page!'));
                return;
            }
            const newSite = [...result.sites, {
                name: data.name,
                address: urlToUpload.origin,
                limitTime: timeToMS(data.limitTime),
                cooldownTime: timeToMS(data.cooldownTime),
                limitRemaining: timeToMS(data.limitTime),
                cooldownRemaining: timeToMS(data.cooldownTime)
            }];
            chrome.storage.sync.set({sites: newSite, lastUpdate: Date.now()}, () =>{
                resolve();
            })
        })
    })
}

const formSchema = z.object({
    name: z.string().min(1,'This field is required'),
    address: z.string().min(1,'This field is required').url(),
    limitTime: z.string().min(1,'This field is required').max(8).time({precision: 0, message: 'Use HH:MM:SS'}),
    cooldownTime: z.string().min(1,'This field is required').max(8).time({precision: 0, message: 'Use HH:MM:SS'}),
    formError: z.string().optional()
})
.refine((data) => timeToMS(data.limitTime) <= timeToMS(data.cooldownTime), {message: 'Cooldown time is less than a limit time', path: ['formError']})

type FormFields = z.infer<typeof formSchema>

export const AddWebsiteComponent = () => {

    const [addActive, setAddActive] = useState(0);

    const handleCancel = () => {
        setAddActive(0);
        reset();
    }

    const {register,  handleSubmit, setError, formState: {errors, isSubmitting}, reset} = useForm<FormFields>({resolver: zodResolver(formSchema)});

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try{
            await uploadWebsite(data)
            setAddActive(0);
            reset();
        }
        catch(e){
            console.log(e)
            setError('formError', {message: (e instanceof Error) ? e.message : 'Unknown error'});
        }
    }

    return (
        <div className="add-website-component">
            {!addActive ? <button className="button button--add-website" onClick={() => setAddActive(1)}>
                <img src={PlusIcon} alt="plus icon" />
            </button>
                :
                <form className='content-block content-block--large' onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-line">
                        <span className='title'>Display name:</span>
                        <input type="text" className='input-field' {...register('name', {required: true})}/>
                    </div>
                    {errors.name && <div className='error'> {errors.name.message} </div>}
                    <div className="input-line">
                        <span className='title'>Url:</span>
                        <input type="text" className='input-field' {...register('address')}/>
                    </div>
                    {errors.address && <div className='error'> {errors.address.message} </div>}
                    <div className="horizontal-spread-area">
                        <div className="add-limits-time-area">
                            <div className="input-line">
                                <span className='title'>Limit:</span>
                                <input type="text" placeholder='00:00:00' className='input-field input-field--short' maxLength={8} minLength={2} {...register('limitTime')}/>
                            </div>
                            {errors.limitTime && <div className='error'> {errors.limitTime.message} </div>}
                            <div className="input-line">
                                <span className='title'>Cooldown:</span>
                                <input type="text" placeholder='00:00:00' className='input-field input-field--short' maxLength={8} minLength={2} {...register('cooldownTime')}/>
                            </div>
                            {errors.cooldownTime && <div className='error'> {errors.cooldownTime.message} </div>}
                        </div>
                        <div className="buttons-area">
                            <IconButton image={CrossIcon} color='var(--negative-color)' onClick={() => handleCancel()} disabled={isSubmitting}/>
                            <IconButton image={TickIcon} color='var(--positive-color)' type='submit' disabled={isSubmitting}/>
                        </div>
                    </div>
                    {errors.formError && <div className='error'> {errors.formError.message} </div>}
                    {errors.root && <div className='error'> {errors.root.message} </div>}
                </form>}
        </div>
    );
}