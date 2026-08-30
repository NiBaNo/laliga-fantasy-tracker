/* =========================================================
   FANTASY TRACKER
   Squad page

   - Carrega els jugadors reals des de Supabase.
   - Reconstrueix la plantilla a partir de transactions.
   - Registra BUY / SELL a Supabase.
   - Mostra els valors actuals reals dels jugadors.
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {


    /* =====================================================
       SUPABASE
    ===================================================== */

    const SUPABASE_URL =
        "https://xkwzddjzypnskakskell.supabase.co";

    const SUPABASE_ANON_KEY =
        "sb_publishable_mRv3S9r8wbop2EyPR5Icyg_bTAHwYNz";


    if (!window.supabase) {

        console.error(
            "Supabase no està carregat."
        );

        return;

    }


    const supabase =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );



    /* =====================================================
       STATE
    ===================================================== */

    let allPlayers = [];

    let squadPlayers = [];

    let transactions = [];

    let transactionType = "buy";

    let selectedTransactionPlayer = null;

    let selectedDetailPlayer = null;

    let selectedDetailHistory = [];



    /* =====================================================
       ELEMENTS
    ===================================================== */

    const playersGrid =
        document.getElementById(
            "playersGrid"
        );


    const playerSearch =
        document.getElementById(
            "playerSearch"
        );


    const filterButtons =
        document.querySelectorAll(
            ".filter-button"
        );


    const sortPlayers =
        document.getElementById(
            "sortPlayers"
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


    const modalPlayerInitials =
        document.getElementById(
            "modalPlayerInitials"
        );


    const modalPlayerName =
        document.getElementById(
            "modalPlayerName"
        );


    const modalPlayerTeam =
        document.getElementById(
            "modalPlayerTeam"
        );


    const modalPlayerPosition =
        document.getElementById(
            "modalPlayerPosition"
        );


    const modalPlayerValue =
        document.getElementById(
            "modalPlayerValue"
        );


    const modalPlayerDailyChange =
        document.getElementById(
            "modalPlayerDailyChange"
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

        const number =
            Number(value) || 0;


        if (number >= 1000000) {

            return (
                number / 1000000
            )
                .toFixed(2)
                .replace(
                    ".",
                    ","
                )
                + "M €";

        }


        if (number >= 1000) {

            return (
                number / 1000
            )
                .toFixed(0)
                + "K €";

        }


        return (
            new Intl.NumberFormat(
                "ca-ES"
            ).format(number)
            + " €"
        );

    };


    const formatSignedCurrency =
        value => {

            const number =
                Number(value) || 0;


            if (number === 0) {

                return "0 €";

            }


            const sign =
                number > 0
                    ? "+"
                    : "−";


            return (
                sign
                +
                formatCurrency(
                    Math.abs(number)
                )
            );

        };


    const getInitials = name => {

        return String(
            name || ""
        )
            .trim()
            .split(/\s+/)
            .filter(Boolean)
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


        return [

            today.getFullYear(),

            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            ),

            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            )

        ].join("-");

    };


    const positionInfo =
        position => {

            const map = {

                POR: {

                    label: "PORTER",

                    filter: "portero",

                    className: "goalkeeper"

                },

                DEF: {

                    label: "DEFENSA",

                    filter: "defensa",

                    className: "defender"

                },

                MIG: {

                    label: "MIGCAMPISTA",

                    filter: "centrocampista",

                    className: "midfielder"

                },

                DAV: {

                    label: "DAVANTER",

                    filter: "delantero",

                    className: "forward"

                }

            };


            return map[position]
                ||
                {

                    label:
                        position || "",

                    filter:
                        "all",

                    className:
                        "defender"

                };

        };


    const escapeHtml = value => {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    };


    const getTeamInitials =
        team => {

            const clean =
                String(
                    team || ""
                ).trim();


            if (!clean) {

                return "—";

            }


            const words =
                clean
                    .split(/\s+/)
                    .filter(Boolean);


            if (words.length >= 2) {

                return words
                    .slice(0, 3)
                    .map(
                        word => word[0]
                    )
                    .join("")
                    .toUpperCase();

            }


            return clean
                .slice(0, 3)
                .toUpperCase();

        };


    const setBodyModalState =
        open => {

            document.body.style.overflow =
                open
                    ? "hidden"
                    : "";

        };



    /* =====================================================
       SUPABASE - SESSIÓ
    ===================================================== */

    const getCurrentUser =
        async () => {

            const {

                data,

                error

            } =
                await supabase.auth.getSession();


            if (error) {

                console.error(
                    "Error obtenint la sessió:",
                    error
                );

                return null;

            }


            return (
                data.session?.user
                ||
                null
            );

        };



    /* =====================================================
       CARREGAR JUGADORS
    ===================================================== */

    const loadPlayers =
        async () => {

            const {

                data,

                error

            } =
                await supabase
                    .from("players")
                    .select(
                        `
                        id,
                        source_id,
                        name,
                        team,
                        position,
                        current_value,
                        daily_change,
                        points,
                        updated_at
                        `
                    )
                    .order(
                        "name",
                        {
                            ascending: true
                        }
                    );


            if (error) {

                console.error(
                    "Error carregant jugadors:",
                    error
                );

                throw error;

            }


            allPlayers =
                data || [];


            /*
               Carreguem l'històric necessari
               per mostrar evolució recent.
            */

            const {

                data: history,

                error: historyError

            } =
                await supabase
                    .from("player_values")
                    .select(
                        `
                        player_id,
                        recorded_on,
                        market_value,
                        daily_change,
                        points
                        `
                    )
                    .order(
                        "recorded_on",
                        {
                            ascending: false
                        }
                    )
                    .limit(
                        Math.max(
                            allPlayers.length * 35,
                            5000
                        )
                    );


            if (historyError) {

                console.warn(
                    "No s'ha pogut carregar l'històric:",
                    historyError
                );

            }


            const historyByPlayer =
                new Map();


            (
                history || []
            ).forEach(
                row => {

                    if (
                        !historyByPlayer.has(
                            row.player_id
                        )
                    ) {

                        historyByPlayer.set(
                            row.player_id,
                            []
                        );

                    }


                    historyByPlayer
                        .get(
                            row.player_id
                        )
                        .push(row);

                }
            );


            allPlayers =
                allPlayers.map(
                    player => ({

                        ...player,

                        history:
                            historyByPlayer.get(
                                player.id
                            )
                            ||
                            []

                    })
                );

        };



    /* =====================================================
       CARREGAR TRANSACCIONS
    ===================================================== */

    const loadTransactions =
        async user => {

            if (!user) {

                transactions = [];

                squadPlayers = [];

                return;

            }


            const {

                data,

                error

            } =
                await supabase
                    .from("transactions")
                    .select(
                        `
                        id,
                        user_id,
                        player_id,
                        transaction_type,
                        amount,
                        transaction_date,
                        created_at,

                        player:players (
                            id,
                            source_id,
                            name,
                            team,
                            position,
                            current_value,
                            daily_change,
                            points
                        )
                        `
                    )
                    .eq(
                        "user_id",
                        user.id
                    )
                    .order(
                        "transaction_date",
                        {
                            ascending: true
                        }
                    )
                    .order(
                        "created_at",
                        {
                            ascending: true
                        }
                    );


            if (error) {

                console.error(
                    "Error carregant transaccions:",
                    error
                );

                throw error;

            }


            transactions =
                data || [];


            rebuildSquad();

        };



    /* =====================================================
       RECONSTRUIR PLANTILLA
    ===================================================== */

    const rebuildSquad =
        () => {

            const current =
                new Map();


            transactions.forEach(
                transaction => {

                    if (
                        !transaction.player
                    ) {

                        return;

                    }


                    if (
                        transaction.transaction_type
                        ===
                        "BUY"
                    ) {

                        current.set(
                            transaction.player_id,
                            transaction.player
                        );

                    }


                    if (
                        transaction.transaction_type
                        ===
                        "SELL"
                    ) {

                        current.delete(
                            transaction.player_id
                        );

                    }

                }
            );


            squadPlayers =
                Array.from(
                    current.values()
                ).map(
                    player => {

                        const fullPlayer =
                            allPlayers.find(
                                item =>
                                    item.id
                                    ===
                                    player.id
                            );


                        return (
                            fullPlayer
                            ||
                            player
                        );

                    }
                );

        };



    /* =====================================================
       RESUM PLANTILLA
    ===================================================== */

    const updateSummary =
        () => {

            const cards =
                document.querySelectorAll(
                    ".squad-summary__card"
                );


            if (cards.length < 4) {

                return;

            }


            const totalValue =
                squadPlayers.reduce(
                    (
                        sum,
                        player
                    ) =>
                        sum
                        +
                        (
                            Number(
                                player.current_value
                            )
                            ||
                            0
                        ),
                    0
                );


            const totalDailyChange =
                squadPlayers.reduce(
                    (
                        sum,
                        player
                    ) =>
                        sum
                        +
                        (
                            Number(
                                player.daily_change
                            )
                            ||
                            0
                        ),
                    0
                );


            const bestDaily =
                squadPlayers.length
                    ? Math.max(
                        ...squadPlayers.map(
                            player =>
                                Number(
                                    player.daily_change
                                )
                                ||
                                0
                        )
                    )
                    : 0;


            cards[0]
                .querySelector(
                    ".squad-summary__value"
                )
                .textContent =
                    formatCurrency(
                        totalValue
                    );


            const totalChangeElement =
                cards[0]
                    .querySelector(
                        ".squad-summary__change"
                    );


            totalChangeElement.textContent =
                `${
                    totalDailyChange >= 0
                        ? "↑"
                        : "↓"
                } ${
                    formatSignedCurrency(
                        totalDailyChange
                    )
                } avui`;


            totalChangeElement.className =
                `squad-summary__change ${
                    totalDailyChange >= 0
                        ? "positive"
                        : "negative"
                }`;


            cards[1]
                .querySelector(
                    ".squad-summary__value"
                )
                .textContent =
                    String(
                        squadPlayers.length
                    );


            cards[1]
                .querySelector(
                    ".squad-summary__change"
                )
                .textContent =
                    "plantilla actual";


            cards[2]
                .querySelector(
                    ".squad-summary__value"
                )
                .textContent =
                    formatSignedCurrency(
                        bestDaily
                    );


            cards[2]
                .querySelector(
                    ".squad-summary__change"
                )
                .textContent =
                    "avui";


            cards[2]
                .querySelector(
                    ".squad-summary__change"
                )
                .className =
                    `squad-summary__change ${
                        bestDaily >= 0
                            ? "positive"
                            : "negative"
                    }`;


            /*
               Encara no calculem la rendibilitat.

               El pressupost inicial el configurarem
               manualment en el següent pas.
            */

            cards[3]
                .querySelector(
                    ".squad-summary__value"
                )
                .textContent =
                    "—";


            cards[3]
                .querySelector(
                    ".squad-summary__change"
                )
                .textContent =
                    "configura el pressupost inicial";


            cards[3]
                .querySelector(
                    ".squad-summary__change"
                )
                .className =
                    "squad-summary__change neutral";

        };



    /* =====================================================
       ORDRE
    ===================================================== */

    const getWeeklyChange =
        player => {

            const current =
                Number(
                    player.current_value
                )
                ||
                0;


            const history =
                [...(
                    player.history
                    ||
                    []
                )]
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            String(
                                b.recorded_on
                            ).localeCompare(
                                String(
                                    a.recorded_on
                                )
                            )
                    );


            /*
               Busquem el registre d'uns 7 dies enrere.
            */

            const reference =
                history.find(
                    row => {

                        const currentDate =
                            new Date(
                                getTodayDate()
                            );


                        const rowDate =
                            new Date(
                                row.recorded_on
                            );


                        const difference =
                            Math.round(
                                (
                                    currentDate
                                    -
                                    rowDate
                                )
                                /
                                (
                                    1000
                                    *
                                    60
                                    *
                                    60
                                    *
                                    24
                                )
                            );


                        return difference >= 7;

                    }
                );


            if (!reference) {

                return null;

            }


            return (
                current
                -
                (
                    Number(
                        reference.market_value
                    )
                    ||
                    0
                )
            );

        };


    const sortSquad =
        players => {

            const sorted =
                [...players];


            const mode =
                sortPlayers?.value
                ||
                "value";


            sorted.sort(
                (
                    a,
                    b
                ) => {

                    if (
                        mode
                        ===
                        "daily"
                    ) {

                        return (
                            Number(
                                b.daily_change
                            )
                            ||
                            0
                        )
                        -
                        (
                            Number(
                                a.daily_change
                            )
                            ||
                            0
                        );

                    }


                    if (
                        mode
                        ===
                        "weekly"
                    ) {

                        const weeklyA =
                            getWeeklyChange(a);


                        const weeklyB =
                            getWeeklyChange(b);


                        return (
                            weeklyB
                            ??
                            -Infinity
                        )
                        -
                        (
                            weeklyA
                            ??
                            -Infinity
                        );

                    }


                    return (
                        Number(
                            b.current_value
                        )
                        ||
                        0
                    )
                    -
                    (
                        Number(
                            a.current_value
                        )
                        ||
                        0
                    );

                }
            );


            return sorted;

        };



    /* =====================================================
       CREAR TARGETA JUGADOR
    ===================================================== */

    const createPlayerCard =
        player => {

            const info =
                positionInfo(
                    player.position
                );


            const daily =
                Number(
                    player.daily_change
                )
                ||
                0;


            const weekly =
                getWeeklyChange(
                    player
                );


            const points =
                Number(
                    player.points
                )
                ||
                0;


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "squad-player-card";


            card.dataset.position =
                info.filter;


            card.dataset.name =
                player.name
                ||
                "";


            card.dataset.playerId =
                player.id;


            const trendClass =
                daily >= 0
                    ? "positive"
                    : "negative";


            const trendArrow =
                daily >= 0
                    ? "↑"
                    : "↓";


            const weeklyText =
                weekly === null
                    ? "—"
                    : formatSignedCurrency(
                        weekly
                    );


            const initials =
                getInitials(
                    player.name
                );


            card.innerHTML = `

                <div
                    class="squad-player-card__top"
                >

                    <div
                        class="squad-player-card__identity"
                    >

                        <div
                            class="
                                player-photo
                                player-photo--${info.className}
                            "
                        >
                            ${initials}
                        </div>


                        <div>

                            <h3>
                                ${escapeHtml(
                                    player.name
                                )}
                            </h3>


                            <div
                                class="player-team"
                            >

                                <span
                                    class="team-badge"
                                >
                                    ${escapeHtml(
                                        getTeamInitials(
                                            player.team
                                        )
                                    )}
                                </span>

                                ${escapeHtml(
                                    player.team
                                    ||
                                    ""
                                )}

                            </div>

                        </div>

                    </div>


                    <button
                        class="player-menu-button"
                        aria-label="Opcions"
                        type="button"
                    >
                        ⋮
                    </button>

                </div>


                <div
                    class="player-position"
                >

                    <span
                        class="
                            position-badge
                            position-badge--${info.className}
                        "
                    >
                        ${info.label}
                    </span>


                    <span
                        class="
                            player-market-trend
                            ${trendClass}
                        "
                    >
                        ${trendArrow}
                        ${formatSignedCurrency(
                            daily
                        )}
                    </span>

                </div>


                <div
                    class="player-value"
                >

                    <span>
                        VALOR ACTUAL
                    </span>


                    <strong>
                        ${formatCurrency(
                            player.current_value
                        )}
                    </strong>

                </div>


                <div
                    class="player-change-grid"
                >

                    <div>

                        <span>
                            AVUI
                        </span>


                        <strong
                            class="${trendClass}"
                        >
                            ${formatSignedCurrency(
                                daily
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            7 DIES
                        </span>


                        <strong
                            class="${
                                weekly === null
                                    ? ""
                                    : weekly >= 0
                                        ? "positive"
                                        : "negative"
                            }"
                        >
                            ${weeklyText}
                        </strong>

                    </div>

                </div>


                <div
                    class="player-points"
                >

                    <div
                        class="player-points__header"
                    >

                        <span>
                            PUNTS TEMPORADA
                        </span>


                        <strong>
                            ${points} pts
                        </strong>

                    </div>


                    <div
                        class="points-trend"
                    >
                        ${createPointDots(
                            player
                        )}
                    </div>

                </div>

            `;


            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".player-menu-button"
                        )
                    ) {

                        event.stopPropagation();

                        return;

                    }


                    openPlayerModal(
                        player
                    );

                }
            );


            return card;

        };



    /* =====================================================
       PUNTS
    ===================================================== */

    const createPointDots =
        player => {

            const history =
                [...(
                    player.history
                    ||
                    []
                )]
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            String(
                                a.recorded_on
                            ).localeCompare(
                                String(
                                    b.recorded_on
                                )
                            )
                    )
                    .slice(-5);


            if (!history.length) {

                return `
                    <span>—</span>
                    <span>—</span>
                    <span>—</span>
                    <span>—</span>
                    <span>—</span>
                `;

            }


            const values =
                history.map(
                    row =>
                        Number(
                            row.points
                        )
                        ||
                        0
                );


            const max =
                Math.max(
                    ...values,
                    1
                );


            return values
                .map(
                    value => {

                        const height =
                            Math.max(
                                12,
                                Math.round(
                                    (
                                        value
                                        /
                                        max
                                    )
                                    *
                                    100
                                )
                            );


                        return `
                            <span
                                style="
                                    height:${height}%
                                "
                                title="
                                    ${value}
                                    punts acumulats
                                "
                            ></span>
                        `;

                    }
                )
                .join("");

        };



    /* =====================================================
       RENDER PLANTILLA
    ===================================================== */

    const renderSquad =
        () => {

            if (!playersGrid) {

                return;

            }


            if (!squadPlayers.length) {

                playersGrid.innerHTML = `

                    <div
                        class="transaction-empty"
                        style="
                            grid-column:
                            1 / -1;
                            min-height:
                            180px;
                        "
                    >

                        Inicia sessió i registra
                        la teva primera compra
                        per començar la plantilla.

                    </div>

                `;


                updateSummary();

                return;

            }


            playersGrid.innerHTML =
                "";


            sortSquad(
                squadPlayers
            ).forEach(
                player => {

                    playersGrid.appendChild(
                        createPlayerCard(
                            player
                        )
                    );

                }
            );


            applySquadFilters();

            updateSummary();

        };



    /* =====================================================
       FILTRES
    ===================================================== */

    const applySquadFilters =
        () => {

            const searchValue =
                playerSearch
                    ?.value
                    .toLowerCase()
                    .trim()
                ||
                "";


            const activeFilter =
                document
                    .querySelector(
                        ".filter-button.active"
                    )
                    ?.dataset.filter
                ||
                "all";


            document
                .querySelectorAll(
                    ".squad-player-card"
                )
                .forEach(
                    card => {

                        const name =
                            (
                                card.dataset.name
                                ||
                                ""
                            )
                                .toLowerCase();


                        const position =
                            card.dataset.position
                            ||
                            "";


                        const matchesSearch =
                            name.includes(
                                searchValue
                            );


                        const matchesFilter =
                            activeFilter
                            ===
                            "all"
                            ||
                            position
                            ===
                            activeFilter;


                        card.classList.toggle(
                            "is-hidden",
                            !(
                                matchesSearch
                                &&
                                matchesFilter
                            )
                        );

                    }
                );

        };


    playerSearch?.addEventListener(
        "input",
        applySquadFilters
    );


    filterButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    filterButtons.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    applySquadFilters();

                }
            );

        }
    );


    sortPlayers?.addEventListener(
        "change",
        renderSquad
    );



    /* =====================================================
       PLAYER DETAIL MODAL
    ===================================================== */

    const openPlayerModal =
        async player => {

            if (!playerModal) {

                return;

            }


            selectedDetailPlayer =
                player;


            const info =
                positionInfo(
                    player.position
                );


            const daily =
                Number(
                    player.daily_change
                )
                ||
                0;


            modalPlayerInitials.textContent =
                getInitials(
                    player.name
                );


            modalPlayerName.textContent =
                player.name
                ||
                "";


            modalPlayerTeam.textContent =
                player.team
                ||
                "";


            modalPlayerPosition.textContent =
                info.label;


            modalPlayerValue.textContent =
                formatCurrency(
                    player.current_value
                );


            modalPlayerDailyChange.textContent =
                `${formatSignedCurrency(
                    daily
                )} avui`;


            modalPlayerDailyChange.className =
                daily >= 0
                    ? "positive"
                    : "negative";


            playerModal.classList.add(
                "active"
            );


            playerModal.setAttribute(
                "aria-hidden",
                "false"
            );


            setBodyModalState(
                true
            );


            await loadPlayerHistory(
                player
            );

        };


    const closePlayerModal =
        () => {

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


            setBodyModalState(
                false
            );

        };



    /* =====================================================
       HISTÒRIC D'UN JUGADOR
    ===================================================== */

    const loadPlayerHistory =
        async player => {

            const {

                data,

                error

            } =
                await supabase
                    .from("player_values")
                    .select(
                        `
                        recorded_on,
                        market_value,
                        daily_change,
                        points
                        `
                    )
                    .eq(
                        "player_id",
                        player.id
                    )
                    .order(
                        "recorded_on",
                        {
                            ascending: true
                        }
                    )
                    .limit(60);


            if (error) {

                console.error(
                    "Error carregant historial del jugador:",
                    error
                );

                return;

            }


            selectedDetailHistory =
                data || [];


            renderPlayerHistory(
                7
            );

        };



    /* =====================================================
       RENDER HISTÒRIC
    ===================================================== */

    const renderPlayerHistory =
        period => {

            const history =
                selectedDetailHistory;


            const chartBars =
                document.querySelector(
                    "#playerModal .chart-bars"
                );


            const periodValues =
                document.querySelectorAll(
                    "#playerModal .period-values > div"
                );


            const pointsChart =
                document.querySelector(
                    "#playerModal .points-chart"
                );


            if (!chartBars) {

                return;

            }


            const relevant =
                history.slice(
                    -period
                );


            const chartData =
                relevant.slice(
                    -7
                );


            const marketValues =
                chartData.map(
                    row =>
                        Number(
                            row.market_value
                        )
                        ||
                        0
                );


            if (!marketValues.length) {

                chartBars.innerHTML =
                    `
                        <span
                            style="height:20%"
                        ></span>
                    `;

            } else {

                const min =
                    Math.min(
                        ...marketValues
                    );


                const max =
                    Math.max(
                        ...marketValues
                    );


                const range =
                    max - min
                    ||
                    1;


                chartBars.innerHTML =
                    marketValues
                        .map(
                            value => {

                                const height =
                                    20
                                    +
                                    (
                                        (
                                            value
                                            -
                                            min
                                        )
                                        /
                                        range
                                    )
                                    *
                                    72;


                                return `
                                    <span
                                        style="
                                            height:
                                            ${height.toFixed(1)}%
                                        "
                                        title="
                                            ${formatCurrency(
                                                value
                                            )}
                                        "
                                    ></span>
                                `;

                            }
                        )
                        .join("");

            }


            const currentValue =
                history.length

                    ? Number(
                        history[
                            history.length - 1
                        ].market_value
                    )
                    ||
                    0

                    : Number(
                        selectedDetailPlayer
                            ?.current_value
                    )
                    ||
                    0;


            const renderPeriodValue =
                days => {

                    if (!history.length) {

                        return null;

                    }


                    const targetIndex =
                        history.length
                        -
                        1
                        -
                        days;


                    const reference =
                        targetIndex >= 0
                            ? Number(
                                history[
                                    targetIndex
                                ].market_value
                            )
                            ||
                            0
                            : null;


                    if (
                        reference
                        ===
                        null
                    ) {

                        return null;

                    }


                    return (
                        currentValue
                        -
                        reference
                    );

                };


            [7, 15, 30].forEach(
                (
                    days,
                    index
                ) => {

                    const value =
                        renderPeriodValue(
                            days
                        );


                    if (
                        !periodValues[index]
                    ) {

                        return;

                    }


                    const strong =
                        periodValues[index]
                            .querySelector(
                                "strong"
                            );


                    if (strong) {

                        strong.textContent =
                            value === null
                                ? "—"
                                : formatSignedCurrency(
                                    value
                                );


                        strong.className =
                            value === null
                                ? ""
                                : value >= 0
                                    ? "positive"
                                    : "negative";

                    }

                }
            );


            if (pointsChart) {

                const pointHistory =
                    history.slice(
                        -5
                    );


                if (
                    !pointHistory.length
                ) {

                    pointsChart.innerHTML =
                        `
                            <div
                                class="transaction-empty"
                            >
                                Sense historial de punts
                                disponible.
                            </div>
                        `;

                } else {

                    const values =
                        pointHistory.map(
                            row =>
                                Number(
                                    row.points
                                )
                                ||
                                0
                        );


                    const max =
                        Math.max(
                            ...values,
                            1
                        );


                    pointsChart.innerHTML =
                        pointHistory
                            .map(
                                row => {

                                    const value =
                                        Number(
                                            row.points
                                        )
                                        ||
                                        0;


                                    const height =
                                        Math.max(
                                            8,
                                            (
                                                value
                                                /
                                                max
                                            )
                                            *
                                            100
                                        );


                                    return `
                                        <div
                                            class="
                                                points-chart__bar
                                            "
                                        >

                                            <span>
                                                ${escapeHtml(
                                                    formatShortDate(
                                                        row.recorded_on
                                                    )
                                                )}
                                            </span>


                                            <div>

                                                <i
                                                    style="
                                                        height:
                                                        ${height}%
                                                    "
                                                ></i>

                                            </div>


                                            <strong>
                                                ${value}
                                            </strong>

                                        </div>
                                    `;

                                }
                            )
                            .join("");

                }

            }

        };



    const formatShortDate =
        value => {

            const date =
                new Date(
                    `${value}T00:00:00`
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return "—";

            }


            return `${
                String(
                    date.getDate()
                ).padStart(
                    2,
                    "0"
                )
            }/${
                String(
                    date.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                )
            }`;

        };



    /* =====================================================
       TRANSACTION MODAL
    ===================================================== */

    const getTransactionCandidates =
        () => {

            const squadIds =
                new Set(
                    squadPlayers.map(
                        player =>
                            player.id
                    )
                );


            /*
               Venda:
               només jugadors de la plantilla.
            */

            if (
                transactionType
                ===
                "sell"
            ) {

                return [
                    ...squadPlayers
                ];

            }


            /*
               Compra:
               només jugadors que encara
               no estan a la plantilla.
            */

            return allPlayers.filter(
                player =>
                    !squadIds.has(
                        player.id
                    )
            );

        };



    const openTransactionModal =
        async type => {

            const user =
                await getCurrentUser();


            if (!user) {

                alert(
                    "Has d'iniciar sessió per registrar compres o vendes."
                );

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


            const isBuy =
                type
                ===
                "buy";


            transactionModalEyebrow.textContent =
                isBuy
                    ? "REGISTRAR COMPRA"
                    : "REGISTRAR VENDA";


            transactionModalTitle.textContent =
                isBuy
                    ? "Registrar compra"
                    : "Registrar venda";


            transactionModalDescription.textContent =
                isBuy

                    ? "Busca un jugador i registra el preu i la data de compra."

                    : "Selecciona un jugador i registra el preu i la data de venda.";


            transactionPriceLabel.textContent =
                isBuy
                    ? "PREU DE COMPRA"
                    : "PREU DE VENDA";


            transactionDateLabel.textContent =
                isBuy
                    ? "DATA DE COMPRA"
                    : "DATA DE VENDA";


            confirmTransaction.textContent =
                isBuy
                    ? "Confirmar compra"
                    : "Confirmar venda";


            transactionModal.classList.add(
                "active"
            );


            transactionModal.setAttribute(
                "aria-hidden",
                "false"
            );


            setBodyModalState(
                true
            );


            setTimeout(
                () => {

                    transactionPlayerSearch?.focus();

                },
                100
            );

        };


    const closeTransactionModal =
        () => {

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


            setBodyModalState(
                false
            );

        };



    /* =====================================================
       RESULTATS DE CERCA
    ===================================================== */

    const renderTransactionResults =
        search => {

            if (!transactionResults) {

                return;

            }


            const query =
                String(
                    search || ""
                )
                    .toLowerCase()
                    .trim();


            const candidates =
                getTransactionCandidates();


            if (!query) {

                transactionResults.innerHTML =
                    `

                    <div
                        class="transaction-empty"
                    >

                        <span>

                            ${
                                transactionType
                                ===
                                "buy"

                                    ? "Cerca un jugador per començar"

                                    : "Cerca un jugador de la teva plantilla"

                            }

                        </span>

                    </div>

                    `;

                return;

            }


            const results =
                candidates
                    .filter(
                        player => {

                            const name =
                                String(
                                    player.name
                                    ||
                                    ""
                                )
                                    .toLowerCase();


                            const team =
                                String(
                                    player.team
                                    ||
                                    ""
                                )
                                    .toLowerCase();


                            return (
                                name.includes(
                                    query
                                )
                                ||
                                team.includes(
                                    query
                                )
                            );

                        }
                    )
                    .slice(
                        0,
                        30
                    );


            transactionResults.innerHTML =
                "";


            if (!results.length) {

                transactionResults.innerHTML =
                    `

                    <div
                        class="transaction-empty"
                    >

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


                    const info =
                        positionInfo(
                            player.position
                        );


                    result.innerHTML =
                        `

                        <div
                            class="
                                transaction-result__image
                            "
                        >

                            ${getInitials(
                                player.name
                            )}

                        </div>


                        <div
                            class="
                                transaction-result__info
                            "
                        >

                            <strong
                                class="
                                    transaction-result__name
                                "
                            >

                                ${escapeHtml(
                                    player.name
                                )}

                            </strong>


                            <span
                                class="
                                    transaction-result__meta
                                "
                            >

                                ${escapeHtml(
                                    player.team
                                    ||
                                    ""
                                )}

                                ·

                                ${info.label}

                            </span>

                        </div>


                        <div
                            class="
                                transaction-result__value
                            "
                        >

                            <span>
                                VALOR
                            </span>


                            <strong>

                                ${formatCurrency(
                                    player.current_value
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
       SELECCIONAR JUGADOR
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

                selectedPlayerImage.textContent =
                    getInitials(
                        player.name
                    );

            }


            if (selectedPlayerName) {

                selectedPlayerName.textContent =
                    player.name;

            }


            if (selectedPlayerMeta) {

                selectedPlayerMeta.textContent =
                    `${
                        player.team
                        ||
                        ""
                    } · ${
                        positionInfo(
                            player.position
                        ).label
                    }`;

            }


            if (selectedPlayerValue) {

                selectedPlayerValue.textContent =
                    formatCurrency(
                        player.current_value
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
       NETEJAR JUGADOR SELECCIONAT
    ===================================================== */

    const clearTransactionPlayer =
        () => {

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
       CERCA DE JUGADOR
    ===================================================== */

    transactionPlayerSearch?.addEventListener(
        "input",
        () => {

            renderTransactionResults(
                transactionPlayerSearch.value
            );

        }
    );



    /* =====================================================
       VALIDACIÓ PREU
    ===================================================== */

    transactionPrice?.addEventListener(
        "input",
        () => {

            const price =
                Number(
                    transactionPrice.value
                );


            if (confirmTransaction) {

                confirmTransaction.disabled =
                    !selectedTransactionPlayer
                    ||
                    !price
                    ||
                    price <= 0;

            }

        }
    );



    /* =====================================================
       OBRIR COMPRA / VENDA
    ===================================================== */

    buyPlayerButton?.addEventListener(
        "click",
        () => {

            openTransactionModal(
                "buy"
            );

        }
    );


    sellPlayerButton?.addEventListener(
        "click",
        () => {

            openTransactionModal(
                "sell"
            );

        }
    );



    /* =====================================================
       TANCAR MODAL TRANSACCIÓ
    ===================================================== */

    closeTransactionModalButton?.addEventListener(
        "click",
        closeTransactionModal
    );


    transactionModalOverlay?.addEventListener(
        "click",
        closeTransactionModal
    );


    cancelTransaction?.addEventListener(
        "click",
        closeTransactionModal
    );


    clearSelectedPlayer?.addEventListener(
        "click",
        () => {

            clearTransactionPlayer();


            setTimeout(
                () => {

                    transactionPlayerSearch?.focus();

                },
                0
            );

        }
    );



    /* =====================================================
       CONFIRMAR TRANSACCIÓ
    ===================================================== */

    transactionForm?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (
                !selectedTransactionPlayer
            ) {

                return;

            }


            const user =
                await getCurrentUser();


            if (!user) {

                alert(
                    "La sessió ha caducat. Torna a iniciar sessió."
                );

                return;

            }


            const price =
                Number(
                    transactionPrice?.value
                );


            const date =
                transactionDate?.value;


            if (
                !price
                ||
                price <= 0
                ||
                !date
            ) {

                return;

            }


            const isBuy =
                transactionType
                ===
                "buy";


            /*
               Protecció addicional.
            */

            const isInSquad =
                squadPlayers.some(
                    player =>
                        player.id
                        ===
                        selectedTransactionPlayer.id
                );


            if (
                isBuy
                &&
                isInSquad
            ) {

                alert(
                    "Aquest jugador ja forma part de la teva plantilla."
                );

                return;

            }


            if (
                !isBuy
                &&
                !isInSquad
            ) {

                alert(
                    "Aquest jugador no forma part de la teva plantilla."
                );

                return;

            }


            confirmTransaction.disabled =
                true;


            confirmTransaction.textContent =
                isBuy
                    ? "Registrant compra..."
                    : "Registrant venda...";


            const {

                error

            } =
                await supabase
                    .from("transactions")
                    .insert({

                        user_id:
                            user.id,

                        player_id:
                            selectedTransactionPlayer.id,

                        transaction_type:
                            isBuy
                                ? "BUY"
                                : "SELL",

                        amount:
                            price,

                        transaction_date:
                            date

                    });


            if (error) {

                console.error(
                    "Error guardant la transacció:",
                    error
                );


                confirmTransaction.disabled =
                    false;


                confirmTransaction.textContent =
                    isBuy
                        ? "Confirmar compra"
                        : "Confirmar venda";


                alert(
                    "No s'ha pogut registrar la transacció."
                );


                return;

            }


            /*
               Recarreguem les transaccions
               i reconstruïm la plantilla.
            */

            await loadTransactions(
                user
            );


            renderSquad();


            closeTransactionModal();


            alert(
                isBuy
                    ? "Compra registrada correctament"
                    : "Venda registrada correctament"
            );

        }
    );



    /* =====================================================
       MODAL JUGADOR
    ===================================================== */

    closePlayerModalButton?.addEventListener(
        "click",
        closePlayerModal
    );


    playerModalOverlay?.addEventListener(
        "click",
        closePlayerModal
    );


    valuePeriods.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    valuePeriods.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    renderPlayerHistory(
                        Number(
                            button.dataset.period
                        )
                        ||
                        7
                    );

                }
            );

        }
    );



    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key
                !==
                "Escape"
            ) {

                return;

            }


            if (
                transactionModal
                ?.classList.contains(
                    "active"
                )
            ) {

                closeTransactionModal();

                return;

            }


            if (
                playerModal
                ?.classList.contains(
                    "active"
                )
            ) {

                closePlayerModal();

            }

        }
    );



    /* =====================================================
       INITIALITZACIÓ
    ===================================================== */

    try {

        const user =
            await getCurrentUser();


        await loadPlayers();


        await loadTransactions(
            user
        );


        renderSquad();

    } catch (error) {

        console.error(
            "Error inicialitzant la plantilla:",
            error
        );


        if (playersGrid) {

            playersGrid.innerHTML =
                `

                <div
                    class="transaction-empty"
                    style="
                        grid-column:
                        1 / -1;
                        min-height:
                        180px;
                    "
                >

                    No s'han pogut carregar
                    les dades.

                    <br>

                    Recarrega la pàgina
                    i torna-ho a provar.

                </div>

                `;

        }

    }

});