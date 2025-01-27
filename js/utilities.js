import { searchInput, form } from './variables.js';

export function showAlert(message) {
    removeAlert();

    const error = document.createElement('p');
    error.classList.add('error');
    error.textContent = message;
    searchInput.classList.add('error-search-input');
    form.appendChild(error);

    removeError();
};

export function removeError() {
    const removeError = document.querySelector('.error');
    setTimeout(() => {
        removeError.classList.add('disappear');
        removeError.addEventListener('animationend', () => removeError.remove());
    }, 5000);
};

export function removeAlert() {
    const error = document.querySelector('.error');
    error ? error.remove() : null;
};