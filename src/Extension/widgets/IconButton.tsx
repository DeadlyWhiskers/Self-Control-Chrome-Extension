import './IconButton.css'

type ButtonProps = {
    image: string,
    color: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    type?: "button" | "submit" | "reset",
    disabled?: false | true
}

const IconButton = (props: ButtonProps) => {
    return(
        <button className='button button--icon-button' style={{backgroundColor: props?.color}} onClick={(e) => !!props.onClick && props.onClick(e)} type={props.type || 'button'} disabled={props.disabled || false}>
            <img src={props?.image} alt="button icon"/>
        </button>
    );
};

export default IconButton;