import { searchInput, form, resultsDiv, crateObj, crateTypeObj, menuBurgerIcon, closeSideBarBtn } from '../constants.js';
import { showAlert, removeAlert, showSideBar, closeSideBar, removeResults } from '../utilities.js';


window.addEventListener('load', () => {
    form.reset();
    crateObj.crate = '';
});


searchInput.addEventListener('input', readValue);
form.addEventListener('submit', getCrates);
menuBurgerIcon.addEventListener('click', showSideBar); 
closeSideBarBtn.addEventListener('click', closeSideBar); 


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
        console.error(error);
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
    
    data.forEach( crate => {
        if(crate.name.toLowerCase().includes(crateObj.crate)) {
            foundResults = true;
            resultsDiv.classList.remove('display-none');
            
            const divCrate = document.createElement('div');
            divCrate.classList.add('div-skin');
            
            const nameCrate = document.createElement('p');
            nameCrate.classList.add('info-api','no-margin', 'padding');
            nameCrate.innerHTML = `Nombre: <span class="info-span">${crate.name.toUpperCase()}</span>`;
            
            const typeCrate = document.createElement('p');
            typeCrate.classList.add('info-api','no-margin', 'padding');
            typeCrate.innerHTML = `Tipo: <span class="info-span">${checkTypeCrate(crate.type.toLowerCase())}</span>`;
            
            const firstSaleDateCrate = document.createElement('p');
            firstSaleDateCrate.classList.add('info-api','no-margin', 'padding');
            firstSaleDateCrate.innerHTML = `Día de salida: <span class="info-span">${crate.first_sale_date ? crate.first_sale_date : 'Sin datos'}</span>`;
            
            // Normal Crate Items
            const containsNormalCrate = document.createElement('select');
            containsNormalCrate.classList.add('select-crate-normal');
            containsNormalCrate.innerHTML = '<option value="" disabled selected>Contenido Común</option>';
            crate.contains.forEach(item => { //there are always elements and it's always an array so I don't need to check if it's empty or if it's an array
                const option = document.createElement('option');
                option.value = item.name;
                option.text = item.name;
                containsNormalCrate.appendChild(option);
            });
            const divSelectNormal = document.createElement('div');
            divSelectNormal.classList.add('div-select-normal');
            divSelectNormal.appendChild(containsNormalCrate);

            // Rare Crate Items
            const containsRareCrate = document.createElement('select');
            containsRareCrate.classList.add('select-crate-rare');
            if(crate.contains_rare.length > 0)  { //sometimes there are no rare items then I need to check if it's just empty because always it's an array
                containsRareCrate.innerHTML = '<option value="" disabled selected>Contenido Raro</option>';
                crate.contains_rare.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.name;
                    option.text = item.name;
                    containsRareCrate.appendChild(option);
                });
            } else {
                const option = document.createElement('option');
                option.value = '';
                option.text = 'No tiene contenido raro';
                containsRareCrate.appendChild(option);
            }
            const divSelectRare = document.createElement('div');
            divSelectRare.classList.add('div-select-rare');
            divSelectRare.appendChild(containsRareCrate);

            const imageUrlCrate = document.createElement('p');
            imageUrlCrate.classList.add('info-api','no-margin', 'padding');
            imageUrlCrate.innerHTML = `Imagen: <a href=${crate.image} target="_blank" class="image-ancor">Imagen de la caja</a>`;


            divCrate.appendChild(nameCrate);
            divCrate.appendChild(typeCrate);
            divCrate.appendChild(firstSaleDateCrate);
            divCrate.appendChild(divSelectNormal);
            divCrate.appendChild(divSelectRare);
            divCrate.appendChild(imageUrlCrate);
            
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
        if(key === crateType) return value.toLocaleUpperCase(); 
    }
};