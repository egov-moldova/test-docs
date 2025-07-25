# FodTh

## Documentație pentru componenta FodTh

### 1. Descriere Generală

`FodTh` reprezintă o celulă de header (table header) într-un tabel. Componenta oferă stilizare consistentă pentru header-ele de tabel și include automat atributul `scope="col"` pentru accesibilitate.

Caracteristici principale:
- Semantic HTML cu `<th>` element
- Atribut `scope="col"` automat pentru accesibilitate
- Stilizare consistentă cu tema FOD
- Suport pentru conținut complex
- Integrare cu FodTableSortLabel pentru sortare
- Lightweight și performant

### 2. Utilizare de Bază

#### Header simplu
```razor
<FodTable>
    <thead>
        <FodTr>
            <FodTh>Nume</FodTh>
            <FodTh>Email</FodTh>
            <FodTh>Telefon</FodTh>
        </FodTr>
    </thead>
</FodTable>
```

#### Header cu stilizare personalizată
```razor
<FodDataTable Items="products" T="Product">
    <HeaderContent>
        <FodTr>
            <FodTh Class="text-center">Cod</FodTh>
            <FodTh Class="text-start">Denumire</FodTh>
            <FodTh Class="text-end">Preț</FodTh>
            <FodTh Class="text-center" Style="width: 100px;">Acțiuni</FodTh>
        </FodTr>
    </HeaderContent>
</FodDataTable>
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `ChildContent` | `RenderFragment` | Conținutul header-ului | - |
| `Class` | `string` | Clase CSS adiționale | - |
| `Style` | `string` | Stiluri inline | - |

### 4. Exemple Avansate

#### Header cu sortare
```razor
<FodDataTable Items="employees" T="Employee">
    <HeaderContent>
        <FodTr>
            <FodTh>
                <FodTableSortLabel T="Employee" 
                                   OrderBy="@(e => e.Name)">
                    Nume
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel T="Employee" 
                                   OrderBy="@(e => e.Department)">
                    Departament
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel T="Employee" 
                                   OrderBy="@(e => e.Salary)">
                    Salariu
                </FodTableSortLabel>
            </FodTh>
            <FodTh>Acțiuni</FodTh>
        </FodTr>
    </HeaderContent>
</FodDataTable>
```

#### Header cu iconițe și tooltip
```razor
<FodTr>
    <FodTh>
        <div class="d-flex align-items-center">
            <FodIcon Icon="@FodIcons.Material.Filled.Person" 
                     Size="FodSize.Small" 
                     Class="me-1" />
            Utilizator
        </div>
    </FodTh>
    <FodTh>
        <div class="d-flex align-items-center">
            Status
            <FodTooltip Text="Indică starea curentă a utilizatorului">
                <FodIcon Icon="@FodIcons.Material.Filled.Info" 
                         Size="FodSize.Small" 
                         Class="ms-1" />
            </FodTooltip>
        </div>
    </FodTh>
    <FodTh>
        <div class="d-flex align-items-center justify-content-end">
            <span>Sold</span>
            <FodIcon Icon="@FodIcons.Material.Filled.AccountBalance" 
                     Size="FodSize.Small" 
                     Class="ms-1" />
        </div>
    </FodTh>
</FodTr>
```

#### Header complex cu filtre
```razor
<FodDataTable Items="orders" T="Order">
    <HeaderContent>
        <FodTr>
            <FodTh Style="vertical-align: top;">
                <div>
                    <FodTableSortLabel T="Order" OrderBy="@(o => o.OrderNumber)">
                        Nr. Comandă
                    </FodTableSortLabel>
                    <FodTextField @bind-Value="orderNumberFilter" 
                                  Placeholder="Caută..."
                                  Dense="true"
                                  Margin="FodMargin.Dense"
                                  DebounceInterval="300"
                                  OnDebounceIntervalElapsed="ApplyFilters" />
                </div>
            </FodTh>
            <FodTh Style="vertical-align: top;">
                <div>
                    <FodTableSortLabel T="Order" OrderBy="@(o => o.CustomerName)">
                        Client
                    </FodTableSortLabel>
                    <FodSelect @bind-Value="customerFilter" 
                               T="string"
                               Dense="true"
                               Margin="FodMargin.Dense"
                               ValueChanged="ApplyFilters">
                        <FodSelectItem Value="@("")">Toți</FodSelectItem>
                        @foreach (var customer in customers)
                        {
                            <FodSelectItem Value="@customer">@customer</FodSelectItem>
                        }
                    </FodSelect>
                </div>
            </FodTh>
            <FodTh Style="vertical-align: top;">
                <div>
                    <FodTableSortLabel T="Order" OrderBy="@(o => o.Total)">
                        Total
                    </FodTableSortLabel>
                    <div class="d-flex gap-1">
                        <FodTextField @bind-Value="minTotal" 
                                      Type="number"
                                      Placeholder="Min"
                                      Dense="true"
                                      Style="width: 80px;" />
                        <FodTextField @bind-Value="maxTotal" 
                                      Type="number"
                                      Placeholder="Max"
                                      Dense="true"
                                      Style="width: 80px;" />
                    </div>
                </div>
            </FodTh>
        </FodTr>
    </HeaderContent>
</FodDataTable>

@code {
    private string orderNumberFilter;
    private string customerFilter = "";
    private decimal? minTotal;
    private decimal? maxTotal;
    
    private void ApplyFilters()
    {
        // Aplicare filtre
    }
}
```

#### Header cu checkbox pentru selecție totală
```razor
<FodDataTable Items="items" T="Item" MultiSelection="true" @ref="dataTable">
    <HeaderContent>
        <FodTr>
            <FodTh Style="width: 48px;">
                <FodCheckbox @bind-Checked="selectAll" 
                             CheckedChanged="OnSelectAllChanged" />
            </FodTh>
            <FodTh>Denumire</FodTh>
            <FodTh>Categorie</FodTh>
            <FodTh>Preț</FodTh>
        </FodTr>
    </HeaderContent>
</FodDataTable>

@code {
    private FodDataTable<Item> dataTable;
    private bool selectAll;
    
    private void OnSelectAllChanged(bool value)
    {
        if (value)
            dataTable.SelectAll();
        else
            dataTable.DeselectAll();
    }
}
```

#### Header cu acțiuni bulk
```razor
<FodTr>
    <FodTh colspan="3">
        <div class="d-flex align-items-center justify-content-between">
            <span>@selectedItems.Count() elemente selectate</span>
            <div>
                <FodButton Size="FodSize.Small" 
                           Variant="FodVariant.Text"
                           OnClick="ExportSelected">
                    Export
                </FodButton>
                <FodButton Size="FodSize.Small" 
                           Variant="FodVariant.Text"
                           Color="FodColor.Error"
                           OnClick="DeleteSelected">
                    Șterge
                </FodButton>
            </div>
        </div>
    </FodTh>
</FodTr>
```

### 5. Stilizare și Teme

```css
/* Header cu background distinct */
.custom-header .fod-table-cell {
    background-color: var(--fod-palette-grey-100);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.875rem;
    letter-spacing: 0.5px;
}

/* Header sticky */
.sticky-header thead th {
    position: sticky;
    top: 0;
    background-color: var(--fod-palette-background-paper);
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Header cu borduri */
.bordered-header th {
    border-bottom: 2px solid var(--fod-palette-primary-main);
    padding-bottom: 12px;
}

/* Header cu gradient */
.gradient-header th {
    background: linear-gradient(135deg, 
        var(--fod-palette-primary-light) 0%, 
        var(--fod-palette-primary-main) 100%);
    color: white;
}

/* Header responsive */
@media (max-width: 768px) {
    .responsive-header th {
        padding: 8px 4px;
        font-size: 0.75rem;
    }
}
```

### 6. Integrare cu componente FOD

#### Cu FodTableSortLabel
```razor
<FodTh>
    <FodTableSortLabel T="Product" 
                       OrderBy="@(p => p.Name)"
                       InitialDirection="FodSortDirection.Ascending">
        Nume Produs
    </FodTableSortLabel>
</FodTh>
```

#### Cu FodMenu pentru opțiuni
```razor
<FodTh>
    <div class="d-flex align-items-center justify-content-between">
        <span>Coloană</span>
        <FodMenu>
            <ActivatorContent>
                <FodIconButton Icon="@FodIcons.Material.Filled.MoreVert" 
                               Size="FodSize.Small" />
            </ActivatorContent>
            <ChildContent>
                <FodMenuItem OnClick="SortAscending">
                    Sortare crescătoare
                </FodMenuItem>
                <FodMenuItem OnClick="SortDescending">
                    Sortare descrescătoare
                </FodMenuItem>
                <FodDivider />
                <FodMenuItem OnClick="HideColumn">
                    Ascunde coloană
                </FodMenuItem>
            </ChildContent>
        </FodMenu>
    </div>
</FodTh>
```

### 7. Scenarii Comune

#### Header pentru tabel financiar
```razor
<thead>
    <FodTr>
        <FodTh rowspan="2">Descriere</FodTh>
        <FodTh colspan="4" Class="text-center">Trimestre</FodTh>
        <FodTh rowspan="2">Total</FodTh>
    </FodTr>
    <FodTr>
        <FodTh>Q1</FodTh>
        <FodTh>Q2</FodTh>
        <FodTh>Q3</FodTh>
        <FodTh>Q4</FodTh>
    </FodTr>
</thead>
```

#### Header cu indicatori
```razor
<FodTh>
    <div class="d-flex align-items-center">
        Vânzări
        @if (salesTrend > 0)
        {
            <FodIcon Icon="@FodIcons.Material.Filled.TrendingUp" 
                     Color="FodColor.Success" 
                     Size="FodSize.Small" 
                     Class="ms-1" />
        }
        else if (salesTrend < 0)
        {
            <FodIcon Icon="@FodIcons.Material.Filled.TrendingDown" 
                     Color="FodColor.Error" 
                     Size="FodSize.Small" 
                     Class="ms-1" />
        }
    </div>
</FodTh>
```

### 8. Best Practices

1. **Text concis** - Păstrați header-ele scurte și clare
2. **Aliniere consistentă** - Aliniați cu conținutul coloanei
3. **Iconițe descriptive** - Folosiți iconițe pentru claritate
4. **Responsive** - Adaptați pentru ecrane mici
5. **Accesibilitate** - Includeți scope și ARIA labels
6. **Sortare vizibilă** - Indicați clar coloanele sortabile

### 9. Performanță

- Componenta este foarte lightweight
- Evitați calcule în render
- Pentru header-e complexe, memoizați conținutul
- Folosiți CSS pentru stilizare, nu style inline excesiv

### 10. Accesibilitate

- `scope="col"` aplicat automat
- Compatibil cu screen readers
- Suport pentru navigare cu tastatura
- Contrast adecvat pentru text

### 11. Troubleshooting

#### Header-ul nu se aliniază
- Verificați colspan și rowspan
- Asigurați-vă că numărul de celule coincide
- Verificați padding și margin

#### Sortarea nu funcționează
- Verificați integrarea cu FodTableSortLabel
- Asigurați-vă că DataTable are sortare activată

#### Stilizarea nu se aplică
- Verificați specificitatea CSS
- Folosiți Class parameter pentru clase custom
- Verificați că stilurile sunt încărcate

### 12. Concluzie

`FodTh` oferă o componentă simplă dar esențială pentru header-ele de tabel în aplicațiile FOD. Cu suport pentru accesibilitate și flexibilitate pentru conținut complex, facilitează crearea de tabele profesionale și ușor de utilizat.