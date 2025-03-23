import {
  EventType,
  addEvent,
  removeEvent,
  dispatchEvent,
} from '../../utils/eventBus';

import { IUploadFileResponse } from '../../utils/uploadFile';

import rawGlobal from '../../global.css?inline';
import rawStyles from './FileUploader.css?inline';

const globalStylesheet = new CSSStyleSheet();
globalStylesheet.replaceSync(rawGlobal);

const componentStylesheet = new CSSStyleSheet();
componentStylesheet.replaceSync(rawStyles);

export class FileUploader extends HTMLElement {
  private closeButton: HTMLButtonElement | null = null;
  private content: HTMLDivElement | null = null;
  private form: HTMLDivElement | null = null;
  private response: HTMLDivElement | null = null;

  static define(tagName = 'file-uploader') {
    customElements.define(tagName, this);
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [
      globalStylesheet,
      componentStylesheet,
    ];

    this.handleClose = this.handleClose.bind(this);
    this.changeContent = this.changeContent.bind(this);
    this.initFileUploader = this.initFileUploader.bind(this);
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.closeButton = this.shadowRoot.querySelector('#closeButton');
      this.content = this.shadowRoot.querySelector('#content');
      this.form = this.shadowRoot.querySelector('#form');
      this.response = this.shadowRoot.querySelector('#response');

      this.closeButton?.addEventListener('click', this.handleClose);

      addEvent(EventType.UploadEnd, this.changeContent);
      addEvent(EventType.Init, this.initFileUploader);
    }
  }

  disconnectedCallback() {
    this.closeButton?.removeEventListener('click', this.handleClose);
    removeEvent(EventType.UploadEnd, this.changeContent);
    removeEvent(EventType.Init, this.initFileUploader);
  }

  private handleClose() {
    this.content?.removeAttribute('response');
    dispatchEvent(EventType.Init);
  }

  private changeContent(event: CustomEvent<IUploadFileResponse>) {
    this.form?.removeAttribute('show');
    this.content?.setAttribute('response', '');
    if (event.detail.error) {
      this.content?.classList.add('error');
    } else {
      this.content?.classList.remove('error');
    }
  }

  private initFileUploader() {
    this.form?.setAttribute('show', '');
    this.response?.removeAttribute('show');
  }

  render() {
    return `
    <div class="file-uploader">
      <div class="content" id="content">
        <div class='wrapper-close-button'>
          <file-uploader-close-button id="closeButton"></file-uploader-close-button>
        </div>
        <file-uploader-form show id='form'></file-uploader-form>
        <file-uploader-response id='response'></file-uploader-response>
      </div>
    </div>`;
  }
}
