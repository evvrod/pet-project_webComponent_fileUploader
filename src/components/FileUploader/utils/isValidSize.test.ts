import { describe, test, expect } from 'vitest';
import { isValidSize } from './isValidSize';

describe('isValidSize', () => {
  test('должен вернуть true для файла размером 1 КБ или меньше', () => {
    // Создаем файл размером 1 КБ
    const file = new File(['a'.repeat(1024)], 'file.txt');
    const result = isValidSize(file);
    expect(result).toBe(true);
  });

  test('должен вернуть false для файла размером больше 1 КБ', () => {
    // Создаем файл размером 2 КБ
    const file = new File(['a'.repeat(2048)], 'file.txt');
    const result = isValidSize(file);
    expect(result).toBe(false);
  });

  test('должен вернуть true для файла размером 1 КБ', () => {
    // Создаем файл размером точно 1 КБ
    const file = new File(['a'.repeat(1024)], 'file.txt');
    const result = isValidSize(file);
    expect(result).toBe(true);
  });

  test('должен вернуть false для файла с размером чуть больше 1 КБ', () => {
    // Создаем файл размером 1025 байт
    const file = new File(['a'.repeat(1025)], 'file.txt');
    const result = isValidSize(file);
    expect(result).toBe(false);
  });

  test('должен вернуть true для пустого файла (0 байт)', () => {
    // Создаем файл размером 0 байт
    const file = new File([''], 'empty.txt');
    const result = isValidSize(file);
    expect(result).toBe(true);
  });
});
