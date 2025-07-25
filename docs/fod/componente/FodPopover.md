# Popover

## Documentație pentru componentele FodPopover și FodPopoverProvider

### 1. Descriere Generală
Sistemul Popover din FOD oferă o infrastructură completă pentru afișarea conținutului flotant poziționat relativ la un element ancoră. Sistemul este format din două componente principale:

- **FodPopover** - Componenta principală pentru definirea popover-ului
- **FodPopoverProvider** - Provider global care gestionează toate popover-urile din aplicație

Caracteristici principale:
- Poziționare inteligentă cu overflow behavior
- Suport pentru multiple origini de ancorare
- Animații fluide cu durată și întârziere configurabile
- Paper styling cu elevație personalizabilă
- Suport pentru lățime relativă la părinte
- Management centralizat prin service
- Integrare cu JSInterop pentru poziționare precisă
- Suport RTL (Right-to-Left)

### 2. Configurare inițială

#### Adăugarea FodPopoverProvider
```razor
<!-- În MainLayout.razor sau App.razor -->
<FodPopoverProvider />

@Body
```

#### Înregistrarea serviciului
```csharp
// În Program.cs
builder.Services.AddFodComponents();
// sau specific pentru popover
builder.Services.AddScoped<IFodPopoverService, FodPopoverService>();
```

### 3. Ghid de Utilizare API

#### Popover simplu
```razor
<div style="position: relative;">
    <FodButton @onclick="@(() => showPopover = !showPopover)">
        Deschide Popover
    </FodButton>
    
    <FodPopover Open="@showPopover">
        <FodPaper Class="pa-4">
            <FodText>Acesta este conținutul popover-ului</FodText>
        </FodPaper>
    </FodPopover>
</div>

@code {
    private bool showPopover = false;
}
```

#### Popover cu poziționare personalizată
```razor
<div style="position: relative; display: inline-block;">
    <FodButton @onclick="TogglePopover">
        Popover cu poziționare
    </FodButton>
    
    <FodPopover Open="@isOpen"
                AnchorOrigin="Origin.BottomCenter"
                TransformOrigin="Origin.TopCenter">
        <FodList Class="py-0" Style="min-width: 200px;">
            <FodListItem Button="true" OnClick="@(() => SelectOption(1))">
                <FodListItemText Primary="Opțiunea 1" />
            </FodListItem>
            <FodListItem Button="true" OnClick="@(() => SelectOption(2))">
                <FodListItemText Primary="Opțiunea 2" />
            </FodListItem>
            <FodListItem Button="true" OnClick="@(() => SelectOption(3))">
                <FodListItemText Primary="Opțiunea 3" />
            </FodListItem>
        </FodList>
    </FodPopover>
</div>

@code {
    private bool isOpen = false;
    
    private void TogglePopover() => isOpen = !isOpen;
    
    private void SelectOption(int option)
    {
        Console.WriteLine($"Selected: {option}");
        isOpen = false;
    }
}
```

#### Popover cu overflow behavior
```razor
<div style="position: relative;">
    <FodIconButton Icon="@FodIcons.Material.Filled.MoreVert"
                   @onclick="@(() => showMenu = !showMenu)" />
    
    <FodPopover Open="@showMenu"
                AnchorOrigin="Origin.TopRight"
                TransformOrigin="Origin.TopLeft"
                OverflowBehavior="OverflowBehavior.FlipAlways">
        <FodPaper Elevation="8" Class="pa-2" Style="min-width: 150px;">
            <FodList Dense="true">
                <FodListItem Button="true" OnClick="Edit">
                    <FodListItemIcon>
                        <FodIcon Icon="@FodIcons.Material.Filled.Edit" />
                    </FodListItemIcon>
                    <FodListItemText Primary="Editează" />
                </FodListItem>
                <FodListItem Button="true" OnClick="Delete">
                    <FodListItemIcon>
                        <FodIcon Icon="@FodIcons.Material.Filled.Delete" />
                    </FodListItemIcon>
                    <FodListItemText Primary="Șterge" />
                </FodListItem>
            </FodList>
        </FodPaper>
    </FodPopover>
</div>
```

#### Popover cu animații personalizate
```razor
<FodPopover Open="@showAnimated"
            Duration="400"
            Delay="100"
            AnchorOrigin="Origin.BottomLeft"
            TransformOrigin="Origin.TopLeft">
    <FodCard Style="width: 300px;">
        <FodCardContent>
            <FodText Typo="Typo.h6" GutterBottom="true">
                Notificare animată
            </FodText>
            <FodText Typo="Typo.body2">
                Acest popover apare cu o animație personalizată.
            </FodText>
        </FodCardContent>
        <FodCardActions>
            <FodButton Color="FodColor.Primary" OnClick="@(() => showAnimated = false)">
                Închide
            </FodButton>
        </FodCardActions>
    </FodCard>
</FodPopover>
```

#### Popover cu lățime relativă
```razor
<div style="position: relative; width: 400px;">
    <FodTextField Label="Caută"
                  @bind-Value="searchText"
                  @onfocus="@(() => showResults = true)"
                  @onblur="@(() => showResults = false)" />
    
    <FodPopover Open="@showResults"
                RelativeWidth="true"
                AnchorOrigin="Origin.BottomLeft"
                TransformOrigin="Origin.TopLeft"
                MaxHeight="300">
        <FodPaper>
            <FodList>
                @foreach (var result in SearchResults)
                {
                    <FodListItem Button="true">
                        <FodListItemText Primary="@result" />
                    </FodListItem>
                }
            </FodList>
        </FodPaper>
    </FodPopover>
</div>

@code {
    private string searchText = "";
    private bool showResults = false;
    private List<string> SearchResults = new()
    {
        "Rezultat 1",
        "Rezultat 2",
        "Rezultat 3"
    };
}
```

#### Popover fix (pentru modal-uri)
```razor
<FodPopover Open="@showFixed"
            Fixed="true"
            Paper="true"
            Elevation="24"
            AnchorOrigin="Origin.CenterCenter"
            TransformOrigin="Origin.CenterCenter">
    <div style="width: 400px; max-width: 90vw;">
        <FodDialogTitle>
            Dialog în Popover
        </FodDialogTitle>
        <FodDialogContent>
            <FodText>
                Acest popover folosește poziționare fixă și este centrat pe ecran.
            </FodText>
        </FodDialogContent>
        <FodDialogActions>
            <FodButton OnClick="@(() => showFixed = false)">Anulează</FodButton>
            <FodButton Color="FodColor.Primary" Variant="FodVariant.Filled">
                Confirmă
            </FodButton>
        </FodDialogActions>
    </div>
</FodPopover>
```

#### Meniu contextual cu popover
```razor
<div @oncontextmenu="ShowContextMenu" 
     @oncontextmenu:preventDefault="true"
     style="position: relative; padding: 40px; border: 1px dashed #ccc;">
    <FodText>Click dreapta pentru meniu contextual</FodText>
    
    <FodPopover Open="@showContext"
                AnchorOrigin="Origin.TopLeft"
                TransformOrigin="Origin.TopLeft"
                Style="@($"position: fixed; left: {mouseX}px; top: {mouseY}px;")">
        <FodPaper Elevation="8">
            <FodList Dense="true" Style="min-width: 180px;">
                <FodListItem Button="true" OnClick="Copy">
                    <FodListItemIcon>
                        <FodIcon Icon="@FodIcons.Material.Filled.ContentCopy" />
                    </FodListItemIcon>
                    <FodListItemText Primary="Copiază" />
                </FodListItem>
                <FodListItem Button="true" OnClick="Paste">
                    <FodListItemIcon>
                        <FodIcon Icon="@FodIcons.Material.Filled.ContentPaste" />
                    </FodListItemIcon>
                    <FodListItemText Primary="Lipește" />
                </FodListItem>
                <FodDivider />
                <FodListItem Button="true" OnClick="Delete">
                    <FodListItemIcon>
                        <FodIcon Icon="@FodIcons.Material.Filled.Delete" Color="FodColor.Error" />
                    </FodListItemIcon>
                    <FodListItemText Primary="Șterge" PrimaryTypographyProps="@(new { Color = FodColor.Error })" />
                </FodListItem>
            </FodList>
        </FodPaper>
    </FodPopover>
</div>

@code {
    private bool showContext = false;
    private double mouseX = 0;
    private double mouseY = 0;
    
    private void ShowContextMenu(MouseEventArgs e)
    {
        mouseX = e.ClientX;
        mouseY = e.ClientY;
        showContext = true;
    }
}
```

#### Popover cu formular
```razor
<div style="position: relative;">
    <FodIconButton Icon="@FodIcons.Material.Filled.PersonAdd"
                   Color="FodColor.Primary"
                   @onclick="@(() => showAddUser = !showAddUser)" />
    
    <FodPopover Open="@showAddUser"
                AnchorOrigin="Origin.BottomRight"
                TransformOrigin="Origin.TopRight"
                Paper="true"
                Elevation="8">
        <FodForm Style="width: 300px;" Class="pa-4">
            <FodText Typo="Typo.h6" GutterBottom="true">
                Adaugă utilizator
            </FodText>
            
            <FodTextField Label="Nume"
                         @bind-Value="newUser.Name"
                         FullWidth="true"
                         Margin="Margin.Dense" />
            
            <FodTextField Label="Email"
                         @bind-Value="newUser.Email"
                         Type="InputType.Email"
                         FullWidth="true"
                         Margin="Margin.Dense"
                         Class="mt-3" />
            
            <FodSelect T="string"
                      Label="Rol"
                      @bind-Value="newUser.Role"
                      FullWidth="true"
                      Margin="Margin.Dense"
                      Class="mt-3">
                <FodSelectItem Value="@("admin")">Administrator</FodSelectItem>
                <FodSelectItem Value="@("user")">Utilizator</FodSelectItem>
                <FodSelectItem Value="@("guest")">Vizitator</FodSelectItem>
            </FodSelect>
            
            <div class="d-flex justify-end mt-4 gap-2">
                <FodButton OnClick="@(() => showAddUser = false)">
                    Anulează
                </FodButton>
                <FodButton Color="FodColor.Primary" 
                          Variant="FodVariant.Filled"
                          OnClick="SaveUser">
                    Salvează
                </FodButton>
            </div>
        </FodForm>
    </FodPopover>
</div>

@code {
    private bool showAddUser = false;
    private UserModel newUser = new();
    
    private void SaveUser()
    {
        // Salvare utilizator
        showAddUser = false;
        newUser = new();
    }
}
```

### 4. Atribute disponibile

#### FodPopover

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Open` | `bool` | Controlează vizibilitatea popover-ului | `false` |
| `Paper` | `bool` | Aplică stiluri FodPaper | `true` |
| `Elevation` | `int` | Nivelul umbrei (0-24) | `8` |
| `Square` | `bool` | Elimină border-radius | `false` |
| `Fixed` | `bool` | Folosește position fixed în loc de absolute | `false` |
| `Duration` | `double` | Durata animației în ms | `251` |
| `Delay` | `double` | Întârziere înainte de animație în ms | `0` |
| `AnchorOrigin` | `Origin` | Punctul de ancorare pe elementul părinte | `TopLeft` |
| `TransformOrigin` | `Origin` | Punctul de transformare pe popover | `TopLeft` |
| `OverflowBehavior` | `OverflowBehavior` | Comportament la overflow | `FlipOnOpen` |
| `RelativeWidth` | `bool` | Popover-ul va avea lățimea părintelui | `false` |
| `MaxHeight` | `int?` | Înălțimea maximă în pixeli | `null` |
| `ChildContent` | `RenderFragment` | Conținutul popover-ului | - |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |
| `UserAttributes` | `Dictionary<string, object>` | Atribute HTML adiționale | `null` |

#### FodPopoverProvider

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `IsEnabled` | `bool` | Activează/dezactivează provider-ul | `true` |

### 5. Enumerări

#### Origin
| Valoare | Descriere |
|---------|-----------|
| `TopLeft` | Colț stânga sus |
| `TopCenter` | Centru sus |
| `TopRight` | Colț dreapta sus |
| `CenterLeft` | Centru stânga |
| `CenterCenter` | Centru |
| `CenterRight` | Centru dreapta |
| `BottomLeft` | Colț stânga jos |
| `BottomCenter` | Centru jos |
| `BottomRight` | Colț dreapta jos |

#### OverflowBehavior
| Valoare | Descriere |
|---------|-----------|
| `None` | Fără logică de overflow |
| `FlipOnOpen` | Schimbă poziția la deschidere dacă nu încape |
| `FlipAlways` | Verifică și schimbă poziția constant |
| `FlipNever` | Nu schimba niciodată poziția |

### 6. Serviciul IFodPopoverService

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

### 7. Stilizare și personalizare

```css
/* Popover cu umbră colorată */
.custom-popover .fod-paper {
    box-shadow: 0 8px 32px rgba(63, 81, 181, 0.15) !important;
}

/* Popover cu animație de scale */
.scale-popover {
    transform-origin: top center;
    animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

/* Popover transparent */
.transparent-popover {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

/* Popover cu bordură */
.bordered-popover .fod-paper {
    border: 2px solid var(--fod-palette-primary-main);
}

/* Popover cu săgeată custom */
.arrow-popover::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white;
}
```

### 8. Integrare cu alte componente

#### În Select/Dropdown
```razor
<div style="position: relative;">
    <FodTextField Label="Selectează"
                  Value="@selectedValue"
                  ReadOnly="true"
                  @onclick="@(() => showSelect = !showSelect)"
                  EndAdornment="@(
                      <FodIcon Icon="@FodIcons.Material.Filled.ArrowDropDown" />
                  )" />
    
    <FodPopover Open="@showSelect"
                RelativeWidth="true"
                AnchorOrigin="Origin.BottomLeft"
                TransformOrigin="Origin.TopLeft">
        <FodList>
            @foreach (var option in options)
            {
                <FodListItem Button="true" OnClick="@(() => Select(option))">
                    <FodListItemText Primary="@option" />
                </FodListItem>
            }
        </FodList>
    </FodPopover>
</div>
```

#### În Tooltip
```razor
@* Tooltip implementat cu Popover *@
<div style="position: relative; display: inline-block;"
     @onmouseenter="@(() => showTooltip = true)"
     @onmouseleave="@(() => showTooltip = false)">
    
    <FodIconButton Icon="@FodIcons.Material.Filled.Info" />
    
    <FodPopover Open="@showTooltip"
                AnchorOrigin="Origin.BottomCenter"
                TransformOrigin="Origin.TopCenter"
                Paper="false"
                Delay="500">
        <div class="fod-tooltip">
            Aceasta este o informație utilă
        </div>
    </FodPopover>
</div>
```

#### În Autocomplete
```razor
<div style="position: relative;">
    <FodTextField Label="Caută țară"
                  @bind-Value="searchCountry"
                  @oninput="OnSearchInput"
                  @onfocus="@(() => showSuggestions = true)" />
    
    <FodPopover Open="@(showSuggestions && filteredCountries.Any())"
                RelativeWidth="true"
                AnchorOrigin="Origin.BottomLeft"
                TransformOrigin="Origin.TopLeft"
                MaxHeight="200">
        <FodList>
            @foreach (var country in filteredCountries)
            {
                <FodListItem Button="true" OnClick="@(() => SelectCountry(country))">
                    <FodListItemText>
                        <HighlightText Text="@country" Highlight="@searchCountry" />
                    </FodListItemText>
                </FodListItem>
            }
        </FodList>
    </FodPopover>
</div>
```

### 9. Patterns comune

#### Popover controlat extern
```razor
@* Componenta părinte *@
<PopoverController @ref="popoverController" />
<FodButton OnClick="@(() => popoverController.Show())">
    Deschide popover controlat
</FodButton>

@* Componenta PopoverController *@
@code {
    private bool isOpen = false;
    
    public void Show() => isOpen = true;
    public void Hide() => isOpen = false;
    public void Toggle() => isOpen = !isOpen;
}

<div style="position: relative;">
    <FodPopover Open="@isOpen">
        <!-- Conținut -->
    </FodPopover>
</div>
```

#### Popover cu închidere la click exterior
```razor
@implements IDisposable
@inject IJSRuntime JS

<div style="position: relative;" @ref="containerRef">
    <FodButton @onclick="TogglePopover">
        Deschide Popover
    </FodButton>
    
    <FodPopover Open="@isOpen">
        <FodPaper Class="pa-4">
            <FodText>Click în afară pentru a închide</FodText>
        </FodPaper>
    </FodPopover>
</div>

@code {
    private ElementReference containerRef;
    private bool isOpen = false;
    private DotNetObjectReference<ComponentName> objRef;
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            objRef = DotNetObjectReference.Create(this);
            await JS.InvokeVoidAsync("registerClickOutside", containerRef, objRef);
        }
    }
    
    [JSInvokable]
    public void ClosePopover()
    {
        isOpen = false;
        StateHasChanged();
    }
    
    private void TogglePopover() => isOpen = !isOpen;
    
    public void Dispose()
    {
        objRef?.Dispose();
    }
}
```

### 10. Considerații de performanță

1. **Lazy Rendering** - Popover-ul randează conținutul doar când este deschis
2. **Portal Pattern** - Conținutul este mutat în FodPopoverProvider pentru evitarea problemelor de z-index
3. **Event Delegation** - Evenimente gestionate eficient la nivel de provider
4. **JSInterop Optimization** - Apeluri JS minimizate și grupate

### 11. Accesibilitate

- Popover-urile trebuie să aibă focus management adecvat
- Folosiți `role="dialog"` pentru popover-uri modale
- Asigurați navigare cu tastatura
- Adăugați `aria-describedby` pentru screen readers

```razor
<FodPopover Open="@isOpen"
            UserAttributes="@(new Dictionary<string, object>
            {
                { "role", "dialog" },
                { "aria-labelledby", "popover-title" }
            })">
    <div>
        <FodText id="popover-title" Typo="Typo.h6">
            Titlu Popover
        </FodText>
        <!-- Conținut -->
    </div>
</FodPopover>
```

### 12. Bune practici

1. **Container Position** - Elementul părinte trebuie să aibă `position: relative`
2. **Z-Index Management** - Folosiți Fixed pentru overlay-uri globale
3. **Memory Leaks** - Implementați Dispose pattern pentru event handlers
4. **Overflow** - Setați OverflowBehavior pentru UI consistent
5. **Animation** - Folosiți durată scurtă (200-300ms) pentru UX optim
6. **Focus Management** - Gestionați focus pentru accesibilitate

### 13. Troubleshooting

#### Popover-ul nu apare
- Verificați că FodPopoverProvider este adăugat
- Verificați că părintele are `position: relative`
- Verificați valoarea proprietății `Open`

#### Poziționare incorectă
- Verificați AnchorOrigin și TransformOrigin
- Verificați OverflowBehavior
- Asigurați-vă că părintele nu are `overflow: hidden`

#### Probleme de z-index
- Folosiți `Fixed="true"` pentru popover-uri globale
- Verificați z-index-ul elementelor părinte

### 14. Exemple avansate

#### Multi-level popover (submeniu)
```razor
<div style="position: relative;">
    <FodButton @onclick="@(() => showMenu = !showMenu)">
        Meniu Multi-nivel
    </FodButton>
    
    <FodPopover Open="@showMenu"
                AnchorOrigin="Origin.BottomLeft"
                TransformOrigin="Origin.TopLeft">
        <FodList Style="min-width: 200px;">
            <FodListItem Button="true">
                <FodListItemText Primary="Opțiune simplă" />
            </FodListItem>
            
            <div style="position: relative;">
                <FodListItem Button="true" 
                            @onmouseenter="@(() => showSubmenu = true)"
                            @onmouseleave="@(() => showSubmenu = false)">
                    <FodListItemText Primary="Cu submeniu" />
                    <FodListItemSecondaryAction>
                        <FodIcon Icon="@FodIcons.Material.Filled.ChevronRight" />
                    </FodListItemSecondaryAction>
                </FodListItem>
                
                <FodPopover Open="@showSubmenu"
                            AnchorOrigin="Origin.TopRight"
                            TransformOrigin="Origin.TopLeft">
                    <FodList Style="min-width: 150px;">
                        <FodListItem Button="true">
                            <FodListItemText Primary="Sub-opțiune 1" />
                        </FodListItem>
                        <FodListItem Button="true">
                            <FodListItemText Primary="Sub-opțiune 2" />
                        </FodListItem>
                    </FodList>
                </FodPopover>
            </div>
        </FodList>
    </FodPopover>
</div>

@code {
    private bool showMenu = false;
    private bool showSubmenu = false;
}
```

#### Popover cu tranziții complexe
```razor
<style>
    .fade-scale-enter {
        opacity: 0;
        transform: scale(0.8);
    }
    
    .fade-scale-enter-active {
        opacity: 1;
        transform: scale(1);
        transition: opacity 300ms, transform 300ms;
    }
    
    .fade-scale-exit {
        opacity: 1;
        transform: scale(1);
    }
    
    .fade-scale-exit-active {
        opacity: 0;
        transform: scale(0.8);
        transition: opacity 300ms, transform 300ms;
    }
</style>

<FodPopover Open="@showAnimated"
            Class="@GetAnimationClass()"
            Duration="300">
    <!-- Conținut animat -->
</FodPopover>

@code {
    private bool showAnimated = false;
    private bool isAnimating = false;
    
    private string GetAnimationClass()
    {
        if (isAnimating)
        {
            return showAnimated ? "fade-scale-enter-active" : "fade-scale-exit-active";
        }
        return showAnimated ? "fade-scale-enter" : "fade-scale-exit";
    }
}
```

### 15. Concluzie
Sistemul Popover din FOD oferă o soluție completă și flexibilă pentru afișarea conținutului flotant în aplicații Blazor. Cu suport pentru poziționare inteligentă, animații fluide și management centralizat, componentele FodPopover și FodPopoverProvider facilitează crearea de interfețe complexe precum meniuri, tooltip-uri, select-uri și dialoguri flotante. Arhitectura bazată pe service asigură performanță optimă și gestionare eficientă a resurselor.