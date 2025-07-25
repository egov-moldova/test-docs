## Servicii FOD în Blazor Client

Funcționarea corectă a componentelor **FOD** în aplicația `Client` depinde de implementările serviciilor utilizate de aceste componente. Pentru a asigura acest lucru, este necesară injectarea serviciilor prin adăugarea următorului rând de cod în fișierul `Program.cs` din proiectul `Client`:

```csharp
builder.Services.AddFodComponents();
```

Această metodă face parte din namespace-ul `Fod.Components`, motiv pentru care este necesară și adăugarea acestuia în fișierul `_Imports.razor`:

```razor
@using Fod.Components
```

Adăugarea namespace-ului în `_Imports.razor` permite utilizarea componentelor FOD în orice fișier `.razor` din proiect, fără a mai fi nevoie de importuri suplimentare.

