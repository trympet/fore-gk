//@ts-check
class NyhetCard extends HTMLElement {

  nyhet;

  get Dato() {
    return new Date(this.nyhet.dato);
  }

  get Style() {
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./css/nyhet.css");
    return linkElem;
  }

  get Content() {
    return `
<a href="/nyhet.html#${this.nyhet.tittel}">
  <div class="card card-link">
    <div class="card-image" style="background-image: url(${this.nyhet.bilde})">
    </div>
    <div class="card-primary">
      <h2 class="card-title">${this.nyhet.tittel}</h2>
      <h3 class="card-subtitle">${this.nyhet.forfatter}</h3>
    </div>
    <div class="card-body">${this.nyhet.tekst}</div>
  </div>
</a>`;
  }

  constructor(nyhet) {
    super();
    this.attachShadow({ mode: "open" });
    this.classList.add("fore-nyhet", "card", "card-link");
    this.nyhet = nyhet;
  }

  async connectedCallback() {
    // Nyhet kan også spesifiseres i dataset
    if (!this.nyhet && this.dataset.nyhet) {
      this.nyhet = await NyhetCard.GetNyhetFraNavn(this.dataset.nyhet)
    }
    this.shadowRoot.innerHTML = this.Content;
    this.shadowRoot.append(this.Style);
  }

  static async GetNyhetFraNavn(navn) {
      const req = await fetch("./api/nyheter.json");
      const res = await req.json();
      return res.find(n => n.tittel === navn);
  }
}
customElements.define("fore-nyhet", NyhetCard, { extends: "article" });

class Nyhet extends NyhetCard {
  static async visNyhet() {

  }
}

class NyhetCardCollectionElement extends HTMLElement {
  antallNyheter;
  root;
  template;
  get Style() {
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

  constructor(antallNyheter = undefined, template = NyhetCard) {
    super();

    // Typereferanse til mal for nyhet.
    // Her kan man benytte sin egen template som tar nyhet i ctor
    if (this.children.length > 0 && this.children[0].constructor) {
      this.template = this.children[0].constructor;
    } else {
      this.template = template;
    }

    this.attachShadow({ mode: "open" });
    this.antallNyheter = parseInt(this.dataset.antall) || antallNyheter;

    this.shadowRoot.append(this.Style);

    this.visNyheter();
  }
  async nyheter() {
    const req = await fetch("./api/nyheter.json");
    const nyheter = await req.json();
    return nyheter.sort((a, b) => b.dato - a.dato).slice(0, this.antallNyheter);
  }

  async visNyheter() {
    const nyheter = await this.nyheter();
    nyheter.forEach((nyhet) => {
      this.shadowRoot.append(new NyhetCard(nyhet));
    });
  }
}
customElements.define("fore-nyheter", NyhetCardCollectionElement);

