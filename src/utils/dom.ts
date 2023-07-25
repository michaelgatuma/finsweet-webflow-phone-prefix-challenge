export const initializeHTMLFormElements = () => {
  const form = document.querySelector<HTMLFormElement>('.phone-form_form');
  const dropdown = document.querySelector<HTMLDivElement>('[data-element="dropdown"]');
  const dropdownToggle = document.querySelector<HTMLDivElement>('.prefix-dropdown_toggle');
  const dropdownToggleFlag = document.querySelector<HTMLImageElement>(
    '.prefix-dropdown_toggle .prefix-dropdown_flag'
  );
  const dropdownTogglePrefix = document.querySelector<HTMLDivElement>(
    '.prefix-dropdown_toggle [data-element="value"]'
  );
  const dropdownListWrapper = document.querySelector<HTMLDivElement>(
    '.prefix-dropdown_list-wrapper'
  );
  const dropdownList = document.querySelector<HTMLDivElement>('.prefix-dropdown_list');
  const inputPhone = document.querySelector<HTMLInputElement>('#phoneNumber');
  const inputCountryCode = document.querySelector<HTMLInputElement>('[name="countryCode"]');
  const submitBtn = document.querySelector<HTMLButtonElement>('.button.w-button');
  const formSuccessFlash = document.querySelector<HTMLDivElement>('.w-form-done');
  const formErrorFlash = document.querySelector<HTMLDivElement>('.w-form-fail');

  return {
    form,
    dropdown,
    dropdownToggle,
    dropdownToggleFlag,
    dropdownTogglePrefix,
    dropdownListWrapper,
    dropdownList,
    inputPhone,
    inputCountryCode,
    submitBtn,
    formSuccessFlash,
    formErrorFlash,
  };
};
