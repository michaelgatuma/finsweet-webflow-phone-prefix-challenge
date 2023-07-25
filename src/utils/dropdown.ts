import type { Country } from 'src/types';

let selectedCountry: Country | null = null;
let selectedCountryNode: HTMLAnchorElement | null = null;

export const setSelectedCountry = (
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
    '.prefix-dropdown_toggle .prefix-dropdown_flag'
  ) as HTMLImageElement;
  const dropdownTogglePrefix: HTMLDivElement | null = document.querySelector(
    '.prefix-dropdown_toggle [data-element="value"]'
  ) as HTMLDivElement;

  dropdownToggleFlag.src = selectedCountry?.flags.svg;
  dropdownToggleFlag.alt = selectedCountry?.name.official;
  dropdownTogglePrefix.textContent = `${selectedCountry?.idd?.root}${selectedCountry?.idd?.suffixes[0]}`;

  // focus the dropdown item
  setFocused();
};

export const setFocused = () => {
  if (!selectedCountryNode) return;

  selectedCountryNode.classList.add('w--current');
  selectedCountryNode.setAttribute('aria-selected', 'true');
  selectedCountryNode.setAttribute('tabindex', '0');
};

export const getFocusedItem = (dropdownList: HTMLDivElement): HTMLAnchorElement | null => {
  const focusedItem = document.activeElement as HTMLElement;

  // if focused item is not a dropdown item
  if (!focusedItem?.matches('.prefix-dropdown_item') && focusedItem?.tagName !== 'A') {
    // return first item in dropdown
    return dropdownList.querySelector<HTMLAnchorElement>('.prefix-dropdown_item');
  }

  return focusedItem as HTMLAnchorElement;
};

export const handleArrowdownKeydown = (dropdownList: HTMLDivElement | null) => {
  if (!dropdownList) return;

  const focusedItem = getFocusedItem(dropdownList);

  if (!focusedItem) return;

  const nextItem = focusedItem.nextElementSibling as HTMLAnchorElement | null;
  if (nextItem) {
    nextItem.focus();
  }
};

export const handleArrowupKeydown = (dropdownList: HTMLDivElement | null) => {
  if (!dropdownList) return;

  const focusedItem = getFocusedItem(dropdownList);

  if (!focusedItem) return;

  const prevItem = focusedItem.previousElementSibling as HTMLAnchorElement | null;
  if (prevItem) {
    prevItem.focus();
  }
};

export const searchCountry = (dropdownList: HTMLDivElement | null, searchQuery: string) => {
  if (!dropdownList) return;
  const items = dropdownList.querySelectorAll<HTMLAnchorElement>('.prefix-dropdown_item');

  // find all items that start with the search query and go to next when the same letter is pressed
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const label = item.querySelector<HTMLDivElement>('[data-element="value"]');

    if (!label) continue;

    const labelText = label.textContent || '';

    if (labelText.startsWith(searchQuery)) {
      return item;
    }
  }
};

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

export const toggleDropdown = (show?: boolean) => {
  const dropdown = document.querySelector<HTMLDivElement>('[data-element="dropdown"]');
  const dropdownListWrapper = document.querySelector<HTMLDivElement>(
    '.prefix-dropdown_list-wrapper'
  );
  const dropdownList = document.querySelector<HTMLDivElement>('.prefix-dropdown_list');
  const dropdownToggle = document.querySelector<HTMLDivElement>('.prefix-dropdown_toggle');

  if (!dropdown || !dropdownList || !dropdownListWrapper || !dropdownToggle) return;

  if (!show) {
    setFocused();
  }

  // todo: based on closeDropdown() in @finsweet/ts-utils
  const event = show ? 'w-open' : 'w-close';
  dropdownToggle.dispatchEvent(new Event(event, { bubbles: true }));
};

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
