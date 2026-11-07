// Script de gestion et validation de la commande

document.addEventListener("DOMContentLoaded", () => {
    const formulaireCommande = document.querySelector("form");

    if (formulaireCommande) {
        formulaireCommande.addEventListener("submit", async (e) => {
            e.preventDefault(); // Empêcher le rechargement classique de la page

            // Récupérer le panier
            let panier = JSON.parse(localStorage.getItem("minitakeaway_panier")) || [];
            if (panier.length === 0) {
                alert("Votre panier est vide. Impossible de passer une commande.");
                window.location.href = "menu.html";
                return;
            }

            // Récupérer les champs du formulaire
            const selectMode = formulaireCommande.querySelector("select");
            const inputs = formulaireCommande.querySelectorAll("input");
            const textarea = formulaireCommande.querySelector("textarea");

            const modeReception = selectMode ? selectMode.value : "Retrait sur place";
            const nomClient = inputs[0] ? inputs[0].value.trim() : "";
            const telephoneClient = inputs[1] ? inputs[1].value.trim() : "";
            const adresse = textarea ? textarea.value.trim() : "";

            if (!nomClient || !telephoneClient) {
                alert("Veuillez renseigner votre nom et votre numéro de téléphone.");
                return;
            }

            // Calculer le total
            let sousTotal = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
            let frais = 1.50;
            let totalGeneral = sousTotal + frais;

            try {
                // 1. Insérer la commande principale dans Supabase
                const { data: commandeInseree, error: erreurCommande } = await supabaseClient
                    .from("commandes")
                    .insert([
                        {
                            nom_client: nomClient,
                            telephone_client: telephoneClient,
                            mode_reception: modeReception,
                            adresse: adresse,
                            statut: "Recue",
                            total: totalGeneral
                        }
                    ])
                    .select()
                    .single();

                if (erreurCommande) {
                    console.error("Erreur insertion commande :", erreurCommande.message);
                    alert("Une erreur est survenue lors de la validation de la commande.");
                    return;
                }

                const commandeId = commandeInseree.id;

                // 2. Insérer les détails de la commande (articles du panier)
                let detailsLignes = panier.map(item => ({
                    commande_id: commandeId,
                    produit_id: item.id,
                    quantite: item.quantite,
                    prix_unitaire: item.prix
                }));

                const { error: erreurDetails } = await supabaseClient
                    .from("details_commande")
                    .insert(detailsLignes);

                if (erreurDetails) {
                    console.error("Erreur insertion détails :", erreurDetails.message);
                    alert("Erreur lors de l'enregistrement des articles de la commande.");
                    return;
                }

                // Succès : Vider le panier et rediriger vers le suivi
                localStorage.removeItem("minitakeaway_panier");
                alert("Commande validée avec succès !");
                window.location.href = `suivi.html?id=${commandeId}`;

            } catch (err) {
                console.error("Erreur technique :", err);
                alert("Une erreur inattendue s'est produite.");
            }
        });
    }
});