const Button = (props) => {

    const {
        children,
        classname,
        onClick
    } = props;

    return(
        <button className={`button__form ${classname}`} onClick={ onClick }>{ children }</button>
    )
}

export default Button;