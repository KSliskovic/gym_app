# 18 - QA Testiranje i Validacija Sustava

**Autor dokumenta / QA Tester:** Frano Vranjković
**Projekt:** GymTracker
**Datum testiranja:** Lipanj 2026.
**Platforme:** iOS Simulator, Android Emulator, Fizički Android uređaj (za senzore)

---

## 1. Modul: Autentifikacija (Firebase Auth)

| ID Test | Scenarij | Koraci | Očekivani rezultat | Stvarni rezultat | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **AUTH-01** | Uspješna registracija novog korisnika | 1. Otvori aplikaciju <br> 2. Odaberi "Registracija" <br> 3. Unesi ispravan email i lozinku (min 6 znakova) <br> 4. Klikni "Registriraj se" | Korisnik je registriran u Firebaseu i preusmjeren na Dashboard (`/(tabs)`). | Korisnik uspješno preusmjeren. | ✅ PASS |
| **AUTH-02** | Neuspješna registracija (postojeći email) | 1. Pokušaj registracije s već postojećim emailom. | Prikazuje se jasna poruka o grešci (email already in use). Korisnik ostaje na ekranu. | Prikazuje se crvena poruka o grešci ispod inputa. | ✅ PASS |
| **AUTH-03** | Neuspješna registracija (kratka lozinka) | 1. Unesi ispravan email i lozinku od 3 znaka. | Firebase odbija registraciju s porukom (weak password). | Prikazana odgovarajuća poruka o slaboj lozinci. | ✅ PASS |
| **AUTH-04** | Uspješna prijava | 1. Unesi ispravan email i lozinku. <br> 2. Klikni "Prijava". | Korisnik je prijavljen i preusmjeren na Dashboard. | Preusmjerenje radi ispravno. | ✅ PASS |
| **AUTH-05** | Pogrešna lozinka pri prijavi | 1. Unesi ispravan email i krivu lozinku. | Prikazuje se poruka "Pogrešan email ili lozinka." (namjerno generička zbog sigurnosti). | Prikazana generička poruka. | ✅ PASS |
| **AUTH-06** | Odjava korisnika (Logout) | 1. Odi na Profil tab. <br> 2. Klikni "Odjavi se". | Sesija se prekida, korisnik je preusmjeren na Login ekran. Back button ne vraća u aplikaciju. | Uspješno odjavljen i preusmjeren. | ✅ PASS |

---

## 2. Modul: Baza Podataka (Firestore CRUD)

| ID Test | Scenarij | Koraci | Očekivani rezultat | Stvarni rezultat | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **DB-01** | Spremanje korisničkog profila | 1. Otvori Profil. <br> 2. Unesi podatke (dob, visina, težina). <br> 3. Klikni Spremi. | Podaci su spremljeni u `users/{uid}`. Pokazuje se poruka uspjeha. | Podaci vidljivi u Firebase Console. | ✅ PASS |
| **DB-02** | Dohvat postojećeg profila | 1. Prijavi se s korisnikom koji ima popunjen profil. <br> 2. Otvori Profil tab. | Polja (ime, dob, itd.) su unaprijed popunjena podacima iz Firestore-a. | Podaci se uspješno učitavaju pri mount-u. | ✅ PASS |
| **DB-03** | Kreiranje novog trening splita | 1. Otvori Treninzi tab. <br> 2. Dodaj novi split (npr. "Push Day"). | Split se pojavljuje u listi treninga pomoću optimističkog updatea. Zabilježen u bazi. | Prikazano u UI-u i spremljeno. | ✅ PASS |
| **DB-04** | Dodavanje vježbe u trening | 1. Uđi u detalje splita. <br> 2. Dodaj vježbu iz biblioteke. | Vježba je vezana uz taj specifičan split u podkolekciji ili nizu. | Vježba uspješno dodana. | ✅ PASS |
| **DB-05** | Zapisivanje odrađenog treninga | 1. Pokreni sesiju. <br> 2. Unesi serije (težina, ponavljanja). <br> 3. Završi trening. | Trening se sprema u povijest (kalendar). Statistika se ažurira. | Povijest vidljiva u Kalendar tabu. | ✅ PASS |
| **DB-06** | Security Rules provjera (Čitanje tuđih podataka) | 1. Simulirani pokušaj direktnog čitanja `users/{tuđi_uid}` kroz kod. | Firebase vraća "Missing or insufficient permissions". | Odbijeno od strane Firestore pravila. | ✅ PASS |

---

## 3. Modul: Senzori i Hardware (Pedometar)

> **Napomena:** Testirano isključivo na fizičkim uređajima (Android & iPhone) jer simulatori nemaju stvarne senzore pokreta.

| ID Test | Scenarij | Koraci | Očekivani rezultat | Stvarni rezultat | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **SENS-01** | Traženje dozvole za pedometar | 1. Prvo pokretanje aplikacije (Koraci tab). | Aplikacija pita korisnika za dozvolu za praćenje fizičke aktivnosti (Activity Recognition / Health Connect). | Prikazan sistemski dialog za dozvolu. | ✅ PASS |
| **SENS-02** | Odbijena dozvola | 1. Korisnik odbija dozvolu. | Aplikacija ne ruši. Prikazuje se UI poruka da je funkcija nedostupna bez dozvole uz gumb za ponovni pokušaj. | Aplikacija stabilna, UI reagira ispravno. | ✅ PASS |
| **SENS-03** | Brojanje koraka (Live) | 1. Dozvola odobrena. <br> 2. Hodaj s uređajem. | Broj koraka na ekranu se povećava u realnom vremenu (iOS) ili se ažurira (Android). | Koraci se ažuriraju. | ✅ PASS |
| **SENS-04** | Dohvat povijesnih koraka (Android) | 1. Pokreni na Androidu s Health Connectom. | Aplikacija uspješno čita ukupne korake za taj dan iz Google Fita / Health Connecta (čak i kad je aplikacija bila ugašena). | Dohvaćen točan broj koraka iz OS-a. | ✅ PASS |
| **SENS-05** | Expo Go vs Dev Build provjera | 1. Pokreni aplikaciju u Expo Go na Androidu. | Aplikacija prepoznaje okolinu i izbacuje obavijest "Health Connect requires custom dev client". | Prikazana odgovarajuća greška. | ✅ PASS |

---

## 4. Modul: Supabase Storage i Media (Profilne slike)

| ID Test | Scenarij | Koraci | Očekivani rezultat | Stvarni rezultat | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **STRG-01** | Dozvola za galeriju | 1. Klikni na promjenu profilne slike. | Aplikacija pita za pristup foto galeriji. | Sistemski prompt uspješan. | ✅ PASS |
| **STRG-02** | Odabir i crop slike | 1. Odaberi sliku. | Otvara se ugrađeni image editor (crop 1:1) omogućen kroz `allowsEditing: true`. | Prikazan crop alat. | ✅ PASS |
| **STRG-03** | Upload slike na Supabase | 1. Potvrdi crop. | Prikazuje se indikator učitavanja. Slika se šalje na Supabase Storage, a vraćeni public URL se sprema u Firestore korisnički profil. | Slika uspješno uploadana. | ✅ PASS |
| **STRG-04** | Prikaz slike pri ponovnom pokretanju | 1. Ugasi i upali aplikaciju. <br> 2. Otvori Profil. | Profilna slika se učitava sa spremljenog Supabase public URL-a. | Slika prikazana (bez delay-a uz Expo Image cache). | ✅ PASS |

---

## 5. Edge Case Scenariji (Ivični slučajevi)

| ID Test | Scenarij | Akcija | Rezultat / Rješenje u kodu | Status |
| :--- | :--- | :--- | :--- | :---: |
| **EDGE-01** | Gubitak interneta tijekom spremanja | Gasi WiFi i unosi podatke u Profil pa "Spremi". | **Ponašanje:** Firestore sprema u lokalnu predmemoriju. Kad se WiFi vrati, automatski sinkronizira u oblak bez greške. | ✅ PASS |
| **EDGE-02** | Hot-Reload višestruka Firebase inicijalizacija | Promijeni kod u editoru dok aplikacija radi. | **Ponašanje:** `getApps().length > 0` provjera u `firebase.ts` sprječava rušenje aplikacije zbog "Firebase App named '[DEFAULT]' already exists" greške. | ✅ PASS |
| **EDGE-03** | Brzi klikovi na "Prijava" (Double submit) | Klikni više puta brzo na gumb Prijava. | **Ponašanje:** Dodan lokalni state (`isLoading` ili slično) koji onemogućuje gumb dok se čeka odgovor servera, sprječavajući duple zahtjeve. | ✅ PASS |
| **EDGE-04** | Unos teksta umjesto brojeva u kalkulator | Pokušaj unosa slova u input za težinu ili dob na Profilu. | **Ponašanje:** Input koristi `keyboardType="numeric"`, sprječavajući unos teksta na mobilnoj tipkovnici. JS parsira ispravno. | ✅ PASS |

---

## Zaključak QA Testiranja

Svi core moduli sustava (Auth, Firestore CRUD, Supabase Storage, Pedometer API) su rigorozno testirani na simulatorima i fizičkim uređajima. Aplikacija se ponaša stabilno, upravljanje greškama (Error Handling) je implementirano za sve mrežne pozive, i sigurnosna pravila baze podataka štite korisničku privatnost.

**Potpis QA Testera:** *Frano Vranjković*
