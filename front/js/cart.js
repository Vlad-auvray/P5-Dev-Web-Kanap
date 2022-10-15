// pour différancier la page confirmation et panier
const page = document.location.href;

const panier = JSON.parse(localStorage.getItem("cart"));


if (page.match("cart")) {
  fetch("http://localhost:3000/api/products")
    .then(function (response) {
      return response.json();
    })
    .then((response) => {
      //console.log(response);
      // appel de la fonction displayCart
      displayCart(response);
    })
    .catch((err) => {
      document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
      console.log("Erreur 404, sur ressource api: " + err);
    });
} else {
  console.log("Sur page confirmation");
}

// Conditions d'affichage du panier
// Récupération du LS
// Si le panier contien un élément (différent de 0), alors on peut créer une corresspondance clef/valeur
function displayCart(products) {

  if (panier && panier.length > 0) {
    for (let article of panier) {
      // création du dadaset qui nous permettra ensuite d'afficher le panier
      for (let product of products) {
        if (article.id === product._id) {
          product = {
            ...product,
            color: article.color,
            quantity: article.quantity
          }
          display(product);
        }
      }
    }
  } else {
    //   document.querySelector("#totalQuantity").innerHTML = "0";
    //   document.querySelector("#totalPrice").innerHTML = "0";
    //   document.querySelector("h1").innerHTML =
    //     "Vous n'avez pas d'article dans votre panier";
  }
  // reste à l'écoute grâce aux fonctions suivantes pour modifier l'affichage
  modifQuantité();
  suppression();
  
}

// Afficher le panier
function display(product) {
  let cartZone = document.querySelector("#cart__items");
  cartZone.innerHTML +=
    `<article class="cart__item" data-id="${product._id}" data-couleur="${product.color}" data-quantité="${product.quantity}" data-prix="${product.price}"> 
        <div class="cart__item__img">
          <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__titlePrice">
            <h2>${product.name}</h2>
            <span>Couleur : ${product.color}</span>
            <p data-prix="${product.price}">Prix unitaire: ${product.price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem" data-id="${product._id}" data-couleur="${product.color}">Supprimer</p>
            </div>
          </div>
        </div>
    </article>`;
  //totalProduit();
 
}

// Définition de la fonction de modification de quantité d'article dans le panier
function modifQuantité(product) {
  const cart = document.querySelectorAll(".cart__item");

  // On capte un éventuel clic sur le bouton 
  cart.forEach((cart) => {

    const itemQuantitySelector = cart.querySelector(".itemQuantity");

    itemQuantitySelector.addEventListener("change", (e) => {

      e.preventDefault();

      console.log("Super je viens de modifier la quantité du mon produit a " + itemQuantitySelector.value);
    
    
      let panier = JSON.parse(localStorage.getItem("cart"));
     for(let product of panier) {
       for (let i = 0; i < panier.length ; i++){
        if(panier[i].id == product.id && panier[i].color == product.color) {
           panier[i].quantity = parseInt(itemQuantitySelector.value);
             localStorage.cart = JSON.stringify(panier);
          return location.reload();
      }
     }}
    

      // // Vérification de la valeur concernée
      // let panier = JSON.parse(localStorage.getItem("cart"));

      // //on crée la boucle qui va modifier la valeur quantity
      // for (article of panier)
      //   if (
      //     article._id === cart.dataset.id &&
      //     cart.dataset.color === article.color
      //   ) {
      //     article.quantity = eq.target.value;
      //     localStorage.cart = JSON.stringify(panier);
      //     // mise à jour du dataset     
      //     cart.dataset.quantity = eq.target.value;
      //     // puis actualisation de la fonction totalProduit
      //     totalProduit();
      //   }
    });
  });
}

// ajout de la fonction de suppression
function suppression() {

  const cart = document.querySelectorAll(".cart__item");

  // On capte un éventuel clic sur le bouton 
  cart.forEach((cart) => {

    const deleteItemSelector = cart.querySelector(".deleteItem");

    deleteItemSelector.addEventListener("click", (e) => {

      let confirmDelete = confirm("Etes vous sur de vouloir supprimer ce produit du panier ?");

      console.log(confirmDelete);

      if(confirmDelete){
        let panier = JSON.parse(localStorage.getItem("cart"));

        for (let article of panier) {
         for (let i = 0; i < panier.length ; i++) {
       if (panier[i].id == article.id  && panier[i].color == article.color){
        let newCart = JSON.parse(localStorage.getItem("cart"));
        newCart.splice(panier[i], 1)
          alert("Super le produit a été supprimé.");
          localStorage.cart = JSON.stringify(newCart);
         // totalProduit();
          return location.reload();
      }}
    }
    }

      // Appel du LS    
      // let panier = JSON.parse(localStorage.getItem("cart"));
      // for (let d = 0, c = panier.length; d < c; d++)
      //   if (
      //     panier[d]._id === cartDelete.dataset.id &&
      //     panier[d].coulor === cartDelete.dataset.color
      //   ) {
      //     // déclaration de la variable
      //     const num = [d];
      //     // création du panier actualisé ...
      //     let newCart = JSON.parse(localStorage.getItem("cart"));
      //     //... qui enlève 1 item de sa version précédente
      //     newCart.splice(num, 1);
      //     // affichage du nouveau panier : s'il n'y a rien alors panier vide, sinon on affiche le nouveau panier et on recharge
      //     if (newCart && newCartlength == 0) {

      //       document.querySelector("#totalQuantity").innerHTML = "0";
      //       document.querySelector("#totalPrice").innerHTML = "0";
      //       document.querySelector("h1").innerHTML =
      //         "Vous n'avez pas d'article dans votre panier";
      //     }


      //     localStorage.cart = JSON.stringify(newCart);
      //     totalProduit();

      //     return location.reload();
      //   }
    });
  });
}


//let totalArticle = [];

//let totalPrice = [];

//let quantityNumber = parseInt(panier[i].quantity);
//let priceNumber = parseInt(panier[i].price * panier[i].quantity)

//totalQuantity.push(quantityNumber);
//totalPrice.push(priceNumber);

//const reducer = (accumulator, currentValue) => accumulator + currentValue;
//const totalQuantityResult = totalQuantity.reduce(reducer, 0);

//const totalPriceyResult = totalPrice.reduce(reducer, 0);

//function totalProduit() {

 

  // définition de l'endroit où le tout s'affichera
  //document.getElementById("totalQuantity").textContent += '$(totalQuantityResult)';

  //document.getElementById("totalPrice").textContent += '$(totalPriceResult)';
//}

//totalProduit();


// Formulaire et méthode POST /
//

//// REGEXs

// création des variables :
const prenom = document.getElementById("firstName");
const nom = document.getElementById("lastName");
const ville = document.getElementById("city");
const adresse = document.getElementById("address");
const mail = document.getElementById("email");

// email
const emailErrorMsg = document.getElementById("emailErrorMsg");
function validateEmail(mail) {
  const regexMail =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regexMail.test(mail) == false) {
    return false;
  } else {
    emailErrorMsg.innerHTML = null;
    return true;
  }
}
// RegEx simple pour les noms

const regexName = /^[a-z][a-z '-.,]{1,31}$|^$/i;

// prénom
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
function validateFirstName(prenom) {
  if (regexName.test(prenom) == false) {
    return false;
  } else {
    firstNameErrorMsg.innerHTML = null;
    return true;
  }
}

// nom de famille
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
function validateLastName(nom) {
  if (regexName.test(nom) == false) {
    return false;
  } else {
    lastNameErrorMsg.innerHTML = null;
    return true;
  }
}

// ville
const cityErrorMsg = document.getElementById("cityErrorMsg");
function validateCity(ville) {
  if (regexName.test(ville) == false) {
    return false;
  } else {
    cityErrorMsg.innerHTML = null;
    return true;
  }
}

// Requête POST
// Création du JSON du POST

// fonction getForm() qui génère le"contact" du formulaire

function makeJsonData() {
  let contact = {
    firstName: prenom.value,
    lastName: nom.value,
    address: adresse.value,
    city: ville.value,
    email: mail.value,
  };
  // puis intégrer le panier ... 




}
