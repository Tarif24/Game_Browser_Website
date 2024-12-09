// API Variables
const APIKEY = "c893cee9cd204b15a38f977a32547d08";

// Html elements
const Logo = document.querySelector("#Logo");
const GBContent = document.querySelector("#GB_Content");
const GameItemPage = document.querySelector("#Game_Item_Page");
const GameContentDisplayList = document.querySelector(
    "#GB_Content_Display_List"
);

// INITILIZING
async function InitialAPICall() {
    try {
        const apiCall = await fetch(
            `https://api.rawg.io/api/games?key=${APIKEY}&page=1&page_size=32&ordering=released,metacritic`
        );
        const jsontodata = await apiCall.json();
        console.log(jsontodata);
        UpdateGameContentDisplay(jsontodata.results, true);
    } catch (error) {
        console.log(error);
    }
}

// Initial Event listeners
Logo.addEventListener("click", () => {
    GBContent.style.display = "flex";
    GameItemPage.style.display = "none";
});

// calls all the initializing functions
(() => {
    InitialAPICall();
})();

// HELPER FUNCTIONS

function UpdateGameContentDisplay(gameslist, isnew) {
    if (isnew) {
        GameContentDisplayList.innerHTML = "";

        gameslist.forEach((game) => {
            GameContentDisplayList.append(CreateGameItem(game));
        });
    } else {
        gameslist.forEach((game) => {
            GameContentDisplayList.append(CreateGameItem(game));
        });
    }
}

function CreateGameItem(game) {
    const gameItemLI = document.createElement("li");

    let genrelist = "";
    let platformlist = "";
    let ctr = 0;

    game.genres.forEach((genre, idx, arr) => {
        if (ctr < 3) {
            genrelist = genrelist + genre.name + ", ";
            ctr = ctr + 1;
        } else if (ctr == 3) {
            // find better soloution
            ctr = ctr + 1;
            let remaining = arr.length - 3;
            genrelist = genrelist + "+" + remaining;
        }
    });

    ctr = 0;

    game.platforms.forEach((platform, idx, arr) => {
        if (ctr < 2) {
            platformlist = platformlist + platform.platform.name + ", ";
            ctr = ctr + 1;
        } else if (ctr == 2) {
            // find better soloution
            ctr = ctr + 1;
            let remaining = arr.length - 2;
            platformlist = platformlist + "+" + remaining;
        }
    });

    gameItemLI.setAttribute("gameid", game.id);
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
                ${platformlist}
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
        CreateGamePage(game.id);
        GBContent.style.display = "none";
        GameItemPage.style.display = "flex";
    });

    return gameItemLI;
}

async function CreateGamePage(gameID) {
    const gameDetailsJson = await fetch(
        `https://api.rawg.io/api/games/${gameID}?key=${APIKEY}`
    );
    const gameDetails = await gameDetailsJson.json();
    console.log(gameDetails);

    GameItemPage.innerHTML = "";

    const GameItemPageContainer = document.createElement("div");
    GameItemPageContainer.id = "Game_Item_Page_Container";

    GameItemPageContainer.innerHTML = `
    <div class="Background_Art" style="background-image: linear-gradient(to bottom, rgba(15,15,15,0), rgb(21,21,21)),linear-gradient(to bottom, rgba(21,21,21,0.8), rgba(21,21,21,0.5)),url('${gameDetails.background_image}');"></div>
    <h1 class="Game_Item_Title">Hollow Knight: Silksong</h1>
    <div class="Rankings">
        <h3 class="Ranking_Item Genre_Ranking">
            Platformer: #100
        </h3>
        <h3 class="Ranking_Item Year_Ranking">
            Top 2024: #100
        </h3>
    </div>
    <div class="Description">
        <div class="About">
            <h3 class="About_Title">About</h3>
            <p class="About_Text">
                Hollow Knight: Silksong is the epic sequel
                to Hollow Knight, the epic action-adventure
                of bugs and heroes. As the lethal hunter
                Hornet, journey to all-new lands, discover
                new powers, battle vast hordes of bugs and
                beasts and uncover ancient secrets tied to
                your nature and your past.
            </p>
        </div>
        <div class="Game_Item_Meta">
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Platforms
                </div>
                <div class="Game_Item_Meta_Text">
                    Linux, PC, macOS, Nintendo Switch
                </div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Genre
                </div>
                <div class="Game_Item_Meta_Text">
                    Action, Adventure, Indie, Platformer
                </div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Release date
                </div>
                <div class="Game_Item_Meta_Text">TBA</div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Developer
                </div>
                <div class="Game_Item_Meta_Text">
                    Team Cherry
                </div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Publisher
                </div>
                <div class="Game_Item_Meta_Text">
                    Team Cherry
                </div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Age rating
                </div>
                <div class="Game_Item_Meta_Text">
                    Not rated
                </div>
            </div>
            <div class="Game_Item_Meta_Block_Wide">
                <div class="Game_Item_Meta_Title">Tags</div>
                <div class="Game_Item_Meta_Text">
                    Singleplayer, Full controller support,
                    Great Soundtrack, Story Rich, 2D,
                    Difficult, Exploration,
                    Action-Adventure, Dark Fantasy, Side
                    Scroller, Metroidvania, Hand-drawn,
                    Gothic
                </div>
            </div>
            <div class="Game_Item_Meta_Block_Wide">
                <div class="Game_Item_Meta_Title">
                    Website
                </div>
                <div class="Game_Item_Meta_Text">
                    http://hollowknightsilksong.com/
                </div>
            </div>
        </div>
        <div class="Game_Item_System_Requierments">
            <div class="Linux">
                <h3 class="System_Requierments_Title">
                    System requirements for Linux
                </h3>
            </div>
            <div class="PC">
                <h3 class="System_Requierments_Title">
                    System requirements for PC
                </h3>
                <h4 class="Requierment_Title">Minimum</h4>
                <ul class="Requierment_List">
                    <li class="Requierment_Item">
                        OS: Windows 7
                    </li>
                    <li class="Requierment_Item">
                        Processor: Intel Core 2 Duo E5200
                    </li>
                    <li class="Requierment_Item">
                        Memory: 4 GB RAM
                    </li>
                    <li class="Requierment_Item">
                        Graphics: GeForce 9800GTX+ (1GB)
                    </li>
                    <li class="Requierment_Item">
                        DirectX: Version 10
                    </li>
                    <li class="Requierment_Item">
                        Storage: 9 GB available space
                    </li>
                    <li class="Requierment_Item">
                        Additional Notes: 1080p, 16:9
                        recommended
                    </li>
                </ul>
                <h4 class="Requierment_Title">
                    Recommended
                </h4>
                <ul class="Requierment_List">
                    <li class="Requierment_Item">
                        OS: Windows 10
                    </li>
                    <li class="Requierment_Item">
                        Processor: Intel Core i5
                    </li>
                    <li class="Requierment_Item">
                        Memory: 8 GB RAM
                    </li>
                    <li class="Requierment_Item">
                        Graphics: GeForce GTX 560+
                    </li>
                    <li class="Requierment_Item">
                        DirectX: Version 10
                    </li>
                    <li class="Requierment_Item">
                        Storage: 9 GB available space
                    </li>
                    <li class="Requierment_Item">
                        Additional Notes: 1080p, 16:9
                        recommended
                    </li>
                </ul>
            </div>
            <div class="MacOS">
                <h3 class="System_Requierments_Title">
                    System requirements for MacOS
                </h3>
            </div>
            <div class="Nintendo">
                <h3 class="System_Requierments_Title">
                    System requirements for Nintendos
                </h3>
            </div>
        </div>
    </div>
    `;

    GameItemPage.append(GameItemPageContainer);
}
