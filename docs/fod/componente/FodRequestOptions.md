# FodRequestOptions

## Documentație pentru componenta FodRequestOptions

### 1. Descriere Generală

`FodRequestOptions` este o componentă container care încarcă și furnizează opțiunile de configurare pentru cererile de servicii guvernamentale. Componenta obține opțiunile de la server pe baza tipului de cerere și le face disponibile pentru componentele copil prin `CascadingValue`.

Caracteristici principale:
- Încărcare asincronă a opțiunilor de cerere
- Furnizare automată prin cascadă a opțiunilor
- Indicator de încărcare integrat
- Suport pentru opțiuni de apostilă
- Integrare cu IRequestService
- Management automat al stării de încărcare

### 2. Utilizare de Bază

#### Încărcare opțiuni pentru formular cerere
```razor
<FodRequestOptions RequestTypeCode="APOSTILA_01" 
                   RequestService="@requestService"
                   RequestModel="@requestModel">
    <FodForm>
        <!-- Câmpurile formularului au acces la RequestOptions -->
        <FodInput Label="Nume" @bind-Value="model.Name" />
        
        <!-- Acces la opțiuni specifice -->
        <FodApostila />
    </FodForm>
</FodRequestOptions>
```

#### Utilizare cu serviciu injectat
```razor
@inject IRequestService RequestService

<FodRequestOptions RequestTypeCode="@currentRequestType" 
                   RequestService="@RequestService"
                   RequestModel="@requestData">
    <RequestForm />
</FodRequestOptions>

@code {
    private string currentRequestType = "SERVICE_001";
    private FodRequestModel requestData = new();
}
```

### 3. Parametri

| Parametru | Tip | Descriere | Obligatoriu |
|-----------|-----|-----------|-------------|
| `ChildContent` | `RenderFragment` | Conținutul care va avea acces la opțiuni | Nu |
| `RequestService` | `IRequestService` | Serviciul pentru obținerea opțiunilor | Da |
| `RequestModel` | `FodRequestModel` | Modelul cererii curente | Da |
| `RequestTypeCode` | `string` | Codul tipului de cerere | Da |

### 4. Valori Cascade Furnizate

Componenta furnizează trei valori prin cascadă:
1. `FodRequestOptionsModel` - Opțiunile complete
2. `ApostilaOptions` - Opțiunile specifice apostilei
3. `FodRequestModel` - Modelul cererii

### 5. Exemple Avansate

#### Formular dinamic bazat pe opțiuni
```razor
<FodRequestOptions RequestTypeCode="@SelectedServiceType" 
                   RequestService="@RequestService"
                   RequestModel="@currentRequest">
    <CascadingValue Value="this" IsFixed="true">
        <DynamicRequestForm />
    </CascadingValue>
</FodRequestOptions>

@* DynamicRequestForm.razor *@
@code {
    [CascadingParameter] 
    public FodRequestOptionsModel Options { get; set; }
    
    [CascadingParameter] 
    public FodRequestModel Request { get; set; }

    protected override void OnParametersSet()
    {
        if (Options != null)
        {
            // Construiește formularul dinamic bazat pe opțiuni
            BuildFormFields(Options.AvailableFields);
        }
    }
    
    private void BuildFormFields(List<FieldOption> fields)
    {
        foreach (var field in fields)
        {
            switch (field.Type)
            {
                case "text":
                    // Adaugă câmp text
                    break;
                case "date":
                    // Adaugă selector dată
                    break;
                case "select":
                    // Adaugă dropdown cu opțiuni
                    break;
            }
        }
    }
}
```

#### Handler pentru schimbare tip cerere
```razor
<FodSelect T="string" @bind-Value="selectedRequestType" 
           Label="Tip cerere">
    @foreach (var type in availableTypes)
    {
        <FodSelectItem Value="@type.Code">@type.Name</FodSelectItem>
    }
</FodSelect>

@if (!string.IsNullOrEmpty(selectedRequestType))
{
    <FodRequestOptions RequestTypeCode="@selectedRequestType" 
                       RequestService="@RequestService"
                       RequestModel="@requestModel"
                       @key="@selectedRequestType">
        <RequestDetailsForm OnSubmit="HandleSubmit" />
    </FodRequestOptions>
}

@code {
    private string selectedRequestType;
    private FodRequestModel requestModel = new();
    private List<RequestType> availableTypes;
    
    [Inject] private IRequestService RequestService { get; set; }
    
    protected override async Task OnInitializedAsync()
    {
        availableTypes = await RequestService.GetAvailableTypes();
    }
    
    private void HandleSubmit()
    {
        // Procesare cerere cu opțiunile încărcate
    }
}
```

#### Wizard cu opțiuni per pas
```razor
<FodWizard>
    <FodWizardStep Title="Selectare serviciu">
        <ServiceSelector @bind-Value="serviceType" />
    </FodWizardStep>
    
    <FodWizardStep Title="Detalii cerere">
        @if (!string.IsNullOrEmpty(serviceType))
        {
            <FodRequestOptions RequestTypeCode="@serviceType" 
                               RequestService="@RequestService"
                               RequestModel="@request">
                <RequestDetailsStep />
            </FodRequestOptions>
        }
    </FodWizardStep>
    
    <FodWizardStep Title="Verificare">
        <RequestSummary Request="@request" />
    </FodWizardStep>
</FodWizard>

@code {
    private string serviceType;
    private FodRequestModel request = new();
    
    [Inject] private IRequestService RequestService { get; set; }
}
```

### 6. Integrare cu Servicii

#### Implementare IRequestService
```csharp
public interface IRequestService
{
    Task<FodRequestOptionsModel> GetOptions(string requestTypeCode);
    Task<List<RequestType>> GetAvailableTypes();
    // alte metode...
}

public class RequestService : IRequestService
{
    private readonly HttpClient _httpClient;
    
    public async Task<FodRequestOptionsModel> GetOptions(string requestTypeCode)
    {
        var response = await _httpClient.GetAsync(
            $"api/requests/options/{requestTypeCode}");
        
        if (response.IsSuccessStatusCode)
        {
            return await response.Content
                .ReadFromJsonAsync<FodRequestOptionsModel>();
        }
        
        throw new Exception($"Failed to load options for {requestTypeCode}");
    }
}
```

#### Model FodRequestOptionsModel
```csharp
public class FodRequestOptionsModel
{
    public string RequestTypeCode { get; set; }
    public string RequestTypeName { get; set; }
    public List<FieldOption> AvailableFields { get; set; }
    public ApostilaOptions ApostilaOptions { get; set; }
    public ValidationRules ValidationRules { get; set; }
    public List<DocumentType> RequiredDocuments { get; set; }
    public PricingInfo Pricing { get; set; }
    public ProcessingTimeInfo ProcessingTime { get; set; }
}

public class ApostilaOptions
{
    public bool IsApostilaService { get; set; }
    public List<Country> AvailableCountries { get; set; }
    public List<DocumentType> ApostilableDocuments { get; set; }
}
```

### 7. Gestionare Stări de Încărcare

#### Loading state customizat
```razor
<FodRequestOptions RequestTypeCode="@typeCode" 
                   RequestService="@RequestService"
                   RequestModel="@model">
    <FodCard>
        <FodCardContent>
            @if (IsOptionsLoaded)
            {
                <RequestForm />
            }
            else
            {
                <FodSkeleton Height="200" />
            }
        </FodCardContent>
    </FodCard>
</FodRequestOptions>

@code {
    [CascadingParameter] 
    public FodRequestOptionsModel Options { get; set; }
    
    private bool IsOptionsLoaded => Options != null;
}
```

#### Error handling
```razor
@if (loadError != null)
{
    <FodAlert Severity="FodSeverity.Error">
        Nu s-au putut încărca opțiunile: @loadError
    </FodAlert>
}
else
{
    <FodRequestOptions RequestTypeCode="@requestType" 
                       RequestService="@RequestService"
                       RequestModel="@requestModel">
        <RequestContent />
    </FodRequestOptions>
}

@code {
    private string loadError;
    
    protected override async Task OnInitializedAsync()
    {
        try
        {
            // Verificare prealabilă
            await RequestService.CheckAvailability(requestType);
        }
        catch (Exception ex)
        {
            loadError = ex.Message;
        }
    }
}
```

### 8. Scenarii de Utilizare

#### Formular cu validare bazată pe opțiuni
```razor
<FodRequestOptions RequestTypeCode="CERTIFICATE_001" 
                   RequestService="@RequestService"
                   RequestModel="@certificateRequest">
    <EditForm Model="certificateRequest" OnValidSubmit="HandleSubmit">
        <DataAnnotationsValidator />
        
        <OptionsBasedValidator />
        
        <FodInput Label="Nume" @bind-Value="certificateRequest.Name" />
        
        @if (Options?.RequiredDocuments?.Any() == true)
        {
            <h4>Documente necesare</h4>
            @foreach (var doc in Options.RequiredDocuments)
            {
                <FodFileUpload Label="@doc.Name" 
                               Accept="@doc.AcceptedFormats" />
            }
        }
        
        <FodButton Type="submit">Trimite cererea</FodButton>
    </EditForm>
</FodRequestOptions>

@code {
    [CascadingParameter] 
    public FodRequestOptionsModel Options { get; set; }
    
    private CertificateRequest certificateRequest = new();
}
```

#### Multi-service dashboard
```razor
@foreach (var service in userServices)
{
    <FodGrid item xs="12" md="6" lg="4">
        <FodRequestOptions RequestTypeCode="@service.Code" 
                           RequestService="@RequestService"
                           RequestModel="@GetRequestModel(service.Code)"
                           @key="@service.Code">
            <ServiceCard Service="@service" />
        </FodRequestOptions>
    </FodGrid>
}

@code {
    private List<UserService> userServices;
    private Dictionary<string, FodRequestModel> requestModels = new();
    
    private FodRequestModel GetRequestModel(string code)
    {
        if (!requestModels.ContainsKey(code))
        {
            requestModels[code] = new FodRequestModel();
        }
        return requestModels[code];
    }
}
```

### 9. Best Practices

1. **Caching** - Cache-uiți opțiunile pentru performanță
2. **Error handling** - Tratați erorile de încărcare
3. **Loading states** - Afișați feedback în timpul încărcării
4. **Key usage** - Folosiți `@key` pentru re-randare la schimbare
5. **Null checks** - Verificați existența opțiunilor înainte de utilizare

### 10. Performanță

- Cache opțiunile frecvent utilizate
- Folosiți `IsFixed="true"` pentru CascadingValue când e posibil
- Evitați încărcări repetate pentru același tip
- Implementați retry logic pentru reziliență

### 11. Troubleshooting

#### Opțiunile nu se încarcă
- Verificați că RequestService este injectat corect
- Verificați că RequestTypeCode este valid
- Verificați conectivitatea la API
- Verificați permisiunile utilizatorului

#### Componentele copil nu primesc opțiunile
- Verificați că folosiți CascadingParameter corect
- Verificați ordinea CascadingValue
- Asigurați-vă că ChildContent este randat după încărcare

### 12. Integrare cu Alte Componente

```razor
<FodRequestOptions RequestTypeCode="@selectedType" 
                   RequestService="@RequestService"
                   RequestModel="@model">
    <!-- Apostilă cu opțiuni -->
    <FodApostila />
    
    <!-- Cost calculator cu opțiuni -->
    <FodRequestCost />
    
    <!-- Selector documente bazat pe opțiuni -->
    <DocumentSelector />
</FodRequestOptions>
```

### 13. Concluzie

`FodRequestOptions` este o componentă esențială pentru aplicațiile care gestionează cereri de servicii guvernamentale. Prin încărcarea și furnizarea automată a opțiunilor specifice tipului de cerere, componenta simplifică dezvoltarea formularelor dinamice și asigură consistența în procesarea cererilor.