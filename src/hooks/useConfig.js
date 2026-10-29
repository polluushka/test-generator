import { useState } from "react";
import templateJSON from '../data/template.json'
import { processText, checkTextList } from "../utils/typography";

export function useConfig() {

    const [dataConfig, setDataConfig] = useState(templateJSON);
    const [dataConfigEmpty, setDataConfigEmpty] = useState(true);

    function updateСonfig(dataQuestionsAnswers, imageDescriptions, dataResult) {
        setDataConfig(prev => {
            const config = {
                ...prev, 
                steps: dataQuestionsAnswers.map((step, stepIndex) => {
                return {
                    ...step,
                    answers: step.answers.map((answer, answerIndex) => {
                    return {
                        ...answer,
                        title: processText(answer.title),
                        ...("score" in answer && { score: Number(answer.score) }),
                        ...("groupNumber" in answer && { groupNumber: Number(answer.groupNumber) }),
                        ...(imageDescriptions.some(obj => obj.question === stepIndex && obj.answer === answerIndex)
                                ? { description: processText(checkTextList(answer.description)) 
                                + `<img src='${imageDescriptions.find(obj => obj.question === stepIndex && obj.answer === answerIndex).url}' style='max-width: 100%;'>` } 
                                : { description: processText(checkTextList(answer.description)) })
                        }
                    }),
                    question: (step.question.filter(setting => 
                    setting.type === "description" ? (setting.text.length > 0 ? true : false) : true
                    )).map(setting => {
                    return setting.type === "description" 
                        ? { ...setting, text: processText(checkTextList(setting.text)) } 
                        : (setting.type === "title" ? { ...setting, text: processText(setting.text) } : setting);
                    })
                }
                }),
                result: {
                items: dataResult.items.map(item => {
                    return {
                    ...item, 
                    ...("min" in item ? { min: Number(item.min) } : { groupNumber: Number(item.groupNumber) }),
                    title: processText(item.title),
                    description: processText(checkTextList(item.description))
                    }
                }),
                isRetakeEnabled: dataResult.isRetakeEnabled,
                canScrollToFirstError: dataResult.canScrollToFirstError,
                shouldShowScoreCounter: dataResult.shouldShowScoreCounter
                }
            }
            return config
        });
        
        setDataConfigEmpty(false);
    }

    function copyConfig() {
        navigator.clipboard.writeText(dataConfigEmpty ? "" : JSON.stringify(dataConfig, null, 2));
    }

    return {
        dataConfig,
        dataConfigEmpty,
        updateСonfig,
        copyConfig
    }
}