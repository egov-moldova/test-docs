# CostCalculatorService

## Documentație pentru serviciul CostCalculatorService

### 1. Descriere Generală

`CostCalculatorService<T>` este un serviciu generic pentru calcularea costurilor asociate cererilor de servicii guvernamentale. Serviciul comunică cu API-ul de calcul costuri pentru a determina tarifele aplicabile bazate pe tipul și parametrii cererii.

Caracteristici principale:
- Calcul dinamic al costurilor bazat pe tipul cererii
- Suport generic pentru diferite modele de cereri
- Comunicare HTTP cu serviciul de calcul costuri
- Returnare model standardizat FodRequestCostModel
- Integrare cu sistemul de tipuri de cereri

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs
builder.Services.AddHttpClient<ICostCalculatorService<MyRequestModel>, CostCalculatorService<MyRequestModel>>(client =>
{
    client.BaseAddress = new Uri(configuration["ApiSettings:BaseUrl"]);
});

// Sau pentru înregistrare generică
builder.Services.AddScoped(typeof(ICostCalculatorService<>), typeof(CostCalculatorService<>));
```

### 3. Interfața ICostCalculatorService

```csharp
public interface ICostCalculatorService<T> where T : FodRequestModel
{
    Task<FodRequestCostModel> Calculate(T requestModel);
}
```

### 4. Metode Disponibile

| Metodă | Parametri | Return | Descriere |
|--------|-----------|--------|-----------|
| `Calculate` | `T requestModel` | `Task<FodRequestCostModel>` | Calculează costul pentru cererea specificată |

### 5. Modele de Date

#### FodRequestModel (bază)
```csharp
public class FodRequestModel
{
    public RequestType Type { get; set; }
    // Alte proprietăți comune
}
```

#### FodRequestCostModel (rezultat)
```csharp
public class FodRequestCostModel
{
    public decimal TotalCost { get; set; }
    public decimal ServiceFee { get; set; }
    public decimal ProcessingFee { get; set; }
    public List<CostItem> CostItems { get; set; }
    public bool IsFree { get; set; }
    public string Currency { get; set; }
}
```

### 6. Exemple de Utilizare

#### Calcul cost simplu
```razor
@inject ICostCalculatorService<ServiceRequestModel> CostCalculator

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6">Calculator cost serviciu</FodText>
        
        @if (isCalculating)
        {
            <FodLoadingLinear Indeterminate="true" />
        }
        else if (costResult != null)
        {
            <FodRequestCost Cost="@costResult" />
        }
        
        <FodButton OnClick="CalculateCost" 
                   Disabled="@isCalculating">
            Calculează cost
        </FodButton>
    </FodCardContent>
</FodCard>

@code {
    private ServiceRequestModel requestModel = new();
    private FodRequestCostModel costResult;
    private bool isCalculating = false;
    
    private async Task CalculateCost()
    {
        isCalculating = true;
        try
        {
            costResult = await CostCalculator.Calculate(requestModel);
        }
        catch (Exception ex)
        {
            // Gestionare erori
            NotificationService.ShowError("Eroare la calculul costului");
        }
        finally
        {
            isCalculating = false;
        }
    }
}
```

#### Calcul cost în formular
```razor
<EditForm Model="@applicationModel" OnValidSubmit="SubmitApplication">
    <DataAnnotationsValidator />
    
    <!-- Câmpuri formular -->
    <FodSelect @bind-Value="applicationModel.Type.Code" 
               Label="Tip serviciu"
               OnValueChanged="RecalculateCost">
        @foreach (var type in serviceTypes)
        {
            <FodSelectItem Value="@type.Code">@type.Name</FodSelectItem>
        }
    </FodSelect>
    
    <FodInputNumber @bind-Value="applicationModel.Quantity" 
                    Label="Cantitate"
                    OnValueChanged="RecalculateCost" />
    
    <!-- Afișare cost -->
    @if (currentCost != null)
    {
        <FodCard Class="mt-3">
            <FodCardContent>
                <FodText Typo="Typo.subtitle1">Cost estimat:</FodText>
                <FodText Typo="Typo.h5" Color="FodColor.Primary">
                    @currentCost.TotalCost @currentCost.Currency
                </FodText>
                
                @if (currentCost.CostItems?.Any() == true)
                {
                    <FodList Dense="true" Class="mt-2">
                        @foreach (var item in currentCost.CostItems)
                        {
                            <FodListItem>
                                <FodText Typo="Typo.body2">@item.Description</FodText>
                                <FodText Typo="Typo.body2" Class="ms-auto">
                                    @item.Amount @currentCost.Currency
                                </FodText>
                            </FodListItem>
                        }
                    </FodList>
                }
            </FodCardContent>
        </FodCard>
    }
    
    <FodButton Type="ButtonType.Submit" Color="FodColor.Primary">
        Trimite cererea
    </FodButton>
</EditForm>

@code {
    [Inject] private ICostCalculatorService<ApplicationModel> CostCalculator { get; set; }
    
    private ApplicationModel applicationModel = new();
    private FodRequestCostModel currentCost;
    
    private async Task RecalculateCost()
    {
        if (applicationModel.Type != null)
        {
            currentCost = await CostCalculator.Calculate(applicationModel);
        }
    }
}
```

#### Comparare costuri
```razor
<FodGrid Container="true" Spacing="3">
    @foreach (var option in serviceOptions)
    {
        <FodGrid Item="true" xs="12" md="4">
            <FodCard>
                <FodCardContent>
                    <FodText Typo="Typo.h6">@option.Name</FodText>
                    <FodText Typo="Typo.body2" GutterBottom="true">
                        @option.Description
                    </FodText>
                    
                    @if (costs.ContainsKey(option.Id))
                    {
                        var cost = costs[option.Id];
                        <FodText Typo="Typo.h4" Color="FodColor.Primary">
                            @cost.TotalCost @cost.Currency
                        </FodText>
                        
                        @if (cost.IsFree)
                        {
                            <FodChip Color="FodColor.Success" Size="FodSize.Small">
                                Gratuit
                            </FodChip>
                        }
                    }
                    else
                    {
                        <FodLoadingCircular Size="FodSize.Small" />
                    }
                </FodCardContent>
                <FodCardActions>
                    <FodButton OnClick="@(() => SelectOption(option))">
                        Selectează
                    </FodButton>
                </FodCardActions>
            </FodCard>
        </FodGrid>
    }
</FodGrid>

@code {
    private List<ServiceOption> serviceOptions = new();
    private Dictionary<int, FodRequestCostModel> costs = new();
    
    protected override async Task OnInitializedAsync()
    {
        // Calculează costurile pentru toate opțiunile
        foreach (var option in serviceOptions)
        {
            var request = new ServiceRequestModel { Type = option.Type };
            costs[option.Id] = await CostCalculator.Calculate(request);
        }
    }
}
```

#### Calculator interactiv
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h5" GutterBottom="true">
            Calculator taxe servicii
        </FodText>
        
        <FodAutocomplete @bind-Value="selectedService"
                         Items="availableServices"
                         Label="Selectați serviciul" />
        
        @if (selectedService != null)
        {
            <!-- Parametri specifici serviciului -->
            @foreach (var param in selectedService.Parameters)
            {
                <FodTextField @bind-Value="parameters[param.Key]"
                              Label="@param.Label"
                              Type="@param.Type" />
            }
            
            <FodButton OnClick="CalculateDetailedCost" 
                       Color="FodColor.Primary"
                       Class="mt-3">
                Calculează
            </FodButton>
        }
        
        @if (detailedCost != null)
        {
            <FodExpansionPanels Class="mt-3">
                <FodExpansionPanel Text="Detalii cost" IsExpanded="true">
                    <FodList>
                        <FodListItem>
                            <FodText>Taxă serviciu:</FodText>
                            <FodText Class="ms-auto">
                                @detailedCost.ServiceFee @detailedCost.Currency
                            </FodText>
                        </FodListItem>
                        <FodListItem>
                            <FodText>Taxă procesare:</FodText>
                            <FodText Class="ms-auto">
                                @detailedCost.ProcessingFee @detailedCost.Currency
                            </FodText>
                        </FodListItem>
                        <FodDivider />
                        <FodListItem>
                            <FodText Typo="Typo.h6">Total:</FodText>
                            <FodText Typo="Typo.h6" Class="ms-auto">
                                @detailedCost.TotalCost @detailedCost.Currency
                            </FodText>
                        </FodListItem>
                    </FodList>
                </FodExpansionPanel>
            </FodExpansionPanels>
        }
    </FodCardContent>
</FodCard>
```

### 7. Gestionarea Erorilor

```csharp
try
{
    var cost = await CostCalculator.Calculate(request);
}
catch (HttpRequestException ex)
{
    // Eroare de rețea
    Logger.LogError(ex, "Eroare conexiune serviciu calcul cost");
    throw new ServiceException("Serviciul de calcul cost nu este disponibil");
}
catch (TaskCanceledException ex)
{
    // Timeout
    Logger.LogError(ex, "Timeout calcul cost");
    throw new ServiceException("Calculul costului a durat prea mult");
}
catch (Exception ex)
{
    // Alte erori
    Logger.LogError(ex, "Eroare necunoscută calcul cost");
    throw;
}
```

### 8. Cache și Performanță

```csharp
public class CachedCostCalculatorService<T> : ICostCalculatorService<T> 
    where T : FodRequestModel
{
    private readonly ICostCalculatorService<T> _innerService;
    private readonly IMemoryCache _cache;
    
    public async Task<FodRequestCostModel> Calculate(T requestModel)
    {
        var cacheKey = GenerateCacheKey(requestModel);
        
        if (_cache.TryGetValue<FodRequestCostModel>(cacheKey, out var cached))
        {
            return cached;
        }
        
        var result = await _innerService.Calculate(requestModel);
        
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(30));
        
        return result;
    }
}
```

### 9. Testare

```csharp
[TestClass]
public class CostCalculatorServiceTests
{
    private Mock<HttpMessageHandler> _httpMessageHandler;
    private ICostCalculatorService<TestRequestModel> _service;
    
    [TestInitialize]
    public void Setup()
    {
        _httpMessageHandler = new Mock<HttpMessageHandler>();
        var httpClient = new HttpClient(_httpMessageHandler.Object)
        {
            BaseAddress = new Uri("https://api.test.com")
        };
        
        _service = new CostCalculatorService<TestRequestModel>(httpClient);
    }
    
    [TestMethod]
    public async Task Calculate_ValidRequest_ReturnsCost()
    {
        // Arrange
        var request = new TestRequestModel 
        { 
            Type = new RequestType { Code = "TEST" } 
        };
        
        var expectedResponse = new FodRequestCostModel
        {
            TotalCost = 100,
            Currency = "MDL"
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _service.Calculate(request);
        
        // Assert
        Assert.AreEqual(100, result.TotalCost);
        Assert.AreEqual("MDL", result.Currency);
    }
}
```

### 10. Best Practices

1. **Validare input** - Validați modelul înainte de calcul
2. **Gestionare erori** - Tratați toate excepțiile posibile
3. **Cache** - Cache-uiți rezultatele pentru performanță
4. **Logging** - Logați toate cererile și erorile
5. **Timeout** - Setați timeout rezonabil pentru HTTP
6. **Retry policy** - Implementați retry pentru erori tranzitorii

### 11. Integrare cu Componente UI

```razor
<!-- Componentă wrapper pentru afișare cost -->
@typeparam TModel where TModel : FodRequestModel

<div class="cost-display">
    @if (IsLoading)
    {
        <FodSkeleton Type="SkeletonType.Text" />
    }
    else if (Cost != null)
    {
        <FodRequestCost Cost="@Cost" />
    }
    else if (HasError)
    {
        <FodAlert Severity="Severity.Error">
            Nu s-a putut calcula costul
        </FodAlert>
    }
</div>

@code {
    [Parameter] public TModel Model { get; set; }
    [Inject] private ICostCalculatorService<TModel> Calculator { get; set; }
    
    private FodRequestCostModel Cost;
    private bool IsLoading;
    private bool HasError;
    
    protected override async Task OnParametersSetAsync()
    {
        if (Model != null)
        {
            await LoadCost();
        }
    }
    
    private async Task LoadCost()
    {
        IsLoading = true;
        HasError = false;
        
        try
        {
            Cost = await Calculator.Calculate(Model);
        }
        catch
        {
            HasError = true;
        }
        finally
        {
            IsLoading = false;
        }
    }
}
```

### 12. Configurare Avansată

```csharp
// Configurare cu Polly pentru resilience
services.AddHttpClient<ICostCalculatorService<T>, CostCalculatorService<T>>()
    .AddPolicyHandler(GetRetryPolicy())
    .AddPolicyHandler(GetCircuitBreakerPolicy());

static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError()
        .WaitAndRetryAsync(
            3,
            retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
            onRetry: (outcome, timespan, retryCount, context) =>
            {
                Console.WriteLine($"Retry {retryCount} after {timespan}");
            });
}
```

### 13. Monitorizare

```csharp
public class MonitoredCostCalculatorService<T> : ICostCalculatorService<T>
    where T : FodRequestModel
{
    private readonly ICostCalculatorService<T> _innerService;
    private readonly IMetrics _metrics;
    
    public async Task<FodRequestCostModel> Calculate(T requestModel)
    {
        using var timer = _metrics.Measure.Timer.Time("cost_calculation_duration");
        
        try
        {
            var result = await _innerService.Calculate(requestModel);
            _metrics.Measure.Counter.Increment("cost_calculation_success");
            return result;
        }
        catch (Exception)
        {
            _metrics.Measure.Counter.Increment("cost_calculation_error");
            throw;
        }
    }
}
```

### 14. Concluzie

`CostCalculatorService` oferă o soluție robustă pentru calcularea costurilor serviciilor guvernamentale. Cu suport generic și integrare ușoară, serviciul simplifică implementarea calculatoarelor de cost în aplicațiile FOD, asigurând transparență și acuratețe în estimarea tarifelor.