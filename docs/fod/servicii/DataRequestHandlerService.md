# DataRequestHandlerService

## Documentație pentru serviciul DataRequestHandlerService

### 1. Descriere Generală

`DataRequestHandlerService` este un serviciu generic pentru procesarea cererilor de date cu suport pentru filtrare, sortare, căutare și paginare. Serviciul oferă o interfață unificată pentru manipularea datelor atât client-side cât și ca model pentru operațiuni server-side.

Caracteristici principale:
- Filtrare dinamică pe proprietăți
- Căutare keyword în câmpuri text
- Sortare ascendentă/descendentă
- Paginare cu suport skip/take
- Procesare în memorie pentru date client-side
- Model standardizat pentru operațiuni server-side
- Integrare seamless cu FODTable

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs

// Înregistrare automată prin AddFodComponents
builder.Services.AddFodComponents(configuration);

// Sau înregistrare manuală
builder.Services.AddScoped(typeof(IDataRequestHandlerService<>), 
                          typeof(DataRequestHandlerService<>));
```

### 3. Interfața IDataRequestHandlerService

```csharp
namespace FOD.Components.Services
{
    public interface IDataRequestHandlerService<SourceT>
    {
        DataResponse<SourceT> HandleRequest(IEnumerable<SourceT> source, DataRequest request);
    }
}
```

### 4. Metode Disponibile

| Metodă | Parametri | Return | Descriere |
|--------|-----------|--------|-----------|
| `HandleRequest` | `IEnumerable<SourceT> source, DataRequest request` | `DataResponse<SourceT>` | Procesează cererea de date aplicând filtre, sortare și paginare |

### 5. Modele de Date

#### DataRequest
```csharp
public class DataRequest
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public string Sort { get; set; } = string.Empty;
    public SortDirection SortDirection { get; set; } = SortDirection.Ascending;
    public string? Keyword { get; set; } = string.Empty;
    public List<string> SearchableColumns { get; set; }
    public object? Filter { get; set; }
}

// Versiune generică pentru type safety
public class DataRequest<T> : DataRequest
{
    public new T? Filter { get; set; }
}

public enum SortDirection
{
    Ascending = 0,
    Descending = 1
}
```

#### DataResponse
```csharp
public class DataResponse<T>
{
    public IEnumerable<T> Items { get; set; }
    public int Total { get; set; }
    
    // Proprietăți calculate utile
    public int PageCount => PageSize > 0 ? (int)Math.Ceiling(Total / (double)PageSize) : 0;
    public int PageSize { get; set; }
    public int CurrentPage { get; set; }
}
```

### 6. Exemple de Utilizare

#### Utilizare client-side simplă
```razor
@page "/lista-utilizatori"
@inject IDataRequestHandlerService<User> DataHandler

<FodContainer>
    <FodText Typo="Typo.h4" GutterBottom="true">
        Lista Utilizatori
    </FodText>
    
    <!-- Controale filtrare -->
    <FodCard Class="mb-3">
        <FodCardContent>
            <FodGrid Container="true" Spacing="3" AlignItems="Align.End">
                <FodGrid Item="true" xs="12" md="4">
                    <FodInput @bind-Value="searchKeyword" 
                              Label="Caută"
                              Placeholder="Nume, email..."
                              OnKeyUp="@(async (e) => { if (e.Key == "Enter") await Search(); })" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="3">
                    <FodSelect @bind-Value="filterRole" 
                               Label="Rol"
                               Items="@roleOptions"
                               OnChange="@(async () => await ApplyFilters())" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="3">
                    <FodSelect @bind-Value="sortField" 
                               Label="Sortare după"
                               Items="@sortOptions"
                               OnChange="@(async () => await ApplySort())" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="2">
                    <FodButton OnClick="ClearFilters" 
                               Variant="FodVariant.Outlined"
                               FullWidth="true">
                        Resetează
                    </FodButton>
                </FodGrid>
            </FodGrid>
        </FodCardContent>
    </FodCard>
    
    <!-- Tabel rezultate -->
    <FodCard>
        <FodCardContent>
            @if (response == null)
            {
                <FodLoadingLinear Indeterminate="true" />
            }
            else
            {
                <FodDataTable Items="@response.Items" 
                              Dense="true"
                              ShowPagination="false">
                    <HeaderContent>
                        <FodTHeadRow>
                            <FodTh>Nume</FodTh>
                            <FodTh>Email</FodTh>
                            <FodTh>Rol</FodTh>
                            <FodTh>Status</FodTh>
                            <FodTh>Data Înregistrării</FodTh>
                        </FodTHeadRow>
                    </HeaderContent>
                    <RowTemplate>
                        <FodTr>
                            <FodTd>@context.FullName</FodTd>
                            <FodTd>@context.Email</FodTd>
                            <FodTd>
                                <FodChip Size="FodSize.Small">
                                    @context.Role
                                </FodChip>
                            </FodTd>
                            <FodTd>
                                <FodChip Color="@(context.IsActive ? FodColor.Success : FodColor.Error)" 
                                         Size="FodSize.Small">
                                    @(context.IsActive ? "Activ" : "Inactiv")
                                </FodChip>
                            </FodTd>
                            <FodTd>@context.CreatedDate.ToString("dd.MM.yyyy")</FodTd>
                        </FodTr>
                    </RowTemplate>
                </FodDataTable>
                
                <!-- Paginare manuală -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <FodText Typo="Typo.body2">
                        Afișare @((currentPage - 1) * pageSize + 1) - 
                        @(Math.Min(currentPage * pageSize, response.Total)) 
                        din @response.Total
                    </FodText>
                    <FodPagination Count="@response.PageCount" 
                                   @bind-Selected="currentPage"
                                   OnChange="@(async () => await LoadData())" />
                </div>
            }
        </FodCardContent>
    </FodCard>
</FodContainer>

@code {
    private List<User> allUsers = new();
    private DataResponse<User> response;
    private DataRequest request = new();
    
    // Filtre
    private string searchKeyword;
    private string filterRole;
    private string sortField = "FullName";
    private int currentPage = 1;
    private int pageSize = 10;
    
    // Opțiuni dropdown
    private List<SelectableItem> roleOptions = new()
    {
        new("", "Toate"),
        new("Admin", "Administrator"),
        new("User", "Utilizator"),
        new("Manager", "Manager")
    };
    
    private List<SelectableItem> sortOptions = new()
    {
        new("FullName", "Nume"),
        new("Email", "Email"),
        new("CreatedDate", "Data înregistrării"),
        new("Role", "Rol")
    };
    
    protected override async Task OnInitializedAsync()
    {
        // Încarcă date inițiale
        allUsers = await LoadUsersFromDatabase();
        await LoadData();
    }
    
    private async Task LoadData()
    {
        request.Page = currentPage;
        request.PageSize = pageSize;
        request.Sort = sortField;
        request.SortDirection = SortDirection.Ascending;
        request.Keyword = searchKeyword;
        request.SearchableColumns = new() { "FullName", "Email", "Role" };
        
        // Aplicare filtru rol
        if (!string.IsNullOrEmpty(filterRole))
        {
            request.Filter = new { Role = filterRole };
        }
        
        // Procesare date
        response = DataHandler.HandleRequest(allUsers, request);
        StateHasChanged();
    }
    
    private async Task Search()
    {
        currentPage = 1; // Reset la prima pagină
        await LoadData();
    }
    
    private async Task ApplyFilters()
    {
        currentPage = 1;
        await LoadData();
    }
    
    private async Task ApplySort()
    {
        await LoadData();
    }
    
    private async Task ClearFilters()
    {
        searchKeyword = string.Empty;
        filterRole = string.Empty;
        sortField = "FullName";
        currentPage = 1;
        await LoadData();
    }
}
```

#### Integrare cu FODTable
```razor
@inject IDataRequestHandlerService<Product> DataHandler

<FODTable Items="@products"
          ServerData="@LoadServerData"
          Dense="true"
          Hover="true"
          ShowPagination="true"
          RowsPerPageOptions="new[] { 5, 10, 25, 50 }"
          SearchableColumns="new[] { nameof(Product.Name), nameof(Product.Description) }"
          @bind-RowsPerPage="rowsPerPage">
    <HeaderContent>
        <FodTHeadRow>
            <FodTh>
                <FodTableSortLabel InitialDirection="SortDirection.Ascending"
                                   SortBy="p => p.Name">
                    Produs
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel SortBy="p => p.Price">
                    Preț
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel SortBy="p => p.Stock">
                    Stoc
                </FodTableSortLabel>
            </FodTh>
        </FodTHeadRow>
    </HeaderContent>
    <RowTemplate>
        <FodTr>
            <FodTd>
                <div>
                    <FodText>@context.Name</FodText>
                    <FodText Typo="Typo.caption">@context.Description</FodText>
                </div>
            </FodTd>
            <FodTd>@context.Price.ToString("C")</FodTd>
            <FodTd>
                <FodChip Color="@GetStockColor(context.Stock)" Size="FodSize.Small">
                    @context.Stock
                </FodChip>
            </FodTd>
        </FodTr>
    </RowTemplate>
</FODTable>

@code {
    private List<Product> products = new();
    private int rowsPerPage = 10;
    
    private async Task<DataResponse<Product>> LoadServerData(DataRequest request)
    {
        // Pentru date server-side, trimite request la API
        var response = await ProductService.GetProducts(request);
        return response;
    }
    
    private FodColor GetStockColor(int stock)
    {
        return stock switch
        {
            0 => FodColor.Error,
            < 10 => FodColor.Warning,
            _ => FodColor.Success
        };
    }
}
```

#### Serviciu cu filtrare avansată
```csharp
public class AdvancedDataService<T>
{
    private readonly IDataRequestHandlerService<T> _dataHandler;
    
    public DataResponse<T> GetFilteredData(
        IEnumerable<T> source, 
        DataRequest request,
        Dictionary<string, Func<T, bool>> customFilters)
    {
        // Aplicare filtre custom înainte de procesare standard
        var filteredSource = source;
        
        foreach (var filter in customFilters)
        {
            filteredSource = filteredSource.Where(filter.Value);
        }
        
        // Procesare standard
        return _dataHandler.HandleRequest(filteredSource, request);
    }
    
    public DataResponse<T> GetDataWithComplexFilter<TFilter>(
        IEnumerable<T> source,
        DataRequest<TFilter> request) where TFilter : class
    {
        var baseRequest = new DataRequest
        {
            Page = request.Page,
            PageSize = request.PageSize,
            Sort = request.Sort,
            SortDirection = request.SortDirection,
            Keyword = request.Keyword,
            SearchableColumns = request.SearchableColumns
        };
        
        // Aplicare filtru complex
        if (request.Filter != null)
        {
            var filteredSource = ApplyComplexFilter(source, request.Filter);
            return _dataHandler.HandleRequest(filteredSource, baseRequest);
        }
        
        return _dataHandler.HandleRequest(source, baseRequest);
    }
    
    private IEnumerable<T> ApplyComplexFilter<TFilter>(
        IEnumerable<T> source, 
        TFilter filter) where TFilter : class
    {
        var query = source.AsQueryable();
        var filterType = typeof(TFilter);
        var itemType = typeof(T);
        
        foreach (var filterProp in filterType.GetProperties())
        {
            var filterValue = filterProp.GetValue(filter);
            if (filterValue == null) continue;
            
            var itemProp = itemType.GetProperty(filterProp.Name);
            if (itemProp == null) continue;
            
            // Construire expresie de filtrare
            var parameter = Expression.Parameter(itemType, "x");
            var property = Expression.Property(parameter, itemProp);
            var constant = Expression.Constant(filterValue);
            
            Expression comparison;
            
            if (filterValue is string strValue && !string.IsNullOrEmpty(strValue))
            {
                // Pentru string folosim Contains
                var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                comparison = Expression.Call(property, containsMethod, constant);
            }
            else
            {
                // Pentru alte tipuri folosim Equal
                comparison = Expression.Equal(property, constant);
            }
            
            var lambda = Expression.Lambda<Func<T, bool>>(comparison, parameter);
            query = query.Where(lambda);
        }
        
        return query;
    }
}
```

### 7. Extensii pentru DataRequest

```csharp
public static class DataRequestExtensions
{
    public static DataRequest WithPaging(this DataRequest request, int page, int pageSize)
    {
        request.Page = page;
        request.PageSize = pageSize;
        return request;
    }
    
    public static DataRequest WithSort(this DataRequest request, string sortBy, 
        SortDirection direction = SortDirection.Ascending)
    {
        request.Sort = sortBy;
        request.SortDirection = direction;
        return request;
    }
    
    public static DataRequest WithSearch(this DataRequest request, string keyword, 
        params string[] searchableColumns)
    {
        request.Keyword = keyword;
        request.SearchableColumns = searchableColumns?.ToList() ?? new List<string>();
        return request;
    }
    
    public static DataRequest<T> WithFilter<T>(this DataRequest request, T filter) 
        where T : class
    {
        return new DataRequest<T>
        {
            Page = request.Page,
            PageSize = request.PageSize,
            Sort = request.Sort,
            SortDirection = request.SortDirection,
            Keyword = request.Keyword,
            SearchableColumns = request.SearchableColumns,
            Filter = filter
        };
    }
}

// Utilizare
var request = new DataRequest()
    .WithPaging(1, 20)
    .WithSort("Name", SortDirection.Ascending)
    .WithSearch("admin", "Name", "Email", "Role");
```

### 8. Server-side implementation pattern

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    
    [HttpPost("search")]
    public async Task<ActionResult<DataResponse<UserDto>>> Search([FromBody] DataRequest request)
    {
        try
        {
            // Construire query bazat pe DataRequest
            var query = _userService.GetUsersQuery();
            
            // Aplicare căutare
            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                var keyword = request.Keyword.ToLower();
                query = query.Where(u => 
                    u.FullName.ToLower().Contains(keyword) ||
                    u.Email.ToLower().Contains(keyword));
            }
            
            // Aplicare filtre
            if (request.Filter != null)
            {
                var filter = JsonSerializer.Deserialize<UserFilter>(
                    JsonSerializer.Serialize(request.Filter));
                
                if (!string.IsNullOrEmpty(filter?.Role))
                    query = query.Where(u => u.Role == filter.Role);
                
                if (filter?.IsActive.HasValue == true)
                    query = query.Where(u => u.IsActive == filter.IsActive.Value);
            }
            
            // Total înainte de paginare
            var total = await query.CountAsync();
            
            // Aplicare sortare
            query = ApplySorting(query, request.Sort, request.SortDirection);
            
            // Aplicare paginare
            var items = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Role = u.Role,
                    IsActive = u.IsActive,
                    CreatedDate = u.CreatedDate
                })
                .ToListAsync();
            
            return Ok(new DataResponse<UserDto>
            {
                Items = items,
                Total = total
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching users");
            return StatusCode(500, "An error occurred while searching users");
        }
    }
    
    private IQueryable<User> ApplySorting(IQueryable<User> query, 
        string sortBy, SortDirection direction)
    {
        var parameter = Expression.Parameter(typeof(User), "u");
        var property = Expression.Property(parameter, sortBy ?? "Id");
        var lambda = Expression.Lambda(property, parameter);
        
        var methodName = direction == SortDirection.Ascending ? "OrderBy" : "OrderByDescending";
        var resultExpression = Expression.Call(
            typeof(Queryable),
            methodName,
            new Type[] { typeof(User), property.Type },
            query.Expression,
            Expression.Quote(lambda));
        
        return query.Provider.CreateQuery<User>(resultExpression);
    }
}
```

### 9. Cache pentru rezultate

```csharp
public class CachedDataRequestHandler<T> : IDataRequestHandlerService<T>
{
    private readonly IDataRequestHandlerService<T> _innerHandler;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachedDataRequestHandler<T>> _logger;
    
    public DataResponse<T> HandleRequest(IEnumerable<T> source, DataRequest request)
    {
        // Generare cache key
        var cacheKey = GenerateCacheKey(source, request);
        
        if (_cache.TryGetValue<DataResponse<T>>(cacheKey, out var cached))
        {
            _logger.LogDebug("Returning cached data for key: {CacheKey}", cacheKey);
            return cached;
        }
        
        var result = _innerHandler.HandleRequest(source, request);
        
        // Cache pentru 5 minute
        _cache.Set(cacheKey, result, new MemoryCacheEntryOptions
        {
            SlidingExpiration = TimeSpan.FromMinutes(5),
            Size = EstimateSize(result)
        });
        
        return result;
    }
    
    private string GenerateCacheKey(IEnumerable<T> source, DataRequest request)
    {
        var sourceHash = source.GetHashCode();
        var requestHash = HashCode.Combine(
            request.Page,
            request.PageSize,
            request.Sort,
            request.SortDirection,
            request.Keyword,
            request.Filter?.GetHashCode() ?? 0
        );
        
        return $"DataRequest_{typeof(T).Name}_{sourceHash}_{requestHash}";
    }
    
    private long EstimateSize(DataResponse<T> response)
    {
        // Estimare simplă: 1KB per item
        return response.Items.Count() * 1024;
    }
}
```

### 10. Monitorizare performanță

```csharp
public class MonitoredDataRequestHandler<T> : IDataRequestHandlerService<T>
{
    private readonly IDataRequestHandlerService<T> _innerHandler;
    private readonly IMetricsCollector _metrics;
    
    public DataResponse<T> HandleRequest(IEnumerable<T> source, DataRequest request)
    {
        using var activity = Activity.StartActivity("DataRequestHandler.HandleRequest");
        activity?.SetTag("item.type", typeof(T).Name);
        activity?.SetTag("request.page", request.Page);
        activity?.SetTag("request.pageSize", request.PageSize);
        
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            var sourceCount = source.Count();
            activity?.SetTag("source.count", sourceCount);
            
            var result = _innerHandler.HandleRequest(source, request);
            
            stopwatch.Stop();
            
            _metrics.RecordHistogram(
                "data_request_duration",
                stopwatch.ElapsedMilliseconds,
                new KeyValuePair<string, object>("type", typeof(T).Name),
                new KeyValuePair<string, object>("source_count", sourceCount),
                new KeyValuePair<string, object>("result_count", result.Items.Count())
            );
            
            activity?.SetTag("result.count", result.Items.Count());
            activity?.SetTag("result.total", result.Total);
            
            return result;
        }
        catch (Exception ex)
        {
            activity?.RecordException(ex);
            _metrics.RecordCounter("data_request_errors", 1,
                new KeyValuePair<string, object>("type", typeof(T).Name));
            throw;
        }
    }
}
```

### 11. Testare

```csharp
[TestClass]
public class DataRequestHandlerServiceTests
{
    private IDataRequestHandlerService<TestItem> _handler;
    private List<TestItem> _testData;
    
    [TestInitialize]
    public void Setup()
    {
        _handler = new DataRequestHandlerService<TestItem>();
        _testData = GenerateTestData(100);
    }
    
    [TestMethod]
    public void HandleRequest_WithPaging_ReturnsCorrectPage()
    {
        // Arrange
        var request = new DataRequest
        {
            Page = 2,
            PageSize = 10
        };
        
        // Act
        var result = _handler.HandleRequest(_testData, request);
        
        // Assert
        Assert.AreEqual(10, result.Items.Count());
        Assert.AreEqual(100, result.Total);
        Assert.AreEqual("Item 11", result.Items.First().Name);
    }
    
    [TestMethod]
    public void HandleRequest_WithKeywordSearch_FiltersCorrectly()
    {
        // Arrange
        var request = new DataRequest
        {
            Page = 1,
            PageSize = 50,
            Keyword = "special",
            SearchableColumns = new List<string> { "Name", "Description" }
        };
        
        // Act
        var result = _handler.HandleRequest(_testData, request);
        
        // Assert
        Assert.IsTrue(result.Items.All(i => 
            i.Name.Contains("special", StringComparison.OrdinalIgnoreCase) ||
            i.Description.Contains("special", StringComparison.OrdinalIgnoreCase)));
    }
    
    [TestMethod]
    public void HandleRequest_WithSorting_SortsCorrectly()
    {
        // Arrange
        var request = new DataRequest
        {
            Page = 1,
            PageSize = 100,
            Sort = "Value",
            SortDirection = SortDirection.Descending
        };
        
        // Act
        var result = _handler.HandleRequest(_testData, request);
        var items = result.Items.ToList();
        
        // Assert
        for (int i = 1; i < items.Count; i++)
        {
            Assert.IsTrue(items[i - 1].Value >= items[i].Value);
        }
    }
    
    private List<TestItem> GenerateTestData(int count)
    {
        return Enumerable.Range(1, count)
            .Select(i => new TestItem
            {
                Id = i,
                Name = $"Item {i}",
                Description = i % 10 == 0 ? "Special item" : "Regular item",
                Value = Random.Shared.Next(1, 1000)
            })
            .ToList();
    }
}

public class TestItem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int Value { get; set; }
}
```

### 12. Best Practices

1. **Paginare obligatorie** - Întotdeauna folosiți paginare pentru seturi mari de date
2. **Căutare indexată** - Pentru performanță, indexați câmpurile searchable
3. **Filtre type-safe** - Folosiți DataRequest<T> pentru filtre complexe
4. **Cache rezultate** - Cache-uiți rezultatele pentru date statice
5. **Limitare rezultate** - Setați un PageSize maxim (ex: 100)
6. **Validare sort fields** - Validați că proprietatea de sortare există
7. **Monitorizare** - Urmăriți performanța pentru query-uri grele

### 13. Concluzie

`DataRequestHandlerService` oferă o soluție completă și flexibilă pentru procesarea cererilor de date în aplicațiile FOD. Cu suport pentru toate operațiunile comune de manipulare a datelor și o arhitectură extensibilă, serviciul facilitează implementarea rapidă a funcționalităților de listare, căutare și filtrare atât pentru scenarii client-side cât și server-side.