export default function getFileExtension(filename: string) {
  return filename.split('.').pop()?.toLowerCase();
}
