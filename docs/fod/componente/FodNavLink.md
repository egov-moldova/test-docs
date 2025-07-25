# FodNavLink

## Descriere Generală

`FodNavLink` este o componentă specializată pentru crearea link-urilor de navigare în meniuri și bare laterale. Extinde funcționalitatea componentei Blazor `NavLink` cu caracteristici suplimentare precum pictograme, stilizare avansată, suport pentru comandă și integrare perfectă cu sistemul de navigare FOD.

## Caracteristici Principale

- **Integrare NavLink** - Bazată pe componenta Blazor NavLink pentru SPA
- **Highlighting automat** - Marchează automat link-ul activ
- **Pictograme** - Suport pentru pictograme cu culori personalizabile
- **Flexibilitate** - Funcționează atât ca link cât și ca buton
- **Ripple effect** - Animație la interacțiune
- **Accesibilitate** - Suport complet pentru navigare cu tastatura

## Utilizare de Bază

```razor
<FodNavMenu>
    <FodNavLink Href="/" Icon="@FodIcons.Material.Filled.Home">
        Acasă
    </FodNavLink>
    
    <FodNavLink Href="/about" Icon="@FodIcons.Material.Filled.Info">
        Despre noi
    </FodNavLink>
    
    <FodNavLink Href="/contact" Icon="@FodIcons.Material.Filled.ContactMail">
        Contact
    </FodNavLink>
</FodNavMenu>
```

## Atribute și Parametri

| Parametru | Tip | Valoare implicită | Descriere |
|-----------|-----|-------------------|-----------|
| `Href` | `string` | - | URL-ul destinație |
| `Icon` | `string` | - | Pictograma pentru link |
| `IconColor` | `FodColor` | `Default` | Culoarea pictogramei |
| `Match` | `NavLinkMatch` | `Prefix` | Modul de potrivire pentru highlighting |
| `Target` | `string` | - | Target pentru link (_blank, _self, etc.) |
| `ActiveClass` | `string` | `"active"` | Clase CSS când link-ul este activ |
| `Disabled` | `bool` | `false` | Dezactivează link-ul |
| `DisableRipple` | `bool` | `false` | Dezactivează efectul ripple |
| `ForceLoad` | `bool` | `false` | Forțează reîncărcarea completă |
| `OnClick` | `EventCallback<MouseEventArgs>` | - | Eveniment la click |
| `Command` | `ICommand` | - | Comandă pentru pattern MVVM |
| `CommandParameter` | `object` | - | Parametru pentru comandă |
| `ChildContent` | `RenderFragment` | - | Conținutul link-ului |
| `Class` | `string` | - | Clase CSS adiționale |
| `Style` | `string` | - | Stiluri inline |
| `UserAttributes` | `Dictionary<string, object>` | - | Atribute HTML adiționale |

## Exemple de Utilizare

### Navigare Simplă

```razor
<FodNavMenu>
    <FodNavLink Href="/">Acasă</FodNavLink>
    <FodNavLink Href="/products">Produse</FodNavLink>
    <FodNavLink Href="/services">Servicii</FodNavLink>
    <FodNavLink Href="/contact">Contact</FodNavLink>
</FodNavMenu>
```

### Link-uri cu Pictograme și Culori

```razor
<FodNavMenu>
    <FodNavLink Href="/dashboard" 
                Icon="@FodIcons.Material.Filled.Dashboard"
                IconColor="FodColor.Primary">
        Dashboard
    </FodNavLink>
    
    <FodNavLink Href="/reports" 
                Icon="@FodIcons.Material.Filled.Assessment"
                IconColor="FodColor.Success">
        Rapoarte
    </FodNavLink>
    
    <FodNavLink Href="/alerts" 
                Icon="@FodIcons.Material.Filled.Warning"
                IconColor="FodColor.Warning">
        Alerte
    </FodNavLink>
</FodNavMenu>
```

### Match Types pentru Highlighting

```razor
<FodNavMenu>
    <!-- Match exact - doar pentru "/" -->
    <FodNavLink Href="/" Match="NavLinkMatch.All"
                Icon="@FodIcons.Material.Filled.Home">
        Acasă
    </FodNavLink>
    
    <!-- Match prefix - pentru "/products" și sub-rute -->
    <FodNavLink Href="/products" Match="NavLinkMatch.Prefix"
                Icon="@FodIcons.Material.Filled.ShoppingCart">
        Produse
    </FodNavLink>
</FodNavMenu>
```

### Link-uri cu Target

```razor
<FodNavMenu>
    <!-- Link intern -->
    <FodNavLink Href="/internal">
        Pagină internă
    </FodNavLink>
    
    <!-- Link extern în tab nou -->
    <FodNavLink Href="https://example.com" 
                Target="_blank"
                Icon="@FodIcons.Material.Filled.OpenInNew">
        Link extern
    </FodNavLink>
    
    <!-- PDF în tab nou -->
    <FodNavLink Href="/docs/manual.pdf" 
                Target="_blank"
                Icon="@FodIcons.Material.Filled.PictureAsPdf">
        Manual PDF
    </FodNavLink>
</FodNavMenu>
```

### Link-uri cu OnClick

```razor
<FodNavMenu>
    <FodNavLink Icon="@FodIcons.Material.Filled.Refresh"
                OnClick="RefreshData">
        Reîmprospătare
    </FodNavLink>
    
    <FodNavLink Icon="@FodIcons.Material.Filled.CloudUpload"
                OnClick="SyncData">
        Sincronizare
    </FodNavLink>
    
    <FodNavLink Icon="@FodIcons.Material.Filled.ExitToApp"
                OnClick="Logout">
        Deconectare
    </FodNavLink>
</FodNavMenu>

@code {
    private async Task RefreshData(MouseEventArgs e)
    {
        await DataService.RefreshAsync();
    }
    
    private async Task SyncData(MouseEventArgs e)
    {
        await SyncService.SyncAsync();
    }
    
    private async Task Logout(MouseEventArgs e)
    {
        await AuthService.LogoutAsync();
        NavigationManager.NavigateTo("/login");
    }
}
```

### Link-uri Dezactivate Condiționat

```razor
<FodNavMenu>
    <FodNavLink Href="/profile" 
                Icon="@FodIcons.Material.Filled.Person"
                Disabled="@(!isAuthenticated)">
        Profil
    </FodNavLink>
    
    <FodNavLink Href="/admin" 
                Icon="@FodIcons.Material.Filled.AdminPanelSettings"
                Disabled="@(!hasAdminRole)">
        Administrare
    </FodNavLink>
    
    <FodNavLink Href="/reports" 
                Icon="@FodIcons.Material.Filled.Assessment"
                Disabled="@(!hasReportsAccess)">
        Rapoarte
    </FodNavLink>
</FodNavMenu>

@code {
    private bool isAuthenticated = true;
    private bool hasAdminRole = false;
    private bool hasReportsAccess = false;
}
```

### Clase Active Personalizate

```razor
<FodNavMenu>
    <FodNavLink Href="/dashboard" 
                ActiveClass="custom-active highlighted"
                Icon="@FodIcons.Material.Filled.Dashboard">
        Dashboard
    </FodNavLink>
    
    <FodNavLink Href="/analytics" 
                ActiveClass="active-nav-item"
                Icon="@FodIcons.Material.Filled.Analytics">
        Analize
    </FodNavLink>
</FodNavMenu>

<style>
    .custom-active {
        background-color: var(--fod-palette-primary-main);
        color: white !important;
        border-radius: 4px;
    }
    
    .highlighted {
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
</style>
```

### Meniu Complex cu Grupuri

```razor
<FodNavMenu>
    <!-- Navigare principală -->
    <FodNavLink Href="/" Match="NavLinkMatch.All"
                Icon="@FodIcons.Material.Filled.Home">
        Acasă
    </FodNavLink>
    
    <!-- Grup Servicii -->
    <FodNavGroup Title="Servicii" Icon="@FodIcons.Material.Filled.Work">
        <FodNavLink Href="/services/documents"
                    Icon="@FodIcons.Material.Filled.Description">
            Documente
        </FodNavLink>
        
        <FodNavLink Href="/services/certificates"
                    Icon="@FodIcons.Material.Filled.CardMembership">
            Certificate
        </FodNavLink>
    </FodNavGroup>
    
    <!-- Grup Utilizator -->
    <FodNavGroup Title="Cont" Icon="@FodIcons.Material.Filled.AccountCircle">
        <FodNavLink Href="/account/profile">
            Profil
        </FodNavLink>
        
        <FodNavLink Href="/account/settings">
            Setări
        </FodNavLink>
        
        <FodNavLink OnClick="Logout">
            Deconectare
        </FodNavLink>
    </FodNavGroup>
</FodNavMenu>
```

### Link-uri cu ICommand

```razor
<FodNavMenu>
    <FodNavLink Icon="@FodIcons.Material.Filled.Save"
                Command="@SaveCommand">
        Salvează
    </FodNavLink>
    
    <FodNavLink Icon="@FodIcons.Material.Filled.Delete"
                Command="@DeleteCommand"
                CommandParameter="@selectedItem">
        Șterge
    </FodNavLink>
</FodNavMenu>

@code {
    private ICommand SaveCommand { get; set; }
    private ICommand DeleteCommand { get; set; }
    private object selectedItem;
    
    protected override void OnInitialized()
    {
        SaveCommand = new RelayCommand(ExecuteSave, CanSave);
        DeleteCommand = new RelayCommand<object>(ExecuteDelete, CanDelete);
    }
    
    private void ExecuteSave() => DataService.Save();
    private bool CanSave() => hasChanges;
    
    private void ExecuteDelete(object item) => DataService.Delete(item);
    private bool CanDelete(object item) => item != null;
}
```

### Navigare cu Tracking

```razor
<FodNavMenu>
    @foreach (var page in navigationPages)
    {
        <FodNavLink Href="@page.Url" 
                    Icon="@page.Icon"
                    OnClick="@(() => TrackNavigation(page))">
            @page.Title
        </FodNavLink>
    }
</FodNavMenu>

@code {
    private List<NavigationPage> navigationPages = new()
    {
        new() { Title = "Dashboard", Url = "/", Icon = FodIcons.Material.Filled.Dashboard },
        new() { Title = "Rapoarte", Url = "/reports", Icon = FodIcons.Material.Filled.Assessment },
        new() { Title = "Setări", Url = "/settings", Icon = FodIcons.Material.Filled.Settings }
    };
    
    private async Task TrackNavigation(NavigationPage page)
    {
        await AnalyticsService.TrackPageView(page.Title, page.Url);
    }
}
```

## Stilizare

### Clase CSS Generate

```css
/* Container principal */
.fod-nav-item
.fod-nav-item.fod-ripple /* Cu efect ripple */

/* Link-ul propriu-zis */
.fod-nav-link
.fod-nav-link.active /* Când este activ */
.fod-nav-link-disabled /* Când este dezactivat */

/* Pictogramă */
.fod-nav-link-icon
.fod-nav-link-icon-default /* Culoare implicită */

/* Text */
.fod-nav-link-text
```

### Personalizare CSS

```css
/* Stil pentru link activ */
.fod-nav-link.active {
    background-color: var(--fod-palette-primary-main);
    color: white;
    border-left: 4px solid var(--fod-palette-primary-dark);
}

/* Hover effect */
.fod-nav-link:hover {
    background-color: rgba(0, 0, 0, 0.04);
    cursor: pointer;
}

/* Link dezactivat */
.fod-nav-link-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Animație pentru pictogramă */
.fod-nav-link:hover .fod-nav-link-icon {
    transform: translateX(2px);
    transition: transform 0.2s ease;
}

/* Stil pentru link-uri externe */
.fod-nav-link[target="_blank"]:after {
    content: "↗";
    margin-left: 4px;
    font-size: 0.75em;
}
```

## Diferențe față de NavLink Standard

### Funcționalități Adăugate

1. **Pictograme integrate** - Suport nativ pentru FodIcons
2. **Culori pictograme** - Control asupra culorii pictogramelor
3. **Ripple effect** - Animație la click
4. **Command pattern** - Suport pentru ICommand
5. **Stilizare avansată** - Clase CSS predefinite

### Comportament Îmbunătățit

- Auto-adaugare `rel="noopener noreferrer"` pentru target="_blank"
- Integrare cu `INavigationEventReceiver` pentru tracking
- Suport pentru dezactivare completă

## Best Practices

1. **Folosiți Match corect** - `All` pentru home, `Prefix` pentru secțiuni
2. **Pictograme consistente** - Mențineți un stil uniform
3. **Grupați logic** - Folosiți FodNavGroup pentru organizare
4. **Feedback vizual** - Indicați clar link-urile active și dezactivate
5. **Accesibilitate** - Includeți text descriptiv, nu doar pictograme
6. **Performanță** - Evitați OnClick complex pentru navigare simplă

## Integrare cu Routing

```razor
@page "/products/{category?}"

<FodNavMenu>
    <FodNavLink Href="/products/electronics" 
                Match="NavLinkMatch.All">
        Electronice
    </FodNavLink>
    
    <FodNavLink Href="/products/clothing" 
                Match="NavLinkMatch.All">
        Îmbrăcăminte
    </FodNavLink>
</FodNavMenu>

@code {
    [Parameter] public string Category { get; set; }
}
```

## Troubleshooting

### Link-ul nu devine activ
- Verificați `Match` - folosiți `Prefix` pentru sub-rute
- Verificați că URL-ul coincide exact

### Pictograma nu apare
- Verificați că `Icon` conține o valoare validă din FodIcons
- Verificați că FodIcon component este disponibil

### OnClick nu funcționează
- Verificați că link-ul nu este dezactivat
- Pentru navigare + OnClick, folosiți ambele

## Concluzie

FodNavLink este componenta fundamentală pentru navigare în aplicațiile FOD, oferind toate funcționalitățile necesare pentru a crea meniuri de navigare moderne, accesibile și interactive. Integrarea perfectă cu sistemul de routing Blazor și extensiile adăugate fac din aceasta o alegere ideală pentru orice tip de aplicație.