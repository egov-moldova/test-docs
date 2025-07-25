# FODInputRadio

## Descriere Generală

`FODInputRadio` și `FODInputRadioGroup` formează sistemul de butoane radio pentru FOD.Components. Sistemul oferă două moduri de afișare (radio clasic și butoane), suport pentru binding bidirecțional, validare integrată cu EditForm și localizare automată pentru enum-uri.

## Utilizare de Bază

```razor
<!-- Radio group simplu -->
<FODInputRadioGroup @bind-Value="selectedOption" 
                    Options="@options"
                    Label="Selectați o opțiune" />

<!-- Radio group cu enum -->
<FODInputRadioGroup @bind-Value="status" 
                    Label="Status"
                    Options="@GetEnumOptions<OrderStatus>()" />

<!-- Radio buttons stil butoane -->
<FODInputRadioGroup @bind-Value="size"
                    Type="FodRadioType.Button"
                    Label="Dimensiune"
                    Options="@sizeOptions" />

@code {
    private string selectedOption;
    private OrderStatus status;
    private string size = "M";
    
    private List<SelectableItem<string>> options = new()
    {
        new("opt1", "Opțiunea 1"),
        new("opt2", "Opțiunea 2"),
        new("opt3", "Opțiunea 3")
    };
    
    private List<SelectableItem<string>> sizeOptions = new()
    {
        new("S", "Small"),
        new("M", "Medium"),
        new("L", "Large"),
        new("XL", "Extra Large")
    };
}
```

## Atribute Disponibile

### FODInputRadioGroup

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Value | T | - | Valoarea selectată |
| Options | IEnumerable<SelectableItem<T>> | - | Lista de opțiuni |
| Label | string | - | Eticheta grupului |
| Type | FodRadioType | Radio | Tipul afișării (Radio/Button) |
| Disable | bool | false | Dezactivează toate opțiunile |
| Required | bool | false | Câmp obligatoriu |
| BoldText | bool | false | Text îngroșat pentru label |
| LabelFontSize | int | 0 | Dimensiune font label |
| InputFontSize | int | 0 | Dimensiune font input |
| ValueExpression | Expression<Func<T>> | - | Expresie pentru validare |
| ValueChanged | EventCallback<T> | - | Eveniment la schimbare |
| For | Expression<Func<T>> | - | Expresie pentru EditForm |

### FODInputRadio (folosit intern)

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Item | SelectableItem<T> | - | Elementul reprezentat |
| Disable | bool | false | Dezactivează opțiunea |
| Label | string | - | Label personalizat |
| LabelFontSize | int | 0 | Dimensiune font label |
| InputFontSize | int | 0 | Dimensiune font input |

## Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| ValueChanged | EventCallback<T> | Declanșat la selectare opțiune |
| OnClick | EventCallback | Click pe radio button |

## Metode Publice

| Metodă | Returnează | Descriere |
|--------|------------|-----------|
| GetName() | string | Returnează numele grupului |
| SetSelectedValue(T) | Task | Setează valoarea selectată |
| TryGetValue() | string | Obține valoarea curentă ca string |

## Tipuri și Enum-uri

### FodRadioType

```csharp
public enum FodRadioType
{
    Radio,    // Butoane radio clasice
    Button    // Afișare ca grup de butoane
}
```

### SelectableItem<T>

```csharp
public class SelectableItem<T>
{
    public string Value { get; set; }    // Valoarea internă
    public string Text { get; set; }     // Textul afișat
    public T Data { get; set; }          // Obiectul asociat
    
    public SelectableItem(T data, string text)
    {
        Data = data;
        Value = data?.ToString();
        Text = text;
    }
}
```

## Exemple Avansate

### Radio Group cu Enum Localizat

```razor
<FODInputRadioGroup @bind-Value="priority"
                    Label="Prioritate"
                    Options="@GetLocalizedEnumOptions<Priority>()"
                    Required="true" />

@code {
    private Priority priority = Priority.Normal;
    
    public enum Priority
    {
        [Display(Name = "Priority_Low", ResourceType = typeof(Resources.Enums))]
        Low,
        
        [Display(Name = "Priority_Normal", ResourceType = typeof(Resources.Enums))]
        Normal,
        
        [Display(Name = "Priority_High", ResourceType = typeof(Resources.Enums))]
        High,
        
        [Display(Name = "Priority_Urgent", ResourceType = typeof(Resources.Enums))]
        Urgent
    }
    
    private List<SelectableItem<Priority>> GetLocalizedEnumOptions<TEnum>() 
        where TEnum : Enum
    {
        return Enum.GetValues<TEnum>()
            .Select(e => new SelectableItem<TEnum>((TEnum)(object)e, GetEnumDisplayName(e)))
            .ToList();
    }
}
```

### Radio Buttons cu Stilizare

```razor
<style>
    .custom-radio-group .fod-radio-button-group {
        gap: 10px;
    }
    
    .custom-radio-group .btn-check:checked + .btn {
        background-color: var(--fod-primary);
        color: white;
        border-color: var(--fod-primary);
    }
    
    .custom-radio-group .btn {
        min-width: 100px;
        padding: 10px 20px;
        border-radius: 25px;
    }
</style>

<div class="custom-radio-group">
    <FODInputRadioGroup @bind-Value="selectedPlan"
                        Type="FodRadioType.Button"
                        Label="Selectați planul"
                        Options="@planOptions" />
</div>

@code {
    private string selectedPlan = "standard";
    
    private List<SelectableItem<string>> planOptions = new()
    {
        new("basic", "Basic - 10 MDL"),
        new("standard", "Standard - 25 MDL"),
        new("premium", "Premium - 50 MDL")
    };
}
```

### Radio Group cu Validare Personalizată

```razor
<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />
    
    <FODInputRadioGroup @bind-Value="model.DeliveryMethod"
                        For="@(() => model.DeliveryMethod)"
                        Label="Metoda de livrare"
                        Options="@deliveryOptions"
                        Required="true" />
    
    @if (model.DeliveryMethod == "courier")
    {
        <FodInput @bind-Value="model.Address"
                  Label="Adresa de livrare"
                  Required="true" />
    }
    
    <ValidationSummary />
    <FodButton Type="submit">Continuă</FodButton>
</EditForm>

@code {
    private OrderModel model = new();
    
    private List<SelectableItem<string>> deliveryOptions = new()
    {
        new("pickup", "Ridicare personală"),
        new("courier", "Livrare prin curier"),
        new("post", "Poșta Moldovei")
    };
    
    private class OrderModel
    {
        [Required(ErrorMessage = "Selectați metoda de livrare")]
        public string DeliveryMethod { get; set; }
        
        public string Address { get; set; }
    }
}
```

### Radio Group cu Descrieri și Tooltip

```razor
<FODInputRadioGroup @bind-Value="selectedService"
                    Label="Tip serviciu"
                    Options="@serviceOptions">
    <ChildContent>
        @foreach (var service in services)
        {
            <FODInputRadio Item="@GetServiceItem(service)" T="string">
                <span>@service.Name</span>
                @if (!string.IsNullOrEmpty(service.Description))
                {
                    <Tooltip Text="@service.Description">
                        <FodIcon Icon="info" Size="FodSize.Small" />
                    </Tooltip>
                }
                <br/>
                <small class="text-muted">@service.Price.ToString("C")</small>
            </FODInputRadio>
        }
    </ChildContent>
</FODInputRadioGroup>

@code {
    private string selectedService;
    private List<Service> services = new()
    {
        new() { Id = "express", Name = "Express", Price = 50, Description = "Livrare în 24h" },
        new() { Id = "standard", Name = "Standard", Price = 25, Description = "Livrare în 3-5 zile" },
        new() { Id = "economy", Name = "Economic", Price = 10, Description = "Livrare în 7-10 zile" }
    };
}
```

### Radio Group Dinamic

```razor
<FODInputRadioGroup @bind-Value="selectedCategory"
                    Label="Categorie"
                    Options="@categoryOptions"
                    ValueChanged="@OnCategoryChanged" />

@if (subcategoryOptions?.Any() == true)
{
    <FODInputRadioGroup @bind-Value="selectedSubcategory"
                        Label="Subcategorie"
                        Options="@subcategoryOptions" />
}

@code {
    private string selectedCategory;
    private string selectedSubcategory;
    private List<SelectableItem<string>> categoryOptions;
    private List<SelectableItem<string>> subcategoryOptions;
    
    protected override async Task OnInitializedAsync()
    {
        categoryOptions = await LoadCategories();
    }
    
    private async Task OnCategoryChanged(string newCategory)
    {
        selectedSubcategory = null;
        subcategoryOptions = await LoadSubcategories(newCategory);
    }
}
```

### Integrare cu On Behalf Of

```razor
<FODInputRadioOnBehalfOf @bind-Value="model.RequestType"
                         Label="Depun cererea"
                         ShowOnBehalfOfOption="true"
                         OnBehalfOfLabel="În numele altei persoane"
                         PersonalLabel="Pentru mine" />

@if (model.RequestType == RequestType.OnBehalfOf)
{
    <FodInput @bind-Value="model.PersonName"
              Label="Numele persoanei"
              Required="true" />
              
    <FodInput @bind-Value="model.PersonIDNP"
              Label="IDNP"
              Required="true"
              Pattern="[0-9]{13}" />
}

@code {
    private RequestModel model = new();
    
    public enum RequestType
    {
        Personal,
        OnBehalfOf
    }
}
```

## Componente Asociate

- `FODInputWrapper` - Container pentru elemente de formular
- `FODSelectableFormComponent<T>` - Clasă de bază pentru componente cu selecție
- `ValidationMessage` - Afișare mesaje de validare

## Stilizare

### Clase CSS

```css
.form-check
.form-check-input
.form-check-label
.btn-check
.btn
.fod-radio-button-group
```

### Personalizare Aspect

```css
/* Radio buttons personalizate */
.form-check-input[type="radio"] {
    width: 20px;
    height: 20px;
    border: 2px solid var(--fod-primary);
}

.form-check-input[type="radio"]:checked {
    background-color: var(--fod-primary);
    border-color: var(--fod-primary);
}

/* Button group personalizat */
.fod-radio-button-group .btn {
    border-radius: 20px;
    padding: 8px 24px;
    margin: 0 5px;
}

.fod-radio-button-group .btn-check:checked + .btn {
    background-color: var(--fod-primary);
    color: white;
    transform: scale(1.05);
}
```

## Note și Observații

1. **Generic Type** - Suportă orice tip T care poate fi convertit în string
2. **Enum Support** - Suport automat pentru Display attributes
3. **Localization** - Integrare cu IStringLocalizer pentru traduceri
4. **Validation** - Funcționează cu DataAnnotations și EditForm
5. **Accessibility** - Generează ID-uri unice pentru label association

## Bune Practici

1. Folosiți `For` pentru integrare corectă cu EditForm
2. Definiți `Display` attributes pentru enum-uri localizate
3. Limitați numărul de opțiuni la 5-7 pentru usability
4. Folosiți tipul Button pentru opțiuni puține și clare
5. Adăugați descrieri pentru opțiuni complexe
6. Grupați opțiunile logic când sunt multe
7. Setați o valoare implicită când e posibil

## Concluzie

FODInputRadio oferă o implementare flexibilă și puternică pentru selecția unei singure opțiuni din mai multe. Cu suport pentru două moduri de afișare, localizare automată și integrare completă cu sistemul de validare Blazor, componenta acoperă majoritatea scenariilor de selecție unică în formulare.