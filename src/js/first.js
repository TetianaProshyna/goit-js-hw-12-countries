import debounce from 'lodash.debounce';
import { alert, defaultModules } from '@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import fetchCountries from '/js/fetchCountries.js';
import { defaults } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
defaults.styling = 'brighttheme';
defaults.icons = 'brighttheme';

defaultModules.set(PNotifyMobile, {});

const inputRef = document.querySelector('.search');
const searchResultsRef = document.querySelector('.search-results');
inputRef.addEventListener('input', debounce(handleInput, 500));

function handleInput(event) {
  searchResultsRef.innerHTML = '';
  const countrySearchName = event.target.value;
  fetchCountries(countrySearchName)
    .then(data => {
      if (data.length > 10) {
        alert({
          text: 'Too many matches found. Please enter a more specific query!',
          type: 'error',
          delay: 4000,
        });
      }
      if (data.length >= 2 && data.length <= 10) {
        const template =
          '<ul>' +
          data.reduce((acc, item) => {
            acc += `<li>${item.name}</li>`;
            return acc;
          }, '') +
          '</ul>';
        searchResultsRef.insertAdjacentHTML('beforeend', template);
      }
      if (data.length === 1) {
        console.log(data);
        const templateLang = data[0].languages.reduce((acc, item) => {
          acc += `<li>${item.name}</li>`;
          return acc;
        }, '');
        const templateCountry = `<h2>${data[0].name}</h2>
      <p>Capital: ${data[0].capital}</p>
      <p>Population: ${data[0].population}</p>
      <h3>Languages:</h3><ul>${templateLang}</ul>
      <img src="${data[0].flag}" alt="flag"></img>`;
        searchResultsRef.insertAdjacentHTML('beforeend', templateCountry);
      }
    })
    .catch(console.log);
}
