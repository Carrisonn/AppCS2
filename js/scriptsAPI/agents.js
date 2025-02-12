import { searchInput, form, resultsDiv, agentObj, menuBurgerIcon, closeSideBarBtn } from '../constants.js';
import { showAlert, removeAlert, showSideBar, closeSideBar, removeResults } from '../utilities.js';


window.addEventListener('load', () => {
    form.reset();
    agentObj.agent = '';
});


searchInput.addEventListener('input', readValue);
form.addEventListener('submit', getAgents);
menuBurgerIcon.addEventListener('click', showSideBar);
closeSideBarBtn.addEventListener('click', closeSideBar);


function readValue(event) {
    agentObj.agent = event.target.value.trim().toLowerCase();
};

async function getAgents(event) {
    event.preventDefault();

    if(agentObj.agent === '') {
        showAlert('El campo no puede estar vacío');
        searchInput.value = '';
        agentObj.agent = '';
        return;
    }

    searchInput.classList.remove('error-search-input');
    removeAlert();

    const spanSpinner = document.createElement('span');
    spanSpinner.classList.add('loader');
    form.appendChild(spanSpinner);

    const url = 'https://bymykel.github.io/CSGO-API/api/es-ES/agents.json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        showData(data);
    } catch (error) {
        console.error(error);
        showAlert('Ocurrió un error al obtener los agentes');
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

    data.forEach( agent => {
        const nameAgentFormatted = agent.name.replace(/["'><]/g, '').replace('| ', '').toLowerCase();
        
        if(nameAgentFormatted.includes(agentObj.agent)) {
            foundResults = true;
            resultsDiv.classList.remove('display-none');

            const divAgent = document.createElement('div');
            divAgent.classList.add('div-skin');

            const nameAgent = document.createElement('p');
            nameAgent.classList.add('info-api','no-margin', 'padding');
            nameAgent.innerHTML = `Nombre: <span class="info-span">${nameAgentFormatted.toUpperCase()}</span>`;

            const rarityAgent = document.createElement('p');
            rarityAgent.classList.add('info-api','no-margin', 'padding');
            rarityAgent.innerHTML = `Rareza: <span class="info-span">${agent.rarity.name.toUpperCase()}</span>`;

            const collectionAppearAgent = document.createElement('p');
            collectionAppearAgent.classList.add('info-api','no-margin', 'padding');
            collectionAppearAgent.innerHTML = `Colección: <span class="info-span">${agent.collections[0].name.toUpperCase()}</span>`;

            const teamAgent = document.createElement('p');
            teamAgent.classList.add('info-api','no-margin', 'padding');
            teamAgent.innerHTML = `Equipo: <span class="info-span">${agent.team.name.toUpperCase()}</span>`;

            const imageUrlAgent = document.createElement('p');
            imageUrlAgent.classList.add('info-api','no-margin', 'padding');
            imageUrlAgent.innerHTML = `Imagen: <a href="${agent.image}" class="image-ancor" target="_blank">Imagen del agente</a>`;

            divAgent.appendChild(nameAgent);
            divAgent.appendChild(rarityAgent);
            divAgent.appendChild(collectionAppearAgent);
            divAgent.appendChild(teamAgent);
            divAgent.appendChild(imageUrlAgent);

            resultsDiv.appendChild(divAgent);
        }
    });

    if(!foundResults){
        showAlert('No se encontraron resultados');
        resultsDiv.classList.add('display-none');
    }

    agentObj.agent = '';
    searchInput.value = '';
};