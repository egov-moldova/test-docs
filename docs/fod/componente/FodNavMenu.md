# Nav Menu

## Documentație pentru componentele FodNavMenu, FodNavGroup și FodNavLink

### 1. Descriere Generală
Sistemul de navigare FOD constă din trei componente principale care lucrează împreună pentru a crea meniuri de navigare flexibile și ierarhice:

- **FodNavMenu** - Container principal pentru elementele de navigare
- **FodNavGroup** - Grup de navigare care poate fi expandat/restrâns
- **FodNavLink** - Link individual de navigare

Caracteristici principale:
- Navigare ierarhică pe mai multe niveluri
- Grupuri expandabile cu animații fluide
- Integrare completă cu sistemul de rutare Blazor
- Suport pentru iconițe și culori personalizate
- Design responsive pentru drawers mini
- Stilizare activă automată
- Suport pentru comenzi și evenimente
- Accesibilitate completă

### 2. Ghid de Utilizare API

#### Meniu de navigare simplu
```razor
<FodNavMenu>
    <FodNavLink Href="/" 
                Icon="@FodIcons.Material.Filled.Home">
        Acasă
    </FodNavLink>
    
    <FodNavLink Href="/products" 
                Icon="@FodIcons.Material.Filled.ShoppingCart">
        Produse
    </FodNavLink>
    
    <FodNavLink Href="/about" 
                Icon="@FodIcons.Material.Filled.Info">
        Despre noi
    </FodNavLink>
    
    <FodNavLink Href="/contact" 
                Icon="@FodIcons.Material.Filled.ContactMail">
        Contact
    </FodNavLink>
</FodNavMenu>
```

#### Meniu cu grupuri expandabile
```razor
<FodNavMenu Color="FodColor.Primary" Bordered="true">
    <FodNavLink Href="/" Icon="@FodIcons.Material.Filled.Dashboard">
        Dashboard
    </FodNavLink>
    
    <FodNavGroup Title="Administrare" 
                 Icon="@FodIcons.Material.Filled.Settings"
                 Expanded="true">
        <FodNavLink Href="/admin/users">Utilizatori</FodNavLink>
        <FodNavLink Href="/admin/roles">Roluri</FodNavLink>
        <FodNavLink Href="/admin/permissions">Permisiuni</FodNavLink>
    </FodNavGroup>
    
    <FodNavGroup Title="Rapoarte" 
                 Icon="@FodIcons.Material.Filled.Assessment">
        <FodNavLink Href="/reports/sales">Vânzări</FodNavLink>
        <FodNavLink Href="/reports/inventory">Inventar</FodNavLink>
        <FodNavLink Href="/reports/customers">Clienți</FodNavLink>
    </FodNavGroup>
    
    <FodNavLink Href="/settings" Icon="@FodIcons.Material.Filled.Tune">
        Setări
    </FodNavLink>
</FodNavMenu>
```

#### Meniu cu sub-grupuri (nested)
```razor
<FodNavMenu>
    <FodNavGroup Title="Produse" 
                 Icon="@FodIcons.Material.Filled.Inventory"
                 @bind-Expanded="productsExpanded">
        <FodNavLink Href="/products/all">Toate produsele</FodNavLink>
        
        <FodNavGroup Title="Categorii" Expanded="false">
            <FodNavLink Href="/products/electronics">Electronice</FodNavLink>
            <FodNavLink Href="/products/clothing">Îmbrăcăminte</FodNavLink>
            <FodNavLink Href="/products/books">Cărți</FodNavLink>
            
            <FodNavGroup Title="Sporturi">
                <FodNavLink Href="/products/sports/outdoor">Outdoor</FodNavLink>
                <FodNavLink Href="/products/sports/indoor">Indoor</FodNavLink>
                <FodNavLink Href="/products/sports/water">Sporturi nautice</FodNavLink>
            </FodNavGroup>
        </FodNavGroup>
        
        <FodNavLink Href="/products/promotions" 
                    Icon="@FodIcons.Material.Filled.LocalOffer">
            Promoții
        </FodNavLink>
    </FodNavGroup>
</FodNavMenu>

@code {
    private bool productsExpanded = true;
}
```

#### Meniu în drawer lateral
```razor
<FodDrawer Variant="DrawerVariant.Persistent" 
           Open="true">
    <FodNavMenu Color="FodColor.Primary" 
                Rounded="true"
                Margin="FodMargin.Dense">
        <div class="pa-4 text-center">
            <FodIcon Icon="@FodIcons.Custom.Brands.MudBlazor" 
                     Size="Size.Large" />
            <FodText Typo="Typo.h6">Aplicația Mea</FodText>
        </div>
        
        <FodDivider Class="mb-4" />
        
        <FodNavLink Href="/dashboard" 
                    Icon="@FodIcons.Material.Filled.Dashboard">
            Dashboard
        </FodNavLink>
        
        <FodNavGroup Title="Management" 
                     Icon="@FodIcons.Material.Filled.ManageAccounts">
            <FodNavLink Href="/users">Utilizatori</FodNavLink>
            <FodNavLink Href="/teams">Echipe</FodNavLink>
            <FodNavLink Href="/projects">Proiecte</FodNavLink>
        </FodNavGroup>
        
        <FodNavGroup Title="Financiar" 
                     Icon="@FodIcons.Material.Filled.AttachMoney">
            <FodNavLink Href="/invoices">Facturi</FodNavLink>
            <FodNavLink Href="/payments">Plăți</FodNavLink>
            <FodNavLink Href="/expenses">Cheltuieli</FodNavLink>
        </FodNavGroup>
        
        <FodDivider Class="my-4" />
        
        <FodNavLink Href="/profile" 
                    Icon="@FodIcons.Material.Filled.Person">
            Profil
        </FodNavLink>
        <FodNavLink Href="/logout" 
                    Icon="@FodIcons.Material.Filled.Logout">
            Deconectare
        </FodNavLink>
    </FodNavMenu>
</FodDrawer>
```

#### Meniu cu acțiuni custom
```razor
<FodNavMenu>
    <FodNavLink Icon="@FodIcons.Material.Filled.Add"
                OnClick="@CreateNewItem">
        Adaugă element nou
    </FodNavLink>
    
    <FodNavLink Icon="@FodIcons.Material.Filled.Refresh"
                OnClick="@RefreshData"
                Disabled="@isRefreshing">
        @if (isRefreshing)
        {
            <FodLoadingCircular Size="Size.Small" Class="me-2" />
        }
        Reîmprospătează
    </FodNavLink>
    
    <FodNavGroup Title="Acțiuni" 
                 Icon="@FodIcons.Material.Filled.PlayArrow">
        <FodNavLink OnClick="@(() => ExecuteAction("export"))">
            Export date
        </FodNavLink>
        <FodNavLink OnClick="@(() => ExecuteAction("import"))">
            Import date
        </FodNavLink>
        <FodNavLink OnClick="@(() => ExecuteAction("backup"))">
            Backup
        </FodNavLink>
    </FodNavGroup>
</FodNavMenu>

@code {
    private bool isRefreshing = false;
    
    private void CreateNewItem()
    {
        // Logică pentru creare element nou
    }
    
    private async Task RefreshData()
    {
        isRefreshing = true;
        await DataService.RefreshAsync();
        isRefreshing = false;
    }
    
    private void ExecuteAction(string action)
    {
        // Execută acțiunea specifică
    }
}
```

#### Meniu cu stilizare personalizată
```razor
<FodNavMenu Color="FodColor.Secondary" 
            Bordered="true"
            Rounded="true"
            Dense="true">
    <FodNavLink Href="/home" 
                Icon="@FodIcons.Material.Filled.Home"
                IconColor="FodColor.Primary">
        <span style="font-weight: bold;">Acasă</span>
    </FodNavLink>
    
    <FodNavGroup Title="Secțiuni" 
                 Icon="@FodIcons.Material.Filled.Folder"
                 IconColor="FodColor.Warning"
                 HideExpandIcon="false">
        <FodNavLink Href="/section1" 
                    Class="custom-nav-link">
            <FodBadge Content="3" Color="FodColor.Error" Class="me-2">
                Secțiunea 1
            </FodBadge>
        </FodNavLink>
        
        <FodNavLink Href="/section2">
            <div class="d-flex justify-content-between align-items-center">
                <span>Secțiunea 2</span>
                <FodChip Size="Size.Small" Color="FodColor.Success">
                    Nou
                </FodChip>
            </div>
        </FodNavLink>
    </FodNavGroup>
</FodNavMenu>
```

#### Meniu cu control programatic
```razor
<FodNavMenu>
    @foreach (var section in menuSections)
    {
        @if (section.Children?.Any() == true)
        {
            <FodNavGroup Title="@section.Title" 
                         Icon="@section.Icon"
                         @bind-Expanded="section.IsExpanded">
                @foreach (var child in section.Children)
                {
                    <FodNavLink Href="@child.Url" 
                                Icon="@child.Icon"
                                Disabled="@(!child.IsAccessible)">
                        @child.Title
                    </FodNavLink>
                }
            </FodNavGroup>
        }
        else
        {
            <FodNavLink Href="@section.Url" 
                        Icon="@section.Icon"
                        Disabled="@(!section.IsAccessible)">
                @section.Title
            </FodNavLink>
        }
    }
</FodNavMenu>

@code {
    private List<MenuSection> menuSections = new();
    
    protected override async Task OnInitializedAsync()
    {
        menuSections = await MenuService.GetUserMenuAsync();
    }
    
    public class MenuSection
    {
        public string Title { get; set; }
        public string Icon { get; set; }
        public string Url { get; set; }
        public bool IsAccessible { get; set; }
        public bool IsExpanded { get; set; }
        public List<MenuSection> Children { get; set; }
    }
}
```

#### Meniu responsive pentru drawer mini
```razor
<FodDrawer @bind-Open="drawerOpen" 
           Variant="@DrawerVariant.Mini">
    <FodNavMenu>
        <FodNavLink Href="/dashboard" 
                    Icon="@FodIcons.Material.Filled.Dashboard">
            <FodTooltip Text="Dashboard" Placement="Placement.Right">
                <ChildContent>
                    Dashboard
                </ChildContent>
            </FodTooltip>
        </FodNavLink>
        
        <FodNavGroup Title="Management" 
                     Icon="@FodIcons.Material.Filled.Settings">
            <!-- Conținutul grupului se afișează doar când drawer-ul e expandat -->
            <FodNavLink Href="/users">Utilizatori</FodNavLink>
            <FodNavLink Href="/settings">Setări</FodNavLink>
        </FodNavGroup>
    </FodNavMenu>
</FodDrawer>
```

### 3. Atribute disponibile

#### FodNavMenu
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Color` | `FodColor` | Culoarea pentru NavLink activ | `Default` |
| `Bordered` | `bool` | Adaugă bordură la NavLink activ | `false` |
| `Rounded` | `bool` | Aplică border-radius | `false` |
| `Margin` | `FodMargin` | Spațiere verticală între elemente | `Normal` |
| `Dense` | `bool` | Padding vertical compact | `false` |
| `ChildContent` | `RenderFragment` | Conținutul meniului | - |

#### FodNavGroup
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Title` | `string` | Textul afișat pentru grup | - |
| `Icon` | `string` | Iconița grupului | `null` |
| `IconColor` | `FodColor` | Culoarea iconiței | `Default` |
| `Expanded` | `bool` | Starea expandată | `false` |
| `ExpandedChanged` | `EventCallback<bool>` | Eveniment pentru two-way binding | - |
| `HideExpandIcon` | `bool` | Ascunde iconița expand/collapse | `false` |
| `MaxHeight` | `int?` | Înălțime maximă pentru collapse | `null` |
| `ExpandIcon` | `string` | Iconița pentru expand | `ArrowDropDown` |
| `ChildContent` | `RenderFragment` | Conținutul grupului | - |
| `Disabled` | `bool` | Dezactivează grupul | `false` |

#### FodNavLink
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Href` | `string` | URL-ul de navigare | `null` |
| `Icon` | `string` | Iconița link-ului | `null` |
| `IconColor` | `FodColor` | Culoarea iconiței | `Default` |
| `Match` | `NavLinkMatch` | Modul de potrivire URL | `Prefix` |
| `Target` | `string` | Target pentru link (_blank, etc) | `null` |
| `ActiveClass` | `string` | Clasa CSS când e activ | `"active"` |
| `OnClick` | `EventCallback<MouseEventArgs>` | Handler pentru click | - |
| `Command` | `ICommand` | Comandă pentru MVVM | `null` |
| `CommandParameter` | `object` | Parametru pentru comandă | `null` |
| `Disabled` | `bool` | Dezactivează link-ul | `false` |
| `DisableRipple` | `bool` | Dezactivează efectul ripple | `false` |
| `ChildContent` | `RenderFragment` | Conținutul link-ului | - |

### 4. Evenimente

| Component | Eveniment | Descriere |
|-----------|-----------|-----------|
| `FodNavGroup` | `ExpandedChanged` | Se declanșează la schimbarea stării expand/collapse |
| `FodNavLink` | `OnClick` | Se declanșează la click pe link |

### 5. Stilizare și personalizare

```css
/* Meniu cu stil custom */
.custom-nav-menu .fod-nav-menu {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
}

/* Link-uri cu hover personalizat */
.custom-nav-menu .fod-nav-link:hover {
    background-color: rgba(0, 0, 0, 0.08);
    transform: translateX(4px);
    transition: all 0.2s ease;
}

/* Grup cu stil special */
.custom-nav-menu .fod-nav-group-header {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.875rem;
    letter-spacing: 0.5px;
}

/* Active state personalizat */
.custom-nav-menu .fod-nav-link.active {
    background: linear-gradient(90deg, var(--fod-palette-primary-main) 0%, var(--fod-palette-primary-light) 100%);
    color: white;
    font-weight: 600;
}

/* Iconițe colorate */
.colorful-nav .fod-nav-link-icon {
    color: var(--fod-palette-primary-main);
}

.colorful-nav .fod-nav-link:hover .fod-nav-link-icon {
    color: var(--fod-palette-secondary-main);
}

/* Animație pentru expand */
.smooth-nav .fod-collapse-container {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Badge-uri în meniu */
.nav-with-badges .fod-nav-link {
    position: relative;
}

.nav-with-badges .notification-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: var(--fod-palette-error-main);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
}
```

### 6. Integrare cu alte componente

#### În Layout principal
```razor
<FodLayout>
    <FodAppBar Position="Position.Fixed">
        <FodIconButton Icon="@FodIcons.Material.Filled.Menu" 
                       OnClick="ToggleDrawer" />
        <FodText Typo="Typo.h6">Aplicația Mea</FodText>
    </FodAppBar>
    
    <FodDrawer @bind-Open="drawerOpen" 
               Variant="DrawerVariant.Temporary">
        <FodNavMenu>
            <!-- Conținut meniu -->
        </FodNavMenu>
    </FodDrawer>
    
    <FodMainContent>
        @Body
    </FodMainContent>
</FodLayout>
```

#### Cu sistem de autentificare
```razor
<FodNavMenu>
    <AuthorizeView>
        <Authorized>
            <FodNavLink Href="/dashboard" Icon="@FodIcons.Material.Filled.Dashboard">
                Dashboard
            </FodNavLink>
            
            <AuthorizeView Roles="Admin">
                <FodNavGroup Title="Administrare" Icon="@FodIcons.Material.Filled.AdminPanelSettings">
                    <FodNavLink Href="/admin/users">Utilizatori</FodNavLink>
                    <FodNavLink Href="/admin/settings">Setări</FodNavLink>
                </FodNavGroup>
            </AuthorizeView>
            
            <FodNavLink Href="/profile" Icon="@FodIcons.Material.Filled.Person">
                @context.User.Identity.Name
            </FodNavLink>
            
            <FodNavLink OnClick="Logout" Icon="@FodIcons.Material.Filled.Logout">
                Deconectare
            </FodNavLink>
        </Authorized>
        <NotAuthorized>
            <FodNavLink Href="/login" Icon="@FodIcons.Material.Filled.Login">
                Autentificare
            </FodNavLink>
            <FodNavLink Href="/register" Icon="@FodIcons.Material.Filled.PersonAdd">
                Înregistrare
            </FodNavLink>
        </NotAuthorized>
    </AuthorizeView>
</FodNavMenu>
```

### 7. Patterns comune

#### Meniu cu căutare
```razor
<FodNavMenu>
    <div class="pa-3">
        <FodTextField @bind-Value="searchTerm" 
                      Placeholder="Caută în meniu..."
                      Adornment="Adornment.Start"
                      AdornmentIcon="@FodIcons.Material.Filled.Search"
                      Immediate="true"
                      DebounceInterval="300" />
    </div>
    
    <FodDivider />
    
    @foreach (var item in FilteredMenuItems)
    {
        @if (item.IsGroup)
        {
            <FodNavGroup Title="@item.Title" Icon="@item.Icon">
                @foreach (var child in item.Children)
                {
                    <FodNavLink Href="@child.Href">@child.Title</FodNavLink>
                }
            </FodNavGroup>
        }
        else
        {
            <FodNavLink Href="@item.Href" Icon="@item.Icon">
                @item.Title
            </FodNavLink>
        }
    }
</FodNavMenu>

@code {
    private string searchTerm = "";
    
    private IEnumerable<MenuItem> FilteredMenuItems => 
        string.IsNullOrWhiteSpace(searchTerm) 
            ? allMenuItems 
            : allMenuItems.Where(item => 
                item.Title.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                item.Children?.Any(c => c.Title.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)) == true);
}
```

#### Meniu cu state persistent
```razor
@inject ILocalStorageService LocalStorage

<FodNavMenu>
    @foreach (var group in navGroups)
    {
        <FodNavGroup Title="@group.Title" 
                     Icon="@group.Icon"
                     @bind-Expanded="group.Expanded"
                     ExpandedChanged="@(() => SaveMenuState())">
            @foreach (var link in group.Links)
            {
                <FodNavLink Href="@link.Href">@link.Title</FodNavLink>
            }
        </FodNavGroup>
    }
</FodNavMenu>

@code {
    private List<NavGroupState> navGroups = new();
    
    protected override async Task OnInitializedAsync()
    {
        // Încarcă starea salvată
        var savedState = await LocalStorage.GetItemAsync<List<NavGroupState>>("navMenuState");
        if (savedState != null)
        {
            navGroups = savedState;
        }
        else
        {
            // Inițializare implicită
            InitializeDefaultMenu();
        }
    }
    
    private async Task SaveMenuState()
    {
        await LocalStorage.SetItemAsync("navMenuState", navGroups);
    }
}
```

### 8. Performanță

- NavLink-urile inactive nu procesează evenimente
- Grupurile collapse folosesc animații CSS eficiente
- Evitați re-render prin păstrarea referințelor stabile
- Pentru meniuri foarte mari, implementați virtualizare

### 9. Accesibilitate

- Suport complet pentru navigare cu tastatură
- ARIA labels pentru screen readers
- Focus management corect
- Anunțuri pentru schimbări de stare
- Contrast adecvat pentru text și iconițe

### 10. Bune practici

1. **Organizare logică** - Grupați elementele înrudite
2. **Iconițe consistente** - Folosiți același stil de iconițe
3. **Feedback vizual** - Indicați clar elementul activ
4. **Loading states** - Pentru meniuri dinamice
5. **Responsive design** - Testați cu drawer mini
6. **Limite rezonabile** - Nu depășiți 3 niveluri de adâncime

### 11. Troubleshooting

#### Link-ul activ nu se evidențiază
- Verificați că Href corespunde cu URL-ul curent
- Verificați NavLinkMatch (Prefix vs All)
- Verificați că Color este setat pe NavMenu

#### Grupurile nu se expandează
- Verificați că Expanded binding funcționează
- Verificați consolă pentru erori JavaScript
- Verificați că FodCollapse este disponibil

#### Iconițele nu se afișează
- Verificați că fontul de iconițe este încărcat
- Verificați sintaxa iconiței
- Verificați IconColor pentru contrast

### 12. Limitări cunoscute

- Nu suportă drag & drop pentru reordonare
- Nu are suport built-in pentru breadcrumbs
- Animațiile nu pot fi personalizate ușor
- Nu suportă lazy loading pentru grupuri mari

### 13. Exemple avansate

#### Meniu cu multi-tenant
```razor
<FodNavMenu>
    <!-- Selector tenant -->
    <div class="pa-3">
        <FodSelect @bind-Value="selectedTenant" 
                   Label="Organizație"
                   FullWidth="true"
                   ValueChanged="OnTenantChanged">
            @foreach (var tenant in userTenants)
            {
                <FodSelectItem Value="@tenant.Id">
                    @tenant.Name
                </FodSelectItem>
            }
        </FodSelect>
    </div>
    
    <FodDivider Class="mb-3" />
    
    <!-- Meniu specific tenant-ului -->
    @if (tenantMenu != null)
    {
        @foreach (var section in tenantMenu.Sections)
        {
            <FodNavGroup Title="@section.Title" 
                         Icon="@section.Icon"
                         Disabled="@(!section.IsEnabled)">
                @foreach (var item in section.Items)
                {
                    <FodNavLink Href="@($"/tenant/{selectedTenant}/{item.Route}")"
                                Icon="@item.Icon"
                                Disabled="@(!item.HasAccess)">
                        @item.Title
                        @if (!item.HasAccess)
                        {
                            <FodTooltip Text="Necesită upgrade plan">
                                <FodIcon Icon="@FodIcons.Material.Filled.Lock" 
                                         Size="Size.Small" 
                                         Class="ms-2" />
                            </FodTooltip>
                        }
                    </FodNavLink>
                }
            </FodNavGroup>
        }
    }
</FodNavMenu>

@code {
    private Guid selectedTenant;
    private List<Tenant> userTenants = new();
    private TenantMenu tenantMenu;
    
    private async Task OnTenantChanged(Guid tenantId)
    {
        selectedTenant = tenantId;
        tenantMenu = await MenuService.GetTenantMenuAsync(tenantId);
    }
}
```

### 14. Concluzie
Componentele FodNavMenu oferă un sistem complet și flexibil pentru crearea meniurilor de navigare în aplicații Blazor. Cu suport pentru ierarhii complexe, stilizare extensivă și integrare perfectă cu sistemul de rutare, acestea sunt esențiale pentru orice aplicație care necesită navigare structurată și intuitivă.