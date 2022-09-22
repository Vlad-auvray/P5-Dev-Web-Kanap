let params = new URL(document.location).searchParams;
let id = params.get("id");

const productCardImage = document.querySelector(".item__img img");
const productCardName = document.querySelector("#title");
const productCardDescription = document.querySelector(".item__content__description");
const productCardPrice = document.querySelector("#price");
const productQuantity = document.querySelector(".item__content__settings__quantity");
const colorSelect = document.querySelector("#color-select");



main();

function main() {
    getArticles();
    addToCart();
}

//Récupérer les articles depuis l'API

function getArticles() {
    fetch('http://localhost:3000/api/products/${id}')
    .then(function (response) {
        return response.json();
    })


    // On place les données de chaque produit dans le DOM
    .then(function (resultatAPI) {
        article = resultatAPI;
        productCardName.innerHTML = article.name;
        productCardImage.src = artcile.imageUrl;
        productCardDescription.innerText = article.descrisption;

        //Formater et exprimer le prix en €
        article.price = article.price / 100;
        productCardPrice.innerText = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(article.price);

// Permettre le choix des couleurs en option
        let colorSelect = document.getElementById("color-select");
        for (let i = 0; i < article.colors.length; i++) {
          let option = document.createElement("option");
          option.innerText = article.colors[i];
          colorSelect.appendChild(option);
        }

    }
    )};

