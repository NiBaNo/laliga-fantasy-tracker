import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    const els = {
        heroValue: $("#dashboardHeroValue"),
        heroChange: $("#dashboardHeroChange"),
        squadValue: $("#dashboardSquadValue"),
        squadChange: $("#dashboardSquadChange"),
        balance: $("#dashboardBalance"),
        netWorth: $("#dashboardNetWorth"),
        squadCount: $("#dashboardSquadCount"),
        balanceEdit: $("#dashboardEditBalance"),
        balanceModal: $("#balanceModal"),
        balanceForm: $("#balanceForm"),
        balanceInput: $("#balanceInput"),
        balanceClose: $("#balanceModalClose"),
        balanceCancel: $("#balanceCancel"),
        balanceMessage: $("#balanceMessage"),
        playersList: $("#dashboardPlayersList"),
        risers: $("#dashboardRisers"),
        fallers: $("#dashboardFallers"),
        valueChart: $("#dashboardValueChart"),
        changeChart: $("#dashboardChangeChart"),
        balanceChart: $("#dashboardBalanceChart"),
        fixtureSummary: $("#dashboardFixtureSummary"),
        fixtureModal: $("#fixturesModal"),
        fixtureModalClose: $("#fixturesModalClose"),
        fixtureTabs: $("#fixtureTabs"),
        fixtureList: $("#fixtureList"),
        updatedAt: $("#dashboardUpdatedAt"),
        syncStatus: $("#dashboardSyncStatus"),
        syncDetails: $("#dashboardSyncDetails"),
    };

    const state = {
        user: null,
        players: [],
        squad: [],
        transactions: [],
        playerHistory: [],
        balanceHistory: [],
        fixtures: [],
        sync: null,
    };

    const money = (value, compact = false) => {
        const n = Number(value) || 0;
        if (compact) {
            const abs = Math.abs(n);
            if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")}M €`;
            if (abs >= 1_000) return `${Math.round(n / 1_000).toLocaleString("ca-ES")}K €`;
        }
        return `${new Intl.NumberFormat("ca-ES", { maximumFractionDigits: 0 }).format(n)} €`;
    };

    const signedMoney = (value, compact = false) => {
        const n = Number(value) || 0;
        if (!n) return "0 €";
        return `${n > 0 ? "+" : "−"}${money(Math.abs(n), compact)}`;
    };

    const signedPercent = (value) => {
        const n = Number(value) || 0;
        if (!n) return "0,00%";
        return `${n > 0 ? "+" : "−"}${Math.abs(n).toFixed(2).replace(".", ",")}%`;
    };

    const dateLabel = (value) => {
        if (!value) return "—";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return value;
        return new Intl.DateTimeFormat("ca-ES", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: false,
            timeZone: "Europe/Madrid"
        }).format(d).replace(",", " ·");
    };

    const escapeHtml = (value) => String(value ?? "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

    const openModal = (el) => { if (el) { el.hidden = false; document.body.classList.add("modal-open"); } };
    const closeModal = (el) => { if (el) { el.hidden = true; document.body.classList.remove("modal-open"); } };

    const getUser = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session?.user || null;
    };

    const loadData = async () => {
        state.user = await getUser();
        if (!state.user) return;

        const [playersRes, txRes, valuesRes, balanceRes, fixturesRes, syncRes] = await Promise.all([
            supabase.from("players").select("id,source_id,name,team,position,current_value,daily_change,points,image_url,updated_at"),
            supabase.from("transactions").select("id,user_id,player_id,transaction_type,amount,transaction_date,created_at,player:players(id,source_id,name,team,position,current_value,daily_change,points,image_url)").eq("user_id", state.user.id).order("transaction_date", { ascending: true }).order("created_at", { ascending: true }),
            supabase.from("player_values").select("player_id,recorded_on,market_value,daily_change,points").order("recorded_on", { ascending: true }).limit(10000),
            supabase.from("manager_balance_history").select("balance,recorded_at").eq("user_id", state.user.id).order("recorded_at", { ascending: true }).limit(365),
            supabase.from("fixtures").select("id,source_id,matchday,home_team_id,away_team_id,home_team,away_team,home_crest_url,away_crest_url,kickoff_at,status,home_score,away_score,source_url").order("matchday", { ascending: true }).order("kickoff_at", { ascending: true }),
            supabase.from("data_sync").select("last_success_at,players_updated_at,points_updated_at,market_updated_at,fixtures_updated_at,status").order("last_success_at", { ascending: false }).limit(1).maybeSingle(),
        ]);

        if (playersRes.error) throw playersRes.error;
        if (txRes.error) throw txRes.error;
        if (valuesRes.error) throw valuesRes.error;

        state.players = playersRes.data || [];
        state.transactions = txRes.data || [];
        state.playerHistory = valuesRes.data || [];
        state.balanceHistory = balanceRes.error ? [] : (balanceRes.data || []);
        state.fixtures = fixturesRes.error ? [] : (fixturesRes.data || []);
        state.sync = syncRes.error ? null : syncRes.data;

        reconstructSquad();
        render();
    };

    const reconstructSquad = () => {
        const owned = new Map();
        for (const tx of state.transactions) {
            if (!tx.player_id) continue;
            if (tx.transaction_type === "BUY") owned.set(tx.player_id, tx.player || null);
            if (tx.transaction_type === "SELL") owned.delete(tx.player_id);
        }
        state.squad = [...owned.entries()].map(([id, player]) => {
            return player || state.players.find((p) => p.id === id);
        }).filter(Boolean);
    };

    const squadValue = () => state.squad.reduce((sum, p) => sum + (Number(p.current_value) || 0), 0);
    const todayChange = () => state.squad.reduce((sum, p) => sum + (Number(p.daily_change) || 0), 0);

    const latestBalance = () => state.balanceHistory.length ? Number(state.balanceHistory[state.balanceHistory.length - 1].balance) || 0 : 0;

    const playerValueChangePercent = (player) => {
        const value = Number(player.current_value) || 0;
        const change = Number(player.daily_change) || 0;
        const previous = value - change;
        return previous ? (change / previous) * 100 : 0;
    };

    const drawLineChart = (canvas, labels, values, formatter, positiveDown = false) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const width = Math.max(320, Math.round(rect.width || 600));
        const height = 230;
        canvas.width = width * dpr; canvas.height = height * dpr;
        const ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        const pad = { l: 12, r: 12, t: 22, b: 30 };
        const w = width - pad.l - pad.r, h = height - pad.t - pad.b;
        if (!values.length) {
            ctx.fillStyle = "rgba(150,160,175,.55)"; ctx.font = "12px Inter, sans-serif";
            ctx.fillText("Encara no hi ha prou dades històriques", 16, 46); return;
        }
        const min = Math.min(...values), max = Math.max(...values);
        const range = max - min || 1;
        const x = (i) => pad.l + (values.length === 1 ? w / 2 : i * w / (values.length - 1));
        const y = (v) => pad.t + h - ((v - min) / range) * h;
        ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) { const yy = pad.t + (h * i / 3); ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(width - pad.r, yy); ctx.stroke(); }
        const gradient = ctx.createLinearGradient(0, pad.t, 0, height);
        gradient.addColorStop(0, "rgba(0,223,135,.20)"); gradient.addColorStop(1, "rgba(0,223,135,0)");
        ctx.beginPath(); values.forEach((v, i) => i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v))); ctx.lineTo(x(values.length - 1), pad.t + h); ctx.lineTo(x(0), pad.t + h); ctx.closePath(); ctx.fillStyle = gradient; ctx.fill();
        ctx.beginPath(); values.forEach((v, i) => i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v))); ctx.strokeStyle = "#00df87"; ctx.lineWidth = 2.2; ctx.stroke();
        const last = values.length - 1; ctx.beginPath(); ctx.arc(x(last), y(values[last]), 4, 0, Math.PI * 2); ctx.fillStyle = "#00df87"; ctx.fill();
        ctx.fillStyle = "#7f8b9b"; ctx.font = "10px Inter, sans-serif";
        const step = Math.max(1, Math.ceil(labels.length / 6));
        labels.forEach((label, i) => { if (i % step === 0 || i === labels.length - 1) ctx.fillText(label, Math.max(0, x(i) - 15), height - 9); });
        ctx.fillStyle = "#dce3e8"; ctx.font = "700 11px Inter, sans-serif"; ctx.fillText(formatter(values[last]), 14, 14);
    };

    const renderStats = () => {
        const value = squadValue(), change = todayChange(), balance = latestBalance(), net = value + balance;
        const previous = value - change;
        const pct = previous ? (change / previous) * 100 : 0;
        if (els.heroValue) els.heroValue.textContent = money(value, true);
        if (els.heroChange) { els.heroChange.textContent = `${signedMoney(change, true)} · ${signedPercent(pct)}`; els.heroChange.className = `dashboard-hero-change ${change >= 0 ? "positive" : "negative"}`; }
        if (els.squadValue) els.squadValue.textContent = money(value);
        if (els.squadChange) { els.squadChange.textContent = `${signedMoney(change)} avui · ${signedPercent(pct)}`; els.squadChange.className = `dashboard-stat-trend ${change >= 0 ? "positive" : "negative"}`; }
        if (els.balance) els.balance.textContent = money(balance);
        if (els.netWorth) els.netWorth.textContent = money(net);
        if (els.squadCount) els.squadCount.textContent = `${state.squad.length} ${state.squad.length === 1 ? "jugador" : "jugadors"}`;
    };

    const renderSquad = () => {
        if (!els.playersList) return;
        const rows = [...state.squad].sort((a,b) => (Number(b.current_value)||0) - (Number(a.current_value)||0)).slice(0, 6);
        els.playersList.innerHTML = rows.length ? rows.map((p) => `<div class="dashboard-player-row"><div class="dashboard-player-avatar">${escapeHtml((p.name || "?").split(/\s+/).map(x => x[0]).join("").slice(0,2).toUpperCase())}</div><div class="dashboard-player-info"><strong>${escapeHtml(p.name)}</strong><span>${escapeHtml(p.team || "—")} · ${escapeHtml(p.position || "—")}</span></div><div class="dashboard-player-value"><strong>${money(p.current_value, true)}</strong><small class="${Number(p.daily_change) >= 0 ? "positive" : "negative"}">${signedMoney(p.daily_change, true)}</small></div></div>`).join("") : `<div class="dashboard-empty">Encara no tens jugadors a la plantilla.</div>`;
    };

    const renderMarketMovers = () => {
        const risers = [...state.players].filter(p => Number(p.daily_change) > 0).sort((a,b) => Number(b.daily_change)-Number(a.daily_change)).slice(0,3);
        const fallers = [...state.players].filter(p => Number(p.daily_change) < 0).sort((a,b) => Number(a.daily_change)-Number(b.daily_change)).slice(0,3);
        const row = (p, up) => `<div class="dashboard-market-row"><div class="dashboard-market-avatar"><img src="${escapeHtml(p.image_url || "")}" alt="" onerror="this.style.display='none'"></div><div class="dashboard-market-info"><strong>${escapeHtml(p.name)}</strong><span>${escapeHtml(p.team || "—")}</span></div><div class="dashboard-market-change ${up ? "positive" : "negative"}">${signedMoney(p.daily_change, true)}</div></div>`;
        if (els.risers) els.risers.innerHTML = risers.length ? risers.map(p => row(p,true)).join("") : `<div class="dashboard-empty">Cap jugador està pujant de valor avui.</div>`;
        if (els.fallers) els.fallers.innerHTML = fallers.length ? fallers.map(p => row(p,false)).join("") : `<div class="dashboard-empty">Cap jugador està baixant de valor avui.</div>`;
    };

    const renderCharts = () => {
        const squadIds = new Set(state.squad.map(p => p.id));
        const byDate = new Map();
        state.playerHistory.filter(r => squadIds.has(r.player_id)).forEach(r => {
            if (!byDate.has(r.recorded_on)) byDate.set(r.recorded_on, []);
            byDate.get(r.recorded_on).push(r);
        });
        const dates = [...byDate.keys()].sort();
        const squadValues = dates.map(d => byDate.get(d).reduce((s,r) => s + (Number(r.market_value)||0), 0));
        const changes = dates.map(d => byDate.get(d).reduce((s,r) => s + (Number(r.daily_change)||0), 0));
        const balanceDates = state.balanceHistory.map(r => r.recorded_at).filter(Boolean);
        const balances = state.balanceHistory.map(r => Number(r.balance)||0);
        drawLineChart(els.valueChart, dates.map(d => d.slice(5)), squadValues, v => money(v,true));
        drawLineChart(els.changeChart, dates.map(d => d.slice(5)), changes, v => signedMoney(v,true));
        drawLineChart(els.balanceChart, balanceDates.map(d => new Date(d).toLocaleDateString("ca-ES", {day:"2-digit",month:"2-digit"})), balances, v => money(v,true));
    };

    const getFixtureGroups = () => {
        const map = new Map();
        state.fixtures.forEach(f => { const j = Number(f.matchday); if (!map.has(j)) map.set(j, []); map.get(j).push(f); });
        return [...map.entries()].sort((a,b) => a[0]-b[0]);
    };

    const fixtureStatus = (f) => {
        if (f.status === "finished" || f.status === "terminado") return "Finalitzat";
        if (f.status === "live" || f.status === "en_juego") return "En joc";
        return f.kickoff_at ? new Intl.DateTimeFormat("ca-ES", {weekday:"short",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit",timeZone:"Europe/Madrid"}).format(new Date(f.kickoff_at)) : "Horari pendent";
    };

    const renderFixturesSummary = () => {
        if (!els.fixtureSummary) return;
        const now = Date.now();
        const upcoming = state.fixtures.filter(f => f.kickoff_at && new Date(f.kickoff_at).getTime() >= now).sort((a,b)=>new Date(a.kickoff_at)-new Date(b.kickoff_at));
        const target = upcoming[0] || state.fixtures[state.fixtures.length-1];
        if (!target) { els.fixtureSummary.innerHTML = `<div class="dashboard-empty">Calendari pendent d'actualització.</div>`; return; }
        const group = state.fixtures.filter(f => Number(f.matchday) === Number(target.matchday));
        els.fixtureSummary.innerHTML = `<div class="fixture-summary-top"><div><span>JORNADA ${String(target.matchday).padStart(2,"0")}</span><strong>${group.length} partits</strong></div><button type="button" id="openFixturesButton">Veure calendari →</button></div><div class="fixture-mini-list">${group.slice(0,3).map(f => `<div class="fixture-mini"><div class="fixture-team"><img src="${escapeHtml(f.home_crest_url||"")}" alt=""><strong>${escapeHtml(f.home_team)}</strong></div><span>${fixtureStatus(f)}</span><div class="fixture-team away"><strong>${escapeHtml(f.away_team)}</strong><img src="${escapeHtml(f.away_crest_url||"")}" alt=""></div></div>`).join("")}</div>`;
        $("#openFixturesButton")?.addEventListener("click", () => openFixturesModal(Number(target.matchday)));
    };

    const openFixturesModal = (matchday) => {
        if (!els.fixtureModal) return;
        const groups = getFixtureGroups();
        els.fixtureTabs.innerHTML = groups.map(([j]) => `<button type="button" class="fixture-tab ${j===matchday?"active":""}" data-matchday="${j}">Jornada ${j}</button>`).join("");
        const render = (j) => {
            $$(".fixture-tab").forEach(b => b.classList.toggle("active", Number(b.dataset.matchday)===j));
            const games = state.fixtures.filter(f => Number(f.matchday)===j);
            els.fixtureList.innerHTML = games.length ? games.map(f => `<article class="fixture-card"><div class="fixture-card__team"><img src="${escapeHtml(f.home_crest_url||"")}" alt=""><strong>${escapeHtml(f.home_team)}</strong></div><div class="fixture-card__middle"><span>J${j}</span><strong>${f.home_score != null && f.away_score != null ? `${f.home_score} — ${f.away_score}` : "vs"}</strong><small>${fixtureStatus(f)}</small></div><div class="fixture-card__team"><strong>${escapeHtml(f.away_team)}</strong><img src="${escapeHtml(f.away_crest_url||"")}" alt=""></div></article>`).join("") : `<div class="dashboard-empty">No hi ha partits per aquesta jornada.</div>`;
        };
        els.fixtureTabs.onclick = (e) => { const b=e.target.closest(".fixture-tab"); if(b) render(Number(b.dataset.matchday)); };
        render(matchday);
        openModal(els.fixtureModal);
    };

    const renderSync = () => {
        if (!els.updatedAt) return;
        if (!state.sync?.last_success_at) {
            els.updatedAt.textContent = "Encara no disponible";
            if (els.syncStatus) els.syncStatus.textContent = "Pendent de primera sincronització";
            return;
        }
        els.updatedAt.textContent = dateLabel(state.sync.last_success_at);
        if (els.syncStatus) els.syncStatus.textContent = state.sync.status === "success" ? "Sistema operatiu" : "Revisar sincronització";
        if (els.syncDetails) els.syncDetails.innerHTML = `<span>Jugadors ✓</span><span>Punts ✓</span><span>Mercat ✓</span><span>Calendari ✓</span>`;
    };

    const render = () => { renderStats(); renderSquad(); renderMarketMovers(); renderCharts(); renderFixturesSummary(); renderSync(); };

    const saveBalance = async () => {
        if (!state.user) return;
        const raw = els.balanceInput.value.replace(/\./g, "").replace(/,/g, ".").trim();
        const value = Number(raw);
        if (!Number.isFinite(value)) { els.balanceMessage.textContent = "Introdueix un saldo vàlid."; return; }
        const rounded = Math.round(value);
        els.balanceMessage.textContent = "Guardant...";
        const { error } = await supabase.from("manager_balances").upsert({ user_id: state.user.id, balance: rounded, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
        if (error) { els.balanceMessage.textContent = "No s'ha pogut guardar el saldo. Comprova la configuració de Supabase."; console.error(error); return; }
        const { error: historyError } = await supabase.from("manager_balance_history").upsert({ user_id: state.user.id, balance: rounded, recorded_at: new Date().toISOString(), recorded_on: new Date().toISOString().slice(0, 10) }, { onConflict: "user_id,recorded_on" });
        if (historyError) console.warn("Històric de saldo no disponible:", historyError);
        els.balanceMessage.textContent = "Saldo guardat.";
        await loadData();
        setTimeout(() => closeModal(els.balanceModal), 400);
    };

    els.balanceEdit?.addEventListener("click", () => { els.balanceInput.value = latestBalance() || ""; els.balanceMessage.textContent = ""; openModal(els.balanceModal); setTimeout(()=>els.balanceInput.focus(),50); });
    els.balanceForm?.addEventListener("submit", async (e) => { e.preventDefault(); await saveBalance(); });
    els.balanceClose?.addEventListener("click", () => closeModal(els.balanceModal));
    els.balanceCancel?.addEventListener("click", () => closeModal(els.balanceModal));
    els.fixtureModalClose?.addEventListener("click", () => closeModal(els.fixtureModal));
    [els.balanceModal, els.fixtureModal].forEach(modal => modal?.addEventListener("click", e => { if (e.target === modal) closeModal(modal); }));
    document.addEventListener("keydown", e => { if(e.key === "Escape") { closeModal(els.balanceModal); closeModal(els.fixtureModal); } });
    window.addEventListener("resize", () => renderCharts());

    try { await loadData(); } catch (error) {
        console.error("Error carregant dashboard:", error);
        if (els.syncStatus) els.syncStatus.textContent = "No s'han pogut carregar totes les dades";
    }
});
