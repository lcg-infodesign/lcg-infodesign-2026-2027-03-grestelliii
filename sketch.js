let myTable;
let anni = [2005, 2006, 2007, 2008, 2009, 2010];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  // carico il dataset
  myTable = await loadTable("assets/data.csv", ",", "header");

  // varie prove per capire se il datsset è stato caricato correttamente
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

  // asse del tempo
  stroke(255, 255, 255);
  strokeWeight(1);
  line(40, height / 2, width - 40, height / 2);

  let raggioMax = height * 0.18; // raggio del glifo più grande, calcolato sull'altezza della finestra
  let raggi = [0.3, 0.6, 0.9];   // i tre cerchi: 500, 100.000 e 500.000 visitatori

  for (let i = 0; i < anni.length; i++) {
    let x = map(i, 0, anni.length - 1, 150, width - 150);

    let yCentro = height * 0.75; // di base il glifo sta sotto l'asse
    if (i % 2 === 1) {
      yCentro = height * 0.25;   // MA gli anni dispari della lista stanno sopra
    }

    // stelo
    stroke(255, 255, 255);
    strokeWeight(1); // NUOVO: riporta il tratto normale dopo i cerchi sottili
    line(x, height / 2, x, yCentro);

    // centro del glifo
    fill(255, 255, 255);
    ellipse(x, yCentro, 8, 8);

    // tre cerchi
    noFill();
    stroke(255);
    strokeWeight(0.5);
    for (let k = 0; k < raggi.length; k++) {
      ellipse(x, yCentro, raggioMax * raggi[k] * 2);
    }

    // quanti luoghi ci sono in quest'anno
    let totale = 0;
    for (let r = 0; r < myTable.getRowCount(); r++) {
      if (myTable.getNum(r, 0) === anni[i]) {
        totale++;
      }
    }

    // un pallino per ogni luogo di quest'anno
    let n = 0;
    for (let r = 0; r < myTable.getRowCount(); r++) {
      if (myTable.getNum(r, 0) === anni[i]) {
        let tipo = myTable.getString(r, 1);
        let testo = myTable.getString(r, 3); // NUOVO: leggo la cella come testo
        let visitatori = Number(testo);      // NUOVO: la trasformo in numero

        let angolo = map(n, 0, totale, 0, TWO_PI);
        let d = distanza(visitatori) * raggioMax;

        if (tipo === "Museo") {
          fill(80, 170, 255);
        } else if (tipo === "Istituto Culturale") {
          fill(230, 110, 180);
        } else {
          fill(120, 210, 110);
        }

        noStroke();
        ellipse(x + cos(angolo) * d, yCentro + sin(angolo) * d, 8, 8);
        n++;
      }
    }

    // anno
    noStroke();
    fill(255, 255, 255);
    textSize(16);
    text(anni[i], x + 8, height / 2 - 8);
  }

  drawLegenda();

}

// trasforma i visitatori in una distanza dal centro (da 0 a 1)
function distanza(i) {
  
  if (i <= 500) {
    return map(i, 0, 500, 0, 0.3); // fino al primo cerchio
    } else if (i <= 100000) {

    return map(i, 500, 100000, 0.3, 0.6); // tra il primo e il secondo
    } else if (i <= 500000) {

    return map(i, 100000, 500000, 0.6, 0.9); // tra il secondo e il terzo
    } else {

    return map(i, 500000, 822174, 0.9, 1); // oltre il terzo
    }
}

function drawLegenda() {
  noStroke();
  fill(255);

  // titolo
  textSize(22);
  text("Visitatori dei musei milanesi tra il 2005 e il 2010", 40, 40, 170); // 170 indica la larghezza, così va a capo da solo
  textFont("Helvetica");

  // legenda in basso a destra
  let legx = windowWidth - 190;
  let legy = windowHeight * 0.62;

  textSize(12);
  text("Ogni pallino indica un museo", legx, legy);
  text("Colore = tipologia", legx, legy + 28);

  fill(80, 170, 255);
  ellipse(legx + 5, legy + 50, 8, 8);
  fill(255);
  text("Museo", legx + 20, legy + 54);

  fill(120, 210, 110);
  ellipse(legx + 5, legy + 72, 8, 8);
  fill(255);
  text("Sede Espositiva", legx + 20, legy + 76);

  fill(230, 110, 180);
  ellipse(legx + 5, legy + 94, 8, 8);
  fill(255);
  text("Istituto Culturale", legx + 20, legy + 98);

  text("Distanza dal centro = n. visitatori", legx, legy + 126);
  text("1° cerchio: 500", legx, legy + 148);
  text("2° cerchio: 100.000", legx, legy + 166);
  text("3° cerchio: 500.000", legx, legy + 184);
  text("La posizione attorno al centro non ha significato.", legx, legy + 206, 180);
}