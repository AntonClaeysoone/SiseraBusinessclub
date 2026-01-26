/**
 * Formats a number as currency in Dutch/Belgian format
 * Example: 27000.00 -> "27.000,00"
 * @param amount - The amount to format
 * @param includeCurrencySymbol - Whether to include the € symbol (default: false)
 * @returns Formatted string
 */
export const formatCurrency = (amount: number, includeCurrencySymbol: boolean = false): string => {
  const formatted = new Intl.NumberFormat('nl-BE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return includeCurrencySymbol ? `€${formatted}` : formatted;
};

/**
 * Formats a number in Dutch/Belgian format without currency symbol
 * Example: 27000.00 -> "27.000,00"
 * @param amount - The amount to format
 * @returns Formatted string
 */
export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('nl-BE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};



