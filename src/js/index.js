import myJson from '../js/localStorage/quises_data.json' with {type: 'json'};
import { saveToLocalStorage } from "../js/localStorage/localStorageManager.js";

if (localStorage.getItem('QuizesData') === null) {
    saveToLocalStorage(myJson);
}