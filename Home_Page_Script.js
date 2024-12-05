const Logo = document.querySelector("#Logo");
let gameItemsList;
const GBContent = document.querySelector("#GB_Content");
const GameItemPage = document.querySelector("#Game_Item_Page");

Logo.addEventListener("click", () => 
{
    GBContent.style.display = "flex";
    GameItemPage.style.display = "none";
});

(() => 
{
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