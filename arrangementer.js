let dag = document.getElementsByClassName("dag")[0];
let dager = dag.children;

for (let i=0; i<dager.length;i++){
    let dagTall = parseInt(dager[i].innerHTML);
    if (dagTall === new Date().getDate()){
        dager[i].classList.add("idag");
    }
    dager[i].addEventListener("click", showPopUp.bind(this, dagTall, dager[i]));
    
}


const dagerArray = ['Klubbmesterskap! Første start går kl 10.00. Oppmøte på banen bak klubbhuset kl. 09.00.','Ikke program denne dagen!','Barnas dag','Dag for damer','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Åpen bane, gratis for alle','Ikke program denne dagen!','Lekedag for barn!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Avslutningsfest!','Ikke program denne dagen!','Ikke program denne dagen!'];

function showPopUp(dag, element, e) {
    document.getElementById("text").innerHTML = dagerArray[dag - 1];
    let aktiv = document.getElementsByClassName("aktivDag");
    for (let i=0;i<aktiv.length;i++){
        let el = aktiv[i];
        el.classList.remove("aktivDag");
    }
    element.classList.add("aktivDag");
}

