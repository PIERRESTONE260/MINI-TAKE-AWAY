// Fonction pour ouvrir/fermer le menu hamburger mobile
function toggleMenuMobile() {
    const nav = document.getElementById("mobileNav");
    nav.classList.toggle("active");
}

// Fermer le menu mobile lorsqu'on clique sur un lien
document.addEventListener("DOMContentLoaded", () => {
    const liensMobile = document.querySelectorAll(".mobile-nav a");
    liensMobile.forEach(lien => {
        lien.addEventListener("click", () => {
            document.getElementById("mobileNav").classList.remove("active");
        });
    });
});