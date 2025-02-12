import { searchInput, form, resultsDiv, stickerObj, menuBurgerIcon, closeSideBarBtn } from '../constants.js';
import { showAlert, removeAlert, showSideBar, closeSideBar, removeResults } from '../utilities.js';


window.addEventListener('load', () => {
    form.reset();
    stickerObj.sticker = '';
});


searchInput.addEventListener('input', readValue);
form.addEventListener('submit', getStickers);
menuBurgerIcon.addEventListener('click', showSideBar);
closeSideBarBtn.addEventListener('click', closeSideBar);


function readValue(event) {
    stickerObj.sticker = event.target.value.trim().toLowerCase();
};

async function getStickers(event) {
    event.preventDefault();

    if(stickerObj.sticker === '') {
        showAlert('El campo no puede estar vacío');
        searchInput.value = '';
        stickerObj.sticker = '';
        return;
    }

    searchInput.classList.remove('error-search-input');
    removeAlert();

    const spanSpinner = document.createElement('span');
    spanSpinner.classList.add('loader');
    form.appendChild(spanSpinner);

    const url = 'https://bymykel.github.io/CSGO-API/api/es-ES/stickers.json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        showData(data);
    } catch (error) {
        console.error(error);
        showAlert('Ocurrió un error al obtener los stickers');
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

    data.forEach( sticker => {
        const nameStickerFormatted = sticker.name.slice(10).replace(/\s*\|/g, '').toLowerCase();

        if(nameStickerFormatted.includes(stickerObj.sticker)) {
            foundResults = true;
            resultsDiv.classList.remove('display-none');

            let existCrateName;
            sticker.crates ? sticker.crates.forEach(crate => existCrateName = crate.name.toUpperCase()) : null;

            const divSticker = document.createElement('div');
            divSticker.classList.add('div-skin');

            const nameSticker = document.createElement('p');
            nameSticker.classList.add('info-api','no-margin', 'padding');
            nameSticker.innerHTML = `Nombre: <span class="info-span">${nameStickerFormatted.toUpperCase()}</span>`;

            const rarityNameSticker = document.createElement('p');
            rarityNameSticker.classList.add('info-api','no-margin', 'padding');
            rarityNameSticker.innerHTML = `Rareza: <span class="info-span">${sticker.rarity.name.toUpperCase()}</span>`;

            const crateNameSticker = document.createElement('p');
            crateNameSticker.classList.add('info-api','no-margin', 'padding');
            crateNameSticker.innerHTML = `Caja: <span class="info-span">${existCrateName ? existCrateName : 'Sin caja'}</span>`;

            const tournamentNameEventSticker = document.createElement('p');
            tournamentNameEventSticker.classList.add('info-api','no-margin', 'padding');
            tournamentNameEventSticker.innerHTML = `Evento: <span class="info-span">${sticker.tournament_event ? sticker.tournament_event.toUpperCase() : 'Sin evento'}</span>`;

            const tournamentNameTeamSticker = document.createElement('p');
            tournamentNameTeamSticker.classList.add('info-api','no-margin', 'padding');
            tournamentNameTeamSticker.innerHTML = `Equipo: <span class="info-span">${sticker.tournament_team ? sticker.tournament_team.toUpperCase() : 'Sin equipo'}</span>`;

            const imageUrlSticker = document.createElement('p');
            imageUrlSticker.classList.add('info-api','no-margin', 'padding');
            imageUrlSticker.innerHTML = `Imagen: <a href="${sticker.image}" class="image-ancor" target="_blank">Imagen del sticker</a>`;


            divSticker.appendChild(nameSticker);
            divSticker.appendChild(rarityNameSticker);
            divSticker.appendChild(crateNameSticker);
            divSticker.appendChild(tournamentNameEventSticker);
            divSticker.appendChild(tournamentNameTeamSticker);
            divSticker.appendChild(imageUrlSticker);

            resultsDiv.appendChild(divSticker);
        }
    });

    if(!foundResults){
        showAlert('No se encontraron resultados');
        resultsDiv.classList.add('display-none');
    }

    stickerObj.sticker = '';
    searchInput.value = '';
};