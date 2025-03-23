import { EventType, addEvent } from '../../utils/eventBus';

import rawGlobal from '../../global.css?inline';
import rawStyles from './UploadButton.css?inline';

const globalStylesheet = new CSSStyleSheet();
if (globalStylesheet.replaceSync && rawGlobal) {
  globalStylesheet.replaceSync(rawGlobal);
}
const componentStylesheet = new CSSStyleSheet();
if (componentStylesheet.replaceSync && rawStyles) {
  componentStylesheet.replaceSync(rawStyles);
}

export class UploadButton extends HTMLElement {
  private uploadButton: HTMLButtonElement | null = null;
  private abortController: AbortController | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [
      globalStylesheet,
      componentStylesheet,
    ];

    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.hideButton = this.hideButton.bind(this);

    this.showLoading = this.showLoading.bind(this);
    this.hideLoading = this.hideLoading.bind(this);

    this.initButton = this.initButton.bind(this);
  }

  static define(tagName = 'file-uploader-upload-button') {
    customElements.define(tagName, this);
  }

  connectedCallback() {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.uploadButton =
        this.shadowRoot.querySelector<HTMLButtonElement>('#uploadBtn');

      addEvent(EventType.ReadFile, this.enableButton, { signal });
      addEvent(EventType.DeselectFile, this.disableButton, { signal });
      addEvent(EventType.UploadStart, this.showLoading, { signal });
      addEvent(EventType.UploadStart, this.disableButton, { signal });
      addEvent(EventType.UploadEnd, this.hideLoading, { signal });
      addEvent(EventType.UploadEnd, this.hideButton, { signal });
      addEvent(EventType.Init, this.initButton, { signal });
    }
  }

  disconnectedCallback() {
    this.abortController?.abort();
  }

  private initButton() {
    this.showButton();
    this.disableButton();
  }

  private enableButton() {
    if (this.uploadButton) {
      this.uploadButton.disabled = false;
    }
  }

  private disableButton() {
    if (this.uploadButton) {
      this.uploadButton.disabled = true;
    }
  }

  private hideButton() {
    if (this.uploadButton) {
      this.uploadButton.removeAttribute('show');
    }
  }

  private showButton() {
    if (this.uploadButton) {
      this.uploadButton.setAttribute('show', '');
    }
  }

  private showLoading() {
    if (this.uploadButton) {
      this.uploadButton.disabled = true;
      this.uploadButton.setAttribute('isLoading', 'true');
    }
  }

  private hideLoading() {
    if (this.uploadButton) {
      this.uploadButton.disabled = true;
      this.uploadButton.removeAttribute('isLoading');
    }
  }

  render() {
    return `
    <button id="uploadBtn" disabled show>
      <span class='title'>Загрузить</span>
      <span class="loader"></span>
    </button>`;
  }
}
