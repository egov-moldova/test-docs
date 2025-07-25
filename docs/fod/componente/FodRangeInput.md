# FodRangeInput

## Descriere Generală

`FodRangeInput<T>` este o componentă generică pentru introducerea intervalelor de valori (de la - până la). Extinde `FodBaseInput<Range<T>>` și oferă două câmpuri de input conectate vizual printr-un separator. Suportă toate tipurile de input HTML5 și include funcționalități avansate precum adornments, clearable și focus management.

## Utilizare de Bază

```razor
<!-- Range de numere -->
<FodRangeInput @bind-Value="priceRange" 
               PlaceholderStart="Preț minim"
               PlaceholderEnd="Preț maxim"
               InputType="InputType.Number" />

<!-- Range de date -->
<FodRangeInput @bind-Value="dateRange" 
               PlaceholderStart="De la"
               PlaceholderEnd="Până la"
               InputType="InputType.Date" />

<!-- Range cu adornment -->
<FodRangeInput @bind-Value="salaryRange" 
               PlaceholderStart="Minim"
               PlaceholderEnd="Maxim"
               Adornment="Adornment.Start"
               AdornmentText="MDL"
               InputType="InputType.Number" />
```

## Model Range<T>

```csharp
public class Range<T>
{
    public T Start { get; set; }
    public T End { get; set; }
}
```

## Atribute și Parametri

| Parametru | Tip | Default | Descriere |
|-----------|-----|---------|-----------|
| Value | Range<T> | new Range<T>() | Valoarea intervalului |
| InputType | InputType | Text | Tipul input-urilor |
| PlaceholderStart | string | null | Placeholder pentru start |
| PlaceholderEnd | string | null | Placeholder pentru end |
| SeparatorIcon | string | ArrowRightAlt | Iconița separator |
| Clearable | bool | false | Afișează buton clear |
| Immediate | bool | false | Update la fiecare tastă |
| Adornment | Adornment | None | Poziție adornment |
| AdornmentIcon | string | null | Icon pentru adornment |
| AdornmentText | string | null | Text pentru adornment |

## Exemple de Utilizare

### Filtru Interval de Preț

```razor
<div class="price-filter">
    <h4>Filtru preț</h4>
    
    <FodRangeInput @bind-Value="priceFilter" 
                   PlaceholderStart="Min"
                   PlaceholderEnd="Max"
                   InputType="InputType.Number"
                   Adornment="Adornment.Start"
                   AdornmentText="MDL"
                   Clearable="true"
                   @bind-Value:after="ApplyPriceFilter" />
    
    <div class="price-suggestions mt-2">
        <button class="btn btn-sm btn-outline-primary" @onclick="() => SetPriceRange(0, 1000)">
            0 - 1,000 MDL
        </button>
        <button class="btn btn-sm btn-outline-primary" @onclick="() => SetPriceRange(1000, 5000)">
            1,000 - 5,000 MDL
        </button>
        <button class="btn btn-sm btn-outline-primary" @onclick="() => SetPriceRange(5000, 10000)">
            5,000 - 10,000 MDL
        </button>
    </div>
    
    <p class="mt-2">Găsite: @filteredProducts.Count produse</p>
</div>

@code {
    private Range<decimal> priceFilter = new();
    private List<Product> allProducts = new();
    private List<Product> filteredProducts = new();
    
    private void ApplyPriceFilter()
    {
        filteredProducts = allProducts.Where(p => 
            (priceFilter.Start == 0 || p.Price >= priceFilter.Start) &&
            (priceFilter.End == 0 || p.Price <= priceFilter.End)
        ).ToList();
    }
    
    private void SetPriceRange(decimal min, decimal max)
    {
        priceFilter = new Range<decimal> { Start = min, End = max };
        ApplyPriceFilter();
    }
}
```

### Selector Interval de Date

```razor
<div class="date-range-picker">
    <FodRangeInput @bind-Value="selectedDates" 
                   PlaceholderStart="Data început"
                   PlaceholderEnd="Data sfârșit"
                   InputType="InputType.Date"
                   Variant="FodVariant.Outlined"
                   Clearable="true"
                   @ref="dateRangeInput" />
    
    <div class="quick-ranges mt-2">
        <button class="btn btn-sm btn-secondary" @onclick="SelectToday">Azi</button>
        <button class="btn btn-sm btn-secondary" @onclick="SelectThisWeek">Săptămâna aceasta</button>
        <button class="btn btn-sm btn-secondary" @onclick="SelectThisMonth">Luna aceasta</button>
        <button class="btn btn-sm btn-secondary" @onclick="SelectLastMonth">Luna trecută</button>
        <button class="btn btn-sm btn-secondary" @onclick="SelectThisYear">Anul acesta</button>
    </div>
    
    @if (selectedDates?.Start != null && selectedDates?.End != null)
    {
        <div class="selected-info mt-3">
            <p>Interval selectat: @GetDateRangeText()</p>
            <p>Număr zile: @GetDaysBetween()</p>
        </div>
    }
</div>

@code {
    private Range<DateTime?> selectedDates = new();
    private FodRangeInput<DateTime?> dateRangeInput;
    
    private void SelectToday()
    {
        var today = DateTime.Today;
        selectedDates = new Range<DateTime?> { Start = today, End = today };
    }
    
    private void SelectThisWeek()
    {
        var today = DateTime.Today;
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek + 1);
        var endOfWeek = startOfWeek.AddDays(6);
        selectedDates = new Range<DateTime?> { Start = startOfWeek, End = endOfWeek };
    }
    
    private void SelectThisMonth()
    {
        var today = DateTime.Today;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);
        selectedDates = new Range<DateTime?> { Start = startOfMonth, End = endOfMonth };
    }
    
    private string GetDateRangeText()
    {
        return $"{selectedDates.Start:dd.MM.yyyy} - {selectedDates.End:dd.MM.yyyy}";
    }
    
    private int GetDaysBetween()
    {
        if (selectedDates?.Start != null && selectedDates?.End != null)
            return (selectedDates.End.Value - selectedDates.Start.Value).Days + 1;
        return 0;
    }
}
```

### Range de Timp

```razor
<div class="time-range-selector">
    <h4>Program de lucru</h4>
    
    <FodRangeInput @bind-Value="workingHours" 
                   PlaceholderStart="Deschidere"
                   PlaceholderEnd="Închidere"
                   InputType="InputType.Time"
                   SeparatorIcon="@FodIcons.Material.Filled.Schedule"
                   Immediate="true"
                   @bind-Value:after="ValidateWorkingHours" />
    
    @if (!string.IsNullOrEmpty(validationMessage))
    {
        <FodAlert Severity="FodSeverity.Warning" Class="mt-2">
            @validationMessage
        </FodAlert>
    }
    
    <div class="schedule-templates mt-3">
        <h5>Șabloane rapide:</h5>
        <button class="btn btn-sm btn-outline-secondary" @onclick="() => SetSchedule(9, 18)">
            9:00 - 18:00 (Standard)
        </button>
        <button class="btn btn-sm btn-outline-secondary" @onclick="() => SetSchedule(8, 17)">
            8:00 - 17:00 (Devreme)
        </button>
        <button class="btn btn-sm btn-outline-secondary" @onclick="() => SetSchedule(10, 19)">
            10:00 - 19:00 (Târziu)
        </button>
    </div>
</div>

@code {
    private Range<TimeSpan?> workingHours = new();
    private string validationMessage;
    
    private void ValidateWorkingHours()
    {
        validationMessage = null;
        
        if (workingHours?.Start != null && workingHours?.End != null)
        {
            if (workingHours.End <= workingHours.Start)
            {
                validationMessage = "Ora de închidere trebuie să fie după ora de deschidere";
            }
            else if ((workingHours.End.Value - workingHours.Start.Value).TotalHours > 12)
            {
                validationMessage = "Programul nu poate depăși 12 ore";
            }
        }
    }
    
    private void SetSchedule(int startHour, int endHour)
    {
        workingHours = new Range<TimeSpan?>
        {
            Start = new TimeSpan(startHour, 0, 0),
            End = new TimeSpan(endHour, 0, 0)
        };
        ValidateWorkingHours();
    }
}
```

### Range Numeric cu Validare

```razor
<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />
    
    <div class="mb-3">
        <label>Interval vârstă acceptată</label>
        <FodRangeInput @bind-Value="model.AgeRange" 
                       PlaceholderStart="Min"
                       PlaceholderEnd="Max"
                       InputType="InputType.Number"
                       Clearable="true"
                       @ref="ageRangeInput" />
        <ValidationMessage For="@(() => model.AgeRange)" />
    </div>
    
    <div class="mb-3">
        <label>Interval salariu (MDL)</label>
        <FodRangeInput @bind-Value="model.SalaryRange" 
                       PlaceholderStart="Minim"
                       PlaceholderEnd="Maxim"
                       InputType="InputType.Number"
                       Adornment="Adornment.Start"
                       AdornmentIcon="@FodIcons.Material.Filled.AttachMoney" />
        <ValidationMessage For="@(() => model.SalaryRange)" />
    </div>
    
    <button type="submit" class="btn btn-primary">Salvează criteriile</button>
</EditForm>

@code {
    private JobCriteria model = new();
    private FodRangeInput<int?> ageRangeInput;
    
    public class JobCriteria : IValidatableObject
    {
        public Range<int?> AgeRange { get; set; } = new();
        public Range<decimal?> SalaryRange { get; set; } = new();
        
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (AgeRange?.Start != null && AgeRange?.End != null)
            {
                if (AgeRange.Start < 18)
                    yield return new ValidationResult("Vârsta minimă nu poate fi sub 18 ani", 
                        new[] { nameof(AgeRange) });
                        
                if (AgeRange.End > 65)
                    yield return new ValidationResult("Vârsta maximă nu poate depăși 65 ani", 
                        new[] { nameof(AgeRange) });
                        
                if (AgeRange.Start > AgeRange.End)
                    yield return new ValidationResult("Vârsta minimă nu poate fi mai mare decât cea maximă", 
                        new[] { nameof(AgeRange) });
            }
            
            if (SalaryRange?.Start != null && SalaryRange?.End != null)
            {
                if (SalaryRange.Start > SalaryRange.End)
                    yield return new ValidationResult("Salariul minim nu poate fi mai mare decât cel maxim", 
                        new[] { nameof(SalaryRange) });
            }
        }
    }
}
```

### Range Customizat cu Converter

```razor
<div class="ip-range-filter">
    <h4>Filtru interval IP</h4>
    
    <FodRangeInput @bind-Value="ipRange" 
                   PlaceholderStart="IP Start"
                   PlaceholderEnd="IP End"
                   Pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                   Clearable="true"
                   Converter="@ipRangeConverter" />
    
    @if (ipRange != null)
    {
        <div class="mt-2">
            <p>Interval: @ipRange.Start - @ipRange.End</p>
            <p>Total adrese: @CalculateIPCount()</p>
        </div>
    }
</div>

@code {
    private Range<string> ipRange = new();
    private RangeConverter<string> ipRangeConverter = new RangeConverter<string>
    {
        // Implementare custom converter pentru IP-uri
    };
    
    private long CalculateIPCount()
    {
        // Calcul număr de IP-uri în interval
        return 0;
    }
}
```

## Metode Focus și Selecție

```csharp
// Focus pe input start
await rangeInput.FocusStartAsync();

// Focus pe input end
await rangeInput.FocusEndAsync();

// Selectare text start
await rangeInput.SelectStartAsync();

// Selectare text end
await rangeInput.SelectEndAsync();

// Selectare interval specific în start
await rangeInput.SelectRangeStartAsync(0, 5);

// Selectare interval specific în end
await rangeInput.SelectRangeEndAsync(0, 5);
```

## Stilizare

### Variante de Afișare

```razor
<!-- Standard -->
<FodRangeInput @bind-Value="range1" Variant="FodVariant.Text" />

<!-- Filled -->
<FodRangeInput @bind-Value="range2" Variant="FodVariant.Filled" />

<!-- Outlined -->
<FodRangeInput @bind-Value="range3" Variant="FodVariant.Outlined" />
```

### CSS Personalizat

```css
/* Separator custom */
.fod-range-input-separator {
    margin: 0 8px;
    color: #6c757d;
}

/* Input-uri mai mici */
.compact-range .fod-input-base-input {
    width: 100px;
}

/* Highlight pentru range valid */
.valid-range .fod-input-base-input {
    border-color: #28a745;
}

/* Eroare pentru range invalid */
.invalid-range .fod-input-base-input {
    border-color: #dc3545;
}
```

## RangeConverter

Componenta folosește `RangeConverter<T>` pentru conversia între `Range<T>` și string:

```csharp
public class RangeConverter<T>
{
    public static void Split(string text, out string start, out string end)
    {
        // Separă textul în start și end
    }
    
    public static string Join(string start, string end)
    {
        // Combină start și end într-un string
    }
}
```

## Accesibilitate

- Suport complet pentru keyboard navigation
- Tab între câmpurile start și end
- Label-uri asociate pentru screen readers
- ARIA labels pentru butoane și adornments

## Best Practices

1. **Placeholder-uri descriptive** - Indicați clar ce se așteaptă
2. **Validare interval** - Verificați că start < end
3. **Tipuri potrivite** - Folosiți InputType corect
4. **Feedback vizual** - Pentru intervaluri invalide
5. **Valori sugestive** - Oferiți butoane pentru selecții rapide

## Performanță

- Update eficient doar la schimbarea unui câmp
- Converter cached pentru transformări
- Re-renderare minimă cu Immediate mode

## Limitări

- Nu suportă range pentru toate tipurile (ex: enum)
- Nu are calendar integrat pentru date
- Nu validează automat start < end

## Concluzie

FodRangeInput oferă o soluție elegantă pentru introducerea intervalelor de valori, cu suport pentru multiple tipuri de date și funcționalități avansate de customizare. Este ideală pentru filtre, selectoare de perioade și orice situație care necesită introducerea unui interval de valori.