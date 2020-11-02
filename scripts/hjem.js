import "./common.js";
import { NyhetBoks, NyhetBoksCollectionElement, Init } from "./nyheter.js";

Init();

class ForeHjemNyhetCard extends NyhetBoks {
  truncateTegn = 221;
}
customElements.define("fore-hjem-nyhet", ForeHjemNyhetCard, { extends: "article" });

class ForeHjemNyheterCollection extends NyhetBoksCollectionElement {
  constructor() {
    super(ForeHjemNyhetCard);
  }
}
customElements.define("fore-hjem-nyheter", ForeHjemNyheterCollection);
