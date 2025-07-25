# FodFilter

## Documentație pentru componenta FodFilter

### 1. Descriere Generală

`FodFilter` este o componentă generică pentru filtrarea datelor în tabele. Oferă o interfață de filtrare extensibilă cu suport pentru salvarea stării în sesiune, resetare și opțional printare.

Caracteristici principale:
- Componentă generică pentru orice tip de model de filtrare
- Salvare automată a stării filtrelor în sesiune
- UI colapsabil pentru economisirea spațiului
- Butoane pentru aplicare, resetare și printare
- Integrare cu context de tabel pentru filtrare
- Suport pentru cascading values
- Memorare filtru original pentru resetare

### 2. Utilizare de Bază

#### Filtru simplu pentru tabel
```razor
<FodFilter FilterT="ProductFilter" TableId="products-table">
    <FodInput Label="Nume produs" @bind-Value="context.Name" />
    <FodInput Label="Cod" @bind-Value="context.Code" />
</FodFilter>

<FodFilteredTable T="Product" FilterT="ProductFilter" 
                  Id="products-table"
                  Items="@products">
    <!-- Coloane tabel -->
</FodFilteredTable>

@code {
    public class ProductFilter
    {
        public string Name { get; set; }
        public string Code { get; set; }
    }
}
```

#### Filtru cu salvare în sesiune
```razor
<FodFilter FilterT="OrderFilter" 
           TableId="orders-table"
           ToSaveInSesion="true"
           ShowPrintTable="true">
    <FodDatePicker Label="De la data" @bind-Value="context.StartDate" />
    <FodDatePicker Label="Până la data" @bind-Value="context.EndDate" />
    <FodSelect T="OrderStatus" Label="Status" @bind-Value="context.Status">
        @foreach (var status in Enum.GetValues<OrderStatus>())
        {
            <FodSelectItem Value="@status">@status</FodSelectItem>
        }
    </FodSelect>
</FodFilter>
```

### 3. Parametri

| Parametru | Tip | Descriere | Valoare Implicită |
|-----------|-----|-----------|-------------------|
| `FilterT` | `Type` | Tipul generic al modelului de filtrare | - |
| `ChildContent` | `RenderFragment<FilterT>` | Conținutul filtrului (câmpuri) | - |
| `OnFilterTable` | `EventCallback<DataRequest<FilterT>>` | Eveniment la aplicare filtru | - |
| `ShowPrintTable` | `bool` | Afișează butonul de printare | `false` |
| `ToSaveInSesion` | `bool` | Salvează starea în sesiune | `false` |
| `ShowFilter` | `bool` | Afișează header-ul filtrului | `true` |
| `TableId` | `string` | ID unic pentru identificare tabel | - |
| `Filter` | `FilterT` | Instanța modelului de filtrare | `new FilterT()` |

### 4. Context și Integrare

Componenta necesită un `IFilterTableContext<FilterT>` furnizat prin CascadingParameter de la tabelul părinte.

### 5. Exemple Avansate

#### Filtru complex cu validare
```razor
<FodFilter FilterT="AdvancedFilter" 
           TableId="advanced-table"
           ToSaveInSesion="true"
           OnFilterTable="HandleFilterApplied">
    <div class="col-md-4">
        <FodInput Label="Căutare" @bind-Value="context.SearchTerm" />
    </div>
    <div class="col-md-4">
        <FodInputNumber Label="Preț minim" @bind-Value="context.MinPrice" />
    </div>
    <div class="col-md-4">
        <FodInputNumber Label="Preț maxim" @bind-Value="context.MaxPrice" />
    </div>
    <div class="col-md-6">
        <FodGroupSelect T="string" Label="Categorii" 
                        @bind-Value="context.CategoryId"
                        Items="@categories" />
    </div>
    <div class="col-md-6">
        <FodCheckbox Label="Doar în stoc" @bind-Value="context.InStockOnly" />
    </div>
</FodFilter>

@code {
    public class AdvancedFilter
    {
        public string SearchTerm { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string CategoryId { get; set; }
        public bool InStockOnly { get; set; }
        
        public bool IsValid()
        {
            if (MinPrice.HasValue && MaxPrice.HasValue)
                return MinPrice.Value <= MaxPrice.Value;
            return true;
        }
    }
    
    private async Task HandleFilterApplied(DataRequest<AdvancedFilter> request)
    {
        if (!request.Filter.IsValid())
        {
            await NotificationService.ShowError("Interval de preț invalid!");
            return;
        }
        
        // Procesare filtru
        await LoadFilteredData(request);
    }
}
```

#### Filtru cu preset-uri
```razor
<FodCard>
    <FodCardContent>
        <div class="mb-3">
            <FodButtonGroup>
                <FodButton OnClick="() => ApplyPreset('today')">Astăzi</FodButton>
                <FodButton OnClick="() => ApplyPreset('week')">Săptămâna aceasta</FodButton>
                <FodButton OnClick="() => ApplyPreset('month')">Luna aceasta</FodButton>
            </FodButtonGroup>
        </div>
        
        <FodFilter @ref="filterComponent"
                   FilterT="DateRangeFilter" 
                   TableId="reports-table"
                   Filter="@dateFilter">
            <div class="col-md-6">
                <FodDatePicker Label="Data început" @bind-Value="context.StartDate" />
            </div>
            <div class="col-md-6">
                <FodDatePicker Label="Data sfârșit" @bind-Value="context.EndDate" />
            </div>
        </FodFilter>
    </FodCardContent>
</FodCard>

@code {
    private FodFilter<DateRangeFilter> filterComponent;
    private DateRangeFilter dateFilter = new();
    
    private void ApplyPreset(string preset)
    {
        var today = DateTime.Today;
        
        switch (preset)
        {
            case "today":
                dateFilter.StartDate = today;
                dateFilter.EndDate = today;
                break;
            case "week":
                dateFilter.StartDate = today.AddDays(-(int)today.DayOfWeek);
                dateFilter.EndDate = today.AddDays(6 - (int)today.DayOfWeek);
                break;
            case "month":
                dateFilter.StartDate = new DateTime(today.Year, today.Month, 1);
                dateFilter.EndDate = dateFilter.StartDate.Value
                    .AddMonths(1).AddDays(-1);
                break;
        }
        
        StateHasChanged();
    }
}
```

#### Filtru dinamic bazat pe permisiuni
```razor
<FodFilter FilterT="UserBasedFilter" 
           TableId="data-table"
           ShowPrintTable="@userCanPrint">
    @if (userCanSeeAllData)
    {
        <div class="col-md-4">
            <FodSelect T="string" Label="Departament" 
                       @bind-Value="context.DepartmentId">
                @foreach (var dept in departments)
                {
                    <FodSelectItem Value="@dept.Id">@dept.Name</FodSelectItem>
                }
            </FodSelect>
        </div>
    }
    
    <div class="col-md-4">
        <FodInput Label="Număr document" @bind-Value="context.DocumentNumber" />
    </div>
    
    @if (userHasAdvancedFilters)
    {
        <div class="col-md-4">
            <FodSelect T="DocumentStatus" Label="Status" 
                       @bind-Value="context.Status">
                <!-- Opțiuni status -->
            </FodSelect>
        </div>
    }
</FodFilter>

@code {
    [CascadingParameter] private Task<AuthenticationState> AuthState { get; set; }
    
    private bool userCanPrint;
    private bool userCanSeeAllData;
    private bool userHasAdvancedFilters;
    
    protected override async Task OnInitializedAsync()
    {
        var authState = await AuthState;
        var user = authState.User;
        
        userCanPrint = user.HasClaim("permission", "print");
        userCanSeeAllData = user.HasClaim("permission", "view-all");
        userHasAdvancedFilters = user.HasClaim("permission", "advanced-filters");
    }
}
```

### 6. Stilizare CSS

```css
/* Card filter styling */
.fod-filter .card {
    margin-bottom: 1rem;
    border: 1px solid var(--fod-palette-divider);
}

.fod-filter .card-header {
    background-color: var(--fod-palette-background-paper);
    border-bottom: 1px solid var(--fod-palette-divider);
    padding: 0.75rem 1rem;
}

.fod-filter .btn-link {
    text-decoration: none;
    color: var(--fod-palette-text-primary);
    font-weight: 500;
}

.fod-filter .btn-link:hover {
    color: var(--fod-palette-primary-main);
}

/* Filter body */
.fod-filter .card-body {
    padding: 1.5rem;
    background-color: var(--fod-palette-grey-50);
}

/* Filter footer */
.fod-filter .card-footer {
    background-color: var(--fod-palette-background-paper);
    border-top: 1px solid var(--fod-palette-divider);
    padding: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .fod-filter .card-footer .text-md-end {
        margin-top: 0.5rem;
    }
}
```

### 7. Integrare cu Servicii

#### Salvare preferințe utilizator
```csharp
public class UserFilterPreferencesService
{
    private readonly ILocalStorageService _localStorage;
    
    public async Task SaveFilterPreset<T>(string tableId, string presetName, T filter)
    {
        var key = $"filter-preset-{tableId}-{presetName}";
        await _localStorage.SetItemAsync(key, filter);
    }
    
    public async Task<T> LoadFilterPreset<T>(string tableId, string presetName) 
        where T : new()
    {
        var key = $"filter-preset-{tableId}-{presetName}";
        return await _localStorage.GetItemAsync<T>(key) ?? new T();
    }
}
```

### 8. JavaScript Interop

Componenta folosește JavaScript pentru salvarea în sesiune:

```javascript
window.tableDataRequest = {
    get: function(tableId) {
        const key = `table-filter-${tableId}`;
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    
    set: function(dataRequest, tableId) {
        const key = `table-filter-${tableId}`;
        sessionStorage.setItem(key, JSON.stringify(dataRequest));
    }
};
```

### 9. Best Practices

1. **Model de filtrare simplu** - Păstrați modelul cât mai simplu
2. **Validare** - Validați filtrele înainte de aplicare
3. **Preset-uri** - Oferiți filtre predefinite pentru cazuri comune
4. **Performanță** - Debounce pentru filtre text
5. **Feedback** - Indicați când filtrul este activ
6. **Resetare clară** - Asigurați resetarea completă

### 10. Performanță

- Folosiți `ToSaveInSesion` cu moderație
- Implementați debouncing pentru input-uri text
- Cache-uiți rezultatele filtrării când e posibil
- Evitați filtre complexe pe seturi mari de date

### 11. Troubleshooting

#### Filtrul nu se aplică
- Verificați că TableContext este furnizat
- Verificați că TableId este unic
- Verificați că modelul de filtrare are constructor implicit

#### Resetarea nu funcționează
- Verificați că proprietățile sunt copiabile
- Evitați referințe complexe în modelul de filtrare
- Folosiți tipuri simple sau ICloneable

### 12. Exemplu Complet

```razor
@page "/products"

<h3>Produse</h3>

<FodFilter FilterT="ProductFilter" 
           TableId="products-main"
           ToSaveInSesion="true"
           ShowPrintTable="true"
           OnFilterTable="@HandlePrint">
    <div class="col-md-3">
        <FodInput Label="Nume" @bind-Value="context.Name" />
    </div>
    <div class="col-md-3">
        <FodSelect T="string" Label="Categorie" @bind-Value="context.CategoryId">
            <FodSelectItem Value="">Toate</FodSelectItem>
            @foreach (var cat in categories)
            {
                <FodSelectItem Value="@cat.Id">@cat.Name</FodSelectItem>
            }
        </FodSelect>
    </div>
    <div class="col-md-3">
        <FodInputNumber Label="Preț max" @bind-Value="context.MaxPrice" />
    </div>
    <div class="col-md-3">
        <FodCheckbox Label="În stoc" @bind-Value="context.InStock" />
    </div>
</FodFilter>

<FodFilteredTable T="Product" 
                  FilterT="ProductFilter"
                  Id="products-main"
                  Items="@products"
                  ServerSide="true"
                  OnLoadData="@LoadProducts">
    <FodColumn Title="Nume" Field="@(p => p.Name)" />
    <FodColumn Title="Categorie" Field="@(p => p.Category)" />
    <FodColumn Title="Preț" Field="@(p => p.Price)" Format="C" />
    <FodColumn Title="Stoc" Field="@(p => p.Stock)" />
</FodFilteredTable>

@code {
    private List<Product> products = new();
    private List<Category> categories = new();
    
    public class ProductFilter
    {
        public string Name { get; set; }
        public string CategoryId { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool InStock { get; set; }
    }
    
    private async Task LoadProducts(DataRequest<ProductFilter> request)
    {
        products = await ProductService.GetFilteredProducts(request);
    }
    
    private async Task HandlePrint(DataRequest<ProductFilter> request)
    {
        await PrintService.PrintFilteredTable("products", request);
    }
}
```

### 13. Concluzie

`FodFilter` oferă o soluție completă și flexibilă pentru filtrarea datelor în tabele. Cu suport pentru salvare în sesiune, resetare și o interfață intuitivă, componenta simplifică implementarea filtrelor complexe menținând performanța și experiența utilizatorului la un nivel optim.