# Radio

## Documentație pentru componentele FODInputRadioGroup și FODInputRadio

### 1. Descriere Generală
`FODInputRadioGroup` și `FODInputRadio` formează un sistem complet pentru implementarea butoanelor radio în formulare Blazor. Sistemul oferă două stiluri de afișare (radio tradițional și grup de butoane), suport pentru tipuri generice, validare integrată și localizare automată.

Caracteristici principale:
- Suport pentru enum-uri cu localizare automată
- Două stiluri vizuale: Radio și Button
- Binding bidirecțional cu validare
- Suport pentru surse de date personalizate
- Tooltips pentru descrieri detaliate
- Integrare completă cu sistemul de formulare Blazor
- Componente specializate pentru scenarii specifice (OnBehalfOf)

### 2. Ghid de Utilizare API

#### Radio group de bază cu enum
```razor
<EditForm Model="model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FODInputRadioGroup T="PersonType" 
                        @bind-Value="model.PersonType"
                        Label="Tip persoană" />
    
    <ValidationMessage For="@(() => model.PersonType)" />
</EditForm>

@code {
    public enum PersonType
    {
        [Display(Name = "Persoană fizică")]
        Individual = 1,
        
        [Display(Name = "Persoană juridică")]
        LegalEntity = 2
    }
    
    public class FormModel
    {
        [Required(ErrorMessage = "Selectați tipul persoanei")]
        public PersonType PersonType { get; set; }
    }
}
```

#### Radio group stil butoane
```razor
<FODInputRadioGroup T="DeliveryOption" 
                    @bind-Value="selectedDelivery"
                    Type="FodRadioType.Button"
                    Label="Modalitate de livrare">
</FODInputRadioGroup>

@code {
    public enum DeliveryOption
    {
        [Display(Name = "Livrare electronică", Description = "Prin MDelivery")]
        Electronic = 1,
        
        [Display(Name = "Ridicare de la oficiu", Description = "Personal la sediu")]
        Office = 2,
        
        [Display(Name = "Livrare poștală", Description = "Prin Poșta Moldovei")]
        Post = 3
    }
    
    private DeliveryOption selectedDelivery = DeliveryOption.Electronic;
}
```

#### Radio group cu date personalizate
```razor
<FODInputRadioGroup T="Office" 
                    @bind-Value="selectedOffice"
                    Source="offices"
                    Label="Selectați oficiul" />

@code {
    private Office selectedOffice;
    private List<Office> offices = new()
    {
        new Office { Id = 1, Name = "Oficiul Central", Address = "str. Ștefan cel Mare 1" },
        new Office { Id = 2, Name = "Oficiul Botanica", Address = "bd. Dacia 45" },
        new Office { Id = 3, Name = "Oficiul Rîșcani", Address = "str. Kiev 15" }
    };
    
    public class Office
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
    }
}
```

#### Radio group cu etichete personalizate
```razor
<FODInputRadioGroup T="PaymentMethod" 
                    @bind-Value="model.PaymentMethod"
                    ItemLabels="GetPaymentLabels()"
                    Label="Metodă de plată" />

@code {
    private IEnumerable<KeyValuePair<PaymentMethod, string>> GetPaymentLabels()
    {
        return new List<KeyValuePair<PaymentMethod, string>>
        {
            new(PaymentMethod.Card, "Card bancar (Visa/Mastercard)"),
            new(PaymentMethod.MPay, "MPay - Plată guvernamentală"),
            new(PaymentMethod.Cash, "Numerar la oficiu")
        };
    }
}
```

#### Radio group cu descrieri (tooltips)
```razor
<FODInputRadioGroup T="ServiceType" 
                    @bind-Value="selectedService"
                    Label="Tip serviciu">
</FODInputRadioGroup>

@code {
    public enum ServiceType
    {
        [Display(Name = "Apostilă", 
                Description = "Legalizarea documentelor pentru utilizare internațională")]
        Apostille = 1,
        
        [Display(Name = "Traducere autorizată", 
                Description = "Traducere oficială cu ștampilă și semnătură")]
        Translation = 2,
        
        [Display(Name = "Copie legalizată", 
                Description = "Copie certificată conform originalului")]
        CertifiedCopy = 3
    }
}
```

#### Radio group cu validare
```razor
<EditForm Model="formData" OnValidSubmit="ProcessForm">
    <DataAnnotationsValidator />
    
    <FODInputRadioGroup T="RequestorType" 
                        @bind-Value="formData.RequestorType"
                        Label="Depun solicitarea"
                        Type="FodRadioType.Button" />
    <ValidationMessage For="@(() => formData.RequestorType)" />
    
    @if (formData.RequestorType == RequestorType.OnBehalf)
    {
        <div class="mt-3">
            <FODInputText @bind-Value="formData.AuthorizationNumber" 
                         Label="Număr împuternicire"
                         Required="true" />
        </div>
    }
    
    <FodButton Type="submit" Variant="FodVariant.Filled" Color="FodColor.Primary">
        Continuă
    </FodButton>
</EditForm>

@code {
    public class FormData
    {
        [Required(ErrorMessage = "Selectați modul de depunere")]
        public RequestorType RequestorType { get; set; }
        
        public string AuthorizationNumber { get; set; }
    }
    
    public enum RequestorType
    {
        [Display(Name = "În nume propriu")]
        Personal = 1,
        
        [Display(Name = "În baza împuternicirii")]
        OnBehalf = 2
    }
}
```

#### Radio group dezactivat condiționat
```razor
<FODInputRadioGroup T="ProcessingSpeed" 
                    @bind-Value="model.Speed"
                    Disable="@(!model.IsUrgent)"
                    Label="Termen de procesare">
</FODInputRadioGroup>

<FodCheckbox @bind-Checked="model.IsUrgent" Label="Procesare urgentă" />

@code {
    public class Model
    {
        public ProcessingSpeed Speed { get; set; } = ProcessingSpeed.Normal;
        public bool IsUrgent { get; set; }
    }
    
    public enum ProcessingSpeed
    {
        [Display(Name = "Normal (3 zile)")]
        Normal = 1,
        
        [Display(Name = "Rapid (1 zi)")]
        Fast = 2,
        
        [Display(Name = "Express (2 ore)")]
        Express = 3
    }
}
```

#### Componenta specializată OnBehalfOf
```razor
<FODInputOnBehalfOfRadioGroup @bind-Value="model.OnBehalfOf" />

@code {
    private Model model = new();
    
    public class Model
    {
        public OnBehalfOnEnum OnBehalfOf { get; set; } = OnBehalfOnEnum.Personal;
    }
}
```

#### Radio group cu stilizare personalizată
```razor
<FODInputRadioGroup T="Theme" 
                    @bind-Value="userTheme"
                    Type="FodRadioType.Button"
                    Label="Temă interfață"
                    BoldText="true"
                    LabelFontSize="16"
                    InputFontSize="14">
</FODInputRadioGroup>

@code {
    public enum Theme
    {
        [Display(Name = "🌞 Luminoasă")]
        Light = 1,
        
        [Display(Name = "🌙 Întunecată")]
        Dark = 2,
        
        [Display(Name = "🌓 Automată")]
        Auto = 3
    }
    
    private Theme userTheme = Theme.Auto;
}
```

### 3. Atribute disponibile

#### FODInputRadioGroup<T>
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `T` | Valoarea selectată | `default(T)` |
| `Type` | `FodRadioType` | Stilul vizual (Radio sau Button) | `Radio` |
| `Disable` | `bool` | Dezactivează toate opțiunile | `false` |
| `BoldText` | `bool` | Text îngroșat pentru etichete | `false` |
| `LabelFontSize` | `int` | Dimensiune font etichete (px) | `null` |
| `InputFontSize` | `int` | Dimensiune font input-uri (px) | `null` |
| `Options` | `IEnumerable<SelectableItem<T>>` | Opțiuni disponibile | `null` |
| `ItemLabels` | `IEnumerable<KeyValuePair<T, string>>` | Etichete personalizate | `null` |
| `Source` | `IEnumerable<T>` | Sursă de date | `null` |
| `Label` | `string` | Eticheta grupului | `null` |
| `Required` | `bool` | Câmp obligatoriu | `false` |
| `OnValueChanged` | `EventCallback<T>` | Callback la schimbare | - |

#### FODInputRadio<T>
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Item` | `SelectableItem<T>` | Elementul de date | - |
| `Disable` | `bool` | Dezactivează radio-ul | `false` |
| `LabelFontSize` | `int` | Dimensiune font etichetă | `null` |
| `InputFontSize` | `int` | Dimensiune font input | `null` |
| `Label` | `string` | Etichetă personalizată | `null` |

### 4. Tipuri și Enumerări

#### FodRadioType
```csharp
public enum FodRadioType
{
    Radio = 1,  // Butoane radio tradiționale
    Button = 2  // Grup de butoane stil modern
}
```

#### OnBehalfOnEnum
```csharp
public enum OnBehalfOnEnum
{
    Personal = 1,           // În nume propriu
    MPowerAuthorization = 2,// Cu împuternicire MPower
    Custom = 3             // Personalizat
}
```

### 5. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `ValueChanged` | `EventCallback<T>` | Se declanșează la schimbarea selecției |
| `OnValueChanged` | `EventCallback<T>` | Alias pentru ValueChanged |

### 6. Componente asociate

- **FODSelectableFormComponent<T>** - Clasa de bază pentru componente de selecție
- **SelectableItem<T>** - Model pentru elemente selectabile
- **Tooltip** - Pentru afișarea descrierilor
- **ValidationMessage** - Pentru afișarea erorilor de validare

### 7. Stilizare și personalizare

#### CSS pentru stilul Button
```css
/* Personalizare grup butoane */
.fod-radio-button-group {
    border-radius: 0.625rem;
    overflow: hidden;
}

.fod-radio-button-group .btn {
    border-radius: 0;
    border: 1px solid var(--fod-primary);
}

.fod-radio-button-group .btn.active {
    background-color: var(--fod-primary);
    color: white;
}

/* Animații pentru tranziții */
.fod-radio-button-group .btn {
    transition: all 0.3s ease;
}

.fod-radio-button-group .btn:hover:not(.active) {
    background-color: rgba(var(--fod-primary-rgb), 0.1);
}
```

#### Stilizare radio tradițional
```css
/* Radio buttons personalizate */
.form-check-input[type="radio"] {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #dee2e6;
    transition: all 0.2s ease;
}

.form-check-input[type="radio"]:checked {
    background-color: var(--fod-primary);
    border-color: var(--fod-primary);
}

/* Label styling */
.form-check-label {
    padding-left: 0.5rem;
    cursor: pointer;
}
```

### 8. Localizare automată pentru enum-uri

```csharp
public enum DocumentType
{
    [Display(Name = "Pașaport", 
            Description = "Document de călătorie internațional",
            ResourceType = typeof(Resources))]
    Passport = 1,
    
    [Display(Name = "Buletin de identitate",
            Description = "Act de identitate național")]
    IdentityCard = 2
}
```

### 9. Integrare cu validare

```razor
<EditForm Model="model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FODInputRadioGroup T="AcceptanceStatus" 
                        @bind-Value="model.Status"
                        Label="Acceptați termenii?"
                        For="@(() => model.Status)" />
    
    <ValidationMessage For="@(() => model.Status)" />
</EditForm>

@code {
    public class Model
    {
        [Required(ErrorMessage = "Trebuie să selectați o opțiune")]
        [Range(1, 1, ErrorMessage = "Trebuie să acceptați termenii")]
        public AcceptanceStatus Status { get; set; }
    }
    
    public enum AcceptanceStatus
    {
        [Display(Name = "Accept")]
        Accept = 1,
        
        [Display(Name = "Refuz")]
        Refuse = 2
    }
}
```

### 10. Note și observații

- Pentru enum-uri, localizarea se face automat prin atributul Display
- Stilul Button este recomandat pentru 2-4 opțiuni
- Pentru liste lungi (>5 opțiuni), considerați FodSelect
- Validarea funcționează identic cu alte componente de formular
- Tooltips-urile apar la hover pentru descrieri lungi

### 11. Diferențe între stiluri

| Caracteristică | Radio | Button |
|---------------|-------|--------|
| Aspect | Cerc cu punct | Butoane grupate |
| Spațiu ocupat | Vertical extins | Compact orizontal |
| Cazuri de utilizare | Formulare tradiționale | UI modern |
| Număr optim opțiuni | 2-10 | 2-4 |

### 12. Bune practici

1. **Etichete clare** - Folosiți nume descriptive pentru opțiuni
2. **Ordine logică** - Aranjați opțiunile în ordine naturală
3. **Valoare implicită** - Setați o valoare implicită sensibilă
4. **Validare** - Adăugați validare pentru câmpuri obligatorii
5. **Descrieri** - Folosiți tooltips pentru clarificări
6. **Stil consistent** - Păstrați același stil în formular

### 13. Troubleshooting

#### Radio-urile nu se actualizează
- Verificați că folosiți `@bind-Value` corect
- Asigurați-vă că tipul T este consistent

#### Etichetele nu apar
- Verificați atributul Display pe enum
- Pentru date custom, verificați proprietățile Text/Name

#### Validarea nu funcționează
- Adăugați `DataAnnotationsValidator` în EditForm
- Folosiți `ValidationMessage` pentru afișare erori

### 14. Concluzie
Sistemul de componente radio oferă o soluție completă și flexibilă pentru selecții unice în formulare, cu suport excelent pentru localizare, validare și personalizare vizuală.