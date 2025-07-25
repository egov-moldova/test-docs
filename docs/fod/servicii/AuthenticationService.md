# AuthenticationService (Client-Side)

## Documentație pentru serviciul AuthenticationService

### 1. Descriere Generală

`AuthenticationService` este un serviciu client-side care gestionează obținerea informațiilor despre utilizatorul curent autentificat în aplicațiile Blazor. Serviciul comunică cu API-ul server pentru a recupera claims-urile utilizatorului și starea de autentificare.

Caracteristici principale:
- Obținere informații utilizator curent
- Parsare claims din răspuns JSON
- Suport pentru claims cu valori multiple
- Gestionare stare neautentificat
- Integrare cu HttpClient

### 2. Configurare și Înregistrare

```csharp
// Program.cs (Blazor WebAssembly)
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

// Sau prin AddFodComponents
builder.Services.AddFodComponents(configuration);

// Configurare HttpClient
builder.Services.AddScoped(sp => new HttpClient 
{ 
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) 
});
```

### 3. Interfață

```csharp
public interface IAuthenticationService
{
    Task<CurrentUser> CurrentUserInfo();
}
```

### 4. Model CurrentUser

```csharp
public class CurrentUser
{
    public bool IsAuthenticated { get; set; }
    public IEnumerable<KeyValuePair<string, string>> Claims { get; set; }
}
```

### 5. Metodă Disponibilă

#### CurrentUserInfo
Obține informațiile despre utilizatorul curent autentificat.

**Parametri:** Niciun parametru

**Returnează:**
- `Task<CurrentUser>` - Informații despre utilizator, inclusiv claims

**Comportament:**
- Apelează endpoint-ul `account/me`
- Dacă răspunsul este NoContent (204), returnează utilizator neautentificat
- Parsează JSON-ul răspunsului în claims
- Suportă claims cu valori multiple (array)

### 6. Exemple de Utilizare

#### Verificare autentificare simplă
```razor
@page "/profile"
@inject IAuthenticationService AuthService

<h3>Profil Utilizator</h3>

@if (currentUser?.IsAuthenticated == true)
{
    <p>Bine ați venit!</p>
    <h4>Claims:</h4>
    <ul>
        @foreach (var claim in currentUser.Claims)
        {
            <li>@claim.Key: @claim.Value</li>
        }
    </ul>
}
else
{
    <p>Nu sunteți autentificat.</p>
}

@code {
    private CurrentUser currentUser;

    protected override async Task OnInitializedAsync()
    {
        currentUser = await AuthService.CurrentUserInfo();
    }
}
```

#### Extragere claims specifice
```csharp
public class UserService
{
    private readonly IAuthenticationService _authService;
    
    public UserService(IAuthenticationService authService)
    {
        _authService = authService;
    }
    
    public async Task<UserInfo> GetUserDetails()
    {
        var currentUser = await _authService.CurrentUserInfo();
        
        if (!currentUser.IsAuthenticated)
        {
            return null;
        }
        
        var userInfo = new UserInfo();
        
        // Extragere claims
        foreach (var claim in currentUser.Claims)
        {
            switch (claim.Key)
            {
                case "name":
                    userInfo.Name = claim.Value;
                    break;
                case "email":
                    userInfo.Email = claim.Value;
                    break;
                case "sub":
                    userInfo.UserId = claim.Value;
                    break;
                case "role":
                    userInfo.Roles.Add(claim.Value);
                    break;
            }
        }
        
        return userInfo;
    }
}

public class UserInfo
{
    public string UserId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public List<string> Roles { get; set; } = new();
}
```

#### Component cu autorizare
```razor
@inject IAuthenticationService AuthService
@inject NavigationManager Navigation

<div class="user-menu">
    @if (isAuthenticated)
    {
        <FodMenu>
            <FodMenuItem OnClick="GoToProfile">
                <FodIcon Icon="@FodIcons.Material.Filled.Person" />
                @userName
            </FodMenuItem>
            <FodMenuItem OnClick="GoToSettings">
                <FodIcon Icon="@FodIcons.Material.Filled.Settings" />
                Setări
            </FodMenuItem>
            <FodMenuItem OnClick="Logout">
                <FodIcon Icon="@FodIcons.Material.Filled.Logout" />
                Ieșire
            </FodMenuItem>
        </FodMenu>
    }
    else
    {
        <FodButton OnClick="Login">Autentificare</FodButton>
    }
</div>

@code {
    private bool isAuthenticated;
    private string userName;
    
    protected override async Task OnInitializedAsync()
    {
        await CheckAuthentication();
    }
    
    private async Task CheckAuthentication()
    {
        var user = await AuthService.CurrentUserInfo();
        isAuthenticated = user.IsAuthenticated;
        
        if (isAuthenticated)
        {
            userName = user.Claims
                .FirstOrDefault(c => c.Key == "name")?.Value 
                ?? "Utilizator";
        }
    }
    
    private void Login()
    {
        Navigation.NavigateTo("/authentication/login");
    }
    
    private void Logout()
    {
        Navigation.NavigateTo("/authentication/logout");
    }
}
```

### 7. Guard pentru rute protejate

```csharp
public class AuthorizedRouteView : ComponentBase
{
    [Inject] private IAuthenticationService AuthService { get; set; }
    [Inject] private NavigationManager Navigation { get; set; }
    
    [Parameter] public RenderFragment Authorized { get; set; }
    [Parameter] public RenderFragment NotAuthorized { get; set; }
    [Parameter] public string RequiredRole { get; set; }
    
    private bool isAuthenticated;
    private bool hasRequiredRole;
    
    protected override async Task OnInitializedAsync()
    {
        var user = await AuthService.CurrentUserInfo();
        isAuthenticated = user.IsAuthenticated;
        
        if (isAuthenticated && !string.IsNullOrEmpty(RequiredRole))
        {
            hasRequiredRole = user.Claims
                .Any(c => c.Key == "role" && c.Value == RequiredRole);
        }
        else
        {
            hasRequiredRole = true; // No role required
        }
        
        if (!isAuthenticated || !hasRequiredRole)
        {
            Navigation.NavigateTo("/authentication/login");
        }
    }
    
    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        if (isAuthenticated && hasRequiredRole)
        {
            builder.AddContent(0, Authorized);
        }
        else
        {
            builder.AddContent(0, NotAuthorized);
        }
    }
}
```

### 8. Cache pentru performanță

```csharp
public class CachedAuthenticationService : IAuthenticationService
{
    private readonly IAuthenticationService _innerService;
    private readonly IMemoryCache _cache;
    private const string CacheKey = "current_user";
    private readonly TimeSpan _cacheExpiration = TimeSpan.FromMinutes(5);
    
    public CachedAuthenticationService(
        AuthenticationService innerService,
        IMemoryCache cache)
    {
        _innerService = innerService;
        _cache = cache;
    }
    
    public async Task<CurrentUser> CurrentUserInfo()
    {
        return await _cache.GetOrCreateAsync(CacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = _cacheExpiration;
            return await _innerService.CurrentUserInfo();
        });
    }
    
    public void InvalidateCache()
    {
        _cache.Remove(CacheKey);
    }
}
```

### 9. Integrare cu componente FOD

```razor
@page "/admin"
@inject IAuthenticationService AuthService

<FodContainer>
    <FodHeader>
        <FodText Typo="Typo.h4">Panou Administrare</FodText>
    </FodHeader>
    
    <FodAuthCheck Service="@AuthService" RequiredClaim="role" RequiredValue="admin">
        <Authorized>
            <FodGrid>
                <FodItem xs="12" md="6">
                    <FodCard>
                        <FodCardContent>
                            <FodText Typo="Typo.h6">Utilizatori</FodText>
                            <FodText>Gestionare utilizatori sistem</FodText>
                        </FodCardContent>
                        <FodCardActions>
                            <FodButton Href="/admin/users">Administrare</FodButton>
                        </FodCardActions>
                    </FodCard>
                </FodItem>
            </FodGrid>
        </Authorized>
        <NotAuthorized>
            <FodAlert Severity="Severity.Warning">
                Nu aveți permisiuni de administrator.
            </FodAlert>
        </NotAuthorized>
    </FodAuthCheck>
</FodContainer>

@code {
    // Component helper pentru verificare autorizare
    public class FodAuthCheck : ComponentBase
    {
        [Parameter] public IAuthenticationService Service { get; set; }
        [Parameter] public string RequiredClaim { get; set; }
        [Parameter] public string RequiredValue { get; set; }
        [Parameter] public RenderFragment Authorized { get; set; }
        [Parameter] public RenderFragment NotAuthorized { get; set; }
        
        private bool isAuthorized;
        
        protected override async Task OnInitializedAsync()
        {
            var user = await Service.CurrentUserInfo();
            
            if (!user.IsAuthenticated)
            {
                isAuthorized = false;
                return;
            }
            
            if (string.IsNullOrEmpty(RequiredClaim))
            {
                isAuthorized = true;
                return;
            }
            
            isAuthorized = user.Claims.Any(c => 
                c.Key == RequiredClaim && 
                (string.IsNullOrEmpty(RequiredValue) || c.Value == RequiredValue));
        }
        
        protected override void BuildRenderTree(RenderTreeBuilder builder)
        {
            builder.AddContent(0, isAuthorized ? Authorized : NotAuthorized);
        }
    }
}
```

### 10. Monitorizare și logging

```csharp
public class LoggingAuthenticationService : IAuthenticationService
{
    private readonly IAuthenticationService _innerService;
    private readonly ILogger<LoggingAuthenticationService> _logger;
    
    public LoggingAuthenticationService(
        IAuthenticationService innerService,
        ILogger<LoggingAuthenticationService> logger)
    {
        _innerService = innerService;
        _logger = logger;
    }
    
    public async Task<CurrentUser> CurrentUserInfo()
    {
        try
        {
            _logger.LogInformation("Fetching current user info");
            
            var stopwatch = Stopwatch.StartNew();
            var user = await _innerService.CurrentUserInfo();
            stopwatch.Stop();
            
            _logger.LogInformation(
                "User info fetched in {ElapsedMs}ms. Authenticated: {IsAuthenticated}, Claims count: {ClaimsCount}",
                stopwatch.ElapsedMilliseconds,
                user.IsAuthenticated,
                user.Claims?.Count() ?? 0);
            
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching current user info");
            throw;
        }
    }
}
```

### 11. Testing

```csharp
[TestClass]
public class AuthenticationServiceTests
{
    private Mock<HttpMessageHandler> _mockHandler;
    private HttpClient _httpClient;
    private AuthenticationService _authService;
    
    [TestInitialize]
    public void Setup()
    {
        _mockHandler = new Mock<HttpMessageHandler>();
        _httpClient = new HttpClient(_mockHandler.Object)
        {
            BaseAddress = new Uri("https://test.com/")
        };
        _authService = new AuthenticationService(_httpClient);
    }
    
    [TestMethod]
    public async Task CurrentUserInfo_Authenticated_ReturnsClaims()
    {
        // Arrange
        var responseData = new Dictionary<string, object>
        {
            ["name"] = "Test User",
            ["email"] = "test@example.com",
            ["role"] = new[] { "user", "admin" }
        };
        
        _mockHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(
                    JsonSerializer.Serialize(responseData),
                    Encoding.UTF8,
                    "application/json")
            });
        
        // Act
        var result = await _authService.CurrentUserInfo();
        
        // Assert
        Assert.IsTrue(result.IsAuthenticated);
        Assert.AreEqual(4, result.Claims.Count()); // name, email, role x2
        Assert.IsTrue(result.Claims.Any(c => c.Key == "name" && c.Value == "Test User"));
    }
    
    [TestMethod]
    public async Task CurrentUserInfo_NotAuthenticated_ReturnsEmpty()
    {
        // Arrange
        _mockHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.NoContent
            });
        
        // Act
        var result = await _authService.CurrentUserInfo();
        
        // Assert
        Assert.IsFalse(result.IsAuthenticated);
        Assert.IsNull(result.Claims);
    }
}
```

### 12. Tratare erori

```csharp
public class ResilientAuthenticationService : IAuthenticationService
{
    private readonly IAuthenticationService _innerService;
    private readonly ILogger<ResilientAuthenticationService> _logger;
    private readonly int _maxRetries = 3;
    
    public async Task<CurrentUser> CurrentUserInfo()
    {
        for (int i = 0; i < _maxRetries; i++)
        {
            try
            {
                return await _innerService.CurrentUserInfo();
            }
            catch (HttpRequestException ex) when (i < _maxRetries - 1)
            {
                _logger.LogWarning(
                    "Failed to get user info (attempt {Attempt}/{MaxRetries}): {Message}",
                    i + 1, _maxRetries, ex.Message);
                
                await Task.Delay(TimeSpan.FromSeconds(Math.Pow(2, i))); // Exponential backoff
            }
            catch (TaskCanceledException)
            {
                _logger.LogWarning("Request timeout getting user info");
                return new CurrentUser { IsAuthenticated = false };
            }
        }
        
        // Final fallback
        return new CurrentUser { IsAuthenticated = false };
    }
}
```

### 13. Best Practices

1. **Cache rezultate**: Pentru a evita apeluri repetitive la server
2. **Tratare erori**: Întotdeauna gestionați erorile de rețea
3. **Logging**: Monitorizați apelurile pentru debugging
4. **Null checks**: Verificați întotdeauna IsAuthenticated înainte de a accesa Claims
5. **Timeout**: Setați timeout rezonabil pentru HttpClient
6. **Refresh**: Implementați mecanism de refresh pentru date vechi

### 14. Integrare cu AuthenticationStateProvider

```csharp
public class FodAuthenticationStateProvider : AuthenticationStateProvider
{
    private readonly IAuthenticationService _authService;
    
    public FodAuthenticationStateProvider(IAuthenticationService authService)
    {
        _authService = authService;
    }
    
    public override async Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        var currentUser = await _authService.CurrentUserInfo();
        
        if (!currentUser.IsAuthenticated)
        {
            return new AuthenticationState(
                new ClaimsPrincipal(new ClaimsIdentity()));
        }
        
        var claims = currentUser.Claims
            .Select(kvp => new Claim(kvp.Key, kvp.Value))
            .ToList();
        
        var identity = new ClaimsIdentity(claims, "serverauth");
        var principal = new ClaimsPrincipal(identity);
        
        return new AuthenticationState(principal);
    }
}
```

### 15. Concluzie

`AuthenticationService` oferă o interfață simplă și eficientă pentru obținerea informațiilor despre utilizatorul autentificat în aplicațiile Blazor. Cu suport pentru claims multiple și integrare ușoară cu componentele FOD, serviciul facilitează implementarea logicii de autorizare și personalizarea experienței utilizatorului pe baza rolurilor și permisiunilor.