//@ts-check
import { ForeElement } from "./fore-element.js";

/**
 * Navbar element til bruk på alle undersider.
 * @public
 * @extends {ForeElement}
 */
export default class ForeNavigasjon extends ForeElement {

  /**
   * Array med undersider.
   * Objeketene kan spesifisere alias hvis de har flere paths som
   * burde indikeres som aktiv i navbaren.
   * @public
   */
  sider = [
    {
      navn: "Hjem",
      uri: "index.html",
      alias: /^\/$/
    },
    {
      navn: "Klubben",
      uri: "klubben.html",
    },
    {
      navn: "Arrangementer",
      uri: "arrangementer.html",
    },
    {
      navn: "Medlemskap",
      uri: "medlemskap.html",
    },
    {
      navn: "Nyheter",
      uri: "nyhetsarkiv.html",
      alias: "nyhet.html",
    },
    {
      navn: "Kontakt oss",
      uri: "kontakt_oss.html",
    },
  ];

  get _HTML() {
    return `
    <header class="nav-header">
      <a href='./index.html'>
        <img class="nav-header-img" src="./images/logo.svg" alt="Fore Golfklubb">
      </a>
    </header>
    <nav class="navbar">
      <ul id="nav-list">
      </ul>
      <div class="backdrop"></div>
    </nav>`;
  }

  get _backdrop() {
    return this.shadowRoot.querySelector(".backdrop");
  }

  /**
   * Sjekke om et element i this.sider er aktivt.
   * @param {string} path - pathen som skal testes
   * @param {string | RegExp} alias - alias til elementet
   * @returns {boolean}
   */
  erAktiv(path, alias = null) {
    const document = window.location.pathname.split("#")[0]; // kun URN, ikke URI
    const fragment = document.match(/(\w*[.]html\/?|\/)$/) // matcher kun siste del av URN
    return (
      (fragment || document).includes(path) ||
      (fragment[0] || document).match(alias) != null
    );
  }
  
  template;


  constructor() {
    super();
    this.template = document.createElement("div");
    this.template.classList.add("nav-wrapper")
    this.template.innerHTML = this._HTML;

    const navList = this.template.querySelector("#nav-list");
    this.sider.forEach(({ navn, uri, alias }) => {
      navList.innerHTML += `<li class="nav-item ${
        this.erAktiv(uri, alias) ? "active" : ""
      }">
        <a href="${uri}" class="nav-link">${navn}</a>
      </li>`;
    });
    const togglebutton = document.createElement("button");
    togglebutton.className = "ikon ikon-meny ikon-stort sidenav-button touch-knapp";
    this.shadowRoot.append(this.template, this.stiler)

    this._backdrop.addEventListener("click", this.onBackdropClick.bind(this))
    this.shadowRoot.querySelector("nav").append(togglebutton);
    this.shadowRoot
      .querySelector("button")
      .addEventListener("click", this.onNavToggle.bind(this));
      
    this.addAriaToIcons();
  }

  /**
   * Håndterer klikk på menyikonet i navbaren og oppdaterer visuell state.
   * @private
   * @returns {void}
   */
  onNavToggle() {
    // forhindrer animasjon når siden lastes inn
    this.template.querySelector("#nav-list").classList.add("touched")
    this.template.querySelector("#nav-list").classList.toggle("active")
  }

  /**
   * Håndterer klikk på backdrop mens sidemeny er åpen.
   * Oppdaterer visuell state.
   * @private
   * @returns {void}
   */
  onBackdropClick() {
    this.template.querySelector("#nav-list").classList.remove("active")
  }
}

customElements.define("fore-navigasjon", ForeNavigasjon);
