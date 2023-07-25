import type { Country } from 'src/types';

import { fetchRestCountries, fetchUserLocation } from './api';
import { initializeHTMLFormElements } from './dom';
import {
  fillDropdown,
  getFocusedItem,
  handleArrowdownKeydown,
  handleArrowupKeydown,
  scrollToSelectedCountry,
  searchCountry,
  setSelectedCountry,
  toggleDropdown,
  watchDropdownEffects,
} from './dropdown';

export const initializeEventListeners = async () => {
  const {
    dropdown,
    dropdownList,
    dropdownToggle,
    inputPhone,
    inputCountryCode,
    submitBtn,
    formSuccessFlash,
    formErrorFlash,
  } = initializeHTMLFormElements();

  // Fetch countries
  const countries: Country[] = await fetchRestCountries();

  // Fetch current user country
  const userCountryCode = await fetchUserLocation();

  // Fill dropdown with countries
  if (dropdown !== null && dropdownList !== null) {
    fillDropdown(countries, userCountryCode, dropdown, dropdownList);
  }

  dropdownList?.addEventListener('keydown', (e: KeyboardEvent) => {
    const { key } = e;

    switch (key) {
      case 'ArrowDown':
        e.preventDefault();
        handleArrowdownKeydown(dropdownList);
        break;
      case 'ArrowUp':
        e.preventDefault();
        handleArrowupKeydown(dropdownList);
        break;
      case 'Enter':
        // e.preventDefault();
        // handleEnterKeydown(countries);
        break;
      default:
        if (key.match(/^[a-z]$/i)) {
          e.preventDefault();

          const firstItemWithLetter = searchCountry(dropdownList, key.toUpperCase());

          if (firstItemWithLetter) {
            firstItemWithLetter.focus();
          }
        }
        break;
    }
  });

  dropdownToggle?.addEventListener('keydown', (e: KeyboardEvent) => {
    const { key } = e;

    switch (key) {
      case 'ArrowDown':
        e.preventDefault();
        toggleDropdown(true);
        break;
      case 'ArrowUp':
        e.preventDefault();
        toggleDropdown(true);
        break;
      default:
        break;
    }
  });

  watchDropdownEffects(
    dropdownList as HTMLDivElement,
    dropdownList as HTMLDivElement,
    dropdownToggle as HTMLDivElement
  );

  dropdownToggle?.focus();
};

//initialize event listeners
document.addEventListener('DOMContentLoaded', initializeEventListeners);
