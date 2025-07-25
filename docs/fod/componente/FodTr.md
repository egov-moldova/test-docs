# FodTr

## Documentație pentru componenta FodTr

### 1. Descriere Generală

`FodTr` reprezintă un rând de tabel în `FodDataTable`. Componenta gestionează selecția, editarea inline, expandarea și interacțiunea cu rândurile, oferind funcționalități avansate pentru tabele interactive.

Caracteristici principale:
- Selecție simplă și multiplă cu checkbox
- Editare inline cu validare
- Expandare pentru detalii suplimentare
- Evenimente click personalizabile
- Suport pentru header și footer rows
- Integrare cu sistemul de validare
- Commit/Cancel pentru editare
- Gestionare automată a stării

### 2. Utilizare de Bază

#### Rând simplu de tabel
```razor
<FodDataTable Items="users" T="User">
    <RowTemplate>
        <FodTr Item="@context">
            <FodTd>@context.Name</FodTd>
            <FodTd>@context.Email</FodTd>
            <FodTd>@context.Role</FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>

@code {
    private List<User> users = new();
}
```

#### Rând cu selecție
```razor
<FodDataTable Items="products" T="Product" MultiSelection="true">
    <RowTemplate>
        <FodTr Item="@context" IsCheckable="true">
            <FodTd>@context.Code</FodTd>
            <FodTd>@context.Name</FodTd>
            <FodTd>@context.Price.ToString("C")</FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>
```

#### Rând cu editare
```razor
<FodDataTable Items="inventory" T="InventoryItem" EditMode="DataEditMode.Cell">
    <RowTemplate>
        <FodTr Item="@context" IsEditable="true">
            <FodTd>@context.ProductName</FodTd>
            <FodTd>
                @if (context == editingItem)
                {
                    <FodTextField @bind-Value="context.Quantity" />
                }
                else
                {
                    @context.Quantity
                }
            </FodTd>
            <FodTd>@context.Location</FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Item` | `object` | Obiectul asociat rândului | - |
| `IsCheckable` | `bool` | Afișează checkbox pentru selecție | `false` |
| `IsChecked` | `bool` | Starea de selecție | `false` |
| `IsCheckedChanged` | `EventCallback<bool>` | Callback schimbare selecție | - |
| `IsEditable` | `bool` | Permite editarea rândului | `false` |
| `IsExpandable` | `bool` | Permite expandarea rândului | `false` |
| `IsHeader` | `bool` | Marchează ca rând header | `false` |
| `IsFooter` | `bool` | Marchează ca rând footer | `false` |
| `ChildContent` | `RenderFragment` | Conținutul rândului | - |

### 4. Proprietăți din Context

| Proprietate | Descriere |
|-------------|-----------|
| `Context.Table` | Referință la FodDataTable părinte |
| `Context.Table.CommitEditIcon` | Iconiță pentru salvare editare |
| `Context.Table.CancelEditIcon` | Iconiță pentru anulare editare |
| `Context.Table.CommitEditTooltip` | Tooltip salvare |
| `Context.Table.CancelEditTooltip` | Tooltip anulare |
| `Context.Table.CanCancelEdit` | Permite anularea editării |

### 5. Exemple Avansate

#### Tabel cu editare completă
```razor
<FodDataTable @ref="dataTable" Items="employees" T="Employee" 
              EditMode="DataEditMode.Cell"
              RowEditPreview="OnRowEditPreview"
              RowEditCommit="OnRowEditCommit"
              RowEditCancel="OnRowEditCancel">
    <RowTemplate>
        <FodTr Item="@context" IsEditable="true" IsCheckable="true">
            <FodTd>
                @if (IsEditing(context))
                {
                    <FodTextField @bind-Value="context.FirstName" />
                }
                else
                {
                    @context.FirstName
                }
            </FodTd>
            <FodTd>
                @if (IsEditing(context))
                {
                    <FodTextField @bind-Value="context.LastName" />
                }
                else
                {
                    @context.LastName
                }
            </FodTd>
            <FodTd>
                @if (IsEditing(context))
                {
                    <FodSelect @bind-Value="context.Department" T="string">
                        <FodSelectItem Value="@("IT")">IT</FodSelectItem>
                        <FodSelectItem Value="@("HR")">HR</FodSelectItem>
                        <FodSelectItem Value="@("Sales")">Vânzări</FodSelectItem>
                    </FodSelect>
                }
                else
                {
                    @context.Department
                }
            </FodTd>
            <FodTd>
                @if (IsEditing(context))
                {
                    <FodTextField @bind-Value="context.Salary" Type="number" />
                }
                else
                {
                    @context.Salary.ToString("C")
                }
            </FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>

@code {
    private FodDataTable<Employee> dataTable;
    private List<Employee> employees = new();
    private Employee originalEmployee;
    
    private bool IsEditing(Employee employee)
    {
        return dataTable?._editingItem == employee;
    }
    
    private void OnRowEditPreview(object item)
    {
        var employee = item as Employee;
        // Salvăm o copie pentru revert
        originalEmployee = employee.Clone();
    }
    
    private async Task OnRowEditCommit(object item)
    {
        var employee = item as Employee;
        // Salvăm în baza de date
        await EmployeeService.UpdateAsync(employee);
        await ShowNotification("Datele au fost salvate cu succes!");
    }
    
    private void OnRowEditCancel(object item)
    {
        var employee = item as Employee;
        // Revert la valorile originale
        employee.CopyFrom(originalEmployee);
    }
}
```

#### Tabel cu rânduri expandabile
```razor
<FodDataTable Items="orders" T="Order">
    <RowTemplate>
        <FodTr Item="@context" IsExpandable="true" IsCheckable="true">
            <FodTd>@context.OrderNumber</FodTd>
            <FodTd>@context.CustomerName</FodTd>
            <FodTd>@context.OrderDate.ToString("dd.MM.yyyy")</FodTd>
            <FodTd>@context.Total.ToString("C")</FodTd>
        </FodTr>
    </RowTemplate>
    
    <ChildRowContent>
        <tr>
            <td colspan="5">
                <FodCard Elevation="0" Class="ma-2">
                    <FodCardContent>
                        <h5>Detalii comandă #@context.OrderNumber</h5>
                        <FodSimpleTable Dense="true">
                            <thead>
                                <tr>
                                    <th>Produs</th>
                                    <th>Cantitate</th>
                                    <th>Preț unitar</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach (var item in context.OrderItems)
                                {
                                    <tr>
                                        <td>@item.ProductName</td>
                                        <td>@item.Quantity</td>
                                        <td>@item.UnitPrice.ToString("C")</td>
                                        <td>@item.Total.ToString("C")</td>
                                    </tr>
                                }
                            </tbody>
                        </FodSimpleTable>
                    </FodCardContent>
                </FodCard>
            </td>
        </tr>
    </ChildRowContent>
</FodDataTable>
```

#### Header și Footer personalizate
```razor
<FodDataTable Items="salesData" T="SalesRecord">
    <HeaderContent>
        <FodTr IsHeader="true">
            <FodTh>Regiune</FodTh>
            <FodTh>Q1</FodTh>
            <FodTh>Q2</FodTh>
            <FodTh>Q3</FodTh>
            <FodTh>Q4</FodTh>
            <FodTh>Total</FodTh>
        </FodTr>
    </HeaderContent>
    
    <RowTemplate>
        <FodTr Item="@context">
            <FodTd>@context.Region</FodTd>
            <FodTd>@context.Q1.ToString("N0")</FodTd>
            <FodTd>@context.Q2.ToString("N0")</FodTd>
            <FodTd>@context.Q3.ToString("N0")</FodTd>
            <FodTd>@context.Q4.ToString("N0")</FodTd>
            <FodTd>
                <strong>@context.Total.ToString("N0")</strong>
            </FodTd>
        </FodTr>
    </RowTemplate>
    
    <FooterContent>
        <FodTr IsFooter="true">
            <FodTd><strong>Total</strong></FodTd>
            <FodTd><strong>@salesData.Sum(s => s.Q1).ToString("N0")</strong></FodTd>
            <FodTd><strong>@salesData.Sum(s => s.Q2).ToString("N0")</strong></FodTd>
            <FodTd><strong>@salesData.Sum(s => s.Q3).ToString("N0")</strong></FodTd>
            <FodTd><strong>@salesData.Sum(s => s.Q4).ToString("N0")</strong></FodTd>
            <FodTd><strong>@salesData.Sum(s => s.Total).ToString("N0")</strong></FodTd>
        </FodTr>
    </FooterContent>
</FodDataTable>
```

#### Rânduri cu validare
```razor
<FodDataTable Items="products" T="Product" EditMode="DataEditMode.Cell">
    <RowTemplate>
        <FodTr Item="@context" IsEditable="true">
            <FodTd>
                @if (IsEditing(context))
                {
                    <FodTextField @bind-Value="context.Name" 
                                  Required="true"
                                  Label="Nume produs"
                                  Error="@(!IsValidName(context.Name))"
                                  ErrorText="Numele este obligatoriu" />
                }
                else
                {
                    @context.Name
                }
            </FodTd>
            <FodTd>
                @if (IsEditing(context))
                {
                    <FodTextField @bind-Value="context.Price" 
                                  Type="number"
                                  Label="Preț"
                                  Error="@(context.Price < 0)"
                                  ErrorText="Prețul nu poate fi negativ" />
                }
                else
                {
                    @context.Price.ToString("C")
                }
            </FodTd>
            <FodTd>
                @if (IsEditing(context))
                {
                    <FodTextField @bind-Value="context.Stock" 
                                  Type="number"
                                  Label="Stoc"
                                  Error="@(context.Stock < context.MinStock)"
                                  ErrorText="@($"Stocul minim este {context.MinStock}")" />
                }
                else
                {
                    @context.Stock
                }
            </FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>

@code {
    private bool IsValidName(string name)
    {
        return !string.IsNullOrWhiteSpace(name);
    }
}
```

### 6. Evenimente și Callback-uri

#### Gestionare evenimente rând
```razor
<FodDataTable Items="documents" T="Document"
              OnRowClick="OnDocumentClick">
    <RowTemplate>
        <FodTr Item="@context" 
               IsCheckable="true"
               @onclick="@(() => HandleRowClick(context))"
               @onclick:stopPropagation="true">
            <FodTd>@context.Title</FodTd>
            <FodTd>@context.Type</FodTd>
            <FodTd>@context.Size</FodTd>
            <FodTd>
                <FodIconButton Icon="@FodIcons.Material.Filled.Download"
                               OnClick="@(() => DownloadDocument(context))"
                               @onclick:stopPropagation="true" />
            </FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>

@code {
    private async Task OnDocumentClick(DataTableRowClickEventArgs<Document> args)
    {
        // Click pe întregul rând
        await OpenDocumentPreview(args.Item);
    }
    
    private void HandleRowClick(Document doc)
    {
        // Click specific pe rând
        Console.WriteLine($"Clicked on: {doc.Title}");
    }
    
    private async Task DownloadDocument(Document doc)
    {
        // Acțiune specifică fără propagare
        await DocumentService.DownloadAsync(doc.Id);
    }
}
```

### 7. Stilizare și Teme

```css
/* Rânduri cu hover personalizat */
.custom-table .fod-table-row:hover {
    background-color: rgba(var(--fod-palette-primary-rgb), 0.08);
    cursor: pointer;
}

/* Rând selectat */
.custom-table .fod-table-row.selected {
    background-color: rgba(var(--fod-palette-primary-rgb), 0.12);
    border-left: 3px solid var(--fod-palette-primary-main);
}

/* Rânduri editabile */
.editable-row {
    position: relative;
}

.editable-row:hover::after {
    content: "Click pentru editare";
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
    color: var(--fod-palette-primary-main);
}

/* Rânduri cu status */
.status-active {
    border-left: 3px solid var(--fod-palette-success-main);
}

.status-inactive {
    border-left: 3px solid var(--fod-palette-error-main);
    opacity: 0.7;
}
```

### 8. Integrare cu DataTable

#### Configurare completă
```razor
<FodDataTable @ref="table"
              Items="tasks"
              T="Task"
              MultiSelection="true"
              EditMode="DataEditMode.Cell"
              CanCancelEdit="true"
              CommitEditIcon="@FodIcons.Material.Filled.Save"
              CancelEditIcon="@FodIcons.Material.Filled.Cancel"
              CommitEditTooltip="Salvează modificările"
              CancelEditTooltip="Anulează modificările">
    <RowTemplate>
        <FodTr Item="@context" 
               IsEditable="@CanEditTask(context)"
               IsCheckable="true"
               Class="@GetRowClass(context)">
            <!-- Celule aici -->
        </FodTr>
    </RowTemplate>
</FodDataTable>

@code {
    private bool CanEditTask(Task task)
    {
        return task.Status != TaskStatus.Completed && 
               task.AssignedTo == currentUser.Id;
    }
    
    private string GetRowClass(Task task)
    {
        return task.Priority switch
        {
            Priority.High => "priority-high",
            Priority.Low => "priority-low",
            _ => ""
        };
    }
}
```

### 9. Best Practices

1. **Item unic** - Asigurați-vă că Item este setat pentru fiecare rând
2. **Click handling** - Folosiți stopPropagation pentru acțiuni specifice
3. **Validare** - Implementați validare înainte de commit
4. **State management** - Păstrați copii pentru cancel/revert
5. **Performance** - Evitați re-render prin @key în loops
6. **Accessibility** - Includeți aria-labels pentru acțiuni

### 10. Performanță

- Folosiți @key pentru rânduri în bucle
- Evitați calcule complexe în randare
- Cache-uiți rezultatele pentru IsEditing checks
- Implementați virtualizare pentru liste mari

### 11. Accesibilitate

- Suport complet pentru navigare cu tastatura
- ARIA roles aplicate automat
- Anunțuri pentru screen readers la editare
- Focus management pentru acțiuni

### 12. Troubleshooting

#### Editarea nu funcționează
- Verificați IsEditable="true"
- Verificați EditMode pe DataTable
- Asigurați-vă că Item este setat

#### Selecția nu se actualizează
- Verificați MultiSelection pe DataTable
- Verificați IsCheckable="true"
- Verificați two-way binding pentru IsChecked

#### Click events nu funcționează
- Verificați ordinea event handlers
- Folosiți stopPropagation unde e necesar
- Verificați că rândul nu e disabled

### 13. Concluzie

`FodTr` oferă funcționalitate completă pentru rândurile de tabel în aplicațiile FOD. Cu suport pentru selecție, editare inline și evenimente personalizabile, componenta facilitează crearea de tabele interactive și user-friendly, integrate perfect cu sistemul de validare și state management Blazor.