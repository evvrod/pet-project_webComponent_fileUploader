import '../Form/Form';
import '../Response/Response';

import '../CloseButton/CloseButton';

import { eventBus } from '../../utils/eventBus';

import globalStyles from '../../global.css?inline';
import rawStyles from './FileUploader.css?inline';

export class FileUploader extends HTMLElement {
  private closeButton: HTMLButtonElement | null = null;
  private content: HTMLDivElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.handleClose = this.handleClose.bind(this);
    this.changeContent = this.changeContent.bind(this);
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.closeButton = this.shadowRoot.querySelector('#closeButton');
      this.content = this.shadowRoot.querySelector('#content');

      this.closeButton?.addEventListener('click', this.handleClose);

      eventBus.addEventListener(
        'upload-end',
        this.changeContent as EventListener,
      );
    }
  }

  disconnectedCallback() {
    this.closeButton?.removeEventListener('click', this.handleClose);
    eventBus.removeEventListener(
      'upload-end',
      this.changeContent as EventListener,
    );
  }

  private handleClose() {
    this.content?.removeAttribute('response');
    eventBus.dispatchEvent(new CustomEvent('init'));
  }

  private changeContent(event: CustomEvent) {
    this.content?.setAttribute('response', '');
    if (event.detail.error) {
      this.content?.classList.add('error');
    } else {
      this.content?.classList.remove('error');
    }
  }

  render() {
    return `
    <style>${globalStyles}</style>
    <style>${rawStyles}</style>
    <div class="file-uploader">
      <div class="content" id="content">
        <div class='wrapper-close-button'>
          <file-uploader-close-button id="closeButton"></file-uploader-close-button>
        </div>
        <file-uploader-form></file-uploader-form>
        <file-uploader-response></file-uploader-response>
      </div>
    </div>`;
  }
}
