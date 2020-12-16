//Buttons und Slider
let playHereButton;
let resetRotationButton;
let slider;

let yLineIsSet;
let oldSliderValue;

//Wird ausgeführt, wenn der playHereButton gedrückt wird.
function setButtonPressed() {
  getCurrentPosition(setYLine);
}

//Zeichnet die Bewegungsachse an der aktuellen Position und mit dem durch den
//Slider festgelegten Winkel.
function setYLine(position) {
  yLineIsSet = true;
  setStartCoor(position.latitude, position.longitude);
  updateStartingPoint();
  setPaddleStartCoor(position.latitude, position.longitude);
  setRotAngle(slider.value());
  setYLineMinStart();
  setYLineMinMax();
  initPlayerGeoCoor();
  //slider.hide();
}

//Slider
function setSlider(){
  rectMode(CENTER);
  slider = createSlider(0, 180, 90, 10);
  oldSliderValue = 90;
  slider.position(50, windowHeight-100);
  slider.size(windowWidth-100, 20);
  slider.style('color', color(255));
}

//Buttons
function setButtons() {
  playHereButton = createButton('Play Here');
  let backCol = color(229, 0, 53);
  let fontCol = color(255);
  playHereButton.style('background-color', backCol);
  playHereButton.style("color", fontCol);
  playHereButton.position(19, 19);
  playHereButton.mousePressed(setButtonPressed);

  resetRotationButton = createButton('Reset Rotation');
  resetRotationButton.style('background-color', backCol);
  resetRotationButton.style("color", fontCol);
  resetRotationButton.position(120, 19);
  resetRotationButton.mousePressed(resetRotation);
}

//Setzt den Slider zurück.
function resetRotation() {
  slider.value(90);
}
