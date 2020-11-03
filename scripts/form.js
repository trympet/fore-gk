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
  get templateHTML() {
    return `
      <div class="dialogboks">
        <div class="dialog-header">
          <slot name="dialog-header"></slot>
        </div>
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
      <div class="dialog-bakgrunn"></div>
    `;
  }

  get dialogBoks() {
    return this.shadowRoot.querySelector(".dialogboks");
  }

  get bakgrunn() {
    return this.shadowRoot.querySelector(".dialog-bakgrunn");
  }

  get loader() {
    return this.shadowRoot.querySelector("dialog");
  }

  /**
   * Lage en dialogboks
   * @param {String} overskrift - Overskriften til dialogboksen
   * @param {HTMLDivElement} bodyElement - HTMLElement med body-innholdet til dialogboksen
   * @param {{lukk:true, ok:false}} [alternativer] - lukk: om det skal vises lukk-knapp, ok: om det skal vises ok-knapp
   */
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = this.templateHTML;
    this.shadowRoot.append(this.stiler, template.content);
  }

  /**
   * Kjøres hver gang elementet blir appendet til et element som er festet til dokumentet
   * Genererer dialogboksen og fester underelementer til DialogBoks-elementet
   */
  connectedCallback() {
    this.bakgrunn.addEventListener("click", () => this.skjul());
    
    this.addAriaToIcons();
  }
  /** Åpner dialogboksen */
  vis() {
    setTimeout(() => this.dialogBoks.classList.add("dialog-åpen"), 6); // kan kun animeres etter det har gått minst 1 frame
    this.bakgrunn.classList.add("dialog-skjult");
    this.dispatchEvent(new CustomEvent("åpnet")); // sender event når dialogboksen åpnes
  }
  /** Lukker dialogboksen */
  skjul() {
    this.dialogBoks.classList.remove("dialog-åpen");
    this.bakgrunn.classList.remove("dialog-skjult");
    this.dispatchEvent(new CustomEvent("lukket")); // sender event når dialogboksen lukkes
  }

  visDialogForForm(form) {
    // Initial state er loading for forms
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) {
        return;
      }
      this.dialogBoks.classList.add("loading");
      this.vis();
      // Fake submit. Dette ville vært post request i produksjon.
      const loader = document.querySelector(".loader");
      setTimeout(() => {
        // Fake timeout for å simulere submit, noe som kan ta tid.
        this.dialogBoks.classList.add("completed");
        this.dialogBoks.classList.remove("loading");

        // Setter alle formelementer til disabled.
        for (const element of form.elements) {
          element.setAttribute("disabled", "true");
        }

        // Fjerne statusindikator etter 2s.
        // setTimeout(() => loader.classList.remove("completed"), 3000);
      }, 2000);
    });
  }
}
customElements.define("fore-dialogboks", DialogBoks); // definerer DialogBoks-elementet
