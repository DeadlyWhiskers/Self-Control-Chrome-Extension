import IconButton from './IconButton'

import CrossIcon from './assets/CrossIcon.svg'
import TickIcon from './assets/TickIcon.svg'
import PlusIcon from './assets/PlusIcon.svg'
import './AddWebsiteComponent.css'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const timeToSeconds = (time: string): number => {
    let seconds = 0;
    const numbers = time.split(':').reverse();
    numbers.map((num, i) => {
        seconds += +num * (60 ** i);
    })
    return seconds;
}

const formSchema = z.object({
    name: z.string().min(1,'This field is required'),
    address: z.string().url().min(1,'This field is required'),
    limitTime: z.string({required_error: 'This field is required'}).time({precision: 0}).min(1).max(8),
    cooldownTime: z.string({required_error: 'This field is required'}).time({precision: 0}).min(1).max(8),
    formError: z.string().optional()
})
.refine((data) => timeToSeconds(data.limitTime) <= timeToSeconds(data.cooldownTime), {message: 'Cooldown time is less than a limit time', path: ['formError']})

type FormFields = z.infer<typeof formSchema>

const AddWebsiteComponent = () => {
    
    console.log(timeToSeconds('20:44:15'))

    const [addActive, setAddActive] = useState(0);

    const handleCancel = () => {
        setAddActive(0);
        reset();
    }

    const {register,  handleSubmit, setError, formState: {errors, isSubmitting}, reset} = useForm<FormFields>({resolver: zodResolver(formSchema)});

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try{
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        catch(e){
            console.log(e)
            setError('root', {message: 'Something went wrong'});
        }
        console.log('submitted', data);
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

export default AddWebsiteComponent;