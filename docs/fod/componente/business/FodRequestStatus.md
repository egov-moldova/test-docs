# Request Status

## Documentație pentru componentele FodRequestStatus și FodRequestStatusResponse

### 1. Descriere Generală
`FodRequestStatus` și `FodRequestStatusResponse` sunt componente business specializate pentru sistemul FOD (Furnizor de date și servicii publice) din Moldova. Acestea permit utilizatorilor să verifice statusul cererilor depuse la instituțiile publice.

Componente:
- **FodRequestStatus** - Formularul principal de căutare a statusului
- **FodRequestStatusResponse** - Afișarea rezultatelor căutării cu detalii complete

Caracteristici principale:
- Căutare după cuvânt cheie (număr cerere, cod serviciu)
- Afișare rezultate paginată
- Panouri expandabile pentru fiecare cerere
- Informații despre livrare și ridicare
- Status apostilare pentru documente
- Suport pentru localizare (română/rusă)
- Validare formular integrată

### 2. Arhitectură și dependințe

```csharp
// Servicii necesare
services.AddScoped<IRequestStatusService, RequestStatusService>();

// Modele utilizate
public class RequestStatusRequestModel
{
    [Required]
    public string Keyword { get; set; }
}

public class RequestStatusResponseModel
{
    public string OrderNumber { get; set; }
    public string ServiceProviderNumber { get; set; }
    public string Status { get; set; }
    public List<string> Services { get; set; }
    public string ReceptionMode { get; set; }
    public bool RequiresResponseOnPaper { get; set; }
    public bool RequiresDelivery { get; set; }
    public PickupLocationModel PickupLocation { get; set; }
    public DeliveryModel Delivery { get; set; }
    public DateTime SubmissionDate { get; set; }
    public DateTime? EstimatedResolveDate { get; set; }
    public bool RequiresApostilation { get; set; }
    public List<ApostilaDetailsModel> ApostilaDetails { get; set; }
    public string FodResponsibleDivision { get; set; }
}
```

### 3. Ghid de Utilizare API

#### Implementare simplă
```razor
@page "/verifica-status"

<FodRequestStatus />
```

#### Implementare cu handler personalizat
```razor
<FodRequestStatus OnSearchCompleted="HandleSearchResults" />

@code {
    private void HandleSearchResults(List<RequestStatusResponseModel> results)
    {
        Console.WriteLine($"S-au găsit {results.Count} cereri");
        // Procesare rezultate
    }
}
```

#### Implementare cu pre-populare
```razor
<FodRequestStatus InitialKeyword="@orderNumber" AutoSearch="true" />

@code {
    [Parameter]
    [SupplyParameterFromQuery]
    public string orderNumber { get; set; }
}
```

### 4. Atribute disponibile

#### FodRequestStatus

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `InitialKeyword` | `string` | Cuvânt cheie pre-populat | `null` |
| `AutoSearch` | `bool` | Pornește căutarea automat | `false` |
| `OnSearchStarted` | `EventCallback` | Eveniment început căutare | - |
| `OnSearchCompleted` | `EventCallback<List<RequestStatusResponseModel>>` | Eveniment finalizare căutare | - |
| `ShowAlert` | `bool` | Afișează alerta informativă | `true` |
| `CustomAlertText` | `string` | Text personalizat pentru alertă | - |

#### FodRequestStatusResponse

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Model` | `List<RequestStatusResponseModel>` | Lista rezultatelor | - |
| `Keyword` | `string` | Cuvântul cheie căutat | - |
| `PageSize` | `int` | Număr rezultate per pagină | `10` |
| `ShowPagination` | `bool` | Afișează paginarea | `true` |

### 5. Exemple de utilizare

#### Pagină completă de verificare status
```razor
@page "/verifica-cerere"
@using FOD.Components.Resources
@inject IStringLocalizer<General> L

<FodContainer MaxWidth="MaxWidth.Medium">
    <FodText Typo="Typo.h3" GutterBottom="true">
        @L["Check_Request_Status"]
    </FodText>
    
    <FodPaper Class="pa-4 mt-4">
        <FodRequestStatus 
            ShowAlert="true"
            OnSearchCompleted="@OnSearchCompleted" />
    </FodPaper>
    
    @if (hasResults)
    {
        <FodAlert Severity="Severity.Success" Class="mt-3">
            <FodAlertTitle>Rezultate găsite</FodAlertTitle>
            S-au găsit @resultCount cereri pentru căutarea dvs.
        </FodAlert>
    }
</FodContainer>

@code {
    private bool hasResults = false;
    private int resultCount = 0;
    
    private void OnSearchCompleted(List<RequestStatusResponseModel> results)
    {
        hasResults = results.Any();
        resultCount = results.Count;
    }
}
```

#### Integrare în dashboard
```razor
<FodGrid Container="true" Spacing="3">
    <FodGrid Item="true" xs="12" md="8">
        <FodCard>
            <FodCardHeader>
                <FodText Typo="Typo.h5">
                    Verificare rapidă status cerere
                </FodText>
            </FodCardHeader>
            <FodCardContent>
                <FodRequestStatus 
                    ShowAlert="false"
                    InitialKeyword="@lastSearchedKeyword" />
            </FodCardContent>
        </FodCard>
    </FodGrid>
    
    <FodGrid Item="true" xs="12" md="4">
        <FodCard>
            <FodCardContent>
                <FodText Typo="Typo.h6" GutterBottom="true">
                    Căutări recente
                </FodText>
                <FodList>
                    @foreach (var search in recentSearches)
                    {
                        <FodListItem Button="true" OnClick="@(() => SearchAgain(search))">
                            <FodListItemText Primary="@search.Keyword" 
                                           Secondary="@search.Date.ToString("dd.MM.yyyy HH:mm")" />
                        </FodListItem>
                    }
                </FodList>
            </FodCardContent>
        </FodCard>
    </FodGrid>
</FodGrid>
```

#### Customizare afișare rezultate
```razor
<!-- Custom response display -->
@if (searchResults != null)
{
    <div class="custom-results mt-4">
        @foreach (var result in searchResults)
        {
            <FodCard Class="mb-3">
                <FodCardHeader>
                    <div class="d-flex justify-content-between align-items-center">
                        <FodText Typo="Typo.h6">
                            Cerere: @result.OrderNumber
                        </FodText>
                        <FodChip Color="@GetStatusColor(result.Status)" Size="Size.Small">
                            @result.Status
                        </FodChip>
                    </div>
                </FodCardHeader>
                <FodCardContent>
                    <FodGrid Container="true" Spacing="2">
                        <FodGrid Item="true" xs="12" sm="6">
                            <FodText Typo="Typo.body2" Color="Color.Secondary">
                                Data depunerii
                            </FodText>
                            <FodText Typo="Typo.body1">
                                @result.SubmissionDate.ToString("dd MMMM yyyy")
                            </FodText>
                        </FodGrid>
                        <FodGrid Item="true" xs="12" sm="6">
                            <FodText Typo="Typo.body2" Color="Color.Secondary">
                                Termen estimat
                            </FodText>
                            <FodText Typo="Typo.body1">
                                @result.EstimatedResolveDate?.ToString("dd MMMM yyyy")
                            </FodText>
                        </FodGrid>
                    </FodGrid>
                    
                    @if (result.RequiresDelivery && result.Delivery != null)
                    {
                        <FodAlert Severity="Severity.Info" Class="mt-3">
                            <FodAlertTitle>Informații livrare</FodAlertTitle>
                            Curier: @result.Delivery.CarrierName<br/>
                            Tracking: @result.Delivery.TrackingId
                        </FodAlert>
                    }
                </FodCardContent>
                <FodCardActions>
                    <FodButton Color="Color.Primary" OnClick="@(() => ShowDetails(result))">
                        Vezi detalii complete
                    </FodButton>
                </FodCardActions>
            </FodCard>
        }
    </div>
}

@code {
    private Color GetStatusColor(string status)
    {
        return status switch
        {
            "Finalizat" => Color.Success,
            "În procesare" => Color.Info,
            "În așteptare" => Color.Warning,
            "Respins" => Color.Error,
            _ => Color.Default
        };
    }
}
```

### 6. Stilizare și personalizare

```css
/* Stiluri pentru componenta de status */
.service-request-status-response {
    margin-top: 2rem;
}

/* Panouri expandabile personalizate */
.fod-expansion-panel {
    border-left: 4px solid var(--fod-palette-primary-main);
    margin-bottom: 1rem;
}

/* Status badges */
.status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
}

.status-badge.completed {
    background-color: #4caf50;
    color: white;
}

.status-badge.processing {
    background-color: #2196f3;
    color: white;
}

.status-badge.waiting {
    background-color: #ff9800;
    color: white;
}

/* Rezultate cu hover effect */
.result-item:hover {
    background-color: rgba(0, 0, 0, 0.04);
    cursor: pointer;
}

/* Timeline pentru status */
.status-timeline {
    position: relative;
    padding-left: 30px;
}

.status-timeline::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e0e0e0;
}

.status-timeline-item {
    position: relative;
    padding-bottom: 1.5rem;
}

.status-timeline-item::before {
    content: '';
    position: absolute;
    left: -24px;
    top: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #2196f3;
    border: 2px solid white;
}
```

### 7. Localizare

Componentele folosesc sistemul de localizare FOD. Cheile principale:

```json
{
  "Request_Status": "Verificare status cerere",
  "RequestStatus_General_Text": "Introduceți numărul cererii sau codul serviciului pentru a verifica statusul",
  "Search": "Caută",
  "RequestStatus_Error_Text": "Nu s-au găsit rezultate pentru căutarea dvs.",
  "OrderNumber": "Număr cerere",
  "ServiceProviderNumber": "Cod furnizor serviciu",
  "Status": "Status",
  "ServiceName": "Nume serviciu",
  "ReceptionMode": "Mod recepționare",
  "Pickup_Location_Name": "Locație ridicare",
  "Pickup_Location_Address": "Adresă",
  "MCabinetRelease": "Disponibil în MCabinet",
  "EstimatedResolveDate_Label": "Termen estimat rezolvare",
  "SubmissionDate": "Data depunerii"
}
```

### 8. Integrare cu alte componente

#### Cu notificări
```razor
@inject ISnackbar Snackbar

<FodRequestStatus OnSearchCompleted="HandleSearchCompleted" />

@code {
    private void HandleSearchCompleted(List<RequestStatusResponseModel> results)
    {
        if (!results.Any())
        {
            Snackbar.Add("Nu s-au găsit rezultate", Severity.Warning);
        }
        else
        {
            Snackbar.Add($"S-au găsit {results.Count} cereri", Severity.Success);
        }
    }
}
```

#### Cu export date
```razor
<FodToolbar>
    <FodText Typo="Typo.h6">Rezultate căutare</FodText>
    <FodSpacer />
    <FodButton StartIcon="@Icons.Material.Filled.FileDownload"
               OnClick="ExportResults">
        Export CSV
    </FodButton>
</FodToolbar>

<FodRequestStatusResponse Model="@searchResults" />

@code {
    private async Task ExportResults()
    {
        var csv = GenerateCsv(searchResults);
        await JS.InvokeVoidAsync("downloadFile", "rezultate.csv", csv);
    }
}
```

### 9. Validare și erori

```razor
<!-- Validare custom -->
<FodRequestStatus>
    <ValidationTemplate>
        <DataAnnotationsValidator />
        <CustomValidator @ref="customValidator" />
    </ValidationTemplate>
</FodRequestStatus>

@code {
    private CustomValidator customValidator;
    
    private class CustomValidator : ComponentBase
    {
        [CascadingParameter]
        private EditContext EditContext { get; set; }
        
        protected override void OnInitialized()
        {
            EditContext.OnValidationRequested += (s, e) =>
            {
                var model = EditContext.Model as RequestStatusRequestModel;
                if (model != null && model.Keyword?.Length < 3)
                {
                    var messages = new ValidationMessageStore(EditContext);
                    messages.Add(() => model.Keyword, 
                        "Cuvântul cheie trebuie să aibă cel puțin 3 caractere");
                    EditContext.NotifyValidationStateChanged();
                }
            };
        }
    }
}
```

### 10. Performanță și optimizare

1. **Paginare** - Rezultatele sunt paginate automat pentru performanță
2. **Lazy loading** - Detaliile sunt încărcate doar când panoul este expandat
3. **Caching** - Rezultatele pot fi cache-uite local

```csharp
// Service cu caching
public class CachedRequestStatusService : IRequestStatusService
{
    private readonly IMemoryCache _cache;
    private readonly IRequestStatusService _innerService;
    
    public async Task<IEnumerable<RequestStatusResponseModel>> Search(
        RequestStatusRequestModel request)
    {
        var cacheKey = $"request_status_{request.Keyword}";
        
        if (!_cache.TryGetValue(cacheKey, out List<RequestStatusResponseModel> cached))
        {
            cached = (await _innerService.Search(request)).ToList();
            _cache.Set(cacheKey, cached, TimeSpan.FromMinutes(5));
        }
        
        return cached;
    }
}
```

### 11. Accesibilitate

- Suport pentru screen readers prin atribute ARIA
- Navigare cu tastatura pentru toate elementele interactive
- Indicatori vizuali clari pentru starea cererii
- Contrast adecvat pentru toate textele

### 12. Bune practici

1. **Validare input** - Validați întotdeauna inputul înainte de căutare
2. **Feedback vizual** - Afișați loading state în timpul căutării
3. **Mesaje clare** - Folosiți mesaje localizate și descriptive
4. **Error handling** - Gestionați erorile de rețea elegant

```razor
@try
{
    <FodRequestStatus OnSearchError="HandleSearchError" />
}
catch (Exception ex)
{
    <FodAlert Severity="Severity.Error">
        A apărut o eroare. Vă rugăm încercați din nou.
    </FodAlert>
}

@code {
    private void HandleSearchError(Exception ex)
    {
        Logger.LogError(ex, "Eroare la căutarea statusului");
        // Afișare mesaj utilizator
    }
}
```

### 13. Troubleshooting

#### Căutarea nu returnează rezultate
- Verificați formatul cuvântului cheie
- Verificați conexiunea la serviciul backend
- Verificați că serviciul IRequestStatusService este înregistrat

#### Paginarea nu funcționează
- Verificați că Model conține toate rezultatele
- Verificați că PageSize este configurat corect

#### Localizarea nu funcționează
- Verificați că resursele de localizare sunt configurate
- Verificați cultura curentă a aplicației

### 14. Exemple avansate

#### Monitorizare automată status
```razor
@implements IDisposable

<FodRequestStatus @ref="statusComponent" />

@if (isMonitoring)
{
    <FodAlert Severity="Severity.Info">
        <FodAlertTitle>Monitorizare activă</FodAlertTitle>
        Statusul este verificat automat la fiecare @refreshInterval secunde
    </FodAlert>
}

@code {
    private FodRequestStatus statusComponent;
    private Timer refreshTimer;
    private bool isMonitoring = false;
    private int refreshInterval = 60;
    
    private void StartMonitoring(string keyword)
    {
        isMonitoring = true;
        refreshTimer = new Timer(async _ =>
        {
            await InvokeAsync(async () =>
            {
                await statusComponent.SearchAsync(keyword);
                StateHasChanged();
            });
        }, null, TimeSpan.Zero, TimeSpan.FromSeconds(refreshInterval));
    }
    
    public void Dispose()
    {
        refreshTimer?.Dispose();
    }
}
```

#### Integrare cu notificări push
```razor
@inject INotificationService NotificationService

<FodRequestStatus OnSearchCompleted="CheckForStatusChanges" />

@code {
    private Dictionary<string, string> previousStatuses = new();
    
    private async Task CheckForStatusChanges(
        List<RequestStatusResponseModel> results)
    {
        foreach (var result in results)
        {
            if (previousStatuses.TryGetValue(result.OrderNumber, out var prevStatus))
            {
                if (prevStatus != result.Status)
                {
                    await NotificationService.SendNotification(
                        $"Statusul cererii {result.OrderNumber} s-a schimbat: {result.Status}",
                        NotificationType.StatusChange
                    );
                }
            }
            previousStatuses[result.OrderNumber] = result.Status;
        }
    }
}
```

### 15. Concluzie
`FodRequestStatus` și `FodRequestStatusResponse` oferă o soluție completă pentru verificarea statusului cererilor în sistemul FOD. Cu suport pentru căutare, paginare, afișare detaliată și localizare, aceste componente sunt esențiale pentru transparența proceselor administrative și oferirea de feedback în timp real cetățenilor despre cererile lor.