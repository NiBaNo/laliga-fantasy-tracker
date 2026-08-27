/* =========================================================
   FANTASY TRACKER
   App navigation
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarToggle =
        document.getElementById("sidebarToggle");

    const mobileMenu =
        document.getElementById("mobileMenu");


    if (!sidebar) return;


    /* =====================================================
       CREATE OVERLAY
    ===================================================== */

    const overlay =
        document.createElement("div");

    overlay.className =
        "sidebar-overlay";

    document.body.appendChild(overlay);


    /* =====================================================
       BREAKPOINT
    ===================================================== */

    const isCompact = () =>
        window.innerWidth <= 900;


    /* =====================================================
       COMPACT SIDEBAR
    ===================================================== */

    const openCompactSidebar = () => {

        /*
         * En mode compacte el sidebar
         * sempre s'obre complet.
        */

        sidebar.classList.remove(
            "collapsed"
        );

        document.body.classList.remove(
            "sidebar-collapsed"
        );


        sidebar.classList.add(
            "mobile-open"
        );

        overlay.classList.add(
            "active"
        );

    };


    const closeCompactSidebar = () => {

        sidebar.classList.remove(
            "mobile-open"
        );

        overlay.classList.remove(
            "active"
        );

    };


    /* =====================================================
       DESKTOP SIDEBAR
    ===================================================== */

    const openDesktopSidebar = () => {

        sidebar.classList.remove(
            "collapsed"
        );

        document.body.classList.remove(
            "sidebar-collapsed"
        );

    };


    const closeDesktopSidebar = () => {

        sidebar.classList.add(
            "collapsed"
        );

        document.body.classList.add(
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
                 * DESKTOP MODE
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
                 * DESKTOP MODE
                 *
                 * Aquest botó només apareix
                 * quan el sidebar està tancat.
                */

                openDesktopSidebar();

            }
        );

    }


    /* =====================================================
       OVERLAY CLICK
    ===================================================== */

    overlay.addEventListener(
        "click",
        () => {

            closeCompactSidebar();

        }
    );


    /* =====================================================
       CLICK OUTSIDE SIDEBAR
    ===================================================== */

    document.addEventListener(
        "click",
        event => {


            /*
             * En mode compacte l'overlay
             * és qui gestiona el clic exterior.
            */

            if (isCompact()) {

                return;

            }


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
             * Clic dins del sidebar:
             * no el tanquem.
            */

            if (
                sidebar.contains(event.target)
            ) {

                return;

            }


            /*
             * Ignorem el botó del topbar
             * que serveix per reobrir-lo.
            */

            if (
                mobileMenu &&
                mobileMenu.contains(event.target)
            ) {

                return;

            }


            /*
             * Ignorem també el botó intern.
            */

            if (
                sidebarToggle &&
                sidebarToggle.contains(event.target)
            ) {

                return;

            }


            /*
             * Qualsevol altre clic en desktop
             * tanca completament el sidebar.
            */

            closeDesktopSidebar();

        }
    );


    /* =====================================================
       NAVIGATION LINKS
    ===================================================== */

    const navLinks =
        sidebar.querySelectorAll(
            ".nav__item"
        );


    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                /*
                 * En compacte tanquem el menú
                 * després de navegar.
                */

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

                item.classList.remove(
                    "active"
                );

            });


            link.classList.add(
                "active"
            );

        }

    });


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {

                return;

            }


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
             * En passar a desktop:
             * eliminem completament l'estat
             * del mode compacte.
            */

            if (!isCompact()) {

                closeCompactSidebar();

            }


            /*
             * En passar a compacte:
             *
             * eliminem l'estat de desktop.
             * El CSS ja deixa el sidebar
             * completament fora de pantalla.
            */

            if (isCompact()) {

                sidebar.classList.remove(
                    "collapsed"
                );

                document.body.classList.remove(
                    "sidebar-collapsed"
                );

                closeCompactSidebar();

            }

        }
    );


});
