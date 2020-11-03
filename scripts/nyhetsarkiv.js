// Override for å spesifisere NyhetArkivCard som argument til cctor til parent.
import { Init } from "./nyheter.js";
Init();
let sideIndeks = 0;
const forwardButton = document.getElementsByClassName("forover")[0];
const backwardButton = document.getElementsByClassName("bakover")[0];
const sideNummer = document.querySelector("#side-nummer");
const antallSiderElement = document.querySelector("#antall-sider");
const nyhetsElement = document.querySelector("fore-arkiv-nyheter");

forwardButton.addEventListener("click", blaForover);
backwardButton.addEventListener("click", blaBakover);

const antallSider = async () => {
  const antallNyheter = await nyhetsElement.nyheterCount;
  const harRest = antallNyheter % nyhetsElement.antallNyheter > 0;
  return Math.floor(antallNyheter / nyhetsElement.antallNyheter)
  + (harRest ? 1 : 0);
}

function blaForover() {
  sideIndeks += 1;
  const foreArkivNyheter = document.getElementsByTagName(
    "fore-arkiv-nyheter"
  )[0];
  foreArkivNyheter.attributes["start-nyheter"].value = sideIndeks * nyhetsElement.antallNyheter;
  setButtonState();
  setPaginatorState();
}

function blaBakover() {
  sideIndeks -= 1;
  const foreArkivNyheter = document.getElementsByTagName(
    "fore-arkiv-nyheter"
  )[0];
  foreArkivNyheter.attributes["start-nyheter"].value = sideIndeks;
  setButtonState();
  setPaginatorState();
}

async function setButtonState() {
  forwardButton.disabled = false;
  backwardButton.disabled = false;

  if (sideIndeks + 1 >= (await antallSider())) {
    forwardButton.disabled = true;
  } else if (sideIndeks <= 0) {
    backwardButton.disabled = true;
  }
}

async function setPaginatorState() {
  sideNummer.textContent = sideIndeks + 1;
  antallSiderElement.textContent = await antallSider();
}

setPaginatorState();
setButtonState();
