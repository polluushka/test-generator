import Label from "./Label";

const Input = (props) => {
    const {
        label,
        ariaLabel,
        placeholder,
        type,
        id,
        name,
        onInput,
        onFocus,
        value,
        readOnly
    } = props;
    return (
        <>
            { label !== undefined && (<Label classLabel="field-label" forInput={ id }>{ label }</Label>) }
            <input className="input" placeholder={ placeholder } type={ type } value={ value }
                aria-label={ ariaLabel ? ariaLabel : label } id={ id } name={ name } onInput={ onInput }
                onFocus={ onFocus } readOnly={ readOnly } />
        </>
    )
}

export default Input;