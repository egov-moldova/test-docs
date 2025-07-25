# FodTFootRow

## Documentație pentru componenta FodTFootRow

### 1. Descriere Generală

`FodTFootRow` reprezintă un rând de footer într-un tabel `FodDataTable`. Similar cu `FodTHeadRow`, oferă funcționalități automate pentru checkbox-uri, editare și expandare, dar pentru secțiunea footer a tabelului.

Caracteristici principale:
- Structură identică cu FodTHeadRow pentru consistență
- Checkbox pentru selecție în footer
- Integrare cu modul editare
- Suport pentru expandare
- Evenimente click personalizabile
- Ajustare automată la configurația tabelului

### 2. Utilizare de Bază

#### Footer simplu cu totale
```razor
<FodDataTable Items="sales" T="SaleItem" ShowFooter="true">
    <FooterContent>
        <FodTFootRow>
            <FodTd>Total</FodTd>
            <FodTd>@sales.Sum(s => s.Quantity)</FodTd>
            <FodTd>@sales.Sum(s => s.Amount).ToString("C")</FodTd>
        </FodTFootRow>
    </FooterContent>
</FodDataTable>
```

#### Footer cu checkbox
```razor
<FodDataTable Items="invoices" T="Invoice" 
              MultiSelection="true" 
              ShowFooter="true">
    <FooterContent>
        <FodTFootRow IsCheckable="true">
            <FodTd colspan="2">Total selectat:</FodTd>
            <FodTd>@selectedInvoices.Sum(i => i.Amount).ToString("C")</FodTd>
        </FodTFootRow>
    </FooterContent>
</FodDataTable>
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `IsCheckable` | `bool` | Adaugă checkbox în footer | `false` |
| `IgnoreCheckbox` | `bool` | Nu randează coloană pentru checkbox | `false` |
| `IgnoreEditable` | `bool` | Nu randează coloană pentru editare | `false` |
| `IsExpandable` | `bool` | Adaugă spațiu pentru expandare | `false` |
| `OnRowClick` | `EventCallback<MouseEventArgs>` | Eveniment click pe rând | - |
| `ChildContent` | `RenderFragment` | Conținutul footer-ului | - |

### 4. Exemple Avansate

#### Footer cu statistici multiple
```razor
<FodDataTable Items="transactions" T="Transaction" 
              ShowFooter="true"
              MultiSelection="true">
    <FooterContent>
        <FodTFootRow>
            <FodTd>Statistici</FodTd>
            <FodTd>
                <div class="text-small">
                    <div>Total: @transactions.Count()</div>
                    <div>Medie: @transactions.Average(t => t.Amount).ToString("F2")</div>
                </div>
            </FodTd>
            <FodTd>
                <div class="text-small">
                    <div>Min: @transactions.Min(t => t.Amount).ToString("C")</div>
                    <div>Max: @transactions.Max(t => t.Amount).ToString("C")</div>
                </div>
            </FodTd>
            <FodTd>
                <strong>@transactions.Sum(t => t.Amount).ToString("C")</strong>
            </FodTd>
        </FodTFootRow>
    </FooterContent>
</FodDataTable>
```

#### Footer condiționat
```razor
<FodDataTable Items="products" T="Product" ShowFooter="@showFooter">
    <FooterContent>
        @if (hasDiscountedItems)
        {
            <FodTFootRow Class="discount-footer">
                <FodTd colspan="2">Produse la reducere:</FodTd>
                <FodTd>@discountedCount</FodTd>
                <FodTd>Economii totale:</FodTd>
                <FodTd class="text-success">
                    @totalSavings.ToString("C")
                </FodTd>
            </FodTFootRow>
        }
        <FodTFootRow>
            <FodTd colspan="3">Total general:</FodTd>
            <FodTd colspan="2" class="text-end">
                <strong>@grandTotal.ToString("C")</strong>
            </FodTd>
        </FodTFootRow>
    </FooterContent>
</FodDataTable>

@code {
    private bool showFooter = true;
    private bool hasDiscountedItems => products.Any(p => p.HasDiscount);
    private int discountedCount => products.Count(p => p.HasDiscount);
    private decimal totalSavings => products
        .Where(p => p.HasDiscount)
        .Sum(p => p.OriginalPrice - p.DiscountedPrice);
    private decimal grandTotal => products.Sum(p => p.FinalPrice);
}
```

#### Footer cu acțiuni
```razor
<FodDataTable Items="tasks" T="TaskItem" 
              ShowFooter="true"
              MultiSelection="true">
    <FooterContent>
        <FodTFootRow OnRowClick="HandleFooterClick">
            <FodTd>
                <FodButton Size="FodSize.Small" 
                           Variant="FodVariant.Text"
                           OnClick="ExportSelected">
                    Export selectate
                </FodButton>
            </FodTd>
            <FodTd colspan="2">
                @($"{completedTasks}/{totalTasks} completate")
            </FodTd>
            <FodTd>
                <FodLoadingLinear Value="@completionPercentage" 
                                  FodColor="FodColor.Success" />
            </FodTd>
        </FodTFootRow>
    </FooterContent>
</FodDataTable>

@code {
    private int completedTasks => tasks.Count(t => t.IsCompleted);
    private int totalTasks => tasks.Count();
    private double completionPercentage => 
        totalTasks > 0 ? (double)completedTasks / totalTasks * 100 : 0;
}
```

### 5. Footer cu Multiple Rânduri

```razor
<FodDataTable Items="financialData" T="FinancialRecord" ShowFooter="true">
    <FooterContent>
        <!-- Subtotaluri -->
        <FodTFootRow Class="subtotal-row">
            <FodTd colspan="2">Subtotal Venituri:</FodTd>
            <FodTd class="text-end">@incomeSubtotal.ToString("C")</FodTd>
            <FodTd colspan="2">Subtotal Cheltuieli:</FodTd>
            <FodTd class="text-end">@expenseSubtotal.ToString("C")</FodTd>
        </FodTFootRow>
        
        <!-- Totaluri -->
        <FodTFootRow Class="total-row">
            <FodTd colspan="4">Profit Net:</FodTd>
            <FodTd colspan="2" class="text-end">
                <strong class="@(netProfit >= 0 ? "text-success" : "text-danger")">
                    @netProfit.ToString("C")
                </strong>
            </FodTd>
        </FodTFootRow>
    </FooterContent>
</FodDataTable>
```

### 6. Stilizare

```css
/* Footer distinctiv */
.fod-table tfoot .fod-table-row {
    background-color: var(--fod-palette-grey-100);
    font-weight: 600;
}

/* Footer cu borduri */
.fod-table tfoot .fod-table-row {
    border-top: 2px solid var(--fod-palette-divider);
}

/* Rânduri multiple în footer */
.subtotal-row {
    background-color: var(--fod-palette-grey-50);
    font-style: italic;
}

.total-row {
    background-color: var(--fod-palette-primary-light);
    color: var(--fod-palette-primary-contrastText);
}

/* Footer sticky */
.sticky-footer tfoot {
    position: sticky;
    bottom: 0;
    background-color: white;
    box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
}
```

### 7. Integrare cu Calcule Dinamice

```razor
<FodDataTable Items="@orderItems" T="OrderItem" ShowFooter="true">
    <FooterContent>
        <FodTFootRow>
            <FodTd colspan="3">
                <div class="d-flex justify-content-between">
                    <span>Subtotal:</span>
                    <span>@CalculateSubtotal().ToString("C")</span>
                </div>
                <div class="d-flex justify-content-between">
                    <span>TVA (20%):</span>
                    <span>@CalculateTax().ToString("C")</span>
                </div>
                <div class="d-flex justify-content-between mt-2 pt-2 border-top">
                    <strong>Total:</strong>
                    <strong>@CalculateTotal().ToString("C")</strong>
                </div>
            </FodTd>
        </FodTFootRow>
    </FooterContent>
</FodDataTable>

@code {
    private decimal CalculateSubtotal() => 
        orderItems.Sum(i => i.Quantity * i.UnitPrice);
    
    private decimal CalculateTax() => 
        CalculateSubtotal() * 0.20m;
    
    private decimal CalculateTotal() => 
        CalculateSubtotal() + CalculateTax();
}
```

### 8. Footer Responsiv

```razor
<FodDataTable Items="reports" T="Report" ShowFooter="true">
    <FooterContent>
        <FodTFootRow Class="responsive-footer">
            <FodTd Class="d-none d-md-table-cell">
                Total rapoarte: @reports.Count()
            </FodTd>
            <FodTd Class="d-none d-lg-table-cell">
                Pagini totale: @reports.Sum(r => r.PageCount)
            </FodTd>
            <FodTd>
                <FodChip Size="FodSize.Small" Color="FodColor.Primary">
                    @reports.Count(r => r.Status == "Completed") finalizate
                </FodChip>
            </FodTd>
        </FodTFootRow>
    </FooterContent>
</FodDataTable>
```

### 9. Best Practices

1. **Consistență cu header** - Păstrați același număr de coloane
2. **Calcule eficiente** - Cache-uiți rezultatele pentru performanță
3. **Responsive design** - Adaptați footer-ul pentru mobile
4. **Vizibilitate clară** - Folosiți stilizare distinctivă
5. **Informații relevante** - Afișați doar date utile în footer

### 10. Performanță

- Calculele se execută doar la schimbarea datelor
- Folosiți `@key` pentru optimizare în footer-e complexe
- Evitați calcule grele în randare

### 11. Accesibilitate

- Structură semantică corectă cu `<tfoot>`
- Folosiți `colspan` pentru layout clar
- ARIA labels pentru interacțiuni

### 12. Troubleshooting

#### Footer nu apare
- Verificați `ShowFooter="true"` pe DataTable
- Asigurați-vă că aveți FooterContent definit
- Verificați că datele sunt încărcate

#### Aliniere incorectă
- Numărați coloanele din header vs footer
- Includeți coloane pentru checkbox/editare
- Folosiți colspan pentru ajustare

### 13. Concluzie

`FodTFootRow` completează funcționalitatea tabelelor FOD oferind o modalitate consistentă de afișare a informațiilor sumare și acțiunilor în footer. Cu aceeași flexibilitate ca FodTHeadRow, permite crearea de footer-e informative și interactive.