/* =========================================================
   FANTASY TRACKER
   App navigation
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar = document.getElementById("sidebar");

    const sidebarToggle =
        document.getElementById("sidebarToggle");

    const mobileMenu =
        document.getElementById("mobileMenu");


    if (!sidebar) return;


    /* =====================================================
       CREATE OVERLAY
    ===================================================== */

    const overlay = document.createElement("div");

    overlay.className = "sidebar-overlay";

    document.body.appendChild(overlay);


    /* =====================================================
       HELPERS
    ===================================================== */

    const isCompact = () =>
        window.innerWidth <= 900;


    const closeCompactSidebar = () => {

        sidebar.classList.remove("mobile-open");

        overlay.classList.remove("active");

    };


    const openCompactSidebar = () => {

        /*
         * Eliminem qualsevol estat desktop.
         */

        sidebar.classList.remove("collapsed");

        document.body.classList.remove(
            "sidebar-collapsed"
        );


        /*
         * Obrim el sidebar.
         */

        sidebar.classList.add("mobile-open");

        overlay.classList.add("active");

    };


    const closeDesktopSidebar = () => {

        sidebar.classList.add("collapsed");

        document.body.classList.add(
            "sidebar-collapsed"
        );

    };


    const openDesktopSidebar = () => {

        sidebar.classList.remove("collapsed");

        document.body.classList.remove(
            "sidebar-collapsed"
        );

    };


    /* =====================================================
       MAIN SIDEBAR TOGGLE
    ===================================================== */

    if (sidebarToggle) {

        sidebarToggle.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                /*
                 * COMPACT MODE
                */

                if (isCompact()) {

                    closeCompactSidebar();

                    return;

                }


                /*
                 * DESKTOP
                */

                if (
                    sidebar.classList.contains(
                        "collapsed"
                    )
                ) {

                    openDesktopSidebar();

                } else {

                    closeDesktopSidebar();

                }

            }
        );

    }


    /* =====================================================
       TOPBAR MENU BUTTON
    ===================================================== */

    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                /*
                 * COMPACT MODE
                */

                if (isCompact()) {

                    if (
                        sidebar.classList.contains(
                            "mobile-open"
                        )
                    ) {

                        closeCompactSidebar();

                    } else {

                        openCompactSidebar();

                    }

                    return;

                }


                /*
                 * DESKTOP
                */

                openDesktopSidebar();

            }
        );

    }


    /* =====================================================
       OVERLAY CLICK
    ===================================================== */

    overlay.addEventListener("click", () => {

        closeCompactSidebar();

    });


    /* =====================================================
       CLICK OUTSIDE SIDEBAR
    ===================================================== */

    document.addEventListener(
        "click",
        event => {


            /*
             * En compacte l'overlay
             * ja gestiona el clic exterior.
            */

            if (isCompact()) return;


            /*
             * Si ja està tancat,
             * no cal fer res.
            */

            if (
                sidebar.classList.contains(
                    "collapsed"
                )
            ) {

                return;

            }


            /*
             * Ignorem clics dins
             * del propi sidebar.
            */

            if (
                sidebar.contains(event.target)
            ) {

                return;

            }


            /*
             * Ignorem el botó
             * que obre el sidebar.
            */

            if (
                mobileMenu &&
                mobileMenu.contains(event.target)
            ) {

                return;

            }


            /*
             * Tanquem en clicar
             * fora del sidebar.
            */

            closeDesktopSidebar();

        }
    );


    /* =====================================================
       NAVIGATION LINKS
    ===================================================== */

    const navLinks = sidebar.querySelectorAll(
        ".nav__item"
    );


    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (isCompact()) {

                    closeCompactSidebar();

                }

            }
        );

    });


    /* =====================================================
       ACTIVE PAGE
    ===================================================== */

    const currentFile =
        window.location.pathname
            .split("/")
            .pop() || "index.html";


    navLinks.forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) return;


        const hrefFile =
            href
                .split("/")
                .pop();


        if (
            hrefFile === currentFile
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

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") return;


            if (isCompact()) {

                closeCompactSidebar();

            } else {

                closeDesktopSidebar();

            }

        }
    );


    /* =====================================================
       WINDOW RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {


            /*
             * Si passem a desktop,
             * eliminem l'estat overlay.
            */

            if (!isCompact()) {

                closeCompactSidebar();

            }


            /*
             * Si passem a compacte,
             * eliminem l'estat desktop
             * perquè el sidebar pugui
             * funcionar com overlay.
            */

            if (isCompact()) {

                sidebar.classList.remove(
                    "collapsed"
                );

                document.body.classList.remove(
                    "sidebar-collapsed"
                );

            }

        }
    );


});
