main();

function main() {
  displayOrderId();
}

function displayOrderId() {
  
  const orderId = document.querySelector("#orderId");
  
  
  orderId.innerText = localStorage.getItem("orderId");

  // On vide le localStorage pour recommencer plus tard le processus d'achat
  localStorage.clear(); 
}

//IMPORTANT !! le LS avec orderId sera issu du cart.js, lors de la requête achat