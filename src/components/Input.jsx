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
        value
    } = props;
    return (
        <>
            { label !== undefined && (<Label classLabel="field-label" forInput={ id }>{ label }</Label>) }
            <input className="input" placeholder={ placeholder } type={ type } value={ value }
                aria-label={ ariaLabel ? ariaLabel : label } id={ id } name={ name } onInput={ onInput } />
        </>
    )
}

export default Input;