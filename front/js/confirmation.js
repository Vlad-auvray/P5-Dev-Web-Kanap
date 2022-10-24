main();

function main() {

  // Réucpération des information de la commande; si elle existe, on affiche un message avec le numéro de la commande... 
  const orderIdSelector = document.querySelector("#orderId");

  let params = (new URL(document.location)).searchParams;

  let orderId = params.get("orderId");

  console.log(orderId);

  if (!orderId || orderId === "") {
    //... sinon une erreur s'affiche
    alert("Oupss !!! Une erreur s'est produite lors de la validation de commande");
  } else {
    orderIdSelector.innerHTML = orderId;
  }

}

