// pour différancier la page confirmation et panier
const page = document.location.href;


if (page.match("cart")) {
  fetch("http://localhost:3000/api/products")
  .then(function (response) {
    return response.json();
  })
    .then((response) => {
        console.log(response);
        // appel de la fonction displayCart
        displayCart(response);
    })
   // .catch((err) => {
   //     document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
   //     console.log("erreur 404, sur ressource api: " + err);
 //   });
//  } else {
 //   console.log("sur page confirmation");
  
}

  // Conditions d'affichage du panier
  // Récupération du LS
// Si le panier contien un élément (différent de 0), alors on peut créer une corresspondance clef/valeur

  function displayCart(index) {

  let panier = JSON.parse(localStorage.getItem("cart"));

  if(panier && panier.length != 0) {
  for (let article of panier){
    console.log(article);
    console.log(panier);
    // création du dadaset qui nous permettra ensuite d'afficher le panier
    for( let g = 0, h = index.length; g < h; g++) {
      if (article._id === index[g]._id){
        article.name = index[g].name;
        article.price = index[g].price;
        article.image = index[g].imageUrl;
        article.description = index[g].description;
        article.altTxt = index[g].altTxt;
      }
    } 
  }
display(panier);

} else{
  document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
      "Vous n'avez pas d'article dans votre panier";
}
 // reste à l'écoute grâce aux fonctions suivantes pour modifier l'affichage
 modifQuantité();
 //suppression();
}
  
// Afficher le panier
function display(indexed) {
let cartZone = document.querySelector("#cart__items");
cartZone.innerHTML += indexed.map((article)=>
`<article class="cart__item" data-id="${article._id}" data-couleur="${article.color}" data-quantité="${article.quantity}" data-prix="${article.price}"> 
<div class="cart__item__img">
  <img src="${article.image}" alt="${article.altTxt}">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__titlePrice">
    <h2>${article.name}</h2>
    <span>couleur : ${article.color}</span>
    <p data-prix="${article.price}">${article.price} €</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantité}">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem" data-id="${article._id}" data-couleur="${article.color}">Supprimer</p>
    </div>
  </div>
</div>
</article>`
).join("");
totalProduit();
}
  
// Définition de la fonction de modification de quantité d'article dans le panier

function modifQuantité() {
  const cart = document.querySelectorAll(".cart__item");
 
  // On capte un éventuel clic sur le bouton 
  cart.forEach((cart) => {
    cart.addEventListener("change", (eq) => {

      // Vérification de la valeur concernée
      let panier = JSON.parse(localStorage.getItem("cart"));
  
      //on crée la boucle qui va modifier la valeur quantity
      for (article of panier)
        if (
          article._id === cart.dataset.id &&
          cart.dataset.color === article.color
        ) {
          article.quantity = eq.target.value;
          localStorage.cart = JSON.stringify(panier);
     // mise à jour du dataset     
          cart.dataset.quantity = eq.target.value;
  // puis actualisation de la fonction totalProduit
          totalProduit();
        }
    });
  });
}

// ajout de la fonction de suppression

function suppression() {
  const cartDelete = document.querySelectorAll(".cart__item .deleteItem");

  cartDelete.forEach((cartDelete) => {
 // On capte un éventuel clic sur le bouton 
    cartDelete.addEventListener("click", () => {
 // Appel du LS    
      let panier = JSON.parse(localStorage.getItem("cart"));
      for (let d = 0, c = panier.length; d < c; d++)
      if (
        panier[d]._id === cartDelete.dataset.id &&
        panier[d].coulor === cartDelete.dataset.color
      ) {
  // déclaration de la variable
        const num = [d]; 
  // création du panier actualisé ...
        let newCart = JSON.parse(localStorage.getItem("cart"));
  //... qui enlève 1 item de sa version précédente
        newCart.splice(num, 1);
  // affichage du nouveau panier : s'il n'y a rien alors panier vide, sinon on affiche le nouveau panier et on recharge
        if (newCart && newCartlength == 0) {
  
          document.querySelector("#totalQuantity").innerHTML = "0";
          document.querySelector("#totalPrice").innerHTML = "0";
          document.querySelector("h1").innerHTML =
            "Vous n'avez pas d'article dans votre panier";
    }


      localStorage.cart = JSON.stringify(newCart);
      totalProduit();

      return location.reload();
    }
  });
});
}


function totalProduit () {

  let totalArticle = 0; 

  let totalPrice = 0; 

  const cart = document.querySelectorAll(".cart__item");
// pour tous les éléments du panier
  cart.forEach((cart) => {
    // on liste les quantité des articles du dataset
    totalArticle += JSON.parse(cart.dataset.quantity); 
// on calcul le prix sur la base du dataset
    totalPrice += cart.dataset.quantity * cart.dataset.price; 

  });
// définition de l'endroit où le tout s'affichera
  document.getElementById("totalQuantity").textContent = totalArticle; 

  document.getElementById("totalPrice").textContent = totalPrice;
}