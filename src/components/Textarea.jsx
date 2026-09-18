import Label from "./Label";

const Textarea = (props) => {
    const {
        ariaLabel,
        placeholder,
        heightArea,
        value,
        classname,
        id,
        name,
        readOnly
    } = props;
    return(
        <textarea className={`field ${classname}`}
            placeholder={ placeholder } aria-label={ ariaLabel } rows={ heightArea } 
            id={ id } name={ name } value={ value } readOnly={ readOnly }></textarea>
    )
}

export default Textarea;