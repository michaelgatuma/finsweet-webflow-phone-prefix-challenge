export interface Country {
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

export interface IPAddressInfo {
  ip: string;
  country_code: string;
  country_calling_code: string;
}
