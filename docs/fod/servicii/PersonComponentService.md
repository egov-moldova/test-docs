# PersonComponentService

## Documentație pentru serviciul PersonComponentService

### 1. Descriere Generală

`PersonComponentService` este un serviciu pentru obținerea datelor personale din Registrul de Stat al Populației (RSP) al Republicii Moldova pe baza IDNP-ului. Serviciul oferă funcționalități de validare și auto-populare a datelor personale cu măsuri stricte de confidențialitate.

Caracteristici principale:
- Obținere date personale (nume, prenume) după IDNP
- Integrare cu RSP prin MConnect
- Opțiuni configurabile de confidențialitate
- Validare identitate (verificare corespondență nume-IDNP)
- Suport pentru blur/mascare date sensibile
- Audit și logging pentru conformitate GDPR

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs

// Pentru client (Blazor WebAssembly)
builder.Services.AddFodComponents(configuration);

// Pentru server cu integrare RSP
builder.Services.AddFodComponentsServer(configuration, connectionString);
builder.Services.AddMConnectIntegration(configuration);

// Configurare opțiuni confidențialitate
builder.Services.Configure<PersonComponentOptions>(options =>
{
    options.AllowGetData = true;
    options.AllowFullName = true;
    options.BlurName = false;
    options.MConnectReason = "Verificare identitate pentru serviciul {ServiceName}";
});

// Înregistrare manuală
builder.Services.AddScoped<IPersonComponentService, PersonComponentService>();
```

### 3. Interfața IPersonComponentService

```csharp
namespace Fod.Components.Shared.Business.Person
{
    public interface IPersonComponentService
    {
        Task<PersonData> GetPersonData(PersonDataRequest request);
    }
}
```

### 4. Metode Disponibile

| Metodă | Parametri | Return | Descriere |
|--------|-----------|--------|-----------|
| `GetPersonData` | `PersonDataRequest request` | `Task<PersonData>` | Obține datele personale după IDNP |

### 5. Modele de Date

#### PersonDataRequest
```csharp
public class PersonDataRequest
{
    [Required]
    [StringLength(13, MinimumLength = 13)]
    public string Idnp { get; set; }
}
```

#### PersonData
```csharp
public class PersonData
{
    public string Idnp { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
```

#### PersonComponentOptions
```csharp
public class PersonComponentOptions
{
    // Permite obținerea datelor din RSP
    public bool AllowGetData { get; set; } = true;
    
    // Afișează numele complet (false = doar inițiale)
    public bool AllowFullName { get; set; } = true;
    
    // Aplică blur pe nume (prima literă + asteriscuri)
    public bool BlurName { get; set; } = false;
    
    // Motivul accesării RSP pentru audit
    public string MConnectReason { get; set; } = 
        "Extragerea datelor după idnp, pentru prestarea serviciului {ServiceName}";
}
```

### 6. Exemple de Utilizare

#### Validare și auto-populare simplă
```razor
@page "/formular/date-personale"
@inject IPersonComponentService PersonService
@inject IFodNotificationService NotificationService

<FodContainer>
    <FodCard>
        <FodCardContent>
            <FodText Typo="Typo.h6" GutterBottom="true">
                Date Personale
            </FodText>
            
            <FodGrid Container="true" Spacing="3">
                <FodGrid Item="true" xs="12" md="4">
                    <FodInput @bind-Value="model.Idnp" 
                              Label="IDNP"
                              Mask="______________"
                              MaxLength="13"
                              Required="true"
                              @onblur="OnIdnpChanged" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="4">
                    <FodInput @bind-Value="model.FirstName" 
                              Label="Prenume"
                              Required="true"
                              Disabled="@isLoadingPerson" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="4">
                    <FodInput @bind-Value="model.LastName" 
                              Label="Nume"
                              Required="true"
                              Disabled="@isLoadingPerson" />
                </FodGrid>
            </FodGrid>
            
            @if (isLoadingPerson)
            {
                <FodLoadingLinear Indeterminate="true" Class="mt-2" />
                <FodText Typo="Typo.caption" Align="FodAlign.Center">
                    Se verifică datele în RSP...
                </FodText>
            }
            
            @if (validationResult != null)
            {
                <FodAlert Severity="@(validationResult.IsValid ? FodSeverity.Success : FodSeverity.Error)" 
                          Class="mt-3">
                    @validationResult.Message
                </FodAlert>
            }
        </FodCardContent>
    </FodCard>
</FodContainer>

@code {
    private PersonModel model = new();
    private bool isLoadingPerson;
    private ValidationResult validationResult;
    
    private async Task OnIdnpChanged()
    {
        if (string.IsNullOrWhiteSpace(model.Idnp) || model.Idnp.Length != 13)
            return;
        
        isLoadingPerson = true;
        validationResult = null;
        
        try
        {
            var personData = await PersonService.GetPersonData(new PersonDataRequest
            {
                Idnp = model.Idnp
            });
            
            if (personData != null)
            {
                model.FirstName = personData.FirstName;
                model.LastName = personData.LastName;
                
                validationResult = new ValidationResult
                {
                    IsValid = true,
                    Message = "Date preluate cu succes din RSP"
                };
            }
            else
            {
                validationResult = new ValidationResult
                {
                    IsValid = false,
                    Message = "IDNP-ul nu a fost găsit în RSP"
                };
            }
        }
        catch (Exception ex)
        {
            NotificationService.Error($"Eroare la verificarea IDNP: {ex.Message}");
        }
        finally
        {
            isLoadingPerson = false;
        }
    }
}
```

#### Componenta FodPerson integrată
```razor
@page "/servicii/cerere-noua"

<FodContainer>
    <FodText Typo="Typo.h4" GutterBottom="true">
        Depunere Cerere Nouă
    </FodText>
    
    <FodCard>
        <FodCardContent>
            <!-- Componenta FodPerson gestionează tot -->
            <FodPerson @bind-Model="person"
                       ValidateNameByIdnp="true"
                       AutoPopulateNameByIdnp="true"
                       ShowMiddleName="true"
                       ShowBirthDate="true"
                       ShowGender="true"
                       OnPersonDataLoaded="OnPersonDataLoaded" />
            
            <!-- Alte câmpuri formular -->
            <FodDivider Class="my-4" />
            
            <FodGrid Container="true" Spacing="3">
                <FodGrid Item="true" xs="12" md="6">
                    <FodInput @bind-Value="requestModel.Email" 
                              Label="Email"
                              Type="email"
                              Required="true" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="6">
                    <FodInput @bind-Value="requestModel.Phone" 
                              Label="Telefon"
                              Mask="+373 (__) ___-___"
                              Required="true" />
                </FodGrid>
            </FodGrid>
        </FodCardContent>
        <FodCardActions>
            <FodButton Color="FodColor.Primary" OnClick="SubmitRequest">
                Depune Cererea
            </FodButton>
        </FodCardActions>
    </FodCard>
</FodContainer>

@code {
    private PersonModel person = new();
    private RequestModel requestModel = new();
    
    private void OnPersonDataLoaded(PersonData data)
    {
        if (data != null)
        {
            // Date adiționale preluate din RSP
            Console.WriteLine($"Persoană identificată: {data.FirstName} {data.LastName}");
            
            // Poți prelua date suplimentare sau face validări
        }
    }
    
    private async Task SubmitRequest()
    {
        // Validare și trimitere cerere
    }
}
```

#### Validare avansată cu verificare identitate
```csharp
public class IdentityVerificationService
{
    private readonly IPersonComponentService _personService;
    private readonly ILogger<IdentityVerificationService> _logger;
    
    public async Task<IdentityVerificationResult> VerifyIdentity(
        string idnp, 
        string providedFirstName, 
        string providedLastName)
    {
        try
        {
            // Obține date din RSP
            var personData = await _personService.GetPersonData(new PersonDataRequest
            {
                Idnp = idnp
            });
            
            if (personData == null)
            {
                return new IdentityVerificationResult
                {
                    IsValid = false,
                    Reason = "IDNP-ul nu există în RSP"
                };
            }
            
            // Normalizare nume pentru comparație
            var normalizedProvidedFirst = NormalizeName(providedFirstName);
            var normalizedProvidedLast = NormalizeName(providedLastName);
            var normalizedRspFirst = NormalizeName(personData.FirstName);
            var normalizedRspLast = NormalizeName(personData.LastName);
            
            // Verificare exactă
            bool exactMatch = normalizedProvidedFirst == normalizedRspFirst && 
                             normalizedProvidedLast == normalizedRspLast;
            
            if (exactMatch)
            {
                return new IdentityVerificationResult
                {
                    IsValid = true,
                    Confidence = 100
                };
            }
            
            // Verificare similitudine (pentru erori de tastare)
            var firstNameSimilarity = CalculateSimilarity(
                normalizedProvidedFirst, 
                normalizedRspFirst);
            var lastNameSimilarity = CalculateSimilarity(
                normalizedProvidedLast, 
                normalizedRspLast);
            
            var averageSimilarity = (firstNameSimilarity + lastNameSimilarity) / 2;
            
            if (averageSimilarity >= 90)
            {
                _logger.LogWarning(
                    "Potrivire parțială pentru IDNP {Idnp}: {Similarity}%", 
                    idnp, 
                    averageSimilarity);
                
                return new IdentityVerificationResult
                {
                    IsValid = true,
                    Confidence = averageSimilarity,
                    Warning = "Numele nu corespunde exact cu cel din RSP"
                };
            }
            
            return new IdentityVerificationResult
            {
                IsValid = false,
                Reason = "Numele furnizat nu corespunde cu cel din RSP",
                Confidence = averageSimilarity
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Eroare la verificarea identității pentru IDNP {Idnp}", idnp);
            throw;
        }
    }
    
    private string NormalizeName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return string.Empty;
        
        return name.Trim()
                   .ToUpperInvariant()
                   .Replace("Ă", "A")
                   .Replace("Â", "A")
                   .Replace("Î", "I")
                   .Replace("Ș", "S")
                   .Replace("Ț", "T");
    }
    
    private double CalculateSimilarity(string str1, string str2)
    {
        // Implementare algoritm Levenshtein sau similar
        // Returnează procentaj similitudine 0-100
        return 85.0; // Placeholder
    }
}

public class IdentityVerificationResult
{
    public bool IsValid { get; set; }
    public string Reason { get; set; }
    public string Warning { get; set; }
    public double Confidence { get; set; }
}
```

#### Formular cu opțiuni de confidențialitate
```razor
@inject IPersonComponentService PersonService
@inject IOptions<PersonComponentOptions> PersonOptions

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Date Solicitant
        </FodText>
        
        @if (!PersonOptions.Value.AllowGetData)
        {
            <FodAlert Severity="FodSeverity.Info" Class="mb-3">
                Verificarea automată în RSP este dezactivată. 
                Vă rugăm introduceți manual datele.
            </FodAlert>
        }
        
        <FodGrid Container="true" Spacing="3">
            <FodGrid Item="true" xs="12">
                <FodInput @bind-Value="idnp" 
                          Label="IDNP"
                          EndAdornment="@GetIdnpAdornment()" />
            </FodGrid>
            
            @if (personData != null)
            {
                <FodGrid Item="true" xs="12" md="6">
                    <FodTextField Label="Prenume" 
                                  Value="@GetDisplayName(personData.FirstName)"
                                  ReadOnly="true" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="6">
                    <FodTextField Label="Nume" 
                                  Value="@GetDisplayName(personData.LastName)"
                                  ReadOnly="true" />
                </FodGrid>
                
                @if (PersonOptions.Value.BlurName)
                {
                    <FodGrid Item="true" xs="12">
                        <FodAlert Severity="FodSeverity.Info" Variant="FodVariant.Outlined">
                            <FodIcon>@FodIcons.Material.Filled.Security</FodIcon>
                            Datele personale sunt parțial ascunse pentru confidențialitate
                        </FodAlert>
                    </FodGrid>
                }
            }
        </FodGrid>
        
        <FodButton OnClick="SearchPerson" 
                   Color="FodColor.Primary"
                   Class="mt-3"
                   Disabled="@(!IsValidIdnp(idnp) || isSearching)">
            @if (isSearching)
            {
                <FodLoadingButton />
            }
            else
            {
                <text>Verifică în RSP</text>
            }
        </FodButton>
    </FodCardContent>
</FodCard>

@code {
    private string idnp;
    private PersonData personData;
    private bool isSearching;
    
    private string GetDisplayName(string name)
    {
        if (string.IsNullOrEmpty(name))
            return "-";
        
        if (PersonOptions.Value.BlurName)
        {
            // Prima literă + asteriscuri
            return name[0] + new string('*', name.Length - 1);
        }
        
        if (!PersonOptions.Value.AllowFullName)
        {
            // Doar inițiala
            return name[0] + ".";
        }
        
        return name;
    }
    
    private RenderFragment GetIdnpAdornment()
    {
        return @<text>
            @if (personData != null)
            {
                <FodIcon Color="FodColor.Success">
                    @FodIcons.Material.Filled.CheckCircle
                </FodIcon>
            }
        </text>;
    }
    
    private bool IsValidIdnp(string value)
    {
        return !string.IsNullOrWhiteSpace(value) && 
               value.Length == 13 && 
               value.All(char.IsDigit);
    }
    
    private async Task SearchPerson()
    {
        if (!PersonOptions.Value.AllowGetData)
        {
            NotificationService.Warning("Verificarea în RSP este dezactivată");
            return;
        }
        
        isSearching = true;
        
        try
        {
            personData = await PersonService.GetPersonData(new PersonDataRequest
            {
                Idnp = idnp
            });
            
            if (personData != null)
            {
                NotificationService.Success("Persoană găsită în RSP");
            }
            else
            {
                NotificationService.Warning("Persoană negăsită în RSP");
            }
        }
        catch (Exception ex)
        {
            NotificationService.Error($"Eroare: {ex.Message}");
        }
        finally
        {
            isSearching = false;
        }
    }
}
```

### 7. Integrare cu audit și GDPR

```csharp
public class AuditedPersonComponentService : IPersonComponentService
{
    private readonly IPersonComponentService _innerService;
    private readonly IAuditService _auditService;
    private readonly ICurrentUserContextService _userContext;
    private readonly IServiceContext _serviceContext;
    
    public async Task<PersonData> GetPersonData(PersonDataRequest request)
    {
        var stopwatch = Stopwatch.StartNew();
        var userId = await _userContext.GetUserId();
        var serviceName = _serviceContext.CurrentServiceName;
        
        // Înregistrare acces pentru GDPR
        await _auditService.LogDataAccess(new DataAccessLog
        {
            UserId = userId,
            DataType = "PersonalData",
            DataSubject = request.Idnp,
            Purpose = $"Verificare identitate pentru {serviceName}",
            Timestamp = DateTime.UtcNow,
            LegalBasis = "Consimțământ explicit",
            Duration = null
        });
        
        try
        {
            var result = await _innerService.GetPersonData(request);
            
            // Audit succes
            await _auditService.LogAsync(new AuditEntry
            {
                Action = "RSP_LOOKUP_SUCCESS",
                UserId = userId,
                EntityType = "Person",
                EntityId = request.Idnp,
                Success = true,
                Duration = stopwatch.ElapsedMilliseconds,
                Details = result != null ? "Person found" : "Person not found"
            });
            
            return result;
        }
        catch (Exception ex)
        {
            // Audit eșec
            await _auditService.LogAsync(new AuditEntry
            {
                Action = "RSP_LOOKUP_FAILED",
                UserId = userId,
                EntityType = "Person",
                EntityId = request.Idnp,
                Success = false,
                Duration = stopwatch.ElapsedMilliseconds,
                ErrorMessage = ex.Message
            });
            
            throw;
        }
    }
}
```

### 8. Cache și performanță

```csharp
public class CachedPersonComponentService : IPersonComponentService
{
    private readonly IPersonComponentService _innerService;
    private readonly IMemoryCache _cache;
    private readonly IOptions<PersonComponentOptions> _options;
    
    public async Task<PersonData> GetPersonData(PersonDataRequest request)
    {
        // Nu folosim cache dacă datele sunt sensibile
        if (_options.Value.BlurName || !_options.Value.AllowFullName)
        {
            return await _innerService.GetPersonData(request);
        }
        
        var cacheKey = $"person_{request.Idnp}";
        
        if (_cache.TryGetValue<PersonData>(cacheKey, out var cached))
        {
            return cached;
        }
        
        var result = await _innerService.GetPersonData(request);
        
        if (result != null)
        {
            // Cache pentru 5 minute
            _cache.Set(cacheKey, result, new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(5),
                PostEvictionCallbacks =
                {
                    new PostEvictionCallbackRegistration
                    {
                        EvictionCallback = (key, value, reason, state) =>
                        {
                            // Log cache eviction pentru audit
                            var logger = state as ILogger;
                            logger?.LogDebug("Person data evicted from cache: {Key}, Reason: {Reason}", 
                                key, reason);
                        },
                        State = _logger
                    }
                }
            });
        }
        
        return result;
    }
}
```

### 9. Validare IDNP

```csharp
public static class IdnpValidator
{
    public static bool IsValid(string idnp)
    {
        if (string.IsNullOrWhiteSpace(idnp) || idnp.Length != 13)
            return false;
        
        if (!idnp.All(char.IsDigit))
            return false;
        
        // Validare structură IDNP Moldova
        // Format: GAAAALLZZZZC
        // G - gen (1/2)
        // AAAA - anul nașterii
        // LL - luna
        // ZZ - ziua
        // ZZZ - cod unic
        // C - cifră de control
        
        var gender = int.Parse(idnp[0].ToString());
        if (gender != 1 && gender != 2)
            return false;
        
        var year = int.Parse(idnp.Substring(1, 4));
        var month = int.Parse(idnp.Substring(5, 2));
        var day = int.Parse(idnp.Substring(7, 2));
        
        // Validare dată
        try
        {
            var date = new DateTime(year, month, day);
            if (date > DateTime.Now)
                return false;
        }
        catch
        {
            return false;
        }
        
        // Validare cifră de control
        return ValidateChecksum(idnp);
    }
    
    private static bool ValidateChecksum(string idnp)
    {
        int[] weights = { 7, 3, 1, 7, 3, 1, 7, 3, 1, 7, 3, 1 };
        int sum = 0;
        
        for (int i = 0; i < 12; i++)
        {
            sum += (idnp[i] - '0') * weights[i];
        }
        
        int checkDigit = sum % 10;
        return checkDigit == (idnp[12] - '0');
    }
    
    public static PersonInfo ExtractInfo(string idnp)
    {
        if (!IsValid(idnp))
            return null;
        
        return new PersonInfo
        {
            Gender = idnp[0] == '1' ? Gender.Male : Gender.Female,
            BirthDate = new DateTime(
                int.Parse(idnp.Substring(1, 4)),
                int.Parse(idnp.Substring(5, 2)),
                int.Parse(idnp.Substring(7, 2))
            ),
            Age = CalculateAge(new DateTime(
                int.Parse(idnp.Substring(1, 4)),
                int.Parse(idnp.Substring(5, 2)),
                int.Parse(idnp.Substring(7, 2))
            ))
        };
    }
}
```

### 10. Rate limiting și securitate

```csharp
public class RateLimitedPersonComponentService : IPersonComponentService
{
    private readonly IPersonComponentService _innerService;
    private readonly IRateLimiter _rateLimiter;
    private readonly ILogger<RateLimitedPersonComponentService> _logger;
    
    public async Task<PersonData> GetPersonData(PersonDataRequest request)
    {
        var clientId = GetClientIdentifier();
        
        // Limită: 10 cereri per minut per utilizator
        var allowed = await _rateLimiter.AllowAsync(
            $"person_lookup_{clientId}", 
            limit: 10, 
            window: TimeSpan.FromMinutes(1));
        
        if (!allowed)
        {
            _logger.LogWarning(
                "Rate limit exceeded for client {ClientId} looking up IDNP {Idnp}", 
                clientId, 
                request.Idnp.Substring(0, 4) + "***");
            
            throw new RateLimitExceededException(
                "Prea multe cereri. Vă rugăm încercați din nou peste un minut.");
        }
        
        // Verificare blacklist IDNP (pentru protecție date VIP)
        if (await IsBlacklistedIdnp(request.Idnp))
        {
            _logger.LogWarning(
                "Attempted access to blacklisted IDNP by {ClientId}", 
                clientId);
            
            return null; // Returnăm null ca și cum nu există
        }
        
        return await _innerService.GetPersonData(request);
    }
}
```

### 11. Testare

```csharp
[TestClass]
public class PersonComponentServiceTests
{
    private Mock<HttpMessageHandler> _httpHandler;
    private IPersonComponentService _service;
    
    [TestMethod]
    public async Task GetPersonData_ValidIdnp_ReturnsPersonData()
    {
        // Arrange
        var request = new PersonDataRequest { Idnp = "2001234567890" };
        var expectedResponse = new PersonData
        {
            Idnp = "2001234567890",
            FirstName = "Ion",
            LastName = "Popescu"
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _service.GetPersonData(request);
        
        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual("Ion", result.FirstName);
        Assert.AreEqual("Popescu", result.LastName);
    }
    
    [TestMethod]
    public async Task GetPersonData_InvalidIdnp_ReturnsNull()
    {
        // Arrange
        var request = new PersonDataRequest { Idnp = "0000000000000" };
        
        SetupHttpResponse<PersonData>(null);
        
        // Act
        var result = await _service.GetPersonData(request);
        
        // Assert
        Assert.IsNull(result);
    }
    
    [TestMethod]
    public void IdnpValidator_ValidIdnp_ReturnsTrue()
    {
        // Arrange
        var validIdnp = "2001234567890"; // Placeholder
        
        // Act
        var isValid = IdnpValidator.IsValid(validIdnp);
        
        // Assert
        Assert.IsTrue(isValid);
    }
}
```

### 12. Best Practices

1. **Minimizare date** - Preluați doar datele strict necesare
2. **Audit complet** - Înregistrați toate accesările RSP
3. **Consimțământ explicit** - Obțineți acordul pentru verificare RSP
4. **Protecție date** - Aplicați blur/mascare pentru date sensibile
5. **Rate limiting** - Preveniți abuzuri prin limitare acces
6. **Cache responsabil** - Cache doar cu măsuri de securitate
7. **Validare IDNP** - Verificați format înainte de cerere RSP

### 13. Concluzie

`PersonComponentService` oferă acces securizat și controlat la datele personale din RSP, cu măsuri stricte de confidențialitate și conformitate GDPR. Serviciul facilitează validarea identității și auto-popularea formularelor, îmbunătățind experiența utilizatorilor în timp ce protejează datele personale sensibile.