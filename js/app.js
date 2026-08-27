/* =========================================================
   FANTASY TRACKER
   App navigation
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!sidebar) return;


    /* -------------------------------------------------------
       Desktop sidebar
    ------------------------------------------------------- */

    if (sidebarToggle) {

        sidebarToggle.addEventListener("click", () => {

            sidebar.classList.toggle("collapsed");

        });

    }


    /* -------------------------------------------------------
       Mobile sidebar
    ------------------------------------------------------- */

    if (mobileMenu) {

        mobileMenu.addEventListener("click", () => {

            sidebar.classList.toggle("mobile-open");

        });

    }


    /* -------------------------------------------------------
       Close mobile menu when clicking a link
    ------------------------------------------------------- */

    const navLinks = sidebar.querySelectorAll(".nav__item");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            if (window.innerWidth <= 768) {
                sidebar.classList.remove("mobile-open");
            }

        });

    });

});

