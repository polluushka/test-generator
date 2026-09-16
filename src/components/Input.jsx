import Label from "./Label";

const Input = (props) => {
    const {
        label,
        placeholder,
        // classname,
        id,
        name
    } = props;
    return (
        <>
            <Label forInput={ id }>{ label }</Label>
            <input type="text" placeholder={ placeholder } className="field h-3" id={ id } name={ name } />
        </>
    )
}

export default Input;