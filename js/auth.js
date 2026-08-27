import { supabase } from "./supabase.js";


/* =========================================================
   FANTASY TRACKER
   AUTH SYSTEM
========================================================= */


const initAuth = async () => {


    /* =====================================================
       CREATE AUTH MODAL
    ===================================================== */

    const createAuthModal = () => {


        /*
           El modal només existeix una vegada per pàgina.
        */

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
                        type="button"
                        class="auth-modal__close"
                        id="authModalClose"
                        aria-label="Tancar"
                    >
                        ×
                    </button>


                    <span class="auth-modal__eyebrow">
                        FANTASY TRACKER
                    </span>


                    <h2 id="authModalTitle">
                        Iniciar sessió
                    </h2>


                    <p id="authModalDescription">
                        Entra per accedir al teu equip personal.
                    </p>


                    <!-- LOGIN FORM -->

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
                                autocomplete="email"
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
                                autocomplete="current-password"
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


                    <!-- LOGGED USER PANEL -->

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
                            type="button"
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


    const authModalBackdrop =
        document.getElementById("authModalBackdrop");


    const authModalClose =
        document.getElementById("authModalClose");

   const authModalTitle =
    document.getElementById("authModalTitle");


   const authModalDescription =
       document.getElementById("authModalDescription");


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

    const openAuthModal = () => {


        authModal.classList.add("is-open");


        authModal.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
           Si el login és visible,
           posem el focus al correu.
        */

        if (!loginForm.hidden) {

            setTimeout(() => {

                loginEmail.focus();

            }, 100);

        }

    };


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    const closeAuthModal = () => {


        authModal.classList.remove("is-open");


        authModal.setAttribute(
            "aria-hidden",
            "true"
        );


        loginError.textContent = "";

    };


    /* =====================================================
       FORMAT DISPLAY NAME
    ===================================================== */

    const formatDisplayName = name => {


        if (!name) {

            return "";

        }


        return name
            .trim()
            .replace(
                /\b\w/g,
                letter => letter.toUpperCase()
            );

    };


    /* =====================================================
       GET DISPLAY NAME
    ===================================================== */

    const getDisplayName = async user => {


        if (!user) {

            return "";

        }


        const {

            data: profile,
            error

        } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", user.id)
            .maybeSingle();


        /*
           Si existeix el perfil,
           utilitzem el nom visible.
        */

        if (

            !error &&

            profile?.display_name

        ) {

            return formatDisplayName(
                profile.display_name
            );

        }


        /*
           Fallback:
           utilitzem la primera part
           del correu electrònic.
        */

        return formatDisplayName(

            user.email
                ?.split("@")[0]

        );

    };


    /* =====================================================
       UPDATE USER INTERFACE
    ===================================================== */

    const updateUserInterface = async user => {


        /* ================================================
           USER NOT LOGGED IN
        ================================================= */

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


            authModalTitle.hidden = false;

            authModalDescription.hidden = false;
           
            loginForm.hidden = false;

            loggedUserPanel.hidden = true;

            loggedUserName.textContent = "";


            return;

        }


        /* ================================================
           USER LOGGED IN
        ================================================= */

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

       authModalTitle.hidden = true;


       authModalDescription.hidden = true;


        /*
           Dins del popup ja NO mostrem
           el formulari de login.
        */

        loginForm.hidden = true;


        /*
           Mostrem només la sessió actual
           i el botó de logout.
        */

        loggedUserPanel.hidden = false;


        loggedUserName.textContent =
            displayName;

    };


    /* =====================================================
       REFRESH CURRENT SESSION
    ===================================================== */

    const refreshCurrentSession = async () => {


        const {

            data: {
                session
            },

            error

        } = await supabase.auth.getSession();


        if (error) {

            console.error(
                "Error obtenint la sessió:",
                error
            );

        }


        await updateUserInterface(

            session?.user || null

        );


        return session?.user || null;

    };


    /* =====================================================
       PROFILE BUTTON
    ===================================================== */

    if (profileButton) {


        profileButton.addEventListener(
            "click",
            async () => {


                /*
                   Abans d'obrir el modal,
                   comprovem l'estat real
                   de la sessió.
                */

                await refreshCurrentSession();


                openAuthModal();

            }
        );

    }


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    authModalClose.addEventListener(
        "click",
        closeAuthModal
    );


    /* =====================================================
       BACKDROP
    ===================================================== */

    authModalBackdrop.addEventListener(
        "click",
        closeAuthModal
    );


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {


            if (

                event.key === "Escape" &&

                authModal.classList.contains(
                    "is-open"
                )

            ) {

                closeAuthModal();

            }

        }
    );


    /* =====================================================
       LOGIN
    ===================================================== */

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


            /* ============================================
               LOGIN ERROR
            ============================================= */

            if (error) {


                loginError.textContent =
                    error.message;


                loginSubmit.disabled = false;


                loginSubmit.textContent =
                    "Iniciar sessió";


                return;

            }


            /* ============================================
               LOGIN SUCCESS
            ============================================= */

            await updateUserInterface(
                data.user
            );


            loginForm.reset();


            loginSubmit.disabled = false;


            loginSubmit.textContent =
                "Iniciar sessió";


            /*
               Tanquem el popup després
               d'iniciar sessió.
            */

            closeAuthModal();

        }
    );


    /* =====================================================
       LOGOUT
    ===================================================== */

    logoutButton.addEventListener(
        "click",
        async () => {


            const {

                error

            } = await supabase.auth.signOut();


            if (error) {


                console.error(
                    "Error tancant sessió:",
                    error
                );


                return;

            }


            await updateUserInterface(
                null
            );


            closeAuthModal();

        }
    );


    /* =====================================================
       INITIAL SESSION
    ===================================================== */

    await refreshCurrentSession();


    /* =====================================================
       AUTH STATE CHANGE
    ===================================================== */

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


};


/* =========================================================
   INITIALIZATION
========================================================= */

if (

    document.readyState === "loading"

) {


    document.addEventListener(
        "DOMContentLoaded",
        initAuth,
        {
            once: true
        }
    );


} else {


    initAuth();

}
