const DeleteButton = (props) => {

    const {
        children,
        onClick
    } = props;

    return(
        <button type="button" className="del" onClick={ onClick }>{ children }</button>
    )
}

export default DeleteButton;