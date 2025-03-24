import { EventType, addEvent, dispatchEvent } from '../../utils/eventBus';

import icon from '../../assets/docs pic.png';
import { validateFile } from '../../utils/validateFile';

import rawGlobal from '../../global.css?inline';
import rawStyles from './FileDragInput.css?inline';

const globalStylesheet = new CSSStyleSheet();
globalStylesheet.replaceSync(rawGlobal);

const componentStylesheet = new CSSStyleSheet();
componentStylesheet.replaceSync(rawStyles);

export class FileDragInput extends HTMLElement {
  private privateValue: File | null = null;
  private dropZone: HTMLDivElement | null = null;
  private errorDiv: HTMLDivElement | null = null;
  private abortController: AbortController | null = null;

  static define(tagName = 'file-uploader-file-drag-input') {
    customElements.define(tagName, this);
  }

  constructor() {
    super();
    this.abortController = null;
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [
      globalStylesheet,
      componentStylesheet,
    ];

    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    this.activateFileDragInput = this.activateFileDragInput.bind(this);
    this.deactivateFileDragInput = this.deactivateFileDragInput.bind(this);

    this.hideError = this.hideError.bind(this);

    this.showFileDragInput = this.showFileDragInput.bind(this);
    this.initFileDragInput = this.initFileDragInput.bind(this);
  }

  connectedCallback() {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.dropZone =
        this.shadowRoot.querySelector<HTMLDivElement>('#dropZone');
      this.errorDiv = this.shadowRoot.querySelector<HTMLDivElement>('#error');

      addEvent(EventType.AddName, this.activateFileDragInput, { signal });
      addEvent(EventType.RemoveName, this.deactivateFileDragInput, { signal });
      addEvent(EventType.SelectFile, this.deactivateFileDragInput, { signal });
      addEvent(EventType.DeselectFile, this.activateFileDragInput, { signal });
      addEvent(EventType.DeselectFile, this.hideError, { signal });
      addEvent(EventType.Init, this.initFileDragInput, { signal });
    }
  }

  disconnectedCallback() {
    this.abortController?.abort();
  }

  private initFileDragInput() {
    this.privateValue = null;
    this.showFileDragInput();
    this.deactivateFileDragInput();
  }

  private activateFileDragInput() {
    const dropZone = this.dropZone;

    if (dropZone) {
      if (!dropZone.hasAttribute('drag-active')) {
        dropZone.addEventListener('dragover', this.handleDragOver);
        dropZone.addEventListener('dragleave', this.handleDragLeave);
        dropZone.addEventListener('drop', this.handleDrop);

        // Устанавливаем атрибут, чтобы избежать повторной подписки на события
        dropZone.setAttribute('drag-active', 'true');
      }
    }
  }

  private deactivateFileDragInput() {
    const dropZone = this.dropZone;
    if (dropZone) {
      dropZone.removeEventListener('dragover', this.handleDragOver);
      dropZone.removeEventListener('dragleave', this.handleDragLeave);
      dropZone.removeEventListener('drop', this.handleDrop);

      // Удаляем атрибут 'drag-active' при отключении компонента
      dropZone.removeAttribute('drag-active');
    }
  }

  private showFileDragInput() {
    this.deactivateFileDragInput();
    this.dropZone?.setAttribute('show', '');
  }

  private hideError() {
    if (this.errorDiv) {
      this.errorDiv.textContent = '';
      this.errorDiv.removeAttribute('show');
    }
  }

  private handleDragOver(event: DragEvent) {
    event.preventDefault();
    this.dropZone?.classList.add('drag-over');
  }

  private handleDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dropZone?.classList.remove('drag-over');
  }

  private handleDrop(event: DragEvent) {
    event.preventDefault();

    this.dropZone?.classList.remove('drag-over');

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    const errors = validateFile(file);
    if (errors.length > 0) {
      if (this.errorDiv) {
        this.errorDiv.setAttribute('show', '');
        this.errorDiv.textContent = errors.join(' ');
      }

      dispatchEvent(EventType.SelectFileError, file);

      this.deactivateFileDragInput();

      return;
    }

    this.privateValue = file;

    dispatchEvent(EventType.SelectFile, file);
  }

  get value() {
    return this.privateValue;
  }

  render() {
    return `
    <div class="drop-zone" id="dropZone" show>
      <div class="drag-over-message">
        <img src=${icon} alt='' draggable="false"/>
        <p>Перенесите файл в область загрузки</p>
      </div>
    </div>
    <div class="error" id="error"></div>
    `;
  }
}
