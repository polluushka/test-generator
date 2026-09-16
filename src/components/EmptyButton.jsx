const EmptyButton = (props) => {

    const {
        children,
        classname,
        onClick
    } = props;

    return(
        <button className={`${classname}`} onClick={ onClick }>{ children }</button>
    )
}

export default EmptyButton;