# FodInlineCheckbox

## Documentație pentru componenta FodInlineCheckbox

### 1. Descriere Generală

`FodInlineCheckbox` este o componentă specializată pentru afișarea unui checkbox într-un format inline, cu eticheta poziționată lângă checkbox. Moștenește din `FODFormComponent<bool>` și oferă suport complet pentru formulare Blazor cu validare.

Caracteristici principale:
- Layout inline cu etichetă alături de checkbox
- Suport pentru atributul Display din DataAnnotations
- Indicare automată a câmpurilor obligatorii
- Integrare completă cu EditForm și validare
- Suport pentru diferite tipuri de checkbox (checkbox/switch)
- Conversie automată din diferite tipuri (bool, int, string)
- Localizare automată prin atributul Display

### 2. Utilizare de Bază

#### Checkbox inline simplu
```razor
<EditForm Model="@model">
    <FodInlineCheckbox @bind-Value="model.AcceptTerms" 
                       Label="Accept termenii și condițiile" />
</EditForm>

@code {
    private FormModel model = new();
    
    public class FormModel
    {
        public bool AcceptTerms { get; set; }
    }
}
```

#### Cu validare și câmp obligatoriu
```razor
<EditForm Model="@registrationModel" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodInlineCheckbox @bind-Value="registrationModel.AcceptGDPR" 
                       Label="Accept prelucrarea datelor personale" />
    <ValidationMessage For="@(() => registrationModel.AcceptGDPR)" />
    
    <FodInlineCheckbox @bind-Value="registrationModel.ReceiveNewsletter" 
                       Label="Doresc să primesc newsletter" />
    
    <FodButton Type="ButtonType.Submit">Înregistrare</FodButton>
</EditForm>

@code {
    private RegistrationModel registrationModel = new();
    
    public class RegistrationModel
    {
        [Required(ErrorMessage = "Trebuie să acceptați prelucrarea datelor")]
        [Display(Name = "Acord GDPR")]
        public bool AcceptGDPR { get; set; }
        
        [Display(Name = "Newsletter")]
        public bool ReceiveNewsletter { get; set; }
    }
}
```

#### Tip switch
```razor
<FodInlineCheckbox @bind-Value="settings.EnableNotifications" 
                   Label="Activează notificările"
                   Type="FodCheckboxType.Switch" />
```

### 3. Atribute și Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `bool` | Valoarea checkbox-ului (binding) | `false` |
| `Label` | `string` | Eticheta afișată lângă checkbox | - |
| `Type` | `FodCheckboxType` | Tipul checkbox-ului (Checkbox/Switch) | `Checkbox` |
| `Readonly` | `bool` | Dezactivează checkbox-ul | `false` |
| `Id` | `string` | ID-ul HTML al elementului | - |
| `OnValueChanged` | `EventCallback<bool>` | Eveniment la schimbarea valorii | - |

### 4. Exemple de Utilizare

#### Formular de preferințe
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Preferințe comunicare
        </FodText>
        
        <EditForm Model="@preferences">
            <FodInlineCheckbox @bind-Value="preferences.EmailNotifications" 
                               Label="Notificări prin email" />
            
            <FodInlineCheckbox @bind-Value="preferences.SmsNotifications" 
                               Label="Notificări prin SMS" />
            
            <FodInlineCheckbox @bind-Value="preferences.MarketingEmails" 
                               Label="Comunicări de marketing" />
            
            <div class="mt-3">
                <FodButton OnClick="SavePreferences" Color="FodColor.Primary">
                    Salvează preferințele
                </FodButton>
            </div>
        </EditForm>
    </FodCardContent>
</FodCard>

@code {
    private UserPreferences preferences = new();
    
    private async Task SavePreferences()
    {
        await PreferencesService.SaveAsync(preferences);
        NotificationService.ShowSuccess("Preferințele au fost salvate");
    }
}
```

#### Listă de task-uri
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Task-uri de completat
        </FodText>
        
        @foreach (var task in tasks)
        {
            <FodInlineCheckbox Value="task.IsCompleted"
                               Label="@task.Description"
                               OnValueChanged="@(value => UpdateTask(task, value))" />
        }
        
        <FodDivider Class="my-3" />
        
        <FodText Typo="Typo.body2" Color="FodColor.Secondary">
            Completate: @tasks.Count(t => t.IsCompleted) din @tasks.Count
        </FodText>
    </FodCardContent>
</FodCard>

@code {
    private List<TodoTask> tasks = new()
    {
        new() { Id = 1, Description = "Verifică emailurile" },
        new() { Id = 2, Description = "Actualizează documentația" },
        new() { Id = 3, Description = "Revizuiește codul" }
    };
    
    private async Task UpdateTask(TodoTask task, bool isCompleted)
    {
        task.IsCompleted = isCompleted;
        await TaskService.UpdateAsync(task);
    }
    
    private class TodoTask
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
    }
}
```

#### Acord și termeni
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Finalizare comandă
        </FodText>
        
        <EditForm Model="@orderModel" OnValidSubmit="PlaceOrder">
            <DataAnnotationsValidator />
            
            <!-- Detalii comandă -->
            <div class="order-summary mb-4">
                <!-- ... -->
            </div>
            
            <!-- Acorduri obligatorii -->
            <FodInlineCheckbox @bind-Value="orderModel.AcceptTerms" 
                               Label="Am citit și accept termenii și condițiile" />
            <ValidationMessage For="@(() => orderModel.AcceptTerms)" />
            
            <FodInlineCheckbox @bind-Value="orderModel.AcceptReturn" 
                               Label="Am înțeles politica de returnare" />
            <ValidationMessage For="@(() => orderModel.AcceptReturn)" />
            
            <!-- Opționale -->
            <FodDivider Class="my-3" />
            
            <FodInlineCheckbox @bind-Value="orderModel.SaveDetails" 
                               Label="Salvează detaliile pentru comenzi viitoare" />
            
            <FodInlineCheckbox @bind-Value="orderModel.SubscribeOffers" 
                               Label="Doresc să primesc oferte speciale" />
            
            <div class="mt-4">
                <FodButton Type="ButtonType.Submit" 
                           Color="FodColor.Primary"
                           FullWidth="true">
                    Plasează comanda
                </FodButton>
            </div>
        </EditForm>
    </FodCardContent>
</FodCard>

@code {
    private OrderModel orderModel = new();
    
    public class OrderModel
    {
        [Required(ErrorMessage = "Trebuie să acceptați termenii")]
        public bool AcceptTerms { get; set; }
        
        [Required(ErrorMessage = "Trebuie să confirmați înțelegerea politicii")]
        public bool AcceptReturn { get; set; }
        
        public bool SaveDetails { get; set; }
        public bool SubscribeOffers { get; set; }
    }
}
```

#### Setări aplicație cu switch-uri
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Setări aplicație
        </FodText>
        
        <div class="settings-group">
            <FodText Typo="Typo.subtitle1" GutterBottom="true">
                Notificări
            </FodText>
            
            <FodInlineCheckbox @bind-Value="appSettings.PushNotifications" 
                               Label="Notificări push"
                               Type="FodCheckboxType.Switch" />
            
            <FodInlineCheckbox @bind-Value="appSettings.EmailDigest" 
                               Label="Rezumat săptămânal email"
                               Type="FodCheckboxType.Switch" />
            
            <FodInlineCheckbox @bind-Value="appSettings.DesktopNotifications" 
                               Label="Notificări desktop"
                               Type="FodCheckboxType.Switch" />
        </div>
        
        <FodDivider Class="my-3" />
        
        <div class="settings-group">
            <FodText Typo="Typo.subtitle1" GutterBottom="true">
                Confidențialitate
            </FodText>
            
            <FodInlineCheckbox @bind-Value="appSettings.ShareAnalytics" 
                               Label="Partajează date anonime de utilizare"
                               Type="FodCheckboxType.Switch" />
            
            <FodInlineCheckbox @bind-Value="appSettings.PublicProfile" 
                               Label="Profil public"
                               Type="FodCheckboxType.Switch" />
        </div>
    </FodCardContent>
</FodCard>

@code {
    private AppSettings appSettings = new();
}
```

#### Cu localizare și Display attribute
```razor
<EditForm Model="@internationalModel">
    <FodInlineCheckbox @bind-Value="internationalModel.AcceptPolicy" />
    <FodInlineCheckbox @bind-Value="internationalModel.ReceiveUpdates" />
</EditForm>

@code {
    private InternationalModel internationalModel = new();
    
    public class InternationalModel
    {
        [Required]
        [Display(ResourceType = typeof(Resources), Name = "AcceptPolicyLabel")]
        public bool AcceptPolicy { get; set; }
        
        [Display(ResourceType = typeof(Resources), Name = "ReceiveUpdatesLabel")]
        public bool ReceiveUpdates { get; set; }
    }
}
```

### 5. Stilizare

Componenta folosește stilurile standard ale FodCheckbox cu layout inline specific:

```css
/* Personalizare spacing */
.custom-inline-checkbox .d-flex {
    margin-top: 1rem !important;
    margin-bottom: 1rem !important;
}

/* Stil pentru label */
.custom-inline-checkbox label {
    margin-left: 0.5rem;
    cursor: pointer;
}

/* Evidențiere la hover */
.custom-inline-checkbox:hover label {
    color: var(--fod-palette-primary-main);
}

/* Stil pentru câmpuri obligatorii */
.custom-inline-checkbox .text-danger {
    margin-left: 0.25rem;
}
```

### 6. Best Practices

1. **Etichete clare** - Folosiți etichete descriptive care explică clar ce implică selecția
2. **Grupare logică** - Grupați checkbox-urile înrudite vizual
3. **Validare** - Folosiți validare pentru acorduri obligatorii
4. **Feedback vizual** - Oferiți feedback imediat la schimbarea stării
5. **Accesibilitate** - Asigurați-vă că etichetele sunt asociate corect
6. **Stare implicită** - Setați valori implicite logice (de obicei false)

### 7. Integrare cu alte componente

#### În wizard/stepper
```razor
<FodWizard>
    <Steps>
        <!-- ... alte steps ... -->
        
        <FodWizardStep Title="Confirmare">
            <FodInlineCheckbox @bind-Value="confirmData" 
                               Label="Confirm că datele introduse sunt corecte" />
            
            <FodInlineCheckbox @bind-Value="acceptTerms" 
                               Label="Accept termenii serviciului" />
        </FodWizardStep>
    </Steps>
</FodWizard>
```

#### În expansion panels
```razor
<FodExpansionPanels>
    <FodExpansionPanel Text="Preferințe avansate">
        <FodInlineCheckbox @bind-Value="advancedSettings.DebugMode" 
                           Label="Mod debug" />
        
        <FodInlineCheckbox @bind-Value="advancedSettings.BetaFeatures" 
                           Label="Activează funcții beta" />
    </FodExpansionPanel>
</FodExpansionPanels>
```

### 8. Concluzie

`FodInlineCheckbox` oferă o soluție elegantă pentru checkbox-uri cu layout inline, perfectă pentru formulare cu acorduri, preferințe și setări. Cu suport complet pentru validare și localizare, componenta se integrează perfect în ecosistemul FOD Components pentru aplicații enterprise.