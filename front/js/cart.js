// pour différancier la page confirmation et panier
const page = document.location.href;

// Création d'un fonction racourcie pour l'utilisation du localStorage
let panier = getCartOnLocalStorage();

//Création des expressions RegEx pour le formaulaire client
let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

// Récupération de l'API
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
// S'il n'y a pas de produits dans le localStorage alors on indique à l'utilisateur qu'il n'y a pas d'article dans le panier
    document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
  }
  // reste à l'écoute grâce aux fonctions suivantes pour modifier l'affichage de la quantité totale et du priux total
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
  // On capte un éventuel clic sur le bouton sur un produit spécifique, puis on remplace les informations du localStorage par les nouvelles données;
  cart.forEach((cart) => {
    const productId = cart.getAttribute('data-id');
    const productColor = cart.getAttribute('data-color');
    const itemQuantitySelector = cart.querySelector(".itemQuantity");
    itemQuantitySelector.addEventListener("change", (e) => {
      e.preventDefault();
      let panier = getCartOnLocalStorage();;
      for (let product of panier) {
        if (itemQuantitySelector.value <= 0 && itemQuantitySelector.value < 100) {
          alert("Veuillez choisir une quantité comprise entre 1 et 100.");
          return;
        }
        if (product.id == productId && product.color == productColor) {
          product.quantity = parseInt(itemQuantitySelector.value);
          localStorage.setItem("cart", JSON.stringify(panier));
          //Mise à jour des totaux
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
  // On capte un éventuel clic sur le bouton Supprimer d'un produit du panier;  
  cart.forEach((article) => {
    const productId = article.getAttribute('data-id');
    const productColor = article.getAttribute('data-color');
    const deleteItemSelector = article.querySelector(".deleteItem");
    deleteItemSelector.addEventListener("click", (e) => {
      //On demande à l'utilisateur s'il est sûr de son choix
      let confirmDelete = confirm("Etes vous sûr de vouloir supprimer ce produit du panier ?");
      // Si l'utilisateur confirme son choix, on suprime le produit en question du localStorage
      if (confirmDelete) {
        let panier = getCartOnLocalStorage();;
        for (let i = 0; i < panier.length; i++) {
          if (panier[i].id == productId && panier[i].color == productColor) {
            let newCart = getCartOnLocalStorage();;
            newCart.splice(i, 1);
            alert("Super le produit a été supprimé.");
            localStorage.setItem("cart", JSON.stringify(newCart));
            article.remove();
             //Mise à jour des totaux
            totalProduit(products);
            displayInfo();
          }
        }
      }
    });
  });
}

// S'il n'y a pas de produit dans le localStorage, on informe l'utilisateur que le panier est vide
function displayInfo() {
  panier = getCartOnLocalStorage();;
  if (panier == 0 && panier.length == 0) {
    document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
  }
}

// Affichage des totaux "quantité" et "prix"
function totalProduit(products) {
 
  const totalArticle = getTotalArticle();
  document.getElementById("totalQuantity").textContent = totalArticle;

  const totalPrice = getTotalPrice(products);
  document.getElementById("totalPrice").textContent = totalPrice;
}
// Création de la fonction de la quantité totale d'articles
function getTotalArticle() {
  let totalArticle = 0;
  panier = getCartOnLocalStorage();;
  for (let product of panier) {
    totalArticle = totalArticle + product.quantity;
  }
  return totalArticle;
}
// Création de la fonction de calcul du prix total
function getTotalPrice(products) {
  let totalPrice = 0;
  panier = getCartOnLocalStorage();;
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
//Création de la fonction de création de formulaire
function getForm() {

  let form = document.querySelector(".cart__order__form");

  // Ecoute de la modification du prénom
  form.firstName.addEventListener('change', function () {
    validFirstName(this);
  });

  // Ecoute de la modification du nom
  form.lastName.addEventListener('change', function () {
    validLastName(this);
  });

  // Ecoute de la modification de l'adresse
  form.address.addEventListener('change', function () {
    validAddress(this);
  });

  // Ecoute de la modification de la ville
  form.city.addEventListener('change', function () {
    validCity(this);
  });

  // Ecoute de la modification du mail
  form.email.addEventListener('change', function () {
    validEmail(this);
  });

}

//validation du prénom
const validFirstName = function (inputFirstName) {
  let firstNameErrorMsg = inputFirstName.nextElementSibling;
  let isValid = false;
  if (charRegExp.test(inputFirstName.value)) {
    firstNameErrorMsg.innerHTML = '';
    isValid = true;
  } else {
    firstNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
  }
  return isValid;
};

//validation du nom
const validLastName = function (inputLastName) {
  let lastNameErrorMsg = inputLastName.nextElementSibling;
  let isValid = false;
  if (charRegExp.test(inputLastName.value)) {
    lastNameErrorMsg.innerHTML = '';
    isValid = true;
  } else {
    lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
  }
  return isValid;
};

//validation de l'adresse
const validAddress = function (inputAddress) {
  let addressErrorMsg = inputAddress.nextElementSibling;
  let isValid = false;
  if (addressRegExp.test(inputAddress.value)) {
    addressErrorMsg.innerHTML = '';
    isValid = true;
  } else {
    addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ. (Exemple: "1 rue de la réussite"';
  }
  return isValid;
};

//validation de la ville
const validCity = function (inputCity) {
  let cityErrorMsg = inputCity.nextElementSibling;
  let isValid = false;
  if (charRegExp.test(inputCity.value)) {
    cityErrorMsg.innerHTML = '';
    isValid = true;
  } else {
    cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
  }
  return isValid;
};

//validation de l'email
const validEmail = function (inputEmail) {
  let emailErrorMsg = inputEmail.nextElementSibling;
  let isValid = false;
  if (emailRegExp.test(inputEmail.value)) {
    emailErrorMsg.innerHTML = '';
    isValid = true;
  } else {
    emailErrorMsg.innerHTML = 'Merci de renseigner une adresse mail valide.';
  }
  return isValid;
};


getForm();

//Création de la fonction d'envoi du formulaire
function postForm() {
  const btn_commander = document.getElementById("order");

  //Ecouter le panier
  btn_commander.addEventListener("click", (e) => {

    e.preventDefault();
// Récupération des articles du panier
    panier = getCartOnLocalStorage();;

    if (panier.length <= 0) {
      alert("Votre panier est vide.");
      return;
    }

    //Récupération des coordonnées du formulaire client
    let inputFirstName = document.getElementById('firstName');
    let inputLastName = document.getElementById('lastName');
    let inputAdress = document.getElementById('address');
    let inputCity = document.getElementById('city');
    let inputMail = document.getElementById('email');

    let firstNameIsvalid = validFirstName(inputFirstName);
    let lastNameIsvalid = validFirstName(inputLastName);
    let adressIsvalid = validAddress(inputAdress);
    let cityIsvalid = validCity(inputCity);
    let mailIsvalid = validEmail(inputMail);

    // S'il manque une information, on informe l'utilisateur, et on met en pause l'exécution du code
    if (!firstNameIsvalid || !lastNameIsvalid || !adressIsvalid || !cityIsvalid || !mailIsvalid) {
      alert("Une ou plusieurs informations du formulaire de validation de commande sont inccorectes.");
      return;
    }

    //Construction d'un array depuis le localStorage
    let idProducts = [];
    for (let i = 0; i < panier.length; i++) {
      idProducts.push(panier[i].id);
    }
//Création des informations de la commande (infos client + produits du panier)
    const order = {
      contact: {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAdress.value,
        city: inputCity.value,
        email: inputMail.value,
      },
      products: idProducts,
    }

    // On place ces informations dans un JSON
    const options = {
      method: 'POST',
      body: JSON.stringify(order),
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
      },
    };

   // Préparation des infos à transmettre pour la page Confirmation
    fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
        localStorage.clear();
        document.location.href = `confirmation.html?orderId=${data.orderId}`;
      })
      .catch((err) => {
        alert("Problème avec fetch : " + err.message);
      });
  });

}
// Appel de la fonction et envoi du formaulaire
postForm();

// Récupération des informations du localStorage pour mettre sous forme de tableau pour afficher quelque chose même si le panier est vide
function getCartOnLocalStorage() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart) {
    cart = [];
  }
  return cart;
}


