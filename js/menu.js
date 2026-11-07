// Script d'affichage du Menu depuis Supabase

document.addEventListener("DOMContentLoaded", () => {
    chargerProduitsMenu();
});

async function chargerProduitsMenu() {
    const grilleProduits = document.querySelector("main > div:nth-child(2)");

    if (!grilleProduits) return;

    try {
        // Requête Supabase pour récupérer les produits disponibles
        const { data: produits, error } = await supabaseClient
            .from("produits")
            .select("*")
            .eq("disponible", true);

        if (error) {
            console.error("Erreur lors de la récupération des produits :", error.message);
            return;
        }

        // Si aucun produit n'est présent dans la base de données
        if (!produits || produits.length === 0) {
            grilleProduits.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: white; border-radius: 12px;">
                    <p style="color: var(--text);">Aucun produit n'est disponible pour le moment. Veuillez revenir plus tard !</p>
                </div>
            `;
            return;
        }

        // Vider la grille des cartes de démonstration
        grilleProduits.innerHTML = "";

        // Générer dynamiquement les cartes produits
        produits.forEach(produit => {
            const imageProduit = produit.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600';
            
            const carteHtml = `
                <article style="background: white; border-radius: 12px; overflow: hidden; padding-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <img src="${imageProduit}" alt="${produit.nom}" style="width: 100%; height: 200px; object-fit: cover;">
                    <div style="padding: 20px;">
                        <h3 style="margin-bottom: 8px;">${produit.nom}</h3>
                        <p style="color: var(--text); font-size: 14px; margin-bottom: 15px;">${produit.description || ''}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: bold; color: var(--primary); font-size: 18px;">$${parseFloat(produit.prix).toFixed(2)}</span>
                            <button onclick="ajouterAuPanier(${produit.id}, '${produit.nom.replace(/'/g, "\\'")}', ${produit.prix})" class="btn-primary" style="padding: 8px 15px; font-size: 14px; border: none; cursor: pointer;">
                                Ajouter
                            </button>
                        </div>
                    </div>
                </article>
            `;
            grilleProduits.insertAdjacentHTML("beforeend", carteHtml);
        });

    } catch (err) {
        console.error("Erreur serveur :", err);
    }
}