export default function getFileExtension(filename: string) {
  const lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex <= 0 || lastDotIndex === filename.length - 1) {
    return undefined;
  }

  return filename.slice(lastDotIndex + 1).toLowerCase();
}
