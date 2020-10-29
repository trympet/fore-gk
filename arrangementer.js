let dag = document.getElementsByClassName("dag")[0];
let dager = dag.children;

for (let i=0; i<dager.length;i++){
    let dagTall = parseInt(dager[i].innerHTML);
    if (dagTall === new Date().getDate()){
        dager[i].classList.add("idag");
    }
    console.log(showPopUp.bind(this, dagTall))
    dager[i].addEventListener("click", showPopUp.bind(this, dagTall));
    
}


const dagerArray = ['Klubbmesterskap!','Ikke program denne dagen!','Ikke program denne dagen!','Dag for damer','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Lekedag for barn!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!','Ikke program denne dagen!'];

function showPopUp(dag, e) {
        console.log(dag);
        document.getElementById("text").innerHTML = dagerArray[dag - 1];
}

