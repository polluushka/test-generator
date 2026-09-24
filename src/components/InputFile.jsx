import { useState } from "react";
import Label from "./Label";

const InputFile = (props) => {

    const {
        id,
        name    
    } = props;

    const [titleImg, setTitleImg] = useState("Файл не выбран");

    function getTitleImg(file) {
        setTitleImg(file.files[0].name);
    }

    return(
        <>
            <Label classLabel="upload">
                <span className="ico">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15l-5-5L5 21"></path><path d="M3 16V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14"></path>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    </svg>
                </span>
                <span className="up-text"><b>{ titleImg }</b><br/>
                    <em>Файл нужно залить в mercury с этим же именем</em>
                </span>
                <input type="file" id={ id } name={ name } onChange={ (event) => getTitleImg(event.target) } hidden />
            </Label>
        </>
        
    )
}

export default InputFile;