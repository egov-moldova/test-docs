# FodContextCleaner

## Documentație pentru componenta FodContextCleaner

### 1. Descriere Generală

`FodContextCleaner` este o componentă utilă pentru curățarea datelor de context din aplicație. Această componentă invizibilă se execută automat la inițializare și apelează metoda `ClearData()` din serviciul `IContextService` pentru a șterge datele de context stocate.

Caracteristici principale:
- Componentă fără UI (nu randează nimic)
- Execuție automată la inițializare
- Curăță datele de context stocate
- Utilă pentru logout sau resetare sesiune
- Integrare simplă cu IContextService

### 2. Utilizare de Bază

#### Curățare context la logout
```razor
@page "/logout"

<FodContextCleaner />

@code {
    [Inject] private NavigationManager Navigation { get; set; }
    
    protected override void OnAfterRender(bool firstRender)
    {
        if (firstRender)
        {
            // Redirecționare după curățare
            Navigation.NavigateTo("/login");
        }
    }
}
```

#### Integrare în componente wrapper
```razor
@* LogoutHandler.razor *@
<FodContextCleaner />
<FodLoading IsLoading="true">
    <p>Se deconectează...</p>
</FodLoading>
```

### 3. Parametri

Componenta nu are parametri publici. Funcționalitatea este complet automată.

### 4. Metode și Evenimente

Componenta nu expune metode publice sau evenimente. Toată funcționalitatea este internă.

### 5. Exemple Avansate

#### Componentă de logout completă
```razor
@page "/auth/logout"
@layout EmptyLayout

<FodContextCleaner />

<div class="logout-container">
    <FodCard>
        <FodCardContent>
            <FodText Typo="Typo.h5" Align="FodAlign.Center">
                Deconectare în curs...
            </FodText>
            <FodLoadingLinear Color="FodColor.Primary" />
        </FodCardContent>
    </FodCard>
</div>

@code {
    [Inject] private IAuthenticationService AuthService { get; set; }
    [Inject] private NavigationManager Navigation { get; set; }
    [Inject] private ILocalStorageService LocalStorage { get; set; }
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            // Curățare adițională
            await LocalStorage.RemoveItemAsync("authToken");
            await AuthService.Logout();
            
            // Redirecționare
            Navigation.NavigateTo("/", true);
        }
    }
}
```

#### Handler pentru schimbare utilizator
```razor
@* SwitchUserHandler.razor *@
@if (isSwitching)
{
    <FodContextCleaner />
}

<FodButton OnClick="SwitchUser" Disabled="@isSwitching">
    <FodIcon Icon="@FodIcons.Material.Filled.SwitchAccount" />
    Schimbă utilizatorul
</FodButton>

@code {
    private bool isSwitching = false;
    
    private async Task SwitchUser()
    {
        isSwitching = true;
        StateHasChanged();
        
        // Așteaptă curățarea contextului
        await Task.Delay(500);
        
        // Navighează la login
        Navigation.NavigateTo("/login?switch=true");
    }
}
```

#### Resetare aplicație
```razor
@* AppReset.razor *@
<FodModal @bind-Visible="showResetModal">
    <FodDialogTitle>
        Resetare aplicație
    </FodDialogTitle>
    <FodDialogContent>
        <FodText>
            Această acțiune va șterge toate datele locale și vă va deconecta.
            Continuați?
        </FodText>
    </FodDialogContent>
    <FodDialogActions>
        <FodButton OnClick="CancelReset">Anulează</FodButton>
        <FodButton Color="FodColor.Error" OnClick="ConfirmReset">
            Resetează
        </FodButton>
    </FodDialogActions>
</FodModal>

@if (isResetting)
{
    <FodContextCleaner />
    <FodOverlay Visible="true">
        <FodLoadingCircular />
    </FodOverlay>
}

@code {
    private bool showResetModal = false;
    private bool isResetting = false;
    
    private async Task ConfirmReset()
    {
        showResetModal = false;
        isResetting = true;
        StateHasChanged();
        
        // Curățare adițională
        await LocalStorage.ClearAsync();
        await SessionStorage.ClearAsync();
        
        // Reîncărcare completă
        await Task.Delay(1000);
        Navigation.NavigateTo("/", true);
    }
}
```

### 6. Integrare cu Servicii

#### Implementare IContextService
```csharp
public interface IContextService
{
    Task ClearData();
    // alte metode...
}

public class ContextService : IContextService
{
    private readonly ILocalStorageService _localStorage;
    private readonly ISessionStorageService _sessionStorage;
    
    public ContextService(
        ILocalStorageService localStorage,
        ISessionStorageService sessionStorage)
    {
        _localStorage = localStorage;
        _sessionStorage = sessionStorage;
    }
    
    public async Task ClearData()
    {
        // Curățare date context
        await _localStorage.RemoveItemAsync("currentContext");
        await _localStorage.RemoveItemAsync("userContexts");
        await _sessionStorage.RemoveItemAsync("contextCache");
        
        // Resetare state intern
        CurrentContext = null;
        AvailableContexts.Clear();
        
        // Notificare listeners
        ContextCleared?.Invoke(this, EventArgs.Empty);
    }
}
```

### 7. Scenarii de Utilizare

#### Timeout sesiune
```razor
@implements IDisposable

<FodLayout>
    @if (sessionExpired)
    {
        <FodContextCleaner />
        <FodModal Visible="true" DisableBackdropClick="true">
            <FodDialogContent>
                Sesiunea a expirat. Vă rugăm să vă autentificați din nou.
            </FodDialogContent>
        </FodModal>
    }
    
    @ChildContent
</FodLayout>

@code {
    [Parameter] public RenderFragment ChildContent { get; set; }
    
    private bool sessionExpired = false;
    private Timer sessionTimer;
    
    protected override void OnInitialized()
    {
        // Timer pentru 30 minute
        sessionTimer = new Timer(OnSessionTimeout, null, 
            TimeSpan.FromMinutes(30), TimeSpan.FromMinutes(30));
    }
    
    private void OnSessionTimeout(object state)
    {
        sessionExpired = true;
        InvokeAsync(StateHasChanged);
        
        // Redirecționare după 3 secunde
        Task.Delay(3000).ContinueWith(_ => 
        {
            Navigation.NavigateTo("/login", true);
        });
    }
    
    public void Dispose()
    {
        sessionTimer?.Dispose();
    }
}
```

#### Multi-tenant switch
```razor
@* TenantSwitcher.razor *@
<FodSelect T="string" 
           @bind-Value="selectedTenant"
           Label="Organizație">
    @foreach (var tenant in availableTenants)
    {
        <FodSelectItem Value="@tenant.Id">
            @tenant.Name
        </FodSelectItem>
    }
</FodSelect>

@if (isSwitchingTenant)
{
    <FodContextCleaner />
    <FodOverlay Visible="true">
        <FodText>Se schimbă organizația...</FodText>
    </FodOverlay>
}

@code {
    private string selectedTenant;
    private string currentTenant;
    private bool isSwitchingTenant;
    private List<Tenant> availableTenants;
    
    protected override async Task OnParametersSetAsync()
    {
        if (selectedTenant != currentTenant && !string.IsNullOrEmpty(selectedTenant))
        {
            isSwitchingTenant = true;
            StateHasChanged();
            
            // Așteaptă curățarea contextului
            await Task.Delay(500);
            
            // Setează noul tenant
            await TenantService.SetCurrentTenant(selectedTenant);
            currentTenant = selectedTenant;
            
            // Reîncarcă aplicația
            Navigation.NavigateTo("/", true);
        }
    }
}
```

### 8. Best Practices

1. **Utilizare strategică** - Folosiți doar când e necesară curățarea completă
2. **Combinare cu navigare** - Întotdeauna navigați după curățare
3. **Feedback vizual** - Afișați indicator de loading în timpul curățării
4. **Curățare completă** - Combinați cu alte metode de curățare
5. **Evitare loops** - Nu plasați în componente care se re-randează frecvent

### 9. Performanță

- Execuție rapidă (< 100ms în general)
- Nu afectează randarea UI
- Curățare asincronă pentru performanță optimă
- Fără impact asupra memoriei

### 10. Debugging

Pentru a verifica funcționarea:

```csharp
// În ContextService
public async Task ClearData()
{
    Console.WriteLine("Context cleanup started");
    
    try
    {
        await _localStorage.RemoveItemAsync("currentContext");
        Console.WriteLine("Current context cleared");
        
        await _localStorage.RemoveItemAsync("userContexts");
        Console.WriteLine("User contexts cleared");
        
        // etc.
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Context cleanup error: {ex.Message}");
    }
    
    Console.WriteLine("Context cleanup completed");
}
```

### 11. Considerații de Securitate

1. **Curățare completă** - Asigurați ștergerea tuturor datelor sensibile
2. **Token cleanup** - Includeți ștergerea token-urilor de autentificare
3. **Cache cleanup** - Curățați toate cache-urile locale
4. **Navigation forcing** - Folosiți `forceLoad: true` pentru reîncărcare completă

### 12. Alternative

Pentru scenarii specifice, considerați:
- `IContextService.ClearData()` - Apel direct pentru control mai fin
- Manual cleanup - Pentru curățare selectivă
- Browser refresh - Pentru resetare completă (`location.reload()`)

### 13. Concluzie

`FodContextCleaner` este o componentă simplă dar esențială pentru gestionarea corectă a stării aplicației în scenarii de logout, schimbare utilizator sau resetare. Prin integrarea sa transparentă cu `IContextService`, oferă o metodă consistentă și fiabilă de curățare a datelor de context.