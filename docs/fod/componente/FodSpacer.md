# Spacer

## Documentație pentru componenta FodSpacer

### 1. Descriere Generală
`FodSpacer` este o componentă utilitară simplă care creează spațiu flexibil între elemente într-un container flex. Componenta se extinde automat pentru a ocupa tot spațiul disponibil, împingând elementele adiacente către marginile containerului.

Caracteristici principale:
- Creează spațiu flexibil în containere flex
- Se extinde automat pentru a umple spațiul disponibil
- Nu necesită parametri sau configurare
- Bazat pe utilitarul Bootstrap `flex-grow-1`
- Foarte ușor și performant
- Ideal pentru toolbars și acțiuni
- Funcționează în orice direcție flex
- Zero overhead de configurare

### 2. Ghid de Utilizare API

#### Spacer în toolbar
```razor
<FodToolbar>
    <FodButton StartIcon="@FodIcons.Material.Filled.Menu">
        Meniu
    </FodButton>
    
    <FodSpacer />
    
    <FodButton StartIcon="@FodIcons.Material.Filled.Search">
        Căutare
    </FodButton>
    <FodButton StartIcon="@FodIcons.Material.Filled.AccountCircle">
        Profil
    </FodButton>
</FodToolbar>
```

#### Spacer în card actions
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6">Titlu card</FodText>
        <FodText Typo="Typo.body2">
            Conținut descriptiv pentru card.
        </FodText>
    </FodCardContent>
    <FodCardActions>
        <FodButton Variant="FodVariant.Text">Anulează</FodButton>
        <FodSpacer />
        <FodButton Color="FodColor.Primary">Confirmă</FodButton>
    </FodCardActions>
</FodCard>
```

#### Spacer în header
```razor
<FodAppBar Position="Position.Fixed" Color="FodColor.Primary">
    <FodToolbar>
        <FodIconButton Icon="@FodIcons.Material.Filled.Menu" 
                       Color="FodColor.Inherit" />
        
        <FodText Typo="Typo.h6" Class="ms-3">
            Aplicația Mea
        </FodText>
        
        <FodSpacer />
        
        <FodIconButton Icon="@FodIcons.Material.Filled.Notifications" 
                       Color="FodColor.Inherit" />
        <FodIconButton Icon="@FodIcons.Material.Filled.MoreVert" 
                       Color="FodColor.Inherit" />
    </FodToolbar>
</FodAppBar>
```

#### Multiple spacers pentru distribuție uniformă
```razor
<div class="d-flex">
    <FodSpacer />
    <FodButton>Buton 1</FodButton>
    <FodSpacer />
    <FodButton>Buton 2</FodButton>
    <FodSpacer />
    <FodButton>Buton 3</FodButton>
    <FodSpacer />
</div>
```

#### Spacer în formulare
```razor
<EditForm Model="@model" OnValidSubmit="HandleSubmit">
    <div class="d-flex align-items-end">
        <FodTextField @bind-Value="model.SearchTerm" 
                      Label="Caută"
                      Style="flex: 1" />
        
        <FodSpacer />
        
        <FodButton Type="ButtonType.Submit" 
                   Color="FodColor.Primary"
                   Class="ms-3">
            Caută
        </FodButton>
    </div>
</EditForm>
```

#### Spacer în liste de acțiuni
```razor
<FodList>
    <FodListItem>
        <div class="d-flex align-items-center w-100">
            <FodIcon Icon="@FodIcons.Material.Filled.Person" Class="me-3" />
            <FodText>Profil utilizator</FodText>
            <FodSpacer />
            <FodIconButton Icon="@FodIcons.Material.Filled.Edit" 
                           Size="FodSize.Small" />
        </div>
    </FodListItem>
    
    <FodListItem>
        <div class="d-flex align-items-center w-100">
            <FodIcon Icon="@FodIcons.Material.Filled.Settings" Class="me-3" />
            <FodText>Setări</FodText>
            <FodSpacer />
            <FodIconButton Icon="@FodIcons.Material.Filled.ChevronRight" 
                           Size="FodSize.Small" />
        </div>
    </FodListItem>
</FodList>
```

#### Spacer pentru aliniere bottom în card
```razor
<FodCard Style="height: 300px;">
    <FodCardContent Class="d-flex flex-column h-100">
        <FodText Typo="Typo.h6">Card cu înălțime fixă</FodText>
        <FodText Typo="Typo.body2">
            Conținut care poate varia în dimensiune.
        </FodText>
        
        <FodSpacer />
        
        <FodButton Color="FodColor.Primary" FullWidth="true">
            Acțiune poziționată jos
        </FodButton>
    </FodCardContent>
</FodCard>
```

#### Spacer în dialog footer
```razor
<FodDialog Show="@showDialog">
    <FodDialogTitle>Confirmare ștergere</FodDialogTitle>
    <FodDialogContent>
        Sunteți sigur că doriți să ștergeți acest element?
    </FodDialogContent>
    <FodDialogActions>
        <FodButton Variant="FodVariant.Text" OnClick="CloseDialog">
            Anulează
        </FodButton>
        <FodSpacer />
        <FodButton Color="FodColor.Error" OnClick="DeleteItem">
            Șterge
        </FodButton>
    </FodDialogActions>
</FodDialog>
```

#### Spacer în navigation
```razor
<nav class="d-flex align-items-center">
    <FodLink Href="/">Acasă</FodLink>
    <FodText Class="mx-2">/</FodText>
    <FodLink Href="/products">Produse</FodLink>
    <FodText Class="mx-2">/</FodText>
    <FodText>Detalii produs</FodText>
    
    <FodSpacer />
    
    <FodButton Size="FodSize.Small" StartIcon="@FodIcons.Material.Filled.Share">
        Distribuie
    </FodButton>
</nav>
```

#### Spacer în grid flexibil
```razor
<div class="d-flex flex-wrap">
    @foreach (var item in items)
    {
        <div class="card-item">
            <!-- Conținut card -->
        </div>
    }
    <FodSpacer />
    <!-- Spacer-ul împinge ultimul rând la stânga -->
</div>
```

### 3. Atribute disponibile

`FodSpacer` nu are parametri configurabili. Este o componentă complet autonomă.

### 4. Cum funcționează

Componenta randează un simplu `<div>` cu clasa CSS `flex-grow-1`, care în Bootstrap este definită ca:

```css
.flex-grow-1 {
    flex-grow: 1 !important;
}
```

Aceasta face ca elementul să se extindă pentru a ocupa tot spațiul disponibil în containerul flex.

### 5. Stilizare și personalizare

Deși componenta nu acceptă parametri, poate fi stilizată prin wrapping:

```razor
<!-- Spacer cu lățime minimă -->
<div style="min-width: 20px;">
    <FodSpacer />
</div>

<!-- Spacer cu lățime maximă -->
<div style="max-width: 200px;">
    <FodSpacer />
</div>

<!-- Spacer doar pe desktop -->
<div class="d-none d-md-flex">
    <FodSpacer />
</div>
```

### 6. Alternative CSS

Pentru cazuri specifice, puteți folosi clase CSS în loc de FodSpacer:

```razor
<!-- Echivalent cu FodSpacer -->
<div class="flex-grow-1"></div>

<!-- Alternativă cu margin auto -->
<div class="ms-auto">Element împins la dreapta</div>

<!-- Alternativă cu justify-content -->
<div class="d-flex justify-content-between">
    <div>Stânga</div>
    <div>Dreapta</div>
</div>
```

### 7. Integrare cu alte componente

#### În Toolbar complex
```razor
<FodToolbar>
    <FodIconButton Icon="@FodIcons.Material.Filled.Menu" />
    
    <FodText Typo="Typo.h6" Class="ms-3">Dashboard</FodText>
    
    <FodSpacer />
    
    <FodTextField Placeholder="Caută..." 
                  Size="FodSize.Small" 
                  Style="max-width: 300px;" />
    
    <FodSpacer />
    
    <FodBadge Content="3" Color="FodColor.Error">
        <FodIconButton Icon="@FodIcons.Material.Filled.Notifications" />
    </FodBadge>
    
    <FodMenu>
        <ActivatorContent>
            <FodIconButton Icon="@FodIcons.Material.Filled.AccountCircle" />
        </ActivatorContent>
        <ChildContent>
            <FodMenuItem>Profil</FodMenuItem>
            <FodMenuItem>Setări</FodMenuItem>
            <FodMenuItem>Deconectare</FodMenuItem>
        </ChildContent>
    </FodMenu>
</FodToolbar>
```

#### În Footer
```razor
<footer class="d-flex align-items-center p-3 border-top">
    <FodText Typo="Typo.caption">
        © 2024 Compania Mea
    </FodText>
    
    <FodSpacer />
    
    <FodLink Href="/terms" Class="mx-2">Termeni</FodLink>
    <FodLink Href="/privacy" Class="mx-2">Confidențialitate</FodLink>
    <FodLink Href="/contact">Contact</FodLink>
</footer>
```

### 8. Patterns comune

#### Centrare cu spacers
```razor
<div class="d-flex">
    <FodSpacer />
    <div class="content-centered">
        <!-- Conținut centrat -->
    </div>
    <FodSpacer />
</div>
```

#### Distribuție uniformă
```razor
<div class="d-flex">
    @foreach (var action in actions)
    {
        <FodSpacer />
        <FodButton>@action.Label</FodButton>
    }
    <FodSpacer />
</div>
```

#### Push la margini
```razor
<div class="d-flex">
    <div>Stânga</div>
    <FodSpacer />
    <div>Dreapta</div>
</div>
```

### 9. Cazuri de utilizare

1. **Toolbars** - Separarea grupurilor de acțiuni
2. **Card actions** - Alinierea butoanelor
3. **Headers** - Spațierea elementelor de navigare
4. **Forms** - Alinierea controalelor
5. **Lists** - Poziționarea acțiunilor
6. **Dialogs** - Organizarea butoanelor
7. **Navigation** - Distribuția link-urilor

### 10. Performanță

- Zero overhead JavaScript
- Doar o clasă CSS aplicată
- Nu afectează performanța
- Nu necesită re-render

### 11. Compatibilitate

- Funcționează în toate containerele flex
- Compatibil cu toate browser-ele moderne
- Nu necesită polyfills
- Responsive by default

### 12. Bune practici

1. **Container flex** - Folosiți doar în containere cu display flex
2. **Direcție** - Funcționează atât orizontal cât și vertical
3. **Combinații** - Poate fi combinat cu alte utilitare flex
4. **Simplicitate** - Nu complicați - este doar pentru spațiere
5. **Alternative** - Considerați CSS grid pentru layout-uri complexe

### 13. Troubleshooting

#### Spacer-ul nu funcționează
- Verificați că părintele are `display: flex`
- Verificați că nu există `flex-grow` pe alte elemente
- Verificați că containerul are spațiu disponibil

#### Spacer-ul crește prea mult
- Adăugați `max-width` sau `max-height` pe container
- Folosiți `flex-basis` pentru control mai fin

#### Spacer-ul nu se vede
- Normal - este invizibil, doar creează spațiu
- Adăugați background temporar pentru debugging

### 14. Limitări

- Funcționează doar în containere flex
- Nu acceptă parametri de configurare
- Nu poate fi stilizat direct
- Nu are dimensiune minimă implicită

### 15. Exemple avansate

#### Layout complex cu multiple spacers
```razor
<div class="app-layout d-flex flex-column" style="height: 100vh;">
    <!-- Header -->
    <header class="d-flex p-3 border-bottom">
        <FodText Typo="Typo.h6">Logo</FodText>
        <FodSpacer />
        <nav class="d-flex gap-3">
            <FodLink>Home</FodLink>
            <FodLink>About</FodLink>
            <FodLink>Contact</FodLink>
        </nav>
        <FodSpacer />
        <FodButton>Login</FodButton>
    </header>
    
    <!-- Main content -->
    <main class="flex-grow-1 d-flex">
        <!-- Sidebar -->
        <aside class="border-end p-3" style="width: 250px;">
            <FodList>
                <!-- Menu items -->
            </FodList>
        </aside>
        
        <!-- Content area -->
        <div class="flex-grow-1 p-4">
            @Body
        </div>
    </main>
    
    <!-- Footer -->
    <footer class="d-flex p-3 border-top">
        <FodText Typo="Typo.caption">© 2024</FodText>
        <FodSpacer />
        <FodText Typo="Typo.caption">v1.0.0</FodText>
    </footer>
</div>
```

### 16. Concluzie
`FodSpacer` este o componentă esențială pentru layout-uri flexibile în aplicații Blazor. Deși extrem de simplă în implementare, oferă o soluție elegantă pentru una dintre cele mai comune nevoi de layout - distribuirea spațiului între elemente. Ușurința de utilizare și performanța excelentă o fac indispensabilă în toolbars, card actions și multe alte scenarii de UI.