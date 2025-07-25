# FodInputNullableNumber

## Descriere Generală

`FodInputNullableNumber` este o componentă specializată pentru introducerea valorilor numerice opționale de tip `decimal?`. Extinde `FODFormComponent<decimal?>` și oferă suport complet pentru valori null, validare și integrare cu EditForm. Este ideală pentru câmpuri numerice care pot fi lăsate goale.

## Utilizare de Bază

```razor
<!-- Input numeric opțional -->
<FodInputNullableNumber @bind-Value="discount" 
                        Label="Reducere (%)" />

<!-- Input cu placeholder -->
<FodInputNullableNumber @bind-Value="maxAmount" 
                        Label="Suma maximă"
                        Placeholder="Fără limită" />

<!-- Input readonly -->
<FodInputNullableNumber @bind-Value="calculatedValue" 
                        Label="Valoare calculată"
                        Readonly="true" />
```

## Diferența față de FODInputNumber

| Caracteristică | FodInputNullableNumber | FODInputNumber |
|----------------|------------------------|----------------|
| Tip valoare | decimal? | TValue (generic) |
| Permite null | Da | Depinde de tip |
| Valoare implicită | null | 0 |
| Specializare | Doar decimal | int, double, decimal |

## Atribute și Parametri

| Parametru | Tip | Default | Descriere |
|-----------|-----|---------|-----------|
| Value | decimal? | null | Valoarea curentă |
| Label | string | null | Eticheta câmpului |
| Placeholder | string | null | Text placeholder |
| Readonly | bool | false | Dezactivează input-ul |
| CssClass | string | null | Clase CSS adiționale |
| Required | bool? | null | Marchează ca obligatoriu |

## Exemple de Utilizare

### Formular Financiar

```razor
<EditForm Model="@invoice" OnValidSubmit="@ProcessInvoice">
    <DataAnnotationsValidator />
    
    <div class="invoice-form">
        <FodInputNullableNumber @bind-Value="invoice.Subtotal" 
                                Label="Subtotal"
                                Readonly="true" />
        
        <FodInputNullableNumber @bind-Value="invoice.DiscountPercent" 
                                Label="Reducere (%)"
                                Placeholder="0"
                                @bind-Value:after="CalculateTotals" />
        
        <FodInputNullableNumber @bind-Value="invoice.DiscountAmount" 
                                Label="Reducere (MDL)"
                                Placeholder="0"
                                @bind-Value:after="CalculateTotals" />
        
        <FodInputNullableNumber @bind-Value="invoice.TaxOverride" 
                                Label="TVA manual"
                                Placeholder="Auto-calculat"
                                Description="Lăsați gol pentru calcul automat" />
        
        <FodInputNullableNumber @bind-Value="invoice.Total" 
                                Label="Total"
                                Readonly="true" />
    </div>
    
    <ValidationSummary />
    <button type="submit">Salvează factura</button>
</EditForm>

@code {
    private InvoiceModel invoice = new();
    
    public class InvoiceModel
    {
        public decimal Subtotal { get; set; } = 1000;
        
        [Range(0, 100, ErrorMessage = "Reducerea trebuie să fie între 0 și 100%")]
        public decimal? DiscountPercent { get; set; }
        
        [Range(0, double.MaxValue, ErrorMessage = "Reducerea nu poate fi negativă")]
        public decimal? DiscountAmount { get; set; }
        
        public decimal? TaxOverride { get; set; }
        
        public decimal Total { get; set; }
    }
    
    private void CalculateTotals()
    {
        var discountTotal = 0m;
        
        if (invoice.DiscountPercent.HasValue)
        {
            discountTotal = invoice.Subtotal * (invoice.DiscountPercent.Value / 100);
        }
        else if (invoice.DiscountAmount.HasValue)
        {
            discountTotal = invoice.DiscountAmount.Value;
        }
        
        var afterDiscount = invoice.Subtotal - discountTotal;
        var tax = invoice.TaxOverride ?? (afterDiscount * 0.20m);
        
        invoice.Total = afterDiscount + tax;
    }
}
```

### Filtre cu Valori Opționale

```razor
<div class="search-filters">
    <h4>Filtrează produse</h4>
    
    <FodInputNullableNumber @bind-Value="filters.MinPrice" 
                            Label="Preț minim"
                            Placeholder="De la..."
                            @bind-Value:after="ApplyFilters" />
    
    <FodInputNullableNumber @bind-Value="filters.MaxPrice" 
                            Label="Preț maxim"
                            Placeholder="Până la..."
                            @bind-Value:after="ApplyFilters" />
    
    <FodInputNullableNumber @bind-Value="filters.MinStock" 
                            Label="Stoc minim"
                            Placeholder="Orice stoc"
                            @bind-Value:after="ApplyFilters" />
    
    <FodInputNullableNumber @bind-Value="filters.MaxWeight" 
                            Label="Greutate maximă (kg)"
                            Placeholder="Fără limită"
                            @bind-Value:after="ApplyFilters" />
    
    <div class="filter-results mt-3">
        <p>Găsite: @filteredProducts.Count produse</p>
    </div>
</div>

@code {
    private FilterModel filters = new();
    private List<Product> allProducts = new();
    private List<Product> filteredProducts = new();
    
    public class FilterModel
    {
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public decimal? MinStock { get; set; }
        public decimal? MaxWeight { get; set; }
    }
    
    private void ApplyFilters()
    {
        filteredProducts = allProducts.Where(p =>
            (!filters.MinPrice.HasValue || p.Price >= filters.MinPrice.Value) &&
            (!filters.MaxPrice.HasValue || p.Price <= filters.MaxPrice.Value) &&
            (!filters.MinStock.HasValue || p.Stock >= filters.MinStock.Value) &&
            (!filters.MaxWeight.HasValue || p.Weight <= filters.MaxWeight.Value)
        ).ToList();
    }
}
```

### Configurare Limite Opționale

```razor
<div class="limit-configuration">
    <h4>Configurare limite cont</h4>
    
    <FodInputNullableNumber @bind-Value="limits.MaxDailyTransfer" 
                            Label="Transfer zilnic maxim"
                            Placeholder="Nelimitat"
                            Description="Lăsați gol pentru fără limită" />
    
    <FodInputNullableNumber @bind-Value="limits.MaxMonthlyTransfer" 
                            Label="Transfer lunar maxim"
                            Placeholder="Nelimitat" />
    
    <FodInputNullableNumber @bind-Value="limits.MinBalance" 
                            Label="Sold minim"
                            Placeholder="0.00" />
    
    <FodInputNullableNumber @bind-Value="limits.CreditLimit" 
                            Label="Limită de credit"
                            Placeholder="Fără credit"
                            @bind-Value:after="ValidateLimits" />
    
    @if (!string.IsNullOrEmpty(validationMessage))
    {
        <div class="alert alert-warning mt-2">@validationMessage</div>
    }
</div>

@code {
    private AccountLimits limits = new();
    private string validationMessage;
    
    public class AccountLimits
    {
        public decimal? MaxDailyTransfer { get; set; }
        public decimal? MaxMonthlyTransfer { get; set; }
        public decimal? MinBalance { get; set; }
        public decimal? CreditLimit { get; set; }
    }
    
    private void ValidateLimits()
    {
        validationMessage = null;
        
        if (limits.MaxDailyTransfer.HasValue && 
            limits.MaxMonthlyTransfer.HasValue &&
            limits.MaxDailyTransfer.Value > limits.MaxMonthlyTransfer.Value)
        {
            validationMessage = "Limita zilnică nu poate depăși limita lunară";
        }
        
        if (limits.MinBalance.HasValue && 
            limits.CreditLimit.HasValue &&
            limits.MinBalance.Value < -limits.CreditLimit.Value)
        {
            validationMessage = "Soldul minim nu poate fi mai mic decât limita de credit negativă";
        }
    }
}
```

### Calculator cu Câmpuri Opționale

```razor
<div class="loan-calculator">
    <h4>Calculator împrumut</h4>
    
    <FodInputNullableNumber @bind-Value="loan.Principal" 
                            Label="Suma împrumut"
                            Required="true" />
    
    <FodInputNullableNumber @bind-Value="loan.InterestRate" 
                            Label="Rată dobândă (%)"
                            Required="true" />
    
    <FodInputNullableNumber @bind-Value="loan.Term" 
                            Label="Perioadă (luni)"
                            Required="true" />
    
    <FodInputNullableNumber @bind-Value="loan.DownPayment" 
                            Label="Avans"
                            Placeholder="Opțional"
                            @bind-Value:after="Calculate" />
    
    <FodInputNullableNumber @bind-Value="loan.ExtraMonthlyPayment" 
                            Label="Plată suplimentară lunară"
                            Placeholder="0"
                            @bind-Value:after="Calculate" />
    
    @if (result != null)
    {
        <div class="calculation-result mt-3">
            <p>Plată lunară: @result.MonthlyPayment.ToString("N2") MDL</p>
            <p>Total de plătit: @result.TotalPayment.ToString("N2") MDL</p>
            <p>Total dobândă: @result.TotalInterest.ToString("N2") MDL</p>
            @if (loan.ExtraMonthlyPayment.HasValue)
            {
                <p>Economii: @result.Savings.ToString("N2") MDL</p>
                <p>Timp economisit: @result.MonthsSaved luni</p>
            }
        </div>
    }
</div>

@code {
    private LoanModel loan = new();
    private LoanResult result;
    
    public class LoanModel
    {
        [Required(ErrorMessage = "Suma este obligatorie")]
        [Range(1000, double.MaxValue, ErrorMessage = "Suma minimă: 1000 MDL")]
        public decimal? Principal { get; set; }
        
        [Required(ErrorMessage = "Rata dobânzii este obligatorie")]
        [Range(0.1, 100, ErrorMessage = "Rata trebuie să fie între 0.1% și 100%")]
        public decimal? InterestRate { get; set; }
        
        [Required(ErrorMessage = "Perioada este obligatorie")]
        [Range(1, 360, ErrorMessage = "Perioada: 1-360 luni")]
        public decimal? Term { get; set; }
        
        public decimal? DownPayment { get; set; }
        public decimal? ExtraMonthlyPayment { get; set; }
    }
    
    private void Calculate()
    {
        if (!loan.Principal.HasValue || !loan.InterestRate.HasValue || !loan.Term.HasValue)
            return;
            
        var principal = loan.Principal.Value - (loan.DownPayment ?? 0);
        var monthlyRate = loan.InterestRate.Value / 100 / 12;
        var months = (int)loan.Term.Value;
        
        // Calcul plată standard
        var monthlyPayment = principal * monthlyRate * 
            (decimal)Math.Pow((double)(1 + monthlyRate), months) /
            ((decimal)Math.Pow((double)(1 + monthlyRate), months) - 1);
        
        result = new LoanResult
        {
            MonthlyPayment = monthlyPayment,
            TotalPayment = monthlyPayment * months,
            TotalInterest = (monthlyPayment * months) - principal
        };
        
        // Calcul cu plăți suplimentare
        if (loan.ExtraMonthlyPayment.HasValue && loan.ExtraMonthlyPayment.Value > 0)
        {
            // Calcul simplificat pentru demonstrație
            result.Savings = loan.ExtraMonthlyPayment.Value * 12;
            result.MonthsSaved = 12;
        }
    }
}
```

## Gestionarea Valorilor Null

```csharp
protected override bool TryParseValueFromString(string value, out decimal? result, out string validationErrorMessage)
{
    result = null;
    
    // String gol = valoare null (validă)
    if(string.IsNullOrEmpty(value))
    {
        validationErrorMessage = null;
        result = null;
        return true;
    }

    // Încearcă parsare ca decimal
    decimal parsedResult = 0;
    if (decimal.TryParse(value, out parsedResult))
    {
        result = parsedResult;
        validationErrorMessage = null;
        return true;
    }
    
    validationErrorMessage = "Value must be a number";
    return false;
}
```

## Validare

### Cu Data Annotations

```csharp
public class Model
{
    // Câmp opțional
    public decimal? OptionalValue { get; set; }
    
    // Câmp obligatoriu
    [Required(ErrorMessage = "Valoarea este obligatorie")]
    public decimal? RequiredValue { get; set; }
    
    // Cu range când are valoare
    [Range(0, 100, ErrorMessage = "Valoarea trebuie să fie între 0 și 100")]
    public decimal? RangedValue { get; set; }
}
```

### Validare Condiționată

```csharp
public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
{
    if (MinValue.HasValue && MaxValue.HasValue && MinValue.Value > MaxValue.Value)
    {
        yield return new ValidationResult(
            "Valoarea minimă nu poate fi mai mare decât cea maximă",
            new[] { nameof(MinValue), nameof(MaxValue) });
    }
}
```

## Stilizare

```css
/* Input cu indicator pentru valoare null */
.nullable-input input:placeholder-shown {
    font-style: italic;
    opacity: 0.7;
}

/* Highlight pentru câmpuri cu valoare */
.nullable-input input:not(:placeholder-shown) {
    border-color: #28a745;
    background-color: #f8fff9;
}

/* Indicator vizual pentru câmpuri opționale */
.optional-field label::after {
    content: " (opțional)";
    font-size: 0.875em;
    color: #6c757d;
    font-style: italic;
}
```

## Best Practices

1. **Placeholder descriptiv** - Indicați clar că e opțional
2. **Validare null-aware** - Verificați HasValue înainte de Value
3. **Valori implicite clare** - Folosiți ?? pentru fallback
4. **UI feedback** - Arătați diferit câmpurile cu/fără valoare
5. **Descrieri utile** - Explicați când să lase gol

## Performanță

- Parsare eficientă cu cache pentru string gol
- Nu re-validează la blur dacă valoarea nu s-a schimbat
- Overhead minim pentru gestionare null

## Limitări

- Suportă doar tip decimal (nu int sau double)
- Nu are formatare automată (mii, zecimale)
- Nu suportă input masks

## Concluzie

FodInputNullableNumber este componenta ideală pentru valori numerice opționale, oferind gestionare elegantă a valorilor null cu validare completă și integrare perfectă în formulare Blazor. Este perfectă pentru filtre, limite opționale și orice câmp numeric care poate fi lăsat gol.