import Label from "./Label";

const Radio = (props) => {
    const {
        id,
        name,
        value,
        children
    } = props;

    return(
        <>
            <Label forInput={ id } classLabel="label__radio">
                <input className="radio__input" type="radio" id={ id } name={ name } value={ value } />
                { children }
            </Label>
            
            
        </>
    )
}

export default Radio;