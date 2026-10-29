import { useEffect } from "react";
import { saveLocalStorageData } from "../utils/storage";

export function useDataStorage({ dataQuestionsAnswers, imageDescriptions, dataResult }) {
    useEffect(() => {
        saveLocalStorageData("questions_answers", JSON.stringify(dataQuestionsAnswers));
        saveLocalStorageData("images_description_answers", JSON.stringify(imageDescriptions));
    }, [dataQuestionsAnswers, imageDescriptions]); 

    useEffect(() => {
        saveLocalStorageData("results", JSON.stringify(dataResult));
    }, [dataResult]); 
}