import { supabase } from "./supabase.js";


document.addEventListener("DOMContentLoaded", async () => {


    /* =========================================================
       AUTH MODAL
       El modal es crea automàticament a qualsevol pàgina.
    ========================================================= */

    const createAuthModal = () => {

        if (document.getElementById("authModal")) {

            return;

        }


        document.body.insertAdjacentHTML(
            "beforeend",
            `
            <div
                class="auth-modal"
                id="authModal"
                aria-hidden="true"
            >

                <div
                    class="auth-modal__backdrop"
                    id="authModalBackdrop"
                ></div>


                <div class="auth-modal__content">


                    <button
                        class="auth-modal__close"
                        id="authModalClose"
                        aria-label="Tancar"
                    >
                        ×
                    </button>


                    <span class="auth-modal__eyebrow">
                        FANTASY TRACKER
                    </span>


                    <h2>
                        Iniciar sessió
                    </h2>


                    <p>
                        Entra per accedir al teu equip personal.
                    </p>


                    <!-- LOGIN -->

                    <form
                        id="loginForm"
                        class="auth-form"
                    >

                        <div class="auth-form__group">

                            <label for="loginEmail">
                                Correu electrònic
                            </label>

                            <input
                                type="email"
                                id="loginEmail"
                                placeholder="eloi@fantasy.com"
                                required
                            >

                        </div>


                        <div class="auth-form__group">

                            <label for="loginPassword">
                                Contrasenya
                            </label>

                            <input
                                type="password"
                                id="loginPassword"
                                placeholder="••••••••"
                                required
                            >

                        </div>


                        <p
                            class="auth-form__error"
                            id="loginError"
                        ></p>


                        <button
                            type="submit"
                            class="btn btn--primary auth-form__submit"
                            id="loginSubmit"
                        >
                            Iniciar sessió
                        </button>

                    </form>


                    <!-- SESSION -->

                    <div
                        class="auth-logged"
                        id="loggedUserPanel"
                        hidden
                    >

                        <p>
                            Sessió iniciada com a
                            <strong id="loggedUserName"></strong>
                        </p>


                        <button
                            class="btn btn--primary"
                            id="logoutButton"
                        >
                            Tancar sessió
                        </button>

                    </div>


                </div>

            </div>
            `
        );

    };


    createAuthModal();


    /* =========================================================
       ELEMENTS
    ========================================================= */

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


    const loginSubmit =
        document.getElementById("loginSubmit");


    const loggedUserPanel =
        document.getElementById("loggedUserPanel");


    const loggedUserName =
        document.getElementById("loggedUserName");


    const logoutButton =
        document.getElementById("logoutButton");


    /* =========================================================
       OPEN MODAL
    ========================================================= */

    const openAuthModal = () => {

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
       GET DISPLAY NAME
    ========================================================= */

    const getDisplayName = async user => {

        const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", user.id)
            .single();


        return (

            profile?.display_name ||

            user.email
                .split("@")[0]

        );

    };


    /* =========================================================
       UPDATE INTERFACE
    ========================================================= */

    const updateUserInterface = async user => {

        /*
           USER NOT LOGGED IN
        */

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

                profileAvatar.textContent =
                    "M";

            }


            loginForm.hidden = false;

            loggedUserPanel.hidden = true;


            return;

        }


        /*
           USER LOGGED IN
        */

        const displayName =
            await getDisplayName(user);


        if (profileName) {

            profileName.textContent =
                displayName;

        }


        if (profileRole) {

            profileRole.textContent =
                "Fantasy League";

        }


        if (profileAvatar) {

            profileAvatar.textContent =
                displayName
                    .charAt(0)
                    .toUpperCase();

        }


        /*
           Modal:
           només logout.
        */

        loginForm.hidden = true;

        loggedUserPanel.hidden = false;

        loggedUserName.textContent =
            displayName;

    };


    /* =========================================================
       PROFILE BUTTON
    ========================================================= */

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            () => {

                openAuthModal();

            }
        );

    }


    /* =========================================================
       CLOSE BUTTON
    ========================================================= */

    authModalClose.addEventListener(
        "click",
        () => {

            closeAuthModal();

        }
    );


    /* =========================================================
       BACKDROP
    ========================================================= */

    authModalBackdrop.addEventListener(
        "click",
        () => {

            closeAuthModal();

        }
    );


    /* =========================================================
       ESCAPE
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                authModal.classList.contains("is-open")
            ) {

                closeAuthModal();

            }

        }
    );


    /* =========================================================
       LOGIN
    ========================================================= */

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            loginError.textContent = "";


            const email =
                loginEmail.value.trim();


            const password =
                loginPassword.value;


            loginSubmit.disabled = true;

            loginSubmit.textContent =
                "Iniciant sessió...";


            const {

                data,
                error

            } = await supabase.auth.signInWithPassword({

                email,
                password

            });


            if (error) {

                loginError.textContent =
                    error.message;


                loginSubmit.disabled = false;

                loginSubmit.textContent =
                    "Iniciar sessió";


                return;

            }


            await updateUserInterface(
                data.user
            );


            loginForm.reset();


            loginSubmit.disabled = false;

            loginSubmit.textContent =
                "Iniciar sessió";


            closeAuthModal();

        }
    );


    /* =========================================================
       LOGOUT
    ========================================================= */

    logoutButton.addEventListener(
        "click",
        async () => {

            await supabase.auth.signOut();


            await updateUserInterface(
                null
            );


            closeAuthModal();

        }
    );


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
       AUTH STATE CHANGE
    ========================================================= */

    supabase.auth.onAuthStateChange(
        async (
            event,
            session
        ) => {

            await updateUserInterface(

                session?.user || null

            );

        }
    );


});
