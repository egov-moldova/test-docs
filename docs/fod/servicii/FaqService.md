# FaqService

## Documentație pentru serviciul FaqService

### 1. Descriere Generală

`FaqService` este un serviciu pentru gestionarea întrebărilor frecvente (FAQ) asociate cu diferite servicii guvernamentale. Serviciul comunică cu API-ul Info Portal pentru a obține întrebări și răspunsuri relevante pentru un anumit serviciu.

Caracteristici principale:
- Obținere FAQ-uri pe bază de ID serviciu
- Paginare configurabilă
- Filtrare după status activ/inactiv
- Integrare cu Info Portal API
- Logging pentru debugging
- Configurare centralizată prin options pattern

### 2. Configurare și Înregistrare

#### Înregistrare în Program.cs sau Startup.cs
```csharp
// Configurare opțiuni
builder.Services.Configure<FodConfiguration>(
    builder.Configuration.GetSection("FodConfiguration"));

// Înregistrare serviciu cu HttpClient
builder.Services.AddHttpClient<IFaqService, FaqService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

// Sau înregistrare simplă
builder.Services.AddScoped<IFaqService, FaqService>();
```

#### Configurare în appsettings.json
```json
{
  "FodConfiguration": {
    "Services": {
      "InfoPortal": {
        "BaseUrl": "https://api.infoportal.gov.md",
        "ApiKey": "your-api-key",
        "Timeout": 30
      }
    }
  }
}
```

### 3. Interfața IFaqService

```csharp
public interface IFaqService
{
    /// <summary>
    /// Obține elementele FAQ pentru un serviciu specific
    /// </summary>
    /// <param name="serviceId">ID-ul serviciului</param>
    /// <param name="pageSize">Numărul de elemente per pagină</param>
    /// <param name="active">Doar elemente active</param>
    /// <param name="page">Numărul paginii</param>
    /// <returns>Model cu întrebări și răspunsuri</returns>
    Task<FaqModel> GetFaqItemsAsync(
        string serviceId, 
        int pageSize = 9999, 
        bool active = true, 
        int page = 1);
}
```

### 4. Modele de Date

#### FaqModel
```csharp
public class FaqModel
{
    public List<FaqItem> Items { get; set; }
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}

public class FaqItem
{
    public int Id { get; set; }
    public string Question { get; set; }
    public string Answer { get; set; }
    public string ServiceId { get; set; }
    public int OrderIndex { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public string Category { get; set; }
    public List<string> Tags { get; set; }
}
```

### 5. Utilizare de Bază

#### Obținere FAQ pentru un serviciu
```razor
@page "/service/{ServiceId}/faq"
@inject IFaqService FaqService

<h3>Întrebări frecvente</h3>

@if (isLoading)
{
    <FodLoadingLinear />
}
else if (faqItems?.Items?.Any() == true)
{
    <FodAccordion>
        @foreach (var item in faqItems.Items)
        {
            <FodAccordionItem Title="@item.Question">
                <FodText>@((MarkupString)item.Answer)</FodText>
            </FodAccordionItem>
        }
    </FodAccordion>
}
else
{
    <FodAlert Severity="FodSeverity.Info">
        Nu există întrebări frecvente pentru acest serviciu.
    </FodAlert>
}

@code {
    [Parameter] public string ServiceId { get; set; }
    
    private FaqModel faqItems;
    private bool isLoading = true;
    
    protected override async Task OnInitializedAsync()
    {
        try
        {
            faqItems = await FaqService.GetFaqItemsAsync(ServiceId);
        }
        catch (Exception ex)
        {
            // Handle error
            Logger.LogError(ex, "Error loading FAQ items");
        }
        finally
        {
            isLoading = false;
        }
    }
}
```

### 6. Exemple Avansate

#### FAQ cu paginare și căutare
```razor
<div class="faq-container">
    <FodTextField @bind-Value="searchTerm"
                  Label="Caută în întrebări"
                  OnKeyUp="@(e => { if (e.Key == "Enter") SearchFaq(); })"
                  AdornmentIcon="@FodIcons.Material.Filled.Search" />
    
    <div class="faq-list mt-4">
        @foreach (var item in filteredItems)
        {
            <FodCard Class="mb-3">
                <FodCardContent>
                    <FodText Typo="Typo.h6">
                        <FodIcon Icon="@FodIcons.Material.Filled.HelpOutline" 
                                 Color="FodColor.Primary" />
                        @item.Question
                    </FodText>
                    <FodDivider Class="my-2" />
                    <FodText>@((MarkupString)item.Answer)</FodText>
                    
                    @if (item.Tags?.Any() == true)
                    {
                        <div class="mt-2">
                            @foreach (var tag in item.Tags)
                            {
                                <FodChip Size="FodSize.Small" Class="me-1">@tag</FodChip>
                            }
                        </div>
                    }
                </FodCardContent>
            </FodCard>
        }
    </div>
    
    @if (faqModel.HasNextPage || faqModel.HasPreviousPage)
    {
        <FodPagination Count="@totalPages"
                       @bind-Selected="currentPage"
                       Color="FodColor.Primary"
                       ShowFirstButton="true"
                       ShowLastButton="true" />
    }
</div>

@code {
    private FaqModel faqModel;
    private List<FaqItem> filteredItems = new();
    private string searchTerm;
    private int currentPage = 1;
    private int pageSize = 10;
    private int totalPages;
    
    private async Task LoadFaq()
    {
        faqModel = await FaqService.GetFaqItemsAsync(
            ServiceId, pageSize, true, currentPage);
        
        totalPages = (int)Math.Ceiling(
            (double)faqModel.TotalCount / pageSize);
        
        FilterItems();
    }
    
    private void FilterItems()
    {
        filteredItems = string.IsNullOrWhiteSpace(searchTerm)
            ? faqModel.Items
            : faqModel.Items.Where(i => 
                i.Question.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                i.Answer.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
              .ToList();
    }
    
    private void SearchFaq()
    {
        currentPage = 1;
        FilterItems();
    }
}
```

#### Service extins cu cache
```csharp
public class CachedFaqService : IFaqService
{
    private readonly IFaqService _innerService;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachedFaqService> _logger;
    
    public CachedFaqService(
        IFaqService innerService,
        IMemoryCache cache,
        ILogger<CachedFaqService> logger)
    {
        _innerService = innerService;
        _cache = cache;
        _logger = logger;
    }
    
    public async Task<FaqModel> GetFaqItemsAsync(
        string serviceId, 
        int pageSize = 9999, 
        bool active = true, 
        int page = 1)
    {
        var cacheKey = $"faq_{serviceId}_{pageSize}_{active}_{page}";
        
        if (_cache.TryGetValue<FaqModel>(cacheKey, out var cachedResult))
        {
            _logger.LogDebug("FAQ items retrieved from cache for service {ServiceId}", serviceId);
            return cachedResult;
        }
        
        var result = await _innerService.GetFaqItemsAsync(
            serviceId, pageSize, active, page);
        
        // Cache pentru 1 oră
        _cache.Set(cacheKey, result, TimeSpan.FromHours(1));
        
        return result;
    }
}
```

### 7. Integrare cu FodFaqViewer

```razor
<!-- Utilizare simplă cu componenta existentă -->
<FodFaqViewer ServiceId="@ServiceId" />

<!-- Sau personalizat -->
<FodFaqViewer ServiceId="@ServiceId"
              PageSize="5"
              ShowSearch="true"
              CollapsedByDefault="false"
              CustomClass="custom-faq-style" />
```

### 8. Gestionare Erori

```csharp
public class ResilientFaqService : IFaqService
{
    private readonly IFaqService _innerService;
    private readonly ILogger<ResilientFaqService> _logger;
    
    public async Task<FaqModel> GetFaqItemsAsync(
        string serviceId, int pageSize = 9999, 
        bool active = true, int page = 1)
    {
        try
        {
            return await _innerService.GetFaqItemsAsync(
                serviceId, pageSize, active, page);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, 
                "Network error fetching FAQ for service {ServiceId}", 
                serviceId);
            
            // Returnează rezultat gol în loc să arunce excepția
            return new FaqModel
            {
                Items = new List<FaqItem>(),
                TotalCount = 0,
                PageNumber = page,
                PageSize = pageSize
            };
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, 
                "Timeout fetching FAQ for service {ServiceId}", 
                serviceId);
            throw new TimeoutException(
                "Timpul de așteptare pentru FAQ a expirat", ex);
        }
    }
}
```

### 9. Best Practices

1. **Caching**: Implementați cache pentru a reduce încărcarea API-ului
2. **Error Handling**: Tratați erorile de rețea graceful
3. **Logging**: Logați toate erorile pentru debugging
4. **Timeout**: Setați timeout-uri rezonabile
5. **Retry Logic**: Implementați retry pentru erori tranzitorii
6. **Validare**: Validați parametrii de intrare

### 10. Monitorizare și Metrici

```csharp
public class MonitoredFaqService : IFaqService
{
    private readonly IFaqService _innerService;
    private readonly IMetrics _metrics;
    
    public async Task<FaqModel> GetFaqItemsAsync(
        string serviceId, int pageSize = 9999, 
        bool active = true, int page = 1)
    {
        using var timer = _metrics.Measure.Timer.Time("faq.fetch.duration");
        
        try
        {
            var result = await _innerService.GetFaqItemsAsync(
                serviceId, pageSize, active, page);
            
            _metrics.Measure.Counter.Increment("faq.fetch.success");
            _metrics.Measure.Gauge.SetValue("faq.items.count", result.TotalCount);
            
            return result;
        }
        catch (Exception)
        {
            _metrics.Measure.Counter.Increment("faq.fetch.error");
            throw;
        }
    }
}
```

### 11. Teste Unitare

```csharp
[TestClass]
public class FaqServiceTests
{
    private Mock<HttpMessageHandler> _mockHandler;
    private HttpClient _httpClient;
    private FaqService _service;
    
    [TestInitialize]
    public void Setup()
    {
        _mockHandler = new Mock<HttpMessageHandler>();
        _httpClient = new HttpClient(_mockHandler.Object);
        
        var options = Options.Create(new FodConfiguration
        {
            Services = new ServicesConfiguration
            {
                InfoPortal = new InfoPortalOptions
                {
                    BaseUrl = "https://test.api"
                }
            }
        });
        
        _service = new FaqService(_httpClient, options, 
            Mock.Of<ILogger<FaqService>>());
    }
    
    [TestMethod]
    public async Task GetFaqItemsAsync_ReturnsItems_WhenApiSucceeds()
    {
        // Arrange
        var expectedJson = JsonSerializer.Serialize(new FaqModel
        {
            Items = new List<FaqItem>
            {
                new() { Id = 1, Question = "Test?", Answer = "Da" }
            },
            TotalCount = 1
        });
        
        _mockHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(expectedJson)
            });
        
        // Act
        var result = await _service.GetFaqItemsAsync("SERVICE001");
        
        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual(1, result.Items.Count);
        Assert.AreEqual("Test?", result.Items[0].Question);
    }
}
```

### 12. Concluzie

`FaqService` oferă o interfață simplă și eficientă pentru gestionarea întrebărilor frecvente în aplicații guvernamentale. Cu suport pentru paginare, filtrare și integrare ușoară cu componente UI, serviciul facilitează implementarea secțiunilor FAQ informative și ușor de navigat.