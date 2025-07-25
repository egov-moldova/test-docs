# Link

## Documentație pentru componenta FodLink

### 1. Descriere Generală
`FodLink` este componenta pentru afișarea link-urilor în aplicații Blazor, oferind stilizare consistentă și control asupra comportamentului. Componenta se integrează perfect cu sistemul de culori și tipografie FOD, oferind opțiuni flexibile pentru underline și interacțiune.

Caracteristici principale:
- Integrare cu sistemul de culori FOD
- Control asupra stilului underline
- Suport pentru tipografie personalizată
- Gestionare stare dezactivată
- Evenimente onClick personalizate
- Suport pentru target și rel attributes
- Cursor inteligent bazat pe context
- Compatibilitate cu attribute splatting

### 2. Ghid de Utilizare API

#### Link simplu
```razor
<FodLink Href="/about">Despre noi</FodLink>
```

#### Link cu culoare personalizată
```razor
<FodLink Href="/products" Color="FodColor.Primary">
    Vezi toate produsele
</FodLink>

<FodLink Href="/sale" Color="FodColor.Secondary">
    Produse la reducere
</FodLink>

<FodLink Href="/contact" Color="FodColor.Info">
    Contactează-ne
</FodLink>
```

#### Control underline
```razor
<!-- Fără underline -->
<FodLink Href="/home" Underline="Underline.None">
    Acasă
</FodLink>

<!-- Underline doar la hover (implicit) -->
<FodLink Href="/services" Underline="Underline.Hover">
    Servicii
</FodLink>

<!-- Underline permanent -->
<FodLink Href="/important" Underline="Underline.Always">
    Informații importante
</FodLink>
```

#### Link extern cu target
```razor
<FodLink Href="https://github.com" Target="_blank">
    Vizitați GitHub
    <FodIcon Icon="@FodIcons.Material.Filled.OpenInNew" 
             Size="FodSize.Small" 
             Class="ms-1" />
</FodLink>
```

#### Link cu tipografie personalizată
```razor
<FodLink Href="/title" Typo="Typo.h4" Color="FodColor.Primary">
    Link ca titlu
</FodLink>

<FodLink Href="/subtitle" Typo="Typo.subtitle1">
    Link ca subtitlu
</FodLink>

<FodLink Href="/caption" Typo="Typo.caption" Color="FodColor.Secondary">
    Link mic pentru note
</FodLink>
```

#### Link cu handler onClick
```razor
<FodLink OnClick="HandleLinkClick">
    Execută acțiune
</FodLink>

<FodLink Href="/products" OnClick="TrackLinkClick">
    Produse (cu tracking)
</FodLink>

@code {
    private void HandleLinkClick(MouseEventArgs e)
    {
        Console.WriteLine("Link clicked!");
        // Execută acțiune
    }
    
    private void TrackLinkClick(MouseEventArgs e)
    {
        // Track analytics
        Analytics.TrackEvent("link_click", new { page = "products" });
    }
}
```

#### Link dezactivat
```razor
<FodLink Href="/restricted" Disabled="@(!hasAccess)">
    Zonă restricționată
</FodLink>

@if (!hasAccess)
{
    <FodText Typo="Typo.caption" Color="FodColor.Error">
        Nu aveți acces la această secțiune
    </FodText>
}

@code {
    private bool hasAccess = false;
}
```

#### Link-uri în text
```razor
<FodText Typo="Typo.body1">
    Pentru mai multe informații, consultați 
    <FodLink Href="/docs">documentația</FodLink> sau 
    <FodLink Href="/faq">întrebările frecvente</FodLink>.
</FodText>

<FodText Typo="Typo.body2">
    Prin continuarea navigării, sunteți de acord cu 
    <FodLink Href="/terms" Underline="Underline.Always">
        termenii și condițiile
    </FodLink> și cu 
    <FodLink Href="/privacy" Underline="Underline.Always">
        politica de confidențialitate
    </FodLink>.
</FodText>
```

#### Link-uri în liste
```razor
<FodText Typo="Typo.h6" GutterBottom="true">
    Resurse utile
</FodText>

<FodList>
    <FodListItem>
        <FodLink Href="/guide">Ghid de utilizare</FodLink>
    </FodListItem>
    <FodListItem>
        <FodLink Href="/api">Documentație API</FodLink>
    </FodListItem>
    <FodListItem>
        <FodLink Href="/examples">Exemple de cod</FodLink>
    </FodListItem>
    <FodListItem>
        <FodLink Href="https://github.com/project" Target="_blank">
            Cod sursă
            <FodIcon Icon="@FodIcons.Material.Filled.GitHub" 
                     Size="FodSize.Small" 
                     Class="ms-1" />
        </FodLink>
    </FodListItem>
</FodList>
```

#### Breadcrumb cu link-uri
```razor
<nav aria-label="breadcrumb">
    <div class="d-flex align-items-center">
        <FodLink Href="/" Color="FodColor.Secondary">
            Acasă
        </FodLink>
        <FodIcon Icon="@FodIcons.Material.Filled.ChevronRight" 
                 Size="FodSize.Small" 
                 Class="mx-2" 
                 Color="FodColor.Secondary" />
        <FodLink Href="/products" Color="FodColor.Secondary">
            Produse
        </FodLink>
        <FodIcon Icon="@FodIcons.Material.Filled.ChevronRight" 
                 Size="FodSize.Small" 
                 Class="mx-2" 
                 Color="FodColor.Secondary" />
        <FodText Typo="Typo.body1">
            Detalii produs
        </FodText>
    </div>
</nav>
```

#### Footer cu link-uri organizate
```razor
<footer class="mt-5 pt-5 border-top">
    <FodGrid Container="true" Spacing="4">
        <FodGrid Item="true" xs="12" sm="6" md="3">
            <FodText Typo="Typo.h6" GutterBottom="true">
                Companie
            </FodText>
            <div class="d-flex flex-column">
                <FodLink Href="/about" Class="mb-2">Despre noi</FodLink>
                <FodLink Href="/team" Class="mb-2">Echipa</FodLink>
                <FodLink Href="/careers" Class="mb-2">Cariere</FodLink>
                <FodLink Href="/press" Class="mb-2">Presă</FodLink>
            </div>
        </FodGrid>
        
        <FodGrid Item="true" xs="12" sm="6" md="3">
            <FodText Typo="Typo.h6" GutterBottom="true">
                Produse
            </FodText>
            <div class="d-flex flex-column">
                <FodLink Href="/features" Class="mb-2">Funcționalități</FodLink>
                <FodLink Href="/pricing" Class="mb-2">Prețuri</FodLink>
                <FodLink Href="/enterprise" Class="mb-2">Enterprise</FodLink>
                <FodLink Href="/updates" Class="mb-2">Actualizări</FodLink>
            </div>
        </FodGrid>
        
        <FodGrid Item="true" xs="12" sm="6" md="3">
            <FodText Typo="Typo.h6" GutterBottom="true">
                Resurse
            </FodText>
            <div class="d-flex flex-column">
                <FodLink Href="/docs" Class="mb-2">Documentație</FodLink>
                <FodLink Href="/api" Class="mb-2">API</FodLink>
                <FodLink Href="/guides" Class="mb-2">Ghiduri</FodLink>
                <FodLink Href="/support" Class="mb-2">Suport</FodLink>
            </div>
        </FodGrid>
        
        <FodGrid Item="true" xs="12" sm="6" md="3">
            <FodText Typo="Typo.h6" GutterBottom="true">
                Legal
            </FodText>
            <div class="d-flex flex-column">
                <FodLink Href="/privacy" Class="mb-2">Confidențialitate</FodLink>
                <FodLink Href="/terms" Class="mb-2">Termeni</FodLink>
                <FodLink Href="/cookies" Class="mb-2">Cookies</FodLink>
                <FodLink Href="/licenses" Class="mb-2">Licențe</FodLink>
            </div>
        </FodGrid>
    </FodGrid>
</footer>
```

#### Card cu link-uri acțiune
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h5" GutterBottom="true">
            Plan Premium
        </FodText>
        <FodText Typo="Typo.body2" GutterBottom="true">
            Deblochează toate funcționalitățile avansate cu planul Premium.
        </FodText>
        <FodList>
            <FodListItem>
                <FodIcon Icon="@FodIcons.Material.Filled.Check" 
                         Color="FodColor.Success" 
                         Size="FodSize.Small" 
                         Class="me-2" />
                Acces nelimitat
            </FodListItem>
            <FodListItem>
                <FodIcon Icon="@FodIcons.Material.Filled.Check" 
                         Color="FodColor.Success" 
                         Size="FodSize.Small" 
                         Class="me-2" />
                Suport prioritar
            </FodListItem>
            <FodListItem>
                <FodIcon Icon="@FodIcons.Material.Filled.Check" 
                         Color="FodColor.Success" 
                         Size="FodSize.Small" 
                         Class="me-2" />
                Funcții beta
            </FodListItem>
        </FodList>
    </FodCardContent>
    <FodCardActions>
        <FodLink Href="/pricing" Color="FodColor.Primary">
            Vezi toate planurile
        </FodLink>
        <FodSpacer />
        <FodButton Color="FodColor.Primary" Variant="FodVariant.Filled">
            Upgradează acum
        </FodButton>
    </FodCardActions>
</FodCard>
```

#### Link-uri sociale
```razor
<div class="social-links d-flex gap-3">
    <FodLink Href="https://facebook.com/company" 
             Target="_blank" 
             Color="FodColor.Primary"
             Underline="Underline.None">
        <FodIcon Icon="@FodIcons.Custom.Brands.Facebook" />
    </FodLink>
    
    <FodLink Href="https://twitter.com/company" 
             Target="_blank" 
             Color="FodColor.Info"
             Underline="Underline.None">
        <FodIcon Icon="@FodIcons.Custom.Brands.Twitter" />
    </FodLink>
    
    <FodLink Href="https://linkedin.com/company" 
             Target="_blank" 
             Color="FodColor.Primary"
             Underline="Underline.None">
        <FodIcon Icon="@FodIcons.Custom.Brands.LinkedIn" />
    </FodLink>
    
    <FodLink Href="https://github.com/company" 
             Target="_blank" 
             Color="FodColor.Default"
             Underline="Underline.None">
        <FodIcon Icon="@FodIcons.Custom.Brands.GitHub" />
    </FodLink>
</div>
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Href` | `string` | URL-ul link-ului | `null` |
| `Target` | `string` | Target pentru link (_blank, _self, etc) | `null` |
| `Color` | `FodColor` | Culoarea link-ului | `Primary` |
| `Typo` | `Typo` | Stilul tipografic | `body1` |
| `Underline` | `Underline` | Comportament underline | `Hover` |
| `Disabled` | `bool` | Dezactivează link-ul | `false` |
| `OnClick` | `EventCallback<MouseEventArgs>` | Handler pentru click | - |
| `ChildContent` | `RenderFragment` | Conținutul link-ului | - |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |
| `UserAttributes` | `Dictionary<string, object>` | Atribute HTML adiționale | `null` |

### 4. Enumerări

#### Underline
| Valoare | Descriere |
|---------|-----------|
| `None` | Fără underline |
| `Hover` | Underline la hover |
| `Always` | Underline permanent |

### 5. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `OnClick` | `EventCallback<MouseEventArgs>` | Se declanșează la click pe link |

### 6. Stilizare și personalizare

```css
/* Link-uri cu hover special */
.custom-link {
    transition: all 0.3s ease;
    position: relative;
}

.custom-link:hover {
    color: var(--fod-palette-secondary-main) !important;
}

/* Underline animat */
.animated-link {
    position: relative;
    text-decoration: none !important;
}

.animated-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: currentColor;
    transition: width 0.3s ease;
}

.animated-link:hover::after {
    width: 100%;
}

/* Link-uri cu iconițe */
.icon-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}

.icon-link .fod-icon-root {
    transition: transform 0.2s ease;
}

.icon-link:hover .fod-icon-root {
    transform: translateX(2px);
}

/* Link-uri tip buton */
.button-link {
    padding: 0.5rem 1rem;
    border: 1px solid currentColor;
    border-radius: 4px;
    text-decoration: none !important;
    display: inline-block;
    transition: all 0.2s ease;
}

.button-link:hover {
    background-color: var(--fod-palette-primary-main);
    color: white !important;
    border-color: var(--fod-palette-primary-main);
}

/* Link-uri cu badge */
.link-with-badge {
    position: relative;
    padding-right: 1.5rem;
}

.link-with-badge .badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: var(--fod-palette-error-main);
    color: white;
    border-radius: 10px;
    padding: 2px 6px;
    font-size: 0.625rem;
}
```

### 7. Integrare cu alte componente

#### În Text
```razor
<FodText Typo="Typo.body1">
    <FodLink Href="/profile">@username</FodLink> a distribuit acest articol.
</FodText>
```

#### În Alert
```razor
<FodAlert Severity="Severity.Info">
    <FodAlertTitle>Informație importantă</FodAlertTitle>
    Pentru mai multe detalii, consultați 
    <FodLink Href="/info" Color="FodColor.Info" Underline="Underline.Always">
        pagina de informații
    </FodLink>.
</FodAlert>
```

#### În Chip
```razor
<FodChip Color="FodColor.Primary">
    <FodLink Href="/tag/blazor" 
             Color="FodColor.White" 
             Underline="Underline.None">
        #blazor
    </FodLink>
</FodChip>
```

### 8. Patterns comune

#### Link cu loading state
```razor
<FodLink OnClick="HandleAsyncAction" 
         Disabled="@isLoading">
    @if (isLoading)
    {
        <FodLoadingCircular Size="FodSize.Small" Class="me-2" />
    }
    @linkText
</FodLink>

@code {
    private bool isLoading = false;
    private string linkText = "Încarcă date";
    
    private async Task HandleAsyncAction(MouseEventArgs e)
    {
        isLoading = true;
        linkText = "Se încarcă...";
        
        await DataService.LoadDataAsync();
        
        isLoading = false;
        linkText = "Încarcă date";
    }
}
```

#### Link cu confirmare
```razor
<FodLink OnClick="@(() => showConfirmDialog = true)" 
         Color="FodColor.Error">
    Șterge contul
</FodLink>

<FodDialog @bind-Open="showConfirmDialog">
    <FodDialogTitle>Confirmare ștergere</FodDialogTitle>
    <FodDialogContent>
        Sunteți sigur că doriți să ștergeți contul?
        Această acțiune este ireversibilă.
    </FodDialogContent>
    <FodDialogActions>
        <FodButton OnClick="@(() => showConfirmDialog = false)">
            Anulează
        </FodButton>
        <FodButton Color="FodColor.Error" OnClick="DeleteAccount">
            Șterge
        </FodButton>
    </FodDialogActions>
</FodDialog>
```

### 9. Accesibilitate

- Folosiți text descriptiv pentru link-uri
- Evitați "click aici" sau "citește mai mult" fără context
- Pentru link-uri externe, considerați adăugarea unui indicator vizual
- Asigurați contrast suficient pentru toate stările
- Link-urile dezactivate nu primesc focus

### 10. SEO și performanță

```razor
<!-- Link cu rel pentru SEO -->
<FodLink Href="https://external-site.com" 
         Target="_blank"
         UserAttributes="@(new Dictionary<string, object> 
         { 
             { "rel", "noopener noreferrer" } 
         })">
    Link extern securizat
</FodLink>

<!-- Link cu preload -->
<FodLink Href="/heavy-page"
         UserAttributes="@(new Dictionary<string, object> 
         { 
             { "rel", "prefetch" } 
         })">
    Pagină grea (prefetch)
</FodLink>
```

### 11. Bune practici

1. **Text descriptiv** - Folosiți text care descrie destinația
2. **Indicatori vizuali** - Marcați link-urile externe
3. **Consistență** - Păstrați stilul uniform în aplicație
4. **Feedback** - Oferiți feedback vizual pentru interacțiuni
5. **Accesibilitate** - Testați cu screen readers
6. **Performanță** - Folosiți prefetch pentru link-uri importante

### 12. Troubleshooting

#### Link-ul nu funcționează
- Verificați că Href este setat corect
- Verificați că nu este Disabled
- Verificați handler-ul OnClick

#### Stilurile nu se aplică
- Verificați ordinea claselor CSS
- Verificați specificitatea stilurilor
- Folosiți !important dacă e necesar

#### Cursor incorect
- Componenta setează automat cursor pointer pentru OnClick
- Verificați că nu există CSS care suprascrie

### 13. Exemple avansate

#### Router link cu active state
```razor
<NavLink class="@GetLinkClass()" href="@href" Match="NavLinkMatch.All">
    <FodLink Href="@href" 
             Color="@(IsActive ? FodColor.Primary : FodColor.Default)"
             Underline="@(IsActive ? Underline.Always : Underline.Hover)">
        @ChildContent
    </FodLink>
</NavLink>

@code {
    [Parameter] public string Href { get; set; }
    [Parameter] public RenderFragment ChildContent { get; set; }
    
    private bool IsActive => NavigationManager.Uri.EndsWith(Href);
    
    private string GetLinkClass() => IsActive ? "active-link" : "";
}
```

#### Link cu analytics
```razor
<AnalyticsLink Href="@href" 
               Category="navigation" 
               Action="click" 
               Label="@label">
    @ChildContent
</AnalyticsLink>

@code {
    public class AnalyticsLink : ComponentBase
    {
        [Parameter] public string Href { get; set; }
        [Parameter] public string Category { get; set; }
        [Parameter] public string Action { get; set; }
        [Parameter] public string Label { get; set; }
        [Parameter] public RenderFragment ChildContent { get; set; }
        
        [Inject] private IAnalyticsService Analytics { get; set; }
        
        private async Task HandleClick(MouseEventArgs e)
        {
            await Analytics.TrackEvent(Category, Action, Label);
        }
        
        protected override void BuildRenderTree(RenderTreeBuilder builder)
        {
            builder.OpenComponent<FodLink>(0);
            builder.AddAttribute(1, "Href", Href);
            builder.AddAttribute(2, "OnClick", EventCallback.Factory.Create<MouseEventArgs>(this, HandleClick));
            builder.AddAttribute(3, "ChildContent", ChildContent);
            builder.CloseComponent();
        }
    }
}
```

### 14. Concluzie
`FodLink` oferă o soluție completă pentru afișarea link-urilor în aplicații Blazor, cu suport pentru stilizare flexibilă, comportament personalizabil și integrare perfectă cu sistemul de design FOD. Componenta acoperă toate cazurile comune de utilizare, de la link-uri simple în text până la navigare complexă și integrări cu analytics.