//@ts-check

import { ForeElement } from "./fore-element.js";

/**
 * HTMLElement for én nyhetsartikkel. Inneholder egne stiler.
 * @extends ForeElement
 * @public
 */
export class NyhetBoks extends ForeElement {
  _nyhet; // Tildelt i cctor

  /**
   * Avgjør tegngrensen som gjør når teksten i nyhetsartikkelen
   * slutter.
   * @public
   * @type {number}
   */
  truncateTegn = null;

  get _dato() {
    return new Date(this._nyhet.dato);
  }

  get _tekst() {
    let tekst = this._nyhet.tekst;
    if (!this.truncateTegn) {
      return tekst;
    }
    if (this.truncateTegn >= tekst.length) {
      return tekst;
    }
    if (this.truncateTegn) {
      tekst = tekst.slice(0, this.truncateTegn) + "...";
      tekst = tekst.replace(/^\s+|\s+$/g, ""); // fjerne newline fra slutten av tekst
    }
    return tekst;
  }

  get _HTML() {
    return `
<a href="./nyhet.html#${this._nyhet.tittel}">
  <div class="boks boks-link boks-vertikal">
    <!-- Bildet har ingen semantisk betydning. Bildet er derfor satt som bakgrunn -->
    <div class="boksebilde" style="background-image: url(${this._nyhet.bilde})">
    </div>
    <div class="boksetekst">
      <header>
        <h2 class="boks-overskrift">${this._nyhet.tittel}</h2>
        <h3 class="boks-underoverskrift">${this._nyhet.forfatter}</h3>
      </header>
      <p>${this._tekst}</p>
    </div>
  </div>
</a>`;
  }

  /**
   * @param {object} nyhet - nyhetsobjekt fra API
   */
  constructor(nyhet) {
    super();
    this._nyhet = nyhet;
    this.classList.add("fore-nyhet", "boks");
  }

  /**
   * Callback som kalles av HTMLElement-klassen. Initialiseringslogikken gjøres her istedenfor cctor.
   * Les mer: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
   */
  async connectedCallback() {
    // Nyhet kan også spesifiseres i dataset
    this.shadowRoot.innerHTML = this._HTML;
    if (!this._nyhet && this.dataset.nyhet) {
      this._nyhet = await NyhetBoks.getNyhetFraNavn(this.dataset.nyhet);
    }
    this.shadowRoot.append(this.stiler);
    
    this.addAriaToIcons();
  }

  /**
   * Henter én nyhet fra API
   * @param {string} navn - Overskrift/navn til nyhetsartikkel.
   * @returns {Promise<object>} Returnerer nyhet som matcher. Hvis ikke nyhet finnes returneres Promise<undefined>
   * @static
   * @public
   */
  static async getNyhetFraNavn(navn) {
    const req = await fetch("./api/nyheter.json");
    const res = await req.json();
    return res.find((nyhet) => nyhet.tittel === navn);
  }
}

/**
 * HTMLElement for nyhetseartikler i nyhetsarkiv
 * @extends NyhetBoks
 * @public
 */
export class NyhetArkivBoks extends NyhetBoks {
  // Override stiler fra NyhetBoks
  truncateTegn = 250;

  // Override HTML fra NyhetBoks
  get _HTML() {
    return `
<a href="./nyhet.html#${this._nyhet.tittel}">
<div class="boks boks-link boks-horisontal">
  <div class="boksetekst">
    <header>
      <h2 class="boks-overskrift">${this._nyhet.tittel}</h2>
      <h3 class="boks-underoverskrift">Dato publisert: <time datetime="${this._dato.toISOString()}" >${this._dato.toLocaleDateString()}</time></h3>
    </header>
    <p>${this._tekst}</p>
  </div>
  <div class="boksebilde nyhetsbilde">
    <img src="${this._nyhet.bilde}" alt="${this._nyhet.tittel}">
  </div>
</div>
</a>`;
  }

  /**
   * Lager et nytt nyhetselement
   * @param {object} nyhet - Nyhetsobjekt som skal presenteres i elementet
   */
  constructor(nyhet) {
    super(nyhet);
    this.classList.add("fore-arkiv-nyhet");
    this.shadowRoot.append(this.stiler);
  }
}

/**
 * Element som lager og viser flere nyheter
 * @extends ForeElement
 * @public
 */
export class NyhetBoksCollectionElement extends ForeElement {
  /**
   * Antall nyheter som skal vises.
   * @public
   */

  antallNyheter = 4;
  /**
   * Startindeks på nyheter fra ny til gammel.
   * @public
   */
  startNyheter = 0;

  _nyheterLengde = -1;
  _template;
  _isConnected = false;
  _nyheterCountTask = null;
  // Promise som fufiller når nyhetene har blitt lastet inn.
  // Her må vi bruke callbacks, da setTimeout eller setInterval ikke
  // kjører synkront :(
  _nyheterCount = async () => {
    return Promise.race([
      new Promise((resolve) => setTimeout(() => resolve(0), 7500)),
      new Promise((resolve) =>
        setInterval(() => {
          if (this._isConnected && this._nyheterLengde !== -1) {
            return resolve(this._nyheterLengde);
          }
        }, 100)
      ),
    ]);
  };

  /**
   * Antall nyheter som finnes i API. Her MÅ man bruke await!
   * @type {Promise<number>}
   */
  get nyheterCount() {
    // Kjører bare rutinen én gang per instanse.
    if (this._nyheterCountTask === null) {
      this._nyheterCountTask = this._nyheterCount();
    }
    return this._nyheterCountTask;
  }

  /**
   * Attributter som observeres og endrer innhold dynamisk.
   * Les mer: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
   * @returns {Array<string>}
   * @static
   */
  static get observedAttributes() {
    return ["start-nyheter", "antall-nyheter"];
  }

  /**
   * Lager nytt nyhetssamlingselement.
   * @param {typeof NyhetBoks} template - Typen nyhetselement som skal vises
   */
  constructor(template = NyhetBoks) {
    super();
    this._template = template;
  }

  /**
   * @override
   * @protected
   */
  async connectedCallback() {
    await this._visNyheter();
    this._isConnected = true; // flagg - forhindrer dobbel fetch
  }

  /**
   * Oppdaterer nyheter når atributter, spesifisert av observedAttributes,
   * endrer seg.
   * @override
   * @protected
   * @param {string} name - Navnet på atributten som er endret
   * @param {string} oldValue - Gammel verdi
   * @param {string} newValue - Ny verdi
   */
  async attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "start-nyheter":
        this.startNyheter = parseInt(newValue);
        break;
      case "antall-nyheter":
        this.antallNyheter = parseInt(newValue);
        break;
      default:
        break;
    }
    if (this._isConnected) {
      await this._visNyheter();
    }
  }

  /**
   * @private
   * @returns {Promise<object[]>} - Returnerer array med nyheter fra API
   */
  async _getNyheter() {
    const req = await fetch("./api/nyheter.json");
    const nyheter = await req.json();
    this._nyheterLengde = nyheter.length;
    console.log(this.startNyheter, this.startNyheter + this.antallNyheter);
    return nyheter
      .sort((a, b) => b.dato - a.dato)
      .slice(this.startNyheter, this.startNyheter + this.antallNyheter);
  }

  /**
   * @private
   */
  async _visNyheter() {
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.append(this.stiler);
    const nyheter = await this._getNyheter();
    nyheter.forEach((nyhet) => {
      this.shadowRoot.append(new this._template(nyhet));
    });

    this.addAriaToIcons();
  }
}

/**
 * Element som viser samling av nyheter. Beregnet for nyhetsarkiv.
 * @extends {NyhetBoksCollectionElement}
 */
export class ArkivCollection extends NyhetBoksCollectionElement {
  antallNyheter = 4;
  startNyheter = 0;
  constructor() {
    super(NyhetArkivBoks);
  }
}

/**
 * Legger til nyhetselementene i customElements
 * @public
 * @returns {void}
 */
export const Init = () => {
  customElements.define("fore-nyheter", NyhetBoksCollectionElement);
  customElements.define("fore-nyhet", NyhetBoks, { extends: "article" });
  customElements.define("fore-arkiv-nyhet", NyhetArkivBoks, {
    extends: "article",
  });
  customElements.define("fore-arkiv-nyheter", ArkivCollection);
};


