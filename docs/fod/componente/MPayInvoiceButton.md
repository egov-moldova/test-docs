# MPayInvoiceButton

## Documentație pentru componenta MPayInvoiceButton

### 1. Descriere Generală

`MPayInvoiceButton` este o componentă specializată pentru descărcarea și printarea facturilor din sistemul MPay. Extinde funcționalitatea `FodButton` adăugând capabilități specifice pentru gestionarea facturilor electronice guvernamentale.

Caracteristici principale:
- Descărcare automată facturi MPay
- Suport pentru printare directă
- Gestionare facturi standard și adiționale
- Integrare cu serviciul de printare
- URL-uri configurabile pentru diferite medii
- Moștenește toate proprietățile FodButton
- Loading state automat în timpul operațiilor

### 2. Utilizare de Bază

#### Buton descărcare factură pentru cerere
```razor
<MPayInvoiceButton RequestId="@requestId" 
                   DoDownload="true" />
```

#### Buton printare factură cu număr comandă
```razor
<MPayInvoiceButton ServiceCode="APOSTILA_01" 
                   OrderNumber="@orderNumber"
                   DoPrint="true" />
```

#### Buton personalizat pentru factură
```razor
<MPayInvoiceButton RequestId="@invoiceRequest.Id" 
                   Color="FodColor.Primary"
                   Variant="FodVariant.Outlined"
                   TooltipText="Descarcă factura PDF">
    <FodIcon Icon="@FodIcons.Material.Filled.Receipt" />
    Descarcă Factura
</MPayInvoiceButton>
```

### 3. Parametri

| Parametru | Tip | Descriere | Valoare Implicită |
|-----------|-----|-----------|-------------------|
| `RequestId` | `Guid?` | ID-ul cererii pentru factură | `null` |
| `TooltipText` | `string` | Text tooltip pentru buton | - |
| `ServiceCode` | `string` | Codul serviciului | - |
| `OrderNumber` | `string` | Numărul comenzii | - |
| `DoDownload` | `bool?` | Activează descărcarea automată | `null` |
| `DoPrint` | `bool?` | Activează printarea automată | `null` |
| `BaseHref` | `string?` | URL de bază pentru API | `null` |
| `IsAdditionalInvoice` | `bool` | Indică factură adițională | `false` |
| `AdditionalServices` | `MPayService` | Servicii adiționale MPay | - |

### 4. Moștenire din FodButton

Componenta moștenește toți parametrii din `FodButton`:
- `Variant`, `Color`, `Size`, `Disabled`, etc.

### 5. Exemple Avansate

#### Factură cu acțiuni multiple
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6">Factura #@invoice.Number</FodText>
        <FodText>Suma: @invoice.Amount.ToString("C")</FodText>
        
        <FodDivider Class="my-3" />
        
        <div class="d-flex gap-2">
            <MPayInvoiceButton RequestId="@invoice.RequestId"
                               DoDownload="true"
                               Color="FodColor.Primary">
                <FodIcon Icon="@FodIcons.Material.Filled.Download" />
                Descarcă
            </MPayInvoiceButton>
            
            <MPayInvoiceButton RequestId="@invoice.RequestId"
                               DoPrint="true"
                               Color="FodColor.Secondary"
                               Variant="FodVariant.Outlined">
                <FodIcon Icon="@FodIcons.Material.Filled.Print" />
                Printează
            </MPayInvoiceButton>
            
            @if (invoice.HasAdditionalServices)
            {
                <MPayInvoiceButton RequestId="@invoice.RequestId"
                                   IsAdditionalInvoice="true"
                                   DoDownload="true"
                                   Color="FodColor.Info">
                    Factură servicii adiționale
                </MPayInvoiceButton>
            }
        </div>
    </FodCardContent>
</FodCard>
```

#### Tabel cu facturi și acțiuni
```razor
<FodDataTable T="Invoice" Items="@invoices">
    <FodColumn Title="Număr" Field="@(i => i.Number)" />
    <FodColumn Title="Data" Field="@(i => i.Date)" Format="dd.MM.yyyy" />
    <FodColumn Title="Suma" Field="@(i => i.Amount)" Format="C" />
    <FodColumn Title="Status" Field="@(i => i.Status)">
        <Template>
            <FodChip Color="@GetStatusColor(context.Status)" Size="FodSize.Small">
                @context.Status
            </FodChip>
        </Template>
    </FodColumn>
    <FodColumn Title="Acțiuni">
        <Template>
            @if (context.IsPaid)
            {
                <MPayInvoiceButton RequestId="@context.RequestId"
                                   DoDownload="true"
                                   Size="FodSize.Small"
                                   TooltipText="Descarcă PDF" />
            }
            else
            {
                <FodButton Size="FodSize.Small" 
                           Color="FodColor.Warning"
                           OnClick="() => PayInvoice(context)">
                    Plătește
                </FodButton>
            }
        </Template>
    </FodColumn>
</FodDataTable>

@code {
    private List<Invoice> invoices;
    
    private FodColor GetStatusColor(string status) => status switch
    {
        "Plătită" => FodColor.Success,
        "În așteptare" => FodColor.Warning,
        "Anulată" => FodColor.Error,
        _ => FodColor.Default
    };
}
```

#### Configurare pentru medii diferite
```razor
@inject IConfiguration Configuration

<MPayInvoiceButton RequestId="@requestId"
                   BaseHref="@GetApiBaseUrl()"
                   DoDownload="true"
                   @onclick:stopPropagation="true">
    @if (isDownloading)
    {
        <FodLoadingCircular Size="FodSize.Small" />
    }
    else
    {
        <span>Descarcă factura</span>
    }
</MPayInvoiceButton>

@code {
    private bool isDownloading;
    private Guid requestId;
    
    private string GetApiBaseUrl()
    {
        var environment = Configuration["Environment"];
        return environment switch
        {
            "Production" => "https://api.mpay.gov.md/",
            "Staging" => "https://staging-api.mpay.gov.md/",
            _ => "https://localhost:5001/"
        };
    }
    
    protected override void OnParametersSet()
    {
        // Resetare state la schimbarea parametrilor
        isDownloading = false;
    }
}
```

### 6. Integrare cu Servicii

#### Handler pentru descărcare cu notificări
```razor
<MPayInvoiceButton RequestId="@invoice.Id"
                   DoDownload="@shouldDownload"
                   @ref="invoiceButton">
    Descarcă factura
</MPayInvoiceButton>

@code {
    [Inject] private INotificationService NotificationService { get; set; }
    
    private MPayInvoiceButton invoiceButton;
    private bool shouldDownload;
    
    private async Task HandleDownloadWithNotification()
    {
        try
        {
            shouldDownload = true;
            StateHasChanged();
            
            await NotificationService.ShowSuccess("Factura se descarcă...");
        }
        catch (Exception ex)
        {
            await NotificationService.ShowError($"Eroare la descărcare: {ex.Message}");
        }
        finally
        {
            shouldDownload = false;
        }
    }
}
```

#### Batch download pentru facturi multiple
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6">Facturi selectate: @selectedInvoices.Count</FodText>
        
        <FodButton Color="FodColor.Primary"
                   Disabled="@(!selectedInvoices.Any())"
                   OnClick="DownloadAllSelected">
            <FodIcon Icon="@FodIcons.Material.Filled.GetApp" />
            Descarcă toate
        </FodButton>
    </FodCardContent>
</FodCard>

<div class="invoice-list">
    @foreach (var invoice in invoices)
    {
        <div class="invoice-item">
            <FodCheckbox @bind-Value="invoice.IsSelected" />
            <span>@invoice.Number - @invoice.Amount.ToString("C")</span>
            <MPayInvoiceButton RequestId="@invoice.Id"
                               DoDownload="true"
                               Size="FodSize.Small" />
        </div>
    }
</div>

@code {
    private List<InvoiceModel> invoices;
    private List<InvoiceModel> selectedInvoices => 
        invoices?.Where(i => i.IsSelected).ToList() ?? new();
    
    private async Task DownloadAllSelected()
    {
        foreach (var invoice in selectedInvoices)
        {
            // Trigger download pentru fiecare factură
            await Task.Delay(500); // Delay pentru a evita blocarea
        }
    }
}
```

### 7. JavaScript Interop

Componenta folosește JavaScript pentru descărcare:

```javascript
window.triggerFileDownload = (fileUrl) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
```

### 8. Stilizare CSS

```css
/* Stiluri pentru butoane factură */
.mpay-invoice-button {
    min-width: 120px;
}

.mpay-invoice-button.loading {
    pointer-events: none;
    opacity: 0.7;
}

/* Grup de butoane factură */
.invoice-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.invoice-actions .fod-button {
    flex: 0 0 auto;
}

/* Responsive */
@media (max-width: 576px) {
    .invoice-actions {
        flex-direction: column;
    }
    
    .invoice-actions .fod-button {
        width: 100%;
    }
}
```

### 9. Scenarii de Utilizare

#### Dashboard facturi cu filtrare
```razor
@page "/invoices"

<FodFilter FilterT="InvoiceFilter" TableId="invoices-table">
    <FodDateRangePicker Label="Perioadă" 
                        @bind-StartDate="context.StartDate"
                        @bind-EndDate="context.EndDate" />
    <FodSelect T="string" Label="Status" @bind-Value="context.Status">
        <FodSelectItem Value="">Toate</FodSelectItem>
        <FodSelectItem Value="paid">Plătite</FodSelectItem>
        <FodSelectItem Value="pending">În așteptare</FodSelectItem>
    </FodSelect>
</FodFilter>

<FodFilteredTable T="InvoiceViewModel" 
                  FilterT="InvoiceFilter"
                  Id="invoices-table"
                  Items="@filteredInvoices">
    <FodColumn Title="Acțiuni">
        <Template>
            <div class="btn-group">
                <MPayInvoiceButton RequestId="@context.RequestId"
                                   DoDownload="true"
                                   Size="FodSize.Small"
                                   Color="FodColor.Primary"
                                   Disabled="@(!context.IsPaid)">
                    <FodIcon Icon="@FodIcons.Material.Filled.GetApp" 
                             Size="FodSize.Small" />
                </MPayInvoiceButton>
                
                <MPayInvoiceButton RequestId="@context.RequestId"
                                   DoPrint="true"
                                   Size="FodSize.Small"
                                   Color="FodColor.Secondary"
                                   Disabled="@(!context.IsPaid)"
                                   TooltipText="Printează">
                    <FodIcon Icon="@FodIcons.Material.Filled.Print" 
                             Size="FodSize.Small" />
                </MPayInvoiceButton>
            </div>
        </Template>
    </FodColumn>
</FodFilteredTable>
```

### 10. Best Practices

1. **Validare parametri** - Verificați RequestId sau ServiceCode/OrderNumber
2. **Loading state** - Indicați starea de încărcare pentru operații lungi
3. **Error handling** - Tratați erorile de descărcare/printare
4. **Tooltip-uri** - Adăugați tooltip-uri descriptive
5. **Disable state** - Dezactivați butoanele când factura nu e disponibilă
6. **Stop propagation** - Folosiți pentru butoane în rânduri de tabel

### 11. Performanță

- Evitați descărcări simultane multiple
- Implementați debouncing pentru click-uri rapide
- Cache-uiți URL-urile generate când e posibil
- Folosiți loading indicators pentru feedback

### 12. Securitate

- Validați permisiunile înainte de afișare
- Nu expuneți ID-uri sensibile în URL
- Folosiți HTTPS pentru toate cererile
- Implementați rate limiting pentru descărcări

### 13. Troubleshooting

#### Factura nu se descarcă
- Verificați că RequestId sau ServiceCode/OrderNumber sunt corecte
- Verificați permisiunile utilizatorului
- Verificați configurarea BaseHref
- Verificați blocarea popup-urilor în browser

#### Printarea nu funcționează
- Verificați că IPrintingService este înregistrat
- Verificați suportul browser pentru printare
- Verificați că PDF-ul este valid

### 14. Concluzie

`MPayInvoiceButton` simplifică integrarea cu sistemul MPay pentru gestionarea facturilor electronice. Cu suport pentru descărcare și printare, configurare flexibilă și moștenirea completă din FodButton, componenta oferă o soluție completă pentru necesitățile de facturare în aplicațiile guvernamentale.