import { EventType, addEvent, dispatchEvent } from '../../utils/eventBus';

import getFileExtension from '../../utils/getFileExtension';

import rawGlobal from '../../global.css?inline';
import rawStyles from './Progress.css?inline';

const globalStylesheet = new CSSStyleSheet();
globalStylesheet.replaceSync(rawGlobal);

const componentStylesheet = new CSSStyleSheet();
componentStylesheet.replaceSync(rawStyles);

export class Progress extends HTMLElement {
  private progress: HTMLDivElement | null = null;
  private file: HTMLInputElement | null = null;
  private filename: HTMLSpanElement | null = null;
  private fileExtension: HTMLSpanElement | null = null;
  private percent: HTMLParagraphElement | null = null;
  private progressBar: HTMLDivElement | null = null;
  private progressLine: HTMLDivElement | null = null;
  private clearButton: HTMLButtonElement | null = null;
  private abortController: AbortController | null = null;

  static define(tagName = 'file-uploader-progress') {
    customElements.define(tagName, this);
  }

  constructor() {
    super();
    this.abortController = null;
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [
      globalStylesheet,
      componentStylesheet,
    ];

    this.updateProgress = this.updateProgress.bind(this);

    this.updateFilename = this.updateFilename.bind(this);
    this.updateFileExtension = this.updateFileExtension.bind(this);

    this.showProgress = this.showProgress.bind(this);
    this.deactivateProgress = this.deactivateProgress.bind(this);
    this.animateProgress = this.animateProgress.bind(this);
    this.initProgress = this.initProgress.bind(this);

    this.handleProgressClear = this.handleProgressClear.bind(this);
  }

  connectedCallback() {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

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

      this.clearButton?.addEventListener('click', this.handleProgressClear, {
        signal,
      });

      addEvent(EventType.AddName, this.updateFilename, { signal });
      addEvent(EventType.SelectFile, this.showProgress, { signal });
      addEvent(EventType.SelectFile, this.updateFileExtension, { signal });
      addEvent(EventType.SelectFileError, this.showProgress, { signal });
      addEvent(EventType.SelectFileError, this.updateFileExtension, { signal });
      addEvent(EventType.ReadFile, this.animateProgress, { signal });
      addEvent(EventType.UpdateProgress, this.updateProgress, { signal });
      addEvent(EventType.UploadStart, this.deactivateProgress, { signal });
      addEvent(EventType.Init, this.initProgress, { signal });
    }
  }

  disconnectedCallback() {
    this.abortController?.abort();
  }

  private handleProgressClear() {
    dispatchEvent(EventType.DeselectFile);
    this.initProgress();
  }

  private showProgress() {
    this.progress?.setAttribute('show', ``);
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
            <file-uploader-clear-button id='clearButton'></file-uploader-clear-button>
        </div>
    `;
  }
}
