// Script global pour l'Espace Administration (Supabase)

document.addEventListener("DOMContentLoaded", () => {
    // Vérifier sur quelle page admin on se trouve et charger les données correspondantes
    const pageActuelle = window.location.pathname.split("/").pop();

    if (pageActuelle === "dashboard.html") {
        chargerStatistiquesDashboard();
    } else if (pageActuelle === "produits.html") {
        chargerProduitsAdmin();
    } else if (pageActuelle === "commandes.html") {
        chargerCommandesAdmin();
    }
});

// 1. Charger les statistiques pour le Dashboard
async function chargerStatistiquesDashboard() {
    try {
        // Compter les commandes du jour
        const { count: nbCommandes, error: errCommandes } = await supabaseClient
            .from("commandes")
            .select("*", { count: 'exact', head: true });

        // Calculer le chiffre d'affaires total
        const { data: commandes, error: errCa } = await supabaseClient
            .from("commandes")
            .select("total, statut, id, created_at, nom_client");

        if (errCommandes || errCa) {
            console.error("Erreur chargement stats dashboard");
            return;
        }

        let chiffreAffaires = commandes.reduce((sum, cmd) => sum + parseFloat(cmd.total || 0), 0);
        let commandesEnAttente = commandes.filter(cmd => cmd.statut === 'Recue' || cmd.statut === 'En préparation');

        // Mettre à jour l'affichage dans le HTML du Dashboard
        const cartes = document.querySelectorAll("main div div h3");
        if (cartes.length >= 3) {
            cartes[0].textContent = commandes.length; // Commandes totales
            cartes[1].textContent = `$${chiffreAffaires.toFixed(2)}`; // CA
        }

        // Afficher les dernières commandes en attente
        const sectionDernieresCommandes = document.querySelector("main div:last-child");
        if (sectionDernieresCommandes && commandesEnAttente.length > 0) {
            let htmlList = `<h3 style="margin-bottom: 20px;">Dernières commandes en attente (${commandesEnAttente.length})</h3><div style="display: flex; flex-direction: column; gap: 10px;">`;
            
            commandesEnAttente.slice(0, 5).forEach(cmd => {
                htmlList += `
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: #f9f9f9; border-radius: 8px; align-items: center;">
                        <div>
                            <strong>#${cmd.id} - ${cmd.nom_client}</strong>
                            <p style="font-size: 13px; color: var(--text);">Statut : <span style="color: var(--primary); font-weight: bold;">${cmd.statut}</span></p>
                        </div>
                        <span style="font-weight: bold; color: var(--dark);">$${parseFloat(cmd.total).toFixed(2)}</span>
                    </div>
                `;
            });
            htmlList += `</div>`;
            sectionDernieresCommandes.innerHTML = htmlList;
        }

    } catch (err) {
        console.error("Erreur technique dashboard :", err);
    }
}

// 2. Charger les produits dans l'admin (produits.html)
async function chargerProduitsAdmin() {
    const conteneur = document.querySelector("main");
    if (!conteneur) return;

    try {
        const { data: produits, error } = await supabaseClient
            .from("produits")
            .select("*, categories(nom)")
            .order("id", { ascending: false });

        if (error) {
            console.error("Erreur récupération produits admin :", error.message);
            return;
        }

        // Créer un tableau HTML propre pour lister les produits
        let htmlContent = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <div>
                    <span class="tagline">MODULE DE GESTION</span>
                    <h1 style="font-size: 32px; margin-top: 5px;">Gestion des Produits</h1>
                </div>
            </div>

            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <h3 style="margin-bottom: 20px;">Liste complète des articles</h3>
        `;

        if (!produits || produits.length === 0) {
            htmlContent += `<p style="color: var(--text);">Aucun produit trouvé dans la base de données.</p></div>`;
        } else {
            htmlContent += `
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid #eee; color: var(--text); font-size: 14px;">
                                <th style="padding: 12px;">Nom</th>
                                <th style="padding: 12px;">Prix</th>
                                <th style="padding: 12px;">Disponibilité</th>
                                <th style="padding: 12px; text-align: right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            produits.forEach(prod => {
                let statutBadge = prod.disponible 
                    ? `<span style="background: #e6f4ea; color: #137333; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">Disponible</span>`
                    : `<span style="background: #fce8e6; color: #c5221f; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">Indisponible</span>`;

                htmlContent += `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 15px; font-weight: bold;">${prod.nom}</td>
                        <td style="padding: 15px; color: var(--primary); font-weight: bold;">$${parseFloat(prod.prix).toFixed(2)}</td>
                        <td style="padding: 15px;">${statutBadge}</td>
                        <td style="padding: 15px; text-align: right;">
                            <button onclick="supprimerProduit(${prod.id})" style="background: #ff6b6b; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">Supprimer</button>
                        </td>
                    </tr>
                `;
            });

            htmlContent += `</tbody></table></div></div>`;
        }

        conteneur.innerHTML = htmlContent;

    } catch (err) {
        console.error("Erreur :", err);
    }
}

// Fonction pour supprimer un produit depuis l'admin
async function supprimerProduit(id) {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
        const { error } = await supabaseClient
            .from("produits")
            .delete()
            .eq("id", id);

        if (error) {
            alert("Erreur lors de la suppression : " + error.message);
        } else {
            alert("Produit supprimé avec succès !");
            chargerProduitsAdmin(); // Recharger la liste
        }
    }
}