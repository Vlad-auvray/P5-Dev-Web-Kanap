let params = (new URL(document.location)).searchParams;

let id = params.get("id");

const productCardImage = document.querySelector(".item__img");
const productCardName = document.querySelector("#title");
const productCardDescription = document.querySelector("#description");
const productCardPrice = document.querySelector("#price");
const productQuantity = document.querySelector("#quantity");



main();

function main() {
    getArticles();
    addToCart();
}

//Récupérer les articles depuis l'API

function getArticles() {
    fetch(`http://localhost:3000/api/products/${id}`)
    .then(function (response) {
        return response.json();
    })


    // On place les données de chaque produit dans le DOM
    .then(function (resultatAPI) {
        const articles = resultatAPI;
        productCardImage.src = articles.imageUrl;
        productCardName.innerHTML = articles.name;
        productCardDescription.innerText = articles.description;

        //Formater et exprimer le prix en €
        articles.price = articles.price / 100;
        productCardPrice.innerText = new Intl.NumberFormat("fr-FR", {
         // style: "currency",
          //currency: "EUR",
        }).format(articles.price);

// Permettre le choix des couleurs en option
        let colorSelect = document.querySelector("#colors");
        for (let i = 0; i < articles.colors.length; i++) {
          let option = document.createElement("option");
          option.innerText = articles.colors[i];
          colorSelect.appendChild(option);
        }

    }
    )};

  

    function addToCart() {
      const addToCartBtn = document.querySelector("#addToCart");
    

      addToCartBtn.addEventListener("click", () => {
        if (productQuantity.value > 0 && productQuantity.value < 100) {
          // ------ Création du produit qui sera ajouté au panier
          let productAdded = {
            name: productCardName.innerHTML,
            price: parseFloat(productCardPrice.innerHTML),
            quantity: parseFloat(document.querySelector("#quantity").value),
            _id: id,
          };
          let arrayProductsInCart = [];
      
          // Si le localStorage existe, on récupère son contenu, on l'insère dans le tableau arrayProductsInCart, puis on le renvoit vers le localStorage avec le nouveau produit ajouté.
          if (localStorage.getItem("product") !== null) {
            arrayProductsInCart = JSON.parse(localStorage.getItem("product"));
            
            
            // Si le LS est vide, on le crée avec le produit ajouté
          } 
            arrayProductsInCart.push(productAdded);
            localStorage.setItem("product", JSON.stringify(arrayProductsInCart));
          
                  }
      });

    }