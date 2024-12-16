// API Variables
const APIKEY = "c893cee9cd204b15a38f977a32547d08";
const HOMEQUERY = `https://api.rawg.io/api/games?key=${APIKEY}&page_size=32&page=1&ordering=released,metacritic`;

let savedParams = [];
let savedParamsName = new Map();

// Html elements
const Logo = document.querySelector("#Logo");
const SearchInput = document.querySelector("#GB_Header form");
const GBContent = document.querySelector("#GB_Content");
const GameItemPage = document.querySelector("#Game_Item_Page");
const GameContentDisplayList = document.querySelector(
    "#GB_Content_Display_List"
);
const GameContentTitle = document.querySelector("#GB_Content_Title");
const PlatformFilter = document.querySelector("#Platform_Filter");

let allPlatforms = new Map();

// INITILIZING

// calls all the initializing functions
(async () => {
    await LoadAllPlatforms();

    InitilizeQueryParams();

    InitialAPICall();
})();

function InitialAPICall() {
    UpdateGameContentDisplayHome();
}

// Initial Event listeners
Logo.addEventListener("click", () => {
    UpdateGameContentDisplayHome();
});

// Searchbar functionality
SearchInput.addEventListener("submit", async (event) => {
    event.preventDefault();
    let input = document.querySelector("#Search_Input");

    if (input.value.trim() === "") {
        return;
    }

    try {
        savedParams[savedParamsName.get("tags")].isActive = false;
        savedParams[savedParamsName.get("genres")].isActive = false;
        savedParams[savedParamsName.get("search")].isActive = true;

        const apiCall = await fetch(
            ConstructQuery(
                "1",
                "released,metacritic",
                "-",
                "-",
                "-",
                input.value.trim()
            )
        );

        const jsontodata = await apiCall.json();
        UpdateGameContentDisplay(jsontodata.results, true);
    } catch (error) {
        console.log(error);
    }
    GameContentTitle.innerText = `Search Result For: ${input.value.trim()}`;
    GBContent.style.display = "flex";
    GameItemPage.style.display = "none";

    input.value = "";
});

document.querySelector("#Sidebar #Home").addEventListener("click", () => {
    UpdateGameContentDisplayHome();
});

document.querySelector("#Platform_Filter").addEventListener("change", async () => {
    try {
        const apiCall = await fetch(
            ConstructQuery("", "", String(allPlatforms.get(PlatformFilter.value)))
        );
        const jsontodata = await apiCall.json();
        UpdateGameContentDisplay(jsontodata.results, true);
    } catch (error) {
        console.log(error);
    }
});

// Creates an event listener for all genres to call the UpdateGameContentDisplayGenre() on click
(() => {
    let genrelist = document.querySelectorAll(
        "#Genre_List .Sidebar_Group_Item"
    );

    genrelist.forEach((genre) => {
        let genreText = genre.querySelector("h3").innerText;
        genreText = genreText.toLowerCase();
        genreText = genreText.replaceAll(" ", "");

        genre.addEventListener("click", () => {
            UpdateGameContentDisplayGenre(
                genreText,
                genre.querySelector("h3").innerText
            );
        });
    });
})();

// HELPER FUNCTIONS

function InitilizeQueryParams() {
    savedParamsName.set("page", 0);
    savedParamsName.set("ordering", 1);
    savedParamsName.set("platforms", 2);
    savedParamsName.set("tags", 3);
    savedParamsName.set("genres", 4);
    savedParamsName.set("search", 5);

    savedParams.push({ value: "1", isActive: true });
    savedParams.push({ value: "released,metacritic", isActive: true });
    savedParams.push({
        value: String(allPlatforms.get(PlatformFilter.value)),
        isActive: true,
    });
    savedParams.push({ value: "", isActive: false });
    savedParams.push({ value: "", isActive: false });
    savedParams.push({ value: "", isActive: false });

    savedParams[savedParamsName.get("tags")].isActive = false;
    savedParams[savedParamsName.get("genres")].isActive = false;
    savedParams[savedParamsName.get("search")].isActive = false;
}

function ConstructQuery(
    page = "",
    ordering = "",
    platforms = "",
    tags = "",
    genres = "",
    search = ""
) {
    let params = [page, ordering, platforms, tags, genres, search];
    let names = [
        "&page=",
        "&ordering=",
        "&platforms=",
        "&tags=",
        "&genres=",
        "&search=",
    ];

    let query = `https://api.rawg.io/api/games?key=${APIKEY}&page_size=32`;

    params.forEach((param, idx) => {
        if (param == "") {
            param = savedParams[idx].value;
        } else if (param != "-") {
            savedParams[idx].value = param;
        }

        if (param != "-" && savedParams[idx].isActive) {
            query = query + names[idx] + param;
        }
    });

    return query;
}

async function LoadAllPlatforms() {
    const apiCall = await fetch(
        `https://api.rawg.io/api/platforms?key=${APIKEY}`
    );
    const jsontodata = await apiCall.json();

    for (let i = 0; i < jsontodata.results.length - 28; i++) {
        allPlatforms.set(jsontodata.results[i].name, jsontodata.results[i].id);

        PlatformFilter.innerHTML =
            PlatformFilter.innerHTML +
            `<option value="${jsontodata.results[i].name}">${jsontodata.results[i].name}</option>`;
    }
}

async function UpdateGameContentDisplayHome() {
    savedParams[savedParamsName.get("tags")].isActive = false;
    savedParams[savedParamsName.get("genres")].isActive = false;
    savedParams[savedParamsName.get("search")].isActive = false;

    try {
        const apiCall = await fetch(
            ConstructQuery("1", "released,metacritic", "-")
        );
        const jsontodata = await apiCall.json();
        UpdateGameContentDisplay(jsontodata.results, true);
    } catch (error) {
        console.log(error);
    }
    GameContentTitle.innerText = "Best Games";
    GBContent.style.display = "flex";
    GameItemPage.style.display = "none";
}

function UpdateGameContentDisplay(gameslist, isnew = true) {
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

    GBContent.style.display = "flex";
    GameItemPage.style.display = "none";
}

function CreateGameItem(game) {
    const gameItemLI = document.createElement("li");

    let genrelist = "";
    let platformlist = "";
    let ctr = 0;

    game.genres.forEach((genre, idx, arr) => {
        if (ctr < 3) {
            if (idx != arr.length - 1) {
                genrelist = genrelist + genre.name + ", ";
            } else {
                genrelist = genrelist + genre.name;
            }
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
            if (idx != arr.length - 1) {
                platformlist = platformlist + platform.platform.name + ", ";
            } else {
                platformlist = platformlist + platform.platform.name;
            }
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
                ${game.metacritic != null ? game.metacritic : "N/A"}
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
        window.scrollTo(0, 0, "instant");
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
            let minimum = platform.requirements.minimum.split(",");
            if (minimum.length === 1) {
                minimum = platform.requirements.minimum.split("\n");
            }

            let RequiermentList = document.createElement("ul");
            RequiermentList.className = "Requierment_List";
            minimum.forEach((req) => {
                let RequiermentItem = document.createElement("li");
                RequiermentItem.className = "Requierment_Item";

                RequiermentItem.innerHTML = req;

                RequiermentList.append(RequiermentItem);
            });

            platformReq.innerHTML = `
            <h3 class="System_Requierments_Title">
            System requirements for ${platform.platform.name}
            </h3>
            <h4 class="Requierment_Title">Minimum</h4>
            `;
            platformReq.append(RequiermentList);

            if (platform.requirements.recommended != null) {
                let recommended = platform.requirements.recommended.split(",");
                if (recommended.length === 1) {
                    recommended = platform.requirements.recommended.split("\n");
                }
                platformReq.innerHTML =
                    platformReq.innerHTML +
                    `<h4 class="Requierment_Title"> Recommended </h4>`;

                let RequiermentList = document.createElement("ul");
                RequiermentList.className = "Requierment_List";
                recommended.forEach((req) => {
                    let RequiermentItem = document.createElement("li");
                    RequiermentItem.className = "Requierment_Item";

                    RequiermentItem.innerHTML = req;

                    RequiermentList.append(RequiermentItem);
                });

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
    <div class="Background_Art" style="background-image: linear-gradient(to bottom, rgba(15,15,15,0), rgb(21,21,21)),linear-gradient(to bottom, rgba(21,21,21,0.8), rgba(21,21,21,0.5)),url('${
        gameDetails.background_image
    }');"></div>
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
                    ${
                        gameDetails.esrb_rating != null
                            ? gameDetails.esrb_rating.name
                            : "N/A"
                    }
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

async function UpdateGameContentDisplayGenre(genre = "", title = "") {
    savedParams[savedParamsName.get("tags")].isActive = false;
    savedParams[savedParamsName.get("genres")].isActive = true;
    savedParams[savedParamsName.get("search")].isActive = false;

    let apiCall = await fetch(ConstructQuery("1", "metacritic,released", "-", "", genre));
    let jsontodata = await apiCall.json();

    if (jsontodata.results.length == 0) {
        savedParams[savedParamsName.get("tags")].isActive = true;
        savedParams[savedParamsName.get("genres")].isActive = false;

        apiCall = await fetch(ConstructQuery("1", "metacritic,released", "-", genre));
        jsontodata = await apiCall.json();
    }

    GameContentTitle.innerText = title;

    UpdateGameContentDisplay(jsontodata.results, true);

    GBContent.style.display = "flex";
    GameItemPage.style.display = "none";
}
