# FodDisplay

## Documentație pentru componenta FodDisplay

### 1. Descriere Generală

`FodDisplay` este o componentă pentru afișarea valorilor în format doar-citire (read-only). Aceasta formatează automat valorile bazat pe tipul lor și suportă localizare pentru etichete și valori, fiind ideală pentru afișarea datelor în formulare de vizualizare sau rezumate.

Caracteristici principale:
- Formatare automată pentru diferite tipuri de date
- Suport pentru localizare etichete și valori
- Integrare cu atribute de validare .NET
- Formatare automată pentru bool, DateTime, enum
- Layout responsive cu grid Bootstrap
- Suport pentru expresii lambda
- Extragere automată etichete din DisplayAttribute

### 2. Utilizare de Bază

#### Afișare simplă cu model binding
```razor
<dl class="row">
    <FodDisplay For="@(() => model.Name)" />
    <FodDisplay For="@(() => model.Email)" />
    <FodDisplay For="@(() => model.BirthDate)" />
</dl>

@code {
    private UserModel model = new()
    {
        Name = "Ion Popescu",
        Email = "ion@example.com",
        BirthDate = new DateTime(1990, 5, 15)
    };
}
```

#### Afișare cu etichete personalizate
```razor
<FodDisplay For="@(() => invoice.Number)" 
            Label="Număr factură" />
            
<FodDisplay For="@(() => invoice.Amount)" 
            Label="Suma totală"
            ValueLabel="@($"{invoice.Amount:C}")" />
```

### 3. Parametri

| Parametru | Tip | Descriere | Valoare Implicită |
|-----------|-----|-----------|-------------------|
| `For` | `Expression<Func<object>>` | Expresie pentru proprietatea de afișat | - |
| `Value` | `object` | Valoarea de afișat (alternativ la For) | - |
| `Label` | `string?` | Eticheta personalizată | - |
| `ValueLabel` | `string?` | Valoare formatată personalizat | - |
| `LabelClass` | `string` | Clase CSS pentru etichetă | `""` |
| `Text` | `Expression<Func<object>>?` | Expresie pentru proprietate imbricată | - |
| `TitleWidth` | `int` | Lățimea coloanei pentru titlu (1-12) | `4` |

### 4. Formatare Automată

Componenta formatează automat valorile bazat pe tip:

#### Boolean
```csharp
true → "Da"
false → "Nu"
```

#### DateTime
```csharp
DateTime → "dd/MM/yyyy"
```

#### Enum cu DisplayAttribute
```csharp
[Display(Name = "StatusActiv", ResourceType = typeof(Resources))]
Active → "Activ" (localizat)
```

### 5. Exemple Avansate

#### Model cu atribute de display
```csharp
public class ProductModel
{
    [Display(Name = "ProductName", ResourceType = typeof(Resources))]
    public string Name { get; set; }
    
    [Display(Name = "ProductPrice")]
    public decimal Price { get; set; }
    
    [Display(Name = "InStock", ResourceType = typeof(Resources))]
    public bool IsAvailable { get; set; }
    
    [Display(Name = "Category")]
    public ProductCategory Category { get; set; }
    
    [Display(Name = "CreatedDate", 
             Description = "Data când produsul a fost adăugat")]
    public DateTime CreatedAt { get; set; }
}

// Utilizare
<dl class="row">
    <FodDisplay For="@(() => product.Name)" />
    <FodDisplay For="@(() => product.Price)" 
                ValueLabel="@($"{product.Price:C}")" />
    <FodDisplay For="@(() => product.IsAvailable)" />
    <FodDisplay For="@(() => product.Category)" />
    <FodDisplay For="@(() => product.CreatedAt)" />
</dl>
```

#### Card detalii cu layout personalizat
```razor
<FodCard>
    <FodCardHeader>
        <FodText Typo="Typo.h5">Detalii comandă</FodText>
    </FodCardHeader>
    <FodCardContent>
        <dl class="row">
            <FodDisplay For="@(() => order.Number)" 
                        TitleWidth="3" />
            
            <FodDisplay For="@(() => order.Customer.Name)" 
                        Label="Client"
                        TitleWidth="3" />
            
            <FodDisplay For="@(() => order.Status)" 
                        TitleWidth="3"
                        LabelClass="fw-bold" />
            
            <FodDisplay For="@(() => order.TotalAmount)" 
                        Label="Total"
                        ValueLabel="@FormatCurrency(order.TotalAmount)"
                        TitleWidth="3" />
        </dl>
        
        <FodDivider Class="my-3" />
        
        <h6>Produse comandate</h6>
        @foreach (var item in order.Items)
        {
            <dl class="row mb-2">
                <FodDisplay For="@(() => item.ProductName)" 
                            Label="Produs"
                            TitleWidth="6" />
                <FodDisplay For="@(() => item.Quantity)" 
                            Label="Cantitate"
                            TitleWidth="2" />
                <FodDisplay For="@(() => item.Price)" 
                            Label="Preț"
                            ValueLabel="@($"{item.Price:C}")"
                            TitleWidth="2" />
            </dl>
        }
    </FodCardContent>
</FodCard>

@code {
    private string FormatCurrency(decimal amount)
    {
        return $"{amount:N2} MDL";
    }
}
```

#### Formular comparație date
```razor
<div class="comparison-view">
    <FodGrid container>
        <FodGrid item xs="12" md="6">
            <h5>Date vechi</h5>
            <dl class="row">
                <FodDisplay For="@(() => oldData.Name)" 
                            LabelClass="text-muted" />
                <FodDisplay For="@(() => oldData.Email)" 
                            LabelClass="text-muted" />
                <FodDisplay For="@(() => oldData.Phone)" 
                            LabelClass="text-muted" />
            </dl>
        </FodGrid>
        
        <FodGrid item xs="12" md="6">
            <h5>Date noi</h5>
            <dl class="row">
                <FodDisplay For="@(() => newData.Name)" 
                            LabelClass="@GetChangeClass(oldData.Name, newData.Name)" />
                <FodDisplay For="@(() => newData.Email)" 
                            LabelClass="@GetChangeClass(oldData.Email, newData.Email)" />
                <FodDisplay For="@(() => newData.Phone)" 
                            LabelClass="@GetChangeClass(oldData.Phone, newData.Phone)" />
            </dl>
        </FodGrid>
    </FodGrid>
</div>

@code {
    private string GetChangeClass(string oldValue, string newValue)
    {
        return oldValue != newValue ? "text-warning fw-bold" : "";
    }
}
```

### 6. Integrare cu Proprietăți Complexe

```razor
<!-- Acces la proprietăți imbricate -->
<FodDisplay For="@(() => user)" 
            Text="@(() => user.Address.City)" 
            Label="Oraș" />

<FodDisplay For="@(() => user)" 
            Text="@(() => user.Company.Name)" 
            Label="Companie" />

<!-- Sau direct -->
<FodDisplay For="@(() => user.Address.Street)" 
            Label="Stradă" />
```

### 7. Stilizare CSS

```css
/* Stiluri pentru dl/dt/dd */
.row > dd {
    font-weight: 500;
    color: var(--fod-palette-text-secondary);
    margin-bottom: 0.5rem;
}

.row > dt {
    color: var(--fod-palette-text-primary);
    margin-bottom: 0.5rem;
}

/* Highlight pentru valori importante */
dt.highlight {
    background-color: var(--fod-palette-warning-light);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

/* Layout compact */
.compact-display > .row > dd,
.compact-display > .row > dt {
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
    .row > dd {
        margin-bottom: 0;
    }
    
    .row > dt {
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--fod-palette-divider);
    }
}
```

### 8. Localizare

#### Configurare resurse
```csharp
// Model cu localizare
public class LocalizedModel
{
    [Display(Name = "FieldName", ResourceType = typeof(MyResources))]
    public string Field { get; set; }
    
    [Display(Name = "StatusField", ResourceType = typeof(MyResources))]
    public Status Status { get; set; }
}

// Enum cu localizare
public enum Status
{
    [Display(Name = "StatusActive", ResourceType = typeof(MyResources))]
    Active,
    
    [Display(Name = "StatusInactive", ResourceType = typeof(MyResources))]
    Inactive
}
```

### 9. Scenarii de Utilizare

#### Rezumat formular înainte de trimitere
```razor
@page "/submit-summary"

<FodCard>
    <FodCardHeader>
        <FodText Typo="Typo.h5">Verificați datele înainte de trimitere</FodText>
    </FodCardHeader>
    <FodCardContent>
        <dl class="row">
            @foreach (var prop in GetDisplayProperties())
            {
                <FodDisplay For="@prop.Expression" 
                            Label="@prop.Label" />
            }
        </dl>
    </FodCardContent>
    <FodCardActions>
        <FodButton Color="FodColor.Secondary" OnClick="GoBack">
            Înapoi
        </FodButton>
        <FodButton Color="FodColor.Primary" OnClick="Submit">
            Confirmă și trimite
        </FodButton>
    </FodCardActions>
</FodCard>
```

#### Dashboard cu statistici
```razor
<FodGrid container spacing="3">
    @foreach (var stat in statistics)
    {
        <FodGrid item xs="12" sm="6" md="3">
            <FodPaper Class="p-3 text-center">
                <FodDisplay For="@(() => stat)"
                            Text="@(() => stat.Value)"
                            Label="@stat.Label"
                            ValueLabel="@FormatStatValue(stat)"
                            TitleWidth="12" />
            </FodPaper>
        </FodGrid>
    }
</FodGrid>

@code {
    private string FormatStatValue(Statistic stat)
    {
        return stat.Type switch
        {
            StatType.Currency => $"{stat.Value:C}",
            StatType.Percentage => $"{stat.Value:P}",
            StatType.Number => $"{stat.Value:N0}",
            _ => stat.Value.ToString()
        };
    }
}
```

### 10. Best Practices

1. **Folosiți DisplayAttribute** - Pentru localizare consistentă
2. **ValueLabel pentru formatare** - Control complet asupra afișării
3. **TitleWidth responsive** - Ajustați pentru diferite ecrane
4. **Grupați în dl/dt/dd** - Pentru semantică HTML corectă
5. **Clase CSS descriptive** - Pentru stilizare ușoară

### 11. Performanță

- Folosiți `For` în loc de `Value` când e posibil
- Cache-uiți string-urile localizate
- Evitați expresii complexe în `Text`
- Minimizați apelurile la reflection

### 12. Accesibilitate

- Structura dl/dt/dd este semantică
- Screen readers înțeleg relația label-value
- Asigurați contrast suficient pentru text
- Folosiți aria-label pentru context adițional

### 13. Troubleshooting

#### Label-ul nu apare corect
- Verificați DisplayAttribute pe proprietate
- Verificați resurse de localizare
- Verificați că For este setat corect

#### Formatarea nu funcționează
- Verificați tipul proprietății
- Pentru formatare custom folosiți ValueLabel
- Pentru enum verificați DisplayAttribute

### 14. Extensibilitate

```razor
@* Componentă extinsă pentru tooltip-uri *@
<div class="fod-display-extended">
    <FodDisplay @ref="baseDisplay" 
                For="@For"
                Label="@Label"
                ValueLabel="@ValueLabel" />
    
    @if (!string.IsNullOrEmpty(GetDescription()))
    {
        <FodTooltip Text="@GetDescription()">
            <FodIcon Icon="@FodIcons.Material.Filled.Info" 
                     Size="FodSize.Small" />
        </FodTooltip>
    }
</div>

@code {
    [Parameter] public Expression<Func<object>> For { get; set; }
    // alte parametri
    
    private FodDisplay baseDisplay;
    
    private string GetDescription()
    {
        return baseDisplay?.GetDescription() ?? "";
    }
}
```

### 15. Concluzie

`FodDisplay` simplifică afișarea datelor în format read-only cu formatare automată și suport complet pentru localizare. Prin integrarea cu sistemul de atribute .NET și formatare inteligentă bazată pe tip, componenta reduce semnificativ codul necesar pentru afișarea profesională a datelor.