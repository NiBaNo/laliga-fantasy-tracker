/* =========================================================
   FANTASY TRACKER
   Squad page
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const playersGrid = document.getElementById("playersGrid");

    const playerSearch = document.getElementById("playerSearch");

    const filterButtons = document.querySelectorAll(
        ".filter-button"
    );

    const playerCards = document.querySelectorAll(
        ".squad-player-card"
    );

    const playerModal = document.getElementById(
        "playerModal"
    );

    const closePlayerModal = document.getElementById(
        "closePlayerModal"
    );

    const modalOverlay = document.querySelector(
        ".player-modal__overlay"
    );

    const valuePeriods = document.querySelectorAll(
        ".value-period"
    );


    /* =====================================================
       SEARCH
    ===================================================== */

    if (playerSearch) {

        playerSearch.addEventListener("input", () => {

            const searchValue = playerSearch.value
                .toLowerCase()
                .trim();

            playerCards.forEach(card => {

                const playerName = (
                    card.dataset.name || ""
                ).toLowerCase();


                const matchesSearch =
                    playerName.includes(searchValue);


                const activeFilter = document
                    .querySelector(".filter-button.active")
                    ?.dataset.filter || "all";


                const matchesFilter =
                    activeFilter === "all" ||
                    card.dataset.position === activeFilter;


                card.classList.toggle(
                    "is-hidden",
                    !matchesSearch || !matchesFilter
                );

            });

        });

    }


    /* =====================================================
       FILTERS
    ===================================================== */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(item => {

                item.classList.remove("active");

            });


            button.classList.add("active");


            const selectedFilter =
                button.dataset.filter;


            const searchValue =
                playerSearch
                    ? playerSearch.value
                        .toLowerCase()
                        .trim()
                    : "";


            playerCards.forEach(card => {

                const playerName = (
                    card.dataset.name || ""
                ).toLowerCase();


                const matchesFilter =
                    selectedFilter === "all" ||
                    card.dataset.position === selectedFilter;


                const matchesSearch =
                    playerName.includes(searchValue);


                card.classList.toggle(
                    "is-hidden",
                    !matchesFilter || !matchesSearch
                );

            });

        });

    });


    /* =====================================================
       MODAL HELPERS
    ===================================================== */

    const openModal = () => {

        if (!playerModal) return;


        playerModal.classList.add("active");

        playerModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow = "hidden";

    };


    const closeModal = () => {

        if (!playerModal) return;


        playerModal.classList.remove("active");

        playerModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow = "";

    };


    /* =====================================================
       PLAYER CARD CLICK
    ===================================================== */

    playerCards.forEach(card => {

        card.addEventListener("click", event => {

            /*
             * No obrim el modal
             * si es prem el menú.
             */

            if (
                event.target.closest(
                    ".player-menu-button"
                )
            ) {

                return;

            }


            const name =
                card.querySelector("h3")
                    ?.textContent
                    .trim();


            const team =
                card.querySelector(".player-team")
                    ?.textContent
                    .trim();


            const position =
                card.querySelector(".position-badge")
                    ?.textContent
                    .trim();


            const value =
                card.querySelector(
                    ".player-value strong"
                )
                    ?.textContent
                    .trim();


            const dailyChange =
                card.querySelector(
                    ".player-change-grid strong"
                )
                    ?.textContent
                    .trim();


            const initials =
                name
                    ? name
                        .split(" ")
                        .map(word => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "FT";


            const modalName =
                document.getElementById(
                    "modalPlayerName"
                );

            const modalTeam =
                document.getElementById(
                    "modalPlayerTeam"
                );

            const modalPosition =
                document.getElementById(
                    "modalPlayerPosition"
                );

            const modalValue =
                document.getElementById(
                    "modalPlayerValue"
                );

            const modalDailyChange =
                document.getElementById(
                    "modalPlayerDailyChange"
                );

            const modalInitials =
                document.getElementById(
                    "modalPlayerInitials"
                );


            if (modalName) {

                modalName.textContent = name;

            }


            if (modalTeam) {

                modalTeam.textContent = team;

            }


            if (modalPosition) {

                modalPosition.textContent = position;

            }


            if (modalValue) {

                modalValue.textContent = value;

            }


            if (modalDailyChange) {

                modalDailyChange.textContent =
                    `${dailyChange} avui`;

            }


            if (modalInitials) {

                modalInitials.textContent = initials;

            }


            openModal();

        });

    });


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    if (closePlayerModal) {

        closePlayerModal.addEventListener(
            "click",
            closeModal
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeModal
        );

    }


    /* =====================================================
       VALUE PERIODS
    ===================================================== */

    valuePeriods.forEach(button => {

        button.addEventListener("click", () => {

            valuePeriods.forEach(item => {

                item.classList.remove("active");

            });


            button.classList.add("active");

        });

    });


    /* =====================================================
       BUY / SELL BUTTONS
       PLACEHOLDER FOR FUTURE MODALS
    ===================================================== */

    const buyPlayerButton = document.getElementById(
        "buyPlayerButton"
    );

    const sellPlayerButton = document.getElementById(
        "sellPlayerButton"
    );


    if (buyPlayerButton) {

        buyPlayerButton.addEventListener(
            "click",
            () => {

                console.log(
                    "Obrir modal de compra"
                );

            }
        );

    }


    if (sellPlayerButton) {

        sellPlayerButton.addEventListener(
            "click",
            () => {

                console.log(
                    "Obrir modal de venda"
                );

            }
        );

    }


});
