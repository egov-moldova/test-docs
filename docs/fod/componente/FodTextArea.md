# TextArea

## Documentație pentru componentele de text multilinie (FodTextArea și FodTextField cu Lines)

### 1. Descriere Generală
Sistemul FOD Components oferă două modalități principale pentru implementarea câmpurilor de text multilinie:
- `FodTextArea` - Componentă specializată pentru scenarii specifice (feedback)
- `FodTextField` cu parametrul `Lines > 1` - Soluția recomandată pentru utilizare generală

Caracteristici principale:
- Suport pentru multiple linii de text
- Validare lungime maximă cu contor de caractere
- Integrare completă cu sistemul de formulare Blazor
- Stilizare consistentă cu alte componente FOD
- Suport pentru placeholder și helper text
- Validare în timp real
- Controlul spell-check
- Stări disabled și readonly

### 2. Ghid de Utilizare API

#### TextArea de bază cu FodTextField
```razor
<FodTextField @bind-Value="description"
              Lines="5"
              Label="Descriere"
              Placeholder="Introduceți o descriere detaliată..." />

@code {
    private string description = string.Empty;
}
```

#### TextArea cu contor de caractere
```razor
<FodTextField @bind-Value="comment"
              Lines="4"
              Label="Comentariu"
              Counter="500"
              HelperText="Maxim 500 caractere" />

@code {
    private string comment = string.Empty;
}
```

#### TextArea cu validare în formular
```razor
<EditForm Model="model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodTextField @bind-Value="model.Description"
                  Lines="6"
                  Label="Descriere proiect"
                  Counter="1000"
                  Required="true"
                  For="@(() => model.Description)" />
    
    <ValidationMessage For="@(() => model.Description)" />
    
    <FodButton Type="submit" Variant="FodVariant.Filled" Color="FodColor.Primary">
        Salvează
    </FodButton>
</EditForm>

@code {
    public class ProjectModel
    {
        [Required(ErrorMessage = "Descrierea este obligatorie")]
        [MaxLength(1000, ErrorMessage = "Descrierea nu poate depăși 1000 caractere")]
        [MinLength(50, ErrorMessage = "Descrierea trebuie să aibă minim 50 caractere")]
        public string Description { get; set; } = string.Empty;
    }
    
    private ProjectModel model = new();
}
```

#### TextArea cu dimensiuni diferite
```razor
<!-- TextArea mică (3 rânduri) -->
<FodTextField @bind-Value="shortNote"
              Lines="3"
              Label="Notă scurtă"
              Variant="FodVariant.Outlined" />

<!-- TextArea medie (5 rânduri) -->
<FodTextField @bind-Value="mediumText"
              Lines="5"
              Label="Descriere"
              Variant="FodVariant.Filled" />

<!-- TextArea mare (10 rânduri) -->
<FodTextField @bind-Value="longText"
              Lines="10"
              Label="Conținut articol"
              Variant="FodVariant.Text" />
```

#### TextArea cu stiluri diferite
```razor
<!-- Variant Outlined (implicit) -->
<FodTextField @bind-Value="text1"
              Lines="4"
              Label="Text cu chenar"
              Variant="FodVariant.Outlined" />

<!-- Variant Filled -->
<FodTextField @bind-Value="text2"
              Lines="4"
              Label="Text cu fundal"
              Variant="FodVariant.Filled" />

<!-- Variant Underline -->
<FodTextField @bind-Value="text3"
              Lines="4"
              Label="Text cu linie"
              Variant="FodVariant.Underline" />
```

#### FodTextArea pentru feedback
```razor
<FodTextArea @bind-Value="feedbackMessage"
             MaxLength="500"
             Placeholder="Împărtășiți-ne părerea dvs..."
             SpellCheck="false"
             Label="Mesajul dvs."
             Class="form-control resize-none bg-white-gray rounded-4"
             ErrorRawLabel="@GetErrorMessage()" />

@code {
    private string feedbackMessage = string.Empty;
    
    private string GetErrorMessage()
    {
        if (feedbackMessage.Length > 500)
            return $"Ați depășit limita cu {feedbackMessage.Length - 500} caractere<br/>Vă rugăm să scurtați mesajul";
        return string.Empty;
    }
}
```

#### TextArea cu adornments
```razor
<FodTextField @bind-Value="address"
              Lines="3"
              Label="Adresă completă"
              Adornment="Adornment.Start"
              AdornmentIcon="@FodIcons.Material.Filled.LocationOn"
              HelperText="Includeți strada, numărul, orașul și codul poștal" />
```

#### TextArea readonly și disabled
```razor
<!-- Readonly - utilizatorul poate selecta textul dar nu-l poate modifica -->
<FodTextField Value="Text readonly care poate fi selectat și copiat"
              Lines="4"
              Label="Termen și condiții"
              ReadOnly="true" />

<!-- Disabled - complet dezactivat -->
<FodTextField Value="Text dezactivat"
              Lines="4"
              Label="Câmp inactiv"
              Disabled="true" />
```

#### TextArea cu actualizare imediată
```razor
<FodTextField @bind-Value="liveText"
              Lines="4"
              Label="Text live"
              Immediate="true"
              OnValueChanged="@((string value) => HandleLiveUpdate(value))" />

<div class="mt-2">
    <small>Caractere: @liveText.Length</small>
</div>

@code {
    private string liveText = string.Empty;
    
    private void HandleLiveUpdate(string value)
    {
        Console.WriteLine($"Text actualizat: {value}");
    }
}
```

#### TextArea cu validare personalizată
```razor
<FodTextField @bind-Value="customText"
              Lines="5"
              Label="Text cu validare specială"
              ValidationFunc="@ValidateNoUrls"
              HelperText="Nu sunt permise URL-uri în text" />

@code {
    private string customText = string.Empty;
    
    private string ValidateNoUrls(string value)
    {
        if (string.IsNullOrEmpty(value))
            return null;
            
        var urlPattern = @"https?://|www\.";
        if (System.Text.RegularExpressions.Regex.IsMatch(value, urlPattern))
            return "Textul nu poate conține URL-uri";
            
        return null;
    }
}
```

#### TextArea în dialog modal
```razor
<FodModal Show="showModal">
    <FodModalContent>
        <FodModalHeader>
            <FodText Typo="Typo.h5">Adaugă comentariu</FodText>
        </FodModalHeader>
        <FodModalBody>
            <FodTextField @bind-Value="modalComment"
                          Lines="6"
                          Label="Comentariu"
                          Counter="300"
                          Required="true"
                          AutoFocus="true" />
        </FodModalBody>
        <FodModalFooter>
            <FodButton OnClick="SaveComment" 
                       Variant="FodVariant.Filled" 
                       Color="FodColor.Primary">
                Salvează
            </FodButton>
            <FodButton OnClick="@(() => showModal = false)">
                Anulează
            </FodButton>
        </FodModalFooter>
    </FodModalContent>
</FodModal>
```

### 3. Atribute disponibile

#### FodTextField (cu Lines > 1)
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Lines` | `int` | Numărul de rânduri vizibile | `1` |
| `Value` | `string` | Valoarea textului | `string.Empty` |
| `Label` | `string` | Eticheta câmpului | `null` |
| `Placeholder` | `string` | Text placeholder | `null` |
| `HelperText` | `string` | Text ajutător sub câmp | `null` |
| `Counter` | `int?` | Afișează contor caractere | `null` |
| `MaxLength` | `int` | Lungime maximă text | `524288` |
| `Required` | `bool` | Câmp obligatoriu | `false` |
| `Disabled` | `bool` | Dezactivează câmpul | `false` |
| `ReadOnly` | `bool` | Doar citire | `false` |
| `Variant` | `FodVariant` | Stil vizual | `Outlined` |
| `Immediate` | `bool` | Actualizare la fiecare tastă | `false` |
| `AutoFocus` | `bool` | Focus automat | `false` |
| `SpellCheck` | `bool?` | Verificare ortografică | `null` |
| `ValidationFunc` | `Func<string, string>` | Funcție validare custom | `null` |

#### FodTextArea
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `string` | Valoarea textului | `string.Empty` |
| `Label` | `string` | Eticheta câmpului | `null` |
| `Placeholder` | `string` | Text placeholder | `null` |
| `MaxLength` | `int?` | Lungime maximă | `null` |
| `SpellCheck` | `bool` | Verificare ortografică | `true` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `ErrorRawLabel` | `string` | HTML pentru erori | `null` |

### 4. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `ValueChanged` | `EventCallback<string>` | La schimbarea textului |
| `OnValueChanged` | `EventCallback<string>` | Callback după schimbare |
| `OnBlur` | `EventCallback<FocusEventArgs>` | La pierderea focusului |
| `OnKeyDown` | `EventCallback<KeyboardEventArgs>` | La apăsare tastă |
| `OnKeyUp` | `EventCallback<KeyboardEventArgs>` | La eliberare tastă |

### 5. Stilizare și personalizare

```css
/* TextArea cu înălțime fixă */
.fixed-height-textarea .fod-input-root-multiline {
    height: 200px !important;
    overflow-y: auto;
}

/* TextArea cu resize vertical */
.resizable-textarea .fod-input-root-multiline {
    resize: vertical;
    min-height: 100px;
    max-height: 400px;
}

/* Stil personalizat pentru contor */
.custom-counter .fod-input-helper-text {
    text-align: right;
    font-weight: bold;
}

/* Highlighting pentru limită apropiată */
.custom-counter .fod-input-helper-text {
    color: var(--fod-warning);
}

/* TextArea cu font monospaced pentru cod */
.code-textarea .fod-input-root-multiline {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 14px;
    line-height: 1.5;
}
```

### 6. Validare avansată

```razor
<EditForm Model="model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <!-- Validare cu atribute -->
    <FodTextField @bind-Value="model.Content"
                  Lines="8"
                  Label="Conținut articol"
                  Counter="2000"
                  For="@(() => model.Content)" />
    
    <!-- Validare în timp real -->
    <FodTextField @bind-Value="model.Summary"
                  Lines="3"
                  Label="Rezumat"
                  ValidationFunc="@ValidateSummary"
                  HelperText="Minim 20, maxim 200 caractere" />
</EditForm>

@code {
    public class ArticleModel
    {
        [Required(ErrorMessage = "Conținutul este obligatoriu")]
        [MinLength(100, ErrorMessage = "Minim 100 caractere")]
        [MaxLength(2000, ErrorMessage = "Maxim 2000 caractere")]
        public string Content { get; set; } = string.Empty;
        
        public string Summary { get; set; } = string.Empty;
    }
    
    private string ValidateSummary(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return "Rezumatul este obligatoriu";
        if (value.Length < 20)
            return $"Încă {20 - value.Length} caractere";
        if (value.Length > 200)
            return "Rezumatul este prea lung";
        return null;
    }
}
```

### 7. Integrare cu alte componente

#### În Card
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" Class="mb-3">Lasă o recenzie</FodText>
        <FodTextField @bind-Value="review.Text"
                      Lines="6"
                      Label="Părerea ta"
                      Counter="500"
                      Placeholder="Descrie experiența ta..." />
        <FodRating @bind-Value="review.Rating" Class="mt-3" />
    </FodCardContent>
    <FodCardActions>
        <FodButton OnClick="SubmitReview" 
                   Variant="FodVariant.Filled" 
                   Color="FodColor.Primary">
            Trimite recenzia
        </FodButton>
    </FodCardActions>
</FodCard>
```

### 8. Diferențe între FodTextField și FodTextArea

| Caracteristică | FodTextField (Lines > 1) | FodTextArea |
|---------------|-------------------------|-------------|
| Utilizare recomandată | General, toate scenariile | Specializat (feedback) |
| Funcționalități | Complete | Limitate |
| Integrare formular | Completă | De bază |
| Contor caractere | Da | Nu |
| Variante stilizare | Toate (Outlined, Filled, etc.) | CSS custom |
| Validare | Completă | Doar MaxLength |

### 9. Note și observații

- Pentru utilizare generală, folosiți `FodTextField` cu `Lines > 1`
- `FodTextArea` este specializat pentru scenarii de feedback
- Contorul de caractere se actualizează în timp real
- Resize-ul manual este dezactivat implicit pentru consistență
- MaxLength implicit este foarte mare (524288) pentru a evita limitări nedorite

### 10. Accesibilitate

- Label-uri asociate corect cu textarea
- Suport pentru atribute ARIA
- Navigare cu tastatură completă
- Anunțuri pentru screen readers la depășirea limitei

### 11. Bune practici

1. **Dimensiune adecvată** - Setați `Lines` în funcție de conținutul așteptat
2. **Limite rezonabile** - Folosiți `Counter` și `MaxLength` pentru a ghida utilizatorii
3. **Helper text** - Oferiți indicații clare despre conținutul așteptat
4. **Validare utilă** - Implementați validări care ajută, nu frustrează
5. **Placeholder descriptiv** - Ajută utilizatorii să înțeleagă ce să scrie
6. **Feedback vizual** - Folosiți contorul pentru feedback în timp real

### 12. Troubleshooting

#### TextArea nu afișează toate rândurile
- Verificați valoarea parametrului `Lines`
- Verificați că nu aveți CSS care suprascrie înălțimea

#### Contorul nu apare
- Setați parametrul `Counter` cu valoarea maximă dorită
- Verificați că nu aveți CSS care ascunde helper text

#### Validarea nu funcționează
- Pentru FodTextField, folosiți `For` parameter
- Asigurați-vă că aveți `DataAnnotationsValidator` în EditForm

### 13. Concluzie
Sistemul de componente pentru text multilinie oferă flexibilitate maximă prin `FodTextField` cu parametrul `Lines`, acoperind toate scenariile de la simple note până la editoare de conținut complex, cu suport complet pentru validare, stilizare și integrare în formulare.