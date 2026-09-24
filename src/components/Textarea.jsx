import Label from "./Label";

const Textarea = (props) => {
    const {
        ariaLabel,
        placeholder,
        value,
        id,
        name,
        readOnly,
        onInput
    } = props;
    return(
        <textarea className="textarea" placeholder={ placeholder } aria-label={ ariaLabel }
            id={ id } name={ name } value={ value } readOnly={ readOnly } onInput={ onInput }></textarea>
    )
}

export default Textarea;