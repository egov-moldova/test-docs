# FodWizardStep

## Documentație pentru componenta FodWizardStep

### 1. Descriere Generală

`FodWizardStep` reprezintă un pas individual într-un wizard `FodWizard`. Componenta gestionează validarea formularelor, navigarea între pași și afișarea conținutului specific fiecărui pas, oferind o experiență ghidată pentru completarea proceselor multi-pas.

Caracteristici principale:
- Validare automată cu EditContext
- Navigare personalizabilă înainte/înapoi
- Pași opționali
- Evenimente pentru activare și tranziții
- Suport pentru iconițe distinctive
- Gestionare multiple EditContext
- Control granular asupra navigării
- Integrare completă cu FodWizard

### 2. Utilizare de Bază

#### Wizard simplu cu pași
```razor
<FodWizard>
    <FodWizardStep Name="Date personale">
        <FodTextField @bind-Value="model.FirstName" Label="Prenume" Required="true" />
        <FodTextField @bind-Value="model.LastName" Label="Nume" Required="true" />
        <FodDatePicker @bind-Value="model.BirthDate" Label="Data nașterii" />
    </FodWizardStep>
    
    <FodWizardStep Name="Date de contact">
        <FodTextField @bind-Value="model.Email" Label="Email" Type="email" />
        <FodTextField @bind-Value="model.Phone" Label="Telefon" />
    </FodWizardStep>
    
    <FodWizardStep Name="Confirmare">
        <h4>Verificați datele introduse:</h4>
        <p>Nume: @model.FirstName @model.LastName</p>
        <p>Email: @model.Email</p>
    </FodWizardStep>
</FodWizard>

@code {
    private UserModel model = new();
}
```

#### Pași cu validare EditForm
```razor
<FodWizard>
    <FodWizardStep Name="Informații generale" EditContext="editContext1">
        <EditForm EditContext="editContext1">
            <DataAnnotationsValidator />
            <ValidationSummary />
            
            <FodTextField @bind-Value="model.CompanyName" 
                          Label="Numele companiei" 
                          Required="true" />
            <FodTextField @bind-Value="model.TaxId" 
                          Label="Cod fiscal" 
                          Required="true" />
        </EditForm>
    </FodWizardStep>
    
    <FodWizardStep Name="Adresă" EditContext="editContext2">
        <EditForm EditContext="editContext2">
            <DataAnnotationsValidator />
            <ValidationSummary />
            
            <FodTextField @bind-Value="model.Street" Label="Stradă" />
            <FodTextField @bind-Value="model.City" Label="Oraș" />
        </EditForm>
    </FodWizardStep>
</FodWizard>

@code {
    private CompanyModel model = new();
    private EditContext editContext1;
    private EditContext editContext2;
    
    protected override void OnInitialized()
    {
        editContext1 = new EditContext(model);
        editContext2 = new EditContext(model);
    }
}
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Name` | `string` | Numele pasului afișat în wizard | - |
| `Icon` | `string` | Iconiță pentru pas | - |
| `Step` | `int` | Numărul pasului | - |
| `Optional` | `bool` | Marchează pasul ca opțional | `false` |
| `ShowTitle` | `bool` | Afișează titlul pasului | `false` |
| `ValidateEditContextsOnNext` | `bool` | Validează toate EditContext la Next | `true` |
| `CanGoBack` | `bool` | Permite navigarea înapoi | `true` |
| `CanGoNext` | `bool` | Permite navigarea înainte | `true` |
| `NextButtonText` | `string` | Text personalizat pentru butonul Next | - |
| `BackButtonText` | `string` | Text personalizat pentru butonul Back | - |
| `EditContext` | `EditContext` | Context principal pentru validare | - |
| `OnNext` | `Func<Task<bool>>` | Callback înainte de următorul pas | - |
| `OnBack` | `Func<Task<bool>>` | Callback înainte de pasul anterior | - |
| `OnActivate` | `Func<Task>` | Callback la activarea pasului | - |
| `NextStep` | `Func<int>` | Determină următorul pas dinamic | - |
| `BackStep` | `Func<int>` | Determină pasul anterior dinamic | - |
| `ChildContent` | `RenderFragment` | Conținutul pasului | - |

### 4. Metode Publice

| Metodă | Descriere |
|---------|-----------|
| `RegisterEditContext(EditContext)` | Înregistrează un EditContext pentru validare |
| `Validate()` | Validează toate EditContext înregistrate |

### 5. Exemple Avansate

#### Wizard cu validare complexă
```razor
<FodWizard @ref="wizard">
    <FodWizardStep Name="Date client" Icon="@FodIcons.Material.Filled.Person">
        <CascadingValue Value="@currentStep" Name="WizardStep">
            <EditForm EditContext="clientContext" OnValidSubmit="SaveClient">
                <DataAnnotationsValidator />
                <ValidationSummary />
                
                <FodTextField @bind-Value="client.Name" 
                              Label="Nume complet" 
                              Required="true" />
                <FodTextField @bind-Value="client.Idnp" 
                              Label="IDNP" 
                              Required="true"
                              MaxLength="13" />
                
                <FodButton Type="submit" Style="display: none;">Submit</FodButton>
            </EditForm>
        </CascadingValue>
    </FodWizardStep>
    
    <FodWizardStep Name="Servicii" 
                   Icon="@FodIcons.Material.Filled.ShoppingCart"
                   OnNext="ValidateServices">
        <h4>Selectați serviciile dorite:</h4>
        @foreach (var service in availableServices)
        {
            <FodCheckbox @bind-Checked="service.Selected" 
                         Label="@($"{service.Name} - {service.Price} MDL")" />
        }
        
        @if (!selectedServices.Any())
        {
            <FodAlert Severity="FodSeverity.Warning">
                Selectați cel puțin un serviciu
            </FodAlert>
        }
    </FodWizardStep>
    
    <FodWizardStep Name="Plată" 
                   Icon="@FodIcons.Material.Filled.Payment"
                   Optional="@(totalAmount == 0)">
        <h4>Detalii plată</h4>
        <FodText>Total de plată: @totalAmount MDL</FodText>
        
        <FodRadioGroup @bind-SelectedOption="paymentMethod">
            <FodRadio Option="@("card")">Card bancar</FodRadio>
            <FodRadio Option="@("cash")">Numerar</FodRadio>
            <FodRadio Option="@("transfer")">Transfer bancar</FodRadio>
        </FodRadioGroup>
    </FodWizardStep>
</FodWizard>

@code {
    private FodWizard wizard;
    private FodWizardStep currentStep;
    private ClientModel client = new();
    private EditContext clientContext;
    private List<ServiceItem> availableServices = new();
    private string paymentMethod = "card";
    
    private IEnumerable<ServiceItem> selectedServices => 
        availableServices.Where(s => s.Selected);
    
    private decimal totalAmount => 
        selectedServices.Sum(s => s.Price);
    
    protected override void OnInitialized()
    {
        clientContext = new EditContext(client);
        currentStep?.RegisterEditContext(clientContext);
    }
    
    private async Task<bool> ValidateServices()
    {
        if (!selectedServices.Any())
        {
            await ShowNotification("Selectați cel puțin un serviciu", FodSeverity.Error);
            return false;
        }
        return true;
    }
    
    private void SaveClient()
    {
        // Salvare date client
    }
}
```

#### Wizard cu navigare condiționată
```razor
<FodWizard>
    <FodWizardStep Name="Tip persoană" 
                   Icon="@FodIcons.Material.Filled.Category">
        <FodRadioGroup @bind-SelectedOption="personType">
            <FodRadio Option="@("individual")">Persoană fizică</FodRadio>
            <FodRadio Option="@("company")">Persoană juridică</FodRadio>
        </FodRadioGroup>
    </FodWizardStep>
    
    <FodWizardStep Name="Date individuale" 
                   Icon="@FodIcons.Material.Filled.Person"
                   NextStep="@(() => personType == "individual" ? 3 : 2)">
        @if (personType == "individual")
        {
            <FodTextField @bind-Value="individual.FirstName" Label="Prenume" />
            <FodTextField @bind-Value="individual.LastName" Label="Nume" />
            <FodTextField @bind-Value="individual.Idnp" Label="IDNP" />
        }
    </FodWizardStep>
    
    <FodWizardStep Name="Date companie" 
                   Icon="@FodIcons.Material.Filled.Business">
        @if (personType == "company")
        {
            <FodTextField @bind-Value="company.Name" Label="Denumire" />
            <FodTextField @bind-Value="company.Idno" Label="IDNO" />
            <FodTextField @bind-Value="company.VatNumber" Label="Cod TVA" />
        }
    </FodWizardStep>
    
    <FodWizardStep Name="Rezumat">
        <h4>Date introduse:</h4>
        @if (personType == "individual")
        {
            <p>Persoană fizică: @individual.FirstName @individual.LastName</p>
        }
        else
        {
            <p>Persoană juridică: @company.Name</p>
        }
    </FodWizardStep>
</FodWizard>

@code {
    private string personType = "individual";
    private IndividualModel individual = new();
    private CompanyModel company = new();
}
```

#### Wizard cu activare asincronă
```razor
<FodWizard>
    <FodWizardStep Name="Selectare serviciu" 
                   Icon="@FodIcons.Material.Filled.Apps">
        <FodSelect @bind-Value="selectedServiceId" Label="Serviciu">
            @foreach (var service in services)
            {
                <FodSelectItem Value="@service.Id">@service.Name</FodSelectItem>
            }
        </FodSelect>
    </FodWizardStep>
    
    <FodWizardStep Name="Configurare" 
                   Icon="@FodIcons.Material.Filled.Settings"
                   OnActivate="LoadServiceConfiguration">
        @if (isLoading)
        {
            <FodLoadingLinear />
        }
        else if (configuration != null)
        {
            <h4>Configurare @configuration.ServiceName</h4>
            @foreach (var param in configuration.Parameters)
            {
                <FodTextField @bind-Value="param.Value" 
                              Label="@param.Label" 
                              HelperText="@param.Description" />
            }
        }
    </FodWizardStep>
    
    <FodWizardStep Name="Previzualizare" 
                   Icon="@FodIcons.Material.Filled.Preview"
                   OnActivate="GeneratePreview">
        @if (preview != null)
        {
            <FodCard>
                <FodCardContent>
                    @((MarkupString)preview.Html)
                </FodCardContent>
            </FodCard>
        }
    </FodWizardStep>
</FodWizard>

@code {
    private int selectedServiceId;
    private ServiceConfiguration configuration;
    private PreviewResult preview;
    private bool isLoading;
    
    private async Task LoadServiceConfiguration()
    {
        isLoading = true;
        configuration = await ServiceApi.GetConfiguration(selectedServiceId);
        isLoading = false;
    }
    
    private async Task GeneratePreview()
    {
        preview = await ServiceApi.GeneratePreview(configuration);
    }
}
```

#### Wizard cu pași multipli EditContext
```razor
<FodWizard>
    <FodWizardStep Name="Date principale" @ref="mainDataStep">
        <EditForm EditContext="mainContext">
            <DataAnnotationsValidator />
            <FodTextField @bind-Value="mainData.Title" Label="Titlu" />
        </EditForm>
        
        <EditForm EditContext="detailsContext">
            <DataAnnotationsValidator />
            <FodTextArea @bind-Value="details.Description" Label="Descriere" />
        </EditForm>
        
        <EditForm EditContext="settingsContext">
            <DataAnnotationsValidator />
            <FodCheckbox @bind-Checked="settings.IsPublic" Label="Public" />
        </EditForm>
    </FodWizardStep>
</FodWizard>

@code {
    private FodWizardStep mainDataStep;
    private MainData mainData = new();
    private Details details = new();
    private Settings settings = new();
    
    private EditContext mainContext;
    private EditContext detailsContext;
    private EditContext settingsContext;
    
    protected override void OnAfterRender(bool firstRender)
    {
        if (firstRender)
        {
            mainDataStep.RegisterEditContext(mainContext);
            mainDataStep.RegisterEditContext(detailsContext);
            mainDataStep.RegisterEditContext(settingsContext);
        }
    }
}
```

### 6. Integrare cu Formulare

#### Cu validare server-side
```razor
<FodWizard>
    <FodWizardStep Name="Date formular" 
                   OnNext="ValidateWithServer">
        <EditForm EditContext="editContext">
            <DataAnnotationsValidator />
            <ServerValidator @ref="serverValidator" />
            <ValidationSummary />
            
            <FodTextField @bind-Value="model.Username" 
                          Label="Nume utilizator" />
            <FodTextField @bind-Value="model.Email" 
                          Label="Email" 
                          Type="email" />
        </EditForm>
    </FodWizardStep>
</FodWizard>

@code {
    private ServerValidator serverValidator;
    
    private async Task<bool> ValidateWithServer()
    {
        var result = await UserApi.ValidateData(model);
        if (!result.IsValid)
        {
            serverValidator.DisplayErrors(result.Errors);
            return false;
        }
        return true;
    }
}
```

### 7. Stilizare și Teme

```css
/* Pas activ personalizat */
.wizard-steps .nav-link.active {
    background-color: var(--fod-palette-primary-main);
    color: white;
    font-weight: 600;
}

/* Iconițe colorate pentru pași */
.wizard-step-icon {
    color: var(--fod-palette-primary-light);
    margin-right: 8px;
}

/* Pas opțional cu stil distinct */
.wizard-step-optional {
    font-style: italic;
    opacity: 0.8;
}

/* Animație tranziție între pași */
.wizard-content {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
}
```

### 8. Scenarii Comune

#### Wizard pentru înregistrare
```razor
<FodWizard Title="Înregistrare cont nou">
    <FodWizardStep Name="Tip cont" Icon="@FodIcons.Material.Filled.AccountBox">
        <FodRadioGroup @bind-SelectedOption="accountType">
            <FodRadio Option="@("personal")">Cont personal</FodRadio>
            <FodRadio Option="@("business")">Cont business</FodRadio>
        </FodRadioGroup>
    </FodWizardStep>
    
    <FodWizardStep Name="Date de autentificare" 
                   Icon="@FodIcons.Material.Filled.Security"
                   ValidateEditContextsOnNext="true">
        <EditForm Model="credentials" OnValidSubmit="CheckUsername">
            <DataAnnotationsValidator />
            <ValidationSummary />
            
            <FodTextField @bind-Value="credentials.Username" 
                          Label="Nume utilizator" 
                          Required="true"
                          HelperText="Minim 3 caractere" />
            
            <FodTextField @bind-Value="credentials.Password" 
                          Label="Parolă" 
                          Type="password"
                          Required="true" />
            
            <FodTextField @bind-Value="credentials.ConfirmPassword" 
                          Label="Confirmă parola" 
                          Type="password"
                          Required="true" />
        </EditForm>
    </FodWizardStep>
    
    <FodWizardStep Name="Verificare email" 
                   Icon="@FodIcons.Material.Filled.Email"
                   OnActivate="SendVerificationCode">
        <FodTextField @bind-Value="email" 
                      Label="Adresă email" 
                      Type="email" />
        
        <FodTextField @bind-Value="verificationCode" 
                      Label="Cod verificare"
                      HelperText="Verificați email-ul pentru cod" />
        
        <FodButton OnClick="ResendCode" 
                   Variant="FodVariant.Text"
                   Size="FodSize.Small">
            Retrimite cod
        </FodButton>
    </FodWizardStep>
    
    <FodWizardStep Name="Finalizare" 
                   Icon="@FodIcons.Material.Filled.CheckCircle"
                   NextButtonText="Creează cont">
        <FodAlert Severity="FodSeverity.Success">
            Contul dvs. este gata de creare!
        </FodAlert>
        
        <h4>Rezumat:</h4>
        <p>Tip cont: @accountType</p>
        <p>Utilizator: @credentials.Username</p>
        <p>Email: @email</p>
        
        <FodCheckbox @bind-Checked="acceptTerms" 
                     Label="Accept termenii și condițiile" />
    </FodWizardStep>
</FodWizard>
```

### 9. Best Practices

1. **Validare progresivă** - Validați fiecare pas înainte de continuare
2. **Feedback clar** - Afișați erori și mesaje de succes
3. **Pași opționali** - Marcați clar pașii care pot fi omiși
4. **Salvare progres** - Salvați datele pentru a permite revenire
5. **Indicatori vizuali** - Folosiți iconițe pentru claritate
6. **Navigare intuitivă** - Permiteți navigare înapoi când e posibil

### 10. Performanță

- Încărcați date asincron în OnActivate
- Evitați validări costisitoare pe fiecare tastare
- Folosiți lazy loading pentru conținut complex
- Cache-uiți datele între pași când e posibil

### 11. Accesibilitate

- Pașii sunt marcați cu ARIA labels
- Navigarea cu tastatura este suportată
- Mesajele de eroare sunt anunțate de screen readers
- Focus management între pași

### 12. Troubleshooting

#### Validarea nu funcționează
- Verificați că EditContext este setat corect
- Verificați ValidateEditContextsOnNext="true"
- Asigurați-vă că RegisterEditContext este apelat

#### Navigarea nu funcționează
- Verificați că FodWizard conține pașii
- Verificați valorile CanGoNext/CanGoBack
- Verificați că OnNext returnează true

#### Conținutul nu se afișează
- Verificați că pasul este activ
- Verificați ierarhia CascadingValue
- Verificați că ChildContent este definit

### 13. Concluzie

`FodWizardStep` oferă o structură flexibilă pentru crearea de procese ghidate în aplicațiile FOD. Cu suport pentru validare complexă, navigare condiționată și integrare completă cu sistemul de formulare Blazor, componenta facilitează implementarea wizard-urilor intuitive și robuste.