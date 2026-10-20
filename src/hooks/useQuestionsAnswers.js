import { useState } from "react";

import stepTemplate from '../data/step-template.json'

export function useQuestionsAnswers() {
    const [dataQuestionsAnswers, setDataQuestionsAnswers] = useState([stepTemplate]);

    function addQuestion() {
        setDataQuestionsAnswers(prev => [
            ...prev,
            {        
                type: "optionButton",  
                answers: Array.from({ length: 2 }, () => ({
                        ...(prev[0].type === "optionButton"
                            ? { title: "" } : "isCorrect" in prev[0].answers[0]
                                ? { backgroundUrl: "", reactionImageUrl: "" } : { backgroundUrl: "" }),

                        ...("isCorrect" in prev[0].answers[0] ? { isCorrect: false } : { score: 0 }),

                        description: ""
                    })
                ),
                question: [
                    { text: "", type: "title" },
                    { text: "", type: "description" }
                ]
            }
        ]);
    }

    function addAnswer(indexQuestion) {
        setDataQuestionsAnswers(prev => {
            const questions = [...prev];
            questions[indexQuestion] = {
                ...questions[indexQuestion],
                answers: [
                    ...questions[indexQuestion].answers,
                    {
                        ...(questions[indexQuestion].type === "optionButton"
                            ? { title: "" }
                            : "isCorrect" in questions[indexQuestion].answers[0]
                                ? { backgroundUrl: "", reactionImageUrl: "https://opis-cdn.tinkoffjournal.ru/mercury/7iyV9K3XGD.dislike.png" } : { backgroundUrl: "" }
                        ),
                        ...("isCorrect" in questions[indexQuestion].answers[0] ? { isCorrect: false } : { score: 0 } ),
                        description: ""
                    }
                ]
            };
            return questions;
        })
    }

    function enterDataQuestionsAnswers(event, indexQuestion, indexAnswer) {
        const eventTarget = event.target;
        
        setDataQuestionsAnswers(prev => {
            const questions = [...prev];

            if(indexAnswer === undefined) {
                questions[indexQuestion] = {
                    ...questions[indexQuestion],
                    ...(eventTarget.name === `typeQuestion${indexQuestion + 1}`
                        ? { type: eventTarget.value } : {}),
                    
                    answers: questions[indexQuestion].answers.map(answer => {
                        const { title, backgroundUrl, reactionImageUrl, ...rest } = answer;
                        return {
                            ...rest,
                            ...(eventTarget.name === `typeQuestion${indexQuestion + 1}`
                                ? (eventTarget.value === "optionButton"
                                    ? { title: answer.title ?? "" } 
                                    : ("isCorrect" in answer 
                                        ? { backgroundUrl: "", reactionImageUrl: "https://opis-cdn.tinkoffjournal.ru/mercury/7iyV9K3XGD.dislike.png" }
                                        : { backgroundUrl: "" }
                                    )
                                ) : answer),   
                        }
                    }), 

                    question: [
                        {
                            ...questions[indexQuestion].question.find(obj => obj.type === "title"),
                            ...(eventTarget.name === `question${indexQuestion + 1}` ? { text: eventTarget.value } : {})
                        },

                        {
                            ...questions[indexQuestion].question.find(obj => obj.type === "description"),
                            ...(eventTarget.name === `question${indexQuestion + 1}_description` ? { text: eventTarget.value } : {})
                        },

                        ...(eventTarget.name === `imgQuestion${indexQuestion + 1}`
                            ? [{
                                url: `https://opis-cdn.tinkoffjournal.ru/mercury/${eventTarget.files[0].name}`,
                                size: "fullWidth",
                                type: "image"
                            }] : (questions[indexQuestion].question.some(obj => "url" in obj)
                                ? [questions[indexQuestion].question.find(obj => "url" in obj)] : [] )
                        )
                    ] 
                } 
   
            } else {
                questions[indexQuestion] = {
                    ...questions[indexQuestion],
                    answers: questions[indexQuestion].answers.map((answer, aIndex) => 
                        aIndex === indexAnswer ? {
                            ...answer, 
                            ...(eventTarget.name === `q${indexQuestion + 1}_a${indexAnswer + 1}`
                                ? { title: eventTarget.value } : {}),
                                
                            ...(eventTarget.name === `q${indexQuestion + 1}_a${indexAnswer + 1}_description`
                                ? { description: eventTarget.value } : {}),
                                
                            ...(eventTarget.name === `img_q${indexQuestion + 1}_a${indexAnswer + 1}`
                                ? { backgroundUrl: `https://opis-cdn.tinkoffjournal.ru/mercury/${eventTarget.files[0].name}` } : {}),

                            ...(eventTarget.name === `score_q${indexQuestion + 1}_a${indexAnswer + 1}`
                                ? { score: eventTarget.value } : {}),

                            ...(eventTarget.name === `isCorrect_q${indexQuestion + 1}_a${indexAnswer + 1}`
                                ? { isCorrect: eventTarget.value === "true" } : {}),

                            ...(questions[indexQuestion].type === "tile" && "isCorrect" in answer
                                ? ((eventTarget.name === `isCorrect_q${indexQuestion + 1}_a${indexAnswer + 1}` && eventTarget.value === "true") 
                                    ? { reactionImageUrl: "https://opis-cdn.tinkoffjournal.ru/mercury/D2t-lz8bxw.Like.png" }
                                    : { reactionImageUrl: "https://opis-cdn.tinkoffjournal.ru/mercury/7iyV9K3XGD.dislike.png" }) : {}) } : answer )
                }
            }
            return questions;
        });
    }

    function deleteQuestion(indexQuestion) {
        setDataQuestionsAnswers(prev => prev.filter((_, index_step) => index_step !== indexQuestion));
    }

    function deleteAnswer(indexQuestion, indexAnswer) {
        setDataQuestionsAnswers(prev => 
        prev.map((step, index_step) => {
            return index_step === indexQuestion ? {
            ...step,
            answers: step.answers.filter((_, indexStepAnswer) => indexStepAnswer !== indexAnswer)
            } : step;
        }));
    }

    function changeTypeAnswer(typeTest) {
        setDataQuestionsAnswers(prev => {
            return prev.map(step => {
                return {
                    ...step, 
                    answers: step.answers.map(answer => {
                        const { isCorrect, score, reactionImageUrl, ...rest } = answer;
                        if (typeTest === "quiz") {
                            if (step.type === "tile") {
                                return { 
                                    ...rest, 
                                    isCorrect: false, 
                                    reactionImageUrl: answer.reactionImageUrl ?? "https://opis-cdn.tinkoffjournal.ru/mercury/7iyV9K3XGD.dislike.png" 
                                }
                            }
                            return { ...rest, isCorrect: false }
                        }
                        return { ...rest, score: 0 }
                    })
                }
                // return step;
            })
        })
    }

    function addLinkQuestionsAnswers(focusElem, formattedText) {
        setDataQuestionsAnswers(prev => {
            const questions = [...prev];
            switch (focusElem.type) {
                case "questionTitle": 
                    questions[focusElem.id].question[questions[focusElem.id].question.findIndex(obj => obj.type === "title")] = 
                        { text: formattedText, type: "title" };
                    break;
                case "questionDescription": 
                    questions[focusElem.id].question[questions[focusElem.id].question.findIndex(obj => obj.type === "description")] = 
                        { text: formattedText, type: "description" };
                    break;
                case "answerTitle": 
                    questions[focusElem.id[0]].answers[focusElem.id[1]] = { ...questions[focusElem.id[0]].answers[focusElem.id[1]], title: formattedText };
                    break;
                case "answerDescription": 
                    questions[focusElem.id[0]].answers[focusElem.id[1]] = { ...questions[focusElem.id[0]].answers[focusElem.id[1]], description: formattedText };
                    break;
            }
                
            return questions;
        })
    }

    return {
        dataQuestionsAnswers,
        addQuestion,
        addAnswer,
        enterDataQuestionsAnswers,
        deleteQuestion,
        deleteAnswer,
        changeTypeAnswer,
        addLinkQuestionsAnswers
    }
}