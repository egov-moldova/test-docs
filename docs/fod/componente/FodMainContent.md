# FodMainContent

## Documentație pentru componenta FodMainContent

### 1. Descriere Generală

`FodMainContent` este o componentă layout care servește ca container principal pentru conținutul paginii. Oferă opțiuni pentru afișare cu lățime completă sau într-un container centrat responsive, fiind ideală pentru structurarea conținutului principal al aplicației.

Caracteristici principale:
- Container flexibil pentru conținut principal
- Mod container cu lățime maximă și centrare
- Suport pentru clase CSS personalizate
- Integrare cu sistemul de layout Bootstrap
- Responsive design cu container-xxl
- Componentă semantică pentru conținut principal

### 2. Utilizare de Bază

#### Conținut cu lățime completă
```razor
<FodMainContent>
    <h1>Titlu pagină</h1>
    <p>Conținutul paginii aici...</p>
</FodMainContent>
```

#### Conținut într-un container centrat
```razor
<FodMainContent IsContainered="true">
    <FodGrid container spacing="3">
        <FodGrid item xs="12">
            <h1>Dashboard</h1>
        </FodGrid>
        <FodGrid item xs="12" md="8">
            <!-- Conținut principal -->
        </FodGrid>
        <FodGrid item xs="12" md="4">
            <!-- Sidebar -->
        </FodGrid>
    </FodGrid>
</FodMainContent>
```

### 3. Parametri

| Parametru | Tip | Descriere | Valoare Implicită |
|-----------|-----|-----------|-------------------|
| `ChildContent` | `RenderFragment` | Conținutul de afișat | - |
| `IsContainered` | `bool` | Activează modul container | `false` |
| `Class` | `string` | Clase CSS adiționale | - |
| `Style` | `string` | Stiluri inline | - |
| `UserAttributes` | `Dictionary<string, object>` | Atribute HTML adiționale | - |

### 4. Clase CSS Generate

- `fod-main-content` - Clasa de bază
- `container-xxl` - Aplicat când `IsContainered="true"`
- `centered-container` - Aplicat când `IsContainered="true"`

### 5. Exemple Avansate

#### Layout complet cu header și footer
```razor
<FodLayout>
    <FodHeader Fixed="true">
        <FodToolbar>
            <FodIconButton Icon="@FodIcons.Material.Filled.Menu" />
            <FodText Typo="Typo.h6">Aplicația Mea</FodText>
        </FodToolbar>
    </FodHeader>
    
    <FodMainContent IsContainered="true" Class="py-4">
        <FodBreadcrumbs Items="@breadcrumbs" />
        
        @Body
    </FodMainContent>
    
    <FodFooter>
        <FodText Align="FodAlign.Center" Typo="Typo.body2">
            © 2024 Compania Mea
        </FodText>
    </FodFooter>
</FodLayout>
```

#### Conținut cu diferite secțiuni
```razor
<FodMainContent IsContainered="true">
    <!-- Hero Section -->
    <section class="hero-section py-5">
        <FodGrid container alignItems="Center" spacing="4">
            <FodGrid item xs="12" md="6">
                <FodText Typo="Typo.h2" GutterBottom="true">
                    Bine ați venit!
                </FodText>
                <FodText Typo="Typo.body1" Color="FodColor.TextSecondary">
                    Descrierea aplicației și beneficiile principale.
                </FodText>
                <FodButton Color="FodColor.Primary" Size="FodSize.Large" Class="mt-3">
                    Începeți acum
                </FodButton>
            </FodGrid>
            <FodGrid item xs="12" md="6">
                <FodImage Src="/images/hero.svg" Alt="Hero image" />
            </FodGrid>
        </FodGrid>
    </section>
    
    <FodDivider />
    
    <!-- Features Section -->
    <section class="features-section py-5">
        <FodText Typo="Typo.h3" Align="FodAlign.Center" GutterBottom="true">
            Caracteristici principale
        </FodText>
        <FodGrid container spacing="3">
            @foreach (var feature in features)
            {
                <FodGrid item xs="12" sm="6" md="4">
                    <FodCard>
                        <FodCardContent>
                            <FodIcon Icon="@feature.Icon" 
                                     Color="FodColor.Primary" 
                                     Size="FodSize.Large" />
                            <FodText Typo="Typo.h5">@feature.Title</FodText>
                            <FodText>@feature.Description</FodText>
                        </FodCardContent>
                    </FodCard>
                </FodGrid>
            }
        </FodGrid>
    </section>
</FodMainContent>
```

#### Conținut adaptiv pentru diferite rezoluții
```razor
<FodMainContent IsContainered="@useContainer" 
                Class="@GetResponsiveClasses()">
    @if (IsMobile)
    {
        <!-- Layout mobil -->
        <FodStack Spacing="2">
            @foreach (var item in items)
            {
                <MobileItemCard Item="@item" />
            }
        </FodStack>
    }
    else
    {
        <!-- Layout desktop -->
        <FodGrid container spacing="3">
            @foreach (var item in items)
            {
                <FodGrid item xs="12" md="6" lg="4">
                    <DesktopItemCard Item="@item" />
                </FodGrid>
            }
        </FodGrid>
    }
</FodMainContent>

@code {
    [Inject] private IBreakpointService BreakpointService { get; set; }
    
    private bool IsMobile => BreakpointService.IsSmDown;
    private bool useContainer => !IsMobile;
    
    private string GetResponsiveClasses()
    {
        return IsMobile ? "px-2" : "py-4";
    }
}
```

### 6. Stilizare CSS

```css
/* Stiluri de bază */
.fod-main-content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

/* Container centrat */
.fod-main-content.centered-container {
    margin-left: auto;
    margin-right: auto;
}

/* Suport pentru diferite dimensiuni de ecran */
@media (min-width: 1400px) {
    .fod-main-content.container-xxl {
        max-width: 1320px;
    }
}

/* Padding responsive */
.fod-main-content {
    padding: 1rem;
}

@media (min-width: 768px) {
    .fod-main-content {
        padding: 2rem;
    }
}

/* Stiluri pentru secțiuni */
.fod-main-content section {
    margin-bottom: 3rem;
}

.fod-main-content section:last-child {
    margin-bottom: 0;
}
```

### 7. Integrare cu Layout System

#### Layout cu navigare laterală
```razor
<FodLayout>
    <FodDrawer Open="@drawerOpen" Fixed="true">
        <FodNavMenu>
            <!-- Meniu navigare -->
        </FodNavMenu>
    </FodDrawer>
    
    <FodMainContent IsContainered="false" 
                    Style="@($"margin-left: {(drawerOpen ? 240 : 0)}px")">
        <FodContainer MaxWidth="MaxWidth.Large">
            @Body
        </FodContainer>
    </FodMainContent>
</FodLayout>
```

#### Layout cu tabs
```razor
<FodMainContent IsContainered="true">
    <FodTabs @bind-ActivePanelIndex="activeTab">
        <FodTabPanel Title="Prezentare generală">
            <div class="tab-content py-3">
                <OverviewContent />
            </div>
        </FodTabPanel>
        
        <FodTabPanel Title="Detalii">
            <div class="tab-content py-3">
                <DetailsContent />
            </div>
        </FodTabPanel>
        
        <FodTabPanel Title="Statistici">
            <div class="tab-content py-3">
                <StatisticsContent />
            </div>
        </FodTabPanel>
    </FodTabs>
</FodMainContent>
```

### 8. Scenarii de Utilizare

#### Pagină de administrare
```razor
@page "/admin"
@layout AdminLayout

<FodMainContent IsContainered="true" Class="admin-content">
    <div class="page-header mb-4">
        <FodText Typo="Typo.h4">Panou de administrare</FodText>
        <FodText Typo="Typo.body2" Color="FodColor.TextSecondary">
            Ultima actualizare: @lastUpdate.ToString("dd.MM.yyyy HH:mm")
        </FodText>
    </div>
    
    <FodGrid container spacing="3">
        <!-- Widget-uri statistici -->
        <FodGrid item xs="12" sm="6" md="3">
            <StatWidget Title="Utilizatori" 
                        Value="@userCount" 
                        Icon="@FodIcons.Material.Filled.People" />
        </FodGrid>
        <!-- Mai multe widget-uri -->
    </FodGrid>
    
    <!-- Tabel date -->
    <FodCard Class="mt-4">
        <FodCardContent>
            <AdminDataTable />
        </FodCardContent>
    </FodCard>
</FodMainContent>
```

#### Landing page
```razor
<FodMainContent IsContainered="false">
    <!-- Full-width hero -->
    <div class="hero-banner">
        <FodContainer MaxWidth="MaxWidth.Medium">
            <HeroContent />
        </FodContainer>
    </div>
    
    <!-- Contained sections -->
    <FodContainer MaxWidth="MaxWidth.Large" Class="py-5">
        <FeaturesSection />
    </FodContainer>
    
    <!-- Full-width CTA -->
    <div class="cta-section">
        <FodContainer MaxWidth="MaxWidth.Medium">
            <CallToAction />
        </FodContainer>
    </div>
</FodMainContent>
```

### 9. Best Practices

1. **Semantic HTML** - FodMainContent generează un `<div>`, considerați `<main>` pentru semantică
2. **Container choice** - Folosiți `IsContainered` pentru conținut care necesită lățime maximă
3. **Spacing** - Adăugați padding prin clase pentru spacing consistent
4. **Responsive** - Testați pe diferite dimensiuni de ecran
5. **Performance** - Evitați re-randări inutile ale întregului conținut

### 10. Performanță

- Componentă lightweight, doar wrapper
- Nu adaugă logică complexă
- Randare eficientă
- Folosiți `@key` pentru optimizare când conținutul se schimbă dinamic

### 11. Accesibilitate

Pentru o mai bună accesibilitate:

```razor
<main class="fod-main-content @(IsContainered ? "container-xxl centered-container" : "")"
      @attributes="UserAttributes"
      style="@Style">
    @ChildContent
</main>
```

### 12. Combinații cu alte componente

```razor
<!-- Cu Loading -->
<FodMainContent IsContainered="true">
    <FodLoading IsLoading="@isLoading" Color="FodColor.Primary">
        @if (!isLoading)
        {
            <ActualContent />
        }
    </FodLoading>
</FodMainContent>

<!-- Cu Error Boundary -->
<FodMainContent IsContainered="true">
    <ErrorBoundary>
        <ChildContent>
            <RiskyComponent />
        </ChildContent>
        <ErrorContent>
            <FodAlert Severity="FodSeverity.Error">
                A apărut o eroare. Vă rugăm reîncărcați pagina.
            </FodAlert>
        </ErrorContent>
    </ErrorBoundary>
</FodMainContent>
```

### 13. Migrare și Compatibilitate

De la div simplu la FodMainContent:

```razor
@* Înainte *@
<div class="container-xxl centered-container main-content">
    @Body
</div>

@* După *@
<FodMainContent IsContainered="true" Class="main-content">
    @Body
</FodMainContent>
```

### 14. Troubleshooting

#### Container nu se centrează
- Verificați că `IsContainered="true"`
- Verificați CSS pentru `.centered-container`
- Asigurați-vă că nu există CSS conflictual

#### Conținut tăiat pe mobile
- Adăugați padding responsive
- Verificați overflow settings
- Testați pe diferite dispozitive

### 15. Concluzie

`FodMainContent` oferă o modalitate simplă și consistentă de a structura conținutul principal al paginilor. Cu suport pentru containere responsive și integrare perfectă cu sistemul de layout FOD, componenta asigură că conținutul este afișat optim pe toate dispozitivele.