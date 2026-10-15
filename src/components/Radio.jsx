import Label from "./Label";

const Radio = (props) => {
    const {
        id,
        name,
        value,
        children,
        onChange,
        checked
    } = props;

    return(
        <Label forInput={ id } classLabel="label__radio">
            <input className="radio__input" type="radio" id={ id } name={ name } value={ value } onChange={ onChange } checked={ checked } />
            { children }
        </Label>
            
            
    )
}

export default Radio;