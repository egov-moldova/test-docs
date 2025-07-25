# ExceptionDaysService

## Documentație pentru serviciul ExceptionDaysService

### 1. Descriere Generală

`ExceptionDaysService` este un serviciu pentru gestionarea programului de lucru și a zilelor excepționale pentru instituțiile guvernamentale. Permite configurarea orarului standard săptămânal și definirea excepțiilor precum sărbători legale, zile scurte sau zile lucrătoare speciale.

Caracteristici principale:
- Gestionare program de lucru standard (Luni-Duminică)
- Definire zile excepționale (sărbători, zile scurte, zile lucrătoare speciale)
- CRUD complet pentru excepții
- Suport pentru paginare server-side
- Validare ore de lucru
- Integrare cu componenta FodExceptionDays

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs

// Înregistrare automată prin AddFodComponents
builder.Services.AddFodComponents(configuration);

// Sau înregistrare manuală
builder.Services.AddScoped<IExceptionDaysService, ExceptionDaysService>();
builder.Services.AddHttpClient<IExceptionDaysService, ExceptionDaysService>(client =>
{
    client.BaseAddress = new Uri(configuration["ApiSettings:BaseUrl"]);
});
```

### 3. Interfața IExceptionDaysService

```csharp
public interface IExceptionDaysService
{
    Task<DataResponse<WorkProgramModel>> GetFormatted(DataRequest request);
    Task<DataResponse<ExceptionWorkingProgramModel>> GetExceptions(DataRequest request);
    Task AddOrUpdateException(ExceptionWorkingProgramDetailsModel model);
    Task<ExceptionWorkingProgramDetailsModel> GetExceptionById(Guid id);
    Task Delete(Guid id);
}
```

### 4. Metode Disponibile

| Metodă | Parametri | Return | Descriere |
|--------|-----------|--------|-----------|
| `GetFormatted` | `DataRequest request` | `Task<DataResponse<WorkProgramModel>>` | Obține programul de lucru formatat |
| `GetExceptions` | `DataRequest request` | `Task<DataResponse<ExceptionWorkingProgramModel>>` | Obține lista de excepții cu paginare |
| `AddOrUpdateException` | `ExceptionWorkingProgramDetailsModel model` | `Task` | Adaugă sau actualizează o excepție |
| `GetExceptionById` | `Guid id` | `Task<ExceptionWorkingProgramDetailsModel>` | Obține detaliile unei excepții |
| `Delete` | `Guid id` | `Task` | Șterge o excepție |

### 5. Modele de Date

#### WorkProgramModel
```csharp
public class WorkProgramModel
{
    public DayEnum Day { get; set; }
    public string Open { get; set; }      // Format: "HH:mm"
    public string Close { get; set; }     // Format: "HH:mm"
    public string Pause { get; set; }     // Format: "HH:mm - HH:mm"
}

public enum DayEnum
{
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7
}
```

#### ExceptionWorkingProgramModel
```csharp
public class ExceptionWorkingProgramModel
{
    public Guid Id { get; set; }
    public ExceptionTypeEnum Type { get; set; }
    public string Date { get; set; }      // Format: "dd.MM.yyyy"
    public string Open { get; set; }      // Format: "HH:mm"
    public string Close { get; set; }     // Format: "HH:mm"
}

public enum ExceptionTypeEnum
{
    WorkingDay = 0,    // Zi lucrătoare (în weekend/sărbătoare)
    Holiday = 1,       // Sărbătoare legală
    ShortDay = 2       // Zi scurtă
}
```

#### ExceptionWorkingProgramDetailsModel
```csharp
public class ExceptionWorkingProgramDetailsModel
{
    public Guid? Id { get; set; }
    public ExceptionTypeEnum Type { get; set; }
    public DateTime Date { get; set; }
    public int? OpenHours { get; set; }
    public int? OpenMinutes { get; set; }
    public int? CloseHours { get; set; }
    public int? CloseMinutes { get; set; }
}
```

### 6. Exemple de Utilizare

#### Afișare program de lucru complet
```razor
@page "/admin/program-lucru"
@inject IExceptionDaysService ExceptionDaysService
@inject IFodNotificationService NotificationService

<FodContainer>
    <FodText Typo="Typo.h4" GutterBottom="true">
        Program de Lucru
    </FodText>
    
    <!-- Program standard -->
    <FodCard Class="mb-4">
        <FodCardContent>
            <FodText Typo="Typo.h6" GutterBottom="true">
                Orar Standard Săptămânal
            </FodText>
            
            @if (workingProgram != null)
            {
                <FodDataTable Items="@workingProgram" Dense="true">
                    <HeaderContent>
                        <FodTHeadRow>
                            <FodTh>Zi</FodTh>
                            <FodTh>Deschidere</FodTh>
                            <FodTh>Închidere</FodTh>
                            <FodTh>Pauză</FodTh>
                        </FodTHeadRow>
                    </HeaderContent>
                    <RowTemplate>
                        <FodTr>
                            <FodTd>@GetDayName(context.Day)</FodTd>
                            <FodTd>@context.Open</FodTd>
                            <FodTd>@context.Close</FodTd>
                            <FodTd>@context.Pause</FodTd>
                        </FodTr>
                    </RowTemplate>
                </FodDataTable>
            }
            else
            {
                <FodLoadingLinear Indeterminate="true" />
            }
        </FodCardContent>
    </FodCard>
    
    <!-- Zile excepționale -->
    <FodCard>
        <FodCardContent>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <FodText Typo="Typo.h6">
                    Zile Excepționale
                </FodText>
                <FodButton Color="FodColor.Primary" 
                           OnClick="ShowAddExceptionModal"
                           StartIcon="@FodIcons.Material.Filled.Add">
                    Adaugă Excepție
                </FodButton>
            </div>
            
            <FodExceptionDays @ref="exceptionDaysComponent" />
        </FodCardContent>
    </FodCard>
</FodContainer>

<!-- Modal pentru adăugare/editare excepție -->
<FodModal @bind-IsOpen="showExceptionModal">
    <FodModalContent>
        <FodModalHeader>
            <FodText Typo="Typo.h5">
                @(editingException?.Id == null ? "Adaugă" : "Editează") Excepție
            </FodText>
        </FodModalHeader>
        <FodModalBody>
            <FodGrid Container="true" Spacing="3">
                <FodGrid Item="true" xs="12">
                    <FodSelect @bind-Value="editingException.Type" 
                               Label="Tip excepție"
                               Items="@exceptionTypes"
                               Required="true" />
                </FodGrid>
                <FodGrid Item="true" xs="12">
                    <FodDatePicker @bind-Date="editingException.Date" 
                                   Label="Data"
                                   MinDate="DateTime.Today"
                                   Required="true" />
                </FodGrid>
                @if (editingException.Type != ExceptionTypeEnum.Holiday)
                {
                    <FodGrid Item="true" xs="6">
                        <FodTimePicker @bind-Time="openTime" 
                                       Label="Ora deschidere"
                                       Required="true" />
                    </FodGrid>
                    <FodGrid Item="true" xs="6">
                        <FodTimePicker @bind-Time="closeTime" 
                                       Label="Ora închidere"
                                       Required="true" />
                    </FodGrid>
                }
            </FodGrid>
        </FodModalBody>
        <FodModalActions>
            <FodButton Color="FodColor.Default" OnClick="CloseModal">
                Anulează
            </FodButton>
            <FodButton Color="FodColor.Primary" OnClick="SaveException">
                Salvează
            </FodButton>
        </FodModalActions>
    </FodModalContent>
</FodModal>

@code {
    private List<WorkProgramModel> workingProgram;
    private FodExceptionDays exceptionDaysComponent;
    private bool showExceptionModal;
    private ExceptionWorkingProgramDetailsModel editingException = new();
    private TimeSpan? openTime;
    private TimeSpan? closeTime;
    
    private List<SelectableItem> exceptionTypes = new()
    {
        new(ExceptionTypeEnum.Holiday, "Sărbătoare legală"),
        new(ExceptionTypeEnum.ShortDay, "Zi scurtă"),
        new(ExceptionTypeEnum.WorkingDay, "Zi lucrătoare (excepțional)")
    };
    
    protected override async Task OnInitializedAsync()
    {
        await LoadWorkingProgram();
    }
    
    private async Task LoadWorkingProgram()
    {
        var request = new DataRequest { Page = 1, PageSize = 7 };
        var response = await ExceptionDaysService.GetFormatted(request);
        workingProgram = response.Data.ToList();
    }
    
    private string GetDayName(DayEnum day)
    {
        return day switch
        {
            DayEnum.Monday => "Luni",
            DayEnum.Tuesday => "Marți",
            DayEnum.Wednesday => "Miercuri",
            DayEnum.Thursday => "Joi",
            DayEnum.Friday => "Vineri",
            DayEnum.Saturday => "Sâmbătă",
            DayEnum.Sunday => "Duminică",
            _ => day.ToString()
        };
    }
    
    private void ShowAddExceptionModal()
    {
        editingException = new ExceptionWorkingProgramDetailsModel
        {
            Date = DateTime.Today.AddDays(1)
        };
        openTime = new TimeSpan(8, 0, 0);
        closeTime = new TimeSpan(17, 0, 0);
        showExceptionModal = true;
    }
    
    private async Task SaveException()
    {
        if (editingException.Type != ExceptionTypeEnum.Holiday)
        {
            editingException.OpenHours = openTime?.Hours;
            editingException.OpenMinutes = openTime?.Minutes;
            editingException.CloseHours = closeTime?.Hours;
            editingException.CloseMinutes = closeTime?.Minutes;
        }
        
        try
        {
            await ExceptionDaysService.AddOrUpdateException(editingException);
            NotificationService.Success("Excepție salvată cu succes!");
            
            // Reîncarcă lista
            await exceptionDaysComponent.RefreshData();
            CloseModal();
        }
        catch (Exception ex)
        {
            NotificationService.Error($"Eroare la salvare: {ex.Message}");
        }
    }
    
    private void CloseModal()
    {
        showExceptionModal = false;
        editingException = new();
    }
}
```

#### Gestionare sărbători legale
```razor
@inject IExceptionDaysService ExceptionDaysService

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Sărbători Legale @currentYear
        </FodText>
        
        <FodButton OnClick="ImportHolidays" 
                   Color="FodColor.Primary"
                   StartIcon="@FodIcons.Material.Filled.CloudDownload">
            Importă Sărbători Oficiale
        </FodButton>
        
        @if (holidays.Any())
        {
            <FodList Class="mt-3">
                @foreach (var holiday in holidays.OrderBy(h => h.Date))
                {
                    <FodListItem>
                        <FodListItemIcon>
                            <FodIcon>@FodIcons.Material.Filled.EventBusy</FodIcon>
                        </FodListItemIcon>
                        <FodListItemText>
                            <FodText>@holiday.Date.ToString("dd MMMM yyyy")</FodText>
                        </FodListItemText>
                        <FodListItemSecondaryAction>
                            <FodIconButton Icon="@FodIcons.Material.Filled.Delete"
                                           Size="FodSize.Small"
                                           OnClick="() => DeleteHoliday(holiday.Id)" />
                        </FodListItemSecondaryAction>
                    </FodListItem>
                }
            </FodList>
        }
    </FodCardContent>
</FodCard>

@code {
    private int currentYear = DateTime.Now.Year;
    private List<ExceptionWorkingProgramDetailsModel> holidays = new();
    
    protected override async Task OnInitializedAsync()
    {
        await LoadHolidays();
    }
    
    private async Task LoadHolidays()
    {
        var request = new DataRequest
        {
            Page = 1,
            PageSize = 100,
            Filters = new List<Filter>
            {
                new Filter
                {
                    Field = "Type",
                    Operator = FilterOperator.Equal,
                    Value = ExceptionTypeEnum.Holiday
                },
                new Filter
                {
                    Field = "Year",
                    Operator = FilterOperator.Equal,
                    Value = currentYear
                }
            }
        };
        
        var response = await ExceptionDaysService.GetExceptions(request);
        holidays = response.Data
            .Select(async h => await ExceptionDaysService.GetExceptionById(h.Id))
            .Select(t => t.Result)
            .ToList();
    }
    
    private async Task ImportHolidays()
    {
        // Lista sărbători legale standard pentru Moldova
        var standardHolidays = new[]
        {
            new { Date = new DateTime(currentYear, 1, 1), Name = "Anul Nou" },
            new { Date = new DateTime(currentYear, 1, 7), Name = "Nașterea lui Iisus Hristos" },
            new { Date = new DateTime(currentYear, 1, 8), Name = "Nașterea lui Iisus Hristos" },
            new { Date = new DateTime(currentYear, 3, 8), Name = "Ziua internațională a femeii" },
            new { Date = new DateTime(currentYear, 5, 1), Name = "Ziua internațională a solidarității oamenilor muncii" },
            new { Date = new DateTime(currentYear, 5, 9), Name = "Ziua Victoriei și a comemorării eroilor" },
            new { Date = new DateTime(currentYear, 6, 1), Name = "Ziua Copilului" },
            new { Date = new DateTime(currentYear, 8, 27), Name = "Ziua Independenței" },
            new { Date = new DateTime(currentYear, 8, 31), Name = "Limba noastră" },
            new { Date = new DateTime(currentYear, 12, 25), Name = "Nașterea lui Iisus Hristos" }
        };
        
        foreach (var holiday in standardHolidays)
        {
            // Verifică dacă nu există deja
            if (!holidays.Any(h => h.Date.Date == holiday.Date.Date))
            {
                await ExceptionDaysService.AddOrUpdateException(new ExceptionWorkingProgramDetailsModel
                {
                    Type = ExceptionTypeEnum.Holiday,
                    Date = holiday.Date
                });
            }
        }
        
        await LoadHolidays();
    }
    
    private async Task DeleteHoliday(Guid id)
    {
        await ExceptionDaysService.Delete(id);
        await LoadHolidays();
    }
}
```

#### Calendar vizual cu excepții
```razor
@inject IExceptionDaysService ExceptionDaysService

<FodCard>
    <FodCardContent>
        <FodCalendar @ref="calendar" 
                     OnDayRender="OnCalendarDayRender"
                     OnDateSelect="OnDateSelected" />
        
        @if (selectedDateExceptions.Any())
        {
            <FodPaper Elevation="1" Class="mt-3 p-3">
                <FodText Typo="Typo.h6" GutterBottom="true">
                    Excepții pentru @selectedDate?.ToString("dd MMMM yyyy")
                </FodText>
                
                @foreach (var exception in selectedDateExceptions)
                {
                    <FodChip Color="@GetExceptionColor(exception.Type)" 
                             Class="me-2"
                             OnClose="() => DeleteException(exception.Id)">
                        @GetExceptionText(exception)
                    </FodChip>
                }
            </FodPaper>
        }
    </FodCardContent>
</FodCard>

@code {
    private FodCalendar calendar;
    private Dictionary<DateTime, List<ExceptionWorkingProgramModel>> exceptionsByDate = new();
    private DateTime? selectedDate;
    private List<ExceptionWorkingProgramModel> selectedDateExceptions = new();
    
    protected override async Task OnInitializedAsync()
    {
        await LoadExceptionsForMonth(DateTime.Now);
    }
    
    private async Task LoadExceptionsForMonth(DateTime month)
    {
        var startDate = new DateTime(month.Year, month.Month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);
        
        var request = new DataRequest
        {
            Page = 1,
            PageSize = 100,
            Filters = new List<Filter>
            {
                new Filter
                {
                    Field = "Date",
                    Operator = FilterOperator.GreaterThanOrEqual,
                    Value = startDate
                },
                new Filter
                {
                    Field = "Date",
                    Operator = FilterOperator.LessThanOrEqual,
                    Value = endDate
                }
            }
        };
        
        var response = await ExceptionDaysService.GetExceptions(request);
        
        exceptionsByDate.Clear();
        foreach (var exception in response.Data)
        {
            var date = DateTime.ParseExact(exception.Date, "dd.MM.yyyy", null);
            if (!exceptionsByDate.ContainsKey(date))
            {
                exceptionsByDate[date] = new List<ExceptionWorkingProgramModel>();
            }
            exceptionsByDate[date].Add(exception);
        }
    }
    
    private void OnCalendarDayRender(CalendarDayRenderEventArgs args)
    {
        if (exceptionsByDate.ContainsKey(args.Date.Date))
        {
            var exceptions = exceptionsByDate[args.Date.Date];
            
            foreach (var exception in exceptions)
            {
                args.AddBadge(GetExceptionBadgeColor(exception.Type));
            }
            
            args.AddTooltip(string.Join(", ", 
                exceptions.Select(e => GetExceptionTypeName(e.Type))));
        }
    }
    
    private void OnDateSelected(DateTime date)
    {
        selectedDate = date;
        selectedDateExceptions = exceptionsByDate.ContainsKey(date.Date) 
            ? exceptionsByDate[date.Date] 
            : new List<ExceptionWorkingProgramModel>();
    }
    
    private FodColor GetExceptionColor(ExceptionTypeEnum type)
    {
        return type switch
        {
            ExceptionTypeEnum.Holiday => FodColor.Error,
            ExceptionTypeEnum.ShortDay => FodColor.Warning,
            ExceptionTypeEnum.WorkingDay => FodColor.Success,
            _ => FodColor.Default
        };
    }
    
    private string GetExceptionText(ExceptionWorkingProgramModel exception)
    {
        return exception.Type switch
        {
            ExceptionTypeEnum.Holiday => "Sărbătoare",
            ExceptionTypeEnum.ShortDay => $"Zi scurtă: {exception.Open} - {exception.Close}",
            ExceptionTypeEnum.WorkingDay => $"Zi lucrătoare: {exception.Open} - {exception.Close}",
            _ => "Excepție"
        };
    }
}
```

#### Verificare disponibilitate serviciu
```csharp
public class ServiceAvailabilityChecker
{
    private readonly IExceptionDaysService _exceptionDaysService;
    
    public async Task<bool> IsServiceAvailable(DateTime dateTime)
    {
        // Verifică mai întâi dacă este o zi excepțională
        var exceptions = await _exceptionDaysService.GetExceptions(new DataRequest
        {
            Filters = new List<Filter>
            {
                new Filter
                {
                    Field = "Date",
                    Operator = FilterOperator.Equal,
                    Value = dateTime.Date
                }
            }
        });
        
        var exception = exceptions.Data.FirstOrDefault();
        
        if (exception != null)
        {
            switch (exception.Type)
            {
                case ExceptionTypeEnum.Holiday:
                    return false; // Închis în sărbători
                    
                case ExceptionTypeEnum.WorkingDay:
                case ExceptionTypeEnum.ShortDay:
                    // Verifică dacă ora curentă este în interval
                    var openTime = TimeSpan.Parse(exception.Open);
                    var closeTime = TimeSpan.Parse(exception.Close);
                    var currentTime = dateTime.TimeOfDay;
                    
                    return currentTime >= openTime && currentTime <= closeTime;
            }
        }
        
        // Dacă nu e excepție, verifică programul normal
        var workProgram = await _exceptionDaysService.GetFormatted(new DataRequest());
        var dayProgram = workProgram.Data.FirstOrDefault(w => w.Day == GetDayEnum(dateTime.DayOfWeek));
        
        if (dayProgram == null || string.IsNullOrEmpty(dayProgram.Open))
            return false; // Închis în această zi
        
        var standardOpen = TimeSpan.Parse(dayProgram.Open);
        var standardClose = TimeSpan.Parse(dayProgram.Close);
        var currentTime = dateTime.TimeOfDay;
        
        // Verifică pauza dacă există
        if (!string.IsNullOrEmpty(dayProgram.Pause))
        {
            var pauseParts = dayProgram.Pause.Split(" - ");
            if (pauseParts.Length == 2)
            {
                var pauseStart = TimeSpan.Parse(pauseParts[0]);
                var pauseEnd = TimeSpan.Parse(pauseParts[1]);
                
                if (currentTime >= pauseStart && currentTime <= pauseEnd)
                    return false; // În pauză
            }
        }
        
        return currentTime >= standardOpen && currentTime <= standardClose;
    }
    
    private DayEnum GetDayEnum(DayOfWeek dayOfWeek)
    {
        return dayOfWeek switch
        {
            DayOfWeek.Monday => DayEnum.Monday,
            DayOfWeek.Tuesday => DayEnum.Tuesday,
            DayOfWeek.Wednesday => DayEnum.Wednesday,
            DayOfWeek.Thursday => DayEnum.Thursday,
            DayOfWeek.Friday => DayEnum.Friday,
            DayOfWeek.Saturday => DayEnum.Saturday,
            DayOfWeek.Sunday => DayEnum.Sunday,
            _ => DayEnum.Monday
        };
    }
}
```

### 7. Integrare cu componenta FodExceptionDays

```razor
@page "/admin/exception-days"

<FodContainer>
    <FodText Typo="Typo.h4" GutterBottom="true">
        Gestionare Zile Excepționale
    </FodText>
    
    <!-- Componenta gata configurată -->
    <FodExceptionDays 
        ShowAddButton="true"
        ShowEditButton="true"
        ShowDeleteButton="true"
        PageSize="20"
        OnExceptionAdded="OnExceptionAdded"
        OnExceptionUpdated="OnExceptionUpdated"
        OnExceptionDeleted="OnExceptionDeleted" />
</FodContainer>

@code {
    private async Task OnExceptionAdded(ExceptionWorkingProgramDetailsModel model)
    {
        // Log sau notificare
        Console.WriteLine($"Excepție adăugată: {model.Date:dd.MM.yyyy}");
    }
    
    private async Task OnExceptionUpdated(ExceptionWorkingProgramDetailsModel model)
    {
        // Log sau notificare
        Console.WriteLine($"Excepție actualizată: {model.Id}");
    }
    
    private async Task OnExceptionDeleted(Guid id)
    {
        // Log sau notificare
        Console.WriteLine($"Excepție ștearsă: {id}");
    }
}
```

### 8. Export și Import

```csharp
public class ExceptionDaysImportExportService
{
    private readonly IExceptionDaysService _exceptionDaysService;
    
    public async Task<byte[]> ExportToExcel(int year)
    {
        var request = new DataRequest
        {
            PageSize = 1000,
            Filters = new List<Filter>
            {
                new Filter
                {
                    Field = "Year",
                    Operator = FilterOperator.Equal,
                    Value = year
                }
            }
        };
        
        var exceptions = await _exceptionDaysService.GetExceptions(request);
        
        using var package = new ExcelPackage();
        var worksheet = package.Workbook.Worksheets.Add("Zile Excepționale");
        
        // Headers
        worksheet.Cells[1, 1].Value = "Data";
        worksheet.Cells[1, 2].Value = "Tip";
        worksheet.Cells[1, 3].Value = "Ora Deschidere";
        worksheet.Cells[1, 4].Value = "Ora Închidere";
        
        // Data
        var row = 2;
        foreach (var exception in exceptions.Data.OrderBy(e => e.Date))
        {
            worksheet.Cells[row, 1].Value = exception.Date;
            worksheet.Cells[row, 2].Value = GetExceptionTypeName(exception.Type);
            worksheet.Cells[row, 3].Value = exception.Open;
            worksheet.Cells[row, 4].Value = exception.Close;
            row++;
        }
        
        // Formatting
        worksheet.Cells[1, 1, 1, 4].Style.Font.Bold = true;
        worksheet.Cells.AutoFitColumns();
        
        return package.GetAsByteArray();
    }
    
    public async Task ImportFromExcel(Stream fileStream)
    {
        using var package = new ExcelPackage(fileStream);
        var worksheet = package.Workbook.Worksheets.First();
        
        for (int row = 2; row <= worksheet.Dimension.End.Row; row++)
        {
            var dateStr = worksheet.Cells[row, 1].Text;
            var typeStr = worksheet.Cells[row, 2].Text;
            var openStr = worksheet.Cells[row, 3].Text;
            var closeStr = worksheet.Cells[row, 4].Text;
            
            if (DateTime.TryParseExact(dateStr, "dd.MM.yyyy", null, 
                DateTimeStyles.None, out var date))
            {
                var model = new ExceptionWorkingProgramDetailsModel
                {
                    Date = date,
                    Type = ParseExceptionType(typeStr)
                };
                
                if (!string.IsNullOrEmpty(openStr) && TimeSpan.TryParse(openStr, out var openTime))
                {
                    model.OpenHours = openTime.Hours;
                    model.OpenMinutes = openTime.Minutes;
                }
                
                if (!string.IsNullOrEmpty(closeStr) && TimeSpan.TryParse(closeStr, out var closeTime))
                {
                    model.CloseHours = closeTime.Hours;
                    model.CloseMinutes = closeTime.Minutes;
                }
                
                await _exceptionDaysService.AddOrUpdateException(model);
            }
        }
    }
}
```

### 9. Validare și Business Rules

```csharp
public class ExceptionDaysValidator
{
    private readonly IExceptionDaysService _exceptionDaysService;
    
    public async Task<ValidationResult> ValidateException(ExceptionWorkingProgramDetailsModel model)
    {
        var errors = new List<string>();
        
        // Validare dată
        if (model.Date < DateTime.Today)
        {
            errors.Add("Nu puteți adăuga excepții pentru date din trecut");
        }
        
        // Validare ore pentru zile lucrătoare
        if (model.Type != ExceptionTypeEnum.Holiday)
        {
            if (!model.OpenHours.HasValue || !model.OpenMinutes.HasValue)
            {
                errors.Add("Ora de deschidere este obligatorie");
            }
            
            if (!model.CloseHours.HasValue || !model.CloseMinutes.HasValue)
            {
                errors.Add("Ora de închidere este obligatorie");
            }
            
            if (model.OpenHours.HasValue && model.CloseHours.HasValue)
            {
                var openTime = new TimeSpan(model.OpenHours.Value, model.OpenMinutes ?? 0, 0);
                var closeTime = new TimeSpan(model.CloseHours.Value, model.CloseMinutes ?? 0, 0);
                
                if (openTime >= closeTime)
                {
                    errors.Add("Ora de închidere trebuie să fie după ora de deschidere");
                }
                
                // Validare pentru zile scurte
                if (model.Type == ExceptionTypeEnum.ShortDay)
                {
                    var totalHours = (closeTime - openTime).TotalHours;
                    if (totalHours >= 8)
                    {
                        errors.Add("O zi scurtă trebuie să aibă mai puțin de 8 ore");
                    }
                }
            }
        }
        
        // Verifică duplicat
        var existingExceptions = await _exceptionDaysService.GetExceptions(new DataRequest
        {
            Filters = new List<Filter>
            {
                new Filter
                {
                    Field = "Date",
                    Operator = FilterOperator.Equal,
                    Value = model.Date
                }
            }
        });
        
        if (existingExceptions.Data.Any(e => e.Id != model.Id))
        {
            errors.Add("Există deja o excepție pentru această dată");
        }
        
        return new ValidationResult
        {
            IsValid = !errors.Any(),
            Errors = errors
        };
    }
}
```

### 10. Monitorizare și Audit

```csharp
public class AuditedExceptionDaysService : IExceptionDaysService
{
    private readonly IExceptionDaysService _innerService;
    private readonly IAuditService _auditService;
    private readonly ICurrentUserContextService _userContext;
    
    public async Task AddOrUpdateException(ExceptionWorkingProgramDetailsModel model)
    {
        var isNew = !model.Id.HasValue;
        var oldValue = isNew ? null : await _innerService.GetExceptionById(model.Id.Value);
        
        await _innerService.AddOrUpdateException(model);
        
        // Audit
        await _auditService.LogAsync(new AuditEntry
        {
            Action = isNew ? "ExceptionDayAdded" : "ExceptionDayUpdated",
            EntityType = "ExceptionWorkingProgram",
            EntityId = model.Id?.ToString(),
            UserId = _userContext.UserId,
            Timestamp = DateTime.UtcNow,
            OldValue = JsonSerializer.Serialize(oldValue),
            NewValue = JsonSerializer.Serialize(model),
            Details = $"{model.Type} - {model.Date:dd.MM.yyyy}"
        });
    }
    
    public async Task Delete(Guid id)
    {
        var exception = await _innerService.GetExceptionById(id);
        
        await _innerService.Delete(id);
        
        await _auditService.LogAsync(new AuditEntry
        {
            Action = "ExceptionDayDeleted",
            EntityType = "ExceptionWorkingProgram",
            EntityId = id.ToString(),
            UserId = _userContext.UserId,
            Timestamp = DateTime.UtcNow,
            OldValue = JsonSerializer.Serialize(exception),
            Details = $"Șters: {exception.Type} - {exception.Date:dd.MM.yyyy}"
        });
    }
    
    // Implementare pentru celelalte metode...
}
```

### 11. Testare

```csharp
[TestClass]
public class ExceptionDaysServiceTests
{
    private Mock<HttpMessageHandler> _httpHandler;
    private IExceptionDaysService _service;
    
    [TestMethod]
    public async Task GetExceptions_ReturnsPagedResults()
    {
        // Arrange
        var request = new DataRequest { Page = 1, PageSize = 10 };
        var expectedResponse = new DataResponse<ExceptionWorkingProgramModel>
        {
            Data = new[]
            {
                new ExceptionWorkingProgramModel
                {
                    Id = Guid.NewGuid(),
                    Type = ExceptionTypeEnum.Holiday,
                    Date = "01.01.2024",
                    Open = "",
                    Close = ""
                }
            },
            TotalCount = 1
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _service.GetExceptions(request);
        
        // Assert
        Assert.AreEqual(1, result.TotalCount);
        Assert.AreEqual(ExceptionTypeEnum.Holiday, result.Data.First().Type);
    }
    
    [TestMethod]
    public async Task AddOrUpdateException_Holiday_SuccessfullyCreated()
    {
        // Arrange
        var model = new ExceptionWorkingProgramDetailsModel
        {
            Type = ExceptionTypeEnum.Holiday,
            Date = new DateTime(2024, 12, 25)
        };
        
        SetupHttpResponse(HttpStatusCode.OK);
        
        // Act & Assert
        await _service.AddOrUpdateException(model);
        // Should not throw
    }
    
    [TestMethod]
    public async Task GetExceptionById_ValidId_ReturnsException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var expected = new ExceptionWorkingProgramDetailsModel
        {
            Id = id,
            Type = ExceptionTypeEnum.ShortDay,
            Date = DateTime.Today,
            OpenHours = 9,
            OpenMinutes = 0,
            CloseHours = 14,
            CloseMinutes = 0
        };
        
        SetupHttpResponse(expected);
        
        // Act
        var result = await _service.GetExceptionById(id);
        
        // Assert
        Assert.AreEqual(id, result.Id);
        Assert.AreEqual(9, result.OpenHours);
        Assert.AreEqual(14, result.CloseHours);
    }
}
```

### 12. Best Practices

1. **Validare strictă** - Validați toate datele înainte de salvare
2. **Audit complet** - Înregistrați toate modificările pentru trasabilitate
3. **Cache inteligent** - Cache-uiți programul standard, nu excepțiile
4. **Notificări** - Notificați utilizatorii despre schimbări importante
5. **Import/Export** - Oferiți opțiuni de import/export pentru gestionare în masă
6. **Verificare conflicte** - Nu permiteți excepții duplicate pentru aceeași dată

### 13. Concluzie

`ExceptionDaysService` oferă o soluție completă pentru gestionarea programului de lucru și a zilelor excepționale în instituțiile guvernamentale. Cu suport pentru toate tipurile de excepții, validare robustă și integrare ușoară cu componente UI, serviciul asigură flexibilitate maximă în configurarea orarului de funcționare.