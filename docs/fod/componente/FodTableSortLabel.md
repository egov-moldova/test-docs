# FodTableSortLabel

## Documentație pentru componenta FodTableSortLabel

### 1. Descriere Generală

`FodTableSortLabel<T>` este o componentă pentru header-ele de tabel care permite sortarea coloanelor. Se integrează automat cu `FodDataTable` pentru a gestiona sortarea datelor în mod ascendent, descendent sau fără sortare.

Caracteristici principale:
- Sortare tri-state (None, Ascending, Descending)
- Integrare automată cu FodDataTable
- Iconițe pentru indicarea direcției de sortare
- Suport pentru sortare multiplă
- Funcții de sortare personalizate
- Control asupra poziției iconiței
- Dezactivare opțională

### 2. Utilizare de Bază

#### Sortare simplă în DataTable
```razor
<FodDataTable Items="employees" T="Employee">
    <HeaderContent>
        <FodTr>
            <FodTh>
                <FodTableSortLabel T="Employee" SortBy="@(e => e.Name)">
                    Nume
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel T="Employee" SortBy="@(e => e.Department)">
                    Departament
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel T="Employee" SortBy="@(e => e.Salary)">
                    Salariu
                </FodTableSortLabel>
            </FodTh>
        </FodTr>
    </HeaderContent>
    <RowTemplate>
        <!-- Rânduri tabel -->
    </RowTemplate>
</FodDataTable>
```

#### Sortare cu direcție inițială
```razor
<FodTableSortLabel T="Product" 
                   SortBy="@(p => p.Price)"
                   InitialDirection="SortDirection.Descending">
    Preț
</FodTableSortLabel>
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `SortBy` | `Func<T, object>` | Expresie pentru sortare | - |
| `InitialDirection` | `SortDirection` | Direcția inițială de sortare | `SortDirection.None` |
| `Enabled` | `bool` | Activează sortarea | `true` |
| `SortIcon` | `string` | Iconiță pentru sortare | `FodIcons.Material.Filled.ArrowUpward` |
| `AppendIcon` | `bool` | Plasează iconiță după text | `false` |
| `SortLabel` | `string` | Label pentru accesibilitate | - |
| `SortDirection` | `SortDirection` | Direcția curentă | `SortDirection.None` |
| `SortDirectionChanged` | `EventCallback<SortDirection>` | Eveniment schimbare direcție | - |
| `ChildContent` | `RenderFragment` | Conținut (text/componente) | - |

### 4. Exemple Avansate

#### Sortare complexă cu obiecte imbricate
```razor
<FodDataTable Items="orders" T="Order">
    <HeaderContent>
        <FodTr>
            <FodTh>
                <FodTableSortLabel T="Order" 
                                   SortBy="@(o => o.OrderNumber)"
                                   SortLabel="Număr comandă">
                    Nr. Comandă
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel T="Order" 
                                   SortBy="@(o => o.Customer.Name)"
                                   SortLabel="Nume client">
                    Client
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel T="Order" 
                                   SortBy="@(o => o.Items.Sum(i => i.Total))"
                                   InitialDirection="SortDirection.Descending">
                    Total
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel T="Order" 
                                   SortBy="@(o => o.OrderDate)">
                    Data
                </FodTableSortLabel>
            </FodTh>
        </FodTr>
    </HeaderContent>
</FodDataTable>
```

#### Sortare cu iconițe personalizate
```razor
<FodTableSortLabel T="Task" 
                   SortBy="@(t => t.Priority)"
                   SortIcon="@FodIcons.Material.Filled.Sort"
                   AppendIcon="true">
    <div class="d-flex align-items-center">
        <FodIcon Icon="@FodIcons.Material.Filled.PriorityHigh" 
                 Size="FodSize.Small" 
                 Class="me-1" />
        Prioritate
    </div>
</FodTableSortLabel>
```

#### Sortare condiționată
```razor
<FodDataTable Items="products" T="Product">
    <HeaderContent>
        <FodTr>
            <FodTh>
                <FodTableSortLabel T="Product" 
                                   SortBy="@(p => p.Name)"
                                   Enabled="@canSortByName">
                    Nume produs
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel T="Product" 
                                   SortBy="@(p => p.Stock)"
                                   Enabled="@(userRole == "Admin")">
                    Stoc
                    @if (userRole != "Admin")
                    {
                        <FodTooltip Text="Doar administratorii pot sorta după stoc">
                            <FodIcon Icon="@FodIcons.Material.Filled.Info" 
                                     Size="FodSize.Small" />
                        </FodTooltip>
                    }
                </FodTableSortLabel>
            </FodTh>
        </FodTr>
    </HeaderContent>
</FodDataTable>

@code {
    private bool canSortByName = true;
    private string userRole = "User";
}
```

#### Sortare cu transformări
```razor
<FodTableSortLabel T="Employee" 
                   SortBy="@(e => ParseExperience(e.ExperienceLevel))">
    Experiență
</FodTableSortLabel>

@code {
    private int ParseExperience(string level)
    {
        return level switch
        {
            "Junior" => 1,
            "Mid" => 2,
            "Senior" => 3,
            "Lead" => 4,
            _ => 0
        };
    }
}
```

### 5. Integrare cu DataTable

#### Sortare multiplă
```razor
<FodDataTable Items="data" 
              T="DataItem" 
              MultiSort="true">
    <HeaderContent>
        <FodTr>
            <FodTh>
                <FodTableSortLabel T="DataItem" 
                                   SortBy="@(d => d.Category)"
                                   InitialDirection="SortDirection.Ascending">
                    Categorie
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel T="DataItem" 
                                   SortBy="@(d => d.SubCategory)"
                                   InitialDirection="SortDirection.Ascending">
                    Subcategorie
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel T="DataItem" 
                                   SortBy="@(d => d.Value)">
                    Valoare
                </FodTableSortLabel>
            </FodTh>
        </FodTr>
    </HeaderContent>
</FodDataTable>
```

#### Sortare server-side
```razor
<FodDataTable Items="serverData" 
              T="ServerItem"
              ServerData="LoadServerData">
    <HeaderContent>
        <FodTr>
            <FodTh>
                <FodTableSortLabel T="ServerItem" 
                                   SortBy="@(s => s.Name)"
                                   SortDirectionChanged="OnSortChanged">
                    Nume
                </FodTableSortLabel>
            </FodTh>
        </FodTr>
    </HeaderContent>
</FodDataTable>

@code {
    private async Task<TableData<ServerItem>> LoadServerData(TableState state)
    {
        var sortColumn = state.SortLabel?.SortLabel ?? "Name";
        var sortDirection = state.SortDirection;
        
        var response = await ApiClient.GetDataAsync(
            pageNumber: state.Page,
            pageSize: state.PageSize,
            sortBy: sortColumn,
            sortAscending: sortDirection == SortDirection.Ascending
        );
        
        return new TableData<ServerItem>
        {
            Items = response.Data,
            TotalItems = response.TotalCount
        };
    }
    
    private async Task OnSortChanged(SortDirection direction)
    {
        // Reîncarcă datele cu noua sortare
        await dataTable.ReloadServerData();
    }
}
```

### 6. Stilizare și Teme

```css
/* Header sortabil evidențiat */
.fod-table-sort-label {
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    align-items: center;
}

.fod-table-sort-label:hover {
    color: var(--fod-palette-primary-main);
}

/* Iconiță activă */
.fod-table-sort-label-icon {
    transition: transform 0.2s ease-in-out;
    margin-left: 4px;
    font-size: 18px;
}

/* Direcții de sortare */
.fod-direction-asc {
    transform: rotate(0deg);
    color: var(--fod-palette-primary-main);
}

.fod-direction-desc {
    transform: rotate(180deg);
    color: var(--fod-palette-primary-main);
}

/* Sortare dezactivată */
.fod-table-sort-label[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
}
```

### 7. Combinații cu alte componente

#### Cu badge pentru număr
```razor
<FodTableSortLabel T="Category" SortBy="@(c => c.ProductCount)">
    <div class="d-flex align-items-center">
        Produse
        <FodBadge Color="FodColor.Primary" Class="ms-2">
            @totalProducts
        </FodBadge>
    </div>
</FodTableSortLabel>
```

#### Cu filtrare inline
```razor
<FodTh>
    <div class="d-flex flex-column">
        <FodTableSortLabel T="Product" SortBy="@(p => p.Category)">
            Categorie
        </FodTableSortLabel>
        <FodSelect @bind-Value="categoryFilter" 
                   Dense="true"
                   Margin="FodMargin.Dense"
                   T="string">
            <FodSelectItem Value="">Toate</FodSelectItem>
            @foreach (var cat in categories)
            {
                <FodSelectItem Value="@cat">@cat</FodSelectItem>
            }
        </FodSelect>
    </div>
</FodTh>
```

### 8. Best Practices

1. **SortBy clar** - Folosiți expresii simple și clare
2. **Direcție inițială** - Setați pentru coloane importante
3. **Labels descriptive** - Pentru accesibilitate
4. **Performanță** - Evitați calcule complexe în SortBy
5. **Feedback vizual** - Iconițe clare pentru direcție
6. **Consistență** - Același comportament pentru toate coloanele

### 9. Performanță

- Sortarea se face doar la click
- Pentru date mari, folosiți sortare server-side
- Evitați expresii complexe în SortBy
- Cache-uiți rezultatele pentru performanță

### 10. Accesibilitate

- Suport complet pentru tastatură
- Atribute ARIA pentru screen readers
- Focus vizibil pentru navigare
- SortLabel pentru descriere clară

### 11. Troubleshooting

#### Sortarea nu funcționează
- Verificați că DataTable are Items setat
- Verificați că SortBy returnează valori comparabile
- Verificați că TableContext este disponibil

#### Iconiță nu se schimbă
- Verificați că Enabled="true"
- Verificați că iconițele sunt încărcate
- Verificați CSS pentru transformări

#### Direcția nu se păstrează
- Folosiți InitialDirection pentru setare inițială
- Verificați că nu resetați DataTable

### 12. Concluzie

`FodTableSortLabel` oferă o soluție elegantă și intuitivă pentru sortarea coloanelor în tabele. Cu integrare automată în FodDataTable și suport pentru scenarii complexe, componenta îmbunătățește semnificativ experiența utilizatorului în lucrul cu date tabulare.