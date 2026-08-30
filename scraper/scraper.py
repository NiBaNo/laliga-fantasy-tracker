import requests
from bs4 import BeautifulSoup


# =========================================================
# CONFIGURACIÓ
# =========================================================

VALUES_URL = "https://www.futbolfantasy.com/analytics/laliga-fantasy/mercado"


# =========================================================
# DESCARREGAR PÀGINA
# =========================================================

def get_page(url):
    print(f"Descarregant: {url}")

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/139.0.0.0 Safari/537.36"
        )
    }

    response = requests.get(
        url,
        headers=headers,
        timeout=30
    )

    response.raise_for_status()

    print(f"OK - HTTP {response.status_code}")
    print(f"Mida HTML: {len(response.text):,} caràcters")

    return response.text


# =========================================================
# SCRAPER DE PROVA
# =========================================================

def test_values_page(html):

    soup = BeautifulSoup(html, "html.parser")

    print()
    print("=" * 60)
    print("ANÀLISI DE LA PÀGINA DE VALORS")
    print("=" * 60)

    # Tots els enllaços de la pàgina
    links = soup.find_all("a")

    print(f"Enllaços trobats: {len(links)}")

    print()
    print("Alguns enllaços trobats:")

    count = 0

    for link in links:

        text = link.get_text(" ", strip=True)
        href = link.get("href")

        if text and href:

            print(f"- {text[:60]} -> {href}")

            count += 1

            if count >= 20:
                break


# =========================================================
# MAIN
# =========================================================

def main():

    try:

        html = get_page(VALUES_URL)

        test_values_page(html)

        print()
        print("=" * 60)
        print("SCRAPER EXECUTAT CORRECTAMENT")
        print("=" * 60)

    except requests.RequestException as error:

        print()
        print("ERROR DESCARREGANT LA PÀGINA:")
        print(error)

    except Exception as error:

        print()
        print("ERROR:")
        print(error)


if __name__ == "__main__":
    main()