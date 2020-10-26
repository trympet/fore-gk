export default class ForeNavigasjon extends HTMLElement {
  SIDER = [
    {
      navn: "Hjem",
      uri: "index.html",
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

  HTML = 
`<header>
<img class="hero-img" src="assets/logo.svg" alt="Fore Golfklubb">
</header>
<nav>
<ul id="nav-list">
</ul>
<select id="nav-select">
</select>
</nav>`;


  isActive(path, alias = null) {
    return window.location.pathname
      .split("#")[0]
      .includes(path)
      || window.location.pathname
      .split("#")[0]
      .includes(alias);
  }

  constructor() {
    super();
    const template = document.createElement("div");
    template.innerHTML = this.HTML;



    const navList = template.querySelector("#nav-list");
    const navSelect = template.querySelector("#nav-select");
    this.SIDER.forEach(({navn, uri, alias}) => {
      navList.innerHTML += 
      `<li class="nav-item">
        <a href="${uri}" class="nav-link ${this.isActive(uri) ? "active" : ""}">${navn}</a>
      </li>`;
      navSelect.innerHTML +=
      `<option value="${uri}" ${this.isActive(uri, alias) ? "selected" : ""}>${navn}</option>
      `
    });

    const stiler = document.createElement("style");
    stiler.textContent = `
    .hero-img {
      max-width: 440px;
      margin: auto;
      display: block;
    }
    #nav-list, #nav-select {
      font-family: abel, 'open sans';
      font-size: 1rem;
    }
    #nav-select {
      display: block;
      user-select: none;
      cursor: pointer;
      background: var(--primary-color);
      width: 100%;
      padding: .55em .45em;
      border: none;
      font-size: 1.25rem;
      display: none;
    }
    .active {
      font-weight: bold;
    }
    #nav-list {
      display: flex;
      list-style: none;
      flex-direction: row;
      background: var(--primary-color);
      margin: 0;
      padding: .5rem 0;
      line-height: 1;
    }
    .nav-item {
      padding: 8px 16px;
      border-right: 1px solid rgb(0 0 0 / 50%);
    }
    .nav-item:last-of-type {
      border-right: 0;
    }
    .nav-item a {
      text-decoration: none;
      color: black;
    }
    .nav-item::after {
      content: '';
      position: absolute;
      background: red;
    }
    @media only screen and (max-width: 600px) {
      #nav-list {
        display: none;
      }
      #nav-select {
        display: block;
      }
    }
    @media only screen and (max-width: 460px) {
      header {
        display: none;
      }
    }
    `;
    template.appendChild(stiler);


    this.attachShadow({mode: 'open'})
      .appendChild(template.cloneNode(true));
    this.shadowRoot
      .querySelector("#nav-select")
      .addEventListener("change", this.onSelectonChange);

  }

  onSelectonChange(e) {
    window.location.pathname = e.target.value;
  }
}

customElements.define('fore-navigasjon', ForeNavigasjon);
