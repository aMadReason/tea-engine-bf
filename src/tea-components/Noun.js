// Import the LitElement base class and html helper function
import { LitElement, html, css } from "lit-element";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

// Extend the LitElement base class
class MyElement extends LitElement {
  // properties getter
  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      :host [data-open="false"] .controls {
        overflow: hidden;
        height: 0;
      }

      :host [data-open="true"] .controls {
        background: var(--tea-bg-2, white);
        z-index: 10;
      }

      :host .trigger {
        padding: 0 0.1rem 0;
        border: 0;
        background: var(--tea-txt-1, #333);
        color: var(--tea-bg-1, white);
        border: 2px solid transparent;
        border-radius: var(--tea-radius, 3px);
        transition: all var(--tea-transition);
      }

      :host .trigger:hover {
        cursor: pointer;
        background: var(--tea-color-2, #333);
      }

      :host .trigger:focus {
        outline-offset: 2px;
        border: 2px solid var(--tea-color-2, white);
      }
    `;
  }

  static get properties() {
    return {
      noun: { type: String, attribute: "data-noun", reflect: true },
      isOpen: { type: String, attribute: "data-open", reflect: true },
      content: { type: String, attribute: "data-content", reflext: true }
    };
  }

  constructor() {
    super();
    this.isOpen = "false";
    this.noun = "";
    this.content = "";
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

  close() {
    this.elements.map(i => i.setAttribute("tabindex", -1));
    this.trigger.focus();
    this.isOpen = "false";
    this.dispatch();
  }

  toggle() {
    this.isOpen = this.isOpen === "true" ? "false" : "true";
    this.dispatch();
  }

  firstUpdated() {
    this.ref = this.shadowRoot.querySelector("[data-open]");
    this.trigger = this.shadowRoot.querySelector(".trigger");
    this.controls = this.shadowRoot.querySelector("div.controls");
    this.elements = this.querySelectorAll(
      "a, input, button, textarea, [tabindex], [contenteditable='true']"
    );

    // tippy(this.trigger, {
    //   content: this.content
    //   //interactive: true
    // });

    // this.popper = new Popper(this.trigger, this.controls, {
    //   // popper options here
    // });
    // const closeRef = this.shadowRoot.querySelector(".close");
    // const focusables = this.querySelectorAll(
    //   "a, input, button, textarea, [tabindex], [contenteditable='true']"
    // );
    // this.elements = [closeRef, ...[].slice.call(focusables)];
  }

  connectedCallback() {
    super.connectedCallback();
    // this.trigger.addEventListener("click", e => this.toggle());
    // this.addEventListener("keyup", e => {
    //   if (e.key === "Tab") {
    //     const target = e.explicitOriginalTarget || e.target;
    //     const last = this.elements[this.elements.length - 1];
    //     const first = this.elements[0];
    //     const isLast = target === last && !e.shiftKey;
    //     const isFirst = target === first && e.shiftKey;
    //     if (isFirst || isLast) e.preventDefault();
    //     if (isLast || isFirst) this.trigger.focus();
    //   }
    // });
    // this.addEventListener("keydown", e => {
    //   if (e.key === "Tab") {
    //     const target = e.explicitOriginalTarget || e.target;
    //     const last = this.elements[this.elements.length - 1];
    //     const first = this.elements[0];
    //     const isLast = target === last && !e.shiftKey;
    //     const isFirst = target === first && e.shiftKey;

    //     if (isFirst || isLast) e.preventDefault();
    //     if (isLast) first.focus();
    //     if (isFirst) last.focus();
    //   }
    // });
  }

  render() {
    return html`
      <!-- template content -->
      <div data-open="${this.isOpen}">
        <button
          data-tippy-content="${this.content}"
          aria-pressed="${this.isOpen}"
          @click=${() => this.toggle()}
          class="trigger"
        >
          ${this.noun}
        </button>
      </div>
    `;
  }
}
// Register the new element with the browser.
const tag = "tea-noun";
if (window.customElements.get(tag) === undefined) {
  window.customElements.define(tag, MyElement);
}
