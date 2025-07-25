# Cerințe pentru utilizarea librăriilor FOD

Platforma FOD pune la dispoziție o colecție de librării dezvoltate pentru a facilita implementarea funcționalităților specifice proceselor de depunere și gestionare a solicitărilor. Aceste librării sunt distribuite sub formă de pachete NuGet și pot fi utilizate în orice tip de proiect compatibil cu .NET.

## Tipuri de librării

Librăriile sunt împărțite în două categorii:

- **Independente** – pot fi utilizate individual, fără a necesita alte componente ale ecosistemului FOD.
- **Dependente** – necesită integrarea cu una sau mai multe librării complementare pentru a funcționa corect.

Această modularitate permite dezvoltatorilor să adopte doar componentele de care au nevoie, fără a fi nevoiți să includă întreaga suită FOD.

## Compatibilitate cu proiecte .NET

Deși platforma .NET permite instalarea și utilizarea pachetelor în orice tip de proiect (inclusiv console, desktop, API, etc.), utilizarea recomandată este următoarea:

- **Proiecte Blazor WebAssembly**  
  Acesta este mediul recomandat pentru utilizarea librăriilor FOD, întrucât ele au fost proiectate și testate în principal în acest context. Integrarea este directă și presupune un efort minim de configurare.

- **Proiecte Blazor Server**  
  Deși nu este mediul implicit, este posibilă utilizarea librăriilor FOD și în aplicații Blazor Server. Totuși, acest lucru necesită **anumite adaptări și configurări suplimentare**, în special în ceea ce privește gestionarea stării și interacțiunile client-server.

> ⚠️ **Notă:** În cazul în care dorești să integrezi librăriile FOD într-un alt tip de aplicație decât Blazor WebAssembly, se recomandă consultarea documentației pentru fiecare pachet în parte, precum și exemplele de integrare disponibile.

## Cerințe minime

- **.NET 8 sau mai nou** – Majoritatea librăriilor FOD sunt compilate folosind .NET 8+.
- **Acces la feed-ul privat de NuGet** al Agenției pentru Guvernare Electronică (AGE), dacă pachetele nu sunt publice.
- **Configurarea corectă a serviciilor în `Program.cs`**, în special pentru injecția de dependențe, localizare, validare și serializare specifică.

## Recomandări generale

- Se recomandă inițializarea unui proiect folosind șabloanele disponibile în cadrul ecosistemului FOD (dacă există).
- Integrarea cu alte servicii guvernamentale precum **MPass**, **MSign**, sau **MNotify** poate necesita și alte configurări suplimentare (certificate, token-uri de acces etc.).
- Se recomandă consultarea periodică a documentației oficiale, deoarece librăriile pot suferi modificări semnificative între versiuni.

---

Pentru întrebări suplimentare sau exemple de integrare, contactează echipa tehnică FOD sau consultă documentația individuală a fiecărui pachet NuGet.
