/* =========================================================
   FANTASY TRACKER
   History page

   - Carrega totes les transaccions de l'usuari.
   - Mostra BUY / SELL.
   - Calcula benefici o pèrdua de cada venda.
   - Calcula estadístiques globals.
   - Permet buscar i filtrar.
========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    async () => {


        /* =================================================
           SUPABASE
        ================================================== */

        const SUPABASE_URL =
            "https://xkwzddjzypnskakskell.supabase.co";


        const SUPABASE_ANON_KEY =
            "sb_publishable_mRv3S9r8wbop2EyPR5Icyg_bTAHwYNz";


        if (
            !window.supabase
        ) {

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



        /* =================================================
           STATE
        ================================================== */

        let transactions = [];

        let currentFilter = "all";

        let currentSearch = "";

        let currentSort = "newest";



        /* =================================================
           ELEMENTS
        ================================================== */

        const historyList =
            document.getElementById(
                "historyList"
            );


        const historyCount =
            document.getElementById(
                "historyCount"
            );


        const historySearch =
            document.getElementById(
                "historySearch"
            );


        const historySort =
            document.getElementById(
                "historySort"
            );


        const filterButtons =
            document.querySelectorAll(
                ".history-filter"
            );


        const totalTransactions =
            document.getElementById(
                "totalTransactions"
            );


        const totalBuys =
            document.getElementById(
                "totalBuys"
            );


        const totalSells =
            document.getElementById(
                "totalSells"
            );


        const totalSalesAmount =
            document.getElementById(
                "totalSalesAmount"
            );


        const realizedProfit =
            document.getElementById(
                "realizedProfit"
            );


        const profitStat =
            document.getElementById(
                "profitStat"
            );



        /* =================================================
           HELPERS
        ================================================== */

        const escapeHtml =
            value => {

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



        const formatPlayerName =
            name => {

                return String(
                    name || ""
                )
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .map(
                        word => {

                            return word
                                .split("-")
                                .map(
                                    part => {

                                        if (!part) {

                                            return part;

                                        }


                                        return (
                                            part
                                                .charAt(0)
                                                .toLocaleUpperCase(
                                                    "es-ES"
                                                )
                                            +
                                            part.slice(1)
                                        );

                                    }
                                )
                                .join("-");

                        }
                    )
                    .join(" ");

            };



        const getInitials =
            name => {

                return String(
                    name || ""
                )
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .map(
                        word =>
                            word[0]
                    )
                    .join("")
                    .slice(
                        0,
                        2
                    )
                    .toUpperCase();

            };



        const getTeamInitials =
            team => {

                const clean =
                    String(
                        team || ""
                    )
                        .trim();


                if (!clean) {

                    return "—";

                }


                const words =
                    clean
                        .split(/\s+/)
                        .filter(Boolean);


                if (
                    words.length >= 2
                ) {

                    return words
                        .slice(
                            0,
                            3
                        )
                        .map(
                            word =>
                                word[0]
                        )
                        .join("")
                        .toUpperCase();

                }


                return clean
                    .slice(
                        0,
                        3
                    )
                    .toUpperCase();

            };



        const formatCurrency =
            value => {

                const number =
                    Number(value)
                    ||
                    0;


                if (
                    Math.abs(number)
                    >=
                    1000000
                ) {

                    return (
                        number
                        /
                        1000000
                    )
                        .toFixed(2)
                        .replace(
                            ".",
                            ","
                        )
                        +
                        "M €";

                }


                if (
                    Math.abs(number)
                    >=
                    1000
                ) {

                    return (
                        number
                        /
                        1000
                    )
                        .toFixed(0)
                        +
                        "K €";

                }


                return (
                    new Intl.NumberFormat(
                        "ca-ES"
                    ).format(
                        number
                    )
                    +
                    " €"
                );

            };



        const formatSignedCurrency =
            value => {

                const number =
                    Number(value)
                    ||
                    0;


                if (
                    number === 0
                ) {

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
                        Math.abs(
                            number
                        )
                    )
                );

            };



        const formatDate =
            value => {

                if (!value) {

                    return {
                        day: "—",
                        year: ""
                    };

                }


                const date =
                    new Date(
                        `${value}T00:00:00`
                    );


                if (
                    Number.isNaN(
                        date.getTime()
                    )
                ) {

                    return {
                        day: value,
                        year: ""
                    };

                }


                const day =
                    String(
                        date.getDate()
                    )
                        .padStart(
                            2,
                            "0"
                        )
                    +
                    "/"
                    +
                    String(
                        date.getMonth() + 1
                    )
                        .padStart(
                            2,
                            "0"
                        );


                const year =
                    String(
                        date.getFullYear()
                    );


                return {
                    day,
                    year
                };

            };



        /* =================================================
           CURRENT USER
        ================================================== */

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



        /* =================================================
           LOAD TRANSACTIONS
        ================================================== */

        const loadTransactions =
            async () => {

                const user =
                    await getCurrentUser();


                if (!user) {

                    transactions = [];

                    render();

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
                                points,
                                image_url
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
                        "Error carregant historial:",
                        error
                    );

                    historyList.innerHTML = `

                        <div
                            class="history-empty"
                        >

                            <div>

                                <strong>
                                    No s'ha pogut carregar l'historial
                                </strong>

                                <span>
                                    Recarrega la pàgina i torna-ho a provar.
                                </span>

                            </div>

                        </div>

                    `;

                    return;

                }


                transactions =
                    data || [];


                calculateResults();


                render();

            };



        /* =================================================
           CALCULAR BENEFICIS
        ================================================== */

        const calculateResults =
            () => {

                /*
                   Guardem les compres pendents
                   de cada jugador.

                   En el funcionament normal
                   només hi haurà una compra
                   abans de cada venda.
                */

                const openBuys =
                    new Map();


                transactions.forEach(
                    transaction => {

                        transaction.buyPrice =
                            null;

                        transaction.profit =
                            null;


                        const playerId =
                            transaction.player_id;


                        if (
                            !openBuys.has(
                                playerId
                            )
                        ) {

                            openBuys.set(
                                playerId,
                                []
                            );

                        }


                        const queue =
                            openBuys.get(
                                playerId
                            );


                        if (
                            transaction.transaction_type
                            ===
                            "BUY"
                        ) {

                            queue.push(
                                transaction
                            );

                            return;

                        }


                        if (
                            transaction.transaction_type
                            ===
                            "SELL"
                        ) {

                            /*
                               Busquem la compra anterior
                               encara no utilitzada.
                            */

                            const buy =
                                queue.shift();


                            if (!buy) {

                                return;

                            }


                            const buyPrice =
                                Number(
                                    buy.amount
                                )
                                ||
                                0;


                            const sellPrice =
                                Number(
                                    transaction.amount
                                )
                                ||
                                0;


                            transaction.buyPrice =
                                buyPrice;


                            transaction.profit =
                                sellPrice
                                -
                                buyPrice;

                        }

                    }
                );

            };



        /* =================================================
           FILTER
        ================================================== */

        const getVisibleTransactions =
            () => {

                let result =
                    [...transactions];


                if (
                    currentFilter
                    !==
                    "all"
                ) {

                    result =
                        result.filter(
                            transaction =>
                                transaction.transaction_type
                                ===
                                currentFilter
                        );

                }


                if (
                    currentSearch
                ) {

                    const query =
                        currentSearch
                            .toLowerCase()
                            .trim();


                    result =
                        result.filter(
                            transaction => {

                                const name =
                                    String(
                                        transaction
                                            .player
                                            ?.name
                                            ||
                                            ""
                                    )
                                        .toLowerCase();


                                const team =
                                    String(
                                        transaction
                                            .player
                                            ?.team
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
                        );

                }


                if (
                    currentSort
                    ===
                    "newest"
                ) {

                    result.sort(
                        (
                            a,
                            b
                        ) => {

                            const dateA =
                                `${a.transaction_date || ""}_${a.created_at || ""}`;

                            const dateB =
                                `${b.transaction_date || ""}_${b.created_at || ""}`;

                            return dateB.localeCompare(
                                dateA
                            );

                        }
                    );

                } else {

                    result.sort(
                        (
                            a,
                            b
                        ) => {

                            const dateA =
                                `${a.transaction_date || ""}_${a.created_at || ""}`;

                            const dateB =
                                `${b.transaction_date || ""}_${b.created_at || ""}`;

                            return dateA.localeCompare(
                                dateB
                            );

                        }
                    );

                }


                return result;

            };



        /* =================================================
           SUMMARY
        ================================================== */

        const updateSummary =
            () => {

                const buys =
                    transactions.filter(
                        transaction =>
                            transaction.transaction_type
                            ===
                            "BUY"
                    );


                const sells =
                    transactions.filter(
                        transaction =>
                            transaction.transaction_type
                            ===
                            "SELL"
                    );


                const totalBought =
                    buys.reduce(
                        (
                            sum,
                            transaction
                        ) =>
                            sum
                            +
                            (
                                Number(
                                    transaction.amount
                                )
                                ||
                                0
                            ),
                        0
                    );


                const totalSold =
                    sells.reduce(
                        (
                            sum,
                            transaction
                        ) =>
                            sum
                            +
                            (
                                Number(
                                    transaction.amount
                                )
                                ||
                                0
                            ),
                        0
                    );


                const realized =
                    sells.reduce(
                        (
                            sum,
                            transaction
                        ) =>
                            sum
                            +
                            (
                                transaction.profit
                                ??
                                0
                            ),
                        0
                    );


                totalTransactions.textContent =
                    String(
                        transactions.length
                    );


                totalBuys.textContent =
                    String(
                        buys.length
                    );


                totalSalesAmount.textContent =
                    `${formatCurrency(totalBought)} invertits`;


                totalSells.textContent =
                    String(
                        sells.length
                    );


                const salesDescription =
                    document.querySelector(
                        "#totalSalesAmount"
                    );


                if (
                    salesDescription
                ) {

                    salesDescription.textContent =
                        `${formatCurrency(totalSold)} ingressats`;

                }


                realizedProfit.textContent =
                    formatSignedCurrency(
                        realized
                    );


                profitStat.classList.remove(
                    "history-stat--profit",
                    "history-stat--loss"
                );


                if (
                    realized > 0
                ) {

                    profitStat.classList.add(
                        "history-stat--profit"
                    );

                }


                if (
                    realized < 0
                ) {

                    profitStat.classList.add(
                        "history-stat--loss"
                    );

                }

            };



        /* =================================================
           RENDER ROW
        ================================================== */

        const createTransactionRow =
            transaction => {

                const player =
                    transaction.player
                    ||
                    {};


                const isBuy =
                    transaction.transaction_type
                    ===
                    "BUY";


                const operation =
                    isBuy
                        ? "Compra"
                        : "Venda";


                const date =
                    formatDate(
                        transaction.transaction_date
                    );


                const playerName =
                    formatPlayerName(
                        player.name
                    );


                const initials =
                    getInitials(
                        player.name
                    );


                const team =
                    player.team
                    ||
                    "Equip desconegut";


                const teamInitials =
                    getTeamInitials(
                        team
                    );


                const amount =
                    Number(
                        transaction.amount
                    )
                    ||
                    0;


                const hasProfit =
                    !isBuy
                    &&
                    transaction.profit
                    !==
                    null;


                let resultHtml =
                    "";


                if (
                    isBuy
                ) {

                    resultHtml = `

                        <div
                            class="
                                history-result
                                history-result--neutral
                            "
                        >

                            <span
                                class="history-result__label"
                            >
                                RESULTAT
                            </span>

                            <span
                                class="history-result__value"
                            >
                                —
                            </span>

                            <span
                                class="history-result__detail"
                            >
                                Compra inicial
                            </span>

                        </div>

                    `;

                } else if (
                    hasProfit
                ) {

                    const profit =
                        Number(
                            transaction.profit
                        )
                        ||
                        0;


                    const resultClass =
                        profit > 0
                            ? "history-result--positive"
                            : profit < 0
                                ? "history-result--negative"
                                : "history-result--neutral";


                    const resultLabel =
                        profit > 0
                            ? "BENEFICI"
                            : profit < 0
                                ? "PÈRDUA"
                                : "RESULTAT";


                    resultHtml = `

                        <div
                            class="
                                history-result
                                ${resultClass}
                            "
                        >

                            <span
                                class="history-result__label"
                            >
                                ${resultLabel}
                            </span>

                            <span
                                class="history-result__value"
                            >
                                ${formatSignedCurrency(
                                    profit
                                )}
                            </span>

                            <span
                                class="history-result__detail"
                            >
                                Compra:
                                ${formatCurrency(
                                    transaction.buyPrice
                                )}

                            </span>

                        </div>

                    `;

                } else {

                    resultHtml = `

                        <div
                            class="
                                history-result
                                history-result--neutral
                            "
                        >

                            <span
                                class="history-result__label"
                            >
                                RESULTAT
                            </span>

                            <span
                                class="history-result__value"
                            >
                                —
                            </span>

                            <span
                                class="history-result__detail"
                            >
                                Sense compra associada
                            </span>

                        </div>

                    `;

                }


                const row =
                    document.createElement(
                        "article"
                    );


                row.className =
                    "history-row";


                row.innerHTML = `

                    <div
                        class="history-date"
                    >

                        <span
                            class="history-date__day"
                        >
                            ${escapeHtml(
                                date.day
                            )}
                        </span>

                        <span
                            class="history-date__year"
                        >
                            ${escapeHtml(
                                date.year
                            )}
                        </span>

                    </div>


                    <div
                        class="history-player"
                    >

                        <div
                            class="history-player__avatar"
                        >

                            ${
                                player.image_url

                                    ? `

                                        <img
                                            src="${escapeHtml(
                                                player.image_url
                                            )}"
                                            alt="${escapeHtml(
                                                playerName
                                            )}"
                                            loading="lazy"
                                            onerror="
                                                this.style.display='none';
                                                this.nextElementSibling.style.display='flex';
                                            "
                                        >

                                      `

                                    : ""

                            }

                            <span
                                style="${
                                    player.image_url
                                        ? "display:none;"
                                        : ""
                                }"
                            >
                                ${escapeHtml(
                                    initials
                                )}
                            </span>

                        </div>


                        <div
                            class="history-player__info"
                        >

                            <strong
                                class="history-player__name"
                            >
                                ${escapeHtml(
                                    playerName
                                )}
                            </strong>


                            <span
                                class="history-player__team"
                            >

                                <span
                                    class="history-team-badge"
                                >
                                    ${escapeHtml(
                                        teamInitials
                                    )}
                                </span>

                                ${escapeHtml(
                                    team
                                )}

                            </span>

                        </div>

                    </div>


                    <div
                        class="history-operation"
                    >

                        <span
                            class="
                                history-operation__badge
                                ${
                                    isBuy
                                        ? "history-operation__badge--buy"
                                        : "history-operation__badge--sell"
                                }
                            "
                        >
                            ${operation}
                        </span>

                    </div>


                    <div
                        class="history-amount"
                    >

                        <span
                            class="history-amount__main"
                        >
                            ${formatCurrency(
                                amount
                            )}
                        </span>

                        <span
                            class="history-amount__label"
                        >
                            ${
                                isBuy
                                    ? "Preu de compra"
                                    : "Preu de venda"
                            }
                        </span>

                    </div>


                    ${resultHtml}

                `;


                return row;

            };



        /* =================================================
           RENDER
        ================================================== */

        const render =
            () => {

                updateSummary();


                const visible =
                    getVisibleTransactions();


                historyCount.textContent =
                    visible.length
                    ===
                    transactions.length

                        ? `${visible.length} moviments`

                        : `${visible.length} de ${transactions.length}`;


                if (
                    !visible.length
                ) {

                    historyList.innerHTML = `

                        <div
                            class="history-empty"
                        >

                            <div>

                                <strong>
                                    ${
                                        transactions.length
                                            ? "No s'han trobat moviments"
                                            : "Encara no tens moviments"
                                    }
                                </strong>

                                <span>
                                    ${
                                        transactions.length
                                            ? "Prova un altre jugador o filtre."
                                            : "Les teves compres i vendes apareixeran aquí."
                                    }
                                </span>

                            </div>

                        </div>

                    `;

                    return;

                }


                historyList.innerHTML =
                    "";


                visible.forEach(
                    transaction => {

                        historyList.appendChild(
                            createTransactionRow(
                                transaction
                            )
                        );

                    }
                );

            };



        /* =================================================
           SEARCH
        ================================================== */

        historySearch?.addEventListener(
            "input",
            () => {

                currentSearch =
                    historySearch.value;


                render();

            }
        );



        /* =================================================
           FILTERS
        ================================================== */

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


                        currentFilter =
                            button.dataset.filter
                            ||
                            "all";


                        render();

                    }
                );

            }
        );



        /* =================================================
           SORT
        ================================================== */

        historySort?.addEventListener(
            "change",
            () => {

                currentSort =
                    historySort.value
                    ||
                    "newest";


                render();

            }
        );



        /* =================================================
           INITIALITZACIÓ
        ================================================== */

        try {

            await loadTransactions();

        } catch (error) {

            console.error(
                "Error inicialitzant l'historial:",
                error
            );


            historyList.innerHTML = `

                <div
                    class="history-empty"
                >

                    <div>

                        <strong>
                            Error carregant l'historial
                        </strong>

                        <span>
                            Recarrega la pàgina i torna-ho a provar.
                        </span>

                    </div>

                </div>

            `;

        }

    }
);
