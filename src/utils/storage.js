export function saveLocalStorageData(key, data) {
    localStorage.setItem(key, data);
}

export function getLocalStorageData(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function clearLocalStorage() {
    localStorage.removeItem("images_description_answers");
    localStorage.removeItem("questions_answers");
    localStorage.removeItem("results");
}