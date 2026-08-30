# LaLiga Fantasy Tracker

> A personal fantasy football tracker for monitoring squad value, player performance, transactions and LaLiga fixtures.

[![Status](https://img.shields.io/badge/status-active-success)]()
[![Language](https://img.shields.io/badge/language-Català%20%7C%20English-blue)]()
[![Data](https://img.shields.io/badge/data-FutbolFantasy-orange)]()

---

# 🇨🇦 Català

## Descripció

**LaLiga Fantasy Tracker** és una aplicació web personal per fer seguiment d'un equip de fantasy de LaLiga.

El projecte permet registrar i consultar:

- Jugadors de la plantilla.
- Compres i vendes.
- Valor actual i evolució diària dels jugadors.
- Històric del valor.
- Punts per jornada.
- Valor de la plantilla.
- Saldo disponible i evolució del saldo.
- Calendari i pròxims partits.
- Tendències del mercat.
- Informació detallada dels jugadors.
- Historial de transaccions.

---

## Funcionalitats

### 🏠 Dashboard

- Valor total de la plantilla.
- Variació del valor.
- Saldo disponible.
- Evolució del valor de plantilla i saldo.
- Jugadors de la plantilla que més pugen i baixen.
- Calendari de les properes jornades.
- Estat i data de l'última actualització.

El saldo disponible és introduït manualment pel manager i, a partir d'aquell moment, se'n pot fer seguiment històric.

### 👥 Plantilla

- Fotos, noms, equips i posicions.
- Valor actual i variació diària.
- Evolució del valor.
- Punts de temporada i punts per jornada.
- Històric del valor.
- Vista detallada.
- Registre de compres i vendes.

La plantilla es reconstrueix a partir de les transaccions registrades.

### 📈 Mercat

- Top de jugadors que més pugen i baixen de valor.
- Filtres per posició.
- Cerca per jugador, equip o posició.
- Ordenació per valor o punts.
- Indicador de jugadors en propietat.
- Vista detallada del jugador.

### 📋 Historial

- Compres i vendes.
- Data i import de cada operació.
- Benefici o pèrdua.
- Total gastat i generat.
- Resultat global.
- Cerca, filtres i ordenació cronològica.

### 🗓️ Calendari

Permet consultar diferents jornades amb:

- Jornada.
- Equip local i visitant.
- Escuts.
- Data i hora.
- Estat i resultat quan està disponible.

Les dades s'actualitzen mitjançant el scraper.

---

# 🗄️ Base de dades i infraestructura

El projecte utilitza una **base de dades pròpia de Supabase** com a backend.

S'hi emmagatzemen, entre d'altres:

- Jugadors.
- Històric de valors.
- Punts per jornada.
- Calendari.
- Transaccions.
- Saldo del manager.
- Històric del saldo.
- Estat de sincronització.

També s'utilitza **Supabase Auth** per a l'autenticació.

### Ús personal

La instància de Supabase associada al projecte és d'ús **personal i privat** i no es distribueix com a servei públic.

- Els registres de nous comptes estan deshabilitats.
- L'accés està restringit als usuaris autoritzats.
- La base de dades pot contenir dades personals.
- La infraestructura Supabase no forma part del servei distribuït pel repositori.

Qualsevol persona que vulgui executar la seva pròpia instància haurà de configurar el seu propi projecte Supabase i les seves polítiques de seguretat.

---

# 🕷️ Scraper i fonts de dades

El scraper obté informació pública de FutbolFantasy i la transforma per utilitzar-la a l'aplicació.

### Fonts principals

**Mercat de LaLiga Fantasy**  
https://www.futbolfantasy.com/analytics/laliga-fantasy/mercado

**Punts de LaLiga Fantasy**  
https://www.futbolfantasy.com/analytics/laliga-fantasy/puntos

**Calendari de LaLiga**  
https://www.futbolfantasy.com/laliga/calendario

Les dades poden incloure identificadors, noms, equips, posicions, valors, variacions, punts, imatges, partits, dates, hores i escuts.

---

# Crèdits i atribució

Les dades futbolístiques utilitzades pel projecte provenen de **FutbolFantasy**:

https://www.futbolfantasy.com/

Fonts consultades:

- https://www.futbolfantasy.com/analytics/laliga-fantasy/mercado
- https://www.futbolfantasy.com/analytics/laliga-fantasy/puntos
- https://www.futbolfantasy.com/laliga/calendario

**FutbolFantasy és la font de les dades futbolístiques utilitzades pel scraper.**

Aquest projecte és independent i **no està afiliat, patrocinat, avalat ni desenvolupat en col·laboració amb FutbolFantasy**.

FutbolFantasy conserva els drets que corresponguin sobre el seu lloc web, continguts, marques, imatges i dades.

> Si ets el propietari o representant dels continguts utilitzats i consideres que algun element del projecte infringeix els teus drets o les teves condicions d'ús, contacta amb l'autor del repositori perquè pugui revisar-ho.

## Avís sobre el scraper

El scraper està pensat principalment per a **ús personal, aprenentatge i experimentació**.

S'ha d'utilitzar de manera responsable i respectant les condicions d'ús, polítiques, directives `robots.txt` i normativa aplicable a cada font de dades.

L'atribució de la font **no implica per si mateixa una llicència o autorització per reutilitzar continguts protegits**.

Qualsevol persona que executi o modifiqui el scraper és responsable de l'ús que en faci.

---

# 🔄 Actualització de dades

```text
FutbolFantasy
      │
      ▼
   scraper.py
      │
      ▼
 Extracció HTML
      │
      ▼
 Normalització
      │
      ▼
   Supabase
      │
      ▼
 LaLiga Fantasy Tracker
```

El scraper actualitza principalment jugadors, valors, punts per jornada, fixtures i estat de sincronització.

---

# ⚙️ Execució

Des de la carpeta `scraper`:

```bash
py scraper.py
```

Un procés correcte acaba amb:

```text
SCRAPER COMPLET EXECUTAT CORRECTAMENT
```

---

# 💻 Desenvolupament local

El frontend és una aplicació web estàtica i es recomana executar-lo amb un servidor HTTP local, per exemple **VS Code + Live Server**.

```text
http://127.0.0.1:5500/
```

No es recomana obrir els HTML directament amb `file://`.

---

# 🔐 Seguretat

No s'han de publicar credencials sensibles.

**Mai s'ha de publicar una Supabase `service_role` key ni altres secrets privats.**

La base de dades ha d'utilitzar polítiques adequades de **Row Level Security (RLS)**.

---

# 🛠️ Tecnologies

- HTML5
- CSS3
- JavaScript
- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security
- Python
- BeautifulSoup
- HTTP requests

---

# 📊 Estat del projecte

- [x] Dashboard
- [x] Autenticació
- [x] Plantilla
- [x] Compres i vendes
- [x] Historial
- [x] Mercat
- [x] Cerca i filtres
- [x] Evolució de valor
- [x] Punts per jornada
- [x] Calendari
- [x] Seguiment del saldo
- [x] Històric del saldo
- [x] Gràfiques
- [x] Scraper
- [x] Estat de sincronització
- [x] Vista detallada dels jugadors

---

# ⚠️ Avís legal

Aquest és un projecte personal i independent amb finalitats d'aprenentatge, experimentació i seguiment personal de fantasy football.

No és un producte oficial de LaLiga, FutbolFantasy, cap plataforma fantasy, club o competició representada en les dades.

Aquest projecte no està afiliat, patrocinat ni avalat per aquestes entitats.

Les marques, noms, imatges, escuts i altres continguts de tercers pertanyen als seus respectius propietaris.

Les dades de tercers poden ser incompletes, retardades, inexactes o canviar en qualsevol moment.

---

# 🇬🇧 English

## Description

**LaLiga Fantasy Tracker** is a personal web application for tracking a LaLiga fantasy football team.

It provides:

- Squad management.
- Purchases and sales.
- Current and historical player values.
- Daily market changes.
- Matchday points.
- Squad value.
- Manager balance and balance history.
- LaLiga fixtures.
- Market trends.
- Detailed player information.
- Transaction history.

---

## Features

### Dashboard

- Total squad value.
- Squad value changes.
- Available balance.
- Squad value and balance charts.
- Biggest risers and fallers within the user's squad.
- Upcoming fixtures.
- Data synchronization status and last update time.

### Squad

- Player photos, names, teams and positions.
- Current values and daily changes.
- Historical value evolution.
- Season and matchday points.
- Detailed player views.
- Purchases and sales.

### Market

- Top risers and fallers.
- Position filters.
- Search by player, team or position.
- Sorting by value or points.
- Ownership indicators.
- Detailed player views.

### Transaction History

- Purchases and sales.
- Dates and amounts.
- Profit/loss.
- Totals and overall result.
- Search, filters and chronological sorting.

### Fixtures

The application provides LaLiga fixtures including matchday, teams, crests, date, kick-off time, status and results when available.

---

# Database and infrastructure

The project uses a **dedicated personal Supabase database** as its backend.

It stores players, historical values, matchday points, fixtures, transactions, manager balances, balance history and synchronization status.

**Supabase Auth** is used for authentication.

### Personal use

The associated Supabase instance is intended for **personal and private use** and is not distributed as a public service.

- Public account registration is disabled.
- Access is restricted to authorized users.
- The database may contain personal user data.
- The associated Supabase infrastructure is not part of the public repository distribution.

Anyone wishing to run their own instance must configure their own Supabase project and security policies.

---

# 🕷️ Scraper and data sources

The scraper retrieves publicly accessible information from FutbolFantasy pages.

Main sources:

- https://www.futbolfantasy.com/analytics/laliga-fantasy/mercado
- https://www.futbolfantasy.com/analytics/laliga-fantasy/puntos
- https://www.futbolfantasy.com/laliga/calendario

**FutbolFantasy is credited as the source of the football data used by the scraper.**

This project is independent and **is not affiliated with, sponsored by, endorsed by, or developed in collaboration with FutbolFantasy**.

FutbolFantasy retains whatever rights may apply to its website, content, trademarks, images and data.

## Scraper disclaimer

The scraper is intended primarily for **personal use, learning and experimentation**.

It should be used responsibly and in accordance with applicable terms of use, policies, `robots.txt` directives and applicable laws.

Attribution **does not by itself grant a license or permission to reuse protected content**.

Anyone running or modifying the scraper is responsible for their use of it.

---

# Security

Sensitive credentials must never be committed to the repository.

**Never publish a Supabase `service_role` key or other private secrets.**

Appropriate **Row Level Security (RLS)** policies should be configured to protect user data.

---

# Technologies

- HTML5
- CSS3
- JavaScript
- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security
- Python
- BeautifulSoup
- HTTP requests

---

# Project status

- [x] Dashboard
- [x] Authentication
- [x] Squad management
- [x] Purchases and sales
- [x] Transaction history
- [x] Market
- [x] Search and filters
- [x] Player value evolution
- [x] Matchday points
- [x] LaLiga fixtures
- [x] Manager balance tracking
- [x] Balance history
- [x] Charts
- [x] Scraper
- [x] Synchronization status
- [x] Detailed player views

---

# Legal disclaimer

This is an independent personal project intended for learning, experimentation and personal fantasy football tracking.

It is not an official product of LaLiga, FutbolFantasy, any fantasy football platform, football club or competition represented in the data.

This project is not affiliated with, sponsored by, or endorsed by those entities.

Third-party trademarks, names, images, crests and other content remain the property of their respective owners.

Third-party data may be incomplete, delayed, inaccurate or subject to change.

---

# License

Unless otherwise stated, the original source code in this repository is provided for personal and educational use.

Third-party trademarks, images, website content and football data remain the property of their respective owners.

The FutbolFantasy name and website are referenced solely to identify the external source of football data used by this project.
