import { searchInput, form, resultsDiv, collectionObj, menuBurgerIcon, closeSideBarBtn } from '../constants.js';
import { showAlert, removeAlert, showSideBar, closeSideBar, removeResults } from '../utilities.js';


window.addEventListener('load', () => {
    form.reset();
    collectionObj.collection = '';
});


searchInput.addEventListener('input', readValue);
form.addEventListener('submit', getCollections);
menuBurgerIcon.addEventListener('click', showSideBar);
closeSideBarBtn.addEventListener('click', closeSideBar);


function readValue(event) {
    collectionObj.collection = event.target.value.trim().toLowerCase();
};

async function getCollections(event) {
    event.preventDefault();

    if(collectionObj.collection === '') {
        showAlert('El campo no puede estar vacío');
        searchInput.value = '';
        collectionObj.collection = '';
        return;
    }

    searchInput.classList.remove('error-search-input');
    removeAlert();

    const spanSpinner = document.createElement('span');
    spanSpinner.classList.add('loader');
    form.appendChild(spanSpinner);

    const url = 'https://bymykel.github.io/CSGO-API/api/es-ES/collections.json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        showData(data);
    } catch (error) {
        console.error(error);
        showAlert('Ocurrió un error al obtener las colecciones');
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

    data.forEach( collection => {
        if(collection.name.toLowerCase().includes(collectionObj.collection)) {
            foundResults = true;
            resultsDiv.classList.remove('display-none');

            let existCrates;
            collection.crates ? collection.crates.forEach(crate => existCrates = crate.name.toUpperCase()) : null;

            const divCollection = document.createElement('div');
            divCollection.classList.add('div-skin');

            const nameCollection = document.createElement('p');
            nameCollection.classList.add('info-api','no-margin', 'padding');
            nameCollection.innerHTML = `Nombre: <span class="info-span">${collection.name.toUpperCase()}</span>`;

            const cratesCollection = document.createElement('p');
            cratesCollection.classList.add('info-api','no-margin', 'padding');
            cratesCollection.innerHTML = `Caja: <span class="info-span">${existCrates ? existCrates : 'Sin cajas'}</span>`;

            const containsCollection = document.createElement('select');
            containsCollection.classList.add('select-crate-normal');
            containsCollection.innerHTML = '<option value="" disabled selected>Contenido</option>';
            collection.contains.forEach( content => { // there are always elements and it's always an array so I don't need to check if it's empty or if it's an array
                const option = document.createElement('option');
                option.value = content.name;
                option.text = content.name;
                containsCollection.appendChild(option);
            })
            const divSelectContains = document.createElement('div');
            divSelectContains.classList.add('div-select-normal');
            divSelectContains.appendChild(containsCollection);

            const imageUrlCollection = document.createElement('p');
            imageUrlCollection.classList.add('info-api','no-margin', 'padding');
            imageUrlCollection.innerHTML = `Imagen: <a href="${collection.image}" class="image-ancor" target="_blank">Imagen de la colección</a>`;


            divCollection.appendChild(nameCollection);
            divCollection.appendChild(cratesCollection);
            divCollection.appendChild(divSelectContains);
            divCollection.appendChild(imageUrlCollection);

            resultsDiv.appendChild(divCollection);
        }
    })

    if(!foundResults){
        showAlert('No se encontraron resultados');
        resultsDiv.classList.add('display-none');
    }
    
    collectionObj.collection = '';
    searchInput.value = '';
};