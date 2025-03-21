import { eventBus } from '../../utils/eventBus';

import globalStyles from '../../global.css?inline';
import rawStyles from './TextGuide.css?inline';

const TEXT_GUIDE = [
  'Перед загрузкой дайте имя файлу',
  'Перенесите ваш файл в область ниже',
  'Загрузите ваш файл',
];

class TextGuide extends HTMLElement {
  private textGuide: HTMLHeadingElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.setZeroStage = this.setZeroStage.bind(this);
    this.setFirstStage = this.setFirstStage.bind(this);
    this.setSecondStage = this.setSecondStage.bind(this);
    this.hideTextGuide = this.hideTextGuide.bind(this);
    this.showTextGuide = this.showTextGuide.bind(this);
    this.initTextGuide = this.initTextGuide.bind(this);
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();

      this.textGuide =
        this.shadowRoot.querySelector<HTMLParagraphElement>('#textGuide');

      eventBus?.addEventListener('added-name', this.setFirstStage);
      eventBus?.addEventListener('removed-name', this.setZeroStage);
      eventBus?.addEventListener('file-ready', this.setSecondStage);
      eventBus?.addEventListener('deselected-file', this.setFirstStage);
      eventBus?.addEventListener('upload-start', this.hideTextGuide);
      eventBus?.addEventListener('init', this.initTextGuide);
    }
  }

  disconnectedCallback() {
    eventBus.removeEventListener('added-name', this.setFirstStage);
    eventBus.removeEventListener('file-ready', this.setSecondStage);
  }

  private initTextGuide() {
    if (this.textGuide) {
      this.textGuide.textContent = TEXT_GUIDE[0];
    }
    this.showTextGuide();
    this.setZeroStage();
  }

  private hideTextGuide() {
    this.textGuide?.removeAttribute('show');
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
    <style>${globalStyles}</style>
    <style>${rawStyles}</style>
    <h2 class="text-guide" id="textGuide" show>${TEXT_GUIDE[0]}</h2>
    `;
  }
}

customElements.define('file-uploader-text-guide', TextGuide);
