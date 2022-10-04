//const cart = document.querySelector("#cart");


main();

function main() {
    displayCart();
   // countTotalInCart();
    // checkFormAndPostRequest();
  }

  function displayCart() {

    let copyOfLS = JSON.parse(localStorage.getItem("cart"));
    let cartCard = document.querySelector("#cart__items");

    // Si le tableau copié du localStorage contient au moins un objet, on affiche le panier

    if(copyOfLS!== null){
        cartCard.style.display = "flex";
        cartCard.style.flexDirection = "column"; 
        cartCard.style.justfyContent = "space-around";
        
    }
  }

 // Pour chaque objet dans le tableau copié du lS, on crée les divs qui vont contenir les données du tableau
for (let i = 0 ; i < copyOfLS.length ; i++) {

    if (productAdded._id === copyOfLS[i]._id) {
        productAdded.name = copyOfLS[i].name
    }









 //   let productInCart = document.createElement("article");
  //  productInCart.classList.add("cart__item");
  //  productInCart.
    

 //   let productImage = document.createElement("img");
  //  productImage.classList.add("cart__item__img");
  //  productImage.src = copyOfLS[i].imageUrl;
  //  productInCart.appendChild(productImage);

  //  let productContent = document.createElement("div");
  //  productContent.classList.add("cart__item__content");
   // productInCart.appendChild(productContent);

  //  let productDescription = document.createElement("div");
  //  productDescription.classList.add("cart__item__content__description");
 //   productContent.appendChild(productDescription);
    
   // let productName = document.createElement("h2");
  //  productName.innerText = copyOfLS[i].name;
  //  productDescription.appendChild(productName);

  //  let productColor = document.createElement("p");
  //  productColor.innerText = copyOfLS[i].colors;
  //  productDescription.appendChild(productColor);

  //  let productPrice = document.createElement("p");
  //  productContent.appendChild(productPrice);
   //     productPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
  //          style : "currency",
  //          currency: "EUR",
 //       }).format(copyOfLS.price * copyOfLS[i].quantity);
        
    
 //    let productQuantity = document.createElement("div");
 //   productContent.appendChild(productQuantity);
 //   productQuantity.classList.add("cart__item__content__settings", "cart__item__content__settings__quantity");
  //  productQuantity.innerHTML = copyOfLS[i].quantity;

 //  let productRemove = document.createElement("div");
  //  productRemove.classList.add("cart__item__content__settings__delete");
  //  productContent.appendChild(productRemove);
//
  //  let productRemoveAction = document.createElement("p");
  //  productRemoveAction.classList.add("deleteItem");
  //  productRemoveAction.innerText = "Supprimer";
  //  productRemove.appendChild(productRemoveAction); 

//productRemoveAction.addEventListener("click", function()
//{sessionStorage.removeItem(copyOfLS[i])}) ;

//}

// function countTotalInCart() {
   // let arrayOfPrice = [];
  //  let totalPrice = document.querySelector("#totalPrice"); 