// Import the LitElement base class and html helper function
import { LitElement, html, css } from "lit-element";

// Extend the LitElement base class
class MyElement extends LitElement {
  // properties getter
  static get styles() {
    return css`
      .sidebar[data-open] {
        background: var(--tea-sidebar-bgcolor, #eee);
        position: fixed;
        width: var(--tea-sidebar-width, 300px);
        max-width: var(--tea-sidebar-maxwidth, initial);
        min-width: var(--tea-sidebar-minwidth, initial);
        left: 0;
        top: 0;
        margin: 0;
        height: 100%;
        height: calc(100% + 60px);
        height: -moz-calc(100%);
        padding-bottom: 60px;
        z-index: 999;
        overflow-y: auto;
        will-change: transform;
        backface-visibility: hidden;
        transform: translateX(-105%);
        transition: var(--tea-sidebar-transition, transform 300ms ease);
      }

      .sidebar[data-open="true"] {
        transform: translateX(0%);
      }

      [data-sidenav-overlay] {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        opacity: 0;
        width: 0;
        height: 100%;
        height: calc(100% + 60px);
        height: -moz-calc(100%);
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 997;
        display: block;
      }

      [data-sidenav-overlay="true"] {
        width: 100%;
        opacity: 1;
      }
    `;
  }

  static get properties() {
    return {
      isOpen: { type: String, attribute: "data-open", reflect: true }
    };
  }

  constructor() {
    super();
    this.isOpen = "false";
  }

  dispatch() {
    const event = new CustomEvent("tea-event", {
      detail: {
        isOpen: this.open
      }
    });
    this.dispatchEvent(event);
  }

  open() {
    this.isOpen = "true";
    this.dispatch();
  }

  close() {
    this.isOpen = "false";
    this.dispatch();
  }

  toggle() {
    this.isOpen = this.isOpen === "true" ? "false" : "true";
    this.dispatch();
  }

  firstUpdated() {
    this.ref = this.shadowRoot.querySelector("[data-open]");
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("blur", () => {
      if (document.activeElement !== this) this.close();
    });
  }

  handleOverlayClick(e) {
    this.close();
  }

  render() {
    return html`
      <!-- template content -->
      <div class="sidebar" tabindex="0" data-open="${this.isOpen}" @focus=${() => this.open()}>
        <slot></slot>
      </div>
      <div @click=${this.handleOverlayClick} data-sidenav-overlay="${this.isOpen}"></div>
    `;
  }
}
// Register the new element with the browser.
const tag = "tea-sidenav";
if (window.customElements.get(tag) === undefined) {
  window.customElements.define(tag, MyElement);
}
