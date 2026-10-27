const ClearButton = (props) => {

    const {
        children,
        onClick
    } = props;

    return(
        <button type="button" className="btn clear" onClick={ onClick }>{ children }</button>
    )
}

export default ClearButton;