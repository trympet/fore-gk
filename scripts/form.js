import { ForeElement } from "./fore-element.js";

/** Modulær dialogboks som kan tilpasses ved å gi slottede elementer.
 * Dialogboksen består av en header, body og footer, hvor slottene henholdsvis heter
 * 'dialog-header', 'dialog-body' og 'dialog-footer'.
 *
 * State oppdateres med vis() eller lukk().
 *
 * åpne() og lukk() fyrer av eventene 'åpnet' og 'lukkes'.
 */
export class DialogBoks extends ForeElement {
  
  /**
   * Innhold i template elementet.
   */
  get templateInnhold() {
    return `
    <!-- aria-atributter for å hjelpe synshemmede -->
      <div class="dialogboks" role="dialog" aria-labelledby="dialog-label" aria-modal="true">
        <header class="dialog-header">
          <slot name="dialog-header" id="dialog-label"></slot>
        </header>
        <div class="dialog-body">

          <div class="dialog-loader">
            <svg
              class="dialog-loader-checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52">
              <circle class="dialog-loader-spinner" cx="26" cy="26" r="25" fill="none" />
              <circle class="dialog-loader-sirkel" cx="26" cy="26" r="25" fill="none" />
              <path
                class="dialog-loader-hake"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>

          <slot name="dialog-body"></slot>
        </div>
        <div class="dialog-footer">
          <slot name="dialog-footer"></slot>
        </div>
      </div>
      <div class="backdrop"></div>
    `;
  }

  get _dialogBoks() {
    return this.shadowRoot.querySelector(".dialogboks");
  }

  get _bakgrunn() {
    return this.shadowRoot.querySelector(".backdrop");
  }

  /**
   * Lage en ny dialogboks
   */
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = this.templateInnhold;
    this.shadowRoot.append(this.stiler, template.content);
  }

  /**
   * Kjøres hver gang elementet blir appendet til et element som er festet til dokumentet
   * Genererer dialogboksen og fester underelementer til DialogBoks-elementet
   */
  connectedCallback() {
    this._bakgrunn.addEventListener("click", () => this.skjul());
    
    this.addAriaToIcons();
  }

  /** 
   * Åpner dialogboksen 
   * @returns {void}
   */
  vis() {
    setTimeout(() => this._dialogBoks.classList.add("dialog-åpen"), 6); // kan kun animeres etter det har gått minst 1 frame
    this._bakgrunn.classList.add("dialog-skjult");
    this.dispatchEvent(new CustomEvent("åpnet")); // sender event når dialogboksen åpnes
  }

  /** 
   * Lukker dialogboksen 
   * @returns {void}
   */
  skjul() {
    this._dialogBoks.classList.remove("dialog-åpen");
    this._bakgrunn.classList.remove("dialog-skjult");
    this.dispatchEvent(new CustomEvent("lukket")); // sender event når dialogboksen lukkes
  }

  /**
   * Lytter etter submit event fra et skjema og åpner dialogen når skjemaet submittes.
   * @param {HTMLFormElement} form - Formelementet som dialogen skal lytte til
   * @returns {void}
   */
  visDialogForForm(form) {
    // Initial state er loading for forms
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      this._dialogBoks.classList.add("loading");
      this.vis();
      
      // Fake submit. Dette ville vært post request i produksjon.
      setTimeout(() => {
        // Fake timeout for å simulere submit, noe som kan ta tid.
        this._dialogBoks.classList.add("completed");
        this._dialogBoks.classList.remove("loading");

        // Setter alle formelementer til disabled.
        for (const element of form.elements) {
          element.setAttribute("disabled", "true");
        }

      }, 2000);
    });
  }
}
customElements.define("fore-dialogboks", DialogBoks); // definerer DialogBoks-elementet
