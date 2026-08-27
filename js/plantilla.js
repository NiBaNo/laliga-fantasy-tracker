/* =========================================================
   FANTASY TRACKER
   Squad page
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       TEMPORARY PLAYER DATABASE
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


    /* =====================================================
       PLAYER DETAIL MODAL
    ===================================================== */

    const playerModal =
        document.getElementById(
            "playerModal"
        );


    const closePlayerModalButton =
        document.getElementById(
            "closePlayerModal"
        );


    const playerModalOverlay =
        document.querySelector(
            ".player-modal__overlay"
        );


    const valuePeriods =
        document.querySelectorAll(
            ".value-period"
        );


    /* =====================================================
       TRANSACTION MODAL
    ===================================================== */

    const transactionModal =
        document.getElementById(
            "transactionModal"
        );


    const transactionModalOverlay =
        document.getElementById(
            "transactionModalOverlay"
        );


    const closeTransactionModalButton =
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

        const today = new Date();

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
       SQUAD SEARCH
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


                            const matchesSearch =
                                playerName.includes(
                                    searchValue
                                );


                            const matchesFilter =
                                selectedFilter === "all"
                                ||
                                card.dataset.position ===
                                selectedFilter;


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
    );


    /* =====================================================
       PLAYER DETAIL MODAL
    ===================================================== */

    const openPlayerModal = card => {

        if (!playerModal) {

            return;

        }


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


    const closePlayerModal = () => {

        if (!playerModal) {

            return;

        }


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


                    openPlayerModal(
                        card
                    );

                }
            );

        }
    );


    if (closePlayerModalButton) {

        closePlayerModalButton.addEventListener(
            "click",
            closePlayerModal
        );

    }


    if (playerModalOverlay) {

        playerModalOverlay.addEventListener(
            "click",
            closePlayerModal
        );

    }


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
       TRANSACTION MODAL
    ===================================================== */

    const openTransactionModal =
        type => {

            if (!transactionModal) {

                return;

            }


            transactionType =
                type;


            clearTransactionPlayer();


            if (transactionPrice) {

                transactionPrice.value =
                    "";

            }


            if (transactionDate) {

                transactionDate.value =
                    getTodayDate();

            }


            if (type === "buy") {

                transactionModalEyebrow.textContent =
                    "REGISTRAR COMPRA";


                transactionModalTitle.textContent =
                    "Registrar compra";


                transactionModalDescription.textContent =
                    "Busca un jugador i registra el preu i la data de compra.";


                transactionPriceLabel.textContent =
                    "PREU DE COMPRA";


                transactionDateLabel.textContent =
                    "DATA DE COMPRA";


                confirmTransaction.textContent =
                    "Confirmar compra";

            } else {

                transactionModalEyebrow.textContent =
                    "REGISTRAR VENDA";


                transactionModalTitle.textContent =
                    "Registrar venda";


                transactionModalDescription.textContent =
                    "Selecciona un jugador i registra el preu i la data de venda.";


                transactionPriceLabel.textContent =
                    "PREU DE VENDA";


                transactionDateLabel.textContent =
                    "DATA DE VENDA";


                confirmTransaction.textContent =
                    "Confirmar venda";

            }


            transactionModal.classList.add(
                "active"
            );


            transactionModal.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.style.overflow =
                "hidden";


            setTimeout(
                () => {

                    transactionPlayerSearch.focus();

                },
                100
            );

        };


    const closeTransactionModal = () => {

        if (!transactionModal) {

            return;

        }


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
       TRANSACTION RESULTS
    ===================================================== */

    const renderTransactionResults =
        search => {

            if (!transactionResults) {

                return;

            }


            const query =
                search
                    .toLowerCase()
                    .trim();


            if (!query) {

                transactionResults.innerHTML = `

                    <div class="transaction-empty">
                        <span>
                            Cerca un jugador per començar
                        </span>
                    </div>

                `;

                return;

            }


            const results =
                availablePlayers.filter(
                    player => {

                        return (
                            player.name
                                .toLowerCase()
                                .includes(query)
                            ||
                            player.team
                                .toLowerCase()
                                .includes(query)
                        );

                    }
                );


            transactionResults.innerHTML =
                "";


            if (!results.length) {

                transactionResults.innerHTML = `

                    <div class="transaction-empty">
                        <span>
                            No s'han trobat jugadors
                        </span>
                    </div>

                `;

                return;

            }


            results.forEach(
                player => {

                    const result =
                        document.createElement(
                            "button"
                        );


                    result.type =
                        "button";


                    result.className =
                        "transaction-result";


                    const image =
                        player.image
                            ? `<img src="${player.image}" alt="${player.name}">`
                            : getInitials(
                                player.name
                            );


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
                    "";

                transactionPrice.focus();

            }


            if (confirmTransaction) {

                confirmTransaction.disabled =
                    true;

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

            transactionPlayerSearch.value =
                "";

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
       PRICE VALIDATION
    ===================================================== */

    if (transactionPrice) {

        transactionPrice.addEventListener(
            "input",
            () => {

                const price =
                    Number(
                        transactionPrice.value
                    );


                if (
                    confirmTransaction
                ) {

                    confirmTransaction.disabled =
                        !selectedTransactionPlayer
                        ||
                        !price
                        ||
                        price <= 0;

                }

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

    if (closeTransactionModalButton) {

        closeTransactionModalButton.addEventListener(
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
            () => {

                clearTransactionPlayer();

                setTimeout(
                    () => {

                        transactionPlayerSearch.focus();

                    },
                    0
                );

            }
        );

    }


    /* =====================================================
       CONFIRM TRANSACTION
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

                closePlayerModal();

            }

        }
    );


});
