const AddButton = (props) => {

    const {
        children,
        onClick,
        type
    } = props;

    return(
        <button type={ type } className="btn btn-ghost btn-add" onClick={ onClick }>{ children }</button>
    )
}

export default AddButton;