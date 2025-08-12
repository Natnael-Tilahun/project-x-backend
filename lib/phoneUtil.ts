export class PhoneUtil {
  static readonly validPhoneNumber: RegExp =
    /^(0[79]\d{8}|[79]\d{8}|\+251[79]\d{8}|251[79]\d{8})$/;
  static readonly localPattern: RegExp = /^(0[79]\d{8}|[79]\d{8})$/;
  static readonly localWithZero: RegExp = /^0([79]\d{8})$/;
  static readonly localWithoutZero: RegExp = /^([79]\d{8})$/;
  static readonly internationalPattern: RegExp =
    /^(\+251[79]\d{8}|251[79]\d{8})$/;
  static readonly internationalWithPlus: RegExp = /^\+251([79]\d{8})$/;
  static readonly internationalWithoutPlus: RegExp = /^251([79]\d{8})$/;

  static isPhoneNumber = (phoneNumber: string | null | undefined): boolean => {
    if (!phoneNumber) return false;
    // Check if the original string contains only valid characters
    const validChars = /^[\d+\s\-\(\)]+$/;
    if (!validChars.test(phoneNumber)) return false;
    // Remove all non-digit and non-plus characters
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    // Then check if the cleaned string matches exactly
    return PhoneUtil.validPhoneNumber.test(cleaned);
  };

  static isLocalPhoneFormat = (phoneNumber: string | null | undefined): boolean => {
    if (!phoneNumber) return false;
    const cleaned = phoneNumber.replace(/[^\d]/g, '');
    return PhoneUtil.localPattern.test(cleaned);
  };

  static isInternationalPhoneFormat = (phoneNumber: string | null | undefined): boolean => {
    if (!phoneNumber) return false;
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    return PhoneUtil.internationalPattern.test(cleaned);
  };

  static getLocalPhoneFormat = (phoneNumber: string | null | undefined): string | null => {
    if (!phoneNumber || !PhoneUtil.isPhoneNumber(phoneNumber)) return null;
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    if (PhoneUtil.localWithZero.test(cleaned)) return cleaned;
    if (PhoneUtil.localWithoutZero.test(cleaned)) return `0${cleaned}`;
    let match = cleaned.match(PhoneUtil.internationalWithPlus);
    if (match?.[1]) return `0${match[1]}`;
    match = cleaned.match(PhoneUtil.internationalWithoutPlus);
    if (match?.[1]) return `0${match[1]}`;
    return null;
  };

  static getInternationalPhoneFormat = (phoneNumber: string | null | undefined): string | null => {
    if (!phoneNumber || !PhoneUtil.isPhoneNumber(phoneNumber)) return null;
    const cleanedWithPlus = phoneNumber.replace(/[^\d+]/g, '');
    const cleanedDigitsOnly = phoneNumber.replace(/[^\d]/g, '');
    if (PhoneUtil.internationalWithPlus.test(cleanedWithPlus)) return cleanedWithPlus;
    if (PhoneUtil.internationalWithoutPlus.test(cleanedWithPlus)) return `+${cleanedWithPlus}`;
    let match = cleanedDigitsOnly.match(PhoneUtil.localWithZero);
    if (match?.[1]) return `+251${match[1]}`;
    if (PhoneUtil.localWithoutZero.test(cleanedDigitsOnly)) return `+251${cleanedDigitsOnly}`;
    return null;
  };
}