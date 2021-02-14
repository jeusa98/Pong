//Buttons und Slider
let playHereButton;
let startGameButton;

let slider;

let yLineIsSet;
let oldSliderValue;

let panda;

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
}

//Slider
function setSlider(){
  rectMode(CENTER);
  slider = createSlider(0, 180, 90, 10);
  oldSliderValue = 90;
  slider.position(50, windowHeight-100);
  slider.size(windowWidth-100, 20);
  slider.style('color', color(255));
  slider.hide();
}

//Buttons
function setButtons() {
  playHereButton = createButton('Play Here');
  //let backCol = color(229, 0, 53);  //red
  //let backCol = color(0, 34, 102);  //blue
  //let backCol = color(255, 77, 210);  //pink
  let backCol = color(128, 255, 170);  //mint green
  let fontCol = color(20);
  playHereButton.style('background-color', backCol);
  playHereButton.style('color', fontCol);
  playHereButton.position(19, 19);
  playHereButton.size(playHereButton.size().width + 20, playHereButton.size().height + 5);
  playHereButton.mousePressed(setButtonPressed);
  playHereButton.hide();

  startGameButton = createButton('Start Game');
  startGameButton.style('background-color', backCol);
  startGameButton.style("color", fontCol);
  startGameButton.position(140, 19);
  startGameButton.size(startGameButton.size().width + 20, startGameButton.size().height + 5);
  startGameButton.mousePressed(startGame);
  startGameButton.hide();

  setStartNewGameButton();
}

//Setzt den Slider zurück.
function startGame() {
  gameStarted = true;
  slider.hide();
  playHereButton.hide();
  startGameButton.hide();
  updateThisPlayerAttribute("ready", true);
}

function pandaBg(){
  image(panda, windowWidth/2-75, 0, 150, 150);
}
