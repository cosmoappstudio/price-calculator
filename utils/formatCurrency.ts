const LOCALE = "en-US";

export function formatUsd(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

/** Sayılar (kullanıcı adedi vb.) — ABD biçimi */
export function formatCount(value: number): string {
  return new Intl.NumberFormat(LOCALE).format(value);
}
