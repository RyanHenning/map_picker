function gameSelectionTempalate(game) {
     return `
        <div class="game_selector" style="background: url(${ game.background_image})">
            <a href="${game.url}">
                <img src="${game.logo}">
            </a>
        </div>

    `;
}

function mapSelectionTemplate(map) {
    return `
        <div onclick="disableCell('${map.id}')" onDblClick="lock('${map.id}')" id="${map.id}" class="maps_selector" style="background: url(${map.image}) ">
            <p>${map.id}</p>
        </div>
    `;
}

var buttonTemplate = `
    <div class="maps_selector">
        <div id="homeAction" >
            <a href="./mapPicker.html">
                &nbsp;<i class="fa fa-home fa-2x"></i>&nbsp;
            </a>
        </div>

        <div id="backAction" onClick="resetPage();">
            &nbsp;
        </div>
    </div>
    `;



function loadMaps(i) {
    let gameData = games[i].maps;
    console.log(gameData);

    let mapsList = document.getElementById("maps_container");
    mapsList.innerHTML = `${gameData.map(mapSelectionTemplate).join("")}` + buttonTemplate;

}

// initial load of main page
window.onload = function() {
    var gameData = games;
    // console.log(gameData);


    document.getElementById("game_container").innerHTML = `
            ${gameData.map(gameSelectionTempalate).join("")}
        `;
};
