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
       CREATE SIDEBAR OVERLAY
    ===================================================== */

    const overlay = document.createElement("div");

    overlay.className = "sidebar-overlay";

    document.body.appendChild(overlay);


    /* =====================================================
       HELPERS
    ===================================================== */

    const isCompact = () => {

        return window.innerWidth <= 900;

    };


    const isSidebarOpen = () => {

        return !sidebar.classList.contains("collapsed");

    };


    /* =====================================================
       OPEN SIDEBAR
    ===================================================== */

    const openSidebar = () => {

        /*
           Obrim el sidebar
        */

        sidebar.classList.remove("collapsed");

        sidebar.classList.add("mobile-open");


        /*
           El body deixa d'estar en estat tancat
        */

        document.body.classList.remove("sidebar-collapsed");


        /*
           Activem l'overlay
        */

        overlay.classList.add("active");

    };


    /* =====================================================
       CLOSE SIDEBAR
    ===================================================== */

    const closeSidebar = () => {

        /*
           Tanquem completament el sidebar
        */

        sidebar.classList.remove("mobile-open");

        sidebar.classList.add("collapsed");


        /*
           Guardem l'estat visual
        */

        document.body.classList.add("sidebar-collapsed");


        /*
           Eliminem l'overlay
        */

        overlay.classList.remove("active");

    };


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    /*
       En pantalla compacta volem que
       el sidebar comenci tancat.
    */

    closeSidebar();


    /* =====================================================
       SIDEBAR TOGGLE BUTTON
    ===================================================== */

    if (sidebarToggle) {

        sidebarToggle.addEventListener("click", event => {

            event.stopPropagation();


            /*
               El botó interior del sidebar
               serveix principalment per tancar-lo.
            */

            if (isSidebarOpen()) {

                closeSidebar();

            } else {

                openSidebar();

            }

        });

    }


    /* =====================================================
       TOPBAR MENU BUTTON
    ===================================================== */

    if (mobileMenu) {

        mobileMenu.addEventListener("click", event => {

            event.stopPropagation();


            /*
               Toggle universal.

               Funciona igual a desktop,
               pantalla dividida i mòbil.
            */

            if (isSidebarOpen()) {

                closeSidebar();

            } else {

                openSidebar();

            }

        });

    }


    /* =====================================================
       OVERLAY CLICK
    ===================================================== */

    /*
       Clicar sobre la zona fosca,
       fora del sidebar, el tanca.
    */

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
               En pantalla compacta,
               tanquem el sidebar després
               de seleccionar una pàgina.
            */

            if (isCompact()) {

                closeSidebar();

            }

        });

    });


    /* =====================================================
       ACTIVE PAGE
    ===================================================== */

    const currentPath = window.location.pathname;

    navLinks.forEach(link => {

        const href = link.getAttribute("href");

        if (!href) return;


        /*
           Normalitzem el href.

           Això permet que funcioni tant si
           estem a index.html com a pages/*
        */

        const normalizedHref = href.replace(/^\.\//, "");


        /*
           Dashboard principal
        */

        const isDashboard =

            normalizedHref === "index.html" ||

            normalizedHref === "pages/dashboard.html";


        /*
           Si som a l'arrel del projecte,
           considerem Dashboard com a actiu.
        */

        if (

            currentPath.endsWith(normalizedHref) ||

            (
                currentPath.endsWith("/") &&
                isDashboard
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

            if (isSidebarOpen()) {

                closeSidebar();

            }

        }

    });


    /* =====================================================
       WINDOW RESIZE
    ===================================================== */

    window.addEventListener("resize", () => {

        /*
           Si el sidebar està obert,
           mantenim el seu estat.

           No fem cap desplaçament del main.
           El comportament és sempre:

           Sidebar
           → per sobre del contingut

           Overlay
           → enfosqueix la resta
        */

        if (isSidebarOpen()) {

            sidebar.classList.remove("collapsed");

        }

    });

});
