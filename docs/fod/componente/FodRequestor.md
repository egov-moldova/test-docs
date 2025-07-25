# FodRequestor

## Documentație pentru componenta FodRequestor

### 1. Descriere Generală

`FodRequestor` este o componentă complexă pentru gestionarea informațiilor despre solicitant în aplicațiile guvernamentale. Suportă atât persoane fizice cât și juridice, cu validare automată prin servicii RSP/RSUD, autorizări MPower și populare automată a datelor.

Caracteristici principale:
- Suport pentru persoane fizice și juridice
- Validare IDNP/IDNO prin servicii RSP
- Integrare MPower pentru împuterniciri
- Populare automată date din context
- Validare relație administrator-companie
- Suport pentru statute multiple de solicitant
- Loading states pentru fiecare câmp
- Evenimente pentru toate schimbările
- Configurare flexibilă vizibilitate câmpuri

### 2. Utilizare de Bază

#### Formular simplu pentru solicitant
```razor
<FodRequestor @bind-Model="requestorModel" />

@code {
    private IRequestor requestorModel = new FodRequestorModel();
}
```

#### Formular cu validare automată
```razor
<FodRequestor @bind-Model="requestor"
              AutoPopulateNameByIdnp="true"
              ValidateNameByIdnp="true"
              IsEmailRequired="true"
              IsPhoneRequired="true" />

@code {
    private IRequestor requestor = new FodRequestorModel();
}
```

#### Formular pentru context autentificat
```razor
<FodRequestor @bind-Model="requestor"
              LoadFromContext="true"
              DisableRequestorIdnp="true"
              DisableRequestorType="true" />
```

### 3. Parametri Principali

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Model` | `IRequestor` | Modelul de date pentru solicitant | `new FodRequestorModel()` |
| `AutoPopulateNameByIdnp` | `bool` | Populează automat numele din IDNP | `false` |
| `AutoPopulateOrganizationNameByIdno` | `bool` | Populează automat numele organizației | `false` |
| `ValidateNameByIdnp` | `bool` | Validează corespondența IDNP-nume | `false` |
| `VerifyEntityRelationship` | `bool` | Verifică relația administrator-companie | `false` |
| `LoadFromContext` | `bool` | Încarcă date din context autentificat | `false` |
| `ShowOnBehalfOf` | `bool` | Afișează opțiuni pentru împuternicire | `false` |
| `IsEmailRequired` | `bool` | Email obligatoriu | `false` |
| `IsPhoneRequired` | `bool` | Telefon obligatoriu | `false` |

### 4. Parametri de Control Vizibilitate

| Proprietate | Tip | Descriere |
|-------------|-----|-----------|
| `HideRequestorType` | `bool` | Ascunde selecția tip persoană |
| `HideRequestorIndividual` | `bool` | Ascunde câmpurile pentru persoană fizică |
| `HideRequestorOrganisation` | `bool` | Ascunde câmpurile pentru organizație |
| `HideRequestorIdnp` | `bool` | Ascunde câmpul IDNP |
| `HideAuthorization` | `bool` | Ascunde selecția autorizări |
| `HideOnBehalfOn` | `bool` | Ascunde selecția pentru împuternicire |
| `HideRequestorIndividualDetails` | `bool` | Ascunde detaliile de contact |

### 5. Parametri de Dezactivare

| Proprietate | Tip | Descriere |
|-------------|-----|-----------|
| `DisableRequestorType` | `bool` | Dezactivează selecția tip persoană |
| `DisableRequestorIdnp` | `bool` | Dezactivează câmpul IDNP |
| `DisableRequestorCompanyName` | `bool` | Dezactivează numele companiei |
| `DisableRequestorIdno` | `bool` | Dezactivează IDNO |
| `DisableOnBehalfOn` | `bool` | Dezactivează selecția împuternicire |
| `IsReadonly` | `bool` | Setează toate câmpurile readonly |

### 6. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `OnRequestorIdnpChanged` | `EventCallback<string>` | IDNP schimbat |
| `OnRequestorIdnoChanged` | `EventCallback<string>` | IDNO schimbat |
| `OnRequestorFirstNameChanged` | `EventCallback<string>` | Prenume schimbat |
| `OnRequestorLastNameChanged` | `EventCallback<string>` | Nume schimbat |
| `OnRequestorCompanyNameChanged` | `EventCallback<string>` | Nume companie schimbat |
| `OnRequestorPhoneChanged` | `EventCallback<string>` | Telefon schimbat |
| `OnRequestorEmailChanged` | `EventCallback<string>` | Email schimbat |
| `OnRequestorTypeChanged` | `EventCallback<PersonType>` | Tip persoană schimbat |
| `OnBehalfOnChanged` | `EventCallback<OnBehalfOnEnum>` | Împuternicire schimbată |
| `OnChangeSelectedAuthorization` | `EventCallback<MPowerAuthorization>` | Autorizare selectată |
| `OnEntityRelationshipVerified` | `EventCallback<bool>` | Relație verificată |
| `OnChanged` | `EventCallback` | Orice schimbare |

### 7. Exemple Avansate

#### Formular complet cu toate opțiunile
```razor
<EditForm Model="serviceRequest" OnValidSubmit="SubmitRequest">
    <DataAnnotationsValidator />
    
    <FodRequestor @bind-Model="serviceRequest.Requestor"
                  ShowOnBehalfOf="true"
                  AutoPopulateNameByIdnp="true"
                  AutoPopulateOrganizationNameByIdno="true"
                  ValidateNameByIdnp="true"
                  VerifyEntityRelationship="true"
                  IsEmailRequired="true"
                  IsPhoneRequired="true"
                  PhonePlaceholder="Ex: 069123456"
                  OnBehalfOfPosition="LabelPosition.Start"
                  MPowerAuthorizations="authorizations"
                  AuthorizationErrorMessage="Nu aveți autorizări disponibile"
                  OnRequestorTypeChanged="HandleRequestorTypeChange"
                  OnEntityRelationshipVerified="HandleRelationshipVerified" />
    
    @if (showValidationErrors)
    {
        <ValidationSummary />
    }
    
    <FodButton Type="submit" Color="FodColor.Primary">
        Trimite cererea
    </FodButton>
</EditForm>

@code {
    private ServiceRequest serviceRequest = new();
    private List<MPowerAuthorization> authorizations = new();
    private bool showValidationErrors;
    
    private void HandleRequestorTypeChange(PersonType type)
    {
        if (type == PersonType.Organization)
        {
            // Logică specifică pentru organizații
            LoadOrganizationSpecificData();
        }
    }
    
    private void HandleRelationshipVerified(bool isValid)
    {
        if (!isValid)
        {
            ShowNotification("Persoana nu este administrator al companiei", 
                           FodSeverity.Warning);
        }
    }
}
```

#### Formular cu statute multiple
```razor
<FodRequestor @bind-Model="requestor"
              ShowOnBehalfOf="true"
              HasMultipleRequestorStatute="true"
              RequestorStatuteOptions="requestorStatutes"
              OnChanged="UpdateFormState" />

@code {
    private IRequestor requestor = new FodRequestorModel();
    
    private List<FodRequestorStatuteModel> requestorStatutes = new()
    {
        new() { 
            Id = 1, 
            Name = "Proprietar", 
            OnBehalfOn = OnBehalfOnEnum.Personal 
        },
        new() { 
            Id = 2, 
            Name = "Administrator", 
            OnBehalfOn = OnBehalfOnEnum.Personal 
        },
        new() { 
            Id = 3, 
            Name = "Împuternicit", 
            OnBehalfOn = OnBehalfOnEnum.MPowerAuthorization 
        }
    };
    
    private void UpdateFormState()
    {
        // Actualizare stare formular bazată pe selecție
        StateHasChanged();
    }
}
```

#### Integrare cu MPower
```razor
<FodRequestor @bind-Model="requestor"
              ShowOnBehalfOf="true"
              MPowerAuthorizations="mpowerAuths"
              isLoadingMPower="loadingAuthorizations"
              OnChangeSelectedAuthorization="HandleAuthorizationSelected" />

@code {
    private IRequestor requestor = new FodRequestorModel();
    private List<MPowerAuthorization> mpowerAuths = new();
    private bool loadingAuthorizations = true;
    
    protected override async Task OnInitializedAsync()
    {
        loadingAuthorizations = true;
        
        try
        {
            // Încarcă autorizările din MPower
            mpowerAuths = await MPowerService.GetUserAuthorizations();
        }
        finally
        {
            loadingAuthorizations = false;
        }
    }
    
    private async Task HandleAuthorizationSelected(MPowerAuthorization auth)
    {
        // Procesează autorizarea selectată
        var authDetails = await MPowerService.GetAuthorizationDetails(auth.Id);
        
        // Populează datele bazate pe autorizare
        requestor.RequestorIdnp = authDetails.AuthorizedPersonIdnp;
        requestor.RequestorFirstName = authDetails.AuthorizedPersonFirstName;
        requestor.RequestorLastName = authDetails.AuthorizedPersonLastName;
    }
}
```

#### Formular cu validare personalizată
```razor
<FodRequestor @ref="requestorComponent"
              @bind-Model="requestor"
              ValidateNameByIdnp="false"
              OnRequestorIdnpChanged="CustomIdnpValidation"
              OnRequestorIdnoChanged="CustomIdnoValidation" />

<FodButton OnClick="ValidateAndSubmit">Validează și trimite</FodButton>

@code {
    private FodRequestor requestorComponent;
    private IRequestor requestor = new FodRequestorModel();
    
    private async Task CustomIdnpValidation(string idnp)
    {
        if (!string.IsNullOrEmpty(idnp))
        {
            // Validare IDNP personalizată
            if (!IsValidIdnp(idnp))
            {
                ShowError("IDNP invalid");
                return;
            }
            
            // Verificare blacklist
            if (await IsBlacklisted(idnp))
            {
                ShowError("Persoană în lista de restricții");
            }
        }
    }
    
    private async Task CustomIdnoValidation(string idno)
    {
        if (!string.IsNullOrEmpty(idno))
        {
            // Verificare status companie
            var companyStatus = await CompanyService.GetStatus(idno);
            if (companyStatus != "Active")
            {
                ShowWarning($"Compania are status: {companyStatus}");
            }
        }
    }
    
    private async Task ValidateAndSubmit()
    {
        // Validare manuală
        await requestorComponent.ValidateName();
        
        if (requestor.RequestorType == PersonType.Organization)
        {
            await requestorComponent.ValidateAdministrator();
        }
        
        if (requestorComponent.NameIsInvalid || 
            requestorComponent.AdministratorIsInvalid)
        {
            ShowError("Date invalide");
            return;
        }
        
        // Submit
        await SubmitRequest();
    }
}
```

### 8. Configurare Loading States

```razor
<FodRequestor @bind-Model="requestor"
              RequestorIdnpLoading="@idnpLoading"
              RequestorIdnoLoading="@idnoLoading"
              RequestorFirstNameLoading="@firstNameLoading"
              RequestorLastNameLoading="@lastNameLoading"
              RequestorCompanyNameLoading="@companyLoading"
              RequestorPhoneLoading="@phoneLoading"
              RequestorEmailLoading="@emailLoading" />

@code {
    private bool idnpLoading;
    private bool idnoLoading;
    // ... alte loading states
    
    private async Task LoadExternalData()
    {
        idnpLoading = true;
        // Încarcă date externe
        await Task.Delay(1000);
        idnpLoading = false;
    }
}
```

### 9. Integrare cu Contexte

```razor
<FodRequestor @bind-Model="requestor"
              LoadFromContext="true"
              LoadPersonTypeFromContext="true"
              AllowedContextTypes="@allowedTypes"
              DisableReadOnlyOnInvalid="true" />

@code {
    private IRequestor requestor = new FodRequestorModel();
    
    private UserContextType[] allowedTypes = new[]
    {
        UserContextType.Individual,
        UserContextType.Organization
    };
}
```

### 10. Model de Date

```csharp
public interface IRequestor
{
    PersonType RequestorType { get; set; }
    OnBehalfOnEnum OnBehalfOn { get; set; }
    
    // Persoană fizică
    string RequestorIdnp { get; set; }
    string RequestorFirstName { get; set; }
    string RequestorLastName { get; set; }
    
    // Persoană juridică
    string RequestorIdno { get; set; }
    string RequestorCompanyName { get; set; }
    
    // Contact
    string RequestorPhone { get; set; }
    string RequestorEmail { get; set; }
    
    // MPower
    MPowerAuthorization MPowerAuthorization { get; set; }
    
    // Statute
    FodRequestorStatuteModel RequestorStatuteModel { get; set; }
}
```

### 11. Stilizare și Teme

```css
/* Stiluri pentru validare */
.fod-requestor .alert-danger {
    margin-top: 10px;
    padding: 10px;
    border-radius: 4px;
}

/* Loading states */
.fod-requestor .fod-loading-linear {
    margin: 10px 0;
}

/* Grupare secțiuni */
.fod-requestor .row {
    margin-bottom: 15px;
}

/* MPower section */
.fod-requestor .mpower-section {
    background-color: rgba(var(--fod-palette-info-rgb), 0.1);
    padding: 15px;
    border-radius: 4px;
    margin: 15px 0;
}
```

### 12. Servicii Necesare

Pentru funcționarea completă, sunt necesare următoarele servicii:

```csharp
// Program.cs
builder.Services.AddScoped<INameService, NameService>();
builder.Services.AddScoped<IContextService, ContextService>();
builder.Services.AddScoped<IRequestorComponentService, RequestorComponentService>();
builder.Services.AddScoped<ICultureService, CultureService>();
```

### 13. Best Practices

1. **Validare progresivă** - Activați validarea doar când e necesară
2. **Loading states** - Folosiți loading pentru feedback vizual
3. **Context aware** - Folosiți LoadFromContext pentru utilizatori autentificați
4. **Error handling** - Tratați erorile de conexiune și validare
5. **Disable fields** - Dezactivați câmpuri pentru date pre-populate
6. **Events** - Folosiți evenimente pentru logică custom

### 14. Troubleshooting

#### Validarea nu funcționează
- Verificați conexiunea la serviciile RSP
- Verificați că serviciile sunt configurate corect
- Verificați permisiunile pentru accesare date

#### Date nu se populează din context
- Verificați LoadFromContext="true"
- Verificați că IContextService este înregistrat
- Verificați că utilizatorul este autentificat

#### MPower nu încarcă autorizări
- Verificați MPowerAuthorizations parameter
- Verificați isLoadingMPower state
- Verificați permisiunile utilizatorului

### 15. Concluzie

`FodRequestor` este o componentă esențială pentru aplicațiile guvernamentale FOD, oferind o soluție completă pentru gestionarea datelor solicitantului. Cu validare automată, integrare cu servicii externe și flexibilitate maximă în configurare, componenta asigură colectarea corectă și sigură a informațiilor despre solicitant.