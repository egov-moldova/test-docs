# VerifyDocumentService

## Documentație pentru serviciul VerifyDocumentService

### 1. Descriere Generală

`VerifyDocumentService` este un serviciu pentru verificarea autenticității și validității documentelor emise prin sistemul FOD. Permite verificarea documentelor folosind numărul documentului și opțional un identificator MDocsShareId pentru acces la versiunea digitală.

Caracteristici principale:
- Verificare document după număr
- Validare suplimentară cu MDocsShareId
- Obținere detalii document (nume, dată emitere)
- Link de descărcare pentru documente digitale
- Status document (Valid, Invalid, Procesat)
- Suport pentru integrare MDocs

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs

// Pentru aplicații Blazor WebAssembly
builder.Services.AddFodComponents(configuration);

// Pentru aplicații Blazor Server
builder.Services.AddFodComponentsServer(configuration, connectionString);

// Sau înregistrare manuală pentru client
builder.Services.AddScoped<IVerifyDocumentService, VerifyDocumentService>();
builder.Services.AddHttpClient<IVerifyDocumentService, VerifyDocumentService>(client =>
{
    client.BaseAddress = new Uri(configuration["ApiSettings:BaseUrl"]);
});

// Pentru server-side cu acces direct la bază de date
builder.Services.AddTransient<IVerifyDocumentService, ServerVerifyDocumentService>();
```

### 3. Interfața IVerifyDocumentService

```csharp
public interface IVerifyDocumentService
{
    Task<VerifyDocumentResponseModel> Verify(VerifyDocumentModel model);
}
```

### 4. Metode Disponibile

| Metodă | Parametri | Return | Descriere |
|--------|-----------|--------|-----------|
| `Verify` | `VerifyDocumentModel model` | `Task<VerifyDocumentResponseModel>` | Verifică un document |

### 5. Modele de Date

#### VerifyDocumentModel (Request)
```csharp
public class VerifyDocumentModel
{
    [Required]
    public string DocumentNumber { get; set; }
    
    // Opțional - pentru validare suplimentară și acces la descărcare
    public Guid? MDocsShareId { get; set; }
}
```

#### VerifyDocumentResponseModel (Response)
```csharp
public class VerifyDocumentResponseModel
{
    public bool Found { get; set; }
    public string DocumentNumber { get; set; }
    public string DocumentName { get; set; }
    public DateTime? DocumentIssueDate { get; set; }
    public string MDocsShareFullLink { get; set; }
    public ResponseDataStatusEnum? ResponseDataStatus { get; set; }
}

public enum ResponseDataStatusEnum
{
    Valid = 0,
    Invalid = 1,
    Processed = 2
}
```

### 6. Exemple de Utilizare

#### Verificare simplă document
```razor
@page "/verifica-document"
@inject IVerifyDocumentService VerifyDocumentService

<FodContainer>
    <FodText Typo="Typo.h4" GutterBottom="true">
        Verificare Document
    </FodText>
    
    <FodCard>
        <FodCardContent>
            <FodGrid Container="true" Spacing="3">
                <FodGrid Item="true" xs="12" md="8">
                    <FodInput @bind-Value="documentNumber" 
                              Label="Număr document"
                              Placeholder="Introduceți numărul documentului"
                              Required="true"
                              HelperText="Numărul documentului așa cum apare pe document" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="4">
                    <FodButton OnClick="VerifyDocument" 
                               Color="FodColor.Primary"
                               FullWidth="true"
                               Disabled="@(isLoading || string.IsNullOrEmpty(documentNumber))">
                        @if (isLoading)
                        {
                            <FodLoadingButton />
                        }
                        else
                        {
                            <text>Verifică</text>
                        }
                    </FodButton>
                </FodGrid>
            </FodGrid>
            
            @if (verificationResult != null)
            {
                <div class="mt-4">
                    @if (verificationResult.Found)
                    {
                        <FodAlert Severity="FodSeverity.Success">
                            <FodText>
                                <strong>Document găsit și valid!</strong>
                            </FodText>
                            <FodList Dense="true" Class="mt-2">
                                <FodListItem>
                                    <FodText>Număr: @verificationResult.DocumentNumber</FodText>
                                </FodListItem>
                                <FodListItem>
                                    <FodText>Tip: @verificationResult.DocumentName</FodText>
                                </FodListItem>
                                <FodListItem>
                                    <FodText>Data emiterii: @verificationResult.DocumentIssueDate?.ToString("dd.MM.yyyy")</FodText>
                                </FodListItem>
                                @if (verificationResult.ResponseDataStatus.HasValue)
                                {
                                    <FodListItem>
                                        <FodText>Status: @GetStatusText(verificationResult.ResponseDataStatus.Value)</FodText>
                                    </FodListItem>
                                }
                            </FodList>
                        </FodAlert>
                    }
                    else
                    {
                        <FodAlert Severity="FodSeverity.Error">
                            Documentul cu numărul <strong>@documentNumber</strong> nu a fost găsit în sistem.
                        </FodAlert>
                    }
                </div>
            }
        </FodCardContent>
    </FodCard>
</FodContainer>

@code {
    private string documentNumber;
    private bool isLoading;
    private VerifyDocumentResponseModel verificationResult;
    
    private async Task VerifyDocument()
    {
        if (string.IsNullOrWhiteSpace(documentNumber))
            return;
        
        isLoading = true;
        verificationResult = null;
        
        try
        {
            var model = new VerifyDocumentModel
            {
                DocumentNumber = documentNumber.Trim()
            };
            
            verificationResult = await VerifyDocumentService.Verify(model);
        }
        finally
        {
            isLoading = false;
        }
    }
    
    private string GetStatusText(ResponseDataStatusEnum status)
    {
        return status switch
        {
            ResponseDataStatusEnum.Valid => "Valid",
            ResponseDataStatusEnum.Invalid => "Invalid",
            ResponseDataStatusEnum.Processed => "Procesat",
            _ => "Necunoscut"
        };
    }
}
```

#### Verificare cu descărcare MDocs
```razor
@page "/verifica-document/{DocumentNumber}/{MDocsShareId:guid}"
@inject IVerifyDocumentService VerifyDocumentService
@inject NavigationManager Navigation

<FodContainer>
    <FodCard>
        <FodCardContent>
            @if (isLoading)
            {
                <FodLoadingLinear Indeterminate="true" />
                <FodText Align="FodAlign.Center" Class="mt-3">
                    Se verifică documentul...
                </FodText>
            }
            else if (verificationResult != null)
            {
                @if (verificationResult.Found && !string.IsNullOrEmpty(verificationResult.MDocsShareFullLink))
                {
                    <FodAlert Severity="FodSeverity.Success">
                        <FodAlertTitle>Document verificat cu succes!</FodAlertTitle>
                        <div class="mt-3">
                            <FodText>Document: @verificationResult.DocumentName</FodText>
                            <FodText>Număr: @verificationResult.DocumentNumber</FodText>
                            <FodText>Data: @verificationResult.DocumentIssueDate?.ToString("dd.MM.yyyy")</FodText>
                        </div>
                    </FodAlert>
                    
                    <div class="mt-4 text-center">
                        <FodButton Color="FodColor.Primary" 
                                   Size="FodSize.Large"
                                   StartIcon="@FodIcons.Material.Filled.Download"
                                   OnClick="DownloadDocument">
                            Descarcă Document
                        </FodButton>
                    </div>
                }
                else if (verificationResult.Found)
                {
                    <FodAlert Severity="FodSeverity.Warning">
                        Documentul a fost găsit dar link-ul de descărcare nu este valid.
                    </FodAlert>
                }
                else
                {
                    <FodAlert Severity="FodSeverity.Error">
                        Documentul nu a fost găsit sau link-ul de verificare este invalid.
                    </FodAlert>
                }
            }
        </FodCardContent>
    </FodCard>
</FodContainer>

@code {
    [Parameter] public string DocumentNumber { get; set; }
    [Parameter] public Guid MDocsShareId { get; set; }
    
    private bool isLoading = true;
    private VerifyDocumentResponseModel verificationResult;
    
    protected override async Task OnInitializedAsync()
    {
        await VerifyDocumentWithMDocs();
    }
    
    private async Task VerifyDocumentWithMDocs()
    {
        try
        {
            var model = new VerifyDocumentModel
            {
                DocumentNumber = DocumentNumber,
                MDocsShareId = MDocsShareId
            };
            
            verificationResult = await VerifyDocumentService.Verify(model);
        }
        finally
        {
            isLoading = false;
        }
    }
    
    private void DownloadDocument()
    {
        if (!string.IsNullOrEmpty(verificationResult?.MDocsShareFullLink))
        {
            Navigation.NavigateTo(verificationResult.MDocsShareFullLink, true);
        }
    }
}
```

#### Integrare cu componenta FodVerifyDocument
```razor
@page "/servicii/verifica"

<FodContainer>
    <FodText Typo="Typo.h3" GutterBottom="true">
        Verificare Documente Emise
    </FodText>
    
    <FodText Typo="Typo.body1" GutterBottom="true">
        Verificați autenticitatea documentelor emise prin introducerea numărului documentului.
    </FodText>
    
    <!-- Folosește componenta predefinită -->
    <FodVerifyDocument 
        NotFoundMessage="Documentul solicitat nu a fost găsit în baza de date."
        DownloadMessage="Click pentru a descărca documentul"
        ShowHelperText="true" />
</FodContainer>
```

#### Implementare cu cache
```csharp
public class CachedVerifyDocumentService : IVerifyDocumentService
{
    private readonly IVerifyDocumentService _innerService;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachedVerifyDocumentService> _logger;
    
    public CachedVerifyDocumentService(
        IVerifyDocumentService innerService,
        IMemoryCache cache,
        ILogger<CachedVerifyDocumentService> logger)
    {
        _innerService = innerService;
        _cache = cache;
        _logger = logger;
    }
    
    public async Task<VerifyDocumentResponseModel> Verify(VerifyDocumentModel model)
    {
        var cacheKey = $"doc_{model.DocumentNumber}_{model.MDocsShareId}";
        
        if (_cache.TryGetValue<VerifyDocumentResponseModel>(cacheKey, out var cached))
        {
            _logger.LogDebug($"Returnare din cache pentru document {model.DocumentNumber}");
            return cached;
        }
        
        var result = await _innerService.Verify(model);
        
        // Cache doar documentele găsite pentru 5 minute
        if (result.Found)
        {
            _cache.Set(cacheKey, result, TimeSpan.FromMinutes(5));
        }
        
        return result;
    }
}

// Înregistrare în DI
services.AddScoped<IVerifyDocumentService>(provider =>
{
    var innerService = new VerifyDocumentService(
        provider.GetRequiredService<HttpClient>());
    
    return new CachedVerifyDocumentService(
        innerService,
        provider.GetRequiredService<IMemoryCache>(),
        provider.GetRequiredService<ILogger<CachedVerifyDocumentService>>());
});
```

### 7. Integrare cu QR Code

```razor
@inject IVerifyDocumentService VerifyDocumentService
@inject IJSRuntime JSRuntime

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Scanați QR Code pentru verificare
        </FodText>
        
        <div id="qr-reader" style="width: 100%; max-width: 500px;"></div>
        
        @if (scannedResult != null)
        {
            <FodVerifyDocumentResponse Model="@scannedResult" />
        }
    </FodCardContent>
</FodCard>

@code {
    private VerifyDocumentResponseModel scannedResult;
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await InitializeQRScanner();
        }
    }
    
    private async Task InitializeQRScanner()
    {
        // Inițializare QR scanner
        await JSRuntime.InvokeVoidAsync("initQRScanner", 
            DotNetObjectReference.Create(this));
    }
    
    [JSInvokable]
    public async Task OnQRCodeScanned(string qrContent)
    {
        // Parse QR content - format: DOC:number:mdocsId
        var parts = qrContent.Split(':');
        if (parts.Length >= 2 && parts[0] == "DOC")
        {
            var model = new VerifyDocumentModel
            {
                DocumentNumber = parts[1],
                MDocsShareId = parts.Length > 2 ? Guid.Parse(parts[2]) : null
            };
            
            scannedResult = await VerifyDocumentService.Verify(model);
            StateHasChanged();
        }
    }
}
```

### 8. Verificare în lot (batch)

```razor
@inject IVerifyDocumentService VerifyDocumentService

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Verificare multiplă documente
        </FodText>
        
        <FodTextArea @bind-Value="documentNumbers" 
                     Label="Numere documente (unul per linie)"
                     Rows="5" />
        
        <FodButton OnClick="VerifyBatch" 
                   Color="FodColor.Primary"
                   Class="mt-3">
            Verifică toate
        </FodButton>
        
        @if (batchResults.Any())
        {
            <FodDataTable Items="@batchResults" Class="mt-4">
                <HeaderContent>
                    <FodTHeadRow>
                        <FodTh>Număr Document</FodTh>
                        <FodTh>Status</FodTh>
                        <FodTh>Tip Document</FodTh>
                        <FodTh>Data Emiterii</FodTh>
                        <FodTh>Acțiuni</FodTh>
                    </FodTHeadRow>
                </HeaderContent>
                <RowTemplate>
                    <FodTr>
                        <FodTd>@context.DocumentNumber</FodTd>
                        <FodTd>
                            @if (context.Found)
                            {
                                <FodChip Color="FodColor.Success" Size="FodSize.Small">
                                    Găsit
                                </FodChip>
                            }
                            else
                            {
                                <FodChip Color="FodColor.Error" Size="FodSize.Small">
                                    Negăsit
                                </FodChip>
                            }
                        </FodTd>
                        <FodTd>@context.DocumentName</FodTd>
                        <FodTd>@context.DocumentIssueDate?.ToString("dd.MM.yyyy")</FodTd>
                        <FodTd>
                            @if (!string.IsNullOrEmpty(context.MDocsShareFullLink))
                            {
                                <FodIconButton Icon="@FodIcons.Material.Filled.Download"
                                               Size="FodSize.Small"
                                               OnClick="() => DownloadDocument(context)" />
                            }
                        </FodTd>
                    </FodTr>
                </RowTemplate>
            </FodDataTable>
        }
    </FodCardContent>
</FodCard>

@code {
    private string documentNumbers;
    private List<VerifyDocumentResponseModel> batchResults = new();
    
    private async Task VerifyBatch()
    {
        batchResults.Clear();
        
        var numbers = documentNumbers?
            .Split('\n')
            .Select(n => n.Trim())
            .Where(n => !string.IsNullOrEmpty(n))
            .Distinct();
        
        if (numbers?.Any() == true)
        {
            foreach (var number in numbers)
            {
                var result = await VerifyDocumentService.Verify(new VerifyDocumentModel
                {
                    DocumentNumber = number
                });
                
                batchResults.Add(result);
            }
        }
    }
}
```

### 9. Monitorizare și Logging

```csharp
public class MonitoredVerifyDocumentService : IVerifyDocumentService
{
    private readonly IVerifyDocumentService _innerService;
    private readonly ILogger<MonitoredVerifyDocumentService> _logger;
    private readonly ITelemetryService _telemetry;
    
    public async Task<VerifyDocumentResponseModel> Verify(VerifyDocumentModel model)
    {
        using var activity = Activity.StartActivity("VerifyDocument");
        activity?.SetTag("document.number", model.DocumentNumber);
        activity?.SetTag("has.mdocs.id", model.MDocsShareId.HasValue);
        
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            var result = await _innerService.Verify(model);
            
            _telemetry.TrackEvent("DocumentVerified", new Dictionary<string, string>
            {
                ["DocumentNumber"] = model.DocumentNumber,
                ["Found"] = result.Found.ToString(),
                ["HasDownloadLink"] = (!string.IsNullOrEmpty(result.MDocsShareFullLink)).ToString(),
                ["Duration"] = stopwatch.ElapsedMilliseconds.ToString()
            });
            
            if (result.Found)
            {
                _logger.LogInformation(
                    "Document verificat cu succes: {DocumentNumber}, Tip: {DocumentType}", 
                    result.DocumentNumber, 
                    result.DocumentName);
            }
            else
            {
                _logger.LogWarning(
                    "Document negăsit: {DocumentNumber}", 
                    model.DocumentNumber);
            }
            
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, 
                "Eroare la verificarea documentului {DocumentNumber}", 
                model.DocumentNumber);
            
            _telemetry.TrackException(ex, new Dictionary<string, string>
            {
                ["DocumentNumber"] = model.DocumentNumber
            });
            
            throw;
        }
    }
}
```

### 10. Testare

```csharp
[TestClass]
public class VerifyDocumentServiceTests
{
    private Mock<HttpMessageHandler> _httpHandler;
    private IVerifyDocumentService _service;
    
    [TestInitialize]
    public void Setup()
    {
        _httpHandler = new Mock<HttpMessageHandler>();
        var httpClient = new HttpClient(_httpHandler.Object)
        {
            BaseAddress = new Uri("https://api.example.com/")
        };
        
        _service = new VerifyDocumentService(httpClient);
    }
    
    [TestMethod]
    public async Task Verify_DocumentFound_ReturnsDetails()
    {
        // Arrange
        var model = new VerifyDocumentModel
        {
            DocumentNumber = "DOC-2024-001"
        };
        
        var expectedResponse = new VerifyDocumentResponseModel
        {
            Found = true,
            DocumentNumber = "DOC-2024-001",
            DocumentName = "Certificat de înregistrare",
            DocumentIssueDate = DateTime.Now.AddDays(-5),
            ResponseDataStatus = ResponseDataStatusEnum.Valid
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _service.Verify(model);
        
        // Assert
        Assert.IsTrue(result.Found);
        Assert.AreEqual("DOC-2024-001", result.DocumentNumber);
        Assert.AreEqual("Certificat de înregistrare", result.DocumentName);
        Assert.AreEqual(ResponseDataStatusEnum.Valid, result.ResponseDataStatus);
    }
    
    [TestMethod]
    public async Task Verify_WithMDocsId_ReturnsDownloadLink()
    {
        // Arrange
        var mdocsId = Guid.NewGuid();
        var model = new VerifyDocumentModel
        {
            DocumentNumber = "DOC-2024-001",
            MDocsShareId = mdocsId
        };
        
        var expectedResponse = new VerifyDocumentResponseModel
        {
            Found = true,
            DocumentNumber = "DOC-2024-001",
            MDocsShareFullLink = $"https://mdocs.gov.md/share/{mdocsId}"
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _service.Verify(model);
        
        // Assert
        Assert.IsTrue(result.Found);
        Assert.IsNotNull(result.MDocsShareFullLink);
        Assert.IsTrue(result.MDocsShareFullLink.Contains(mdocsId.ToString()));
    }
    
    [TestMethod]
    public async Task Verify_DocumentNotFound_ReturnsFalse()
    {
        // Arrange
        var model = new VerifyDocumentModel
        {
            DocumentNumber = "INVALID-001"
        };
        
        var expectedResponse = new VerifyDocumentResponseModel
        {
            Found = false,
            DocumentNumber = "INVALID-001"
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _service.Verify(model);
        
        // Assert
        Assert.IsFalse(result.Found);
        Assert.IsNull(result.DocumentName);
        Assert.IsNull(result.DocumentIssueDate);
    }
}
```

### 11. Best Practices

1. **Validare input** - Validați numărul documentului înainte de verificare
2. **Cache rezultate** - Cache-uiți documentele găsite pentru performanță
3. **Tratare erori** - Gestionați erorile de rețea și timeout
4. **Securitate** - Nu expuneți informații sensibile în logs
5. **Rate limiting** - Implementați limite pentru verificări repetate
6. **Audit trail** - Înregistrați toate verificările pentru audit

### 12. Integrare cu alte servicii

```csharp
public class DocumentVerificationOrchestrator
{
    private readonly IVerifyDocumentService _verifyService;
    private readonly INotificationService _notificationService;
    private readonly IAuditService _auditService;
    
    public async Task<VerifyDocumentResponseModel> VerifyAndNotify(
        VerifyDocumentModel model, 
        string userEmail = null)
    {
        // Verificare document
        var result = await _verifyService.Verify(model);
        
        // Audit
        await _auditService.LogDocumentVerification(
            model.DocumentNumber, 
            result.Found, 
            userEmail);
        
        // Notificare email dacă este cazul
        if (!string.IsNullOrEmpty(userEmail))
        {
            var subject = result.Found 
                ? "Document verificat cu succes" 
                : "Document negăsit";
            
            await _notificationService.SendEmailAsync(
                userEmail, 
                subject, 
                GenerateEmailBody(result));
        }
        
        return result;
    }
}
```

### 13. Concluzie

`VerifyDocumentService` oferă funcționalitate completă pentru verificarea documentelor emise prin sistemul FOD. Cu suport pentru verificare simplă sau cu MDocs, integrare ușoară în componente Blazor și opțiuni extinse de monitorizare, serviciul asigură autenticitatea și accesibilitatea documentelor digitale emise de instituțiile guvernamentale.