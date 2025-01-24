/** Global **/
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
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
        console.log(error) ?? showAlert('Ocurrió un error');

        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
}

function showData(data) {
    cleanResults();
    
    const resultsTitle = document.createElement('h2');
    resultsTitle.classList.add('results-title', 'no-margin');
    resultsTitle.textContent = 'Resultados';
    resultsDiv.appendChild(resultsTitle);

    let foundResults = false;
    
    data.forEach( info => {
        info.name = info.name.replace('| ', '').replace('★ ', '');

        if(info.weapon.name.toLowerCase().includes(skinObj.skin) || info.name.toLowerCase().includes(skinObj.skin) ) {
            foundResults = true;
            resultsDiv.classList.remove('display-none');

            const divSkin = document.createElement('div');
            divSkin.classList.add('div-skin');
            
            const nameSkin = document.createElement('p');
            nameSkin.classList.add('info-api','no-margin', 'margin-bottom');
            nameSkin.innerHTML = `Nombre: <span class="info-skin">${info.name}</span>`;
            
            const categoryName = document.createElement('p');
            categoryName.classList.add('info-api','no-margin', 'margin-bottom');
            categoryName.innerHTML = `Categoría: <span class="info-skin">${info.category.name}</span>`;
            
            const rarityName = document.createElement('p');
            rarityName.classList.add('info-api','no-margin', 'margin-bottom');
            rarityName.innerHTML = `Rareza: <span class="info-skin">${info.rarity.name}</span>`;

            const stattrak = document.createElement('p');
            stattrak.classList.add('info-api','no-margin', 'margin-bottom');
            stattrak.innerHTML = `StatTrak: <span class="info-skin">${info.stattrak === true ? 'Sí' : 'No'}</span>`;

            const souvenir = document.createElement('p');
            souvenir.classList.add('info-api','no-margin', 'margin-bottom');
            souvenir.innerHTML = `Souvenir: <span class="info-skin">${info.souvenir === true ? 'Sí' : 'No'}</span>`;

            const exclusivity = document.createElement('p');
            exclusivity.classList.add('info-api','no-margin', 'margin-bottom');
            exclusivity.innerHTML = `Exclusividad: <span class="info-skin">${info.team.name}</span>`;

            const imageURL = document.createElement('p');
            imageURL.classList.add('info-api','no-margin', 'margin-bottom');
            imageURL.innerHTML = `Imagen: <a href="${info.image}" class="image-skin" target="_blank">Click aquí</a>`;

            divSkin.appendChild(nameSkin);
            divSkin.appendChild(categoryName);
            divSkin.appendChild(rarityName);
            divSkin.appendChild(stattrak);
            divSkin.appendChild(souvenir);
            divSkin.appendChild(exclusivity);
            divSkin.appendChild(imageURL);

            resultsDiv.appendChild(divSkin);
        }
    });

    if(!foundResults) {
        showAlert('No se encontraron resultados');
        resultsDiv.classList.add('display-none');
    }

    searchInput.value = '';
    skinObj.skin = '';
}

function showAlert(message) {
    cleanAlert();

    const error = document.createElement('p');
    error.classList.add('error');
    error.textContent = message;
    form.appendChild(error);

    closeError();
}

function closeError() {
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