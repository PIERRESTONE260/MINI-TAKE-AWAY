// Configuration et Initialisation du Client Supabase
// Remplace les valeurs ci-dessous par tes identifiants du projet Supabase (disponibles dans le Dashboard Supabase > Project Settings > API)

const SUPABASE_URL = "https://ratxjdybjtwswbbsangx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhdHhqZHlianR3c3diYnNhbmd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNDQ1MDUsImV4cCI6MjEwOTYyMDUwNX0.ysMUOZbIYdbb0RGwau-6hn4TrftcrZbiNCGLOqHZSRI";

// Importation / Déclaration du client Supabase
// (Nous utiliserons la librairie officielle Supabase via CDN dans nos pages HTML)
let supabaseClient = null;

if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Client Supabase connecté avec succès !");
} else {
    console.warn("Le SDK Supabase n'est pas encore chargé sur cette page.");
}