# FodTd

## Documentație pentru componenta FodTd

### 1. Descriere Generală

`FodTd` reprezintă o celulă de date (table data) într-un rând de tabel. Componenta oferă suport pentru afișare responsivă cu data labels și ascundere pe ecrane mici, fiind optimizată pentru tabele mobile-friendly.

Caracteristici principale:
- Data labels pentru afișare responsivă
- Ascundere automată pe breakpoint-uri mici
- Stilizare flexibilă
- Integrare perfectă cu FodDataTable
- Suport pentru conținut complex
- Lightweight și performantă

### 2. Utilizare de Bază

#### Celulă simplă
```razor
<FodTable>
    <tbody>
        <FodTr>
            <FodTd>Valoare simplă</FodTd>
            <FodTd>Alta valoare</FodTd>
            <FodTd>A treia valoare</FodTd>
        </FodTr>
    </tbody>
</FodTable>
```

#### Celulă cu data label
```razor
<FodDataTable Items="users" T="User">
    <RowTemplate>
        <FodTr>
            <FodTd DataLabel="Nume">@context.Name</FodTd>
            <FodTd DataLabel="Email">@context.Email</FodTd>
            <FodTd DataLabel="Telefon">@context.Phone</FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>
```

#### Celulă cu conținut complex
```razor
<FodTd DataLabel="Acțiuni">
    <FodIconButton Icon="@FodIcons.Material.Filled.Edit" 
                   Size="FodSize.Small"
                   OnClick="@(() => EditItem(context))" />
    <FodIconButton Icon="@FodIcons.Material.Filled.Delete" 
                   Size="FodSize.Small"
                   Color="FodColor.Error"
                   OnClick="@(() => DeleteItem(context))" />
</FodTd>
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `DataLabel` | `string` | Label pentru afișare mobilă | - |
| `HideSmall` | `bool` | Ascunde pe ecrane mici | `false` |
| `ChildContent` | `RenderFragment` | Conținutul celulei | - |
| `Class` | `string` | Clase CSS adiționale | - |
| `Style` | `string` | Stiluri inline | - |

### 4. Exemple Avansate

#### Tabel responsive cu data labels
```razor
<FodDataTable Items="orders" T="Order" Class="responsive-table">
    <HeaderContent>
        <FodTr>
            <FodTh>Nr. Comandă</FodTh>
            <FodTh>Client</FodTh>
            <FodTh HideSmall="true">Data</FodTh>
            <FodTh>Total</FodTh>
            <FodTh>Status</FodTh>
        </FodTr>
    </HeaderContent>
    
    <RowTemplate>
        <FodTr>
            <FodTd DataLabel="Nr. Comandă">
                <FodLink Href="@($"/orders/{context.Id}")">
                    @context.OrderNumber
                </FodLink>
            </FodTd>
            
            <FodTd DataLabel="Client">
                @context.CustomerName
            </FodTd>
            
            <FodTd DataLabel="Data" HideSmall="true">
                @context.OrderDate.ToString("dd.MM.yyyy")
            </FodTd>
            
            <FodTd DataLabel="Total">
                <strong>@context.Total.ToString("C")</strong>
            </FodTd>
            
            <FodTd DataLabel="Status">
                <FodChip Color="@GetStatusColor(context.Status)" 
                         Size="FodSize.Small">
                    @context.Status
                </FodChip>
            </FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>

@code {
    private FodColor GetStatusColor(OrderStatus status)
    {
        return status switch
        {
            OrderStatus.Pending => FodColor.Warning,
            OrderStatus.Processing => FodColor.Info,
            OrderStatus.Completed => FodColor.Success,
            OrderStatus.Cancelled => FodColor.Error,
            _ => FodColor.Default
        };
    }
}
```

#### Celule cu formatare condiționată
```razor
<FodDataTable Items="products" T="Product">
    <RowTemplate>
        <FodTr>
            <FodTd DataLabel="Produs">@context.Name</FodTd>
            
            <FodTd DataLabel="Preț" 
                   Class="@(context.OnSale ? "sale-price" : "")">
                @if (context.OnSale)
                {
                    <span class="original-price">@context.OriginalPrice.ToString("C")</span>
                    <span class="current-price">@context.SalePrice.ToString("C")</span>
                }
                else
                {
                    @context.Price.ToString("C")
                }
            </FodTd>
            
            <FodTd DataLabel="Stoc" 
                   Class="@GetStockClass(context.Stock)">
                @context.Stock
            </FodTd>
            
            <FodTd DataLabel="Disponibilitate">
                @if (context.Stock > 0)
                {
                    <FodIcon Icon="@FodIcons.Material.Filled.Check" 
                             Color="FodColor.Success" 
                             Size="FodSize.Small" />
                    <span>În stoc</span>
                }
                else
                {
                    <FodIcon Icon="@FodIcons.Material.Filled.Close" 
                             Color="FodColor.Error" 
                             Size="FodSize.Small" />
                    <span>Indisponibil</span>
                }
            </FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>

@code {
    private string GetStockClass(int stock)
    {
        return stock switch
        {
            0 => "out-of-stock",
            < 10 => "low-stock",
            _ => "in-stock"
        };
    }
}
```

#### Celule cu componente complexe
```razor
<FodDataTable Items="employees" T="Employee">
    <RowTemplate>
        <FodTr>
            <FodTd DataLabel="Angajat">
                <div class="d-flex align-items-center">
                    <FodAvatar Image="@context.PhotoUrl" 
                               Size="FodSize.Small" 
                               Class="me-2" />
                    <div>
                        <FodText Typo="Typo.body2">@context.FullName</FodText>
                        <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                            @context.Department
                        </FodText>
                    </div>
                </div>
            </FodTd>
            
            <FodTd DataLabel="Contact">
                <div class="contact-info">
                    <div>
                        <FodIcon Icon="@FodIcons.Material.Filled.Email" 
                                 Size="FodSize.Small" 
                                 Class="me-1" />
                        @context.Email
                    </div>
                    <div>
                        <FodIcon Icon="@FodIcons.Material.Filled.Phone" 
                                 Size="FodSize.Small" 
                                 Class="me-1" />
                        @context.Phone
                    </div>
                </div>
            </FodTd>
            
            <FodTd DataLabel="Performanță">
                <FodRating Value="@context.PerformanceRating" 
                           MaxValue="5" 
                           ReadOnly="true" 
                           Size="FodSize.Small" />
            </FodTd>
            
            <FodTd DataLabel="Acțiuni">
                <FodMenu>
                    <ActivatorContent>
                        <FodIconButton Icon="@FodIcons.Material.Filled.MoreVert" 
                                       Size="FodSize.Small" />
                    </ActivatorContent>
                    <ChildContent>
                        <FodMenuItem OnClick="@(() => ViewDetails(context))">
                            Detalii
                        </FodMenuItem>
                        <FodMenuItem OnClick="@(() => EditEmployee(context))">
                            Editează
                        </FodMenuItem>
                        <FodMenuItem OnClick="@(() => SendMessage(context))">
                            Trimite mesaj
                        </FodMenuItem>
                    </ChildContent>
                </FodMenu>
            </FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>
```

#### Celule cu stări dinamice
```razor
<FodDataTable Items="tasks" T="TaskItem">
    <RowTemplate>
        <FodTr>
            <FodTd DataLabel="Task">
                <div class="@(context.IsCompleted ? "completed-task" : "")">
                    @context.Title
                </div>
            </FodTd>
            
            <FodTd DataLabel="Prioritate">
                <FodBadge Color="@GetPriorityColor(context.Priority)" 
                          Dot="true">
                    @context.Priority
                </FodBadge>
            </FodTd>
            
            <FodTd DataLabel="Deadline" 
                   Class="@(IsOverdue(context) ? "overdue" : "")">
                @context.Deadline.ToString("dd.MM.yyyy")
                @if (IsOverdue(context))
                {
                    <FodTooltip Text="Task întârziat!">
                        <FodIcon Icon="@FodIcons.Material.Filled.Warning" 
                                 Color="FodColor.Error" 
                                 Size="FodSize.Small" />
                    </FodTooltip>
                }
            </FodTd>
            
            <FodTd DataLabel="Progres">
                <FodLoadingLinear Value="@context.Progress" 
                                  Color="@GetProgressColor(context.Progress)" />
                <span class="text-caption">@context.Progress%</span>
            </FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>

@code {
    private bool IsOverdue(TaskItem task)
    {
        return !task.IsCompleted && task.Deadline < DateTime.Now;
    }
    
    private FodColor GetPriorityColor(Priority priority)
    {
        return priority switch
        {
            Priority.High => FodColor.Error,
            Priority.Medium => FodColor.Warning,
            Priority.Low => FodColor.Info,
            _ => FodColor.Default
        };
    }
    
    private FodColor GetProgressColor(int progress)
    {
        return progress switch
        {
            < 25 => FodColor.Error,
            < 50 => FodColor.Warning,
            < 75 => FodColor.Info,
            _ => FodColor.Success
        };
    }
}
```

### 5. Stilizare Responsivă

```css
/* Stiluri pentru mobile */
@media (max-width: 768px) {
    .responsive-table .fod-table-cell {
        display: block;
        text-align: right;
        padding-left: 50%;
        position: relative;
    }
    
    .responsive-table .fod-table-cell::before {
        content: attr(data-label);
        position: absolute;
        left: 6px;
        width: 45%;
        text-align: left;
        font-weight: bold;
    }
    
    .responsive-table .fod-table-cell-hide {
        display: none !important;
    }
}

/* Stiluri pentru celule speciale */
.sale-price .original-price {
    text-decoration: line-through;
    color: var(--fod-palette-text-secondary);
    margin-right: 8px;
}

.sale-price .current-price {
    color: var(--fod-palette-error-main);
    font-weight: bold;
}

.out-of-stock {
    color: var(--fod-palette-error-main);
}

.low-stock {
    color: var(--fod-palette-warning-main);
}

.in-stock {
    color: var(--fod-palette-success-main);
}

/* Celule cu hover */
.hoverable-cell:hover {
    background-color: rgba(var(--fod-palette-primary-rgb), 0.08);
    cursor: pointer;
}

/* Celule cu conținut dens */
.compact-cell {
    padding: 4px 8px;
    font-size: 0.875rem;
}
```

### 6. Integrare cu alte componente

#### În formulare editabile
```razor
<FodTd DataLabel="@column.HeaderText">
    @if (IsEditing)
    {
        <FodTextField @bind-Value="value" 
                      Immediate="true"
                      Dense="true"
                      Margin="FodMargin.None" />
    }
    else
    {
        @value
    }
</FodTd>
```

#### Cu validare inline
```razor
<FodTd DataLabel="Email">
    @if (IsValidEmail(context.Email))
    {
        @context.Email
    }
    else
    {
        <span class="text-error">
            @context.Email
            <FodIcon Icon="@FodIcons.Material.Filled.Error" 
                     Size="FodSize.Small" />
        </span>
    }
</FodTd>
```

### 7. Best Practices

1. **Data Labels** - Includeți întotdeauna pentru tabele responsive
2. **Conținut semantic** - Folosiți markup semantic în celule
3. **Performanță** - Evitați calcule complexe în randare
4. **Accesibilitate** - Asigurați contrast suficient pentru text
5. **Mobile-first** - Testați pe dispozitive mobile
6. **Consistență** - Păstrați stilizare uniformă între celule

### 8. Performanță

- Componenta este foarte lightweight
- Evitați re-render prin folosirea @key
- Pentru tabele mari, folosiți virtualizare
- Minimizați DOM-ul pentru conținut complex

### 9. Accesibilitate

- Data labels sunt citite de screen readers
- Structura tabelară păstrează semantica
- Suport pentru navigare cu tastatura
- ARIA attributes sunt moștenite de la tabel

### 10. Troubleshooting

#### Data label nu apare pe mobile
- Verificați CSS media queries
- Asigurați-vă că DataLabel este setat
- Verificați că stilurile responsive sunt încărcate

#### Celula nu se ascunde pe ecrane mici
- Setați HideSmall="true"
- Verificați breakpoint-urile CSS
- Asigurați-vă că clasa CSS este aplicată

#### Conținutul depășește celula
- Aplicați `overflow: hidden` sau `text-overflow: ellipsis`
- Folosiți FodTooltip pentru text lung
- Considerați un layout diferit pentru mobile

### 11. Concluzie

`FodTd` oferă o soluție simplă dar puternică pentru celulele de tabel în aplicațiile FOD. Cu suport nativ pentru responsive design prin data labels și flexibilitate maximă pentru conținut, componenta asigură o experiență consistentă pe toate dispozitivele.