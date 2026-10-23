export function processText(text) {
    const regExpWordConnector = /[\p{L}\p{N}]{1,4}-[\p{L}\p{N}]+|[\p{L}\p{N}]+-[\p{L}\p{N}]{1,4}/giu;
    const regNoBreakSpace = [
        /\sже(?=[\s\p{P}]|$)/giu,
        /\sбы(?=[\s\p{P}]|$)/giu,
        /\sли(?=[\s\p{P}]|$)/giu
    ]
    let correctedText = text;

    if (regNoBreakSpace[0].test(correctedText)) correctedText = correctedText.replace(regNoBreakSpace[0], " же");
    if (regNoBreakSpace[1].test(correctedText)) correctedText = correctedText.replace(regNoBreakSpace[1], " бы");
    if (regNoBreakSpace[2].test(correctedText)) correctedText = correctedText.replace(regNoBreakSpace[2], " ли");

    if (regExpWordConnector.test(correctedText)) {
        correctedText = correctedText.replace(regExpWordConnector, (match) => {
            const substrs = match.split("-")
            return `${substrs[0]}⁠-⁠${substrs[1]}`;
        });
    }

    return correctedText;
}

export function checkTextList(text) {
    const regExpListItem = /^\d*\.\s*/;

    let availabilityList = false;

    const arrayStr = text.split(/\s*(?:\r?\n)+\s*/).map(str => {
        if (regExpListItem.test(str)) {
            availabilityList = true;
            return "\n" + str.replace(regExpListItem, "") + "</li>"
        };
        return  "<p>" + str + "</p>"
    })

    const combinedText = arrayStr.join("");
    let correctedText = combinedText;

    if (availabilityList) {
        const formattedStrList = ('<ol type="milchin">' + 
            combinedText.substring(combinedText.indexOf("\n"), combinedText.lastIndexOf("</li>") + 5) + "</ol>").replaceAll("</li>", "");
        correctedText = combinedText.substring(0, combinedText.indexOf("\n")) + formattedStrList + combinedText.substring(combinedText.lastIndexOf("</li>") + 5);
    }

    return correctedText;
}

export function formatEnding(colQuestion) {
    const n = colQuestion % 10;

    if (colQuestion % 100 >= 11 && colQuestion % 100 <= 19) return colQuestion + " вопросов";
    if (n === 1) return colQuestion + " вопрос";
    if (n >= 2 && n <= 4) return colQuestion + " вопроса";

    return colQuestion + " вопросов";
}