# PrintingService

## Descriere Generală

`PrintingService` este serviciul responsabil pentru gestionarea funcționalității de printare în aplicații Blazor. Utilizează biblioteca Print.js pentru a oferi suport de printare pentru diverse tipuri de conținut: PDF, HTML, imagini și JSON. Serviciul oferă o interfață simplă pentru printarea documentelor cu opțiuni de personalizare.

## Configurare

### Înregistrare în Dependency Injection

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddScoped<IPrintingService, PrintingService>();
```

### Import JavaScript Module

Serviciul importă automat modulul JavaScript necesar la prima utilizare:
```javascript
// Modulul print.js este inclus în FOD.Components
// Calea: _content/FOD.Components/Scripts/print.js
```

## Interfața IPrintingService

```csharp
public interface IPrintingService
{
    Task Print(PrintOptions options);
    Task Print(string printable, PrintType printType = PrintType.Pdf);
    Task Print(string printable, bool showModal, PrintType printType = PrintType.Pdf);
}
```

## Clase asociate

### PrintOptions

```csharp
public class PrintOptions
{
    public PrintOptions() { }
    
    public PrintOptions(string printable)
    {
        Printable = printable;
    }
    
    public PrintOptions(string printable, string modalMessage, PrintType printType = PrintType.Pdf)
    {
        Printable = printable;
        ModalMessage = modalMessage;
        ShowModal = true;
        Type = printType;
    }
    
    public string Printable { get; init; }
    public PrintType Type { get; init; }
    public bool ShowModal { get; init; }
    public string ModalMessage { get; init; } = "Retrieving Document...";
    public bool Base64 { get; set; }
}
```

### PrintType Enum

```csharp
public enum PrintType
{
    Pdf,
    Html,
    Image,
    Json
}
```

## Metode disponibile

### Print(PrintOptions options)

Printează conținut folosind opțiuni detaliate.

**Parametri:**
- `options: PrintOptions` - Obiect cu toate opțiunile de printare

**Returnează:** `Task`

### Print(string printable, PrintType printType)

Printează conținut cu tip specificat.

**Parametri:**
- `printable: string` - URL, Base64 sau ID element HTML
- `printType: PrintType` - Tipul conținutului (default: Pdf)

**Returnează:** `Task`

### Print(string printable, bool showModal, PrintType printType)

Printează conținut cu opțiune modal.

**Parametri:**
- `printable: string` - URL, Base64 sau ID element HTML
- `showModal: bool` - Afișează modal de încărcare
- `printType: PrintType` - Tipul conținutului (default: Pdf)

**Returnează:** `Task`

## Exemple de utilizare

### Printare PDF simplu

```razor
@inject IPrintingService PrintingService

<FodButton @onclick="PrintPdf">
    <FodIcon Icon="print" /> Printează Document
</FodButton>

@code {
    private async Task PrintPdf()
    {
        await PrintingService.Print("/documents/invoice.pdf");
    }
}
```

### Printare PDF cu Base64

```razor
@inject IPrintingService PrintingService

<FodButton @onclick="PrintBase64Pdf">
    Printează Factura
</FodButton>

@code {
    private string pdfBase64Content = "JVBERi0xLjQKJcfs..."; // Base64 string
    
    private async Task PrintBase64Pdf()
    {
        var options = new PrintOptions
        {
            Printable = pdfBase64Content,
            Type = PrintType.Pdf,
            Base64 = true,
            ShowModal = true,
            ModalMessage = "Se încarcă factura..."
        };
        
        await PrintingService.Print(options);
    }
}
```

### Printare element HTML

```razor
@inject IPrintingService PrintingService

<div id="printable-content">
    <h2>Raport Lunar</h2>
    <table class="table">
        <thead>
            <tr>
                <th>Produs</th>
                <th>Cantitate</th>
                <th>Preț</th>
            </tr>
        </thead>
        <tbody>
            @foreach (var item in items)
            {
                <tr>
                    <td>@item.Product</td>
                    <td>@item.Quantity</td>
                    <td>@item.Price.ToString("C")</td>
                </tr>
            }
        </tbody>
    </table>
</div>

<FodButton @onclick="PrintReport">
    <FodIcon Icon="print" /> Printează Raport
</FodButton>

@code {
    private async Task PrintReport()
    {
        await PrintingService.Print("printable-content", PrintType.Html);
    }
}
```

### Printare imagini

```razor
@inject IPrintingService PrintingService

<div class="image-gallery">
    @foreach (var image in images)
    {
        <img src="@image" alt="Gallery image" />
    }
</div>

<FodButton @onclick="PrintImages">
    Printează Galerie
</FodButton>

@code {
    private List<string> images = new()
    {
        "/images/photo1.jpg",
        "/images/photo2.jpg",
        "/images/photo3.jpg"
    };
    
    private async Task PrintImages()
    {
        // Pentru o singură imagine
        await PrintingService.Print(images[0], PrintType.Image);
        
        // Pentru mai multe imagini, folosiți array în PrintOptions
        var options = new PrintOptions
        {
            Printable = string.Join(",", images),
            Type = PrintType.Image,
            ShowModal = true,
            ModalMessage = "Se pregătesc imaginile pentru printare..."
        };
        
        await PrintingService.Print(options);
    }
}
```

### Printare date JSON ca tabel

```razor
@inject IPrintingService PrintingService

<FodButton @onclick="PrintJsonData">
    Printează Tabel Date
</FodButton>

@code {
    private List<Employee> employees = new()
    {
        new() { Name = "Ion Popescu", Position = "Manager", Salary = 5000 },
        new() { Name = "Maria Ionescu", Position = "Developer", Salary = 4000 },
        new() { Name = "Andrei Radu", Position = "Designer", Salary = 3500 }
    };
    
    private async Task PrintJsonData()
    {
        var jsonData = System.Text.Json.JsonSerializer.Serialize(employees);
        
        await PrintingService.Print(jsonData, PrintType.Json);
    }
    
    private class Employee
    {
        public string Name { get; set; }
        public string Position { get; set; }
        public decimal Salary { get; set; }
    }
}
```

### Component wrapper pentru printare

```razor
@inject IPrintingService PrintingService

<div class="printable-section">
    <div class="no-print">
        <FodButton @onclick="Print" Color="FodColor.Primary">
            <FodIcon Icon="print" /> @ButtonText
        </FodButton>
    </div>
    
    <div id="@printId">
        @ChildContent
    </div>
</div>

@code {
    [Parameter] public RenderFragment ChildContent { get; set; }
    [Parameter] public string ButtonText { get; set; } = "Printează";
    [Parameter] public bool ShowModal { get; set; } = true;
    [Parameter] public string ModalMessage { get; set; } = "Se pregătește documentul...";
    
    private string printId = $"print-{Guid.NewGuid():N}";
    
    private async Task Print()
    {
        await PrintingService.Print(printId, ShowModal, PrintType.Html);
    }
}

<style>
    @media print {
        .no-print {
            display: none !important;
        }
    }
</style>
```

### Service extins cu evenimente

```csharp
public interface IExtendedPrintingService : IPrintingService
{
    event EventHandler<PrintEventArgs> BeforePrint;
    event EventHandler<PrintEventArgs> AfterPrint;
    Task<bool> PrintWithConfirmation(PrintOptions options);
}

public class ExtendedPrintingService : IExtendedPrintingService
{
    private readonly IPrintingService _innerService;
    private readonly IJSRuntime _jsRuntime;
    
    public event EventHandler<PrintEventArgs> BeforePrint;
    public event EventHandler<PrintEventArgs> AfterPrint;
    
    public async Task Print(PrintOptions options)
    {
        BeforePrint?.Invoke(this, new PrintEventArgs { Options = options });
        
        await _innerService.Print(options);
        
        AfterPrint?.Invoke(this, new PrintEventArgs { Options = options });
    }
    
    public async Task<bool> PrintWithConfirmation(PrintOptions options)
    {
        var confirmed = await _jsRuntime.InvokeAsync<bool>(
            "confirm", "Doriți să printați documentul?");
            
        if (confirmed)
        {
            await Print(options);
        }
        
        return confirmed;
    }
}
```

## Tratare erori

### Service cu error handling

```csharp
public class SafePrintingService : IPrintingService
{
    private readonly IPrintingService _innerService;
    private readonly ILogger<SafePrintingService> _logger;
    private readonly INotificationService _notificationService;
    
    public async Task Print(PrintOptions options)
    {
        try
        {
            _logger.LogInformation("Starting print job: {Type}", options.Type);
            await _innerService.Print(options);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Print failed for {Type}", options.Type);
            
            await _notificationService.ShowError(
                "Eroare la printare. Verificați imprimanta și încercați din nou.");
                
            throw;
        }
    }
}
```

### Fallback pentru browsere incompatibile

```razor
@inject IPrintingService PrintingService
@inject IJSRuntime JSRuntime

<FodButton @onclick="PrintWithFallback">
    Printează Document
</FodButton>

@code {
    private string documentUrl = "/documents/report.pdf";
    
    private async Task PrintWithFallback()
    {
        try
        {
            await PrintingService.Print(documentUrl);
        }
        catch
        {
            // Fallback: deschide în tab nou
            await JSRuntime.InvokeVoidAsync("window.open", documentUrl, "_blank");
        }
    }
}
```

## Note tehnice

1. **Browser compatibility** - Print.js suportă majoritatea browserelor moderne
2. **Module loading** - Modulul JS este încărcat lazy la prima utilizare
3. **CORS** - Pentru PDF-uri externe, serverul trebuie să permită CORS
4. **Base64 size** - Atenție la dimensiunea string-urilor Base64
5. **Print preview** - Browserul afișează propriul preview înainte de printare

## Stilizare pentru print

```css
/* Stiluri specifice pentru print */
@media print {
    /* Ascunde elemente neprintabile */
    .no-print {
        display: none !important;
    }
    
    /* Forțează culori */
    * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    
    /* Page breaks */
    .page-break {
        page-break-after: always;
    }
    
    /* Dimensiuni fixe pentru printare */
    @page {
        size: A4;
        margin: 20mm;
    }
}
```

## Bune practici

1. **Loading states** - Afișați indicator de încărcare pentru fișiere mari
2. **Error handling** - Gestionați erori de rețea și browsere incompatibile
3. **Print preview** - Oferiți preview înainte de printare pentru documente complexe
4. **Memory management** - Eliberați resursele pentru Base64 mari
5. **User feedback** - Informați utilizatorul despre starea printării
6. **Accessibility** - Asigurați că butoanele de printare sunt accesibile
7. **Print styles** - Definiți stiluri CSS specifice pentru print

## Concluzie

PrintingService oferă o soluție completă pentru printarea diverselor tipuri de conținut în aplicații Blazor. Cu suport pentru PDF, HTML, imagini și JSON, precum și opțiuni de personalizare, serviciul facilitează implementarea funcționalității de printare într-un mod simplu și eficient.