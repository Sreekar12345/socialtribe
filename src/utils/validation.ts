export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPassword(value: string) {
  return value.trim().length >= 6;
}

export function isValidWebsite(value: string) {
  if (!value.trim()) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidInstagramHandle(value: string) {
  const normalized = value.startsWith('@') ? value.slice(1) : value;
  return /^[a-zA-Z0-9._]{3,30}$/.test(normalized);
}
