/////////////////////////////////////////////////
// Global Variables - used in multiple sections
/////////////////////////////////////////////////
let finalMaps = []
let mapSelectedOrder = 0;

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
let numberOfMaps = 0;
let gameID = 0;

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
    console.log("Map Pool Size: " + games[gameID].maps.length);

    // populate the list of maps
    let mapsList = document.getElementById("maps_container");
    mapsList.innerHTML = `${gameData.map(mapSelectionTemplate).join("")}` + buttonTemplate;

    // populate finalMaps array with default values
    // finalMaps.push(gameData.map(x => ({mapID:x.id, action: "default" })));
    finalMaps = gameData.map(x => ({mapID:x.id, action: "default", selectedOrder: 0 }));
    console.log(finalMaps);
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
<div class="maps_selector" >
    <div class="control_section" >
        <p id="message-center">Double-Click to Eliminate. Single-Click to Select.</p>
        <div class="button-section">
            <div id="homeAction" >
                <a href="./mapPicker.html">
                <i class="fa fa-home"></i>
                </a>
            </div>

            <div id="backAction" onClick="resetPage();">
                <i class="fa fa-undo"></i>
            </div>

            <div id="selectionComplete" onClick="selectionComplete();">
                <i class="fa fa-check"></i>
            </div>
        </div>
    </div>
`;


/////////////////////////////////
// Game Map Selection Functions
////////////////////////////////

// Initialize Global Game Map Variables
let numberOfClicks = 0;
// // let selectedMaps = [];
let eliminatedMaps = [];


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

    // update the selected map order and push values arrays
    mapSelectedOrder = mapSelectedOrder + 1;
    updateMapAction(mapID, "selected", mapSelectedOrder );

}


function disableCell(mapID) {
    // set cell styling
    document.getElementById(mapID).classList.remove("enabled");
    document.getElementById(mapID).classList.add("disabled");

    eliminatedMaps.push(mapID);

    // update the selected map order and push values arrays
    mapSelectedOrder = mapSelectedOrder + 1;
    updateMapAction(mapID, "disabled", mapSelectedOrder);


}

function resetPage() {
    if (eliminatedMaps.length > 0) {
        document.getElementById(eliminatedMaps[eliminatedMaps.length - 1]).classList.remove("disabled");

        // get the last removed map from eliminatedMaps array
        let lastMap = eliminatedMaps[eliminatedMaps.length - 1];
        updateMapAction(lastMap, "default");
        eliminatedMaps.pop();

    }
}

function selectionComplete() {
    // reset message
    document.getElementById("message-center").innerHTML = "";

    let finalMapsList = []

    for (i in finalMaps) {
        // console.log(finalMaps[i].mapID + ": " + finalMaps[i].action );
        finalMapsList.push(finalMaps[i].mapID + ": " + finalMaps[i].action);
        // console.log(finalMaps[i].mapID)
    }
    document.getElementById("message-center").innerHTML = finalMapsList;
    console.log(finalMaps);
}

function updateMapAction(mapID, action, mapSelectedOrder) {
    // find the mapID in the finalMap array
    let matchedItem = finalMaps.find(x => x.mapID == mapID);
    // find the index of the matched value
    let matchedItemIndex = finalMaps.indexOf(matchedItem)
    // update the value
    finalMaps[matchedItemIndex].action = action;
    // update the mapOrder
    finalMaps[matchedItemIndex].selectedOrder = mapSelectedOrder;
}
