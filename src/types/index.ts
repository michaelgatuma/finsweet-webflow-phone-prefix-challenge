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
