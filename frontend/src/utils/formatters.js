/**
 * Utility functions for formatting phone numbers and currency
 */

/**
 * Converts Arabic-Indic numerals (٠-٩) to Latin numerals (0-9)
 * @param {string} str - The string containing Arabic numerals
 * @returns {string} - String with Latin numerals
 */
export const normalizeArabicNumerals = (str) => {
  if (!str) return str;

  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const latinNumerals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let result = str;
  arabicNumerals.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, "g"), latinNumerals[index]);
  });

  return result;
};

/**
 * Formats a phone number to ensure it's in the correct format (+923120201709)
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";

  // First normalize Arabic numerals to Latin
  let normalized = normalizeArabicNumerals(phoneNumber);

  // Remove all non-digit characters except '+'
  normalized = normalized.replace(/[^\d+]/g, "");

  // Ensure it starts with '+'
  if (!normalized.startsWith("+")) {
    normalized = "+" + normalized;
  }

  // Remove any '+' that appears after the first character
  normalized = "+" + normalized.substring(1).replace(/\+/g, "");

  return normalized;
};

/**
 * Validates a phone number format
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;

  // Normalize the phone number first
  const normalized = formatPhoneNumber(phoneNumber);

  // Check if it matches the international format: +[1-9][0-9]{1,14}
  return /^\+[1-9]\d{1,14}$/.test(normalized);
};

/**
 * Formats currency display consistently across the application
 * @param {number} amount - The amount to format
 * @param {string} language - Current language ('en' or 'ar')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, language = "en") => {
  if (typeof amount !== "number" && typeof amount !== "string") return "0 QAR";

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return "0 QAR";

  // Format the number
  const formattedAmount = numAmount.toFixed(2);

  // Return with QAR currency
  if (language === "ar") {
    return `${formattedAmount} ريال قطري`;
  }
  return `${formattedAmount} QAR`;
};

/**
 * Gets the currency symbol based on language
 * @param {string} language - Current language ('en' or 'ar')
 * @returns {string} - Currency symbol
 */
export const getCurrencySymbol = (language = "en") => {
  return language === "ar" ? "ريال قطري" : "QAR";
};
