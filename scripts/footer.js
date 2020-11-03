import { ForeElement } from "./fore-element.js";

export default class ForeFooter extends ForeElement {
  _SPONSORS = [
    "circle-1.png",
    "logoipsum.png",
    "generic-company-abc.png",
    "hexa.png",
    "logoipsum-alt.png",
    "treva.png",
    "ntnu.png",
  ]
  SPONSOR_LOGO_PATH = "./images/sponsors/";
  HTML = `
<div class="fore-footer-wrapper">
  <div class="fore-footer-item">
    <div class="fore-footer-item-content">
      <a href='./index.html'><img src="./images/footer-logo.svg" alt="Fore Golfklubb"
        class="fore-footer-logo-img"></a>
    </div>
  </div>
  <div class="fore-footer-item">
    <header><h2 class="h4">Kontakt oss</h2></header>
    <div class="fore-footer-item-content">
      <div class="kontakt-oss-grid">
        <div class="kontakt-oss-epost">
          <h5><span class="ikon ikon-epost"></span>Epost</h5>
          <p>mail@foregk.no</p>
        </div>
        <div class="kontakt-oss-telefon">
          <h5><span class="ikon ikon-telefon"></span>Telefon</h5>
          <p>+47&nbsp;98765432</p>
        </div>
        <div class="kontakt-oss-adresse">
          <h5><span class="ikon ikon-telefon"></span>Adresse</h5>
          <p>Adresse&nbsp;10A&nbsp;<br>7040,&nbsp;Trondheim<br>Norway</p>
        </div>
      </div>
    </div>
  </div>
  <div class="fore-footer-item">
    <header><h2 class="h4">Laget av...</h2></header>
    <div class="fore-footer-item-content">
      <ul>
        <li>Trym Flogard</li>
        <li>Jørgen Johannesen</li>
        <li>Kaja Askeland Gabrielsen</li>
        <li>Emilie Sandberg Knudsen</li>
        <li>Karen Seim Midtlien</li>
      </ul>
    </div>
  </div>
</div>
<div class="fore-footer-sponsors">
  <h2 class="fore-footer-sponsors-header h4">Sponsorer</h2>
  <div class="fore-footer-sponsors-images"></div>
</div>`

  get sponsors() {
    return this._SPONSORS.map(sponsor => {
      const path = this.SPONSOR_LOGO_PATH + sponsor;
      const image = document.createElement("img");
      image.setAttribute("src", path);
      image.setAttribute("alt", sponsor);
      return image;
    })
  }

  constructor() {
    super();
    const template = document.createElement("footer");
    template.classList.add("fore-footer");
    template.innerHTML = this.HTML;

    const sponsorContainer = template.querySelector(".fore-footer-sponsors-images");
    sponsorContainer.append(...this.sponsors);
    this.shadowRoot.append(this.stiler, template);
  }
}

customElements.define("fore-footer", ForeFooter);
