# Drawer

## Documentație pentru componentele FodDrawer și FodDrawerContainer

### 1. Descriere Generală
`FodDrawer` este o componentă de navigare laterală care oferă un panou glisant pentru meniuri, navigare sau conținut suplimentar. Suportă multiple poziții, moduri de afișare responsive și integrare perfectă cu sistemul de layout FOD.

`FodDrawerContainer` gestionează mai multe instanțe de drawer și este de obicei moștenit de `FodLayout`.

Caracteristici principale:
- 6 poziții de ancorare (left, right, start, end, top, bottom)
- 4 variante de afișare (temporary, persistent, responsive, mini)
- Suport pentru breakpoint-uri responsive
- Închidere automată la navigare
- Animații fluide
- Integrare cu FodLayout
- Suport RTL (Right-to-Left)
- Mini drawer cu expansiune la hover

### 2. Ghid de Utilizare API

#### Drawer temporar simplu
```razor
<FodButton OnClick="@(() => drawerOpen = true)">
    Deschide meniu
</FodButton>

<FodDrawer @bind-Open="drawerOpen" Variant="DrawerVariant.Temporary">
    <FodNavMenu>
        <FodNavLink Href="/" Match="NavLinkMatch.All">
            <FodIcon Icon="@FodIcons.Material.Filled.Home" Class="me-3" />
            Acasă
        </FodNavLink>
        <FodNavLink Href="/products">
            <FodIcon Icon="@FodIcons.Material.Filled.ShoppingCart" Class="me-3" />
            Produse
        </FodNavLink>
        <FodNavLink Href="/contact">
            <FodIcon Icon="@FodIcons.Material.Filled.ContactMail" Class="me-3" />
            Contact
        </FodNavLink>
    </FodNavMenu>
</FodDrawer>

@code {
    private bool drawerOpen = false;
}
```

#### Drawer persistent
```razor
<FodDrawerContainer>
    <FodDrawer @bind-Open="drawerOpen" 
               Variant="DrawerVariant.Persistent"
               Width="260px">
        <div class="pa-4">
            <FodText Typo="Typo.h6" GutterBottom="true">
                Meniu principal
            </FodText>
            <FodNavMenu>
                <FodNavLink Href="/dashboard">Dashboard</FodNavLink>
                <FodNavLink Href="/users">Utilizatori</FodNavLink>
                <FodNavLink Href="/settings">Setări</FodNavLink>
            </FodNavMenu>
        </div>
    </FodDrawer>
    
    <div class="pa-4">
        <FodButton OnClick="@(() => drawerOpen = !drawerOpen)">
            Toggle Drawer
        </FodButton>
        <!-- Conținut principal -->
    </div>
</FodDrawerContainer>
```

#### Drawer responsiv
```razor
<FodLayout>
    <FodHeader Fixed="true">
        <FodIconButton Icon="@FodIcons.Material.Filled.Menu" 
                       OnClick="@(() => drawerOpen = !drawerOpen)" />
        <FodText Typo="Typo.h6" Class="ms-3">Aplicația Mea</FodText>
    </FodHeader>
    
    <FodDrawer @bind-Open="drawerOpen" 
               Variant="DrawerVariant.Responsive"
               Breakpoint="Breakpoint.Lg">
        <NavigationMenu />
    </FodDrawer>
    
    <FodMainContent>
        @Body
    </FodMainContent>
</FodLayout>

@code {
    private bool drawerOpen = true;
}
```

#### Mini drawer cu hover
```razor
<FodDrawer @bind-Open="drawerOpen"
           Variant="DrawerVariant.Mini"
           OpenMiniOnHover="true"
           MiniWidth="60px"
           Width="240px">
    <FodNavMenu>
        <FodNavLink Href="/home" Match="NavLinkMatch.All">
            <FodIcon Icon="@FodIcons.Material.Filled.Home" />
            @if (drawerOpen)
            {
                <span class="ms-3">Acasă</span>
            }
        </FodNavLink>
        <FodNavLink Href="/reports">
            <FodIcon Icon="@FodIcons.Material.Filled.Assessment" />
            @if (drawerOpen)
            {
                <span class="ms-3">Rapoarte</span>
            }
        </FodNavLink>
    </FodNavMenu>
</FodDrawer>
```

#### Drawer cu poziții diferite
```razor
<!-- Drawer din stânga (implicit) -->
<FodDrawer @bind-Open="leftOpen" Anchor="Anchor.Left">
    <div class="pa-4">Drawer stânga</div>
</FodDrawer>

<!-- Drawer din dreapta -->
<FodDrawer @bind-Open="rightOpen" Anchor="Anchor.Right">
    <div class="pa-4">Drawer dreapta</div>
</FodDrawer>

<!-- Drawer de sus -->
<FodDrawer @bind-Open="topOpen" 
           Anchor="Anchor.Top" 
           Height="200px">
    <div class="pa-4">Drawer sus</div>
</FodDrawer>

<!-- Drawer de jos -->
<FodDrawer @bind-Open="bottomOpen" 
           Anchor="Anchor.Bottom"
           Height="300px">
    <div class="pa-4">Drawer jos</div>
</FodDrawer>
```

#### Drawer cu conținut personalizat
```razor
<FodDrawer @bind-Open="filterOpen" 
           Anchor="Anchor.End"
           Width="400px"
           Variant="DrawerVariant.Temporary">
    <div class="pa-4">
        <FodText Typo="Typo.h5" GutterBottom="true">
            Filtrare rezultate
        </FodText>
        
        <FodTextField Label="Caută" 
                      FullWidth="true" 
                      Class="mb-3" />
        
        <FodText Typo="Typo.subtitle2" GutterBottom="true">
            Categorii
        </FodText>
        <FodCheckBox2 Label="Electronice" Class="mb-2" />
        <FodCheckBox2 Label="Îmbrăcăminte" Class="mb-2" />
        <FodCheckBox2 Label="Mobilă" Class="mb-2" />
        
        <FodText Typo="Typo.subtitle2" GutterBottom="true" Class="mt-3">
            Interval preț
        </FodText>
        <FodSlider Min="0" Max="5000" Step="100" />
        
        <div class="d-flex justify-end mt-4">
            <FodButton OnClick="@(() => filterOpen = false)">
                Anulează
            </FodButton>
            <FodButton Color="FodColor.Primary" 
                       Variant="FodVariant.Filled" 
                       Class="ms-2">
                Aplică filtre
            </FodButton>
        </div>
    </div>
</FodDrawer>
```

#### Drawer cu header și footer
```razor
<FodDrawer @bind-Open="drawerOpen" Width="320px">
    <!-- Header -->
    <FodPaper Square="true" Elevation="2" Class="pa-4">
        <div class="d-flex align-items-center">
            <div class="d-flex align-items-center justify-content-center" 
                 style="width: 48px; height: 48px; border-radius: 50%; background-color: var(--fod-palette-primary); color: white;">
                <FodText>@currentUser.Initials</FodText>
            </div>
            <div class="ms-3">
                <FodText Typo="Typo.h6">@currentUser.Name</FodText>
                <FodText Typo="Typo.caption">@currentUser.Email</FodText>
            </div>
        </div>
    </FodPaper>
    
    <!-- Content -->
    <div class="flex-grow-1 overflow-auto">
        <FodNavMenu>
            <FodNavLink Href="/profile">Profil</FodNavLink>
            <FodNavLink Href="/settings">Setări</FodNavLink>
            <FodNavLink Href="/help">Ajutor</FodNavLink>
        </FodNavMenu>
    </div>
    
    <!-- Footer -->
    <FodPaper Square="true" Elevation="2" Class="pa-3">
        <FodButton FullWidth="true" 
                   StartIcon="@FodIcons.Material.Filled.Logout">
            Deconectare
        </FodButton>
    </FodPaper>
</FodDrawer>
```

#### Drawer cu tabs
```razor
<FodDrawer @bind-Open="drawerOpen" Width="400px">
    <FodTabs @bind-ActivePanelIndex="activeTab" 
             HeaderPosition="FodTabHeaderPosition.Top"
             Class="h-100">
        <FodTabPanel Text="Navigare" Icon="@FodIcons.Material.Filled.Menu">
            <FodNavMenu>
                <!-- Meniu navigare -->
            </FodNavMenu>
        </FodTabPanel>
        
        <FodTabPanel Text="Notificări" Icon="@FodIcons.Material.Filled.Notifications">
            <FodList>
                <!-- Lista notificări -->
            </FodList>
        </FodTabPanel>
        
        <FodTabPanel Text="Setări" Icon="@FodIcons.Material.Filled.Settings">
            <!-- Formular setări -->
        </FodTabPanel>
    </FodTabs>
</FodDrawer>

@code {
    private int activeTab = 0;
}
```

#### Integrare completă cu FodLayout
```razor
<FodLayout>
    <FodHeader Fixed="true" Elevation="2">
        <FodToolBar>
            <FodIconButton Icon="@FodIcons.Material.Filled.Menu" 
                           OnClick="ToggleDrawer" />
            <FodText Typo="Typo.h6" Class="ms-3">
                Dashboard Administrativ
            </FodText>
            <FodSpacer />
            <FodIconButton Icon="@FodIcons.Material.Filled.Notifications" />
            <FodIconButton Icon="@FodIcons.Material.Filled.AccountCircle" />
        </FodToolBar>
    </FodHeader>
    
    <FodDrawer @bind-Open="drawerOpen"
               Variant="DrawerVariant.Responsive"
               Breakpoint="Breakpoint.Md"
               ClipMode="DrawerClipMode.Always">
        <FodNavMenu>
            <FodNavGroup Title="General" Expanded="true">
                <FodNavLink Href="/dashboard" 
                            Icon="@FodIcons.Material.Filled.Dashboard">
                    Dashboard
                </FodNavLink>
                <FodNavLink Href="/analytics" 
                            Icon="@FodIcons.Material.Filled.Analytics">
                    Analize
                </FodNavLink>
            </FodNavGroup>
            
            <FodNavGroup Title="Management">
                <FodNavLink Href="/users" 
                            Icon="@FodIcons.Material.Filled.People">
                    Utilizatori
                </FodNavLink>
                <FodNavLink Href="/products" 
                            Icon="@FodIcons.Material.Filled.Inventory">
                    Produse
                </FodNavLink>
            </FodNavGroup>
        </FodNavMenu>
    </FodDrawer>
    
    <FodMainContent>
        <FodContainer MaxWidth="MaxWidth.Large" Class="py-8">
            @Body
        </FodContainer>
    </FodMainContent>
</FodLayout>

@code {
    private bool drawerOpen = true;
    
    private void ToggleDrawer()
    {
        drawerOpen = !drawerOpen;
    }
}
```

### 3. Atribute disponibile

#### FodDrawer
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Open` | `bool` | Starea deschis/închis | `false` |
| `OpenChanged` | `EventCallback<bool>` | Eveniment la schimbare stare | - |
| `Anchor` | `Anchor` | Poziția drawer-ului | `Anchor.Start` |
| `Variant` | `DrawerVariant` | Modul de afișare | `DrawerVariant.Responsive` |
| `Breakpoint` | `Breakpoint` | Punct de schimbare responsive | `Breakpoint.Md` |
| `Width` | `string` | Lățimea drawer-ului | `240px` |
| `MiniWidth` | `string` | Lățimea în mod mini | `56px` |
| `Height` | `string` | Înălțimea (pentru top/bottom) | `auto` |
| `Fixed` | `bool` | Poziție CSS fixed vs absolute | `true` în FodLayout |
| `Elevation` | `int` | Nivelul umbrei (0-25) | `1` |
| `Color` | `FodColor` | Culoarea temei | `FodColor.Default` |
| `DisableOverlay` | `bool` | Dezactivează overlay-ul | `false` |
| `PreserveOpenState` | `bool` | Păstrează starea la resize | `false` |
| `OpenMiniOnHover` | `bool` | Deschide mini drawer la hover | `false` |
| `ClipMode` | `DrawerClipMode` | Comportament în FodLayout | `DrawerClipMode.Docked` |
| `ChildContent` | `RenderFragment` | Conținutul drawer-ului | - |

### 4. Enumerări

#### DrawerVariant
| Valoare | Descriere |
|---------|-----------|
| `Temporary` | Se suprapune peste conținut, închide automat |
| `Persistent` | Împinge conținutul, rămâne deschis |
| `Responsive` | Temporary sub breakpoint, Persistent peste |
| `Mini` | Afișează versiune minimizată când e închis |

#### Anchor
| Valoare | Descriere |
|---------|-----------|
| `Left` | Fixat în stânga |
| `Right` | Fixat în dreapta |
| `Start` | Stânga în LTR, dreapta în RTL |
| `End` | Dreapta în LTR, stânga în RTL |
| `Top` | Fixat sus |
| `Bottom` | Fixat jos |

#### DrawerClipMode
| Valoare | Descriere |
|---------|-----------|
| `Never` | Nu se ajustează la app bar |
| `Docked` | Se ajustează când e andocat |
| `Always` | Se ajustează întotdeauna |

### 5. Evenimente și metode

| Eveniment/Metodă | Descriere |
|-----------------|-----------|
| `OpenChanged` | Se declanșează când drawer-ul se deschide/închide |
| Auto-close | Se închide automat la navigare (Temporary) |
| Overlay click | Click pe overlay închide drawer-ul |

### 6. Stilizare și personalizare

```css
/* Personalizare drawer */
.custom-drawer {
    --fod-drawer-width: 320px;
    --fod-drawer-mini-width: 72px;
    --fod-drawer-background: #f5f5f5;
}

/* Animații personalizate */
.custom-drawer .fod-drawer-paper {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Stil pentru mini drawer */
.fod-drawer-mini .fod-nav-link {
    justify-content: center;
}

.fod-drawer-mini .fod-nav-link-text {
    display: none;
}

/* Overlay personalizat */
.fod-drawer-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
}
```

### 7. Integrare cu navigare

```razor
<FodDrawer @bind-Open="drawerOpen">
    <FodNavMenu>
        <FodNavLink Href="/" Match="NavLinkMatch.All">
            Acasă
        </FodNavLink>
        
        <FodNavGroup Title="Produse" Expanded="true">
            <FodNavLink Href="/products/all">Toate produsele</FodNavLink>
            <FodNavLink Href="/products/new">Produse noi</FodNavLink>
            <FodNavLink Href="/products/sale">Reduceri</FodNavLink>
        </FodNavGroup>
        
        <FodNavLink Href="/about">Despre noi</FodNavLink>
        <FodNavLink Href="/contact">Contact</FodNavLink>
    </FodNavMenu>
</FodDrawer>
```

### 8. Patterns comune

#### Dashboard cu drawer
```razor
<FodLayout Class="dashboard-layout">
    <FodHeader Fixed="true">
        <!-- Header content -->
    </FodHeader>
    
    <FodDrawer @bind-Open="drawerOpen" 
               Variant="DrawerVariant.Mini"
               OpenMiniOnHover="true">
        <!-- Navigation -->
    </FodDrawer>
    
    <FodMainContent>
        <FodContainer>
            @Body
        </FodContainer>
    </FodMainContent>
</FodLayout>
```

#### Mobile-first navigation
```razor
<FodDrawer @bind-Open="mobileMenuOpen"
           Variant="DrawerVariant.Temporary"
           Breakpoint="Breakpoint.None"
           Class="d-lg-none">
    <!-- Mobile menu -->
</FodDrawer>

<FodDrawer Open="true"
           Variant="DrawerVariant.Persistent"
           Class="d-none d-lg-flex">
    <!-- Desktop menu -->
</FodDrawer>
```

### 9. Performanță

- Drawer-ul lazy-încarcă conținutul când e deschis prima dată
- Animațiile folosesc CSS transforms pentru performanță
- Mini drawer menține conținutul în DOM pentru tranziții rapide
- Overlay-ul este opțional pentru a reduce re-render-uri

### 10. Accesibilitate

- Suport complet pentru navigare cu tastatura
- Focus trap când drawer-ul temporal este deschis
- Atribute ARIA pentru screen readers
- Escape închide drawer-ul temporal
- Roluri semantice pentru navigare

### 11. Note și observații

- Drawer-ul temporar se închide automat la navigare
- În FodLayout, drawer-ul se înregistrează automat
- Variant responsive este recomandat pentru majoritatea aplicațiilor
- Mini drawer necesită design special pentru pictograme

### 12. Bune practici

1. **Consistență** - Folosiți același tip de drawer în toată aplicația
2. **Responsive** - Alegeți breakpoint-ul potrivit pentru layout
3. **Conținut** - Nu supraîncărcați drawer-ul cu prea multe opțiuni
4. **Performanță** - Pentru liste lungi, folosiți virtualizare
5. **UX** - Oferiți buton vizibil pentru deschidere pe mobile
6. **Animații** - Păstrați animațiile rapide (sub 300ms)

### 13. Troubleshooting

#### Drawer-ul nu se deschide
- Verificați că `Open` este setat corect
- Verificați că nu există erori JavaScript în consolă

#### Overlay-ul nu apare
- Verificați că `DisableOverlay` nu este `true`
- Verificați că variant-ul suportă overlay

#### Drawer-ul nu se închide la navigare
- Funcționează doar pentru variant Temporary
- Verificați că folosiți componente de navigare FOD

### 14. Concluzie
`FodDrawer` oferă o soluție completă și flexibilă pentru implementarea navigării laterale în aplicații Blazor. Cu suport pentru multiple variante, poziții și comportamente responsive, acoperă toate scenariile comune de navigare modernă.