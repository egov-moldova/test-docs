# UserService

## Descriere Generală

`UserService` este serviciul responsabil pentru obținerea și gestionarea informațiilor despre utilizatorul curent sub formă de `ClaimsPrincipal`. Serviciul integrează informațiile din contextul utilizatorului curent și le transformă în claims standard .NET pentru utilizare în autorizare și autentificare.

## Configurare

### Înregistrare în Dependency Injection

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddScoped<IUserService, UserService>();

// Asigurați-vă că dependențele sunt înregistrate
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IContextService, ContextService>();
```

### Configurare completă

```csharp
// Înregistrare servicii necesare
builder.Services.AddHttpClient<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IContextService, ContextService>();
builder.Services.AddScoped<IUserService, UserService>();

// Pentru AuthenticationStateProvider
builder.Services.AddScoped<AuthenticationStateProvider, CustomAuthenticationStateProvider>();
```

## Interfața IUserService

```csharp
public interface IUserService
{
    Task<ClaimsPrincipal> Get();
}
```

## Metode disponibile

### Get()

Obține utilizatorul curent ca `ClaimsPrincipal`.

**Parametri:** Niciun parametru

**Returnează:** `Task<ClaimsPrincipal>` - Principalul cu claims-urile utilizatorului

**Comportament:**
- Implementează caching - păstrează rezultatul după prima apelare
- Obține contextul curent prin `IContextService`
- Transformă atributele contextului în claims
- Adaugă claims speciale pentru Role și Username
- Returnează `ClaimsPrincipal` gol dacă nu există context

## Exemple de utilizare

### Obținere utilizator curent

```razor
@inject IUserService UserService

<AuthorizeView>
    <Authorized>
        <p>Bun venit, @username!</p>
        <p>Rolul tău: @role</p>
    </Authorized>
    <NotAuthorized>
        <p>Nu ești autentificat.</p>
    </NotAuthorized>
</AuthorizeView>

@code {
    private string username = "";
    private string role = "";

    protected override async Task OnInitializedAsync()
    {
        var user = await UserService.Get();
        if (user.Identity.IsAuthenticated)
        {
            username = user.Identity.Name;
            role = user.FindFirst("Role")?.Value ?? "Fără rol";
        }
    }
}
```

### Verificare claims specifice

```csharp
@inject IUserService UserService

@code {
    private bool hasAdminRole = false;
    private string userIdno = "";

    protected override async Task OnInitializedAsync()
    {
        var user = await UserService.Get();
        
        // Verifică rol admin
        hasAdminRole = user.IsInRole("Administrator");
        
        // Obține IDNO
        userIdno = user.FindFirst("IDNO")?.Value ?? "";
        
        // Verifică permisiuni specifice
        var canEditDocuments = user.HasClaim("Permission", "Documents.Edit");
    }
}
```

### Custom AuthenticationStateProvider

```csharp
public class CustomAuthenticationStateProvider : AuthenticationStateProvider
{
    private readonly IUserService _userService;

    public CustomAuthenticationStateProvider(IUserService userService)
    {
        _userService = userService;
    }

    public override async Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        var user = await _userService.Get();
        return new AuthenticationState(user);
    }

    public void NotifyUserAuthentication(string userName)
    {
        var authenticatedUser = new ClaimsPrincipal(
            new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, userName)
            }, "apiauth"));

        var authState = Task.FromResult(new AuthenticationState(authenticatedUser));
        NotifyAuthenticationStateChanged(authState);
    }

    public void NotifyUserLogout()
    {
        var anonymousUser = new ClaimsPrincipal(new ClaimsIdentity());
        var authState = Task.FromResult(new AuthenticationState(anonymousUser));
        NotifyAuthenticationStateChanged(authState);
    }
}
```

## Integrare cu alte servicii

### Cu componente de autorizare

```razor
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
    </Router>
</CascadingAuthenticationState>
```

### Service de autorizare custom

```csharp
public class AuthorizationService
{
    private readonly IUserService _userService;

    public AuthorizationService(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<bool> CanAccessService(string serviceCode)
    {
        var user = await _userService.Get();
        if (!user.Identity.IsAuthenticated)
            return false;

        // Verifică dacă are permisiune specifică
        return user.HasClaim("ServiceAccess", serviceCode) ||
               user.IsInRole("Administrator");
    }

    public async Task<bool> CanEditEntity(string entityType, string entityId)
    {
        var user = await _userService.Get();
        
        // Verifică owner
        var isOwner = user.HasClaim("OwnedEntity", $"{entityType}:{entityId}");
        
        // Sau are permisiune generală
        var hasPermission = user.HasClaim("Permission", $"{entityType}.Edit");
        
        return isOwner || hasPermission;
    }
}
```

## Tratare erori

### Wrapper cu gestionare erori

```csharp
public class SafeUserService : IUserService
{
    private readonly UserService _innerService;
    private readonly ILogger<SafeUserService> _logger;

    public async Task<ClaimsPrincipal> Get()
    {
        try
        {
            return await _innerService.Get();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Eroare la obținerea utilizatorului curent");
            // Returnează utilizator anonim
            return new ClaimsPrincipal(new ClaimsIdentity());
        }
    }
}
```

## Claims disponibile

Claims-urile disponibile depind de atributele din contextul utilizatorului:

| Claim | Sursă | Descriere |
|-------|-------|-----------|
| Username | context.UserId | ID-ul utilizatorului |
| Role | context.Role | Rolul în context |
| IDNO | context.Attributes | Cod fiscal organizație |
| IDNP | context.Attributes | Cod personal |
| Name | context.Attributes | Numele complet |
| Email | context.Attributes | Adresa email |
| Permission | context.Attributes | Permisiuni specifice |

## Note tehnice

1. **Caching implementat** - Rezultatul este cache-uit după prima apelare
2. **Context dependency** - Depinde complet de IContextService
3. **AuthenticationService comentat** - Codul pentru IAuthenticationService este comentat
4. **Identity configuration** - Folosește "Server authentication" ca tip autentificare
5. **Name/Role claims** - Specifică explicit care claims sunt pentru nume și rol

## Bune practici

1. **Cache management** - Considerați invalidarea cache-ului la schimbarea contextului
2. **Null checks** - Verificați întotdeauna IsAuthenticated înainte de utilizare
3. **Claim validation** - Validați existența claims înainte de accesare
4. **Performance** - Evitați apeluri repetate în aceeași metodă
5. **Security** - Nu expuneți claims sensitive în UI

## Limitări cunoscute

1. **Single context** - Folosește doar contextul curent, nu informații de la AuthenticationService
2. **No refresh** - Nu reîmprospătează automat informațiile
3. **Static caching** - Cache-ul persistă pe toată durata de viață a serviciului

## Concluzie

UserService oferă o abstractizare utilă pentru accesarea informațiilor utilizatorului curent în format standard .NET. Prin transformarea contextului în ClaimsPrincipal, permite utilizarea facilă cu sistemul de autorizare Blazor și facilitează verificările de securitate în aplicație.