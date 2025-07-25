# FodApplicationModelLoader

## Documentație pentru componenta FodApplicationModelLoader

### 1. Descriere Generală

`FodApplicationModelLoader` este o componentă wrapper care încarcă modelul aplicației și setează cultura/localizarea înainte de a randa conținutul aplicației. Componenta asigură că toate datele necesare aplicației sunt disponibile și că localizarea este configurată corect.

Caracteristici principale:
- Încărcare asincronă a modelului aplicației
- Configurare automată a culturii/limbii
- Afișare loading în timpul încărcării
- Propagare model prin CascadingValue
- Verificare și fallback pentru localizare
- Suport pentru multiple limbi
- Integrare cu ICultureService

### 2. Utilizare de Bază

#### Încărcare simplă a aplicației
```razor
<FodApplicationModelLoader>
    <Router AppAssembly="@typeof(App).Assembly">
        <Found Context="routeData">
            <RouteView RouteData="@routeData" DefaultLayout="@typeof(MainLayout)" />
        </Found>
        <NotFound>
            <PageTitle>Not found</PageTitle>
            <LayoutView Layout="@typeof(MainLayout)">
                <p role="alert">Pagina nu a fost găsită.</p>
            </LayoutView>
        </NotFound>
    </Router>
</FodApplicationModelLoader>
```

#### Utilizare în App.razor
```razor
@* App.razor *@
<FodApplicationModelLoader>
    <CascadingAuthenticationState>
        <Router AppAssembly="@typeof(App).Assembly">
            <Found Context="routeData">
                <AuthorizeRouteView RouteData="@routeData" 
                                    DefaultLayout="@typeof(MainLayout)">
                    <NotAuthorized>
                        <RedirectToLogin />
                    </NotAuthorized>
                </AuthorizeRouteView>
            </Found>
            <NotFound>
                <LayoutView Layout="@typeof(MainLayout)">
                    <FodNotFound />
                </LayoutView>
            </NotFound>
        </Router>
    </CascadingAuthenticationState>
</FodApplicationModelLoader>
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `ChildContent` | `RenderFragment` | Conținutul aplicației de randat după încărcare | - |

### 4. Proprietăți Interne

| Proprietate | Tip | Descriere |
|-------------|-----|-----------|
| `ApplicationModel` | `ApplicationModel` | Modelul aplicației încărcat |
| `IsLoading` | `bool` | Indică dacă încărcarea este în progres |
| `LoadingText` | `string` | Textul afișat în timpul încărcării |

### 5. ApplicationModel

Modelul aplicației conține:
```csharp
public class ApplicationModel
{
    public string Name { get; set; }
    public string OrganizationLogo { get; set; }
    public List<LanguageModel> Languages { get; set; }
    public List<UserContext> UserContexts { get; set; }
}
```

### 6. Exemple Avansate

#### Configurare cu servicii personalizate
```razor
@* Program.cs *@
builder.Services.AddScoped<IApplicationModelLoader, CustomApplicationLoader>();
builder.Services.AddScoped<ICultureService, CultureService>();

@* CustomApplicationLoader.cs *@
public class CustomApplicationLoader : IApplicationModelLoader
{
    private readonly HttpClient _httpClient;
    
    public CustomApplicationLoader(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
    
    public async Task<ApplicationModel> Load()
    {
        // Încarcă configurația aplicației din API
        var config = await _httpClient.GetFromJsonAsync<ApplicationConfig>("/api/config");
        
        return new ApplicationModel
        {
            Name = config.ApplicationName,
            OrganizationLogo = config.LogoUrl,
            Languages = config.SupportedLanguages.Select(l => new LanguageModel
            {
                Iso2 = l.Code,
                Name = l.Name,
                IsDefault = l.IsDefault
            }).ToList(),
            UserContexts = await LoadUserContexts()
        };
    }
    
    private async Task<List<UserContext>> LoadUserContexts()
    {
        // Încarcă contextele utilizatorului
        return await _httpClient.GetFromJsonAsync<List<UserContext>>("/api/user/contexts");
    }
}
```

#### Accesare ApplicationModel în componente
```razor
@* În orice componentă copil *@

<h3>Aplicație: @AppModel?.Name</h3>

@if (AppModel?.OrganizationLogo != null)
{
    <img src="@AppModel.OrganizationLogo" alt="Logo organizație" />
}

<FodSelect @bind-Value="selectedLanguage" Label="Limbă">
    @foreach (var lang in AppModel?.Languages ?? new())
    {
        <FodSelectItem Value="@lang.Iso2">@lang.Name</FodSelectItem>
    }
</FodSelect>

@code {
    [CascadingParameter(Name = "ApplicationModel")]
    public ApplicationModel AppModel { get; set; }
    
    private string selectedLanguage = "ro";
    
    protected override void OnInitialized()
    {
        // Setează limba implicită
        selectedLanguage = AppModel?.Languages?
            .FirstOrDefault(l => l.IsDefault)?.Iso2 ?? "ro";
    }
}
```

#### Loader personalizat cu tratare erori
```razor
@* ExtendedApplicationLoader.razor *@
@inherits FodApplicationModelLoader

<FodApplicationModelLoader>
    @if (HasError)
    {
        <FodAlert Severity="FodSeverity.Error">
            <FodAlertTitle>Eroare la încărcarea aplicației</FodAlertTitle>
            @ErrorMessage
            <FodButton OnClick="RetryLoad" Class="mt-2">
                Reîncearcă
            </FodButton>
        </FodAlert>
    }
    else
    {
        @ChildContent
    }
</FodApplicationModelLoader>

@code {
    private bool HasError { get; set; }
    private string ErrorMessage { get; set; }
    
    protected override async Task OnInitializedAsync()
    {
        try
        {
            await base.OnInitializedAsync();
        }
        catch (Exception ex)
        {
            HasError = true;
            ErrorMessage = $"Nu s-a putut încărca configurația: {ex.Message}";
            StateHasChanged();
        }
    }
    
    private async Task RetryLoad()
    {
        HasError = false;
        await OnInitializedAsync();
    }
}
```

### 7. Flux de Încărcare

1. **Inițializare** - Componenta pornește cu `IsLoading = true`
2. **Afișare loading** - Se afișează `FodLoading` cu text localizat
3. **Încărcare model** - Se apelează `IApplicationModelLoader.Load()`
4. **Verificare localizare** - Se verifică și setează cultura
5. **Randare conținut** - Se randează `ChildContent` cu model disponibil

### 8. Verificare Localizare

Logica de verificare a localizării:
```csharp
private void VerifyLocalization(ApplicationModel model)
{
    // 1. Verifică dacă există limbi definite
    if (model?.Languages == null || !model.Languages.Any())
    {
        // Setează implicit română
        _cultureService.SetCulture(new CultureInfo("ro"));
        return;
    }
    
    // 2. Obține cultura curentă
    var currentCulture = CultureInfo.CurrentCulture;
    var currentParentCulture = currentCulture.Parent.TwoLetterISOLanguageName.ToLower();
    var currentTwoLetterIso = currentCulture.TwoLetterISOLanguageName.ToLower();
    
    // 3. Verifică dacă cultura curentă este suportată
    if (!model.Languages.Any(x => 
        x.Iso2.Equals(currentParentCulture, StringComparison.OrdinalIgnoreCase) ||
        x.Iso2.Equals(currentTwoLetterIso, StringComparison.OrdinalIgnoreCase)))
    {
        // 4. Setează prima limbă disponibilă sau română ca fallback
        var languageCode = model.Languages.FirstOrDefault()?.Iso2 ?? "ro";
        _cultureService.SetCulture(new CultureInfo(languageCode));
    }
}
```

### 9. Integrare cu Servicii

#### IApplicationModelLoader Interface
```csharp
public interface IApplicationModelLoader
{
    Task<ApplicationModel> Load();
}
```

#### Implementare Server-Side
```csharp
public class ServerApplicationModelLoader : IApplicationModelLoader
{
    private readonly IConfiguration _configuration;
    private readonly IDbContext _dbContext;
    
    public async Task<ApplicationModel> Load()
    {
        var model = new ApplicationModel
        {
            Name = _configuration["Application:Name"],
            OrganizationLogo = _configuration["Application:LogoUrl"]
        };
        
        // Încarcă limbi din baza de date
        model.Languages = await _dbContext.Languages
            .Where(l => l.IsActive)
            .Select(l => new LanguageModel
            {
                Iso2 = l.Code,
                Name = l.Name,
                IsDefault = l.IsDefault
            })
            .ToListAsync();
            
        return model;
    }
}
```

### 10. Best Practices

1. **Poziționare** - Plasați în App.razor ca wrapper principal
2. **Caching** - Cache-uiți ApplicationModel pentru performanță
3. **Error handling** - Implementați tratare erori robustă
4. **Fallback** - Asigurați valori implicite pentru toate setările
5. **Loading UX** - Oferiți feedback clar în timpul încărcării
6. **Culture persistence** - Salvați preferința de limbă a utilizatorului

### 11. Scenarii Comune

#### Multi-tenant cu configurare diferită
```csharp
public class TenantApplicationLoader : IApplicationModelLoader
{
    private readonly ITenantService _tenantService;
    
    public async Task<ApplicationModel> Load()
    {
        var tenant = await _tenantService.GetCurrentTenant();
        
        return new ApplicationModel
        {
            Name = tenant.ApplicationName,
            OrganizationLogo = tenant.LogoUrl,
            Languages = tenant.SupportedLanguages,
            UserContexts = await LoadTenantContexts(tenant.Id)
        };
    }
}
```

#### Loading cu progres detaliat
```razor
<FodApplicationModelLoader>
    <LoadingContent>
        <div class="loading-container">
            <FodLoadingCircular />
            <FodText>@LoadingStep</FodText>
            <FodLoadingLinear Value="@LoadingProgress" />
        </div>
    </LoadingContent>
    <ChildContent>
        @ChildContent
    </ChildContent>
</FodApplicationModelLoader>
```

### 12. Troubleshooting

#### Aplicația nu se încarcă
- Verificați serviciul IApplicationModelLoader
- Verificați conexiunea la API/bază de date
- Verificați logurile pentru erori

#### Cultura nu se setează corect
- Verificați lista de limbi în ApplicationModel
- Verificați implementarea ICultureService
- Verificați suportul pentru cultura în aplicație

#### Loading infinit
- Verificați că Load() returnează un rezultat
- Verificați că IsLoading se setează pe false
- Adăugați timeout pentru încărcare

### 13. Concluzie

`FodApplicationModelLoader` este componenta fundamentală pentru inițializarea aplicațiilor FOD, asigurând că toate configurările și datele necesare sunt disponibile înainte de randarea conținutului. Cu suport pentru localizare automată și propagare prin cascadă, componenta simplifică semnificativ procesul de bootstrap al aplicației.