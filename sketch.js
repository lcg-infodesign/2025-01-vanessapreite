let table;
let filteredRows = [];

let col0Values = [];
let col1Values = [];
let col2Values = [];
let col3Values = [];
let col4Values = [];

let average0;
let average1;
let std1;
let mode2;
let median3;
let average4;
let std4;

function preload () {
  table = loadTable ("dataset.csv", "csv", "header");
}

//FUNZIONI DI CALCOLO
function calcAvg (arr) {
  if (arr.length === 0) return 0;
  let sum = 0;
  for (let i = 0;i < arr.length; i++) {
    sum += arr[i]; 
  }
  return sum / arr.length; 
} 


//FUNZIONE PER LA DEVIAZIONE STANDARD
function calcStD (arr) {
  if (arr.length === 0) return 0;
  let average = calcAvg(arr);
  let sommaQuad = 0;
  for (let i = 0; i < arr.length; i++) {
    sommaQuad += (arr[i] - average) ** 2;
  }
  let variation = sommaQuad/arr.length;
  return Math.sqrt(variation);
}

//FUNZIONE PER LA MODA
function calcMode(arr) {
  if (arr.length === 0) return null;
  let counts = {}; //quante volte un numero compare
  let maxCount = 0;
  let mode = [];

  //conta le occorrenze di ogni valore
  for (let i = 0; i < arr.length; i++) {
    let val = arr[i];
    counts[val] = (counts[val] || 0) + 1;
  if (counts[val] > maxCount) {
      maxCount = counts[val];
    }
  }

  //la moda possono essere tanti numeri, di seguito il ciclo per trpovarli
  for(let key in counts) {
    if (counts[key] === maxCount) {
      mode.push (key);
    }
  }
  
  //se c'è una sola moda restitusce solo un valore, se ce ne sono di più ne restituisce un array di valori
  if (mode.length === 1) return mode[0];
  return mode;
}

//FUNZIONE PER LA MEDIANA
 function calcMedian(arr) {
  if (arr.length === 0) return 0;
  let sorted = arr.slice().sort((a,b) => a-b); //ordina senza modificare array originale
  let middle = Math.floor (sorted.length/2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle])/2;
  }
  else {
    return sorted[middle];
  }
}


function drawAverageCol0() {
  // dimensioni ridotte
  let gWidth = 700;
  let gHeight = 200;

  let g = createGraphics(gWidth, gHeight);
  g.background(255, 255, 255, 0);

  // margini interni
  let topMargin = 20;
  let bottomMargin = 50;
  let leftMargin = 40;
  let rightMargin = 40;

  let chartWidth = gWidth - leftMargin - rightMargin;
  let chartHeight = gHeight - topMargin - bottomMargin;
  let barWidth = chartWidth / col0Values.length;

  let maxVal = Math.max(...col0Values);

  // base delle barre
  let zeroY = gHeight - bottomMargin;

  // disegna le barre
  for (let i = 0; i < col0Values.length; i++) {
    let val = col0Values[i];
    let h = map(val, 0, maxVal, 0, chartHeight);
    let yPos = zeroY - h;

    g.fill("hotpink");
    g.noStroke();
    g.rect(leftMargin + i * barWidth, yPos, barWidth * 0.8, h); // leggero spazio tra barre
  }

  // linea della media
  let avgY = zeroY - map(average0, 0, maxVal, 0, chartHeight);
  g.stroke("deeppink");
  g.strokeWeight(2);
  g.line(leftMargin, avgY, gWidth - rightMargin, avgY);

  // testo descrittivo
  g.noStroke();
  g.fill(0);
  g.textAlign(CENTER);
  g.textSize(18);
  g.text("La media della colonna 0 è " + nf(average0, 1, 2), gWidth / 2, gHeight - 15);

  // inserisce il graphics nel container senza dimensioni fisse
  let cnvImg = createImg(g.canvas.toDataURL(), "Media colonna 0");
    cnvImg.parent("avgChart");
    
    // FORZA IL BLOC E CENTRALO
    cnvImg.style("display", "block"); // p5.js usa .style(key, value)
    cnvImg.style("margin-left", "auto");
    cnvImg.style("margin-right", "auto");
    
    // Mantieni l’altezza e adatta la larghezza al container
    cnvImg.style("max-width", "100%");
    cnvImg.style("height", gHeight + "px");
}
  
function drawStdCol1() {
  let gWidth = 700;
  let gHeight = 200;

  let g = createGraphics(gWidth, gHeight);
  g.background(255, 255, 255, 0);

  // margini
  let topMargin = 20;
  let bottomMargin = 50;
  let leftMargin = 40;
  let rightMargin = 40;

  let chartWidth = gWidth - leftMargin - rightMargin;
  let chartHeight = gHeight - topMargin - bottomMargin;

  // calcola le deviazioni dalla media e crea array di oggetti {val, deviation}
  let deviations = col1Values.map(val => {
    return { val: val, deviation: Math.abs(val - average1) };
  });

  // ordina le barre dalla più bassa alla più alta (per deviazione)
  deviations.sort((a, b) => a.deviation - b.deviation);

  let zeroY = gHeight - bottomMargin;
  let barWidth = chartWidth / deviations.length;

  // disegna le barre ordinate
  for (let i = 0; i < deviations.length; i++) {
    let h = map(deviations[i].deviation, 0, std1 * 3, 0, chartHeight);
    let yPos = zeroY - h;

    g.fill("lightblue");
    g.noStroke();
    g.rect(leftMargin + i * barWidth, yPos, barWidth * 0.8, h);
  }

  // linea della deviazione standard media
  let stdY = zeroY - map(std1, 0, std1 * 3, 0, chartHeight);
  g.stroke("blue");
  g.strokeWeight(2);
  g.line(leftMargin, stdY, gWidth - rightMargin, stdY);

  // testo descrittivo
  g.noStroke();
  g.fill(0);
  g.textAlign(CENTER);
  g.textSize(18);
  g.text("Deviazione standard colonna 1: " + nf(std1, 1, 2), gWidth / 2, gHeight - 15);

  // inserisce il graphics nel container
  let cnvImg = createImg(g.canvas.toDataURL(), "Deviazione Standard colonna 1");
  cnvImg.parent("stdChart");
  cnvImg.style("display", "block");
  cnvImg.style("margin-left", "auto");
  cnvImg.style("margin-right", "auto");
  cnvImg.style("max-width", "100%");
  cnvImg.style("height", gHeight + "px");
}

function drawModeCol2() {
  let gWidth = 700;
  let gHeight = 200;

  let g = createGraphics(gWidth, gHeight);
  g.background(255, 255, 255, 0);

  let padding = 20;

  // calcola la frequenza dei valori
  let counts = {};
  for (let val of col2Values) {
    counts[val] = (counts[val] || 0) + 1;
  }

  let uniqueValues = Object.keys(counts);
  let maxCount = Math.max(...Object.values(counts));
  let minValue = Math.min(...uniqueValues.map(Number));
  let maxValue = Math.max(...uniqueValues.map(Number));

  // array per memorizzare le posizioni delle bolle (evitare sovrapposizione)
  let bubbles = [];

  for (let val of uniqueValues) {
    let freq = counts[val];
    let radius = map(freq, 0, maxCount, 10, 40);

    let attempts = 0;
    let x, y;
    let overlap;
    do {
      x = random(padding + radius, gWidth - padding - radius);
      y = random(padding + radius, gHeight - padding - radius - 20); // lascia spazio per etichette
      overlap = false;
      for (let b of bubbles) {
        let d = dist(x, y, b.x, b.y);
        if (d < radius + b.radius + 5) { // buffer per evitare sovrapposizione
          overlap = true;
          break;
        }
      }
      attempts++;
      if (attempts > 200) break; // evita loop infinito
    } while (overlap);

    bubbles.push({ x, y, radius, val });
  }

  // disegna le bolle
  for (let b of bubbles) {
    // colore in base al valore
    let colNorm = map(Number(b.val), minValue, maxValue, 0, 1);
    let c = lerpColor(color(255, 100, 100), color(100, 100, 255), colNorm);

    g.fill(c);
    g.noStroke();
    g.ellipse(b.x, b.y, b.radius * 2, b.radius * 2);

    // etichetta
    g.fill(0);
    g.textAlign(CENTER);
    g.textSize(12);
    g.text(b.val, b.x, b.y + b.radius + 12);
  }

  // titolo
  g.noStroke();
  g.fill(0);
  g.textAlign(CENTER);
  g.textSize(18);
  g.text("Moda colonna 2 (Bubble Chart)", gWidth / 2, gHeight - 5);

  // inserimento nel container
  let cnvImg = createImg(g.canvas.toDataURL(), "Moda colonna 2");
  cnvImg.parent("modeChart");
  cnvImg.style("display", "block");
  cnvImg.style("margin-left", "auto");
  cnvImg.style("margin-right", "auto");
  cnvImg.style("max-width", "100%");
  cnvImg.style("height", gHeight + "px");
}



function setup() {
  createCanvas(400, 400);

  for (let r = 0; r < table.getRowCount(); r++) {
    const col0 = table.getNum (r,0); //colonna 0 come numero

    //applicare regole maggiore di 0 e multiplo di 5
  if (col0 > 0 && col0 % 5 == 0) {
    let rowObj = {}; //crea oggetto x ogni riga valid
    for (let c = 0; c < table.getColumnCount(); c++) {
      let colName = table.columns[c]; //Nome colonna
      rowObj [colName] = table.get(r,c);
    }
    filteredRows.push(rowObj);
  }
 }
 col0Values = filteredRows.map(row => Number (row.column0));
 col1Values = filteredRows.map(row => Number (row.column1));
 col2Values = filteredRows.map(row => Number (row.column2));
 col3Values = filteredRows.map(row => Number (row.column3));
 col4Values = filteredRows.map(row => Number (row.column4));
 
//Calcolo media col0
average0 = calcAvg (col0Values);
print ("average col0:" , average0);

drawAverageCol0();

//Funzione media e deviazione standard
average1 = calcAvg(col1Values);
  std1 = calcStD(col1Values);
  print("average col1:" , average1);
  print("std col1:", std1);

  drawStdCol1();

//calcolo moda colonna 2
mode2 = calcMode(col2Values);
print("mode col2:", mode2);


drawModeCol2();


//calcolo mediana colonna 3
median3 = calcMedian(col3Values);
print("median col3:", median3);

//calcolo media e deviazione standard colonna 4
average4 = calcAvg(col4Values);
std4 = calcStD(col4Values);
print("average col4:", average4);
print("std col4:", std4);

}  //Chiusura setup


