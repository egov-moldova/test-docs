# FODTable

## Descriere Generală

`FODTable` este componenta principală pentru afișarea datelor tabulare în FOD.Components. Oferă funcționalități avansate precum sortare, paginare, căutare, editare inline și expandare detalii. Componenta suportă atât date locale cât și server-side cu încărcare asincronă.

## Utilizare de Bază

```razor
<!-- Tabel simplu cu date locale -->
<FODTable Source="@users">
    <Columns>
        <FODTableColumn Name="Name" Title="Nume" />
        <FODTableColumn Name="Email" Title="Email" />
        <FODTableColumn Name="Role" Title="Rol" />
    </Columns>
</FODTable>

<!-- Tabel cu server data -->
<FODTable ServerData="@LoadServerData" PageSize="10">
    <Columns>
        <FODTableColumn Name="Id" Title="ID" Sortable="true" />
        <FODTableColumn Name="Title" Title="Titlu" Searchable="true" />
        <FODTableColumn Name="Status" Title="Status" />
    </Columns>
</FODTable>

@code {
    private List<User> users = new();
    
    private async Task<DataResponse<Product>> LoadServerData(DataRequest request)
    {
        // Încărcare date de pe server
        return await ProductService.GetPaginatedData(request);
    }
}
```

## Atribute Disponibile

### Proprietăți Principale

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Source | IEnumerable<RowT> | null | Date locale pentru tabel |
| ServerData | Func<DataRequest, Task<DataResponse<RowT>>> | null | Funcție pentru încărcare server-side |
| Columns | RenderFragment<RowT> | - | Definirea coloanelor |
| DetailsColumns | RenderFragment<RowT> | null | Coloane pentru zona expandată |
| UpdateRow | Func<RowT, Task> | null | Funcție pentru actualizare rând |

### Paginare și Căutare

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| HidePagination | bool | false | Ascunde paginarea |
| PageSize | int | 10 | Număr elemente per pagină |
| PagerPosition | PagerPosition | Bottom | Poziție paginator |
| ShowSearchBar | bool | false | Afișează bara de căutare |
| SearchFields | string[] | null | Câmpuri adiț. pentru căutare |

### Aspect și Stil

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| TableClass | string | - | Clase CSS pentru tabel |
| HeaderCssClass | string | - | Clase CSS pentru header |
| ShowDetails | bool | false | Permite expandare rânduri |
| RowMarkers | RenderFragment | null | Marcaje custom pentru rânduri |

## Evenimente

| Eveniment | Descriere |
|-----------|-----------|
| ReloadData() | Reîncarcă datele tabelului |
| UpdateData(object) | Actualizează un rând specific |

## Componente Asociate

### FODTableColumn

Definește o coloană în tabel.

```razor
<FODTableColumn Name="@nameof(User.Name)" 
                Title="Nume Complet"
                Sortable="true"
                Searchable="true"
                Format="@((value) => value?.ToString().ToUpper())"
                Style="width: 200px" />
```

**Atribute FODTableColumn:**

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Name | string | - | Numele proprietății |
| Title | string | - | Titlul coloanei |
| Sortable | bool | false | Permite sortare |
| Searchable | bool | false | Include în căutare |
| Editable | bool | false | Permite editare inline |
| Format | Func<object, string> | null | Funcție formatare |
| BackgroundColorFunc | Func<object, string> | null | Culoare fundal dinamic |
| Hidden | bool | false | Ascunde coloana |
| IsMultiple | bool | false | Pentru colecții |
| Style | string | - | Stil CSS |
| CellContentStyle | string | - | Stil pentru celulă |
| CellTitle | string | null | Tooltip celulă |

### FODTableRow

Reprezintă un rând în tabel. Generat automat de FODTable.

### FODTablePager

Componenta de paginare. Generată automat când paginarea e activă.

### FODTableSearch

Bara de căutare. Afișată când ShowSearchBar="true".

## Exemple Avansate

### Tabel cu Sortare și Căutare

```razor
<FODTable @ref="tableRef" 
          Source="@products" 
          ShowSearchBar="true"
          PageSize="20">
    <Columns>
        <FODTableColumn Name="@nameof(Product.Code)" 
                        Title="Cod" 
                        Sortable="true" />
        
        <FODTableColumn Name="@nameof(Product.Name)" 
                        Title="Denumire" 
                        Sortable="true" 
                        Searchable="true" />
        
        <FODTableColumn Name="@nameof(Product.Price)" 
                        Title="Preț" 
                        Sortable="true"
                        Format="@(v => $"{v:C2}")" />
        
        <FODTableColumn Name="@nameof(Product.Stock)" 
                        Title="Stoc"
                        BackgroundColorFunc="@GetStockColor" />
    </Columns>
</FODTable>

@code {
    private FODTable<Product> tableRef;
    private List<Product> products = new();
    
    private string GetStockColor(object value)
    {
        if (value is int stock)
        {
            if (stock <= 0) return "#ffebee"; // Roșu deschis
            if (stock < 10) return "#fff3e0"; // Portocaliu deschis
            return ""; // Default
        }
        return "";
    }
}
```

### Tabel cu Server-Side Data

```razor
<FODTable ServerData="@LoadData" 
          PageSize="25"
          ShowSearchBar="true">
    <Columns>
        <FODTableColumn Name="OrderNumber" 
                        Title="Nr. Comandă" 
                        Sortable="true" />
        
        <FODTableColumn Name="CustomerName" 
                        Title="Client" 
                        Searchable="true" />
        
        <FODTableColumn Name="OrderDate" 
                        Title="Data"
                        Format="@(v => ((DateTime)v).ToString("dd.MM.yyyy"))" />
        
        <FODTableColumn Name="Status" 
                        Title="Status">
            <Markers>
                <FodChip Color="@GetStatusColor(context)"
                         Size="FodSize.Small">
                    @context
                </FodChip>
            </Markers>
        </FODTableColumn>
    </Columns>
</FODTable>

@code {
    private async Task<DataResponse<Order>> LoadData(DataRequest request)
    {
        // Construiește query bazat pe request
        var query = DbContext.Orders.AsQueryable();
        
        // Aplicare căutare
        if (!string.IsNullOrEmpty(request.Keyword))
        {
            query = query.Where(o => 
                o.CustomerName.Contains(request.Keyword) ||
                o.OrderNumber.Contains(request.Keyword));
        }
        
        // Aplicare sortare
        if (!string.IsNullOrEmpty(request.Sort))
        {
            query = request.SortDirection == SortDirection.Ascending
                ? query.OrderBy(request.Sort)
                : query.OrderByDescending(request.Sort);
        }
        
        // Total înainte de paginare
        var total = await query.CountAsync();
        
        // Aplicare paginare
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();
            
        return new DataResponse<Order>
        {
            Items = items,
            Total = total
        };
    }
}
```

### Tabel cu Editare Inline

```razor
<FODTable Source="@settings" UpdateRow="@UpdateSetting">
    <Columns>
        <FODTableColumn Name="Key" Title="Parametru" />
        
        <FODTableColumn Name="Value" 
                        Title="Valoare"
                        Editable="true"
                        EditableItems="@GetEditableValues" />
        
        <FODTableColumn Name="Description" Title="Descriere" />
    </Columns>
</FODTable>

@code {
    private List<Setting> settings = new();
    
    private async Task UpdateSetting(Setting setting)
    {
        await SettingsService.UpdateAsync(setting);
        // Reîncarcă datele
        await LoadSettings();
    }
    
    private IEnumerable<SelectableItem> GetEditableValues(object row)
    {
        if (row is Setting setting)
        {
            switch (setting.Key)
            {
                case "Theme":
                    return new[] 
                    { 
                        new SelectableItem("light", "Light"),
                        new SelectableItem("dark", "Dark") 
                    };
                case "Language":
                    return new[] 
                    { 
                        new SelectableItem("ro", "Română"),
                        new SelectableItem("en", "English") 
                    };
            }
        }
        return Enumerable.Empty<SelectableItem>();
    }
}
```

### Tabel cu Rânduri Expandabile

```razor
<FODTable Source="@orders" ShowDetails="true">
    <Columns>
        <FODTableColumn Name="OrderNumber" Title="Comandă" />
        <FODTableColumn Name="Date" Title="Data" />
        <FODTableColumn Name="Total" Title="Total" Format="@(v => $"{v:C2}")" />
    </Columns>
    
    <DetailsColumns>
        @{
            var order = context as Order;
        }
        <div class="order-details p-3">
            <h6>Produse comandate:</h6>
            <table class="table table-sm">
                @foreach (var item in order.Items)
                {
                    <tr>
                        <td>@item.ProductName</td>
                        <td>@item.Quantity</td>
                        <td>@item.Price.ToString("C2")</td>
                    </tr>
                }
            </table>
            
            <div class="mt-3">
                <strong>Adresă livrare:</strong> @order.ShippingAddress
            </div>
        </div>
    </DetailsColumns>
</FODTable>
```

### Tabel cu Marcaje Rânduri

```razor
<FODTable Source="@tasks">
    <RowMarkers>
        <FODTableRowMarker Color="@GetRowColor()" />
    </RowMarkers>
    
    <Columns>
        <FODTableColumn Name="Title" Title="Task" />
        <FODTableColumn Name="Assignee" Title="Responsabil" />
        <FODTableColumn Name="DueDate" Title="Termen" />
        <FODTableColumn Name="Status" Title="Status" />
    </Columns>
</FODTable>

@code {
    private string GetRowColor()
    {
        // Logică pentru culoare bazată pe context
        return "red"; // sau "green", "yellow", etc.
    }
}
```

### Tabel cu Template-uri Custom

```razor
<FODTable Source="@employees">
    <Columns>
        <FODTableColumn Name="Photo" Title="">
            <Markers>
                <FodAvatar Image="@GetPhotoUrl(context)" Size="FodSize.Small" />
            </Markers>
        </FODTableColumn>
        
        <FODTableColumn Name="Name" Title="Angajat">
            <Markers>
                <div>
                    <strong>@(context as Employee).Name</strong><br/>
                    <small class="text-muted">@(context as Employee).Department</small>
                </div>
            </Markers>
        </FODTableColumn>
        
        <FODTableColumn Name="Actions" Title="">
            <Markers>
                <FodIconButton Icon="edit" Size="FodSize.Small" 
                              OnClick="@(() => EditEmployee(context as Employee))" />
                <FodIconButton Icon="delete" Size="FodSize.Small" Color="FodColor.Error"
                              OnClick="@(() => DeleteEmployee(context as Employee))" />
            </Markers>
        </FODTableColumn>
    </Columns>
</FODTable>
```

## Modele de Date

### DataRequest

```csharp
public class DataRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string Sort { get; set; }
    public SortDirection SortDirection { get; set; }
    public string Keyword { get; set; }
    public List<string> SearchableColumns { get; set; }
    public object Filter { get; set; }
}
```

### DataResponse<T>

```csharp
public class DataResponse<T>
{
    public IEnumerable<T> Items { get; set; }
    public int Total { get; set; }
}
```

### TableContext<T>

Context partajat între componentele tabelului.

```csharp
public class TableContext<T>
{
    public FODTable<T> Table { get; set; }
    public DataState DataState { get; set; } = new();
}
```

## Stilizare

### Clase CSS

```css
.table
.sortable
.fod-table-search
.fod-table-pager
.fod-table-row
.fod-table-row-expanded
```

### Personalizare Aspect

```razor
<FODTable TableClass="table table-striped table-hover"
          HeaderCssClass="table-dark">
    <!-- Coloane -->
</FODTable>
```

## Servicii Asociate

### IDataRequestHandlerService<T>

Service pentru procesarea datelor locale (sortare, filtrare, paginare).

```csharp
public interface IDataRequestHandlerService<T>
{
    DataResponse<T> HandleRequest(IEnumerable<T> source, DataRequest request);
}
```

## Note și Observații

1. **Generic Type** - FODTable<RowT> necesită specificarea tipului rândului
2. **Performance** - Pentru date mari, folosiți ServerData în loc de Source
3. **Căutare** - Căutarea funcționează doar pe coloane marcate ca Searchable
4. **Sortare** - Sortarea locală folosește reflection pentru acces proprietăți
5. **Editare** - Editarea inline necesită implementarea UpdateRow

## Bune Practici

1. Folosiți ServerData pentru seturi mari de date
2. Limitați numărul de coloane searchable pentru performanță
3. Implementați paginare pentru mai mult de 50 rânduri
4. Folosiți Format pentru afișare consistentă
5. Adăugați loading state pentru operații asincrone
6. Validați datele înainte de salvare în UpdateRow
7. Folosiți DetailsColumns pentru informații secundare

## Concluzie

FODTable oferă o soluție completă pentru afișarea și manipularea datelor tabulare în aplicații Blazor. Cu suport pentru sortare, căutare, paginare și editare, componenta acoperă majoritatea necesităților pentru lucrul cu date structurate.