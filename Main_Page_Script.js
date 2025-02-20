// API Variables
const APIKEY = "c893cee9cd204b15a38f977a32547d08";

let savedParams = [];
let savedParamsName = new Map();

// Html elements
const GBContent = document.querySelector("#GB_Content");
const GameItemPage = document.querySelector("#Game_Item_Page");
const GameContentDisplayList = document.querySelector(
    "#GB_Content_Display_List"
);
const GameContentTitle = document.querySelector("#GB_Content_Title");
const PlatformFilter = document.querySelector("#Platform_Filter");
const OrderFilter = document.querySelector("#Order_Filter");

let allPlatforms = new Map();
let listOfGames = [];

// INITILIZING

// calls all the initializing functions
(async () => {

    await LoadAllPlatforms();

    InitilizeQueryParams();

    InitialAPICall();

    HamburgerMenuSetup()
})();

function InitialAPICall() {
    UpdateGameContentDisplayHome();
}

// Initial Event listeners
document.querySelector("#Logo").addEventListener("click", () => {
    UpdateGameContentDisplayHome();
});

// Searchbar functionality
document.querySelector("#GB_Header form").addEventListener("submit", async (event) => {
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
                "",
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

    OrderFilter.selectedIndex = 0;
    PlatformFilter.selectedIndex = 0;
    savedParams[savedParamsName.get("platforms")].value = "4";
    savedParams[savedParamsName.get("ordering")].value = "released,metacritic";

    input.value = "";
});

document.querySelectorAll(".Home").forEach(home => {
    home.addEventListener("click", () => {
    UpdateGameContentDisplayHome();
    if (window.innerWidth < 1200){
        ToggleMenu();
    }
    })
});

// Changes the order of items displayed based on the order filter
document.querySelector("#Order_Filter").addEventListener("change", async () => {
    try {
        const apiCall = await fetch(
            ConstructQuery("", OrderFilter.value, "")
        );
        const jsontodata = await apiCall.json();
        UpdateGameContentDisplay(jsontodata.results, true);
    } catch (error) {
        console.log(error);
    }
});

// Changes the order of items displayed based on the platfrom filter
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

document.querySelector("#Show_More").addEventListener("click", async () => {
    let pageNum = Number(savedParams[savedParamsName.get("page")].value) + 1;
    savedParams[savedParamsName.get("page")].value =  pageNum;
    try {
        const apiCall = await fetch(
            ConstructQuery(pageNum)
        );
        const jsontodata = await apiCall.json();
        UpdateGameContentDisplay(jsontodata.results, false);
    } catch (error) {
        console.log(error);
        document.querySelector("#Show_More").style.display = "none";
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

            if (window.innerWidth < 1200){
                ToggleMenu();
            }
        });
    });
})();

// HELPER FUNCTIONS

function HamburgerMenuSetup(){
     // Closes hamburger menu when clicked off screen
     document.addEventListener( "click", (e) => {
         if(e.target.classList == "Hamburger_Menu_Back open") {
             ToggleMenu();
         }
     });
}

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
        } else if (param != "-" && idx != savedParamsName.get("page")) {
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
            ConstructQuery("1", "released,metacritic", "")
        );
        const jsontodata = await apiCall.json();
        UpdateGameContentDisplay(jsontodata.results, true);
    } catch (error) {
        console.log(error);
    }
    GameContentTitle.innerText = "Best Games";
    GBContent.style.display = "flex";
    GameItemPage.style.display = "none";
    
    OrderFilter.selectedIndex = 0;
    PlatformFilter.selectedIndex = 0;
    savedParams[savedParamsName.get("platforms")].value = "4";
    savedParams[savedParamsName.get("ordering")].value = "released,metacritic";
}

function UpdateGameContentDisplay(gameslist, isnew = true) {
    if (isnew) {
        listOfGames = [];
        GameContentDisplayList.innerHTML = "";
    }

    gameslist.forEach((game) => {

        if (listOfGames.indexOf(game.id) == -1) {
            GameContentDisplayList.append(CreateGameItem(game));
            listOfGames.push(game.id);
        }
        
    });

    GBContent.style.display = "flex";
    GameItemPage.style.display = "none";
    document.querySelector("#Show_More").style.display = "flex";
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
    <div class="Game_Image_Video_Container">
        <img
            class="Game_Image"
            src="${game.background_image != null? game.background_image : "assets/no-image-icon.svg"}"
            alt="Game Image"
        />

    </div>
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
                Release: ${game.released != null ? game.released : "0000-00-00"}
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

    gameItemLI.querySelector(".Game_Image_Video_Container").addEventListener("mouseover", (event) => {
        event.target.querySelector(".Game_Image").style.display = "none";
    })

    gameItemLI.querySelector(".Game_Image_Video_Container").addEventListener("mouseleave", (event) => {
        event.target.querySelector(".Game_Image").style.display = "static";
    })

    return gameItemLI;
}

// Creates a unique game page for the given gameID
async function CreateGamePage(gameID) {
    const gameDetailsJson = await fetch(
        `https://api.rawg.io/api/games/${gameID}?key=${APIKEY}`
    );
    const gameDetails = await gameDetailsJson.json();

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
                    ${platformlist != "" ? platformlist : "N/A"}
                </div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Genre
                </div>
                <div class="Game_Item_Meta_Text">
                    ${genrelist != "" ? genrelist : "N/A"}
                </div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Release date
                </div>
                <div class="Game_Item_Meta_Text">${gameDetails.released != null ? gameDetails.released : "0000-00-00"}</div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Developer
                </div>
                <div class="Game_Item_Meta_Text">
                    ${developerlist != "" ? developerlist : "N/A"}
                </div>
            </div>
            <div class="Game_Item_Meta_Block">
                <div class="Game_Item_Meta_Title">
                    Publisher
                </div>
                <div class="Game_Item_Meta_Text">
                    ${publisherlist != "" ? publisherlist : "N/A"}
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
                    ${taglist != "" ? taglist : "N/A"}
                </div>
            </div>
            <div class="Game_Item_Meta_Block_Wide">
                <div class="Game_Item_Meta_Title">
                    Website
                </div>
                <div class="Game_Item_Meta_Text">
                    ${gameDetails.website != "" ? gameDetails.website : "N/A"}
                </div>
            </div>
        </div>
        <div class="Game_Item_System_Requierments">
            ${GameItemSystemRequierments.innerHTML}
        </div>
    </div>

    <div class="Back_Container">
        <h2 class="Back">Back</h1>
    </div>
    `;

    // adding all the html for the game page to the game item page div
    GameItemPage.append(GameItemPageContainer);

    document.querySelector(".Back").addEventListener("click", () => {
        GBContent.style.display = "flex";
        GameItemPage.style.display = "none";
    });
}

async function UpdateGameContentDisplayGenre(genre = "", title = "") {
    savedParams[savedParamsName.get("tags")].isActive = false;
    savedParams[savedParamsName.get("genres")].isActive = true;
    savedParams[savedParamsName.get("search")].isActive = false;

    let apiCall = await fetch(ConstructQuery("1", "metacritic,released", "", "", genre));
    let jsontodata = await apiCall.json();

    if (jsontodata.results.length == 0) {
        savedParams[savedParamsName.get("tags")].isActive = true;
        savedParams[savedParamsName.get("genres")].isActive = false;

        apiCall = await fetch(ConstructQuery("1", "metacritic,released", "", genre));
        jsontodata = await apiCall.json();
    }

    GameContentTitle.innerText = title + " Games";

    UpdateGameContentDisplay(jsontodata.results, true);

    OrderFilter.selectedIndex = 0;
    PlatformFilter.selectedIndex = 0;
    savedParams[savedParamsName.get("platforms")].value = "4";
    savedParams[savedParamsName.get("ordering")].value = "released,metacritic";

    GBContent.style.display = "flex";
    GameItemPage.style.display = "none";
}

function ToggleMenu()
{
    const menu = document.querySelector(".Hamburger_Menu_Links");
    const icon = document.querySelector(".Hamburger_Icon");
    const back = document.querySelector(".Hamburger_Menu_Back");
    const body = document.querySelector("body");
    
    window.scrollTo(0, 0, "instant");
    menu.classList.toggle("open");
    icon.classList.toggle("Open_Icon");
    back.classList.toggle("open");
    body.classList.toggle("Stop_Scroll");

    if (back.classList == "Hamburger_Menu_Back open") {
        back.style.width = "100vw"
        back.style.height = "100vh"
    } else{
        back.style.width = "0vw"
        back.style.height = "0vh"
    }
}

