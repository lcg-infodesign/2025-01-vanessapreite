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
  let gWidth = 700;
  let gHeight = 200;

  let g = createGraphics(gWidth, gHeight);
  g.background(255, 255, 255, 0);

  let topMargin = 20, bottomMargin = 50, leftMargin = 40, rightMargin = 40;
  let chartWidth = gWidth - leftMargin - rightMargin;
  let chartHeight = gHeight - topMargin - bottomMargin;
  let barWidth = chartWidth / col0Values.length;
  let maxVal = Math.max(...col0Values);
  let zeroY = gHeight - bottomMargin;

  for (let i = 0; i < col0Values.length; i++) {
    let val = col0Values[i];
    let h = map(val, 0, maxVal, 0, chartHeight);
    let yPos = zeroY - h;

    // Gradient fill
    let c = lerpColor(color(255, 160, 180), color(130, 180, 255), val / maxVal);
    g.fill(c);
    g.noStroke();
    g.rect(leftMargin + i * barWidth, yPos, barWidth * 0.8, h, 5); // bordi arrotondati
  }

  // Linea media
  let avgY = zeroY - map(average0, 0, maxVal, 0, chartHeight);
  g.stroke("#FFAA33");
  g.strokeWeight(3);
  g.line(leftMargin, avgY, gWidth - rightMargin, avgY);

  // Testo descrittivo
  g.noStroke();
  g.fill(60);
  g.textAlign(CENTER, CENTER);
  g.textSize(18);
  g.textStyle(BOLD);
  g.text("Media colonna 0: " + nf(average0, 1, 2), gWidth / 2, gHeight - 15);

  let cnvImg = createImg(g.canvas.toDataURL(), "Media colonna 0");
  cnvImg.parent("avgChart");
  cnvImg.style("display", "block");
  cnvImg.style("margin-left", "auto");
  cnvImg.style("margin-right", "auto");
  cnvImg.style("max-width", "100%");
  cnvImg.style("height", gHeight + "px");
}
  
function drawStdCol1() {
  let gWidth = 700;
  let gHeight = 200;
  let g = createGraphics(gWidth, gHeight);
  g.background(255, 255, 255, 0);

  let topMargin = 20, bottomMargin = 50, leftMargin = 40, rightMargin = 40;
  let chartWidth = gWidth - leftMargin - rightMargin;
  let chartHeight = gHeight - topMargin - bottomMargin;
  let zeroY = gHeight - bottomMargin;

  // Deviations
  let deviations = col1Values.map(val => Math.abs(val - average1));
  deviations.sort((a, b) => a - b);

  let n = deviations.length;
  let centerIndex = (n - 1) / 2;
  let barWidth = chartWidth / n;
  let maxDeviation = Math.max(...deviations);
  let heights = deviations.map(d => map(d, 0, maxDeviation, 0, chartHeight));

  let linePoints = [];
  for (let i = 0; i < n; i++) {
    let parabolaFactor = 1 - Math.pow((i - centerIndex) / centerIndex, 2);
    let h = heights[i] * parabolaFactor;
    let yPos = zeroY - h;

    // Gradient barra
    let c = lerpColor(color(255, 160, 180), color(130, 180, 255), h / chartHeight);
    g.fill(c);
    g.noStroke();
    g.rect(leftMargin + i * barWidth, yPos, barWidth * 0.8, h, 4);

    linePoints.push({ x: leftMargin + i * barWidth + barWidth * 0.4, y: yPos });
  }

  // Linea blu parabola
  g.noFill();
  g.stroke("#FFAA33");;
  g.strokeWeight(3);
  g.beginShape();
  for (let p of linePoints) g.vertex(p.x, p.y);
  g.endShape();

  g.noStroke();
  g.fill(60);
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



function drawModeCol2() {
  let gWidth = 700, gHeight = 230;
  let g = createGraphics(gWidth, gHeight);
  g.background(255, 255, 255, 0);

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
  let maxY = gHeight - 40; // spazio per testo descrittivo

  // convert mode2 in array
  let modeArray = Array.isArray(mode2) ? mode2.map(String) : [String(mode2)];
  let modeBubbles = [];

  // Bolle moda (centrali)
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

  // Bolle non-moda (casuali ma armoniche)
  for (let val of uniqueValues) {
    if (modeArray.includes(String(val))) continue;

    let freq = counts[val];
    let radius = map(freq, 0, maxCount, 8, 18);

    let attempts = 0;
    let x, y, overlap;
    do {
      let target = random(bubbles); // riferimento casuale tra tutte le bolle
      let angle = random(TWO_PI);
      let distance = random(target.radius + 20, target.radius + 100);
      let centerAttraction = 0.2; // leggera attrazione verso il centro
      x = target.x + cos(angle) * distance + (centerX - target.x) * centerAttraction;
      y = target.y + sin(angle) * distance + (centerY - target.y) * centerAttraction;

      // vincolo verticale
      y = constrain(y, padding + radius, maxY - radius);

      // controllo sovrapposizione
      overlap = false;
      for (let b of bubbles)
        if (dist(x, y, b.x, b.y) < radius + b.radius + 5) overlap = true;

      attempts++;
      if (attempts > 500) break;
    } while (overlap);

    bubbles.push({ x, y, radius, val, freq, isMode: false });
  }

  // Disegna bolle normali (sotto)
  for (let b of bubbles.filter(b => !b.isMode)) {
    let colNorm = map(Number(b.val), minValue, maxValue, 0, 1);
    let alpha = map(Number(b.val), minValue, maxValue, 120, 230);
    let baseCol = lerpColor(color(255, 160, 180, alpha), color(100, 180, 255, alpha), colNorm);

    g.noStroke();
    g.fill(baseCol);
    g.ellipse(b.x, b.y, b.radius * 2, b.radius * 2);

    // numero piccolo sotto la bolla
    g.fill(70);
    g.noStroke();
    g.textAlign(CENTER, TOP);
    g.textSize(9);
    g.text(b.val, b.x, b.y + b.radius + 5);
  }

  // Disegna bolle moda (sopra con ombra)
  for (let b of modeBubbles) {
    g.drawingContext.shadowBlur = 10;
    g.drawingContext.shadowColor = "rgba(0, 0, 0, 0.25)";

    // gradiente lineare
    let gradient = g.drawingContext.createLinearGradient(b.x - b.radius, b.y - b.radius, b.x + b.radius, b.y + b.radius);
    gradient.addColorStop(0, "rgb(255, 210, 100)");
    gradient.addColorStop(0.5, "rgb(255, 160, 70)");
    gradient.addColorStop(1, "rgb(130, 180, 255)");
    g.drawingContext.fillStyle = gradient;

    g.noStroke();
    g.ellipse(b.x, b.y, b.radius * 2, b.radius * 2);

    g.drawingContext.shadowBlur = 0;

    // contorno brillante
    g.stroke(255, 230, 150);
    g.strokeWeight(2.5);
    g.noFill();
    g.ellipse(b.x, b.y, b.radius * 2.25, b.radius * 2.25);

    // numero bianco al centro
    g.noStroke();
    g.fill(255);
    g.textAlign(CENTER, CENTER);
    g.textSize(13);
    g.textStyle(BOLD);
    g.text(b.val, b.x, b.y);
  }

  // Testo descrittivo
  g.noStroke();
  g.fill(60);
  g.textAlign(CENTER, CENTER);
  g.textSize(18);
  g.textStyle(BOLD);
  let modeText = Array.isArray(mode2) ? mode2.join(", ") : mode2;
  g.text("Moda colonna 2: " + modeText, gWidth / 2, gHeight - 15);

  // Inserisce nel container HTML
  let cnvImg = createImg(g.canvas.toDataURL(), "Moda colonna 2");
  cnvImg.parent("modeChart");
  cnvImg.style("display", "block");
  cnvImg.style("margin-left", "auto");
  cnvImg.style("margin-right", "auto");
  cnvImg.style("max-width", "100%");
  gHeight && (cnvImg.style.height = gHeight + "px");
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


