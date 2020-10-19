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
</nav>`;


  isActive(path) {
    return window.location.pathname.includes(path) ? "active" : "";
  }

  constructor() {
    super();
    const template = document.createElement("div");
    template.innerHTML = this.HTML;



    const navList = template.querySelector("#nav-list");
    this.SIDER.forEach(({navn, uri}) => {
      navList.innerHTML += 
      `<li class="nav-item">
        <a href="${uri}" class="nav-link ${this.isActive(uri)}">${navn}</a>
      </li>`;
    });

    const stiler = document.createElement("style");
    stiler.textContent = `
    .hero-img {
      max-width: 440px;
      margin: auto;
      display: block;
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
    `;
    template.appendChild(stiler);

    this.attachShadow({mode: 'open'})
      .appendChild(template.cloneNode(true));
}
}

customElements.define('fore-navigasjon', ForeNavigasjon);
