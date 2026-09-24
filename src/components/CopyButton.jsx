const CopyButton = (props) => {

    const {
        children,
        onClick,
        type
    } = props;

    return(
        <button type={ type } className="copy" onClick={ onClick }>{ children }</button>
    )
}

export default CopyButton;