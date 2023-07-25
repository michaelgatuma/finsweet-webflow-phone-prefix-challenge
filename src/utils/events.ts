import { closeDropdown } from '@finsweet/ts-utils';
import type { Country } from 'src/types';

import { fetchRestCountries, fetchUserLocation } from './api';
import { initializeHTMLFormElements } from './dom';
import {
  fillDropdown,
  handleArrowdownKeydown,
  handleArrowupKeydown,
  searchCountry,
  watchDropdownEffects,
} from './dropdown';

/**
 * Fetches countries from the API, fills the dropdown, and initializes event listeners.
 * @async
 * @returns {Promise<void>} - A promise that resolves when the initialization is complete.
 */
export const initializeEventListeners = async (): Promise<void> => {
  const { dropdown, dropdownList, dropdownListWrapper, dropdownToggle } =
    initializeHTMLFormElements();

  // Fetch countries
  const countries: Country[] = await fetchRestCountries();

  // Fetch current user country
  const userCountryCode = await fetchUserLocation();

  // Fill dropdown with countries
  if (!dropdown || !dropdownList || !dropdownToggle) return;

  fillDropdown(countries, userCountryCode, dropdown, dropdownList, dropdownToggle);

  // Handle dropdownList Keydown event to navigate dropdown items
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
      case 'Tab':
        closeDropdown(dropdownToggle);
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

  if (!dropdownToggle || !dropdownList || !dropdownListWrapper) return;

  // Observe dropdown mutations and apply effects
  watchDropdownEffects(dropdownListWrapper, dropdownList, dropdownToggle);

  dropdownToggle?.focus();
};
