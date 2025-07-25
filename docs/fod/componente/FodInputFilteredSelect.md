# Input Filtered Select

## Documentație pentru componenta FodInputFilteredSelect

### 1. Descriere Generală
`FodInputFilteredSelect` este o componentă dropdown cu funcționalitate de filtrare/autocomplete pentru aplicații Blazor. Permite utilizatorilor să caute și să selecteze valori dintr-o listă mare de opțiuni prin tastarea textului pentru filtrare.

Caracteristici principale:
- Filtrare în timp real pe măsură ce utilizatorul tastează
- Suport pentru tipuri generice și enumerări
- Localizare automată pentru descrieri enum
- Validare integrată cu EditForm
- Two-way data binding
- Performanță optimizată pentru liste mari
- Suport pentru obiecte complexe
- Închidere automată la click în afară
- Accesibilitate completă

### 2. Ghid de Utilizare API

#### Select filtrat de bază cu enum
```razor
@page "/filtered-select-demo"

<EditForm Model="@model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodInputFilteredSelect @bind-Value="model.Country" 
                            Label="Țară"
                            Placeholder="Începeți să tastați pentru a căuta..." />
    <ValidationMessage For="@(() => model.Country)" />
    
    <FodButton Type="ButtonType.Submit">Salvează</FodButton>
</EditForm>

@code {
    private FormModel model = new();
    
    public class FormModel
    {
        [Required(ErrorMessage = "Țara este obligatorie")]
        public CountryEnum? Country { get; set; }
    }
    
    public enum CountryEnum
    {
        [Description("România")]
        RO,
        [Description("Republica Moldova")]
        MD,
        [Description("Statele Unite ale Americii")]
        US,
        [Description("Germania")]
        DE,
        [Description("Franța")]
        FR,
        [Description("Italia")]
        IT,
        [Description("Spania")]
        ES,
        [Description("Regatul Unit")]
        UK
    }
}
```

#### Select cu obiecte personalizate
```razor
<FodInputFilteredSelect T="City" 
                        @bind-Value="selectedCity"
                        Source="@cities"
                        Label="Selectați orașul"
                        Placeholder="Tastați pentru a căuta..." />

@code {
    private City? selectedCity;
    private List<SelectableItem<City>> cities = new();
    
    public class City
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string County { get; set; }
        public int Population { get; set; }
    }
    
    protected override void OnInitialized()
    {
        // Inițializare listă orașe
        cities = GetCities().Select(c => new SelectableItem<City>
        {
            Value = c,
            Label = $"{c.Name} ({c.County})",
            Data = c
        }).ToList();
    }
    
    private List<City> GetCities()
    {
        return new List<City>
        {
            new() { Id = 1, Name = "București", County = "București", Population = 1830000 },
            new() { Id = 2, Name = "Cluj-Napoca", County = "Cluj", Population = 325000 },
            new() { Id = 3, Name = "Timișoara", County = "Timiș", Population = 320000 },
            new() { Id = 4, Name = "Iași", County = "Iași", Population = 290000 },
            new() { Id = 5, Name = "Constanța", County = "Constanța", Population = 285000 },
            // ... mai multe orașe
        };
    }
}
```

#### Select cu încărcare asincronă
```razor
<FodInputFilteredSelect T="Product" 
                        @bind-Value="selectedProduct"
                        Source="@products"
                        Label="Produs"
                        Placeholder="Căutați produsul..."
                        Disabled="@isLoading" />

@if (isLoading)
{
    <FodLoadingLinear Indeterminate="true" Size="FodSize.Small" />
}

@code {
    private Product? selectedProduct;
    private List<SelectableItem<Product>> products = new();
    private bool isLoading = true;
    
    protected override async Task OnInitializedAsync()
    {
        isLoading = true;
        
        try
        {
            var productList = await ProductService.GetProductsAsync();
            products = productList.Select(p => new SelectableItem<Product>
            {
                Value = p,
                Label = $"{p.Name} - {p.Price:C}",
                Data = p
            }).ToList();
        }
        finally
        {
            isLoading = false;
        }
    }
}
```

#### Select cu formatare personalizată
```razor
<FodInputFilteredSelect T="Employee" 
                        @bind-Value="selectedEmployee"
                        Source="@employees"
                        Label="Angajat"
                        Placeholder="Căutați după nume sau departament..." />

@if (selectedEmployee != null)
{
    <FodCard Class="mt-3">
        <FodCardContent>
            <FodText Typo="Typo.h6">@selectedEmployee.FullName</FodText>
            <FodText Typo="Typo.body2">@selectedEmployee.Department</FodText>
            <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                ID: @selectedEmployee.Id | Email: @selectedEmployee.Email
            </FodText>
        </FodCardContent>
    </FodCard>
}

@code {
    private Employee? selectedEmployee;
    private List<SelectableItem<Employee>> employees = new();
    
    protected override void OnInitialized()
    {
        employees = GetEmployees().Select(e => new SelectableItem<Employee>
        {
            Value = e,
            Label = $"{e.FullName} - {e.Department}",
            Data = e,
            // Filtrare personalizată - caută și în email
            SearchableText = $"{e.FullName} {e.Department} {e.Email}"
        }).ToList();
    }
}
```

#### Formular complex cu multiple select-uri filtrate
```razor
<EditForm Model="@orderForm" OnValidSubmit="HandleOrderSubmit">
    <DataAnnotationsValidator />
    
    <FodGrid Container="true" Spacing="3">
        <FodGrid Item="true" xs="12" md="6">
            <FodInputFilteredSelect @bind-Value="orderForm.Customer"
                                    Source="@customers"
                                    Label="Client"
                                    Required="true" />
            <ValidationMessage For="@(() => orderForm.Customer)" />
        </FodGrid>
        
        <FodGrid Item="true" xs="12" md="6">
            <FodInputFilteredSelect @bind-Value="orderForm.Product"
                                    Source="@products"
                                    Label="Produs"
                                    Required="true"
                                    Disabled="@(orderForm.Customer == null)" />
            <ValidationMessage For="@(() => orderForm.Product)" />
        </FodGrid>
        
        <FodGrid Item="true" xs="12" md="6">
            <FodInputFilteredSelect @bind-Value="orderForm.DeliveryMethod"
                                    Label="Metodă livrare"
                                    Placeholder="Selectați metoda de livrare..." />
        </FodGrid>
        
        <FodGrid Item="true" xs="12" md="6">
            <FodInputFilteredSelect @bind-Value="orderForm.PaymentMethod"
                                    Label="Metodă plată"
                                    Placeholder="Selectați metoda de plată..." />
        </FodGrid>
    </FodGrid>
    
    <FodButton Type="ButtonType.Submit" 
               Color="FodColor.Primary"
               Class="mt-3">
        Plasează comanda
    </FodButton>
</EditForm>

@code {
    private OrderForm orderForm = new();
    private List<SelectableItem<Customer>> customers = new();
    private List<SelectableItem<Product>> products = new();
    
    public class OrderForm
    {
        [Required(ErrorMessage = "Clientul este obligatoriu")]
        public Customer? Customer { get; set; }
        
        [Required(ErrorMessage = "Produsul este obligatoriu")]
        public Product? Product { get; set; }
        
        public DeliveryMethod DeliveryMethod { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
    }
    
    public enum DeliveryMethod
    {
        [Description("Curier rapid (24h)")]
        Express,
        [Description("Curier standard (3-5 zile)")]
        Standard,
        [Description("Ridicare din magazin")]
        Pickup,
        [Description("Poștă (5-7 zile)")]
        PostOffice
    }
}
```

#### Select cu grupare și categorii
```razor
<FodInputFilteredSelect T="Service" 
                        @bind-Value="selectedService"
                        Source="@groupedServices"
                        Label="Serviciu"
                        Placeholder="Căutați serviciul dorit..." />

@code {
    private Service? selectedService;
    private List<SelectableItem<Service>> groupedServices = new();
    
    protected override void OnInitialized()
    {
        var services = GetServices();
        
        // Organizare servicii pe categorii
        groupedServices = services
            .OrderBy(s => s.Category)
            .ThenBy(s => s.Name)
            .Select(s => new SelectableItem<Service>
            {
                Value = s,
                Label = s.Name,
                GroupLabel = s.Category,
                Data = s
            }).ToList();
    }
    
    private List<Service> GetServices()
    {
        return new List<Service>
        {
            new() { Id = 1, Name = "Consultanță IT", Category = "IT & Software" },
            new() { Id = 2, Name = "Dezvoltare Web", Category = "IT & Software" },
            new() { Id = 3, Name = "Audit Financiar", Category = "Financiar" },
            new() { Id = 4, Name = "Contabilitate", Category = "Financiar" },
            new() { Id = 5, Name = "Marketing Digital", Category = "Marketing" },
            new() { Id = 6, Name = "SEO & SEM", Category = "Marketing" }
        };
    }
}
```

#### Select cu template personalizat pentru opțiuni
```razor
<FodInputFilteredSelect T="User" 
                        @bind-Value="assignedUser"
                        Source="@users"
                        Label="Asignat către"
                        Placeholder="Căutați utilizator...">
    <ItemTemplate Context="user">
        <div class="d-flex align-items-center">
            <FodIcon Icon="@FodIcons.Material.Filled.Person" 
                     Size="FodSize.Small" 
                     Class="me-2" />
            <div>
                <FodText Typo="Typo.body2">@user.Data.Name</FodText>
                <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                    @user.Data.Department - @user.Data.Role
                </FodText>
            </div>
        </div>
    </ItemTemplate>
</FodInputFilteredSelect>
```

#### Select cu validare personalizată
```razor
<EditForm EditContext="@editContext" OnValidSubmit="HandleSubmit">
    <FodInputFilteredSelect @bind-Value="model.Location"
                            Source="@locations"
                            Label="Locație"
                            @bind-Value:after="ValidateLocation" />
    <ValidationMessage For="@(() => model.Location)" />
    
    @if (locationWarning != null)
    {
        <FodAlert Severity="Severity.Warning" Class="mt-2">
            @locationWarning
        </FodAlert>
    }
</EditForm>

@code {
    private EditContext editContext;
    private LocationModel model = new();
    private string? locationWarning;
    
    protected override void OnInitialized()
    {
        editContext = new EditContext(model);
        editContext.AddDataAnnotationsValidation();
    }
    
    private async Task ValidateLocation()
    {
        locationWarning = null;
        
        if (model.Location != null)
        {
            // Verificare personalizată
            if (model.Location.IsTemporaryClosed)
            {
                locationWarning = "Această locație este temporar închisă.";
            }
            else if (model.Location.Capacity < 10)
            {
                locationWarning = "Această locație are capacitate limitată.";
            }
        }
        
        // Re-validare câmp
        editContext.NotifyFieldChanged(
            FieldIdentifier.Create(() => model.Location));
    }
}
```

#### Select cu debounce pentru performanță
```razor
@implements IDisposable

<FodInputFilteredSelect T="Article" 
                        @bind-Value="selectedArticle"
                        Source="@filteredArticles"
                        Label="Articol"
                        Placeholder="Căutați articol..."
                        OnFilterChanged="@HandleFilterChanged" />

@code {
    private Article? selectedArticle;
    private List<SelectableItem<Article>> allArticles = new();
    private List<SelectableItem<Article>> filteredArticles = new();
    private CancellationTokenSource? debounceTokenSource;
    
    protected override async Task OnInitializedAsync()
    {
        // Încarcă toate articolele
        var articles = await ArticleService.GetAllArticlesAsync();
        allArticles = articles.Select(a => new SelectableItem<Article>
        {
            Value = a,
            Label = a.Title,
            Data = a
        }).ToList();
        
        // Inițial arată primele 50
        filteredArticles = allArticles.Take(50).ToList();
    }
    
    private async Task HandleFilterChanged(string filter)
    {
        // Cancel căutarea anterioară
        debounceTokenSource?.Cancel();
        debounceTokenSource = new CancellationTokenSource();
        
        try
        {
            // Așteaptă 300ms înainte de filtrare
            await Task.Delay(300, debounceTokenSource.Token);
            
            if (string.IsNullOrWhiteSpace(filter))
            {
                filteredArticles = allArticles.Take(50).ToList();
            }
            else
            {
                filteredArticles = allArticles
                    .Where(a => a.Label.Contains(filter, 
                        StringComparison.OrdinalIgnoreCase))
                    .Take(50)
                    .ToList();
            }
            
            StateHasChanged();
        }
        catch (TaskCanceledException)
        {
            // Căutare anulată, ignoră
        }
    }
    
    public void Dispose()
    {
        debounceTokenSource?.Cancel();
        debounceTokenSource?.Dispose();
    }
}
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `T` | Valoarea selectată | `default(T)` |
| `ValueChanged` | `EventCallback<T>` | Eveniment la schimbarea valorii | - |
| `Source` | `List<SelectableItem<T>>` | Lista de opțiuni | `null` |
| `Label` | `string` | Eticheta câmpului | `null` |
| `Placeholder` | `string` | Text placeholder | `null` |
| `Required` | `bool` | Câmp obligatoriu | `false` |
| `Disabled` | `bool` | Dezactivează componenta | `false` |
| `ReadOnly` | `bool` | Doar citire | `false` |
| `OnFilterChanged` | `EventCallback<string>` | Eveniment la schimbarea filtrului | - |
| `MaxDropdownHeight` | `int` | Înălțime maximă dropdown (px) | `300` |
| `MinFilterLength` | `int` | Lungime minimă pentru filtrare | `0` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |

### 4. Model SelectableItem<T>

```csharp
public class SelectableItem<T>
{
    public T Value { get; set; }
    public string Label { get; set; }
    public string? GroupLabel { get; set; }
    public string? SearchableText { get; set; }
    public bool IsDisabled { get; set; }
    public T Data { get; set; }
}
```

### 5. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `ValueChanged` | `EventCallback<T>` | Se declanșează când se selectează o valoare |
| `OnFilterChanged` | `EventCallback<string>` | Se declanșează când se schimbă textul de filtrare |
| `OnDropdownOpen` | `EventCallback` | Se declanșează când se deschide dropdown-ul |
| `OnDropdownClose` | `EventCallback` | Se declanșează când se închide dropdown-ul |

### 6. Metode publice

| Metodă | Descriere | Parametri | Return |
|--------|-----------|-----------|--------|
| `ClearSelection()` | Șterge selecția curentă | - | `void` |
| `FocusAsync()` | Setează focus pe input | - | `ValueTask` |
| `CloseDropdown()` | Închide dropdown-ul | - | `void` |

### 7. Stilizare și personalizare

```css
/* Select cu bordură colorată */
.custom-filtered-select .fod-input-filtered-select {
    border: 2px solid var(--fod-palette-primary-main);
    border-radius: 8px;
}

/* Highlight pentru text filtrat */
.fod-filtered-option mark {
    background-color: var(--fod-palette-warning-light);
    color: inherit;
    font-weight: 600;
}

/* Dropdown cu umbră mai pronunțată */
.fod-filtered-dropdown {
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    border-radius: 8px;
    overflow: hidden;
}

/* Hover state personalizat */
.fod-filtered-option:hover {
    background-color: var(--fod-palette-primary-light);
    color: var(--fod-palette-primary-contrastText);
}

/* Opțiune selectată */
.fod-filtered-option.selected {
    background-color: var(--fod-palette-primary-main);
    color: var(--fod-palette-primary-contrastText);
    font-weight: 600;
}

/* Loading state */
.fod-filtered-select-loading {
    position: relative;
}

.fod-filtered-select-loading::after {
    content: '';
    position: absolute;
    right: 40px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border: 2px solid var(--fod-palette-primary-main);
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: translateY(-50%) rotate(360deg); }
}
```

### 8. Integrare cu alte componente

#### În Wizard
```razor
<FodWizard>
    <Steps>
        <FodWizardStep Title="Selectare locație">
            <FodInputFilteredSelect @bind-Value="model.Location"
                                    Source="@locations"
                                    Label="Alegeți locația"
                                    Required="true" />
        </FodWizardStep>
        <!-- Alți pași -->
    </Steps>
</FodWizard>
```

#### În Card cu formular
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Atribuire task
        </FodText>
        <FodInputFilteredSelect @bind-Value="task.AssignedTo"
                                Source="@teamMembers"
                                Label="Asignat către"
                                Placeholder="Selectați membru echipă..." />
    </FodCardContent>
</FodCard>
```

### 9. Performanță

#### Pentru liste mari
```razor
@code {
    // Folosiți virtualizare pentru > 1000 elemente
    private async Task LoadLargeDataset()
    {
        // Încărcați doar primele N elemente
        var initialItems = await DataService.GetTopItems(100);
        
        // Încărcați restul în background
        _ = Task.Run(async () =>
        {
            var remainingItems = await DataService.GetRemainingItems();
            await InvokeAsync(() =>
            {
                items.AddRange(remainingItems);
                StateHasChanged();
            });
        });
    }
}
```

### 10. Accesibilitate

- Suport complet pentru tastatură (Tab, Enter, Escape, Arrow keys)
- ARIA labels pentru screen readers
- Anunțuri pentru rezultate filtrare
- Focus management corect
- Suport pentru high contrast mode

### 11. Validare și erori

```razor
<FodInputFilteredSelect @bind-Value="model.Category"
                        Source="@categories"
                        Label="Categorie"
                        Required="true"
                        ValidationFor="@(() => model.Category)" />

@code {
    // Validare personalizată
    private IEnumerable<string> ValidateCategory(Category? category)
    {
        if (category == null)
            yield return "Categoria este obligatorie";
        else if (category.IsDeprecated)
            yield return "Această categorie nu mai este disponibilă";
        else if (!category.IsActive)
            yield return "Categoria selectată este inactivă";
    }
}
```

### 12. Bune practici

1. **Limitați rezultatele afișate** - Nu afișați > 50-100 rezultate simultan
2. **Debounce pentru filtrare** - Așteptați 300-500ms după tastare
3. **Loading states** - Afișați indicator când se încarcă date
4. **Placeholder descriptiv** - Ajută utilizatorii să înțeleagă ce pot căuta
5. **Căutare flexibilă** - Includeți mai multe câmpuri în căutare
6. **Feedback clar** - Afișați "Niciun rezultat" când nu se găsește nimic

### 13. Troubleshooting

#### Dropdown-ul nu se deschide
- Verificați că Source nu este null sau gol
- Verificați că nu este Disabled sau ReadOnly
- Verificați z-index în CSS

#### Filtrarea nu funcționează
- Verificați că SearchableText sau Label sunt setate
- Verificați MinFilterLength
- Verificați logica de filtrare personalizată

#### Performanță slabă
- Reduceți numărul de elemente afișate
- Implementați debounce
- Folosiți virtualizare pentru liste mari
- Optimizați logica de filtrare

### 14. Exemple avansate

#### Cascading dropdowns
```razor
<FodInputFilteredSelect @bind-Value="selectedCountry"
                        Source="@countries"
                        Label="Țară"
                        @bind-Value:after="OnCountryChanged" />

<FodInputFilteredSelect @bind-Value="selectedCity"
                        Source="@cities"
                        Label="Oraș"
                        Disabled="@(selectedCountry == null)" />

@code {
    private async Task OnCountryChanged()
    {
        selectedCity = null;
        if (selectedCountry != null)
        {
            cities = await LoadCitiesForCountry(selectedCountry.Id);
        }
    }
}
```

### 15. Concluzie
`FodInputFilteredSelect` oferă o experiență superioară de selecție pentru liste mari de date, combinând funcționalitatea unui dropdown clasic cu puterea unui câmp de căutare. Cu suport pentru filtrare în timp real, validare integrată și personalizare extensivă, componenta este ideală pentru formulare complexe și interfețe moderne.