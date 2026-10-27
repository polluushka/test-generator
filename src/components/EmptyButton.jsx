const EmptyButton = (props) => {

    const {
        children,
        onClick
    } = props;

    return(
        <button className="empty-btn" onClick={ onClick }>{ children }</button>
    )
}

export default EmptyButton;