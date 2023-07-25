/**
 * Represents various HTML elements
 * @interface DOM
 */
export interface DOM {
  form: HTMLFormElement | null;
  dropdown: HTMLDivElement | null;
  dropdownToggle: HTMLDivElement | null;
  dropdownToggleFlag: HTMLImageElement | null;
  dropdownTogglePrefix: HTMLDivElement | null;
  dropdownListWrapper: HTMLDivElement | null;
  dropdownList: HTMLDivElement | null;
  inputPhone: HTMLInputElement | null;
  inputCountryCode: HTMLInputElement | null;
  submitBtn: HTMLButtonElement | null;
  formSuccessFlash: HTMLDivElement | null;
  formErrorFlash: HTMLDivElement | null;
}

/**
 * Represents the data structure of a country.
 * @interface Country
 */
export interface Country {
  /** official name of the country. */
  name: {
    official: string;
  };
  /** ISO 3166-1 alpha-2 code of the country. */
  cca2: string;
  /** International Direct Dialing (IDD) information of the country. */
  idd: {
    root: string;
    suffixes: string[];
  };
  /** Flags information of the country. */
  flags: {
    /** The URL of the country's SVG flag. */
    svg: string;
  };
}

/**
 * Represents the data structure of necessary IP address information.
 * @interface IPAddressInfo
 */
export interface IPAddressInfo {
  ip: string;
  /** The ISO 3166-1 alpha-2 country code of the user's location. */
  country_code: string;
  /** The country calling code of the user's location. */
  country_calling_code: string;
}
