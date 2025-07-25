# FodColumn

## Documentație pentru componenta FodColumn

### 1. Descriere Generală

`FodColumn<T>` este componenta de bază pentru definirea coloanelor în `FodDataTable`. Oferă suport pentru afișare, editare și formatare a datelor, cu moduri diferite de randare pentru header, conținut, editare și footer.

Caracteristici principale:
- Suport pentru tipuri generice
- Moduri multiple de randare (Header, Item, Edit, Footer)
- Formatare personalizată a datelor
- Editare inline cu FodTextField
- Suport pentru valori footer
- Vizibilitate controlată
- Integrare automată cu FodDataTable
- Responsive cu data labels

### 2. Utilizare de Bază

#### Coloane simple în DataTable
```razor
<FodDataTable Items="employees" T="Employee">
    <Columns>
        <FodColumn T="string" HeaderText="Nume" Value="@context.Name" />
        <FodColumn T="string" HeaderText="Departament" Value="@context.Department" />
        <FodColumn T="decimal" HeaderText="Salariu" Value="@context.Salary" 
                   DataFormatString="{0:C}" />
        <FodColumn T="DateTime" HeaderText="Data angajării" Value="@context.HireDate" 
                   DataFormatString="{0:dd.MM.yyyy}" />
    </Columns>
</FodDataTable>

@code {
    private List<Employee> employees = new();
    
    public class Employee
    {
        public string Name { get; set; }
        public string Department { get; set; }
        public decimal Salary { get; set; }
        public DateTime HireDate { get; set; }
    }
}
```

#### Coloane cu editare
```razor
<FodDataTable Items="products" T="Product" EditMode="DataEditMode.Cell">
    <Columns>
        <FodColumn T="string" HeaderText="Produs" Value="@context.Name" 
                   @bind-Value="context.Name" />
        <FodColumn T="decimal" HeaderText="Preț" Value="@context.Price" 
                   @bind-Value="context.Price"
                   DataFormatString="{0:F2} MDL" />
        <FodColumn T="int" HeaderText="Stoc" Value="@context.Stock" 
                   @bind-Value="context.Stock" />
        <FodColumn T="bool" HeaderText="Activ" Value="@context.IsActive" 
                   @bind-Value="context.IsActive"
                   ReadOnly="true" />
    </Columns>
</FodDataTable>
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `T` | Valoarea de afișat/editat | - |
| `ValueChanged` | `EventCallback<T>` | Callback pentru schimbarea valorii | - |
| `HeaderText` | `string` | Textul pentru header și data label | - |
| `FooterValue` | `T` | Valoarea pentru footer | - |
| `FooterText` | `string` | Text footer (când FooterValue nu e setat) | - |
| `DataFormatString` | `string` | Format string pentru afișare | - |
| `ReadOnly` | `bool` | Dezactivează editarea | `false` |
| `Visible` | `bool` | Controlează vizibilitatea coloanei | `true` |

### 4. Moduri de Randare

| Mod | Descriere | Comportament |
|-----|-----------|--------------|
| `Header` | Randare header | Afișează HeaderText în FodTh |
| `Item` | Randare normală | Afișează valoarea formatată în FodTd |
| `Edit` | Randare editare | Afișează FodTextField pentru editare |
| `Footer` | Randare footer | Afișează FooterValue sau FooterText |

### 5. Exemple Avansate

#### Coloane cu formatare complexă
```razor
<FodDataTable Items="orders" T="Order" ShowFooter="true">
    <Columns>
        <FodColumn T="string" HeaderText="Nr. Comandă" Value="@context.OrderNumber" />
        
        <FodColumn T="DateTime" HeaderText="Data" Value="@context.OrderDate" 
                   DataFormatString="{0:dd MMM yyyy HH:mm}" />
        
        <FodColumn T="decimal" HeaderText="Subtotal" Value="@context.Subtotal" 
                   DataFormatString="{0:N2} MDL"
                   FooterValue="@orders.Sum(o => o.Subtotal)"
                   FooterText="Total:" />
        
        <FodColumn T="decimal" HeaderText="TVA" Value="@context.Tax" 
                   DataFormatString="{0:N2} MDL"
                   FooterValue="@orders.Sum(o => o.Tax)" />
        
        <FodColumn T="decimal" HeaderText="Total" Value="@context.Total" 
                   DataFormatString="{0:N2} MDL"
                   FooterValue="@orders.Sum(o => o.Total)" />
        
        <FodColumn T="OrderStatus" HeaderText="Status" Value="@context.Status" 
                   DataFormatString="{0}" />
    </Columns>
</FodDataTable>

@code {
    private List<Order> orders = new();
    
    public class Order
    {
        public string OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Total => Subtotal + Tax;
        public OrderStatus Status { get; set; }
    }
    
    public enum OrderStatus
    {
        [Description("În așteptare")]
        Pending,
        [Description("Procesare")]
        Processing,
        [Description("Livrată")]
        Delivered,
        [Description("Anulată")]
        Cancelled
    }
}
```

#### Coloane condițional vizibile
```razor
<FodDataTable Items="users" T="User">
    <Columns>
        <FodColumn T="string" HeaderText="Nume" Value="@context.Name" />
        
        <FodColumn T="string" HeaderText="Email" Value="@context.Email" 
                   Visible="@showEmail" />
        
        <FodColumn T="string" HeaderText="Telefon" Value="@context.Phone" 
                   Visible="@showPhone" />
        
        <FodColumn T="DateTime?" HeaderText="Ultima autentificare" 
                   Value="@context.LastLogin" 
                   DataFormatString="{0:dd.MM.yyyy HH:mm}"
                   Visible="@showLoginInfo" />
        
        <FodColumn T="bool" HeaderText="Activ" Value="@context.IsActive" 
                   Visible="@showStatus" />
    </Columns>
</FodDataTable>

<FodCheckbox @bind-Checked="showEmail" Label="Arată email" />
<FodCheckbox @bind-Checked="showPhone" Label="Arată telefon" />
<FodCheckbox @bind-Checked="showLoginInfo" Label="Arată info autentificare" />
<FodCheckbox @bind-Checked="showStatus" Label="Arată status" />

@code {
    private List<User> users = new();
    private bool showEmail = true;
    private bool showPhone = false;
    private bool showLoginInfo = false;
    private bool showStatus = true;
}
```

#### Coloane cu editare controlată
```razor
<FodDataTable Items="inventory" T="InventoryItem" EditMode="DataEditMode.Cell">
    <Columns>
        <FodColumn T="string" HeaderText="Cod produs" Value="@context.ProductCode" 
                   ReadOnly="true" />
        
        <FodColumn T="string" HeaderText="Denumire" Value="@context.Name" 
                   @bind-Value="context.Name"
                   ReadOnly="@(!canEditNames)" />
        
        <FodColumn T="int" HeaderText="Cantitate" Value="@context.Quantity" 
                   @bind-Value="context.Quantity" />
        
        <FodColumn T="decimal" HeaderText="Preț unitar" Value="@context.UnitPrice" 
                   @bind-Value="context.UnitPrice"
                   DataFormatString="{0:F2}"
                   ReadOnly="@(!hasPermission)" />
        
        <FodColumn T="decimal" HeaderText="Valoare totală" 
                   Value="@(context.Quantity * context.UnitPrice)" 
                   DataFormatString="{0:N2} MDL"
                   ReadOnly="true"
                   FooterValue="@inventory.Sum(i => i.Quantity * i.UnitPrice)" />
    </Columns>
</FodDataTable>

@code {
    private List<InventoryItem> inventory = new();
    private bool canEditNames = false;
    private bool hasPermission = true;
}
```

#### Coloane cu formate personalizate
```razor
<FodDataTable Items="metrics" T="PerformanceMetric">
    <Columns>
        <FodColumn T="string" HeaderText="Metric" Value="@context.Name" />
        
        <FodColumn T="double" HeaderText="Valoare" Value="@context.Value" 
                   DataFormatString="@GetFormatString(context.Type)" />
        
        <FodColumn T="double?" HeaderText="Target" Value="@context.Target" 
                   DataFormatString="@GetFormatString(context.Type)" />
        
        <FodColumn T="double" HeaderText="Diferență" 
                   Value="@(context.Target.HasValue ? context.Value - context.Target.Value : 0)"
                   DataFormatString="@GetDifferenceFormat(context.Type)" />
        
        <FodColumn T="bool" HeaderText="Atins" 
                   Value="@(context.Target.HasValue && context.Value >= context.Target.Value)" />
    </Columns>
</FodDataTable>

@code {
    private List<PerformanceMetric> metrics = new();
    
    private string GetFormatString(MetricType type)
    {
        return type switch
        {
            MetricType.Percentage => "{0:P2}",
            MetricType.Currency => "{0:C}",
            MetricType.Count => "{0:N0}",
            MetricType.Duration => "{0:F2} min",
            _ => "{0:F2}"
        };
    }
    
    private string GetDifferenceFormat(MetricType type)
    {
        return type switch
        {
            MetricType.Percentage => "{0:+0.00;-0.00;0}%",
            MetricType.Currency => "{0:+#,##0.00;-#,##0.00;0} MDL",
            _ => "{0:+#,##0;-#,##0;0}"
        };
    }
}
```

### 6. Integrare cu DataTable

#### În modul template
```razor
<FodDataTable Items="tasks" T="Task">
    <HeaderContent>
        <FodTHeadRow>
            <FodColumn T="string" HeaderText="Task" Mode="Rendermode.Header" />
            <FodColumn T="string" HeaderText="Asignat" Mode="Rendermode.Header" />
            <FodColumn T="DateTime" HeaderText="Deadline" Mode="Rendermode.Header" />
            <FodColumn T="TaskStatus" HeaderText="Status" Mode="Rendermode.Header" />
        </FodTHeadRow>
    </HeaderContent>
    
    <RowTemplate>
        <FodTr>
            <FodColumn T="string" Value="@context.Title" Mode="Rendermode.Item" />
            <FodColumn T="string" Value="@context.AssignedTo" Mode="Rendermode.Item" />
            <FodColumn T="DateTime" Value="@context.Deadline" 
                       Mode="Rendermode.Item"
                       DataFormatString="{0:dd.MM.yyyy}" />
            <FodColumn T="TaskStatus" Value="@context.Status" Mode="Rendermode.Item" />
        </FodTr>
    </RowTemplate>
</FodDataTable>
```

### 7. Stilizare și Teme

```css
/* Coloane cu aliniere personalizată */
.number-column .fod-table-cell {
    text-align: right;
}

/* Coloane cu lățime fixă */
.fixed-width-column {
    width: 150px;
    max-width: 150px;
}

/* Highlight pentru coloane importante */
.important-column {
    background-color: rgba(var(--fod-palette-primary-rgb), 0.05);
    font-weight: 600;
}

/* Stil pentru coloane editabile */
.editable-column:hover {
    background-color: rgba(var(--fod-palette-info-rgb), 0.08);
    cursor: pointer;
}
```

### 8. Scenarii Comune

#### Raport financiar cu totale
```razor
<FodDataTable Items="transactions" T="Transaction" ShowFooter="true">
    <Columns>
        <FodColumn T="DateTime" HeaderText="Data" Value="@context.Date" 
                   DataFormatString="{0:dd.MM.yyyy}" />
        
        <FodColumn T="string" HeaderText="Descriere" Value="@context.Description" 
                   FooterText="Total:" />
        
        <FodColumn T="decimal" HeaderText="Debit" Value="@context.DebitAmount" 
                   DataFormatString="{0:N2}"
                   FooterValue="@transactions.Sum(t => t.DebitAmount)" />
        
        <FodColumn T="decimal" HeaderText="Credit" Value="@context.CreditAmount" 
                   DataFormatString="{0:N2}"
                   FooterValue="@transactions.Sum(t => t.CreditAmount)" />
        
        <FodColumn T="decimal" HeaderText="Balanță" 
                   Value="@GetBalance(context)" 
                   DataFormatString="{0:N2}"
                   FooterValue="@GetFinalBalance()" />
    </Columns>
</FodDataTable>

@code {
    private List<Transaction> transactions = new();
    
    private decimal GetBalance(Transaction transaction)
    {
        var index = transactions.IndexOf(transaction);
        return transactions.Take(index + 1)
            .Sum(t => t.CreditAmount - t.DebitAmount);
    }
    
    private decimal GetFinalBalance()
    {
        return transactions.Sum(t => t.CreditAmount - t.DebitAmount);
    }
}
```

### 9. Best Practices

1. **Tipuri clare** - Specificați întotdeauna tipul generic T
2. **Formatare consistentă** - Folosiți DataFormatString pentru uniformitate
3. **HeaderText descriptiv** - Pentru accesibilitate și data labels
4. **ReadOnly pentru calculat** - Coloane calculate sunt întotdeauna read-only
5. **Footer pentru totale** - Folosiți FooterValue pentru sume și agregări
6. **Performanță** - Evitați calcule complexe în DataFormatString

### 10. Performanță

- Calculele pentru footer se fac o singură dată
- Formatarea se aplică doar la randare
- Folosiți Visible pentru a ascunde coloane ne-necesare
- Evitați binding-uri complexe în Value

### 11. Accesibilitate

- HeaderText devine data-label pe mobile
- Coloanele invizibile nu sunt randate în DOM
- Suport pentru screen readers prin structura tabelară

### 12. Troubleshooting

#### Valoarea nu se actualizează
- Verificați @bind-Value pentru two-way binding
- Verificați că ReadOnly="false" pentru editare
- Verificați EditMode pe DataTable

#### Formatarea nu funcționează
- Verificați sintaxa DataFormatString
- Asigurați-vă că tipul T suportă formatul
- Pentru enum-uri, implementați ToString()

#### Footer nu apare
- Verificați ShowFooter="true" pe DataTable
- Setați FooterValue sau FooterText
- Verificați că Mode="Rendermode.Footer"

### 13. Concluzie

`FodColumn<T>` oferă o soluție flexibilă și tipizată pentru definirea coloanelor în tabelele FOD. Cu suport pentru formatare, editare și agregări, componenta facilitează crearea de tabele complexe și interactive cu cod minimal și performanță optimă.