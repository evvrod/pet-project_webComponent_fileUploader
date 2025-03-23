import { vi, describe, beforeEach, afterEach, test, expect } from 'vitest';
import { ClearButton } from './ClearButton';

// Мокаем CSSStyleSheet
vi.stubGlobal(
  'CSSStyleSheet',
  class {
    replaceSync() {}
    constructor() {}
  },
);

// Мокаем CSS-модули
vi.mock('../../global.css?inline', () => ({ default: '' }));
vi.mock('./ClearButton.css?inline', () => ({ default: '' }));

describe('ClearButton', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Удаляем все зарегистрированные кастомные элементы после тестов
    document.body.innerHTML = '';
  });

  test('определяет кастомный элемент', () => {
    if (!customElements.get('file-uploader-clear-button')) {
      ClearButton.define();
    }
    expect(customElements.get('file-uploader-clear-button')).toBe(ClearButton);
  });

  test('создает теневой DOM с правильными стилями', () => {
    if (!customElements.get('file-uploader-clear-button')) {
      ClearButton.define();
    }
    const button = new ClearButton();
    document.body.appendChild(button);

    expect(button.shadowRoot).not.toBeNull();
    expect(button.shadowRoot?.adoptedStyleSheets.length).toBe(2);
  });

  test('рендерит кнопку с двумя линиями', () => {
    if (!customElements.get('file-uploader-clear-button')) {
      ClearButton.define();
    }
    const button = new ClearButton();
    document.body.appendChild(button);

    const buttonElement = button.shadowRoot?.querySelector('button');
    const lines = button.shadowRoot?.querySelectorAll('.line');

    expect(buttonElement).toBeTruthy();
    expect(lines?.length).toBe(2);
  });
});
