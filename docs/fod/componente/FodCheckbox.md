# Checkbox

## Documentație pentru componentele FodCheckBox2 și FodCheckbox

### 1. Descriere Generală
`FodCheckBox2` este componenta modernă pentru input-uri de tip checkbox în aplicații Blazor. Oferă funcționalități avansate precum suport tri-state, validare integrată, personalizare completă a aspectului și suport pentru multiple tipuri de date.

Componenta include:
- Suport pentru tipuri generice (bool, bool?, int, string, etc.)
- Mod tri-state pentru valori nullable
- Validare integrată cu formulare Blazor
- Personalizare completă (culori, pictograme, dimensiuni)
- Efecte ripple și animații
- Suport complet pentru tastatură
- Integrare cu DataTable pentru selecții multiple
- Componente wrapper pentru formulare (FodInputCheckbox, FodInlineCheckbox)

### 2. Ghid de Utilizare API

#### Checkbox de bază
```razor
<FodCheckBox2 @bind-Checked="isActive" />

@code {
    private bool isActive = false;
}
```

#### Checkbox cu etichetă
```razor
<FodCheckBox2 @bind-Checked="acceptTerms" 
              Label="Accept termenii și condițiile" />

@code {
    private bool acceptTerms = false;
}
```

#### Checkbox cu validare în formular
```razor
<EditForm Model="model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodCheckBox2 @bind-Checked="model.AcceptTerms"
                  Label="Accept termenii de utilizare"
                  Required="true"
                  RequiredError="Trebuie să acceptați termenii pentru a continua" />
    
    <ValidationMessage For="@(() => model.AcceptTerms)" />
    
    <FodButton Type="submit" Variant="FodVariant.Filled" Color="FodColor.Primary">
        Înregistrare
    </FodButton>
</EditForm>

@code {
    public class RegistrationModel
    {
        [Required(ErrorMessage = "Acceptarea termenilor este obligatorie")]
        [Range(typeof(bool), "true", "true", ErrorMessage = "Trebuie să acceptați termenii")]
        public bool AcceptTerms { get; set; }
    }
    
    private RegistrationModel model = new();
}
```

#### Checkbox tri-state (nullable)
```razor
<FodCheckBox2 @bind-Checked="includeArchived"
              Label="Include documente arhivate"
              TriState="true" />

@code {
    private bool? includeArchived = null; // null = toate, true = doar arhivate, false = fără arhivate
}
```

#### Checkbox cu pictograme personalizate
```razor
<FodCheckBox2 @bind-Checked="isFavorite"
              Label="Adaugă la favorite"
              CheckedIcon="@FodIcons.Material.Filled.Favorite"
              UncheckedIcon="@FodIcons.Material.Filled.FavoriteBorder"
              Color="FodColor.Error" />

@code {
    private bool isFavorite = false;
}
```

#### Checkbox cu culori personalizate
```razor
<FodCheckBox2 @bind-Checked="isEnabled"
              Label="Activat"
              Color="FodColor.Success"
              UnCheckedColor="FodColor.Error" />
```

#### Checkbox în mod dense
```razor
<FodCheckBox2 @bind-Checked="compactMode"
              Label="Afișare compactă"
              Dense="true"
              Size="Size.Small" />
```

#### Checkbox cu poziționare etichetă
```razor
<!-- Etichetă la început (stânga) -->
<FodCheckBox2 @bind-Checked="leftLabel"
              Label="Etichetă la stânga"
              LabelPosition="LabelPosition.Start" />

<!-- Etichetă la sfârșit (dreapta) - implicit -->
<FodCheckBox2 @bind-Checked="rightLabel"
              Label="Etichetă la dreapta"
              LabelPosition="LabelPosition.End" />
```

#### Checkbox cu conversie tip personalizat
```razor
<FodCheckBox2 @bind-Checked="status"
              Label="Status activ"
              Converter="@(new StatusBoolConverter())" />

@code {
    private string status = "active";
    
    public class StatusBoolConverter : IBoolConverter<string>
    {
        public bool Convert(string value) => value == "active";
        public string ConvertBack(bool value) => value ? "active" : "inactive";
    }
}
```

#### Checkbox în componente de formular
```razor
<EditForm Model="model">
    <!-- Checkbox standard în formular -->
    <FodInputCheckbox @bind-Value="model.IsActive" />
    
    <!-- Checkbox inline cu etichetă automată -->
    <FodInlineCheckbox @bind-Value="model.ReceiveNotifications" />
</EditForm>

@code {
    public class FormModel
    {
        [Display(Name = "Cont activ")]
        public bool IsActive { get; set; }
        
        [Display(Name = "Primește notificări")]
        public bool ReceiveNotifications { get; set; }
    }
}
```

#### Checkbox în DataTable pentru selecție multiplă
```razor
<FodDataTable Items="users" MultiSelection="true" @bind-SelectedItems="selectedUsers">
    <HeaderContent>
        <FodTHeadRow>
            <FodTh>
                <FodCheckBox2 @bind-Checked="selectAll" TriState="true" />
            </FodTh>
            <FodTh>Nume</FodTh>
            <FodTh>Email</FodTh>
        </FodTHeadRow>
    </HeaderContent>
    <RowTemplate>
        <FodTr>
            <FodTd>
                <FodCheckBox2 @bind-Checked="@context.IsSelected" />
            </FodTd>
            <FodTd>@context.Name</FodTd>
            <FodTd>@context.Email</FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>
```

#### Grupuri de checkbox-uri
```razor
<div class="mb-3">
    <label class="form-label">Permisiuni utilizator</label>
    <div class="d-flex flex-column gap-2">
        <FodCheckBox2 @bind-Checked="permissions.CanRead" 
                      Label="Citire" />
        <FodCheckBox2 @bind-Checked="permissions.CanWrite" 
                      Label="Scriere" />
        <FodCheckBox2 @bind-Checked="permissions.CanDelete" 
                      Label="Ștergere" 
                      Color="FodColor.Error" />
        <FodCheckBox2 @bind-Checked="permissions.IsAdmin" 
                      Label="Administrator" 
                      Color="FodColor.Warning" />
    </div>
</div>

@code {
    private UserPermissions permissions = new();
    
    public class UserPermissions
    {
        public bool CanRead { get; set; } = true;
        public bool CanWrite { get; set; }
        public bool CanDelete { get; set; }
        public bool IsAdmin { get; set; }
    }
}
```

#### Checkbox cu stări condiționate
```razor
<FodCheckBox2 @bind-Checked="enableAdvanced"
              Label="Opțiuni avansate"
              OnCheckedChanged="ToggleAdvancedOptions" />

@if (enableAdvanced)
{
    <div class="mt-3">
        <FodCheckBox2 @bind-Checked="option1" 
                      Label="Opțiune avansată 1"
                      Disabled="@(!enableAdvanced)" />
        <FodCheckBox2 @bind-Checked="option2" 
                      Label="Opțiune avansată 2"
                      Disabled="@(!enableAdvanced)" />
    </div>
}

@code {
    private bool enableAdvanced = false;
    private bool option1 = false;
    private bool option2 = false;
    
    private void ToggleAdvancedOptions(bool value)
    {
        if (!value)
        {
            option1 = false;
            option2 = false;
        }
    }
}
```

### 3. Atribute disponibile

#### FodCheckBox2
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Checked` | `T` | Valoarea bifată (generic) | `default(T)` |
| `CheckedChanged` | `EventCallback<T>` | Eveniment la schimbare | - |
| `Color` | `FodColor` | Culoarea când este bifat | `Default` |
| `UnCheckedColor` | `FodColor` | Culoarea când nu este bifat | `Default` |
| `Label` | `string` | Eticheta checkbox-ului | `null` |
| `LabelPosition` | `LabelPosition` | Poziția etichetei (Start/End) | `End` |
| `Dense` | `bool` | Mod compact | `false` |
| `Size` | `Size` | Dimensiune (Small/Medium/Large) | `Medium` |
| `DisableRipple` | `bool` | Dezactivează efectul ripple | `false` |
| `TriState` | `bool` | Activează modul tri-state | `false` |
| `CheckedIcon` | `string` | Pictogramă personalizată bifat | `Check` |
| `UncheckedIcon` | `string` | Pictogramă personalizată nebifat | `null` |
| `IndeterminateIcon` | `string` | Pictogramă pentru stare nedeterminată | `IndeterminateMark` |
| `KeyboardEnabled` | `bool` | Activează controlul cu tastatura | `true` |
| `Disabled` | `bool` | Dezactivează checkbox-ul | `false` |
| `ReadOnly` | `bool` | Mod doar citire | `false` |
| `Required` | `bool` | Câmp obligatoriu | `false` |
| `RequiredError` | `string` | Mesaj eroare pentru câmp obligatoriu | `"Required"` |
| `Converter` | `IBoolConverter<T>` | Convertor personalizat | `null` |
| `StopClickPropagation` | `bool` | Oprește propagarea click-ului | `false` |

#### FodCheckbox (Legacy)
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `CheckboxType` | `FodCheckboxType` | Tip afișare (Checkbox/Radio/Switch) | `Checkbox` |
| `Disabled` | `bool` | Dezactivează componenta | `false` |
| `Value` | `bool` | Valoarea checkbox-ului | `false` |

### 4. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `CheckedChanged` | `EventCallback<T>` | Se declanșează la schimbarea valorii |
| `OnCheckedChanged` | `EventCallback<T>` | Callback adițional după schimbare |

### 5. Suport tastatură

| Tastă | Acțiune |
|-------|---------|
| `Space` | Comută starea checkbox-ului |
| `Enter` / `NumpadEnter` | Setează la true |
| `Delete` | Setează la false |
| `Backspace` | Setează la null (doar în TriState) |

### 6. Componente asociate

- **FodInputCheckbox** - Wrapper pentru utilizare în formulare
- **FodInlineCheckbox** - Checkbox inline cu etichetă automată
- **FodBooleanInput<T>** - Clasa de bază pentru input-uri boolean
- **IBoolConverter<T>** - Interfață pentru conversii personalizate

### 7. Stilizare și personalizare

```css
/* Personalizare checkbox */
.fod-checkbox {
    --fod-checkbox-size: 24px;
    --fod-checkbox-color: var(--fod-primary);
}

/* Checkbox mai mare */
.large-checkbox .fod-checkbox {
    --fod-checkbox-size: 32px;
}

/* Checkbox cu animație personalizată */
.animated-checkbox .fod-checkbox-input:checked + .fod-button-root {
    animation: checkPulse 0.3s ease;
}

@keyframes checkPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

/* Stil pentru grupuri de checkbox-uri */
.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}
```

### 8. Validare personalizată

```razor
<EditForm EditContext="editContext">
    <FodCheckBox2 @bind-Checked="model.HasReadTerms"
                  Label="Am citit termenii"
                  ValidationFunc="@ValidateTermsRead" />
    
    <FodCheckBox2 @bind-Checked="model.AgreeToTerms"
                  Label="Sunt de acord cu termenii"
                  Disabled="@(!model.HasReadTerms)" />
</EditForm>

@code {
    private EditContext editContext;
    
    private string ValidateTermsRead(bool value)
    {
        if (!value && model.AgreeToTerms)
            return "Nu puteți fi de acord fără să citiți termenii";
        return null;
    }
}
```

### 9. Integrare cu alte componente

#### În Card
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6">Setări notificări</FodText>
        <div class="mt-3">
            <FodCheckBox2 @bind-Checked="settings.EmailNotifications" 
                          Label="Notificări email" />
            <FodCheckBox2 @bind-Checked="settings.SmsNotifications" 
                          Label="Notificări SMS" />
            <FodCheckBox2 @bind-Checked="settings.PushNotifications" 
                          Label="Notificări push" />
        </div>
    </FodCardContent>
</FodCard>
```

### 10. Migrare de la FodCheckbox la FodCheckBox2

```razor
<!-- Vechiul cod -->
<FodCheckbox @bind-Value="isChecked" CheckboxType="FodCheckboxType.Checkbox" />

<!-- Cod nou -->
<FodCheckBox2 @bind-Checked="isChecked" />

<!-- Pentru switch, folosiți componenta dedicată FodSwitch -->
<FodSwitch @bind-Checked="isEnabled" />
```

### 11. Note și observații

- FodCheckBox2 este componenta recomandată pentru dezvoltări noi
- Pentru câmpuri obligatorii, doar valoarea `true` este considerată validă
- TriState funcționează doar cu tipuri nullable (bool?)
- Convertorii personalizați permit binding la orice tip de date
- Efectul ripple poate fi dezactivat pentru performanță

### 12. Accesibilitate

- Suport complet ARIA
- Navigare cu tastatură
- Asociere corectă label-input
- Anunțuri pentru screen readers
- Contrast adecvat pentru toate stările

### 13. Bune practici

1. **Etichete clare** - Folosiți etichete descriptive
2. **Grupare logică** - Grupați checkbox-urile conexe
3. **Feedback vizual** - Folosiți culori pentru stări importante
4. **Validare** - Validați la nivel de grup pentru opțiuni exclusive
5. **Stări intermediare** - Folosiți TriState pentru "selectează toate"
6. **Accesibilitate** - Testați cu navigare prin tastatură

### 14. Troubleshooting

#### Checkbox-ul nu se actualizează
- Verificați binding-ul `@bind-Checked`
- Asigurați-vă că tipul T este consistent

#### Validarea nu funcționează
- Pentru Required, doar `true` este valid
- Folosiți Range validator pentru bool în EditForm

#### TriState nu funcționează
- Verificați că tipul este nullable (bool?)
- Setați explicit `TriState="true"`

### 15. Concluzie
`FodCheckBox2` oferă o soluție modernă și completă pentru input-uri checkbox, cu suport excelent pentru personalizare, validare și accesibilitate. Componenta acoperă toate scenariile de la checkbox-uri simple până la sisteme complexe de selecție.