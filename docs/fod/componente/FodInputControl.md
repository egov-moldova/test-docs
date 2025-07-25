# FodInputControl

## Descriere Generală

`FodInputControl` este o componentă wrapper fundamentală pentru input-uri în FOD, oferind o structură consistentă pentru label, helper text, mesaje de eroare și counter-uri. Această componentă standardizează aspectul și comportamentul tuturor input-urilor din aplicație, asigurând o experiență uniformă pentru utilizatori.

## Caracteristici Principale

- **Layout consistent** - Structură uniformă pentru toate input-urile
- **Label floating** - Label animat care se ridică când input-ul are valoare
- **Helper text** - Text ajutător cu opțiune de afișare doar la focus
- **Erori și validare** - Afișare mesaje de eroare cu stil dedicat
- **Counter text** - Afișare număr caractere pentru input-uri cu limită
- **Variante vizuale** - Suport pentru Text, Filled și Outlined
- **Accesibilitate** - Atribute ARIA corecte pentru screen readers

## Utilizare de Bază

```razor
<FodInputControl Label="Nume utilizator" 
                 HelperText="Minim 3 caractere"
                 Required="true">
    <InputContent>
        <input type="text" class="fod-input" />
    </InputContent>
</FodInputControl>
```

## Atribute și Parametri

| Parametru | Tip | Valoare implicită | Descriere |
|-----------|-----|-------------------|-----------|
| `InputContent` | `RenderFragment` | - | Conținutul input-ului (câmpul propriu-zis) |
| `Label` | `string` | - | Eticheta pentru input |
| `HelperText` | `string` | - | Text ajutător afișat sub input |
| `HelperTextOnFocus` | `bool` | `false` | Afișează helper text doar la focus |
| `Error` | `bool` | `false` | Indică stare de eroare |
| `ErrorText` | `string` | - | Mesajul de eroare afișat |
| `ErrorId` | `string` | - | ID pentru aria-describedby |
| `CounterText` | `string` | - | Text pentru counter (ex: "10/100") |
| `Required` | `bool` | `false` | Marchează câmpul ca obligatoriu |
| `FullWidth` | `bool` | `false` | Ocupă toată lățimea containerului |
| `Variant` | `FodVariant` | `Text` | Stilul vizual (Text, Filled, Outlined) |
| `Margin` | `Margin` | `None` | Spațiere verticală |
| `Disabled` | `bool` | `false` | Dezactivează input-ul |
| `ForId` | `string` | - | ID-ul input-ului pentru label |
| `ChildContent` | `RenderFragment` | - | Conținut adițional |
| `Class` | `string` | - | Clase CSS adiționale |
| `Style` | `string` | - | Stiluri inline |
| `UserAttributes` | `Dictionary<string, object>` | - | Atribute HTML adiționale |

## Exemple de Utilizare

### Input Control cu Toate Funcționalitățile

```razor
<FodInputControl Label="Email" 
                 HelperText="Introduceți adresa de email validă"
                 Error="@hasError"
                 ErrorText="@errorMessage"
                 ErrorId="email-error"
                 CounterText="@($"{email?.Length ?? 0}/50")"
                 Required="true"
                 FullWidth="true"
                 Variant="FodVariant.Outlined"
                 ForId="email-input">
    <InputContent>
        <input id="email-input" 
               type="email" 
               class="fod-input" 
               @bind="email"
               @oninput="ValidateEmail" />
    </InputContent>
</FodInputControl>

@code {
    private string email;
    private bool hasError;
    private string errorMessage;
    
    private void ValidateEmail(ChangeEventArgs e)
    {
        email = e.Value?.ToString();
        if (string.IsNullOrEmpty(email))
        {
            hasError = true;
            errorMessage = "Email-ul este obligatoriu";
        }
        else if (!email.Contains("@"))
        {
            hasError = true;
            errorMessage = "Email invalid";
        }
        else
        {
            hasError = false;
            errorMessage = null;
        }
    }
}
```

### Variante Vizuale

```razor
<!-- Variant Text (implicit) -->
<FodInputControl Label="Text Input" Variant="FodVariant.Text">
    <InputContent>
        <input type="text" class="fod-input" />
    </InputContent>
</FodInputControl>

<!-- Variant Filled -->
<FodInputControl Label="Filled Input" Variant="FodVariant.Filled">
    <InputContent>
        <input type="text" class="fod-input" />
    </InputContent>
</FodInputControl>

<!-- Variant Outlined -->
<FodInputControl Label="Outlined Input" Variant="FodVariant.Outlined">
    <InputContent>
        <input type="text" class="fod-input" />
    </InputContent>
</FodInputControl>
```

### Helper Text cu Focus

```razor
<FodInputControl Label="Parolă" 
                 HelperText="Minim 8 caractere, o majusculă și o cifră"
                 HelperTextOnFocus="true">
    <InputContent>
        <input type="password" 
               class="fod-input" 
               @onfocus="ShowHelper"
               @onblur="HideHelper" />
    </InputContent>
</FodInputControl>

@code {
    private void ShowHelper() => StateHasChanged();
    private void HideHelper() => StateHasChanged();
}
```

### Input cu Counter

```razor
<FodInputControl Label="Descriere" 
                 CounterText="@($"{description?.Length ?? 0}/{maxLength}")">
    <InputContent>
        <textarea class="fod-input" 
                  @bind="description"
                  maxlength="@maxLength"></textarea>
    </InputContent>
</FodInputControl>

@code {
    private string description;
    private int maxLength = 500;
}
```

### Input Control cu Validare în EditForm

```razor
<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodInputControl Label="Nume complet" 
                     Required="true"
                     Error="@(editContext.GetValidationMessages(() => model.FullName).Any())"
                     ErrorText="@(editContext.GetValidationMessages(() => model.FullName).FirstOrDefault())"
                     FullWidth="true">
        <InputContent>
            <InputText @bind-Value="model.FullName" 
                      class="fod-input" 
                      id="fullname-input" />
        </InputContent>
    </FodInputControl>
    
    <FodButton Type="submit">Salvează</FodButton>
</EditForm>

@code {
    private UserModel model = new();
    private EditContext editContext;
    
    protected override void OnInitialized()
    {
        editContext = new EditContext(model);
    }
    
    public class UserModel
    {
        [Required(ErrorMessage = "Numele este obligatoriu")]
        [MinLength(3, ErrorMessage = "Numele trebuie să aibă minim 3 caractere")]
        public string FullName { get; set; }
    }
}
```

### Input Control Dezactivat

```razor
<FodInputControl Label="ID Utilizator" 
                 HelperText="Generat automat"
                 Disabled="true"
                 Variant="FodVariant.Filled">
    <InputContent>
        <input type="text" 
               class="fod-input" 
               value="USR-12345" 
               disabled />
    </InputContent>
</FodInputControl>
```

### Grupare Input Controls

```razor
<div class="form-section">
    <h3>Informații personale</h3>
    
    <FodInputControl Label="Prenume" 
                     Required="true"
                     Margin="Margin.Normal"
                     FullWidth="true">
        <InputContent>
            <input type="text" class="fod-input" @bind="firstName" />
        </InputContent>
    </FodInputControl>
    
    <FodInputControl Label="Nume" 
                     Required="true"
                     Margin="Margin.Normal"
                     FullWidth="true">
        <InputContent>
            <input type="text" class="fod-input" @bind="lastName" />
        </InputContent>
    </FodInputControl>
    
    <FodInputControl Label="Data nașterii" 
                     HelperText="Format: DD/MM/YYYY"
                     Margin="Margin.Normal">
        <InputContent>
            <input type="date" class="fod-input" @bind="birthDate" />
        </InputContent>
    </FodInputControl>
</div>

@code {
    private string firstName;
    private string lastName;
    private DateTime? birthDate;
}
```

### Input Control cu Conținut Personalizat

```razor
<FodInputControl Label="Selectați fișier" 
                 HelperText="Maxim 5MB, formate: PDF, DOC, DOCX">
    <InputContent>
        <div class="file-input-wrapper">
            <input type="file" 
                   id="file-input" 
                   class="d-none"
                   @onchange="HandleFileSelected" />
            <FodButton OnClick="() => fileInput.Click()">
                <FodIcon Icon="@FodIcons.Material.Filled.Upload" />
                Alege fișier
            </FodButton>
            @if (!string.IsNullOrEmpty(fileName))
            {
                <span class="ms-2">@fileName</span>
            }
        </div>
    </InputContent>
</FodInputControl>

@code {
    private string fileName;
    private ElementReference fileInput;
    
    private void HandleFileSelected(ChangeEventArgs e)
    {
        // Logică pentru procesare fișier
    }
}
```

### Input Control pentru Componente FOD

```razor
<!-- Cu FodTextField -->
<FodInputControl Label="Telefon" 
                 HelperText="Format: +373 XX XXX XXX"
                 Variant="FodVariant.Outlined">
    <InputContent>
        <FodInput1 @bind-Value="phoneNumber" 
                  Mask="@(new PatternMask("+373 00 000 000"))" />
    </InputContent>
</FodInputControl>

<!-- Cu FodSelect -->
<FodInputControl Label="Țara" Required="true">
    <InputContent>
        <FodSelect @bind-Value="selectedCountry">
            <FodSelectItem Value="MD">Moldova</FodSelectItem>
            <FodSelectItem Value="RO">România</FodSelectItem>
            <FodSelectItem Value="UA">Ucraina</FodSelectItem>
        </FodSelect>
    </InputContent>
</FodInputControl>
```

## Stilizare

### Clase CSS Generate

```css
/* Container principal */
.fod-input-control
.fod-input-control-full-width /* Full width */
.fod-input-control-margin-none/normal/dense /* Margin */
.fod-input-required /* Câmp obligatoriu */
.fod-input-error /* Stare de eroare */

/* Container input */
.fod-input-control-input-container

/* Helper container */
.fod-input-control-helper-container
.px-1 /* Pentru Filled */
.px-2 /* Pentru Outlined */

/* Helper text */
.fod-input-helper-text
.fod-input-helper-onfocus /* Vizibil doar la focus */

/* Label */
.fod-input-label-inputcontrol
```

### Personalizare CSS

```css
/* Stil pentru required */
.fod-input-required .fod-input-label-inputcontrol:after {
    content: " *";
    color: var(--fod-palette-error-main);
}

/* Animație pentru label */
.fod-input-control .fod-input-label-inputcontrol {
    transition: all 0.2s ease-out;
}

/* Helper text stilizat */
.fod-input-helper-text {
    font-size: 0.75rem;
    margin-top: 3px;
    color: var(--fod-palette-text-secondary);
}

/* Error state */
.fod-input-error .fod-input-helper-text {
    color: var(--fod-palette-error-main);
}

/* Counter aliniere */
.fod-input-control-helper-container .ms-auto {
    font-size: 0.75rem;
    color: var(--fod-palette-text-disabled);
}
```

## Integrare cu Componente FOD

FodInputControl este folosit intern de majoritatea componentelor de input FOD:
- FodTextField
- FodSelect
- FodDatePicker
- FodAutocomplete
- Și altele

## Best Practices

1. **Folosiți Label descriptiv** - Ajută utilizatorii și screen readers
2. **HelperText util** - Oferiți indicii clare despre format sau cerințe
3. **Erori specifice** - Mesaje clare despre ce este greșit
4. **ForId pentru accesibilitate** - Asociați label cu input
5. **Variant consistent** - Mențineți același stil în aplicație
6. **Required vizual** - Indicați clar câmpurile obligatorii

## Accesibilitate

- Label asociat corect cu input prin `for` și `id`
- Mesaje de eroare anunțate prin `aria-describedby`
- Stare dezactivată comunicată corect
- Suport complet pentru navigare cu tastatura

## Troubleshooting

### Label-ul nu se ridică
- Verificați că input-ul are clasele CSS corecte
- Verificați că Variant este setat corect

### Helper text nu apare la focus
- Setați `HelperTextOnFocus="true"`
- Verificați evenimentele focus/blur pe input

### Counter nu se actualizează
- Actualizați manual CounterText în evenimentele input
- Folosiți binding two-way pentru valoare

## Concluzie

FodInputControl este fundația sistemului de input-uri în FOD, oferind o structură consistentă și funcționalități complete pentru toate tipurile de câmpuri. Folosirea sa asigură o experiență uniformă și profesională în întreaga aplicație.