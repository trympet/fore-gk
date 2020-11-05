import "./navigasjonsbar.js";
import "./footer.js";

/**
 * Legger til aria-atributt på alle ikoner.
 * Dette er viktig for synshemmede personer.
 * Alle ikoner må ha en --aria variablen for at dette skal funke.
 */
const addAriaToIcons = () => {
  const ikoner = document.querySelectorAll(".ikon");
  for (const ikon of ikoner) {
    const aria = getComputedStyle(ikon)
      .getPropertyValue("--aria"); // Variabel lagret i css
    ikon.setAttribute("aria-label", aria.trim());
  }
};
addAriaToIcons();

// Mutationobserver brukes, da noe av innholdet er dynamisk generert.
// Desverre kan man ikke akksessere noder i shadowroot, så denne gjelder
// bare for innhold utenfor shadowroot.
const mutationObserver = new MutationObserver(addAriaToIcons);
mutationObserver.observe(document, {
  attributes: false,
  subtree: true,
  childList: true,
});

const addMetadata = () => {
  document.head.innerHTML += `<!-- ios -->
  <link rel="apple-touch-icon" sizes="144x144" href="./favicon/apple-touch-icon.png">
  <!-- web -->
  <link rel="icon" type="image/png" sizes="32x32" href="./favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="./favicon/favicon-16x16.png">
  <!-- android -->
  <link rel="manifest" href="./favicon/site.webmanifest">
  <!-- for mac touchbar -->
  <link rel="mask-icon" href="./favicon/safari-pinned-tab.svg" color="#5bbad5">
  <meta name="theme-color" content="#ffffff">`;
}

addMetadata();

