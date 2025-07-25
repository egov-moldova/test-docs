# Configurarea contextelor implicite

## Configurarea contextelor în `appsettings.json`

În cadrul secțiunii `Fod.Services.DefaultContexts` din fișierul `appsettings.json`, există mai multe opțiuni care permit activarea sau dezactivarea generării anumitor contexte în aplicație. Aceste opțiuni oferă control asupra contextelor utilizate, în funcție de necesitățile specifice.

### Proprietăți disponibile:

- **IgnoreIndividualContext** (`boolean`)  
  Dacă este setat la `true`, contextul persoanelor fizice nu va fi generat. Acest lucru este util în cazul în care aplicația nu trebuie să gestioneze contexte pentru utilizatori individuali.

- **IgnoreOrganizationContexts** (`boolean`)  
  Dacă este setat la `true`, contextul persoanelor juridice va fi ignorat. Acest parametru este util dacă aplicația nu are nevoie de contexte pentru organizații.

- **IgnoreCupsContexts** (`boolean`)  
  Dacă este setat la `true`, contextul Operator CUPS nu va fi generat. Această setare trebuie utilizată dacă acest tip de context nu este necesar în fluxurile aplicației.

---

## Cerințe pentru generarea contextelor

### Atribute generale necesare în MPass

Pentru a permite generarea oricăruia dintre aceste contexte, este necesar ca în **MPass** să fie configurate următoarele atribute pentru utilizatorul autentificat:

- `Username` – de obicei, IDNP-ul persoanei autentificate.
- `FirstName` – prenumele utilizatorului.
- `LastName` – numele de familie al utilizatorului.

> Dacă aceste atribute nu sunt configurate corect, aplicația nu va putea genera niciun context.

---

### Generarea contextului persoanei juridice

Pentru a permite generarea contextului persoanei juridice, este necesar ca la configurarea serviciului în **MPass** să fie prezent atributul:

- `AdministeredLegalEntity`, cu formatul:  
  `Nume COMPANIE SRL 1234567890123`

Unde:

- `Nume COMPANIE SRL` – reprezintă denumirea organizației.
- `1234567890123` – reprezintă IDNO-ul organizației.

> Dacă acest atribut nu este prezent sau nu respectă formatul specificat, aplicația nu va putea genera contextul persoanei juridice.

---

### Generarea contextului Operator CUPS

Pentru a permite generarea contextului Operator CUPS, este necesar ca utilizatorul autentificat în **MPass** să aibă setat atributul:

- `Specialist CUPS`

> Dacă acest atribut nu este configurat, aplicația nu va putea genera acest context.

---

## Modificarea configurației în `appsettings.json`

Dacă un programator dorește să ajusteze comportamentul aplicației și să prevină generarea anumitor contexte, poate modifica valorile acestor opțiuni în `appsettings.json`.

### Exemplu de configurare:

```json
"Fod": {
  "Services": {
    "DefaultContexts": {
      "IgnoreIndividualContext": false,
      "IgnoreOrganizationContexts": false,
      "IgnoreCupsContexts": false
    }
  }
}
```
