import './Slider.css'

type SliderProps = {
    id: string,
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider = (props: SliderProps) => {

    return (
        <label htmlFor={props.id} className="slider-switch">
                    <input type="checkbox" id={props.id} checked={props.checked} onChange={props.onChange}/>
                    <div className="slider"></div>
            </label>
    );
}

export default Slider;