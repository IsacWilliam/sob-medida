export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length === 0) return '';

  let formatted = `(${digits.slice(0, 2)}`;

  if (digits.length > 2) {
    formatted += `) ${digits.slice(2, 3)}`;
  }

  if (digits.length > 3) {
    formatted += `.${digits.slice(3, 7)}`;
  }

  if (digits.length > 7) {
    formatted += `-${digits.slice(7, 11)}`;
  }

  return formatted;
}
