# FodPerson

## Documentație pentru componenta FodPerson

### 1. Descriere Generală

`FodPerson` este o componentă business complexă pentru gestionarea datelor personale (IDNP, nume, prenume) cu validare și auto-populare din serviciile guvernamentale RSP. Componenta oferă multiple moduri de funcționare pentru diferite scenarii de utilizare.

Caracteristici principale:
- Câmpuri pentru IDNP, nume și prenume
- Validare automată a corespondenței IDNP-nume prin servicii RSP
- Auto-populare nume și prenume pe baza IDNP-ului
- Indicatori de încărcare pentru fiecare câmp
- Gestionare erori de conexiune
- Mod readonly flexibil
- Evenimente pentru fiecare schimbare de câmp

### 2. Utilizare de Bază

#### Formular simplu de persoană
```razor
<EditForm Model="@personModel">
    <FodPerson Model="@personModel" />
    
    <FodButton Type="ButtonType.Submit">Salvează</FodButton>
</EditForm>

@code {
    private FodPersonModel personModel = new();
}
```

#### Cu validare automată IDNP-nume
```razor
<FodPerson Model="@person" 
           ValidateNameByIdnp="true" />

<!-- Afișează eroare automată dacă numele nu corespunde cu IDNP -->
```

#### Cu auto-populare nume din IDNP
```razor
<FodPerson Model="@person" 
           AutoPopulateNameByIdnp="true" />

<!-- Numele și prenumele devin readonly și se completează automat -->
```

### 3. Atribute și Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Model` | `IPerson` | Modelul de date pentru persoană | `FodPersonModel` |
| `IsLoading` | `bool` | Indică stare generală de încărcare | `false` |
| `DisableIdnp` | `bool` | Dezactivează câmpul IDNP | `false` |
| `ValidateNameByIdnp` | `bool` | Validează corespondența IDNP-nume | `false` |
| `AutoPopulateNameByIdnp` | `bool` | Auto-populează nume din IDNP | `false` |
| `IsReadonly` | `bool` | Setează toate câmpurile readonly | `false` |
| `DisableReadOnlyOnInvalid` | `bool` | Dezactivează readonly la validare eșuată | `false` |
| `IdnpLoading` | `bool` | Indicator încărcare pentru IDNP | `false` |
| `LastNameLoading` | `bool` | Indicator încărcare pentru nume | `false` |
| `FirstNameLoading` | `bool` | Indicator încărcare pentru prenume | `false` |
| `OnIdnpChanged` | `EventCallback<string>` | Eveniment la schimbare IDNP | - |
| `OnFirstNameChanged` | `EventCallback<string>` | Eveniment la schimbare prenume | - |
| `OnLastNameChanged` | `EventCallback<string>` | Eveniment la schimbare nume | - |
| `OnChanged` | `EventCallback` | Eveniment la orice schimbare | - |

### 4. Proprietăți Publice

| Proprietate | Tip | Descriere |
|-------------|-----|-----------|
| `NameIsInvalid` | `bool` | Indică dacă numele nu corespunde cu IDNP |
| `ConnectionExist` | `bool` | Indică dacă conexiunea RSP este disponibilă |
| `IsNameValidating` | `bool` | Indică procesul de validare în curs |

### 5. Metode Publice

| Metodă | Descriere | Return |
|--------|-----------|--------|
| `ValidateName()` | Inițiază validarea manuală IDNP-nume | `Task` |

### 6. Exemple de Utilizare

#### Formular de înregistrare cu validare
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Date personale
        </FodText>
        
        <EditForm Model="@registrationModel" OnValidSubmit="HandleRegistration">
            <DataAnnotationsValidator />
            
            <FodPerson Model="@registrationModel.Person" 
                       ValidateNameByIdnp="true"
                       OnChanged="PersonDataChanged" />
            
            <ValidationSummary />
            
            <div class="mt-3">
                <FodButton Type="ButtonType.Submit" 
                           Color="FodColor.Primary"
                           Disabled="@(!isValid)">
                    Înregistrare
                </FodButton>
            </div>
        </EditForm>
    </FodCardContent>
</FodCard>

@code {
    private RegistrationModel registrationModel = new();
    private bool isValid = false;
    
    private void PersonDataChanged()
    {
        // Verifică dacă datele sunt complete și valide
        isValid = !string.IsNullOrEmpty(registrationModel.Person.IDNP) &&
                  !string.IsNullOrEmpty(registrationModel.Person.FirstName) &&
                  !string.IsNullOrEmpty(registrationModel.Person.LastName);
    }
    
    private async Task HandleRegistration()
    {
        await RegistrationService.RegisterAsync(registrationModel);
    }
}
```

#### Pentru utilizator autentificat
```razor
<!-- IDNP preluat din autentificare, doar nume editabile -->
<FodPerson Model="@currentUser" 
           DisableIdnp="true"
           AutoPopulateNameByIdnp="true" />

@code {
    private PersonModel currentUser = new();
    
    protected override void OnInitialized()
    {
        // IDNP preluat din claims
        currentUser.IDNP = UserService.GetCurrentUserIdnp();
    }
}
```

#### Wizard cu date personale
```razor
<FodWizard>
    <Steps>
        <FodWizardStep Title="Date personale">
            <FodPerson Model="@applicationData.ApplicantPerson" 
                       AutoPopulateNameByIdnp="true"
                       OnChanged="@(() => ValidateStep(1))" />
        </FodWizardStep>
        
        <FodWizardStep Title="Date contact">
            <!-- Alte date -->
        </FodWizardStep>
    </Steps>
</FodWizard>

@code {
    private ApplicationData applicationData = new();
    
    private void ValidateStep(int step)
    {
        // Validare date pentru pasul curent
    }
}
```

#### Formular cu validare extinsă
```razor
<EditForm Model="@serviceRequest" OnValidSubmit="SubmitRequest">
    <DataAnnotationsValidator />
    
    <FodText Typo="Typo.h6" GutterBottom="true">
        Solicitant
    </FodText>
    
    <FodPerson @ref="personComponent"
               Model="@serviceRequest.Applicant" 
               ValidateNameByIdnp="true"
               DisableReadOnlyOnInvalid="true"
               OnIdnpChanged="CheckExistingRequests" />
    
    @if (hasExistingRequests)
    {
        <FodAlert Severity="Severity.Warning" Class="mt-3">
            Aveți cereri în procesare pentru acest IDNP
        </FodAlert>
    }
    
    <div class="mt-4">
        <FodButton Type="ButtonType.Submit" 
                   Color="FodColor.Primary">
            Depune cererea
        </FodButton>
    </div>
</EditForm>

@code {
    private FodPerson personComponent;
    private ServiceRequest serviceRequest = new();
    private bool hasExistingRequests = false;
    
    private async Task CheckExistingRequests(string idnp)
    {
        if (!string.IsNullOrEmpty(idnp) && idnp.Length == 13)
        {
            hasExistingRequests = await RequestService
                .HasPendingRequestsAsync(idnp);
        }
    }
}
```

#### Cu indicatori de încărcare personalizați
```razor
<FodPerson Model="@person"
           AutoPopulateNameByIdnp="true"
           IdnpLoading="@customIdnpLoading"
           LastNameLoading="@customNameLoading"
           FirstNameLoading="@customNameLoading">
</FodPerson>

@if (customIdnpLoading || customNameLoading)
{
    <FodText Typo="Typo.caption" Color="FodColor.Primary">
        Se verifică datele în Registrul de Stat al Populației...
    </FodText>
}

@code {
    private PersonModel person = new();
    private bool customIdnpLoading = false;
    private bool customNameLoading = false;
}
```

### 7. Configurare Servicii

Componenta necesită următoarele servicii înregistrate:

```csharp
// Program.cs
builder.Services.AddScoped<INameService, NameService>();
builder.Services.AddScoped<IPersonComponentService, PersonComponentService>();

// Configurare pentru auto-populare
builder.Services.Configure<FodConfiguration>(options =>
{
    options.AllowGetPersonData = true; // Permite accesul la date RSP
});
```

### 8. Modele de Date

#### Interfața IPerson
```csharp
public interface IPerson
{
    string IDNP { get; set; }
    string FirstName { get; set; }
    string LastName { get; set; }
}
```

#### FodPersonModel implicit
```csharp
public class FodPersonModel : IPerson
{
    [Required(ErrorMessage = "IDNP este obligatoriu")]
    [StringLength(13, MinimumLength = 13, ErrorMessage = "IDNP trebuie să aibă 13 caractere")]
    public string IDNP { get; set; }
    
    [Required(ErrorMessage = "Numele este obligatoriu")]
    public string LastName { get; set; }
    
    [Required(ErrorMessage = "Prenumele este obligatoriu")]
    public string FirstName { get; set; }
}
```

### 9. Stilizare

```css
/* Container pentru FodPerson */
.person-form-container {
    padding: 1rem;
    background-color: var(--fod-palette-background-paper);
}

/* Evidențiere erori */
.person-form-container .alert-danger {
    margin-top: 0.5rem;
    font-size: 0.875rem;
}

/* Loading overlay pentru câmpuri */
.person-loading-field {
    position: relative;
}

.person-loading-field::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
}
```

### 10. Localizare

Componenta folosește următoarele chei de localizare din resursa `General`:

- `Error_NameIsInvalid` - Mesaj când numele nu corespunde cu IDNP
- `Not_Connection` - Mesaj când conexiunea RSP nu este disponibilă

### 11. Best Practices

1. **Configurare corectă** - Alegeți modul potrivit: validare sau auto-populare
2. **Gestionare erori** - Tratați cazurile de lipsă conexiune RSP
3. **Loading states** - Folosiți indicatorii de încărcare pentru UX mai bun
4. **Validare suplimentară** - Adăugați validări specifice domeniului
5. **Cache** - Considerați cache pentru date RSP frecvent accesate
6. **Securitate** - Limitați accesul la date personale conform GDPR

### 12. Integrare cu alte componente

#### În FodRequestor
```razor
<FodRequestor>
    <PersonContent>
        <FodPerson Model="@requestor.Person" 
                   AutoPopulateNameByIdnp="true" />
    </PersonContent>
    <!-- Alte date solicitant -->
</FodRequestor>
```

#### În formular multi-step
```razor
<FodExpansionPanels>
    <FodExpansionPanel Text="Date personale" IsExpanded="true">
        <FodPerson Model="@formData.Person" 
                   ValidateNameByIdnp="true" />
    </FodExpansionPanel>
    
    <FodExpansionPanel Text="Date contact">
        <!-- Date contact -->
    </FodExpansionPanel>
</FodExpansionPanels>
```

### 13. Troubleshooting

#### Validarea nu funcționează
- Verificați că serviciul INameService este înregistrat
- Verificați conexiunea la serviciile RSP
- Verificați că ValidateNameByIdnp="true"

#### Auto-popularea nu funcționează
- Verificați AllowGetPersonData în configurare
- Verificați permisiunile pentru acces RSP
- Verificați că IDNP-ul are 13 caractere

#### Câmpurile rămân în loading
- Verificați timeout-ul pentru serviciile RSP
- Implementați gestionare erori în servicii
- Adăugați timeout pentru operațiuni

### 14. Concluzie

`FodPerson` este o componentă esențială pentru gestionarea datelor personale în aplicațiile guvernamentale din Moldova. Cu validare integrată RSP și multiple moduri de funcționare, componenta asigură colectarea corectă și sigură a datelor personale conform standardelor oficiale.