/* =========================================================
   FANTASY TRACKER
   Squad page
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       TEMPORARY PLAYER DATABASE

       This will later be replaced by the scraper.
    ===================================================== */

    const availablePlayers = [

        {
            id: "16931",
            name: "Xanet Oláiz",
            team: "Alavés",
            position: "DEFENSA",
            value: 524426,
            image: "https://media.futbolfantasy.com/thumb/80x80/v202608170239/uploads/images/jugadores/ficha/16931.png"
        },

        {
            id: "joan-garcia",
            name: "Joan García",
            team: "RCD Espanyol",
            position: "PORTER",
            value: 7840000,
            image: ""
        },

        {
            id: "pau-cubarsi",
            name: "Pau Cubarsí",
            team: "FC Barcelona",
            position: "DEFENSA",
            value: 18420000,
            image: ""
        },

        {
            id: "lamine-yamal",
            name: "Lamine Yamal",
            team: "FC Barcelona",
            position: "MIGCAMPISTA",
            value: 42860000,
            image: ""
        },

        {
            id: "kylian-mbappe",
            name: "Kylian Mbappé",
            team: "Real Madrid",
            position: "DAVANTER",
            value: 31720000,
            image: ""
        }

    ];


    /* =====================================================
       STATE
    ===================================================== */

    let transactionType = "buy";

    let selectedTransactionPlayer = null;


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const playersGrid =
        document.getElementById("playersGrid");


    const playerSearch =
        document.getElementById("playerSearch");


    const filterButtons =
        document.querySelectorAll(
            ".filter-button"
        );


    const playerCards =
        document.querySelectorAll(
            ".squad-player-card"
        );


    /* Player detail modal */

    const playerModal =
        document.getElementById(
            "playerModal"
        );


    const closePlayerModal =
        document.getElementById(
            "closePlayerModal"
        );


    const modalOverlay =
        document.querySelector(
            ".player-modal__overlay"
        );


    const valuePeriods =
        document.querySelectorAll(
            ".value-period"
        );


    /* Transaction modal */

    const transactionModal =
        document.getElementById(
            "transactionModal"
        );


    const transactionModalOverlay =
        document.getElementById(
            "transactionModalOverlay"
        );


    const closeTransactionModal =
        document.getElementById(
            "closeTransactionModal"
        );


    const cancelTransaction =
        document.getElementById(
            "cancelTransaction"
        );


    const transactionPlayerSearch =
        document.getElementById(
            "transactionPlayerSearch"
        );


    const transactionResults =
        document.getElementById(
            "transactionResults"
        );


    const selectedTransactionPlayerElement =
        document.getElementById(
            "selectedTransactionPlayer"
        );


    const clearSelectedPlayer =
        document.getElementById(
            "clearSelectedPlayer"
        );


    const selectedPlayerImage =
        document.getElementById(
            "selectedPlayerImage"
        );


    const selectedPlayerName =
        document.getElementById(
            "selectedPlayerName"
        );


    const selectedPlayerMeta =
        document.getElementById(
            "selectedPlayerMeta"
        );


    const selectedPlayerValue =
        document.getElementById(
            "selectedPlayerValue"
        );


    const transactionPrice =
        document.getElementById(
            "transactionPrice"
        );


    const transactionDate =
        document.getElementById(
            "transactionDate"
        );


    const transactionForm =
        document.getElementById(
            "transactionForm"
        );


    const confirmTransaction =
        document.getElementById(
            "confirmTransaction"
        );


    const transactionModalEyebrow =
        document.getElementById(
            "transactionModalEyebrow"
        );


    const transactionModalTitle =
        document.getElementById(
            "transactionModalTitle"
        );


    const transactionModalDescription =
        document.getElementById(
            "transactionModalDescription"
        );


    const transactionPriceLabel =
        document.getElementById(
            "transactionPriceLabel"
        );


    const transactionDateLabel =
        document.getElementById(
            "transactionDateLabel"
        );


    const buyPlayerButton =
        document.getElementById(
            "buyPlayerButton"
        );


    const sellPlayerButton =
        document.getElementById(
            "sellPlayerButton"
        );


    /* =====================================================
       HELPERS
    ===================================================== */

    const formatCurrency = value => {

        if (value >= 1000000) {

            return (
                value / 1000000
            )
                .toFixed(2)
                .replace(".", ",")
                + "M €";

        }


        if (value >= 1000) {

            return (
                value / 1000
            )
                .toFixed(0)
                + "K €";

        }


        return (
            new Intl.NumberFormat(
                "ca-ES"
            ).format(value)
            + " €"
        );

    };


    const getInitials = name => {

        return name
            .split(" ")
            .map(
                word => word[0]
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();

    };


    const getTodayDate = () => {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        return `${year}-${month}-${day}`;

    };


    /* =====================================================
       SEARCH - SQUAD
    ===================================================== */

    if (playerSearch) {

        playerSearch.addEventListener(
            "input",
            () => {

                const searchValue =
                    playerSearch.value
                        .toLowerCase()
                        .trim();


                const activeFilter =
                    document
                        .querySelector(
                            ".filter-button.active"
                        )
                        ?.dataset.filter
                    || "all";


                playerCards.forEach(
                    card => {

                        const playerName =
                            (
                                card.dataset.name
                                || ""
                            )
                                .toLowerCase();


                        const matchesSearch =
                            playerName.includes(
                                searchValue
                            );


                        const matchesFilter =
                            activeFilter === "all"
                            ||
                            card.dataset.position ===
                            activeFilter;


                        card.classList.toggle(
                            "is-hidden",
                            !matchesSearch
                            ||
                            !matchesFilter
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       FILTERS
    ===================================================== */

    filterButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    filterButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const selectedFilter =
                        button.dataset.filter;


                    const searchValue =
                        playerSearch
                            ? playerSearch.value
                                .toLowerCase()
                                .trim()
                            : "";


                    playerCards.forEach(
                        card => {

                            const playerName =
                                (
                                    card.dataset.name
                                    || ""
                                )
                                    .toLowerCase();


                            const matchesFilter =
                                selectedFilter === "all"
                                ||
                                card.dataset.position ===
                                selectedFilter;


                            const matchesSearch =
                                playerName.includes(
                                    searchValue
                                );


                            card.classList.toggle(
                                "is-hidden",
                                !matchesFilter
                                ||
                                !matchesSearch
                            );

                        }
                    );

                }
            );

        }
    );


    /* =====================================================
       PLAYER DETAIL MODAL
    ===================================================== */

    const openModal = () => {

        if (!playerModal) return;


        playerModal.classList.add(
            "active"
        );


        playerModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    };


    const closeModal = () => {

        if (!playerModal) return;


        playerModal.classList.remove(
            "active"
        );


        playerModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    };


    /* =====================================================
       PLAYER CARD CLICK
    ===================================================== */

    playerCards.forEach(
        card => {

            card.addEventListener(
                "click",
                event => {

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
                        card.querySelector(
                            ".player-team"
                        )
                            ?.textContent
                            .trim();


                    const position =
                        card.querySelector(
                            ".position-badge"
                        )
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
                            ? getInitials(name)
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

                        modalName.textContent =
                            name;

                    }


                    if (modalTeam) {

                        modalTeam.textContent =
                            team;

                    }


                    if (modalPosition) {

                        modalPosition.textContent =
                            position;

                    }


                    if (modalValue) {

                        modalValue.textContent =
                            value;

                    }


                    if (modalDailyChange) {

                        modalDailyChange.textContent =
                            `${dailyChange} avui`;

                    }


                    if (modalInitials) {

                        modalInitials.textContent =
                            initials;

                    }


                    openModal();

                }
            );

        }
    );


    /* =====================================================
       CLOSE PLAYER MODAL
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

    valuePeriods.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    valuePeriods.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );

                }
            );

        }
    );


    /* =====================================================
       TRANSACTION MODAL HELPERS
    ===================================================== */

    const updateTransactionModalText = () => {

        const isBuy =
            transactionType === "buy";


        if (transactionModalEyebrow) {

            transactionModalEyebrow.textContent =
                isBuy
                    ? "REGISTRAR COMPRA"
                    : "REGISTRAR VENDA";

        }


        if (transactionModalTitle) {

            transactionModalTitle.textContent =
                isBuy
                    ? "Registrar compra"
                    : "Registrar venda";

        }


        if (transactionModalDescription) {

            transactionModalDescription.textContent =
                isBuy
                    ? "Busca un jugador i registra el preu i la data de compra."
                    : "Selecciona un jugador de la teva plantilla i registra el preu i la data de venda.";

        }


        if (transactionPriceLabel) {

            transactionPriceLabel.textContent =
                isBuy
                    ? "PREU DE COMPRA"
                    : "PREU DE VENDA";

        }


        if (transactionDateLabel) {

            transactionDateLabel.textContent =
                isBuy
                    ? "DATA DE COMPRA"
                    : "DATA DE VENDA";

        }


        if (confirmTransaction) {

            confirmTransaction.textContent =
                isBuy
                    ? "Confirmar compra"
                    : "Confirmar venda";

        }

    };


    const openTransactionModal = type => {

        if (!transactionModal) return;


        transactionType =
            type;


        selectedTransactionPlayer =
            null;


        updateTransactionModalText();


        transactionModal.classList.add(
            "active"
        );


        transactionModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";


        if (transactionPlayerSearch) {

            transactionPlayerSearch.value =
                "";

        }


        if (transactionPrice) {

            transactionPrice.value =
                "";

        }


        if (transactionDate) {

            transactionDate.value =
                getTodayDate();

        }


        if (
            selectedTransactionPlayerElement
        ) {

            selectedTransactionPlayerElement.hidden =
                true;

        }


        if (confirmTransaction) {

            confirmTransaction.disabled =
                true;

        }


        renderTransactionResults(
            ""
        );


        setTimeout(
            () => {

                transactionPlayerSearch?.focus();

            },
            100
        );

    };


    const closeTransactionModal = () => {

        if (!transactionModal) return;


        transactionModal.classList.remove(
            "active"
        );


        transactionModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    };


    /* =====================================================
       GET CURRENT SQUAD NAMES

       Used later for sell mode.
    ===================================================== */

    const getCurrentSquadNames = () => {

        return Array.from(
            document.querySelectorAll(
                ".squad-player-card"
            )
        ).map(
            card =>
                (
                    card.dataset.name
                    || ""
                )
                    .toLowerCase()
                    .trim()
        );

    };


    /* =====================================================
       TRANSACTION RESULTS
    ===================================================== */

    const renderTransactionResults = query => {

        if (!transactionResults) return;


        const normalizedQuery =
            query
                .toLowerCase()
                .trim();


        let players =
            [...availablePlayers];


        /* SELL:
           Only players currently in squad.
        */

        if (
            transactionType === "sell"
        ) {

            const squadNames =
                getCurrentSquadNames();


            players =
                players.filter(
                    player =>
                        squadNames.includes(
                            player.name
                                .toLowerCase()
                                .trim()
                        )
                );

        }


        if (
            normalizedQuery.length > 0
        ) {

            players =
                players.filter(
                    player => {

                        const name =
                            player.name
                                .toLowerCase();


                        const team =
                            player.team
                                .toLowerCase();


                        return (
                            name.includes(
                                normalizedQuery
                            )
                            ||
                            team.includes(
                                normalizedQuery
                            )
                        );

                    }
                );

        }


        transactionResults.innerHTML =
            "";


        if (
            players.length === 0
        ) {

            transactionResults.innerHTML = `

                <div class="transaction-empty">

                    <span>
                        No hem trobat cap jugador
                    </span>

                </div>

            `;

            return;

        }


        if (
            normalizedQuery.length === 0
        ) {

            transactionResults.innerHTML = `

                <div class="transaction-empty">

                    <span>
                        ${
                            transactionType === "buy"
                                ? "Escriu el nom d'un jugador per buscar-lo"
                                : "Busca un jugador de la teva plantilla"
                        }
                    </span>

                </div>

            `;

            return;

        }


        players
            .slice(0, 6)
            .forEach(
                player => {

                    const initials =
                        getInitials(
                            player.name
                        );


                    const image =
                        player.image
                            ? `
                                <img
                                    src="${player.image}"
                                    alt="${player.name}"
                                >
                            `
                            : initials;


                    const result =
                        document.createElement(
                            "button"
                        );


                    result.type =
                        "button";


                    result.className =
                        "transaction-result";


                    result.innerHTML = `

                        <div
                            class="transaction-result__image"
                        >
                            ${image}
                        </div>


                        <div
                            class="transaction-result__info"
                        >

                            <strong
                                class="transaction-result__name"
                            >
                                ${player.name}
                            </strong>


                            <span
                                class="transaction-result__meta"
                            >
                                ${player.team}
                                ·
                                ${player.position}
                            </span>

                        </div>


                        <div
                            class="transaction-result__value"
                        >

                            <span>
                                VALOR
                            </span>

                            <strong>
                                ${formatCurrency(
                                    player.value
                                )}
                            </strong>

                        </div>

                    `;


                    result.addEventListener(
                        "click",
                        () => {

                            selectTransactionPlayer(
                                player
                            );

                        }
                    );


                    transactionResults.appendChild(
                        result
                    );

                }
            );

    };


    /* =====================================================
       SELECT PLAYER
    ===================================================== */

    const selectTransactionPlayer =
        player => {

            selectedTransactionPlayer =
                player;


            if (
                selectedTransactionPlayerElement
            ) {

                selectedTransactionPlayerElement.hidden =
                    false;

            }


            if (selectedPlayerImage) {

                if (player.image) {

                    selectedPlayerImage.innerHTML = `

                        <img
                            src="${player.image}"
                            alt="${player.name}"
                        >

                    `;

                } else {

                    selectedPlayerImage.textContent =
                        getInitials(
                            player.name
                        );

                }

            }


            if (selectedPlayerName) {

                selectedPlayerName.textContent =
                    player.name;

            }


            if (selectedPlayerMeta) {

                selectedPlayerMeta.textContent =
                    `${player.team} · ${player.position}`;

            }


            if (selectedPlayerValue) {

                selectedPlayerValue.textContent =
                    formatCurrency(
                        player.value
                    );

            }


            if (transactionPrice) {

                transactionPrice.value =
                    player.value;

            }


            if (confirmTransaction) {

                confirmTransaction.disabled =
                    false;

            }


            if (transactionPlayerSearch) {

                transactionPlayerSearch.value =
                    "";

            }


            transactionResults.innerHTML =
                "";

        };


    /* =====================================================
       CLEAR SELECTED PLAYER
    ===================================================== */

    const clearTransactionPlayer = () => {

        selectedTransactionPlayer =
            null;


        if (
            selectedTransactionPlayerElement
        ) {

            selectedTransactionPlayerElement.hidden =
                true;

        }


        if (transactionPrice) {

            transactionPrice.value =
                "";

        }


        if (confirmTransaction) {

            confirmTransaction.disabled =
                true;

        }


        if (transactionPlayerSearch) {

            transactionPlayerSearch.focus();

        }


        renderTransactionResults(
            ""
        );

    };


    /* =====================================================
       TRANSACTION SEARCH
    ===================================================== */

    if (transactionPlayerSearch) {

        transactionPlayerSearch.addEventListener(
            "input",
            () => {

                renderTransactionResults(
                    transactionPlayerSearch.value
                );

            }
        );

    }


    /* =====================================================
       OPEN BUY MODAL
    ===================================================== */

    if (buyPlayerButton) {

        buyPlayerButton.addEventListener(
            "click",
            () => {

                openTransactionModal(
                    "buy"
                );

            }
        );

    }


    /* =====================================================
       OPEN SELL MODAL
    ===================================================== */

    if (sellPlayerButton) {

        sellPlayerButton.addEventListener(
            "click",
            () => {

                openTransactionModal(
                    "sell"
                );

            }
        );

    }


    /* =====================================================
       CLOSE TRANSACTION MODAL
    ===================================================== */

    if (closeTransactionModal) {

        closeTransactionModal.addEventListener(
            "click",
            closeTransactionModal
        );

    }


    if (transactionModalOverlay) {

        transactionModalOverlay.addEventListener(
            "click",
            closeTransactionModal
        );

    }


    if (cancelTransaction) {

        cancelTransaction.addEventListener(
            "click",
            closeTransactionModal
        );

    }


    if (clearSelectedPlayer) {

        clearSelectedPlayer.addEventListener(
            "click",
            clearTransactionPlayer
        );

    }


    /* =====================================================
       CONFIRM TRANSACTION

       For now:
       - validates the operation
       - prints it to console

       Next step:
       - modify squad
       - update summary
       - save transaction
       - calculate profitability
    ===================================================== */

    if (transactionForm) {

        transactionForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                if (
                    !selectedTransactionPlayer
                ) {

                    return;

                }


                const price =
                    Number(
                        transactionPrice.value
                    );


                const date =
                    transactionDate.value;


                if (
                    !price
                    ||
                    price <= 0
                    ||
                    !date
                ) {

                    return;

                }


                const transaction = {

                    id:
                        Date.now(),


                    type:
                        transactionType,


                    playerId:
                        selectedTransactionPlayer.id,


                    playerName:
                        selectedTransactionPlayer.name,


                    team:
                        selectedTransactionPlayer.team,


                    position:
                        selectedTransactionPlayer.position,


                    currentValue:
                        selectedTransactionPlayer.value,


                    amount:
                        price,


                    date:
                        date

                };


                console.log(
                    "TRANSACTION:",
                    transaction
                );


                /*
                 * Temporary confirmation.
                 *
                 * Next version will:
                 *
                 * BUY:
                 * - Add player card
                 * - Update player count
                 * - Update squad value
                 * - Save purchase
                 *
                 * SELL:
                 * - Remove player card
                 * - Calculate profit/loss
                 * - Update squad value
                 * - Save sale
                 */


                closeTransactionModal();


                alert(
                    transactionType === "buy"
                        ? "Compra registrada correctament"
                        : "Venda registrada correctament"
                );

            }
        );

    }


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {

                return;

            }


            if (
                transactionModal?.classList.contains(
                    "active"
                )
            ) {

                closeTransactionModal();

            }


            if (
                playerModal?.classList.contains(
                    "active"
                )
            ) {

                closeModal();

            }

        }
    );


});
