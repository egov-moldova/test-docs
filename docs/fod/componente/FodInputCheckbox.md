# FodInputCheckbox

## Descriere Generală

`FodInputCheckbox` este o componentă wrapper pentru checkbox-uri care extinde `FODFormComponent<bool>` și integrează componenta `FodCheckbox` cu sistemul de formulare Blazor. Oferă suport complet pentru validare, layout consistent prin `FODInputWrapper` și poate afișa atât checkbox-uri tradiționale cât și switch-uri.

## Utilizare de Bază

```razor
<!-- Checkbox simplu -->
<FodInputCheckbox @bind-Value="isActive" 
                  Label="Activ" />

<!-- Checkbox tip switch -->
<FodInputCheckbox @bind-Value="enableNotifications" 
                  Label="Activează notificări"
                  Type="FodCheckboxType.Switch" />

<!-- Checkbox readonly -->
<FodInputCheckbox @bind-Value="isConfirmed" 
                  Label="Confirmat"
                  Readonly="true" />
```

## Diferența față de FodCheckbox

| Caracteristică | FodInputCheckbox | FodCheckbox |
|----------------|------------------|-------------|
| Integrare EditForm | Da | Nu |
| FODInputWrapper | Da | Nu |
| Validare | Da | Nu |
| Layout formular | Da | Nu |
| Simplicitate | Nu | Da |

## Atribute și Parametri

| Parametru | Tip | Default | Descriere |
|-----------|-----|---------|-----------|
| Value | bool | false | Valoarea curentă |
| Type | FodCheckboxType | Checkbox | Tipul afișării (Checkbox/Switch) |
| Label | string | null | Eticheta checkbox-ului |
| Readonly | bool | false | Dezactivează checkbox-ul |
| Description | string | null | Descriere pentru tooltip |
| Required | bool? | null | Marchează ca obligatoriu |

## Exemple de Utilizare

### Formular de Setări

```razor
<EditForm Model="@settings" OnValidSubmit="@SaveSettings">
    <DataAnnotationsValidator />
    
    <div class="settings-section">
        <h4>Notificări</h4>
        
        <FodInputCheckbox @bind-Value="settings.EmailNotifications" 
                          Label="Notificări prin email"
                          Description="Primiți actualizări importante prin email" />
        
        <FodInputCheckbox @bind-Value="settings.SmsNotifications" 
                          Label="Notificări SMS"
                          Description="Primiți alerte urgente prin SMS" />
        
        <FodInputCheckbox @bind-Value="settings.PushNotifications" 
                          Label="Notificări push"
                          Type="FodCheckboxType.Switch" />
    </div>
    
    <div class="settings-section">
        <h4>Confidențialitate</h4>
        
        <FodInputCheckbox @bind-Value="settings.PublicProfile" 
                          Label="Profil public"
                          Type="FodCheckboxType.Switch" />
        
        <FodInputCheckbox @bind-Value="settings.ShowEmail" 
                          Label="Afișează email-ul în profil"
                          Readonly="@(!settings.PublicProfile)" />
    </div>
    
    <ValidationSummary />
    <button type="submit" class="btn btn-primary">Salvează setările</button>
</EditForm>

@code {
    private UserSettings settings = new();
    
    public class UserSettings
    {
        public bool EmailNotifications { get; set; } = true;
        public bool SmsNotifications { get; set; }
        public bool PushNotifications { get; set; } = true;
        public bool PublicProfile { get; set; }
        public bool ShowEmail { get; set; }
        
        [Range(typeof(bool), "true", "true", 
               ErrorMessage = "Trebuie să acceptați termenii")]
        public bool AcceptTerms { get; set; }
    }
    
    private async Task SaveSettings()
    {
        await SettingsService.SaveUserSettings(settings);
    }
}
```

### Termeni și Condiții

```razor
<EditForm Model="@registration" OnValidSubmit="@CompleteRegistration">
    <DataAnnotationsValidator />
    
    <div class="mb-3">
        <FodInputCheckbox @bind-Value="registration.AcceptTerms" 
                          Label="Accept termenii și condițiile"
                          Description="Citiți termenii înainte de a accepta" />
    </div>
    
    <div class="mb-3">
        <FodInputCheckbox @bind-Value="registration.AcceptPrivacy" 
                          Label="Accept politica de confidențialitate" />
    </div>
    
    <div class="mb-3">
        <FodInputCheckbox @bind-Value="registration.SubscribeNewsletter" 
                          Label="Doresc să primesc newsletter"
                          Type="FodCheckboxType.Switch" />
    </div>
    
    <ValidationSummary />
    <button type="submit" 
            class="btn btn-primary"
            disabled="@(!registration.AcceptTerms || !registration.AcceptPrivacy)">
        Înregistrare
    </button>
</EditForm>

@code {
    private RegistrationModel registration = new();
    
    public class RegistrationModel
    {
        [Range(typeof(bool), "true", "true", 
               ErrorMessage = "Trebuie să acceptați termenii")]
        public bool AcceptTerms { get; set; }
        
        [Range(typeof(bool), "true", "true", 
               ErrorMessage = "Trebuie să acceptați politica de confidențialitate")]
        public bool AcceptPrivacy { get; set; }
        
        public bool SubscribeNewsletter { get; set; }
    }
}
```

### Filtre Dinamice

```razor
<div class="filters-container">
    <h4>Filtrează rezultatele</h4>
    
    <FodInputCheckbox @bind-Value="filters.ShowActive" 
                      Label="Doar active"
                      @bind-Value:after="ApplyFilters" />
    
    <FodInputCheckbox @bind-Value="filters.ShowCompleted" 
                      Label="Includeți completate"
                      Type="FodCheckboxType.Switch"
                      @bind-Value:after="ApplyFilters" />
    
    <FodInputCheckbox @bind-Value="filters.ShowArchived" 
                      Label="Arată arhivate"
                      @bind-Value:after="ApplyFilters" />
    
    <div class="mt-3">
        <small class="text-muted">
            Afișează @filteredItems.Count din @allItems.Count elemente
        </small>
    </div>
</div>

@code {
    private FilterModel filters = new();
    private List<Item> allItems = new();
    private List<Item> filteredItems = new();
    
    public class FilterModel
    {
        public bool ShowActive { get; set; } = true;
        public bool ShowCompleted { get; set; }
        public bool ShowArchived { get; set; }
    }
    
    private void ApplyFilters()
    {
        filteredItems = allItems.Where(item =>
            (filters.ShowActive && item.Status == "Active") ||
            (filters.ShowCompleted && item.Status == "Completed") ||
            (filters.ShowArchived && item.Status == "Archived")
        ).ToList();
    }
}
```

### Checkbox-uri Condiționate

```razor
<div class="conditional-checkboxes">
    <FodInputCheckbox @bind-Value="enableAdvanced" 
                      Label="Activează opțiuni avansate"
                      Type="FodCheckboxType.Switch" />
    
    @if (enableAdvanced)
    {
        <div class="advanced-options ms-4 mt-3">
            <FodInputCheckbox @bind-Value="option1" 
                              Label="Opțiune avansată 1" />
            
            <FodInputCheckbox @bind-Value="option2" 
                              Label="Opțiune avansată 2" />
            
            <FodInputCheckbox @bind-Value="option3" 
                              Label="Opțiune avansată 3" />
        </div>
    }
    
    <FodInputCheckbox @bind-Value="enableDebug" 
                      Label="Mod debug"
                      Readonly="@(!enableAdvanced)"
                      Description="Necesită opțiuni avansate activate" />
</div>

@code {
    private bool enableAdvanced;
    private bool option1, option2, option3;
    private bool enableDebug;
}
```

### Validare Customizată

```razor
<EditForm Model="@consent" OnValidSubmit="@ProcessConsent">
    <DataAnnotationsValidator />
    <ValidationSummary />
    
    <div class="consent-form">
        <h4>Consimțământ procesare date</h4>
        
        <FodInputCheckbox @bind-Value="consent.AllowDataProcessing" 
                          Label="Permit procesarea datelor personale" />
        
        <FodInputCheckbox @bind-Value="consent.AllowMarketing" 
                          Label="Permit comunicări de marketing"
                          Readonly="@(!consent.AllowDataProcessing)" />
        
        <FodInputCheckbox @bind-Value="consent.AllowThirdParty" 
                          Label="Permit partajarea cu terți"
                          Readonly="@(!consent.AllowDataProcessing)" />
        
        <FodInputCheckbox @bind-Value="consent.ConfirmAge" 
                          Label="Confirm că am peste 18 ani" />
    </div>
    
    <button type="submit" class="btn btn-primary mt-3">
        Confirmă
    </button>
</EditForm>

@code {
    private ConsentModel consent = new();
    
    public class ConsentModel : IValidatableObject
    {
        public bool AllowDataProcessing { get; set; }
        public bool AllowMarketing { get; set; }
        public bool AllowThirdParty { get; set; }
        
        [Range(typeof(bool), "true", "true", 
               ErrorMessage = "Trebuie să confirmați vârsta")]
        public bool ConfirmAge { get; set; }
        
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (!AllowDataProcessing && (AllowMarketing || AllowThirdParty))
            {
                yield return new ValidationResult(
                    "Nu puteți permite marketing sau partajare fără procesare date",
                    new[] { nameof(AllowDataProcessing) });
            }
        }
    }
}
```

## Conversie Tipuri

Componenta suportă conversie automată din diferite tipuri:

```csharp
private bool GetBoolValueFromObject(object value)
{
    if (value is bool)
        return (bool)value;
    
    if (value is int)
        return (int)value == 1;
    
    if (value is string)
        return (string)value == "true";
    
    return false;
}
```

## Stilizare

### Stil Container

```css
/* Stilul implicit al wrapper-ului */
.form-control.fod {
    border: none;
    padding: 0;
    height: auto;
    background: transparent;
}

/* Spacing pentru checkbox-uri multiple */
.form-group:has(.fod-input-checkbox) {
    margin-bottom: 0.75rem;
}
```

### Teme Personalizate

```razor
<style>
    /* Checkbox cu stil card */
    .card-checkbox .form-control.fod {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 1rem;
    }
    
    .card-checkbox:hover .form-control.fod {
        background: #e9ecef;
        border-color: #adb5bd;
    }
    
    /* Checkbox cu highlight */
    .highlight-checkbox {
        position: relative;
    }
    
    .highlight-checkbox::before {
        content: "";
        position: absolute;
        left: -10px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 24px;
        background: #007bff;
        border-radius: 2px;
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .highlight-checkbox:has(input:checked)::before {
        opacity: 1;
    }
</style>

<div class="card-checkbox">
    <FodInputCheckbox @bind-Value="cardValue" 
                      Label="Opțiune cu stil card" />
</div>

<div class="highlight-checkbox">
    <FodInputCheckbox @bind-Value="highlightValue" 
                      Label="Opțiune cu highlight" />
</div>
```

## Integrare cu FodCheckbox

Componenta folosește intern `FodCheckbox`:

```razor
<FodCheckbox Value="@Value" 
             ValueChanged="(value)=> ChangeValue(value)" 
             Id="@Id" 
             CheckboxType="@Type" 
             Disabled="@Readonly"/>
```

## Accesibilitate

- Label-uri asociate automat prin FODInputWrapper
- Suport pentru keyboard navigation
- ARIA attributes pentru screen readers
- Stări vizuale clare pentru checked/unchecked

## Best Practices

1. **Folosiți etichete clare** - Descrieți exact ce face checkbox-ul
2. **Grupați logic** - Checkbox-uri similare împreună
3. **Validare adecvată** - Pentru termeni obligatorii
4. **Feedback vizual** - Pentru stări disabled/readonly
5. **Descrieri utile** - Folosiți Description pentru clarificări

## Performanță

- Re-renderare minimă la toggle
- Conversie tip o singură dată per schimbare
- Nu are overhead pentru liste mari (folosiți FodCheckbox direct)

## Limitări

- Suportă doar valori boolean
- Nu are suport pentru valoare indeterminată
- Nu suportă checkbox groups (folosiți liste)

## Concluzie

FodInputCheckbox oferă integrare completă cu sistemul de formulare Blazor pentru checkbox-uri, combinând simplitatea componentei FodCheckbox cu puterea FODInputWrapper pentru o experiență consistentă în formulare complexe.