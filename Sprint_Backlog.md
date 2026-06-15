# Sprint Backlog - GymTracker 

**Cilj 1. Sprinta:** Postavljanje projekta, integracija Firebase baze (Auth i Firestore) te izrada korisničkog sučelja za autentifikaciju, pedometar i napredno upravljanje treninzima.

| Naziv Zadatka | Opis | Odgovorni član | Rok |
| :--- | :--- | :--- | :--- |
| **1. Inicijalizacija projekta** | Kreiranje novog React Native (Expo) projekta, postavljanje strukture mapa i instalacija osnovnih paketa (Expo Router). | Kristijan | Petak |
| **2. Firebase konfiguracija** | Kreiranje novog Firebase projekta, omogućavanje Email/Password autentifikacije i dodavanje `firebaseConfig.ts` u projekt. | Kristijan | Petak |
| **3. Ekran za registraciju (UI)** | Izrada osnovnog sučelja za registraciju korisnika (polja za email, lozinku, potvrdu lozinke i gumb "Registriraj se"). | Kristijan | Petak |
| **4. Ekran za prijavu (UI)** | Izrada osnovnog sučelja za prijavu (polja za email i lozinku te gumb "Prijavi se"). | Kristijan | Petak |
| **5. Logika autentifikacije** | Implementacija `createUserWithEmailAndPassword` i `signInWithEmailAndPassword` metoda na izgrađenim ekranima. | Kristijan | Petak |
| **6. Upravljanje stanjem korisnika** | Dodavanje listenera (`onAuthStateChanged`) za provjeru je li korisnik prijavljen i usmjeravanje (routing) na početni ekran ili ekran za prijavu. | Kristijan | Petak |
| **7. Osnovni početni ekran (UI)** | Izrada jednostavnog početnog ekrana (Dashboard) s opcijom "Odjava" (Sign out) kako bi se zaokružio cijeli *flow* prijave i odjave. | Kristijan | Petak |
| **8. Refaktoriranje autentifikacije** | Uvođenje `AuthContext` komponente radi čišćeg koda i boljeg globalnog upravljanja prijavom. | Kristijan | Petak |
| **9. Prikaz treninga (Firestore)** | Izrada `WorkoutCard` komponente i integracija s Firestore bazom za dohvaćanje i prikaz liste treninga na glavnom ekranu. | Kristijan | Petak |
| **10. Unos novih treninga** | Implementacija `AddWorkoutModal` forme za dodavanje novih treninga i pohranu unosa direktno u Firestore. | Kristijan | Petak |
| **11. Ekran za praćenje koraka** | Implementacija pedometra (`expo-sensors`) s prikazom trenutnih koraka, potrošenih kalorija i grafa zadnjih 7 dana. | Kristijan | Petak |
| **12. Biblioteka vježbi** | Globalni katalog s kategoriziranim vježbama i modal za kreiranje *custom* vježbi povezanih na Firestore. | Kristijan | Petak |
| **13. Trening Splitovi** | Implementacija *custom* splitova (izrada, odabir boje, odabir i redoslijed vježbi iz biblioteke). | Kristijan | Petak |
| **14. Aktivna Trening Sesija** | Ekran za izvođenje treninga u realnom vremenu (praćenje serija, kilaža, ponavljanja, live timer i izračun volumena). | Kristijan | Petak |
| **15. Napredna Statistika** | Implementacija detaljnih ekrana za analizu podataka (razvoj snage po vježbama, distribucija volumena po mišićnim skupinama). | Ivan Luetić | Uskoro |
| **16. Kalendar treninga** | Kalendarski prikaz odrađenih treninga za lakše snalaženje po datumima i praćenje kontinuiteta. | Ivan Luetić | Uskoro |
| **17. QA Testiranje** | Osnovno testiranje završeno. Detaljno provjeravanje novih featurea se radi kontinuirano sa svakim novim PR-om na iOS i Android uređajima. | Frano Vranjković | Završeno / Kontinuirano |
