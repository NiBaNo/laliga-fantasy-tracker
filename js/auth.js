import { supabase } from "./supabase.js";


document.addEventListener("DOMContentLoaded", async () => {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const profileButton =
        document.getElementById("profileButton");

    const profileName =
        document.getElementById("profileName");

    const profileRole =
        document.getElementById("profileRole");

    const profileAvatar =
        document.getElementById("profileAvatar");


    const authModal =
        document.getElementById("authModal");

    const authModalClose =
        document.getElementById("authModalClose");

    const authModalBackdrop =
        document.getElementById("authModalBackdrop");


    const loginForm =
        document.getElementById("loginForm");

    const loginEmail =
        document.getElementById("loginEmail");

    const loginPassword =
        document.getElementById("loginPassword");

    const loginError =
        document.getElementById("loginError");

    const loginSubmit =
        document.getElementById("loginSubmit");


    const loggedUserPanel =
        document.getElementById("loggedUserPanel");

    const loggedUserName =
        document.getElementById("loggedUserName");

    const logoutButton =
        document.getElementById("logoutButton");


    /* =====================================================
       OPEN MODAL
    ===================================================== */

    const openModal = () => {

        authModal.classList.add("active");

        authModal.setAttribute(
            "aria-hidden",
            "false"
        );

    };


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    const closeModal = () => {

        authModal.classList.remove("active");

        authModal.setAttribute(
            "aria-hidden",
            "true"
        );

        loginError.textContent = "";

    };


    /* =====================================================
       LOAD PROFILE
    ===================================================== */

    const loadProfile = async user => {

        const { data, error } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", user.id)
            .single();


        let displayName = "Manager";


        if (!error && data?.display_name) {

            displayName =
                data.display_name;

        }


        const initial =
            displayName
                .charAt(0)
                .toUpperCase();


        profileName.textContent =
            displayName;

        profileRole.textContent =
            "Fantasy League";

        profileAvatar.textContent =
            initial;

        loggedUserName.textContent =
            displayName;

    };


    /* =====================================================
       UPDATE UI
    ===================================================== */

    const updateAuthUI = async session => {

        if (session?.user) {

            await loadProfile(
                session.user
            );


            loginForm.hidden = true;

            loggedUserPanel.hidden = false;


        } else {

            profileName.textContent =
                "Iniciar sessió";

            profileRole.textContent =
                "Accés al teu equip";

            profileAvatar.textContent =
                "M";


            loginForm.hidden = false;

            loggedUserPanel.hidden = true;

        }

    };


    /* =====================================================
       INITIAL SESSION
    ===================================================== */

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();


    await updateAuthUI(
        session
    );


    /* =====================================================
       AUTH STATE CHANGE
    ===================================================== */

    supabase.auth.onAuthStateChange(
        async (_event, session) => {

            await updateAuthUI(
                session
            );

        }
    );


    /* =====================================================
       PROFILE CLICK
    ===================================================== */

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            () => {

                openModal();

            }
        );

    }


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (authModalClose) {

        authModalClose.addEventListener(
            "click",
            closeModal
        );

    }


    /* =====================================================
       BACKDROP
    ===================================================== */

    if (authModalBackdrop) {

        authModalBackdrop.addEventListener(
            "click",
            closeModal
        );

    }


    /* =====================================================
       ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       LOGIN
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                loginError.textContent = "";


                loginSubmit.disabled =
                    true;

                loginSubmit.textContent =
                    "Iniciant sessió...";


                const {
                    error
                } = await supabase.auth
                    .signInWithPassword({

                        email:
                            loginEmail.value.trim(),

                        password:
                            loginPassword.value

                    });


                if (error) {

                    loginError.textContent =
                        "Correu o contrasenya incorrectes.";


                    loginSubmit.disabled =
                        false;

                    loginSubmit.textContent =
                        "Iniciar sessió";

                    return;

                }


                loginForm.reset();

                closeModal();

            }
        );

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async () => {

                await supabase.auth
                    .signOut();


                closeModal();

            }
        );

    }


});
