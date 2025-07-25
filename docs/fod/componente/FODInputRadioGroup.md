# FODInputRadioGroup

## Descriere Generală

`FODInputRadioGroup<T>` este o componentă generică pentru grupuri de butoane radio care permite selecția unei singure opțiuni dintr-o listă. Extinde `FODSelectableFormComponent<T>` și suportă două moduri de afișare: radio buttons tradiționale sau butoane tip toggle. Componenta se integrează perfect cu sistemul de formulare Blazor și suportă validare.

## Utilizare de Bază

```razor
<!-- Radio group simplu -->
<FODInputRadioGroup @bind-Value="selectedOption" 
                    Options="@options" 
                    Label="Selectați o opțiune" />

<!-- Radio group tip butoane -->
<FODInputRadioGroup @bind-Value="selectedSize" 
                    Options="@sizes"
                    Type="FodRadioType.Button"
                    Label="Mărime" />
```

## Configurare Opțiuni

### Cu Listă de String-uri

```razor
<FODInputRadioGroup @bind-Value="selectedGender" 
                    Options="@genderOptions"
                    Label="Gen" />

@code {
    private string selectedGender;
    private List<SelectableItem> genderOptions = new()
    {
        new SelectableItem { Value = "M", Text = "Masculin" },
        new SelectableItem { Value = "F", Text = "Feminin" },
        new SelectableItem { Value = "N", Text = "Nespecificat" }
    };
}
```

### Cu Enum

```razor
<FODInputRadioGroup @bind-Value="selectedPriority" 
                    EnumType="@typeof(Priority)"
                    Label="Prioritate" />

@code {
    private Priority selectedPriority = Priority.Normal;
    
    public enum Priority
    {
        [Display(Name = "Scăzută")]
        Low,
        [Display(Name = "Normală")]
        Normal,
        [Display(Name = "Ridicată")]
        High,
        [Display(Name = "Urgentă")]
        Urgent
    }
}
```

## Atribute și Parametri

| Parametru | Tip | Default | Descriere |
|-----------|-----|---------|-----------|
| Type | FodRadioType | Radio | Tipul afișării (Radio/Button) |
| Options | List<SelectableItem> | null | Lista de opțiuni |
| EnumType | Type | null | Tipul enum pentru generare automată |
| Disable | bool | false | Dezactivează toate opțiunile |
| BoldText | bool | false | Text îngroșat pentru etichete |
| LabelFontSize | int | - | Dimensiune font etichetă |
| InputFontSize | int | - | Dimensiune font input |
| Label | string | null | Eticheta grupului |

## Exemple de Utilizare

### Formular de Înregistrare

```razor
<EditForm Model="@registration" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />
    
    <FODInputRadioGroup @bind-Value="registration.AccountType" 
                        Options="@accountTypes"
                        Label="Tip cont" />
    
    <FODInputRadioGroup @bind-Value="registration.ExperienceLevel" 
                        EnumType="@typeof(ExperienceLevel)"
                        Label="Nivel experiență" />
    
    <ValidationSummary />
    <button type="submit">Înregistrare</button>
</EditForm>

@code {
    private RegistrationModel registration = new();
    
    private List<SelectableItem> accountTypes = new()
    {
        new() { Value = "personal", Text = "Cont Personal" },
        new() { Value = "business", Text = "Cont Business" },
        new() { Value = "developer", Text = "Cont Developer" }
    };
    
    public class RegistrationModel
    {
        [Required(ErrorMessage = "Selectați tipul contului")]
        public string AccountType { get; set; }
        
        [Required(ErrorMessage = "Selectați nivelul de experiență")]
        public ExperienceLevel ExperienceLevel { get; set; }
    }
    
    public enum ExperienceLevel
    {
        [Display(Name = "Începător")]
        Beginner,
        [Display(Name = "Intermediar")]
        Intermediate,
        [Display(Name = "Avansat")]
        Advanced,
        [Display(Name = "Expert")]
        Expert
    }
}
```

### Selector de Limbă cu Butoane

```razor
<div class="language-selector">
    <FODInputRadioGroup @bind-Value="selectedLanguage" 
                        Options="@languages"
                        Type="FodRadioType.Button"
                        Label="Limba interfață"
                        @bind-Value:after="ChangeLanguage" />
</div>

@code {
    private string selectedLanguage = "ro";
    
    private List<SelectableItem> languages = new()
    {
        new() { Value = "ro", Text = "🇲🇩 Română" },
        new() { Value = "ru", Text = "🇷🇺 Русский" },
        new() { Value = "en", Text = "🇬🇧 English" }
    };
    
    private async Task ChangeLanguage()
    {
        await CultureService.SetCultureAsync(selectedLanguage);
        NavigationManager.NavigateTo(NavigationManager.Uri, true);
    }
}
```

### Configurator Produs

```razor
<div class="product-configurator">
    <h3>Configurare Laptop</h3>
    
    <div class="mb-4">
        <FODInputRadioGroup @bind-Value="config.Processor" 
                            Options="@processors"
                            Label="Procesor"
                            LabelFontSize="16"
                            @bind-Value:after="UpdatePrice" />
    </div>
    
    <div class="mb-4">
        <FODInputRadioGroup @bind-Value="config.Memory" 
                            Options="@memoryOptions"
                            Label="Memorie RAM"
                            Type="FodRadioType.Button"
                            @bind-Value:after="UpdatePrice" />
    </div>
    
    <div class="mb-4">
        <FODInputRadioGroup @bind-Value="config.Storage" 
                            Options="@storageOptions"
                            Label="Stocare"
                            Type="FodRadioType.Button"
                            @bind-Value:after="UpdatePrice" />
    </div>
    
    <div class="price-display">
        <h4>Preț total: @totalPrice.ToString("C")</h4>
    </div>
</div>

@code {
    private LaptopConfig config = new();
    private decimal totalPrice = 15000;
    
    private List<SelectableItem> processors = new()
    {
        new() { Value = "i5", Text = "Intel Core i5 (+0 MDL)" },
        new() { Value = "i7", Text = "Intel Core i7 (+3000 MDL)" },
        new() { Value = "i9", Text = "Intel Core i9 (+6000 MDL)" }
    };
    
    private List<SelectableItem> memoryOptions = new()
    {
        new() { Value = "8", Text = "8GB" },
        new() { Value = "16", Text = "16GB" },
        new() { Value = "32", Text = "32GB" }
    };
    
    private List<SelectableItem> storageOptions = new()
    {
        new() { Value = "256", Text = "256GB" },
        new() { Value = "512", Text = "512GB" },
        new() { Value = "1024", Text = "1TB" }
    };
    
    private void UpdatePrice()
    {
        totalPrice = 15000; // Preț de bază
        
        // Adaugă cost procesor
        totalPrice += config.Processor switch
        {
            "i7" => 3000,
            "i9" => 6000,
            _ => 0
        };
        
        // Adaugă cost memorie
        totalPrice += config.Memory switch
        {
            "16" => 1500,
            "32" => 4000,
            _ => 0
        };
        
        // Adaugă cost stocare
        totalPrice += config.Storage switch
        {
            "512" => 2000,
            "1024" => 5000,
            _ => 0
        };
    }
    
    public class LaptopConfig
    {
        public string Processor { get; set; } = "i5";
        public string Memory { get; set; } = "8";
        public string Storage { get; set; } = "256";
    }
}
```

### Chestionar cu Validare

```razor
<EditForm Model="@survey" OnValidSubmit="@SubmitSurvey">
    <DataAnnotationsValidator />
    
    <div class="survey-question">
        <FODInputRadioGroup @bind-Value="survey.Satisfaction" 
                            EnumType="@typeof(SatisfactionLevel)"
                            Label="Cât de mulțumit sunteți de serviciile noastre?"
                            BoldText="true" />
    </div>
    
    <div class="survey-question">
        <FODInputRadioGroup @bind-Value="survey.Recommendation" 
                            Options="@recommendationOptions"
                            Label="Ne-ați recomanda prietenilor?"
                            Type="FodRadioType.Button" />
    </div>
    
    <div class="survey-question">
        <FODInputRadioGroup @bind-Value="survey.ReturnLikelihood" 
                            Options="@likelihoodOptions"
                            Label="Veți folosi serviciile noastre din nou?" />
    </div>
    
    <ValidationSummary />
    <button type="submit" class="btn btn-primary">Trimite feedback</button>
</EditForm>

@code {
    private SurveyModel survey = new();
    
    private List<SelectableItem> recommendationOptions = new()
    {
        new() { Value = "yes", Text = "Da, cu siguranță" },
        new() { Value = "maybe", Text = "Poate" },
        new() { Value = "no", Text = "Nu" }
    };
    
    private List<SelectableItem> likelihoodOptions = new()
    {
        new() { Value = "5", Text = "Foarte probabil" },
        new() { Value = "4", Text = "Probabil" },
        new() { Value = "3", Text = "Neutru" },
        new() { Value = "2", Text = "Puțin probabil" },
        new() { Value = "1", Text = "Foarte puțin probabil" }
    };
    
    public class SurveyModel
    {
        [Required(ErrorMessage = "Vă rugăm evaluați satisfacția")]
        public SatisfactionLevel? Satisfaction { get; set; }
        
        [Required(ErrorMessage = "Vă rugăm răspundeți la întrebare")]
        public string Recommendation { get; set; }
        
        [Required(ErrorMessage = "Vă rugăm selectați o opțiune")]
        public string ReturnLikelihood { get; set; }
    }
    
    public enum SatisfactionLevel
    {
        [Display(Name = "Foarte nemulțumit")]
        VeryDissatisfied,
        [Display(Name = "Nemulțumit")]
        Dissatisfied,
        [Display(Name = "Neutru")]
        Neutral,
        [Display(Name = "Mulțumit")]
        Satisfied,
        [Display(Name = "Foarte mulțumit")]
        VerySatisfied
    }
    
    private async Task SubmitSurvey()
    {
        // Procesare rezultate chestionar
        await Task.CompletedTask;
    }
}
```

### Radio Group Condiționat

```razor
<div class="conditional-form">
    <FODInputRadioGroup @bind-Value="hasVehicle" 
                        Options="@yesNoOptions"
                        Label="Aveți vehicul personal?"
                        Type="FodRadioType.Button"
                        @bind-Value:after="() => { if (hasVehicle == \"no\") vehicleType = null; }" />
    
    @if (hasVehicle == "yes")
    {
        <div class="mt-3">
            <FODInputRadioGroup @bind-Value="vehicleType" 
                                Options="@vehicleTypes"
                                Label="Tip vehicul" />
        </div>
    }
</div>

@code {
    private string hasVehicle = "no";
    private string vehicleType;
    
    private List<SelectableItem> yesNoOptions = new()
    {
        new() { Value = "yes", Text = "Da" },
        new() { Value = "no", Text = "Nu" }
    };
    
    private List<SelectableItem> vehicleTypes = new()
    {
        new() { Value = "car", Text = "Automobil" },
        new() { Value = "motorcycle", Text = "Motocicletă" },
        new() { Value = "bicycle", Text = "Bicicletă" },
        new() { Value = "other", Text = "Altul" }
    };
}
```

## Stilizare

### Stil pentru Radio Buttons

```css
/* Radio buttons tradiționale */
.fod-radio-group .form-check {
    margin-bottom: 0.5rem;
}

.fod-radio-group .form-check-input {
    margin-top: 0.3rem;
}

.fod-radio-group .form-check-label {
    margin-left: 0.5rem;
    cursor: pointer;
}
```

### Stil pentru Button Group

```css
/* Butoane radio */
.fod-radio-button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.fod-radio-button-group .btn {
    border: 2px solid #dee2e6;
}

.fod-radio-button-group .btn.active {
    background-color: var(--fod-primary);
    border-color: var(--fod-primary);
    color: white;
}
```

### Teme Personalizate

```razor
<style>
    /* Temă cards pentru radio */
    .card-radio-group .form-check {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 0.75rem;
        transition: all 0.3s;
    }
    
    .card-radio-group .form-check:hover {
        border-color: #007bff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .card-radio-group .form-check-input:checked + .form-check-label {
        color: #007bff;
        font-weight: bold;
    }
    
    /* Temă pills pentru butoane */
    .pills-radio-group .btn {
        border-radius: 50px;
        padding: 0.5rem 1.5rem;
        border: none;
        background-color: #f0f0f0;
        color: #333;
        transition: all 0.3s;
    }
    
    .pills-radio-group .btn.active {
        background-color: #007bff;
        color: white;
        transform: scale(1.05);
    }
</style>

<div class="card-radio-group">
    <FODInputRadioGroup @bind-Value="cardValue" Options="@options" />
</div>

<div class="pills-radio-group">
    <FODInputRadioGroup @bind-Value="pillValue" 
                        Options="@options" 
                        Type="FodRadioType.Button" />
</div>
```

## Integrare cu FODInputRadio

FODInputRadioGroup folosește intern componenta `FODInputRadio` pentru fiecare opțiune:

```razor
<FODInputRadio Item="@item" 
               T="T" 
               Disable="@Disable" 
               LabelFontSize="LabelFontSize" 
               InputFontSize="InputFontSize" 
               Label="@GetItemLabel(item)" />
```

## Accesibilitate

- Folosește atribute ARIA corecte pentru radio groups
- Suportă navigare cu tastatura (săgeți)
- Label-uri asociate corect cu inputs
- Focus vizibil pentru navigare

## Best Practices

1. **Folosiți etichete clare** - Fiecare opțiune trebuie să fie ușor de înțeles
2. **Limitați opțiunile** - Pentru mai mult de 5-7 opțiuni, considerați un dropdown
3. **Ordonare logică** - Aranjați opțiunile într-o ordine intuitivă
4. **Validare adecvată** - Pentru câmpuri obligatorii, adăugați validare
5. **Feedback vizual** - Indicați clar opțiunea selectată

## Performanță

- Re-renderează doar când se schimbă selecția
- Pentru liste mari de opțiuni, considerați virtualizare
- Enum-urile sunt convertite o singură dată la inițializare

## Limitări

- Suportă doar selecție unică (pentru selecție multiplă folosiți checkbox)
- Nu suportă grupare de opțiuni
- Nu are suport pentru imagini în opțiuni

## Concluzie

FODInputRadioGroup oferă o soluție flexibilă pentru selecția unei singure opțiuni, cu suport pentru două moduri de afișare și integrare completă cu sistemul de formulare Blazor. Este ideală pentru chestionare, configuratoare și orice situație unde utilizatorul trebuie să aleagă între opțiuni mutual exclusive.