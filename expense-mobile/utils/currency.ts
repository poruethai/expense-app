const SYMBOLS: Record<string, string> = {
  THB: '฿',
  USD: '$',
};

export function getCurrencySymbol(code: string): string {
  return SYMBOLS[code] ?? `${code} `;
}

export function formatAmount(
  amount: number,
  currencyCode: string = 'THB',
  language: string = 'th'
): string {
  const symbol = getCurrencySymbol(currencyCode);
  const locale = language === 'th' ? 'th-TH' : 'en-US';

  const formatted = amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${symbol}${formatted}`;
}
