# FodPopoverService

## Descriere Generală

`FodPopoverService` este serviciul responsabil pentru gestionarea centralizată a componentelor popover în aplicație. Permite înregistrarea, actualizarea și dezînregistrarea popover-urilor, oferind un mecanism pentru afișarea conținutului flotant poziționat relativ la elementele părinte.

## Configurare

### Înregistrare în Dependency Injection

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddScoped<IFodPopoverService, FodPopoverService>();

// Cu opțiuni personalizate
builder.Services.Configure<PopoverOptions>(options =>
{
    options.ContainerClass = "popover-container";
    options.FlipMargin = 5;
});

builder.Services.AddScoped<IFodPopoverService, FodPopoverService>();
```

### Configurare JavaScript

```javascript
// În fișierul JS principal
window.fodPopover = {
    initilize: function (containerClass, flipMargin) {
        // Inițializare popover manager
        this.containerClass = containerClass;
        this.flipMargin = flipMargin;
        this.popovers = new Map();
    },
    
    connect: function (id) {
        // Conectare popover nou
        const element = document.getElementById(id);
        if (element) {
            this.popovers.set(id, element);
            // Setup positioning logic
        }
    },
    
    disconnect: function (id) {
        // Deconectare popover
        this.popovers.delete(id);
    },
    
    dispose: function () {
        // Cleanup
        this.popovers.clear();
    }
};
```

## Interfața IFodPopoverService

```csharp
public interface IFodPopoverService
{
    FodPopoverHandler Register(RenderFragment fragment);
    Task<bool> Unregister(FodPopoverHandler handler);
    IEnumerable<FodPopoverHandler> Handlers { get; }
    Task InitializeIfNeeded();
    event EventHandler FragmentsChanged;
}
```

## Clase asociate

### FodPopoverHandler

Reprezintă un handler pentru un popover individual.

**Proprietăți:**
- `Id: Guid` - Identificator unic
- `Fragment: RenderFragment` - Conținutul de randat
- `IsConnected: bool` - Indică dacă este conectat la DOM
- `Class: string` - Clase CSS
- `Style: string` - Stiluri inline
- `Tag: object` - Tag personalizat
- `ShowContent: bool` - Indică dacă conținutul este vizibil
- `UserAttributes: Dictionary<string, object>` - Atribute utilizator

**Metode:**
- `Initialize()` - Inițializează conexiunea cu JS
- `Detach()` - Deconectează de la JS
- `UpdateFragment()` - Actualizează conținutul
- `SetComponentBaseParameters()` - Setează parametrii de bază

### PopoverOptions

```csharp
public class PopoverOptions
{
    public string ContainerClass { get; set; } = "fod-popover-container";
    public int FlipMargin { get; set; } = 5;
}
```

## Metode disponibile

### Register

Înregistrează un nou popover.

**Parametri:**
- `fragment: RenderFragment` - Conținutul popover-ului

**Returnează:** `FodPopoverHandler` - Handler pentru gestionarea popover-ului

### Unregister

Dezînregistrează un popover existent.

**Parametri:**
- `handler: FodPopoverHandler` - Handler-ul de dezînregistrat

**Returnează:** `Task<bool>` - True dacă dezînregistrarea a reușit

### InitializeIfNeeded

Inițializează serviciul dacă nu a fost deja inițializat.

**Parametri:** Niciun parametru

**Returnează:** `Task` - Task pentru așteptarea inițializării

## Evenimente

### FragmentsChanged

Declanșat când lista de fragmente se modifică (adăugare/ștergere).

## Exemple de utilizare

### Utilizare de bază cu FodPopover

```razor
@inject IFodPopoverService PopoverService

<FodPopover>
    <ActivatorContent>
        <FodButton>Deschide Popover</FodButton>
    </ActivatorContent>
    <ChildContent>
        <div class="popover-content">
            <h5>Titlu Popover</h5>
            <p>Conținut popover</p>
        </div>
    </ChildContent>
</FodPopover>

@code {
    // FodPopover folosește intern PopoverService
}
```

### Gestionare manuală popover

```razor
@inject IFodPopoverService PopoverService
@implements IDisposable

<div @ref="anchorElement" @onclick="TogglePopover">
    Click pentru popover
</div>

@code {
    private ElementReference anchorElement;
    private FodPopoverHandler popoverHandler;
    private bool isOpen = false;

    private async Task TogglePopover()
    {
        if (!isOpen)
        {
            // Înregistrare popover
            popoverHandler = PopoverService.Register(
                @<div class="custom-popover">
                    <h6>Popover Manual</h6>
                    <p>Conținut gestionat manual</p>
                    <FodButton Size="FodSize.Small" @onclick="ClosePopover">
                        Închide
                    </FodButton>
                </div>
            );
            
            await popoverHandler.Initialize();
            isOpen = true;
        }
        else
        {
            await ClosePopover();
        }
    }

    private async Task ClosePopover()
    {
        if (popoverHandler != null)
        {
            await PopoverService.Unregister(popoverHandler);
            popoverHandler = null;
            isOpen = false;
        }
    }

    public void Dispose()
    {
        _ = ClosePopover();
    }
}
```

### Service pentru tooltip-uri globale

```csharp
public class TooltipService
{
    private readonly IFodPopoverService _popoverService;
    private readonly Dictionary<string, FodPopoverHandler> _tooltips = new();

    public TooltipService(IFodPopoverService popoverService)
    {
        _popoverService = popoverService;
    }

    public async Task<string> ShowTooltip(RenderFragment content, TooltipOptions options)
    {
        var tooltipId = Guid.NewGuid().ToString();
        
        var handler = _popoverService.Register(builder =>
        {
            builder.OpenElement(0, "div");
            builder.AddAttribute(1, "class", $"tooltip {options.Class}");
            builder.AddAttribute(2, "style", options.Style);
            builder.AddContent(3, content);
            builder.CloseElement();
        });

        await handler.Initialize();
        _tooltips[tooltipId] = handler;
        
        return tooltipId;
    }

    public async Task HideTooltip(string tooltipId)
    {
        if (_tooltips.TryGetValue(tooltipId, out var handler))
        {
            await _popoverService.Unregister(handler);
            _tooltips.Remove(tooltipId);
        }
    }

    public async Task HideAllTooltips()
    {
        foreach (var handler in _tooltips.Values)
        {
            await _popoverService.Unregister(handler);
        }
        _tooltips.Clear();
    }
}
```

### Popover cu actualizare dinamică

```razor
@inject IFodPopoverService PopoverService

<div class="user-card" @onclick="ShowUserDetails">
    <img src="@user.Avatar" />
    <span>@user.Name</span>
</div>

@code {
    [Parameter] public UserModel user { get; set; }
    
    private FodPopoverHandler userPopover;
    private UserDetails userDetails;
    private bool isLoading = true;

    private async Task ShowUserDetails()
    {
        // Înregistrare popover cu loading
        userPopover = PopoverService.Register(BuildPopoverContent());
        await userPopover.Initialize();
        
        // Încărcare date asincron
        userDetails = await LoadUserDetails(user.Id);
        isLoading = false;
        
        // Actualizare conținut
        userPopover.UpdateFragment(BuildPopoverContent(), this, "user-details-popover", "", true);
    }

    private RenderFragment BuildPopoverContent() => builder =>
    {
        if (isLoading)
        {
            builder.OpenComponent<FodLoadingCircular>(0);
            builder.CloseComponent();
        }
        else
        {
            builder.OpenElement(0, "div");
            builder.AddAttribute(1, "class", "user-details");
            
            builder.OpenElement(2, "h5");
            builder.AddContent(3, userDetails.FullName);
            builder.CloseElement();
            
            builder.OpenElement(4, "p");
            builder.AddContent(5, userDetails.Email);
            builder.CloseElement();
            
            builder.OpenElement(6, "p");
            builder.AddContent(7, userDetails.Department);
            builder.CloseElement();
            
            builder.CloseElement();
        }
    };
}
```

## Integrare cu FodPopoverProvider

```razor
<!-- În MainLayout.razor sau App.razor -->
<FodPopoverProvider />

@code {
    // FodPopoverProvider gestionează randarea tuturor popover-urilor înregistrate
}
```

## Tratare erori

### Service cu logging

```csharp
public class LoggingPopoverService : IFodPopoverService
{
    private readonly FodPopoverService _innerService;
    private readonly ILogger<LoggingPopoverService> _logger;

    public FodPopoverHandler Register(RenderFragment fragment)
    {
        _logger.LogDebug("Înregistrare popover nou");
        var handler = _innerService.Register(fragment);
        _logger.LogDebug("Popover înregistrat cu ID: {PopoverId}", handler.Id);
        return handler;
    }

    public async Task<bool> Unregister(FodPopoverHandler handler)
    {
        _logger.LogDebug("Dezînregistrare popover: {PopoverId}", handler?.Id);
        try
        {
            return await _innerService.Unregister(handler);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Eroare la dezînregistrarea popover: {PopoverId}", handler?.Id);
            return false;
        }
    }
}
```

## Note tehnice

1. **Thread-safe initialization** - Folosește SemaphoreSlim pentru inițializare sigură
2. **Event-driven updates** - Notifică schimbările prin evenimente
3. **JS interop** - Necesită funcții JavaScript pentru positioning
4. **Memory management** - Important să dezînregistrați popover-urile nefolosite
5. **Render fragments** - Gestionează RenderFragment pentru conținut dinamic

## Bune practici

1. **Lifecycle management** - Dezînregistrați popover-urile în Dispose
2. **Avoid memory leaks** - Nu păstrați referințe la handlers după unregister
3. **Error handling** - Gestionați TaskCanceledException la dispose
4. **Performance** - Limitați numărul de popover-uri active simultan
5. **Accessibility** - Asigurați navigare cu tastatura pentru popover-uri
6. **Mobile support** - Testați comportamentul pe dispozitive touch

## Concluzie

FodPopoverService oferă o infrastructură robustă pentru gestionarea popover-urilor în aplicații Blazor. Cu suport pentru actualizări dinamice, gestionare centralizată și integrare JavaScript pentru positioning avansat, serviciul facilitează crearea de interfețe utilizator interactive și informative.