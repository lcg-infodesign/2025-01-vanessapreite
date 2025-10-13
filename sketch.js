// Variabili globali
let table; // per memorizzare la tabella caricata
let filteredRows = []; // array per contenere le righe filtrate

// Array per memorizzare i valori numerici delle colonne
let col0Values = [];
let col1Values = [];
let col2Values = [];
let col3Values = [];
let col4Values = [];

// Variabili per statistiche
let average0;
let average1;
let std1;
let mode2;
let median3;
let average4;
let std4;

// Carica il file CSV prima dell’esecuzione dello sketch
function preload () {
  table = loadTable ("dataset.csv", "csv", "header");
}

//   FUNZIONI DI CALCOLO   //
// Calcola la media aritmetica di un array
function calcAvg (arr) {
  if (arr.length === 0) return 0; //Controlla l'array vuoto e ritorna 0 in quel caso.
  let sum = 0;
  for (let i = 0;i < arr.length; i++) {
    sum += arr[i]; 
  }
  return sum / arr.length; 
} 

// Calcola la deviazione standard
function calcStD (arr) {
  if (arr.length === 0) return 0;
  let average = calcAvg(arr); // media dei valori
  let sommaQuad = 0;
  for (let i = 0; i < arr.length; i++) {
    sommaQuad += (arr[i] - average) ** 2; // differenza quadratica
  }
  let variation = sommaQuad/arr.length; // varianza
  return Math.sqrt(variation); // radice quadrata = deviazione standard
}

// Calcola la moda (il valore più frequente)
function calcMode(arr) {
  if (arr.length === 0) return null;
  let counts = {}; // oggetto per contare le occorrenze
  let maxCount = 0;
  let mode = [];

  // Conta quante volte compare ogni valore
  for (let i = 0; i < arr.length; i++) {
    let val = arr[i];
    counts[val] = (counts[val] || 0) + 1;
    if (counts[val] > maxCount) {
      maxCount = counts[val];
    }
  }

  // Trova tutti i valori con la frequenza massima
  for(let key in counts) {
    if (counts[key] === maxCount) {
      mode.push (key);
    }
  }
  
  // Se c’è una sola moda restituisce il valore singolo
  // Se ce ne sono più di una, restituisce un array
  if (mode.length === 1) return mode[0];
  return mode;
}

// Calcola la mediana (valore centrale ordinato)
function calcMedian(arr) {
  if (arr.length === 0) return 0;
  let sorted = arr.slice().sort((a,b) => a-b); // ordina una copia dell’array
  let middle = Math.floor (sorted.length/2);

  // Se pari prende la media dei due valori centrali
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle])/2;
  }
  else {
    return sorted[middle];
  }
}


//   GRAFICO MEDIA COLONNA 0 //

function drawAverageCol0() {
  let gWidth = 700;
  let gHeight = 200;
  let g = createGraphics(gWidth, gHeight); // canvas grafico
  g.background(0, 0, 0, 0); // sfondo trasparente

  // Margini e dimensioni grafico
  let topMargin = 20, bottomMargin = 50, leftMargin = 40, rightMargin = 40;
  let chartWidth = gWidth - leftMargin - rightMargin;
  let chartHeight = gHeight - topMargin - bottomMargin;
  let barWidth = chartWidth / col0Values.length; //la larghezza di una singola barra = spazio totale / numero di valori.
  let maxVal = Math.max(...col0Values);
  let zeroY = gHeight - bottomMargin;

  // Disegno delle barre
  for (let i = 0; i < col0Values.length; i++) {
    let val = col0Values[i];
    let h = map(val, 0, maxVal, 0, chartHeight);
    let yPos = zeroY - h;

    // Riempimento con gradiente verde-lime
    let c = lerpColor(color(100, 255, 100), color(180, 255, 0), val / maxVal);
    g.fill(c);
    g.noStroke();
    g.rect(leftMargin + i * barWidth, yPos, barWidth * 0.8, h, 5);
  }

  // Linea della media
  let avgY = zeroY - map(average0, 0, maxVal, 0, chartHeight);
  g.stroke("#bfff00");
  g.strokeWeight(3);
  g.line(leftMargin, avgY, gWidth - rightMargin, avgY);

  // Testo descrittivo
  g.noStroke();
  g.fill(200);
  g.textAlign(CENTER, CENTER);
  g.textSize(18);
  g.textStyle(BOLD);
  g.text("Media colonna 0: " + nf(average0, 1, 2), gWidth / 2, gHeight - 15);

  // Mostra il grafico come immagine nella pagina
  let cnvImg = createImg(g.canvas.toDataURL(), "Media colonna 0");
  cnvImg.parent("avgChart");
  cnvImg.style("display", "block");
  cnvImg.style("margin-left", "auto");
  cnvImg.style("margin-right", "auto");
  cnvImg.style("max-width", "100%");
  cnvImg.style("height", gHeight + "px");
}


//   GRAFICO DEVIAZIONE STD 1  //

function drawStdCol1() {
  let gWidth = 700;
  let gHeight = 200;
  let g = createGraphics(gWidth, gHeight);
  g.background(0, 0, 0, 0);

  let topMargin = 20, bottomMargin = 50, leftMargin = 40, rightMargin = 40;
  let chartWidth = gWidth - leftMargin - rightMargin;
  let chartHeight = gHeight - topMargin - bottomMargin;
  let zeroY = gHeight - bottomMargin;

  // Calcola le deviazioni assolute rispetto alla media
  let deviations = col1Values.map(val => Math.abs(val - average1));
  deviations.sort((a, b) => a - b);

  let n = deviations.length;
  let centerIndex = (n - 1) / 2;
  let barWidth = chartWidth / n;
  let maxDeviation = Math.max(...deviations);
  let heights = deviations.map(d => map(d, 0, maxDeviation, 0, chartHeight));

  let linePoints = [];

  // Disegna le barre con effetto parabolico
  for (let i = 0; i < n; i++) {
    let parabolaFactor = 1 - Math.pow((i - centerIndex) / centerIndex, 2);
    let h = heights[i] * parabolaFactor;
    let yPos = zeroY - h;

    // Colore gradiente verde-cyano
    let c = lerpColor(color(0, 180, 100), color(200, 255, 100), h / chartHeight);
    g.fill(c);
    g.noStroke();
    g.rect(leftMargin + i * barWidth, yPos, barWidth * 0.8, h, 4);

    linePoints.push({ x: leftMargin + i * barWidth + barWidth * 0.4, y: yPos });
  }

  // Linea fluida che unisce le barre
  g.noFill();
  g.stroke("#aaff00");
  g.strokeWeight(3);
  g.beginShape();
  for (let p of linePoints) g.vertex(p.x, p.y);
  g.endShape();

  // Testo descrittivo
  g.noStroke();
  g.fill(200);
  g.textAlign(CENTER, CENTER);
  g.textSize(18);
  g.textStyle(BOLD);
  g.text("Deviazione standard colonna 1: " + nf(std1, 1, 2), gWidth / 2, gHeight - 15);

  let cnvImg = createImg(g.canvas.toDataURL(), "Deviazione Standard colonna 1:");
  cnvImg.parent("stdChart");
  cnvImg.style("display", "block");
  cnvImg.style("margin-left", "auto");
  cnvImg.style("margin-right", "auto");
  cnvImg.style("max-width", "100%");
  cnvImg.style("height", gHeight + "px");
}


//   GRAFICO MODA 2    //

function drawModeCol2() {
  let gWidth = 700, gHeight = 230;
  let g = createGraphics(gWidth, gHeight);
  g.background(0, 0, 0, 0);

  let padding = 25;
  let counts = {};
  for (let val of col2Values) counts[val] = (counts[val] || 0) + 1;

  let uniqueValues = Object.keys(counts);
  let maxCount = Math.max(...Object.values(counts));
  let minValue = Math.min(...uniqueValues.map(Number));
  let maxValue = Math.max(...uniqueValues.map(Number));

  let bubbles = [];
  let centerX = gWidth / 2;
  let centerY = gHeight / 2;
  let maxY = gHeight - 40;

  let modeArray = Array.isArray(mode2) ? mode2.map(String) : [String(mode2)];
  let modeBubbles = [];

  let spacing = 100;
  let startX = centerX - ((modeArray.length - 1) * spacing) / 2;
  for (let i = 0; i < modeArray.length; i++) {
    let val = modeArray[i];
    let freq = counts[val];
    let radius = map(freq, 0, maxCount, 25, 40);
    let x = startX + i * spacing;
    let y = centerY;
    let b = { x, y, radius, val, freq, isMode: true };
    bubbles.push(b);
    modeBubbles.push(b);
  }

  // Bolle non moda
  for (let val of uniqueValues) {
    if (modeArray.includes(String(val))) continue;
    let freq = counts[val];
    let radius = map(freq, 0, maxCount, 8, 18);
    let attempts = 0, x, y, overlap;

    do {
      let target = random(bubbles);
      let angle = random(TWO_PI);
      let distance = random(target.radius + 20, target.radius + 100);
      let centerAttraction = 0.2;
      x = target.x + cos(angle) * distance + (centerX - target.x) * centerAttraction;
      y = target.y + sin(angle) * distance + (centerY - target.y) * centerAttraction;
      y = constrain(y, padding + radius, maxY - radius);
      overlap = bubbles.some(b => dist(x, y, b.x, b.y) < radius + b.radius + 5);
      attempts++;
      if (attempts > 500) break;
    } while (overlap);

    bubbles.push({ x, y, radius, val, freq, isMode: false });
  }

  // Bolle normali (verde tenue)
  for (let b of bubbles.filter(b => !b.isMode)) {
    let colNorm = map(Number(b.val), minValue, maxValue, 0, 1);
    let alpha = map(Number(b.val), minValue, maxValue, 100, 230);
    let baseCol = lerpColor(color(0, 180, 80, alpha), color(180, 255, 100, alpha), colNorm);
    g.noStroke();
    g.fill(baseCol);
    g.ellipse(b.x, b.y, b.radius * 2, b.radius * 2);
    g.fill(180);
    g.textAlign(CENTER, TOP);
    g.textSize(9);
    g.text(b.val, b.x, b.y + b.radius + 5);
  }

  // Bolle moda (lime brillanti con alone)
  for (let b of modeBubbles) {
    g.drawingContext.shadowBlur = 15;
    g.drawingContext.shadowColor = "rgba(180,255,100,0.8)";
    let gradient = g.drawingContext.createLinearGradient(b.x - b.radius, b.y - b.radius, b.x + b.radius, b.y + b.radius);
    gradient.addColorStop(0, "rgb(100,255,150)");
    gradient.addColorStop(0.5, "rgb(190,255,80)");
    gradient.addColorStop(1, "rgb(220,255,150)");
    g.drawingContext.fillStyle = gradient;

    g.noStroke();
    g.ellipse(b.x, b.y, b.radius * 2, b.radius * 2);
    g.drawingContext.shadowBlur = 0;

    g.stroke(190, 255, 100);
    g.strokeWeight(2.5);
    g.noFill();
    g.ellipse(b.x, b.y, b.radius * 2.25, b.radius * 2.25);

    g.noStroke();
    g.fill(20);
    g.textAlign(CENTER, CENTER);
    g.textSize(13);
    g.textStyle(BOLD);
    g.text(b.val, b.x, b.y);
  }

  // Testo descrittivo finale
  g.noStroke();
  g.fill(200);
  g.textAlign(CENTER, CENTER);
  g.textSize(16);
  g.textStyle(BOLD);
  let modeText = Array.isArray(mode2) ? mode2.join(", ") : mode2;
  g.text("Moda colonna 2: " + modeText, gWidth / 2, gHeight - 15);

  // Mostra grafico
  let cnvImg = createImg(g.canvas.toDataURL(), "Moda colonna 2");
  cnvImg.parent("modeChart");
  cnvImg.style("display", "block");
  cnvImg.style("margin-left", "auto");
  cnvImg.style("margin-right", "auto");
  cnvImg.style("max-width", "100%");
  gHeight && (cnvImg.style.height = gHeight + "px");
}


//     SETUP       //

function setup() {
  createCanvas(400, 400);

  // Filtra le righe: colonna 0 > 0 e multipla di 5
  for (let r = 0; r < table.getRowCount(); r++) {
    const col0 = table.getNum (r,0);

    if (col0 > 0 && col0 % 5 == 0) {
      let rowObj = {};
      for (let c = 0; c < table.getColumnCount(); c++) {
        let colName = table.columns[c];
        rowObj [colName] = table.get(r,c);
      }
      filteredRows.push(rowObj);
    }
 }

 // Crea array numerici per ogni colonna
 col0Values = filteredRows.map(row => Number (row.column0));
 col1Values = filteredRows.map(row => Number (row.column1));
 col2Values = filteredRows.map(row => Number (row.column2));
 col3Values = filteredRows.map(row => Number (row.column3));
 col4Values = filteredRows.map(row => Number (row.column4));
 
// Calcolo media col0 e disegno grafico
average0 = calcAvg (col0Values);
print ("average col0:" , average0);
drawAverageCol0();

// Calcolo media e deviazione standard col1
average1 = calcAvg(col1Values);
std1 = calcStD(col1Values);
print("average col1:" , average1);
print("std col1:", std1);
drawStdCol1();

// Calcolo moda col2 e disegno grafico
mode2 = calcMode(col2Values);
print("mode col2:", mode2);
drawModeCol2();

// Calcolo mediana col3
median3 = calcMedian(col3Values);
print("median col3:", median3);

// Calcolo media e deviazione standard col4
average4 = calcAvg(col4Values);
std4 = calcStD(col4Values);
print("average col4:", average4);
print("std col4:", std4);
} 

// Fine setup
