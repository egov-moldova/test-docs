# ApplicationModelLoader

## Documentație pentru serviciul ApplicationModelLoader

### 1. Descriere Generală

`ApplicationModelLoader` este un serviciu client-side care încarcă modelul aplicației de la server. Acest model conține configurări esențiale pentru funcționarea aplicației, inclusiv setări de limbă, culturi disponibile, configurări de UI și alte metadate necesare pentru inițializarea corectă a aplicației.

Caracteristici principale:
- Încărcare asincronă a configurației aplicației
- Cache intern pentru evitarea apelurilor repetate
- Gestionare erori pentru probleme de rețea și JSON
- Interfață simplă cu o singură metodă
- Utilizat de componenta FodApplicationModelLoader

### 2. Configurare și Înregistrare

#### Înregistrare în Program.cs (Blazor WebAssembly)
```csharp
var builder = WebAssemblyHostBuilder.CreateDefault(args);

// Configurare HttpClient pentru aplicație
builder.Services.AddScoped(sp => new HttpClient 
{ 
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) 
});

// Înregistrare ApplicationModelLoader
builder.Services.AddScoped<IApplicationModelLoader, ApplicationModelLoader>();
```

#### Înregistrare în Blazor Server
```csharp
// În Startup.cs sau Program.cs
builder.Services.AddHttpClient<IApplicationModelLoader, ApplicationModelLoader>(client =>
{
    client.BaseAddress = new Uri("https://your-api-base-url/");
    client.Timeout = TimeSpan.FromSeconds(30);
});
```

### 3. Interfața IApplicationModelLoader

```csharp
namespace Fod.Components.Shared.Services.Application
{
    public interface IApplicationModelLoader
    {
        /// <summary>
        /// Încarcă modelul aplicației de la server
        /// </summary>
        /// <returns>ApplicationModel sau null în caz de eroare</returns>
        Task<ApplicationModel?> Load();
    }
}
```

### 4. Model ApplicationModel

```csharp
public class ApplicationModel
{
    // Setări de localizare
    public string DefaultCulture { get; set; }
    public List<CultureInfo> SupportedCultures { get; set; }
    public string DefaultLanguage { get; set; }
    public List<Language> AvailableLanguages { get; set; }
    
    // Configurări UI
    public ThemeConfiguration Theme { get; set; }
    public NavigationConfiguration Navigation { get; set; }
    
    // Setări aplicație
    public string ApplicationName { get; set; }
    public string ApplicationVersion { get; set; }
    public string Environment { get; set; }
    
    // Feature flags
    public Dictionary<string, bool> Features { get; set; }
    
    // Configurări API
    public ApiEndpoints Endpoints { get; set; }
    
    // Alte configurări
    public Dictionary<string, object> CustomSettings { get; set; }
}

public class Language
{
    public string Code { get; set; }
    public string Name { get; set; }
    public string NativeName { get; set; }
    public bool IsRTL { get; set; }
}
```

### 5. Utilizare de Bază

#### În componente Blazor
```razor
@inject IApplicationModelLoader AppModelLoader

@if (appModel == null)
{
    <FodLoadingCircular />
}
else
{
    <div>
        <h1>@appModel.ApplicationName</h1>
        <p>Versiune: @appModel.ApplicationVersion</p>
        
        <FodSelect T="string" @bind-Value="selectedLanguage" Label="Limbă">
            @foreach (var lang in appModel.AvailableLanguages)
            {
                <FodSelectItem Value="@lang.Code">@lang.NativeName</FodSelectItem>
            }
        </FodSelect>
    </div>
}

@code {
    private ApplicationModel appModel;
    private string selectedLanguage;
    
    protected override async Task OnInitializedAsync()
    {
        appModel = await AppModelLoader.Load();
        selectedLanguage = appModel?.DefaultLanguage ?? "ro";
    }
}
```

### 6. Exemple Avansate

#### Service extins cu evenimente
```csharp
public class ExtendedApplicationModelLoader : IApplicationModelLoader
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<ExtendedApplicationModelLoader> _logger;
    private ApplicationModel? _cachedModel;
    
    public event EventHandler<ApplicationModel>? ModelLoaded;
    public event EventHandler<Exception>? LoadError;
    
    public ExtendedApplicationModelLoader(
        HttpClient httpClient,
        ILogger<ExtendedApplicationModelLoader> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }
    
    public async Task<ApplicationModel?> Load()
    {
        if (_cachedModel != null)
            return _cachedModel;
            
        try
        {
            _logger.LogInformation("Loading application model...");
            
            _cachedModel = await _httpClient
                .GetFromJsonAsync<ApplicationModel>("api/application");
            
            if (_cachedModel != null)
            {
                _logger.LogInformation("Application model loaded successfully");
                ModelLoaded?.Invoke(this, _cachedModel);
            }
            
            return _cachedModel;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to load application model");
            LoadError?.Invoke(this, ex);
            return null;
        }
    }
    
    public void ClearCache()
    {
        _cachedModel = null;
    }
}
```

#### Wrapper cu retry logic
```csharp
public class ResilientApplicationModelLoader : IApplicationModelLoader
{
    private readonly IApplicationModelLoader _innerLoader;
    private readonly int _maxRetries;
    private readonly TimeSpan _retryDelay;
    
    public ResilientApplicationModelLoader(
        IApplicationModelLoader innerLoader,
        int maxRetries = 3,
        int retryDelaySeconds = 2)
    {
        _innerLoader = innerLoader;
        _maxRetries = maxRetries;
        _retryDelay = TimeSpan.FromSeconds(retryDelaySeconds);
    }
    
    public async Task<ApplicationModel?> Load()
    {
        Exception lastException = null;
        
        for (int i = 0; i < _maxRetries; i++)
        {
            try
            {
                var result = await _innerLoader.Load();
                if (result != null)
                    return result;
            }
            catch (Exception ex)
            {
                lastException = ex;
                
                if (i < _maxRetries - 1)
                {
                    await Task.Delay(_retryDelay);
                }
            }
        }
        
        if (lastException != null)
            throw new ApplicationException(
                $"Failed to load application model after {_maxRetries} attempts", 
                lastException);
                
        return null;
    }
}
```

### 7. Integrare cu FodApplicationModelLoader Component

```razor
<!-- Utilizare simplă -->
<FodApplicationModelLoader>
    <ChildContent>
        <!-- Conținutul aplicației după încărcarea modelului -->
        <Router AppAssembly="@typeof(App).Assembly">
            <Found Context="routeData">
                <RouteView RouteData="@routeData" DefaultLayout="@typeof(MainLayout)" />
            </Found>
            <NotFound>
                <PageNotFound />
            </NotFound>
        </Router>
    </ChildContent>
    <LoadingContent>
        <div class="app-loading">
            <FodLoadingCircular Size="FodSize.Large" />
            <p>Se încarcă aplicația...</p>
        </div>
    </LoadingContent>
    <ErrorContent>
        <FodAlert Severity="FodSeverity.Error">
            Nu s-a putut încărca configurația aplicației. 
            Vă rugăm reîncărcați pagina.
        </FodAlert>
    </ErrorContent>
</FodApplicationModelLoader>
```

### 8. Utilizare pentru Configurare Globală

```csharp
// AppState.cs
public class AppState
{
    private ApplicationModel _model;
    
    public ApplicationModel Model 
    { 
        get => _model;
        set
        {
            _model = value;
            NotifyStateChanged();
        }
    }
    
    public event Action OnChange;
    
    private void NotifyStateChanged() => OnChange?.Invoke();
}

// Program.cs
builder.Services.AddSingleton<AppState>();

// În App.razor
@inject IApplicationModelLoader ModelLoader
@inject AppState AppState

@code {
    protected override async Task OnInitializedAsync()
    {
        var model = await ModelLoader.Load();
        if (model != null)
        {
            AppState.Model = model;
            
            // Configurare globală bazată pe model
            await ConfigureApplication(model);
        }
    }
    
    private async Task ConfigureApplication(ApplicationModel model)
    {
        // Setare cultură implicită
        var culture = new CultureInfo(model.DefaultCulture);
        CultureInfo.DefaultThreadCurrentCulture = culture;
        CultureInfo.DefaultThreadCurrentUICulture = culture;
        
        // Aplicare temă
        await JSRuntime.InvokeVoidAsync("applyTheme", model.Theme);
        
        // Alte configurări...
    }
}
```

### 9. Gestionare Cache și Refresh

```csharp
public class CacheableApplicationModelLoader : IApplicationModelLoader
{
    private readonly HttpClient _httpClient;
    private readonly ILocalStorageService _localStorage;
    private readonly TimeSpan _cacheExpiration;
    private const string CacheKey = "app-model-cache";
    
    public async Task<ApplicationModel?> Load()
    {
        // Verifică cache local
        var cached = await _localStorage.GetItemAsync<CachedModel>(CacheKey);
        
        if (cached != null && cached.ExpiresAt > DateTime.UtcNow)
        {
            return cached.Model;
        }
        
        // Încarcă de la server
        var model = await LoadFromServer();
        
        if (model != null)
        {
            // Salvează în cache
            await _localStorage.SetItemAsync(CacheKey, new CachedModel
            {
                Model = model,
                ExpiresAt = DateTime.UtcNow.Add(_cacheExpiration)
            });
        }
        
        return model;
    }
    
    public async Task<ApplicationModel?> ForceRefresh()
    {
        await _localStorage.RemoveItemAsync(CacheKey);
        return await Load();
    }
    
    private class CachedModel
    {
        public ApplicationModel Model { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
```

### 10. Best Practices

1. **Cache Strategy**: Implementați cache pentru a evita apeluri repetate
2. **Error Handling**: Tratați toate tipurile de erori posibile
3. **Retry Logic**: Implementați retry pentru reziliență
4. **Logging**: Logați încărcările și erorile
5. **Timeout**: Setați timeout-uri rezonabile
6. **Fallback**: Aveți valori implicite pentru configurări critice

### 11. Troubleshooting

#### Modelul nu se încarcă
- Verificați URL-ul endpoint-ului
- Verificați că serverul returnează JSON valid
- Verificați permisiunile CORS
- Verificați logurile pentru erori

#### Cache nu funcționează
- Verificați că nu apelați Load() de mai multe ori simultan
- Folosiți un singleton pentru serviciu
- Implementați thread-safety pentru cache

### 12. Securitate

```csharp
public class SecureApplicationModelLoader : IApplicationModelLoader
{
    private readonly HttpClient _httpClient;
    private readonly ITokenService _tokenService;
    
    public async Task<ApplicationModel?> Load()
    {
        // Adaugă token de autentificare
        var token = await _tokenService.GetTokenAsync();
        _httpClient.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", token);
        
        var response = await _httpClient.GetAsync("api/application");
        
        if (response.StatusCode == HttpStatusCode.Unauthorized)
        {
            // Handle unauthorized
            await _tokenService.RefreshTokenAsync();
            // Retry...
        }
        
        // Continue with normal flow...
    }
}
```

### 13. Concluzie

`ApplicationModelLoader` este un serviciu esențial pentru inițializarea aplicațiilor Blazor cu configurații dinamice de la server. Prin implementarea de cache, gestionare erori și integrare strânsă cu componentele FOD, serviciul asigură o experiență de încărcare fluentă și configurare consistentă a aplicației.