# FodSearchSelect

## Descriere Generală

`FodSearchSelect` este o componentă dropdown cu funcționalitate de căutare integrată. Extinde `FODInput` și permite utilizatorilor să caute și să selecteze elemente dintr-o listă, oferind o experiență similară cu un combobox modern. Componenta include filtrare în timp real și gestionare automată a click-urilor în afara dropdown-ului.

## Utilizare de Bază

```razor
<!-- SearchSelect simplu -->
<FodSearchSelect @bind-Value="selectedCity" 
                 SelectableObjects="@cities"
                 Label="Selectați orașul" />

<!-- SearchSelect cu placeholder -->
<FodSearchSelect @bind-Value="selectedCountry" 
                 SelectableObjects="@countries"
                 Placeholder="Căutați o țară..."
                 Nullable="true" />
```

## Configurare Date

### Folosind SelectableObjects Direct

```razor
<FodSearchSelect @bind-Value="selectedValue" 
                 SelectableObjects="@GetSelectableItems()"
                 Label="Selectați opțiunea" />

@code {
    private string selectedValue;
    
    private List<SelectableItem> GetSelectableItems()
    {
        return new List<SelectableItem>
        {
            new SelectableItem { Value = "1", Text = "Opțiunea 1" },
            new SelectableItem { Value = "2", Text = "Opțiunea 2" },
            new SelectableItem { Value = "3", Text = "Opțiunea 3" }
        };
    }
}
```

### Folosind ISelectableItemsService

```razor
@inject ISelectableItemsService SelectableItemsService

<FodSearchSelect @bind-Value="selectedDepartment" 
                 Label="Departament" />

@code {
    private string selectedDepartment;
    
    protected override async Task OnInitializedAsync()
    {
        // Serviciul va fi injectat și folosit automat de componentă
        var departments = await DepartmentService.GetDepartments();
        SelectableItemsService.SetItems("departments", departments);
    }
}
```

## Exemple de Utilizare

### Selector de Țări cu Căutare

```razor
<div class="country-selector">
    <FodSearchSelect @bind-Value="selectedCountryCode" 
                     SelectableObjects="@countryList"
                     Label="Țara"
                     Placeholder="Începeți să tastați..."
                     Nullable="true" />
    
    @if (!string.IsNullOrEmpty(selectedCountryCode))
    {
        <p class="mt-2">Țara selectată: @GetCountryName(selectedCountryCode)</p>
    }
</div>

@code {
    private string selectedCountryCode;
    private List<SelectableItem> countryList = new()
    {
        new() { Value = "MD", Text = "Moldova" },
        new() { Value = "RO", Text = "România" },
        new() { Value = "UA", Text = "Ucraina" },
        new() { Value = "RU", Text = "Rusia" },
        new() { Value = "BG", Text = "Bulgaria" },
        new() { Value = "IT", Text = "Italia" },
        new() { Value = "DE", Text = "Germania" },
        new() { Value = "FR", Text = "Franța" },
        new() { Value = "ES", Text = "Spania" },
        new() { Value = "GB", Text = "Marea Britanie" }
    };
    
    private string GetCountryName(string code)
    {
        return countryList.FirstOrDefault(c => c.Value == code)?.Text ?? code;
    }
}
```

### Selector de Produse cu Detalii

```razor
<EditForm Model="@order">
    <DataAnnotationsValidator />
    
    <FodSearchSelect @bind-Value="order.ProductId" 
                     SelectableObjects="@productItems"
                     Label="Produs"
                     Placeholder="Căutați produsul..." />
    
    @if (!string.IsNullOrEmpty(order.ProductId))
    {
        var product = products.FirstOrDefault(p => p.Id == order.ProductId);
        if (product != null)
        {
            <div class="product-details mt-3">
                <p><strong>Preț:</strong> @product.Price.ToString("C")</p>
                <p><strong>Stoc:</strong> @product.Stock unități</p>
            </div>
        }
    }
    
    <ValidationSummary />
</EditForm>

@code {
    private OrderModel order = new();
    private List<Product> products = new();
    private List<SelectableItem> productItems = new();
    
    protected override void OnInitialized()
    {
        // Simulare încărcare produse
        products = new List<Product>
        {
            new() { Id = "P001", Name = "Laptop Dell XPS 13", Price = 25000, Stock = 5 },
            new() { Id = "P002", Name = "Mouse Logitech MX Master", Price = 1500, Stock = 20 },
            new() { Id = "P003", Name = "Tastatură Mechanical RGB", Price = 2500, Stock = 15 },
            new() { Id = "P004", Name = "Monitor LG 27\" 4K", Price = 12000, Stock = 8 }
        };
        
        productItems = products.Select(p => new SelectableItem 
        { 
            Value = p.Id, 
            Text = $"{p.Name} - {p.Price:C}" 
        }).ToList();
    }
    
    public class OrderModel
    {
        [Required(ErrorMessage = "Selectați un produs")]
        public string ProductId { get; set; }
    }
    
    public class Product
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
    }
}
```

### SearchSelect Cascadat

```razor
<div class="cascading-selects">
    <div class="mb-3">
        <FodSearchSelect @bind-Value="selectedRegion" 
                         SelectableObjects="@regions"
                         Label="Regiune"
                         @bind-Value:after="OnRegionChanged" />
    </div>
    
    <div class="mb-3">
        <FodSearchSelect @bind-Value="selectedCity" 
                         SelectableObjects="@cities"
                         Label="Oraș"
                         Disabled="@(string.IsNullOrEmpty(selectedRegion))" />
    </div>
    
    <div class="mb-3">
        <FodSearchSelect @bind-Value="selectedStreet" 
                         SelectableObjects="@streets"
                         Label="Stradă"
                         Disabled="@(string.IsNullOrEmpty(selectedCity))" />
    </div>
</div>

@code {
    private string selectedRegion;
    private string selectedCity;
    private string selectedStreet;
    
    private List<SelectableItem> regions = new();
    private List<SelectableItem> cities = new();
    private List<SelectableItem> streets = new();
    
    protected override void OnInitialized()
    {
        regions = new List<SelectableItem>
        {
            new() { Value = "CH", Text = "Chișinău" },
            new() { Value = "BL", Text = "Bălți" },
            new() { Value = "CA", Text = "Cahul" }
        };
    }
    
    private async Task OnRegionChanged()
    {
        selectedCity = null;
        selectedStreet = null;
        cities.Clear();
        streets.Clear();
        
        if (!string.IsNullOrEmpty(selectedRegion))
        {
            // Simulare încărcare orașe pentru regiunea selectată
            cities = selectedRegion switch
            {
                "CH" => new List<SelectableItem>
                {
                    new() { Value = "CH", Text = "Chișinău" },
                    new() { Value = "CR", Text = "Cricova" },
                    new() { Value = "CD", Text = "Codru" }
                },
                "BL" => new List<SelectableItem>
                {
                    new() { Value = "BL", Text = "Bălți" },
                    new() { Value = "FL", Text = "Fălești" },
                    new() { Value = "SG", Text = "Sângerei" }
                },
                _ => new List<SelectableItem>()
            };
        }
        
        StateHasChanged();
    }
}
```

### SearchSelect cu Date Dinamice

```razor
<div class="dynamic-search">
    <FodSearchSelect @bind-Value="selectedEmployee" 
                     SelectableObjects="@filteredEmployees"
                     Label="Angajat"
                     Placeholder="Nume sau departament..." />
    
    <div class="filters mt-3">
        <label>
            <input type="checkbox" @bind="showActiveOnly" @bind:after="FilterEmployees" />
            Doar angajați activi
        </label>
    </div>
</div>

@code {
    private string selectedEmployee;
    private bool showActiveOnly = true;
    private List<Employee> allEmployees = new();
    private List<SelectableItem> filteredEmployees = new();
    
    protected override async Task OnInitializedAsync()
    {
        // Încărcare date
        allEmployees = await EmployeeService.GetAllEmployees();
        FilterEmployees();
    }
    
    private void FilterEmployees()
    {
        var filtered = showActiveOnly 
            ? allEmployees.Where(e => e.IsActive) 
            : allEmployees;
            
        filteredEmployees = filtered.Select(e => new SelectableItem
        {
            Value = e.Id.ToString(),
            Text = $"{e.Name} - {e.Department}"
        }).ToList();
        
        // Reset selecție dacă angajatul selectat nu mai este în listă
        if (!filteredEmployees.Any(e => e.Value == selectedEmployee))
        {
            selectedEmployee = null;
        }
    }
    
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Department { get; set; }
        public bool IsActive { get; set; }
    }
}
```

## Funcționalități Cheie

### Filtrare în Timp Real

Componenta filtrează automat elementele pe baza textului introdus:

```csharp
private IEnumerable<SelectableItem> FilterSelectableItems(string? keyWord)
{
    if (string.IsNullOrEmpty(keyWord))
    {
        return SelectableItems;
    }
    else
    {
        return SelectableItems.Where(sr => sr.Text.ToLower().Contains(keyWord.ToLower()));
    }
}
```

### Gestionare Click Outside

Utilizează componenta `OutsideHandleContainer` pentru a închide dropdown-ul când se face click în afară:

```razor
<OutsideHandleContainer OnClickOutside="@(() => { ShowOptions = false; StateHasChanged(); })">
    <!-- Conținut dropdown -->
</OutsideHandleContainer>
```

### Suport pentru Valori Null

```razor
@if (Nullable)
{
    <option class="option" value="">@Placeholder</option>
}
```

## Stilizare

### Stiluri Implicite

```css
.option {
    cursor: pointer;
    padding: 2px 14px;
}

.option:hover {
    background-color: #1967d2;
    color: white;
}
```

### Personalizare Stiluri

```razor
<style>
    .custom-search-select .option {
        padding: 8px 16px;
        border-bottom: 1px solid #eee;
        transition: all 0.2s ease;
    }
    
    .custom-search-select .option:hover {
        background-color: #f0f8ff;
        color: #0066cc;
        padding-left: 20px;
    }
    
    .custom-search-select input[type="search"] {
        border: 2px solid #ddd;
        border-radius: 8px;
        padding: 10px 15px;
    }
    
    .custom-search-select input[type="search"]:focus {
        border-color: #0066cc;
        outline: none;
    }
    
    .custom-search-select .dropdown-container {
        border-radius: 8px;
        margin-top: 4px;
        max-height: 300px;
    }
</style>

<div class="custom-search-select">
    <FodSearchSelect @bind-Value="customValue" 
                     SelectableObjects="@items"
                     Label="Selector Personalizat" />
</div>
```

## Integrare cu Servicii

### Implementare ISelectableItemsService

```csharp
public interface ISelectableItemsService
{
    void SetItems(string key, IEnumerable<SelectableItem> items);
    IEnumerable<SelectableItem> GetItems(string key);
}

public class SelectableItemsService : ISelectableItemsService
{
    private readonly Dictionary<string, IEnumerable<SelectableItem>> _items = new();
    
    public void SetItems(string key, IEnumerable<SelectableItem> items)
    {
        _items[key] = items;
    }
    
    public IEnumerable<SelectableItem> GetItems(string key)
    {
        return _items.TryGetValue(key, out var items) ? items : Enumerable.Empty<SelectableItem>();
    }
}
```

## Model SelectableItem

```csharp
public class SelectableItem
{
    public string Value { get; set; }
    public string Text { get; set; }
}
```

## Proprietăți Moștenite

Din `FODInput`:
- `Value` - Valoarea selectată
- `Label` - Eticheta componentei
- `Placeholder` - Text placeholder
- `Nullable` - Permite valoare null
- `Id` - ID-ul componentei
- `CssClass` - Clase CSS adiționale

## Best Practices

1. **Date Pre-încărcate** - Încărcați datele înainte de renderare pentru performanță
2. **Limite Rezonabile** - Limitați numărul de elemente pentru liste mari
3. **Căutare Server-Side** - Pentru seturi mari de date, implementați căutare pe server
4. **Feedback Vizual** - Afișați indicator de încărcare pentru date asincrone
5. **Validare** - Verificați că valoarea selectată există în listă

## Performanță

- Filtrarea se face client-side pentru toate elementele
- Pentru liste mari (>1000 elemente), considerați paginare sau căutare server-side
- Componenta re-renderează doar dropdown-ul la filtrare

## Limitări

- Nu suportă selecție multiplă
- Nu are virtualizare pentru liste foarte mari
- Căutarea este case-insensitive dar nu suportă diacritice
- Nu suportă grupare de elemente

## Concluzie

FodSearchSelect oferă o experiență modernă de selecție cu căutare integrată, ideală pentru liste de dimensiuni medii unde utilizatorii au nevoie să găsească rapid opțiunea dorită. Componenta combină simplitatea unui dropdown tradițional cu puterea căutării în timp real.