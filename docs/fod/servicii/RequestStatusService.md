# RequestStatusService

## Documentație pentru serviciul RequestStatusService

### 1. Descriere Generală

`RequestStatusService` este un serviciu pentru verificarea și căutarea statusului cererilor depuse în sistemul FOD. Permite cetățenilor și funcționarilor să verifice starea cererilor folosind diferite criterii de căutare.

Caracteristici principale:
- Căutare cereri după multiple criterii
- Returnare listă de rezultate cu detalii complete
- Comunicare HTTP cu API-ul de verificare status
- Suport pentru căutare batch (mai multe cereri simultan)
- Integrare cu componenta FodRequestStatus

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs
builder.Services.AddHttpClient<IRequestStatusService, RequestStatusService>(client =>
{
    client.BaseAddress = new Uri(configuration["ApiSettings:BaseUrl"]);
});

// Pentru server-side implementation
builder.Services.AddScoped<IRequestStatusService, ServerRequestStatusService>();
```

### 3. Interfața IRequestStatusService

```csharp
public interface IRequestStatusService
{
    Task<IEnumerable<RequestStatusResponseModel>> Search(RequestStatusRequestModel model);
}
```

### 4. Metode Disponibile

| Metodă | Parametri | Return | Descriere |
|--------|-----------|--------|-----------|
| `Search` | `RequestStatusRequestModel model` | `Task<IEnumerable<RequestStatusResponseModel>>` | Caută cereri după criteriile specificate |

### 5. Modele de Date

#### RequestStatusRequestModel (parametri căutare)
```csharp
public class RequestStatusRequestModel
{
    public string RequestNumber { get; set; }
    public string IDNP { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string ServiceCode { get; set; }
}
```

#### RequestStatusResponseModel (rezultat)
```csharp
public class RequestStatusResponseModel
{
    public string RequestNumber { get; set; }
    public string ServiceName { get; set; }
    public string Status { get; set; }
    public string StatusDescription { get; set; }
    public DateTime SubmissionDate { get; set; }
    public DateTime? CompletionDate { get; set; }
    public string ApplicantName { get; set; }
    public decimal? Cost { get; set; }
    public bool IsPaid { get; set; }
    public List<string> Documents { get; set; }
    public string DeliveryMethod { get; set; }
    public string ProcessingOffice { get; set; }
}
```

### 6. Exemple de Utilizare

#### Verificare simplă status
```razor
@inject IRequestStatusService RequestStatusService

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Verificare status cerere
        </FodText>
        
        <FodTextField @bind-Value="searchModel.RequestNumber" 
                      Label="Număr cerere"
                      Placeholder="Ex: REQ-2024-001234" />
        
        <FodTextField @bind-Value="searchModel.IDNP" 
                      Label="IDNP solicitant"
                      Mask="9999999999999" />
        
        <FodButton OnClick="SearchRequests" 
                   Color="FodColor.Primary"
                   Class="mt-3">
            Verifică status
        </FodButton>
        
        @if (isSearching)
        {
            <FodLoadingLinear Indeterminate="true" Class="mt-3" />
        }
        
        @if (searchResults?.Any() == true)
        {
            <div class="mt-4">
                @foreach (var result in searchResults)
                {
                    <FodRequestStatusResponse Status="@result" />
                }
            </div>
        }
        else if (hasSearched && !isSearching)
        {
            <FodAlert Severity="Severity.Info" Class="mt-3">
                Nu au fost găsite cereri pentru criteriile specificate
            </FodAlert>
        }
    </FodCardContent>
</FodCard>

@code {
    private RequestStatusRequestModel searchModel = new();
    private IEnumerable<RequestStatusResponseModel> searchResults;
    private bool isSearching = false;
    private bool hasSearched = false;
    
    private async Task SearchRequests()
    {
        isSearching = true;
        hasSearched = true;
        
        try
        {
            searchResults = await RequestStatusService.Search(searchModel);
        }
        catch (Exception ex)
        {
            NotificationService.ShowError("Eroare la căutarea cererilor");
        }
        finally
        {
            isSearching = false;
        }
    }
}
```

#### Pagină dedicată verificare status
```razor
@page "/verificare-status"
@inject IRequestStatusService StatusService

<FodContainer>
    <FodText Typo="Typo.h4" GutterBottom="true">
        Verificare status cereri
    </FodText>
    
    <FodGrid Container="true" Spacing="3">
        <FodGrid Item="true" xs="12" md="4">
            <FodCard>
                <FodCardContent>
                    <FodText Typo="Typo.h6" GutterBottom="true">
                        Criterii de căutare
                    </FodText>
                    
                    <FodTextField @bind-Value="criteria.RequestNumber" 
                                  Label="Număr cerere"
                                  FullWidth="true"
                                  Class="mb-3" />
                    
                    <FodTextField @bind-Value="criteria.IDNP" 
                                  Label="IDNP"
                                  FullWidth="true"
                                  Class="mb-3" />
                    
                    <FodTextField @bind-Value="criteria.Email" 
                                  Label="Email"
                                  Type="email"
                                  FullWidth="true"
                                  Class="mb-3" />
                    
                    <FodDatePicker @bind-Date="criteria.FromDate" 
                                   Label="De la data"
                                   FullWidth="true"
                                   Class="mb-3" />
                    
                    <FodDatePicker @bind-Date="criteria.ToDate" 
                                   Label="Până la data"
                                   FullWidth="true"
                                   Class="mb-3" />
                    
                    <FodButton OnClick="Search" 
                               FullWidth="true"
                               Color="FodColor.Primary"
                               Disabled="@searching">
                        @if (searching)
                        {
                            <FodLoadingCircular Size="FodSize.Small" Class="me-2" />
                        }
                        Caută
                    </FodButton>
                </FodCardContent>
            </FodCard>
        </FodGrid>
        
        <FodGrid Item="true" xs="12" md="8">
            @if (results == null && !searching)
            {
                <FodAlert Severity="Severity.Info">
                    Introduceți criteriile de căutare și apăsați "Caută"
                </FodAlert>
            }
            else if (searching)
            {
                <FodCard>
                    <FodCardContent>
                        <FodSkeleton Type="SkeletonType.Text" />
                        <FodSkeleton Type="SkeletonType.Text" />
                        <FodSkeleton Type="SkeletonType.Rectangle" Height="100" />
                    </FodCardContent>
                </FodCard>
            }
            else if (!results.Any())
            {
                <FodAlert Severity="Severity.Warning">
                    Nu au fost găsite cereri pentru criteriile specificate
                </FodAlert>
            }
            else
            {
                <FodText Typo="Typo.subtitle1" GutterBottom="true">
                    Rezultate găsite: @results.Count()
                </FodText>
                
                @foreach (var request in results)
                {
                    <FodCard Class="mb-3">
                        <FodCardContent>
                            <StatusCard Request="@request" />
                        </FodCardContent>
                        <FodCardActions>
                            <FodButton OnClick="@(() => ViewDetails(request))">
                                Vezi detalii
                            </FodButton>
                            @if (request.Documents?.Any() == true)
                            {
                                <FodButton OnClick="@(() => DownloadDocuments(request))">
                                    Descarcă documente
                                </FodButton>
                            }
                        </FodCardActions>
                    </FodCard>
                }
            }
        </FodGrid>
    </FodGrid>
</FodContainer>

@code {
    private RequestStatusRequestModel criteria = new();
    private IEnumerable<RequestStatusResponseModel> results;
    private bool searching = false;
    
    private async Task Search()
    {
        searching = true;
        try
        {
            results = await StatusService.Search(criteria);
        }
        finally
        {
            searching = false;
        }
    }
    
    private void ViewDetails(RequestStatusResponseModel request)
    {
        NavigationManager.NavigateTo($"/cerere/{request.RequestNumber}");
    }
    
    private async Task DownloadDocuments(RequestStatusResponseModel request)
    {
        // Logică download documente
    }
}
```

#### Widget pentru dashboard
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Cererile mele recente
        </FodText>
        
        @if (myRequests == null)
        {
            <FodLoadingLinear Indeterminate="true" />
        }
        else if (!myRequests.Any())
        {
            <FodText Typo="Typo.body2" Color="FodColor.Secondary">
                Nu aveți cereri depuse
            </FodText>
        }
        else
        {
            <FodList Dense="true">
                @foreach (var req in myRequests.Take(5))
                {
                    <FodListItem>
                        <div class="d-flex justify-content-between align-items-center w-100">
                            <div>
                                <FodText Typo="Typo.body2">@req.ServiceName</FodText>
                                <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                                    @req.RequestNumber - @req.SubmissionDate.ToString("dd.MM.yyyy")
                                </FodText>
                            </div>
                            <FodChip Size="FodSize.Small" 
                                     Color="@GetStatusColor(req.Status)">
                                @req.Status
                            </FodChip>
                        </div>
                    </FodListItem>
                }
            </FodList>
            
            <FodButton Variant="FodVariant.Text" 
                       OnClick="ViewAllRequests"
                       Class="mt-2">
                Vezi toate cererile
            </FodButton>
        }
    </FodCardContent>
</FodCard>

@code {
    [Inject] private IRequestStatusService StatusService { get; set; }
    [Inject] private IAuthenticationService AuthService { get; set; }
    
    private IEnumerable<RequestStatusResponseModel> myRequests;
    
    protected override async Task OnInitializedAsync()
    {
        var user = await AuthService.GetCurrentUserAsync();
        if (user != null)
        {
            var searchModel = new RequestStatusRequestModel 
            { 
                IDNP = user.IDNP,
                FromDate = DateTime.Now.AddMonths(-3)
            };
            
            myRequests = await StatusService.Search(searchModel);
        }
    }
    
    private FodColor GetStatusColor(string status)
    {
        return status switch
        {
            "Finalizat" => FodColor.Success,
            "În procesare" => FodColor.Primary,
            "Respins" => FodColor.Error,
            _ => FodColor.Default
        };
    }
}
```

#### Tracking în timp real
```razor
@implements IDisposable
@inject IRequestStatusService StatusService

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Monitorizare cerere: @RequestNumber
        </FodText>
        
        @if (currentStatus != null)
        {
            <FodStepper ActiveStep="@GetActiveStep(currentStatus.Status)">
                <FodStep>
                    <StepLabel>Depusă</StepLabel>
                </FodStep>
                <FodStep>
                    <StepLabel>În verificare</StepLabel>
                </FodStep>
                <FodStep>
                    <StepLabel>În procesare</StepLabel>
                </FodStep>
                <FodStep>
                    <StepLabel>Finalizată</StepLabel>
                </FodStep>
            </FodStepper>
            
            <FodAlert Severity="@GetAlertSeverity(currentStatus.Status)" Class="mt-3">
                <FodAlertTitle>@currentStatus.Status</FodAlertTitle>
                @currentStatus.StatusDescription
            </FodAlert>
            
            <FodText Typo="Typo.caption" Class="mt-2">
                Ultima actualizare: @lastUpdate.ToString("HH:mm:ss")
            </FodText>
        }
    </FodCardContent>
</FodCard>

@code {
    [Parameter] public string RequestNumber { get; set; }
    
    private RequestStatusResponseModel currentStatus;
    private Timer refreshTimer;
    private DateTime lastUpdate;
    
    protected override async Task OnInitializedAsync()
    {
        await LoadStatus();
        
        // Refresh la fiecare 30 secunde
        refreshTimer = new Timer(async _ => await RefreshStatus(), null, 
            TimeSpan.FromSeconds(30), TimeSpan.FromSeconds(30));
    }
    
    private async Task LoadStatus()
    {
        var searchModel = new RequestStatusRequestModel 
        { 
            RequestNumber = RequestNumber 
        };
        
        var results = await StatusService.Search(searchModel);
        currentStatus = results.FirstOrDefault();
        lastUpdate = DateTime.Now;
    }
    
    private async Task RefreshStatus()
    {
        await InvokeAsync(async () =>
        {
            await LoadStatus();
            StateHasChanged();
        });
    }
    
    public void Dispose()
    {
        refreshTimer?.Dispose();
    }
}
```

### 7. Gestionarea Erorilor

```csharp
public class ResilientRequestStatusService : IRequestStatusService
{
    private readonly IRequestStatusService _innerService;
    private readonly ILogger<ResilientRequestStatusService> _logger;
    
    public async Task<IEnumerable<RequestStatusResponseModel>> Search(
        RequestStatusRequestModel model)
    {
        try
        {
            return await _innerService.Search(model);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Eroare conexiune serviciu status");
            
            // Returnare rezultate din cache dacă există
            if (TryGetFromCache(model, out var cached))
            {
                return cached;
            }
            
            throw new ServiceUnavailableException(
                "Serviciul de verificare status nu este disponibil momentan");
        }
        catch (TaskCanceledException)
        {
            throw new TimeoutException(
                "Verificarea statusului a durat prea mult");
        }
    }
}
```

### 8. Validare și Securitate

```csharp
public class ValidatedRequestStatusService : IRequestStatusService
{
    private readonly IRequestStatusService _innerService;
    
    public async Task<IEnumerable<RequestStatusResponseModel>> Search(
        RequestStatusRequestModel model)
    {
        // Validare parametri
        if (string.IsNullOrEmpty(model.RequestNumber) &&
            string.IsNullOrEmpty(model.IDNP) &&
            string.IsNullOrEmpty(model.Email))
        {
            throw new ValidationException(
                "Trebuie specificat cel puțin un criteriu de căutare");
        }
        
        // Validare IDNP
        if (!string.IsNullOrEmpty(model.IDNP) && 
            !IsValidIDNP(model.IDNP))
        {
            throw new ValidationException("IDNP invalid");
        }
        
        // Validare interval date
        if (model.FromDate.HasValue && model.ToDate.HasValue &&
            model.FromDate > model.ToDate)
        {
            throw new ValidationException(
                "Data de început nu poate fi după data de sfârșit");
        }
        
        return await _innerService.Search(model);
    }
}
```

### 9. Cache și Performanță

```csharp
public class CachedRequestStatusService : IRequestStatusService
{
    private readonly IRequestStatusService _innerService;
    private readonly IMemoryCache _cache;
    private readonly TimeSpan _cacheExpiration = TimeSpan.FromMinutes(5);
    
    public async Task<IEnumerable<RequestStatusResponseModel>> Search(
        RequestStatusRequestModel model)
    {
        var cacheKey = GenerateCacheKey(model);
        
        if (_cache.TryGetValue<IEnumerable<RequestStatusResponseModel>>(
            cacheKey, out var cached))
        {
            return cached;
        }
        
        var results = await _innerService.Search(model);
        
        if (results.Any())
        {
            _cache.Set(cacheKey, results, _cacheExpiration);
        }
        
        return results;
    }
    
    private string GenerateCacheKey(RequestStatusRequestModel model)
    {
        return $"RequestStatus_{model.RequestNumber}_{model.IDNP}_{model.Email}";
    }
}
```

### 10. Extensibilitate

```csharp
// Serviciu cu notificări
public class NotifyingRequestStatusService : IRequestStatusService
{
    private readonly IRequestStatusService _innerService;
    private readonly INotificationService _notificationService;
    
    public async Task<IEnumerable<RequestStatusResponseModel>> Search(
        RequestStatusRequestModel model)
    {
        var results = await _innerService.Search(model);
        
        // Notificare pentru cereri finalizate
        var completed = results.Where(r => r.Status == "Finalizat" && 
                                          r.CompletionDate?.Date == DateTime.Today);
        
        foreach (var request in completed)
        {
            await _notificationService.NotifyAsync(
                $"Cererea {request.RequestNumber} a fost finalizată!");
        }
        
        return results;
    }
}
```

### 11. Testare

```csharp
[TestClass]
public class RequestStatusServiceTests
{
    private Mock<HttpMessageHandler> _httpHandler;
    private IRequestStatusService _service;
    
    [TestInitialize]
    public void Setup()
    {
        _httpHandler = new Mock<HttpMessageHandler>();
        var httpClient = new HttpClient(_httpHandler.Object)
        {
            BaseAddress = new Uri("https://api.test.com")
        };
        
        _service = new RequestStatusService(httpClient);
    }
    
    [TestMethod]
    public async Task Search_WithValidNumber_ReturnsResults()
    {
        // Arrange
        var searchModel = new RequestStatusRequestModel
        {
            RequestNumber = "REQ-2024-001"
        };
        
        var expectedResults = new List<RequestStatusResponseModel>
        {
            new() 
            { 
                RequestNumber = "REQ-2024-001",
                Status = "În procesare"
            }
        };
        
        SetupHttpResponse(expectedResults);
        
        // Act
        var results = await _service.Search(searchModel);
        
        // Assert
        Assert.AreEqual(1, results.Count());
        Assert.AreEqual("În procesare", results.First().Status);
    }
}
```

### 12. Best Practices

1. **Validare input** - Validați toate criteriile de căutare
2. **Limite căutare** - Limitați rezultatele pentru performanță
3. **Cache inteligent** - Cache rezultate frecvente
4. **Securitate** - Verificați permisiuni utilizator
5. **Audit** - Logați toate căutările
6. **Rate limiting** - Preveniți abuzul serviciului

### 13. Monitorizare și Analytics

```csharp
public class MonitoredRequestStatusService : IRequestStatusService
{
    private readonly IRequestStatusService _innerService;
    private readonly IMetrics _metrics;
    private readonly ILogger _logger;
    
    public async Task<IEnumerable<RequestStatusResponseModel>> Search(
        RequestStatusRequestModel model)
    {
        using var activity = Activity.StartActivity("RequestStatus.Search");
        activity?.SetTag("search.criteria", GetSearchCriteria(model));
        
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            var results = await _innerService.Search(model);
            
            _metrics.Measure.Counter.Increment("request_status_search_success");
            _metrics.Measure.Histogram.Update("request_status_search_results", 
                results.Count());
            
            _logger.LogInformation(
                "Status search completed in {Duration}ms with {Count} results",
                stopwatch.ElapsedMilliseconds, results.Count());
            
            return results;
        }
        catch (Exception ex)
        {
            _metrics.Measure.Counter.Increment("request_status_search_error");
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            throw;
        }
        finally
        {
            _metrics.Measure.Timer.Time("request_status_search_duration",
                stopwatch.ElapsedMilliseconds);
        }
    }
}
```

### 14. Concluzie

`RequestStatusService` oferă o interfață simplă și eficientă pentru verificarea statusului cererilor în sistemul FOD. Cu suport pentru multiple criterii de căutare, cache și extensibilitate, serviciul asigură o experiență fluidă pentru cetățeni în monitorizarea cererilor lor.