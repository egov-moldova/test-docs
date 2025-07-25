# ValidateExtrasService

## Documentație pentru serviciul ValidateExtrasService

### 1. Descriere Generală

`ValidateExtrasService` este un serviciu pentru validarea numerelor de extras din documentele oficiale emise de instituțiile guvernamentale din Moldova. Serviciul oferă o interfață simplă pentru verificarea validității extraselor prin comunicare cu API-ul server-side.

Caracteristici principale:
- Validare număr extras în timp real
- Comunicare asincronă cu serverul
- Răspuns simplu Valid/Invalid
- Integrare cu componenta FodValidateExtras
- Suport pentru extindere cu logică de validare complexă

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs

// Client-side (Blazor WebAssembly)
builder.Services.AddFodComponents(configuration);

// Server-side
builder.Services.AddFodComponentsServer(configuration, connectionString);

// Înregistrare manuală
builder.Services.AddScoped<IValidateExtrasService, ValidateExtrasService>();
builder.Services.AddHttpClient<IValidateExtrasService, ValidateExtrasService>(client =>
{
    client.BaseAddress = new Uri(configuration["ApiSettings:BaseUrl"]);
});

// Server-side - implementare customizată
builder.Services.AddScoped<IValidateExtrasService, CustomValidateExtrasService>();
```

### 3. Interfețe

#### Client-side Interface
```csharp
namespace FOD.Components.Services.ValidateExtras
{
    public interface IValidateExtrasService
    {
        Task<ValidateExtrasModel> ValidateExtras(string number);
    }
}
```

#### Server-side Interface
```csharp
namespace FOD.Components.Server.Services
{
    public interface IValidateExtrasService
    {
        Task<ValidateExtrasModel> ValidateExtras(Dictionary<string, string> extrasNumber);
    }
}
```

### 4. Modele de Date

```csharp
public class ValidateExtrasModel
{
    public ValidateExtrasStatus? Status { get; set; }
}

public enum ValidateExtrasStatus
{
    Valid = 0,
    Invalid = 1
}
```

### 5. Exemple de Utilizare

#### Utilizare simplă în componente
```razor
@page "/verifica-extras"
@inject IValidateExtrasService ValidateExtrasService
@inject IFodNotificationService NotificationService

<FodContainer>
    <FodCard>
        <FodCardContent>
            <FodText Typo="Typo.h6" GutterBottom="true">
                Verificare Număr Extras
            </FodText>
            
            <FodGrid Container="true" Spacing="3" AlignItems="Align.End">
                <FodGrid Item="true" xs="12" md="8">
                    <FodInput @bind-Value="extrasNumber" 
                              Label="Număr extras"
                              Placeholder="Introduceți numărul extrasului"
                              Required="true"
                              HelperText="Format: XXX-YYYY-ZZZZ"
                              EndAdornment="@GetValidationIcon()" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="4">
                    <FodButton OnClick="ValidateExtras" 
                               Color="FodColor.Primary"
                               FullWidth="true"
                               Disabled="@(string.IsNullOrWhiteSpace(extrasNumber) || isValidating)">
                        @if (isValidating)
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
            
            @if (validationResult != null)
            {
                <FodAlert Severity="@GetAlertSeverity()" Class="mt-3">
                    @GetValidationMessage()
                </FodAlert>
            }
        </FodCardContent>
    </FodCard>
</FodContainer>

@code {
    private string extrasNumber;
    private ValidateExtrasModel validationResult;
    private bool isValidating;
    
    private async Task ValidateExtras()
    {
        if (string.IsNullOrWhiteSpace(extrasNumber))
            return;
        
        isValidating = true;
        validationResult = null;
        
        try
        {
            validationResult = await ValidateExtrasService.ValidateExtras(extrasNumber.Trim());
            
            if (validationResult?.Status == ValidateExtrasStatus.Valid)
            {
                NotificationService.Success("Extras valid!");
            }
            else
            {
                NotificationService.Warning("Extras invalid sau inexistent!");
            }
        }
        catch (Exception ex)
        {
            NotificationService.Error($"Eroare la verificare: {ex.Message}");
        }
        finally
        {
            isValidating = false;
        }
    }
    
    private RenderFragment GetValidationIcon()
    {
        return @<text>
            @if (validationResult?.Status == ValidateExtrasStatus.Valid)
            {
                <FodIcon Color="FodColor.Success">
                    @FodIcons.Material.Filled.CheckCircle
                </FodIcon>
            }
            else if (validationResult?.Status == ValidateExtrasStatus.Invalid)
            {
                <FodIcon Color="FodColor.Error">
                    @FodIcons.Material.Filled.Cancel
                </FodIcon>
            }
        </text>;
    }
    
    private FodSeverity GetAlertSeverity()
    {
        return validationResult?.Status == ValidateExtrasStatus.Valid 
            ? FodSeverity.Success 
            : FodSeverity.Error;
    }
    
    private string GetValidationMessage()
    {
        return validationResult?.Status == ValidateExtrasStatus.Valid
            ? "Extrasul este valid și poate fi utilizat."
            : "Extrasul nu este valid. Verificați numărul introdus.";
    }
}
```

#### Utilizare componenta FodValidateExtras
```razor
@page "/servicii/verificare"

<FodContainer>
    <FodText Typo="Typo.h4" GutterBottom="true">
        Verificare Documente
    </FodText>
    
    <FodTabs>
        <FodTabPanel Title="Verificare Extras">
            <FodValidateExtras />
        </FodTabPanel>
        
        <FodTabPanel Title="Verificare Document">
            <FodVerifyDocument />
        </FodTabPanel>
    </FodTabs>
</FodContainer>
```

#### Implementare server-side customizată
```csharp
public class CustomValidateExtrasService : IValidateExtrasService
{
    private readonly IDbContext _dbContext;
    private readonly ILogger<CustomValidateExtrasService> _logger;
    
    public CustomValidateExtrasService(IDbContext dbContext, 
                                      ILogger<CustomValidateExtrasService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }
    
    public async Task<ValidateExtrasModel> ValidateExtras(Dictionary<string, string> extrasNumber)
    {
        try
        {
            if (!extrasNumber.TryGetValue("number", out var number) || 
                string.IsNullOrWhiteSpace(number))
            {
                return new ValidateExtrasModel 
                { 
                    Status = ValidateExtrasStatus.Invalid 
                };
            }
            
            // Normalizare număr
            var normalizedNumber = NormalizeExtrasNumber(number);
            
            // Verificare format
            if (!IsValidFormat(normalizedNumber))
            {
                _logger.LogWarning("Invalid extras format: {Number}", 
                    normalizedNumber.Substring(0, Math.Min(3, normalizedNumber.Length)) + "***");
                    
                return new ValidateExtrasModel 
                { 
                    Status = ValidateExtrasStatus.Invalid 
                };
            }
            
            // Verificare în baza de date
            var exists = await _dbContext.DocumentExtracts
                .AnyAsync(e => e.ExtractNumber == normalizedNumber && 
                              e.IsActive && 
                              e.ExpiryDate > DateTime.Now);
            
            if (exists)
            {
                _logger.LogInformation("Valid extras found: {Number}", 
                    normalizedNumber.Substring(0, 3) + "***");
            }
            
            return new ValidateExtrasModel
            {
                Status = exists ? ValidateExtrasStatus.Valid : ValidateExtrasStatus.Invalid
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating extras");
            throw;
        }
    }
    
    private string NormalizeExtrasNumber(string number)
    {
        // Elimină spații și caractere speciale
        return number.Trim()
                     .Replace(" ", "")
                     .Replace("-", "")
                     .Replace("/", "")
                     .ToUpperInvariant();
    }
    
    private bool IsValidFormat(string number)
    {
        // Format: 3 litere + 4 cifre + 4 cifre
        // Exemplu: ABC12345678
        var pattern = @"^[A-Z]{3}\d{8}$";
        return Regex.IsMatch(number, pattern);
    }
}
```

### 6. Validare în lot

```razor
@inject IValidateExtrasService ValidateExtrasService

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Validare Multiplă Extrase
        </FodText>
        
        <FodTextArea @bind-Value="batchNumbers" 
                     Label="Numere extrase (unul per linie)"
                     Rows="5"
                     Placeholder="ABC-1234-5678&#x0a;DEF-2345-6789&#x0a;..." />
        
        <FodButton OnClick="ValidateBatch" 
                   Color="FodColor.Primary"
                   Class="mt-3"
                   Disabled="@isProcessing">
            @if (isProcessing)
            {
                <span>Procesare... @processedCount / @totalCount</span>
            }
            else
            {
                <text>Validează Toate</text>
            }
        </FodButton>
        
        @if (results.Any())
        {
            <FodDataTable Items="@results" Class="mt-4" Dense="true">
                <HeaderContent>
                    <FodTHeadRow>
                        <FodTh>Număr Extras</FodTh>
                        <FodTh>Status</FodTh>
                        <FodTh>Timp Verificare</FodTh>
                    </FodTHeadRow>
                </HeaderContent>
                <RowTemplate>
                    <FodTr>
                        <FodTd>@context.Number</FodTd>
                        <FodTd>
                            <FodChip Color="@(context.IsValid ? FodColor.Success : FodColor.Error)" 
                                     Size="FodSize.Small">
                                @(context.IsValid ? "Valid" : "Invalid")
                            </FodChip>
                        </FodTd>
                        <FodTd>@context.ValidationTime.ToString("F2") ms</FodTd>
                    </FodTr>
                </RowTemplate>
            </FodDataTable>
            
            <!-- Sumar -->
            <FodPaper Elevation="1" Class="mt-3 p-3">
                <FodText>
                    Total verificate: @results.Count | 
                    Valide: @results.Count(r => r.IsValid) | 
                    Invalide: @results.Count(r => !r.IsValid)
                </FodText>
            </FodPaper>
        }
    </FodCardContent>
</FodCard>

@code {
    private string batchNumbers;
    private List<BatchValidationResult> results = new();
    private bool isProcessing;
    private int processedCount;
    private int totalCount;
    
    private async Task ValidateBatch()
    {
        results.Clear();
        isProcessing = true;
        processedCount = 0;
        
        var numbers = batchNumbers?
            .Split('\n')
            .Select(n => n.Trim())
            .Where(n => !string.IsNullOrEmpty(n))
            .Distinct()
            .ToList() ?? new List<string>();
        
        totalCount = numbers.Count;
        
        // Procesare în paralel cu limitare
        var semaphore = new SemaphoreSlim(5); // Max 5 concurrent
        var tasks = numbers.Select(async number =>
        {
            await semaphore.WaitAsync();
            try
            {
                var sw = Stopwatch.StartNew();
                var result = await ValidateExtrasService.ValidateExtras(number);
                sw.Stop();
                
                var batchResult = new BatchValidationResult
                {
                    Number = number,
                    IsValid = result?.Status == ValidateExtrasStatus.Valid,
                    ValidationTime = sw.ElapsedMilliseconds
                };
                
                results.Add(batchResult);
                processedCount++;
                StateHasChanged();
                
                return batchResult;
            }
            finally
            {
                semaphore.Release();
            }
        });
        
        await Task.WhenAll(tasks);
        isProcessing = false;
    }
    
    private class BatchValidationResult
    {
        public string Number { get; set; }
        public bool IsValid { get; set; }
        public double ValidationTime { get; set; }
    }
}
```

### 7. Serviciu cu cache și rate limiting

```csharp
public class EnhancedValidateExtrasService : IValidateExtrasService
{
    private readonly IValidateExtrasService _innerService;
    private readonly IMemoryCache _cache;
    private readonly IRateLimiter _rateLimiter;
    private readonly ILogger<EnhancedValidateExtrasService> _logger;
    
    public async Task<ValidateExtrasModel> ValidateExtras(string number)
    {
        // Verificare rate limit
        var clientId = GetClientIdentifier();
        var allowed = await _rateLimiter.AllowAsync(
            $"validate_extras_{clientId}", 
            limit: 30, 
            window: TimeSpan.FromMinutes(1));
        
        if (!allowed)
        {
            throw new RateLimitExceededException(
                "Prea multe cereri. Încercați din nou peste un minut.");
        }
        
        // Verificare cache
        var cacheKey = $"extras_{NormalizeNumber(number)}";
        if (_cache.TryGetValue<ValidateExtrasModel>(cacheKey, out var cached))
        {
            _logger.LogDebug("Returning cached validation for extras");
            return cached;
        }
        
        // Validare
        var result = await _innerService.ValidateExtras(number);
        
        // Cache rezultat pentru 15 minute
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(15));
        
        // Logging pentru audit
        _logger.LogInformation(
            "Extras validation completed: {Number} - {Status}",
            number.Substring(0, Math.Min(3, number.Length)) + "***",
            result?.Status);
        
        return result;
    }
    
    private string NormalizeNumber(string number)
    {
        return number?.Trim().ToUpperInvariant() ?? string.Empty;
    }
}
```

### 8. Integrare cu alte servicii

```csharp
public class DocumentValidationOrchestrator
{
    private readonly IValidateExtrasService _extrasService;
    private readonly IVerifyDocumentService _documentService;
    private readonly ILogger<DocumentValidationOrchestrator> _logger;
    
    public async Task<ComprehensiveValidationResult> ValidateDocument(
        string documentNumber, 
        string extrasNumber)
    {
        var result = new ComprehensiveValidationResult();
        
        // Validare în paralel
        var documentTask = _documentService.Verify(new VerifyDocumentModel 
        { 
            DocumentNumber = documentNumber 
        });
        
        var extrasTask = _extrasService.ValidateExtras(extrasNumber);
        
        await Task.WhenAll(documentTask, extrasTask);
        
        var documentResult = await documentTask;
        var extrasResult = await extrasTask;
        
        result.DocumentValid = documentResult?.Found ?? false;
        result.ExtrasValid = extrasResult?.Status == ValidateExtrasStatus.Valid;
        result.OverallValid = result.DocumentValid && result.ExtrasValid;
        
        if (!result.OverallValid)
        {
            var issues = new List<string>();
            if (!result.DocumentValid) issues.Add("Document invalid");
            if (!result.ExtrasValid) issues.Add("Extras invalid");
            
            result.ValidationIssues = issues;
        }
        
        return result;
    }
}

public class ComprehensiveValidationResult
{
    public bool DocumentValid { get; set; }
    public bool ExtrasValid { get; set; }
    public bool OverallValid { get; set; }
    public List<string> ValidationIssues { get; set; }
}
```

### 9. Monitorizare și metrici

```csharp
public class MonitoredValidateExtrasService : IValidateExtrasService
{
    private readonly IValidateExtrasService _innerService;
    private readonly IMetricsCollector _metrics;
    
    public async Task<ValidateExtrasModel> ValidateExtras(string number)
    {
        using var activity = Activity.StartActivity("ValidateExtras");
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            var result = await _innerService.ValidateExtras(number);
            
            stopwatch.Stop();
            
            // Înregistrare metrici
            _metrics.RecordHistogram(
                "extras_validation_duration",
                stopwatch.ElapsedMilliseconds);
            
            _metrics.RecordCounter(
                "extras_validation_total",
                1,
                new KeyValuePair<string, object>("status", result?.Status?.ToString() ?? "unknown"));
            
            activity?.SetTag("validation.status", result?.Status);
            activity?.SetTag("validation.duration_ms", stopwatch.ElapsedMilliseconds);
            
            return result;
        }
        catch (Exception ex)
        {
            _metrics.RecordCounter("extras_validation_errors", 1);
            activity?.RecordException(ex);
            throw;
        }
    }
}
```

### 10. Testare

```csharp
[TestClass]
public class ValidateExtrasServiceTests
{
    private Mock<HttpMessageHandler> _httpHandler;
    private IValidateExtrasService _service;
    
    [TestInitialize]
    public void Setup()
    {
        _httpHandler = new Mock<HttpMessageHandler>();
        var httpClient = new HttpClient(_httpHandler.Object)
        {
            BaseAddress = new Uri("https://api.example.com/")
        };
        
        _service = new ValidateExtrasService(httpClient);
    }
    
    [TestMethod]
    public async Task ValidateExtras_ValidNumber_ReturnsValid()
    {
        // Arrange
        var extrasNumber = "ABC-1234-5678";
        var expectedResponse = new ValidateExtrasModel 
        { 
            Status = ValidateExtrasStatus.Valid 
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _service.ValidateExtras(extrasNumber);
        
        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual(ValidateExtrasStatus.Valid, result.Status);
    }
    
    [TestMethod]
    public async Task ValidateExtras_InvalidNumber_ReturnsInvalid()
    {
        // Arrange
        var extrasNumber = "INVALID-123";
        var expectedResponse = new ValidateExtrasModel 
        { 
            Status = ValidateExtrasStatus.Invalid 
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _service.ValidateExtras(extrasNumber);
        
        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual(ValidateExtrasStatus.Invalid, result.Status);
    }
    
    [TestMethod]
    [ExpectedException(typeof(ArgumentNullException))]
    public async Task ValidateExtras_NullNumber_ThrowsException()
    {
        // Act
        await _service.ValidateExtras(null);
    }
}
```

### 11. Best Practices

1. **Validare format** - Verificați formatul înainte de apel server
2. **Cache rezultate** - Cache-uiți validările pentru performanță
3. **Rate limiting** - Preveniți abuzuri prin limitare
4. **Normalizare** - Normalizați numerele înainte de validare
5. **Audit trail** - Înregistrați toate validările pentru audit
6. **Error handling** - Tratați graceful erorile de rețea
7. **Batch processing** - Optimizați validările multiple

### 12. Concluzie

`ValidateExtrasService` oferă o interfață simplă și eficientă pentru validarea numerelor de extras din documentele oficiale. Cu suport pentru validare în timp real, cache, și posibilități de extindere, serviciul facilitează verificarea rapidă a autenticității extraselor în sistemul FOD, contribuind la securitatea și fiabilitatea serviciilor digitale guvernamentale.