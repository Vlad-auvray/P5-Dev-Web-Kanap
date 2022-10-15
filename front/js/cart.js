// pour différancier la page confirmation et panier
const page = document.location.href;

let panier = JSON.parse(localStorage.getItem("cart"));


if (page.match("cart")) {
  fetch("http://localhost:3000/api/products")
    .then(function (response) {
      return response.json();
    })
    .then((response) => {
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
          totalProduit(products);
        }
      }
    }
  } else {
    
    document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
  }
  // reste à l'écoute grâce aux fonctions suivantes pour modifier l'affichage
  modifQuantité(products);
  suppression(products);

}

// Afficher le panier
function display(product) {
  let cartZone = document.querySelector("#cart__items");
  cartZone.innerHTML +=
    `<article class="cart__item" data-id="${product._id}" data-color="${product.color}" data-quantity="${product.quantity}" data-price="${product.price}"> 
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
}

// Définition de la fonction de modification de quantité d'article dans le panier
function modifQuantité(products) {
  const cart = document.querySelectorAll(".cart__item");
  // On capte un éventuel clic sur le bouton 
  cart.forEach((cart) => {
    const productId = cart.getAttribute('data-id');
    const productColor = cart.getAttribute('data-color');
    const itemQuantitySelector = cart.querySelector(".itemQuantity");
    itemQuantitySelector.addEventListener("change", (e) => {
      e.preventDefault();
      let panier = JSON.parse(localStorage.getItem("cart"));
      for (let product of panier) {
        if (product.id == productId && product.color == productColor) {
          product.quantity = parseInt(itemQuantitySelector.value);
          localStorage.setItem("cart", JSON.stringify(panier));
          totalProduit(products);
          displayInfo();
        }
      }
    });
  });
}

// ajout de la fonction de suppression
function suppression(products) {
  const cart = document.querySelectorAll(".cart__item");
  // On capte un éventuel clic sur le bouton 
  cart.forEach((article) => {
    const productId = article.getAttribute('data-id');
    const productColor = article.getAttribute('data-color');
    const deleteItemSelector = article.querySelector(".deleteItem");
    deleteItemSelector.addEventListener("click", (e) => {
      let confirmDelete = confirm("Etes vous sur de vouloir supprimer ce produit du panier ?");
      if (confirmDelete) {
        let panier = JSON.parse(localStorage.getItem("cart"));
        for (let i = 0; i < panier.length; i++) {
          if (panier[i].id == productId && panier[i].color == productColor) {
            let newCart = JSON.parse(localStorage.getItem("cart"));
            newCart.splice(i, 1);
            alert("Super le produit a été supprimé.");
            localStorage.setItem("cart", JSON.stringify(newCart));
            article.remove();
            totalProduit(products);
            displayInfo();
          }
        }
      }
    });
  });
}

function displayInfo() {
  panier = JSON.parse(localStorage.getItem("cart"));
  if (panier == 0 && panier.length == 0) {
    document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
  }
}


function totalProduit(products) {
  // définition de l'endroit où le tout s'affichera
  // document.getElementById("totalPrice").textContent += '$(totalPriceResult)';
  const totalArticle = getTotalArticle();
  document.getElementById("totalQuantity").textContent = totalArticle;

  const totalPrice = getTotalPrice(products);
  document.getElementById("totalPrice").textContent = totalPrice;
}

function getTotalArticle() {
  let totalArticle = 0;
  panier = JSON.parse(localStorage.getItem("cart"));
  for (let product of panier) {
    totalArticle = totalArticle + product.quantity;
  }
  return totalArticle;
}

function getTotalPrice(products) {
  let totalPrice = 0;
  panier = JSON.parse(localStorage.getItem("cart"));
  for (let product of panier) {
    for (let article of products) {
      if (product.id == article._id) {
        totalPrice = totalPrice + product.quantity * article.price;
      }
    }
  }
  return totalPrice;
}


// Formulaire et méthode POST /

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

// Récupération et renvoie des ID sur panier

let getId = panier.map(product => product.id);

// Validation de la commande, envoie à l'API

document.querySelector(".cart__order__form__submit").addEventListener("click", function(e) {
  e.preventDefault();
  let valid = true;
  for(let input of document.querySelectorAll(".cart__order__form__question input")) {
    valid &= input.reportValidity();
      if (!valid) {
        break;
      }
  }
  if (valid) {
    const result = fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact: {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value
        },
        products : getId
      })
    });
     result.then(async(answer) => {
      try {
        const data = await answer.json();
        window.location.href = `confirmation.html?id=${data.orderId}`;
        localStorage.clear();
      } catch (e) {
      }
     });
  }
})

