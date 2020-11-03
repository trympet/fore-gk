//@ts-check

// Værmeldingen bruker Locationforecast 2.0 av Meteorologisk institutt.
// Dokumentasjon finnes her https://api.met.no/weatherapi/locationforecast/2.0/documentation
const endpoint =
  "https://api.met.no/weatherapi/locationforecast/2.0/compact.json?lat=59.933333&lon=10.716667";
const ikonPath = "./images/vaermelding";
const ikonFormat = "svg";

const imageContainer = document.querySelector(".værmelding-ikon");
const temperaturElement = document.querySelector(".værmelding-temperatur");

// Henter værmeldingen for dette øyeblikk
const hentVærmelding = async () => {
  const res = await (await fetch(endpoint)).json();
  const timeFrames = res?.properties?.timeseries;
  if (timeFrames) {
    const currentVærmelding = timeFrames[0];
    temperaturElement.textContent = getTemperatur(currentVærmelding);
    imageContainer["href"].baseVal = getIkonUri(currentVærmelding);
  }
};

// Henter ikonet som korresponderer med været.
const getIkonUri = (timeframe) => {
  const ikon = timeframe?.data["next_1_hours"]?.summary["symbol_code"];
  return `${ikonPath}/${ikon}.${ikonFormat}`;
};

// Henter temperatur
const getTemperatur = (timeframe) =>
  timeframe?.data?.instant?.details?.["air_temperature"] + "°C";

hentVærmelding();