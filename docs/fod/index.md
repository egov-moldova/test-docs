# FOD - FrontOffice Digitization

## Prezentare Generală

FOD (FrontOffice Digitization) reprezintă o bibliotecă comprehensivă de componente Blazor dezvoltată special pentru serviciile digitale guvernamentale din Republica Moldova. Această platformă oferă o colecție standardizată de componente UI reutilizabile, asigurând consistență vizuală și funcțională în toate aplicațiile guvernamentale digitale.

## Obiectiv Principal

FOD urmărește să accelereze dezvoltarea serviciilor publice digitale prin:
- Standardizarea interfețelor utilizator pentru toate platformele guvernamentale
- Reducerea timpului de dezvoltare prin componente pre-construite
- Asigurarea conformității cu standardele de accesibilitate
- Integrarea nativă cu serviciile guvernamentale existente (MPass, MPay, MDelivery)

## Arhitectură și Componente

### Structura Proiectului

Biblioteca FOD este organizată modular:

- **FOD.Components** - Nucleul bibliotecii cu toate componentele Blazor
- **Fod.Integrations** - Module de integrare pentru servicii guvernamentale:
  - **MPass** - Autentificare unificată
  - **MPay** - Plăți electronice guvernamentale
  - **MDelivery** - Livrare electronică a documentelor
  - **MNotify** - Sistem de notificări
  - **MLog** - Jurnal electronic unificat
- **FOD.EntityFramework** - Suport pentru accesul la date

### Categorii de Componente

#### 1. Elemente de Formular (`Inputs/`)
- **FodInput** - Câmpuri de text cu validare integrată
- **FodSelect** - Liste derulante cu suport
- **FodDatePicker** - Selector de dată cu localizare
- **FodCheckbox** - Casete de bifare accesibile
- **FodRadio** - Butoane radio grupate
- **FodTextArea** - Zone de text expandabile
- **FodFileUpload** - Încărcare fișiere cu validare

#### 2. Layout și Structură (`Layout/`)
- **FodContainer** - Container responsive pentru conținut
- **FodGrid** - Sistem grid flexibil cu 12 coloane
- **FodHeader** - Antet standardizat pentru aplicații
- **FodFooter** - Subsol cu informații instituționale
- **FodSidebar** - Bară laterală pentru navigare

#### 3. Navigare (`Navigation/`)
- **FodMenu** - Meniu principal cu subnivele
- **FodDrawer** - Panou lateral glisant
- **FodTabs** - Navigare prin tab-uri
- **FodBreadcrumb** - Indicare poziție în ierarhie
- **FodPagination** - Navigare prin pagini

#### 4. Afișare Date (`DataDisplay/`)
- **FodDataTable** - Tabel avansat cu sortare și filtrare
- **FodBadge** - Etichete pentru status
- **FodChip** - Elemente informative compacte
- **FodCard** - Carduri pentru grupare conținut
- **FodList** - Liste structurate de informații

#### 5. Feedback (`Feedback/`)
- **FodAlert** - Mesaje de alertă contextualizate
- **FodNotification** - Notificări non-intruzive
- **FodProgress** - Bare de progres
- **FodSkeleton** - Placeholder-e pentru încărcare
- **FodTooltip** - Indicii contextuale

## Caracteristici Tehnice

### Stilizare și Tematizare
- Arhitectură SCSS modulară în `wwwroot/scss/`
- Variabile CSS pentru personalizare rapidă
- Suport pentru teme light/dark
- Design responsive pentru toate dispozitivele

### Interoperabilitate JavaScript
- Bibliotecă JavaScript minimizată (`FodComponents.min.js`)
- Funcționalități avansate pentru tooltips, popovers, drawer-e
- API JavaScript pentru integrări custom

### Localizare Completă
FOD suportă trei limbi oficial:
- **Română** - Limba principală
- **Rusă** - Pentru minoritatea vorbitoare de rusă
- **Engleză** - Pentru contexte internaționale

Toate componentele și mesajele sunt traduse automat bazat pe cultura curentă.

### Performanță și Optimizare
- Componente lazy-loaded pentru încărcare rapidă
- Bundle-uri optimizate pentru producție
- Caching inteligent pentru resurse statice

## Integrări Guvernamentale

### MPass - Autentificare Unificată
Integrare completă cu sistemul național de autentificare:

### MPay - Plăți Electronice
Procesare securizată a plăților guvernamentale

### MDelivery - Livrare Electronică
Distribuție digitală a documentelor oficiale:

## Distribuție

### NuGet Package
FOD este disponibil ca pachet NuGet la solicitare:
```xml
<PackageReference Include="FOD.Components" Version="8.2.156" />
```

### CI/CD Pipeline
- Build automat pe fiecare commit
- Publicare automată pe Azure DevOps Artifacts

## Documentație și Resurse

### Site Documentație
Documentația completă cu exemple interactive este disponibilă la:
👉 [https://egov-moldova.github.io/fod/site/](https://egov-moldova.github.io/fod/site/)

### Structura Documentației
Fiecare componentă include:
- Descriere detaliată a funcționalității
- Exemple de cod interactive
- API reference complet
- Ghid de stil și best practices
- Cazuri de utilizare comune


## Suport și Comunitate

### Canale de Suport
- **Email** - support@egov.md pentru asistență oficială

### Versiuni Suportate
- **v8.x** - Versiune curentă cu suport activ

## Roadmap

### Planificat pentru v10.0
- Migrare la .NET 10
- Îmbunătățiri performanță WebAssembly

### Viziune pe Termen Lung
- Generator automat de aplicații CRUD
- Integrare cu toate serviciile AGE

## Licență

FOD este licențiat sub MIT License, permițând utilizare liberă în proiecte guvernamentale și comerciale.

---

**FOD - Construind viitorul digital al Moldovei, o componentă la un moment dat.**