// Import the LitElement base class and html helper function
import { LitElement, html, css } from "lit-element";

// Extend the LitElement base class
class MyElement extends LitElement {
  // properties getter
  static get styles() {
    return css`
      .sidebar[data-open] {
        position: fixed;
        top: 0;
        background: var(--tea-bg-3, #eee);
        width: var(--tea-sidebar-width, 300px);
        max-width: var(--tea-sidebar-maxwidth, initial);
        min-width: var(--tea-sidebar-minwidth, initial);
        margin: 0;
        height: 100%;
        height: calc(100% + 60px);
        height: -moz-calc(100%);
        padding-bottom: 60px;
        z-index: 999;
        overflow-y: auto;
        will-change: transform;
        backface-visibility: hidden;
        transition: var(--tea-sidebar-transition, transform 300ms ease);
      }
      .sidebar[data-position="left"] {
        left: 0;
        transform: translateX(-105%);
      }
      .sidebar[data-position="right"] {
        right: 0;
        transform: translateX(105%);
      }
      .sidebar[data-open="true"] {
        transform: translateX(0%);
      }
      .sidebar[data-open] button.close {
        float: right;
        border: 0;
        font-size: 1rem;
        font-weight: bold;
        min-height: 30px;
        min-width: 30px;
        margin: 3px;
        color: var(--tea-txt-2, #eee);
        border-radius: 100%;
        border: 2px solid transparent;
        transition: border 0.3s ease, background 0.5s ease;
        background: transparent;
      }
      .sidebar[data-open] button.close:hover {
        cursor: pointer;
        background: var(--tea-bg-2, #000);
      }
      .sidebar[data-open] button.close:focus {
        cursor: pointer;
        border: 2px solid var(--tea-txt-2, #000);
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
      isOpen: { type: String, attribute: "data-open", reflect: true },
      ariaLabel: { type: String, attribute: "data-label" },
      position: { type: String, attribute: "data-position" }
    };
  }

  constructor() {
    super();
    this.isOpen = "false";
    this.position = "left";
    this.ariaLabel = "General";
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
    this.elements.map(i => i.setAttribute("tabindex", 0));
    this.ref.setAttribute("tabindex", 0);
    this.ref.focus();
    this.dispatch();
  }

  openWithTrigger(triggerEl = null) {
    this.triggerEl = triggerEl;
    this.open();
  }

  close() {
    this.elements.map(i => i.setAttribute("tabindex", -1));
    this.ref.setAttribute("tabindex", -1);
    if (this.triggerEl) this.triggerEl.focus();
    this.isOpen = "false";
    this.dispatch();
  }

  toggle() {
    this.isOpen = this.isOpen === "true" ? "false" : "true";
    this.dispatch();
  }

  firstUpdated() {
    this.ref = this.shadowRoot.querySelector("[data-open]");
    const closeRef = this.shadowRoot.querySelector(".close");
    const focusables = this.querySelectorAll(
      "a, input, button, textarea, [tabindex], [contenteditable='true']"
    );
    this.elements = [closeRef, ...[].slice.call(focusables)];
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", e => {
      if (e.key === "Tab") {
        const target = e.explicitOriginalTarget || e.target;
        const last = this.elements[this.elements.length - 1];
        const first = this.elements[0];
        const isLast = target === last && !e.shiftKey;
        const isFirst = target === first && e.shiftKey;

        if (isFirst || isLast) e.preventDefault();
        if (isLast) first.focus();
        if (isFirst) last.focus();
      }
    });
  }

  handleOverlayClick(e) {
    this.close();
  }

  render() {
    return html`
      <!-- template content -->
      <div
        role="region"
        aria-label="${this.ariaLabel}"
        class="sidebar"
        tabindex="-1"
        data-open="${this.isOpen}"
        data-position="${this.position}"
        @focus=${() => this.open()}
      >
        <div>
          <button class="close" aria-label="close" @click=${() => this.close()}>
            ×
          </button>
        </div>
        <slot></slot>
      </div>
      <div
        aria-hidden="true"
        @click=${this.handleOverlayClick}
        data-sidenav-overlay="${this.isOpen}"
      ></div>
    `;
  }
}
// Register the new element with the browser.
const tag = "tea-overlaynav";
if (window.customElements.get(tag) === undefined) {
  window.customElements.define(tag, MyElement);
}
