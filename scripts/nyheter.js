//@ts-check
/**
 * HTMLElement for én nyhetsartikkel. Inneholder egne stiler.
 * @extends HTMLElement
 */
class NyhetCard extends HTMLElement {
  _nyhet; // Tildelt i cctor
  truncateTegn = null;

  get _dato() {
    return new Date(this._nyhet.dato);
  }

  get _stiler() {
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "./css/nyhet.css");
    return link;
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
<a href="./nyhet.html#${this._nyhet.tittel}">
  <div class="card card-link">
    <div class="card-image" style="background-image: url(${this._nyhet.bilde})">
    </div>
    <div class="card-primary">
      <h2 class="card-title">${this._nyhet.tittel}</h2>
      <h3 class="card-subtitle">${this._nyhet.forfatter}</h3>
    </div>
    <div class="card-body">${this._tekst}</div>
  </div>
</a>`;
  }

  /**
   * @param {object} nyhet - nyhetsobjekt fra API
   */
  constructor(nyhet) {
    super();
    this._nyhet = nyhet;
    this.attachShadow({ mode: "open" });
    this.classList.add("fore-nyhet", "card", "card-link");
  }

  /**
   * Callback som kalles av HTMLElement-klassen. Initialiseringslogikken gjøres her istedenfor cctor.
   * Les mer: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
   */
  async connectedCallback() {
    // Nyhet kan også spesifiseres i dataset
    if (!this._nyhet && this.dataset.nyhet) {
      this._nyhet = await NyhetCard.getNyhetFraNavn(this.dataset.nyhet);
    }
    this.shadowRoot.innerHTML = this._HTML;
    this.shadowRoot.append(this._stiler);
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
  get _stiler() {
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./css/nyhetsarkiv.css");
    return linkElem;
  }

  // Override HTML fra NyhetCard
  get _HTML() {
    return `
<a href="/nyhet.html#${this._nyhet.tittel}" class="tekstlink">
<div class="boks">
  <div class="boksetekst">
    <div class="boksetekst-wrapper">
    <h2>${this._nyhet.tittel}</h2>
    <h3>Dato publisert: ${this._dato.toLocaleDateString()}</h3>
    <p>${this._tekst}</p>
  </div>
  </div>
  <div class="boksebilde">
    <img src="${this._nyhet.bilde}">
  </div>
</div>
</a>`;
  }

  constructor(nyhet) {
    super(nyhet);
  }
}
customElements.define("fore-arkiv-nyhet", NyhetArkivCard, {
  extends: "article",
});

/**
 * Element som lager og viser flere nyheter
 * @extends HTMLElement
 */
class NyhetCardCollectionElement extends HTMLElement {
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

  get _stiler() {
    const style = document.createElement("style");
    style.append(`
      fore-nyheter {
        display: grid;
        align-items: center;
        grid-template-columns: repeat(auto-fit, minmax(240px, 344px));
        gap: 2rem;
      }
      `);
    return style;
  }

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

    this.attachShadow({ mode: "open" });
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
    this.shadowRoot.append(this._stiler);
    const nyheter = await this._getNyheter();
    nyheter.forEach((nyhet) => {
      this.shadowRoot.append(new this._template(nyhet));
    });
  }
}
customElements.define("fore-nyheter", NyhetCardCollectionElement);
