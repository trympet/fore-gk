import "./navigasjonsbar.js";
import "./footer.js";

export const addAriaToIcons = () => {
  const ikoner = document.querySelectorAll(".ikon");
  for (const ikon of ikoner) {
    const aria = getComputedStyle(ikon)
      .getPropertyValue("--aria");
    ikon.setAttribute("aria-label", aria.trim());
  }
};
addAriaToIcons();

// Mutationobserver brukes, da noe av innholdet er dynamisk generert;
const mutationObserver = new MutationObserver(addAriaToIcons);
mutationObserver.observe(document, {
  attributes: false,
  subtree: true,
  childList: true,
});

