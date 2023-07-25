import type { Country } from 'src/types';

import { initializeHTMLFormElements } from './dom';
/**
 * Represents the currently selected country.
 * @type {Country | null}
 */
let selectedCountry: Country | null = null;

/**
 * Represents the currently selected country node in the dropdown.
 * @type {HTMLAnchorElement | null}
 */
let selectedCountryNode: HTMLAnchorElement | null = null;

/**
 * Sets the selected country in the dropdown and updates the UI accordingly.
 * @param {HTMLAnchorElement} dropdownListItem - The dropdown list item that was clicked.
 * @param {Country[]} countries - The array of countries fetched from the REST countries API.
 * @param {string} countryCode - The country code of the selected country.
 */
export const setSelectedCountry = (
  dropdownListItem: HTMLAnchorElement,
  countries: Country[],
  countryCode: string
) => {
  const { inputCountryCode, dropdownToggleFlag, dropdownTogglePrefix } =
    initializeHTMLFormElements();

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

  if (!inputCountryCode || !dropdownToggleFlag || !dropdownTogglePrefix) return;

  dropdownToggleFlag.src = selectedCountry?.flags.svg;
  dropdownToggleFlag.alt = selectedCountry?.name.official;
  dropdownTogglePrefix.textContent = `${selectedCountry?.idd?.root}${selectedCountry?.idd?.suffixes[0]}`;

  // Update the hidden input field with the selected country code
  inputCountryCode.value = countryCode;

  // Focus the dropdown item
  setFocused();
};

/**
 * Sets focus and attributes on the currently selected country node in the dropdown.
 */
export const setFocused = () => {
  if (!selectedCountryNode) return;

  // Add the "w--current" class and set attributes for "Current" state
  selectedCountryNode.classList.add('w--current');
  selectedCountryNode.setAttribute('aria-selected', 'true');
  selectedCountryNode.setAttribute('tabindex', '0');
};

/**
 * Gets the currently focused dropdown item within the dropdown list.
 * If no item is focused, returns the first dropdown item by default.
 * @param {HTMLDivElement} dropdownList - The dropdown list element containing the countries.
 * @returns {HTMLAnchorElement | null} - The currently focused dropdown item or the first item if none is focused.
 */
export const getFocusedItem = (dropdownList: HTMLDivElement): HTMLAnchorElement | null => {
  const focusedItem = document.activeElement as HTMLElement;

  // if focused item is not a dropdown item
  if (!focusedItem?.matches('.prefix-dropdown_item') && focusedItem?.tagName !== 'A') {
    // return first item in dropdown
    return dropdownList.querySelector<HTMLAnchorElement>('.prefix-dropdown_item');
  }

  return focusedItem as HTMLAnchorElement;
};

/**
 * Handles the arrow-down keydown event.
 * Moves the focus to the next country in the dropdown list.
 * @param {HTMLDivElement | null} dropdownList - The dropdown list element.
 */
export const handleArrowdownKeydown = (dropdownList: HTMLDivElement | null) => {
  if (!dropdownList) return;

  const focusedItem = getFocusedItem(dropdownList);

  if (!focusedItem) return;

  const nextItem = focusedItem.nextElementSibling as HTMLAnchorElement | null;
  if (nextItem) {
    nextItem.focus();
  }
};

/**
 * Handles the arrow-up keydown event.
 * Moves the focus to the previous country in the dropdown list.
 * @param {HTMLDivElement | null} dropdownList - The dropdown list element.
 */
export const handleArrowupKeydown = (dropdownList: HTMLDivElement | null) => {
  if (!dropdownList) return;

  const focusedItem = getFocusedItem(dropdownList);

  if (!focusedItem) return;

  const prevItem = focusedItem.previousElementSibling as HTMLAnchorElement | null;
  if (prevItem) {
    prevItem.focus();
  }
};

/**
 * Searches for a country in the dropdown list based on a search query.
 * @param dropdownList - The dropdown list element.
 * @param searchQuery - The search query to match.
 * @returns {HTMLAnchorElement | null} - The dropdown item that matches the search query.
 */
export const searchCountry = (dropdownList: HTMLDivElement | null, searchQuery: string) => {
  if (!dropdownList) return;
  const listItems = dropdownList.querySelectorAll<HTMLAnchorElement>('.prefix-dropdown_item');

  // find all items that start with the search query and go to next when the same letter is pressed
  for (const item of listItems) {
    const label = item.querySelector<HTMLDivElement>('[data-element="value"]');

    if (!label) continue;

    const labelText = label.textContent || '';

    if (labelText.startsWith(searchQuery)) {
      return item;
    }
  }
};

/**
 * Populates the dropdown list with countries.
 * @param {Country[]} countries - The array of countries fetched from the REST countries API.
 * @param {string | null} userCountryCode - The country code of the current user.
 * @param {HTMLDivElement} dropdown - The dropdown element.
 * @param {HTMLDivElement} dropdownList - The dropdown list element.
 */
export const fillDropdown = (
  countries: Country[],
  userCountryCode: string | null,
  dropdown: HTMLDivElement,
  dropdownList: HTMLDivElement
) => {
  const template = dropdown.querySelector<HTMLAnchorElement>('.prefix-dropdown_item');

  if (!template) return;

  // remove the template from the DOM
  template.remove();

  // loop through the countries
  countries.forEach((country: Country) => {
    // clone the template
    const dropdownListItemClone = template.cloneNode(true) as HTMLAnchorElement;

    const flag = dropdownListItemClone.querySelector<HTMLImageElement>('.prefix-dropdown_flag');
    const label = dropdownListItemClone.querySelector<HTMLDivElement>('[data-element="value"]');

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

/**
 * Toggles the dropdown visibility.
 * @param {boolean} show - Whether to show or hide the dropdown.
 */
export const toggleDropdown = (show?: boolean) => {
  const { dropdown, dropdownList, dropdownListWrapper, dropdownToggle } =
    initializeHTMLFormElements();

  if (!dropdown || !dropdownList || !dropdownListWrapper || !dropdownToggle) return;

  if (!show) {
    setFocused();
  }

  // todo: based on closeDropdown() in @finsweet/ts-utils
  const event = show ? 'w-open' : 'w-close';
  dropdownToggle.dispatchEvent(new Event(event, { bubbles: true }));
};

/**
 * Scrolls to the currently selected country in the dropdown list.
 * @param {HTMLDivElement} dropdownList - The dropdown list element.
 */
export const scrollToSelectedCountry = (dropdownList: HTMLDivElement) => {
  if (!selectedCountryNode) {
    const firstItem = dropdownList.querySelector<HTMLAnchorElement>('.prefix-dropdown_item');

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

/**
 * Watches for changes in the dropdown visibility and updates the UI accordingly.
 * @param {HTMLDivElement} targetElement - The element to observe for changes.
 * @param {HTMLDivElement} dropdownList - The dropdown list element.
 * @param {HTMLDivElement} dropdownToggle - The dropdown toggle element.
 * @returns {MutationObserver} - The observer instance.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
export const watchDropdownEffects = (
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
