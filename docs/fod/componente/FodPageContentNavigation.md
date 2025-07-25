# FodPageContentNavigation

## Descriere Generală

`FodPageContentNavigation` este o componentă de navigare pentru conținut paginat care afișează o listă de link-uri către secțiuni ale paginii curente. Componenta suportă scroll spy pentru evidențierea automată a secțiunii active pe măsură ce utilizatorul derulează pagina, și permite navigare rapidă între secțiuni cu scroll smooth.

## Utilizare de Bază

```razor
<!-- Navigare simplă pentru pagină -->
<FodPageContentNavigation @ref="pageNav" 
                          SectionClassSelector=".content-section"
                          Headline="Cuprins" />

<!-- În conținutul paginii -->
<div class="content-section" id="introducere">
    <h2>Introducere</h2>
    <p>Conținut introducere...</p>
</div>

<div class="content-section" id="caracteristici">
    <h2>Caracteristici</h2>
    <p>Conținut caracteristici...</p>
</div>

@code {
    private FodPageContentNavigation pageNav;
    
    protected override void OnAfterRender(bool firstRender)
    {
        if (firstRender)
        {
            // Adaugă secțiuni programatic
            pageNav.AddSection("Introducere", "introducere", true);
            pageNav.AddSection("Caracteristici", "caracteristici", true);
        }
    }
}
```

## Atribute Disponibile

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Headline | string | "Contents" | Titlul afișat deasupra link-urilor |
| SectionClassSelector | string | "" | Selector CSS pentru elementele observate |
| HierarchyMapper | IDictionary<string, int> | new() | Mapare între clase CSS și nivele ierarhice |
| ExpandBehaviour | ContentNavigationExpandBehaviour | Always | Comportament expandare pentru nivele multiple |
| ActivateFirstSectionAsDefault | bool | false | Activează prima secțiune implicit |
| Class | string | - | Clase CSS adiționale |
| Style | string | - | Stiluri inline |
| UserAttributes | Dictionary<string, object> | - | Atribute HTML adiționale |

## Proprietăți Publice

| Proprietate | Tip | Descriere |
|-------------|-----|-----------|
| Sections | IEnumerable<FodPageContentSection> | Lista secțiunilor înregistrate |
| ActiveSection | FodPageContentSection | Secțiunea activă curentă |

## Metode Publice

| Metodă | Parametri | Descriere |
|--------|-----------|-----------|
| AddSection | string sectionName, string sectionId, bool forceUpdate | Adaugă o secțiune nouă |
| AddSection | FodPageContentSection section, bool forceUpdate | Adaugă o secțiune cu obiect |
| ScrollToSection | Uri uri | Scroll la secțiune bazat pe fragment URL |
| Update | - | Forțează re-randarea componentei |

## Clase Asociate

### FodPageContentSection

Reprezintă o secțiune în navigare.

```csharp
public class FodPageContentSection
{
    public string Title { get; set; }      // Titlul afișat
    public string Id { get; set; }         // ID-ul secțiunii
    public int Level { get; set; }         // Nivelul în ierarhie
    public bool IsActive { get; set; }     // Starea activă
    public FodPageContentSection Parent { get; set; } // Secțiunea părinte
}
```

### ContentNavigationExpandBehaviour

```csharp
public enum ContentNavigationExpandBehaviour
{
    Always,                  // Mereu expandat
    WhenSectionIsActive      // Expandat doar când e activ
}
```

## Exemple Avansate

### Navigare cu Nivele Multiple

```razor
<FodPageContentNavigation @ref="navigation"
                          SectionClassSelector=".doc-section"
                          HierarchyMapper="@hierarchyMap"
                          ExpandBehaviour="ContentNavigationExpandBehaviour.WhenSectionIsActive" />

<article>
    <section class="doc-section first-level" id="section1">
        <h2>1. Introducere</h2>
        
        <section class="doc-section second-level" id="section1-1">
            <h3>1.1 Context</h3>
        </section>
        
        <section class="doc-section second-level" id="section1-2">
            <h3>1.2 Obiective</h3>
        </section>
    </section>
    
    <section class="doc-section first-level" id="section2">
        <h2>2. Implementare</h2>
    </section>
</article>

@code {
    private FodPageContentNavigation navigation;
    
    private Dictionary<string, int> hierarchyMap = new()
    {
        ["first-level"] = 0,
        ["second-level"] = 1,
        ["third-level"] = 2
    };
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            // Adaugă secțiuni cu ierarhie
            var intro = new FodPageContentSection("1. Introducere", "section1", 0, null);
            navigation.AddSection(intro, false);
            
            navigation.AddSection(
                new FodPageContentSection("1.1 Context", "section1-1", 1, intro), 
                false
            );
            
            navigation.AddSection(
                new FodPageContentSection("1.2 Obiective", "section1-2", 1, intro), 
                false
            );
            
            navigation.AddSection(
                new FodPageContentSection("2. Implementare", "section2", 0, null), 
                true
            );
        }
    }
}
```

### Navigare pentru Documentație API

```razor
@page "/api/{ComponentName}"

<div class="api-documentation">
    <FodGrid>
        <FodItem xs="12" md="3">
            <FodPageContentNavigation @ref="navMenu"
                                      Headline="API Reference"
                                      SectionClassSelector=".api-section"
                                      ActivateFirstSectionAsDefault="true" />
        </FodItem>
        
        <FodItem xs="12" md="9">
            <div class="api-content">
                <div class="api-section" id="overview">
                    <h2>Overview</h2>
                    <p>@GetOverview()</p>
                </div>
                
                <div class="api-section" id="properties">
                    <h2>Properties</h2>
                    @RenderProperties()
                </div>
                
                <div class="api-section" id="methods">
                    <h2>Methods</h2>
                    @RenderMethods()
                </div>
                
                <div class="api-section" id="events">
                    <h2>Events</h2>
                    @RenderEvents()
                </div>
            </div>
        </FodItem>
    </FodGrid>
</div>

@code {
    [Parameter] public string ComponentName { get; set; }
    private FodPageContentNavigation navMenu;
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            navMenu.AddSection("Overview", "overview", false);
            navMenu.AddSection("Properties", "properties", false);
            navMenu.AddSection("Methods", "methods", false);
            navMenu.AddSection("Events", "events", true);
            
            // Scroll la fragment din URL dacă există
            await navMenu.ScrollToSection(Navigation.Uri);
        }
    }
}
```

### Navigare Dinamică cu Date Încărcate

```razor
<FodPageContentNavigation @ref="dynamicNav"
                          Headline="@($"Capitole ({chapters.Count})")"
                          SectionClassSelector=".chapter" />

<div class="book-content">
    @if (isLoading)
    {
        <FodProgressCircular Indeterminate="true" />
    }
    else
    {
        @foreach (var chapter in chapters)
        {
            <div class="chapter" id="@($"chapter-{chapter.Id}")">
                <h2>@chapter.Title</h2>
                <div>@((MarkupString)chapter.Content)</div>
            </div>
        }
    }
</div>

@code {
    private FodPageContentNavigation dynamicNav;
    private List<Chapter> chapters = new();
    private bool isLoading = true;
    
    protected override async Task OnInitializedAsync()
    {
        chapters = await LoadChapters();
        isLoading = false;
    }
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender && !isLoading && dynamicNav.Sections.Count() == 0)
        {
            // Adaugă secțiuni după încărcarea datelor
            foreach (var chapter in chapters)
            {
                dynamicNav.AddSection(
                    chapter.Title, 
                    $"chapter-{chapter.Id}", 
                    false
                );
            }
            dynamicNav.Update();
        }
    }
}
```

### Navigare cu Stil Personalizat

```razor
<style>
    .custom-page-nav {
        position: sticky;
        top: 20px;
        max-height: calc(100vh - 40px);
        overflow-y: auto;
    }
    
    .custom-page-nav .page-content-navigation-navlink {
        padding: 8px 16px;
        border-left: 3px solid transparent;
        transition: all 0.3s ease;
    }
    
    .custom-page-nav .page-content-navigation-navlink:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
    
    .custom-page-nav .page-content-navigation-navlink.active {
        border-left-color: var(--mud-palette-primary);
        background-color: rgba(var(--mud-palette-primary-rgb), 0.1);
        font-weight: 600;
    }
    
    .custom-page-nav .navigation-level-1 {
        padding-left: 32px;
        font-size: 0.875rem;
    }
    
    .custom-page-nav .navigation-level-2 {
        padding-left: 48px;
        font-size: 0.8125rem;
    }
</style>

<FodPageContentNavigation Class="custom-page-nav"
                          SectionClassSelector=".content-section"
                          Headline="Pe această pagină" />
```

### Integrare cu Router

```razor
@inject NavigationManager Navigation

<FodPageContentNavigation @ref="routerNav"
                          SectionClassSelector=".route-section" />

@code {
    private FodPageContentNavigation routerNav;
    
    protected override void OnInitialized()
    {
        Navigation.LocationChanged += OnLocationChanged;
    }
    
    private async void OnLocationChanged(object sender, LocationChangedEventArgs e)
    {
        // Scroll la secțiune când se schimbă URL-ul
        await routerNav.ScrollToSection(new Uri(e.Location));
    }
    
    public void Dispose()
    {
        Navigation.LocationChanged -= OnLocationChanged;
    }
}
```

## Servicii Asociate

### IScrollSpy / IScrollSpyFactory

Servicii pentru monitorizarea poziției de scroll și detectarea secțiunii vizibile.

```csharp
public interface IScrollSpy
{
    string CenteredSection { get; }
    Task StartSpying(string selector);
    Task ScrollToSection(string id);
    Task ScrollToSection(Uri uri);
    event EventHandler<ScrollSectionCenteredEventArgs> ScrollSectionSectionCentered;
}
```

## Stilizare

### Clase CSS

```css
.page-content-navigation
.page-content-navigation-navlink
.page-content-navigation-navlink.active
.navigation-level-0
.navigation-level-1
.navigation-level-2
.title
```

### Variabile CSS

```css
--fod-page-nav-background
--fod-page-nav-border
--fod-page-nav-link-color
--fod-page-nav-link-hover
--fod-page-nav-link-active
```

## Note și Observații

1. **ScrollSpy** - Necesită elemente HTML cu ID-uri pentru funcționare
2. **Performance** - Pentru multe secțiuni, considerați virtualizare
3. **Responsive** - Ascundeți pe ecrane mici sau transformați în drawer
4. **SEO** - ID-urile secțiunilor devin fragmente URL
5. **Accessibility** - Include navigare cu tastatură automată

## Bune Practici

1. Folosiți ID-uri descriptive pentru secțiuni
2. Limitați adâncimea ierarhiei la 2-3 nivele
3. Asigurați-vă că secțiunile au înălțime suficientă
4. Adăugați `scroll-behavior: smooth` în CSS
5. Testați pe dispozitive mobile
6. Folosiți `position: sticky` pentru meniu fix
7. Implementați fallback pentru browsere vechi

## Concluzie

FodPageContentNavigation oferă o soluție elegantă pentru navigarea în cadrul paginilor lungi sau documentației. Cu suport pentru ierarhii, scroll spy automat și integrare ușoară, componenta îmbunătățește semnificativ experiența utilizatorului în navigarea conținutului structurat.