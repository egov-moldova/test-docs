# Condiții prealabile și cunoștințe necesare

Ținând cont de complexitatea prestării anumitor servicii și de multitudinea de detalii specifice fiecărui proces, platforma **FOD** nu trebuie percepută ca o soluție tehnică universală care răspunde la toate întrebările. Mai degrabă, FOD trebuie văzută ca un **instrument de sprijin**, menit să accelereze digitalizarea acolo unde aceasta nu este posibilă din motive precum:

- Lipsa de personal tehnic;
- Lipsa resurselor financiare;
- Lipsa unui cadru digital coerent.

Unul dintre obiectivele principale ale platformei este crearea unui **ecosistem unitar** în prestarea serviciilor publice, atât pentru **solicitanți**, cât și pentru **prestatori**. Aceasta implică existența unor **fluxuri de lucru predefinite, restricții și reguli** ce trebuie respectate de către dezvoltatorii de servicii.

## Cunoștințe necesare

Dezvoltarea unui serviciu FOD nu presupune doar abilități tehnice, ci și o înțelegere a proceselor de business și a contextului instituțional. De asemenea, integrarea cu alte servicii guvernamentale implică o minimă familiarizare cu infrastructura guvernamentală de dezvoltare și publicare.

### Cunoștințe și experiență recomandată:

- **Tehnologii .NET**
  - C#, ASP.NET, Razor Pages, Blazor;
- **Containerizare și orchestrare**
  - Docker;
  - Kubernetes;
  - Helm Charts;
- **Frontend**
  - Angular (experiența cu Angular poate ajuta la înțelegerea mai rapidă a Blazor, o tehnologie încă emergentă).

> ⚠️ Nu este necesar ca toți membrii echipei să cunoască toate tehnologiile, însă este esențial ca fiecare membru să aibă expertiză într-un domeniu tehnic relevant.

## Cerințe tehnice minime

Pentru a putea dezvolta un serviciu utilizând componentele și librăriile FOD, sunt necesare următoarele:

- **Sistem de operare**:  
  - Windows sau Linux.  
  - ⚠️ Pe macOS pot apărea probleme legate de criptografie, motiv pentru care nu se recomandă utilizarea acestui OS în dezvoltarea serviciilor FOD.
  
- **Platformă de dezvoltare**:  
  - Ultima versiune stabilă .NET (ex. .NET 8.0 la momentul scrierii acestui ghid).

- **Editor de cod**:
  - VS Code, Rider, Visual Studio – orice editor familiar echipei de dezvoltare.

- **Interfață grafică pentru Kubernetes** (opțional, dar recomandat):
  - [Lens Kubernetes IDE](https://k8slens.dev/)
  - [Rancher UI](https://rancher.com/) (dacă există acces).

## Flexibilitate și adaptabilitate

Utilizarea librăriilor FOD **nu limitează** dezvoltatorul în utilizarea propriilor instrumente și tehnologii familiare. De asemenea:

- Componentele pot fi **rescrise parțial sau complet** în funcție de necesitățile proiectului;
- Este permisă adăugarea de **logică suplimentară** specifică;
- Platforma este **deschisă extinderii** și adaptării, în limitele arhitecturii propuse.

> 🛠️ FOD oferă o fundație solidă pentru digitalizarea serviciilor, însă succesul implementării depinde în mare măsură de înțelegerea proceselor, colaborarea cu instituțiile publice și adaptarea flexibilă la cerințele concrete ale fiecărui serviciu.

---

Pentru mai multe detalii privind integrarea sau dezvoltarea serviciilor, se recomandă consultarea documentației tehnice detaliate și comunicarea directă cu echipa tehnică FOD.
