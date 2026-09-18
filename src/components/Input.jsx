import Label from "./Label";

const Input = (props) => {
    const {
        label,
        ariaLabel,
        placeholder,
        type,
        id,
        name
    } = props;
    return (
        <>
            { label !== undefined && (<Label forInput={ id }>{ label }</Label>) }
            <input className="field h-3" placeholder={ placeholder } type={ type } aria-label={ ariaLabel ? ariaLabel : label } id={ id } name={ name } />
        </>
    )
}

export default Input;