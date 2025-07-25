# FodExceptionDays

## Descriere Generală

`FodExceptionDays` este un sistem de componente pentru gestionarea programului de lucru și a zilelor excepționale (sărbători, zile scurte, zile lucrătoare speciale). Sistemul include componenta principală `FodExceptionDays` pentru afișare și gestionare, și `FodExceptionDayModal` pentru adăugare/editare excepții.

## Utilizare de Bază

```razor
<!-- Afișare program de lucru și excepții -->
<FodExceptionDays />

<!-- Doar afișare, fără editare -->
<FodExceptionDays ReadOnly="true" />

<!-- Cu callback pentru schimbări -->
<FodExceptionDays OnExceptionChanged="@HandleExceptionChange" />
```

## Componente și Atribute

### FodExceptionDays (componentă principală)

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| ReadOnly | bool | false | Dezactivează funcțiile de editare |
| OnExceptionChanged | EventCallback | - | Eveniment la modificare excepții |

### FodExceptionDayModal (modal pentru editare)

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Action | ActionType | - | Tipul acțiunii (Add/Edit/Delete) |
| Id | Guid? | null | ID-ul excepției pentru editare/ștergere |
| OnSave | EventCallback | - | Eveniment la salvare |
| OnCancel | EventCallback | - | Eveniment la anulare |

## Servicii și Modele

### IExceptionDaysService

```csharp
public interface IExceptionDaysService
{
    Task<DataResponse<WorkProgramModel>> GetFormatted(DataRequest request);
    Task<DataResponse<ExceptionWorkingProgramModel>> GetExceptions(DataRequest request);
    Task<ExceptionWorkingProgramDetailsModel> GetExceptionById(Guid id);
    Task AddOrUpdateException(ExceptionWorkingProgramDetailsModel model);
    Task Delete(Guid id);
}
```

### Modele de Date

```csharp
public class WorkProgramModel
{
    public string Day { get; set; }      // Ziua săptămânii
    public string Open { get; set; }     // Ora deschidere
    public string Close { get; set; }    // Ora închidere
    public string Pause { get; set; }    // Pauză
}

public class ExceptionWorkingProgramModel
{
    public Guid Id { get; set; }
    public ExceptionTypeEnum Type { get; set; }
    public DateTime Date { get; set; }
    public string Open { get; set; }
    public string Close { get; set; }
}

public class ExceptionWorkingProgramDetailsModel
{
    public Guid? Id { get; set; }
    public ExceptionTypeEnum Type { get; set; }
    public DateTime Date { get; set; }
    public int OpenHours { get; set; }
    public int OpenMinutes { get; set; }
    public int CloseHours { get; set; }
    public int CloseMinutes { get; set; }
}

public enum ExceptionTypeEnum
{
    Holiday,      // Zi liberă
    ShortDay,     // Zi scurtă
    WorkingDay    // Zi lucrătoare specială
}

public enum ActionType
{
    Add,
    Edit,
    Delete
}
```

## Exemple Avansate

### Gestionare Excepții cu Validare

```razor
<FodExceptionDays @ref="exceptionDaysComponent" />

@code {
    private FodExceptionDays exceptionDaysComponent;
    
    protected override void OnInitialized()
    {
        // Înregistrare pentru evenimente
        exceptionDaysComponent.OnExceptionChanged += HandleExceptionChanged;
    }
    
    private async Task HandleExceptionChanged()
    {
        // Reîncarcă date sau notifică alte componente
        await NotifyExceptionUpdate();
    }
}
```

### Integrare cu Calendar

```razor
<div class="row">
    <div class="col-md-8">
        <FodCalendar @ref="calendar"
                     OnDateSelected="@OnCalendarDateSelected"
                     HighlightedDates="@highlightedDates" />
    </div>
    <div class="col-md-4">
        <FodExceptionDays OnExceptionChanged="@RefreshCalendarHighlights" />
    </div>
</div>

@code {
    private FodCalendar calendar;
    private List<HighlightedDate> highlightedDates = new();
    
    private async Task RefreshCalendarHighlights()
    {
        var exceptions = await ExceptionDaysService.GetAllExceptions();
        
        highlightedDates = exceptions.Select(e => new HighlightedDate
        {
            Date = e.Date,
            Color = GetColorForExceptionType(e.Type),
            Tooltip = GetTooltipForException(e)
        }).ToList();
        
        calendar.RefreshHighlights();
    }
    
    private string GetColorForExceptionType(ExceptionTypeEnum type)
    {
        return type switch
        {
            ExceptionTypeEnum.Holiday => "red",
            ExceptionTypeEnum.ShortDay => "orange",
            ExceptionTypeEnum.WorkingDay => "green",
            _ => "gray"
        };
    }
    
    private async Task OnCalendarDateSelected(DateTime date)
    {
        // Verifică dacă data selectată are excepție
        var exception = await ExceptionDaysService.GetExceptionByDate(date);
        if (exception != null)
        {
            ShowExceptionDetails(exception);
        }
    }
}
```

### Modal Personalizat pentru Adăugare Rapidă

```razor
<FodButton @onclick="ShowQuickAddModal">
    Adaugă Sărbătoare Națională
</FodButton>

@if (showQuickAdd)
{
    <FodModal @bind-Visible="showQuickAdd" Title="Adaugă Sărbători Naționale">
        <BodyTemplate>
            <FodCheckboxList @bind-Values="selectedHolidays"
                            Items="@nationalHolidays"
                            TextField="@(h => h.Name)"
                            ValueField="@(h => h.Date)" />
        </BodyTemplate>
        <FooterTemplate>
            <FodButton @onclick="AddSelectedHolidays" Color="FodColor.Primary">
                Adaugă Sărbătorile Selectate
            </FodButton>
        </FooterTemplate>
    </FodModal>
}

@code {
    private bool showQuickAdd;
    private List<DateTime> selectedHolidays = new();
    
    private List<NationalHoliday> nationalHolidays = new()
    {
        new() { Date = new DateTime(2024, 1, 1), Name = "Anul Nou" },
        new() { Date = new DateTime(2024, 3, 8), Name = "Ziua Internațională a Femeii" },
        new() { Date = new DateTime(2024, 5, 1), Name = "Ziua Muncii" },
        new() { Date = new DateTime(2024, 5, 9), Name = "Ziua Victoriei" },
        new() { Date = new DateTime(2024, 8, 27), Name = "Ziua Independenței" },
        new() { Date = new DateTime(2024, 8, 31), Name = "Limba Noastră" },
        new() { Date = new DateTime(2024, 12, 25), Name = "Crăciunul" }
    };
    
    private async Task AddSelectedHolidays()
    {
        foreach (var date in selectedHolidays)
        {
            var exception = new ExceptionWorkingProgramDetailsModel
            {
                Type = ExceptionTypeEnum.Holiday,
                Date = date,
                OpenHours = 0,
                OpenMinutes = 0,
                CloseHours = 0,
                CloseMinutes = 0
            };
            
            await ExceptionDaysService.AddOrUpdateException(exception);
        }
        
        showQuickAdd = false;
        await RefreshExceptionsList();
    }
}
```

### Export/Import Excepții

```razor
<div class="exception-tools mb-3">
    <FodButtonGroup>
        <FodButton @onclick="ExportExceptions" 
                   StartIcon="download">
            Export Excel
        </FodButton>
        <FodFileUpload Accept=".xlsx,.xls"
                       OnFileSelected="@ImportExceptions">
            <FodButton StartIcon="upload">
                Import Excel
            </FodButton>
        </FodFileUpload>
    </FodButtonGroup>
</div>

<FodExceptionDays @ref="exceptionDays" />

@code {
    private FodExceptionDays exceptionDays;
    
    private async Task ExportExceptions()
    {
        var exceptions = await ExceptionDaysService.GetAllExceptions();
        var excelData = GenerateExcelFile(exceptions);
        
        await JSRuntime.InvokeVoidAsync("downloadFile", 
            "exceptii_program_lucru.xlsx", 
            Convert.ToBase64String(excelData));
    }
    
    private async Task ImportExceptions(InputFileChangeEventArgs e)
    {
        var file = e.File;
        if (file != null)
        {
            using var stream = file.OpenReadStream();
            var exceptions = await ParseExcelFile(stream);
            
            foreach (var exception in exceptions)
            {
                await ExceptionDaysService.AddOrUpdateException(exception);
            }
            
            await exceptionDays.RefreshData();
        }
    }
}
```

### Vizualizare Statistici

```razor
<FodCard>
    <CardContent>
        <h5>Statistici Program Lucru - @DateTime.Now.Year</h5>
        
        <FodGrid>
            <FodItem xs="12" sm="4">
                <div class="stat-box">
                    <FodIcon Icon="event_busy" Color="FodColor.Error" />
                    <h6>Zile Libere</h6>
                    <h3>@holidaysCount</h3>
                </div>
            </FodItem>
            
            <FodItem xs="12" sm="4">
                <div class="stat-box">
                    <FodIcon Icon="schedule" Color="FodColor.Warning" />
                    <h6>Zile Scurte</h6>
                    <h3>@shortDaysCount</h3>
                </div>
            </FodItem>
            
            <FodItem xs="12" sm="4">
                <div class="stat-box">
                    <FodIcon Icon="work" Color="FodColor.Success" />
                    <h6>Zile Lucrătoare Speciale</h6>
                    <h3>@workingDaysCount</h3>
                </div>
            </FodItem>
        </FodGrid>
        
        <FodChart Type="ChartType.Pie"
                  Data="@GetChartData()"
                  Options="@chartOptions" />
    </CardContent>
</FodCard>

@code {
    private int holidaysCount;
    private int shortDaysCount;
    private int workingDaysCount;
    
    protected override async Task OnInitializedAsync()
    {
        await LoadStatistics();
    }
    
    private async Task LoadStatistics()
    {
        var exceptions = await ExceptionDaysService.GetYearExceptions(DateTime.Now.Year);
        
        holidaysCount = exceptions.Count(e => e.Type == ExceptionTypeEnum.Holiday);
        shortDaysCount = exceptions.Count(e => e.Type == ExceptionTypeEnum.ShortDay);
        workingDaysCount = exceptions.Count(e => e.Type == ExceptionTypeEnum.WorkingDay);
    }
}
```

## Stilizare

### Clase CSS

```css
/* Stiluri pentru tabel program */
.working-schedule-table {
    margin-bottom: 2rem;
}

/* Stiluri pentru excepții */
.exception-day-row {
    transition: background-color 0.3s ease;
}

.exception-day-row:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

/* Tipuri de excepții */
.exception-type-holiday {
    color: #dc3545;
    font-weight: bold;
}

.exception-type-shortday {
    color: #fd7e14;
    font-weight: bold;
}

.exception-type-workingday {
    color: #28a745;
    font-weight: bold;
}

/* Modal styling */
.exception-modal .hours,
.exception-modal .minutes {
    width: 60px;
    text-align: center;
    padding: 0.25rem;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
}

/* Butoane acțiuni */
.exception-actions {
    white-space: nowrap;
}
```

### Teme Personalizate

```css
/* Temă sărbători */
.holiday-theme {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
}

/* Temă zile scurte */
.shortday-theme {
    background: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%);
    color: #333;
}

/* Temă zile lucrătoare */
.workday-theme {
    background: linear-gradient(135deg, #48dbfb 0%, #0abde3 100%);
    color: white;
}
```

## Note și Observații

1. **Data Validation** - Validare automată pentru date viitoare
2. **Time Format** - Suport pentru format 24h
3. **Localization** - Suport complet pentru RO/RU/EN
4. **Server Integration** - Necesită endpoint-uri API
5. **State Management** - Refresh automat după modificări

## Bune Practici

1. Validați orele de lucru (deschidere < închidere)
2. Preveniți duplicate pentru aceeași dată
3. Arhivați excepțiile vechi
4. Setați permisiuni pentru editare
5. Implementați audit trail pentru modificări
6. Notificați utilizatorii despre schimbări
7. Sincronizați cu sistemul de programări

## Concluzie

FodExceptionDays oferă o soluție completă pentru gestionarea programului de lucru și a excepțiilor. Cu interfață intuitivă pentru CRUD operations și suport pentru diverse tipuri de excepții, sistemul facilitează administrarea eficientă a timpului de lucru în instituții.