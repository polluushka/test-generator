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
                    { min: 0, title: "", imageUrl: "", description: "" }
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

    return {
        dataResult,
        addResult,
        enterDataResult,
        deleteResult,
    }
}