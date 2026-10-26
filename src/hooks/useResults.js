import { useState } from "react";

import resultTemplate from '../data/result-template.json'

export function useResults() {

    const [dataResult, setDataResult] = useState(resultTemplate);

    function addResult() {
        setDataResult(prev => {
            return {
                ...prev,
                items: [
                    ...prev.items,
                    { title: "", imageUrl: "", description: "", 
                        ...( "groupNumber" in prev.items[0] ? { groupNumber: 1 } : { min: 0 } ) }
                ]
            };
        })
    }

    function enterDataResult(event, indexResult) {
        const eventTarget = event.target;
        
        setDataResult(prev => {

            return {
                ...prev,
                items: prev.items.map((item, indexItem) => 
                    indexItem === indexResult
                    ? {
                        ...item,
                        ...(eventTarget.name === `result${indexResult + 1}_min` ? { min: eventTarget.value } : {}),
                        ...(eventTarget.name === `result${indexResult + 1}_groupNumber` ? { groupNumber: eventTarget.value } : {}),
                        ...(eventTarget.name === `result${indexResult + 1}` ? { title: eventTarget.value } : {}),
                        ...(eventTarget.name === `result${indexResult + 1}_description` ? { description: eventTarget.value } : {}),
                        ...(eventTarget.name === `imgResult${indexResult + 1}` 
                            ? { imageUrl: `https://opis-cdn.tinkoffjournal.ru/mercury/${eventTarget.files[0].name}` } : {}),

                    } : item
                )
            }
        });
    }

    function deleteResult(index_result) {
        setDataResult(prev => {
        return {
            ...prev,
            items: prev.items.filter((item, itemIndex) => itemIndex !== index_result)
        }
        });
    }

    function addLinkResult(focusElem, formattedText) {
        setDataResult(prev => {
            
            switch (focusElem.type) {
                case "resultTitle": 
                    prev.items[focusElem.id] = { ...prev.items[focusElem.id], title: formattedText }
                    break;
                case "resultDescription": 
                    prev.items[focusElem.id] = { ...prev.items[focusElem.id], description: formattedText }
                    break;
            }
            return prev;
        })
    }

    function changeTypeResult(typeTest) {
        setDataResult(prev => {
            return {
                ...prev,
                items: prev.items.map(item => {
                    const { min, groupNumber, ...rest } = item;
                    if (typeTest === "category") return { ...rest, groupNumber: 1 };
                    if(typeTest !== "category" && "min" in item) return { ...rest, min: min };
                    return { ...rest, min: 0 };
                })
            }
        })
    }

    return {
        dataResult,
        addResult,
        enterDataResult,
        deleteResult,
        addLinkResult,
        changeTypeResult
    }
}