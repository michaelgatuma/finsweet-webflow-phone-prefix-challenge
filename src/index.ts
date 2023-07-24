// Define types to represent the data we'll be working with

/**
 * Country interface
 */
interface Country {
  name: {
    official: string;
  };
  cca2: string;
  idd: {
    root: string;
    suffixes: string[];
  };
  flags: {
    svg: string;
  };
}

/**
 * IPInfo interface
 */
interface IPInfo {
  ip: string;
  country_code: string;
  country_calling_code: string;
}

/**
 * CSS selectors used in the dropdown functionality.
 * @type {Object}
 * @property {string} form - Form selector
 * @property {string} dropdown - Dropdown selector
 * @property {string} dropdownToggle - Dropdown toggle selector
 * @property {string} dropdownToggleFlag - Dropdown toggle flag selector
 * @property {string} dropdownTogglePrefix - Dropdown toggle prefix selector
 * @property {string} dropdownListWrapper - Dropdown list wrapper selector
 * @property {string} dropdownList - Dropdown list selector
 * @property {string} dropdownListItem - Dropdown list item selector
 * @property {string} dropdownListItemFlag - Dropdown list item flag selector
 * @property {string} dropdownListItemLabel - Dropdown list item label selector
 * @property {string} inputPhone - Phone input selector
 * @property {string} inputCountryCode - Country code input selector
 * @property {string} submitBtn - Submit button selector
 * @property {string} formSuccessFlash - Form success flash selector
 * @property {string} formErrorFlash - Form error flash selector
 * @memberof module:src/index.types
 */
const SELECTORS = {
  form: '.phone-form_form',
  dropdown: '[data-element="dropdown"]',
  dropdownToggle: '.prefix-dropdown_toggle',
  dropdownToggleFlag: '.prefix-dropdown_toggle .prefix-dropdown_flag',
  dropdownTogglePrefix: '.prefix-dropdown_toggle [data-element="value"]',
  dropdownListWrapper: '.prefix-dropdown_list-wrapper',
  dropdownList: '.prefix-dropdown_list',
  dropdownListItem: '.prefix-dropdown_item',
  dropdownListItemFlag: '.prefix-dropdown_item .prefix-dropdown_flag',
  dropdownListItemLabel: '.prefix-dropdown_item [data-element="value"]',
  inputPhone: '#phoneNumber',
  inputCountryCode: '[name="countryCode"]',
  submitBtn: '.button.w-button',
  formSuccessFlash: '.w-form-done',
  formErrorFlash: '.w-form-fail',
};

const form: HTMLFormElement | null = null;
let dropdown: HTMLDivElement | null = null;
let dropdownToggle: HTMLDivElement | null = null;
let dropdownToggleFlag: HTMLImageElement | null = null;
let dropdownTogglePrefix: HTMLDivElement | null = null;
let dropdownListWrapper: HTMLDivElement | null = null;
let dropdownList: HTMLDivElement | null = null;
let inputPhone: HTMLInputElement | null = null;
let inputCountryCode: HTMLInputElement | null = null;
let submitBtn: HTMLButtonElement | null = null;
let formSuccessFlash: HTMLDivElement | null = null;
let formErrorFlash: HTMLDivElement | null = null;

/**
 * Currently selected country
 * @type {Country}
 * @memberof module:src/index.types
 * @default null
 * @see {@link module:src/index.types.Country}
 */
let selectedCountry: Country | null = null;

let selectedCountryNode: HTMLAnchorElement | null = null;

/**
 * Fetch countries from REST countries api.
 * @async
 * @function fetchCountries
 * @returns {Promise<Country[]>} - Promise object represents the countries fetched from the REST countries api.
 */
const fetchRestCountries = async () => {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags');
  const data = await response.json();

  return data;
};

/**
 * Fetch user info based on ip from ipapi.co and return the country code.
 * @returns {Promise<string>} - Promise object represents the country code of the current user.
 */
const fetchUserLocation = async () => {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();

  return data?.country_code || 'KE';
};

/**
 * Set the toggle, and dropdown list to indicate the selected country.
 * @param dropdownListItem - The dropdown list item that was clicked.
 * @param countries - All countries fetched from the REST countries api.
 * @param countryCode - The country code of the selected country.
 */
const setSelectedCountry = (
  dropdownListItem: HTMLAnchorElement,
  countries: Country[],
  countryCode: string
) => {
  // Set current user country as selected
  selectedCountry = countries.find((country: Country) => country.cca2 === countryCode) as Country;

  // Set current user country flag and prefix
  const dropdownToggleFlag: HTMLImageElement | null = document.querySelector(
    SELECTORS.dropdownToggleFlag
  ) as HTMLImageElement;
  const dropdownTogglePrefix: HTMLDivElement | null = document.querySelector(
    SELECTORS.dropdownTogglePrefix
  ) as HTMLDivElement;

  dropdownToggleFlag.src = selectedCountry?.flags.svg;
  dropdownToggleFlag.alt = selectedCountry?.name.official;
  dropdownTogglePrefix.textContent = `${selectedCountry?.idd?.root}${selectedCountry?.idd?.suffixes[0]}`;
};

const setFocused = () => {
  if (!selectedCountryNode) return;

  selectedCountryNode.classList.add('w--current');
  selectedCountryNode.setAttribute('aria-selected', 'true');
  selectedCountryNode.setAttribute('tabindex', '0');
};

/**
 * Handle the arrow keydown event.
 * Move the focus to the next country in the dropdown list.
 */
const handleArrowKeydown = (e: KeyboardEvent) => {
  if (!selectedCountryNode) return;

  const dropdownList: HTMLDivElement | null = document.querySelector(
    SELECTORS.dropdownList
  ) as HTMLDivElement;

  const dropdownListItems: NodeListOf<HTMLAnchorElement> | null = document.querySelectorAll(
    SELECTORS.dropdownListItem
  );

  const dropdownListItemsArray = Array.from(dropdownListItems as NodeListOf<HTMLAnchorElement>);
  const selectedCountryIndex = dropdownListItemsArray.indexOf(selectedCountryNode);

  if (e.key === 'ArrowDown') {
    if (selectedCountryIndex === dropdownListItemsArray.length - 1) return;

    selectedCountryNode.classList.remove('w--current');
    selectedCountryNode.setAttribute('aria-selected', 'false');
    selectedCountryNode.setAttribute('tabindex', '-1');

    selectedCountryNode = dropdownListItemsArray[selectedCountryIndex + 1];

    setFocused();
  }

  if (e.key === 'ArrowUp') {
    if (selectedCountryIndex === 0) return;

    selectedCountryNode.classList.remove('w--current');
    selectedCountryNode.setAttribute('aria-selected', 'false');
    selectedCountryNode.setAttribute('tabindex', '-1');

    selectedCountryNode = dropdownListItemsArray[selectedCountryIndex - 1];

    setFocused();
  }
};

const fillDropdown = (
  countries: Country[],
  userCountryCode: string | null,
  dropdown: HTMLDivElement,
  dropdownList: HTMLDivElement
) => {
  const template = dropdown.querySelector<HTMLAnchorElement>(SELECTORS.dropdownListItem);

  if (!template) return;

  // remove the template from the DOM
  template.remove();

  // loop through the countries
  countries.forEach((country: Country) => {
    // clone the template
    const dropdownListItemClone = template.cloneNode(true) as HTMLAnchorElement;

    const flag = dropdownListItemClone.querySelector<HTMLImageElement>(
      SELECTORS.dropdownListItemFlag
    );
    const label = dropdownListItemClone.querySelector<HTMLDivElement>(
      SELECTORS.dropdownListItemLabel
    );

    if (!flag || !label) return;

    const countryFlag = country?.flags.svg;
    const countryName = country?.name.official;
    const countryCode = country?.cca2;

    // onclick event listener
    dropdownListItemClone.addEventListener('click', () => {
      setSelectedCountry(dropdownListItemClone, countries, countryCode);
    });

    // add the country to the dropdown
    flag.src = countryFlag;
    flag.alt = countryName;
    label.textContent = countryCode;

    dropdownListItemClone.dataset.country = countryCode;

    // select the current country if it matches the user's country
    if (countryCode === userCountryCode) {
      setSelectedCountry(dropdownListItemClone, countries, countryCode);
    }

    dropdownList.append(dropdownListItemClone);
  });
};

const initializeDropdown = async () => {
  // Initialize html elements
  dropdown = document.querySelector(SELECTORS.dropdown);
  dropdownToggle = document.querySelector(SELECTORS.dropdownToggle);
  dropdownToggleFlag = document.querySelector(SELECTORS.dropdownToggleFlag);
  dropdownTogglePrefix = document.querySelector(SELECTORS.dropdownTogglePrefix);
  dropdownListWrapper = document.querySelector(SELECTORS.dropdownListWrapper);
  dropdownList = document.querySelector(SELECTORS.dropdownList);
  inputPhone = document.querySelector(SELECTORS.inputPhone);
  inputCountryCode = document.querySelector(SELECTORS.inputCountryCode);
  submitBtn = document.querySelector(SELECTORS.submitBtn);
  formSuccessFlash = document.querySelector(SELECTORS.formSuccessFlash);
  formErrorFlash = document.querySelector(SELECTORS.formErrorFlash);

  // Fetch countries
  const countries: Country[] = await fetchRestCountries();
  // Fetch current user country
  const userCountryCode = await fetchUserLocation();

  // Fill dropdown with countries
  fillDropdown(
    countries,
    userCountryCode,
    dropdown as HTMLDivElement,
    dropdownList as HTMLDivElement
  );

  watchDropdownEffects();
};

const watchDropdownEffects = () => {
  console.log('watching dropdown effects...');
};

//initialize dropdown
document.addEventListener('DOMContentLoaded', initializeDropdown);
