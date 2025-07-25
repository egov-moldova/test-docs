# DateRangePicker

## Documentație pentru componenta FodDateRangePicker

### 1. Descriere Generală
`FodDateRangePicker` este o componentă avansată pentru selectarea unui interval de date într-o aplicație Blazor. Oferă o interfață intuitivă cu calendar dual, validare integrată și multiple opțiuni de personalizare.

Caracteristici principale:
- Selecție interval prin două click-uri
- Afișare calendare multiple (implicit 2 luni)
- Validare date minime/maxime
- Dezactivare date specifice
- Formatare personalizată
- Integrare completă cu formulare Blazor
- Suport pentru localizare
- Închidere automată după selecție
- Evidențiere vizuală a intervalului selectat

### 2. Ghid de Utilizare API

#### DateRangePicker de bază
```razor
<FodDateRangePicker @bind-DateRange="selectedRange" />

@code {
    private DateRange selectedRange = new DateRange();
}
```

#### DateRangePicker cu limite de date
```razor
<FodDateRangePicker @bind-DateRange="vacationDates"
                    Label="Perioada concediului"
                    MinDate="DateTime.Today"
                    MaxDate="DateTime.Today.AddMonths(6)"
                    HelperText="Selectați perioada dorită pentru concediu" />

@code {
    private DateRange vacationDates = new DateRange();
}
```

#### DateRangePicker cu validare în formular
```razor
<EditForm Model="model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodDateRangePicker @bind-DateRange="model.ProjectPeriod"
                        Label="Perioada proiectului"
                        Required="true"
                        RequiredError="Perioada proiectului este obligatorie"
                        For="@(() => model.ProjectPeriod)" />
    
    <ValidationMessage For="@(() => model.ProjectPeriod)" />
    
    <FodButton Type="submit" Variant="FodVariant.Filled" Color="FodColor.Primary">
        Salvează
    </FodButton>
</EditForm>

@code {
    public class ProjectModel
    {
        [Required(ErrorMessage = "Selectați perioada proiectului")]
        public DateRange ProjectPeriod { get; set; } = new DateRange();
        
        // Validare personalizată
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (ProjectPeriod?.Start != null && ProjectPeriod?.End != null)
            {
                var duration = ProjectPeriod.End.Value - ProjectPeriod.Start.Value;
                if (duration.TotalDays > 365)
                {
                    yield return new ValidationResult(
                        "Perioada proiectului nu poate depăși un an",
                        new[] { nameof(ProjectPeriod) });
                }
            }
        }
    }
    
    private ProjectModel model = new();
}
```

#### DateRangePicker cu date dezactivate
```razor
<FodDateRangePicker @bind-DateRange="bookingDates"
                    Label="Selectați perioada rezervării"
                    MinDate="DateTime.Today"
                    MaxDate="DateTime.Today.AddMonths(3)"
                    IsDateDisabledFunc="@IsDateUnavailable"
                    HelperText="Zilele marcate sunt indisponibile" />

@code {
    private DateRange bookingDates = new DateRange();
    private List<DateTime> unavailableDates = new()
    {
        DateTime.Today.AddDays(5),
        DateTime.Today.AddDays(6),
        DateTime.Today.AddDays(10),
        DateTime.Today.AddDays(15)
    };
    
    private bool IsDateUnavailable(DateTime date)
    {
        // Weekend-uri
        if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
            return true;
            
        // Date specifice indisponibile
        return unavailableDates.Contains(date.Date);
    }
}
```

#### DateRangePicker cu format personalizat
```razor
<FodDateRangePicker @bind-DateRange="customRange"
                    Label="Interval personalizat"
                    DateFormat="dd MMMM yyyy"
                    Culture="@(new System.Globalization.CultureInfo("ro-RO"))"
                    FirstDayOfWeek="DayOfWeek.Monday" />
```

#### DateRangePicker cu afișare multiplă luni
```razor
<FodDateRangePicker @bind-DateRange="extendedRange"
                    Label="Planificare pe termen lung"
                    DisplayMonths="3"
                    AutoClose="false"
                    HelperText="Afișează 3 luni pentru planificare mai ușoară" />
```

#### DateRangePicker cu presetări rapide
```razor
<div class="d-flex gap-2 mb-3">
    <FodButton OnClick="@(() => SetLastWeek())" 
               Variant="FodVariant.Outlined" 
               Size="Size.Small">
        Săptămâna trecută
    </FodButton>
    <FodButton OnClick="@(() => SetLastMonth())" 
               Variant="FodVariant.Outlined" 
               Size="Size.Small">
        Luna trecută
    </FodButton>
    <FodButton OnClick="@(() => SetLast30Days())" 
               Variant="FodVariant.Outlined" 
               Size="Size.Small">
        Ultimele 30 zile
    </FodButton>
</div>

<FodDateRangePicker @bind-DateRange="reportRange"
                    Label="Perioada raportului" />

@code {
    private DateRange reportRange = new DateRange();
    
    private void SetLastWeek()
    {
        var today = DateTime.Today;
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek - 6);
        reportRange = new DateRange(startOfWeek, startOfWeek.AddDays(6));
    }
    
    private void SetLastMonth()
    {
        var today = DateTime.Today;
        var firstDayLastMonth = new DateTime(today.Year, today.Month, 1).AddMonths(-1);
        var lastDayLastMonth = firstDayLastMonth.AddMonths(1).AddDays(-1);
        reportRange = new DateRange(firstDayLastMonth, lastDayLastMonth);
    }
    
    private void SetLast30Days()
    {
        var today = DateTime.Today;
        reportRange = new DateRange(today.AddDays(-30), today);
    }
}
```

#### DateRangePicker pentru filtrare date
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" Class="mb-3">Filtrare tranzacții</FodText>
        
        <FodDateRangePicker @bind-DateRange="filterDates"
                            Label="Perioada tranzacțiilor"
                            MaxDate="DateTime.Today"
                            OnDateRangeChanged="FilterTransactions" />
        
        @if (filteredTransactions.Any())
        {
            <div class="mt-3">
                <FodText>
                    Găsite @filteredTransactions.Count tranzacții între 
                    @filterDates.Start?.ToString("dd.MM.yyyy") și 
                    @filterDates.End?.ToString("dd.MM.yyyy")
                </FodText>
            </div>
        }
    </FodCardContent>
</FodCard>

@code {
    private DateRange filterDates = new DateRange();
    private List<Transaction> allTransactions = GetTransactions();
    private List<Transaction> filteredTransactions = new();
    
    private async Task FilterTransactions(DateRange range)
    {
        if (range?.Start != null && range?.End != null)
        {
            filteredTransactions = allTransactions
                .Where(t => t.Date >= range.Start && t.Date <= range.End)
                .ToList();
        }
    }
}
```

#### DateRangePicker cu stilizare personalizată
```razor
<FodDateRangePicker @bind-DateRange="styledRange"
                    Label="Interval stilizat"
                    Color="FodColor.Primary"
                    Variant="FodVariant.Filled"
                    AdornmentIcon="@FodIcons.Material.Filled.DateRange"
                    AdornmentColor="FodColor.Primary"
                    Class="custom-date-range-picker" />

<style>
    .custom-date-range-picker {
        --fod-range-color: #1976d2;
        --fod-range-hover-color: #42a5f5;
    }
    
    .custom-date-range-picker .fod-range-between {
        background-color: var(--fod-range-color);
        opacity: 0.1;
    }
</style>
```

#### DateRangePicker cu validare interval minim/maxim
```razor
<FodDateRangePicker @bind-DateRange="reservationDates"
                    Label="Perioada rezervării"
                    MinDate="DateTime.Today.AddDays(1)"
                    MaxDate="DateTime.Today.AddMonths(3)"
                    ValidationFunc="@ValidateReservationPeriod"
                    HelperText="Minim 2 nopți, maxim 14 nopți" />

@code {
    private DateRange reservationDates = new DateRange();
    
    private string ValidateReservationPeriod(DateRange range)
    {
        if (range?.Start == null || range?.End == null)
            return null;
            
        var nights = (range.End.Value - range.Start.Value).TotalDays;
        
        if (nights < 2)
            return "Rezervarea minimă este de 2 nopți";
            
        if (nights > 14)
            return "Rezervarea maximă este de 14 nopți";
            
        return null;
    }
}
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `DateRange` | `DateRange` | Intervalul de date selectat | `new DateRange()` |
| `DateRangeChanged` | `EventCallback<DateRange>` | Eveniment la schimbarea intervalului | - |
| `DisplayMonths` | `int` | Număr de luni afișate simultan | `2` |
| `MinDate` | `DateTime?` | Data minimă selectabilă | `null` |
| `MaxDate` | `DateTime?` | Data maximă selectabilă | `null` |
| `DateFormat` | `string` | Format afișare date | `"yyyy-MM-dd"` |
| `Culture` | `CultureInfo` | Cultura pentru formatare | Current culture |
| `FirstDayOfWeek` | `DayOfWeek?` | Prima zi a săptămânii | `null` |
| `IsDateDisabledFunc` | `Func<DateTime, bool>` | Funcție pentru dezactivare date | `null` |
| `AutoClose` | `bool` | Închide automat după selecție | `false` |
| `Label` | `string` | Eticheta câmpului | `null` |
| `HelperText` | `string` | Text ajutător | `null` |
| `Required` | `bool` | Câmp obligatoriu | `false` |
| `RequiredError` | `string` | Mesaj eroare pentru câmp obligatoriu | `"Required"` |
| `Placeholder` | `string` | Text placeholder | `null` |
| `Variant` | `FodVariant` | Stilul câmpului | `Outlined` |
| `Color` | `FodColor` | Culoarea temei | `Default` |
| `Disabled` | `bool` | Dezactivează componenta | `false` |
| `ReadOnly` | `bool` | Doar citire | `false` |
| `AdornmentIcon` | `string` | Pictogramă adornment | Calendar icon |
| `AdornmentColor` | `FodColor` | Culoare pictogramă | `Default` |
| `ValidationFunc` | `Func<DateRange, string>` | Funcție validare personalizată | `null` |

### 4. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `DateRangeChanged` | `EventCallback<DateRange>` | Se declanșează la schimbarea intervalului |
| `OnDateRangeChanged` | `EventCallback<DateRange>` | Callback adițional după schimbare |
| `OnOpen` | `EventCallback` | La deschiderea picker-ului |
| `OnClose` | `EventCallback` | La închiderea picker-ului |

### 5. Metode publice

| Metodă | Descriere |
|--------|-----------|
| `FocusStartAsync()` | Focus pe câmpul dată început |
| `FocusEndAsync()` | Focus pe câmpul dată sfârșit |
| `SelectStartAsync()` | Selectează tot textul din câmpul început |
| `SelectEndAsync()` | Selectează tot textul din câmpul sfârșit |
| `Clear()` | Șterge intervalul selectat |
| `Submit()` | Finalizează selecția curentă |

### 6. Model DateRange

```csharp
public class DateRange
{
    public DateTime? Start { get; set; }
    public DateTime? End { get; set; }
    
    // Constructori
    public DateRange() { }
    public DateRange(DateTime? start, DateTime? end)
    {
        Start = start;
        End = end;
    }
    
    // Metode utile
    public bool IsValid() => Start.HasValue && End.HasValue && Start <= End;
    public int? GetDays() => IsValid() ? (int?)(End.Value - Start.Value).TotalDays : null;
}
```

### 7. Stilizare și personalizare

```css
/* Personalizare culori interval */
.custom-range-picker {
    --fod-range-start-color: #1976d2;
    --fod-range-end-color: #1565c0;
    --fod-range-between-color: #e3f2fd;
}

/* Stil pentru zilele dezactivate */
.custom-range-picker .fod-picker-calendar-day-disabled {
    color: #ccc;
    text-decoration: line-through;
}

/* Evidențiere weekend-uri */
.custom-range-picker .fod-picker-calendar-day-weekend {
    background-color: #f5f5f5;
}

/* Animație la hover */
.custom-range-picker .fod-picker-calendar-day:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease;
}
```

### 8. Integrare cu alte componente

#### În Card pentru rapoarte
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" Class="mb-3">Generare raport</FodText>
        
        <FodDateRangePicker @bind-DateRange="reportPeriod"
                            Label="Perioada raportului"
                            MaxDate="DateTime.Today" />
        
        <FodSelect @bind-Value="reportType" Label="Tip raport" Class="mt-3">
            <FodSelectItem Value="sales">Vânzări</FodSelectItem>
            <FodSelectItem Value="inventory">Stocuri</FodSelectItem>
            <FodSelectItem Value="financial">Financiar</FodSelectItem>
        </FodSelect>
    </FodCardContent>
    <FodCardActions>
        <FodButton OnClick="GenerateReport" 
                   Variant="FodVariant.Filled" 
                   Color="FodColor.Primary"
                   Disabled="@(!reportPeriod.IsValid())">
            Generează raport
        </FodButton>
    </FodCardActions>
</FodCard>
```

### 9. Scenarii avansate

#### Sincronizare cu alte picker-e
```razor
<FodDatePicker @bind-Date="startDate"
               Label="Data început"
               MaxDate="@endDate"
               OnDateChanged="@((DateTime? date) => UpdateRange())" />

<FodDatePicker @bind-Date="endDate"
               Label="Data sfârșit"
               MinDate="@startDate"
               OnDateChanged="@((DateTime? date) => UpdateRange())" />

<FodDateRangePicker @bind-DateRange="syncedRange"
                    Label="Interval sincronizat"
                    Disabled="true" />

@code {
    private DateTime? startDate;
    private DateTime? endDate;
    private DateRange syncedRange = new DateRange();
    
    private void UpdateRange()
    {
        syncedRange = new DateRange(startDate, endDate);
    }
}
```

### 10. Note și observații

- Selecția se face prin două click-uri consecutive
- Nu se pot selecta date dezactivate în interval
- Calendarul afișează implicit 2 luni pentru vizibilitate optimă
- Suportă navigare cu tastatură între luni
- Format dată implicit ISO pentru consistență

### 11. Accesibilitate

- Suport complet pentru navigare cu tastatură
- Atribute ARIA pentru screen readers
- Indicatori vizuali clari pentru stări
- Focus management între câmpuri

### 12. Bune practici

1. **Limite clare** - Setați MinDate/MaxDate pentru a ghida utilizatorii
2. **Validare utilă** - Implementați validări care ajută (durată min/max)
3. **Presetări rapide** - Oferiți butoane pentru perioade comune
4. **Feedback vizual** - Folosiți HelperText pentru instrucțiuni
5. **Date dezactivate** - Marcați clar zilele indisponibile
6. **Format consistent** - Folosiți același DateFormat în toată aplicația

### 13. Troubleshooting

#### Intervalul nu se salvează
- Verificați binding-ul `@bind-DateRange`
- Asigurați-vă că modelul are proprietate DateRange

#### Calendarul nu se deschide
- Verificați că aveți FodPopoverProvider în layout
- Component nu trebuie să fie Disabled sau ReadOnly

#### Validarea nu funcționează
- Pentru Required, ambele date trebuie selectate
- Folosiți ValidationFunc pentru validări complexe

### 14. Concluzie
`FodDateRangePicker` oferă o soluție completă și intuitivă pentru selectarea intervalelor de date, cu funcționalități avansate de validare și personalizare, perfect integrată în ecosistemul FOD Components.