import os
import re
import requests

from datetime import date
from bs4 import BeautifulSoup
from supabase import create_client


# =========================================================
# CONFIGURACIÓ
# =========================================================

VALUES_URL = "https://www.futbolfantasy.com/analytics/laliga-fantasy/mercado"
POINTS_URL = "https://www.futbolfantasy.com/analytics/laliga-fantasy/puntos"

SUPABASE_URL = "https://xkwzddjzypnskakskell.supabase.co"


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 "
        "(KHTML, like Gecko) "
        "Chrome/139.0 Safari/537.36"
    )
}


# =========================================================
# SUPABASE
# =========================================================

def connectar_supabase():

    secret_key = os.getenv("SUPABASE_SECRET_KEY")

    if not secret_key:

        raise RuntimeError(
            "No s'ha trobat la variable "
            "SUPABASE_SECRET_KEY."
        )

    print()
    print("=" * 70)
    print("CONNECTANT AMB SUPABASE")
    print("=" * 70)

    supabase = create_client(
        SUPABASE_URL,
        secret_key
    )

    print("OK - Supabase connectat")

    return supabase


# =========================================================
# DESCARREGAR PÀGINA
# =========================================================

def descarregar_pagina(url):

    print()
    print("=" * 70)
    print("DESCARREGANT PÀGINA")
    print("=" * 70)

    print(f"URL: {url}")

    response = requests.get(
        url,
        headers=HEADERS,
        timeout=30
    )

    response.raise_for_status()

    print(f"OK - HTTP {response.status_code}")
    print(f"Mida HTML: {len(response.text):,} caràcters")

    return response.text


# =========================================================
# CONVERSIONS
# =========================================================

def parse_int(value):

    if value is None:
        return None

    try:
        return int(value)

    except (ValueError, TypeError):

        return None


def normalize_position(position):

    if not position:
        return None

    position = position.lower().strip()

    positions = {

        "portero": "POR",

        "defensa": "DEF",

        "mediocampista": "MIG",
        "centrocampista": "MIG",
        "medio": "MIG",

        "delantero": "DAV",
        "atacante": "DAV",
    }

    return positions.get(
        position,
        position.upper()
    )


# =========================================================
# SCRAPER DE VALORS
# =========================================================

def scrape_values(html):

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    rows = soup.select(
        "tr.elemento_jugador"
    )

    print()
    print("=" * 70)
    print("EXTRACCIÓ DE VALORS")
    print("=" * 70)

    print(
        f"Files de jugadors trobades: {len(rows)}"
    )

    players = {}

    for row in rows:

        source_id = row.get(
            "data-id"
        )

        name = row.get(
            "data-nombre"
        )

        if not source_id or not name:
            continue

        position = normalize_position(
            row.get("data-posicion")
        )

        # Només guardem futbolistes.
        # Entrenadors i altres elements es descarten.

        if position not in ("POR", "DEF", "MIG", "DAV"):
            continue

        current_value = parse_int(
            row.get("data-valor")
        )

        daily_change = parse_int(
            row.get("data-diferencia1")
        )

        # -------------------------------------------------
        # EQUIP
        # -------------------------------------------------

        team_element = row.select_one(
            ".player-equipo span"
        )

        team = None

        if team_element:

            team = team_element.get_text(
                " ",
                strip=True
            )

        # -------------------------------------------------
        # FOTO
        # -------------------------------------------------

        image_element = row.select_one(
            "img.player-foto"
        )

        image_url = None

        if image_element:

            image_url = image_element.get(
                "src"
            )

        # -------------------------------------------------
        # HISTÒRIC DISPONIBLE A LA PÀGINA
        # -------------------------------------------------

        value_1 = parse_int(
            row.get("data-valor1")
        )

        value_2 = parse_int(
            row.get("data-valor2")
        )

        value_3 = parse_int(
            row.get("data-valor3")
        )

        value_7 = parse_int(
            row.get("data-valor7")
        )

        value_14 = parse_int(
            row.get("data-valor14")
        )

        value_30 = parse_int(
            row.get("data-valor30")
        )

        players[source_id] = {

            "source_id": source_id,

            "name": name.strip(),

            "team": team,

            "position": position,

            "current_value": current_value,

            "daily_change": daily_change,

            "image_url": image_url,

            "value_1": value_1,

            "value_2": value_2,

            "value_3": value_3,

            "value_7": value_7,

            "value_14": value_14,

            "value_30": value_30,

            "points": 0
        }

    return players


# =========================================================
# SCRAPER DE PUNTS
# =========================================================

def scrape_points(html):

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    rows = soup.select(
        "tr.elemento_jugador"
    )

    print()
    print("=" * 70)
    print("EXTRACCIÓ DE PUNTS")
    print("=" * 70)

    print(
        f"Files de jugadors trobades: {len(rows)}"
    )

    points = {}

    for row in rows:

        # -------------------------------------------------
        # EXTREURE SOURCE ID
        # -------------------------------------------------

        onclick = row.get(
            "onclick",
            ""
        )

        match = re.search(
            r"openPlayerPointsStats\((\d+),",
            onclick
        )

        if not match:
            continue

        source_id = match.group(1)

        # -------------------------------------------------
        # PUNTS TOTALS
        # -------------------------------------------------

        season_points = parse_int(
            row.get(
                "data-puntostemporada"
            )
        )

        if season_points is None:
            season_points = 0

        # -------------------------------------------------
        # JORNADA ACTUAL
        # -------------------------------------------------

        temporada = parse_int(
            row.get(
                "data-temporada"
            )
        )

        if temporada is None:
            temporada = 0

        # -------------------------------------------------
        # PUNTS PER JORNADA
        #
        # FutbolFantasy mostra els racha-box
        # de més recent a més antic.
        #
        # Exemple:
        #
        # J3 -> 8
        # J2 -> 1
        # J1 -> 5
        #
        # HTML:
        #
        # 8
        # 1
        # 5
        # -------------------------------------------------

        matchday_points = []

        racha_boxes = row.select(
            ".racha-container .racha-box"
        )

        for box in racha_boxes:

            text = box.get_text(
                " ",
                strip=True
            )

            value = parse_int(
                text
            )

            if value is None:
                continue

            matchday_points.append(
                value
            )

        # -------------------------------------------------
        # CONVERTIR ORDRE
        #
        # Si temporada = 3 i tenim:
        #
        # [8, 1, 5]
        #
        # significa:
        #
        # J3 = 8
        # J2 = 1
        # J1 = 5
        # -------------------------------------------------

        jornada_data = {}

        if (
            temporada > 0
            and matchday_points
        ):

            for index, value in enumerate(
                matchday_points
            ):

                matchday = (
                    temporada
                    - index
                )

                if matchday <= 0:
                    continue

                jornada_data[
                    matchday
                ] = value

        # -------------------------------------------------
        # GUARDAR RESULTAT
        # -------------------------------------------------

        points[source_id] = {

            "season_points":
                season_points,

            "matchday_points":
                jornada_data

        }

    # -----------------------------------------------------
    # INFORMACIÓ
    # -----------------------------------------------------

    total_with_matchdays = sum(
        1
        for player in points.values()
        if player["matchday_points"]
    )

    total_matchday_records = sum(
        len(
            player["matchday_points"]
        )
        for player in points.values()
    )

    print()
    print(
        f"Jugadors amb punts per jornada: "
        f"{total_with_matchdays}"
    )

    print(
        f"Registres de jornades extrets: "
        f"{total_matchday_records}"
    )

    # -----------------------------------------------------
    # EXEMPLE DE COMPROVACIÓ
    # -----------------------------------------------------

    exemple = points.get("2799")

    if exemple:

        print()
        print(
            "EXEMPLE - Carlos Soler"
        )

        print(
            f"Punts temporada: "
            f"{exemple['season_points']}"
        )

        for jornada in sorted(
            exemple["matchday_points"]
        ):

            print(
                f"Jornada {jornada}: "
                f"{exemple['matchday_points'][jornada]} pts"
            )

    return points


# =========================================================
# CREUAR VALORS + PUNTS
# =========================================================

def combine_players(
    value_players,
    point_players
):

    print()
    print("=" * 70)
    print("COMBINANT VALORS + PUNTS")
    print("=" * 70)

    total_values = len(
        value_players
    )

    total_points = len(
        point_players
    )

    coincidencies = 0
    sense_punts = 0

    for source_id, player in value_players.items():

        if source_id in point_players:

            player["points"] = (
                point_players[source_id][
                    "season_points"
                ]
            )

            player["matchday_points"] = (
                point_players[source_id][
                    "matchday_points"
                ]
            )

            coincidencies += 1

        else:

            player["points"] = 0

            player["matchday_points"] = {}

            sense_punts += 1

    print(
        f"Jugadors de valors:       {total_values}"
    )

    print(
        f"Jugadors de punts:        {total_points}"
    )

    print(
        f"IDs coincidents:          {coincidencies}"
    )

    print(
        f"Sense dades de punts:     {sense_punts}"
    )

    return value_players


# =========================================================
# MOSTRAR RESULTATS
# =========================================================

def mostrar_resultats(players):

    print()
    print("=" * 70)
    print("RESULTAT FINAL")
    print("=" * 70)

    print(
        f"Jugadors finals: {len(players)}"
    )

    print()
    print("PRIMERS 10 JUGADORS")
    print("-" * 70)

    for player in list(players.values())[:10]:

        print()

        print(
            f"ID:              {player['source_id']}"
        )

        print(
            f"Nom:             {player['name']}"
        )

        print(
            f"Equip:           {player['team']}"
        )

        print(
            f"Posició:         {player['position']}"
        )

        print(
            f"Valor actual:    "
            f"{player['current_value']:,}"
        )

        print(
            f"Canvi diari:     "
            f"{player['daily_change']:,}"
        )

        print(
            f"Punts temporada: "
            f"{player['points']}"
        )

        print(
            f"Foto:            "
            f"{player['image_url']}"
        )


# =========================================================
# COMPROVACIÓ DE JUGADORS
# =========================================================

def comprovar_jugadors(players):

    print()
    print("=" * 70)
    print("COMPROVACIÓ DE JUGADORS")
    print("=" * 70)

    noms = [
        "raphinha",
        "iñaki williams",
        "unai simon"
    ]

    for nom_buscado in noms:

        trobats = [

            player

            for player in players.values()

            if player["name"].lower()
            == nom_buscado.lower()

        ]

        if not trobats:

            print(
                f"{nom_buscado}: NO TROBAT"
            )

            continue

        player = trobats[0]

        print()

        print(
            f"{player['name']} "
            f"({player['source_id']})"
        )

        print(
            f"Valor: {player['current_value']:,}"
        )

        print(
            f"Canvi: {player['daily_change']:,}"
        )

        print(
            f"Punts: {player['points']}"
        )


# =========================================================
# GUARDAR JUGADORS A SUPABASE
# =========================================================

# =========================================================
# GUARDAR JUGADORS A SUPABASE
# =========================================================

def guardar_jugadors(supabase, players):

    print()
    print("=" * 70)
    print("GUARDANT JUGADORS A SUPABASE")
    print("=" * 70)

    dades = []

    for player in players.values():

        dades.append({

            "source_id": player["source_id"],

            "name": player["name"],

            "team": player["team"],

            "position": player["position"],

            "current_value": player["current_value"],

            "daily_change": player["daily_change"],

            "points": player["points"],

            "image_url": player["image_url"],

        })

    print(
        f"Jugadors a guardar: {len(dades)}"
    )

    batch_size = 100

    total = len(dades)

    guardats = 0

    for i in range(
        0,
        total,
        batch_size
    ):

        batch = dades[
            i:i + batch_size
        ]

        (
            supabase
            .table("players")
            .upsert(
                batch,
                on_conflict="source_id"
            )
            .execute()
        )

        guardats += len(batch)

        print(
            f"Guardats: {guardats}/{total}"
        )

    print()
    print(
        "OK - Jugadors guardats correctament"
    )


# =========================================================
# GUARDAR HISTÒRIC DIARI
# =========================================================

def guardar_historic(supabase, players):

    print()
    print("=" * 70)
    print("GUARDANT HISTÒRIC DIARI")
    print("=" * 70)

    avui = date.today().isoformat()

    print(
        f"Data de registre: {avui}"
    )

    # -----------------------------------------------------
    # 1. Recuperem els UUID dels jugadors
    #
    # Supabase utilitza:
    #
    # players.id = UUID
    #
    # mentre que el scraper treballa amb:
    #
    # source_id = ID de FutbolFantasy
    # -----------------------------------------------------

    source_ids = list(
        players.keys()
    )

    supabase_players = []

    batch_size = 100

    for i in range(
        0,
        len(source_ids),
        batch_size
    ):

        batch_ids = source_ids[
            i:i + batch_size
        ]

        response = (
            supabase
            .table("players")
            .select("id, source_id")
            .in_("source_id", batch_ids)
            .execute()
        )

        if response.data:

            supabase_players.extend(
                response.data
            )

    # -----------------------------------------------------
    # 2. Crear un mapa:
    #
    # source_id → UUID Supabase
    # -----------------------------------------------------

    player_ids = {

        row["source_id"]: row["id"]

        for row in supabase_players

    }

    print(
        f"Jugadors trobats a Supabase: "
        f"{len(player_ids)}/{len(players)}"
    )

    # -----------------------------------------------------
    # 3. Preparar registres històrics
    # -----------------------------------------------------

    dades = []

    sense_uuid = []

    for source_id, player in players.items():

        supabase_id = player_ids.get(
            source_id
        )

        if not supabase_id:

            sense_uuid.append(
                source_id
            )

            continue

        dades.append({

            "player_id": supabase_id,

            "recorded_on": avui,

            "market_value": player[
                "current_value"
            ],

            "daily_change": player[
                "daily_change"
            ],

            "points": player[
                "points"
            ]

        })

    if sense_uuid:

        print()
        print(
            "AVÍS - Jugadors sense UUID:"
        )

        print(
            sense_uuid
        )

    print()
    print(
        f"Registres històrics a guardar: "
        f"{len(dades)}"
    )

    # -----------------------------------------------------
    # 4. UPSERT
    #
    # La BBDD té:
    #
    # unique(player_id, recorded_on)
    #
    # Per tant, executar el scraper dues vegades
    # el mateix dia NO crearà duplicats.
    # -----------------------------------------------------

    guardats = 0

    for i in range(
        0,
        len(dades),
        batch_size
    ):

        batch = dades[
            i:i + batch_size
        ]

        (
            supabase
            .table("player_values")
            .upsert(
                batch,
                on_conflict="player_id,recorded_on"
            )
            .execute()
        )

        guardats += len(batch)

        print(
            f"Històric guardat: "
            f"{guardats}/{len(dades)}"
        )

    print()
    print(
        "OK - Històric diari guardat correctament"
    )


# =========================================================
# GUARDAR PUNTS PER JORNADA
# =========================================================

def guardar_punts_jornada(
    supabase,
    players
):

    print()
    print("=" * 70)
    print("GUARDANT PUNTS PER JORNADA")
    print("=" * 70)

    source_ids = list(
        players.keys()
    )

    # -----------------------------------------------------
    # RECUPERAR UUIDS
    # -----------------------------------------------------

    supabase_players = []

    batch_size = 100

    for i in range(
        0,
        len(source_ids),
        batch_size
    ):

        batch_ids = source_ids[
            i:i + batch_size
        ]

        response = (
            supabase
            .table("players")
            .select(
                "id, source_id"
            )
            .in_(
                "source_id",
                batch_ids
            )
            .execute()
        )

        if response.data:

            supabase_players.extend(
                response.data
            )

    player_ids = {

        row["source_id"]: row["id"]

        for row in supabase_players

    }

    # -----------------------------------------------------
    # PREPARAR DADES
    # -----------------------------------------------------

    dades = []

    for source_id, player in players.items():

        supabase_id = player_ids.get(
            source_id
        )

        if not supabase_id:
            continue

        matchday_points = player.get(
            "matchday_points",
            {}
        )

        for matchday, points in matchday_points.items():

            dades.append({

                "player_id":
                    supabase_id,

                "matchday":
                    int(matchday),

                "points":
                    int(points)

            })

    print(
        f"Registres de punts per jornada: "
        f"{len(dades)}"
    )

    if not dades:

        print(
            "No hi ha punts per jornada per guardar."
        )

        return

    # -----------------------------------------------------
    # UPSERT
    # -----------------------------------------------------

    guardats = 0

    for i in range(
        0,
        len(dades),
        batch_size
    ):

        batch = dades[
            i:i + batch_size
        ]

        (
            supabase
            .table(
                "player_match_points"
            )
            .upsert(
                batch,
                on_conflict=
                    "player_id,matchday"
            )
            .execute()
        )

        guardats += len(batch)

        print(
            f"Punts guardats: "
            f"{guardats}/{len(dades)}"
        )

    print()
    print(
        "OK - Punts per jornada guardats correctament"
    )

# =========================================================
# MAIN
# =========================================================

def main():

    try:

        # -------------------------------------------------
        # 1. CONNECTAR SUPABASE
        # -------------------------------------------------

        supabase = connectar_supabase()

        # -------------------------------------------------
        # 2. PÀGINA DE VALORS
        # -------------------------------------------------

        values_html = descarregar_pagina(
            VALUES_URL
        )

        value_players = scrape_values(
            values_html
        )

        # -------------------------------------------------
        # 3. PÀGINA DE PUNTS
        # -------------------------------------------------

        points_html = descarregar_pagina(
            POINTS_URL
        )

        point_players = scrape_points(
            points_html
        )

        # -------------------------------------------------
        # 4. COMBINAR
        # -------------------------------------------------

        players = combine_players(
            value_players,
            point_players
        )

        # -------------------------------------------------
        # 5. MOSTRAR RESULTATS
        # -------------------------------------------------

        mostrar_resultats(
            players
        )

        # -------------------------------------------------
        # 6. COMPROVAR JUGADORS
        # -------------------------------------------------

        comprovar_jugadors(
            players
        )

        # -------------------------------------------------
        # 7. ACTUALITZAR PLAYERS
        # -------------------------------------------------

        guardar_jugadors(
            supabase,
            players
        )

        # -------------------------------------------------
        # 8. GUARDAR HISTÒRIC
        # -------------------------------------------------

        guardar_historic(
            supabase,
            players
        )

        # -------------------------------------------------
        # 9. GUARDAR PUNTS PER JORNADA
        # -------------------------------------------------

        guardar_punts_jornada(
            supabase,
            players
        )

        # -------------------------------------------------
        # FINAL
        # -------------------------------------------------

        print()
        print("=" * 70)
        print("SCRAPER COMPLET EXECUTAT CORRECTAMENT")
        print("=" * 70)

    except requests.RequestException as error:

        print()
        print("=" * 70)
        print("ERROR DESCARREGANT UNA PÀGINA")
        print("=" * 70)

        print(error)

    except Exception as error:

        print()
        print("=" * 70)
        print("ERROR INESPERAT")
        print("=" * 70)

        print(error)


if __name__ == "__main__":

    main()