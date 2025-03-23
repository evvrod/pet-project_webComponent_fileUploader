import rawGlobal from '../../global.css?inline';
import rawStyles from './ClearButton.css?inline';

const globalStylesheet = new CSSStyleSheet();
if (globalStylesheet.replaceSync && rawGlobal) {
  globalStylesheet.replaceSync(rawGlobal);
}
const componentStylesheet = new CSSStyleSheet();
if (componentStylesheet.replaceSync && rawStyles) {
  componentStylesheet.replaceSync(rawStyles);
}

export class ClearButton extends HTMLElement {
  static define(tagName = 'file-uploader-clear-button') {
    customElements.define(tagName, this);
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [
      globalStylesheet,
      componentStylesheet,
    ];
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();
    }
  }

  private render() {
    return `
        <button>
          <div class="line"></div>
          <div class="line"></div>
        </button>
      `;
  }
}
