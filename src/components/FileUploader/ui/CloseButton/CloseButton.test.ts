import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';
import { CloseButton } from './CloseButton';

// Мокаем CSSStyleSheet
vi.stubGlobal(
  'CSSStyleSheet',
  class {
    replaceSync() {} // Заглушка метода replaceSync
    constructor() {} // Мокаем конструктор
  },
);

// Мокаем CSS-модули
vi.mock('../../global.css?inline', () => ({ default: '' }));
vi.mock('./CloseButton.css?inline', () => ({ default: '' }));

describe('CloseButton', () => {
  beforeEach(() => {
    document.body.innerHTML = ''; // Очищаем body перед каждым тестом
  });

  afterEach(() => {
    document.body.innerHTML = ''; // Очищаем body после каждого теста
  });

  test('должен зарегистрировать кастомный элемент', () => {
    if (!customElements.get('file-uploader-close-button')) {
      CloseButton.define();
    }

    expect(customElements.get('file-uploader-close-button')).toBe(CloseButton);
  });

  test('должен создать теневой DOM с правильными стилями', () => {
    if (!customElements.get('file-uploader-close-button')) {
      CloseButton.define();
    }
    const closeButton = new CloseButton();
    document.body.appendChild(closeButton);

    expect(closeButton.shadowRoot).not.toBeNull();
    expect(closeButton.shadowRoot?.adoptedStyleSheets.length).toBe(2);
  });

  test('должен рендерить кнопку с двумя линиями', () => {
    if (!customElements.get('file-uploader-close-button')) {
      CloseButton.define();
    }
    const closeButton = new CloseButton();
    document.body.appendChild(closeButton);

    const buttonElement = closeButton.shadowRoot?.querySelector('button');
    const lines = closeButton.shadowRoot?.querySelectorAll('.line');

    expect(buttonElement).toBeTruthy();
    expect(lines?.length).toBe(2); // Должно быть две линии
  });
});
