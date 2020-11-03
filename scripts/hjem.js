import "./common.js";
import { NyhetBoks, NyhetBoksCollectionElement, Init } from "./nyheter.js";

Init();

/**
 * Nyhet med antall tegn spesifisert.
 * Laget til forsiden.
 * @protected
 */
class ForeHjemNyhetCard extends NyhetBoks {
  /**
   * @override
   */
  truncateTegn = 221;
}
customElements.define("fore-hjem-nyhet", ForeHjemNyhetCard, { extends: "article" });

/**
 * Nyhetcollection med ForeHjemNyhetCard som elementer.
 */
class ForeHjemNyheterCollection extends NyhetBoksCollectionElement {
  constructor() {
    super(ForeHjemNyhetCard);
  }
}
customElements.define("fore-hjem-nyheter", ForeHjemNyheterCollection);


// Setter baneforhold basert på hvilken dag det er
const setBaneforhold = () => {
  const dag = new Date(Date.now())
    .getDay();
  const baneforholdElement = document.querySelector("#baneforhold");

  let forhold = "";
  switch (dag) {
    case 1:
    case 4:
      forhold = "Nyklipt i dag";
      break;
    case 0:
      forhold = "Nylig vannet";
      break;
    default:
      forhold = "Nylig klipt"
      break;
  }
  baneforholdElement.textContent = forhold;
}
setBaneforhold();
