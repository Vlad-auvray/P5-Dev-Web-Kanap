let params = (new URL(document.location)).searchParams;

let id = params.get("id");

const productCardImage = document.querySelector(".item__img");
const productCardName = document.querySelector("#title");
const productCardDescription = document.querySelector("#description");
const productCardPrice = document.querySelector("#price");
const productQuantity = document.querySelector("#quantity");
const colorSelect = document.querySelector("#colors");

let article = {};

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
      article = resultatAPI;
      document.title = article.name;
      const productImageSelector = document.createElement('img');
      productImageSelector.src = article.imageUrl;
      productImageSelector.alt = article.altTxt;
      productCardImage.appendChild(productImageSelector);
      productCardName.innerHTML = article.name;
      productCardDescription.innerText = article.description;

      //Formater et exprimer le prix en €
      article.price = article.price ;
      productCardPrice.innerText = new Intl.NumberFormat("fr-FR", {
        // style: "currency",
        //currency: "EUR",
      }).format(article.price);

      // Permettre le choix des couleurs en option
      // let colorSelect = document.querySelector("#colors");
      for (let i = 0; i < article.colors.length; i++) {
        let option = document.createElement("option");
        option.innerText = article.colors[i];
        colorSelect.appendChild(option);
      }

    }
    )
};



function addToCart() {
  const addToCartBtn = document.querySelector("#addToCart");


  addToCartBtn.addEventListener("click", () => {

    if (colorSelect.value === undefined || colorSelect.value === "") {
      alert("Veuillez choisir une couleur valide.");
      return;
    }

    if (productQuantity.value <= 0 && productQuantity.value < 100) {
      alert("Veuillez choisir une quantité comprise entre 1 et 100.");
      return;
    }


    // ------ Création du produit qui sera ajouté au panier

    let productAdded = {
      id: article._id,
      color: colorSelect.value,
      quantity: parseInt(productQuantity.value),
    };

    let cart = [];

    // Si le localStorage existe, on récupère son contenu, on l'insère dans le tableau arrayProductsInCart, puis on le renvoit vers le localStorage avec le nouveau produit ajouté.
    if (localStorage.getItem("cart") !== null) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    let productFindInCart = false;

    if (cart.length > 0) {
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == article._id && cart[i].color == colorSelect.value) {
          productFindInCart = true;
          if (cart[i].quantity + parseInt(productQuantity.value) > 100) {
            alert("La nouvelle Quantité plus la quantité existante dépasse 100.");
            return;
          }
          cart[i].quantity = cart[i].quantity + parseInt(productQuantity.value);
        }
      }
    }


    if (!productFindInCart || cart.length == 0) {
      cart.push(productAdded);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("La couleur " + colorSelect.value + " de votre produit " + article.name + " a bien été ajouté au panier");

  });


}