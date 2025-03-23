import {
  EventType,
  addEvent,
  removeEvent,
  dispatchEvent,
} from '../../utils/eventBus';

import { uploadFile } from '../../utils/uploadFile';

import rawGlobal from '../../global.css?inline';
import rawStyles from './Form.css?inline';

const globalStylesheet = new CSSStyleSheet();
globalStylesheet.replaceSync(rawGlobal);

const componentStylesheet = new CSSStyleSheet();
componentStylesheet.replaceSync(rawStyles);

interface IUploadButtonElement extends HTMLElement {
  toggleButton(enabled: boolean): void;
  toggleLoading(isLoading: boolean): void;
}

interface INameInputElement extends HTMLElement {
  value: string;
}

interface IFileDragInputElement extends HTMLElement {
  value: File;
}

export class Form extends HTMLElement {
  private content: HTMLDivElement | null = null;
  private uploadButton: IUploadButtonElement | null = null;
  private nameInput: INameInputElement | null = null;
  private fileDragInput: IFileDragInputElement | null = null;
  private abortController: AbortController | null = null;

  static define(tagName = 'file-uploader-form') {
    customElements.define(tagName, this);
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [
      globalStylesheet,
      componentStylesheet,
    ];

    this.handleUpload = this.handleUpload.bind(this);
    this.readFileWithProgress = this.readFileWithProgress.bind(this);
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.content = this.shadowRoot.querySelector('#content');
      this.uploadButton = this.shadowRoot.querySelector('#uploadButton');

      this.fileDragInput = this.shadowRoot.querySelector('#fileDragInput');
      this.nameInput = this.shadowRoot.querySelector('#nameInput');

      this.uploadButton?.addEventListener('click', this.handleUpload);

      addEvent(EventType.SelectFile, this.readFileWithProgress);
      addEvent(EventType.Init, this.abortUpload);
    }
  }

  disconnectedCallback() {
    this.uploadButton?.removeEventListener('click', this.handleUpload);

    removeEvent(EventType.SelectFile, this.readFileWithProgress);
    removeEvent(EventType.Init, this.abortUpload);
  }

  private async handleUpload() {
    const file = this.fileDragInput?.value;
    const name = this.nameInput?.value;

    try {
      dispatchEvent(EventType.UploadStart);

      this.abortController = new AbortController();

      const response = await uploadFile({
        file,
        name,
        abortSignal: this.abortController.signal, // Передаем сигнал отмены
      });
      dispatchEvent(EventType.UploadEnd, response);
      if (response.error) {
        this.content?.classList.add('error');
      }
    } catch {
      dispatchEvent(EventType.UploadEnd, {
        error: {
          status: '500 Internal Server Error',
          message: 'Internal Server Error',
        },
      });
      this.content?.classList.add('error');
    } finally {
      this.content?.setAttribute('response', '');
    }
  }

  private readFileWithProgress(event: CustomEvent<File>) {
    const file = event.detail;
    if (!file) return;

    if (file.size === 0) {
      dispatchEvent(EventType.ReadFile, file);
      return;
    }

    const reader = new FileReader();

    reader.onprogress = (event: ProgressEvent<FileReader>) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        dispatchEvent(EventType.UpdateProgress, progress);
      }
    };

    reader.onload = () => {
      dispatchEvent(EventType.ReadFile, file);
    };

    reader.readAsArrayBuffer(file);
  }

  private abortUpload() {
    if (this.abortController) {
      this.abortController.abort(); // Отменяем запрос
    }
  }

  render() {
    return `
    <div class="form">
        <h1 class="title" id="title">Загрузочное окно</h1>
        <file-uploader-title></file-uploader-title>
        <file-uploader-text-guide></file-uploader-text-guide>
        <file-uploader-name-input id='nameInput'></file-uploader-name-input>
        <file-uploader-file-drag-input id='fileDragInput'></file-uploader-file-drag-input>
        <file-uploader-progress> draggable="false"></file-uploader-progress>
        <file-uploader-upload-button id='uploadButton'></file-uploader-upload-button>
    </div>`;
  }
}
