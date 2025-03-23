import { describe, test, expect } from 'vitest';
import { isValidFormat } from './isValidFormat';

describe('isValidFormat', () => {
  test('должен вернуть true для допустимого формата файла "text/plain"', () => {
    const file = new File([''], 'file.txt', { type: 'text/plain' });
    const result = isValidFormat(file);
    expect(result).toBe(true);
  });

  test('должен вернуть true для допустимого формата файла "application/json"', () => {
    const file = new File(['{}'], 'file.json', { type: 'application/json' });
    const result = isValidFormat(file);
    expect(result).toBe(true);
  });

  test('должен вернуть true для допустимого формата файла "text/csv"', () => {
    const file = new File(['a,b,c'], 'file.csv', { type: 'text/csv' });
    const result = isValidFormat(file);
    expect(result).toBe(true);
  });

  test('должен вернуть false для недопустимого формата файла', () => {
    const file = new File(['<html></html>'], 'file.html', {
      type: 'text/html',
    });
    const result = isValidFormat(file);
    expect(result).toBe(false);
  });

  test('должен вернуть false, если у файла нет типа MIME', () => {
    const file = new File(['some content'], 'file.txt'); // Без типа MIME
    const result = isValidFormat(file);
    expect(result).toBe(false);
  });

  test('должен вернуть false для других недопустимых форматов', () => {
    const file = new File(['image content'], 'file.png', { type: 'image/png' });
    const result = isValidFormat(file);
    expect(result).toBe(false);
  });
});
