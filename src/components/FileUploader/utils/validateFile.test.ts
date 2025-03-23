import { describe, test, expect, vi } from 'vitest';
import { validateFile } from './validateFile';

import { isValidFormat } from './isValidFormat';
import { isValidSize } from './isValidSize';

// Мокаем функции isValidFormat и isValidSize
vi.mock('./isValidFormat');
vi.mock('./isValidSize');

describe('validateFile', () => {
  test('должен вернуть ошибку, если формат файла неверный', () => {
    vi.mocked(isValidFormat).mockReturnValue(false);
    vi.mocked(isValidSize).mockReturnValue(true);

    const file = new File(['content'], 'test.png', { type: 'text/plain' });

    const errors = validateFile(file);

    expect(errors).toEqual([
      'Недопустимый формат файла. Возможные форматы: .txt, .json, .csv.',
    ]);
  });

  test('должен вернуть ошибку, если размер файла слишком большой', () => {
    vi.mocked(isValidFormat).mockReturnValue(true);
    vi.mocked(isValidSize).mockReturnValue(false);

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    const errors = validateFile(file);

    expect(errors).toEqual(['Размер файла превышает 1 KБ.']);
  });

  test('должен вернуть обе ошибки, если формат и размер неверные', () => {
    vi.mocked(isValidFormat).mockReturnValue(false);
    vi.mocked(isValidSize).mockReturnValue(false);

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    const errors = validateFile(file);

    expect(errors).toEqual([
      'Недопустимый формат файла. Возможные форматы: .txt, .json, .csv.',
      'Размер файла превышает 1 KБ.',
    ]);
  });

  test('должен вернуть пустой массив ошибок, если файл валиден', () => {
    vi.mocked(isValidFormat).mockReturnValue(true);
    vi.mocked(isValidSize).mockReturnValue(true);

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    const errors = validateFile(file);

    expect(errors).toEqual([]);
  });
});
