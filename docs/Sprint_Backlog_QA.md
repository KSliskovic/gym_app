# Sprint Backlog - GymTracker 

---

## 1. Sprint
**Cilj 1. Sprinta:** Postavljanje projekta, integracija Firebase baze (Auth) te izrada korisniÄŤkog suÄŤelja za autentifikaciju.

| Naziv Zadatka | Opis | Odgovorni ÄŤlan | Rok |
| :--- | :--- | :--- | :--- |
| **1. Inicijalizacija projekta** | Kreiranje novog React Native (Expo) projekta i instalacija osnovnih paketa. | Kristijan | ZavrĹˇeno |
| **2. Firebase konfiguracija** | Kreiranje Firebase projekta, omoguÄ‡avanje Email/Password autentifikacije. | Kristijan | ZavrĹˇeno |
| **3. Ekran za registraciju (UI)** | Izrada osnovnog suÄŤelja za registraciju korisnika. | Kristijan | ZavrĹˇeno |
| **4. Ekran za prijavu (UI)** | Izrada osnovnog suÄŤelja za prijavu. | Kristijan | ZavrĹˇeno |
| **5. Logika autentifikacije** | Implementacija metoda za registraciju i prijavu korisnika. | Kristijan | ZavrĹˇeno |
| **6. Upravljanje stanjem korisnika** | Usmjeravanje (routing) na poÄŤetni ekran ili ekran za prijavu ovisno o stanju. | Kristijan | ZavrĹˇeno |
| **7. Osnovni poÄŤetni ekran (UI)** | Izrada jednostavnog poÄŤetnog ekrana s opcijom "Odjava". | Kristijan | ZavrĹˇeno |
| **8. Refaktoriranje autentifikacije** | UvoÄ‘enje `AuthContext` komponente radi boljeg upravljanja prijavom. | Kristijan | ZavrĹˇeno |

---

## 2. Sprint
**Cilj 2. Sprinta:** Pohrana podataka, pregled i manipulacija podacima u bazi te testiranje komunikacije s bazom (Firestore).

| Naziv Zadatka | Opis | Odgovorni ÄŤlan | Rok |
| :--- | :--- | :--- | :--- |
| **1. Prikaz treninga** | Izrada komponente i dohvaÄ‡anje podataka treninga iz Firestore baze. | Kristijan | ZavrĹˇeno |
| **2. Unos novih treninga** | Forma za dodavanje novih treninga i pohranu unosa direktno u Firestore. | Kristijan | ZavrĹˇeno |
| **3. Biblioteka vjeĹľbi** | Prikaz, pregled i kreiranje novih vjeĹľbi u bazi. | Kristijan | ZavrĹˇeno |
| **4. Trening Splitovi** | Manipulacija i izrada custom splitova te spremanje u bazu. | Kristijan | ZavrĹˇeno |
| **5. Aktivna Trening Sesija** | Spremanje i aĹľuriranje podataka serija u realnom vremenu u bazi. | Kristijan | ZavrĹˇeno |
| **6. Napredna Statistika** | Pregled i analitika podataka dohvaÄ‡enih iz baze. | Ivan LuetiÄ‡ | ZavrĹˇeno |
| **7. Kalendar treninga** | DohvaÄ‡anje i kalendarski pregled odraÄ‘enih treninga iz baze. | Ivan LuetiÄ‡ | ZavrĹˇeno |
---

## 3. Sprint
**Cilj 3. Sprinta:** Upload datoteka, pregled i organizacija datoteka te optimizacija spremanja u oblaku.

| Naziv Zadatka | Opis | Odgovorni ÄŤlan | Rok |
| :--- | :--- | :--- | :--- |
| **1. Konfiguracija Storage-a** | Postavljanje Supabase Storage okruĹľenja za pohranu datoteka u oblaku. | Ivan LuetiÄ‡ | ZavrĹˇeno |
| **2. Upload profilne slike** | Implementacija *image pickera* i funkcionalnosti za upload datoteka na Supabase. | Ivan LuetiÄ‡ | ZavrĹˇeno |
| **3. Prikaz datoteka** | DohvaÄ‡anje i pregled slika/datoteka iz oblaka unutar aplikacije. | Ivan LuetiÄ‡ | ZavrĹˇeno |
| **4. Organizacija datoteka** | Optimizacija i strukturiranje datoteka u oblaku prema korisnicima. | Ivan LuetiÄ‡ | ZavrĹˇeno |

---

## 4. Sprint
**Cilj 4. Sprinta:** Integracija senzora, prikaz podataka senzora i znaÄŤajke temeljene na podacima senzora.

| Naziv Zadatka | Opis | Odgovorni ÄŤlan | Rok |
| :--- | :--- | :--- | :--- |
| **1. Integracija senzora** | Postavljanje i konfiguracija paketa za pedometar i praÄ‡enje koraka. | Ivan LuetiÄ‡ | ZavrĹˇeno |
| **2. Ekran za praÄ‡enje koraka** | Prikaz znaÄŤajki temeljenih na senzoru (trenutni koraci i kalorije). | Ivan LuetiÄ‡ | ZavrĹˇeno |
| **3. Vizualizacija podataka senzora** | Prikaz povijesti podataka sa senzora (zadnjih 7 dana) na grafikonu. | Ivan LuetiÄ‡ | ZavrĹˇeno |
| **4. Dijeljenje treninga (QR kod)** | Prijenos splitova izmeÄ‘u korisnika putem generiranja i skeniranja QR koda. | Kristijan | ZavrĹˇeno |
| **5. KorisniÄŤki profil i postavke** | Unos korisniÄŤkih podataka i izraÄŤun makronutrijenata, uz lokalno spremanje. | Kristijan | ZavrĹˇeno |
| **6. AĹľuriranje pedometra (Health Connect)** | Prijelaz na stabilnije praÄ‡enje koraka na Androidu putem Health Connect integracije. | Ivan LuetiÄ‡ | ZavrĹˇeno |
| **7. QA Testiranje** | Detaljno testiranje senzora, uploadanja i komunikacije s bazom na ureÄ‘ajima. | Frano VranjkoviÄ‡ | ZavrĹˇeno |
# 18 - QA Testiranje i Validacija Sustava

**Autor dokumenta / QA Tester:** Frano VranjkoviÄ‡
**Projekt:** GymTracker
**Datum testiranja:** Lipanj 2026.
**Platforme:** iOS Simulator, Android Emulator, FiziÄŤki Android ureÄ‘aj (za senzore)

---

## 1. Modul: Autentifikacija (Firebase Auth)

| ID Test | Scenarij | Koraci | OÄŤekivani rezultat | Stvarni rezultat | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **AUTH-01** | UspjeĹˇna registracija novog korisnika | 1. Otvori aplikaciju <br> 2. Odaberi "Registracija" <br> 3. Unesi ispravan email i lozinku (min 6 znakova) <br> 4. Klikni "Registriraj se" | Korisnik je registriran u Firebaseu i preusmjeren na Dashboard (`/(tabs)`). | Korisnik uspjeĹˇno preusmjeren. | âś… PASS |
| **AUTH-02** | NeuspjeĹˇna registracija (postojeÄ‡i email) | 1. PokuĹˇaj registracije s veÄ‡ postojeÄ‡im emailom. | Prikazuje se jasna poruka o greĹˇci (email already in use). Korisnik ostaje na ekranu. | Prikazuje se crvena poruka o greĹˇci ispod inputa. | âś… PASS |
| **AUTH-03** | NeuspjeĹˇna registracija (kratka lozinka) | 1. Unesi ispravan email i lozinku od 3 znaka. | Firebase odbija registraciju s porukom (weak password). | Prikazana odgovarajuÄ‡a poruka o slaboj lozinci. | âś… PASS |
| **AUTH-04** | UspjeĹˇna prijava | 1. Unesi ispravan email i lozinku. <br> 2. Klikni "Prijava". | Korisnik je prijavljen i preusmjeren na Dashboard. | Preusmjerenje radi ispravno. | âś… PASS |
| **AUTH-05** | PogreĹˇna lozinka pri prijavi | 1. Unesi ispravan email i krivu lozinku. | Prikazuje se poruka "PogreĹˇan email ili lozinka." (namjerno generiÄŤka zbog sigurnosti). | Prikazana generiÄŤka poruka. | âś… PASS |
| **AUTH-06** | Odjava korisnika (Logout) | 1. Odi na Profil tab. <br> 2. Klikni "Odjavi se". | Sesija se prekida, korisnik je preusmjeren na Login ekran. Back button ne vraÄ‡a u aplikaciju. | UspjeĹˇno odjavljen i preusmjeren. | âś… PASS |

---

## 2. Modul: Baza Podataka (Firestore CRUD)

| ID Test | Scenarij | Koraci | OÄŤekivani rezultat | Stvarni rezultat | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **DB-01** | Spremanje korisniÄŤkog profila | 1. Otvori Profil. <br> 2. Unesi podatke (dob, visina, teĹľina). <br> 3. Klikni Spremi. | Podaci su spremljeni u `users/{uid}`. Pokazuje se poruka uspjeha. | Podaci vidljivi u Firebase Console. | âś… PASS |
| **DB-02** | Dohvat postojeÄ‡eg profila | 1. Prijavi se s korisnikom koji ima popunjen profil. <br> 2. Otvori Profil tab. | Polja (ime, dob, itd.) su unaprijed popunjena podacima iz Firestore-a. | Podaci se uspjeĹˇno uÄŤitavaju pri mount-u. | âś… PASS |
| **DB-03** | Kreiranje novog trening splita | 1. Otvori Treninzi tab. <br> 2. Dodaj novi split (npr. "Push Day"). | Split se pojavljuje u listi treninga pomoÄ‡u optimistiÄŤkog updatea. ZabiljeĹľen u bazi. | Prikazano u UI-u i spremljeno. | âś… PASS |
| **DB-04** | Dodavanje vjeĹľbe u trening | 1. UÄ‘i u detalje splita. <br> 2. Dodaj vjeĹľbu iz biblioteke. | VjeĹľba je vezana uz taj specifiÄŤan split u podkolekciji ili nizu. | VjeĹľba uspjeĹˇno dodana. | âś… PASS |
| **DB-05** | Zapisivanje odraÄ‘enog treninga | 1. Pokreni sesiju. <br> 2. Unesi serije (teĹľina, ponavljanja). <br> 3. ZavrĹˇi trening. | Trening se sprema u povijest (kalendar). Statistika se aĹľurira. | Povijest vidljiva u Kalendar tabu. | âś… PASS |
| **DB-06** | Security Rules provjera (ÄŚitanje tuÄ‘ih podataka) | 1. Simulirani pokuĹˇaj direktnog ÄŤitanja `users/{tuÄ‘i_uid}` kroz kod. | Firebase vraÄ‡a "Missing or insufficient permissions". | Odbijeno od strane Firestore pravila. | âś… PASS |

---

## 3. Modul: Senzori i Hardware (Pedometar)

> **Napomena:** Testirano iskljuÄŤivo na fiziÄŤkim ureÄ‘ajima (Android & iPhone) jer simulatori nemaju stvarne senzore pokreta.

| ID Test | Scenarij | Koraci | OÄŤekivani rezultat | Stvarni rezultat | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **SENS-01** | TraĹľenje dozvole za pedometar | 1. Prvo pokretanje aplikacije (Koraci tab). | Aplikacija pita korisnika za dozvolu za praÄ‡enje fiziÄŤke aktivnosti (Activity Recognition / Health Connect). | Prikazan sistemski dialog za dozvolu. | âś… PASS |
| **SENS-02** | Odbijena dozvola | 1. Korisnik odbija dozvolu. | Aplikacija ne ruĹˇi. Prikazuje se UI poruka da je funkcija nedostupna bez dozvole uz gumb za ponovni pokuĹˇaj. | Aplikacija stabilna, UI reagira ispravno. | âś… PASS |
| **SENS-03** | Brojanje koraka (Live) | 1. Dozvola odobrena. <br> 2. Hodaj s ureÄ‘ajem. | Broj koraka na ekranu se poveÄ‡ava u realnom vremenu (iOS) ili se aĹľurira (Android). | Koraci se aĹľuriraju. | âś… PASS |
| **SENS-04** | Dohvat povijesnih koraka (Android) | 1. Pokreni na Androidu s Health Connectom. | Aplikacija uspjeĹˇno ÄŤita ukupne korake za taj dan iz Google Fita / Health Connecta (ÄŤak i kad je aplikacija bila ugaĹˇena). | DohvaÄ‡en toÄŤan broj koraka iz OS-a. | âś… PASS |
| **SENS-05** | Expo Go vs Dev Build provjera | 1. Pokreni aplikaciju u Expo Go na Androidu. | Aplikacija prepoznaje okolinu i izbacuje obavijest "Health Connect requires custom dev client". | Prikazana odgovarajuÄ‡a greĹˇka. | âś… PASS |

---

## 4. Modul: Supabase Storage i Media (Profilne slike)

| ID Test | Scenarij | Koraci | OÄŤekivani rezultat | Stvarni rezultat | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **STRG-01** | Dozvola za galeriju | 1. Klikni na promjenu profilne slike. | Aplikacija pita za pristup foto galeriji. | Sistemski prompt uspjeĹˇan. | âś… PASS |
| **STRG-02** | Odabir i crop slike | 1. Odaberi sliku. | Otvara se ugraÄ‘eni image editor (crop 1:1) omoguÄ‡en kroz `allowsEditing: true`. | Prikazan crop alat. | âś… PASS |
| **STRG-03** | Upload slike na Supabase | 1. Potvrdi crop. | Prikazuje se indikator uÄŤitavanja. Slika se Ĺˇalje na Supabase Storage, a vraÄ‡eni public URL se sprema u Firestore korisniÄŤki profil. | Slika uspjeĹˇno uploadana. | âś… PASS |
| **STRG-04** | Prikaz slike pri ponovnom pokretanju | 1. Ugasi i upali aplikaciju. <br> 2. Otvori Profil. | Profilna slika se uÄŤitava sa spremljenog Supabase public URL-a. | Slika prikazana (bez delay-a uz Expo Image cache). | âś… PASS |

---

## 5. Edge Case Scenariji (IviÄŤni sluÄŤajevi)

| ID Test | Scenarij | Akcija | Rezultat / RjeĹˇenje u kodu | Status |
| :--- | :--- | :--- | :--- | :---: |
| **EDGE-01** | Gubitak interneta tijekom spremanja | Gasi WiFi i unosi podatke u Profil pa "Spremi". | **PonaĹˇanje:** Firestore sprema u lokalnu predmemoriju. Kad se WiFi vrati, automatski sinkronizira u oblak bez greĹˇke. | âś… PASS |
| **EDGE-02** | Hot-Reload viĹˇestruka Firebase inicijalizacija | Promijeni kod u editoru dok aplikacija radi. | **PonaĹˇanje:** `getApps().length > 0` provjera u `firebase.ts` sprjeÄŤava ruĹˇenje aplikacije zbog "Firebase App named '[DEFAULT]' already exists" greĹˇke. | âś… PASS |
| **EDGE-03** | Brzi klikovi na "Prijava" (Double submit) | Klikni viĹˇe puta brzo na gumb Prijava. | **PonaĹˇanje:** Dodan lokalni state (`isLoading` ili sliÄŤno) koji onemoguÄ‡uje gumb dok se ÄŤeka odgovor servera, sprjeÄŤavajuÄ‡i duple zahtjeve. | âś… PASS |
| **EDGE-04** | Unos teksta umjesto brojeva u kalkulator | PokuĹˇaj unosa slova u input za teĹľinu ili dob na Profilu. | **PonaĹˇanje:** Input koristi `keyboardType="numeric"`, sprjeÄŤavajuÄ‡i unos teksta na mobilnoj tipkovnici. JS parsira ispravno. | âś… PASS |

---

## ZakljuÄŤak QA Testiranja

Svi core moduli sustava (Auth, Firestore CRUD, Supabase Storage, Pedometer API) su rigorozno testirani na simulatorima i fiziÄŤkim ureÄ‘ajima. Aplikacija se ponaĹˇa stabilno, upravljanje greĹˇkama (Error Handling) je implementirano za sve mreĹľne pozive, i sigurnosna pravila baze podataka Ĺˇtite korisniÄŤku privatnost.

**Potpis QA Testera:** *Frano VranjkoviÄ‡*
