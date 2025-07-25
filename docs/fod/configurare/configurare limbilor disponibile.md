# Configurarea limbilor disponibile în proiectul FOD

## Introducere
Această documentație descrie modul în care se configurează limbile disponibile în proiect prin intermediul fișierului `appsettings.json`. Această configurație permite adăugarea și gestionarea limbilor în care portalul este disponibil pentru utilizatori.

## Configurarea în `appsettings.json`
Fișierul de configurare `appsettings.json` conține o secțiune dedicată pentru gestionarea limbilor disponibile. Structura generală este următoarea:

```json
"Fod": {
  "Application": {
    "Languages": [
      {
        "Iso2": "ro",
        "Name": "Română"
      },
      {
        "Iso2": "ru",
        "Name": "Русский"
      },
      {
        "Iso2": "en",
        "Name": "English"
      }
    ]
  }
}
```

## Explicație
Această configurație definește lista de limbi suportate de aplicație. Fiecare limbă este specificată printr-un obiect care conține următoarele proprietăți:

- **Iso2**: Codul ISO 639-1 al limbii. Acest cod este utilizat pentru a identifica limba în aplicație.
- **Name**: Numele afișat al limbii în interfața utilizatorului.

În exemplul de mai sus, aplicația suportă următoarele limbi:

- Română (`ro`)
- Русский (`ru`)
- English (`en`)

## Utilizare în cod

### Accesarea listei de limbi în C#
Pentru a citi lista de limbi din `appsettings.json`, se poate utiliza `IConfiguration` în ASP.NET Core:

```csharp
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

public class LanguageService
{
    private readonly List<Language> _languages;

    public LanguageService(IConfiguration configuration)
    {
        _languages = configuration.GetSection("Fod:Application:Languages").Get<List<Language>>();
    }

    public IEnumerable<Language> GetAvailableLanguages()
    {
        return _languages;
    }
}

public class Language
{
    public string Iso2 { get; set; }
    public string Name { get; set; }
}
```

### Integrarea cu interfața Blazor
Într-o aplicație Blazor, această listă de limbi poate fi utilizată pentru a permite utilizatorilor să selecteze limba preferată dintr-un meniu derulant:

```razor
@inject LanguageService LanguageService

<select @bind="selectedLanguage">
    @foreach (var lang in LanguageService.GetAvailableLanguages())
    {
        <option value="@lang.Iso2">@lang.Name</option>
    }
</select>

@code {
    private string selectedLanguage = "ro";
}
```

## Configurarea automată a culturii în aplicație

Atât aplicația client, cât și cea server, vor prelua automat configurația limbilor din `appsettings.json` și vor configura cultura aplicației în funcție de limba selectată de utilizator. Acest proces asigură traducerea corectă a interfeței și utilizarea formatelor locale corespunzătoare (ex. dată, oră, monedă etc.).

Dacă utilizatorul nu a selectat o limbă, atunci implicit se va seta limba Română (`ro`).

### Configurarea culturii pe server
Pentru a implementa această funcționalitate, serverul poate seta cultura folosind middleware-ul de localizare în ASP.NET Core:

```csharp
using Microsoft.AspNetCore.Localization;
using System.Globalization;

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    var supportedCultures = new List<CultureInfo>
    {
        new CultureInfo("ro"),
        new CultureInfo("ru"),
        new CultureInfo("en")
    };

    var localizationOptions = new RequestLocalizationOptions
    {
        DefaultRequestCulture = new RequestCulture("ro"),
        SupportedCultures = supportedCultures,
        SupportedUICultures = supportedCultures
    };

    app.UseRequestLocalization(localizationOptions);
}
```

### Configurarea culturii pe client Blazor

În aplicația client Blazor, cultura poate fi setată folosind `CultureInfo` și `JSInterop` pentru a sincroniza cultura cu navigatorul utilizatorului:

```razor
@inject IJSRuntime JSRuntime

@code {
    protected override async Task OnInitializedAsync()
    {
        var culture = await JSRuntime.InvokeAsync<string>("navigator.language");
        CultureInfo.DefaultThreadCurrentCulture = new CultureInfo(culture);
        CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo(culture);
    }
}
```

## Concluzie

Configurarea limbilor disponibile prin `appsettings.json` oferă o metodă flexibilă de gestionare a limbilor în aplicație. Atât clientul, cât și serverul vor prelua automat configurația și vor seta cultura aplicației în funcție de limba selectată, asigurând o experiență coerentă pentru utilizatori. În cazul în care utilizatorul nu a selectat o limbă, aplicația va utiliza implicit limba Română (`ro`).