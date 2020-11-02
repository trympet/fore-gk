import "./common.js";
class ForeHjemNyhetCard extends NyhetCard {
  truncateTegn = 221;
}
customElements.define("fore-hjem-nyhet", ForeHjemNyhetCard, { extends: "article" });

class ForeHjemNyheterCollection extends NyhetCardCollectionElement {
  constructor() {
    super(ForeHjemNyhetCard);
  }
}
customElements.define("fore-hjem-nyheter", ForeHjemNyheterCollection);
