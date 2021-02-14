let firebaseConfig = {
    apiKey: "AIzaSyBkQLCXctDnaGSKwFVxCobeiyJKwRXoTqE",
    authDomain: "die-trashpandas.firebaseapp.com",
    databaseURL: "https://die-trashpandas-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "die-trashpandas",
    storageBucket: "die-trashpandas.appspot.com",
    messagingSenderId: "829413993875",
    appId: "1:829413993875:web:963be3d83689e6f8b60c66",
    measurementId: "G-CM09YD9D3X"
};

let database;
let playersTable;
let roomsTable;

let playerID = "-1";
let playerName = "-1";
let playerXCoor = -1;
let ready = false;
let playerPoints = 0;
let ballInPlayerGoal = false;

let roomID = "-1";
let playerOne = "-1";
let playerTwo = "-1";
let ballXCoor = (-1);
let ballYCoor = (-1);
let playerReadyForPlaying = false;

let otherPlayerName = "-1";
let otherPlayerXCoor = -1;
let otherPlayerReady = false;
let otherPlayerPoints = 0;
let ballInOtherGoal = false;
let otherReadyForPlaying = false;


// Initialisierung von Firebase
function initializeDatabase() {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  database = firebase.database();
  playersTable = database.ref('players/');
  roomsTable = database.ref('rooms/');
}

// Hinzufügen dieses Spielers in die Datenbank
function addThisPlayer(){
  playersTable.child(playerID).set({
    name: playerName,
    xCoordinate: playerXCoor,
    room: roomID,
    ready: ready,
    points: playerPoints,
    ballInGoal: ballInPlayerGoal,
    readyForPlaying: playerReadyForPlaying
  });
}

// Hinzufügen eines Raumes in die Datenbank mit diesem Spieler als Player One
function addThisRoom() {
  roomsTable.child(roomID).set({
    playerOne: playerID,
    playerTwo: playerTwo,
    ballXCoordinate: ballXCoor,
    ballYCoordinate: ballYCoor
  });
}

// Ändern eines Wertes des Spielers
function updateThisPlayerAttribute(attribute, newValue) {
  switch(attribute) {
    case "name":
      playersTable.child(playerID).update({
        name: newValue
      });
      break;
    case "xCoordinate":
      playersTable.child(playerID).update({
        xCoordinate: newValue
      });
      break;
    case "room":
      playersTable.child(playerID).update({
        room: newValue
      });
      break;
    case "ready":
      playersTable.child(playerID).update({
        ready: newValue
      });
      break;
    case "points":
      playersTable.child(playerID).update({
        points: newValue
      });
      break;
    case "ballInGoal":
      playersTable.child(playerID).update({
        ballInGoal: newValue
      });
      break;
    case "readyForPlaying":
      playersTable.child(playerID).update({
        readyForPlaying: newValue
      });
      break;
  }
}

// Ändern eines Wertes des Raumes
function updateThisRoomAttribute(attribute, newValue) {
  switch(attribute) {
    case "playerOne":
      roomsTable.child(roomID).update({
        playerOne: newValue
      });
      break;
    case "playerTwo":
      roomsTable.child(roomID).update({
        playerTwo: newValue
      });
      break;
    case "ballXCoordinate":
      roomsTable.child(roomID).update({
        ballXCoordinate: newValue
      });
      break;
    case "ballYCoordinate":
      roomsTable.child(roomID).update({
        ballYCoordinate: newValue
      });
    }
}

// Holt die Werte des Raumes aus der Datenbank
function fetchThisRoom() {
  roomsTable.child(roomID).once('value', (snapshot) => {
    playerOne = snapshot.val().playerOne;
    playerTwo = snapshot.val().playerTwo;
    ballXCoor = snapshot.val().ballXCoordinate;
    ballYCoor = snapshot.val().ballYCoordinate;
  });
}


// Holt die Werte des Spielers aus der Datenbank
function fetchThisPlayer() {
  playersTable.child(playerID).once('value', (snapshot) => {
    playerName = snapshot.val().name;
    playerXCoor = snapshot.val().xCoordinate;
    ready = snapshot.val().ready;
    playerPoints = snapshot.val().points;
    roomID = snapshot.val().room;
    ballInPlayerGoal = snapshot.val().ballInGoal;
    playerReadyForPlaying = snapshot.val().readyForPlaying;
  });
}

function fetchOtherPlayer() {
  let pNum = retrievePlayerNumber();
  let otherID = 0;
  if(pNum == 1) {
    otherID = playerTwo;
  }
  else if(pNum == 2) {
    otherID = playerOne;
  }

  if(otherID != "-1") {
    playersTable.child(otherID).once('value', (snapshot) => {
      otherPlayerName = snapshot.val().name;
      otherPlayerXCoor = snapshot.val().xCoordinate;
      otherPlayerReady = snapshot.val().ready;
      otherPlayerPoints = snapshot.val().points;
      ballInOtherGoal = snapshot.val().ballInGoal;
      otherReadyForPlaying = snapshot.val().readyForPlaying;
    });
  }
}

// Entfernen des Spielers
function removeThisPlayer() {
  playersTable.child(playerID).remove();
}

// Entfernen des Raumes
function removeThisRoom() {
  roomsTable.child(roomID).remove();
}

// Speichert die Spieler-ID im lokalen Zwischenspeicher
function storePlayerID() {
  sessionStorage.playerIDStorage = playerID;
}

// Holt die Spieler-ID aus dem lokalen Zwischenspeicher
function retrievePlayerID() {
  playerID = sessionStorage.playerIDStorage;
}

function storeRoomID() {
  sessionStorage.roomIDStorage = roomID;
}

function retrieveRoomID() {
  roomID = sessionStorage.roomIDStorage;
}

function storePlayerNumber(num) {
  sessionStorage.playerNoStorage = num;
}

function retrievePlayerNumber() {
  return sessionStorage.playerNoStorage;
}


/*
// update the xcoordinate in the Database
function updateXcoordinate(){
    const newData = {
        xcoordinate: xcoordinateDatabase,
    };
    rootRef.child(playerIDDatabase).update(newData);
}


// get
function getPongItem() {
    rootRef.child('2').once('value', snapshot =>{
        var xcoordinateText = snapshot.val().xcoordinate.toString();
        var ycoordinateText = snapshot.val().ycoordinate.toString();
        var outText = "xcoordinate: " + xcoordinateText + " ycoordinate: " + ycoordinateText;
        textPong.innerHTML = outText;
        //rootRef.orderByKey().on('value', snapshot =>{});
    });
}

// dont know :)
function getPlayer2(){
    rootRef.orderByChild(roomCodeDatabase).equalTo(roomName).on('value', snapshot =>{
        //TODO
    });
}
*/
