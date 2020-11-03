
export class ForeElement extends HTMLElement {
  get stiler() {
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./css/style.css");
    return linkElem;
  }

  addAriaToIcons = () => {
    const ikoner = this.shadowRoot.querySelectorAll(".ikon");
    for (const ikon of ikoner) {
      const aria = getComputedStyle(ikon)
        .getPropertyValue("--aria");
      ikon.setAttribute("aria-label", aria);
    }
  };

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  

  
}