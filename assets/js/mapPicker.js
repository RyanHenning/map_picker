// Global Variables
let eliminatedMaps = new Array();
var mapPool = ['Dust_II', 'Nuke', 'Cache', 'Mirage', 'Overpass', 'Train', 'Cobblestone', 'Inferno'];

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

// initialize game maps
function loadMaps() {

    // grab url parameter
    url = location.search;
    gameID = url.substring(8).split('?gameID=');

    // grab data from mapPickerData JSON via ID
    let gameData = games[gameID].maps;

    // populate the list of maps
    let mapsList = document.getElementById("maps_container");
    mapsList.innerHTML = `${gameData.map(mapSelectionTemplate).join("")}` + buttonTemplate;

}

// template
function mapSelectionTemplate(map) {
    return `
        <div onclick="disableCell('${map.id}')" onDblClick="lock('${map.id}')" id="${map.id}" class="maps_selector" style="background:linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${map.image}) ">
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

function lock(mapID) {
    // mapID = mapID.toString();

    document.getElementById(mapID).classList.remove("disabled");
    document.getElementById(mapID).classList.add("enabled");

    if (mapPool.indexOf(mapID) > -1 && eliminatedMaps.indexOf(mapID) > -1) {
        document.getElementById(mapID).classList.remove("disabled");
        document.getElementById(mapID).classList.add("enabled");

            /*eliminatedMaps.remove(mapID);*/

        window.console.log(mapID + ' cell locked.');
    }

    if (eliminatedMaps.length > 1) {
        document.getElementById('backAction').setAttribute('style', 'visibility:visible;');

    }
    // else {
    //     document.getElementById('backAction').setAttribute('style', 'visibility:hidden;');
    // }

};


function disableCell(mapID) {

    document.getElementById(mapID).classList.remove("enabled");
            document.getElementById(mapID).classList.add("disabled");

    let eliminatedMaps = new Array();
    var mapPool = ['Dust_II', 'Nuke', 'Cache', 'Mirage', 'Overpass', 'Train', 'Cobblestone', 'Inferno'];

    if (mapPool.indexOf(mapID) > -1) {
        if (eliminatedMaps.length < mapPool.length - 1 && eliminatedMaps.indexOf(mapID) < 0) {
            eliminatedMaps.push(mapID);




            window.console.log(mapID + ' cell removed.');
        }
    }

    // if (eliminatedMaps.length == mapPool.length - 1) {
    //     $('#backAction').html('&nbsp;<i class="fa fa-undo fa-2x"></i>&nbsp;'); /* REST */
    // } else if (eliminatedMaps.length > 0) {
    //     $('#backAction').css('visibility', 'visible');
    //     $('#backAction').html('&nbsp;<i class="fa fa-step-backward fa-2x"></i>&nbsp;');  /* STEP BACKWARDS */
    // }
};