import { eventBus } from '../../utils/eventBus';

import globalStyles from '../../global.css?inline';
import rawStyles from './NameInput.css?inline';

import '../ClearButton/ClearButton';

class NameInput extends HTMLElement {
  private privateValue: string = '';
  private wrapperInput: HTMLDivElement | null = null;
  private nameInput: HTMLInputElement | null = null;
  private clearButton: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.handleInput = this.handleInput.bind(this);
    this.hideInput = this.hideInput.bind(this);
    this.handleInputClear = this.handleInputClear.bind(this);
    this.showInput = this.showInput.bind(this);
    this.initNameInput = this.initNameInput.bind(this);
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.wrapperInput =
        this.shadowRoot.querySelector<HTMLDivElement>('#wrapperInput');
      this.nameInput =
        this.shadowRoot.querySelector<HTMLInputElement>('#nameInput');
      this.clearButton =
        this.shadowRoot.querySelector<HTMLButtonElement>('#clearButton');

      this.nameInput?.addEventListener('input', this.handleInput);

      this.clearButton?.addEventListener('click', this.handleInputClear);

      eventBus.addEventListener(
        'selected-file',
        this.hideInput as EventListener,
      );

      eventBus.addEventListener(
        'deselected-file',
        this.showInput as EventListener,
      );

      eventBus.addEventListener('init', this.initNameInput);
    }
  }

  disconnectedCallback() {
    this.nameInput?.removeEventListener('input', this.handleInput);

    eventBus.removeEventListener(
      'selected-file',
      this.hideInput as EventListener,
    );
  }

  private initNameInput() {
    console.log('initNameInput');
    this.showInput();
    this.handleInputClear();
    this.privateValue = '';
  }

  private handleInputClear() {
    if (this.nameInput) {
      this.nameInput.value = '';
    }
    this.clearButton?.setAttribute('disabled', 'true');
    eventBus.dispatchEvent(new CustomEvent('removed-name'));
  }

  private handleInput(event: Event) {
    const eventTarget = event.target;
    if (eventTarget instanceof HTMLInputElement) {
      const name = eventTarget.value.trim();
      if (name !== '') {
        this.clearButton?.removeAttribute('disabled');
        this.privateValue = name;
        eventBus.dispatchEvent(new CustomEvent('added-name', { detail: name }));
      } else {
        eventBus.dispatchEvent(
          new CustomEvent('removed-name', { detail: name }),
        );
        this.clearButton?.setAttribute('disabled', 'true');
      }
    }
  }

  private hideInput() {
    this.toggleNameInput(false);
  }

  private showInput() {
    this.toggleNameInput(true);
  }

  private toggleNameInput(enabled: boolean) {
    if (this.wrapperInput) {
      if (enabled) {
        this.wrapperInput.setAttribute('show', `true`);
      } else {
        this.wrapperInput.removeAttribute('show');
      }
    }
  }

  get value(): string {
    return this.privateValue;
  }

  render() {
    return `
    <style>${globalStyles}</style>
    <style>${rawStyles}</style>
    <div class="wrapper-input" id="wrapperInput" show>
      <input type="text" id="nameInput" placeholder="Название файла" />
      <div class="wrapper-clear-button">
        <clear-button id="clearButton" disabled></clear-button>
      </div>
    </div>
    `;
  }
}

customElements.define('file-uploader-name-input', NameInput);
