//@ts-check
class NyhetCard extends HTMLElement {
  _nyhet;

  get dato() {
    return new Date(this._nyhet.dato);
  }

  get stiler() {
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./css/nyhet.css");
    return linkElem;
  }

  get HTML() {
    return `
<a href="/nyhet.html#${this._nyhet.tittel}">
  <div class="card card-link">
    <div class="card-image" style="background-image: url(${this._nyhet.bilde})">
    </div>
    <div class="card-primary">
      <h2 class="card-title">${this._nyhet.tittel}</h2>
      <h3 class="card-subtitle">${this._nyhet.forfatter}</h3>
    </div>
    <div class="card-body">${this._nyhet.tekst}</div>
  </div>
</a>`;
  }

  constructor(nyhet) {
    super();
    this.attachShadow({ mode: "open" });
    this.classList.add("fore-nyhet", "card", "card-link");
    this._nyhet = nyhet;
  }

  async connectedCallback() {
    // Nyhet kan også spesifiseres i dataset
    if (!this._nyhet && this.dataset.nyhet) {
      this._nyhet = await NyhetCard.GetNyhetFraNavn(this.dataset.nyhet);
    }
    this.shadowRoot.innerHTML = this.HTML;
    this.shadowRoot.append(this.stiler);
  }

  static async GetNyhetFraNavn(navn) {
    const req = await fetch("./api/nyheter.json");
    const res = await req.json();
    return res.find((n) => n.tittel === navn);
  }
}
customElements.define("fore-nyhet", NyhetCard, { extends: "article" });

class NyhetArkivCard extends NyhetCard {
  // override parent
  get stiler() {
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./css/nyhetsarkiv.css");
    return linkElem;
  }

  // override parent
  get HTML() {
    return `
<div class="boks">
  <div class="boksetekst">
    <div class="boksetekst-wrapper">
    <h2>${this._nyhet.tittel}</h2>
    <h3>Dato publisert: ${this.dato.toLocaleDateString()}</h3>
    <p>${this._nyhet.tekst}</p>
  </div>
  </div>
  <div class="boksebilde">
    <img src="${this._nyhet.bilde}">
  </div>
</div>`;
  }

  constructor(nyhet) {
    super(nyhet);
  }
}
customElements.define("fore-arkiv-nyhet", NyhetArkivCard, {
  extends: "article",
});

class NyhetCardCollectionElement extends HTMLElement {
  antallNyheter;
  _template;

  get stiler() {
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

  constructor(template = NyhetCard) {
    super();
    this._template = template;
    this.antallNyheter = parseInt(this.dataset.antall) || 4;
    
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    this.shadowRoot.append(this.stiler);
    this.visNyheter();
  }

  async getNyheter() {
    const req = await fetch("./api/nyheter.json");
    const nyheter = await req.json();
    return nyheter.sort((a, b) => b.dato - a.dato).slice(0, this.antallNyheter);
  }

  async visNyheter() {
    const nyheter = await this.getNyheter();
    nyheter.forEach((nyhet) => {
      this.shadowRoot.append(new this._template(nyhet));
    });
  }
}
customElements.define("fore-nyheter", NyhetCardCollectionElement);
