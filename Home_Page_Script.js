// API Variables
const APIKEY = "c893cee9cd204b15a38f977a32547d08";

const Logo = document.querySelector("#Logo");
let gameItemsList;
const GBContent = document.querySelector("#GB_Content");
const GameItemPage = document.querySelector("#Game_Item_Page");
const GameContentDisplayList = document.querySelector("#GB_Content_Display_List");

// Initilize
async function InitialAPICall() {
    try {
        const apiCall = await fetch(
            `https://api.rawg.io/api/games?key=${APIKEY}&page=1&page_size=32&ordering=released,metacritic`
        );
        const jsontodata = await apiCall.json();
        console.log(jsontodata);
        UpdateGameContentDisplay(jsontodata.results, true)
    } catch (error) {
        console.log(error);
    }
}

Logo.addEventListener("click", () => {
    GBContent.style.display = "flex";
    GameItemPage.style.display = "none";
});

(() => {
    InitialAPICall();
})();

// Helper Functions
function UpdateGameContentDisplay(gameslist, isnew) {
    if (isnew) {
        GameContentDisplayList.innerHTML = "";

        gameslist.forEach(game => 
        {
            GameContentDisplayList.append(CreateGameItem(game));
        })
    } else {
        gameslist.forEach(game => 
            {
                GameContentDisplayList.append(CreateGameItem(game));
            })
    }
}

function CreateGameItem(game) {
    const gameItemLI = document.createElement("li");

    let genrelist = "";
    let ctr = 0;

    game.genres.forEach((genre, idx, arr) =>
    {
        if(ctr < 3)
        {
            genrelist = genrelist + genre.name + ", ";
            ctr = ctr + 1;
        }
        else if (ctr == 3) // find better soloution
        {
            ctr = ctr + 1;
            let remaining = arr.length - 3;
            genrelist = genrelist + "+" + remaining
        }
    })

    gameItemLI.className = "Game_Item";
    gameItemLI.innerHTML = `
    <img
        class="Game_Image"
        src="${game.background_image}"
        alt="Game Image"
    />
    <div class="Game_Info">
       <div class="Game_Info_Top">
            <p class="Game_Platforms">
                Platforms Avalable:
            </p>

            <p class="Game_Metacritic">
                ${game.metacritic}
            </p>
        </div>
        <p class="Game_Title">
            ${game.name}
        </p>
        <div class="Game_Minor_Info">
            <p class="Game_Genre">
                Genre: ${genrelist}
            </p>
            <p class="Game_Release">
                Release: ${game.released}
            </p>
        </div>
    </div>
    `;

    gameItemLI.addEventListener("click", () => {
        GBContent.style.display = "none";
        GameItemPage.style.display = "flex";
    });

    return gameItemLI;
}
