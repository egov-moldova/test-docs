# Input Number

## Documentație pentru componenta FODInputNumber

### 1. Descriere Generală
`FODInputNumber` este o componentă de formular special concepută pentru introducerea valorilor numerice. Se integrează perfect cu sistemul de formulare și validare Blazor, oferind o experiență consistentă pentru introducerea numerelor zecimale.

Componenta suportă:
- Validare numerică integrată
- Suport pentru numere zecimale (tip `decimal`)
- Placeholder și label personalizabile
- Mod readonly pentru afișare
- Validare cu Range și Required
- Integrare completă cu EditForm și ValidationMessage

### 2. Ghid de Utilizare API

#### Input numeric de bază
```razor
<EditForm Model="model">
    <FODInputNumber Label="Cantitate" @bind-Value="model.Amount" />
</EditForm>

@code {
    private FormModel model = new();
    
    public class FormModel
    {
        public decimal Amount { get; set; } = 100;
    }
}
```

#### Input cu placeholder și descriere
```razor
<FODInputNumber 
    Label="Preț (MDL)" 
    @bind-Value="model.Price" 
    Placeholder="0.00"
    Description="Introduceți prețul în lei moldovenești" />
```

#### Input cu validare
```razor
<EditForm Model="validationModel" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <div class="mb-3">
        <FODInputNumber 
            Label="Vârstă" 
            @bind-Value="validationModel.Age" 
            Required="true" />
    </div>
    
    <div class="mb-3">
        <FODInputNumber 
            Label="Salariu minim" 
            @bind-Value="validationModel.MinSalary" 
            Placeholder="Introduceți suma minimă" />
    </div>
    
    <FodButton Type="submit" Variant="FodVariant.Filled" Color="FodColor.Primary">
        Salvează
    </FodButton>
</EditForm>

@code {
    private ValidationModel validationModel = new();

    public class ValidationModel
    {
        [Required(ErrorMessage = "Vârsta este obligatorie")]
        [Range(18, 120, ErrorMessage = "Vârsta trebuie să fie între 18 și 120")]
        public decimal Age { get; set; }

        [Required(ErrorMessage = "Salariul minim este obligatoriu")]
        [Range(1000, 100000, ErrorMessage = "Salariul trebuie să fie între 1,000 și 100,000 MDL")]
        public decimal MinSalary { get; set; }
    }
    
    private void HandleSubmit()
    {
        // Procesare formular
    }
}
```

#### Input readonly pentru calcule
```razor
<EditForm Model="calculationModel">
    <div class="mb-3">
        <FODInputNumber 
            Label="Preț unitar" 
            @bind-Value="calculationModel.UnitPrice" 
            OnValueChanged="CalculateTotal" />
    </div>
    
    <div class="mb-3">
        <FODInputNumber 
            Label="Cantitate" 
            @bind-Value="calculationModel.Quantity" 
            OnValueChanged="CalculateTotal" />
    </div>
    
    <div class="mb-3">
        <FODInputNumber 
            Label="Total" 
            @bind-Value="calculationModel.Total" 
            Readonly="true"
            Description="Calculat automat" />
    </div>
</EditForm>

@code {
    private CalculationModel calculationModel = new() 
    { 
        UnitPrice = 100, 
        Quantity = 1 
    };

    protected override void OnInitialized()
    {
        CalculateTotal(0);
    }

    private void CalculateTotal(decimal value)
    {
        calculationModel.Total = calculationModel.UnitPrice * calculationModel.Quantity;
    }

    public class CalculationModel
    {
        public decimal UnitPrice { get; set; }
        public decimal Quantity { get; set; }
        public decimal Total { get; set; }
    }
}
```

#### Formular de comandă cu validare complexă
```razor
<EditForm Model="orderForm" OnValidSubmit="SubmitOrder">
    <DataAnnotationsValidator />
    <ValidationSummary />
    
    <FodGrid>
        <FodItem xs="12" sm="6">
            <FODInputNumber 
                Label="Număr produse" 
                @bind-Value="orderForm.ProductCount" 
                Description="Maxim 100 produse per comandă" />
        </FodItem>
        
        <FodItem xs="12" sm="6">
            <FODInputNumber 
                Label="Preț per unitate" 
                @bind-Value="orderForm.UnitPrice" 
                Placeholder="0.00"
                RequiredLabel="true" />
        </FodItem>
    </FodGrid>
    
    <div class="mt-3">
        <FODInputNumber 
            Label="Discount (%)" 
            @bind-Value="orderForm.DiscountPercent" 
            Placeholder="0-50"
            Description="Discount aplicabil între 0% și 50%" />
    </div>
    
    <div class="mt-3">
        <FODInputNumber 
            Label="Taxa de livrare" 
            @bind-Value="orderForm.DeliveryFee" 
            Readonly="true" />
    </div>
    
    <FodButton Type="submit" Variant="FodVariant.Filled" Color="FodColor.Primary">
        Plasează comanda
    </FodButton>
</EditForm>

@code {
    private OrderForm orderForm = new();

    public class OrderForm
    {
        [Required(ErrorMessage = "Numărul de produse este obligatoriu")]
        [Range(1, 100, ErrorMessage = "Puteți comanda între 1 și 100 de produse")]
        public decimal ProductCount { get; set; } = 1;

        [Required(ErrorMessage = "Prețul este obligatoriu")]
        [Range(0.01, 10000, ErrorMessage = "Prețul trebuie să fie între 0.01 și 10,000 MDL")]
        public decimal UnitPrice { get; set; }

        [Range(0, 50, ErrorMessage = "Discount-ul trebuie să fie între 0% și 50%")]
        public decimal DiscountPercent { get; set; } = 0;

        public decimal DeliveryFee { get; set; } = 50;
    }

    private void SubmitOrder()
    {
        // Procesare comandă
    }
}
```

#### Input cu formatare pentru costuri
```razor
<FodPaper Class="pa-4">
    <FodText Typo="Typo.h6" Class="mb-3">Calculator Costuri Serviciu</FodText>
    
    <FODInputNumber 
        Label="TAXA DE BAZĂ" 
        @bind-Value="costs.BaseFee"
        LabelUpperCase="true"
        Description="Taxa standard pentru procesare" />
    
    <FODInputNumber 
        Label="Procesare Expresă (opțional)" 
        @bind-Value="costs.ExpressFee"
        Placeholder="Taxa adițională"
        RequiredLabel="false" />
    
    <FODInputNumber 
        Label="Număr de documente" 
        @bind-Value="costs.DocumentCount"
        Name="doc-count"
        OnValueChanged="UpdateTotal" />
    
    <hr class="my-3" />
    
    <FODInputNumber 
        Label="Cost Total" 
        @bind-Value="costs.TotalCost"
        Readonly="true"
        Class="fw-bold" />
</FodPaper>

@code {
    private CostCalculation costs = new() 
    { 
        BaseFee = 150, 
        ExpressFee = 0, 
        DocumentCount = 1 
    };

    protected override void OnInitialized()
    {
        UpdateTotal(costs.DocumentCount);
    }

    private void UpdateTotal(decimal count)
    {
        costs.TotalCost = (costs.BaseFee + costs.ExpressFee) * count;
    }

    public class CostCalculation
    {
        public decimal BaseFee { get; set; }
        public decimal ExpressFee { get; set; }
        public decimal DocumentCount { get; set; }
        public decimal TotalCost { get; set; }
    }
}
```

### Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `decimal` | Valoarea curentă a input-ului (two-way binding) | `0` |
| `Label` | `string` | Eticheta afișată deasupra input-ului | `null` |
| `Placeholder` | `string` | Text placeholder afișat când input-ul este gol | `null` |
| `Name` | `string` | Atributul name pentru input | `null` |
| `Required` | `bool?` | Marchează câmpul ca obligatoriu | `null` |
| `RequiredLabel` | `bool` | Afișează indicatorul de câmp obligatoriu (*) | `true` |
| `Readonly` | `bool` | Face input-ul readonly | `false` |
| `Description` | `string` | Text descriptiv afișat sub input | `null` |
| `IsLoading` | `bool` | Afișează indicator de încărcare | `false` |
| `LabelUpperCase` | `bool` | Transformă label-ul în majuscule | `false` |
| `OnValueChanged` | `EventCallback<decimal>` | Eveniment declanșat la schimbarea valorii | - |
| `CssClass` | `string` | Clase CSS adiționale pentru input | `null` |

### 3. Funcționalități speciale

#### Tip de date decimal
Componenta folosește tipul `decimal` pentru precizie maximă în calculele financiare și evitarea erorilor de rotunjire specifice tipului `float` sau `double`.

#### Input HTML5 number
Componenta generează un `<input type="number">` care oferă:
- Controale de incrementare/decrementare native
- Validare numerică în browser
- Suport pentru tastatură numerică pe dispozitive mobile

#### Integrare cu FODInputWrapper
Similar cu FODInputText, componenta folosește `FODInputWrapper` pentru:
- Layout consistent
- Afișare label și descriere
- Integrare cu ValidationMessage

### 4. Validare

#### Validare standard
```razor
public class NumericModel
{
    [Required(ErrorMessage = "Valoarea este obligatorie")]
    public decimal RequiredValue { get; set; }
    
    [Range(0, 100, ErrorMessage = "Valoarea trebuie să fie între 0 și 100")]
    public decimal Percentage { get; set; }
    
    [Range(0.01, double.MaxValue, ErrorMessage = "Valoarea trebuie să fie pozitivă")]
    public decimal PositiveValue { get; set; }
}
```

#### Validare personalizată
```razor
public class CustomValidationModel : IValidatableObject
{
    public decimal MinValue { get; set; }
    public decimal MaxValue { get; set; }
    
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (MinValue > MaxValue)
        {
            yield return new ValidationResult(
                "Valoarea minimă nu poate fi mai mare decât valoarea maximă",
                new[] { nameof(MinValue), nameof(MaxValue) }
            );
        }
    }
}
```

### 5. Formate și localizare

#### Formatare valută
```razor
<FODInputNumber 
    Label="Preț (MDL)" 
    @bind-Value="model.Price" 
    Placeholder="0.00" />

<div class="mt-2">
    Preț formatat: @model.Price.ToString("C", new CultureInfo("ro-MD"))
</div>
```

### 6. Note și observații

- Componenta moștenește de la `FODFormComponent<decimal>`
- Tipul `decimal` este recomandat pentru valori monetare și calcule financiare
- Browser-ul poate aplica propriile restricții pentru input-uri numerice
- Pe dispozitive mobile, se afișează tastatura numerică
- Validarea se face atât pe client cât și pe server

### 7. Bune practici

1. **Folosiți decimal pentru bani** - Evitați float/double pentru valori monetare
2. **Specificați Range adecvat** - Limitați valorile la intervale realiste
3. **Adăugați placeholder-uri sugestive** - Ajută utilizatorii să înțeleagă formatul
4. **Validați pe server** - Nu vă bazați doar pe validarea client-side
5. **Folosiți Description** - Pentru a clarifica unitățile de măsură sau limite
6. **Formatați afișarea** - Folosiți formatare adecvată pentru afișarea valorilor

### 8. Integrare cu alte componente

```razor
<EditForm Model="invoice">
    <FodGrid>
        <FodItem xs="12" sm="4">
            <FODInputNumber Label="Cantitate" @bind-Value="invoice.Quantity" />
        </FodItem>
        <FodItem xs="12" sm="4">
            <FODInputNumber Label="Preț unitar" @bind-Value="invoice.UnitPrice" />
        </FodItem>
        <FodItem xs="12" sm="4">
            <FODInputNumber Label="Total" Value="@(invoice.Quantity * invoice.UnitPrice)" Readonly="true" />
        </FodItem>
    </FodGrid>
</EditForm>
```

### 9. Concluzie
`FODInputNumber` este componenta esențială pentru introducerea valorilor numerice în aplicațiile Blazor, oferind validare robustă, formatare flexibilă și o experiență de utilizare optimizată pentru diferite dispozitive și cazuri de utilizare.