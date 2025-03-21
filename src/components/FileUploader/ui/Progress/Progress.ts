import { eventBus } from '../../utils/eventBus';
import getFileExtension from '../../utils/getFileExtension';

import globalStyles from '../../global.css?inline';
import rawStyles from './Progress.css?inline';

import '../ClearButton/ClearButton';

class Progress extends HTMLElement {
  private progress: HTMLDivElement | null = null;
  private file: HTMLInputElement | null = null;
  private filename: HTMLSpanElement | null = null;
  private fileExtension: HTMLSpanElement | null = null;
  private percent: HTMLParagraphElement | null = null;
  private progressBar: HTMLDivElement | null = null;
  private progressLine: HTMLDivElement | null = null;
  private clearButton: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.updateProgress = this.updateProgress.bind(this);

    this.updateFilename = this.updateFilename.bind(this);
    this.updateFileExtension = this.updateFileExtension.bind(this);

    this.showProgress = this.showProgress.bind(this);
    this.hideProgress = this.hideProgress.bind(this);
    this.animateProgress = this.animateProgress.bind(this);
    this.deactivateProgress = this.deactivateProgress.bind(this);
    this.initProgress = this.initProgress.bind(this);

    this.handleProgressClear = this.handleProgressClear.bind(this);
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.progress =
        this.shadowRoot.querySelector<HTMLDivElement>('#progress');
      this.file = this.shadowRoot.querySelector<HTMLInputElement>('#file');
      this.filename =
        this.shadowRoot.querySelector<HTMLSpanElement>('#filename');
      this.fileExtension =
        this.shadowRoot.querySelector<HTMLSpanElement>('#fileExtension');
      this.percent =
        this.shadowRoot.querySelector<HTMLParagraphElement>('#percent');
      this.progressBar =
        this.shadowRoot.querySelector<HTMLDivElement>('#progressBar');
      this.progressLine = this.progressLine =
        this.shadowRoot.querySelector<HTMLDivElement>('#progress-line');
      this.clearButton =
        this.shadowRoot.querySelector<HTMLButtonElement>('#clearButton');

      this.clearButton?.addEventListener('click', this.handleProgressClear);

      eventBus.addEventListener(
        'added-name',
        this.updateFilename as EventListener,
      );

      eventBus.addEventListener(
        'selected-file',
        this.showProgress as EventListener,
      );

      eventBus.addEventListener(
        'selected-file',
        this.updateFileExtension as EventListener,
      );

      eventBus.addEventListener('error-selected-file', this.showProgress);

      eventBus.addEventListener(
        'error-selected-file',
        this.updateFileExtension as EventListener,
      );

      eventBus.addEventListener('file-ready', this.animateProgress);

      eventBus.addEventListener(
        'progress-update',
        this.updateProgress as EventListener,
      );

      eventBus.addEventListener('upload-start', this.deactivateProgress);
      eventBus.addEventListener('upload-end', this.hideProgress);

      eventBus.addEventListener('init', this.initProgress);
    }
  }

  disconnectedCallback() {
    eventBus.removeEventListener(
      'progress-update',
      this.updateProgress as EventListener,
    );
    eventBus?.removeEventListener(
      'selected-file',
      this.updateFileExtension as EventListener,
    );
  }

  private handleProgressClear() {
    eventBus.dispatchEvent(new CustomEvent('deselected-file'));
    this.initProgress();
  }

  private showProgress() {
    this.progress?.setAttribute('show', ``);
  }

  private hideProgress() {
    this.progress?.removeAttribute('show');
  }

  private initProgress() {
    this.progress?.removeAttribute('show');
    this.progress?.setAttribute('active', '');
    this.progressLine?.removeAttribute('style');
    if (this.percent) this.percent.textContent = `0%`;

    this.progressBar?.removeAttribute('completed');
    this.percent?.classList.remove('expand');
    this.file?.classList.remove('expand');
  }

  private deactivateProgress() {
    this.progress?.removeAttribute('active');
  }

  private updateProgress(event: CustomEvent) {
    const percent = event.detail;

    if (this.percent) this.percent.textContent = `${percent}%`;
    if (this.progressLine) this.progressLine.style.width = `${percent}%`;
  }

  private animateProgress() {
    // Скрыть прогресс-линию после того как прогресс достиг 100%
    this.progressBar?.setAttribute('completed', '');
    // Увеличить filename и процент
    this.percent?.classList.add('expand');
    this.file?.classList.add('expand');
  }

  private updateFilename(event: CustomEvent) {
    const filename = event.detail;
    if (this.filename) {
      this.filename.textContent = filename;
    }
  }

  private updateFileExtension(event: CustomEvent) {
    const filename = event.detail.name;

    if (this.fileExtension) {
      this.fileExtension.textContent = `.${getFileExtension(filename)}`;
    }
  }

  render() {
    return `
    <style>${globalStyles}</style>
    <style>${rawStyles}</style>
        <div class='progress' id='progress' active>
            <div class='icon'></div>
            <div class='loader'>
                <div class='wrapper-filename'>
                    <p class='file' id='file'>
                      <span id='filename'></span>
                      <span id='fileExtension'></span>
                    </p>
                    <p class='percent' id="percent">0%</p>
                </div>           
                <div class='progress-bar' id='progressBar'>
                    <div class='progress-line' id='progress-line'></div>
                </div>
            </div>
            <clear-button id='clearButton'></clear-button>
        </div>
    `;
  }
}

customElements.define('file-uploader-progress', Progress);
