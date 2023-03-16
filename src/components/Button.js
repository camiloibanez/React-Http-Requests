const Button = (props) => {
    const clickHandler = () => {
        props.onClick(props.endpoint, props.flag);
    }

    return (
        <button onClick={clickHandler}>{props.children}</button>
    );
};

export default Button;