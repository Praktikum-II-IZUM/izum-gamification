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
      npm install --legacy-peer-deps
      ```

4. **Nastavite okoljske spremenljivke**
    - Ustvarite datoteko `.env.local` v korenski mapi projekta.
    - Dodajte naslednje konfiguracije:
    ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY=#api key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=#auth domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=#project id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=#storage bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=#messaging sender id
    NEXT_PUBLIC_FIREBASE_APP_ID=#app id
    MEASUREMENT_ID=#measurement id
    ```

5. **Zaženite razvojni strežnik**
    ```bash
    npm run dev
    ```

6. **Odprite aplikacijo**
    - Obiščite [http://localhost:3000](http://localhost:3000) v vašem brskalniku.

7. **Testiranje**
    - Testiranje se lahko izvede z uporabo `npm test`.