
//Diese Datei beinhaltet die Map, die dargestellt wird und alles, was auf der Map
//dargestellt wird.

//Dinge, die für die Erstellung einer Karte mit mappa benötigt werden.
const mappakey = 'pk.eyJ1IjoicmxmYmNrciIsImEiOiJja2d0Ym5qbjkwc3poMzBreTBnMnM2Z3czIn0.6fZAUJL9xrsg5Mi-DHH-ZA';
const mappa = new Mappa('MapboxGL', mappakey);
//Das mappa-Objekt, womit die Karte dargestellt wird.
let mappaMap;

//Breite und Höhe des Rechtecks, das die Bewegungsachse darstellt.
const rectWidth = 30;
let rectHeight;

//Breite und Höhe des Rechtecks, das das Paddle darstellt.
const paddleWidth = 20;
let paddleHeight;

// Optionen für die mappa-Karte
const options = {
  //lat: 53.0793, //Bremen Zentrum
  //lng: 8.8017,
  lat: 53.1060095,  //Uniwiese
  lng: 8.84913369,
  zoom: 17,
  minZoom: 16,
  maxZoom: 18,
  style: 'mapbox://styles/mapbox/dark-v9',
}


//Erstellt die Karte mit mappa und legt das Canvas auf die Map.
function setupMap(position) {
  options.lat = position.latitude;
  options.lng = position.longitude;
  mappaMap = mappa.tileMap(options);
  mappaMap.overlay(canvas);
}

/*
Zeichnet die Bewegungsachse des Spielers als Rechteck auf die Map.
Das Rechteck muss dafür gedreht werde, das geschieht mit dem "transformMode".
Die Länge der Achse ergibt sich aus yMinPoint und yMaxPoint, diese Punkte
befinden sich jeweils an den Enden der Bewegungsachse.
*/
function drawYLine() {
  rectMode(CORNERS);  //Rechteck wird definiert über zwei Eckpunkte, die diagonal zueinander sind
  fill(255);
  noStroke();

  //Es wird nur die y-Komponente benötigt. Diese entspricht in diesem Fall der Länge des Vektors.
  rectHeight = calculateRotatedVector(yMinPoint, yMaxPoint);

  transformModeOn();
  rect(-rectWidth/2, 0, rectWidth/2, rectHeight.y);
  transformModeOff();

  /*
  fill(color('magenta'));
  ellipse(yMinPoint.x, yMinPoint.y, 50, 50);
  fill(color('blue'));
  ellipse(yMaxPoint.x, yMaxPoint.y, 50, 50);
  fill(255)
  ellipse(startingPoint.x, startingPoint.y, 50, 50);
  */
}

/*
Zeichnet das Paddle entsprechend der gegebenen Geo-Koordinaten als Rechtecks
auf die Bewegungsachse.Das Rechteck muss dafür gedreht werde, das geschieht mit
dem "transformMode". Das Paddle kann sich nicht über die Bewegungsachse hinaus
bewegen.
*/
function drawPaddleOnPosition() {
  let pos = mappaMap.latLngToPixel(paddleGeoCoor.lat, paddleGeoCoor.lng);
  let transfPos = calculateRotatedVector(yMinPoint, pos);   //Es wird nur die y-Komponente benötigt.
  let yPosition;
  let paddleHeight = rectHeight.y/8;

  fill(color('green'));
  noStroke();
  rectMode(CENTER);   //Rechteck wird definiert über den Mittelpunkt, Breite und Höhe

  if(transfPos.y < paddleHeight/2) {
    yPosition = paddleHeight/2;
  }
  else if(transfPos.y > rectHeight.y) {
    yPosition = rectHeight.y - paddleHeight/2;
  }
  else {
    yPosition = transfPos.y;
  }
  transformModeOn();
  rect(0, yPosition, paddleWidth, paddleHeight);
  transformModeOff();
}
