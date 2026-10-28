export const email = (value: unknown): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(value).toLowerCase());
};

export const phone = (value: unknown): boolean => {
  const regex =
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3,6}[-\s.]?[0-9]{3,6}$/;
  return regex.test(String(value));
};

export const url = (value: unknown): boolean => {
  try {
    new URL(String(value));
    return true;
  } catch {
    return false;
  }
};

export const strongPassword = (value: unknown): boolean => {
  const str = String(value);
  return (
    str.length >= 8 &&
    /[a-z]/.test(str) &&
    /[A-Z]/.test(str) &&
    /[0-9]/.test(str) &&
    /[^a-zA-Z0-9]/.test(str)
  );
};

export const postalCode = (
  value: unknown,
  country: 'US' | 'CA' | 'UK' = 'US'
): boolean => {
  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
    UK: /^[A-Za-z]{1,2}\d{1,2}[A-Za-z]? \d[A-Za-z]{2}$/
  };
  return patterns[country]?.test(String(value)) || false;
};

export const ip = (value: unknown, version: 4 | 6 = 4): boolean => {
  if (version === 4) {
    return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      String(value)
    );
  }
  if (version === 6) {
    return /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.test(
      String(value)
    );
  }
  return false;
};

export const rules = {
  email,
  phone,
  url,
  strongPassword,
  postalCode,
  ip
};
