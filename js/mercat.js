import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
    const topGainers = document.getElementById("topGainers");
    const topLosers = document.getElementById("topLosers");
    const marketResults = document.getElementById("marketResults");
    const search = document.getElementById("marketSearch");
    const position = document.getElementById("marketPosition");
    const team = document.getElementById("marketTeam");
    const sort = document.getElementById("marketSort");
    const modal = document.getElementById("marketModal");
    const modalOverlay = document.getElementById("marketModalOverlay");
    const closeModal = document.getElementById("closeMarketModal");
    const detail = document.getElementById("marketDetail");

    let players = [];
    let ownedIds = new Set();
    let valueHistory = new Map();
    let matchdayPoints = new Map();

    const positionLabels = {
        POR: "Porter",
        DEF: "Defensa",
        MIG: "Migcampista",
        DAV: "Daventer"
    };

    const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
        "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[char]));

    const initials = name => String(name || "")
        .trim().split(/\s+/).filter(Boolean).map(x => x[0]).join("").slice(0,2).toUpperCase() || "FT";

    const money = value => {
        const n = Number(value) || 0;
        if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(2).replace(".", ",")}M €`;
        if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}K €`;
        return `${new Intl.NumberFormat("ca-ES").format(n)} €`;
    };

    const signedMoney = value => {
        const n = Number(value) || 0;
        if (!n) return "0 €";
        return `${n > 0 ? "+" : "−"}${money(Math.abs(n))}`;
    };

    const fmtName = name => String(name || "").trim().split(/\s+/).filter(Boolean)
        .map(word => word.split("-").map(part => part ? part.charAt(0).toLocaleUpperCase("es-ES") + part.slice(1) : part).join("-")).join(" ");

    const positionKey = value => {
        const p = String(value || "").toUpperCase().trim();
        if (p.includes("POR") || p.includes("GOAL")) return "POR";
        if (p.includes("DEF")) return "DEF";
        if (p.includes("MIG") || p.includes("MED") || p.includes("MID")) return "MIG";
        if (p.includes("DAV") || p.includes("DEL") || p.includes("FOR")) return "DAV";
        return p;
    };

    const playerImage = player => player.image_url
        ? `<img src="${esc(player.image_url)}" alt="${esc(fmtName(player.name))}" loading="lazy" onerror="this.style.display='none'">`
        : esc(initials(player.name));

    const ownedStar = player => ownedIds.has(player.id) ? `<span class="market-owned-star" title="El tens a la plantilla">★</span>` : "";

    const openPlayer = async player => {
        detail.innerHTML = `<div class="market-empty">Carregant dades de ${esc(fmtName(player.name))}...</div>`;
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        const [historyResponse, pointsResponse] = await Promise.all([
            supabase.from("player_values").select("recorded_on,market_value,daily_change,points")
                .eq("player_id", player.id).order("recorded_on", { ascending: true }).limit(60),
            supabase.from("player_match_points").select("matchday,points")
                .eq("player_id", player.id).order("matchday", { ascending: true })
        ]);

        const history = historyResponse.data || [];
        const points = (pointsResponse.data || [])
            .map(r => ({ matchday: Number(r.matchday), points: Number(r.points) || 0 }))
            .filter(r => Number.isFinite(r.matchday) && r.matchday > 0)
            .sort((a,b) => a.matchday - b.matchday);

        renderDetail(player, history, points);
    };

    const renderDetail = (player, history, points) => {
        const values = history.map(x => Number(x.market_value) || 0).filter(x => x > 0);
        const maxValue = Math.max(...values, Number(player.current_value) || 1);
        const minValue = Math.min(...values, Number(player.current_value) || 0);
        const range = maxValue - minValue || 1;

        const bars = values.slice(-30).map(v => `<span class="market-value-bar" style="height:${(18 + ((v-minValue)/range)*82).toFixed(1)}%" title="${esc(money(v))}"></span>`).join("");
        const labels = values.length
            ? `<span>${esc(money(values[Math.max(0, values.length-30)]))}</span><span>${esc(money(values[values.length-1]))}</span>`
            : "";

        const pointValues = points.map(x => x.points);
        const total = pointValues.reduce((a,b) => a+b, 0);
        const average = pointValues.length ? total / pointValues.length : 0;
        const best = points.length ? Math.max(...pointValues) : 0;
        const bestRow = points.find(x => x.points === best);
        const maxPoints = Math.max(best, 1);

        detail.innerHTML = `
            <div class="market-detail-head">
                <div class="market-detail-identity">
                    <div class="market-detail-avatar">${playerImage(player)}</div>
                    <div>
                        <h2 class="market-detail-name">${esc(fmtName(player.name))}</h2>
                        <div class="market-detail-team"><span>${esc(player.team || "Equip desconegut")}</span><span>·</span><span>${esc(positionLabels[positionKey(player.position)] || player.position || "—")}</span>${ownedIds.has(player.id) ? `<span class="market-owned-star">★ Tens aquest jugador</span>` : ""}</div>
                    </div>
                </div>
                <div class="market-detail-value">
                    <span>VALOR ACTUAL</span>
                    <strong>${esc(money(player.current_value))}</strong>
                    <small class="${Number(player.daily_change) >= 0 ? "market-positive" : "market-negative"}">${esc(signedMoney(player.daily_change))} avui</small>
                </div>
            </div>
            <div class="market-detail-grid">
                <section class="market-detail-panel">
                    <span class="market-detail-eyebrow">EVOLUCIÓ DEL VALOR</span>
                    <h3>Històric recent</h3>
                    <div class="market-value-chart">${bars || `<span class="market-neutral">Sense històric disponible</span>`}</div>
                    <div class="market-value-labels">${labels}</div>
                </section>
                <section class="market-detail-panel">
                    <span class="market-detail-eyebrow">PUNTUACIÓ</span>
                    <h3>Rendiment per jornada</h3>
                    ${points.length ? `
                        <div class="market-points-summary">
                            <div><span>TOTAL</span><strong>${esc(String(Number(player.points) || total))} pts</strong></div>
                            <div><span>MITJANA</span><strong>${average.toFixed(1).replace(".", ",")} pts</strong></div>
                            <div><span>MILLOR JORNADA</span><strong>J${bestRow.matchday} · ${best} pts</strong></div>
                        </div>
                        <div class="market-points-bars">
                            ${points.map(row => `
                                <div class="market-point-bar" title="Jornada ${row.matchday} · ${row.points} punts">
                                    <strong>${row.points}</strong>
                                    <i style="height:${Math.max(7,(row.points/maxPoints)*100)}%"></i>
                                    <span>J${row.matchday}</span>
                                </div>`).join("")}
                        </div>` : `<div class="market-empty">Encara no hi ha punts per jornada.</div>`}
                </section>
            </div>`;
    };

    const load = async () => {
        const { data, error } = await supabase.from("players")
            .select("id,source_id,name,team,position,current_value,daily_change,points,image_url,updated_at")
            .order("name", { ascending: true });

        if (error) throw error;
        players = data || [];

        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
            const { data: tx, error: txError } = await supabase.from("transactions")
                .select("player_id,transaction_type").eq("user_id", sessionData.session.user.id);
            if (!txError) {
                const counts = new Map();
                (tx || []).forEach(t => {
                    const id = t.player_id;
                    counts.set(id, (counts.get(id) || 0) + (t.transaction_type === "BUY" ? 1 : -1));
                });
                ownedIds = new Set([...counts.entries()].filter(([,count]) => count > 0).map(([id]) => id));
            }
        }

        const teams = [...new Set(players.map(p => p.team).filter(Boolean))].sort((a,b) => a.localeCompare(b, "ca"));
        team.innerHTML = `<option value="all">Tots els equips</option>` + teams.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join("");

        renderTop();
        renderResults();
    };

    const topRow = (player, index, direction) => `
        <div class="market-top-row" data-id="${esc(player.id)}">
            <span class="market-rank">${index + 1}</span>
            <div class="market-mini-player">
                <div class="market-avatar">${playerImage(player)}</div>
                <div class="market-mini-info">
                    <strong class="market-player-name">${esc(fmtName(player.name))}</strong>
                    <span class="market-player-meta">${esc(player.team || "—")} · ${esc(positionLabels[positionKey(player.position)] || player.position || "—")} ${ownedStar(player)}</span>
                </div>
            </div>
            <span class="market-top-value">${esc(money(player.current_value))}</span>
            <span class="market-top-change ${direction > 0 ? "market-positive" : "market-negative"}">${esc(signedMoney(player.daily_change))}</span>
        </div>`;

    const renderTop = () => {
        const sortedUp = [...players].filter(p => Number(p.daily_change) > 0).sort((a,b) => Number(b.daily_change)-Number(a.daily_change)).slice(0,10);
        const sortedDown = [...players].filter(p => Number(p.daily_change) < 0).sort((a,b) => Number(a.daily_change)-Number(b.daily_change)).slice(0,10);
        topGainers.innerHTML = sortedUp.length ? sortedUp.map((p,i) => topRow(p,i,1)).join("") : `<div class="market-empty">No hi ha pujades disponibles.</div>`;
        topLosers.innerHTML = sortedDown.length ? sortedDown.map((p,i) => topRow(p,i,-1)).join("") : `<div class="market-empty">No hi ha baixades disponibles.</div>`;
        document.querySelectorAll(".market-top-row").forEach(row => row.addEventListener("click", () => {
            const p = players.find(x => String(x.id) === row.dataset.id);
            if (p) openPlayer(p);
        }));
    };

    const renderResults = () => {
        const q = search.value.trim().toLocaleLowerCase("ca");
        const pos = position.value;
        const selectedTeam = team.value;
        let result = players.filter(p => {
            const hay = `${p.name || ""} ${p.team || ""} ${p.position || ""} ${positionLabels[positionKey(p.position)] || ""}`.toLocaleLowerCase("ca");
            return (!q || hay.includes(q)) && (pos === "all" || positionKey(p.position) === pos) && (selectedTeam === "all" || p.team === selectedTeam);
        });

        const sortValue = sort.value;
        result.sort((a,b) => {
            if (sortValue === "value-desc") return Number(b.current_value)-Number(a.current_value);
            if (sortValue === "value-asc") return Number(a.current_value)-Number(b.current_value);
            if (sortValue === "points-desc") return Number(b.points)-Number(a.points);
            if (sortValue === "points-asc") return Number(a.points)-Number(b.points);
            if (sortValue === "change-desc") return Number(b.daily_change)-Number(a.daily_change);
            if (sortValue === "change-asc") return Number(a.daily_change)-Number(b.daily_change);
            return String(a.name).localeCompare(String(b.name), "ca");
        });

        if (!result.length) {
            marketResults.innerHTML = `<div class="market-empty"><strong>No s'han trobat jugadors</strong>Prova amb un altre nom, equip o filtre.</div>`;
            return;
        }

        marketResults.innerHTML = result.map(p => `
            <div class="market-result-row" data-id="${esc(p.id)}">
                <div class="market-result-player">
                    <div class="market-avatar">${playerImage(p)}</div>
                    <div class="market-mini-info">
                        <strong class="market-player-name">${esc(fmtName(p.name))}</strong>
                        <span class="market-player-meta">${esc(p.team || "—")} · ${esc(positionLabels[positionKey(p.position)] || p.position || "—")}</span>
                    </div>
                </div>
                <div class="market-result-data"><span>VALOR</span><strong>${esc(money(p.current_value))}</strong></div>
                <div class="market-result-data"><span>PUNTS</span><strong>${esc(String(Number(p.points) || 0))} pts</strong></div>
                <div class="market-result-data"><span>AVUI</span><strong class="market-result-change ${Number(p.daily_change) >= 0 ? "market-positive" : "market-negative"}">${esc(signedMoney(p.daily_change))}</strong></div>
                <div class="market-owned">${ownedIds.has(p.id) ? `<span title="El tens a la plantilla">★</span>` : ""}</div>
            </div>`).join("");

        document.querySelectorAll(".market-result-row").forEach(row => row.addEventListener("click", () => {
            const p = players.find(x => String(x.id) === row.dataset.id);
            if (p) openPlayer(p);
        }));
    };

    const close = () => {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    [search, position, team, sort].forEach(el => el?.addEventListener(el.tagName === "INPUT" ? "input" : "change", renderResults));
    closeModal?.addEventListener("click", close);
    modalOverlay?.addEventListener("click", close);
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

    try { await load(); }
    catch (error) {
        console.error("Error carregant mercat:", error);
        marketResults.innerHTML = `<div class="market-empty"><strong>No s'ha pogut carregar el mercat</strong>Recarrega la pàgina i torna-ho a provar.</div>`;
        topGainers.innerHTML = topLosers.innerHTML = `<div class="market-empty">No s'han pogut carregar les dades.</div>`;
    }
});
