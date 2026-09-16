const Label = (props) => {
    const {
        children,
        forInput
    } = props;
    return(
        <label htmlFor={ forInput } className="label__field">{ children }</label>
    )
}

export default Label;