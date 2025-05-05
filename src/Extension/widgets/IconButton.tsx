import './IconButton.css'

type ButtonProps = {
    image: string,
    color: string,
}

const IconButton = (props: ButtonProps) => {
    return(
        <button className='button button--icon-button' style={{backgroundColor: props?.color}}>
            <img src={props?.image} alt="button icon" />
        </button>
    );
};

export default IconButton;