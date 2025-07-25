# SelectableItemsService

## Descriere Generală

`SelectableItemsService` este un serviciu utilitar care facilitează conversia tipurilor enum și boolean în liste de elemente selectabile pentru componente de tip dropdown, select sau radio. Serviciul automatizează procesul de creare a elementelor SelectableItem cu etichete localizate, simplificând integrarea cu componentele de selecție din FOD.

## Înregistrare

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddScoped<ISelectableItemsService, SelectableItemsService>();

// Servicii dependente necesare
builder.Services.AddScoped<IAttributeHandlerService, AttributeHandlerService>();
builder.Services.AddLocalization();
```

## Interfața ISelectableItemsService

```csharp
public interface ISelectableItemsService
{
    bool TryGetEnumSelectableItems(Type enumType, out IEnumerable<SelectableItem> selectableItems);
    bool TryGetEnumSelectableItems(Type enumType, IEnumerable<object> objectValues, out IEnumerable<SelectableItem> selectableItems);
    bool GetBooleanSelectableItems(out IEnumerable<SelectableItem> selectableItems);
}
```

## Model SelectableItem

```csharp
public class SelectableItem
{
    public string Value { get; set; }
    public string Text { get; set; }
    
    public SelectableItem() { }
    
    public SelectableItem(string value, string label)
    {
        Value = value;
        Text = label;
    }
}
```

## Utilizare de Bază

```razor
@inject ISelectableItemsService SelectableItemsService

<FodSelect @bind-Value="selectedValue" Label="Selectați opțiunea">
    @foreach (var item in selectableItems)
    {
        <option value="@item.Value">@item.Text</option>
    }
</FodSelect>

@code {
    private string selectedValue;
    private IEnumerable<SelectableItem> selectableItems;
    
    protected override void OnInitialized()
    {
        // Obține elemente pentru enum
        SelectableItemsService.TryGetEnumSelectableItems(typeof(MyEnum), out selectableItems);
    }
}
```

## Exemple de Utilizare

### Conversie Enum la SelectableItems

```razor
@inject ISelectableItemsService SelectableItemsService

<FodSelect @bind-Value="selectedStatus" Label="Status">
    @foreach (var item in statusItems)
    {
        <option value="@item.Value">@item.Text</option>
    }
</FodSelect>

@code {
    public enum OrderStatus
    {
        [Display(Name = "În așteptare")]
        Pending,
        [Display(Name = "În procesare")]
        Processing,
        [Display(Name = "Finalizat")]
        Completed,
        [Display(Name = "Anulat")]
        Cancelled
    }
    
    private string selectedStatus;
    private IEnumerable<SelectableItem> statusItems;
    
    protected override void OnInitialized()
    {
        if (SelectableItemsService.TryGetEnumSelectableItems(typeof(OrderStatus), out var items))
        {
            statusItems = items;
        }
    }
}
```

### Filtrare Valori Enum

```razor
@inject ISelectableItemsService SelectableItemsService

<FodSelect @bind-Value="selectedRole" Label="Rol utilizator">
    @foreach (var item in roleItems)
    {
        <option value="@item.Value">@item.Text</option>
    }
</FodSelect>

@code {
    public enum UserRole
    {
        [Display(Name = "Administrator")]
        Admin,
        [Display(Name = "Moderator")]
        Moderator,
        [Display(Name = "Utilizator")]
        User,
        [Display(Name = "Oaspete")]
        Guest,
        [Display(Name = "Super Admin")]
        SuperAdmin
    }
    
    private string selectedRole;
    private IEnumerable<SelectableItem> roleItems;
    
    protected override void OnInitialized()
    {
        // Filtrează doar anumite roluri
        var allowedRoles = new object[] { UserRole.Admin, UserRole.Moderator, UserRole.User };
        
        if (SelectableItemsService.TryGetEnumSelectableItems(typeof(UserRole), allowedRoles, out var items))
        {
            roleItems = items;
        }
    }
}
```

### Selector Boolean

```razor
@inject ISelectableItemsService SelectableItemsService

<FodRadioGroup @bind-Value="isActive" Label="Stare cont">
    @foreach (var item in booleanItems)
    {
        <FodRadio Value="@item.Value">@item.Text</FodRadio>
    }
</FodRadioGroup>

@code {
    private string isActive = "true";
    private IEnumerable<SelectableItem> booleanItems;
    
    protected override void OnInitialized()
    {
        SelectableItemsService.GetBooleanSelectableItems(out booleanItems);
        // Returnează: [{ Value: "True", Text: "Da" }, { Value: "False", Text: "Nu" }]
    }
}
```

### Component Generic cu Enum

```razor
@typeparam TEnum where TEnum : struct, Enum
@inject ISelectableItemsService SelectableItemsService

<FodSelect @bind-Value="Value" Label="@Label">
    <option value="">-- Selectați --</option>
    @foreach (var item in items)
    {
        <option value="@item.Value">@item.Text</option>
    }
</FodSelect>

@code {
    [Parameter] public TEnum? Value { get; set; }
    [Parameter] public EventCallback<TEnum?> ValueChanged { get; set; }
    [Parameter] public string Label { get; set; }
    
    private IEnumerable<SelectableItem> items;
    
    protected override void OnInitialized()
    {
        if (SelectableItemsService.TryGetEnumSelectableItems(typeof(TEnum), out var selectableItems))
        {
            items = selectableItems;
        }
    }
}
```

### Dropdown cu Multiple Enum Types

```razor
@inject ISelectableItemsService SelectableItemsService

<div class="filter-panel">
    <FodSelect @bind-Value="selectedType" Label="Tip">
        @foreach (var item in typeItems)
        {
            <option value="@item.Value">@item.Text</option>
        }
    </FodSelect>
    
    <FodSelect @bind-Value="selectedStatus" Label="Status">
        @foreach (var item in statusItems)
        {
            <option value="@item.Value">@item.Text</option>
        }
    </FodSelect>
    
    <FodSelect @bind-Value="selectedPriority" Label="Prioritate">
        @foreach (var item in priorityItems)
        {
            <option value="@item.Value">@item.Text</option>
        }
    </FodSelect>
</div>

@code {
    private string selectedType;
    private string selectedStatus;
    private string selectedPriority;
    
    private IEnumerable<SelectableItem> typeItems;
    private IEnumerable<SelectableItem> statusItems;
    private IEnumerable<SelectableItem> priorityItems;
    
    protected override void OnInitialized()
    {
        SelectableItemsService.TryGetEnumSelectableItems(typeof(RequestType), out typeItems);
        SelectableItemsService.TryGetEnumSelectableItems(typeof(RequestStatus), out statusItems);
        SelectableItemsService.TryGetEnumSelectableItems(typeof(Priority), out priorityItems);
    }
}
```

### Formular Dinamic

```razor
@inject ISelectableItemsService SelectableItemsService

<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    @foreach (var field in dynamicFields)
    {
        <div class="form-field">
            @if (field.FieldType == typeof(bool))
            {
                <FodRadioGroup @bind-Value="field.Value" Label="@field.Label">
                    @foreach (var item in GetBooleanItems())
                    {
                        <FodRadio Value="@item.Value">@item.Text</FodRadio>
                    }
                </FodRadioGroup>
            }
            else if (field.FieldType.IsEnum)
            {
                <FodSelect @bind-Value="field.Value" Label="@field.Label">
                    @foreach (var item in GetEnumItems(field.FieldType))
                    {
                        <option value="@item.Value">@item.Text</option>
                    }
                </FodSelect>
            }
        </div>
    }
    
    <FodButton Type="submit">Salvează</FodButton>
</EditForm>

@code {
    private DynamicFormModel model = new();
    private List<DynamicField> dynamicFields = new();
    
    private IEnumerable<SelectableItem> GetBooleanItems()
    {
        SelectableItemsService.GetBooleanSelectableItems(out var items);
        return items;
    }
    
    private IEnumerable<SelectableItem> GetEnumItems(Type enumType)
    {
        if (SelectableItemsService.TryGetEnumSelectableItems(enumType, out var items))
        {
            return items;
        }
        return Enumerable.Empty<SelectableItem>();
    }
}
```

### Conversie cu Cache

```razor
@inject ISelectableItemsService SelectableItemsService

@code {
    private static readonly Dictionary<Type, IEnumerable<SelectableItem>> _enumCache = new();
    
    private IEnumerable<SelectableItem> GetCachedEnumItems<TEnum>() where TEnum : struct, Enum
    {
        var type = typeof(TEnum);
        
        if (!_enumCache.ContainsKey(type))
        {
            if (SelectableItemsService.TryGetEnumSelectableItems(type, out var items))
            {
                _enumCache[type] = items.ToList(); // ToList pentru a materializa
            }
        }
        
        return _enumCache.GetValueOrDefault(type) ?? Enumerable.Empty<SelectableItem>();
    }
}
```

### Componente cu Validare

```razor
@inject ISelectableItemsService SelectableItemsService

<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />
    
    <div class="form-group">
        <label>@Label</label>
        <InputSelect @bind-Value="model.EnumValue" class="form-control">
            <option value="">-- Selectați --</option>
            @foreach (var item in enumItems)
            {
                <option value="@item.Value">@item.Text</option>
            }
        </InputSelect>
        <ValidationMessage For="@(() => model.EnumValue)" />
    </div>
    
    <FodButton Type="submit">Salvează</FodButton>
</EditForm>

@code {
    [Parameter] public string Label { get; set; }
    
    private Model model = new();
    private IEnumerable<SelectableItem> enumItems;
    
    protected override void OnInitialized()
    {
        SelectableItemsService.TryGetEnumSelectableItems(typeof(MyEnum), out enumItems);
    }
    
    private class Model
    {
        [Required(ErrorMessage = "Câmpul este obligatoriu")]
        public string EnumValue { get; set; }
    }
}
```

## Integrare cu AttributeHandlerService

Serviciul folosește `IAttributeHandlerService` pentru a obține etichete localizate:

```csharp
// Enum cu atribute Display
public enum DocumentType
{
    [Display(Name = "Card de identitate")]
    IdentityCard,
    
    [Display(Name = "Pașaport")]
    Passport,
    
    [Display(Name = "Permis de conducere")]
    DrivingLicense
}

// Serviciul va returna:
// - Value: "IdentityCard", Text: "Card de identitate"
// - Value: "Passport", Text: "Pașaport"
// - Value: "DrivingLicense", Text: "Permis de conducere"
```

## Localizare

Pentru valorile boolean, serviciul folosește localizare automată:

```csharp
// Resurse de localizare
// ro: Yes = "Da", No = "Nu"
// en: Yes = "Yes", No = "No"
// ru: Yes = "Да", No = "Нет"
```

## Best Practices

1. **Cache rezultatele** - Pentru enum-uri folosite frecvent
2. **Validare tip** - Verificați că tipul este enum înainte de conversie
3. **Filtrare valori** - Folosiți overload-ul cu `objectValues` pentru subset
4. **Localizare** - Folosiți atribute Display pentru etichete
5. **Gestionare null** - Adăugați opțiune goală pentru valori nullable

## Cazuri de Utilizare

### 1. Dropdown-uri în formulare
```csharp
// Pentru selectarea tipului de document, status, rol, etc.
```

### 2. Filtre în tabele
```csharp
// Pentru filtrarea datelor după enum values
```

### 3. Radio buttons pentru boolean
```csharp
// Pentru întrebări Da/Nu cu localizare automată
```

### 4. Componente generice
```csharp
// Pentru componente care acceptă orice tip enum
```

## Troubleshooting

### TryGetEnumSelectableItems returnează false
- Verificați că tipul pasat este într-adevăr un enum
- Verificați că enum-ul are valori definite

### Etichetele nu sunt localizate
- Verificați că AttributeHandlerService este înregistrat
- Verificați atributele Display pe enum

### Valorile boolean nu sunt traduse
- Verificați că localizarea este configurată corect
- Verificați resursele de localizare pentru "Yes" și "No"

## Concluzie

SelectableItemsService simplifică semnificativ lucrul cu liste de selecție în aplicațiile Blazor, oferind conversie automată pentru enum-uri și boolean-uri cu suport complet pentru localizare. Este esențial pentru aplicații care necesită dropdown-uri și selecții dinamice cu etichete localizate.