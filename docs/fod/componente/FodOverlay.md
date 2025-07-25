# Overlay

## Documentație pentru componenta FodOverlay

### 1. Descriere Generală
`FodOverlay` este componenta pentru afișarea unui strat suprapus peste conținutul paginii, utilizată pentru a crea efecte de fundal, loading states, modals sau pentru a bloca interacțiunea cu interfața. Componenta oferă control complet asupra vizibilității, culorii fundalului și blocării scroll-ului.

Caracteristici principale:
- Fundal semi-transparent personalizabil
- Blocare automată a scroll-ului
- Suport pentru poziționare absolută sau fixă
- Auto-închidere la click
- Control z-index
- Integrare cu sistemul de comenzi
- Lifecycle management pentru scroll
- Suport pentru conținut personalizat

### 2. Ghid de Utilizare API

#### Overlay simplu
```razor
<FodButton Variant="FodVariant.Filled" 
           Color="FodColor.Primary" 
           OnClick="@(() => showOverlay = true)">
    Afișează Overlay
</FodButton>

<FodOverlay @bind-Visible="showOverlay" 
            DarkBackground="true" 
            AutoClose="true" />

@code {
    private bool showOverlay = false;
}
```

#### Overlay cu conținut personalizat
```razor
<FodOverlay @bind-Visible="isLoading" DarkBackground="true">
    <div class="d-flex flex-column align-items-center">
        <FodProgressCircular Color="FodColor.Secondary" 
                            Indeterminate="true" 
                            Size="FodSize.Large" />
        <FodText Typo="Typo.h6" Color="FodColor.White" Class="mt-4">
            Se încarcă datele...
        </FodText>
    </div>
</FodOverlay>

@code {
    private bool isLoading = false;
    
    private async Task LoadData()
    {
        isLoading = true;
        await DataService.LoadAsync();
        isLoading = false;
    }
}
```

#### Overlay absolut pentru containere
```razor
<FodCard Style="position: relative; height: 300px;">
    <FodCardContent>
        <FodText Typo="Typo.h5">Card cu loading overlay</FodText>
        <FodText Typo="Typo.body2">
            Acest card are un overlay absolut care acoperă doar cardul.
        </FodText>
    </FodCardContent>
    
    @if (isCardLoading)
    {
        <FodOverlay Visible="true" 
                    DarkBackground="true" 
                    Absolute="true">
            <FodProgressCircular Color="FodColor.Primary" 
                                Indeterminate="true" />
        </FodOverlay>
    }
</FodCard>
```

#### Overlay cu fundal light
```razor
<FodOverlay @bind-Visible="showLightOverlay" 
            LightBackground="true" 
            AutoClose="true">
    <FodPaper Elevation="8" Class="pa-4">
        <FodText Typo="Typo.h6" GutterBottom="true">
            Notificare
        </FodText>
        <FodText Typo="Typo.body2" GutterBottom="true">
            Aceasta este o notificare importantă cu fundal light.
        </FodText>
        <FodButton Color="FodColor.Primary" 
                   OnClick="@(() => showLightOverlay = false)">
            Închide
        </FodButton>
    </FodPaper>
</FodOverlay>
```

#### Overlay cu z-index personalizat
```razor
<!-- Overlay de bază -->
<FodOverlay @bind-Visible="baseOverlay" 
            DarkBackground="true" 
            ZIndex="1000">
    <FodText Color="FodColor.White">Overlay de bază (z-index: 1000)</FodText>
</FodOverlay>

<!-- Overlay deasupra -->
<FodOverlay @bind-Visible="topOverlay" 
            DarkBackground="true" 
            ZIndex="1100">
    <FodText Color="FodColor.White">Overlay deasupra (z-index: 1100)</FodText>
</FodOverlay>
```

#### Loading state pentru întreaga pagină
```razor
@if (pageLoading)
{
    <FodOverlay Visible="true" DarkBackground="true">
        <div class="d-flex flex-column align-items-center">
            <FodProgressCircular Color="FodColor.Secondary" 
                                Indeterminate="true" 
                                Size="FodSize.Large" />
            <FodText Typo="Typo.h6" Color="FodColor.White" Class="mt-4">
                Procesăm cererea dumneavoastră...
            </FodText>
            <FodText Typo="Typo.body2" Color="FodColor.White" Class="mt-2">
                Vă rugăm așteptați
            </FodText>
        </div>
    </FodOverlay>
}

@code {
    private bool pageLoading = false;
    
    private async Task ProcessRequest()
    {
        pageLoading = true;
        StateHasChanged();
        
        try
        {
            await ProcessService.ExecuteAsync();
        }
        finally
        {
            pageLoading = false;
            StateHasChanged();
        }
    }
}
```

#### Overlay fără blocare scroll
```razor
<FodOverlay @bind-Visible="showOverlay" 
            DarkBackground="true" 
            LockScroll="false">
    <FodAlert Severity="Severity.Warning" Class="ma-4">
        <FodAlertTitle>Atenție</FodAlertTitle>
        Puteți continua să navigați în timp ce acest mesaj este afișat.
    </FodAlert>
</FodOverlay>
```

#### Overlay cu handler onClick
```razor
<FodOverlay Visible="showMenu" 
            AutoClose="false"
            OnClick="HandleOverlayClick">
    <FodList Class="bg-white" Style="width: 200px;">
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
</FodOverlay>

@code {
    private bool showMenu = false;
    
    private void HandleOverlayClick(MouseEventArgs e)
    {
        // Click pe overlay (nu pe conținut)
        showMenu = false;
    }
    
    private void SelectOption(int option)
    {
        Console.WriteLine($"Selected option: {option}");
        showMenu = false;
    }
}
```

#### Loading overlay pentru formular
```razor
<FodForm @ref="form" Model="@model" Style="position: relative;">
    <FodCardContent>
        <FodGrid Container="true" Spacing="2">
            <FodGrid Item="true" xs="12">
                <FodTextField @bind-Value="model.Name" 
                             Label="Nume" 
                             Required="true" />
            </FodGrid>
            <FodGrid Item="true" xs="12">
                <FodTextField @bind-Value="model.Email" 
                             Label="Email" 
                             Required="true" />
            </FodGrid>
        </FodGrid>
    </FodCardContent>
    <FodCardActions>
        <FodButton Variant="FodVariant.Text">Anulează</FodButton>
        <FodButton Variant="FodVariant.Filled" 
                   Color="FodColor.Primary"
                   OnClick="Submit">
            Salvează
        </FodButton>
    </FodCardActions>
    
    @if (isSubmitting)
    {
        <FodOverlay Visible="true" 
                    DarkBackground="true" 
                    Absolute="true">
            <FodProgressCircular Color="FodColor.Primary" 
                                Indeterminate="true" />
        </FodOverlay>
    }
</FodForm>

@code {
    private FodForm form;
    private UserModel model = new();
    private bool isSubmitting = false;
    
    private async Task Submit()
    {
        if (await form.ValidateAsync())
        {
            isSubmitting = true;
            await UserService.SaveAsync(model);
            isSubmitting = false;
        }
    }
}
```

#### Overlay pentru imagini (lightbox simplu)
```razor
<FodGrid Container="true" Spacing="2">
    @foreach (var image in images)
    {
        <FodGrid Item="true" xs="12" sm="6" md="4">
            <FodImage Src="@image.Thumbnail" 
                     Alt="@image.Title"
                     Style="cursor: pointer;"
                     OnClick="@(() => ShowFullImage(image))" />
        </FodGrid>
    }
</FodGrid>

<FodOverlay @bind-Visible="showFullImage" 
            DarkBackground="true" 
            AutoClose="true">
    @if (selectedImage != null)
    {
        <div class="d-flex flex-column align-items-center">
            <FodImage Src="@selectedImage.FullSize" 
                     Alt="@selectedImage.Title"
                     Style="max-width: 90vw; max-height: 90vh;" />
            <FodText Typo="Typo.h6" Color="FodColor.White" Class="mt-3">
                @selectedImage.Title
            </FodText>
        </div>
    }
</FodOverlay>

@code {
    private List<ImageModel> images = new();
    private bool showFullImage = false;
    private ImageModel selectedImage;
    
    private void ShowFullImage(ImageModel image)
    {
        selectedImage = image;
        showFullImage = true;
    }
}
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Visible` | `bool` | Controlează vizibilitatea overlay-ului | `false` |
| `VisibleChanged` | `EventCallback<bool>` | Callback pentru schimbarea vizibilității | - |
| `AutoClose` | `bool` | Închide overlay la click | `false` |
| `LockScroll` | `bool` | Blochează scroll-ul paginii | `true` |
| `LockScrollClass` | `string` | Clasa CSS pentru blocare scroll | `"scroll-locked"` |
| `DarkBackground` | `bool` | Aplică fundal întunecat | `false` |
| `LightBackground` | `bool` | Aplică fundal deschis | `false` |
| `Absolute` | `bool` | Poziționare absolută în container | `false` |
| `ZIndex` | `int` | Valoarea z-index | `5` |
| `OnClick` | `EventCallback<MouseEventArgs>` | Handler pentru click pe overlay | - |
| `Command` | `ICommand` | Comandă executată la click | `null` |
| `CommandParameter` | `object` | Parametru pentru comandă | `null` |
| `ChildContent` | `RenderFragment` | Conținutul overlay-ului | `null` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |

### 4. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `VisibleChanged` | `EventCallback<bool>` | Se declanșează când se schimbă vizibilitatea |
| `OnClick` | `EventCallback<MouseEventArgs>` | Se declanșează la click pe overlay |

### 5. Metode publice

Componenta nu expune metode publice, fiind controlată prin proprietăți.

### 6. Stilizare și personalizare

```css
/* Overlay cu gradient */
.gradient-overlay .fod-overlay-scrim {
    background: linear-gradient(45deg, 
        rgba(63, 81, 181, 0.8), 
        rgba(233, 30, 99, 0.8));
}

/* Overlay cu blur */
.blur-overlay {
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
}

/* Animație fade-in */
.animated-overlay {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Overlay cu pattern */
.pattern-overlay .fod-overlay-scrim {
    background-image: 
        repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0, 0, 0, 0.1) 10px,
            rgba(0, 0, 0, 0.1) 20px
        );
}

/* Content centrat cu animație */
.fod-overlay-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
```

### 7. Integrare cu alte componente

#### Cu Dialog
```razor
<FodOverlay @bind-Visible="showDialogOverlay" 
            DarkBackground="true"
            ZIndex="1290">
    <FodDialog Open="true" MaxWidth="MaxWidth.Small" FullWidth="true">
        <FodDialogTitle>
            Confirmare
        </FodDialogTitle>
        <FodDialogContent>
            <FodText>Sunteți sigur că doriți să continuați?</FodText>
        </FodDialogContent>
        <FodDialogActions>
            <FodButton OnClick="@(() => showDialogOverlay = false)">
                Anulează
            </FodButton>
            <FodButton Color="FodColor.Primary" Variant="FodVariant.Filled">
                Confirmă
            </FodButton>
        </FodDialogActions>
    </FodDialog>
</FodOverlay>
```

#### Cu Drawer
```razor
<!-- Overlay pentru drawer -->
<FodOverlay Visible="@drawerOpen" 
            DarkBackground="true"
            OnClick="@(() => drawerOpen = false)"
            ZIndex="1200" />

<FodDrawer @bind-Open="drawerOpen" 
           Anchor="Anchor.Left"
           Variant="DrawerVariant.Temporary"
           Style="z-index: 1201;">
    <!-- Drawer content -->
</FodDrawer>
```

#### Cu Loading states
```razor
<FodDataTable Items="@items" 
              Loading="@loading"
              Style="position: relative;">
    <HeaderContent>
        <!-- Table headers -->
    </HeaderContent>
    <RowTemplate>
        <!-- Row template -->
    </RowTemplate>
    
    @if (loading)
    {
        <FodOverlay Visible="true" 
                    LightBackground="true" 
                    Absolute="true">
            <FodProgressLinear Color="FodColor.Primary" 
                              Indeterminate="true" />
        </FodOverlay>
    }
</FodDataTable>
```

### 8. Patterns comune

#### Loading service global
```csharp
public interface ILoadingService
{
    event Action OnChange;
    bool IsLoading { get; }
    void Show(string message = null);
    void Hide();
}

public class LoadingService : ILoadingService
{
    public event Action OnChange;
    public bool IsLoading { get; private set; }
    public string Message { get; private set; }
    
    public void Show(string message = null)
    {
        IsLoading = true;
        Message = message;
        OnChange?.Invoke();
    }
    
    public void Hide()
    {
        IsLoading = false;
        Message = null;
        OnChange?.Invoke();
    }
}

// În MainLayout.razor
@implements IDisposable
@inject ILoadingService LoadingService

<FodOverlay Visible="@LoadingService.IsLoading" 
            DarkBackground="true">
    <div class="d-flex flex-column align-items-center">
        <FodProgressCircular Color="FodColor.Secondary" 
                            Indeterminate="true" />
        @if (!string.IsNullOrEmpty(LoadingService.Message))
        {
            <FodText Typo="Typo.body1" Color="FodColor.White" Class="mt-3">
                @LoadingService.Message
            </FodText>
        }
    </div>
</FodOverlay>

@code {
    protected override void OnInitialized()
    {
        LoadingService.OnChange += StateHasChanged;
    }
    
    public void Dispose()
    {
        LoadingService.OnChange -= StateHasChanged;
    }
}
```

#### Overlay cu timeout
```razor
<FodOverlay @bind-Visible="showTemporaryOverlay" 
            DarkBackground="true">
    <FodAlert Severity="Severity.Success" Class="ma-4">
        <FodAlertTitle>Succes!</FodAlertTitle>
        Operațiunea a fost finalizată cu succes.
    </FodAlert>
</FodOverlay>

@code {
    private bool showTemporaryOverlay = false;
    private CancellationTokenSource cts;
    
    private async Task ShowSuccessMessage()
    {
        showTemporaryOverlay = true;
        
        cts?.Cancel();
        cts = new CancellationTokenSource();
        
        try
        {
            await Task.Delay(3000, cts.Token);
            showTemporaryOverlay = false;
        }
        catch (TaskCanceledException)
        {
            // Anulat - un nou mesaj a fost afișat
        }
    }
}
```

### 9. Considerații de performanță

1. **Scroll Lock Management** - Componenta gestionează automat blocarea/deblocarea scroll-ului
2. **Dispose Pattern** - Implementează IDisposable pentru cleanup corect
3. **Event Propagation** - Folosește `@onclick:stopPropagation` pentru a preveni bubble-up
4. **Conditional Rendering** - Overlay-ul este randat doar când este vizibil

### 10. Accesibilitate

- Overlay-ul blochează interacțiunea cu conținutul de dedesubt
- Pentru overlay-uri modale, considerați adăugarea de atribute ARIA
- Asigurați contrast suficient pentru conținutul afișat peste overlay
- Oferiți modalități de închidere pentru utilizatorii de tastatură

### 11. Bune practici

1. **Loading States** - Folosiți overlay pentru loading states consistente
2. **Z-Index Management** - Gestionați z-index pentru overlay-uri multiple
3. **Scroll Lock** - Activați doar când este necesar (modal-uri, meniuri)
4. **Auto Close** - Activați pentru overlay-uri dismissible
5. **Absolute vs Fixed** - Folosiți Absolute pentru containere specifice
6. **Cleanup** - Asigurați-vă că overlay-ul este închis la navigare

### 12. Troubleshooting

#### Overlay-ul nu acoperă întreaga pagină
- Verificați că nu folosiți `Absolute="true"`
- Verificați că părintele nu are `position: relative`
- Verificați z-index-ul

#### Scroll-ul nu este blocat
- Verificați că `LockScroll="true"`
- Verificați că nu folosiți `Absolute="true"`
- Verificați că clasa CSS există

#### Conținutul nu este centrat
- Overlay-ul centrează automat conținutul
- Verificați CSS-ul personalizat

### 13. Exemple avansate

#### Overlay cu tranziții personalizate
```razor
@if (showAnimatedOverlay)
{
    <FodOverlay Visible="true" 
                DarkBackground="true"
                Class="@($"animated-overlay {(closing ? "closing" : "")}")"
                OnClick="CloseWithAnimation">
        <div class="content-scale">
            <FodPaper Elevation="8" Class="pa-4">
                <FodText Typo="Typo.h5">Conținut animat</FodText>
            </FodPaper>
        </div>
    </FodOverlay>
}

<style>
    .animated-overlay {
        animation: fadeIn 0.3s ease-out;
    }
    
    .animated-overlay.closing {
        animation: fadeOut 0.3s ease-out;
    }
    
    .content-scale {
        animation: scaleIn 0.3s ease-out;
    }
    
    .closing .content-scale {
        animation: scaleOut 0.3s ease-out;
    }
    
    @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes scaleOut {
        from { transform: scale(1); opacity: 1; }
        to { transform: scale(0.8); opacity: 0; }
    }
</style>

@code {
    private bool showAnimatedOverlay = false;
    private bool closing = false;
    
    private async Task CloseWithAnimation()
    {
        closing = true;
        await Task.Delay(300);
        showAnimatedOverlay = false;
        closing = false;
    }
}
```

#### Overlay stack management
```razor
@foreach (var overlay in overlayStack)
{
    <FodOverlay @key="overlay.Id"
                Visible="true"
                DarkBackground="@(overlay == overlayStack.Last())"
                ZIndex="@(1000 + overlayStack.IndexOf(overlay) * 100)"
                OnClick="@(() => CloseOverlay(overlay.Id))">
        @overlay.Content
    </FodOverlay>
}

@code {
    private List<OverlayItem> overlayStack = new();
    
    private class OverlayItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public RenderFragment Content { get; set; }
    }
    
    private void ShowOverlay(RenderFragment content)
    {
        overlayStack.Add(new OverlayItem { Content = content });
    }
    
    private void CloseOverlay(string id)
    {
        overlayStack.RemoveAll(o => o.Id == id);
    }
}
```

### 14. Concluzie
`FodOverlay` oferă o soluție flexibilă pentru crearea de overlay-uri în aplicații Blazor, cu suport pentru multiple scenarii de utilizare: loading states, backdrop-uri pentru modals, protecție pentru click-uri nedorite și efecte vizuale. Componenta gestionează automat aspectele tehnice precum blocarea scroll-ului și oferă control complet asupra comportamentului și stilizării.