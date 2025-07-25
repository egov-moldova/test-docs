# FodCustomInputSelect

## Descriere Generală

`FodCustomInputSelect<T>` este o componentă generică avansată pentru dropdown-uri care extinde `FodCustomSelectableFormComponent<T>`. Oferă funcționalități extinse față de select-ul standard, inclusiv suport pentru tipuri generice, enum-uri cu localizare, opțiuni dezactivate/ascunse și integrare completă cu sistemul de validare Blazor.

## Utilizare de Bază

```razor
<!-- Select simplu cu string -->
<FodCustomInputSelect @bind-Value="selectedCountry" 
                      Options="@countryOptions"
                      Label="Țară" />

<!-- Select cu enum -->
<FodCustomInputSelect @bind-Value="selectedStatus" 
                      EnumType="@typeof(OrderStatus)"
                      Label="Status comandă" />

<!-- Select cu tip complex -->
<FodCustomInputSelect @bind-Value="selectedProduct" 
                      Options="@productOptions"
                      Label="Produs"
                      DefaultOptionText="Alegeți un produs..." />
```

## Configurare Opțiuni

### CustomSelectableItem<T>

```csharp
public class CustomSelectableItem<T>
{
    public string Value { get; set; }      // Valoarea pentru HTML
    public string Text { get; set; }       // Textul afișat
    public T Data { get; set; }           // Obiectul asociat
    public bool Disabled { get; set; }    // Dezactivat
    public bool Hidden { get; set; }      // Ascuns
}
```

### Exemple de Configurare

```razor
@code {
    // Opțiuni simple (string)
    private List<CustomSelectableItem<string>> simpleOptions = new()
    {
        new() { Value = "md", Text = "Moldova", Data = "MD" },
        new() { Value = "ro", Text = "România", Data = "RO" },
        new() { Value = "ua", Text = "Ucraina", Data = "UA" }
    };
    
    // Opțiuni cu obiecte complexe
    private List<CustomSelectableItem<Product>> productOptions = new()
    {
        new() 
        { 
            Value = "1", 
            Text = "Laptop Dell XPS 13", 
            Data = new Product { Id = 1, Name = "Dell XPS 13", Price = 25000 }
        },
        new() 
        { 
            Value = "2", 
            Text = "MacBook Pro 14", 
            Data = new Product { Id = 2, Name = "MacBook Pro", Price = 45000 },
            Disabled = true // Stoc epuizat
        }
    };
}
```

## Atribute și Parametri

| Parametru | Tip | Default | Descriere |
|-----------|-----|---------|-----------|
| Options | List<CustomSelectableItem<T>> | null | Lista de opțiuni |
| DefaultOptionText | string | "Select..." | Text pentru opțiunea implicită |
| DefaultOption | bool | false | Selectează automat prima opțiune |
| BoldText | bool | false | Text label îngroșat |
| isInvalid | bool | false | Marchează select-ul ca invalid |
| EnumType | Type | null | Tip enum pentru generare automată |
| Readonly | bool | false | Dezactivează select-ul |

## Exemple de Utilizare

### Formular de Comandă

```razor
<EditForm Model="@order" OnValidSubmit="@SubmitOrder">
    <DataAnnotationsValidator />
    
    <FodCustomInputSelect @bind-Value="order.Customer" 
                          Options="@customerOptions"
                          Label="Client"
                          DefaultOptionText="Selectați clientul..." />
    
    <FodCustomInputSelect @bind-Value="order.Priority" 
                          EnumType="@typeof(OrderPriority)"
                          Label="Prioritate" />
    
    <FodCustomInputSelect @bind-Value="order.ShippingMethod" 
                          Options="@shippingOptions"
                          Label="Metodă livrare"
                          @bind-Value:after="UpdateShippingCost" />
    
    <ValidationSummary />
    <button type="submit">Plasează comanda</button>
</EditForm>

@code {
    private OrderModel order = new();
    private decimal shippingCost;
    
    private List<CustomSelectableItem<Customer>> customerOptions;
    private List<CustomSelectableItem<ShippingMethod>> shippingOptions;
    
    protected override async Task OnInitializedAsync()
    {
        // Încărcare clienți
        var customers = await CustomerService.GetActiveCustomers();
        customerOptions = customers.Select(c => new CustomSelectableItem<Customer>
        {
            Value = c.Id.ToString(),
            Text = $"{c.Name} - {c.Company}",
            Data = c
        }).ToList();
        
        // Opțiuni livrare
        shippingOptions = new()
        {
            new() 
            { 
                Value = "standard", 
                Text = "Standard (3-5 zile)", 
                Data = new ShippingMethod { Id = "standard", Cost = 50 }
            },
            new() 
            { 
                Value = "express", 
                Text = "Express (1-2 zile)", 
                Data = new ShippingMethod { Id = "express", Cost = 100 }
            },
            new() 
            { 
                Value = "urgent", 
                Text = "Urgent (în aceeași zi)", 
                Data = new ShippingMethod { Id = "urgent", Cost = 200 },
                Disabled = !IsWorkingDay() // Dezactivat în weekend
            }
        };
    }
    
    private void UpdateShippingCost()
    {
        shippingCost = order.ShippingMethod?.Cost ?? 0;
    }
    
    public class OrderModel
    {
        [Required(ErrorMessage = "Selectați clientul")]
        public Customer Customer { get; set; }
        
        [Required(ErrorMessage = "Selectați prioritatea")]
        public OrderPriority Priority { get; set; }
        
        [Required(ErrorMessage = "Selectați metoda de livrare")]
        public ShippingMethod ShippingMethod { get; set; }
    }
    
    public enum OrderPriority
    {
        [Display(Name = "Normală")]
        Normal,
        [Display(Name = "Urgentă")]
        Urgent,
        [Display(Name = "Critică")]
        Critical
    }
}
```

### Select cu Enum Localizat

```razor
<FodCustomInputSelect @bind-Value="selectedLanguage" 
                      EnumType="@typeof(Language)"
                      Label="Limba preferată"
                      DefaultOption="true" />

@code {
    private Language selectedLanguage;
    
    public enum Language
    {
        [Display(Name = "Romanian", ResourceType = typeof(LanguageResources))]
        Romanian,
        
        [Display(Name = "Russian", ResourceType = typeof(LanguageResources))]
        Russian,
        
        [Display(Name = "English", ResourceType = typeof(LanguageResources))]
        English
    }
}

// În LanguageResources.resx
// Romanian = Română
// Russian = Русский  
// English = English
```

### Select Dinamic cu Filtrare

```razor
<div class="dynamic-select-container">
    <div class="filters mb-3">
        <FodCheckbox @bind-Value="showOnlyActive" 
                     Label="Doar active"
                     @bind-Value:after="FilterOptions" />
        
        <FodCheckbox @bind-Value="showOnlyAvailable" 
                     Label="Doar disponibile"
                     @bind-Value:after="FilterOptions" />
    </div>
    
    <FodCustomInputSelect @bind-Value="selectedItem" 
                          Options="@filteredOptions"
                          Label="Selectați elementul"
                          DefaultOptionText="-- Alegeți --"
                          isInvalid="@(!IsValidSelection())" />
    
    @if (selectedItem != null)
    {
        <div class="selection-details mt-3">
            <h5>Detalii selecție:</h5>
            <p>Nume: @selectedItem.Name</p>
            <p>Status: @selectedItem.Status</p>
            <p>Disponibil: @(selectedItem.IsAvailable ? "Da" : "Nu")</p>
        </div>
    }
</div>

@code {
    private Item selectedItem;
    private List<Item> allItems = new();
    private List<CustomSelectableItem<Item>> filteredOptions = new();
    
    private bool showOnlyActive = true;
    private bool showOnlyAvailable = true;
    
    protected override async Task OnInitializedAsync()
    {
        allItems = await ItemService.GetAllItems();
        FilterOptions();
    }
    
    private void FilterOptions()
    {
        var filtered = allItems.AsEnumerable();
        
        if (showOnlyActive)
            filtered = filtered.Where(i => i.Status == "Active");
            
        if (showOnlyAvailable)
            filtered = filtered.Where(i => i.IsAvailable);
        
        filteredOptions = filtered.Select(item => new CustomSelectableItem<Item>
        {
            Value = item.Id.ToString(),
            Text = $"{item.Name} ({item.Code})",
            Data = item,
            Disabled = !item.IsSelectable
        }).ToList();
        
        // Reset selecție dacă nu mai e validă
        if (selectedItem != null && !filtered.Contains(selectedItem))
        {
            selectedItem = null;
        }
    }
    
    private bool IsValidSelection()
    {
        return selectedItem == null || selectedItem.IsValid;
    }
}
```

### Select în Cascadă

```razor
<div class="cascading-selects">
    <FodCustomInputSelect @bind-Value="selectedCategory" 
                          Options="@categoryOptions"
                          Label="Categorie"
                          @bind-Value:after="LoadSubcategories" />
    
    <FodCustomInputSelect @bind-Value="selectedSubcategory" 
                          Options="@subcategoryOptions"
                          Label="Subcategorie"
                          Readonly="@(selectedCategory == null)" />
    
    <FodCustomInputSelect @bind-Value="selectedProduct" 
                          Options="@productOptions"
                          Label="Produs"
                          Readonly="@(selectedSubcategory == null)" />
</div>

@code {
    private Category selectedCategory;
    private Subcategory selectedSubcategory;
    private Product selectedProduct;
    
    private List<CustomSelectableItem<Category>> categoryOptions;
    private List<CustomSelectableItem<Subcategory>> subcategoryOptions = new();
    private List<CustomSelectableItem<Product>> productOptions = new();
    
    protected override async Task OnInitializedAsync()
    {
        var categories = await CategoryService.GetCategories();
        categoryOptions = categories.Select(c => new CustomSelectableItem<Category>
        {
            Value = c.Id.ToString(),
            Text = c.Name,
            Data = c
        }).ToList();
    }
    
    private async Task LoadSubcategories()
    {
        selectedSubcategory = null;
        selectedProduct = null;
        subcategoryOptions.Clear();
        productOptions.Clear();
        
        if (selectedCategory != null)
        {
            var subcategories = await CategoryService.GetSubcategories(selectedCategory.Id);
            subcategoryOptions = subcategories.Select(s => new CustomSelectableItem<Subcategory>
            {
                Value = s.Id.ToString(),
                Text = s.Name,
                Data = s
            }).ToList();
        }
    }
}
```

### Select cu Grupare Vizuală

```razor
<style>
    .grouped-option {
        padding-left: 20px;
    }
    
    .group-header {
        font-weight: bold;
        background-color: #f0f0f0;
    }
</style>

<FodCustomInputSelect @bind-Value="selectedOffice" 
                      Options="@groupedOfficeOptions"
                      Label="Birou"
                      DefaultOptionText="Selectați biroul..." />

@code {
    private Office selectedOffice;
    private List<CustomSelectableItem<Office>> groupedOfficeOptions;
    
    protected override void OnInitialized()
    {
        groupedOfficeOptions = new();
        
        var officesByRegion = offices.GroupBy(o => o.Region);
        
        foreach (var group in officesByRegion)
        {
            // Adaugă header pentru grup (dezactivat)
            groupedOfficeOptions.Add(new CustomSelectableItem<Office>
            {
                Value = $"header-{group.Key}",
                Text = $"-- {group.Key} --",
                Data = null,
                Disabled = true
            });
            
            // Adaugă birourile din grup
            foreach (var office in group)
            {
                groupedOfficeOptions.Add(new CustomSelectableItem<Office>
                {
                    Value = office.Id.ToString(),
                    Text = $"    {office.Name}",
                    Data = office
                });
            }
        }
    }
}
```

## Stilizare

### CSS pentru Select Invalid

```css
.fod-select select.invalid {
    border-color: #dc3545;
    background-image: url("data:image/svg+xml,...");
    background-repeat: no-repeat;
    background-position: right .75rem center;
    background-size: 16px 12px;
}

.fod-select select.invalid:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
```

### Stilizare Personalizată

```css
/* Select modern */
.modern-select select {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px 15px;
    font-size: 16px;
    transition: all 0.3s;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg...%3e");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 20px;
}

.modern-select select:focus {
    border-color: #007bff;
    outline: none;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Opțiuni dezactivate */
.modern-select option:disabled {
    color: #999;
    font-style: italic;
}
```

## Validare

### Validare cu Atribute

```csharp
public class FormModel
{
    [Required(ErrorMessage = "Selectați o opțiune")]
    public MyEnum EnumValue { get; set; }
    
    [Required(ErrorMessage = "Clientul este obligatoriu")]
    public Customer Customer { get; set; }
    
    [CustomValidation(typeof(FormModel), nameof(ValidateProduct))]
    public Product Product { get; set; }
    
    public static ValidationResult ValidateProduct(Product product, ValidationContext context)
    {
        if (product?.IsAvailable == false)
        {
            return new ValidationResult("Produsul selectat nu este disponibil");
        }
        return ValidationResult.Success;
    }
}
```

## Moștenire și Extensibilitate

FodCustomInputSelect extinde `FodCustomSelectableFormComponent<T>` care oferă:
- Generare automată din enum-uri
- Suport pentru binding two-way
- Integrare cu EditForm
- Validare automată

## Best Practices

1. **Folosiți tipuri generice** - Pentru type safety
2. **DefaultOptionText descriptiv** - Ajută utilizatorii
3. **Validare adecvată** - Pentru selecții obligatorii
4. **Grupare logică** - Pentru liste lungi
5. **Feedback vizual** - Pentru stări invalide
6. **Lazy loading** - Pentru date mari

## Performanță

- Opțiunile sunt generate o singură dată
- Re-renderare minimă la schimbare selecție
- Pentru liste foarte mari (>1000), considerați paginare sau virtualizare

## Diferențe față de FODInputSelect

| Caracteristică | FodCustomInputSelect | FODInputSelect |
|----------------|---------------------|----------------|
| Tipuri generice | Da (T) | Da (TValue) |
| Obiecte complexe | CustomSelectableItem<T> | SelectableItem |
| Opțiuni dezactivate | Da | Nu |
| Opțiuni ascunse | Da | Nu |
| Localizare enum | ResourceType | Standard |

## Concluzie

FodCustomInputSelect oferă o soluție puternică și flexibilă pentru dropdown-uri în aplicații Blazor, cu suport pentru tipuri generice, validare complexă și numeroase opțiuni de personalizare. Este ideală pentru formulare care necesită selecții din liste de obiecte complexe sau enum-uri localizate.