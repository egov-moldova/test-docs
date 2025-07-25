# ServiceRequestStatusService

## Documentație pentru serviciul ServiceRequestStatusService

### 1. Descriere Generală

`ServiceRequestStatusService` este un serviciu specializat pentru verificarea statusului cererilor de servicii individuale. Spre deosebire de `RequestStatusService` care poate returna mai multe rezultate, acest serviciu este optimizat pentru verificarea unei singure cereri cu informații detaliate.

Caracteristici principale:
- Verificare status pentru o cerere specifică
- Returnare informații detaliate despre cerere
- Integrare cu componenta FodServiceRequestStatus
- Comunicare HTTP cu API-ul de verificare
- Suport pentru verificare prin multiple identificatori

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs
builder.Services.AddHttpClient<IServiceRequestStatusService, ServiceRequestStatusService>(client =>
{
    client.BaseAddress = new Uri(configuration["ApiSettings:BaseUrl"]);
    client.Timeout = TimeSpan.FromSeconds(30);
});

// Pentru implementare server-side cu acces direct la DB
builder.Services.AddScoped<IServiceRequestStatusService, ServerServiceRequestStatusService>();
```

### 3. Interfața IServiceRequestStatusService

```csharp
public interface IServiceRequestStatusService
{
    Task<ServiceRequestStatusResponseModel> Check(ServiceRequestStatusRequestModel request);
}
```

### 4. Metode Disponibile

| Metodă | Parametri | Return | Descriere |
|--------|-----------|--------|-----------|
| `Check` | `ServiceRequestStatusRequestModel request` | `Task<ServiceRequestStatusResponseModel>` | Verifică statusul unei cereri specifice |

### 5. Modele de Date

#### ServiceRequestStatusRequestModel (parametri verificare)
```csharp
public class ServiceRequestStatusRequestModel
{
    public string RequestNumber { get; set; }
    public string VerificationCode { get; set; }
    public string IDNP { get; set; }
    public string Email { get; set; }
}
```

#### ServiceRequestStatusResponseModel (rezultat)
```csharp
public class ServiceRequestStatusResponseModel
{
    // Informații generale
    public string RequestNumber { get; set; }
    public string ServiceName { get; set; }
    public string ServiceCode { get; set; }
    public DateTime SubmissionDate { get; set; }
    public DateTime? EstimatedCompletionDate { get; set; }
    public DateTime? ActualCompletionDate { get; set; }
    
    // Status
    public string Status { get; set; }
    public string StatusCode { get; set; }
    public string StatusDescription { get; set; }
    public int StatusPercentage { get; set; }
    
    // Detalii solicitant
    public string ApplicantName { get; set; }
    public string ApplicantType { get; set; }
    
    // Cost și plată
    public decimal TotalCost { get; set; }
    public bool IsPaid { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string PaymentMethod { get; set; }
    
    // Documente
    public List<DocumentInfo> SubmittedDocuments { get; set; }
    public List<DocumentInfo> ResultDocuments { get; set; }
    
    // Livrare
    public string DeliveryMethod { get; set; }
    public string DeliveryStatus { get; set; }
    public DeliveryAddress DeliveryAddress { get; set; }
    
    // Istoric
    public List<StatusHistoryItem> StatusHistory { get; set; }
    
    // Informații adiționale
    public string ProcessingOffice { get; set; }
    public string ResponsiblePerson { get; set; }
    public string Notes { get; set; }
    public bool CanBeCancelled { get; set; }
    public bool CanBeModified { get; set; }
}
```

### 6. Exemple de Utilizare

#### Verificare simplă cu număr cerere
```razor
@inject IServiceRequestStatusService StatusService

<FodServiceRequestStatus 
    RequestNumber="@requestNumber"
    VerificationCode="@verificationCode" />

<!-- Sau implementare manuală -->
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Verificare status cerere
        </FodText>
        
        <FodTextField @bind-Value="checkModel.RequestNumber" 
                      Label="Număr cerere"
                      Required="true" />
        
        <FodTextField @bind-Value="checkModel.VerificationCode" 
                      Label="Cod verificare"
                      Required="true" />
        
        <FodButton OnClick="CheckStatus" 
                   Color="FodColor.Primary"
                   Disabled="@isChecking">
            Verifică
        </FodButton>
        
        @if (statusResult != null)
        {
            <FodServiceRequestStatusResponse Status="@statusResult" />
        }
    </FodCardContent>
</FodCard>

@code {
    private ServiceRequestStatusRequestModel checkModel = new();
    private ServiceRequestStatusResponseModel statusResult;
    private bool isChecking;
    
    private async Task CheckStatus()
    {
        isChecking = true;
        try
        {
            statusResult = await StatusService.Check(checkModel);
        }
        catch (Exception ex)
        {
            NotificationService.ShowError("Eroare la verificarea statusului");
        }
        finally
        {
            isChecking = false;
        }
    }
}
```

#### Pagină dedicată pentru tracking
```razor
@page "/cerere/{RequestNumber}/{VerificationCode}"
@inject IServiceRequestStatusService StatusService

<FodContainer>
    @if (isLoading)
    {
        <FodLoadingLinear Indeterminate="true" />
    }
    else if (status == null)
    {
        <FodAlert Severity="Severity.Error">
            Cererea nu a fost găsită sau datele de verificare sunt incorecte
        </FodAlert>
    }
    else
    {
        <FodText Typo="Typo.h4" GutterBottom="true">
            Status cerere: @status.RequestNumber
        </FodText>
        
        <FodGrid Container="true" Spacing="3">
            <!-- Informații principale -->
            <FodGrid Item="true" xs="12" md="8">
                <FodCard>
                    <FodCardContent>
                        <!-- Progress vizual -->
                        <FodStepper ActiveStep="@GetProgressStep()" 
                                    Orientation="Orientation.Horizontal">
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
                        
                        <!-- Status curent -->
                        <div class="mt-4">
                            <FodAlert Severity="@GetStatusSeverity()">
                                <FodAlertTitle>@status.Status</FodAlertTitle>
                                @status.StatusDescription
                            </FodAlert>
                        </div>
                        
                        <!-- Detalii cerere -->
                        <FodList Class="mt-3">
                            <FodListItem>
                                <FodText>Serviciu:</FodText>
                                <FodText Class="ms-auto">@status.ServiceName</FodText>
                            </FodListItem>
                            <FodListItem>
                                <FodText>Data depunerii:</FodText>
                                <FodText Class="ms-auto">
                                    @status.SubmissionDate.ToString("dd.MM.yyyy HH:mm")
                                </FodText>
                            </FodListItem>
                            @if (status.EstimatedCompletionDate.HasValue)
                            {
                                <FodListItem>
                                    <FodText>Termen estimat:</FodText>
                                    <FodText Class="ms-auto">
                                        @status.EstimatedCompletionDate.Value.ToString("dd.MM.yyyy")
                                    </FodText>
                                </FodListItem>
                            }
                        </FodList>
                    </FodCardContent>
                </FodCard>
                
                <!-- Istoric status -->
                @if (status.StatusHistory?.Any() == true)
                {
                    <FodCard Class="mt-3">
                        <FodCardContent>
                            <FodText Typo="Typo.h6" GutterBottom="true">
                                Istoric modificări
                            </FodText>
                            
                            <FodTimeline>
                                @foreach (var history in status.StatusHistory.OrderByDescending(h => h.Date))
                                {
                                    <FodTimelineItem>
                                        <FodTimelineSeparator>
                                            <FodTimelineDot Color="@GetHistoryColor(history.Status)" />
                                            <FodTimelineConnector />
                                        </FodTimelineSeparator>
                                        <FodTimelineContent>
                                            <FodText Typo="Typo.caption">
                                                @history.Date.ToString("dd.MM.yyyy HH:mm")
                                            </FodText>
                                            <FodText Typo="Typo.body2">
                                                @history.Status
                                            </FodText>
                                            @if (!string.IsNullOrEmpty(history.Notes))
                                            {
                                                <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                                                    @history.Notes
                                                </FodText>
                                            }
                                        </FodTimelineContent>
                                    </FodTimelineItem>
                                }
                            </FodTimeline>
                        </FodCardContent>
                    </FodCard>
                }
            </FodGrid>
            
            <!-- Panou lateral -->
            <FodGrid Item="true" xs="12" md="4">
                <!-- Cost și plată -->
                <FodCard>
                    <FodCardContent>
                        <FodText Typo="Typo.h6" GutterBottom="true">
                            Informații plată
                        </FodText>
                        
                        <FodText Typo="Typo.h5" Color="FodColor.Primary">
                            @status.TotalCost MDL
                        </FodText>
                        
                        @if (status.IsPaid)
                        {
                            <FodChip Color="FodColor.Success" 
                                     Size="FodSize.Small"
                                     Icon="@FodIcons.Material.Filled.CheckCircle">
                                Achitat
                            </FodChip>
                            
                            @if (status.PaymentDate.HasValue)
                            {
                                <FodText Typo="Typo.caption" Class="mt-2">
                                    Plătit la: @status.PaymentDate.Value.ToString("dd.MM.yyyy")
                                </FodText>
                            }
                        }
                        else
                        {
                            <FodButton Color="FodColor.Primary" 
                                       Variant="FodVariant.Filled"
                                       FullWidth="true"
                                       Class="mt-2">
                                Achită acum
                            </FodButton>
                        }
                    </FodCardContent>
                </FodCard>
                
                <!-- Documente -->
                @if (status.ResultDocuments?.Any() == true)
                {
                    <FodCard Class="mt-3">
                        <FodCardContent>
                            <FodText Typo="Typo.h6" GutterBottom="true">
                                Documente rezultat
                            </FodText>
                            
                            <FodList Dense="true">
                                @foreach (var doc in status.ResultDocuments)
                                {
                                    <FodListItem>
                                        <FodIcon Icon="@FodIcons.Material.Filled.Description" 
                                                 Size="FodSize.Small"
                                                 Class="me-2" />
                                        <FodLink Href="@doc.DownloadUrl">
                                            @doc.Name
                                        </FodLink>
                                    </FodListItem>
                                }
                            </FodList>
                        </FodCardContent>
                    </FodCard>
                }
                
                <!-- Acțiuni -->
                <FodCard Class="mt-3">
                    <FodCardContent>
                        <FodText Typo="Typo.h6" GutterBottom="true">
                            Acțiuni disponibile
                        </FodText>
                        
                        <div class="d-grid gap-2">
                            <FodButton Variant="FodVariant.Outlined"
                                       OnClick="PrintStatus">
                                <FodIcon Icon="@FodIcons.Material.Filled.Print" 
                                         Class="me-2" />
                                Printează status
                            </FodButton>
                            
                            @if (status.CanBeCancelled)
                            {
                                <FodButton Color="FodColor.Error"
                                           Variant="FodVariant.Outlined"
                                           OnClick="CancelRequest">
                                    Anulează cererea
                                </FodButton>
                            }
                            
                            <FodButton Variant="FodVariant.Text"
                                       OnClick="ContactSupport">
                                Contactează suport
                            </FodButton>
                        </div>
                    </FodCardContent>
                </FodCard>
            </FodGrid>
        </FodGrid>
    }
</FodContainer>

@code {
    [Parameter] public string RequestNumber { get; set; }
    [Parameter] public string VerificationCode { get; set; }
    
    private ServiceRequestStatusResponseModel status;
    private bool isLoading = true;
    
    protected override async Task OnInitializedAsync()
    {
        await LoadStatus();
    }
    
    private async Task LoadStatus()
    {
        var request = new ServiceRequestStatusRequestModel
        {
            RequestNumber = RequestNumber,
            VerificationCode = VerificationCode
        };
        
        try
        {
            status = await StatusService.Check(request);
        }
        catch
        {
            // Eroare gestionată în UI
        }
        finally
        {
            isLoading = false;
        }
    }
}
```

#### Widget pentru monitorizare multiplă
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Monitorizare cereri active
        </FodText>
        
        @foreach (var request in activeRequests)
        {
            <RequestStatusWidget Request="@request" />
        }
    </FodCardContent>
</FodCard>

@code {
    public class RequestStatusWidget : ComponentBase
    {
        [Parameter] public TrackedRequest Request { get; set; }
        [Inject] private IServiceRequestStatusService StatusService { get; set; }
        
        private ServiceRequestStatusResponseModel currentStatus;
        private bool isLoading = true;
        
        protected override async Task OnInitializedAsync()
        {
            var checkRequest = new ServiceRequestStatusRequestModel
            {
                RequestNumber = Request.Number,
                VerificationCode = Request.Code
            };
            
            try
            {
                currentStatus = await StatusService.Check(checkRequest);
            }
            finally
            {
                isLoading = false;
            }
        }
        
        protected override void BuildRenderTree(RenderTreeBuilder builder)
        {
            if (isLoading)
            {
                builder.OpenComponent<FodSkeleton>(0);
                builder.AddAttribute(1, "Type", SkeletonType.Text);
                builder.CloseComponent();
                return;
            }
            
            builder.OpenElement(0, "div");
            builder.AddAttribute(1, "class", "status-widget mb-3 p-3 border rounded");
            
            // Header
            builder.OpenElement(2, "div");
            builder.AddAttribute(3, "class", "d-flex justify-content-between align-items-center");
            
            builder.OpenComponent<FodText>(4);
            builder.AddAttribute(5, "Typo", Typo.subtitle2);
            builder.AddAttribute(6, "ChildContent", (RenderFragment)((b) => 
                b.AddContent(7, currentStatus?.ServiceName)));
            builder.CloseComponent();
            
            builder.OpenComponent<FodChip>(8);
            builder.AddAttribute(9, "Size", FodSize.Small);
            builder.AddAttribute(10, "Color", GetStatusColor());
            builder.AddAttribute(11, "ChildContent", (RenderFragment)((b) => 
                b.AddContent(12, currentStatus?.Status)));
            builder.CloseComponent();
            
            builder.CloseElement(); // div
            
            // Progress bar
            builder.OpenComponent<FodLoadingLinear>(13);
            builder.AddAttribute(14, "Value", currentStatus?.StatusPercentage ?? 0);
            builder.AddAttribute(15, "Color", GetStatusColor());
            builder.AddAttribute(16, "Class", "mt-2");
            builder.CloseComponent();
            
            builder.CloseElement(); // div
        }
        
        private FodColor GetStatusColor()
        {
            return currentStatus?.StatusCode switch
            {
                "COMPLETED" => FodColor.Success,
                "PROCESSING" => FodColor.Primary,
                "REJECTED" => FodColor.Error,
                _ => FodColor.Default
            };
        }
    }
}
```

#### Notificări push pentru schimbări status
```razor
@implements IDisposable
@inject IServiceRequestStatusService StatusService
@inject INotificationService NotificationService

<NotificationEnabledStatusChecker 
    RequestNumber="@RequestNumber"
    VerificationCode="@VerificationCode"
    OnStatusChanged="HandleStatusChange" />

@code {
    public class NotificationEnabledStatusChecker : ComponentBase, IDisposable
    {
        [Parameter] public string RequestNumber { get; set; }
        [Parameter] public string VerificationCode { get; set; }
        [Parameter] public EventCallback<ServiceRequestStatusResponseModel> OnStatusChanged { get; set; }
        
        [Inject] private IServiceRequestStatusService StatusService { get; set; }
        
        private Timer checkTimer;
        private string lastStatusCode;
        
        protected override async Task OnInitializedAsync()
        {
            // Check inițial
            await CheckStatus();
            
            // Setup polling la fiecare minut
            checkTimer = new Timer(async _ => await CheckStatusWithNotification(), 
                null, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(1));
        }
        
        private async Task CheckStatus()
        {
            var request = new ServiceRequestStatusRequestModel
            {
                RequestNumber = RequestNumber,
                VerificationCode = VerificationCode
            };
            
            var status = await StatusService.Check(request);
            lastStatusCode = status?.StatusCode;
        }
        
        private async Task CheckStatusWithNotification()
        {
            var request = new ServiceRequestStatusRequestModel
            {
                RequestNumber = RequestNumber,
                VerificationCode = VerificationCode
            };
            
            var status = await StatusService.Check(request);
            
            if (status?.StatusCode != lastStatusCode)
            {
                // Status schimbat
                await InvokeAsync(async () =>
                {
                    await OnStatusChanged.InvokeAsync(status);
                    
                    // Notificare
                    await NotificationService.ShowAsync(new NotificationOptions
                    {
                        Title = "Status actualizat",
                        Body = $"Cererea {RequestNumber} are un nou status: {status.Status}",
                        Icon = "/icon-192.png",
                        RequireInteraction = true
                    });
                });
                
                lastStatusCode = status.StatusCode;
            }
        }
        
        public void Dispose()
        {
            checkTimer?.Dispose();
        }
    }
}
```

### 7. Gestionarea Erorilor

```csharp
public class ErrorHandlingServiceRequestStatusService : IServiceRequestStatusService
{
    private readonly IServiceRequestStatusService _innerService;
    private readonly ILogger<ErrorHandlingServiceRequestStatusService> _logger;
    
    public async Task<ServiceRequestStatusResponseModel> Check(
        ServiceRequestStatusRequestModel request)
    {
        try
        {
            return await _innerService.Check(request);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            _logger.LogWarning("Cererea {RequestNumber} nu a fost găsită", 
                request.RequestNumber);
            return null;
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.Unauthorized)
        {
            throw new UnauthorizedException(
                "Date de verificare incorecte pentru cererea specificată");
        }
        catch (TaskCanceledException)
        {
            throw new TimeoutException(
                "Verificarea statusului a durat prea mult. Încercați din nou.");
        }
    }
}
```

### 8. Cache și Optimizare

```csharp
public class CachedServiceRequestStatusService : IServiceRequestStatusService
{
    private readonly IServiceRequestStatusService _innerService;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachedServiceRequestStatusService> _logger;
    
    public async Task<ServiceRequestStatusResponseModel> Check(
        ServiceRequestStatusRequestModel request)
    {
        var cacheKey = $"ServiceStatus_{request.RequestNumber}_{request.VerificationCode}";
        
        // Cache mai scurt pentru statusuri în procesare
        var cacheOptions = new MemoryCacheEntryOptions();
        
        if (_cache.TryGetValue<ServiceRequestStatusResponseModel>(cacheKey, out var cached))
        {
            // Verificare dacă trebuie reîmprospătat
            if (ShouldRefresh(cached))
            {
                _cache.Remove(cacheKey);
            }
            else
            {
                _logger.LogDebug("Returnare status din cache pentru {RequestNumber}", 
                    request.RequestNumber);
                return cached;
            }
        }
        
        var result = await _innerService.Check(request);
        
        if (result != null)
        {
            // Cache timp diferit bazat pe status
            var cacheTime = result.StatusCode switch
            {
                "COMPLETED" => TimeSpan.FromHours(24),
                "REJECTED" => TimeSpan.FromHours(24),
                "PROCESSING" => TimeSpan.FromMinutes(5),
                _ => TimeSpan.FromMinutes(15)
            };
            
            _cache.Set(cacheKey, result, cacheTime);
        }
        
        return result;
    }
    
    private bool ShouldRefresh(ServiceRequestStatusResponseModel cached)
    {
        // Reîmprospătare pentru statusuri active
        return cached.StatusCode is "PROCESSING" or "PENDING" or "VERIFICATION";
    }
}
```

### 9. Audit și Logging

```csharp
public class AuditedServiceRequestStatusService : IServiceRequestStatusService
{
    private readonly IServiceRequestStatusService _innerService;
    private readonly IAuditService _auditService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    
    public async Task<ServiceRequestStatusResponseModel> Check(
        ServiceRequestStatusRequestModel request)
    {
        var userId = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        var ipAddress = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString();
        
        // Audit request
        await _auditService.LogAsync(new AuditEntry
        {
            Action = "ServiceRequestStatusCheck",
            UserId = userId,
            IpAddress = ipAddress,
            Details = new
            {
                RequestNumber = request.RequestNumber,
                HasVerificationCode = !string.IsNullOrEmpty(request.VerificationCode),
                Timestamp = DateTime.UtcNow
            }
        });
        
        try
        {
            var result = await _innerService.Check(request);
            
            // Audit result
            await _auditService.LogAsync(new AuditEntry
            {
                Action = "ServiceRequestStatusCheckResult",
                UserId = userId,
                Details = new
                {
                    RequestNumber = request.RequestNumber,
                    Found = result != null,
                    Status = result?.StatusCode
                }
            });
            
            return result;
        }
        catch (Exception ex)
        {
            // Audit error
            await _auditService.LogAsync(new AuditEntry
            {
                Action = "ServiceRequestStatusCheckError",
                UserId = userId,
                Details = new
                {
                    RequestNumber = request.RequestNumber,
                    Error = ex.Message
                }
            });
            
            throw;
        }
    }
}
```

### 10. Validare și Securitate

```csharp
public class SecureServiceRequestStatusService : IServiceRequestStatusService
{
    private readonly IServiceRequestStatusService _innerService;
    private readonly IValidator<ServiceRequestStatusRequestModel> _validator;
    private readonly IRateLimiter _rateLimiter;
    
    public async Task<ServiceRequestStatusResponseModel> Check(
        ServiceRequestStatusRequestModel request)
    {
        // Validare
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }
        
        // Rate limiting
        var rateLimitKey = $"StatusCheck_{request.RequestNumber}";
        if (!await _rateLimiter.AllowAsync(rateLimitKey, 10, TimeSpan.FromMinute))
        {
            throw new RateLimitExceededException(
                "Prea multe verificări pentru această cerere. Încercați mai târziu.");
        }
        
        // Sanitizare input
        request.RequestNumber = request.RequestNumber?.Trim().ToUpperInvariant();
        request.VerificationCode = request.VerificationCode?.Trim();
        
        return await _innerService.Check(request);
    }
}

public class ServiceRequestStatusRequestValidator 
    : AbstractValidator<ServiceRequestStatusRequestModel>
{
    public ServiceRequestStatusRequestValidator()
    {
        RuleFor(x => x.RequestNumber)
            .NotEmpty().WithMessage("Numărul cererii este obligatoriu")
            .Matches(@"^[A-Z]{3}-\d{4}-\d{6}$")
            .WithMessage("Format număr cerere invalid");
            
        RuleFor(x => x.VerificationCode)
            .NotEmpty().When(x => string.IsNullOrEmpty(x.IDNP))
            .WithMessage("Cod verificare sau IDNP obligatoriu");
            
        RuleFor(x => x.IDNP)
            .Matches(@"^\d{13}$").When(x => !string.IsNullOrEmpty(x.IDNP))
            .WithMessage("IDNP invalid");
    }
}
```

### 11. Testare

```csharp
[TestClass]
public class ServiceRequestStatusServiceTests
{
    private Mock<HttpMessageHandler> _httpHandler;
    private IServiceRequestStatusService _service;
    
    [TestInitialize]
    public void Setup()
    {
        _httpHandler = new Mock<HttpMessageHandler>();
        var httpClient = new HttpClient(_httpHandler.Object)
        {
            BaseAddress = new Uri("https://api.test.com")
        };
        
        _service = new ServiceRequestStatusService(httpClient);
    }
    
    [TestMethod]
    public async Task Check_ValidRequest_ReturnsStatus()
    {
        // Arrange
        var request = new ServiceRequestStatusRequestModel
        {
            RequestNumber = "REQ-2024-123456",
            VerificationCode = "ABC123"
        };
        
        var expectedResponse = new ServiceRequestStatusResponseModel
        {
            RequestNumber = "REQ-2024-123456",
            Status = "În procesare",
            StatusCode = "PROCESSING",
            StatusPercentage = 50
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _service.Check(request);
        
        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual("PROCESSING", result.StatusCode);
        Assert.AreEqual(50, result.StatusPercentage);
    }
    
    [TestMethod]
    public async Task Check_InvalidRequest_ReturnsNull()
    {
        // Arrange
        var request = new ServiceRequestStatusRequestModel
        {
            RequestNumber = "INVALID",
            VerificationCode = "WRONG"
        };
        
        SetupHttpResponse(HttpStatusCode.NotFound);
        
        // Act
        var result = await _service.Check(request);
        
        // Assert
        Assert.IsNull(result);
    }
}
```

### 12. Integrare cu SignalR pentru actualizări real-time

```csharp
public class RealTimeServiceRequestStatusService : IServiceRequestStatusService
{
    private readonly IServiceRequestStatusService _innerService;
    private readonly IHubContext<StatusHub> _hubContext;
    
    public async Task<ServiceRequestStatusResponseModel> Check(
        ServiceRequestStatusRequestModel request)
    {
        var result = await _innerService.Check(request);
        
        if (result != null)
        {
            // Subscribe pentru actualizări
            await _hubContext.Groups.AddToGroupAsync(
                Context.ConnectionId, 
                $"request-{request.RequestNumber}");
            
            // Trimite status inițial
            await _hubContext.Clients.Caller.SendAsync(
                "StatusUpdate", result);
        }
        
        return result;
    }
}

public class StatusHub : Hub
{
    public async Task SubscribeToRequest(string requestNumber, string verificationCode)
    {
        // Validare
        if (IsValidSubscription(requestNumber, verificationCode))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"request-{requestNumber}");
        }
    }
    
    public async Task UnsubscribeFromRequest(string requestNumber)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"request-{requestNumber}");
    }
}
```

### 13. Best Practices

1. **Validare strictă** - Validați format număr cerere și cod verificare
2. **Rate limiting** - Preveniți abuzul prin verificări repetate
3. **Cache inteligent** - Cache diferențiat pe status
4. **Audit complet** - Logați toate verificările pentru securitate
5. **Erori clare** - Mesaje specifice pentru diferite scenarii
6. **Real-time updates** - Considerați SignalR pentru actualizări live

### 14. Monitorizare și Metrici

```csharp
public class MonitoredServiceRequestStatusService : IServiceRequestStatusService
{
    private readonly IServiceRequestStatusService _innerService;
    private readonly IMetrics _metrics;
    
    public async Task<ServiceRequestStatusResponseModel> Check(
        ServiceRequestStatusRequestModel request)
    {
        using var activity = Activity.StartActivity("ServiceRequestStatus.Check");
        activity?.SetTag("request.number", request.RequestNumber);
        
        var timer = Stopwatch.StartNew();
        
        try
        {
            var result = await _innerService.Check(request);
            
            _metrics.Measure.Counter.Increment("service_request_status_check", 
                new MetricTags("found", result != null ? "true" : "false"));
            
            if (result != null)
            {
                _metrics.Measure.Counter.Increment("service_request_by_status",
                    new MetricTags("status", result.StatusCode));
            }
            
            return result;
        }
        catch (Exception ex)
        {
            _metrics.Measure.Counter.Increment("service_request_status_error",
                new MetricTags("error_type", ex.GetType().Name));
            throw;
        }
        finally
        {
            _metrics.Measure.Timer.Time("service_request_status_duration",
                timer.ElapsedMilliseconds);
        }
    }
}
```

### 15. Concluzie

`ServiceRequestStatusService` oferă o interfață specializată pentru verificarea detaliată a statusului cererilor individuale. Cu suport pentru cache inteligent, validare strictă și posibilități de extindere pentru notificări real-time, serviciul asigură o experiență optimă pentru monitorizarea cererilor în sistemul FOD.