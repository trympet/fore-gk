// Override for å spesifisere NyhetArkivCard som argument til cctor til parent.
import { Init } from "./nyheter.js";
Init();

let sideIndeks = 0; // hvilken side vi er på nå
const forwardButton = document.getElementsByClassName("forover")[0];
const backwardButton = document.getElementsByClassName("bakover")[0];
const sideNummer = document.querySelector("#side-nummer");
const antallSiderElement = document.querySelector("#antall-sider");
const nyhetsElement = document.querySelector("fore-arkiv-nyheter");

forwardButton.addEventListener("click", blaForover);
backwardButton.addEventListener("click", blaBakover);

// Hent antall sider basert på antall nyhetsartikler som finnes.
const antallSider = async () => {
  const antallNyheter = await nyhetsElement.nyheterCount;
  const harRest = antallNyheter % nyhetsElement.antallNyheter > 0;
  return (
    Math.floor(antallNyheter / nyhetsElement.antallNyheter) + (harRest ? 1 : 0)
  );
};

// Bla til neste side
function blaForover() {
  sideIndeks += 1;
  const foreArkivNyheter = document.getElementsByTagName(
    "fore-arkiv-nyheter"
  )[0];
  foreArkivNyheter.attributes["start-nyheter"].value =
    sideIndeks * nyhetsElement.antallNyheter;
  setButtonState();
  setPaginatorState();
}

// bla til forrige side
function blaBakover() {
  sideIndeks -= 1;
  const foreArkivNyheter = document.getElementsByTagName(
    "fore-arkiv-nyheter"
  )[0];
  foreArkivNyheter.attributes["start-nyheter"].value = sideIndeks;
  setButtonState();
  setPaginatorState();
}

// Oppdatere knapper i paginator
async function setButtonState() {
  forwardButton.disabled = false;
  backwardButton.disabled = false;

  if (sideIndeks + 1 >= (await antallSider())) {
    forwardButton.disabled = true;
  } else if (sideIndeks <= 0) {
    backwardButton.disabled = true;
  }
}

// oppdaterer tekst i header/paginator
async function setPaginatorState() {
  sideNummer.textContent = sideIndeks + 1;
  antallSiderElement.textContent = await antallSider();
}

setPaginatorState();
setButtonState();
