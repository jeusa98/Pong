

//Diese Datei beinhaltet alles, was mit dem Berechnen, Drehen und Transformieren
//von Koordinaten/Punkten/Vektoren zu tun hat.

//Der Rotierungswinkel der Bewegungsachse in Grad. Wenn der Winkel gleich 0
//ist, steht die Achse senkrecht. Es wird mit dem Uhrzeigersinn gedreht.
let rotAngle = 0;  //in degrees

//Setzt den Rotierungswinkel
function setRotAngle(pAngle) {
  rotAngle = pAngle;
}

//Bestimmt die Bildschirm-Position von dem Startpunkt ausgehend von den Geo-Koordinaten.
function updateStartingPoint() {
  startingPoint = mappaMap.latLngToPixel(startingGeoCoor.lat, startingGeoCoor.lng);
}

//Bestimmt YMinStart
function setYLineMinStart() {
  yMinGeoCoorStart = destVincenty(startingGeoCoor.lat, startingGeoCoor.lng, 0, 50);
  yMinPointStart = mappaMap.latLngToPixel(yMinGeoCoorStart.lat, yMinGeoCoorStart.lng);
}

//Bestimmt YMin und YMax
function setYLineMinMax() {
  yMinPointStart = mappaMap.latLngToPixel(yMinGeoCoorStart.lat, yMinGeoCoorStart.lng);
  let vec = calculateRotatedVector(startingPoint, yMinPointStart, 360 - rotAngle);

  yMinPoint = {
    x: startingPoint.x + vec.x,
    y: startingPoint.y + vec.y
  };

  yMaxPoint = {
    x: 2 * startingPoint.x - yMinPoint.x,
    y: 2 * startingPoint.y -yMinPoint.y
  };

  yMinGeoCoor = mappaMap.pixelToLatLng(yMinPoint.x, yMinPoint.y);
  yMaxGeoCoor = mappaMap.pixelToLatLng(yMaxPoint.x, yMaxPoint.y);
}


/*
Aktiviert den "transformMode". In diesem Modus ist das Koordinatensystem um
den Rotierungswinkel mit dem Uhrzeigersinn gedreht. Der neue Punkt (0,0) in
diesem Modus liegt bei Y-Min.
Alles, was nach dem Aufruf dieser Methode gezeichnet wird, wird mit den
transformierten Koordinaten gezeichnet. Um in das normale
Koordinatensystem zurückzukehren, muss der "transformMode" mit transformModeOff()
beendet werden.
*/
function transformModeOn() {
  let moveByRot = calculateRotatedVector(startingPoint, yMinPoint, rotAngle);
  angleMode(DEGREES);
  push();
  translate(startingPoint.x, startingPoint.y);
  rotate(rotAngle);
  translate(0, moveByRot.y);
}

//Deaktiviert den "transformMode".
function transformModeOff() {
   pop();
}

function initPlayerGeoCoor() {
  playerGeoCoor1 = startingGeoCoor;
  playerGeoCoor2 = startingGeoCoor;
  playerGeoCoor3 = startingGeoCoor;
  playerGeoCoor4 = startingGeoCoor;
}

function calculateCenterOfMap() {
  let vec = calculateRotatedVector(startingPoint, yMinPointStart, 450-rotAngle);
  let center = {
    x: startingPoint.x + vec.x,
    y: startingPoint.y + vec.y
  }
  let centerGeo = mappaMap.pixelToLatLng(center.x, center.y);
  staticOptions.lat = centerGeo.lat;
  staticOptions.lng = centerGeo.lng;
}

function setFieldPoints() {
  middleXPoint = helperMappaMap.latLngToPixel(startingGeoCoor.lat, startingGeoCoor.lng);
  fieldCenter = helperMappaMap.latLngToPixel(yMinGeoCoorStart.lat, yMinGeoCoorStart.lng);
  let vec = calculateRotatedVector(middleXPoint, fieldCenter, 90);
  xMinPoint = {
    x: middleXPoint.x + vec.x,
    y: middleXPoint.y + vec.y
  };

  xMaxPoint = {
    x: middleXPoint.x - vec.x,
    y: middleXPoint.y - vec.y
  };
}

function calculateFieldWidth() {
  fieldWidth = xMaxPoint.x - xMinPoint.x;
}

/*
Berechnet einen Vektor zwischen zwei gegebenen Punkten und dreht diesen um den
Rotierungswinkel gegen den Urzeigersinn. Insbesondere die Y-Komponente des
resultierenden Vektors wird dann zum Zeichnen im "transformMode" verwendet.
*/
function calculateRotatedVector(from, to, pAngle) {
  let vec = {
    x: to.x - from.x,
    y: -(to.y -from.y)
  };
  return rotateCoord(pAngle, vec);
}

/*
Drehmatrix mit Drehwinkel a: [cos(a)  -sin(a)
                              sin(a)   cos(a)]
Dreht einen gegebenen Vektor um den gegebenen Winkel gegen den Uhrzeigersinn.
*/
function rotateCoord(pAngle, coord) {
  angleMode(DEGREES);
  const xTransf = coord.x * cos(pAngle) - coord.y * sin(pAngle);
  const yTransf = coord.x * sin(pAngle) + coord.y * cos(pAngle);
  return {
    x: xTransf,
    y: -yTransf
  };
}

/*!
 * JavaScript function to calculate the destination point given start point latitude / longitude (numeric degrees), bearing (numeric degrees) and distance (in m).
 *
 * Original scripts by Chris Veness
 * Taken from http://movable-type.co.uk/scripts/latlong-vincenty-direct.html and optimized / cleaned up by Mathias Bynens <http://mathiasbynens.be/>
 * Based on the Vincenty direct formula by T. Vincenty, “Direct and Inverse Solutions of Geodesics on the Ellipsoid with application of nested equations”, Survey Review, vol XXII no 176, 1975 <http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf>
 */
function toRad(n) {
 return n * Math.PI / 180;
};
function toDeg(n) {
 return n * 180 / Math.PI;
};
/*
Berechnet einen neuen Punkt ausgehend von einem Ursprungspunkt, einem Winkel
und einer Distanz(in Metern) zu dem neuen Punkt. Wird nur zur Berechnung von
yMinGeoCoor und yMaxGeoCoor verwendet.
*/
function destVincenty(lat1, lon1, brng, dist) {
 var a = 6378137,
     b = 6356752.3142,
     f = 1 / 298.257223563, // WGS-84 ellipsiod
     s = dist,
     alpha1 = toRad(brng),
     sinAlpha1 = Math.sin(alpha1),
     cosAlpha1 = Math.cos(alpha1),
     tanU1 = (1 - f) * Math.tan(toRad(lat1)),
     cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1,
     sigma1 = Math.atan2(tanU1, cosAlpha1),
     sinAlpha = cosU1 * sinAlpha1,
     cosSqAlpha = 1 - sinAlpha * sinAlpha,
     uSq = cosSqAlpha * (a * a - b * b) / (b * b),
     A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
     B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
     sigma = s / (b * A),
     sigmaP = 2 * Math.PI;
 while (Math.abs(sigma - sigmaP) > 1e-12) {
  var cos2SigmaM = Math.cos(2 * sigma1 + sigma),
      sinSigma = Math.sin(sigma),
      cosSigma = Math.cos(sigma),
      deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
  sigmaP = sigma;
  sigma = s / (b * A) + deltaSigma;
 };
 var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1,
     lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1, (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)),
     lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1),
     C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha)),
     L = lambda - (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM))),
     revAz = Math.atan2(sinAlpha, -tmp); // final bearing
     return {
        lat: toDeg(lat2),
        lng: lon1 + toDeg(L),
      };
};
