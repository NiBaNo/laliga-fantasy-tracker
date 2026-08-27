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

    const isCompact = () => window.innerWidth <= 900;


    const closeSidebar = () => {

        sidebar.classList.remove("mobile-open");

        overlay.classList.remove("active");

    };


    const openSidebar = () => {

        /*
         * En mode compacte sempre obrim
         * el sidebar complet.
         */

        sidebar.classList.remove("collapsed");

        document.body.classList.remove(
            "sidebar-collapsed"
        );

        sidebar.classList.add("mobile-open");

        overlay.classList.add("active");

    };


    /* =====================================================
       MAIN SIDEBAR TOGGLE
    ===================================================== */

    if (sidebarToggle) {

        sidebarToggle.addEventListener("click", event => {

            event.stopPropagation();


            /*
             * COMPACT / SMALL WINDOW
             */

            if (isCompact()) {

                if (
                    sidebar.classList.contains(
                        "mobile-open"
                    )
                ) {

                    closeSidebar();

                } else {

                    openSidebar();

                }

                return;

            }


            /*
             * DESKTOP
             */

            sidebar.classList.toggle("collapsed");

            document.body.classList.toggle(
                "sidebar-collapsed",
                sidebar.classList.contains("collapsed")
            );

        });

    }


    /* =====================================================
       MOBILE / COMPACT MENU BUTTON
    ===================================================== */

    if (mobileMenu) {

        mobileMenu.addEventListener("click", event => {

            event.stopPropagation();


            if (
                sidebar.classList.contains(
                    "mobile-open"
                )
            ) {

                closeSidebar();

            } else {

                openSidebar();

            }

        });

    }


    /* =====================================================
       OVERLAY CLICK
    ===================================================== */

    overlay.addEventListener("click", () => {

        closeSidebar();

    });


    /* =====================================================
       NAVIGATION LINKS
    ===================================================== */

    const navLinks = sidebar.querySelectorAll(
        ".nav__item"
    );


    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            if (isCompact()) {

                closeSidebar();

            }

        });

    });


    /* =====================================================
       ACTIVE PAGE
    ===================================================== */

    const currentFile = window.location.pathname
        .split("/")
        .pop() || "index.html";


    navLinks.forEach(link => {

        const href = link.getAttribute("href");

        if (!href) return;


        const hrefFile = href
            .split("/")
            .pop();


        if (hrefFile === currentFile) {

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
         * Quan passem a pantalla ampla,
         * netegem l'estat de l'overlay.
         */

        if (!isCompact()) {

            closeSidebar();

        }

    });

});
