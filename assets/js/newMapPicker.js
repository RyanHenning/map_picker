/////////////////////////////////////////////////
// Global Variables - used in multiple sections
/////////////////////////////////////////////////
let finalMaps = [];
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
let gameData;
let mapList;

// initialize game maps
function loadMaps() {

    url = location.search; // returns query part of url
    urlParameters = url.substring(1).split('&'); // split params into an array

    //get values in urlParametersArray
    gameID = urlParameters[0].substring(7);
    numberOfRounds = urlParameters[1].substring(7);

    // grab data from mapPickerData JSON via ID
    gameData = games[gameID];
    mapList = games[gameID].gameMapList;
    let gameName = games[gameID].name;

    console.log("Number of Rounds: " + numberOfRounds + " for " + gameName);
    console.log("Map Pool Size: " + games[gameID].gameMapList.length);

    // populate the list of maps
    let mapsList = document.getElementById("maps_container");

    // if a gameData does not contain columns than we can just return the games via default flexbox layout
    if (gameData.columns == null) {
         mapsList.innerHTML = `${mapList.map(mapSelectionTemplate).join("")}` + buttonTemplate;
    } else {
        // if a gameData does contain columns. We need to put the games in the correct columns with the correct headers
        mapsList.innerHTML = `<div class="headers-section">${gameData.columns.map(mapColumnHeaders).join("")}</div>` + buttonTemplate;
    }

    //initialize the finalMaps array with the game data
    finalMaps = gameData.gameMapList.map(x => ({mapID:x.id, action: "default", selectedOrder: 0 }));
}

/////////////////////////////////////////////////////////
// default game layout function when there are no columns
//////////////////////////////////////////////////////////
function mapSelectionTemplate(map) {
    //console.log(map)
    return `
        <div onClick="countClicks('${map.id}')" id="${map.id}" class="maps_selector" style="background:linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${map.image})">
            <p>${map.id}</p>
        </div>`
}

/////////////////////////////////////////////////////////////////////////////////////
//column game layout function when there are columns for the games to be sorted into
/////////////////////////////////////////////////////////////////////////////////////
function mapColumnHeaders(column) {
   // console.log(gameData.gameMapList);
    // we need to create a sub-array of games that match this column ID
    let gamesByColumn = gameData.gameMapList.filter(x=> x.columnID == column.id )

    //we then use that sub array to populate our games with our column div
    return `
        <div class="map_column" id="map_column_${column.id}">
            <div class="map_heading">${column.name}</div>
            ${gamesByColumn.map(mapSelectionTemplate).join("")}

        </div>`
}


// button template
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
        }, 400);
    }
}

function lock(mapID) {
    let currentMapAction = getMapActionValue(mapID);

    if (currentMapAction !== "selected" && currentMapAction !== "disabled") {
        // set cell styling
        document.getElementById(mapID).classList.remove("disabled");
        document.getElementById(mapID).classList.add("enabled");

        // update the selected map order and push values arrays
        mapSelectedOrder = mapSelectedOrder + 1;
        updateMapAction(mapID, "selected", mapSelectedOrder );
    }
}

function disableCell(mapID) {
    let currentMapAction = getMapActionValue(mapID);

    if (currentMapAction !== "selected" && currentMapAction !== "disabled") {
        // set cell styling
        document.getElementById(mapID).classList.remove("enabled");
        document.getElementById(mapID).classList.add("disabled");

        // update the selected map order and push values arrays
        mapSelectedOrder = mapSelectedOrder + 1;
        updateMapAction(mapID, "disabled", mapSelectedOrder);
    }
}

//undo the previous action
function resetPage() {
    if (mapSelectedOrder > 0) {
        // find the map based on the numberOfClicks
        let matchedItem = finalMaps.find(x => x.selectedOrder == mapSelectedOrder);
        // find the index of the matched value
        let matchedItemIndex = finalMaps.indexOf(matchedItem)
        // reset the selectedOrder
        finalMaps[matchedItemIndex].selectedOrder = "";
        // reset the map action
        finalMaps[matchedItemIndex].action = "default";
        // remove styling
        tempMapID = finalMaps[matchedItemIndex].mapID;
        if (document.getElementById(tempMapID).classList.contains("disabled")) {
            document.getElementById(tempMapID).classList.remove("disabled");
        }
        if (document.getElementById(tempMapID).classList.contains("enabled")) {
            document.getElementById(tempMapID).classList.remove("enabled");
        }
        // reduce the value of mapSelectedOrder
        mapSelectedOrder = mapSelectedOrder - 1;
    }
}


// when user clicks checkmark for complete call this function and print out the final map list
function selectionComplete() {
    // reset message
    document.getElementById("message-center").innerHTML = "";

    let finalMapsList = [];
    let sortedMaps = finalMaps.sort(function (a, b) {
        return a.selectedOrder - b.selectedOrder;
    });

    for (i in sortedMaps) {
        if (sortedMaps[i].action !== "default") {
            finalMapsList.push(" " + sortedMaps[i].selectedOrder + "-" + sortedMaps[i].mapID + ": " + sortedMaps[i].action);
        }
    }
    document.getElementById("message-center").innerHTML = finalMapsList;
    console.log(finalMaps);
}

// after the user performs action (select or ban) then we want to grab the map ID and action and push to the final map array.
//this array will be printed out when the user hits the checkmark
function updateMapAction(mapID, action, mapSelectedOrder) {
    // find the mapID in the finalMap array
    let matchedItemIndex = getMapIndex(mapID);
    // update the value
    finalMaps[matchedItemIndex].action = action;
    // update the mapOrder
    finalMaps[matchedItemIndex].selectedOrder = mapSelectedOrder;
}


function getMapActionValue(mapID) {
    let matchedItemIndex = getMapIndex(mapID);
    // get the current map action
    let currentMapAction = finalMaps[matchedItemIndex].action;
    return currentMapAction;
}

function getMapIndex(mapID) {
    // find the mapID in the finalMap array
    let matchedItem = finalMaps.find(x => x.mapID == mapID);
    // find the index of the matched value
    let matchedItemIndex = finalMaps.indexOf(matchedItem);
    return matchedItemIndex;
}
