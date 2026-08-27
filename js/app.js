/* =========================================================
   FANTASY TRACKER
   App navigation
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!sidebar) return;


    /* =====================================================
       CREATE MOBILE OVERLAY
    ===================================================== */

    const overlay = document.createElement("div");

    overlay.className = "sidebar-overlay";

    document.body.appendChild(overlay);


    /* =====================================================
       HELPERS
    ===================================================== */

    const isMobile = () => window.innerWidth <= 768;


    const closeSidebar = () => {

        sidebar.classList.remove("mobile-open");

        overlay.classList.remove("active");

    };


    const openSidebar = () => {

        sidebar.classList.add("mobile-open");

        overlay.classList.add("active");

    };


    /* =====================================================
       DESKTOP SIDEBAR
    ===================================================== */

    if (sidebarToggle) {

        sidebarToggle.addEventListener("click", () => {

            if (isMobile()) {

                /*
                 * Mobile:
                 * Toggle open / close
                 */

                if (sidebar.classList.contains("mobile-open")) {

                    closeSidebar();

                } else {

                    openSidebar();

                }

                return;
            }


            /*
             * Desktop:
             * Collapse / expand
             */

            sidebar.classList.toggle("collapsed");

            document.body.classList.toggle(
                "sidebar-collapsed",
                sidebar.classList.contains("collapsed")
            );

        });

    }


    /* =====================================================
       MOBILE MENU BUTTON
    ===================================================== */

    if (mobileMenu) {

        mobileMenu.addEventListener("click", () => {

            if (!isMobile()) return;


            if (sidebar.classList.contains("mobile-open")) {

                closeSidebar();

            } else {

                openSidebar();

            }

        });

    }


    /* =====================================================
       CLICK OUTSIDE SIDEBAR
    ===================================================== */

    overlay.addEventListener("click", () => {

        closeSidebar();

    });


    /* =====================================================
       NAVIGATION LINKS
    ===================================================== */

    const navLinks = sidebar.querySelectorAll(".nav__item");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            /*
             * Close sidebar on mobile
             */

            if (isMobile()) {

                closeSidebar();

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


        /*
         * Don't mark everything active on index.html.
         */

        if (
            currentPage.endsWith(href) ||
            (
                currentPage.endsWith("/") &&
                href === "pages/dashboard.html"
            )
        ) {

            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");

        }

    });


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeSidebar();

        }

    });


    /* =====================================================
       WINDOW RESIZE
    ===================================================== */

    window.addEventListener("resize", () => {

        /*
         * If we move from mobile → desktop,
         * remove mobile state.
         */

        if (!isMobile()) {

            closeSidebar();

        }

    });

});
