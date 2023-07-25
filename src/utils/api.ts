import type { Country } from 'src/types';

/**
 * Fetches countries from the REST countries API and sorts them alphabetically by alpha 2 code.
 * @async
 * @function fetchRestCountries
 * @returns {Promise<Country[]>} - A promise that resolves to an array of countries.
 */
export const fetchRestCountries = async (): Promise<Country[]> => {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags');
  const data = await response.json();

  // Sort countries alphabetically by alpha 2 code
  return data.sort((a: Country, b: Country) => (a.cca2 > b.cca2 ? 1 : -1));
};

/**
 * Fetches the current user's location based on their IP address from the ipapi.co API.
 * @async
 * @function fetchUserLocation
 * @returns {Promise<string>} - A promise that resolves to the country code of the current user.
 */
export const fetchUserLocation = async (): Promise<string> => {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();

  return data?.country_code || 'KE';
};
