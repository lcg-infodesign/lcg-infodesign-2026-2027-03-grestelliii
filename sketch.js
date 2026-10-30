let myTable;
let anni = [2005, 2006, 2007, 2008, 2009, 2010];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  myTable = await loadTable("assets/data.csv", ",", "header");

  console.log("colonne:", myTable.columns);
  console.log("numero di righe:", myTable.getRowCount());
  console.log("prima riga:", myTable.getRow(0).obj);

  console.log("anni:", [...new Set(myTable.getColumn("ANNI"))]); // prende tutta la colonna degli anni
  console.log("tipologie:", [...new Set(myTable.getColumn("TIPOLOGIA"))]); // toglie i doppioni
  let visitatori = myTable.getColumn("VISITATORI").map(Number); // trasforma il testo dei numeri
  console.log("minimo:", Math.min(...visitatori), "massimo:", Math.max(...visitatori)); // ordinano i valori dal più piccolo al più grande
}

function draw() {

  background(44, 44, 44);

  push();

  stroke(255, 255, 255);
  strokeWeight(1);
  line(40, height / 2, width - 40, height / 2); // asse del tempo

  let raggioMax = height * 0.18; // raggio del glifo più grande, calcolato sull’altezza della finestra
  let raggi = [0.3, 0.6, 0.9]; // i tre cerchi divisi in: 500, 100.000 e 500.000 visitatori

  for (let i = 0; i < anni.length; i++) {
    let x = map(i, 0, anni.length - 1, 150, width - 150);

    let yCentro = height * 0.75; // di base il glifo sta sotto l'asse
    if (i % 2 === 1) {
      yCentro = height * 0.25; // MA gli anni dispari della lista stanno sopra
    }

    noStroke();
    fill(255, 255, 255);
    textSize(16);
    text(anni[i], x + 8, height / 2 - 8); // anno

    stroke(255, 255, 255);
    line(x, height / 2, x, yCentro); // stelo
    fill(255, 255, 255);
    ellipse(x, yCentro, 8, 8); // centro del glifo

    noFill();
    stroke(255);
    strokeWeight(0.5);
    // ripete ellipse tre volte, una per ogni numero di raggi
    for (let k = 0; k < raggi.length; k++) {
      ellipse(x, yCentro, raggioMax * raggi[k] * 2);
    }

    pop();
  }

}