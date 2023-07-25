import { closeDropdown } from '@finsweet/ts-utils';
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
const fetchRestCountries = async (): Promise<Country[]> => {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags');
  const data = await response.json();

  //sort countries alphabetically by alpha 2 code
  return data.sort((a: Country, b: Country) => (a.cca2 > b.cca2 ? 1 : -1));
};

/**
 * Fetch user info based on ip from ipapi.co and return the country code.
 * @returns {Promise<string>} - Promise object represents the country code of the current user.
 */
const fetchUserLocation = async (): Promise<string> => {
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
  // Remove the current selected country
  if (selectedCountryNode) {
    selectedCountryNode.classList.remove('w--current');
    selectedCountryNode.setAttribute('aria-selected', 'false');
    selectedCountryNode.setAttribute('tabindex', '-1');
  }

  // Set the selected country
  selectedCountryNode = dropdownListItem;

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

  // focus the dropdown item
  setFocused();
};

const setFocused = () => {
  if (!selectedCountryNode) return;

  selectedCountryNode.classList.add('w--current');
  selectedCountryNode.setAttribute('aria-selected', 'true');
  selectedCountryNode.setAttribute('tabindex', '0');
};

const getFocusedItem = (dropdownList: HTMLDivElement): HTMLAnchorElement | null => {
  const focusedItem = document.activeElement as HTMLElement;

  // if focused item is not a dropdown item
  if (!focusedItem?.matches(SELECTORS.dropdownListItem) && focusedItem?.tagName !== 'A') {
    // return first item in dropdown
    return dropdownList.querySelector<HTMLAnchorElement>(SELECTORS.dropdownListItem);
  }

  return focusedItem as HTMLAnchorElement;
};

/**
 * Handle the arrow-down keydown event.
 * Move the focus to the next country in the dropdown list.
 */
const handleArrowdownKeydown = (dropdownList: HTMLDivElement | null) => {
  if (!dropdownList) return;

  const focusedItem = getFocusedItem(dropdownList);

  if (!focusedItem) return;

  const nextItem = focusedItem.nextElementSibling as HTMLAnchorElement | null;
  if (nextItem) {
    nextItem.focus();
  }
};

/**
 * Handle the arrow-up keydown event.
 * Move the focus to the previous country in the dropdown list.
 */
const handleArrowupKeydown = (dropdownList: HTMLDivElement | null) => {
  if (!dropdownList) return;

  const focusedItem = getFocusedItem(dropdownList);

  if (!focusedItem) return;

  const prevItem = focusedItem.previousElementSibling as HTMLAnchorElement | null;
  if (prevItem) {
    prevItem.focus();
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

      // hide dropdown
      toggleDropdown();
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

const toggleDropdown = (show?: boolean) => {
  const dropdown = document.querySelector<HTMLDivElement>(SELECTORS.dropdown);
  const dropdownListWrapper = document.querySelector<HTMLDivElement>(SELECTORS.dropdownListWrapper);
  const dropdownList = document.querySelector<HTMLDivElement>(SELECTORS.dropdownList);
  const dropdownToggle = document.querySelector<HTMLDivElement>(SELECTORS.dropdownToggle);

  if (!dropdown || !dropdownList || !dropdownListWrapper || !dropdownToggle) return;

  if (!show) {
    setFocused();
  }

  // todo: based on closeDropdown() in @finsweet/ts-utils
  const event = show ? 'w-open' : 'w-close';
  dropdownToggle.dispatchEvent(new Event(event, { bubbles: true }));
};

/**
 * Scrolls to the selected country in the dropdown list and sets focus on it.
 * If no country is selected, it scrolls to and sets focus on the first country in the list.
 * @param dropdownList - The dropdown list element containing the countries.
 */
const scrollToSelectedCountry = (dropdownList: HTMLDivElement) => {
  if (!selectedCountryNode) {
    const firstItem = dropdownList.querySelector<HTMLAnchorElement>(SELECTORS.dropdownListItem);

    if (firstItem) {
      setTimeout(() => {
        firstItem.focus();
      }, 100);
    }

    return;
  }

  selectedCountryNode?.scrollIntoView({ block: 'start', behavior: 'smooth' });

  setTimeout(() => {
    selectedCountryNode?.focus();
  }, 100);
};

const watchDropdownEffects = (
  targetElement: HTMLDivElement,
  dropdownList: HTMLDivElement,
  dropdownToggle: HTMLDivElement
) => {
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver((mutationsList, observer) => {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const isOpen = targetElement.classList.contains('w--open');

        setFocused();

        if (isOpen) {
          scrollToSelectedCountry(dropdownList);
          dropdownList.setAttribute('aria-hidden', 'false');
          dropdownToggle.setAttribute('aria-expanded', 'true');
        } else {
          dropdownToggle.focus();
          dropdownList.setAttribute('aria-hidden', 'true');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });

  // Start observing the target node for configured mutations
  observer.observe(targetElement, { attributes: true });
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
        break;
    }
  });

  dropdownToggle?.addEventListener('keydown', (e: KeyboardEvent) => {
    const { key } = e;

    switch (key) {
      case 'ArrowDown':
        e.preventDefault();
        toggleDropdown(true);//todo: this is not working
        break;
      case 'ArrowUp':
        e.preventDefault();
        toggleDropdown(true);//todo: this is not working
        break;
      default:
        break;
    }
  });

  watchDropdownEffects(
    dropdownListWrapper as HTMLDivElement,
    dropdownList as HTMLDivElement,
    dropdownToggle as HTMLDivElement
  );

  dropdownToggle?.focus();
};

//initialize dropdown
document.addEventListener('DOMContentLoaded', initializeDropdown);
