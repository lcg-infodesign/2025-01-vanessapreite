let table;
let filterRows = [];

let col0 =[];
let col1 = [];
let col2 =[];
let col3 = [];
let col4 = [];

let average0;
let average1;
let std1;
let mode2;
let median3;
let average4;
let std4;

function preload () {
  table = loadable ("dataset.csv", "csv", "header");
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
  if (arr.lenght === 0) return 0;
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
  if (mode.lenght === 1) return mode[0];
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





function setup() {
  createCanvas(400, 400);

  for (let r = 0; r < table.getRowCount(); r++) {
    const col0 = table.getNum (r,0); //colonna 0 come numero

    //applicare regole maggiore di 0 e multiplo di 5
  if (column0 > 0 && column0 % 5 == 0) {
    let rowObj = {}; //crea oggetto x ogni riga valid
    for (let c = 0; c < table.getColumnCount(); c++) {
      let colName = table.Columns[c]; //Nome colonna
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
 
}

function draw() {
  background(220);
}
