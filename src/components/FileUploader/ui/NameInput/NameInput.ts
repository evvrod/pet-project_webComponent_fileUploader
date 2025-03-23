import {
  EventType,
  addEvent,
  removeEvent,
  dispatchEvent,
} from '../../utils/eventBus';

import rawGlobal from '../../global.css?inline';
import rawStyles from './NameInput.css?inline';

const globalStylesheet = new CSSStyleSheet();
globalStylesheet.replaceSync(rawGlobal);

const componentStylesheet = new CSSStyleSheet();
componentStylesheet.replaceSync(rawStyles);

export class NameInput extends HTMLElement {
  private privateValue: string = '';
  private wrapperInput: HTMLDivElement | null = null;
  private nameInput: HTMLInputElement | null = null;
  private clearButton: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [
      globalStylesheet,
      componentStylesheet,
    ];

    this.handleInput = this.handleInput.bind(this);
    this.hideInput = this.hideInput.bind(this);
    this.handleInputClear = this.handleInputClear.bind(this);
    this.showInput = this.showInput.bind(this);
    this.hideInput = this.hideInput.bind(this);
    this.initNameInput = this.initNameInput.bind(this);
  }

  static define(tagName = 'file-uploader-name-input') {
    customElements.define(tagName, this);
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

      addEvent(EventType.SelectFile, this.hideInput);
      addEvent(EventType.SelectFileError, this.hideInput);
      addEvent(EventType.DeselectFile, this.showInput);

      addEvent(EventType.Init, this.initNameInput);
    }
  }

  disconnectedCallback() {
    this.nameInput?.removeEventListener('input', this.handleInput);

    removeEvent(EventType.SelectFile, this.hideInput);
    removeEvent(EventType.SelectFileError, this.hideInput);
    removeEvent(EventType.DeselectFile, this.showInput);
    removeEvent(EventType.Init, this.initNameInput);
  }

  private initNameInput() {
    this.showInput();
    this.handleInputClear();
    this.privateValue = '';
  }

  private handleInputClear() {
    if (this.nameInput) {
      this.nameInput.value = '';
    }
    this.clearButton?.setAttribute('disabled', 'true');
    dispatchEvent(EventType.RemoveName);
  }

  private handleInput(event: Event) {
    const eventTarget = event.target;
    if (eventTarget instanceof HTMLInputElement) {
      const name = eventTarget.value.trim();
      if (name !== '') {
        this.clearButton?.removeAttribute('disabled');
        this.privateValue = name;
        dispatchEvent(EventType.AddName, name);
      } else {
        dispatchEvent(EventType.RemoveName);
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
    <div class="wrapper-input" id="wrapperInput" show>
      <input type="text" id="nameInput" placeholder="Название файла" />
      <div class="wrapper-clear-button">
        <file-uploader-clear-button id="clearButton" disabled></file-uploader-clear-button>
      </div>
    </div>
    `;
  }
}
