import { describe, test, expect } from 'vitest';
import getFileExtension from './getFileExtension';

describe('getFileExtension', () => {
  test('должен правильно извлекать расширение файла', () => {
    const filename = 'document.txt';
    const extension = getFileExtension(filename);
    expect(extension).toBe('txt');
  });

  test('должен вернуть undefined, если нет расширения', () => {
    const filename = 'document';
    const extension = getFileExtension(filename);
    expect(extension).toBeUndefined();
  });

  test('должен правильно извлекать расширение файла с несколькими точками', () => {
    const filename = 'archive.tar.gz';
    const extension = getFileExtension(filename);
    expect(extension).toBe('gz');
  });

  test('должен вернуть undefined для пустого имени файла', () => {
    const filename = '';
    const extension = getFileExtension(filename);
    expect(extension).toBeUndefined();
  });

  test('должен игнорировать регистр расширения', () => {
    const filename = 'image.JPG';
    const extension = getFileExtension(filename);
    expect(extension).toBe('jpg');
  });

  test('должен вернуть undefined для имени файла с точкой в конце', () => {
    const filename = 'document.';
    const extension = getFileExtension(filename);
    expect(extension).toBeUndefined();
  });
});
