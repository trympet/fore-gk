//@ts-check

class ForeElement extends HTMLElement {
  get stiler() {
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./css/style.css");
    return linkElem;
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
}

/**
 * HTMLElement for én nyhetsartikkel. Inneholder egne stiler.
 * @extends ForeElement
 */
class NyhetCard extends ForeElement {
  _nyhet; // Tildelt i cctor
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
      tekst = tekst.replace(/^\s+|\s+$/g, ''); // fjerne newline fra slutten av tekst
    }
    return tekst;
  }
 
  get _HTML() {
    return `
<a href="./nyhet.html#${this._nyhet.tittel}" class="boks-link">
  <div class="boks boks-link boks-vertikal">
    <div class="boksebilde" style="background-image: url(${this._nyhet.bilde})">
    </div>
    <div class="boksetekst">
      <h2 class="boks-overskrift">${this._nyhet.tittel}</h2>
      <h3 class="boks-underoverskrift">${this._nyhet.forfatter}</h3>
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
    this.classList.add("fore-nyhet", "boks", "boks-link");
  }

  /**
   * Callback som kalles av HTMLElement-klassen. Initialiseringslogikken gjøres her istedenfor cctor.
   * Les mer: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
   */
  async connectedCallback() {
    // Nyhet kan også spesifiseres i dataset
    this.shadowRoot.innerHTML = this._HTML;
    if (!this._nyhet && this.dataset.nyhet) {
      this._nyhet = await NyhetCard.getNyhetFraNavn(this.dataset.nyhet);
    }
    this.shadowRoot.append(this.stiler);
  }

  /**
   * Henter én nyhet fra API
   * @param {string} navn - Overskrift/navn til nyhetsartikkel.
   * @returns {Promise<object>} Returnerer nyhet som matcher. Hvis ikke nyhet finnes returneres Promise<undefined>
   * @static
   */
  static async getNyhetFraNavn(navn) {
    const req = await fetch("./api/nyheter.json");
    const res = await req.json();
    return res.find((nyhet) => nyhet.tittel === navn);
  }
}
customElements.define("fore-nyhet", NyhetCard, { extends: "article" });

/**
 * HTMLElement for nyhetseartikler i nyhetsarkiv
 * @extends NyhetCard
 */
class NyhetArkivCard extends NyhetCard {
  // Override stiler fra NyhetCard
  truncateTegn = 250;

  // Override HTML fra NyhetCard
  get _HTML() {
    return `
<a href="./nyhet.html#${this._nyhet.tittel}">
<div class="boks boks-horisontal">
  <div class="boksetekst">
    <h2 class="boks-overskrift">${this._nyhet.tittel}</h2>
    <h3 class="boks-underoverskrift">Dato publisert: ${this._dato.toLocaleDateString()}</h3>
    <p>${this._tekst}</p>
  </div>
  <div class="boksebilde">
    <img src="${this._nyhet.bilde}">
  </div>
</div>
</a>`;
  }

  constructor(nyhet) {
    super(nyhet);
    this.classList.add("fore-arkiv-nyhet")
    this.shadowRoot.append(this.stiler);
  }
}
customElements.define("fore-arkiv-nyhet", NyhetArkivCard, {
  extends: "article",
});

/**
 * Element som lager og viser flere nyheter
 * @extends ForeElement
 */
class NyhetCardCollectionElement extends ForeElement {
  antallNyheter = 4; // antall nyheter i collection
  startNyheter = 0; // startindeks på nyheter.

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

  constructor(template = NyhetCard) {
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
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
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
    console.log(name, oldValue, newValue);
  }

  /**
   * @private
   */
  async _getNyheter() {
    const req = await fetch("./api/nyheter.json");
    const nyheter = await req.json();
    this._nyheterLengde = nyheter.length;
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
  }
}
customElements.define("fore-nyheter", NyhetCardCollectionElement);
