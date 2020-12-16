/*
function drawPongField() {
  rectMode(CORNERS);
  noStroke();
  fill(0);
  rect(windowWidth-(windowWidth/2), windowHeight - (windowWidth/2), windowWidth, windowHeight);
  stroke(255);
}
*/
var panda;

function drawField(){
  noStroke();
  fill(0);
  transformModeOn();

  rect(-235, 278, 500, 555);
  transformModeOff();
  stroke(255);
}

function pandaBg(){
  image(panda, windowWidth/2-75, 0, 150, 150);
}
