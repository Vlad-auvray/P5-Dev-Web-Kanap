main();

function main () {
    getArticles();
}

//Récupérer les articles depuis l'API

function getArticles() {
    fetch("http://localhost:3000/api/products")
    .then(function (res) {
        return res.json();
    })


    // On place les données de chaque produit dans le DOM
    .then(function (resultatAPI) {
        const articles = resultatAPI;
        console.log(articles);
        for (let article in articles) {
            let productCard = document.createElement("div");
            document.querySelector(".products").appendChild(productCard);
            productCard.classList.add("product");
        }
    }) 
}