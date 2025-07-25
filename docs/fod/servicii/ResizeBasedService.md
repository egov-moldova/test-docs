# ResizeBasedService & BreakpointService

## Documentație pentru serviciile ResizeBasedService și BreakpointService

### 1. Descriere Generală

`ResizeBasedService` este o clasă abstractă generică care oferă infrastructura pentru servicii reactive la schimbări de dimensiune. Implementarea principală, `BreakpointService`, gestionează detectarea și notificarea schimbărilor de breakpoint pentru design responsive în aplicațiile Blazor.

Caracteristici principale:
- Detectare automată breakpoint-uri viewport
- Subscripții la evenimente resize cu throttling
- Integrare JavaScript ResizeObserver
- Thread-safe subscription management
- Suport pentru responsive design
- Performanță optimizată prin notificări selective

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs

// Înregistrare automată prin AddFodComponents
builder.Services.AddFodComponents(configuration);

// Sau înregistrare manuală
builder.Services.AddScoped<IBreakpointService, BreakpointService>();
builder.Services.AddScoped<IBrowserWindowSizeProvider, BrowserWindowSizeProvider>();

// Configurare breakpoint-uri custom (opțional)
builder.Services.Configure<ResizeOptions>(options =>
{
    options.BreakpointDefinitions = new Dictionary<Breakpoint, int>
    {
        { Breakpoint.Xs, 0 },
        { Breakpoint.Sm, 576 },    // Bootstrap breakpoints
        { Breakpoint.Md, 768 },
        { Breakpoint.Lg, 992 },
        { Breakpoint.Xl, 1200 },
        { Breakpoint.Xxl, 1400 }
    };
    options.ReportRate = 200; // Throttle la 200ms
});
```

### 3. Interfețe și Clase

#### IBreakpointService
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

#### ResizeBasedService (Abstract)
```csharp
public abstract class ResizeBasedService<TSelf, TInfo, TAction, TaskOption> : IAsyncDisposable
    where TSelf : class
    where TInfo : SubscriptionInfo<TAction, TaskOption>
{
    // Infrastructură pentru gestionare subscripții
    protected abstract ValueTask InvokeCallbackAsync(TInfo info, TAction value);
    protected abstract ValueTask<TInfo> CreateInfoAsync(TAction action, TaskOption option);
}
```

### 4. Modele de Date

#### Breakpoint Enum
```csharp
public enum Breakpoint
{
    Xs = 0,  // Extra small (telefoane)
    Sm = 1,  // Small (tablete mici)
    Md = 2,  // Medium (tablete)
    Lg = 3,  // Large (desktop)
    Xl = 4,  // Extra large (desktop mare)
    Xxl = 5, // Extra extra large
    None = 6
}
```

#### BrowserWindowSize
```csharp
public class BrowserWindowSize
{
    public int Width { get; init; }
    public int Height { get; init; }
}
```

#### ResizeOptions
```csharp
public class ResizeOptions
{
    public Dictionary<Breakpoint, int> BreakpointDefinitions { get; set; }
    public ResizeDirection ReportRate { get; set; } = ResizeDirection.WidthAndHeight;
    public int ReportRate { get; set; } = 100; // Milliseconds
    public bool SuppressInitEvent { get; set; } = false;
    public bool NotifyOnBreakpointOnly { get; set; } = true;
}
```

### 5. Exemple de Utilizare

#### Componentă responsive simplă
```razor
@implements IAsyncDisposable
@inject IBreakpointService BreakpointService

<FodContainer>
    @if (currentBreakpoint <= Breakpoint.Sm)
    {
        <!-- Layout mobil -->
        <MobileLayout>
            <FodText Typo="Typo.h6">Vizualizare Mobilă</FodText>
            @ChildContent
        </MobileLayout>
    }
    else
    {
        <!-- Layout desktop -->
        <DesktopLayout>
            <FodText Typo="Typo.h4">Vizualizare Desktop</FodText>
            @ChildContent
        </DesktopLayout>
    }
    
    <FodChip Color="FodColor.Info" Size="FodSize.Small">
        Breakpoint curent: @currentBreakpoint
    </FodChip>
</FodContainer>

@code {
    [Parameter] public RenderFragment ChildContent { get; set; }
    
    private Breakpoint currentBreakpoint = Breakpoint.None;
    private Guid subscriptionId;
    
    protected override async Task OnInitializedAsync()
    {
        // Obține breakpoint inițial
        currentBreakpoint = await BreakpointService.GetBreakpoint();
        
        // Subscribe la schimbări
        var result = await BreakpointService.Subscribe(OnBreakpointChanged);
        subscriptionId = result.SubscriptionId;
    }
    
    private void OnBreakpointChanged(Breakpoint newBreakpoint)
    {
        currentBreakpoint = newBreakpoint;
        InvokeAsync(StateHasChanged);
    }
    
    public async ValueTask DisposeAsync()
    {
        if (subscriptionId != Guid.Empty)
        {
            await BreakpointService.Unsubscribe(subscriptionId);
        }
    }
}
```

#### Navigation drawer responsive
```razor
@inject IBreakpointService BreakpointService

<FodLayout>
    <FodDrawer @bind-Open="drawerOpen" 
               Variant="@GetDrawerVariant()"
               Breakpoint="@drawerBreakpoint"
               OverlayClass="@GetOverlayClass()">
        <FodNavMenu>
            <!-- Meniu navigație -->
        </FodNavMenu>
    </FodDrawer>
    
    <FodLayoutContent>
        @if (showMenuButton)
        {
            <FodIconButton Icon="@FodIcons.Material.Filled.Menu"
                           OnClick="ToggleDrawer"
                           Class="d-md-none" />
        }
        
        @Body
    </FodLayoutContent>
</FodLayout>

@code {
    private bool drawerOpen = true;
    private Breakpoint currentBreakpoint;
    private Breakpoint drawerBreakpoint = Breakpoint.Md;
    private bool showMenuButton;
    private Guid breakpointSubscription;
    
    protected override async Task OnInitializedAsync()
    {
        currentBreakpoint = await BreakpointService.GetBreakpoint();
        UpdateDrawerBehavior();
        
        var result = await BreakpointService.Subscribe(OnBreakpointChanged);
        breakpointSubscription = result.SubscriptionId;
    }
    
    private void OnBreakpointChanged(Breakpoint newBreakpoint)
    {
        currentBreakpoint = newBreakpoint;
        UpdateDrawerBehavior();
        InvokeAsync(StateHasChanged);
    }
    
    private void UpdateDrawerBehavior()
    {
        // Pe ecrane mici, drawer-ul este temporar și închis implicit
        if (currentBreakpoint < drawerBreakpoint)
        {
            drawerOpen = false;
            showMenuButton = true;
        }
        else
        {
            // Pe ecrane mari, drawer-ul este permanent și deschis
            drawerOpen = true;
            showMenuButton = false;
        }
    }
    
    private DrawerVariant GetDrawerVariant()
    {
        return currentBreakpoint < drawerBreakpoint 
            ? DrawerVariant.Temporary 
            : DrawerVariant.Persistent;
    }
    
    private string GetOverlayClass()
    {
        return currentBreakpoint < drawerBreakpoint 
            ? "drawer-overlay-visible" 
            : "drawer-overlay-hidden";
    }
}
```

#### Grid system responsive
```razor
@inject IBreakpointService BreakpointService

<FodGrid Container="true" Spacing="3">
    @foreach (var item in items)
    {
        <FodGrid Item="true" 
                 xs="12" 
                 sm="6" 
                 md="4" 
                 lg="3">
            <ItemCard Item="@item" 
                      Compact="@isCompactMode" />
        </FodGrid>
    }
</FodGrid>

<FodText Typo="Typo.caption" Align="FodAlign.Center">
    Afișare: @GetDisplayInfo()
</FodText>

@code {
    private List<ItemModel> items = new();
    private Breakpoint currentBreakpoint;
    private bool isCompactMode;
    
    protected override async Task OnInitializedAsync()
    {
        currentBreakpoint = await BreakpointService.GetBreakpoint();
        isCompactMode = currentBreakpoint <= Breakpoint.Sm;
        
        await BreakpointService.Subscribe(bp =>
        {
            currentBreakpoint = bp;
            isCompactMode = bp <= Breakpoint.Sm;
            InvokeAsync(StateHasChanged);
        });
    }
    
    private string GetDisplayInfo()
    {
        return currentBreakpoint switch
        {
            Breakpoint.Xs => "1 coloană (mobil)",
            Breakpoint.Sm => "2 coloane (tabletă mică)",
            Breakpoint.Md => "3 coloane (tabletă)",
            Breakpoint.Lg => "4 coloane (desktop)",
            _ => "4 coloane (ecran mare)"
        };
    }
}
```

### 6. Detectare orientare și dimensiuni

```razor
@inject IBreakpointService BreakpointService
@inject IBrowserWindowSizeProvider WindowSizeProvider

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Informații Viewport
        </FodText>
        
        <FodList Dense="true">
            <FodListItem>
                <FodListItemText>
                    Breakpoint: <strong>@currentBreakpoint</strong>
                </FodListItemText>
            </FodListItem>
            <FodListItem>
                <FodListItemText>
                    Dimensiuni: <strong>@windowSize.Width x @windowSize.Height</strong>
                </FodListItemText>
            </FodListItem>
            <FodListItem>
                <FodListItemText>
                    Orientare: <strong>@orientation</strong>
                </FodListItemText>
            </FodListItem>
            <FodListItem>
                <FodListItemText>
                    Tip dispozitiv: <strong>@deviceType</strong>
                </FodListItemText>
            </FodListItem>
        </FodList>
        
        @if (showRotateMessage)
        {
            <FodAlert Severity="FodSeverity.Info" Class="mt-3">
                Pentru experiență optimă, rotiți dispozitivul în modul landscape.
            </FodAlert>
        }
    </FodCardContent>
</FodCard>

@code {
    private Breakpoint currentBreakpoint;
    private BrowserWindowSize windowSize = new();
    private string orientation;
    private string deviceType;
    private bool showRotateMessage;
    
    protected override async Task OnInitializedAsync()
    {
        // Obține dimensiuni inițiale
        windowSize = await WindowSizeProvider.GetBrowserWindowSizeAsync();
        currentBreakpoint = await BreakpointService.GetBreakpoint();
        UpdateDeviceInfo();
        
        // Subscribe cu opțiuni custom
        var options = new ResizeOptions
        {
            ReportRate = 250, // Update la 250ms
            NotifyOnBreakpointOnly = false // Notifică la orice resize
        };
        
        await BreakpointService.Subscribe(OnViewportChanged, options);
    }
    
    private async void OnViewportChanged(Breakpoint bp)
    {
        currentBreakpoint = bp;
        windowSize = await WindowSizeProvider.GetBrowserWindowSizeAsync();
        UpdateDeviceInfo();
        await InvokeAsync(StateHasChanged);
    }
    
    private void UpdateDeviceInfo()
    {
        orientation = windowSize.Width > windowSize.Height ? "Landscape" : "Portrait";
        
        deviceType = currentBreakpoint switch
        {
            Breakpoint.Xs => "Telefon",
            Breakpoint.Sm => "Tabletă mică",
            Breakpoint.Md => "Tabletă",
            Breakpoint.Lg => "Desktop",
            _ => "Desktop mare"
        };
        
        // Afișează mesaj pentru telefoane în portrait
        showRotateMessage = currentBreakpoint == Breakpoint.Xs && 
                           orientation == "Portrait" &&
                           windowSize.Width < 400;
    }
}
```

### 7. Manager pentru layout responsive

```csharp
public class ResponsiveLayoutManager
{
    private readonly IBreakpointService _breakpointService;
    private readonly ILogger<ResponsiveLayoutManager> _logger;
    private readonly Dictionary<string, ResponsiveConfig> _configs = new();
    
    public event Action<string, ResponsiveConfig> ConfigurationChanged;
    
    public ResponsiveLayoutManager(IBreakpointService breakpointService, 
                                  ILogger<ResponsiveLayoutManager> logger)
    {
        _breakpointService = breakpointService;
        _logger = logger;
    }
    
    public async Task<ResponsiveConfig> RegisterComponent(string componentId, 
        ResponsiveConfigOptions options)
    {
        var currentBreakpoint = await _breakpointService.GetBreakpoint();
        var config = CreateConfig(currentBreakpoint, options);
        
        _configs[componentId] = config;
        
        // Subscribe pentru actualizări
        await _breakpointService.Subscribe(bp =>
        {
            var newConfig = CreateConfig(bp, options);
            _configs[componentId] = newConfig;
            ConfigurationChanged?.Invoke(componentId, newConfig);
        });
        
        return config;
    }
    
    private ResponsiveConfig CreateConfig(Breakpoint breakpoint, 
        ResponsiveConfigOptions options)
    {
        return new ResponsiveConfig
        {
            Columns = GetColumns(breakpoint, options),
            Spacing = GetSpacing(breakpoint, options),
            ShowSidebar = breakpoint >= options.SidebarBreakpoint,
            CompactMode = breakpoint <= options.CompactBreakpoint,
            StackElements = breakpoint <= Breakpoint.Sm,
            FontScale = GetFontScale(breakpoint)
        };
    }
    
    private int GetColumns(Breakpoint bp, ResponsiveConfigOptions options)
    {
        return bp switch
        {
            Breakpoint.Xs => 1,
            Breakpoint.Sm => 2,
            Breakpoint.Md => options.MediumColumns ?? 3,
            Breakpoint.Lg => options.LargeColumns ?? 4,
            _ => options.ExtraLargeColumns ?? 6
        };
    }
    
    private int GetSpacing(Breakpoint bp, ResponsiveConfigOptions options)
    {
        return bp <= Breakpoint.Sm ? 2 : 3;
    }
    
    private double GetFontScale(Breakpoint bp)
    {
        return bp switch
        {
            Breakpoint.Xs => 0.875,  // 87.5%
            Breakpoint.Sm => 0.9375, // 93.75%
            _ => 1.0                  // 100%
        };
    }
}

public class ResponsiveConfig
{
    public int Columns { get; set; }
    public int Spacing { get; set; }
    public bool ShowSidebar { get; set; }
    public bool CompactMode { get; set; }
    public bool StackElements { get; set; }
    public double FontScale { get; set; }
}
```

### 8. Hook pentru componente custom

```csharp
public class UseBreakpoint
{
    private readonly IBreakpointService _breakpointService;
    private Breakpoint _current;
    private readonly List<Action<Breakpoint>> _listeners = new();
    private Guid _subscriptionId;
    
    public UseBreakpoint(IBreakpointService breakpointService)
    {
        _breakpointService = breakpointService;
    }
    
    public Breakpoint Current => _current;
    
    public bool IsXs => _current == Breakpoint.Xs;
    public bool IsSm => _current == Breakpoint.Sm;
    public bool IsMd => _current == Breakpoint.Md;
    public bool IsLg => _current == Breakpoint.Lg;
    public bool IsXl => _current == Breakpoint.Xl;
    
    public bool IsMobile => _current <= Breakpoint.Sm;
    public bool IsTablet => _current == Breakpoint.Md;
    public bool IsDesktop => _current >= Breakpoint.Lg;
    
    public bool IsAtLeast(Breakpoint breakpoint) => _current >= breakpoint;
    public bool IsAtMost(Breakpoint breakpoint) => _current <= breakpoint;
    
    public async Task InitializeAsync(Action<Breakpoint> onChange = null)
    {
        _current = await _breakpointService.GetBreakpoint();
        
        if (onChange != null)
        {
            _listeners.Add(onChange);
        }
        
        var result = await _breakpointService.Subscribe(OnBreakpointChanged);
        _subscriptionId = result.SubscriptionId;
    }
    
    private void OnBreakpointChanged(Breakpoint newBreakpoint)
    {
        _current = newBreakpoint;
        foreach (var listener in _listeners)
        {
            listener?.Invoke(newBreakpoint);
        }
    }
    
    public async ValueTask DisposeAsync()
    {
        if (_subscriptionId != Guid.Empty)
        {
            await _breakpointService.Unsubscribe(_subscriptionId);
        }
        _listeners.Clear();
    }
}
```

### 9. Testare

```csharp
[TestClass]
public class BreakpointServiceTests
{
    private Mock<IJSRuntime> _jsRuntime;
    private Mock<IBrowserWindowSizeProvider> _windowSizeProvider;
    private IBreakpointService _service;
    
    [TestInitialize]
    public void Setup()
    {
        _jsRuntime = new Mock<IJSRuntime>();
        _windowSizeProvider = new Mock<IBrowserWindowSizeProvider>();
        _service = new BreakpointService(_jsRuntime.Object, _windowSizeProvider.Object);
    }
    
    [TestMethod]
    public async Task GetBreakpoint_MobileWidth_ReturnsXs()
    {
        // Arrange
        _windowSizeProvider.Setup(w => w.GetBrowserWindowSizeAsync())
            .ReturnsAsync(new BrowserWindowSize { Width = 320, Height = 568 });
        
        // Act
        var breakpoint = await _service.GetBreakpoint();
        
        // Assert
        Assert.AreEqual(Breakpoint.Xs, breakpoint);
    }
    
    [TestMethod]
    public async Task Subscribe_BreakpointChanges_NotifiesSubscriber()
    {
        // Arrange
        var notifications = new List<Breakpoint>();
        var result = await _service.Subscribe(bp => notifications.Add(bp));
        
        // Simulate resize events
        await SimulateResize(400, 600); // Xs
        await SimulateResize(800, 600); // Md
        
        // Assert
        Assert.AreEqual(2, notifications.Count);
        Assert.AreEqual(Breakpoint.Xs, notifications[0]);
        Assert.AreEqual(Breakpoint.Md, notifications[1]);
    }
    
    [TestMethod]
    public async Task IsMediaSize_CurrentBreakpoint_ReturnsCorrectResult()
    {
        // Arrange
        _windowSizeProvider.Setup(w => w.GetBrowserWindowSizeAsync())
            .ReturnsAsync(new BrowserWindowSize { Width = 1024, Height = 768 });
        
        // Act
        var isMd = await _service.IsMediaSize(Breakpoint.Md);
        var isXs = await _service.IsMediaSize(Breakpoint.Xs);
        
        // Assert
        Assert.IsTrue(isMd);
        Assert.IsFalse(isXs);
    }
}
```

### 10. JavaScript Integration

```javascript
// fodResizeListener.js
window.fodResizeListener = {
    observer: null,
    listeners: new Map(),
    
    init: function(dotNetRef, options) {
        const throttle = options.reportRate || 100;
        let timeout;
        
        this.observer = new ResizeObserver(entries => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const size = {
                    width: window.innerWidth,
                    height: window.innerHeight
                };
                
                dotNetRef.invokeMethodAsync('OnResized', size);
            }, throttle);
        });
        
        this.observer.observe(document.body);
        
        // Notificare inițială
        if (!options.suppressInitEvent) {
            const initialSize = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            dotNetRef.invokeMethodAsync('OnResized', initialSize);
        }
    },
    
    dispose: function() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.listeners.clear();
    }
};
```

### 11. Best Practices

1. **Dispose pattern** - Întotdeauna dezabonați-vă de la evenimente
2. **Throttling** - Folosiți rate limiting pentru performanță
3. **Breakpoint only** - Notificați doar la schimbare breakpoint
4. **Cache breakpoint** - Evitați apeluri repetate
5. **Mobile first** - Design pornind de la dispozitive mici
6. **Test resize** - Testați toate breakpoint-urile
7. **Fallback graceful** - Gestionați lipsa suport JS

### 12. Concluzie

`ResizeBasedService` și `BreakpointService` oferă o infrastructură robustă pentru dezvoltarea de aplicații Blazor responsive. Cu suport pentru detectare automată a breakpoint-urilor, notificări eficiente și integrare seamless cu componentele UI, aceste servicii facilitează crearea de interfețe adaptive care oferă experiențe optime pe toate tipurile de dispozitive.