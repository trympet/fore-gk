let dag = document.getElementsByClassName("dag")[0];
let dager = dag.children;

for (let i = 0; i < dager.length; i++) {
  let dagTall = parseInt(dager[i].innerHTML);
  if (dagTall === new Date().getDate()) {
    dager[i].classList.add("idag");
  }
  console.log(showPopUp.bind(this, dagTall));
  dager[i].addEventListener("click", showPopUp.bind(this, dagTall));
}

const dagerArray = [
  "Klubbmesterskap!",
  null,
  null,
  "Dag for damer",
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  "Lekedag for barn!",
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

function showPopUp(dag, e) {
  console.log(dag);
  document.getElementById("text").innerHTML = dagerArray[dag - 1] || "Ikke program denne dagen!";
}
