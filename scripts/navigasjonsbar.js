import { ForeElement } from "./fore-element.js";

export default class ForeNavigasjon extends ForeElement {
  SIDER = [
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

  HTML = `
  <header class="nav-header">
    <a href='./index.html'>
      <img class="nav-header-img" src="./images/logo.svg" alt="Fore Golfklubb">
    <a>
  </header>
  <nav class="navbar">
    <ul id="nav-list">
    </ul>
    <div class="backdrop"></div>
  </nav>`;

  get backdrop() {
    return this.shadowRoot.querySelector(".backdrop");
  }

  isActive(path, alias = null) {
    return (
      window.location.pathname.split("#")[0].includes(path) ||
      window.location.pathname.split("#")[0].match(alias) != null
    );
  }
  
  template;


  constructor() {
    super();
    this.template = document.createElement("div");
    this.template.innerHTML = this.HTML;

    const navList = this.template.querySelector("#nav-list");
    this.SIDER.forEach(({ navn, uri, alias }) => {
      navList.innerHTML += `<li class="nav-item ${
        this.isActive(uri, alias) ? "active" : ""
      }">
        <a href="${uri}" class="nav-link">${navn}</a>
      </li>`;
    });
    const togglebutton = document.createElement("button");
    togglebutton.className = "ikon ikon-meny ikon-stort sidenav-button touch-knapp";
    this.shadowRoot.append(this.template, this.stiler)

    this.backdrop.addEventListener("click", this.onBackdropClick.bind(this))
    this.shadowRoot.querySelector("nav").append(togglebutton);
    this.shadowRoot
      .querySelector("button")
      .addEventListener("click", this.onNavToggle.bind(this));
      
    this.addAriaToIcons();
  }

  onSelectonChange(e) {
    window.location.pathname = e.target.value;
  }

  onNavToggle(e) {
    // forhindrer animasjon når siden lastes inn
    this.template.querySelector("#nav-list").classList.add("touched")
    this.template.querySelector("#nav-list").classList.toggle("active")
  }

  onBackdropClick(e) {
    this.template.querySelector("#nav-list").classList.remove("active")
  }
}

customElements.define("fore-navigasjon", ForeNavigasjon);
