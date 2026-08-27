
/* =========================================================
   PLANTILLA
   Data / Rendering / Filters / Modal
========================================================= */


document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       MOCK DATA
    ===================================================== */

    const players = [

        {
            id: 1,

            name: "Lamine Yamal",
            team: "FC Barcelona",
            teamShort: "BAR",
            position: "DAV",

            image:
                "https://img.a.transfermarkt.technology/portrait/big/937958-1707501333.png",

            value: 145800000,

            dailyChange: 2350000,
            dailyPercent: 1.64,

            change7d: 12300000,
            change15d: 19800000,
            change30d: 32400000,

            trend: [
                35,
                42,
                39,
                48,
                57,
                63,
                72,
                84
            ],

            history: [
                35,
                39,
                44,
                42,
                50,
                57,
                61,
                68,
                74,
                72,
                82,
                88,
                94,
                100
            ]
        },


        {
            id: 2,

            name: "Kylian Mbappé",
            team: "Real Madrid",
            teamShort: "RMA",
            position: "DAV",

            image:
                "https://img.a.transfermarkt.technology/portrait/big/342229-1726493602.png",

            value: 173200000,

            dailyChange: 1840000,
            dailyPercent: 1.07,

            change7d: 9400000,
            change15d: 15800000,
            change30d: 27100000,

            trend: [
                44,
                48,
                52,
                58,
                54,
                66,
                72,
                80
            ],

            history: [
                44,
                49,
                54,
                58,
                63,
                61,
                67,
                72,
                76,
                81,
                85,
                90,
                96,
                100
            ]
        },


        {
            id: 3,

            name: "Pedri",
            team: "FC Barcelona",
            teamShort: "BAR",
            position: "MIG",

            image:
                "https://img.a.transfermarkt.technology/portrait/big/683840-1693420858.png",

            value: 92300000,

            dailyChange: 720000,
            dailyPercent: 0.79,

            change7d: 5100000,
            change15d: 8600000,
            change30d: 14400000,

            trend: [
                42,
                45,
                49,
                55,
                60,
                67,
                70,
                77
            ],

            history: [
                42,
                44,
                48,
                51,
                54,
                59,
                62,
                65,
                70,
                75,
                78,
                84,
                89,
                96
            ]
        },


        {
            id: 4,

            name: "Jude Bellingham",
            team: "Real Madrid",
            teamShort: "RMA",
            position: "MIG",

            image:
                "https://img.a.transfermarkt.technology/portrait/big/581678-1726470955.png",

            value: 108400000,

            dailyChange: -540000,
            dailyPercent: -0.50,

            change7d: 2800000,
            change15d: -1600000,
            change30d: 9700000,

            trend: [
                76,
                72,
                68,
                71,
                64,
                60,
                56,
                52
            ],

            history: [
                82,
                79,
                77,
                80,
                75,
                71,
                68,
                73,
                69,
                64,
                61,
                58,
                55,
                52
            ]
        },


        {
            id: 5,

            name: "Alejandro Balde",
            team: "FC Barcelona",
            teamShort: "BAR",
            position: "DEF",

            image:
                "https://img.a.transfermarkt.technology/portrait/big/664006-1694072198.png",

            value: 48700000,

            dailyChange: 940000,
            dailyPercent: 1.97,

            change7d: 4200000,
            change15d: 6900000,
            change30d: 10300000,

            trend: [
                32,
                39,
                46,
                51,
                60,
                67,
                74,
                82
            ],

            history: [
                30,
                34,
                39,
                43,
                48,
                53,
                57,
                61,
                66,
                72,
                78,
                84,
                91,
                100
            ]
        },


        {
            id: 6,

            name: "Álex Baena",
            team: "Atlético Madrid",
            teamShort: "ATM",
            position: "MIG",

            image:
                "https://img.a.transfermarkt.technology/portrait/big/548858-1696344721.png",

            value: 67800000,

            dailyChange: 1110000,
            dailyPercent: 1.66,

            change7d: 6800000,
            change15d: 10900000,
            change30d: 18400000,

            trend: [
                38,
                45,
                52,
                48,
                60,
                68,
                77,
                90
            ],

            history: [
                33,
                38,
                42,
                48,
                53,
                50,
                58,
                63,
                69,
                76,
                81,
                86,
                93,
                100
            ]
        },


        {
            id: 7,

            name: "Pau Cubarsí",
            team: "FC Barcelona",
            teamShort: "BAR",
            position: "DEF",

            image:
                "https://img.a.transfermarkt.technology/portrait/big/864799-1708692681.png",

            value: 51200000,

            dailyChange: 390000,
            dailyPercent: 0.77,

            change7d: 2700000,
            change15d: 4400000,
            change30d: 7100000,

            trend: [
                46,
                50,
                54,
                58,
                57,
                64,
                69,
                75
            ],

            history: [
                45,
                47,
                50,
                54,
                58,
                60,
                59,
                65,
                68,
                72,
                76,
                82,
                89,
                95
            ]
        },


        {
            id: 8,

            name: "Joan García",
            team: "FC Barcelona",
            teamShort: "BAR",
            position: "POR",

            image:
                "https://img.a.transfermarkt.technology/portrait/big/703641-1695029841.png",

            value: 36900000,

            dailyChange: -280000,
            dailyPercent: -0.75,

            change7d: 1100000,
            change15d: 3300000,
            change30d: 5900000,

            trend: [
                70,
                66,
                62,
                58,
                61,
                57,
                54,
                50
            ],

            history: [
                77,
                74,
                72,
                69,
                65,
                62,
                66,
                63,
                60,
                58,
                55,
                53,
                51,
                50
            ]
        },


        {
            id: 9,

            name: "Raphinha",
            team: "FC Barcelona",
            teamShort: "BAR",
            position: "DAV",

            image:
                "https://img.a.transfermarkt.technology/portrait/big/411975-1694609672.png",

            value: 87500000,

            dailyChange: 1320000,
            dailyPercent: 1.53,

            change7d: 7700000,
            change15d: 11500000,
            change30d: 21300000,

            trend: [
                38,
                42,
                50,
                57,
                64,
                61,
                76,
                88
            ],

            history: [
                34,
                38,
                43,
                47,
                52,
                58,
                64,
                62,
                69,
                75,
                80,
                87,
                94,
                100
            ]
        },


        {
            id: 10,

            name: "Dani Carvajal",
            team: "Real Madrid",
            teamShort: "RMA",
            position: "DEF",

            image:
                "https://img.a.transfermarkt.technology/portrait/big/138927-1718463885.png",

            value: 28300000,

            dailyChange: -610000,
            dailyPercent: -2.11,

            change7d: -3400000,
            change15d: -5100000,
            change30d: -7400000,

            trend: [
                84,
                79,
                72,
                65,
                60,
                55,
                48,
                42
            ],

            history: [
                100,
                96,
                92,
                88,
                82,
                78,
                74,
                69,
                63,
                58,
                53,
                48,
                45,
                42
            ]
        }

    ];


    /* =====================================================
       DOM
    ===================================================== */

    const playerGrid =
        document.getElementById("playerGrid");

    const playerCount =
        document.getElementById("playerCount");

    const totalSquadValue =
        document.getElementById("totalSquadValue");

    const playerSearch =
        document.getElementById("playerSearch");

    const positionFilter =
        document.getElementById("positionFilter");

    const sortPlayers =
        document.getElementById("sortPlayers");

    const emptyState =
        document.getElementById("playerEmptyState");

    const playerModal =
        document.getElementById("playerModal");

    const playerModalContent =
        document.getElementById("playerModalContent");

    const playerModalClose =
        document.getElementById("playerModalClose");

    const playerModalBackdrop =
        document.getElementById("playerModalBackdrop");

    const buyPlayerButton =
        document.getElementById("buyPlayerButton");

    const sellPlayerButton =
        document.getElementById("sellPlayerButton");


    /* =====================================================
       FORMATTERS
    ===================================================== */

    function formatMoney(value) {

        const absoluteValue = Math.abs(value);

        let formatted;


        if (absoluteValue >= 1000000) {

            formatted =
                (absoluteValue / 1000000)
                    .toFixed(1)
                    .replace(".", ",")

                + "M €";

        } else if (absoluteValue >= 1000) {

            formatted =
                Math.round(absoluteValue / 1000)

                + "K €";

        } else {

            formatted =
                absoluteValue.toLocaleString("ca-ES")

                + " €";

        }


        return value < 0
            ? "-" + formatted
            : formatted;

    }


    function formatChange(value) {

        const sign =
            value > 0
                ? "+"
                : "";

        return sign + formatMoney(value);

    }


    function formatPercent(value) {

        const sign =
            value > 0
                ? "+"
                : "";

        return (
            sign
            + value.toFixed(2).replace(".", ",")
            + "%"
        );

    }


    function getChangeClass(value) {

        if (value > 0) {
            return "positive";
        }

        if (value < 0) {
            return "negative";
        }

        return "neutral";

    }


    /* =====================================================
       TEAM BADGE
    ===================================================== */

    function createTeamBadge(shortName) {

        return `
            <div class="player-card__team-badge">
                ${shortName.charAt(0)}
            </div>
        `;

    }


    /* =====================================================
       PLAYER CARD
    ===================================================== */

    function createPlayerCard(player) {

        const changeClass =
            getChangeClass(player.dailyChange);


        const trendBars =
            player.trend
                .map(value => {

                    const barClass =
                        player.dailyChange >= 0
                            ? "positive"
                            : "negative";

                    return `
                        <span
                            class="
                                player-card__trend-bar
                                ${barClass}
                            "
                            style="height: ${value}%"
                        ></span>
                    `;

                })
                .join("");


        return `

            <article
                class="player-card"
                data-player-id="${player.id}"
            >


                <!-- TOP -->

                <div class="player-card__top">


                    <span
                        class="
                            player-card__position
                            player-card__position--${player.position}
                        "
                    >
                        ${player.position}
                    </span>


                    <div class="player-card__change">

                        <span
                            class="
                                player-card__change-value
                                ${changeClass}
                            "
                        >
                            ${formatChange(player.dailyChange)}
                        </span>


                        <span
                            class="player-card__change-percent"
                        >
                            ${formatPercent(player.dailyPercent)}
                        </span>

                    </div>


                </div>


                <!-- IMAGE -->

                <div class="player-card__image-wrap">

                    <img
                        class="player-card__image"
                        src="${player.image}"
                        alt="${player.name}"
                        loading="lazy"
                    >

                </div>


                <!-- CONTENT -->

                <div class="player-card__content">


                    <h3 class="player-card__name">
                        ${player.name}
                    </h3>


                    <div class="player-card__team">

                        ${createTeamBadge(player.teamShort)}

                        <span>
                            ${player.team}
                        </span>

                    </div>


                    <!-- VALUE -->

                    <div class="player-card__value-row">


                        <div>

                            <span
                                class="player-card__value-label"
                            >
                                VALOR DE MERCAT
                            </span>


                            <strong
                                class="player-card__value"
                            >
                                ${formatMoney(player.value)}
                            </strong>

                        </div>


                        <div class="player-card__daily">

                            <span
                                class="player-card__daily-label"
                            >
                                AVUI
                            </span>


                            <strong
                                class="
                                    player-card__daily-value
                                    ${changeClass}
                                "
                            >
                                ${formatChange(player.dailyChange)}
                            </strong>

                        </div>


                    </div>


                    <!-- TREND -->

                    <div
                        class="player-card__trend"
                        aria-label="Tendència del jugador"
                    >

                        ${trendBars}

                    </div>


                    <!-- FOOTER -->

                    <div class="player-card__footer">

                        <span>
                            Última actualització
                        </span>


                        <span
                            class="player-card__details"
                        >
                            Veure detall →
                        </span>

                    </div>


                </div>


            </article>

        `;

    }


    /* =====================================================
       RENDER PLAYERS
    ===================================================== */

    function renderPlayers() {

        const searchValue =
            playerSearch.value
                .trim()
                .toLowerCase();

        const selectedPosition =
            positionFilter.value;

        const selectedSort =
            sortPlayers.value;


        let filteredPlayers =
            players.filter(player => {


                const matchesSearch =
                    player.name
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    player.team
                        .toLowerCase()
                        .includes(searchValue);


                const matchesPosition =
                    selectedPosition === "all"

                    ||

                    player.position === selectedPosition;


                return (
                    matchesSearch
                    &&
                    matchesPosition
                );

            });


        filteredPlayers =
            sortPlayerList(
                filteredPlayers,
                selectedSort
            );


        playerGrid.innerHTML =
            filteredPlayers
                .map(createPlayerCard)
                .join("");


        emptyState.classList.toggle(
            "hidden",
            filteredPlayers.length !== 0
        );


        playerGrid.classList.toggle(
            "hidden",
            filteredPlayers.length === 0
        );


        updateHeaderStats();

    }


    /* =====================================================
       SORT PLAYERS
    ===================================================== */

    function sortPlayerList(
        playerList,
        sortType
    ) {

        const sortedPlayers =
            [...playerList];


        switch (sortType) {


            case "daily-rise":

                sortedPlayers.sort(
                    (a, b) =>
                        b.dailyChange
                        -
                        a.dailyChange
                );

                break;


            case "daily-drop":

                sortedPlayers.sort(
                    (a, b) =>
                        a.dailyChange
                        -
                        b.dailyChange
                );

                break;


            case "name":

                sortedPlayers.sort(
                    (a, b) =>
                        a.name.localeCompare(
                            b.name,
                            "ca"
                        )
                );

                break;


            case "value":

            default:

                sortedPlayers.sort(
                    (a, b) =>
                        b.value
                        -
                        a.value
                );

                break;

        }


        return sortedPlayers;

    }


    /* =====================================================
       HEADER STATS
    ===================================================== */

    function updateHeaderStats() {

        const totalValue =
            players.reduce(
                (total, player) =>
                    total + player.value,
                0
            );


        playerCount.textContent =
            players.length;


        totalSquadValue.textContent =
            formatMoney(totalValue);

    }


    /* =====================================================
       PLAYER MODAL
    ===================================================== */

    function openPlayerModal(playerId) {

        const player =
            players.find(
                item =>
                    item.id === Number(playerId)
            );


        if (!player) {
            return;
        }


        const chartBars =
            player.history
                .map(value => `

                    <span
                        class="chart-bar"
                        style="height: ${value}%"
                    ></span>

                `)
                .join("");


        playerModalContent.innerHTML = `


            <div class="player-detail">


                <!-- VISUAL -->

                <div class="player-detail__visual">

                    <img
                        class="player-detail__image"
                        src="${player.image}"
                        alt="${player.name}"
                    >

                </div>


                <!-- INFO -->

                <div class="player-detail__info">


                    <span
                        class="player-detail__eyebrow"
                    >
                        ${player.position}
                        ·
                        ${player.teamShort}
                    </span>


                    <h2
                        class="player-detail__name"
                    >
                        ${player.name}
                    </h2>


                    <div
                        class="player-detail__team"
                    >
                        ${player.team}
                    </div>


                    <!-- CURRENT VALUE -->

                    <div
                        class="player-detail__current-value"
                    >

                        <span
                            class="
                                player-detail__current-value-label
                            "
                        >
                            VALOR ACTUAL
                        </span>


                        <strong
                            class="
                                player-detail__current-value-number
                            "
                        >
                            ${formatMoney(player.value)}
                        </strong>

                    </div>


                    <!-- PERIOD CHANGES -->

                    <div
                        class="player-detail__changes"
                    >


                        ${createChangeCard(
                            "AVUI",
                            player.dailyChange
                        )}


                        ${createChangeCard(
                            "7 DIES",
                            player.change7d
                        )}


                        ${createChangeCard(
                            "15 DIES",
                            player.change15d
                        )}


                        ${createChangeCard(
                            "30 DIES",
                            player.change30d
                        )}


                    </div>


                    <!-- GRAPH -->

                    <div
                        class="player-detail__graph"
                    >


                        <div
                            class="
                                player-detail__graph-header
                            "
                        >

                            <h3
                                class="
                                    player-detail__graph-title
                                "
                            >
                                Evolució del valor
                            </h3>


                            <span
                                class="
                                    player-detail__graph-subtitle
                                "
                            >
                                Últims 30 dies
                            </span>

                        </div>


                        <div
                            class="
                                player-detail__chart
                            "
                        >

                            ${chartBars}

                        </div>


                    </div>


                    <!-- ACTIONS -->

                    <div
                        class="
                            player-detail__actions
                        "
                    >

                        <button
                            class="
                                btn
                                btn--secondary
                            "
                            type="button"
                        >
                            Veure historial
                        </button>


                        <button
                            class="
                                btn
                                btn--primary
                            "
                            type="button"
                        >
                            Registrar venda
                        </button>

                    </div>


                </div>


            </div>

        `;


        playerModal.classList.remove(
            "hidden"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CHANGE CARD
    ===================================================== */

    function createChangeCard(
        period,
        value
    ) {

        const changeClass =
            getChangeClass(value);


        return `

            <div class="player-change-card">

                <span
                    class="
                        player-change-card__period
                    "
                >
                    ${period}
                </span>


                <strong
                    class="
                        player-change-card__value
                        ${changeClass}
                    "
                >
                    ${formatChange(value)}
                </strong>

            </div>

        `;

    }


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closePlayerModal() {

        playerModal.classList.add(
            "hidden"
        );


        document.body.style.overflow = "";

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    playerSearch.addEventListener(
        "input",
        renderPlayers
    );


    positionFilter.addEventListener(
        "change",
        renderPlayers
    );


    sortPlayers.addEventListener(
        "change",
        renderPlayers
    );


    playerGrid.addEventListener(
        "click",
        event => {

            const card =
                event.target.closest(
                    ".player-card"
                );


            if (!card) {
                return;
            }


            openPlayerModal(
                card.dataset.playerId
            );

        }
    );


    playerModalClose.addEventListener(
        "click",
        closePlayerModal
    );


    playerModalBackdrop.addEventListener(
        "click",
        closePlayerModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
                &&
                !playerModal.classList.contains(
                    "hidden"
                )
            ) {

                closePlayerModal();

            }

        }
    );


    /* =====================================================
       TEMPORARY BUTTONS
    ===================================================== */

    buyPlayerButton.addEventListener(
        "click",
        () => {

            alert(
                "El registre de compra serà el següent pas."
            );

        }
    );


    sellPlayerButton.addEventListener(
        "click",
        () => {

            alert(
                "Selecciona un jugador per registrar la venda."
            );

        }
    );


    /* =====================================================
       INITIAL RENDER
    ===================================================== */

    renderPlayers();


});
