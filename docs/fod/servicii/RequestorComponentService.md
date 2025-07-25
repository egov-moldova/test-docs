# RequestorComponentService

## Documentație pentru serviciul RequestorComponentService

### 1. Descriere Generală

`RequestorComponentService` este un serviciu esențial pentru gestionarea datelor solicitanților în sistemul FOD. Permite obținerea datelor persoanelor fizice și juridice din registrele oficiale ale Republicii Moldova prin MConnect, cu suport pentru scenarii de reprezentare și măsuri stricte de confidențialitate.

Caracteristici principale:
- Obținere date persoane fizice după IDNP
- Obținere date organizații după IDNO
- Validare identitate solicitant
- Suport pentru reprezentare (în numele altcuiva)
- Integrare cu MPower pentru autorizare
- Opțiuni configurabile de confidențialitate
- Audit complet pentru conformitate

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs

// Pentru client (Blazor WebAssembly)
builder.Services.AddFodComponents(configuration);

// Pentru server cu integrare MConnect
builder.Services.AddFodComponentsServer(configuration, connectionString);
builder.Services.AddMConnectIntegration(configuration);

// Configurare opțiuni
builder.Services.Configure<RequestorComponentOptions>(options =>
{
    options.AllowGetRequestorData = true;
    options.AllowGetOrganizationData = true;
    options.AllowFullName = true;
    options.BlurName = false;
    options.MConnectReason = "Verificare date solicitant pentru serviciul {ServiceName}";
});
```

### 3. Interfața IRequestorComponentService

```csharp
namespace Fod.Components.Shared.Business.Requestor.Services
{
    public interface IRequestorComponentService
    {
        Task<RequestorData> GetRequestorData(RequestorDataRequest request);
        Task<OrganizationData> GetOrganizationData(OrganizationDataRequest request);
    }
}
```

### 4. Metode Disponibile

| Metodă | Parametri | Return | Descriere |
|--------|-----------|--------|-----------|
| `GetRequestorData` | `RequestorDataRequest request` | `Task<RequestorData>` | Obține date persoană fizică după IDNP |
| `GetOrganizationData` | `OrganizationDataRequest request` | `Task<OrganizationData>` | Obține date organizație după IDNO |

### 5. Modele de Date

#### RequestorDataRequest / RequestorData
```csharp
public class RequestorDataRequest
{
    [Required]
    [StringLength(13, MinimumLength = 13)]
    public string Idnp { get; set; }
}

public class RequestorData
{
    public string Idnp { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
```

#### OrganizationDataRequest / OrganizationData
```csharp
public class OrganizationDataRequest
{
    [Required]
    [StringLength(13, MinimumLength = 13)]
    public string Idno { get; set; }
}

public class OrganizationData
{
    public string Idno { get; set; }
    public string Name { get; set; }
}
```

#### RequestorComponentOptions
```csharp
public class RequestorComponentOptions
{
    // Permite obținerea datelor persoanelor
    public bool AllowGetRequestorData { get; set; } = true;
    
    // Permite obținerea datelor organizațiilor
    public bool AllowGetOrganizationData { get; set; } = true;
    
    // Afișează numele complet
    public bool AllowFullName { get; set; } = true;
    
    // Aplică blur pe nume (prima literă + asteriscuri)
    public bool BlurName { get; set; } = false;
    
    // Motivul accesării MConnect pentru audit
    public string MConnectReason { get; set; } = 
        "Extragerea datelor pentru prestarea serviciului {ServiceName}";
}
```

### 6. Exemple de Utilizare

#### Formular solicitant persoană fizică
```razor
@page "/servicii/cerere-noua"
@inject IRequestorComponentService RequestorService
@inject IFodNotificationService NotificationService

<FodContainer>
    <FodCard>
        <FodCardContent>
            <FodText Typo="Typo.h6" GutterBottom="true">
                Date Solicitant
            </FodText>
            
            <!-- Selector tip solicitant -->
            <FodRadioGroup @bind-Value="requestorType" Class="mb-4">
                <FodRadio Value="@RequestorType.Individual" Label="Persoană fizică" />
                <FodRadio Value="@RequestorType.Organization" Label="Persoană juridică" />
            </FodRadioGroup>
            
            @if (requestorType == RequestorType.Individual)
            {
                <!-- Persoană fizică -->
                <FodGrid Container="true" Spacing="3">
                    <FodGrid Item="true" xs="12" md="4">
                        <FodInput @bind-Value="idnp" 
                                  Label="IDNP"
                                  Mask="______________"
                                  MaxLength="13"
                                  Required="true"
                                  EndAdornment="@GetValidationIcon()"
                                  @onblur="OnIdnpChanged" />
                    </FodGrid>
                    <FodGrid Item="true" xs="12" md="4">
                        <FodInput @bind-Value="firstName" 
                                  Label="Prenume"
                                  Required="true"
                                  ReadOnly="@dataLoaded"
                                  HelperText="@(dataLoaded ? "Preluat din MConnect" : "")" />
                    </FodGrid>
                    <FodGrid Item="true" xs="12" md="4">
                        <FodInput @bind-Value="lastName" 
                                  Label="Nume"
                                  Required="true"
                                  ReadOnly="@dataLoaded" />
                    </FodGrid>
                </FodGrid>
            }
            else
            {
                <!-- Persoană juridică -->
                <FodGrid Container="true" Spacing="3">
                    <FodGrid Item="true" xs="12" md="6">
                        <FodInput @bind-Value="idno" 
                                  Label="IDNO"
                                  Mask="______________"
                                  MaxLength="13"
                                  Required="true"
                                  @onblur="OnIdnoChanged" />
                    </FodGrid>
                    <FodGrid Item="true" xs="12" md="6">
                        <FodInput @bind-Value="organizationName" 
                                  Label="Denumire organizație"
                                  Required="true"
                                  ReadOnly="@dataLoaded" />
                    </FodGrid>
                </FodGrid>
            }
            
            @if (isLoading)
            {
                <FodLoadingLinear Indeterminate="true" Class="mt-2" />
            }
        </FodCardContent>
    </FodCard>
</FodContainer>

@code {
    private RequestorType requestorType = RequestorType.Individual;
    private string idnp, firstName, lastName;
    private string idno, organizationName;
    private bool isLoading, dataLoaded;
    
    private async Task OnIdnpChanged()
    {
        if (!IsValidIdnp(idnp))
            return;
        
        isLoading = true;
        dataLoaded = false;
        
        try
        {
            var data = await RequestorService.GetRequestorData(new RequestorDataRequest
            {
                Idnp = idnp
            });
            
            if (data != null)
            {
                firstName = data.FirstName;
                lastName = data.LastName;
                dataLoaded = true;
                NotificationService.Success("Date preluate cu succes");
            }
            else
            {
                NotificationService.Warning("Persoană negăsită în registre");
            }
        }
        catch (Exception ex)
        {
            NotificationService.Error($"Eroare: {ex.Message}");
        }
        finally
        {
            isLoading = false;
        }
    }
    
    private async Task OnIdnoChanged()
    {
        if (!IsValidIdno(idno))
            return;
        
        isLoading = true;
        dataLoaded = false;
        
        try
        {
            var data = await RequestorService.GetOrganizationData(new OrganizationDataRequest
            {
                Idno = idno
            });
            
            if (data != null)
            {
                organizationName = data.Name;
                dataLoaded = true;
                NotificationService.Success("Date organizație preluate cu succes");
            }
        }
        finally
        {
            isLoading = false;
        }
    }
    
    private RenderFragment GetValidationIcon()
    {
        return @<text>
            @if (dataLoaded)
            {
                <FodIcon Color="FodColor.Success">
                    @FodIcons.Material.Filled.Verified
                </FodIcon>
            }
        </text>;
    }
}
```

#### Componenta FodRequestor integrată
```razor
@page "/servicii/{ServiceCode}/depunere"

<FodContainer>
    <FodWizard>
        <FodWizardStep Title="Date Solicitant">
            <!-- Componenta completă pentru solicitant -->
            <FodRequestor @bind-Model="requestorModel"
                          ServiceProviderInternalCode="@ServiceCode"
                          ShowOnBehalfOf="true"
                          ValidateNameByIdnp="true"
                          AutoPopulateNameByIdnp="true"
                          ShowMiddleName="true"
                          ShowStatute="true"
                          OnRequestorChanged="OnRequestorChanged" />
        </FodWizardStep>
        
        <FodWizardStep Title="Detalii Serviciu">
            <!-- Alte date necesare -->
        </FodWizardStep>
    </FodWizard>
</FodContainer>

@code {
    [Parameter] public string ServiceCode { get; set; }
    
    private FodRequestorModel requestorModel = new();
    
    private void OnRequestorChanged(FodRequestorModel model)
    {
        // Logică adițională când se schimbă solicitantul
        if (model.OnBehalfOf)
        {
            Console.WriteLine($"Cerere în numele: {model.FirstName} {model.LastName}");
        }
    }
}
```

#### Scenarii de reprezentare (On Behalf Of)
```razor
@inject IRequestorComponentService RequestorService
@inject IMPowerService MPowerService

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Depunere Cerere
        </FodText>
        
        <!-- Selector mod depunere -->
        <FodRadioGroup @bind-Value="submissionMode" Class="mb-4">
            <FodRadio Value="@SubmissionMode.ForSelf" 
                      Label="În nume propriu" />
            <FodRadio Value="@SubmissionMode.ForAnother" 
                      Label="În numele altei persoane" />
            <FodRadio Value="@SubmissionMode.ForOrganization" 
                      Label="În numele unei organizații" />
        </FodRadioGroup>
        
        @if (submissionMode == SubmissionMode.ForAnother)
        {
            <!-- Date persoană reprezentată -->
            <FodPaper Elevation="1" Class="p-3 mb-4">
                <FodText Typo="Typo.subtitle1" GutterBottom="true">
                    Persoana în numele căreia depuneți cererea
                </FodText>
                
                <FodGrid Container="true" Spacing="3">
                    <FodGrid Item="true" xs="12" md="4">
                        <FodInput @bind-Value="representedIdnp" 
                                  Label="IDNP persoană reprezentată"
                                  Required="true"
                                  @onblur="ValidateRepresentation" />
                    </FodGrid>
                    <FodGrid Item="true" xs="12" md="8">
                        @if (representedPerson != null)
                        {
                            <FodAlert Severity="FodSeverity.Info">
                                Reprezentați pe: <strong>@representedPerson.FirstName @representedPerson.LastName</strong>
                            </FodAlert>
                        }
                    </FodGrid>
                </FodGrid>
                
                @if (authorizationRequired)
                {
                    <FodAlert Severity="FodSeverity.Warning" Class="mt-3">
                        <FodAlertTitle>Autorizare necesară</FodAlertTitle>
                        Este necesară verificarea împuternicirii prin MPower.
                        <FodButton Color="FodColor.Primary" 
                                   Size="FodSize.Small"
                                   OnClick="CheckMPowerAuthorization"
                                   Class="mt-2">
                            Verifică Împuternicire
                        </FodButton>
                    </FodAlert>
                }
            </FodPaper>
        }
        
        <!-- Date solicitant actual -->
        <FodText Typo="Typo.subtitle1" GutterBottom="true">
            Datele dumneavoastră (solicitant)
        </FodText>
        
        <RequestorForm Model="@currentRequestor" 
                       ReadOnly="@isAuthenticated" />
    </FodCardContent>
</FodCard>

@code {
    private SubmissionMode submissionMode = SubmissionMode.ForSelf;
    private string representedIdnp;
    private RequestorData representedPerson;
    private bool authorizationRequired;
    private bool isAuthenticated;
    private RequestorModel currentRequestor = new();
    
    private async Task ValidateRepresentation()
    {
        if (string.IsNullOrWhiteSpace(representedIdnp) || representedIdnp.Length != 13)
            return;
        
        // Obține date persoană reprezentată
        representedPerson = await RequestorService.GetRequestorData(new RequestorDataRequest
        {
            Idnp = representedIdnp
        });
        
        if (representedPerson != null)
        {
            // Verifică dacă necesită autorizare MPower
            authorizationRequired = await CheckIfAuthorizationRequired(
                currentRequestor.Idnp, 
                representedIdnp);
        }
    }
    
    private async Task CheckMPowerAuthorization()
    {
        var authorization = await MPowerService.CheckAuthorization(new MPowerRequest
        {
            RepresentativeIdnp = currentRequestor.Idnp,
            RepresentedIdnp = representedIdnp,
            ServiceCode = ServiceCode,
            RequiredPermissions = new[] { "SUBMIT_REQUEST" }
        });
        
        if (authorization.IsAuthorized)
        {
            NotificationService.Success("Împuternicire validă!");
            authorizationRequired = false;
        }
        else
        {
            NotificationService.Error($"Nu aveți împuternicire: {authorization.Reason}");
        }
    }
}
```

#### Validare complexă identitate
```csharp
public class RequestorValidationService
{
    private readonly IRequestorComponentService _requestorService;
    private readonly ILogger<RequestorValidationService> _logger;
    
    public async Task<ValidationResult> ValidateRequestorIdentity(
        string idnp, 
        string providedFirstName, 
        string providedLastName)
    {
        try
        {
            // Obține date oficiale
            var officialData = await _requestorService.GetRequestorData(
                new RequestorDataRequest { Idnp = idnp });
            
            if (officialData == null)
            {
                return new ValidationResult
                {
                    IsValid = false,
                    Errors = new[] { "IDNP-ul nu există în registrele oficiale" }
                };
            }
            
            // Normalizare pentru comparație
            var normalizedOfficial = new
            {
                FirstName = NormalizeName(officialData.FirstName),
                LastName = NormalizeName(officialData.LastName)
            };
            
            var normalizedProvided = new
            {
                FirstName = NormalizeName(providedFirstName),
                LastName = NormalizeName(providedLastName)
            };
            
            // Verificare potrivire exactă
            if (normalizedOfficial.FirstName == normalizedProvided.FirstName &&
                normalizedOfficial.LastName == normalizedProvided.LastName)
            {
                return new ValidationResult { IsValid = true };
            }
            
            // Verificare variații comune (diminutive, prescurtări)
            if (AreNamesEquivalent(normalizedOfficial.FirstName, normalizedProvided.FirstName) &&
                normalizedOfficial.LastName == normalizedProvided.LastName)
            {
                return new ValidationResult
                {
                    IsValid = true,
                    Warnings = new[] { "Numele folosește o variantă acceptată" }
                };
            }
            
            // Calculare scor similitudine
            var similarity = CalculateNameSimilarity(
                normalizedOfficial, 
                normalizedProvided);
            
            if (similarity >= 0.85) // 85% similitudine
            {
                _logger.LogWarning(
                    "Potrivire parțială pentru IDNP {Idnp}: {Similarity}%", 
                    idnp.Substring(0, 4) + "***", 
                    similarity * 100);
                
                return new ValidationResult
                {
                    IsValid = true,
                    Warnings = new[] { "Numele prezintă mici diferențe față de cel oficial" },
                    Confidence = similarity
                };
            }
            
            return new ValidationResult
            {
                IsValid = false,
                Errors = new[] { "Numele furnizat nu corespunde cu cel din registre oficiale" },
                Confidence = similarity
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Eroare la validarea identității pentru IDNP {Idnp}", 
                idnp.Substring(0, 4) + "***");
            throw;
        }
    }
    
    private string NormalizeName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return string.Empty;
        
        return name.Trim()
                   .ToUpperInvariant()
                   .Replace("Ă", "A").Replace("Â", "A")
                   .Replace("Î", "I").Replace("Ș", "S")
                   .Replace("Ț", "T").Replace("Ş", "S")
                   .Replace("Ţ", "T");
    }
    
    private bool AreNamesEquivalent(string official, string provided)
    {
        // Dicționar de echivalențe comune în Moldova
        var equivalents = new Dictionary<string, List<string>>
        {
            ["ALEXANDRU"] = new() { "ALEX", "SANDU", "ALECU" },
            ["ANDREI"] = new() { "ANDRUȚA", "ANDRIUȚA" },
            ["GHEORGHE"] = new() { "GHEORGHIȚĂ", "GICĂ", "GEORGE" },
            ["ION"] = new() { "IONEL", "IONUȚ", "NELU" },
            ["MARIA"] = new() { "MARIȚA", "MARA", "MARIOARA" },
            ["ELENA"] = new() { "LENUȚA", "LEANA", "ILEANA" },
            ["VASILE"] = new() { "VASILY", "VASILICĂ" }
        };
        
        foreach (var kvp in equivalents)
        {
            if ((official == kvp.Key && kvp.Value.Contains(provided)) ||
                (provided == kvp.Key && kvp.Value.Contains(official)))
            {
                return true;
            }
        }
        
        return false;
    }
}
```

### 7. Dashboard organizații

```razor
@inject IRequestorComponentService RequestorService
@inject IOrganizationService OrganizationService

<FodContainer>
    <FodText Typo="Typo.h4" GutterBottom="true">
        Gestionare Organizații Autorizate
    </FodText>
    
    <FodCard>
        <FodCardContent>
            <!-- Adăugare organizație nouă -->
            <FodGrid Container="true" Spacing="3" AlignItems="Align.End" Class="mb-4">
                <FodGrid Item="true" xs="12" md="4">
                    <FodInput @bind-Value="newIdno" 
                              Label="IDNO Organizație"
                              Mask="______________" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="6">
                    <FodInput Value="@newOrgName" 
                              Label="Denumire"
                              ReadOnly="true"
                              HelperText="Se completează automat" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="2">
                    <FodButton OnClick="AddOrganization" 
                               Color="FodColor.Primary"
                               FullWidth="true"
                               Disabled="@(string.IsNullOrEmpty(newOrgName))">
                        Adaugă
                    </FodButton>
                </FodGrid>
            </FodGrid>
            
            <!-- Lista organizații -->
            <FodDataTable Items="@organizations" 
                          ShowPagination="true"
                          RowsPerPage="10">
                <HeaderContent>
                    <FodTHeadRow>
                        <FodTh>IDNO</FodTh>
                        <FodTh>Denumire</FodTh>
                        <FodTh>Status</FodTh>
                        <FodTh>Data Adăugării</FodTh>
                        <FodTh>Acțiuni</FodTh>
                    </FodTHeadRow>
                </HeaderContent>
                <RowTemplate>
                    <FodTr>
                        <FodTd>@context.Idno</FodTd>
                        <FodTd>
                            <FodText NoWrap="true">@context.Name</FodText>
                        </FodTd>
                        <FodTd>
                            <FodChip Color="@GetStatusColor(context.Status)" 
                                     Size="FodSize.Small">
                                @context.Status
                            </FodChip>
                        </FodTd>
                        <FodTd>@context.AddedDate.ToString("dd.MM.yyyy")</FodTd>
                        <FodTd>
                            <FodIconButton Icon="@FodIcons.Material.Filled.Refresh"
                                           Size="FodSize.Small"
                                           OnClick="() => RefreshOrganization(context)"
                                           Tooltip="Actualizează date" />
                            <FodIconButton Icon="@FodIcons.Material.Filled.Delete"
                                           Size="FodSize.Small"
                                           Color="FodColor.Error"
                                           OnClick="() => RemoveOrganization(context)"
                                           Tooltip="Elimină" />
                        </FodTd>
                    </FodTr>
                </RowTemplate>
            </FodDataTable>
        </FodCardContent>
    </FodCard>
</FodContainer>

@code {
    private string newIdno;
    private string newOrgName;
    private List<AuthorizedOrganization> organizations = new();
    
    protected override async Task OnInitializedAsync()
    {
        await LoadOrganizations();
    }
    
    private async Task OnIdnoChanged()
    {
        if (IsValidIdno(newIdno))
        {
            var orgData = await RequestorService.GetOrganizationData(
                new OrganizationDataRequest { Idno = newIdno });
            
            newOrgName = orgData?.Name;
        }
    }
    
    private async Task RefreshOrganization(AuthorizedOrganization org)
    {
        var freshData = await RequestorService.GetOrganizationData(
            new OrganizationDataRequest { Idno = org.Idno });
        
        if (freshData != null && freshData.Name != org.Name)
        {
            org.Name = freshData.Name;
            org.LastUpdated = DateTime.Now;
            await OrganizationService.UpdateOrganization(org);
            NotificationService.Info($"Actualizat: {org.Name}");
        }
    }
}
```

### 8. Serviciu cu cache și privacy

```csharp
public class EnhancedRequestorComponentService : IRequestorComponentService
{
    private readonly IRequestorComponentService _innerService;
    private readonly IMemoryCache _cache;
    private readonly IOptions<RequestorComponentOptions> _options;
    private readonly IAuditService _auditService;
    
    public async Task<RequestorData> GetRequestorData(RequestorDataRequest request)
    {
        // Verificare permisiuni
        if (!_options.Value.AllowGetRequestorData)
        {
            throw new UnauthorizedException("Obținerea datelor persoanelor este dezactivată");
        }
        
        // Cache key include opțiuni privacy pentru invalidare corectă
        var cacheKey = $"requestor_{request.Idnp}_{_options.Value.AllowFullName}_{_options.Value.BlurName}";
        
        if (_cache.TryGetValue<RequestorData>(cacheKey, out var cached))
        {
            await _auditService.LogCacheHit("RequestorData", request.Idnp);
            return cached;
        }
        
        var data = await _innerService.GetRequestorData(request);
        
        if (data != null)
        {
            // Aplicare opțiuni privacy
            data = ApplyPrivacyOptions(data);
            
            // Cache cu expirare sliding
            _cache.Set(cacheKey, data, new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(10),
                Priority = CacheItemPriority.Normal
            });
        }
        
        return data;
    }
    
    private RequestorData ApplyPrivacyOptions(RequestorData data)
    {
        if (data == null) return null;
        
        var result = new RequestorData
        {
            Idnp = data.Idnp,
            FirstName = data.FirstName,
            LastName = data.LastName
        };
        
        if (_options.Value.BlurName)
        {
            result.FirstName = BlurName(data.FirstName);
            result.LastName = BlurName(data.LastName);
        }
        else if (!_options.Value.AllowFullName)
        {
            result.FirstName = GetInitial(data.FirstName);
            result.LastName = data.LastName; // Păstrăm numele de familie
        }
        
        return result;
    }
    
    private string BlurName(string name)
    {
        if (string.IsNullOrEmpty(name) || name.Length <= 1)
            return name;
        
        return name[0] + new string('*', name.Length - 1);
    }
    
    private string GetInitial(string name)
    {
        return string.IsNullOrEmpty(name) ? "" : name[0] + ".";
    }
}
```

### 9. Monitorizare și statistici

```razor
@inject IRequestorComponentService RequestorService
@inject IStatisticsService StatisticsService

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Statistici Verificări Identitate - @selectedPeriod
        </FodText>
        
        <FodGrid Container="true" Spacing="3" Class="mb-4">
            <FodGrid Item="true" xs="12" sm="3">
                <MetricCard Title="Total Verificări" 
                            Value="@stats.TotalVerifications"
                            Icon="@FodIcons.Material.Filled.FactCheck" />
            </FodGrid>
            <FodGrid Item="true" xs="12" sm="3">
                <MetricCard Title="Persoane Fizice" 
                            Value="@stats.IndividualVerifications"
                            Icon="@FodIcons.Material.Filled.Person" />
            </FodGrid>
            <FodGrid Item="true" xs="12" sm="3">
                <MetricCard Title="Organizații" 
                            Value="@stats.OrganizationVerifications"
                            Icon="@FodIcons.Material.Filled.Business" />
            </FodGrid>
            <FodGrid Item="true" xs="12" sm="3">
                <MetricCard Title="Rata Succes" 
                            Value="@($"{stats.SuccessRate:F1}%")"
                            Icon="@FodIcons.Material.Filled.Analytics" />
            </FodGrid>
        </FodGrid>
        
        <!-- Grafic trend zilnic -->
        <VerificationTrendChart Data="@dailyTrend" />
        
        <!-- Top servicii după verificări -->
        <div class="mt-4">
            <FodText Typo="Typo.subtitle1" GutterBottom="true">
                Top Servicii după Număr Verificări
            </FodText>
            <FodSimpleTable>
                <thead>
                    <tr>
                        <th>Serviciu</th>
                        <th>Verificări</th>
                        <th>Rata Succes</th>
                        <th>Timp Mediu</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach (var service in topServices)
                    {
                        <tr>
                            <td>@service.ServiceName</td>
                            <td>@service.VerificationCount</td>
                            <td>@service.SuccessRate.ToString("F1")%</td>
                            <td>@service.AverageTime.ToString("F0")ms</td>
                        </tr>
                    }
                </tbody>
            </FodSimpleTable>
        </div>
    </FodCardContent>
</FodCard>

@code {
    private VerificationStats stats = new();
    private List<DailyTrend> dailyTrend = new();
    private List<ServiceStats> topServices = new();
    private string selectedPeriod = DateTime.Now.ToString("MMMM yyyy");
    
    protected override async Task OnInitializedAsync()
    {
        await LoadStatistics();
    }
}
```

### 10. Tratare erori și fallback

```csharp
public class ResilientRequestorComponentService : IRequestorComponentService
{
    private readonly IRequestorComponentService _primaryService;
    private readonly IRequestorComponentService _fallbackService;
    private readonly ILogger<ResilientRequestorComponentService> _logger;
    private readonly ICircuitBreaker _circuitBreaker;
    
    public async Task<RequestorData> GetRequestorData(RequestorDataRequest request)
    {
        try
        {
            // Încercare prin circuit breaker
            return await _circuitBreaker.ExecuteAsync(async () =>
            {
                return await _primaryService.GetRequestorData(request);
            });
        }
        catch (CircuitBreakerOpenException)
        {
            _logger.LogWarning("Circuit breaker open, using fallback service");
            
            // Fallback la serviciu secundar sau cache local
            try
            {
                return await _fallbackService.GetRequestorData(request);
            }
            catch (Exception fallbackEx)
            {
                _logger.LogError(fallbackEx, "Fallback service also failed");
                
                // Returnare date minimale pentru continuitate
                return GetMinimalData(request.Idnp);
            }
        }
        catch (TimeoutException)
        {
            _logger.LogWarning("MConnect timeout for IDNP {Idnp}", 
                request.Idnp.Substring(0, 4) + "***");
            
            // Permite continuare cu date manuale
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting requestor data");
            throw;
        }
    }
    
    private RequestorData GetMinimalData(string idnp)
    {
        // Extrage informații de bază din IDNP
        var info = IdnpParser.Parse(idnp);
        
        return new RequestorData
        {
            Idnp = idnp,
            FirstName = "[Necesită completare manuală]",
            LastName = "[Necesită completare manuală]"
        };
    }
}
```

### 11. Testare

```csharp
[TestClass]
public class RequestorComponentServiceTests
{
    private Mock<HttpMessageHandler> _httpHandler;
    private IRequestorComponentService _service;
    
    [TestMethod]
    public async Task GetRequestorData_ValidIdnp_ReturnsData()
    {
        // Arrange
        var request = new RequestorDataRequest { Idnp = "2001234567890" };
        var expectedData = new RequestorData
        {
            Idnp = "2001234567890",
            FirstName = "Ion",
            LastName = "Popescu"
        };
        
        SetupHttpResponse(expectedData);
        
        // Act
        var result = await _service.GetRequestorData(request);
        
        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual("Ion", result.FirstName);
        Assert.AreEqual("Popescu", result.LastName);
    }
    
    [TestMethod]
    public async Task GetOrganizationData_ValidIdno_ReturnsData()
    {
        // Arrange
        var request = new OrganizationDataRequest { Idno = "1003600123456" };
        var expectedData = new OrganizationData
        {
            Idno = "1003600123456",
            Name = "Compania Example SRL"
        };
        
        SetupHttpResponse(expectedData);
        
        // Act
        var result = await _service.GetOrganizationData(request);
        
        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual("Compania Example SRL", result.Name);
    }
    
    [TestMethod]
    public async Task GetRequestorData_BlurEnabled_ReturnsBlurredData()
    {
        // Arrange
        var options = new RequestorComponentOptions { BlurName = true };
        var service = new EnhancedRequestorComponentService(_innerService, _cache, 
            Options.Create(options), _auditService);
        
        // Act
        var result = await service.GetRequestorData(new RequestorDataRequest 
        { 
            Idnp = "2001234567890" 
        });
        
        // Assert
        Assert.AreEqual("I**", result.FirstName);
        Assert.AreEqual("P******", result.LastName);
    }
}
```

### 12. Best Practices

1. **Validare strictă** - Validați IDNP/IDNO înainte de cereri
2. **Cache responsabil** - Cache cu considerente de privacy
3. **Audit complet** - Înregistrați toate accesările pentru GDPR
4. **Fallback graceful** - Permiteți completare manuală la erori
5. **Rate limiting** - Preveniți abuzuri și suprasolicitare
6. **Privacy by design** - Aplicați opțiuni de confidențialitate
7. **Monitorizare** - Urmăriți performanța și erorile

### 13. Concluzie

`RequestorComponentService` este un serviciu esențial în ecosistemul FOD, oferind acces securizat la datele oficiale ale persoanelor și organizațiilor din Moldova. Cu suport pentru scenarii complexe de reprezentare, măsuri stricte de confidențialitate și integrare robustă cu sistemele guvernamentale, serviciul facilitează procesarea eficientă și sigură a cererilor pentru servicii publice digitale.