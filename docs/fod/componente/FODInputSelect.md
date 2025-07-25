# FODInputSelect

## Descriere Generală

`FODInputSelect` este componenta dropdown select pentru FOD.Components. Oferă suport pentru binding bidirecțional, validare integrată cu EditForm, localizare automată pentru enum-uri și opțiune default configurabilă. Componenta moștenește din `FODSelectableFormComponent<T>` și suportă tipuri generice.

## Utilizare de Bază

```razor
<!-- Select simplu -->
<FODInputSelect @bind-Value="selectedCountry" 
                Options="@countries"
                Label="Țară" />

<!-- Select cu enum -->
<FODInputSelect @bind-Value="status"
                Label="Status Comandă"
                Options="@GetEnumOptions<OrderStatus>()" />

<!-- Select cu opțiune default personalizată -->
<FODInputSelect @bind-Value="selectedCity"
                Options="@cities"
                Label="Oraș"
                DefaultOptionText="-- Alegeți orașul --" />

@code {
    private string selectedCountry;
    private OrderStatus status;
    private string selectedCity;
    
    private List<SelectableItem<string>> countries = new()
    {
        new("MD", "Moldova"),
        new("RO", "România"),
        new("UA", "Ucraina")
    };
    
    private List<SelectableItem<string>> cities = new()
    {
        new("chisinau", "Chișinău"),
        new("balti", "Bălți"),
        new("tiraspol", "Tiraspol")
    };
}
```

## Atribute Disponibile

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Value | T | - | Valoarea selectată |
| Options | IEnumerable<SelectableItem<T>> | - | Lista de opțiuni |
| Label | string | - | Eticheta select-ului |
| DefaultOption | bool | false | Selectează prima opțiune automat |
| DefaultOptionText | string | "Select..." | Text pentru opțiunea default |
| Required | bool | false | Câmp obligatoriu |
| Readonly | bool | false | Doar citire |
| CssClass | string | - | Clase CSS adiționale |
| isInvalid | bool | false | Stare de invalidare |
| Id | string | Guid | ID unic pentru element |
| Name | string | - | Numele câmpului |
| ValueExpression | Expression<Func<T>> | - | Expresie pentru validare |
| OnValueChanged | EventCallback<T> | - | Eveniment la schimbare |
| For | Expression<Func<T>> | - | Expresie pentru EditForm |

## Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| OnValueChanged | EventCallback<T> | Declanșat la schimbarea selecției |
| OnChange | ChangeEventArgs | Handler intern pentru schimbare |

## Metode Publice

| Metodă | Returnează | Descriere |
|--------|------------|-----------|
| GetName() | string | Returnează numele câmpului |
| GetDescription(SelectableItem<T>) | string | Obține descrierea localizată |
| GetLocalizedString(Type, string) | string | Obține string localizat |

## Exemple Avansate

### Select cu Enum Localizat

```razor
<FODInputSelect @bind-Value="model.UserRole"
                For="@(() => model.UserRole)"
                Label="Rol Utilizator"
                Options="@GetLocalizedRoleOptions()"
                Required="true" />

@code {
    private UserModel model = new();
    
    public enum UserRole
    {
        [Display(Name = "Role_Admin", ResourceType = typeof(Resources.Roles))]
        Administrator,
        
        [Display(Name = "Role_Operator", ResourceType = typeof(Resources.Roles))]
        Operator,
        
        [Display(Name = "Role_Guest", ResourceType = typeof(Resources.Roles))]
        Guest
    }
    
    private List<SelectableItem<UserRole>> GetLocalizedRoleOptions()
    {
        return Enum.GetValues<UserRole>()
            .Select(role => new SelectableItem<UserRole>(role, GetRoleDisplayName(role)))
            .ToList();
    }
}
```

### Select cu Validare

```razor
<EditForm Model="@order" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />
    
    <FODInputSelect @bind-Value="order.PaymentMethod"
                    For="@(() => order.PaymentMethod)"
                    Label="Metoda de plată"
                    Options="@paymentMethods"
                    Required="true"
                    isInvalid="@(validationErrors.ContainsKey("PaymentMethod"))" />
    
    <ValidationMessage For="@(() => order.PaymentMethod)" />
    
    <FODInputSelect @bind-Value="order.DeliveryAddress"
                    For="@(() => order.DeliveryAddress)"
                    Label="Adresa de livrare"
                    Options="@addresses"
                    DefaultOptionText="-- Selectați adresa --" />
    
    <FodButton Type="submit">Plasează Comanda</FodButton>
</EditForm>

@code {
    private OrderModel order = new();
    private Dictionary<string, string> validationErrors = new();
    
    private List<SelectableItem<string>> paymentMethods = new()
    {
        new("card", "Card Bancar"),
        new("cash", "Numerar la livrare"),
        new("transfer", "Transfer Bancar")
    };
    
    public class OrderModel
    {
        [Required(ErrorMessage = "Selectați metoda de plată")]
        public string PaymentMethod { get; set; }
        
        public string DeliveryAddress { get; set; }
    }
}
```

### Select Cascadă

```razor
<FODInputSelect @bind-Value="selectedCountry"
                Label="Țară"
                Options="@countries"
                OnValueChanged="@OnCountryChanged" />

@if (regions?.Any() == true)
{
    <FODInputSelect @bind-Value="selectedRegion"
                    Label="Regiune"
                    Options="@regions"
                    OnValueChanged="@OnRegionChanged" />
}

@if (cities?.Any() == true)
{
    <FODInputSelect @bind-Value="selectedCity"
                    Label="Oraș"
                    Options="@cities" />
}

@code {
    private string selectedCountry;
    private string selectedRegion;
    private string selectedCity;
    
    private List<SelectableItem<string>> countries;
    private List<SelectableItem<string>> regions;
    private List<SelectableItem<string>> cities;
    
    protected override async Task OnInitializedAsync()
    {
        countries = await LoadCountries();
    }
    
    private async Task OnCountryChanged(string country)
    {
        selectedRegion = null;
        selectedCity = null;
        regions = await LoadRegions(country);
        cities = null;
    }
    
    private async Task OnRegionChanged(string region)
    {
        selectedCity = null;
        cities = await LoadCities(selectedCountry, region);
    }
}
```

### Select cu Obiecte Complexe

```razor
<FODInputSelect @bind-Value="selectedEmployee"
                Label="Responsabil"
                Options="@employeeOptions"
                DefaultOptionText="-- Fără responsabil --" />

@if (selectedEmployee != null)
{
    <div class="selected-info mt-3">
        <strong>Selectat:</strong> @selectedEmployee.Name<br/>
        <strong>Departament:</strong> @selectedEmployee.Department<br/>
        <strong>Email:</strong> @selectedEmployee.Email
    </div>
}

@code {
    private Employee selectedEmployee;
    private List<SelectableItem<Employee>> employeeOptions;
    
    protected override async Task OnInitializedAsync()
    {
        var employees = await EmployeeService.GetActiveEmployees();
        
        employeeOptions = employees
            .Select(e => new SelectableItem<Employee>(
                e, 
                $"{e.Name} - {e.Department}"
            ))
            .ToList();
    }
    
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Department { get; set; }
        public string Email { get; set; }
    }
}
```

### Select cu Grupare Vizuală

```razor
<FODInputSelect @bind-Value="selectedProduct"
                Label="Produs"
                Options="@productOptions"
                CssClass="grouped-select">
    <ChildContent>
        <option value="">-- Selectați produsul --</option>
        @foreach (var category in groupedProducts)
        {
            <optgroup label="@category.Key">
                @foreach (var product in category.Value)
                {
                    <option value="@product.Id">@product.Name - @product.Price.ToString("C")</option>
                }
            </optgroup>
        }
    </ChildContent>
</FODInputSelect>

@code {
    private string selectedProduct;
    private Dictionary<string, List<Product>> groupedProducts;
    
    protected override async Task OnInitializedAsync()
    {
        var products = await ProductService.GetAll();
        groupedProducts = products.GroupBy(p => p.Category)
                                 .ToDictionary(g => g.Key, g => g.ToList());
    }
}
```

### Select cu Stil Personalizat

```razor
<style>
    .custom-select-wrapper .fod-select select {
        border-radius: 20px;
        padding: 10px 20px;
        border: 2px solid #e0e0e0;
        transition: all 0.3s ease;
    }
    
    .custom-select-wrapper .fod-select select:focus {
        border-color: var(--fod-primary);
        box-shadow: 0 0 0 0.2rem rgba(var(--fod-primary-rgb), 0.25);
    }
    
    .custom-select-wrapper .fod-select select.invalid {
        border-color: var(--fod-error);
        background-color: rgba(var(--fod-error-rgb), 0.05);
    }
</style>

<div class="custom-select-wrapper">
    <FODInputSelect @bind-Value="selectedOption"
                    Label="Opțiune Stilizată"
                    Options="@options"
                    CssClass="custom-styled" />
</div>
```

### Select cu Pre-selectare Condiționată

```razor
<FODInputSelect @bind-Value="model.PreferredLanguage"
                Label="Limba preferată"
                Options="@languages"
                DefaultOption="true" />

@code {
    private UserPreferences model = new();
    private List<SelectableItem<string>> languages;
    
    protected override async Task OnInitializedAsync()
    {
        // Încarcă limbile disponibile
        languages = new List<SelectableItem<string>>
        {
            new("ro", "Română"),
            new("en", "English"),
            new("ru", "Русский")
        };
        
        // Setează limba bazată pe browser sau preferințe salvate
        model.PreferredLanguage = await GetUserPreferredLanguage() ?? "ro";
    }
}
```

## Componente Asociate

- `FODInputWrapper` - Container pentru elementele de formular
- `FODSelectableFormComponent<T>` - Clasă de bază pentru componente cu selecție
- `ValidationMessage` - Afișare mesaje de validare
- `SelectableItem<T>` - Model pentru opțiuni

## Stilizare

### Clase CSS

```css
.fod-select
.custom-select
.form-control
.invalid
```

### Personalizare Aspect

```css
/* Select personalizat */
.fod-select select {
    appearance: none;
    background-image: url("data:image/svg+xml,..."); /* Arrow custom */
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;
    padding-right: 2.5rem;
}

/* Focus state */
.fod-select select:focus {
    border-color: var(--fod-primary);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(var(--fod-primary-rgb), 0.25);
}

/* Invalid state */
.fod-select select.invalid {
    border-color: var(--fod-error);
    background-image: url("data:image/svg+xml,..."); /* Error icon */
}

/* Disabled state */
.fod-select select:disabled {
    background-color: #e9ecef;
    opacity: 0.65;
}
```

## Note și Observații

1. **Generic Type** - Suportă orice tip T care poate fi serializat
2. **Enum Support** - Suport automat pentru Display attributes
3. **Null Handling** - Prima opțiune poate fi null/empty
4. **Validation** - Integrare completă cu EditForm
5. **Accessibility** - ID-uri unice generate automat

## Bune Practici

1. Folosiți `For` pentru integrare corectă cu validarea
2. Setați `DefaultOptionText` descriptiv
3. Limitați numărul de opțiuni (folosiți filtrat pentru liste mari)
4. Grupați opțiunile logic când sunt multe
5. Adăugați tooltips pentru opțiuni complexe
6. Validați pe server selecțiile critice
7. Folosiți `DefaultOption` doar când are sens logic

## Concluzie

FODInputSelect oferă o implementare robustă pentru dropdown-uri în aplicații Blazor. Cu suport pentru tipuri generice, localizare automată și integrare completă cu sistemul de validare, componenta acoperă majoritatea necesităților pentru selecție din liste în formulare.