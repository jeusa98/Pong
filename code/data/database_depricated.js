let createGameButton;
let joinGameButton;
let textNameInput;
let textRoomCodeInput;
let nameMessage;
let roomCodeMessage;

var database;
var rootRef;

var playerIDDatabase = "20";
var playerNameDatabase = "20";
var xcoordinateDatabase = 20;
var player2IDDatabase = "-1";

function setDataButtonsInputs() {
  createGameButton = createButton('Create Game');
  createGameButton.position(20, windowHeight/2 - 60);
  createGameButton.mousePressed(createGameButtonPressed);

  joinGameButton = createButton('Join Game');
  joinGameButton.position(20, windowHeight/2 - 10);
  joinGameButton.mousePressed(joinGameButtonPressed);

  nameMessage = createElement('h2', 'Enter Name');
  nameMessage.position(20, windowHeight/2 + 40);

  textNameInput = createInput();
  textNameInput.position(20, windowHeight/2 + 90);

  roomCodeMessage = createElement('h2', 'Enter Room Code');
  roomCodeMessage.position(20, windowHeight/2 + 150);

  textRoomCodeInput = createInput();
  textRoomCodeInput.position(20, windowHeight/2 + 200);
}

function createGameButtonPressed() {
    playerNameDatabase = textNameInput.value();
    playerIDDatabase = textNameInput.value() + textRoomCodeInput.value();
    addPongItem();
}

function joinGameButtonPressed() {
    playerNameDatabase = textNameInput.value();
    playerIDDatabase = textNameInput.value() + textRoomCodeInput.value();
    player2IDDatabase = textRoomCodeInput.value();    //warum ist player 2 id der room code?
    addPongItem();
    joinPongGame();
}

// add the player, run once!
function addPongItem(){
    /* dieser code scheint unnötig?
    playerNameDatabase = textName.value;
    playerIDDatabase = textName.value + textRoomCode.value;
    */

    rootRef.child(playerIDDatabase).set({
        playerName: playerNameDatabase,
        xcoordinate: xcoordinateDatabase,
        player2ID: player2IDDatabase,
        //roomCode: roomCodeDatabase
    });
}

// add the own player id to the host
function joinPongGame(){
    const newData = {
        player2ID: playerIDDatabase,
    };
    rootRef.child(player2IDDatabase).update(newData);
}

// update the xcoordinate in the Database
function updateXcoordinate(){
    const newData = {
        xcoordinate: xcoordinateDatabase,
    };
    rootRef.child(playerIDDatabase).update(newData);
}

// get player2 xcoordinate
function getPlayer2Xcoordinate(){
}

// get
function getPongItem(){
    rootRef.child('2').once('value', snapshot =>{
        var xcoordinateText = snapshot.val().xcoordinate.toString();
        var ycoordinateText = snapshot.val().ycoordinate.toString();
        var outText = "xcoordinate: " + xcoordinateText + " ycoordinate: " + ycoordinateText;
        textPong.innerHTML = outText;
        //rootRef.orderByKey().on('value', snapshot =>{});
    });
}

// remove player
function removePongItem(){
    rootRef.child(playerIDDatabase).remove();
}

// dont know :)
function getPlayer2(){
    rootRef.orderByChild(roomCodeDatabase).equalTo(roomName).on('value', snapshot =>{
        //TODO
    });
}
