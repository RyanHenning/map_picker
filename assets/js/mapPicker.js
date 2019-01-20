// Global Variables
 eliminatedMaps = new Array();
 mapPool = ['Dust_II', 'Nuke', 'Cache', 'Mirage', 'Overpass', 'Train', 'Cobblestone', 'Inferno'];

/////////////////////////////////
// Game Selection Page Functions
////////////////////////////////
// initial load of main page
window.onload = function () {
    console.clear(); // clear console from old data

    var gameData = games;

    document.getElementById("game_container").innerHTML = `
            ${gameData.map(gameSelectionTempalate).join("")}
        `;
};

// template
function gameSelectionTempalate(game) {
    return `
       <div class="game_selector" style="background: url(${ game.background_image})">
           <a href="${game.url}">
               <img src="${game.logo}">
           </a>
       </div>

   `;
}


/////////////////////////////////
// Map Selector Page Functions
////////////////////////////////

// initialize map selection global variables
let numberOfRounds = 0;
let gameTitle = '';

// initialize game maps
function loadMaps() {

    url = location.search; // returns query part of url
    urlParameters = url.substring(1).split('&'); // split params into an array
    //console.log(urlParameters);

    //get values in urlParametersArray
    gameID = urlParameters[0].substring(7);
    numberOfRounds = urlParameters[1].substring(7);



    // grab data from mapPickerData JSON via ID
    let gameData = games[gameID].maps;
    let gameName = games[gameID].name;

    console.log("Number of Rounds: " + numberOfRounds + " for " + gameName);

    // populate the list of maps
    let mapsList = document.getElementById("maps_container");
    mapsList.innerHTML = `${gameData.map(mapSelectionTemplate).join("")}` + buttonTemplate;

}

// template
function mapSelectionTemplate(map) {
    return `
        <div onClick="countClicks('${map.id}')" id="${map.id}" class="maps_selector" style="background:linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${map.image}) ">
            <p>${map.id}</p>
        </div>
    `;
}

// template
var buttonTemplate = `
    <div class="maps_selector">
        <div id="homeAction" >
            <a href="./mapPicker.html">
                &nbsp;<i class="fa fa-home fa-2x"></i>&nbsp;
            </a>
        </div>

        <div id="backAction" onClick="resetPage();" style="visibility:hidden">
            <i class="fa fa-undo fa-2x"></i>
        </div>
    </div>`;


/////////////////////////////////
// Game Map Selection Functions
////////////////////////////////

// Initialize Global Game Map Variables
let numberOfClicks = 0;
var selectedMaps = [];


// function to count clicks & prevent double click causing single click to fire.
function countClicks(mapID) {

    numberOfClicks++;

    if (numberOfClicks == 1) {
        setTimeout(function () {
            if (numberOfClicks == 1) {
                // if single click, call lock
                lock(mapID);
            } else {
                // if double click, call disabled
                disableCell(mapID);
            }
            numberOfClicks = 0;
        }, 500);
    }
}

function lock(mapID) {

    // set cell styling
    document.getElementById(mapID).classList.remove("disabled");
    document.getElementById(mapID).classList.add("enabled");

    // log map that is locked
    console.log(mapID + ' cell locked.');
    selectedMaps.push(mapID);

    console.log(selectedMaps);

}


function disableCell(mapID) {

    document.getElementById(mapID).classList.remove("enabled");
    document.getElementById(mapID).classList.add("disabled");

    // log map that is disabled
    window.console.log(mapID + ' cell removed.');
}