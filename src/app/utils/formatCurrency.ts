/**
 * Format amount in Tanzanian Shillings (TZS)
 * @param amount - Amount to format
 * @returns Formatted currency string (e.g., "TZS 50,000")
 */
export const formatCurrency = (amount: number | string | undefined | null): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (value === undefined || value === null || isNaN(value as number)) {
    return 'TZS 0';
  }

  return `TZS ${(value as number).toLocaleString('en-TZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Format amount with decimal places if needed
 * @param amount - Amount to format
 * @returns Formatted currency string with decimals
 */
export const formatCurrencyWithDecimals = (amount: number | string | undefined | null): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (value === undefined || value === null || isNaN(value as number)) {
    return 'TZS 0.00';
  }

  return `TZS ${(value as number).toLocaleString('en-TZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
