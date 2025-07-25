# BreakpointService

## Descriere Generală

`BreakpointService` este serviciul responsabil pentru detectarea și monitorizarea dimensiunii ferestrei browserului și a breakpoint-urilor responsive în aplicații Blazor. Permite componentelor să reacționeze la schimbări de dimensiune și să adapteze interfața în funcție de breakpoint-ul curent (Xs, Sm, Md, Lg, Xl).

## Configurare

### Înregistrare în Dependency Injection

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddScoped<IBreakpointService, BreakpointService>();
builder.Services.AddScoped<IBrowserWindowSizeProvider, BrowserWindowSizeProvider>();

// Cu opțiuni personalizate
builder.Services.Configure<ResizeOptions>(options =>
{
    options.ReportRate = 100; // ms
    options.EnableLogging = false;
    options.SuppressInitEvent = true;
    options.NotifyOnBreakpointOnly = true;
});
```

### JavaScript necesar

```javascript
// Inclus automat în FodComponents.js
window.fodResizeListenerFactory = {
    listeners: {},
    
    listenForResize: function(dotnetRef, options, id) {
        if (!this.listeners[id]) {
            this.listeners[id] = new FodResizeListener(id);
        }
        this.listeners[id].listenForResize(dotnetRef, options);
    },
    
    cancelListener: function(id) {
        if (this.listeners[id]) {
            this.listeners[id].cancelListener();
            delete this.listeners[id];
        }
    }
};
```

## Interfața IBreakpointService

```csharp
public interface IBreakpointService : IAsyncDisposable
{
    Task<bool> IsMediaSize(Breakpoint breakpoint);
    bool IsMediaSize(Breakpoint breakpoint, Breakpoint reference);
    Task<Breakpoint> GetBreakpoint();
    Task<BreakpointServiceSubscribeResult> Subscribe(Action<Breakpoint> callback);
    Task<BreakpointServiceSubscribeResult> Subscribe(Action<Breakpoint> callback, ResizeOptions options);
    Task<bool> Unsubscribe(Guid subscriptionId);
}
```

## Enum-uri și clase asociate

### Breakpoint Enum

```csharp
public enum Breakpoint
{
    Xs,          // Extra small
    Sm,          // Small
    Md,          // Medium
    Lg,          // Large
    Xl,          // Extra large
    Xxl,         // Extra extra large
    SmAndDown,   // Small și mai mic
    MdAndDown,   // Medium și mai mic
    LgAndDown,   // Large și mai mic
    XlAndDown,   // Extra large și mai mic
    SmAndUp,     // Small și mai mare
    MdAndUp,     // Medium și mai mare
    LgAndUp,     // Large și mai mare
    XlAndUp,     // Extra large și mai mare
    None,        // Niciunul
    Always       // Întotdeauna
}
```

### ResizeOptions

```csharp
public class ResizeOptions
{
    public int ReportRate { get; set; } = 100; // Rate în ms
    public bool EnableLogging { get; set; } = false;
    public bool SuppressInitEvent { get; set; } = true;
    public bool NotifyOnBreakpointOnly { get; set; } = true;
    public Dictionary<string, int> BreakpointDefinitions { get; set; }
}
```

### BrowserWindowSize

```csharp
public class BrowserWindowSize
{
    public int Height { get; set; }
    public int Width { get; set; }
}
```

## Metode disponibile

### GetBreakpoint

Obține breakpoint-ul curent al ferestrei.

**Parametri:** Niciun parametru

**Returnează:** `Task<Breakpoint>` - Breakpoint-ul curent

**Breakpoint-uri default:**
- Xl: ≥ 1920px
- Lg: ≥ 1280px
- Md: ≥ 960px
- Sm: ≥ 600px
- Xs: < 600px

### IsMediaSize

Verifică dacă breakpoint-ul curent se potrivește cu cel specificat.

**Parametri:**
- `breakpoint: Breakpoint` - Breakpoint-ul de verificat

**Returnează:** `Task<bool>` - True dacă se potrivește

### IsMediaSize (overload)

Verifică dacă un breakpoint se potrivește cu o referință.

**Parametri:**
- `breakpoint: Breakpoint` - Breakpoint-ul de verificat
- `reference: Breakpoint` - Breakpoint-ul de referință

**Returnează:** `bool` - True dacă se potrivește

### Subscribe

Abonează la schimbări de breakpoint.

**Parametri:**
- `callback: Action<Breakpoint>` - Funcția apelată la schimbare
- `options: ResizeOptions` - Opțiuni (opțional)

**Returnează:** `Task<BreakpointServiceSubscribeResult>` - ID subscripție și breakpoint curent

### Unsubscribe

Dezabonează de la schimbări.

**Parametri:**
- `subscriptionId: Guid` - ID-ul subscripției

**Returnează:** `Task<bool>` - True dacă s-a dezabonat cu succes

## Exemple de utilizare

### Layout responsive simplu

```razor
@inject IBreakpointService BreakpointService
@implements IAsyncDisposable

<div class="@GetLayoutClass()">
    @if (isMobile)
    {
        <MobileNavigation />
    }
    else
    {
        <DesktopNavigation />
    }
    
    <main class="content">
        @Body
    </main>
</div>

@code {
    private Breakpoint currentBreakpoint = Breakpoint.Md;
    private bool isMobile;
    private Guid subscriptionId;
    
    protected override async Task OnInitializedAsync()
    {
        var result = await BreakpointService.Subscribe(OnBreakpointChanged);
        subscriptionId = result.SubscriptionId;
        currentBreakpoint = result.Breakpoint;
        UpdateLayoutState();
    }
    
    private void OnBreakpointChanged(Breakpoint breakpoint)
    {
        currentBreakpoint = breakpoint;
        UpdateLayoutState();
        InvokeAsync(StateHasChanged);
    }
    
    private void UpdateLayoutState()
    {
        isMobile = BreakpointService.IsMediaSize(Breakpoint.SmAndDown, currentBreakpoint);
    }
    
    private string GetLayoutClass()
    {
        return currentBreakpoint switch
        {
            Breakpoint.Xs => "layout-xs",
            Breakpoint.Sm => "layout-sm",
            Breakpoint.Md => "layout-md",
            Breakpoint.Lg => "layout-lg",
            Breakpoint.Xl => "layout-xl",
            _ => "layout-default"
        };
    }
    
    public async ValueTask DisposeAsync()
    {
        await BreakpointService.Unsubscribe(subscriptionId);
    }
}
```

### Grid responsive

```razor
@inject IBreakpointService BreakpointService

<FodGrid>
    <FodItem xs="12" sm="6" md="4" lg="3">
        <FodCard>
            <CardContent>
                <h5>Card 1</h5>
                <p>Breakpoint curent: @currentBreakpoint</p>
            </CardContent>
        </FodCard>
    </FodItem>
    
    @foreach (var item in items)
    {
        <FodItem xs="12" sm="6" md="4" lg="3">
            <ProductCard Product="item" />
        </FodItem>
    }
</FodGrid>

@code {
    private Breakpoint currentBreakpoint;
    private List<Product> items = new();
    
    protected override async Task OnInitializedAsync()
    {
        currentBreakpoint = await BreakpointService.GetBreakpoint();
        
        var subscription = await BreakpointService.Subscribe((bp) =>
        {
            currentBreakpoint = bp;
            StateHasChanged();
        });
    }
}
```

### Drawer responsive

```razor
@inject IBreakpointService BreakpointService

<FodDrawer @bind-Open="drawerOpen" 
           Variant="@GetDrawerVariant()"
           Anchor="@GetDrawerAnchor()">
    <DrawerContent>
        <NavMenu />
    </DrawerContent>
</FodDrawer>

<FodMain>
    <FodToolbar>
        @if (showMenuButton)
        {
            <FodIconButton Icon="menu" @onclick="ToggleDrawer" />
        }
        <FodSpacer />
        <AppTitle />
    </FodToolbar>
    
    @Body
</FodMain>

@code {
    private bool drawerOpen = true;
    private bool showMenuButton;
    private Breakpoint currentBreakpoint;
    
    protected override async Task OnInitializedAsync()
    {
        var result = await BreakpointService.Subscribe(OnBreakpointChanged);
        OnBreakpointChanged(result.Breakpoint);
    }
    
    private void OnBreakpointChanged(Breakpoint breakpoint)
    {
        currentBreakpoint = breakpoint;
        showMenuButton = BreakpointService.IsMediaSize(Breakpoint.MdAndDown, breakpoint);
        drawerOpen = !showMenuButton;
        InvokeAsync(StateHasChanged);
    }
    
    private FodDrawerVariant GetDrawerVariant()
    {
        return showMenuButton ? FodDrawerVariant.Temporary : FodDrawerVariant.Persistent;
    }
    
    private FodDrawerAnchor GetDrawerAnchor()
    {
        return currentBreakpoint == Breakpoint.Xs ? FodDrawerAnchor.Bottom : FodDrawerAnchor.Left;
    }
    
    private void ToggleDrawer() => drawerOpen = !drawerOpen;
}
```

### Componente adaptive

```razor
@inject IBreakpointService BreakpointService

@if (isDesktop)
{
    <FodDataTable Items="@items" Dense="false">
        <FodColumn Title="Nume" Field="@nameof(Item.Name)" />
        <FodColumn Title="Descriere" Field="@nameof(Item.Description)" />
        <FodColumn Title="Preț" Field="@nameof(Item.Price)" />
        <FodColumn Title="Stoc" Field="@nameof(Item.Stock)" />
    </FodDataTable>
}
else
{
    <div class="mobile-list">
        @foreach (var item in items)
        {
            <FodCard Class="mb-2">
                <CardContent>
                    <h6>@item.Name</h6>
                    <p class="text-muted">@item.Description</p>
                    <div class="d-flex justify-content-between">
                        <span>Preț: @item.Price.ToString("C")</span>
                        <span>Stoc: @item.Stock</span>
                    </div>
                </CardContent>
            </FodCard>
        }
    </div>
}

@code {
    private List<Item> items = new();
    private bool isDesktop = true;
    
    protected override async Task OnInitializedAsync()
    {
        var result = await BreakpointService.Subscribe(OnBreakpointChanged);
        UpdateDisplay(result.Breakpoint);
    }
    
    private void OnBreakpointChanged(Breakpoint breakpoint)
    {
        UpdateDisplay(breakpoint);
        InvokeAsync(StateHasChanged);
    }
    
    private void UpdateDisplay(Breakpoint breakpoint)
    {
        isDesktop = BreakpointService.IsMediaSize(Breakpoint.MdAndUp, breakpoint);
    }
}
```

### Service extins cu cache

```csharp
public interface ICachedBreakpointService : IBreakpointService
{
    Breakpoint? CachedBreakpoint { get; }
    event EventHandler<Breakpoint> BreakpointChanged;
}

public class CachedBreakpointService : ICachedBreakpointService
{
    private readonly IBreakpointService _innerService;
    private Breakpoint? _cachedBreakpoint;
    
    public Breakpoint? CachedBreakpoint => _cachedBreakpoint;
    public event EventHandler<Breakpoint> BreakpointChanged;
    
    public CachedBreakpointService(IBreakpointService innerService)
    {
        _innerService = innerService;
        _ = InitializeAsync();
    }
    
    private async Task InitializeAsync()
    {
        var result = await _innerService.Subscribe(OnBreakpointChanged);
        _cachedBreakpoint = result.Breakpoint;
    }
    
    private void OnBreakpointChanged(Breakpoint breakpoint)
    {
        _cachedBreakpoint = breakpoint;
        BreakpointChanged?.Invoke(this, breakpoint);
    }
    
    public async Task<Breakpoint> GetBreakpoint()
    {
        if (_cachedBreakpoint.HasValue)
            return _cachedBreakpoint.Value;
            
        return await _innerService.GetBreakpoint();
    }
}
```

### Hook personalizat

```csharp
public static class BreakpointHooks
{
    public static async Task<BreakpointInfo> UseBreakpoint(
        this ComponentBase component, 
        IBreakpointService breakpointService)
    {
        var info = new BreakpointInfo();
        
        var result = await breakpointService.Subscribe((bp) =>
        {
            info.Current = bp;
            info.IsMobile = breakpointService.IsMediaSize(Breakpoint.SmAndDown, bp);
            info.IsTablet = breakpointService.IsMediaSize(Breakpoint.Md, bp);
            info.IsDesktop = breakpointService.IsMediaSize(Breakpoint.LgAndUp, bp);
            
            component.InvokeAsync(component.StateHasChanged);
        });
        
        info.SubscriptionId = result.SubscriptionId;
        info.Current = result.Breakpoint;
        
        return info;
    }
}

public class BreakpointInfo
{
    public Breakpoint Current { get; set; }
    public bool IsMobile { get; set; }
    public bool IsTablet { get; set; }
    public bool IsDesktop { get; set; }
    public Guid SubscriptionId { get; set; }
}
```

## Tratare erori

### Service cu fallback

```csharp
public class SafeBreakpointService : IBreakpointService
{
    private readonly IBreakpointService _innerService;
    private readonly ILogger<SafeBreakpointService> _logger;
    
    public async Task<Breakpoint> GetBreakpoint()
    {
        try
        {
            return await _innerService.GetBreakpoint();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get breakpoint");
            return Breakpoint.Md; // Default fallback
        }
    }
    
    public async Task<BreakpointServiceSubscribeResult> Subscribe(
        Action<Breakpoint> callback)
    {
        try
        {
            return await _innerService.Subscribe(callback);
        }
        catch (JSException)
        {
            // Fallback pentru SSR sau JS disabled
            return new BreakpointServiceSubscribeResult(
                Guid.Empty, 
                Breakpoint.Md
            );
        }
    }
}
```

## Note tehnice

1. **Throttling** - Evenimentele resize sunt limitate la ReportRate (default 100ms)
2. **Breakpoint only** - Poate notifica doar la schimbarea breakpoint-ului
3. **Memory management** - Important să dezabonați în Dispose
4. **SSR compatibility** - Necesită verificări pentru server-side rendering
5. **Performance** - Folosiți NotifyOnBreakpointOnly pentru performanță

## Configurări personalizate

### Breakpoint-uri custom

```csharp
builder.Services.Configure<ResizeOptions>(options =>
{
    options.BreakpointDefinitions = new Dictionary<string, int>
    {
        ["Xs"] = 0,
        ["Sm"] = 576,
        ["Md"] = 768,
        ["Lg"] = 992,
        ["Xl"] = 1200,
        ["Xxl"] = 1400
    };
});
```

### Opțiuni per subscripție

```razor
@code {
    private async Task SubscribeWithCustomOptions()
    {
        var customOptions = new ResizeOptions
        {
            ReportRate = 250, // Mai puțin frecvent
            EnableLogging = true, // Debug în consolă
            NotifyOnBreakpointOnly = false // Notifică la orice resize
        };
        
        await BreakpointService.Subscribe(OnResize, customOptions);
    }
}
```

## Bune practici

1. **Unsubscribe** - Întotdeauna dezabonați în DisposeAsync
2. **Cache results** - Cache-uiți breakpoint-ul pentru acces sincron
3. **Debounce** - Folosiți debouncing pentru acțiuni costisitoare
4. **Mobile first** - Proiectați pentru mobile și adaptați pentru desktop
5. **Test resize** - Testați toate breakpoint-urile în development
6. **Performance** - Evitați re-render-uri inutile

## Concluzie

BreakpointService oferă o soluție robustă pentru gestionarea responsive design în aplicații Blazor. Cu suport pentru monitorizare în timp real, breakpoint-uri personalizabile și performanță optimizată, serviciul facilitează crearea de interfețe adaptive care oferă experiențe excelente pe toate dispozitivele.