# COBISS Puzzle

Interaktivna spletna aplikacija, kjer lahko sestavljate naslovnice knjig iz COBISS kataloga. Sestavite sestavljanko iz kosov naslovnic in spoznajte nove knjige. Igra vključuje izzivni časovni element z omejenim časom za reševanje, točkovanje, ki nagrajuje hitrejše reševanje, in podrobno statistiko.

## Vsebina

- [Funkcionalnosti](#funkcionalnosti)
- [Zahteve](#zahteve)
- [Namestitev](#namestitev)
- [Zaganjanje aplikacije](#zaganjanje-aplikacije)
- [Navodila za uporabo](#navodila-za-uporabo)
- [Sistem točkovanja](#sistem-točkovanja)
- [Razvoj](#razvoj)
- [Licenca](#licenca)

## Funkcionalnosti

- **Različne težavnostne stopnje** - izbira med različnimi velikostmi sestavljank (2×2 do 5×5)
- **Sistemsko točkovanje** - več točk prejmete za hitrejše reševanje
- **Rešitev na voljo** - možnost prikaza rešitve z zmanjšanjem možnih točk
- **Statistika** - spremljanje vaših dosežkov in napredka
- **Odzivni dizajn** - prilagojeno delovanje na vseh napravah
- **Podpora za miško in dotik** - intuitivno vlečenje in spuščanje kosov

## Zahteve

- Node.js (v16.0.0 ali novejši)
- npm (vključeno z Node.js)

## Namestitev

1. Klonirajte repozitorij:
   ```bash
   git clone [URL-repozitorija]
   cd puzzle-game
   ```

2. Namestite odvisnosti:
   ```bash
   npm install
   ```

## Zaganjanje aplikacije

Zaženite aplikacijo v razvojnem načinu:

```bash
npm run dev
```

Odprite [http://localhost:3000](http://localhost:3000) v vašem brskalniku.

## Navodila za uporabo

1. Izberite želeno sliko in težavnostno stopnjo
2. Povlecite in spustite kose na pravilno mesto
3. Dvokliknite na kos za njegovo obračanje
4. Na mobilnih napravah uporabite približevanje z dvema prstoma
5. Gumb "Pokaži rešitev" je na voljo, vendar zmanjša končni rezultat

## Sistem točkovanja

- **Večja težavnost** pomeni več točk
- **Hitrejše reševanje** prinaša več točk
- **Časovna omejitev** se povečuje z velikostjo sestavljanke
- **Uporaba pomoči** zmanjša najvišji možni rezultat
- **Medalje** se podeljujejo glede na odstotek doseženih točk:
  - 🥇 Zlata medalja: 100% točk
  - 🥈 Srebrna medalja: 60-99% točk
  - 🥉 Bronasta medalja: 30-59% točk

## Razvoj

Prispevki so dobrodošli. Če imate predloge za izboljšave ali želite prijaviti napako, odprite nov "issue" ali pošljite "pull request".

## Licenca

Ta projekt je licenciran pod [MIT licenco](LICENSE).
