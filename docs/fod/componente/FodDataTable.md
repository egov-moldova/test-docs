# DataTable

## Documentație pentru componenta FodDataTable

### 1. Descriere Generală
`FodDataTable` este o componentă avansată pentru afișarea datelor tabulare cu funcționalități complete de sortare, filtrare, paginare și personalizare. Este ideală pentru afișarea listelor de date complexe cu necesități de interacțiune avansată.

Componenta suportă:
- Sortare pe coloane
- Filtrare globală și pe coloane
- Paginare cu dimensiuni configurabile
- Selecție single/multiple
- Coloane personalizabile cu template-uri
- Grupare date
- Export date
- Responsive design
- Virtualizare pentru seturi mari de date

### 2. Ghid de Utilizare API

#### Tabel de bază
```razor
<FodDataTable Items="users" Class="elevation-1">
    <HeaderContent>
        <FodTHeadRow>
            <FodTh>Nume</FodTh>
            <FodTh>Email</FodTh>
            <FodTh>Rol</FodTh>
            <FodTh>Status</FodTh>
        </FodTHeadRow>
    </HeaderContent>
    <RowTemplate>
        <FodTr>
            <FodTd>@context.Name</FodTd>
            <FodTd>@context.Email</FodTd>
            <FodTd>@context.Role</FodTd>
            <FodTd>@context.Status</FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>

@code {
    private List<User> users = new List<User>
    {
        new User { Name = "Ion Popescu", Email = "ion@example.md", Role = "Admin", Status = "Activ" },
        new User { Name = "Maria Ionescu", Email = "maria@example.md", Role = "User", Status = "Activ" }
    };
}
```

#### Tabel cu sortare
```razor
<FodDataTable Items="products" @bind-SortBy="sortBy" @bind-SortDescending="sortDesc">
    <HeaderContent>
        <FodTHeadRow>
            <FodTh>
                <FodTableSortLabel SortBy="name" @bind-CurrentSortBy="@sortBy">
                    Nume Produs
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel SortBy="price" @bind-CurrentSortBy="@sortBy">
                    Preț
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel SortBy="stock" @bind-CurrentSortBy="@sortBy">
                    Stoc
                </FodTableSortLabel>
            </FodTh>
        </FodTHeadRow>
    </HeaderContent>
    <RowTemplate>
        <FodTr>
            <FodTd>@context.Name</FodTd>
            <FodTd>@context.Price.ToString("C")</FodTd>
            <FodTd>@context.Stock</FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>

@code {
    private string sortBy = "name";
    private bool sortDesc = false;
    private List<Product> products;
    
    protected override void OnInitialized()
    {
        products = GetProducts();
        SortProducts();
    }
    
    private void SortProducts()
    {
        products = sortBy switch
        {
            "name" => sortDesc ? products.OrderByDescending(p => p.Name).ToList() : products.OrderBy(p => p.Name).ToList(),
            "price" => sortDesc ? products.OrderByDescending(p => p.Price).ToList() : products.OrderBy(p => p.Price).ToList(),
            "stock" => sortDesc ? products.OrderByDescending(p => p.Stock).ToList() : products.OrderBy(p => p.Stock).ToList(),
            _ => products
        };
    }
}
```

#### Tabel cu filtrare
```razor
<FodDataTable Items="filteredItems" Search="true" SearchIcon="@FodIcons.Material.Filled.Search">
    <ToolbarContent>
        <FodTextField @bind-Value="searchString" 
                      Placeholder="Caută..." 
                      Adornment="Adornment.Start" 
                      AdornmentIcon="@FodIcons.Material.Filled.Search" 
                      IconSize="Size.Medium" 
                      Class="mt-0" />
    </ToolbarContent>
    <HeaderContent>
        <FodTHeadRow>
            <FodTh>Nume</FodTh>
            <FodTh>Descriere</FodTh>
            <FodTh>Categorie</FodTh>
        </FodTHeadRow>
    </HeaderContent>
    <RowTemplate>
        <FodTr>
            <FodTd>@context.Name</FodTd>
            <FodTd>@context.Description</FodTd>
            <FodTd>@context.Category</FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>

@code {
    private string searchString = "";
    private List<Item> allItems = GetItems();
    
    private List<Item> filteredItems => string.IsNullOrWhiteSpace(searchString) 
        ? allItems 
        : allItems.Where(x => 
            x.Name.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
            x.Description.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
            x.Category.Contains(searchString, StringComparison.OrdinalIgnoreCase)
        ).ToList();
}
```

#### Tabel cu paginare
```razor
<FodDataTable Items="pagedData" 
              @bind-Page="currentPage" 
              @bind-RowsPerPage="pageSize"
              TotalItems="totalItems"
              Paginate="true">
    <HeaderContent>
        <FodTHeadRow>
            <FodTh>ID</FodTh>
            <FodTh>Nume</FodTh>
            <FodTh>Data</FodTh>
            <FodTh>Status</FodTh>
        </FodTHeadRow>
    </HeaderContent>
    <RowTemplate>
        <FodTr>
            <FodTd>@context.Id</FodTd>
            <FodTd>@context.Name</FodTd>
            <FodTd>@context.Date.ToString("dd.MM.yyyy")</FodTd>
            <FodTd>
                <FodChip Color="@GetStatusColor(context.Status)" Size="Size.Small">
                    @context.Status
                </FodChip>
            </FodTd>
        </FodTr>
    </RowTemplate>
    <PagerContent>
        <FodTablePager PageSizeOptions="new int[] { 10, 25, 50, 100 }" />
    </PagerContent>
</FodDataTable>

@code {
    private int currentPage = 1;
    private int pageSize = 10;
    private int totalItems = 1000;
    
    private List<DataItem> pagedData => GetPagedData(currentPage, pageSize);
    
    private FodColor GetStatusColor(string status) => status switch
    {
        "Activ" => FodColor.Success,
        "Inactiv" => FodColor.Error,
        "Pending" => FodColor.Warning,
        _ => FodColor.Default
    };
}
```

#### Tabel cu selecție
```razor
<FodDataTable Items="items" 
              MultiSelection="true" 
              @bind-SelectedItems="selectedItems"
              SelectOnRowClick="true">
    <HeaderContent>
        <FodTHeadRow>
            <FodTh Style="width: 48px;">
                <FodCheckbox @bind-Checked="selectAll" />
            </FodTh>
            <FodTh>Nume</FodTh>
            <FodTh>Email</FodTh>
            <FodTh>Acțiuni</FodTh>
        </FodTHeadRow>
    </HeaderContent>
    <RowTemplate>
        <FodTr>
            <FodTd>
                <FodCheckbox @bind-Checked="@context.IsSelected" />
            </FodTd>
            <FodTd>@context.Name</FodTd>
            <FodTd>@context.Email</FodTd>
            <FodTd>
                <FodIconButton Icon="@FodIcons.Material.Filled.Edit" Size="Size.Small" />
                <FodIconButton Icon="@FodIcons.Material.Filled.Delete" Size="Size.Small" Color="FodColor.Error" />
            </FodTd>
        </FodTr>
    </RowTemplate>
    <FooterContent>
        <FodTFootRow>
            <FodTd Colspan="4">
                <FodText>@selectedItems.Count() elemente selectate</FodText>
            </FodTd>
        </FodTFootRow>
    </FooterContent>
</FodDataTable>

@code {
    private List<SelectableItem> items = GetItems();
    private IEnumerable<SelectableItem> selectedItems = new List<SelectableItem>();
    private bool selectAll = false;
}
```

#### Tabel cu grupare
```razor
<FodDataTable Items="groupedItems" GroupBy="Category">
    <GroupHeaderTemplate>
        <FodTableGroupRow>
            <FodTd Colspan="3">
                <FodText Typo="Typo.h6">@context.Key</FodText>
            </FodTd>
        </FodTableGroupRow>
    </GroupHeaderTemplate>
    <HeaderContent>
        <FodTHeadRow>
            <FodTh>Produs</FodTh>
            <FodTh>Preț</FodTh>
            <FodTh>Stoc</FodTh>
        </FodTHeadRow>
    </HeaderContent>
    <RowTemplate>
        <FodTr>
            <FodTd>@context.Name</FodTd>
            <FodTd>@context.Price MDL</FodTd>
            <FodTd>@context.Stock buc.</FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>
```

#### Tabel avansat cu toate funcționalitățile
```razor
<FodDataTable Items="@Elements" 
              FilterFunc="@FilterFunc" 
              @bind-SelectedItem="selectedElement"
              Dense="true"
              Hover="true"
              Striped="true"
              Bordered="true"
              Class="elevation-1">
    <!-- Toolbar personalizat -->
    <ToolbarContent>
        <FodText Typo="Typo.h6">Gestiune utilizatori</FodText>
        <FodSpacer />
        <FodTextField @bind-Value="searchString" 
                      Placeholder="Caută utilizatori..." 
                      Adornment="Adornment.Start" 
                      AdornmentIcon="@FodIcons.Material.Filled.Search" 
                      Class="mt-0 mx-4" />
        <FodButton StartIcon="@FodIcons.Material.Filled.Add" 
                   Color="FodColor.Primary" 
                   Variant="FodVariant.Filled">
            Adaugă utilizator
        </FodButton>
    </ToolbarContent>
    
    <!-- Coloane cu template personalizat -->
    <Columns>
        <FodColumn T="User" Field="Avatar" Title="">
            <CellTemplate>
                <FodIcon Icon="@FodIcons.Material.Filled.AccountCircle" 
                         Size="Size.Small" />
            </CellTemplate>
        </FodColumn>
        
        <FodColumn T="User" Field="Name" Title="Nume complet" Sortable="true">
            <CellTemplate>
                <FodText>@context.Item.FirstName @context.Item.LastName</FodText>
            </CellTemplate>
        </FodColumn>
        
        <FodColumn T="User" Field="Email" Title="Email" Sortable="true" />
        
        <FodColumn T="User" Field="Role" Title="Rol">
            <CellTemplate>
                <FodChip Color="@GetRoleColor(context.Item.Role)" Size="Size.Small">
                    @context.Item.Role
                </FodChip>
            </CellTemplate>
        </FodColumn>
        
        <FodColumn T="User" Field="Status" Title="Status">
            <CellTemplate>
                <FodSwitch @bind-Checked="@context.Item.IsActive" Color="FodColor.Success" />
            </CellTemplate>
        </FodColumn>
        
        <FodColumn T="User" Title="Acțiuni" Sortable="false">
            <CellTemplate>
                <FodMenu>
                    <ActivatorContent>
                        <FodIconButton Icon="@FodIcons.Material.Filled.MoreVert" />
                    </ActivatorContent>
                    <ChildContent>
                        <FodMenuItem Icon="@FodIcons.Material.Filled.Edit">Editează</FodMenuItem>
                        <FodMenuItem Icon="@FodIcons.Material.Filled.Lock">Resetează parola</FodMenuItem>
                        <FodMenuItem Icon="@FodIcons.Material.Filled.Delete" Color="FodColor.Error">Șterge</FodMenuItem>
                    </ChildContent>
                </FodMenu>
            </CellTemplate>
        </FodColumn>
    </Columns>
    
    <!-- Paginare -->
    <PagerContent>
        <FodTablePager />
    </PagerContent>
</FodDataTable>

@code {
    private List<User> Elements = GetUsers();
    private string searchString = "";
    private User selectedElement;
    
    private bool FilterFunc(User element) => FilterFunc(element, searchString);
    
    private bool FilterFunc(User element, string searchString)
    {
        if (string.IsNullOrWhiteSpace(searchString))
            return true;
        if (element.FirstName.Contains(searchString, StringComparison.OrdinalIgnoreCase))
            return true;
        if (element.LastName.Contains(searchString, StringComparison.OrdinalIgnoreCase))
            return true;
        if (element.Email.Contains(searchString, StringComparison.OrdinalIgnoreCase))
            return true;
        return false;
    }
    
    private FodColor GetRoleColor(string role) => role switch
    {
        "Admin" => FodColor.Primary,
        "Manager" => FodColor.Secondary,
        "User" => FodColor.Default,
        _ => FodColor.Default
    };
}
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Items` | `IEnumerable<T>` | Colecția de date pentru afișare | `null` |
| `Dense` | `bool` | Reduce padding-ul pentru un tabel mai compact | `false` |
| `Hover` | `bool` | Evidențiază rândul la hover | `false` |
| `Striped` | `bool` | Rânduri alternate colorate | `false` |
| `Bordered` | `bool` | Adaugă borduri la celule | `false` |
| `Elevation` | `int` | Nivelul de umbră (0-24) | `1` |
| `SelectedItem` | `T` | Elementul selectat curent | `null` |
| `SelectedItems` | `HashSet<T>` | Elementele selectate (multi-selection) | `null` |
| `MultiSelection` | `bool` | Permite selecție multiplă | `false` |
| `SelectOnRowClick` | `bool` | Selectează la click pe rând | `false` |
| `SortBy` | `string` | Coloana curentă de sortare | `null` |
| `SortDescending` | `bool` | Direcția de sortare | `false` |
| `Page` | `int` | Pagina curentă | `1` |
| `RowsPerPage` | `int` | Număr de rânduri pe pagină | `10` |
| `TotalItems` | `int` | Total elemente (pentru paginare server-side) | `0` |
| `FilterFunc` | `Func<T, bool>` | Funcție de filtrare personalizată | `null` |
| `GroupBy` | `string` | Proprietatea pentru grupare | `null` |
| `HeaderContent` | `RenderFragment` | Template pentru header tabel | - |
| `RowTemplate` | `RenderFragment<T>` | Template pentru rânduri | - |
| `FooterContent` | `RenderFragment` | Template pentru footer | - |
| `ToolbarContent` | `RenderFragment` | Conținut toolbar | - |
| `PagerContent` | `RenderFragment` | Template pentru paginator | - |
| `NoDataContent` | `RenderFragment` | Conținut când nu sunt date | - |
| `LoadingContent` | `RenderFragment` | Conținut în timpul încărcării | - |

### 4. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `OnRowClick` | `EventCallback<TableRowClickEventArgs<T>>` | Click pe rând |
| `SelectedItemChanged` | `EventCallback<T>` | Schimbare element selectat |
| `SelectedItemsChanged` | `EventCallback<HashSet<T>>` | Schimbare selecție multiplă |
| `SortByChanged` | `EventCallback<string>` | Schimbare coloană sortare |
| `PageChanged` | `EventCallback<int>` | Schimbare pagină |
| `RowsPerPageChanged` | `EventCallback<int>` | Schimbare dimensiune pagină |

### 5. Componente asociate

#### FodColumn
Definește o coloană în tabel:
```razor
<FodColumn T="Item" 
           Field="@nameof(Item.Name)" 
           Title="Nume produs"
           Sortable="true"
           Filterable="true"
           Width="200px">
    <CellTemplate>
        <strong>@context.Item.Name</strong>
    </CellTemplate>
</FodColumn>
```

#### FodTableSortLabel
Etichetă pentru sortare în header:
```razor
<FodTableSortLabel SortBy="price" @bind-CurrentSortBy="@sortBy">
    Preț
</FodTableSortLabel>
```

#### FodTablePager
Controale de paginare:
```razor
<FodTablePager PageSizeOptions="new int[] { 5, 10, 25, 50, 100 }" 
               HideRowsPerPage="false"
               HidePageButtons="false" />
```

### 6. Filtrare avansată

```razor
<FodDataTable Items="FilteredUsers">
    <Columns>
        <FodColumn T="User" Field="Name" Title="Nume">
            <FilterTemplate>
                <FodTextField @bind-Value="nameFilter" Placeholder="Filtrează nume..." />
            </FilterTemplate>
        </FodColumn>
        
        <FodColumn T="User" Field="Role" Title="Rol">
            <FilterTemplate>
                <FodSelect @bind-Value="roleFilter" Placeholder="Toate rolurile">
                    <FodSelectItem Value="">Toate</FodSelectItem>
                    <FodSelectItem Value="Admin">Admin</FodSelectItem>
                    <FodSelectItem Value="User">User</FodSelectItem>
                </FodSelect>
            </FilterTemplate>
        </FodColumn>
    </Columns>
</FodDataTable>

@code {
    private string nameFilter = "";
    private string roleFilter = "";
    
    private IEnumerable<User> FilteredUsers => users
        .Where(u => string.IsNullOrEmpty(nameFilter) || u.Name.Contains(nameFilter))
        .Where(u => string.IsNullOrEmpty(roleFilter) || u.Role == roleFilter);
}
```

### 7. Server-side operations

```razor
<FodDataTable Items="serverData" 
              TotalItems="totalServerItems"
              ServerData="true"
              @bind-Page="currentPage"
              @bind-RowsPerPage="pageSize"
              @bind-SortBy="sortBy"
              OnServerDataRequest="LoadServerData">
    <!-- Coloane -->
</FodDataTable>

@code {
    private List<Item> serverData = new();
    private int totalServerItems = 0;
    private int currentPage = 1;
    private int pageSize = 10;
    private string sortBy = "";
    
    private async Task LoadServerData(ServerDataEventArgs args)
    {
        var result = await DataService.GetPagedData(
            args.Page, 
            args.PageSize, 
            args.SortBy, 
            args.SortDescending,
            args.FilterValues
        );
        
        serverData = result.Items;
        totalServerItems = result.TotalCount;
    }
}
```

### 8. Export date

```razor
<FodDataTable Items="items">
    <ToolbarContent>
        <FodButton StartIcon="@FodIcons.Material.Filled.Download" 
                   OnClick="ExportToExcel">
            Export Excel
        </FodButton>
        <FodButton StartIcon="@FodIcons.Material.Filled.PictureAsPdf" 
                   OnClick="ExportToPdf">
            Export PDF
        </FodButton>
    </ToolbarContent>
    <!-- Restul configurației -->
</FodDataTable>

@code {
    private async Task ExportToExcel()
    {
        var excelData = items.Select(i => new 
        {
            i.Name,
            i.Email,
            i.Role,
            CreatedDate = i.CreatedAt.ToString("dd.MM.yyyy")
        });
        
        await ExcelService.Export("users.xlsx", excelData);
    }
}
```

### 9. Note și observații

- Pentru seturi mari de date (>1000 rânduri), folosiți virtualizare sau paginare server-side
- Sortarea și filtrarea se fac în memorie pentru date client-side
- MultiSelection creează o referință HashSet pentru performanță
- Folosiți Dense pentru a economisi spațiu vertical
- GroupBy funcționează doar cu date client-side

### 10. Bune practici

1. **Performanță** - Pentru >100 rânduri, activați paginarea
2. **Responsive** - Ascundeți coloane mai puțin importante pe mobile
3. **Loading states** - Afișați indicatori pentru operații asincrone
4. **Sortare** - Activați doar pentru coloane relevante
5. **Selecție** - Oferiți feedback vizual pentru elementele selectate
6. **Acțiuni** - Grupați acțiunile într-un meniu pentru a economisi spațiu

### 11. Concluzie
`FodDataTable` este componenta ideală pentru afișarea și manipularea datelor tabulare complexe, oferind toate funcționalitățile necesare pentru o experiență utilizator profesională.