export const email = (value: unknown): boolean => {
  const str = String(value).toLowerCase();
  const atIndex = str.indexOf('@');

  if (atIndex <= 0 || atIndex !== str.lastIndexOf('@')) {
    return false;
  }

  const localPart = str.slice(0, atIndex);
  const domain = str.slice(atIndex + 1);

  if (!localPart || !domain || /\s/.test(str)) {
    return false;
  }

  const dotIndex = domain.lastIndexOf('.');
  return dotIndex > 0 && dotIndex < domain.length - 1;
};

export const phone = (value: unknown): boolean => {
  const str = String(value).trim();
  const allowed = '0123456789 +().-';

  if (!str) {
    return false;
  }

  const plusIndex = str.indexOf('+');

  if (plusIndex > 0 || str.indexOf('+', plusIndex + 1) !== -1) {
    return false;
  }

  let digits = 0;

  for (const char of str) {
    if (!allowed.includes(char)) {
      return false;
    }

    if (char >= '0' && char <= '9') {
      digits++;
    }
  }

  return digits >= 7 && digits <= 15;
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

const ipv4Part = /^\d{1,3}$/;
const ipv6Group = /^[0-9a-fA-F]{1,4}$/;
const ipv6Zone = /^[0-9A-Za-z]+$/;

function isIPv4(value: string): boolean {
  const parts = value.split('.');

  if (parts.length !== 4) {
    return false;
  }

  return parts.every((part) => ipv4Part.test(part) && Number(part) <= 255);
}

function countIPv6Groups(side: string, allowIPv4: boolean): number | null {
  if (side === '') {
    return 0;
  }

  const groups = side.split(':');
  let count = 0;

  for (let index = 0; index < groups.length; index++) {
    const group = groups[index];
    const isLast = index === groups.length - 1;

    if (!group) {
      return null;
    }

    if (allowIPv4 && isLast && group.includes('.')) {
      if (!isIPv4(group)) {
        return null;
      }

      count += 2;
      continue;
    }

    if (!ipv6Group.test(group)) {
      return null;
    }

    count++;
  }

  return count;
}

function isIPv6(value: string): boolean {
  let address = value;
  const zoneIndex = address.indexOf('%');

  if (zoneIndex !== -1) {
    const zone = address.slice(zoneIndex + 1);

    if (!ipv6Zone.test(zone)) {
      return false;
    }

    address = address.slice(0, zoneIndex);
  }

  if (!address) {
    return false;
  }

  const compressionIndex = address.indexOf('::');

  if (compressionIndex !== -1 && address.indexOf('::', compressionIndex + 2) !== -1) {
    return false;
  }

  if (compressionIndex === -1) {
    return countIPv6Groups(address, true) === 8;
  }

  const left = address.slice(0, compressionIndex);
  const right = address.slice(compressionIndex + 2);
  const leftCount = countIPv6Groups(left, false);
  const rightCount = countIPv6Groups(right, true);

  return leftCount !== null && rightCount !== null && leftCount + rightCount < 8;
}

export const ip = (value: unknown, version: 4 | 6 = 4): boolean => {
  if (version === 4) {
    return isIPv4(String(value));
  }

  if (version === 6) {
    return isIPv6(String(value));
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
