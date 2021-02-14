//Endung *GeoCoor: Objekt mit den Attributen Breitengrad (lat) und Längengrad (lng)

//Der Startpunkt: Der Mittelpunkt der Bewegungsachse
let startingGeoCoor;

//Das Minimum und das Maximum: Die beiden Enden der Bewegungsachse
let yMinGeoCoor;
let yMaxGeoCoor;

//Ein Helfer-Punkt, der für die Bestimmung von YMin und YMax verwendet wird.
//Dieser Punkt befindet sich senkrecht über dem Startpunkt in 50m Entfernung.
let yMinGeoCoorStart;

//Die Koordinaten des Paddles
let paddleGeoCoor;

//Die aktuelle Position in Breiten- und Längengrad
let curPos;

//Die letzten vier Geo-Koordinaten des Spielers.
let playerGeoCoor1;
let playerGeoCoor2;
let playerGeoCoor3;
let playerGeoCoor4;

//Setzt die aktuelle Geo-Position
function setCurPos(position) {
  curPos = {
    lat: position.latitude,
    lng: position.longitude
  };
}

//Setzt die Startpunkt-Koordinaten
function setStartCoor(latitude, longitude) {
  startingGeoCoor = {
    lat: latitude,
    lng: longitude
  };
}

//Setzt die Paddle-Koordinaten zu Beginn des Spiels auf den Startpunkt.
function setPaddleStartCoor() {
  paddleGeoCoor = startingGeoCoor;
}

//Setzt die Paddle-Koordinaten
function setPaddleGeoCoor(latitude, longitude) {
  paddleGeoCoor = {
    lat: latitude,
    lng: longitude
  };
}

function playerMoves(position) {
  if(typeof position !== 'undefined') {
    playerGeoCoor4 = playerGeoCoor3;
    playerGeoCoor3 = playerGeoCoor2;
    playerGeoCoor2 = playerGeoCoor1;
    playerGeoCoor1 = position;
    let newPaddlePos = {
      lat: (playerGeoCoor1.lat + playerGeoCoor2.lat + playerGeoCoor3.lat + playerGeoCoor4.lat) / 4,
      lng: (playerGeoCoor1.lng + playerGeoCoor2.lng + playerGeoCoor3.lng + playerGeoCoor4.lng) / 4
    };
    setPaddleGeoCoor(newPaddlePos.lat, newPaddlePos.lng);
  }
}

function geoError(error) {
  console.log("Geolocation Error: ", error);
}
