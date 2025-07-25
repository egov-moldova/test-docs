# FodMenuItem

## Descriere Generală

`FodMenuItem` este o componentă pentru crearea elementelor individuale de meniu în cadrul componentei `FodMenu`. Oferă suport pentru navigare, pictograme, stilizare personalizată și integrare cu sistemul de routing Blazor prin componenta NavLink.

## Relația cu FodMenu

`FodMenuItem` funcționează întotdeauna în cadrul unei componente `FodMenu` părinte, care oferă contextul și controlul pentru afișarea/ascunderea textului în funcție de starea meniului (extins/colapsabil).

## Utilizare de Bază

```razor
<FodMenu>
    <FodMenuItem Href="/" Icon="@FodIcons.Material.Filled.Home">
        Acasă
    </FodMenuItem>
    
    <FodMenuItem Href="/servicii" Icon="@FodIcons.Material.Filled.Work">
        Servicii
    </FodMenuItem>
    
    <FodMenuItem Href="/contact" Icon="@FodIcons.Material.Filled.ContactMail">
        Contact
    </FodMenuItem>
</FodMenu>
```

## Atribute și Parametri

| Parametru | Tip | Valoare implicită | Descriere |
|-----------|-----|-------------------|-----------|
| `Href` | `string` | `null` | URL-ul pentru navigare |
| `Icon` | `string` | `null` | Pictograma afișată în meniu |
| `IconColor` | `FodColor` | `Default` | Culoarea pictogramei |
| `TextStyle` | `string` | `null` | Stiluri CSS pentru text |
| `Disabled` | `bool` | `false` | Dezactivează elementul de meniu |
| `DisableRipple` | `bool` | `false` | Dezactivează efectul ripple |
| `ForceLoad` | `bool` | `false` | Forțează reîncărcarea completă la navigare |
| `OnClick` | `EventCallback<MouseEventArgs>` | - | Eveniment la click |
| `Command` | `ICommand` | `null` | Comandă ICommand pentru MVVM |
| `CommandParameter` | `object` | `null` | Parametru pentru comandă |
| `ChildContent` | `RenderFragment` | - | Textul elementului de meniu |
| `Class` | `string` | `null` | Clase CSS adiționale |
| `Style` | `string` | `null` | Stiluri inline |

## Exemple de Utilizare

### Meniu Simplu cu Pictograme

```razor
<FodMenu @bind-IsOpen="menuOpen">
    <FodMenuItem Href="/dashboard" Icon="@FodIcons.Material.Filled.Dashboard">
        Dashboard
    </FodMenuItem>
    
    <FodMenuItem Href="/utilizatori" Icon="@FodIcons.Material.Filled.People">
        Utilizatori
    </FodMenuItem>
    
    <FodMenuItem Href="/rapoarte" Icon="@FodIcons.Material.Filled.Assessment">
        Rapoarte
    </FodMenuItem>
    
    <FodMenuItem Href="/setari" Icon="@FodIcons.Material.Filled.Settings">
        Setări
    </FodMenuItem>
</FodMenu>

@code {
    private bool menuOpen = true;
}
```

### Meniu cu Culori Diferite pentru Pictograme

```razor
<FodMenu>
    <FodMenuItem Href="/activ" 
                 Icon="@FodIcons.Material.Filled.CheckCircle" 
                 IconColor="FodColor.Success">
        Activ
    </FodMenuItem>
    
    <FodMenuItem Href="/atentie" 
                 Icon="@FodIcons.Material.Filled.Warning" 
                 IconColor="FodColor.Warning">
        Atenționări
    </FodMenuItem>
    
    <FodMenuItem Href="/erori" 
                 Icon="@FodIcons.Material.Filled.Error" 
                 IconColor="FodColor.Error">
        Erori
    </FodMenuItem>
</FodMenu>
```

### Meniu cu Elemente Dezactivate

```razor
<FodMenu>
    <FodMenuItem Href="/profil" Icon="@FodIcons.Material.Filled.Person">
        Profil
    </FodMenuItem>
    
    <FodMenuItem Href="/admin" 
                 Icon="@FodIcons.Material.Filled.AdminPanelSettings"
                 Disabled="@(!isAdmin)">
        Administrare
    </FodMenuItem>
    
    <FodMenuItem Href="/developare" 
                 Icon="@FodIcons.Material.Filled.Code"
                 Disabled="@(!isDeveloper)">
        Dezvoltare
    </FodMenuItem>
</FodMenu>

@code {
    private bool isAdmin = false;
    private bool isDeveloper = false;
}
```

### Meniu cu Evenimente Click

```razor
<FodMenu>
    <FodMenuItem Icon="@FodIcons.Material.Filled.Refresh" 
                 OnClick="RefreshData">
        Reîmprospătare
    </FodMenuItem>
    
    <FodMenuItem Icon="@FodIcons.Material.Filled.Save" 
                 OnClick="SaveData">
        Salvare
    </FodMenuItem>
    
    <FodMenuItem Icon="@FodIcons.Material.Filled.Logout" 
                 OnClick="Logout">
        Deconectare
    </FodMenuItem>
</FodMenu>

@code {
    private async Task RefreshData(MouseEventArgs e)
    {
        await DataService.RefreshAsync();
    }
    
    private async Task SaveData(MouseEventArgs e)
    {
        await DataService.SaveAsync();
    }
    
    private async Task Logout(MouseEventArgs e)
    {
        await AuthService.LogoutAsync();
    }
}
```

### Meniu cu Stiluri Personalizate

```razor
<FodMenu>
    <FodMenuItem Href="/important" 
                 Icon="@FodIcons.Material.Filled.Star"
                 TextStyle="font-weight: bold; color: #ff6b6b;">
        Important
    </FodMenuItem>
    
    <FodMenuItem Href="/nou" 
                 Icon="@FodIcons.Material.Filled.NewReleases"
                 TextStyle="font-style: italic;">
        Noutăți
    </FodMenuItem>
</FodMenu>
```

### Meniu cu Navigare Condiționată

```razor
<FodMenu>
    @if (isAuthenticated)
    {
        <FodMenuItem Href="/profil" Icon="@FodIcons.Material.Filled.AccountCircle">
            Profilul meu
        </FodMenuItem>
        
        <FodMenuItem Href="/mesaje" Icon="@FodIcons.Material.Filled.Message">
            Mesaje (@unreadCount)
        </FodMenuItem>
    }
    else
    {
        <FodMenuItem Href="/login" Icon="@FodIcons.Material.Filled.Login">
            Autentificare
        </FodMenuItem>
        
        <FodMenuItem Href="/inregistrare" Icon="@FodIcons.Material.Filled.PersonAdd">
            Înregistrare
        </FodMenuItem>
    }
</FodMenu>

@code {
    private bool isAuthenticated = false;
    private int unreadCount = 5;
}
```

### Meniu cu ICommand Pattern

```razor
<FodMenu>
    <FodMenuItem Icon="@FodIcons.Material.Filled.Add" 
                 Command="@CreateCommand"
                 CommandParameter="@("document")">
        Creează Document
    </FodMenuItem>
    
    <FodMenuItem Icon="@FodIcons.Material.Filled.Edit" 
                 Command="@EditCommand"
                 CommandParameter="@selectedItem">
        Editează
    </FodMenuItem>
</FodMenu>

@code {
    private ICommand CreateCommand { get; set; }
    private ICommand EditCommand { get; set; }
    private object selectedItem;
    
    protected override void OnInitialized()
    {
        CreateCommand = new RelayCommand<string>(Create);
        EditCommand = new RelayCommand<object>(Edit, CanEdit);
    }
    
    private void Create(string type)
    {
        // Logică de creare
    }
    
    private void Edit(object item)
    {
        // Logică de editare
    }
    
    private bool CanEdit(object item)
    {
        return item != null;
    }
}
```

### Meniu Complet pentru Aplicație

```razor
<FodMenu @bind-IsOpen="sidebarOpen" Color="FodColor.Primary">
    <!-- Dashboard -->
    <FodMenuItem Href="/" Icon="@FodIcons.Material.Filled.Dashboard">
        Dashboard
    </FodMenuItem>
    
    <!-- Secțiune Servicii -->
    <div class="menu-section">
        <div class="menu-section-title">Servicii</div>
        
        <FodMenuItem Href="/servicii/cereri" Icon="@FodIcons.Material.Filled.Assignment">
            Cereri
        </FodMenuItem>
        
        <FodMenuItem Href="/servicii/documente" Icon="@FodIcons.Material.Filled.Description">
            Documente
        </FodMenuItem>
        
        <FodMenuItem Href="/servicii/plati" Icon="@FodIcons.Material.Filled.Payment">
            Plăți
        </FodMenuItem>
    </div>
    
    <!-- Secțiune Administrare -->
    @if (hasAdminRole)
    {
        <div class="menu-section">
            <div class="menu-section-title">Administrare</div>
            
            <FodMenuItem Href="/admin/utilizatori" Icon="@FodIcons.Material.Filled.SupervisedUserCircle">
                Utilizatori
            </FodMenuItem>
            
            <FodMenuItem Href="/admin/configurare" Icon="@FodIcons.Material.Filled.Tune">
                Configurare
            </FodMenuItem>
            
            <FodMenuItem Href="/admin/audit" Icon="@FodIcons.Material.Filled.History">
                Audit
            </FodMenuItem>
        </div>
    }
    
    <!-- Profil și Setări -->
    <div class="menu-section mt-auto">
        <FodMenuItem Href="/profil" Icon="@FodIcons.Material.Filled.Person">
            @userName
        </FodMenuItem>
        
        <FodMenuItem OnClick="Logout" Icon="@FodIcons.Material.Filled.ExitToApp">
            Deconectare
        </FodMenuItem>
    </div>
</FodMenu>

@code {
    private bool sidebarOpen = true;
    private bool hasAdminRole = true;
    private string userName = "Ion Popescu";
    
    private async Task Logout(MouseEventArgs e)
    {
        await AuthService.LogoutAsync();
        NavigationManager.NavigateTo("/login");
    }
}
```

## Stilizare

### Clase CSS Generate

```css
/* Clase pentru NavLink (din componenta internă) */
.nav-link
.d-flex
.align-items-center

/* Clase pentru pictogramă */
.fod-nav-link-icon
.fod-nav-link-icon-default

/* Clase pentru text */
.show /* Când meniul este deschis */
.hide /* Când meniul este colapsibil */
.mx-2 /* Margin orizontal */
```

### Personalizare CSS

```css
/* Stilizare element meniu activ */
.nav-link.active {
    background-color: rgba(255, 255, 255, 0.1);
    border-left: 3px solid var(--fod-palette-primary-main);
}

/* Hover effect */
.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.05);
    text-decoration: none;
}

/* Pictograme mari */
.custom-menu .fod-nav-link-icon {
    font-size: 1.5rem;
}

/* Spațiere personalizată */
.menu-section {
    margin-bottom: 1rem;
}

.menu-section-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    opacity: 0.7;
    padding: 0.5rem 1rem;
}
```

## Comportament cu FodMenu

### Stare Extinsă/Colapsibilă

Când `FodMenu` își schimbă starea `IsOpen`:
- `IsOpen = true`: Textul este vizibil (class="show")
- `IsOpen = false`: Textul este ascuns (class="hide"), doar pictogramele rămân vizibile

### Integrare NavLink

FodMenuItem folosește intern componenta Blazor `NavLink` care:
- Adaugă automat clasa "active" pentru ruta curentă
- Gestionează navigarea SPA (Single Page Application)
- Suportă `Match="NavLinkMatch.All"` pentru potrivire exactă

## Best Practices

1. **Folosiți pictograme descriptive** - Ajută la navigare când meniul e colapsibil
2. **Grupați elementele logic** - Folosiți secțiuni pentru organizare
3. **Indicați elementele dezactivate** - Folosiți `Disabled` pentru funcții indisponibile
4. **Păstrați textul concis** - Numele elementelor trebuie să fie scurte și clare
5. **Folosiți culori cu sens** - Success pentru activ, Warning pentru atenționări, etc.
6. **Testați navigarea** - Asigurați-vă că toate link-urile funcționează

## Accesibilitate

- Suport pentru navigare cu tastatura prin NavLink
- Pictogramele au rol decorativ (aria-hidden implicit)
- Textul oferă contextul principal pentru screen readers
- Elementele dezactivate sunt excluse din tab order

## Troubleshooting

### Textul nu se afișează/ascunde
- Verificați că FodMenuItem este într-un FodMenu părinte
- Verificați valoarea `IsOpen` a meniului părinte

### Navigarea nu funcționează
- Verificați că `Href` este valid
- Pentru navigare externă, folosiți `ForceLoad="true"`

### Pictograma nu apare
- Verificați că valoarea `Icon` este corectă
- Verificați că FodIcons este disponibil

## Concluzie

FodMenuItem oferă o modalitate flexibilă și consistentă de a crea elemente de meniu în aplicațiile Blazor. În combinație cu FodMenu, permite crearea de meniuri responsive cu suport pentru colapsare, pictograme și navigare integrată.