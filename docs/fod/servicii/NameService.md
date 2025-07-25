# NameService

## Documentație pentru serviciul NameService

### 1. Descriere Generală

`NameService` este un serviciu pentru validarea și obținerea numelor persoanelor din Registrul de Stat al Populației (RSP) al Republicii Moldova. Serviciul oferă funcționalități de validare a identității persoanelor și verificare a relațiilor dintre persoane și entități juridice.

Caracteristici principale:
- Validare identitate prin IDNP, nume și prenume
- Obținere nume persoană după IDNP
- Verificare relație persoană-entitate (administrator)
- Integrare cu serviciile guvernamentale MConnect
- Suport pentru configurare flexibilă
- Protecție date personale

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs

// Client-side (Blazor WebAssembly)
builder.Services.AddFodComponents(configuration);

// Server-side cu MConnect
builder.Services.AddFodComponentsServer(configuration, connectionString);
builder.Services.AddMConnectIntegration(configuration);

// Configurare opțiuni server-side
builder.Services.Configure<NameServiceOptions>(options =>
{
    options.AllowValidateNameByIdnp = true;
    options.MConnectCallingReason = "Verificare identitate pentru serviciul {ServiceName}";
});

// Înregistrare manuală
builder.Services.AddScoped<INameService, NameService>();
builder.Services.AddHttpClient<INameService, NameService>(client =>
{
    client.BaseAddress = new Uri(configuration["ApiSettings:BaseUrl"]);
});
```

### 3. Interfața INameService

```csharp
namespace Fod.Components.Shared.Services
{
    public interface INameService
    {
        Task<ValidateNameModel> Validate(string idnp, string firstName, string lastName);
        Task<NameModel> GetName(string idnp);
        Task<VerifyEntityRelationship> VerifyEntitiesRelationship(string idno, string idnp);
    }
}
```

### 4. Metode Disponibile

| Metodă | Parametri | Return | Descriere |
|--------|-----------|--------|-----------|
| `Validate` | `string idnp, string firstName, string lastName` | `Task<ValidateNameModel>` | Validează identitatea persoanei |
| `GetName` | `string idnp` | `Task<NameModel>` | Obține numele persoanei după IDNP |
| `VerifyEntitiesRelationship` | `string idno, string idnp` | `Task<VerifyEntityRelationship>` | Verifică relația persoană-entitate |

### 5. Modele de Date

#### ValidateNameModel
```csharp
public class ValidateNameModel
{
    // Indică dacă persoana există în RSP
    public bool PersonExist { get; set; }
    
    // Indică dacă conexiunea cu serviciul este disponibilă
    public bool ConnectionExist { get; set; }
}
```

#### NameModel
```csharp
public class NameModel
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
```

#### VerifyEntityRelationship
```csharp
public class VerifyEntityRelationship
{
    // Indică dacă persoana este administrator al entității
    public bool IsAdministrator { get; set; }
    
    // Indică dacă conexiunea cu serviciul este disponibilă
    public bool ConnectionExist { get; set; }
}
```

#### NameServiceOptions
```csharp
public class NameServiceOptions
{
    // Permite validarea numelui după IDNP
    public bool AllowValidateNameByIdnp { get; set; } = true;
    
    // Motivul apelării serviciului MConnect pentru audit
    public string MConnectCallingReason { get; set; } = 
        "Verificare identitate pentru serviciul {ServiceName}";
}
```

### 6. Exemple de Utilizare

#### Validare identitate simplă
```razor
@page "/validare-identitate"
@inject INameService NameService
@inject IFodNotificationService NotificationService

<FodContainer>
    <FodCard>
        <FodCardContent>
            <FodText Typo="Typo.h6" GutterBottom="true">
                Validare Identitate
            </FodText>
            
            <FodGrid Container="true" Spacing="3">
                <FodGrid Item="true" xs="12" md="4">
                    <FodInput @bind-Value="idnp" 
                              Label="IDNP"
                              Mask="______________"
                              MaxLength="13"
                              Required="true" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="4">
                    <FodInput @bind-Value="firstName" 
                              Label="Prenume"
                              Required="true" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="4">
                    <FodInput @bind-Value="lastName" 
                              Label="Nume"
                              Required="true" />
                </FodGrid>
            </FodGrid>
            
            <FodButton OnClick="ValidateIdentity" 
                       Color="FodColor.Primary"
                       Class="mt-3"
                       Disabled="@(!IsFormValid() || isValidating)">
                @if (isValidating)
                {
                    <FodLoadingButton />
                }
                else
                {
                    <text>Validează</text>
                }
            </FodButton>
            
            @if (validationResult != null)
            {
                <FodAlert Severity="@GetAlertSeverity()" Class="mt-3">
                    @GetValidationMessage()
                </FodAlert>
            }
        </FodCardContent>
    </FodCard>
</FodContainer>

@code {
    private string idnp;
    private string firstName;
    private string lastName;
    private ValidateNameModel validationResult;
    private bool isValidating;
    
    private bool IsFormValid()
    {
        return !string.IsNullOrWhiteSpace(idnp) && 
               idnp.Length == 13 &&
               !string.IsNullOrWhiteSpace(firstName) &&
               !string.IsNullOrWhiteSpace(lastName);
    }
    
    private async Task ValidateIdentity()
    {
        if (!IsFormValid())
            return;
        
        isValidating = true;
        validationResult = null;
        
        try
        {
            validationResult = await NameService.Validate(idnp, firstName, lastName);
            
            if (!validationResult.ConnectionExist)
            {
                NotificationService.Warning("Conexiunea cu RSP nu este disponibilă");
            }
            else if (validationResult.PersonExist)
            {
                NotificationService.Success("Identitate validată cu succes!");
            }
            else
            {
                NotificationService.Error("Datele introduse nu corespund!");
            }
        }
        catch (Exception ex)
        {
            NotificationService.Error($"Eroare la validare: {ex.Message}");
        }
        finally
        {
            isValidating = false;
        }
    }
    
    private FodSeverity GetAlertSeverity()
    {
        if (!validationResult.ConnectionExist)
            return FodSeverity.Warning;
        
        return validationResult.PersonExist ? FodSeverity.Success : FodSeverity.Error;
    }
    
    private string GetValidationMessage()
    {
        if (!validationResult.ConnectionExist)
            return "Verificarea nu poate fi efectuată. Serviciul RSP nu este disponibil.";
        
        return validationResult.PersonExist
            ? "Identitatea a fost verificată cu succes. Datele corespund cu cele din RSP."
            : "Datele introduse nu corespund cu înregistrările din RSP. Verificați corectitudinea datelor.";
    }
}
```

#### Auto-completare nume după IDNP
```razor
@inject INameService NameService

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Date Personale cu Auto-completare
        </FodText>
        
        <FodGrid Container="true" Spacing="3">
            <FodGrid Item="true" xs="12">
                <FodInput @bind-Value="model.Idnp" 
                          Label="IDNP"
                          Mask="______________"
                          @onblur="OnIdnpChanged"
                          EndAdornment="@GetIdnpAdornment()" />
            </FodGrid>
            
            @if (isLoadingName)
            {
                <FodGrid Item="true" xs="12">
                    <FodLoadingLinear Indeterminate="true" />
                </FodGrid>
            }
            
            <FodGrid Item="true" xs="12" md="6">
                <FodInput @bind-Value="model.FirstName" 
                          Label="Prenume"
                          ReadOnly="@nameAutoFilled"
                          HelperText="@(nameAutoFilled ? "Completat automat din RSP" : "")" />
            </FodGrid>
            <FodGrid Item="true" xs="12" md="6">
                <FodInput @bind-Value="model.LastName" 
                          Label="Nume"
                          ReadOnly="@nameAutoFilled" />
            </FodGrid>
        </FodGrid>
        
        @if (showManualEntryWarning)
        {
            <FodAlert Severity="FodSeverity.Info" Class="mt-3">
                Numele nu a putut fi preluat automat. Vă rugăm introduceți manual datele.
            </FodAlert>
        }
    </FodCardContent>
</FodCard>

@code {
    private PersonModel model = new();
    private bool isLoadingName;
    private bool nameAutoFilled;
    private bool showManualEntryWarning;
    
    private async Task OnIdnpChanged()
    {
        if (string.IsNullOrWhiteSpace(model.Idnp) || model.Idnp.Length != 13)
            return;
        
        isLoadingName = true;
        nameAutoFilled = false;
        showManualEntryWarning = false;
        
        try
        {
            var nameData = await NameService.GetName(model.Idnp);
            
            if (nameData != null && !string.IsNullOrEmpty(nameData.FirstName))
            {
                model.FirstName = nameData.FirstName;
                model.LastName = nameData.LastName;
                nameAutoFilled = true;
                NotificationService.Success("Date preluate din RSP");
            }
            else
            {
                showManualEntryWarning = true;
            }
        }
        catch (NotImplementedException)
        {
            // Metoda GetName nu este implementată pe server
            showManualEntryWarning = true;
        }
        catch (Exception ex)
        {
            NotificationService.Error($"Eroare la preluarea datelor: {ex.Message}");
            showManualEntryWarning = true;
        }
        finally
        {
            isLoadingName = false;
        }
    }
    
    private RenderFragment GetIdnpAdornment()
    {
        return @<text>
            @if (nameAutoFilled)
            {
                <FodTooltip Title="Date preluate din RSP">
                    <FodIcon Color="FodColor.Success">
                        @FodIcons.Material.Filled.Verified
                    </FodIcon>
                </FodTooltip>
            }
        </text>;
    }
}
```

#### Verificare relație persoană-entitate
```razor
@inject INameService NameService

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Verificare Administrator Organizație
        </FodText>
        
        <FodGrid Container="true" Spacing="3">
            <FodGrid Item="true" xs="12" md="6">
                <FodInput @bind-Value="idno" 
                          Label="IDNO Organizație"
                          Mask="______________"
                          Required="true" />
            </FodGrid>
            <FodGrid Item="true" xs="12" md="6">
                <FodInput @bind-Value="idnp" 
                          Label="IDNP Administrator"
                          Mask="______________"
                          Required="true" />
            </FodGrid>
        </FodGrid>
        
        <FodButton OnClick="VerifyAdministrator" 
                   Color="FodColor.Primary"
                   Class="mt-3">
            Verifică Administrator
        </FodButton>
        
        @if (verificationResult != null)
        {
            <div class="mt-3">
                @if (!verificationResult.ConnectionExist)
                {
                    <FodAlert Severity="FodSeverity.Warning">
                        Serviciul de verificare nu este disponibil momentan.
                    </FodAlert>
                }
                else if (verificationResult.IsAdministrator)
                {
                    <FodAlert Severity="FodSeverity.Success">
                        <FodAlertTitle>Confirmat</FodAlertTitle>
                        Persoana cu IDNP @idnp este administrator al organizației cu IDNO @idno.
                    </FodAlert>
                }
                else
                {
                    <FodAlert Severity="FodSeverity.Error">
                        <FodAlertTitle>Neconfirmat</FodAlertTitle>
                        Persoana cu IDNP @idnp NU este administrator al organizației cu IDNO @idno.
                    </FodAlert>
                }
            </div>
        }
    </FodCardContent>
</FodCard>

@code {
    private string idno;
    private string idnp;
    private VerifyEntityRelationship verificationResult;
    
    private async Task VerifyAdministrator()
    {
        if (string.IsNullOrWhiteSpace(idno) || string.IsNullOrWhiteSpace(idnp))
            return;
        
        try
        {
            verificationResult = await NameService.VerifyEntitiesRelationship(idno, idnp);
        }
        catch (Exception ex)
        {
            NotificationService.Error($"Eroare la verificare: {ex.Message}");
        }
    }
}
```

### 7. Integrare cu componenta FodPerson

```razor
@page "/formular-persoana"

<FodContainer>
    <FodText Typo="Typo.h4" GutterBottom="true">
        Formular Date Personale
    </FodText>
    
    <!-- Componenta FodPerson folosește INameService intern -->
    <FodPerson @bind-Model="person"
               ValidateNameByIdnp="true"
               AutoPopulateNameByIdnp="false"
               ShowMiddleName="true"
               ShowBirthDate="true"
               ShowGender="true"
               OnValidationCompleted="OnPersonValidated" />
    
    <FodButton OnClick="SubmitForm" 
               Color="FodColor.Primary"
               Class="mt-3"
               Disabled="@(!isValid)">
        Trimite
    </FodButton>
</FodContainer>

@code {
    private PersonModel person = new();
    private bool isValid;
    
    private void OnPersonValidated(bool valid)
    {
        isValid = valid;
        
        if (!valid)
        {
            NotificationService.Warning("Datele personale necesită verificare");
        }
    }
    
    private async Task SubmitForm()
    {
        if (isValid)
        {
            // Procesare formular
            await ProcessForm(person);
        }
    }
}
```

### 8. Serviciu cu audit și cache

```csharp
public class AuditedNameService : INameService
{
    private readonly INameService _innerService;
    private readonly IAuditService _auditService;
    private readonly IMemoryCache _cache;
    private readonly ICurrentUserContextService _userContext;
    
    public async Task<ValidateNameModel> Validate(string idnp, string firstName, string lastName)
    {
        var userId = await _userContext.GetUserId();
        
        // Log pentru audit GDPR
        await _auditService.LogDataAccess(new DataAccessLog
        {
            UserId = userId,
            DataType = "PersonalNameValidation",
            DataSubject = idnp,
            Purpose = "Verificare identitate",
            Timestamp = DateTime.UtcNow
        });
        
        // Cache pentru reducere apeluri
        var cacheKey = $"name_validate_{idnp}_{firstName}_{lastName}".ToLower();
        if (_cache.TryGetValue<ValidateNameModel>(cacheKey, out var cached))
        {
            return cached;
        }
        
        var result = await _innerService.Validate(idnp, firstName, lastName);
        
        // Cache doar rezultatele pozitive pentru 10 minute
        if (result.ConnectionExist && result.PersonExist)
        {
            _cache.Set(cacheKey, result, TimeSpan.FromMinutes(10));
        }
        
        // Audit rezultat
        await _auditService.LogAsync(new AuditEntry
        {
            Action = "NAME_VALIDATION",
            EntityType = "Person",
            EntityId = idnp.Substring(0, 4) + "***",
            Success = result.PersonExist,
            UserId = userId,
            Details = result.PersonExist ? "Valid" : "Invalid"
        });
        
        return result;
    }
    
    public async Task<NameModel> GetName(string idnp)
    {
        // Similar cu audit și cache
        var cacheKey = $"name_get_{idnp}";
        if (_cache.TryGetValue<NameModel>(cacheKey, out var cached))
        {
            return cached;
        }
        
        var result = await _innerService.GetName(idnp);
        
        if (result != null)
        {
            _cache.Set(cacheKey, result, TimeSpan.FromMinutes(30));
        }
        
        return result;
    }
    
    public async Task<VerifyEntityRelationship> VerifyEntitiesRelationship(string idno, string idnp)
    {
        // Implementare similară cu audit
        return await _innerService.VerifyEntitiesRelationship(idno, idnp);
    }
}
```

### 9. Validare în lot

```csharp
public class BatchNameValidationService
{
    private readonly INameService _nameService;
    private readonly ILogger<BatchNameValidationService> _logger;
    
    public async Task<BatchValidationResult> ValidateBatch(List<PersonData> persons)
    {
        var result = new BatchValidationResult();
        var validationTasks = new List<Task<PersonValidationResult>>();
        
        // Limitare concurență
        using var semaphore = new SemaphoreSlim(5);
        
        foreach (var person in persons)
        {
            validationTasks.Add(ValidatePersonAsync(person, semaphore));
        }
        
        var results = await Task.WhenAll(validationTasks);
        
        result.TotalProcessed = results.Length;
        result.ValidCount = results.Count(r => r.IsValid);
        result.InvalidCount = results.Count(r => !r.IsValid && r.ConnectionAvailable);
        result.ConnectionErrorCount = results.Count(r => !r.ConnectionAvailable);
        result.Details = results.ToList();
        
        return result;
    }
    
    private async Task<PersonValidationResult> ValidatePersonAsync(
        PersonData person, 
        SemaphoreSlim semaphore)
    {
        await semaphore.WaitAsync();
        try
        {
            var stopwatch = Stopwatch.StartNew();
            var validation = await _nameService.Validate(
                person.Idnp, 
                person.FirstName, 
                person.LastName);
            
            return new PersonValidationResult
            {
                Person = person,
                IsValid = validation.PersonExist,
                ConnectionAvailable = validation.ConnectionExist,
                ValidationTime = stopwatch.ElapsedMilliseconds
            };
        }
        finally
        {
            semaphore.Release();
        }
    }
}

public class BatchValidationResult
{
    public int TotalProcessed { get; set; }
    public int ValidCount { get; set; }
    public int InvalidCount { get; set; }
    public int ConnectionErrorCount { get; set; }
    public List<PersonValidationResult> Details { get; set; }
}
```

### 10. Protecție date personale

```csharp
public class PrivacyProtectedNameService : INameService
{
    private readonly INameService _innerService;
    private readonly IDataProtectionProvider _dataProtection;
    private readonly ILogger<PrivacyProtectedNameService> _logger;
    
    public async Task<ValidateNameModel> Validate(string idnp, string firstName, string lastName)
    {
        // Logging cu date anonimizate
        _logger.LogInformation(
            "Name validation request for IDNP: {IdnpMasked}, Name: {NameInitials}",
            MaskIdnp(idnp),
            GetInitials(firstName, lastName));
        
        var result = await _innerService.Validate(idnp, firstName, lastName);
        
        // Nu logăm rezultatul specific pentru privacy
        _logger.LogInformation("Name validation completed");
        
        return result;
    }
    
    private string MaskIdnp(string idnp)
    {
        if (string.IsNullOrEmpty(idnp) || idnp.Length < 4)
            return "***";
        
        return idnp.Substring(0, 4) + new string('*', idnp.Length - 4);
    }
    
    private string GetInitials(string firstName, string lastName)
    {
        var firstInitial = string.IsNullOrEmpty(firstName) ? "*" : firstName[0].ToString();
        var lastInitial = string.IsNullOrEmpty(lastName) ? "*" : lastName[0].ToString();
        return $"{firstInitial}.{lastInitial}.";
    }
}
```

### 11. Testare

```csharp
[TestClass]
public class NameServiceTests
{
    private Mock<HttpMessageHandler> _httpHandler;
    private INameService _nameService;
    
    [TestInitialize]
    public void Setup()
    {
        _httpHandler = new Mock<HttpMessageHandler>();
        var httpClient = new HttpClient(_httpHandler.Object)
        {
            BaseAddress = new Uri("https://api.example.com/")
        };
        
        _nameService = new NameService(httpClient);
    }
    
    [TestMethod]
    public async Task Validate_ValidPerson_ReturnsPersonExists()
    {
        // Arrange
        var idnp = "2001234567890";
        var firstName = "Ion";
        var lastName = "Popescu";
        
        var expectedResponse = new ValidateNameModel
        {
            PersonExist = true,
            ConnectionExist = true
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _nameService.Validate(idnp, firstName, lastName);
        
        // Assert
        Assert.IsTrue(result.PersonExist);
        Assert.IsTrue(result.ConnectionExist);
    }
    
    [TestMethod]
    public async Task Validate_InvalidPerson_ReturnsPersonNotExists()
    {
        // Arrange
        var expectedResponse = new ValidateNameModel
        {
            PersonExist = false,
            ConnectionExist = true
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _nameService.Validate("1234567890123", "Test", "User");
        
        // Assert
        Assert.IsFalse(result.PersonExist);
        Assert.IsTrue(result.ConnectionExist);
    }
    
    [TestMethod]
    public async Task VerifyEntitiesRelationship_ValidAdmin_ReturnsIsAdministrator()
    {
        // Arrange
        var idno = "1003600123456";
        var idnp = "2001234567890";
        
        var expectedResponse = new VerifyEntityRelationship
        {
            IsAdministrator = true,
            ConnectionExist = true
        };
        
        SetupHttpResponse(expectedResponse);
        
        // Act
        var result = await _nameService.VerifyEntitiesRelationship(idno, idnp);
        
        // Assert
        Assert.IsTrue(result.IsAdministrator);
        Assert.IsTrue(result.ConnectionExist);
    }
}
```

### 12. Best Practices

1. **Cache inteligent** - Cache-uiți doar rezultatele pozitive
2. **Audit complet** - Înregistrați toate accesările pentru GDPR
3. **Protecție date** - Mascați datele sensibile în loguri
4. **Tratare erori** - Gestionați lipsa conexiunii graceful
5. **Validare input** - Verificați format IDNP/IDNO înainte de apel
6. **Rate limiting** - Limitați numărul de verificări per utilizator
7. **Fallback** - Permiteți introducere manuală când serviciul nu e disponibil

### 13. Concluzie

`NameService` este un serviciu esențial pentru validarea identității în sistemul FOD, oferind acces securizat la datele din registrele naționale. Cu funcționalități de validare, auto-completare și verificare relații persoană-entitate, serviciul facilitează procesarea sigură și eficientă a datelor personale în aplicațiile guvernamentale digitale.