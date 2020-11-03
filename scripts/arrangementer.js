let dag = document.getElementsByClassName("dag")[0];
let dager = dag.children;

for (let i = 0; i < dager.length; i++) {
  let dagTall = parseInt(dager[i].innerHTML);
  if (dagTall === new Date().getDate()) {
    dager[i].classList.add("idag");
  }
  dager[i].addEventListener("click", showPopUp.bind(this, dagTall));
}

const dagerArray = [
  "Klubbmesterskap! Første start går kl 09.00, oppmøte på gressbanen bak klubbhuset kl 07.30.",
  "Damedag! Se informasjon lenger ned på siden.",
  "Senior herre formiddag. Se informasjon lenger ned på siden.",
  null,
  null,
  null,
  null,
  null,
  "Damedag! Se informasjon lenger ned på siden.",
  "Senior herre formiddag. Se informasjon lenger ned på siden.",
  "Åpen dag for alle nye golfere. Gratis påmelding.",
  null,
  null,
  null,
  null,
  "Damedag! Se informasjon lenger ned på siden.",
  "Senior herre formiddag. Se informasjon lenger ned på siden.",
  null,
  null,
  null,
  "Lekedag for barn! Vi deler oss inn i flere puljer, dere vil bli satt opp på en gruppe og få møtetidspunkt etter dere har meldt dere på.",
  null,
  "Damedag! Se informasjon lenger ned på siden.",
  "Senior herre formiddag. Se informasjon lenger ned på siden.",
  null,
  null,
  null,
  null,
  null,
  "Damedag! Se informasjon lenger ned på siden.",
  "Senior herre formiddag. Se informasjon lenger ned på siden.",
];

function showPopUp(dag, e) {
  document.getElementById("text").innerHTML = dagerArray[dag - 1] || "Ikke program denne dagen! Banen er åpen som vanlig, sjekk våre åpningstider på hjem-siden.";
}
