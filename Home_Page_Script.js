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

// Creates a unique game page for the given gameID
async function CreateGamePage(gameID) {
    const gameDetailsJson = await fetch(
        `https://api.rawg.io/api/games/${gameID}?key=${APIKEY}`
    );
    const gameDetails = await gameDetailsJson.json();
    console.log(gameDetails);

    let platformlist = "";
    let genrelist = "";
    let developerlist = "";
    let publisherlist = "";
    let taglist = "";

    // Makes a list of the platforms
    gameDetails.platforms.forEach((platform, idx, arr) => {
        if (idx != arr.length - 1) {
            platformlist = platformlist + platform.platform.name + ", ";
        } else {
            platformlist = platformlist + platform.platform.name;
        }
    });

    // Makes a list of the genres
    gameDetails.genres.forEach((genre, idx, arr) => {
        if (idx != arr.length - 1) {
            genrelist = genrelist + genre.name + ", ";
        } else {
            genrelist = genrelist + genre.name;
        }
    });

    // Makes a list of the developers
    gameDetails.developers.forEach((developer, idx, arr) => {
        if (idx != arr.length - 1) {
            developerlist = developerlist + developer.name + ", ";
        } else {
            developerlist = developerlist + developer.name;
        }
    });

    // Makes a list of the publishers
    gameDetails.publishers.forEach((publisher, idx, arr) => {
        if (idx != arr.length - 1) {
            publisherlist = publisherlist + publisher.name + ", ";
        } else {
            publisherlist = publisherlist + publisher.name;
        }
    });

    // Makes a list of the tags
    gameDetails.tags.forEach((tag, idx, arr) => {
        if (idx != arr.length - 1) {
            taglist = taglist + tag.name + ", ";
        } else {
            taglist = taglist + tag.name;
        }
    });

    // Makes a list of All the platforms and there requierments
    const GameItemSystemRequierments = document.createElement("div");

    gameDetails.platforms.forEach((platform, idx, arr) => {
        let platformReq = document.createElement("div");

        if (platform.requirements.minimum == null) {
            platformReq.innerHTML = `
            <h3 class="System_Requierments_Title">
                System requirements for ${platform.platform.name}
            </h3>
            `;
        } else {
            let minimum = platform.requirements.minimum.split(",")
            if (minimum.length === 1){
                minimum = platform.requirements.minimum.split("\n");
            }

            let RequiermentList = document.createElement("ul");
            RequiermentList.className = "Requierment_List";
            minimum.forEach(req => {
                let RequiermentItem = document.createElement("li");
                RequiermentItem.className = "Requierment_Item";

                RequiermentItem.innerHTML = req;

                RequiermentList.append(RequiermentItem);
            })

            platformReq.innerHTML = `
            <h3 class="System_Requierments_Title">
            System requirements for ${platform.platform.name}
            </h3>
            <h4 class="Requierment_Title">Minimum</h4>
            `;
            platformReq.append(RequiermentList);

            if (platform.requirements.recommended != null) {
                let recommended = platform.requirements.recommended.split(",")
                if (recommended.length === 1){
                    recommended = platform.requirements.recommended.split("\n");
                }
                platformReq.innerHTML = platformReq.innerHTML + `<h4 class="Requierment_Title"> Recommended </h4>`

                let RequiermentList = document.createElement("ul");
                RequiermentList.className = "Requierment_List";
                recommended.forEach(req => {
                    let RequiermentItem = document.createElement("li");
                    RequiermentItem.className = "Requierment_Item";

                    RequiermentItem.innerHTML = req;

                    RequiermentList.append(RequiermentItem);
                })

                platformReq.append(RequiermentList);
            }

        }

        GameItemSystemRequierments.append(platformReq);
    });

    // HTML for the game page here it will get populated with the game details from above
    GameItemPage.innerHTML = "";

    const GameItemPageContainer = document.createElement("div");
    GameItemPageContainer.id = "Game_Item_Page_Container";

    GameItemPageContainer.innerHTML = `
    <div class="Background_Art" style="background-image: linear-gradient(to bottom, rgba(15,15,15,0), rgb(21,21,21)),linear-gradient(to bottom, rgba(21,21,21,0.8), rgba(21,21,21,0.5)),url('${gameDetails.background_image}');"></div>
    <h1 class="Game_Item_Title">${gameDetails.name}</h1>
    <div class="Rankings">
        <h3 class="Ranking_Item">
            Achievements count: ${gameDetails.achievements_count}
        </h3>
    </div>
    <div class="Description">
        <div class="About">
            <h3 class="About_Title">About</h3>
            ${gameDetails.description}
        </div>
        <div class="Game_Item_Meta">
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Platforms
                </div>
                <div class="Game_Item_Meta_Text">
                    ${platformlist}
                </div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Genre
                </div>
                <div class="Game_Item_Meta_Text">
                    ${genrelist}
                </div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Release date
                </div>
                <div class="Game_Item_Meta_Text">${gameDetails.released}</div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Developer
                </div>
                <div class="Game_Item_Meta_Text">
                    ${developerlist}
                </div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Publisher
                </div>
                <div class="Game_Item_Meta_Text">
                    ${publisherlist}
                </div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Age rating
                </div>
                <div class="Game_Item_Meta_Text">
                    ${gameDetails.esrb_rating.name}
                </div>
            </div>
            <div class="Game_Item_Meta_Block_Wide">
                <div class="Game_Item_Meta_Title">Tags</div>
                <div class="Game_Item_Meta_Text">
                    ${taglist}
                </div>
            </div>
            <div class="Game_Item_Meta_Block_Wide">
                <div class="Game_Item_Meta_Title">
                    Website
                </div>
                <div class="Game_Item_Meta_Text">
                    ${gameDetails.website}
                </div>
            </div>
        </div>
        <div class="Game_Item_System_Requierments">
            ${GameItemSystemRequierments.innerHTML}
        </div>
    </div>
    `;

    // adding all the html for the game page to the game item page div
    GameItemPage.append(GameItemPageContainer);
}
