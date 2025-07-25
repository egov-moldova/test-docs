# Collapse

## Documentație pentru componenta FodCollapse

### 1. Descriere Generală
`FodCollapse` este o componentă care permite expandarea și restrângerea animată a conținutului. Oferă tranziții fluide cu durată adaptivă bazată pe înălțimea conținutului, fiind ideală pentru meniuri, secțiuni expandabile și orice conținut care necesită afișare/ascundere elegantă.

Caracteristici principale:
- Animații fluide de expandare/restrângere
- Durată animație adaptivă bazată pe înălțime
- Măsurare automată a conținutului
- Suport pentru înălțime maximă
- Two-way binding pentru starea expandată
- Evenimente pentru sfârșitul animației
- Gestionare stări de tranziție
- Performanță optimizată

### 2. Ghid de Utilizare API

#### Collapse simplu
```razor
<FodButton OnClick="@(() => isExpanded = !isExpanded)">
    @(isExpanded ? "Ascunde" : "Arată") detalii
</FodButton>

<FodCollapse @bind-Expanded="isExpanded">
    <FodPaper Class="pa-4 mt-3">
        <FodText Typo="Typo.body1">
            Acesta este conținutul care poate fi expandat sau restrâns.
            Animația se adaptează automat la înălțimea conținutului.
        </FodText>
    </FodPaper>
</FodCollapse>

@code {
    private bool isExpanded = false;
}
```

#### Collapse cu conținut dinamic
```razor
<FodCard>
    <FodCardContent>
        <div class="d-flex align-items-center justify-content-between">
            <FodText Typo="Typo.h6">Descriere produs</FodText>
            <FodIconButton Icon="@(showDescription ? FodIcons.Material.Filled.ExpandLess : FodIcons.Material.Filled.ExpandMore)"
                           OnClick="@(() => showDescription = !showDescription)" />
        </div>
        
        <FodCollapse @bind-Expanded="showDescription">
            <FodText Typo="Typo.body2" Class="mt-3">
                @productDescription
            </FodText>
            
            @if (productFeatures.Any())
            {
                <FodText Typo="Typo.subtitle2" Class="mt-3">Caracteristici:</FodText>
                <FodList Dense="true">
                    @foreach (var feature in productFeatures)
                    {
                        <FodListItem>
                            <FodIcon Icon="@FodIcons.Material.Filled.Check" 
                                     Color="FodColor.Success" 
                                     Size="FodSize.Small" 
                                     Class="me-2" />
                            @feature
                        </FodListItem>
                    }
                </FodList>
            }
        </FodCollapse>
    </FodCardContent>
</FodCard>

@code {
    private bool showDescription = false;
    private string productDescription = "Descriere detaliată a produsului...";
    private List<string> productFeatures = new() 
    { 
        "Calitate superioară",
        "Garanție extinsă",
        "Livrare gratuită"
    };
}
```

#### FAQ cu collapse
```razor
<div class="faq-section">
    <FodText Typo="Typo.h5" GutterBottom="true">
        Întrebări frecvente
    </FodText>
    
    @foreach (var (faq, index) in faqs.Select((f, i) => (f, i)))
    {
        <FodPaper Class="mb-2" Elevation="1">
            <div class="pa-3 cursor-pointer" @onclick="@(() => ToggleFaq(index))">
                <div class="d-flex align-items-center justify-content-between">
                    <FodText Typo="Typo.subtitle1">@faq.Question</FodText>
                    <FodIcon Icon="@(expandedFaqs.Contains(index) ? FodIcons.Material.Filled.Remove : FodIcons.Material.Filled.Add)" />
                </div>
            </div>
            
            <FodCollapse Expanded="@expandedFaqs.Contains(index)">
                <FodDivider />
                <div class="pa-3">
                    <FodText Typo="Typo.body1">@faq.Answer</FodText>
                </div>
            </FodCollapse>
        </FodPaper>
    }
</div>

@code {
    private HashSet<int> expandedFaqs = new();
    private List<FaqItem> faqs = new()
    {
        new() { Question = "Ce este FOD?", Answer = "FOD este o bibliotecă de componente Blazor..." },
        new() { Question = "Cum instalez FOD?", Answer = "Puteți instala FOD prin NuGet..." },
        new() { Question = "Este FOD gratuit?", Answer = "Da, FOD este open source și gratuit..." }
    };
    
    private void ToggleFaq(int index)
    {
        if (expandedFaqs.Contains(index))
            expandedFaqs.Remove(index);
        else
            expandedFaqs.Add(index);
    }
    
    public class FaqItem
    {
        public string Question { get; set; }
        public string Answer { get; set; }
    }
}
```

#### Collapse cu înălțime maximă
```razor
<FodCollapse @bind-Expanded="showComments" MaxHeight="300">
    <FodList>
        @foreach (var comment in comments)
        {
            <FodListItem>
                <FodListItemText Primary="@comment.Author" 
                                 Secondary="@comment.Text" />
                <FodListItemSecondaryAction>
                    <FodText Typo="Typo.caption">
                        @comment.Date.ToString("dd.MM.yyyy")
                    </FodText>
                </FodListItemSecondaryAction>
            </FodListItem>
        }
    </FodList>
</FodCollapse>

@if (comments.Count > 5)
{
    <FodButton Variant="FodVariant.Text" 
               OnClick="@(() => showComments = !showComments)"
               Class="mt-2">
        @(showComments ? "Ascunde" : "Vezi toate") comentariile (@comments.Count)
    </FodButton>
}
```

#### Filtre avansate cu collapse
```razor
<div class="filters-section">
    <div class="d-flex align-items-center justify-content-between mb-3">
        <FodText Typo="Typo.h6">Filtre</FodText>
        <FodButton Variant="FodVariant.Text" 
                   Size="FodSize.Small"
                   OnClick="@(() => showAdvancedFilters = !showAdvancedFilters)">
            @(showAdvancedFilters ? "Ascunde" : "Arată") filtre avansate
        </FodButton>
    </div>
    
    <!-- Filtre de bază întotdeauna vizibile -->
    <FodTextField @bind-Value="searchTerm" 
                  Label="Caută"
                  FullWidth="true"
                  Class="mb-3" />
    
    <FodSelect @bind-Value="selectedCategory" 
               Label="Categorie"
               FullWidth="true"
               Class="mb-3">
        @foreach (var category in categories)
        {
            <FodSelectItem Value="@category">@category</FodSelectItem>
        }
    </FodSelect>
    
    <!-- Filtre avansate în collapse -->
    <FodCollapse @bind-Expanded="showAdvancedFilters" 
                 OnAnimationEnd="@(() => Console.WriteLine("Animație completă"))">
        <FodDivider Class="mb-3" />
        
        <FodGrid Container="true" Spacing="2">
            <FodGrid Item="true" xs="12" sm="6">
                <FodTextField @bind-Value="minPrice" 
                              Label="Preț minim"
                              Type="number"
                              FullWidth="true" />
            </FodGrid>
            <FodGrid Item="true" xs="12" sm="6">
                <FodTextField @bind-Value="maxPrice" 
                              Label="Preț maxim"
                              Type="number"
                              FullWidth="true" />
            </FodGrid>
            
            <FodGrid Item="true" xs="12">
                <FodText Typo="Typo.subtitle2" GutterBottom="true">
                    Evaluare minimă
                </FodText>
                <FodRating @bind-SelectedValue="minRating" />
            </FodGrid>
            
            <FodGrid Item="true" xs="12">
                <FodCheckbox @bind-Checked="inStockOnly">
                    Doar produse în stoc
                </FodCheckbox>
                <FodCheckbox @bind-Checked="freeShippingOnly">
                    Doar cu livrare gratuită
                </FodCheckbox>
            </FodGrid>
        </FodGrid>
        
        <div class="mt-3 d-flex gap-2">
            <FodButton Variant="FodVariant.Text" OnClick="ResetFilters">
                Resetează filtre
            </FodButton>
            <FodButton Color="FodColor.Primary" OnClick="ApplyFilters">
                Aplică filtre
            </FodButton>
        </div>
    </FodCollapse>
</div>

@code {
    private bool showAdvancedFilters = false;
    private string searchTerm = "";
    private string selectedCategory = "";
    private decimal? minPrice;
    private decimal? maxPrice;
    private int minRating = 0;
    private bool inStockOnly = false;
    private bool freeShippingOnly = false;
}
```

#### Card cu secțiuni collapse
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h5" GutterBottom="true">
            Raport detaliat
        </FodText>
        
        <!-- Secțiune sumară întotdeauna vizibilă -->
        <div class="summary-section mb-3">
            <FodGrid Container="true" Spacing="2">
                <FodGrid Item="true" xs="6" sm="3">
                    <FodText Typo="Typo.caption">Total vânzări</FodText>
                    <FodText Typo="Typo.h6">€12,450</FodText>
                </FodGrid>
                <FodGrid Item="true" xs="6" sm="3">
                    <FodText Typo="Typo.caption">Comenzi</FodText>
                    <FodText Typo="Typo.h6">156</FodText>
                </FodGrid>
                <FodGrid Item="true" xs="6" sm="3">
                    <FodText Typo="Typo.caption">Clienți noi</FodText>
                    <FodText Typo="Typo.h6">23</FodText>
                </FodGrid>
                <FodGrid Item="true" xs="6" sm="3">
                    <FodText Typo="Typo.caption">Rată conversie</FodText>
                    <FodText Typo="Typo.h6">3.2%</FodText>
                </FodGrid>
            </FodGrid>
        </div>
        
        <!-- Secțiuni detaliate cu collapse -->
        @foreach (var section in reportSections)
        {
            <div class="report-section mb-2">
                <FodButton Variant="FodVariant.Text" 
                           FullWidth="true"
                           Class="justify-content-between"
                           OnClick="@(() => ToggleSection(section.Id))">
                    <span>@section.Title</span>
                    <FodIcon Icon="@(expandedSections.Contains(section.Id) ? 
                        FodIcons.Material.Filled.ExpandLess : 
                        FodIcons.Material.Filled.ExpandMore)" />
                </FodButton>
                
                <FodCollapse Expanded="@expandedSections.Contains(section.Id)">
                    <div class="pa-3">
                        @section.Content
                    </div>
                </FodCollapse>
            </div>
            <FodDivider />
        }
    </FodCardContent>
</FodCard>

@code {
    private HashSet<string> expandedSections = new();
    private List<ReportSection> reportSections = new()
    {
        new() { Id = "sales", Title = "Detalii vânzări", Content = "..." },
        new() { Id = "products", Title = "Produse populare", Content = "..." },
        new() { Id = "customers", Title = "Analiza clienților", Content = "..." }
    };
    
    private void ToggleSection(string sectionId)
    {
        if (expandedSections.Contains(sectionId))
            expandedSections.Remove(sectionId);
        else
            expandedSections.Add(sectionId);
    }
}
```

#### Navigation menu cu collapse
```razor
<FodList>
    @foreach (var menuItem in menuItems)
    {
        <div>
            <FodListItem Button="true" 
                         OnClick="@(() => ToggleMenuItem(menuItem.Id))">
                <FodListItemIcon>
                    <FodIcon Icon="@menuItem.Icon" />
                </FodListItemIcon>
                <FodListItemText Primary="@menuItem.Title" />
                @if (menuItem.Children.Any())
                {
                    <FodIcon Icon="@(expandedMenuItems.Contains(menuItem.Id) ? 
                        FodIcons.Material.Filled.ExpandLess : 
                        FodIcons.Material.Filled.ExpandMore)" />
                }
            </FodListItem>
            
            @if (menuItem.Children.Any())
            {
                <FodCollapse Expanded="@expandedMenuItems.Contains(menuItem.Id)">
                    <FodList DisablePadding="true">
                        @foreach (var child in menuItem.Children)
                        {
                            <FodListItem Button="true" 
                                         Class="ps-8"
                                         OnClick="@(() => NavigateTo(child.Url))">
                                <FodListItemText Primary="@child.Title" />
                            </FodListItem>
                        }
                    </FodList>
                </FodCollapse>
            }
        </div>
    }
</FodList>
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Expanded` | `bool` | Starea curentă expandată/restrânsă | `false` |
| `ExpandedChanged` | `EventCallback<bool>` | Eveniment pentru two-way binding | - |
| `MaxHeight` | `int?` | Înălțime maximă în pixeli | `null` |
| `OnAnimationEnd` | `EventCallback` | Eveniment la sfârșitul animației | - |
| `ChildContent` | `RenderFragment` | Conținutul de expandat | - |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |

### 4. Stări de animație

Componenta gestionează 4 stări:
1. **Entering** - Începe expandarea
2. **Entered** - Complet expandat
3. **Exiting** - Începe restrângerea
4. **Exited** - Complet restrâns

### 5. Evenimente

| Eveniment | Descriere | Când se declanșează |
|-----------|-----------|---------------------|
| `ExpandedChanged` | Two-way binding pentru Expanded | La schimbarea stării |
| `OnAnimationEnd` | Sfârșitul animației | După tranziția completă |

### 6. Stilizare și personalizare

```css
/* Animație mai rapidă */
.fast-collapse .fod-collapse-container {
    transition-duration: 200ms !important;
}

/* Animație mai lentă */
.slow-collapse .fod-collapse-container {
    transition-duration: 600ms !important;
}

/* Easing personalizat */
.custom-collapse .fod-collapse-container {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Collapse cu background */
.styled-collapse .fod-collapse-wrapper-inner {
    background-color: var(--fod-palette-background-paper);
    border: 1px solid var(--fod-palette-divider);
    border-radius: 4px;
    padding: 1rem;
}

/* Animație doar pe înălțime */
.height-only-collapse .fod-collapse-container {
    transition-property: height !important;
}
```

### 7. Integrare cu alte componente

#### În ExpansionPanel custom
```razor
<div class="custom-expansion-panel">
    <div class="panel-header" @onclick="Toggle">
        <FodText Typo="Typo.h6">@Title</FodText>
        <FodIcon Icon="@(isExpanded ? FodIcons.Material.Filled.ExpandLess : FodIcons.Material.Filled.ExpandMore)" />
    </div>
    
    <FodCollapse @bind-Expanded="isExpanded">
        <div class="panel-content">
            @ChildContent
        </div>
    </FodCollapse>
</div>

@code {
    [Parameter] public string Title { get; set; }
    [Parameter] public RenderFragment ChildContent { get; set; }
    
    private bool isExpanded = false;
    
    private void Toggle() => isExpanded = !isExpanded;
}
```

#### În TreeView
```razor
@foreach (var node in treeNodes)
{
    <div class="tree-node">
        <div class="node-header" @onclick="@(() => ToggleNode(node.Id))">
            @if (node.Children.Any())
            {
                <FodIcon Icon="@(expandedNodes.Contains(node.Id) ? 
                    FodIcons.Material.Filled.FolderOpen : 
                    FodIcons.Material.Filled.Folder)" />
            }
            else
            {
                <FodIcon Icon="@FodIcons.Material.Filled.Description" />
            }
            <span class="ms-2">@node.Name</span>
        </div>
        
        @if (node.Children.Any())
        {
            <FodCollapse Expanded="@expandedNodes.Contains(node.Id)">
                <div class="ps-4">
                    @* Recursiv pentru copii *@
                </div>
            </FodCollapse>
        }
    </div>
}
```

### 8. Patterns comune

#### Show more/less pentru text lung
```razor
<div class="content-preview">
    <FodText Typo="Typo.body1">
        @(showFullContent ? fullText : GetPreviewText())
    </FodText>
    
    <FodCollapse Expanded="@showFullContent">
        <FodText Typo="Typo.body1" Class="mt-2">
            @GetRemainingText()
        </FodText>
    </FodCollapse>
    
    <FodButton Variant="FodVariant.Text" 
               Size="FodSize.Small"
               OnClick="@(() => showFullContent = !showFullContent)">
        @(showFullContent ? "Arată mai puțin" : "Citește mai mult")
    </FodButton>
</div>

@code {
    private bool showFullContent = false;
    private string fullText = "Text foarte lung...";
    private int previewLength = 200;
    
    private string GetPreviewText() => 
        fullText.Length > previewLength ? 
            fullText.Substring(0, previewLength) + "..." : 
            fullText;
    
    private string GetRemainingText() => 
        fullText.Length > previewLength ? 
            fullText.Substring(previewLength) : 
            "";
}
```

### 9. Performanță

- Conținutul este întotdeauna randat (doar ascuns vizual)
- Pentru conținut greu, considerați randare condiționată
- Animația folosește CSS transitions (hardware accelerated)
- Măsurarea înălțimii se face o singură dată per expandare

```razor
<!-- Pentru conținut greu -->
@if (isExpanded || hasBeenExpanded)
{
    <FodCollapse Expanded="@isExpanded">
        <HeavyComponent />
    </FodCollapse>
}

@code {
    private bool hasBeenExpanded = false;
    private bool _isExpanded;
    private bool isExpanded 
    { 
        get => _isExpanded;
        set
        {
            _isExpanded = value;
            if (value) hasBeenExpanded = true;
        }
    }
}
```

### 10. Accesibilitate

- Folosiți ARIA attributes pentru screen readers
- Indicați starea expandată/restrânsă
- Asigurați navigare cu tastatură

```razor
<button @onclick="Toggle" 
        aria-expanded="@isExpanded.ToString().ToLower()"
        aria-controls="collapse-content-@id">
    Toggle content
</button>

<FodCollapse @bind-Expanded="isExpanded">
    <div id="collapse-content-@id" role="region">
        <!-- Conținut -->
    </div>
</FodCollapse>
```

### 11. Bune practici

1. **Feedback vizual** - Indicați clar ce poate fi expandat
2. **Animații fluide** - Nu modificați duration-ul implicit
3. **Conținut consistent** - Evitați schimbări majore în timpul animației
4. **Loading states** - Pentru conținut asincron
5. **Max height** - Pentru conținut foarte lung
6. **Performanță** - Lazy load pentru conținut greu

### 12. Troubleshooting

#### Animația nu funcționează
- Verificați că CSS-ul este încărcat
- Verificați consolă pentru erori JS
- Verificați că elementul are înălțime măsurabilă

#### Conținutul clipește
- Evitați schimbări de stil în timpul animației
- Verificați că nu există CSS conflictual
- Folosiți `will-change: height` pentru optimizare

#### Înălțimea nu se calculează corect
- Asigurați-vă că conținutul este complet randat
- Evitați imagini fără dimensiuni specificate
- Folosiți `OnAnimationEnd` pentru acțiuni post-animație

### 13. Limitări cunoscute

- Nu suportă animații orizontale
- Conținutul trebuie să aibă înălțime determinabilă
- Nu funcționează cu `display: none` pe părinte
- Performanță redusă pentru > 100 collapses simultane

### 14. Exemple avansate

#### Collapse orchestrat
```razor
<div class="orchestrated-collapse">
    @foreach (var (item, index) in items.Select((x, i) => (x, i)))
    {
        <div @key="item.Id">
            <FodCollapse Expanded="@(currentIndex == index)"
                         OnAnimationEnd="@(() => OnItemAnimationEnd(index))">
                <ItemContent Item="@item" />
            </FodCollapse>
        </div>
    }
</div>

@code {
    private int currentIndex = 0;
    private bool isAnimating = false;
    
    private async Task ShowNext()
    {
        if (isAnimating || currentIndex >= items.Count - 1) return;
        
        isAnimating = true;
        currentIndex++;
        // Așteaptă sfârșitul animației prin OnAnimationEnd
    }
    
    private void OnItemAnimationEnd(int index)
    {
        if (index == currentIndex)
        {
            isAnimating = false;
        }
    }
}
```

### 15. Concluzie
`FodCollapse` oferă o soluție elegantă pentru expandarea și restrângerea animată a conținutului. Cu animații fluide adaptive, gestionare inteligentă a stărilor și integrare ușoară, componenta este esențială pentru crearea de interfețe interactive și plăcute vizual în aplicații Blazor.