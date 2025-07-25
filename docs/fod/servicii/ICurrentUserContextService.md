# ICurrentUserContextService

## Documentație pentru `ICurrentUserContextService`

### Descriere generală

`ICurrentUserContextService` este un serviciu definit printr-o interfață care gestionează contextul curent al utilizatorului într-o aplicație. Interfața este implementată atât pe partea de client, cât și pe partea de server, fiecare versiune având un comportament specific:

- **Client**: folosește `HttpClient` pentru a interacționa cu backend-ul REST.
- **Server**: folosește `HttpContext` și cookie-uri pentru a păstra contextul și `IUserContextService` pentru obținerea detaliilor.

Această separare permite utilizarea aceleiași interfețe atât în aplicații **Blazor WebAssembly**, cât și în **Blazor Server** sau **ASP.NET Core MVC**.

---

### Funcționalități principale

| Metodă                               | Return Type              | Descriere |
|-------------------------------------|---------------------------|-----------|
| `Task Set(string contextId, bool selected = false)` | `Task` | Salvează contextul utilizatorului. Pe client, face POST către server; pe server, scrie în cookie. |
| `Task<SelectedContext?> GetSelectedContext()` | `Task<SelectedContext?>` | Returnează contextul selectat. Pe client îl ia de la API, pe server din cookie sau generează fallback. |
| `Task<UserContext?> GetUserContext()` | `Task<UserContext?>` | Returnează contextul complet. Pe client îl ia de la endpoint dedicat, pe server prin `IUserContextService`. |
| `Task<UserContext?> GetIndividualUserContext()` | `Task<UserContext?>` | Pe server returnează contextul de tip individual; pe client poate fi neimplementată. |

---

### Implementare implicită

Este important de menționat că, atât pe partea de client, cât și pe partea de server, metoda `GetUserContext()` este utilizată pentru a verifica și obține contextul actual al utilizatorului autentificat.

- **Client**: interoghează endpoint-ul `/context/user-context` și returnează toate informațiile relevante despre contextul curent.
- **Server**: folosește `GetSelectedContext()` și `IUserContextService` pentru a returna modelul complet `UserContext`.

---

### Diferențe cheie între metode

- `GetSelectedContext()` returnează doar identificatorul (`ContextId`) și starea (`IsSelected`) a contextului selectat de utilizator.
- `GetUserContext()` returnează un model complet de tip `UserContext`, care conține toate atributele asociate utilizatorului în contextul respectiv (ex: nume, roluri, permisiuni etc.).

---

### Detalii implementare

#### Client (Blazor WebAssembly)

- Utilizare principală în UI.
- Se bazează pe apeluri HTTP:
  - `GET` pentru a obține contextul (`/context`, `/context/user-context`)
  - `POST` pentru a seta contextul curent.
- Cache intern (`_selectedContext`) pentru optimizarea performanțelor.

#### Server (ASP.NET Core)

- Se bazează pe cookie (`current-context`) pentru a reține contextul utilizatorului.
- Dacă nu există context valid, alege unul implicit din lista oferită de `IUserContextService`.
- Suportă și context de tip individual prin `GetIndividualUserContext()`.

---

### Exemplu de utilizare

`
@inject ICurrentUserContextService UserContextService

@code {
    private SelectedContext? context;

    protected override async Task OnInitializedAsync()
    {
        context = await UserContextService.GetSelectedContext();
    }
}
`