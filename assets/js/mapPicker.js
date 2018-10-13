function gameSelectionTempalate(game) {
  return `

            <div class="game_selector" style="background: url(${
              game.background_image
            }) no-repeat center; background-size: cover;">
                <a href="${game.url}">
                    <img src="${game.logo}">
                </a>
            </div>

    `;
}

window.onload = function() {
  //   document.getElementById("app").innerHTML = `<h1>Hello</h1>`;
  var gameData = games;

  console.log(gameData);

  document.getElementById("game_container").innerHTML = `
        ${gameData.map(gameSelectionTempalate).join("")}
    `;
};
