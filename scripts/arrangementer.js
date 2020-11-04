// IIFE
(async () => {
  let dag = document.getElementsByClassName("dag")[0];
  let dager = dag.children;
  
  for (let i = 0; i < dager.length; i++) {
    let dagTall = parseInt(dager[i].innerHTML); // dag i måneden
    if (dagTall === new Date().getDate()) {
      dager[i].classList.add("idag"); // marker hvilken dag det er
    }
    dager[i].addEventListener("click", showPopUp.bind(this, dagTall));
  }
  
  // array med informasjon om hva som skjer de ulike dagene i måneden.
  const req = await fetch("./api/kalender.json");
  const dagerArray = await req.json()
  
  // viser melding når bruker klikker på dato
  function showPopUp(dag, e) {
    document.getElementById("text").innerHTML = dagerArray[dag - 1] || "Ikke program denne dagen! Banen er åpen som vanlig, sjekk våre åpningstider på hjem-siden.";
  }
})()
