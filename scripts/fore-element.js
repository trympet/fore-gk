//@ts-check

/**
 * Abtrakt klasse for alle webcomponents på denne nettsiden.
 * @abstract
 * @extends {HTMLElement}
 * @public
 */
export class ForeElement extends HTMLElement {
  get stiler() {
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./css/style.css");
    return linkElem;
  }

  /**
   * Metode som må kalles hvis ikoner skal bli annotert med aria-atributter.
   * @protected
   */
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
