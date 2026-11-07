// Configuration et Initialisation du Client Supabase
// Remplace les valeurs ci-dessous par tes identifiants du projet Supabase (disponibles dans le Dashboard Supabase > Project Settings > API)

const SUPABASE_URL = "https://VOTRE_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "VOTRE_SUPABASE_ANON_KEY";

// Importation / Déclaration du client Supabase
// (Nous utiliserons la librairie officielle Supabase via CDN dans nos pages HTML)
let supabaseClient = null;

if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Client Supabase connecté avec succès !");
} else {
    console.warn("Le SDK Supabase n'est pas encore chargé sur cette page.");
}