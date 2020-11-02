export class ForeElement extends HTMLElement {
  get stiler() {
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./css/style.css");
    return linkElem;
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
}