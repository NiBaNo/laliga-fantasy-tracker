import { supabase } from "./supabase.js";


document.addEventListener("DOMContentLoaded", async () => {


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const profileButton = document.getElementById("profileButton");

    const authModal = document.getElementById("authModal");

    const authModalBackdrop =
        document.getElementById("authModalBackdrop");

    const authModalClose =
        document.getElementById("authModalClose");


    const loginForm =
        document.getElementById("loginForm");

    const loginEmail =
        document.getElementById("loginEmail");

    const loginPassword =
        document.getElementById("loginPassword");

    const loginError =
        document.getElementById("loginError");


    const profileName =
        document.getElementById("profileName");

    const profileRole =
        document.getElementById("profileRole");

    const profileAvatar =
        document.getElementById("profileAvatar");


    const loggedUserPanel =
        document.getElementById("loggedUserPanel");

    const loggedUserName =
        document.getElementById("loggedUserName");

    const logoutButton =
        document.getElementById("logoutButton");


    const loginSubmit =
        document.getElementById("loginSubmit");


    /* =========================================================
       OPEN MODAL
    ========================================================= */

    const openAuthModal = () => {

        if (!authModal) return;

        authModal.classList.add("is-open");

        authModal.setAttribute(
            "aria-hidden",
            "false"
        );

    };


    /* =========================================================
       CLOSE MODAL
    ========================================================= */

    const closeAuthModal = () => {

        if (!authModal) return;

        authModal.classList.remove("is-open");

        authModal.setAttribute(
            "aria-hidden",
            "true"
        );

        if (loginError) {

            loginError.textContent = "";

        }

    };


    /* =========================================================
       PROFILE BUTTON
    ========================================================= */

    if (profileButton) {

        profileButton.addEventListener("click", () => {

            openAuthModal();

        });

    }


    /* =========================================================
       CLOSE BUTTON
    ========================================================= */

    if (authModalClose) {

        authModalClose.addEventListener("click", () => {

            closeAuthModal();

        });

    }


    /* =========================================================
       BACKDROP
    ========================================================= */

    if (authModalBackdrop) {

        authModalBackdrop.addEventListener("click", () => {

            closeAuthModal();

        });

    }


    /* =========================================================
       ESCAPE
    ========================================================= */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeAuthModal();

        }

    });


    /* =========================================================
       UPDATE USER INTERFACE
    ========================================================= */

    const updateUserInterface = async user => {

        if (!user) {

            if (profileName) {

                profileName.textContent =
                    "Iniciar sessió";

            }

            if (profileRole) {

                profileRole.textContent =
                    "Accés al teu equip";

            }

            if (profileAvatar) {

                profileAvatar.textContent = "M";

            }

            if (loginForm) {

                loginForm.hidden = false;

            }

            if (loggedUserPanel) {

                loggedUserPanel.hidden = true;

            }

            return;

        }


        /*
           Busquem el perfil de l'usuari.
        */

        const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", user.id)
            .single();


        /*
           Si no hi ha display_name,
           utilitzem la part abans de @.
        */

        const displayName =

            profile?.display_name ||

            user.email
                .split("@")[0];


        /*
           Nom del perfil superior.
        */

        if (profileName) {

            profileName.textContent =
                displayName;

        }


        /*
           Rol.
        */

        if (profileRole) {

            profileRole.textContent =
                "Fantasy League";

        }


        /*
           Avatar.
        */

        if (profileAvatar) {

            profileAvatar.textContent =
                displayName
                    .charAt(0)
                    .toUpperCase();

        }


        /*
           Panell de logout.
        */

        if (loginForm) {

            loginForm.hidden = true;

        }


        if (loggedUserPanel) {

            loggedUserPanel.hidden = false;

        }


        if (loggedUserName) {

            loggedUserName.textContent =
                displayName;

        }

    };


    /* =========================================================
       LOGIN
    ========================================================= */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                /*
                   Netegem error anterior.
                */

                if (loginError) {

                    loginError.textContent = "";

                }


                /*
                   Llegim dades.
                */

                const email =
                    loginEmail.value.trim();

                const password =
                    loginPassword.value;


                /*
                   Desactivem botó mentre
                   Supabase processa el login.
                */

                if (loginSubmit) {

                    loginSubmit.disabled = true;

                    loginSubmit.textContent =
                        "Iniciant sessió...";

                }


                /*
                   Login Supabase.
                */

                const {
                    data,
                    error
                } = await supabase.auth.signInWithPassword({

                    email,

                    password

                });


                /*
                   Error.
                */

                if (error) {

                    if (loginError) {

                        loginError.textContent =
                            error.message;

                    }


                    if (loginSubmit) {

                        loginSubmit.disabled = false;

                        loginSubmit.textContent =
                            "Iniciar sessió";

                    }

                    return;

                }


                /*
                   Actualitzem interfície.
                */

                await updateUserInterface(
                    data.user
                );


                /*
                   Tanquem modal.
                */

                closeAuthModal();


                /*
                   Restaurem formulari.
                */

                loginForm.reset();


                if (loginSubmit) {

                    loginSubmit.disabled = false;

                    loginSubmit.textContent =
                        "Iniciar sessió";

                }

            }

        );

    }


    /* =========================================================
       LOGOUT
    ========================================================= */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async () => {

                await supabase
                    .auth
                    .signOut();


                await updateUserInterface(
                    null
                );


                closeAuthModal();

            }

        );

    }


    /* =========================================================
       INITIAL SESSION
    ========================================================= */

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();


    await updateUserInterface(
        session?.user || null
    );


    /* =========================================================
       AUTH STATE CHANGES
    ========================================================= */

    supabase.auth.onAuthStateChange(
        async (_event, session) => {

            await updateUserInterface(
                session?.user || null
            );

        }
    );


});
