const PrimaryButton = (props) => {

    const {
        children,
        onClick,
        type,
        form
    } = props;

    return(
        <button type={ type } className="btn btn-primary generate" form={ form } onClick={ onClick }>{ children }</button>
    )
}

export default PrimaryButton;