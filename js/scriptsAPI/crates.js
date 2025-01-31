import { searchInput, form, resultsDiv, crateObj, crateTypeObj, menuBurgerIcon, closeSideBarBtn } from '../constants.js';
import { showAlert, removeAlert, showSideBar, closeSideBar, removeResults } from '../utilities.js';

window.addEventListener('load', () => {
    form.reset();
    crateObj.crate = '';
});


searchInput.addEventListener('input', readValue);
form.addEventListener('submit', getCrates);
menuBurgerIcon.addEventListener('click', showSideBar); // utilities.js
closeSideBarBtn.addEventListener('click', closeSideBar); // utilities.js



function readValue(event) {
    crateObj.crate = event.target.value.trim().toLowerCase();
};

async function getCrates(event) {
    event.preventDefault();
    
    if(crateObj.crate === '') {
        showAlert('El campo no puede estar vacío');
        searchInput.value = '';
        crateObj.crate = '';
        return;
    }
    
    searchInput.classList.remove('error-search-input');
    removeAlert();
    
    const spanSpinner = document.createElement('span');
    spanSpinner.classList.add('loader');
    form.appendChild(spanSpinner);
    
    const url = 'https://bymykel.github.io/CSGO-API/api/es-ES/crates.json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        showData(data);
    } catch (error) {
        console.log(error);
        showAlert('Ocurrió un error al obtener las cajas');
    }
};

function showData(data) {
    removeResults()
    
    const removeSpinner = document.querySelector('.loader');
    removeSpinner.remove();
    
    const resultsTitle = document.createElement('h2');
    resultsTitle.classList.add('results-title', 'no-margin');
    resultsTitle.textContent = 'Resultados';
    resultsDiv.appendChild(resultsTitle);
    
    let foundResults = false;
    
    data.forEach(crate => {
        if(crate.name.toLowerCase().includes(crateObj.crate)) {
            foundResults = true;
            resultsDiv.classList.remove('display-none');
            
            const divCrate = document.createElement('div');
            divCrate.classList.add('div-skin');
            
            const crateName = document.createElement('p');
            crateName.classList.add('info-api','no-margin', 'padding');
            crateName.innerHTML = `Nombre: <span class="info-span">${crate.name.toUpperCase()}</span>`;
            
            const crateType = document.createElement('p');
            crateType.classList.add('info-api','no-margin', 'padding');
            crateType.innerHTML = `Tipo: <span class="info-span">${checkTypeCrate(crate.type.toLowerCase())}</span>`; 
            
            divCrate.appendChild(crateName);
            divCrate.appendChild(crateType);
            
            resultsDiv.appendChild(divCrate);
        }
    });

    if(!foundResults){
        showAlert('No se encontraron resultados');
        resultsDiv.classList.add('display-none');
    }

    crateObj.crate = '';
    searchInput.value = '';
};

function checkTypeCrate(crateType) {
    for (const [key, value] of Object.entries(crateTypeObj)) {
        if(key === crateType) {
            return value.toLocaleUpperCase();
        }
    }
};