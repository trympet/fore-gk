/** Modulær dialogboks som kan tilpasses ved å gi slottede elementer.
 * Dialogboksen består av en header, body og footer, hvor slottene henholdsvis heter
 * 'dialog-header', 'dialog-body' og 'dialog-footer'.
 *
 * State oppdateres med vis() eller lukk().
 *
 * åpne() og lukk() fyrer av eventene 'åpnet' og 'lukkes'.
 */
export class DialogBoks extends HTMLElement {
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
    return this.shadowRoot.querySelector("dialog")
  }

  /**
   * Lage en dialogboks
   * @param {String} overskrift - Overskriften til dialogboksen
   * @param {HTMLDivElement} bodyElement - HTMLElement med body-innholdet til dialogboksen
   * @param {{lukk:true, ok:false}} [alternativer] - lukk: om det skal vises lukk-knapp, ok: om det skal vises ok-knapp
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = this.templateHTML;
    this.shadowRoot.append(template.content);
  }

  /**
   * Kjøres hver gang elementet blir appendet til et element som er festet til dokumentet
   * Genererer dialogboksen og fester underelementer til DialogBoks-elementet
   */
  connectedCallback() {
    this.bakgrunn.addEventListener("click", () => this.skjul());

    const stiler = document.createElement("style");
    stiler.textContent = `
    h1, h2, h3, h4, h5 {
      display: inline;
    }
    .dialog-åpen {
      transform: scale(1)!important;
    }
    .dialogboks {
      transform: scale(0);
      transition: transform .5s;
      top: 5rem;
      left: 5rem;
      right: 5rem;
      position: fixed;
      pointer-events: auto!important;
      background-color: #fff;
      box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15);
      border: 0;
      border-radius: .125rem;
      min-width: 500px;
      width: auto;
      margin: 1.75rem auto;
      z-index: 2;
    }
    .dialogboks.loading .dialog-header, .dialogboks.loading .dialog-body, .dialogboks.loading .dialog-footer {
      visibility: hidden;
    }
    .dialogboks.loading .dialog-bakgrunn {
      /* Ikke dismiss før httprequest er ferdig */
      pointer-events: none;
    }
    .dialog-header {
      border-top-left-radius: .125rem;
      border-top-right-radius: .125rem;
      border-bottom: 1px solid #dee2e6;
      padding: 0 1rem;
    }
    .dialog-body {
      font-size: 1rem;
      position: relative;
      flex: 1 1 auto;
      padding: 1rem;
    }
    .dialog-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 1rem;
      border-top: 1px solid #dee2e6;
      border-bottom-right-radius: .3rem;
      border-bottom-left-radius: .3rem;
    }
    .dialog-footer button {
      cursor: pointer;
      background-color: #a6c!important;
      color: #fff;
      box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);
      padding: .84rem 2.14rem;
      font-size: .81rem;
      margin: .375rem;
      border: 0;
      border-radius: .125rem;
      text-transform: uppercase;
      white-space: normal;
      word-wrap: break-word;
    }
    .dialog-bakgrunn {
      opacity: 0;
      cursor: pointer;
      transition: opacity .5s;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #000;
      z-index: 1;
      visibility: hidden;
    }
    .dialog-skjult {
      opacity: .5;
      visibility: visible!important;
    }
    .dialog-loader-spinner {
      stroke: var(--primary-color);
      transform-origin: center;
      /* Halvsirkel */
      stroke-dasharray: 999;
      stroke-dashoffset: 890;
  }
  
  
  .dialog-loader {
      display: flex;
      justify-content: center;
      align-items: center;
      visibility: hidden;
    }
    .dialog-loader-sirkel {
      stroke-dasharray: 216; /* ORIGINALLY 166px */
      stroke-dashoffset: 216; /* ORIGINALLY 166px */
      stroke-width: 2;
      stroke-miterlimit: 10;
      stroke: var(--primary-color);
      fill: none;
    }
    
    .dialog-loader-checkmark {
      width: 106px; /* ORIGINALLY 56px */
      height: 106px; /* ORIGINALLY 56px */
      border-radius: 50%;
      display: block;
      stroke-width: 2;
      stroke: #fff;
      stroke-miterlimit: 10;
      box-shadow: inset 0px 0px 0px var(--primary-color);
    }
    .dialogboks.completed .dialog-loader {
        visibility: visible;
      }
      .dialogboks.completed .dialog-loader-checkmark {
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;    
      }
    .dialogboks.completed .dialog-loader-hake {
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }
    .dialogboks.completed .dialog-loader-sirkel {
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    .dialogboks.completed .dialog-loader-spinner {
        visibility: hidden;
    }
    .dialogboks.loading .dialog-loader  {
        visibility: visible;
    }
    
    .dialogboks.loading .dialog-loader-spinner {
        /* ikke animer før animasjonen er synlig */
      animation: rotate 1s cubic-bezier(0.08, 0.4, 0.92, 0.59) infinite;
    }
  
    .dialog-loader-hake {
      transform-origin: 50% 50%;
      stroke-dasharray: 98; /* ORIGINALLY 48px */
      stroke-dashoffset: 98; /* ORIGINALLY 48px*/
    }
  
    @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    
    @keyframes stroke {
      100% {
        stroke-dashoffset: 0;
      }
    }
    @keyframes scale {
      0%, 100% {
        transform: none;
      }
      50% {
        transform: scale3d(1.1, 1.1, 1);
      }
    }
    @keyframes fill {
      100% {
        box-shadow: inset 0px 0px 0px 80px var(--primary-color);
      }
    }
    `;
    this.shadowRoot.appendChild(stiler);
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
    this.dialogBoks.classList.add("loading");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) {
        return;
      }
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
customElements.define("app-dialogboks", DialogBoks); // definerer DialogBoks-elementet
