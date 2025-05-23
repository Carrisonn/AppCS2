import { searchInput, form, resultsDiv, skinObj, menuBurgerIcon, closeSideBarBtn } from '../constants.js';
import { showAlert, removeAlert, showSideBar, closeSideBar, removeResults } from '../utilities.js';


window.addEventListener('load', () => {
  skinObj.skin = '';
  form.reset();
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

  if (skinObj.skin === '') return showAlert('El campo no puede estar vacío');

  searchInput.classList.remove('error-search-input');
  removeAlert();

  const spanSpinner = document.createElement('span');
  spanSpinner.classList.add('loader');
  form.appendChild(spanSpinner);

  try {
    const url = 'https://cors-anywhere.herokuapp.com/https://bymykel.github.io/CSGO-API/api/es-ES/skins.json';
    const response = await fetch(url);
    const data = await response.json();
    showData(data);
  } catch (error) {
    console.error(error);
    showAlert('Ocurrió un error al obtener las skins');
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

  data.forEach(skin => {
    const nameSkinFormatted = skin.name.replace('| ', '').replace('★ ', '').toLowerCase();
    const nameWeaponFormatted = skin.weapon.name.toLowerCase();

    if (nameWeaponFormatted.includes(skinObj.skin) || nameSkinFormatted.includes(skinObj.skin)) {
      foundResults = true;
      resultsDiv.classList.remove('display-none');

      let existCollectionName;
      skin.collections ? skin.collections.forEach(collection => existCollectionName = collection.name.slice(9).toUpperCase()) : null;
      /* I need to check if there are collections and then iterate again because there are some skins with similar name but without collection,
      otherwise I could be acces to the values with something like that: 'skin.collections[0].name' */

      let existCrateName;
      skin.crates ? skin.crates.forEach(crate => existCrateName = crate.name.toUpperCase()) : null;
      //Same as above but for crates

      const divSkin = document.createElement('div');
      divSkin.classList.add('div-skin');

      const nameSkin = document.createElement('p');
      nameSkin.classList.add('info-api', 'no-margin', 'padding');
      nameSkin.innerHTML = `Nombre: <span class="info-span">${nameSkinFormatted.toUpperCase()}</span>`;

      const categoryNameSkin = document.createElement('p');
      categoryNameSkin.classList.add('info-api', 'no-margin', 'padding');
      categoryNameSkin.innerHTML = `Categoría: <span class="info-span">${skin.category.name.toUpperCase()}</span>`;

      const collectionNameSkin = document.createElement('p');
      collectionNameSkin.classList.add('info-api', 'no-margin', 'padding');
      collectionNameSkin.innerHTML = `Colección: <span class="info-span">${existCollectionName ? existCollectionName : 'Sin colección'}</span>`;

      const crateNameSkin = document.createElement('p');
      crateNameSkin.classList.add('info-api', 'no-margin', 'padding');
      crateNameSkin.innerHTML = `Caja: <span class="info-span">${existCrateName ? existCrateName : 'Sin caja'}</span>`;

      const rarityNameSkin = document.createElement('p');
      rarityNameSkin.classList.add('info-api', 'no-margin', 'padding');
      rarityNameSkin.innerHTML = `Rareza: <span class="info-span">${skin.rarity.name.toUpperCase()}</span>`;

      const stattrakNameSkin = document.createElement('p');
      stattrakNameSkin.classList.add('info-api', 'no-margin', 'padding');
      stattrakNameSkin.innerHTML = `StatTrak: <span class="info-span">${skin.stattrak ? 'Sí' : 'No'}</span>`;

      const souvenirNameSkin = document.createElement('p');
      souvenirNameSkin.classList.add('info-api', 'no-margin', 'padding');
      souvenirNameSkin.innerHTML = `Souvenir: <span class="info-span">${skin.souvenir ? 'Sí' : 'No'}</span>`;

      const teamNameSkin = document.createElement('p');
      teamNameSkin.classList.add('info-api', 'no-margin', 'padding');
      teamNameSkin.innerHTML = `Equipo: <span class="info-span">${skin.team.name.toUpperCase()}</span>`;

      const imageUrlSkin = document.createElement('p');
      imageUrlSkin.classList.add('info-api', 'no-margin', 'padding');
      imageUrlSkin.innerHTML = `Imagen: <a href="${skin.image}" class="image-ancor" target="_blank">Imagen de la skin</a>`;


      divSkin.appendChild(nameSkin);
      divSkin.appendChild(categoryNameSkin);
      divSkin.appendChild(collectionNameSkin);
      divSkin.appendChild(crateNameSkin);
      divSkin.appendChild(rarityNameSkin);
      divSkin.appendChild(stattrakNameSkin);
      divSkin.appendChild(souvenirNameSkin);
      divSkin.appendChild(teamNameSkin);
      divSkin.appendChild(imageUrlSkin);

      resultsDiv.appendChild(divSkin);
    }
  });

  if (!foundResults) {
    showAlert('No se encontraron resultados');
    resultsDiv.classList.add('display-none');
  }

  searchInput.value = '';
  skinObj.skin = '';
};