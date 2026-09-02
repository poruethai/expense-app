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

// ย่อตัวเลขให้สั้นลงสำหรับพื้นที่จำกัด เช่น 1500 -> 1.5k, 2000000 -> 2M
export function formatCompactAmount(amount: number): string {
  const abs = Math.abs(amount);

  if (abs >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }

  if (abs >= 1_000) {
    return `${(amount / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }

  return String(Math.round(amount));
}