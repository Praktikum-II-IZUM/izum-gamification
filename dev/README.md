## Navodila za zagon in vzpostavitev sistema

1. **Klonirajte repozitorij**
    ```bash
    git clone https://github.com/Praktikum-II-IZUM/izum-gamification.git
    ```

2. **Premaknite se v mapo projekta**
    ```bash
    cd izum-gamification/puzzle-game
    ```

3. **Namestite odvisnosti**
    - Če uporabljate `npm`:
      ```bash
      npm install
      ```

4. **Nastavite okoljske spremenljivke**
    - Ustvarite datoteko `.env` v korenski mapi projekta.
    - Dodajte potrebne konfiguracije (primer: povezava do baze, API ključi).

5. **Zaženite razvojni strežnik**
    ```bash
    npm run dev
    ```

6. **Odprite aplikacijo**
    - Obiščite [http://localhost:3000](http://localhost:3000) v vašem brskalniku.

7. **Testiranje**
    - Testiranje se lahko izvede z uporabo `npm test`.