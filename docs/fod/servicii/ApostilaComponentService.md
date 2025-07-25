# ApostilaComponentService

## Documentație pentru serviciul ApostilaComponentService

### 1. Descriere Generală

`ApostilaComponentService` este un serviciu specializat pentru calcularea datelor estimate de finalizare pentru serviciile de apostilare. Apostila este o certificare oficială care autentifică documentele pentru utilizare internațională conform Convenției de la Haga.

Caracteristici principale:
- Calculează data estimată de finalizare pentru apostilare
- Integrează cu serviciul extern de apostilare
- Ține cont de termenele de execuție selectate
- Validează dacă calculul poate fi efectuat
- Suport pentru diferite tipuri de persoane (fizice/juridice)

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs

// Înregistrare automată prin AddFodComponents
builder.Services.AddFodComponents(configuration);

// Pentru server-side cu integrare apostilă
builder.Services.AddFodComponentsServer(configuration, connectionString);
builder.Services.AddApostilaIntegration(configuration);

// Sau înregistrare manuală
builder.Services.AddScoped<IApostilaComponentService, ApostilaComponentService>();
builder.Services.AddHttpClient<IApostilaComponentService, ApostilaComponentService>(client =>
{
    client.BaseAddress = new Uri(configuration["ApiSettings:BaseUrl"]);
});
```

### 3. Interfața IApostilaComponentService

```csharp
namespace Fod.Components.Shared.Business.Apostila
{
    public interface IApostilaComponentService
    {
        Task<ApostilaEstimateResolveDateResponse> CalculateEstimateResolveDate(
            ApostilaEstimateResolveDateRequest request);
    }
}
```

### 4. Metode Disponibile

| Metodă | Parametri | Return | Descriere |
|--------|-----------|--------|-----------|
| `CalculateEstimateResolveDate` | `ApostilaEstimateResolveDateRequest request` | `Task<ApostilaEstimateResolveDateResponse>` | Calculează data estimată de finalizare |

### 5. Modele de Date

#### ApostilaEstimateResolveDateRequest
```csharp
public class ApostilaEstimateResolveDateRequest
{
    // Data estimată de finalizare a serviciului principal
    public DateTime ServiceEstimateResolveDate { get; set; }
    
    // ID-ul termenului de execuție selectat
    // Notă: Există un typo în numele proprietății (ExecturionTermId)
    public string ExecturionTermId { get; set; }
}
```

#### ApostilaEstimateResolveDateResponse
```csharp
public class ApostilaEstimateResolveDateResponse
{
    // Indică dacă calculul poate fi efectuat
    public bool CanBeCalculated { get; set; }
    
    // Data estimată de finalizare (null dacă nu poate fi calculată)
    public DateTime? EstimateResolveDate { get; set; }
}
```

### 6. Exemple de Utilizare

#### Calculare simplă dată estimată
```razor
@inject IApostilaComponentService ApostilaService
@inject IFodNotificationService NotificationService

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Calculator Termen Apostilare
        </FodText>
        
        <FodGrid Container="true" Spacing="3">
            <FodGrid Item="true" xs="12" md="6">
                <FodDatePicker @bind-Date="serviceCompletionDate" 
                               Label="Data finalizării serviciului principal"
                               MinDate="DateTime.Today" />
            </FodGrid>
            <FodGrid Item="true" xs="12" md="6">
                <FodSelect @bind-Value="selectedExecutionTerm" 
                           Label="Termen de execuție"
                           Items="@executionTerms" />
            </FodGrid>
        </FodGrid>
        
        <FodButton OnClick="CalculateApostilleDate" 
                   Color="FodColor.Primary"
                   Class="mt-3"
                   Disabled="@(!serviceCompletionDate.HasValue || string.IsNullOrEmpty(selectedExecutionTerm))">
            Calculează
        </FodButton>
        
        @if (estimatedDate.HasValue)
        {
            <FodAlert Severity="FodSeverity.Info" Class="mt-3">
                <FodAlertTitle>Dată estimată apostilare</FodAlertTitle>
                Documentele apostilate vor fi disponibile aproximativ la: 
                <strong>@estimatedDate.Value.ToString("dd MMMM yyyy")</strong>
            </FodAlert>
        }
        else if (calculationAttempted && !canCalculate)
        {
            <FodAlert Severity="FodSeverity.Warning" Class="mt-3">
                Data de finalizare nu poate fi calculată pentru termenul selectat.
            </FodAlert>
        }
    </FodCardContent>
</FodCard>

@code {
    private DateTime? serviceCompletionDate = DateTime.Today.AddDays(5);
    private string selectedExecutionTerm;
    private DateTime? estimatedDate;
    private bool canCalculate;
    private bool calculationAttempted = false;
    
    private List<SelectableItem> executionTerms = new()
    {
        new("standard", "Standard (5 zile lucrătoare)"),
        new("urgent", "Urgent (2 zile lucrătoare)"),
        new("very-urgent", "Foarte urgent (1 zi lucrătoare)")
    };
    
    private async Task CalculateApostilleDate()
    {
        if (!serviceCompletionDate.HasValue || string.IsNullOrEmpty(selectedExecutionTerm))
            return;
        
        calculationAttempted = true;
        
        var request = new ApostilaEstimateResolveDateRequest
        {
            ServiceEstimateResolveDate = serviceCompletionDate.Value,
            ExecturionTermId = selectedExecutionTerm
        };
        
        try
        {
            var response = await ApostilaService.CalculateEstimateResolveDate(request);
            
            canCalculate = response.CanBeCalculated;
            estimatedDate = response.EstimateResolveDate;
            
            if (!canCalculate)
            {
                NotificationService.Warning("Calculul nu poate fi efectuat pentru acest termen.");
            }
        }
        catch (Exception ex)
        {
            NotificationService.Error($"Eroare la calculare: {ex.Message}");
        }
    }
}
```

#### Integrare cu componenta FodApostila
```razor
@page "/servicii/apostilare"
@inject IApostilaComponentService ApostilaService

<FodContainer>
    <FodText Typo="Typo.h4" GutterBottom="true">
        Serviciu de Apostilare Documente
    </FodText>
    
    <!-- Date serviciu principal -->
    <FodCard Class="mb-3">
        <FodCardContent>
            <FodText Typo="Typo.h6" GutterBottom="true">
                Informații Serviciu Principal
            </FodText>
            <FodText>
                Data estimată finalizare: @mainServiceDate.ToString("dd.MM.yyyy")
            </FodText>
        </FodCardContent>
    </FodCard>
    
    <!-- Componenta apostilare -->
    <FodApostila 
        Model="@apostilaModel"
        Options="@apostilaOptions"
        OnExecutionTermChanged="OnExecutionTermChanged"
        ShowEstimatedDate="true" />
    
    @if (apostilleEstimatedDate.HasValue)
    {
        <FodPaper Elevation="2" Class="mt-3 p-3">
            <FodGrid Container="true" AlignItems="Align.Center">
                <FodGrid Item="true" xs="auto">
                    <FodIcon Color="FodColor.Success">
                        @FodIcons.Material.Filled.Schedule
                    </FodIcon>
                </FodGrid>
                <FodGrid Item="true" xs="true">
                    <FodText>
                        Documentele apostilate vor fi disponibile la: 
                        <strong>@apostilleEstimatedDate.Value.ToString("dd MMMM yyyy")</strong>
                    </FodText>
                    <FodText Typo="Typo.caption">
                        Termen calculat pe baza datei de finalizare a serviciului principal 
                        și termenului de execuție selectat
                    </FodText>
                </FodGrid>
            </FodGrid>
        </FodPaper>
    }
</FodContainer>

@code {
    private FodApostilaModel apostilaModel = new();
    private FodApostilaOptionsModel apostilaOptions;
    private DateTime mainServiceDate = DateTime.Today.AddDays(7);
    private DateTime? apostilleEstimatedDate;
    
    protected override async Task OnInitializedAsync()
    {
        // Încarcă opțiunile de apostilare
        apostilaOptions = await LoadApostilaOptions();
    }
    
    private async Task OnExecutionTermChanged(string executionTermId)
    {
        if (string.IsNullOrEmpty(executionTermId))
        {
            apostilleEstimatedDate = null;
            return;
        }
        
        var request = new ApostilaEstimateResolveDateRequest
        {
            ServiceEstimateResolveDate = mainServiceDate,
            ExecturionTermId = executionTermId
        };
        
        var response = await ApostilaService.CalculateEstimateResolveDate(request);
        
        if (response.CanBeCalculated)
        {
            apostilleEstimatedDate = response.EstimateResolveDate;
        }
        else
        {
            apostilleEstimatedDate = null;
            // Afișează mesaj că termenul nu poate fi calculat
        }
    }
}
```

#### Calculator avansat cu zile lucrătoare
```csharp
public class ApostilleCalculatorService
{
    private readonly IApostilaComponentService _apostilaService;
    private readonly IExceptionDaysService _exceptionDaysService;
    private readonly ILogger<ApostilleCalculatorService> _logger;
    
    public async Task<ApostilleCalculationResult> CalculateWithDetails(
        DateTime serviceDate, 
        string executionTermId)
    {
        var result = new ApostilleCalculationResult();
        
        // Calculează data standard
        var response = await _apostilaService.CalculateEstimateResolveDate(
            new ApostilaEstimateResolveDateRequest
            {
                ServiceEstimateResolveDate = serviceDate,
                ExecturionTermId = executionTermId
            });
        
        if (!response.CanBeCalculated || !response.EstimateResolveDate.HasValue)
        {
            result.Success = false;
            result.ErrorMessage = "Calculul nu poate fi efectuat pentru acest termen";
            return result;
        }
        
        result.EstimatedDate = response.EstimateResolveDate.Value;
        result.Success = true;
        
        // Calculează zilele lucrătoare
        result.WorkingDays = await CalculateWorkingDays(
            serviceDate, 
            result.EstimatedDate);
        
        // Verifică dacă sunt zile nelucrătoare în interval
        result.NonWorkingDays = await GetNonWorkingDays(
            serviceDate, 
            result.EstimatedDate);
        
        // Ajustează pentru weekend-uri și sărbători
        if (result.NonWorkingDays.Any())
        {
            result.AdjustedDate = await AdjustForNonWorkingDays(
                result.EstimatedDate, 
                result.NonWorkingDays.Count);
        }
        
        return result;
    }
    
    private async Task<int> CalculateWorkingDays(DateTime start, DateTime end)
    {
        var days = 0;
        var current = start.AddDays(1);
        
        while (current <= end)
        {
            if (current.DayOfWeek != DayOfWeek.Saturday && 
                current.DayOfWeek != DayOfWeek.Sunday)
            {
                // Verifică dacă nu e sărbătoare
                var isHoliday = await IsHoliday(current);
                if (!isHoliday)
                {
                    days++;
                }
            }
            current = current.AddDays(1);
        }
        
        return days;
    }
}

public class ApostilleCalculationResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; }
    public DateTime EstimatedDate { get; set; }
    public DateTime? AdjustedDate { get; set; }
    public int WorkingDays { get; set; }
    public List<DateTime> NonWorkingDays { get; set; } = new();
}
```

#### Batch processing pentru apostilare
```razor
@inject IApostilaComponentService ApostilaService

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Calculare în Masă - Termene Apostilare
        </FodText>
        
        <FodDataTable @ref="dataTable" 
                      Items="@serviceRequests"
                      ShowPagination="true"
                      PageSize="10">
            <HeaderContent>
                <FodTHeadRow>
                    <FodTh>Nr. Cerere</FodTh>
                    <FodTh>Serviciu</FodTh>
                    <FodTh>Data Finalizare</FodTh>
                    <FodTh>Termen Apostilare</FodTh>
                    <FodTh>Data Estimată Apostilă</FodTh>
                    <FodTh>Status</FodTh>
                </FodTHeadRow>
            </HeaderContent>
            <RowTemplate>
                <FodTr>
                    <FodTd>@context.RequestNumber</FodTd>
                    <FodTd>@context.ServiceName</FodTd>
                    <FodTd>@context.CompletionDate.ToString("dd.MM.yyyy")</FodTd>
                    <FodTd>
                        <FodSelect Value="@context.ExecutionTermId"
                                   ValueChanged="(value) => OnExecutionTermChanged(context, value)"
                                   Items="@executionTerms"
                                   Dense="true" />
                    </FodTd>
                    <FodTd>
                        @if (context.ApostilleDate.HasValue)
                        {
                            <FodText Color="FodColor.Success">
                                @context.ApostilleDate.Value.ToString("dd.MM.yyyy")
                            </FodText>
                        }
                        else if (context.CalculationAttempted)
                        {
                            <FodText Color="FodColor.Error">
                                Nu poate fi calculat
                            </FodText>
                        }
                        else
                        {
                            <FodText Color="FodColor.Secondary">
                                Selectați termen
                            </FodText>
                        }
                    </FodTd>
                    <FodTd>
                        @if (context.IsProcessing)
                        {
                            <FodLoadingCircular Size="FodSize.Small" />
                        }
                        else if (context.ApostilleDate.HasValue)
                        {
                            <FodChip Color="FodColor.Success" Size="FodSize.Small">
                                Calculat
                            </FodChip>
                        }
                        else if (context.CalculationAttempted)
                        {
                            <FodChip Color="FodColor.Error" Size="FodSize.Small">
                                Eroare
                            </FodChip>
                        }
                    </FodTd>
                </FodTr>
            </RowTemplate>
        </FodDataTable>
        
        <div class="mt-3">
            <FodButton OnClick="CalculateAll" 
                       Color="FodColor.Primary"
                       StartIcon="@FodIcons.Material.Filled.Calculate">
                Calculează Toate
            </FodButton>
            <FodButton OnClick="ExportResults" 
                       Color="FodColor.Default"
                       StartIcon="@FodIcons.Material.Filled.GetApp"
                       Class="ms-2">
                Export Excel
            </FodButton>
        </div>
    </FodCardContent>
</FodCard>

@code {
    private FodDataTable<ServiceRequestViewModel> dataTable;
    private List<ServiceRequestViewModel> serviceRequests = new();
    private List<SelectableItem> executionTerms = new();
    
    private async Task OnExecutionTermChanged(ServiceRequestViewModel request, string termId)
    {
        request.ExecutionTermId = termId;
        request.IsProcessing = true;
        StateHasChanged();
        
        try
        {
            var response = await ApostilaService.CalculateEstimateResolveDate(
                new ApostilaEstimateResolveDateRequest
                {
                    ServiceEstimateResolveDate = request.CompletionDate,
                    ExecturionTermId = termId
                });
            
            request.CalculationAttempted = true;
            request.ApostilleDate = response.CanBeCalculated 
                ? response.EstimateResolveDate 
                : null;
        }
        finally
        {
            request.IsProcessing = false;
            StateHasChanged();
        }
    }
    
    private async Task CalculateAll()
    {
        var tasks = serviceRequests
            .Where(r => !string.IsNullOrEmpty(r.ExecutionTermId) && !r.ApostilleDate.HasValue)
            .Select(r => OnExecutionTermChanged(r, r.ExecutionTermId))
            .ToList();
        
        await Task.WhenAll(tasks);
    }
}
```

### 7. Monitorizare și Cache

```csharp
public class CachedApostilaComponentService : IApostilaComponentService
{
    private readonly IApostilaComponentService _innerService;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachedApostilaComponentService> _logger;
    
    public async Task<ApostilaEstimateResolveDateResponse> CalculateEstimateResolveDate(
        ApostilaEstimateResolveDateRequest request)
    {
        // Cache key bazat pe dată și termen
        var cacheKey = $"apostila_{request.ServiceEstimateResolveDate:yyyyMMdd}_{request.ExecturionTermId}";
        
        if (_cache.TryGetValue<ApostilaEstimateResolveDateResponse>(cacheKey, out var cached))
        {
            _logger.LogDebug("Returnare din cache pentru {CacheKey}", cacheKey);
            return cached;
        }
        
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            var result = await _innerService.CalculateEstimateResolveDate(request);
            
            // Cache doar rezultatele pozitive pentru 1 oră
            if (result.CanBeCalculated)
            {
                _cache.Set(cacheKey, result, TimeSpan.FromHours(1));
            }
            
            _logger.LogInformation(
                "Calculat termen apostilare: {ServiceDate} + {TermId} = {EstimateDate} în {Duration}ms",
                request.ServiceEstimateResolveDate,
                request.ExecturionTermId,
                result.EstimateResolveDate,
                stopwatch.ElapsedMilliseconds);
            
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, 
                "Eroare la calcularea termenului de apostilare pentru {ServiceDate} și {TermId}",
                request.ServiceEstimateResolveDate,
                request.ExecturionTermId);
            throw;
        }
    }
}
```

### 8. Validare și Business Rules

```csharp
public class ValidatedApostilaComponentService : IApostilaComponentService
{
    private readonly IApostilaComponentService _innerService;
    private readonly ILogger<ValidatedApostilaComponentService> _logger;
    
    public async Task<ApostilaEstimateResolveDateResponse> CalculateEstimateResolveDate(
        ApostilaEstimateResolveDateRequest request)
    {
        // Validare input
        if (request.ServiceEstimateResolveDate < DateTime.Today)
        {
            _logger.LogWarning("Data serviciului nu poate fi în trecut");
            return new ApostilaEstimateResolveDateResponse
            {
                CanBeCalculated = false,
                EstimateResolveDate = null
            };
        }
        
        if (string.IsNullOrWhiteSpace(request.ExecturionTermId))
        {
            _logger.LogWarning("Termen de execuție lipsă");
            return new ApostilaEstimateResolveDateResponse
            {
                CanBeCalculated = false,
                EstimateResolveDate = null
            };
        }
        
        // Validare business rules
        if (request.ServiceEstimateResolveDate > DateTime.Today.AddYears(1))
        {
            _logger.LogWarning("Data serviciului prea îndepărtată în viitor");
            return new ApostilaEstimateResolveDateResponse
            {
                CanBeCalculated = false,
                EstimateResolveDate = null
            };
        }
        
        var result = await _innerService.CalculateEstimateResolveDate(request);
        
        // Validare rezultat
        if (result.CanBeCalculated && result.EstimateResolveDate.HasValue)
        {
            // Verifică că data apostilei este după data serviciului
            if (result.EstimateResolveDate.Value < request.ServiceEstimateResolveDate)
            {
                _logger.LogError(
                    "Data apostilei ({ApostilleDate}) nu poate fi înainte de data serviciului ({ServiceDate})",
                    result.EstimateResolveDate.Value,
                    request.ServiceEstimateResolveDate);
                
                return new ApostilaEstimateResolveDateResponse
                {
                    CanBeCalculated = false,
                    EstimateResolveDate = null
                };
            }
        }
        
        return result;
    }
}
```

### 9. Integrare cu notificări

```csharp
public class NotifyingApostilaService
{
    private readonly IApostilaComponentService _apostilaService;
    private readonly INotificationService _notificationService;
    private readonly IEmailService _emailService;
    
    public async Task NotifyApostilleReadyDate(
        string userEmail, 
        string requestNumber,
        DateTime serviceDate, 
        string executionTermId)
    {
        var response = await _apostilaService.CalculateEstimateResolveDate(
            new ApostilaEstimateResolveDateRequest
            {
                ServiceEstimateResolveDate = serviceDate,
                ExecturionTermId = executionTermId
            });
        
        if (response.CanBeCalculated && response.EstimateResolveDate.HasValue)
        {
            // Trimite email
            await _emailService.SendAsync(new EmailMessage
            {
                To = userEmail,
                Subject = $"Data estimată apostilare - Cerere {requestNumber}",
                Body = GenerateEmailBody(requestNumber, response.EstimateResolveDate.Value),
                IsHtml = true
            });
            
            // Programare notificare cu 1 zi înainte
            var reminderDate = response.EstimateResolveDate.Value.AddDays(-1);
            if (reminderDate > DateTime.Now)
            {
                await _notificationService.ScheduleNotification(new ScheduledNotification
                {
                    UserId = userEmail,
                    Title = "Reminder apostilare",
                    Message = $"Documentele apostilate pentru cererea {requestNumber} vor fi disponibile mâine",
                    ScheduledFor = reminderDate,
                    Type = NotificationType.Reminder
                });
            }
        }
    }
}
```

### 10. Testare

```csharp
[TestClass]
public class ApostilaComponentServiceTests
{
    private Mock<HttpMessageHandler> _httpHandler;
    private IApostilaComponentService _service;
    
    [TestInitialize]
    public void Setup()
    {
        _httpHandler = new Mock<HttpMessageHandler>();
        var httpClient = new HttpClient(_httpHandler.Object)
        {
            BaseAddress = new Uri("https://api.example.com/")
        };
        
        _service = new ApostilaComponentService(httpClient);
    }
    
    [TestMethod]
    public async Task CalculateEstimateResolveDate_ValidInput_ReturnsDate()
    {
        // Arrange
        var request = new ApostilaEstimateResolveDateRequest
        {
            ServiceEstimateResolveDate = DateTime.Today.AddDays(5),
            ExecturionTermId = "standard"
        };
        
        var expectedResponse = new ApostilaEstimateResolveDateResponse
        {
            CanBeCalculated = true,
            EstimateResolveDate = DateTime.Today.AddDays(10)
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _service.CalculateEstimateResolveDate(request);
        
        // Assert
        Assert.IsTrue(result.CanBeCalculated);
        Assert.IsNotNull(result.EstimateResolveDate);
        Assert.AreEqual(DateTime.Today.AddDays(10), result.EstimateResolveDate.Value);
    }
    
    [TestMethod]
    public async Task CalculateEstimateResolveDate_InvalidTerm_CannotCalculate()
    {
        // Arrange
        var request = new ApostilaEstimateResolveDateRequest
        {
            ServiceEstimateResolveDate = DateTime.Today.AddDays(5),
            ExecturionTermId = "invalid-term"
        };
        
        var expectedResponse = new ApostilaEstimateResolveDateResponse
        {
            CanBeCalculated = false,
            EstimateResolveDate = null
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _service.CalculateEstimateResolveDate(request);
        
        // Assert
        Assert.IsFalse(result.CanBeCalculated);
        Assert.IsNull(result.EstimateResolveDate);
    }
    
    [TestMethod]
    public async Task CalculateEstimateResolveDate_UrgentTerm_ReturnsSoonerDate()
    {
        // Arrange
        var serviceDate = DateTime.Today.AddDays(5);
        
        var standardRequest = new ApostilaEstimateResolveDateRequest
        {
            ServiceEstimateResolveDate = serviceDate,
            ExecturionTermId = "standard"
        };
        
        var urgentRequest = new ApostilaEstimateResolveDateRequest
        {
            ServiceEstimateResolveDate = serviceDate,
            ExecturionTermId = "urgent"
        };
        
        // Act
        var standardResult = await _service.CalculateEstimateResolveDate(standardRequest);
        var urgentResult = await _service.CalculateEstimateResolveDate(urgentRequest);
        
        // Assert
        Assert.IsTrue(standardResult.CanBeCalculated);
        Assert.IsTrue(urgentResult.CanBeCalculated);
        Assert.IsTrue(urgentResult.EstimateResolveDate < standardResult.EstimateResolveDate);
    }
}
```

### 11. Best Practices

1. **Validare date** - Verificați că data serviciului este validă și în viitor
2. **Cache rezultate** - Cache-uiți calculele pentru aceleași parametri
3. **Tratare erori** - Gestionați cazurile când calculul nu poate fi efectuat
4. **Monitorizare** - Urmăriți rata de succes a calculelor
5. **Notificări** - Informați utilizatorii despre datele estimate
6. **Audit** - Înregistrați toate calculele pentru trasabilitate

### 12. Integrare completă în workflow

```razor
@page "/workflow/apostilare"
@inject IApostilaComponentService ApostilaService
@inject IServiceRequestService ServiceRequestService

<FodWizard @ref="wizard">
    <FodWizardStep Title="Date Serviciu">
        <!-- Detalii serviciu principal -->
        <ServiceRequestForm @bind-Model="serviceRequest" />
    </FodWizardStep>
    
    <FodWizardStep Title="Apostilare">
        <FodApostila @bind-Model="apostilaModel"
                     Options="@apostilaOptions"
                     OnChange="OnApostilaChanged" />
        
        @if (apostilleEstimate != null && apostilleEstimate.CanBeCalculated)
        {
            <FodTimeline Class="mt-4">
                <FodTimelineItem>
                    <FodTimelineContent>
                        <FodText Typo="Typo.h6">Astăzi</FodText>
                        <FodText>Depunere cerere</FodText>
                    </FodTimelineContent>
                </FodTimelineItem>
                <FodTimelineItem>
                    <FodTimelineContent>
                        <FodText Typo="Typo.h6">
                            @serviceRequest.EstimatedCompletionDate.ToString("dd MMM")
                        </FodText>
                        <FodText>Finalizare serviciu principal</FodText>
                    </FodTimelineContent>
                </FodTimelineItem>
                <FodTimelineItem Color="FodColor.Primary">
                    <FodTimelineContent>
                        <FodText Typo="Typo.h6">
                            @apostilleEstimate.EstimateResolveDate?.ToString("dd MMM")
                        </FodText>
                        <FodText>Documente apostilate disponibile</FodText>
                    </FodTimelineContent>
                </FodTimelineItem>
            </FodTimeline>
        }
    </FodWizardStep>
    
    <FodWizardStep Title="Confirmare">
        <!-- Sumar final cu toate datele -->
        <ConfirmationSummary 
            ServiceRequest="@serviceRequest"
            ApostilaModel="@apostilaModel"
            EstimatedApostilleDate="@apostilleEstimate?.EstimateResolveDate" />
    </FodWizardStep>
</FodWizard>

@code {
    private FodWizard wizard;
    private ServiceRequestModel serviceRequest = new();
    private FodApostilaModel apostilaModel = new();
    private FodApostilaOptionsModel apostilaOptions;
    private ApostilaEstimateResolveDateResponse apostilleEstimate;
    
    private async Task OnApostilaChanged()
    {
        if (!string.IsNullOrEmpty(apostilaModel.FodApostilaExecutionTermId) && 
            serviceRequest.EstimatedCompletionDate.HasValue)
        {
            apostilleEstimate = await ApostilaService.CalculateEstimateResolveDate(
                new ApostilaEstimateResolveDateRequest
                {
                    ServiceEstimateResolveDate = serviceRequest.EstimatedCompletionDate.Value,
                    ExecturionTermId = apostilaModel.FodApostilaExecutionTermId
                });
        }
    }
}
```

### 13. Concluzie

`ApostilaComponentService` oferă funcționalitate esențială pentru calcularea termenelor de apostilare în sistemul FOD. Cu suport pentru diferite termene de execuție, validare robustă și integrare ușoară cu componentele UI, serviciul asigură că utilizatorii primesc estimări precise pentru disponibilitatea documentelor apostilate, facilitând planificarea și gestionarea cererilor internaționale.