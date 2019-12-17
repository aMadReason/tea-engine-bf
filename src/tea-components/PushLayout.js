// Import the LitElement base class and html helper function
import { LitElement, html, css } from "lit-element";

// Extend the LitElement base class
class MyElement extends LitElement {
  // properties getter
  static get styles() {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
        height: 100%;
      }

      :host .layout {
        display: flex;
        flex-flow: row nowrap;
        min-height: 100vh;
        height: 100%;
        align-items: stretch;
        overflow-y: hidden;
      }

      :host .layout > * {
        transition: width 0.5s ease; /* Only needed for ie11 */
        transition: width var(--tea-transition, 0.5s ease);
      }

      :host .layout [data-content-panel] {
        flex: 2 0;
        height: 100%;
        overflow-x: hidden;
      }

      :host .layout > [data-menu-panel] {
        position: relative;
        width: 0;
        height: 100%;
        background: var(--tea-bg-3);
        transition: width var(--tea-transition, 0.5s ease),
          box-shadow var(--tea-transition, 0.5s ease);
      }

      :host .layout[data-open="true"] > [data-menu-panel] {
        width: 100%; /* Only needed for ie11 */
        width: var(--tea-menu-open-width, 100%);
        border-left: var(--tea-border, 1px solid var(--tea-bg-1, grey));
        box-shadow: var(--tea-shadow, none);
      }

      :host .layout > [data-content-panel] > div,
      :host .layout > [data-menu-panel] > div {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
      }

      :host .layout > [data-content-panel] > div {
        min-width: 300px;
        overflow-x: hidden;
      }

      :host .layout .inner {
        min-width: 300px;
        height: 100%;
      }

      :host [data-menu-panel] button.close {
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

      :host [data-menu-panel] button.close:hover {
        cursor: pointer;
        background: var(--tea-bg-2, #000);
      }
      :host [data-menu-panel] button.close:focus {
        cursor: pointer;
        border: 2px solid var(--tea-txt-2, #000);
      }

      /* Medium devices (tablets, 768px and up) */
      @media screen and (min-width: 768px) and (orientation: landscape) {
        :host .layout {
          --tea-menu-open-width: 50%;
        }

        /* Only needed for ie11 */
        :host .layout[data-open="true"] > [data-menu-panel] {
          width: 50%;
          width: var(--tea-menu-open-width, 50%);
        }
      }

      /* Large devices (desktops, 992px and up) */
      @media screen and (min-width: 992px) and (orientation: landscape) {
        :host .layout {
          --tea-menu-open-width: 25%;
        }

        /* Only needed for ie11 */
        :host .layout[data-open="true"] > [data-menu-panel] {
          width: 25%;
          width: var(--tea-menu-open-width, 25%);
        }
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
      detail: { isOpen: this.isOpen }
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
    return this.isOpen === "true" ? this.close() : this.open();
  }

  firstUpdated() {
    //this.ref = this.shadowRoot.querySelector("[data-menu-panel]");
    this.ref = this.shadowRoot.querySelector("[data-menu-panel]");
    const closeRef = this.ref.querySelector(".close");
    const focusables = this.ref.querySelectorAll(
      "a, input, button, textarea, [tabindex], [contenteditable='true']"
    );
    this.elements = [closeRef, ...[].slice.call(focusables)];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <!-- template content -->
      <div class="layout" data-layout data-open="${this.isOpen}">
        <div data-content-panel>
          <div>
            <div class="inner">
              <slot></slot>
            </div>
          </div>
        </div>

        <div data-menu-panel role="menu" tabindex="-1">
          <div>
            <div class="inner">
              <div>
                <button class="close" aria-label="close" @click=${() => this.close()}>
                  ×
                </button>
              </div>
              <slot name="menu"></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
// Register the new element with the browser.
const tag = "tea-pushlayout";
if (window.customElements.get(tag) === undefined) {
  window.customElements.define(tag, MyElement);
}
