export function isValidSize(file: File) {
  if (file.size > 1024) return false;
  return true;
}
