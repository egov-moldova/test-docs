# FodNumberBox

## Descriere Generală

`FodNumberBox` este o componentă pentru introducerea valorilor numerice în formulare. Extinde `FODInput` și oferă suport pentru tipuri numerice precum `int`, `double`, `decimal` și versiunile lor nullable. Componenta gestionează automat conversia tipurilor și validarea valorilor numerice.

## Utilizare de Bază

```razor
<!-- Input numeric pentru int -->
<FodNumberBox @bind-Value="quantity" Label="Cantitate" />

<!-- Input numeric pentru decimal -->
<FodNumberBox @bind-Value="price" Label="Preț" />

<!-- Input numeric nullable -->
<FodNumberBox @bind-Value="optionalValue" Label="Valoare opțională" />
```

## Exemple de Utilizare

### Input Numeric Simplu

```razor
<EditForm Model="@model">
    <DataAnnotationsValidator />
    
    <FodNumberBox @bind-Value="model.Age" 
                  Label="Vârsta" 
                  Placeholder="Introduceți vârsta" />
    
    <FodNumberBox @bind-Value="model.Salary" 
                  Label="Salariu" 
                  Placeholder="0.00" />
    
    <ValidationSummary />
</EditForm>

@code {
    private PersonModel model = new();
    
    public class PersonModel
    {
        [Required(ErrorMessage = "Vârsta este obligatorie")]
        [Range(18, 65, ErrorMessage = "Vârsta trebuie să fie între 18 și 65")]
        public int Age { get; set; }
        
        [Required(ErrorMessage = "Salariul este obligatoriu")]
        [Range(0, double.MaxValue, ErrorMessage = "Salariul trebuie să fie pozitiv")]
        public decimal Salary { get; set; }
    }
}
```

### Valori Nullable

```razor
<div class="form-group">
    <FodNumberBox @bind-Value="discount" 
                  Label="Reducere (%)" 
                  Placeholder="Opțional" />
    
    @if (discount.HasValue)
    {
        <p>Reducere aplicată: @discount.Value%</p>
    }
</div>

@code {
    private int? discount;
}
```

### Formular de Calcul

```razor
<div class="calculator-form">
    <FodNumberBox @bind-Value="quantity" 
                  Label="Cantitate" 
                  @bind-Value:after="CalculateTotal" />
    
    <FodNumberBox @bind-Value="unitPrice" 
                  Label="Preț unitar" 
                  @bind-Value:after="CalculateTotal" />
    
    <FodNumberBox @bind-Value="taxRate" 
                  Label="TVA (%)" 
                  @bind-Value:after="CalculateTotal" />
    
    <div class="mt-3">
        <strong>Subtotal:</strong> @subtotal.ToString("C")<br />
        <strong>TVA:</strong> @tax.ToString("C")<br />
        <strong>Total:</strong> @total.ToString("C")
    </div>
</div>

@code {
    private int quantity = 1;
    private decimal unitPrice = 0;
    private decimal taxRate = 20;
    
    private decimal subtotal;
    private decimal tax;
    private decimal total;
    
    protected override void OnInitialized()
    {
        CalculateTotal();
    }
    
    private void CalculateTotal()
    {
        subtotal = quantity * unitPrice;
        tax = subtotal * (taxRate / 100);
        total = subtotal + tax;
    }
}
```

## Tipuri Suportate

Componenta suportă următoarele tipuri numerice:
- `int` și `int?`
- `double` și `double?`
- `decimal` și `decimal?`

### Detectare Automată a Tipului

```razor
@code {
    // Componenta detectează automat tipul
    private int integerValue = 0;
    private double doubleValue = 0.0;
    private decimal decimalValue = 0m;
    private int? nullableInt = null;
}

<FodNumberBox @bind-Value="integerValue" Label="Integer" />
<FodNumberBox @bind-Value="doubleValue" Label="Double" />
<FodNumberBox @bind-Value="decimalValue" Label="Decimal" />
<FodNumberBox @bind-Value="nullableInt" Label="Nullable Integer" />
```

## Validare

### Validare cu Data Annotations

```razor
<EditForm Model="@product" OnValidSubmit="SaveProduct">
    <DataAnnotationsValidator />
    
    <FodNumberBox @bind-Value="product.Stock" />
    <FodNumberBox @bind-Value="product.MinStock" />
    <FodNumberBox @bind-Value="product.Price" />
    
    <ValidationSummary />
    <button type="submit">Salvează</button>
</EditForm>

@code {
    private Product product = new();
    
    public class Product
    {
        [Required(ErrorMessage = "Stocul este obligatoriu")]
        [Range(0, 10000, ErrorMessage = "Stocul trebuie să fie între 0 și 10000")]
        public int Stock { get; set; }
        
        [Required(ErrorMessage = "Stocul minim este obligatoriu")]
        public int MinStock { get; set; }
        
        [Required(ErrorMessage = "Prețul este obligatoriu")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Prețul trebuie să fie mai mare de 0")]
        public decimal Price { get; set; }
    }
}
```

### Validare Customizată

```razor
<FodNumberBox @bind-Value="customValue" 
              Label="Valoare cu validare custom"
              @bind-Value:after="ValidateCustomValue" />

@if (!string.IsNullOrEmpty(customError))
{
    <div class="text-danger">@customError</div>
}

@code {
    private int customValue;
    private string customError;
    
    private void ValidateCustomValue()
    {
        customError = null;
        
        if (customValue % 5 != 0)
        {
            customError = "Valoarea trebuie să fie multiplu de 5";
        }
    }
}
```

## Exemple Avansate

### Input cu Limite Dinamice

```razor
<FodNumberBox @bind-Value="temperature" 
              Label="Temperatură (°C)"
              min="@minTemp"
              max="@maxTemp" />

<div class="mt-2">
    <button @onclick="SetWinterLimits">Limite Iarnă</button>
    <button @onclick="SetSummerLimits">Limite Vară</button>
</div>

@code {
    private double temperature;
    private double minTemp = -50;
    private double maxTemp = 50;
    
    private void SetWinterLimits()
    {
        minTemp = -30;
        maxTemp = 10;
    }
    
    private void SetSummerLimits()
    {
        minTemp = 15;
        maxTemp = 40;
    }
}
```

### Calculator de Împrumut

```razor
<div class="loan-calculator">
    <h4>Calculator Împrumut</h4>
    
    <FodNumberBox @bind-Value="loanAmount" 
                  Label="Suma împrumut (MDL)" />
    
    <FodNumberBox @bind-Value="interestRate" 
                  Label="Rata dobânzii (%)" />
    
    <FodNumberBox @bind-Value="loanTerm" 
                  Label="Perioada (ani)" />
    
    <button @onclick="CalculateLoan" class="btn btn-primary mt-3">
        Calculează
    </button>
    
    @if (monthlyPayment > 0)
    {
        <div class="results mt-3">
            <h5>Rezultate:</h5>
            <p>Plată lunară: @monthlyPayment.ToString("N2") MDL</p>
            <p>Total de plătit: @totalPayment.ToString("N2") MDL</p>
            <p>Total dobândă: @totalInterest.ToString("N2") MDL</p>
        </div>
    }
</div>

@code {
    private decimal loanAmount = 100000;
    private double interestRate = 12;
    private int loanTerm = 5;
    
    private decimal monthlyPayment;
    private decimal totalPayment;
    private decimal totalInterest;
    
    private void CalculateLoan()
    {
        var monthlyRate = (decimal)(interestRate / 100 / 12);
        var months = loanTerm * 12;
        
        monthlyPayment = loanAmount * monthlyRate * 
            (decimal)Math.Pow((double)(1 + monthlyRate), months) / 
            ((decimal)Math.Pow((double)(1 + monthlyRate), months) - 1);
        
        totalPayment = monthlyPayment * months;
        totalInterest = totalPayment - loanAmount;
    }
}
```

### Convertor de Unități

```razor
<div class="unit-converter">
    <h4>Convertor Temperatură</h4>
    
    <div class="row">
        <div class="col-md-4">
            <FodNumberBox @bind-Value="celsius" 
                          Label="Celsius"
                          @bind-Value:after="ConvertFromCelsius" />
        </div>
        
        <div class="col-md-4">
            <FodNumberBox @bind-Value="fahrenheit" 
                          Label="Fahrenheit"
                          @bind-Value:after="ConvertFromFahrenheit" />
        </div>
        
        <div class="col-md-4">
            <FodNumberBox @bind-Value="kelvin" 
                          Label="Kelvin"
                          @bind-Value:after="ConvertFromKelvin" />
        </div>
    </div>
</div>

@code {
    private double celsius = 0;
    private double fahrenheit = 32;
    private double kelvin = 273.15;
    private bool isConverting = false;
    
    private void ConvertFromCelsius()
    {
        if (isConverting) return;
        isConverting = true;
        
        fahrenheit = (celsius * 9/5) + 32;
        kelvin = celsius + 273.15;
        
        isConverting = false;
    }
    
    private void ConvertFromFahrenheit()
    {
        if (isConverting) return;
        isConverting = true;
        
        celsius = (fahrenheit - 32) * 5/9;
        kelvin = celsius + 273.15;
        
        isConverting = false;
    }
    
    private void ConvertFromKelvin()
    {
        if (isConverting) return;
        isConverting = true;
        
        celsius = kelvin - 273.15;
        fahrenheit = (celsius * 9/5) + 32;
        
        isConverting = false;
    }
}
```

## Comportament Special

### Gestionarea Valorilor Goale

Când utilizatorul șterge conținutul:
- Pentru tipuri non-nullable: valoarea devine `0`
- Pentru tipuri nullable: valoarea devine `null`

```csharp
// Comportament pentru valori goale
if (string.IsNullOrEmpty(stringValue))
{
    StringValue = string.Empty;
    await ValueChanged.InvokeAsync(null);
    return;
}
```

### Conversie Automată de Tip

Componenta detectează și convertește automat valorile:

```csharp
// Pentru int
if (int.TryParse(stringValue, out int intValue))
{
    await ValueChanged.InvokeAsync(intValue);
}

// Pentru double
if (double.TryParse(stringValue, out double doubleValue))
{
    await ValueChanged.InvokeAsync(doubleValue);
}

// Pentru decimal
if (decimal.TryParse(stringValue, out decimal decimalValue))
{
    await ValueChanged.InvokeAsync(decimalValue);
}
```

## Atribute HTML

Componenta renderează un element `<input type="number">` standard, acceptând toate atributele HTML valide:

```razor
<FodNumberBox @bind-Value="value" 
              min="0" 
              max="100" 
              step="0.01"
              pattern="[0-9]*"
              inputmode="numeric" />
```

## Stilizare

### Clase CSS

Componenta folosește clasa CSS specificată în proprietatea `CssClass`:

```razor
<FodNumberBox @bind-Value="styledValue" 
              CssClass="custom-number-input" />

<style>
    .custom-number-input {
        border: 2px solid #007bff;
        border-radius: 8px;
        padding: 10px;
        font-size: 16px;
    }
    
    .custom-number-input:focus {
        outline: none;
        border-color: #0056b3;
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
</style>
```

## Integrare cu FODInput

FodNumberBox moștenește de la `FODInput`, având acces la toate funcționalitățile de bază:
- Sistem de binding two-way
- Evenimente `ValueChanged`
- Proprietăți `Id`, `CssClass`
- Tip setat automat la `InputType.NumberBox`

## Best Practices

1. **Specificați tipul corect** - Folosiți `decimal` pentru valori monetare
2. **Validare adecvată** - Aplicați atribute `[Range]` pentru limite
3. **Valori nullable** - Pentru câmpuri opționale
4. **Formatare vizuală** - Afișați valorile formatate separat de input
5. **Feedback utilizator** - Validare în timp real pentru calcule

## Limitări

- Suportă doar tipuri numerice de bază (int, double, decimal)
- Nu suportă formatare internă (separatori de mii, etc.)
- Conversia parse folosește cultura curentă a thread-ului

## Concluzie

FodNumberBox oferă o soluție simplă și eficientă pentru introducerea valorilor numerice, cu conversie automată de tip și suport pentru valori nullable, fiind ideală pentru formulare care necesită input numeric validat.