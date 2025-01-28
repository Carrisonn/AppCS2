import { searchInput, form, resultsDiv, skinObj, menuBurgerIcon,  closeSideBarBtn } from './selectors.js';
import { showAlert, removeAlert, showSideBar, closeSideBar, submitWithEnterKey, removeResults } from './utilities.js';

window.addEventListener('load', () => {
    form.reset();
    skinObj.skin = '';
});


searchInput.addEventListener('input', readValue);
form.addEventListener('submit', getSkins);
menuBurgerIcon.addEventListener('click', showSideBar);
closeSideBarBtn.addEventListener('click', closeSideBar);


function readValue(event) {
    skinObj.skin = event.target.value.trim().toLowerCase();
};

async function getSkins(event) {
    event.preventDefault();

    if(skinObj.skin === '') {
        showAlert('El campo no puede estar vacío');
        searchInput.value = '';
        skinObj.skin = '';
        return;
    }

    submitWithEnterKey();

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
    removeResults();
    
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
        
        if(nameWeaponFromAPI.includes(skinObj.skin) || nameSkinFromAPI.includes(skinObj.skin)) {
            foundResults = true;
            resultsDiv.classList.remove('display-none');

            let existCollectionName;
            skin.collections ? skin.collections.forEach(collection => existCollectionName = collection.name.slice(9, collection.name.lenght).toUpperCase()) : null;
            /* I need to check if there are collections and then iterate again because there are some skins with similar name but without collection,
            otherwise I could be acces to the values with something like that: 'skin.collecttions[0].name' */
    
            let existCrateName;
            skin.crates ? skin.crates.forEach(crate => existCrateName = crate.name.toUpperCase()) : null;
            //Same as above but for crates
            
            const divSkin = document.createElement('div');
            divSkin.classList.add('div-skin');
            
            const nameSkin = document.createElement('p');
            nameSkin.classList.add('info-api','no-margin', 'padding');
            nameSkin.innerHTML = `Nombre: <span class="info-skin">${nameSkinFromAPI.toUpperCase()}</span>`;
            
            const categoryName = document.createElement('p');
            categoryName.classList.add('info-api','no-margin', 'padding');
            categoryName.innerHTML = `Categoría: <span class="info-skin">${skin.category.name.toUpperCase()}</span>`;
            
            const collectionName = document.createElement('p');
            collectionName.classList.add('info-api','no-margin', 'padding');
            collectionName.innerHTML = `Colección: <span class="info-skin">${existCollectionName ? existCollectionName : 'Sin colección'}</span>`;
            
            const crateName = document.createElement('p');
            crateName.classList.add('info-api','no-margin', 'padding');
            crateName.innerHTML = `Caja: <span class="info-skin">${existCrateName ? existCrateName : 'Sin caja'}</span>`;

            const rarityName = document.createElement('p');
            rarityName.classList.add('info-api','no-margin', 'padding');
            rarityName.innerHTML = `Rareza: <span class="info-skin">${skin.rarity.name.toUpperCase()}</span>`;

            const stattrak = document.createElement('p');
            stattrak.classList.add('info-api','no-margin', 'padding');
            stattrak.innerHTML = `StatTrak: <span class="info-skin">${skin.stattrak === true ? 'Sí' : 'No'}</span>`;

            const souvenir = document.createElement('p');
            souvenir.classList.add('info-api','no-margin', 'padding');
            souvenir.innerHTML = `Souvenir: <span class="info-skin">${skin.souvenir === true ? 'Sí' : 'No'}</span>`;

            const team = document.createElement('p');
            team.classList.add('info-api','no-margin', 'padding');
            team.innerHTML = `Equipo: <span class="info-skin">${skin.team.name.toUpperCase()}</span>`;

            const imageURL = document.createElement('p');
            imageURL.classList.add('info-api','no-margin', 'padding');
            imageURL.innerHTML = `Imagen: <a href="${skin.image}" class="image-skin" target="_blank">Imagen</a>`;

            divSkin.appendChild(nameSkin);
            divSkin.appendChild(categoryName);
            divSkin.appendChild(collectionName);
            divSkin.appendChild(crateName);
            divSkin.appendChild(rarityName);
            divSkin.appendChild(stattrak);
            divSkin.appendChild(souvenir);
            divSkin.appendChild(team);
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