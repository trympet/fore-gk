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

