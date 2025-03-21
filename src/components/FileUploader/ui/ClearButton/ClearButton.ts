import globalStyles from '../../global.css?inline';
import rawStyles from './ClearButton.css?inline';

class ClearButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.render();
    }
  }

  private render() {
    return `
        <style>${globalStyles}</style>
        <style>${rawStyles}</style>
        <button>
          <div class="line"></div>
          <div class="line"></div>
        </button>
      `;
  }
}

customElements.define('clear-button', ClearButton);
