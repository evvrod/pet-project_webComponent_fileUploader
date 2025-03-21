import { eventBus } from '../../utils/eventBus';

import globalStyles from '../../global.css?inline';
import rawStyles from './FileDragInput.css?inline';

import icon from '../../assets/docs pic.png';

import { validateFile } from '../../utils/validateFile';

class FileDragInput extends HTMLElement {
  private privateValue: File | null = null;
  private dropZone: HTMLDivElement | null = null;
  private errorDiv: HTMLDivElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    this.activateFileDragInput = this.activateFileDragInput.bind(this);
    this.deactivateFileDragInput = this.deactivateFileDragInput.bind(this);

    this.hideError = this.hideError.bind(this);

    this.hideFileDragInput = this.hideFileDragInput.bind(this);
    this.showFileDragInput = this.showFileDragInput.bind(this);

    this.initFileDragInput = this.initFileDragInput.bind(this);
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.dropZone =
        this.shadowRoot.querySelector<HTMLDivElement>('.drop-zone');
      this.errorDiv = this.shadowRoot.querySelector<HTMLDivElement>('.error');

      eventBus.addEventListener('added-name', this.activateFileDragInput);
      eventBus.addEventListener('removed-name', this.deactivateFileDragInput);
      eventBus.addEventListener('selected-file', this.deactivateFileDragInput);
      eventBus.addEventListener('deselected-file', this.activateFileDragInput);
      eventBus.addEventListener('deselected-file', this.hideError);
      eventBus.addEventListener('upload-end', this.hideFileDragInput);
      eventBus.addEventListener('init', this.initFileDragInput);
    }
  }

  disconnectedCallback() {
    this.dropZone?.removeEventListener('dragover', this.handleDragOver);
    this.dropZone?.removeEventListener('dragleave', this.handleDragLeave);
    this.dropZone?.removeEventListener('drop', this.handleDrop);

    eventBus.removeEventListener('added-name', this.activateFileDragInput);
    eventBus.removeEventListener('deselected-file', this.hideError);
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

  private hideFileDragInput() {
    this.deactivateFileDragInput();
    this.dropZone?.removeAttribute('show');
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

      eventBus.dispatchEvent(
        new CustomEvent('error-selected-file', { detail: file }),
      );

      this.deactivateFileDragInput();

      return;
    }

    this.privateValue = file;

    eventBus.dispatchEvent(new CustomEvent('selected-file', { detail: file }));
  }

  get value() {
    return this.privateValue;
  }

  render() {
    return `
    <style >${globalStyles}</style>
    <style>${rawStyles}</style>
    <div class="drop-zone" show>
      <div class="drag-over-message">
        <img src=${icon} alt='' draggable="false"/>
        <p>Перенесите файл в область загрузки</p>
      </div>
    </div>
    <div class="error"></div>
    `;
  }
}

customElements.define('file-drag-input', FileDragInput);
