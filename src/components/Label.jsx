const Label = (props) => {
    const {
        children,
        forInput,
        classLabel
    } = props;
    return(
        <label htmlFor={ forInput } className={ classLabel }>{ children }</label>
    )
}

export default Label;