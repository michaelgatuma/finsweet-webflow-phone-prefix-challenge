import type { Country } from 'src/types';

import { fetchRestCountries, fetchUserLocation } from './api';
import { initializeHTMLFormElements } from './dom';
import {
  fillDropdown,
  handleArrowdownKeydown,
  handleArrowupKeydown,
  searchCountry,
  toggleDropdown,
  watchDropdownEffects,
} from './dropdown';

/**
 * Fetches countries from the API, fills the dropdown, and initializes event listeners.
 * @async
 * @returns {Promise<void>} - A promise that resolves when the initialization is complete.
 */
export const initializeEventListeners = async (): Promise<void> => {
  const { dropdown, dropdownList, dropdownToggle } = initializeHTMLFormElements();

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
        toggleDropdown(true); // fix-me
        break;
      case 'ArrowUp':
        e.preventDefault();
        toggleDropdown(true); //fix-me
        break;
      default:
        break;
    }
  });

  // Observe dropdown mutations and apply effects
  watchDropdownEffects(
    dropdownList as HTMLDivElement,
    dropdownList as HTMLDivElement,
    dropdownToggle as HTMLDivElement
  );

  dropdownToggle?.focus();
};

//initialize event listeners
document.addEventListener('DOMContentLoaded', initializeEventListeners);
