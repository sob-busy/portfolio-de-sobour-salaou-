// Gestion de la navigation SPA
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    // Fonction pour afficher une page
    function showPage(pageId) {
        // Masquer toutes les pages
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Afficher la page sélectionnée
        const selectedPage = document.getElementById(pageId);
        if (selectedPage) {
            selectedPage.classList.add('active');
        }

        // Mettre à jour les liens de navigation
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId.replace('-page', '')) {
                link.classList.add('active');
            }
        });

        // Fermer le menu mobile après sélection
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');

        // Scroll vers le haut
        window.scrollTo(0, 0);
    }

    // Événements de clic sur les liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            const pageId = page + '-page';
            showPage(pageId);
        });
    });

    // Toggle du menu mobile
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});