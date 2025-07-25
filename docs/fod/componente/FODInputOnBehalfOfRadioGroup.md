# FODInputOnBehalfOfRadioGroup

## Descriere Generală

`FODInputOnBehalfOfRadioGroup<T>` este o componentă specializată pentru selectarea modului de acțiune: personal sau în numele altcuiva (prin MPower Authorization). Extinde `FODSelectableFormComponent<T>` și folosește intern două componente `FODInputRadioOnBehalfOf` pentru a oferi o selecție binară specifică pentru operațiuni guvernamentale.

## Utilizare de Bază

```razor
<!-- Selector standard pentru "în numele cui" -->
<FODInputOnBehalfOfRadioGroup @bind-Value="onBehalfMode" 
                               Label="Depuneți cererea"
                               OnBehalfOfFirstOptionText="Pentru mine personal"
                               OnBehalfOfSecondOptionText="În numele altcuiva (MPower)" />

<!-- Selector dezactivat -->
<FODInputOnBehalfOfRadioGroup @bind-Value="fixedMode" 
                               Label="Mod depunere"
                               Disable="true"
                               OnBehalfOfFirstOptionText="Personal"
                               OnBehalfOfSecondOptionText="Prin împuternicire" />
```

## Enum OnBehalfOnEnum

```csharp
public enum OnBehalfOnEnum
{
    Personal,              // Acțiune personală
    MPowerAuthorization   // Acțiune prin împuternicire MPower
}
```

## Atribute și Parametri

| Parametru | Tip | Default | Descriere |
|-----------|-----|---------|-----------|
| Type | FodRadioType | Radio | Tipul afișării (Radio/Button) |
| Disable | bool | false | Dezactivează ambele opțiuni |
| ShowOnBehalfOf | bool | false | Controlează afișarea (nefolosit în template) |
| OnBehalfOfFirstOptionText | string | null | Text pentru opțiunea Personal |
| OnBehalfOfSecondOptionText | string | null | Text pentru opțiunea MPower |
| Label | string | null | Eticheta grupului |

## Exemple de Utilizare

### Formular de Depunere Cerere

```razor
<EditForm Model="@application" OnValidSubmit="@SubmitApplication">
    <DataAnnotationsValidator />
    
    <FODInputOnBehalfOfRadioGroup @bind-Value="application.OnBehalfMode" 
                                   Label="Depun această cerere"
                                   OnBehalfOfFirstOptionText="Pentru mine personal"
                                   OnBehalfOfSecondOptionText="În numele unei alte persoane (prin MPower)"
                                   @bind-Value:after="OnModeChanged" />
    
    @if (application.OnBehalfMode == OnBehalfOnEnum.MPowerAuthorization)
    {
        <div class="mpower-info alert alert-info mt-3">
            <h5>Informații despre MPower</h5>
            <p>Pentru a depune în numele altcuiva, aveți nevoie de o împuternicire validă în sistemul MPower.</p>
            <FodButton Color="FodColor.Primary" @onclick="OpenMPowerSelector">
                Selectați împuternicirea
            </FodButton>
        </div>
        
        @if (selectedAuthorization != null)
        {
            <div class="selected-authorization mt-3">
                <h6>Împuternicire selectată:</h6>
                <p><strong>Beneficiar:</strong> @selectedAuthorization.BeneficiaryName</p>
                <p><strong>Valabilă până la:</strong> @selectedAuthorization.ValidUntil.ToString("dd.MM.yyyy")</p>
            </div>
        }
    }
    
    <ValidationSummary />
    <button type="submit" class="btn btn-primary">Continuă</button>
</EditForm>

@code {
    private ApplicationModel application = new();
    private MPowerAuthorization selectedAuthorization;
    
    public class ApplicationModel
    {
        [Required(ErrorMessage = "Selectați modul de depunere")]
        public OnBehalfOnEnum? OnBehalfMode { get; set; }
        
        public string AuthorizationId { get; set; }
    }
    
    private async Task OnModeChanged()
    {
        if (application.OnBehalfMode == OnBehalfOnEnum.Personal)
        {
            selectedAuthorization = null;
            application.AuthorizationId = null;
        }
    }
    
    private async Task OpenMPowerSelector()
    {
        // Deschide selector pentru împuterniciri MPower
        selectedAuthorization = await MPowerService.SelectAuthorization();
        if (selectedAuthorization != null)
        {
            application.AuthorizationId = selectedAuthorization.Id;
        }
    }
}
```

### Verificare Permisiuni

```razor
<div class="service-request-form">
    <h3>@serviceName</h3>
    
    @if (serviceRequiresMPower)
    {
        <FODInputOnBehalfOfRadioGroup @bind-Value="requestMode" 
                                       Label="Acest serviciu poate fi solicitat"
                                       OnBehalfOfFirstOptionText="❌ Personal (indisponibil)"
                                       OnBehalfOfSecondOptionText="✓ Doar prin împuternicire MPower"
                                       Disable="@disablePersonalOption" />
    }
    else
    {
        <FODInputOnBehalfOfRadioGroup @bind-Value="requestMode" 
                                       Label="Solicitați serviciul"
                                       OnBehalfOfFirstOptionText="Pentru dumneavoastră"
                                       OnBehalfOfSecondOptionText="Pentru altă persoană (MPower)" />
    }
    
    <div class="request-info mt-3">
        @switch (requestMode)
        {
            case OnBehalfOnEnum.Personal:
                <p>Veți completa cererea cu datele dumneavoastră personale.</p>
                break;
            case OnBehalfOnEnum.MPowerAuthorization:
                <p>Veți completa cererea pentru persoana împuternicită.</p>
                break;
        }
    </div>
</div>

@code {
    private string serviceName = "Eliberare certificat";
    private bool serviceRequiresMPower = false;
    private bool disablePersonalOption => serviceRequiresMPower;
    private OnBehalfOnEnum requestMode = OnBehalfOnEnum.Personal;
    
    protected override void OnInitialized()
    {
        if (serviceRequiresMPower)
        {
            requestMode = OnBehalfOnEnum.MPowerAuthorization;
        }
    }
}
```

### Workflow cu Pași

```razor
<FodWizard>
    <FodWizardStep Title="Mod depunere">
        <FODInputOnBehalfOfRadioGroup @bind-Value="wizardData.Mode" 
                                       Label="Cum doriți să procedați?"
                                       OnBehalfOfFirstOptionText="Depun pentru mine"
                                       OnBehalfOfSecondOptionText="Depun pentru altcineva"
                                       @bind-Value:after="ConfigureNextSteps" />
    </FodWizardStep>
    
    @if (wizardData.Mode == OnBehalfOnEnum.MPowerAuthorization)
    {
        <FodWizardStep Title="Selectare împuternicire">
            <h4>Selectați împuternicirea MPower</h4>
            <MPowerAuthorizationSelector @bind-Value="wizardData.AuthorizationId" />
        </FodWizardStep>
    }
    
    <FodWizardStep Title="Date solicitant">
        @if (wizardData.Mode == OnBehalfOnEnum.Personal)
        {
            <PersonalDataForm @bind-Value="wizardData.PersonalData" />
        }
        else
        {
            <BeneficiaryDataDisplay AuthorizationId="@wizardData.AuthorizationId" />
        }
    </FodWizardStep>
    
    <FodWizardStep Title="Confirmare">
        <h4>Verificați datele</h4>
        <p><strong>Mod depunere:</strong> 
            @(wizardData.Mode == OnBehalfOnEnum.Personal ? "Personal" : "Prin împuternicire")
        </p>
    </FodWizardStep>
</FodWizard>

@code {
    private WizardData wizardData = new();
    
    public class WizardData
    {
        public OnBehalfOnEnum Mode { get; set; } = OnBehalfOnEnum.Personal;
        public string AuthorizationId { get; set; }
        public PersonalData PersonalData { get; set; }
    }
    
    private void ConfigureNextSteps()
    {
        // Configurează pașii următori bazat pe selecție
    }
}
```

### Validare Condiționată

```razor
<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />
    
    <FODInputOnBehalfOfRadioGroup @bind-Value="model.Mode" 
                                   Label="Tip cerere"
                                   OnBehalfOfFirstOptionText="Cerere personală"
                                   OnBehalfOfSecondOptionText="Cerere prin reprezentant" />
    
    @if (model.Mode == OnBehalfOnEnum.MPowerAuthorization)
    {
        <div class="authorization-fields mt-3">
            <FODInputText @bind-Value="model.AuthorizationNumber" 
                          Label="Număr împuternicire"
                          Required="true" />
            
            <FodDatePicker @bind-Value="model.AuthorizationDate" 
                           Label="Data împuternicirii"
                           Required="true" />
            
            <FODInputText @bind-Value="model.BeneficiaryIdnp" 
                          Label="IDNP beneficiar"
                          Required="true" />
        </div>
    }
    
    <ValidationSummary />
    <button type="submit">Trimite</button>
</EditForm>

@code {
    private RequestModel model = new();
    
    public class RequestModel : IValidatableObject
    {
        public OnBehalfOnEnum Mode { get; set; }
        public string AuthorizationNumber { get; set; }
        public DateTime? AuthorizationDate { get; set; }
        public string BeneficiaryIdnp { get; set; }
        
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Mode == OnBehalfOnEnum.MPowerAuthorization)
            {
                if (string.IsNullOrEmpty(AuthorizationNumber))
                    yield return new ValidationResult("Numărul împuternicirii este obligatoriu",
                        new[] { nameof(AuthorizationNumber) });
                
                if (!AuthorizationDate.HasValue)
                    yield return new ValidationResult("Data împuternicirii este obligatorie",
                        new[] { nameof(AuthorizationDate) });
                
                if (string.IsNullOrEmpty(BeneficiaryIdnp))
                    yield return new ValidationResult("IDNP-ul beneficiarului este obligatoriu",
                        new[] { nameof(BeneficiaryIdnp) });
            }
        }
    }
}
```

## Integrare cu FODInputRadioOnBehalfOf

Componenta folosește intern două instanțe de `FODInputRadioOnBehalfOf`:

```razor
<FODInputRadioOnBehalfOf Disable="@Disable" 
                         Label="@OnBehalfOfFirstOptionText" 
                         Item="@(new SelectableItem<OnBehalfOnEnum>(OnBehalfOnEnum.Personal))" 
                         T="OnBehalfOnEnum" />

<FODInputRadioOnBehalfOf Disable="@Disable" 
                         Label="@OnBehalfOfSecondOptionText" 
                         Item="@(new SelectableItem<OnBehalfOnEnum>(OnBehalfOnEnum.MPowerAuthorization))" 
                         T="OnBehalfOnEnum" />
```

## Stilizare

### Stiluri Standard

```css
/* Grup radio pentru on behalf of */
.fod-onbehalf-group {
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1rem;
    background-color: #f8f9fa;
}

/* Highlight pentru MPower */
.form-check:has(input[value="MPowerAuthorization"]) {
    background-color: #e7f3ff;
    padding: 0.5rem;
    border-radius: 4px;
    margin-top: 0.5rem;
}

/* Icon pentru MPower */
.form-check-label:contains("MPower")::before {
    content: "🔐 ";
    margin-right: 4px;
}
```

### Teme pentru Contexte Diferite

```css
/* Temă pentru servicii guvernamentale */
.gov-theme .fod-onbehalf-group {
    background: linear-gradient(to right, #f0f4f8, #e6ecf1);
    border-color: #0056b3;
}

/* Evidențiere opțiune recomandată */
.recommended-option {
    position: relative;
}

.recommended-option::after {
    content: "Recomandat";
    position: absolute;
    top: -10px;
    right: 0;
    background: #28a745;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
}
```

## Best Practices

1. **Etichete clare** - Explicați diferența între personal și MPower
2. **Validare MPower** - Verificați împuternicirea înainte de submit
3. **Feedback vizual** - Arătați clar modul selectat
4. **Ghidare utilizator** - Oferiți informații despre MPower când e selectat
5. **Fallback** - Gestionați cazul când MPower nu e disponibil

## Accesibilitate

- Label-uri descriptive pentru fiecare opțiune
- Suport complet pentru keyboard navigation
- ARIA labels pentru screen readers
- Focus vizibil pentru navigare

## Integrare cu MPower

```csharp
// Service pentru verificare împuterniciri
public interface IMPowerService
{
    Task<List<MPowerAuthorization>> GetUserAuthorizations();
    Task<bool> ValidateAuthorization(string authorizationId);
    Task<BeneficiaryInfo> GetBeneficiaryInfo(string authorizationId);
}

// Utilizare în componentă
@inject IMPowerService MPowerService

private async Task ValidateMPowerSelection()
{
    if (selectedMode == OnBehalfOnEnum.MPowerAuthorization)
    {
        var isValid = await MPowerService.ValidateAuthorization(authorizationId);
        if (!isValid)
        {
            // Handle invalid authorization
        }
    }
}
```

## Limitări

- Suportă doar două opțiuni (Personal/MPower)
- Nu permite customizare completă a opțiunilor
- Dependent de enum OnBehalfOnEnum

## Concluzie

FODInputOnBehalfOfRadioGroup este o componentă esențială pentru aplicațiile guvernamentale care necesită distincția între acțiuni personale și cele efectuate în numele altcuiva prin sistemul MPower. Oferă o interfață clară și consistentă pentru această selecție importantă.