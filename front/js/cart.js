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

function getForm() {
  
  let form = document.querySelector(".cart__order__form");

  //Création des expressions 
  let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
  let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
  let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

  // Ecoute de la modification du prénom
  form.firstName.addEventListener('change', function() {
      validFirstName(this);
  });

  // Ecoute de la modification du nom
  form.lastName.addEventListener('change', function() {
      validLastName(this);
  });

  // Ecoute de la modification de l'adresse
  form.address.addEventListener('change', function() {
      validAddress(this);
  });

  // Ecoute de la modification de la ville
  form.city.addEventListener('change', function() {
      validCity(this);
  });

  // Ecoute de la modification du mail
  form.email.addEventListener('change', function() {
      validEmail(this);
  });

  //validation du prénom
  const validFirstName = function(inputFirstName) {
      let firstNameErrorMsg = inputFirstName.nextElementSibling;

      if (charRegExp.test(inputFirstName.value)) {
          firstNameErrorMsg.innerHTML = '';
      } else {
          firstNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
      }
  };

  //validation du nom
  const validLastName = function(inputLastName) {
      let lastNameErrorMsg = inputLastName.nextElementSibling;

      if (charRegExp.test(inputLastName.value)) {
          lastNameErrorMsg.innerHTML = '';
      } else {
          lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
      }
  };

  //validation de l'adresse
  const validAddress = function(inputAddress) {
      let addressErrorMsg = inputAddress.nextElementSibling;

      if (addressRegExp.test(inputAddress.value)) {
          addressErrorMsg.innerHTML = '';
      } else {
          addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
      }
  };

  //validation de la ville
  const validCity = function(inputCity) {
      let cityErrorMsg = inputCity.nextElementSibling;

      if (charRegExp.test(inputCity.value)) {
          cityErrorMsg.innerHTML = '';
      } else {
          cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
      }
  };

  //validation de l'email
  const validEmail = function(inputEmail) {
      let emailErrorMsg = inputEmail.nextElementSibling;

      if (emailRegExp.test(inputEmail.value)) {
          emailErrorMsg.innerHTML = '';
      } else {
          emailErrorMsg.innerHTML = 'Merci de renseigner une adresse mail valide.';
      }
  };
  }
getForm();

//Envoi des informations client au localstorage
function postForm(){
  const btn_commander = document.getElementById("order");

  //Ecouter le panier
  btn_commander.addEventListener("click", (e)=>{
  
      //Récupération des coordonnées du formulaire client
      let inputName = document.getElementById('firstName');
      let inputLastName = document.getElementById('lastName');
      let inputAdress = document.getElementById('address');
      let inputCity = document.getElementById('city');
      let inputMail = document.getElementById('email');

      //Construction d'un array depuis le LS
      let idProducts = [];
      for (let i = 0; i<panier.length;i++) {
          idProducts.push(panier[i].id);
      }
      console.log(idProducts);
     
      const order = {
          contact : {
              firstName: inputName.value,
              lastName: inputLastName.value,
              address: inputAdress.value,
              city: inputCity.value,
              email: inputMail.value,
          },
          products: idProducts,
      } 

      const options = {
          method: 'POST',
          body: JSON.stringify(order),
          headers: {
              'Accept': 'application/json', 
              "Content-Type": "application/json" 
          },
      };

      fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
          console.log(data);
          localStorage.clear();
          localStorage.setItem("orderId", data.orderId);

          document.location.href = "confirmation.html";
      })
      .catch((err) => {
          alert ("Problème avec fetch : " + err.message);
      });
      })
}
postForm();

