// Gestion du Panier (Stockage LocalStorage)

// Fonction pour ajouter un produit au panier
function ajouterAuPanier(id, nom, prix) {
    let panier = JSON.parse(localStorage.getItem("minitakeaway_panier")) || [];

    // Vérifier si le produit est déjà dans le panier
    let articleExistant = panier.find(item => item.id === id);

    if (articleExistant) {
        articleExistant.quantite += 1;
    } else {
        panier.push({
            id: id,
            nom: nom,
            prix: prix,
            quantite: 1
        });
    }

    // Sauvegarder dans le localStorage
    localStorage.setItem("minitakeaway_panier", JSON.stringify(panier));
    
    // Mettre à jour l'affichage du compteur
    mettreAJourCompteurPanier();

    alert(`"${nom}" a été ajouté à votre panier !`);
}

// Fonction pour mettre à jour le nombre d'articles dans la navbar
function mettreAJourCompteurPanier() {
    let panier = JSON.parse(localStorage.getItem("minitakeaway_panier")) || [];
    let totalArticles = panier.reduce((sum, item) => sum + item.quantite, 0);

    // Chercher le lien du panier dans la navigation
    let liensPanier = document.querySelectorAll('a[href="panier.html"]');
    liensPanier.forEach(lien => {
        lien.textContent = `Panier (${totalArticles})`;
    });
}

// Exécuter la mise à jour du compteur au chargement de chaque page
document.addEventListener("DOMContentLoaded", () => {
    mettreAJourCompteurPanier();
});