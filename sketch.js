let myTable;
let anni = [2005, 2006, 2007, 2008, 2009, 2010];
let hover = null; // se il mouse non è su nessun pallino non legge nessun nome

async function setup() {
  createCanvas(windowWidth, windowHeight);
  // carico il dataset
  textFont("Helvetica");
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
  hover = null;

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
      yCentro = height * 0.25; // MA gli anni dispari della lista stanno sopra
    }

    // stelo
    stroke(255, 255, 255);
    strokeWeight(1);
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
        let testo = myTable.getString(r, 3); // leggo la cella come testo
        let visitatori = Number(testo); // la trasformo in numero

        let angolo = map(n, 0, totale, 0, TWO_PI);
        let d = distanza(visitatori) * raggioMax;

        if (tipo === "Museo") {
          fill(80, 170, 255); 
        } else if (tipo === "Istituto Culturale") {
          fill(230, 110, 180);
        } else {
          fill(120, 210, 110);
        }

        // salvo la posizione del pallino
        let px = x + cos(angolo) * d;
        let py = yCentro + sin(angolo) * d;

        // la dimensione del pallino non è fissa, ma dipende dal numero di visitatori annuali
        let dimBase = map(sqrt(visitatori), 0, sqrt(822174), 4, 20);
        let dimensione = dimBase;

        // se il mouse è vicino al pallino, lo ingrandisco e ricordo i suoi dati
        if (dist(mouseX, mouseY, px, py) < max(dimBase / 2, 6)) {
          dimensione = dimBase + 6;
          hover = {
            nome: myTable.getString(r, 2),
            visitatori: visitatori,
            x: px,
            y: py,
          };
        }

        noStroke();
        ellipse(px, py, dimensione, dimensione); // usa px, py e dimensione
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

  if (hover !== null) {
  drawTooltip();
  }

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

// legenda e titolo
function drawLegenda() {
  noStroke();
  fill(255);

  // titolo
  textSize(22);
  text("Visitatori dei musei milanesi tra il 2005 e il 2010", 40, 40, 170); // 170 indica la larghezza, così va a capo da solo

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

  text("Distanza dal centro e dimensione = n. visitatori", legx, legy + 126, 170);
  text("1° cerchio: 500", legx, legy + 168);
  text("2° cerchio: 100.000", legx, legy + 186);
  text("3° cerchio: 500.000", legx, legy + 204);
  text("La posizione attorno al centro non ha significato.", legx, legy + 226, 170);
}

function drawTooltip() {
  let riga1 = hover.nome;
  let riga2 = hover.visitatori.toLocaleString("it-IT") + " visitatori";

  textSize(13);
  let w = max(textWidth(riga1), textWidth(riga2)) + 20;
  let h = 50;

  // di base il riquadro sta a destra e sotto il pallino
  let bx = hover.x + 14;
  let by = hover.y + 14;
  // ma se esce dallo schermo si sposta a sinistra o sopra
  if (bx + w > width) {
    bx = hover.x - w - 14;
  }
  if (by + h > height) {
    by = hover.y - h - 14;
  }

  fill(20);
  stroke(255);
  strokeWeight(0.5);
  rect(bx, by, w, h, 4);

  noStroke();
  fill(255);
  text(riga1, bx + 10, by + 20);
  text(riga2, bx + 10, by + 38);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
