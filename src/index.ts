import { fetchRestCountries } from '$utils/api';
import { fillDropdown } from '$utils/dropdown';
import { initializeEventListeners } from '$utils/events';

import type { Country } from './types';

/**
 * Fetches countries from the API, fills the dropdown, and initializes event listeners.
 * @async
 * @function initializeApp
 * @returns {Promise<void>} - A promise that resolves when the initialization is complete.
 */
const initializeApp = async (): Promise<void> => {
  // Fetch countries
  const countries: Country[] = await fetchRestCountries();

  // Fill dropdown with countries
  const userCountryCode = ''; // Replace with your logic to get the user's country code
  const dropdownList = document.querySelector<HTMLDivElement>('.prefix-dropdown_list');
  fillDropdown(
    countries,
    userCountryCode,
    dropdownList as HTMLDivElement,
    dropdownList as HTMLDivElement
  );

  // Initialize event listeners
  initializeEventListeners();
};

// Initialize app when the DOM content is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
