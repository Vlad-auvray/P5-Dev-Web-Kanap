main();

function main() {

  const orderIdSelector = document.querySelector("#orderId");

  let params = (new URL(document.location)).searchParams;

  let orderId = params.get("orderId");

  if (orderId === undefined || orderId === "") {
    orderIdSelector.innerHTML = "Message d'erreur";
    alert("Message d'erreur");
  } else {
    orderIdSelector.innerHTML = orderId;
  }

}

//IMPORTANT !! le LS avec orderId sera issu du cart.js, lors de la requête achat