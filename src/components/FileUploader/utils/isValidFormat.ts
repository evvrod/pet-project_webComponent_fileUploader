export function isValidFormat(file: File): boolean {
  const allowedTypes = ['text/plain', 'application/json', 'text/csv'];

  if (!allowedTypes.includes(file.type)) return false;
  return true;
}
