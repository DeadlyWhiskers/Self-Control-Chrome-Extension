import './IconButton.css'

type ButtonProps = {
    image: string,
    color: string,
    onClick?: () => void,
}

const IconButton = (props: ButtonProps) => {
    return(
        <button className='button button--icon-button' style={{backgroundColor: props?.color}} onClick={() => props.onClick && props.onClick()}>
            <img src={props?.image} alt="button icon" />
        </button>
    );
};

export default IconButton;