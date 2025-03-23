import { EventType, addEvent } from '../../utils/eventBus';

import rawGlobal from '../../global.css?inline';
import rawStyles from './TextGuide.css?inline';

const globalStylesheet = new CSSStyleSheet();
globalStylesheet.replaceSync(rawGlobal);

const componentStylesheet = new CSSStyleSheet();
componentStylesheet.replaceSync(rawStyles);

const TEXT_GUIDE = [
  'Перед загрузкой дайте имя файлу',
  'Перенесите ваш файл в область ниже',
  'Загрузите ваш файл',
];

export class TextGuide extends HTMLElement {
  private textGuide: HTMLHeadingElement | null = null;
  private abortController: AbortController | null = null;

  static define(tagName = 'file-uploader-text-guide') {
    customElements.define(tagName, this);
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [
      globalStylesheet,
      componentStylesheet,
    ];

    this.setZeroStage = this.setZeroStage.bind(this);
    this.setFirstStage = this.setFirstStage.bind(this);
    this.setSecondStage = this.setSecondStage.bind(this);
    this.showTextGuide = this.showTextGuide.bind(this);
    this.initTextGuide = this.initTextGuide.bind(this);
  }

  connectedCallback() {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.textGuide =
        this.shadowRoot.querySelector<HTMLParagraphElement>('#textGuide');

      addEvent(EventType.AddName, this.setFirstStage, { signal });
      addEvent(EventType.RemoveName, this.setZeroStage, { signal });
      addEvent(EventType.ReadFile, this.setSecondStage, { signal });
      addEvent(EventType.DeselectFile, this.setFirstStage, { signal });
      addEvent(EventType.Init, this.initTextGuide, { signal });
    }
  }

  disconnectedCallback() {
    this.abortController?.abort();
  }

  private initTextGuide() {
    if (this.textGuide) {
      this.textGuide.textContent = TEXT_GUIDE[0];
    }
    this.showTextGuide();
    this.setZeroStage();
  }

  private showTextGuide() {
    this.textGuide?.setAttribute('show', '');
  }

  private setZeroStage() {
    if (this.textGuide) {
      this.textGuide.textContent = TEXT_GUIDE[0];
    }
  }

  private setFirstStage() {
    if (this.textGuide) {
      this.textGuide.textContent = TEXT_GUIDE[1];
    }
  }

  private setSecondStage() {
    if (this.textGuide) {
      this.textGuide.textContent = TEXT_GUIDE[2];
    }
  }

  render() {
    return `
    <h2 class="text-guide" id="textGuide" show>${TEXT_GUIDE[0]}</h2>
    `;
  }
}
