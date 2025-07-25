# CultureService

## Descriere Generală

`CultureService` este serviciul responsabil pentru gestionarea schimbării culturii/limbii în aplicații Blazor. Serviciul permite setarea culturii atât pe partea de client (prin localStorage), cât și pe partea de server (prin cookie), asigurând o experiență consistentă de localizare în întreaga aplicație.

## Configurare

### Înregistrare în Dependency Injection

```csharp
// Client-side (Blazor WebAssembly sau Component)
builder.Services.AddScoped<ICultureService, CultureService>();

// Server-side (ASP.NET Core)
builder.Services.AddScoped<FOD.Components.Server.Services.ICultureService, FOD.Components.Server.Services.CultureService>();
builder.Services.AddHttpContextAccessor();
```

### Configurare Localizare ASP.NET Core

```csharp
// În Program.cs
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] { "ro", "ru", "en" };
    options.SetDefaultCulture("ro")
        .AddSupportedCultures(supportedCultures)
        .AddSupportedUICultures(supportedCultures);
});

app.UseRequestLocalization();
```

### Script JavaScript necesar

```javascript
// Inclus automat în FodComponents.js
window.blazorCulture = {
    get: () => window.localStorage["BlazorCulture"],
    set: (value) => (window.localStorage["BlazorCulture"] = value),
};
```

### Endpoint server-side

```csharp
// În ServicesSetup.cs
endpoints.MapGet("api/fod/culture={cultureEscaped}&redirectUri={uriEscaped}", 
    async (string cultureEscaped, string uriEscaped, 
    [FromServices] ICultureService cultureService) =>
{
    cultureService.SetCultureCookie(cultureEscaped);
    uriEscaped = uriEscaped.Replace("%2F", "/");
    return Results.Redirect(uriEscaped, permanent: false);
});
```

## Interfețe

### Client-side ICultureService

```csharp
namespace FOD.Components.Services.Culture
{
    public interface ICultureService
    {
        void SetCulture(CultureInfo newCulture);
    }
}
```

### Server-side ICultureService

```csharp
namespace FOD.Components.Server.Services
{
    public interface ICultureService
    {
        void SetCultureCookie(string culture);
    }
}
```

## Metode disponibile

### Client-side: SetCulture

Setează noua cultură pentru aplicație.

**Parametri:**
- `newCulture: CultureInfo` - Cultura de setat

**Comportament:**
1. Verifică dacă cultura nouă diferă de cea curentă
2. Setează cultura în localStorage prin JavaScript
3. Navighează la endpoint-ul server pentru setarea cookie-ului
4. Reîncarcă pagina pentru aplicarea schimbărilor

### Server-side: SetCultureCookie

Setează cookie-ul de cultură pentru cereri viitoare.

**Parametri:**
- `culture: string` - Codul culturii (ex: "ro", "en", "ru")

**Comportament:**
- Setează cookie-ul standard ASP.NET Core pentru localizare
- Cookie-ul va fi folosit de middleware-ul de localizare

## Exemple de utilizare

### Selector de limbă simplu

```razor
@inject ICultureService CultureService
@inject IStringLocalizer<Shared> Localizer

<div class="language-selector">
    <FodSelect Value="@currentCulture" 
               ValueChanged="@OnCultureChanged"
               Label="@Localizer["Language"]">
        <FodSelectItem Value="ro">Română</FodSelectItem>
        <FodSelectItem Value="en">English</FodSelectItem>
        <FodSelectItem Value="ru">Русский</FodSelectItem>
    </FodSelect>
</div>

@code {
    private string currentCulture = CultureInfo.CurrentCulture.Name;
    
    private void OnCultureChanged(string newCulture)
    {
        var cultureInfo = new CultureInfo(newCulture);
        CultureService.SetCulture(cultureInfo);
    }
}
```

### Component LanguageSelector dedicat

```razor
@inject ICultureService CultureService
@inject NavigationManager Navigation

<div class="language-buttons">
    @foreach (var lang in availableLanguages)
    {
        <FodButton Variant="@(IsCurrentLanguage(lang.Code) ? FodVariant.Filled : FodVariant.Outlined)"
                   Size="FodSize.Small"
                   @onclick="() => ChangeLanguage(lang.Code)">
            <img src="@lang.FlagUrl" alt="@lang.Name" class="flag-icon" />
            @lang.Name
        </FodButton>
    }
</div>

@code {
    private class Language
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string FlagUrl { get; set; }
    }
    
    private List<Language> availableLanguages = new()
    {
        new() { Code = "ro", Name = "RO", FlagUrl = "/images/flags/ro.svg" },
        new() { Code = "en", Name = "EN", FlagUrl = "/images/flags/en.svg" },
        new() { Code = "ru", Name = "RU", FlagUrl = "/images/flags/ru.svg" }
    };
    
    private bool IsCurrentLanguage(string code)
    {
        return CultureInfo.CurrentCulture.TwoLetterISOLanguageName == code;
    }
    
    private void ChangeLanguage(string languageCode)
    {
        if (!IsCurrentLanguage(languageCode))
        {
            var newCulture = new CultureInfo(languageCode);
            CultureService.SetCulture(newCulture);
        }
    }
}
```

### Meniu dropdown pentru limbă

```razor
@inject ICultureService CultureService

<FodMenu>
    <ActivatorContent>
        <FodIconButton Icon="translate" />
    </ActivatorContent>
    <ChildContent>
        <FodMenuItem @onclick='() => SetLanguage("ro")'>
            <FodIcon Icon="flag" /> Română
        </FodMenuItem>
        <FodMenuItem @onclick='() => SetLanguage("en")'>
            <FodIcon Icon="flag" /> English
        </FodMenuItem>
        <FodMenuItem @onclick='() => SetLanguage("ru")'>
            <FodIcon Icon="flag" /> Русский
        </FodMenuItem>
    </ChildContent>
</FodMenu>

@code {
    private void SetLanguage(string culture)
    {
        CultureService.SetCulture(new CultureInfo(culture));
    }
}
```

### Service extins cu evenimente

```csharp
public interface IExtendedCultureService : ICultureService
{
    event EventHandler<CultureChangedEventArgs> CultureChanged;
    CultureInfo CurrentCulture { get; }
    IEnumerable<CultureInfo> SupportedCultures { get; }
}

public class ExtendedCultureService : IExtendedCultureService
{
    private readonly ICultureService _innerService;
    public event EventHandler<CultureChangedEventArgs> CultureChanged;
    
    public CultureInfo CurrentCulture => CultureInfo.CurrentCulture;
    
    public IEnumerable<CultureInfo> SupportedCultures { get; } = new[]
    {
        new CultureInfo("ro"),
        new CultureInfo("en"),
        new CultureInfo("ru")
    };
    
    public void SetCulture(CultureInfo newCulture)
    {
        var oldCulture = CurrentCulture;
        _innerService.SetCulture(newCulture);
        
        CultureChanged?.Invoke(this, new CultureChangedEventArgs
        {
            OldCulture = oldCulture,
            NewCulture = newCulture
        });
    }
}
```

### Persistență preferință utilizator

```razor
@inject ICultureService CultureService
@inject ILocalStorageService LocalStorage
@implements IAsyncDisposable

@code {
    protected override async Task OnInitializedAsync()
    {
        // Restaurare preferință salvată
        var savedCulture = await LocalStorage.GetItemAsync<string>("UserPreferredCulture");
        if (!string.IsNullOrEmpty(savedCulture))
        {
            var culture = new CultureInfo(savedCulture);
            if (culture.Name != CultureInfo.CurrentCulture.Name)
            {
                CultureService.SetCulture(culture);
            }
        }
    }
    
    private async Task SaveCulturePreference(string culture)
    {
        await LocalStorage.SetItemAsync("UserPreferredCulture", culture);
        CultureService.SetCulture(new CultureInfo(culture));
    }
    
    public async ValueTask DisposeAsync()
    {
        // Cleanup if needed
    }
}
```

## Integrare cu componente FOD

### Cu FodHeader

```razor
<FodHeader>
    <ToolbarContent>
        <FodSpacer />
        <LanguageSelector />
        <FodIconButton Icon="account_circle" />
    </ToolbarContent>
</FodHeader>
```

### Cu formulare multilingve

```razor
@inject IStringLocalizer<MyForm> Localizer
@inject ICultureService CultureService

<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <FodInput @bind-Value="model.Name" 
              Label="@Localizer["NameLabel"]" 
              HelperText="@Localizer["NameHelper"]" />
    
    <FodSelect @bind-Value="model.Country" 
               Label="@Localizer["CountryLabel"]">
        @foreach (var country in GetLocalizedCountries())
        {
            <FodSelectItem Value="@country.Code">
                @country.Name
            </FodSelectItem>
        }
    </FodSelect>
</EditForm>
```

## Tratare erori

### Service cu logging

```csharp
public class LoggingCultureService : ICultureService
{
    private readonly ICultureService _innerService;
    private readonly ILogger<LoggingCultureService> _logger;
    
    public void SetCulture(CultureInfo newCulture)
    {
        _logger.LogInformation("Changing culture from {OldCulture} to {NewCulture}", 
            CultureInfo.CurrentCulture.Name, newCulture.Name);
            
        try
        {
            _innerService.SetCulture(newCulture);
            _logger.LogInformation("Culture changed successfully to {Culture}", 
                newCulture.Name);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to change culture to {Culture}", 
                newCulture.Name);
            throw;
        }
    }
}
```

## Note tehnice

1. **Page reload** - Schimbarea culturii necesită reîncărcarea paginii
2. **Cookie persistence** - Cookie-ul de cultură persistă între sesiuni
3. **LocalStorage sync** - Cultura client-side este salvată în localStorage
4. **Thread safety** - Cultura este thread-safe în ASP.NET Core
5. **Blazor limitation** - În Blazor WebAssembly, cultura trebuie setată la startup

## Bune practici

1. **Default culture** - Setați întotdeauna o cultură implicită
2. **Supported cultures** - Definiți explicit culturile suportate
3. **Resource files** - Organizați fișierele de resurse pe culturi
4. **Date formats** - Testați formatarea datelor în toate culturile
5. **URL preservation** - Păstrați URL-ul curent la schimbarea limbii
6. **User preference** - Salvați preferința utilizatorului
7. **Graceful fallback** - Gestionați culturi nesuportate

## Concluzie

CultureService oferă o soluție completă pentru gestionarea multilingvismului în aplicații Blazor, integrând atât aspecte client-side cât și server-side. Cu suport pentru persistență și navigare fluidă, serviciul facilitează crearea de aplicații cu adevărat internaționale.