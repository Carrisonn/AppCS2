import { searchInput, form, sideBar, divNavLinks, resultsDiv } from './constants.js';

export function showAlert(message) {
    removeAlert();

    const error = document.createElement('p');
    error.classList.add('error');
    error.textContent = message;
    searchInput.classList.add('error-search-input');
    form.appendChild(error);

    animRemoveError();
};

function animRemoveError() {
    const removeError = document.querySelector('.error');
    setTimeout(() => {
        removeError.classList.add('disappear');
        removeError.addEventListener('animationend', () => removeError.remove());
    }, 4000);
};

export function removeAlert() {
    const error = document.querySelector('.error');
    error ? error.remove() : null;
};

export function showSideBar() {
    sideBar.classList.add('open', 'display-grid');
    sideBar.classList.remove('display-none', 'close-sidebar-anim');
    divNavLinks.classList.remove('close-div-nav-links-anim');
};

export function closeSideBar() {
    sideBar.classList.contains('open') ? sideBar.classList.add('close-sidebar-anim') : null;
    sideBar.classList.remove('open');
    divNavLinks.classList.add('close-div-nav-links-anim');
    
    sideBar.addEventListener('animationend', () => {
        if(sideBar.classList.contains('close-sidebar-anim')) {
            sideBar.classList.remove('display-grid')
            sideBar.classList.add('display-none')
        }  
    });
};

export function removeResults() {
    while(resultsDiv.firstChild) {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }
};