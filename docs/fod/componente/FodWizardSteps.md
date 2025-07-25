# FodWizardSteps

## Documentație pentru componenta FodWizardSteps

### 1. Descriere Generală

`FodWizardSteps` este o componentă wizard avansată cu navigare laterală și indicator de progres circular. Oferă o interfață complexă pentru procese multi-pas cu sidebar de navigare, validare per pas și control avansat al fluxului.

Caracteristici principale:
- Sidebar cu lista pașilor și progres vizual
- Indicator circular de progres
- Navigare înainte/înapoi cu validare
- Suport pentru callback-uri per pas
- Blocare UI în timpul procesării
- Layout responsive cu sidebar colapsabil
- Integrare cu FodWizard_Step

### 2. Utilizare de Bază

#### Wizard simplu cu progres
```razor
<FodWizardSteps ShowProgress="true">
    <FodWizard_Step Name="Date personale" Icon="@FodIcons.Material.Filled.Person">
        <FodTextField Label="Nume" @bind-Value="model.Name" />
        <FodTextField Label="Email" @bind-Value="model.Email" />
    </FodWizard_Step>
    
    <FodWizard_Step Name="Adresă" Icon="@FodIcons.Material.Filled.Home">
        <FodTextField Label="Stradă" @bind-Value="model.Street" />
        <FodTextField Label="Oraș" @bind-Value="model.City" />
    </FodWizard_Step>
    
    <FodWizard_Step Name="Confirmare" Icon="@FodIcons.Material.Filled.Check">
        <h4>Verificați datele:</h4>
        <p>Nume: @model.Name</p>
        <p>Email: @model.Email</p>
    </FodWizard_Step>
</FodWizardSteps>
```

### 3. Parametri

| Parametru | Tip | Descriere | Valoare Implicită |
|-----------|-----|-----------|-------------------|
| `ShowProgress` | `bool` | Afișează sidebar cu progres | `false` |
| `Enabled` | `bool` | Activează navigarea în sidebar | `false` |
| `ChildContent` | `RenderFragment` | Pașii wizard (FodWizard_Step) | - |
| `ActiveStep` | `FodWizard_Step` | Pasul activ curent | - |
| `InitialStep` | `int` | Indexul pasului inițial | `0` |
| `ActiveStepIx` | `int` | Index pas activ | - |

### 4. Proprietăți și Metode Publice

- `Steps` - Lista tuturor pașilor
- `PassedSteps` - Lista pașilor parcurși
- `IsLastStep` - Indică dacă e ultimul pas
- `GoToStep(int step)` - Navighează la un pas specific
- `GoNext()` - Mergi la următorul pas
- `GoBack()` - Mergi la pasul anterior
- `Cancel()` - Revino la primul pas

### 5. Exemple Avansate

#### Wizard cu validare și callback-uri
```razor
<FodWizardSteps ShowProgress="true" @ref="wizardSteps">
    <FodWizard_Step Name="Selectare serviciu" 
                    Icon="@FodIcons.Material.Filled.Category"
                    OnNext="ValidateServiceSelection"
                    OnActivate="LoadServices">
        <FodSelect T="string" @bind-Value="selectedService" 
                   Label="Tip serviciu"
                   Required="true">
            @foreach (var service in availableServices)
            {
                <FodSelectItem Value="@service.Code">@service.Name</FodSelectItem>
            }
        </FodSelect>
    </FodWizard_Step>
    
    <FodWizard_Step Name="Detalii cerere" 
                    Icon="@FodIcons.Material.Filled.Description"
                    OnNext="ValidateRequestDetails"
                    CanGoBack="true">
        <DynamicFormForService ServiceCode="@selectedService" />
    </FodWizard_Step>
    
    <FodWizard_Step Name="Încărcare documente" 
                    Icon="@FodIcons.Material.Filled.AttachFile"
                    OnNext="ValidateDocuments"
                    OnBack="SaveDraftDocuments">
        <FodInputFile Multiple="true" 
                      Accept=".pdf,.doc,.docx"
                      OnChange="HandleFileUpload" />
        <FileList Model="@uploadedFiles" />
    </FodWizard_Step>
    
    <FodWizard_Step Name="Plată" 
                    Icon="@FodIcons.Material.Filled.Payment"
                    NextButtonText="Finalizează și plătește"
                    OnNext="ProcessPayment">
        <PaymentForm Amount="@calculatedAmount" />
    </FodWizard_Step>
</FodWizardSteps>

@code {
    private FodWizardSteps wizardSteps;
    private string selectedService;
    private List<Service> availableServices;
    private decimal calculatedAmount;
    
    private async Task LoadServices()
    {
        availableServices = await ServiceApi.GetAvailableServices();
    }
    
    private async Task<bool> ValidateServiceSelection()
    {
        if (string.IsNullOrEmpty(selectedService))
        {
            await NotificationService.ShowError("Selectați un serviciu!");
            return false;
        }
        
        // Calculează costul
        calculatedAmount = await CostService.Calculate(selectedService);
        return true;
    }
    
    private async Task<bool> ProcessPayment()
    {
        try
        {
            var result = await PaymentService.Process(calculatedAmount);
            if (result.Success)
            {
                await NotificationService.ShowSuccess("Plată procesată!");
                return true;
            }
        }
        catch (Exception ex)
        {
            await NotificationService.ShowError($"Eroare: {ex.Message}");
        }
        return false;
    }
}
```

#### Wizard cu navigare condiționată
```razor
<FodWizardSteps ShowProgress="true" Enabled="false">
    <FodWizard_Step Name="Tip persoană" 
                    NextStep="@GetNextStepAfterPersonType">
        <FodRadioGroup @bind-Value="personType">
            <FodRadio Value="@("individual")">Persoană fizică</FodRadio>
            <FodRadio Value="@("company")">Persoană juridică</FodRadio>
        </FodRadioGroup>
    </FodWizard_Step>
    
    <!-- Pas doar pentru persoane fizice -->
    <FodWizard_Step Name="Date personale" 
                    Step="2"
                    @key="individual-step">
        <IndividualDataForm />
    </FodWizard_Step>
    
    <!-- Pas doar pentru persoane juridice -->
    <FodWizard_Step Name="Date companie" 
                    Step="3"
                    @key="company-step">
        <CompanyDataForm />
    </FodWizard_Step>
    
    <!-- Pas comun -->
    <FodWizard_Step Name="Contact" Step="4">
        <ContactForm />
    </FodWizard_Step>
</FodWizardSteps>

@code {
    private string personType = "individual";
    
    private int GetNextStepAfterPersonType()
    {
        return personType == "individual" ? 2 : 3;
    }
}
```

### 6. Stilizare și Layout

```css
/* Sidebar styling */
.fod-wizard-steps .bg-white.bg-gradient {
    background: linear-gradient(to bottom, #ffffff, #f8f9fa) !important;
    border-right: 1px solid var(--fod-palette-divider);
}

/* Nav items */
.fod-wizard-steps .nav-pills .nav-item {
    margin-bottom: 0.5rem;
}

.fod-wizard-steps .nav-link {
    border-radius: 0.25rem;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.fod-wizard-steps .nav-link.active {
    background-color: steelblue !important;
    color: white !important;
}

.fod-wizard-steps .nav-link:hover:not(.active) {
    background-color: rgba(70, 130, 180, 0.1);
}

/* Content area */
.fod-wizard-steps .wizard-content {
    padding: 2rem;
    min-height: 400px;
    position: relative;
}

/* Progress indicator */
.fod-wizard-loading-circle {
    margin-top: 2rem;
}

/* Buttons */
.fod-wizard-buttons {
    padding: 1rem 2rem;
    border-top: 1px solid var(--fod-palette-divider);
    background-color: #f8f9fa;
}

/* Responsive */
@media (max-width: 768px) {
    .fod-wizard-steps .col-auto {
        min-width: 200px !important;
    }
    
    .fod-wizard-buttons {
        margin-left: 0 !important;
    }
}
```

### 7. Integrare cu FodWizard_Step

```razor
<FodWizard_Step Name="Configurare avansată" 
                Icon="@FodIcons.Material.Filled.Settings"
                Color="FodColor.Primary"
                Size="FodSize.Large"
                OnNext="@ValidateConfiguration"
                OnBack="@SaveDraft"
                OnActivate="@LoadConfiguration"
                NextButtonText="Salvează configurația"
                BackButtonText="Înapoi la bază"
                CanGoBack="true">
    <!-- Conținut pas -->
</FodWizard_Step>
```

### 8. Scenarii de Utilizare

#### Proces de înregistrare complex
```razor
@page "/registration"

<FodWizardSteps @ref="registrationWizard" 
                ShowProgress="true"
                InitialStep="@GetInitialStep()">
    @foreach (var stepConfig in registrationSteps)
    {
        <FodWizard_Step Name="@stepConfig.Name" 
                        Icon="@stepConfig.Icon"
                        OnNext="@stepConfig.Validator">
            <DynamicComponent Type="@stepConfig.ComponentType" 
                              Parameters="@stepConfig.Parameters" />
        </FodWizard_Step>
    }
</FodWizardSteps>

@code {
    private FodWizardSteps registrationWizard;
    private List<StepConfiguration> registrationSteps;
    
    private int GetInitialStep()
    {
        // Verifică dacă utilizatorul are date salvate
        var savedStep = LocalStorage.GetItem<int>("registration-step");
        return savedStep > 0 ? savedStep : 0;
    }
    
    protected override void OnInitialized()
    {
        registrationSteps = new List<StepConfiguration>
        {
            new() { 
                Name = "Tip cont", 
                Icon = FodIcons.Material.Filled.AccountBox,
                ComponentType = typeof(AccountTypeSelector),
                Validator = ValidateAccountType
            },
            // alte pași...
        };
    }
}
```

### 9. Best Practices

1. **Validare per pas** - Implementați OnNext pentru validare
2. **Salvare progres** - Salvați starea pentru revenire
3. **Loading states** - Folosiți OnActivate pentru încărcare date
4. **Error handling** - Tratați erorile în callback-uri
5. **Navigare clară** - Folosiți nume descriptive pentru pași
6. **Responsive design** - Testați pe ecrane mici

### 10. Performanță

- Lazy loading pentru conținut pași
- Evitați re-randări prin folosirea @key
- Cache date între pași când e posibil
- Minimizați validările asincrone

### 11. Accesibilitate

- Focus management automat între pași
- ARIA labels pentru navigare
- Suport keyboard pentru Next/Previous
- Anunță progresul pentru screen readers

### 12. Diferențe față de FodWizard

| Caracteristică | FodWizard | FodWizardSteps |
|----------------|-----------|----------------|
| Layout | Inline/Tab-based | Sidebar navigation |
| Progress indicator | Linear | Circular + sidebar |
| Visual complexity | Simplu | Complex |
| Space usage | Compact | Necesită mai mult spațiu |
| Use case | Formulare simple | Procese complexe |

### 13. Troubleshooting

#### Sidebar nu apare
- Verificați `ShowProgress="true"`
- Verificați că există cel puțin 2 pași
- Verificați CSS pentru `.bg-white`

#### Navigarea nu funcționează
- Verificați callback-urile OnNext
- Asigurați-vă că returnează `true`
- Verificați consolă pentru erori

#### Layout rupt pe mobile
- Ajustați min-width pentru sidebar
- Considerați ascunderea sidebar-ului
- Folosiți FodWizard pentru mobile

### 14. Extensibilitate

```razor
@* ExtendedWizardSteps.razor *@
@inherits FodWizardSteps

<div class="extended-wizard-steps">
    @if (ShowProgressBar)
    {
        <FodLoadingLinear Value="@((ActiveStepIx + 1) * 100 / Steps.Count)" />
    }
    
    <base />
    
    @if (ShowStepSummary)
    {
        <div class="step-summary">
            Pas @(ActiveStepIx + 1) din @Steps.Count
        </div>
    }
</div>

@code {
    [Parameter] public bool ShowProgressBar { get; set; }
    [Parameter] public bool ShowStepSummary { get; set; }
}
```

### 15. Concluzie

`FodWizardSteps` oferă o experiență wizard avansată cu navigare laterală și feedback vizual bogat. Ideal pentru procese complexe care necesită ghidare clară și validare strictă, componenta combină funcționalitate robustă cu design modern pentru a crea fluxuri intuitive și eficiente.