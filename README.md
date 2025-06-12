# Igrifikacija - Sestavljanka naslovnic

## Opis projekta

Spletna aplikacija za sestavljanje sestavljank iz naslovnic knjig v COBISS Plus. Uporabnik lahko izbere naslovnico, ki se razreže na manjše kose, ki jih nato premika in vrti, da sestavi izvirno sliko. Aplikacija je prilagojena za uporabo na različnih napravah, vključno z namiznimi računalniki, tablicami in pametnimi telefoni.

## Glavne značilnosti

- **Več težavnostnih nivojev**:
  - 2×2 (Zelo lahko)
  - 2×3 (Lahko)
  - 3×3 (Srednje)
  - 3×4 (Težje)
  - 4×4 (Težko)
  - 4×5 (Zelo težko)

- **Interaktivna igra**:
  - Povleci in spusti funkcionalnost
  - Vrtenje kosov s klikom/dotikom
  - Samodejno prilagajanje velikosti glede na napravo
  - Animirano obvestilo in zvočni efekt ob uspešni rešitvi
  - Možnost prikaza rešitve
  - Skupna statistika
  - Medalje za dobre rezultate
  
- **Sistem točkovanja**:
  - Točkovanje glede na: 
    - Težavnost
    - Čas reševanja
    - Uporabo prikaza rešitve
  - Shranjevanje preteklih rezultatov
  

## Tehnologije

- **Frontend**:
  - **Next.js** (React framework)
  - **TypeScript** za tipsko varno kodo
  - **Tailwind CSS** za stilizacijo
  - **Framer Motion** za animacije
  - **Radix UI** za dostopne komponente

- **Backend & Shramba**:
  - **Firebase** za avtentikacijo in shranjevanje podatkov
  - **Next.js API Routes** za strežniško logiko
  - **LocalStorage** za lokalno shranjevanje statistike

- **Orodja za razvoj**:
  - **Node.js**
  - **Jest** za testiranje
  - **ESLint** in **Prettier** za kakovost kode
  - **Git** za upravljanje različic
  - **Docker** za virtualizacijo


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
      ali
      ```bash
      yarn install --legacy-peer-deps
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
    ali
    ```bash
    yarn dev
    ```

6. **Zagon z Dockerjem (izbirno)**
    - Zgradite Docker kontejner in sliko: 
      ```bash
      docker compose up --build
      ```

7. **Odprite aplikacijo**
    - Obiščite [http://localhost:3000](http://localhost:3000) v vašem brskalniku.

8. **Testiranje**
    - Testiranje se lahko izvede z uporabo 
    ```bash
    npm test
    ```
    ali 
    ```bash
    npm run test
    ```
    ali
    ```bash
    yarn test
    ```

## Produkcija

- **Render**: https://izum-gamification.onrender.com/
- **Vercel**: https://izum-gamification-delta.vercel.app/

## Kontakt

Za vprašanja, sodelovanja ali prispevke nas kontaktirajte na: dev.puzzlegame@outlook.com

