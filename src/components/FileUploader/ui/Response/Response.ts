import { EventType, addEvent, removeEvent } from '../../utils/eventBus';

import {
  IUploadFileResponse,
  IUploadError,
  IUploadSuccessResponse,
} from '../../utils/uploadFile';

import rawGlobal from '../../global.css?inline';
import rawStyles from './Response.css?inline';

const globalStylesheet = new CSSStyleSheet();
globalStylesheet.replaceSync(rawGlobal);

const componentStylesheet = new CSSStyleSheet();
componentStylesheet.replaceSync(rawStyles);

export class Response extends HTMLElement {
  private titleResponse: HTMLElement | null = null;
  private infoBlock: HTMLElement | null = null;
  private name: HTMLElement | null = null;
  private filename: HTMLElement | null = null;
  private timestamp: HTMLElement | null = null;
  private message: HTMLElement | null = null;
  private errorBlock: HTMLElement | null = null;
  private errorStatus: HTMLElement | null = null;
  private errorMessage: HTMLElement | null = null;

  static define(tagName = 'file-uploader-response') {
    customElements.define(tagName, this);
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [
      globalStylesheet,
      componentStylesheet,
    ];

    this.showResponse = this.showResponse.bind(this);
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.titleResponse =
        this.shadowRoot.querySelector<HTMLHeadingElement>('#titleResponse');
      this.infoBlock =
        this.shadowRoot.querySelector<HTMLDivElement>('#infoBlock');
      this.name = this.shadowRoot.querySelector<HTMLSpanElement>('#name');
      this.filename =
        this.shadowRoot.querySelector<HTMLSpanElement>('#filename');
      this.timestamp =
        this.shadowRoot.querySelector<HTMLSpanElement>('#timestamp');
      this.message = this.shadowRoot.querySelector<HTMLSpanElement>('#message');
      this.errorBlock =
        this.shadowRoot.querySelector<HTMLDivElement>('#errorBlock');
      this.errorStatus =
        this.shadowRoot.querySelector<HTMLSpanElement>('#errorStatus');
      this.errorMessage =
        this.shadowRoot.querySelector<HTMLSpanElement>('#errorMessage');

      addEvent(EventType.UploadEnd, this.showResponse);
    }
  }

  disconnectedCallback() {
    removeEvent(EventType.UploadEnd, this.showResponse);
  }

  private showResponse(event: CustomEvent<IUploadFileResponse>) {
    if (event.detail.data) {
      this.showInfo(event.detail.data);
    } else if (event.detail.error) {
      this.showError(event.detail.error);
    }
  }

  private showInfo(data: IUploadSuccessResponse) {
    this.infoBlock?.setAttribute('show', '');
    this.errorBlock?.removeAttribute('show');
    if (this.titleResponse)
      this.titleResponse.textContent = 'Файл успешно загружен';

    if (this.name) this.name.textContent = data.nameField;
    if (this.filename) this.filename.textContent = data.filename;
    if (this.timestamp) this.timestamp.textContent = data.timestamp;
    if (this.message) this.message.textContent = data.message;
  }

  private showError(error: IUploadError) {
    this.errorBlock?.setAttribute('show', '');
    this.infoBlock?.removeAttribute('show');
    if (this.titleResponse)
      this.titleResponse.textContent = 'Ошибка в загрузке файла';

    if (this.errorStatus) this.errorStatus.textContent = error.status;
    if (this.errorMessage) this.errorMessage.textContent = error.message;
  }

  render() {
    return `
      <div class='response'>
        <h1 class="title" id="titleResponse"></h1>
        <div class='info-block' id='infoBlock'>
            <p>
              <span>name: </span>
              <span id='name'></span>
            </p>
            <p>
              <span>filename: </span>
              <span id='filename'></span></p>
            <p>
              <span>timestamp:</span>
              <span id='timestamp'></span>
            </p>
            <p>
              <span>message:</span>
              <span id='message'></span>
            </p>
        </div>
        <div class='error-block' id='errorBlock'>
          <p>
            <span>Error:</span> 
            <span id='errorStatus'></span>
          </p>
          <p>
            <span>message:</span>
            <span id='errorMessage'></span>
          </p>
        </div>
      </div>
    `;
  }
}
