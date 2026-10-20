const Modal = (props) => {
    const {
        children,
        onClick
    } = props;

    return(
        <div className="modal" onClick={ onClick }>
            <div className="modal-content">
                { children }
            </div>
        </div>
    )
}

export default Modal;