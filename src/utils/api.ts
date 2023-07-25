import type { Country } from 'src/types';

export const fetchRestCountries = async (): Promise<Country[]> => {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags');
  const data = await response.json();

  // sort countries alphabetically by alpha 2 code
  return data.sort((a: Country, b: Country) => (a.cca2 > b.cca2 ? 1 : -1));
};

export const fetchUserLocation = async (): Promise<string> => {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();

  return data?.country_code || 'KE';
};
