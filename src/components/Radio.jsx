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
            <input className="mr-0.5" type="radio" id={ id } name={ name } value={ value } />
            <Label forInput={ id }>{ children }</Label>
        </>
    )
}

export default Radio;