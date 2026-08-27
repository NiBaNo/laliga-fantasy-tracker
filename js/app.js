document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!sidebar) return;


    /* =====================================================
       DESKTOP - COLLAPSE SIDEBAR
    ===================================================== */

    if (sidebarToggle) {

        sidebarToggle.addEventListener("click", () => {

            sidebar.classList.toggle("collapsed");

            document.body.classList.toggle(
                "sidebar-collapsed",
                sidebar.classList.contains("collapsed")
            );

        });

    }


    /* =====================================================
       MOBILE - OPEN SIDEBAR
    ===================================================== */

    if (mobileMenu) {

        mobileMenu.addEventListener("click", () => {

            sidebar.classList.toggle("mobile-open");

        });

    }


    /* =====================================================
       CLOSE MOBILE SIDEBAR WHEN CLICKING LINK
    ===================================================== */

    const navLinks = sidebar.querySelectorAll(".nav__item");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            if (window.innerWidth <= 768) {

                sidebar.classList.remove("mobile-open");

            }

        });

    });


    /* =====================================================
       ACTIVE PAGE
    ===================================================== */

    const currentPage = window.location.pathname;

    navLinks.forEach(link => {

        const href = link.getAttribute("href");

        if (!href) return;

        if (currentPage.endsWith(href)) {

            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");

        }

    });

});
