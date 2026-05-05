/**
 * Validate Tanzanian phone number
 * Accepts formats: +255XXXXXXXXX, 255XXXXXXXXX, 0XXXXXXXXX
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+?255|0)[67]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate required field
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Format phone number to standard format
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\s/g, '');

  // Convert 0712345678 to +255712345678
  if (cleaned.startsWith('0')) {
    return '+255' + cleaned.substring(1);
  }

  // Add + if missing
  if (cleaned.startsWith('255')) {
    return '+' + cleaned;
  }

  return cleaned;
};
