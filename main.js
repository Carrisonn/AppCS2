/** Global **/
const searchInput = document.querySelector('#search-input');
const resultsDiv = document.querySelector('#results');
const form = document.querySelector('#form');

searchInput.addEventListener('blur', validateSkin);
form.addEventListener('submit', getSkins);


window.addEventListener('load', () => {
    form.reset();
});


const skinObj = {
    skin: ''
}


/** Functions **/
function validateSkin(event) {
    if(event.target.value.trim() === '') {
        showAlert('El campo no puede estar vacío');
        skinObj.skin = '';
        event.target.value = '';
        return;
    } 

    skinObj.skin = event.target.value.trim().toLowerCase();
    console.log(skinObj);
}

async function getSkins(event) {
    event.preventDefault();

    if(skinObj.skin === '') {
        showAlert('El campo no puede estar vacío');
        skinObj.skin = '';
        return;
    }

    const url = 'https://bymykel.github.io/CSGO-API/api/es-ES/skins.json';

    try {
        const response = await fetch(url);
        const data = await response.json();
        showData(data);
    } catch (error) {
        console.log(error);
    }

}

function showData(data) {

    cleanResults();

    const resultsTitle = document.createElement('h2');
    resultsTitle.classList.add('results-title', 'no-margin');
    resultsTitle.textContent = 'Resultados';
    resultsDiv.appendChild(resultsTitle);

    data.forEach(info => {
        info.name = info.name.replace('| ', '').replace('★ ', '');

        if(info.weapon.name.toLowerCase().includes(skinObj.skin) || info.name.toLowerCase().includes(skinObj.skin) ) {
            resultsDiv.classList.remove('display-none');



            const p = document.createElement('p');
            p.textContent = info.name;
            
            
            resultsDiv.appendChild(p);
            return;
        }
        
    });
    searchInput.value = '';
    skinObj.skin = '';
}

function showAlert(message) {
    cleanAlert();

    const error = document.createElement('p');
    error.classList.add('error');
    error.textContent = message;
    form.appendChild(error);

    closeAlert();
}

function closeAlert() {
    const closeError = document.querySelector('.error');

    setTimeout(() => {
        closeError.classList.add('disappear');
        closeError.addEventListener('animationend', () => {
            closeError.remove();
        })
    }, 3000);
}

function cleanAlert() {
    const error = document.querySelector('.error');

    if(error) {
        error.remove();
    }
}

function cleanResults() {
    while(resultsDiv.firstChild) {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }
}