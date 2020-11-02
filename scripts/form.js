const visPopup = () => {

}

/** Dialogboks interface som tilbyr metoder tilknyttet dialogboksen for å manipulere dialogboksens utseende på dokumentet */
export class DialogBoks extends HTMLElement {
  /**
   * Lage en dialogboks
   * @param {String} overskrift - Overskriften til dialogboksen
   * @param {HTMLDivElement} bodyElement - HTMLElement med body-innholdet til dialogboksen
   * @param {{lukk:true, ok:false}} [alternativer] - lukk: om det skal vises lukk-knapp, ok: om det skal vises ok-knapp
   */
  constructor(
    overskrift,
    bodyElement,
    { lukk = true, ok = false } = { lukk: true, ok: false }
  ) {
    super(); // etablerer prototypekjeden

    this.innerHTML = ''; // hvis elementet kalles inline skjer ingenting
    this.overskrift = document.createElement('h5');
    this.overskrift.textContent = overskrift;
    this.body = bodyElement; // bodyen til dialogboksen
    this.lukk = lukk;
    this.ok = ok;
    this.wrapper = document.createElement('div'); // wrapper for innholdet i dialogboksen
    this.wrapper.style.transform = 'scale(0)'; // skjuler dialogboksen
    this.wrapper.className = 'dialogboks';
    this.bakgrunn = document.createElement('div'); // bakgrunn som skjuler innholdet bak dialogboksen
    this.bakgrunn.className = 'bakgrunn';

    this.header = document.createElement('div'); // header
    this.header.className = 'header';
    this.header.appendChild(this.overskrift);
    this.body.classList.add('body');
  }
  /**
   * Kjøres hver gang elementet blir appendet til et element som er festet til dokumentet
   * Genererer dialogboksen og fester underelementer til DialogBoks-elementet
   */
  connectedCallback() {
    // fester alle elementer til et shadowroot-dokument for å unngå css-konflikter
    const shadowRoot = this.attachShadow({ mode: 'open' });

    const footer = document.createElement('div');
    footer.className = 'footer';

    // lukk-knapp i footer
    if (this.lukk) {
      const lukkKnapp = document.createElement('button');
      lukkKnapp.addEventListener('click', this.skjul.bind(this));
      lukkKnapp.innerText = 'Lukk';
      footer.appendChild(lukkKnapp);
      this.bakgrunn.addEventListener('click', event => {
        // lukker dialogboks når man klikker på bakgrunn
        if (event.currentTarget === this.bakgrunn) {
          this.skjul();
        }
      });
    }

    // ok-knapp i footer
    if (this.ok) {
      const okKnapp = document.createElement('button');
      okKnapp.addEventListener('click', this.skjul.bind(this));
      okKnapp.addEventListener('click', () =>
        this.dispatchEvent(new CustomEvent('ok'))
      ); // ok-eventlistener når lukkes
      okKnapp.innerText = 'Ok';
      footer.appendChild(okKnapp);
    }

    this.wrapper.appendChild(this.header);
    this.wrapper.appendChild(this.body);
    this.wrapper.appendChild(footer);
    shadowRoot.appendChild(this.wrapper);
    shadowRoot.appendChild(this.bakgrunn);

    const stiler = document.createElement('style');
    stiler.textContent = `
    h1, h2, h3, h4, h5 {
      display: inline;
    }
    .åpne {
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
    .header {
      border-top-left-radius: .125rem;
      border-top-right-radius: .125rem;
      border-bottom: 1px solid #dee2e6;
      padding: 1rem;
    }
    .header h5 {
      line-height: 1.5;
      font-size: 1.8rem;
    }
    .body {
      font-size: 1rem;
      position: relative;
      flex: 1 1 auto;
      padding: 1rem;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 1rem;
      border-top: 1px solid #dee2e6;
      border-bottom-right-radius: .3rem;
      border-bottom-left-radius: .3rem;
    }
    .footer button {
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
    .bakgrunn {
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
    .skjult {
      opacity: .5;
      visibility: visible!important;
    }
    `;
    shadowRoot.appendChild(stiler);
  }
  /** Åpner dialogboksen */
  vis() {
    setTimeout(() => this.wrapper.classList.add('åpne'),6) // kan kun animeres etter det har gått minst 1 frame
    this.bakgrunn.classList.add('skjult');
    this.dispatchEvent(new CustomEvent('åpnet')); // sender event når dialogboksen åpnes
  }
  /** Lukker dialogboksen */
  skjul() {
    this.wrapper.classList.remove('åpne');
    this.bakgrunn.classList.remove('skjult');
    this.dispatchEvent(new CustomEvent('lukket')); // sender event når dialogboksen lukkes
  }
}
customElements.define('app-dialogboks', DialogBoks); // definerer DialogBoks-elementet