/** Global **/
window.addEventListener('load', () => {
    form.reset();
    skinObj.skin = '';
});


const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const resultsDiv = document.querySelector('#results');
const form = document.querySelector('#form');

searchInput.addEventListener('blur', validateSkin);
form.addEventListener('submit', getSkins);


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
};

async function getSkins(event) {
    event.preventDefault();

    if(skinObj.skin === '') {
        showAlert('El campo no puede estar vacío');
        skinObj.skin = '';
        return;
    }

    searchInput.classList.remove('error-search-input');
    removeAlert();

    const spanSpinner = document.createElement('span');
    spanSpinner.classList.add('loader');
    form.appendChild(spanSpinner);

    const url = 'https://bymykel.github.io/CSGO-API/api/es-ES/skins.json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        showData(data);
    } catch (error) {
        console.log(error);
        showAlert('Ocurrió un error')
    }
};

function showData(data) {
    cleanResults();
    
    const removeSpinner = document.querySelector('.loader');
    removeSpinner.remove();

    const resultsTitle = document.createElement('h2');
    resultsTitle.classList.add('results-title', 'no-margin');
    resultsTitle.textContent = 'Resultados';
    resultsDiv.appendChild(resultsTitle);

    let foundResults = false;

    data.forEach( skin => {
        const nameSkinFromAPI = skin.name = skin.name.replace('| ', '').replace('★ ', '').toLowerCase();
        const nameWeaponFromAPI = skin.weapon.name.toLowerCase();
        
        let existCollectionName;
        skin.collections ? skin.collections.forEach(collection => existCollectionName = collection.name.slice(9, collection.name.lenght).toUpperCase()) : null;
        //I need to check if there are collections and then iterate again because there are some skins with the same name but with no collection

        let existCrateName;
        skin.crates ? skin.crates.forEach( crate => existCrateName = crate.name.toUpperCase()) : null;
        //Same as above but for crates
        
        if(nameWeaponFromAPI.includes(skinObj.skin) || nameSkinFromAPI.includes(skinObj.skin)) {
            foundResults = true;
            resultsDiv.classList.remove('display-none');
            
            const divSkin = document.createElement('div');
            divSkin.classList.add('div-skin');
            
            const nameSkin = document.createElement('p');
            nameSkin.classList.add('info-api','no-margin', 'margin-bottom');
            nameSkin.innerHTML = `Nombre: <span class="info-skin">${skin.name.toUpperCase()}</span>`;
            
            const categoryName = document.createElement('p');
            categoryName.classList.add('info-api','no-margin', 'margin-bottom');
            categoryName.innerHTML = `Categoría: <span class="info-skin">${skin.category.name.toUpperCase()}</span>`;
            
            const collectionName = document.createElement('p');
            collectionName.classList.add('info-api','no-margin', 'margin-bottom');
            collectionName.innerHTML = `Colección: <span class="info-skin">${existCollectionName ? existCollectionName : 'Sin colección'}</span>`;
            
            const crateName = document.createElement('p');
            crateName.classList.add('info-api','no-margin', 'margin-bottom');
            crateName.innerHTML = `Caja: <span class="info-skin">${existCrateName ? existCrateName : 'Sin caja'}</span>`;

            const rarityName = document.createElement('p');
            rarityName.classList.add('info-api','no-margin', 'margin-bottom');
            rarityName.innerHTML = `Rareza: <span class="info-skin">${skin.rarity.name.toUpperCase()}</span>`;

            const stattrak = document.createElement('p');
            stattrak.classList.add('info-api','no-margin', 'margin-bottom');
            stattrak.innerHTML = `StatTrak: <span class="info-skin">${skin.stattrak === true ? 'Sí' : 'No'}</span>`;

            const souvenir = document.createElement('p');
            souvenir.classList.add('info-api','no-margin', 'margin-bottom');
            souvenir.innerHTML = `Souvenir: <span class="info-skin">${skin.souvenir === true ? 'Sí' : 'No'}</span>`;

            const exclusivity = document.createElement('p');
            exclusivity.classList.add('info-api','no-margin', 'margin-bottom');
            exclusivity.innerHTML = `Exclusividad: <span class="info-skin">${skin.team.name.toUpperCase()}</span>`;

            const imageURL = document.createElement('p');
            imageURL.classList.add('info-api','no-margin', 'margin-bottom');
            imageURL.innerHTML = `Imagen: <a href="${skin.image}" class="image-skin" target="_blank">Click aquí</a>`;

            divSkin.appendChild(nameSkin);
            divSkin.appendChild(categoryName);
            divSkin.appendChild(collectionName);
            divSkin.appendChild(crateName);
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
};

function showAlert(message) {
    removeAlert();

    const error = document.createElement('p');
    error.classList.add('error');
    error.textContent = message;
    searchInput.classList.add('error-search-input');
    form.appendChild(error);

    removeError();
};

function removeError() {
    const removeError = document.querySelector('.error');

    setTimeout(() => {
        removeError.classList.add('disappear');
        removeError.addEventListener('animationend', () => removeError.remove());
    }, 4000);
};

function removeAlert() {
    const error = document.querySelector('.error');
    error ? error.remove() : null;
};

function cleanResults() {
    while(resultsDiv.firstChild) {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }
};