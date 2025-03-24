import { describe, test, expect, vi, beforeEach } from 'vitest';
import { uploadFile } from './uploadFile';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('uploadFile', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  test('должен успешно загружать файл', async () => {
    const file = new File(['dummy content'], 'example.txt', {
      type: 'text/plain',
    });
    const name = 'example-name';

    // Мокируем успешный ответ от сервера
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => ({
        message: 'Файл успешно загружен',
        filename: 'example.txt',
        nameField: 'example-name',
        timestamp: '2023-08-01T12:00:00Z',
      }),
    });

    const response = await uploadFile({ file, name });

    expect(response.data).toBeDefined();
    expect(response.data?.message).toBe('Файл успешно загружен');
    expect(response.data?.filename).toBe('example.txt');
    expect(response.data?.nameField).toBe('example-name');
  });

  test('должен вернуть ошибку, если файл или имя отсутствуют', async () => {
    const file = new File(['dummy content'], 'example.txt', {
      type: 'text/plain',
    });
    const name = ''; // Пустое имя

    const response = await uploadFile({ file, name });

    expect(response.error).toBeDefined();
    expect(response.error?.status).toBe('400 Bad Request');
    expect(response.error?.message).toBe('Необходимы файл и имя');
  });

  test('должен корректно обрабатывать ошибки сервера', async () => {
    const file = new File(['dummy content'], 'example.txt', {
      type: 'text/plain',
    });
    const name = 'example-name';

    // Мокируем ошибку сервера
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => ({
        error: 'Ошибка сервера',
        details: 'Внутренняя ошибка',
      }),
    });

    const response = await uploadFile({ file, name });

    expect(response.error).toBeDefined();
    expect(response.error?.status).toBe('500 Internal Server Error');
    expect(response.error?.message).toBe('Ошибка сервера');
    expect(response.error?.details).toBe('Внутренняя ошибка');
  });

  test('должен обрабатывать отмену запроса', async () => {
    const file = new File(['dummy content'], 'example.txt', {
      type: 'text/plain',
    });
    const name = 'example-name';

    const controller = new AbortController();
    controller.abort();

    const response = await uploadFile({
      file,
      name,
      abortSignal: controller.signal,
    });

    expect(response.error).toBeDefined();
    expect(response.error?.status).toBe('500 Internal Server Error');
    expect(response.error?.message).toBe('Internal Server Error');
  });
});
