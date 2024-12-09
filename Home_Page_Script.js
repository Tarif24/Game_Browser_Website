// API Variables
const APIKEY = "c893cee9cd204b15a38f977a32547d08";

const Logo = document.querySelector("#Logo");
let gameItemsList;
const GBContent = document.querySelector("#GB_Content");
const GameItemPage = document.querySelector("#Game_Item_Page");

async function InitialAPICall()
{
    try
    {
        const apiCall = await fetch(`https://api.rawg.io/api/games?key=${APIKEY}&page=1&page_size=30`);
        const jsontodata = await apiCall.json();
        console.log(jsontodata);
    }
    catch(error)
    {
        console.log(error);
    }
    
}

Logo.addEventListener("click", () => 
{
    GBContent.style.display = "flex";
    GameItemPage.style.display = "none";
});

(() => 
{
    InitialAPICall();

    gameItemsList = document.querySelectorAll(".Game_Item");

    gameItemsList.forEach( gameItem => 
    {
        gameItem.addEventListener("click", () => 
        {
            GBContent.style.display = "none";
            GameItemPage.style.display = "flex"
        });
    })
})();