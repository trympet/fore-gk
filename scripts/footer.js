export default class ForeFooter extends HTMLElement {
  _SPONSORS = [
    "circle-1.png",
    "logoipsum.png",
    "generic-company-abc.png",
    "hexa.png",
    "logoipsum-alt.png",
    "treva.png",
    "ntnu.png",
  ]
  SPONSOR_LOGO_PATH = "./assets/sponsors/";
  HTML = `
<div class="footer-wrapper">
  <div class="footer-item">
    <div class="footer-item-content">
      <a href='./index.html'><img src="./assets/footer-logo.svg" alt="Fore Golfklubb"
        class="footer-logo-img"></a>
    </div>
  </div>
  <div class="footer-item">
    <header><h4>Kontakt oss</h4></header>
    <div class="footer-item-content">
      <div class="kontakt-oss-grid">
        <div class="kontakt-oss-epost">
          <h5 class='footer_epost'>Epost</h5>
          <p>mail@foregk.no</p>
        </div>
        <div class="kontakt-oss-telefon">
          <h5 class='footer_telefon'>Telefon</h5>
          <p>+47&nbsp;98765432</p>
        </div>
        <div class="kontakt-oss-adresse">
          <h5 class='footer_adresse'>Adresse</h5>
          <p>Adresse&nbsp;10A&nbsp;<br>7040,&nbsp;Trondheim<br>Norway</p>
        </div>
      </div>
    </div>
  </div>
  <div class="footer-item">
    <header><h4>Laget av...</h4></header>
    <div class="footer-item-content">
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
<div class="footer-sponsors">
  <h4 class="footer-sponsors-header">Sponsorer</h4>
  <div class="footer-sponsors-images"></div>
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

  get styleLink() {
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', './css/footer.css');
    return linkElem;
  }

  constructor() {
    super();
    const template = document.createElement("footer");
    template.innerHTML = this.HTML;

    const sponsorContainer = template.querySelector(".footer-sponsors-images");
    sponsorContainer.append(...this.sponsors);


    
    // Attach the created element to the shadow dom

    this.attachShadow({ mode: "open" })
      .appendChild(template)
      .appendChild(this.styleLink);
  }
}

customElements.define("fore-footer", ForeFooter);
