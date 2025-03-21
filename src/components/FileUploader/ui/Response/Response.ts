import { eventBus } from '../../utils/eventBus';

import {
  IUploadFileResponse,
  IUploadError,
  IUploadSuccessResponse,
} from '../../utils/uploadFile';

import globalStyles from '../../global.css?inline';
import rawStyles from './Response.css?inline';

class Response extends HTMLElement {
  private response: HTMLElement | null = null;
  private titleResponse: HTMLElement | null = null;
  private infoBlock: HTMLElement | null = null;
  private name: HTMLElement | null = null;
  private filename: HTMLElement | null = null;
  private timestamp: HTMLElement | null = null;
  private message: HTMLElement | null = null;
  private errorBlock: HTMLElement | null = null;
  private errorStatus: HTMLElement | null = null;
  private errorMessage: HTMLElement | null = null;
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.showResponse = this.showResponse.bind(this);
    this.initResponse = this.initResponse.bind(this);
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.titleResponse = this.shadowRoot.getElementById(
        'titleResponse',
      ) as HTMLElement;

      this.response = this.shadowRoot.getElementById('response') as HTMLElement;
      this.infoBlock = this.shadowRoot.getElementById(
        'infoBlock',
      ) as HTMLElement;
      this.name = this.shadowRoot.getElementById('name') as HTMLElement;
      this.filename = this.shadowRoot.getElementById('filename') as HTMLElement;
      this.timestamp = this.shadowRoot.getElementById(
        'timestamp',
      ) as HTMLElement;
      this.message = this.shadowRoot.getElementById('message') as HTMLElement;

      this.errorBlock = this.shadowRoot.getElementById(
        'errorBlock',
      ) as HTMLElement;
      this.errorStatus = this.shadowRoot.getElementById(
        'errorStatus',
      ) as HTMLElement;
      this.errorMessage = this.shadowRoot.getElementById(
        'errorMessage',
      ) as HTMLElement;

      eventBus.addEventListener(
        'upload-end',
        this.showResponse as EventListener,
      );

      eventBus.addEventListener('init', this.initResponse);
    }
  }

  private initResponse() {
    this.response?.removeAttribute('show');
  }

  private showResponse(event: CustomEvent<IUploadFileResponse>) {
    if (event.detail.data) {
      this.showInfo(event.detail.data);
    } else if (event.detail.error) {
      this.showError(event.detail.error);
    }
  }

  private showInfo(data: IUploadSuccessResponse) {
    this.response?.setAttribute('show', '');
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
    this.response?.setAttribute('show', '');

    this.errorBlock?.setAttribute('show', '');
    this.infoBlock?.removeAttribute('show');
    if (this.titleResponse)
      this.titleResponse.textContent = 'Ошибка в загрузке файла';

    if (this.errorStatus) this.errorStatus.textContent = error.status;
    if (this.errorMessage) this.errorMessage.textContent = error.message;
  }

  render() {
    return `
    <style>${globalStyles}</style>
    <style>${rawStyles}</style>
      <div class='response' id='response'>
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

customElements.define('file-uploader-response', Response);
