main();

function main() {
    getArticles();
}

//Récupérer les articles depuis l'API

function getArticles() {

    let errorMessage = "Oups! Une erreur s'est produite lors de la connexion a l'API";
    const sectionProduits = document.querySelector(".items");
    

    fetch("http://localhost:3000/api/products/")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                console.log(errorMessage);
                alert(errorMessage);
                sectionProduits.innerHTML = errorMessage;
            }
        })


        // On place les données de chaque produit dans le DOM
        .then(function (resultatAPI) {
            const articles = resultatAPI;
            console.log(articles);
            // On créer la boucle pour générer les fiches produits
            for (let i = 0; i < articles.length; i++) {

                // Récupération de l'élément du DOM
                const sectionProduits = document.querySelector(".items")

                // Création des balises dédiées (l'ancre et l'article).

                const itemLien = document.createElement("a");
                sectionProduits.appendChild(itemLien);
                itemLien.href = `product.html?id=${resultatAPI[i]._id}`

                const itemElement = document.createElement("article")
                itemLien.appendChild(itemElement)


                // Création de l'élément
                const imageElement = document.createElement("img");
                // Aller chercher l'indice [i] pour ajouter l'image
                imageElement.src = articles[i].imageUrl;
                //Rattacher l'image
                itemElement.appendChild(imageElement);

                //Répétition pour le reste des éléments
                const nomElement = document.createElement("h3");
                nomElement.classList.add("productName");
                nomElement.innerText = articles[i].name;
                itemElement.appendChild(nomElement);

                const descriptionElement = document.createElement("p");
                descriptionElement.classList.add("productDescription")
                descriptionElement.innerText = articles[i].description ?? "(Pas de description)";
                itemElement.appendChild(descriptionElement);

            }
        }).catch((e) => {
            console.log(errorMessage);
            alert(errorMessage);
            sectionProduits.innerHTML = errorMessage;
        });
}