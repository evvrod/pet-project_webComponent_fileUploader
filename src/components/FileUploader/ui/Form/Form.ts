import '../UploadButton/UploadButton';
import '../FileDragInput/FileDragInput';
import '../NameInput/NameInput';
import '../Progress/Progress';
import '../TextGuide/TextGuide';

import { eventBus } from '../../utils/eventBus';
import { uploadFile } from '../../utils/uploadFile';

import globalStyles from '../../global.css?inline';
import rawStyles from './Form.css?inline';

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

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

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

      eventBus.addEventListener('selected-file', this.readFileWithProgress);
    }
  }

  disconnectedCallback() {
    this.uploadButton?.removeEventListener('click', this.handleUpload);

    eventBus.removeEventListener('selected-file', this.readFileWithProgress);
  }

  private async handleUpload() {
    const file = this.fileDragInput?.value;
    const name = this.nameInput?.value;

    try {
      eventBus.dispatchEvent(new CustomEvent('upload-start'));
      const response = await uploadFile({ file, name });
      eventBus.dispatchEvent(
        new CustomEvent('upload-end', { detail: response }),
      );
      if (response.error) {
        this.content?.classList.add('error');
      }
    } catch {
      eventBus.dispatchEvent(
        new CustomEvent('upload-end', {
          detail: {
            error: {
              status: '500 Internal Server Error',
              message: 'Internal Server Error',
            },
          },
        }),
      );
      this.content?.classList.add('error');
    } finally {
      this.content?.setAttribute('response', '');
    }
  }

  private readFileWithProgress(event: Event) {
    const customEvent = event as CustomEvent<File>;
    const file = customEvent.detail;
    if (!file) return;

    const reader = new FileReader();
    let targetProgress = 0;
    let currentProgress = 0;
    let fileLoaded = false; // Флаг, указывающий, что файл загружен

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        targetProgress = Math.round((event.loaded / event.total) * 100);

        // Плавное увеличение прогресса
        const animateProgress = () => {
          return new Promise<void>((resolve) => {
            const updateProgress = () => {
              if (currentProgress < targetProgress) {
                currentProgress += 10;
                eventBus.dispatchEvent(
                  new CustomEvent('progress-update', {
                    detail: currentProgress,
                  }),
                );

                requestAnimationFrame(updateProgress);
              } else {
                eventBus.dispatchEvent(
                  new CustomEvent('progress-update', {
                    detail: targetProgress,
                  }),
                );
                resolve(); // Завершаем Promise, когда прогресс достигнут
              }
            };

            updateProgress();
          });
        };

        // Ждем завершения анимации прогресса
        animateProgress().then(() => {
          if (fileLoaded) {
            // Только если файл загружен, отправляем событие
            eventBus.dispatchEvent(
              new CustomEvent('file-ready', { detail: file }),
            );
          }
        });
      }
    };

    reader.onload = () => {
      fileLoaded = true; // Файл загружен
    };

    reader.readAsArrayBuffer(file);
  }

  render() {
    return `
    <style>${globalStyles}</style>
    <style>${rawStyles}</style>
    <div class="form">
        <h1 class="title" id="title">Загрузочное окно</h1>
        <file-uploader-title></file-uploader-title>
        <file-uploader-text-guide></file-uploader-text-guide>
        <file-uploader-name-input id='nameInput'></file-uploader-name-input>
        <file-drag-input id='fileDragInput'></file-drag-input>
        <file-uploader-progress> draggable="false"></file-uploader-progress>
        <file-uploader-upload-button id='uploadButton'></file-uploader-upload-button>
    </div>`;
  }
}
customElements.define('file-uploader-form', Form);
