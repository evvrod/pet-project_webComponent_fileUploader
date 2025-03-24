import { isValidFormat } from './isValidFormat';
import { isValidSize } from './isValidSize';

export function validateFile(file: File): string[] {
  const errors: string[] = [];

  if (!isValidFormat(file)) {
    errors.push(
      'Недопустимый формат файла. Возможные форматы: .txt, .json, .csv.',
    );
  }

  if (!isValidSize(file)) {
    errors.push('Размер файла превышает 1 KБ.');
  }

  return errors; // Если массив пуст, файл валиден
}
