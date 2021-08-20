(function () {
  const KEYCODE = {
    SPACE: 32,
    ENTER: 13,
  };

  const template = document.createElement("template");

  template.innerHTML = `
    <style>
      :host {
        display: inline-block;
        border: 1px solid black;
        padding: 5px;
      }
      :host([pressed]) {
        background: lightgreen;
      }
      :host([disabled]) {
        background: lightgrey;
      }
    </style>
    <slot></slot>
  `;

  class ToggleButton extends HTMLElement {
    static get observedAttributes() {
      return ["pressed", "disabled"];
    }

    constructor() {
      super();

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      if (!this.hasAttribute("role")) {
        this.setAttribute("role", "button");
      }

      if (!this.hasAttribute("tabindex")) {
        this.setAttribute("tabindex", "0");
      }

      if (!this.hasAttribute("aria-pressed")) {
        this.setAttribute("aria-pressed", "false");
      }

      this.addEventListener("click", this._onClick);
      this.addEventListener("keydown", this._onKeyDown);
    }

    set pressed(value) {
      const isPressed = Boolean(value);

      if (isPressed) {
        this.setAttribute("pressed", "");
      } else {
        this.removeAttribute("pressed");
      }
    }

    get pressed() {
      return this.hasAttribute("pressed");
    }

    set disabled(value) {
      const isDisabled = Boolean(value);

      if (isDisabled) {
        this.setAttribute("disabled", "");
      } else {
        this.removeAttribute("disabled");
      }
    }

    get disabled() {
      return this.hasAttribute("disabled");
    }

    attributeChangedCallback(name, oldVal, newVal) {
      const hasValue = newVal !== null;
      this.setAttribute(`aria-${name}`, hasValue);
    }

    _togglePressed() {
      if (!this.disabled) {
        this.pressed = !this.pressed;
      }
    }

    _onClick() {
      this._togglePressed();
    }

    _onKeyDown(e) {
      if (e.altKey) return;

      switch (e.keyCode) {
        case KEYCODE.ENTER:
        case KEYCODE.SPACE:
          e.preventDefault();
          this._togglePressed();
          break;
        default:
          break;
      }
    }
  }

  window.customElements.define("toggle-button", ToggleButton);
})();
