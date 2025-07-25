# FodNavigate

## Documentație pentru componenta FodNavigate

### 1. Descriere Generală

`FodNavigate` este o componentă utilă pentru navigare automată la inițializare. Aceasta permite redirecționarea utilizatorului către o altă pagină imediat ce componenta este încărcată, fie printr-un URL static, fie printr-un URL generat dinamic.

Caracteristici principale:
- Navigare automată la inițializare
- Suport pentru URL static sau dinamic
- Navigare cu reîncărcare completă (forceLoad)
- Fără UI - componentă invizibilă
- Util pentru redirecționări condiționale
- Execuție asincronă pentru URL-uri dinamice

### 2. Utilizare de Bază

#### Navigare cu URL static
```razor
<FodNavigate Url="/dashboard" />
```

#### Navigare cu URL dinamic
```razor
<FodNavigate GetUrl="@GetRedirectUrl" />

@code {
    private async Task<string> GetRedirectUrl()
    {
        var userRole = await UserService.GetCurrentUserRole();
        return userRole switch
        {
            "Admin" => "/admin/dashboard",
            "User" => "/user/home",
            _ => "/login"
        };
    }
}
```

### 3. Parametri

| Parametru | Tip | Descriere | Obligatoriu |
|-----------|-----|-----------|-------------|
| `Url` | `string` | URL-ul static pentru navigare | Nu* |
| `GetUrl` | `Func<Task<string>>` | Funcție pentru generarea URL-ului dinamic | Nu* |

*Unul dintre `Url` sau `GetUrl` trebuie să fie specificat.

### 4. Prioritate Parametri

Dacă ambii parametri sunt specificați, `GetUrl` are prioritate asupra `Url`.

### 5. Exemple Avansate

#### Redirecționare după autentificare
```razor
@page "/auth/callback"

@if (isProcessing)
{
    <FodLoading IsLoading="true">
        <p>Se procesează autentificarea...</p>
    </FodLoading>
}
else if (isAuthenticated)
{
    <FodNavigate GetUrl="@DeterminePostLoginUrl" />
}
else
{
    <FodAlert Severity="FodSeverity.Error">
        Autentificare eșuată. Vă rugăm încercați din nou.
    </FodAlert>
}

@code {
    private bool isProcessing = true;
    private bool isAuthenticated = false;
    
    protected override async Task OnInitializedAsync()
    {
        // Procesare token de autentificare
        isAuthenticated = await AuthService.ProcessCallback();
        isProcessing = false;
    }
    
    private async Task<string> DeterminePostLoginUrl()
    {
        // Verifică dacă există URL de retur salvat
        var returnUrl = await SessionStorage.GetItemAsync<string>("returnUrl");
        if (!string.IsNullOrEmpty(returnUrl))
        {
            await SessionStorage.RemoveItemAsync("returnUrl");
            return returnUrl;
        }
        
        // Altfel, redirecționează bazat pe rol
        var user = await UserService.GetCurrentUser();
        return user.Role switch
        {
            "Administrator" => "/admin",
            "Operator" => "/operator/dashboard",
            _ => "/user/profile"
        };
    }
}
```

#### Redirecționare condiționată bazată pe permisiuni
```razor
@page "/admin"

<AuthorizeView>
    <Authorized>
        @if (context.User.IsInRole("Admin"))
        {
            <AdminDashboard />
        }
        else
        {
            <FodNavigate Url="/unauthorized" />
        }
    </Authorized>
    <NotAuthorized>
        <FodNavigate GetUrl="@(() => Task.FromResult($"/login?returnUrl={Uri.EscapeDataString(Navigation.Uri)}"))" />
    </NotAuthorized>
</AuthorizeView>

@code {
    [Inject] private NavigationManager Navigation { get; set; }
}
```

#### Wizard cu redirecționare finală
```razor
@page "/setup"

@if (currentStep < totalSteps)
{
    <FodWizard>
        <!-- Pași wizard -->
    </FodWizard>
}
else
{
    <FodNavigate GetUrl="@GetCompletionUrl" />
}

@code {
    private int currentStep = 1;
    private int totalSteps = 5;
    private SetupData setupData = new();
    
    private async Task<string> GetCompletionUrl()
    {
        // Salvează datele de configurare
        await ConfigService.SaveSetup(setupData);
        
        // Determină unde să navigheze
        if (setupData.IsFirstTimeSetup)
        {
            return "/welcome";
        }
        else
        {
            return "/dashboard";
        }
    }
}
```

### 6. Scenarii de Utilizare

#### Redirect după operațiune asincronă
```razor
@page "/process/{id}"

@if (isProcessing)
{
    <FodLoadingLinear />
    <FodText>Se procesează cererea @Id...</FodText>
}
else if (success)
{
    <FodNavigate Url="@($"/success/{Id}")" />
}
else
{
    <FodNavigate Url="/error" />
}

@code {
    [Parameter] public string Id { get; set; }
    
    private bool isProcessing = true;
    private bool success = false;
    
    protected override async Task OnInitializedAsync()
    {
        try
        {
            await ProcessService.Process(Id);
            success = true;
        }
        catch
        {
            success = false;
        }
        finally
        {
            isProcessing = false;
        }
    }
}
```

#### Redirecționare bazată pe starea aplicației
```razor
@if (appState.RequiresMaintenance)
{
    <FodNavigate Url="/maintenance" />
}
else if (!appState.IsConfigured)
{
    <FodNavigate Url="/setup" />
}
else if (appState.HasPendingUpdates)
{
    <FodNavigate GetUrl="@DetermineUpdateUrl" />
}
else
{
    <MainApplication />
}

@code {
    [Inject] private IAppStateService appState { get; set; }
    
    private async Task<string> DetermineUpdateUrl()
    {
        var updateType = await appState.GetPendingUpdateType();
        return updateType switch
        {
            UpdateType.Critical => "/update/critical",
            UpdateType.Feature => "/update/optional",
            _ => "/dashboard"
        };
    }
}
```

#### Guard pattern pentru rute protejate
```razor
@* RouteGuard.razor *@
@if (isChecking)
{
    <FodLoadingCircular />
}
else if (!hasAccess)
{
    <FodNavigate Url="@redirectUrl" />
}
else
{
    @ChildContent
}

@code {
    [Parameter] public RenderFragment ChildContent { get; set; }
    [Parameter] public string RequiredPermission { get; set; }
    [Parameter] public string RedirectUrl { get; set; } = "/unauthorized";
    
    private bool isChecking = true;
    private bool hasAccess = false;
    private string redirectUrl;
    
    protected override async Task OnInitializedAsync()
    {
        hasAccess = await PermissionService.HasPermission(RequiredPermission);
        
        if (!hasAccess)
        {
            // Include detalii în URL pentru mesaj specific
            redirectUrl = $"{RedirectUrl}?permission={RequiredPermission}";
        }
        
        isChecking = false;
    }
}
```

### 7. Integrare cu Servicii

#### Serviciu de navigare centralizat
```csharp
public interface INavigationService
{
    Task<string> GetHomeUrl();
    Task<string> GetPostLoginUrl(User user);
    Task<string> GetErrorUrl(Exception ex);
}

public class NavigationService : INavigationService
{
    private readonly IUserService _userService;
    private readonly IConfiguration _config;
    
    public async Task<string> GetHomeUrl()
    {
        var user = await _userService.GetCurrentUser();
        if (user == null) return "/login";
        
        return user.DefaultPage ?? "/dashboard";
    }
    
    public async Task<string> GetPostLoginUrl(User user)
    {
        // Verifică dacă are profil complet
        if (!user.IsProfileComplete)
            return "/profile/complete";
            
        // Verifică dacă acceptat termenii
        if (!user.HasAcceptedTerms)
            return "/terms";
            
        return await GetHomeUrl();
    }
    
    public Task<string> GetErrorUrl(Exception ex)
    {
        return Task.FromResult(ex switch
        {
            UnauthorizedException => "/unauthorized",
            NotFoundException => "/404",
            _ => "/error"
        });
    }
}
```

### 8. Pattern-uri Comune

#### Redirect chain
```razor
@page "/old-url"
<FodNavigate Url="/new-url" />

@page "/new-url"
@if (shouldRedirectAgain)
{
    <FodNavigate Url="/final-url" />
}
```

#### Conditional navigation wrapper
```razor
@* ConditionalNavigate.razor *@
@if (Condition)
{
    <FodNavigate Url="@NavigateToUrl" />
}
else
{
    @ChildContent
}

@code {
    [Parameter] public bool Condition { get; set; }
    [Parameter] public string NavigateToUrl { get; set; }
    [Parameter] public RenderFragment ChildContent { get; set; }
}
```

### 9. Best Practices

1. **Evitați loop-uri** - Asigurați-vă că nu creați bucle de redirecționare
2. **Loading states** - Afișați indicatori în timpul procesării
3. **Error handling** - Tratați erorile în funcțiile GetUrl
4. **URL encoding** - Codificați parametrii URL când e necesar
5. **Absolute paths** - Folosiți căi absolute pentru claritate

### 10. Performanță

- Navigarea cu `forceLoad: true` reîncarcă complet aplicația
- Pentru navigare SPA, considerați `NavigationManager.NavigateTo(url, false)`
- Evitați calcule grele în GetUrl

### 11. Debugging

Pentru debugging, loggați navigările:

```csharp
public class LoggingNavigationService : INavigationService
{
    private readonly ILogger<LoggingNavigationService> _logger;
    private readonly NavigationService _innerService;
    
    public async Task<string> GetHomeUrl()
    {
        var url = await _innerService.GetHomeUrl();
        _logger.LogInformation("Navigation to home: {Url}", url);
        return url;
    }
}
```

### 12. Limitări

1. **No render** - Componenta nu randează nimic
2. **Force load** - Întotdeauna folosește `forceLoad: true`
3. **Timing** - Navigarea se face în OnInitialized, nu OnAfterRender
4. **No cancellation** - Nu poate fi anulată odată inițiată

### 13. Alternative

Pentru mai mult control, folosiți direct:
```csharp
@inject NavigationManager Navigation

@code {
    private void Navigate()
    {
        Navigation.NavigateTo("/url", forceLoad: false);
    }
}
```

### 14. Exemple Complete

#### Pagină de redirect cu analytics
```razor
@page "/r/{code}"

<FodNavigate GetUrl="@TrackAndRedirect" />

@code {
    [Parameter] public string Code { get; set; }
    [Inject] private IAnalyticsService Analytics { get; set; }
    [Inject] private IRedirectService RedirectService { get; set; }
    
    private async Task<string> TrackAndRedirect()
    {
        // Track redirect
        await Analytics.TrackEvent("redirect", new 
        {
            code = Code,
            timestamp = DateTime.UtcNow
        });
        
        // Get destination URL
        var destination = await RedirectService.GetDestination(Code);
        
        return destination ?? "/404";
    }
}
```

### 15. Concluzie

`FodNavigate` oferă o soluție simplă și eficientă pentru navigare automată în aplicații Blazor. Prin suportul pentru URL-uri statice și dinamice, componenta facilitează implementarea pattern-urilor comune de redirecționare menținând codul curat și ușor de înțeles.