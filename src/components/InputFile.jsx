import { useEffect, useState } from "react";
import Label from "./Label";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

const InputFile = (props) => {

    const {
        id,
        name,
        onInput,
        nameImage,
        ariaLabel
    } = props;

    const [titleImg, setTitleImg] = useState("Файл не выбран");

    function getTitleImg(image) {
        if(!image) return;
        setTitleImg(image);
    }

    useEffect(() => {
        getTitleImg(nameImage);
    }, [nameImage]);

    return(
        <>
            <Label classLabel="upload">
                <span className="ico">
                    <FontAwesomeIcon icon={faImage} />
                </span>
                <span className="up-text"><b>{ titleImg }</b><br/>
                    <em>Файл нужно залить в mercury с этим же именем</em>
                </span>
                <input type="file" id={ id } name={ name } onChange={ () => getTitleImg(nameImage) } hidden
                    onInput={ onInput } aria-label={ ariaLabel } />
            </Label>
        </>
        
    )
}

export default InputFile;