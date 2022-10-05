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
    .catch((err) => {
        document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api: " + err);
    });
  } else {
    console.log("sur page confirmation");
  
}

  // Conditions d'affichage du panier
  // Récupération du LS
// Si le panier contien un élément (différent de 0), alors on peut créer une corresspondance clef/valeur

  function displayCart(index) {

  let panier = JSON.parse(localStorage.getItem("cart"));

  if(panier.length == null) {
  for (let article of panier){
    console.log(article);
    console.log(panier);
    for( let g = 0, h = index.length; g < h; g++) {
      if (article._id === index[g]._id){
        panier.name = index[g].name;
        panier.price = index[g].price;
        panier.image = index[g].imageUrl;
        panier.description = index[g].description;
        panier.altTxt = index[g].altTxt;
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
// modifQuantité();
 //suppression();
}
  
// Afficher le panier
function display(indexed) {
let cartZone = document.querySelector("#cart__items");
cartZone.innerHTML += indexed.map((panier)=>
`<article class="cart__item" data-id="${panier._id}" data-couleur="${panier.couleur}" data-quantité="${panier.quantité}" data-prix="${panier.prix}"> 
<div class="cart__item__img">
  <img src="${panier.image}" alt="${panier.alt}">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__titlePrice">
    <h2>${panier.name}</h2>
    <span>couleur : ${panier.couleur}</span>
    <p data-prix="${panier.prix}">${panier.prix} €</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${panier.quantité}">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem" data-id="${panier._id}" data-couleur="${panier.couleur}">Supprimer</p>
    </div>
  </div>
</div>
</article>`
).join("");
totalProduit();
}
    
  