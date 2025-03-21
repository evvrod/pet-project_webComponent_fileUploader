import { eventBus } from '../../utils/eventBus';

import globalStyles from '../../global.css?inline';
import rawStyles from './UploadButton.css?inline';

class UploadButton extends HTMLElement {
  private uploadButton: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.hideButton = this.hideButton.bind(this);

    this.showLoading = this.showLoading.bind(this);
    this.hideLoading = this.hideLoading.bind(this);

    this.initButton = this.initButton.bind(this);
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.uploadButton =
        this.shadowRoot.querySelector<HTMLButtonElement>('#uploadBtn');

      eventBus.addEventListener('file-ready', this.enableButton);
      eventBus.addEventListener('deselected-file', this.disableButton);

      eventBus.addEventListener('upload-start', this.showLoading);
      eventBus.addEventListener('upload-start', this.disableButton);

      eventBus.addEventListener('upload-end', this.hideLoading);
      eventBus.addEventListener('upload-end', this.hideButton);

      eventBus.addEventListener('init', this.initButton);
    }
  }

  disconnectedCallback() {
    eventBus.removeEventListener('file-ready', this.enableButton);
    eventBus.removeEventListener('deselected-file', this.disableButton);
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
    <style>${globalStyles}</style>
    <style>${rawStyles}</style>
    <button id="uploadBtn" disabled show>
      <span class='title'>Загрузить</span>
      <span class="loader"></span>
    </button>`;
  }
}

customElements.define('file-uploader-upload-button', UploadButton);
