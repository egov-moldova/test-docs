# FodTextbox

## Descriere Generală

`FodTextbox` este o componentă simplă de input text care extinde `FODInput`. Oferă funcționalitatea de bază pentru introducerea textului, fiind o alternativă minimalistă la componente mai complexe precum `FODInputText`.

## Utilizare de Bază

```razor
<!-- Textbox simplu -->
<FodTextbox @bind-Value="text" />

<!-- Textbox cu label -->
<FodTextbox @bind-Value="name" Label="Nume" />

<!-- Textbox cu CSS personalizat -->
<FodTextbox @bind-Value="email" 
            CssClass="custom-input" 
            Label="Email" />
```

## Diferența față de FODInputText

| Caracteristică | FodTextbox | FODInputText |
|----------------|------------|--------------|
| Complexitate | Simplă | Completă |
| Validare integrată | Nu | Da (EditForm) |
| Wrapper | Nu | FODInputWrapper |
| Localizare erori | Nu | Da |
| Loading state | Nu | Da |
| Atribute IDNP/IDNO | Nu | Da |

## Exemple de Utilizare

### Input Text Simplu

```razor
<div class="form-group">
    <FodTextbox @bind-Value="username" 
                Label="Nume utilizator" />
    <p>Valoare curentă: @username</p>
</div>

@code {
    private string username = "";
}
```

### Formular de Contact

```razor
<div class="contact-form">
    <div class="mb-3">
        <FodTextbox @bind-Value="contactName" 
                    Label="Nume complet" />
    </div>
    
    <div class="mb-3">
        <FodTextbox @bind-Value="contactEmail" 
                    Label="Email" />
    </div>
    
    <div class="mb-3">
        <FodTextbox @bind-Value="contactPhone" 
                    Label="Telefon" />
    </div>
    
    <button @onclick="SubmitContact" class="btn btn-primary">
        Trimite
    </button>
</div>

@code {
    private string contactName = "";
    private string contactEmail = "";
    private string contactPhone = "";
    
    private void SubmitContact()
    {
        // Procesare date contact
        Console.WriteLine($"Contact: {contactName}, {contactEmail}, {contactPhone}");
    }
}
```

### Input cu Validare Manuală

```razor
<div class="validated-input">
    <FodTextbox @bind-Value="inputValue" 
                Label="Cod produs"
                @bind-Value:after="ValidateInput" />
    
    @if (!string.IsNullOrEmpty(validationMessage))
    {
        <div class="text-danger mt-1">@validationMessage</div>
    }
</div>

@code {
    private string inputValue = "";
    private string validationMessage = "";
    
    private void ValidateInput()
    {
        validationMessage = "";
        
        if (string.IsNullOrWhiteSpace(inputValue))
        {
            validationMessage = "Codul este obligatoriu";
        }
        else if (inputValue.Length < 5)
        {
            validationMessage = "Codul trebuie să aibă minim 5 caractere";
        }
        else if (!System.Text.RegularExpressions.Regex.IsMatch(inputValue, @"^[A-Z0-9]+$"))
        {
            validationMessage = "Codul poate conține doar litere mari și cifre";
        }
    }
}
```

### Căutare Simplă

```razor
<div class="search-box">
    <div class="input-group">
        <FodTextbox @bind-Value="searchTerm" 
                    CssClass="form-control"
                    @onkeyup="@(async (e) => { if (e.Key == "Enter") await Search(); })" />
        <button class="btn btn-primary" @onclick="Search">
            <i class="fas fa-search"></i> Caută
        </button>
    </div>
    
    @if (searchResults.Any())
    {
        <ul class="search-results mt-3">
            @foreach (var result in searchResults)
            {
                <li>@result</li>
            }
        </ul>
    }
</div>

@code {
    private string searchTerm = "";
    private List<string> searchResults = new();
    
    private async Task Search()
    {
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            // Simulare căutare
            await Task.Delay(500);
            searchResults = new List<string>
            {
                $"Rezultat 1 pentru '{searchTerm}'",
                $"Rezultat 2 pentru '{searchTerm}'",
                $"Rezultat 3 pentru '{searchTerm}'"
            };
        }
    }
}
```

### Input cu Formatare

```razor
<div class="formatted-inputs">
    <div class="mb-3">
        <FodTextbox @bind-Value="upperCaseText" 
                    Label="Text majuscule"
                    @bind-Value:after="() => upperCaseText = upperCaseText?.ToUpper()" />
    </div>
    
    <div class="mb-3">
        <FodTextbox @bind-Value="trimmedText" 
                    Label="Text fără spații"
                    @bind-Value:after="() => trimmedText = trimmedText?.Trim()" />
    </div>
    
    <div class="mb-3">
        <FodTextbox @bind-Value="maskedPhone" 
                    Label="Telefon formatat"
                    @bind-Value:after="FormatPhone" />
    </div>
</div>

@code {
    private string upperCaseText = "";
    private string trimmedText = "";
    private string maskedPhone = "";
    
    private void FormatPhone()
    {
        if (!string.IsNullOrEmpty(maskedPhone))
        {
            var digits = new string(maskedPhone.Where(char.IsDigit).ToArray());
            if (digits.Length >= 9)
            {
                maskedPhone = $"+373 {digits.Substring(0, 2)} {digits.Substring(2, 3)} {digits.Substring(5)}";
            }
        }
    }
}
```

### Grupare de Input-uri

```razor
<div class="address-form">
    <h4>Adresa de livrare</h4>
    
    <div class="row">
        <div class="col-md-8">
            <FodTextbox @bind-Value="address.Street" 
                        Label="Strada" />
        </div>
        <div class="col-md-4">
            <FodTextbox @bind-Value="address.Number" 
                        Label="Număr" />
        </div>
    </div>
    
    <div class="row mt-3">
        <div class="col-md-4">
            <FodTextbox @bind-Value="address.Block" 
                        Label="Bloc" />
        </div>
        <div class="col-md-4">
            <FodTextbox @bind-Value="address.Entrance" 
                        Label="Scara" />
        </div>
        <div class="col-md-4">
            <FodTextbox @bind-Value="address.Apartment" 
                        Label="Apartament" />
        </div>
    </div>
</div>

@code {
    private Address address = new();
    
    public class Address
    {
        public string Street { get; set; } = "";
        public string Number { get; set; } = "";
        public string Block { get; set; } = "";
        public string Entrance { get; set; } = "";
        public string Apartment { get; set; } = "";
    }
}
```

## Proprietăți Moștenite de la FODInput

- `Value` - Valoarea curentă (binding two-way)
- `Label` - Eticheta afișată
- `Id` - ID-ul elementului HTML
- `CssClass` - Clase CSS pentru stilizare
- `OnChange` - Eveniment la schimbare valoare
- `ValueChanged` - EventCallback pentru binding

## Stilizare

### CSS Implicit

```css
/* Stilizare de bază pentru FodTextbox */
.fod-textbox {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 16px;
}

.fod-textbox:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}
```

### Teme Personalizate

```razor
<style>
    /* Temă minimalistă */
    .minimal-input {
        border: none;
        border-bottom: 2px solid #ddd;
        border-radius: 0;
        padding: 5px 0;
        background: transparent;
        transition: border-color 0.3s;
    }
    
    .minimal-input:focus {
        border-bottom-color: #007bff;
        box-shadow: none;
    }
    
    /* Temă material */
    .material-input {
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        padding: 12px 16px;
        font-size: 16px;
        transition: all 0.3s;
    }
    
    .material-input:focus {
        border-color: #1976d2;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
</style>

<FodTextbox @bind-Value="minimalValue" 
            CssClass="minimal-input" 
            Label="Design minimalist" />

<FodTextbox @bind-Value="materialValue" 
            CssClass="material-input" 
            Label="Design material" />
```

## Când să Folosiți FodTextbox

### Folosiți FodTextbox când:
- Aveți nevoie de un input simplu fără validare complexă
- Nu folosiți EditForm
- Vreți control total asupra validării
- Construiți componente custom
- Performanța este critică

### Folosiți FODInputText când:
- Lucrați cu EditForm și DataAnnotations
- Aveți nevoie de validare integrată
- Folosiți atribute IDNP/IDNO/IDNV
- Aveți nevoie de loading states
- Vreți funcționalități complete

## Integrare cu JavaScript

```razor
@inject IJSRuntime JS

<FodTextbox @bind-Value="jsValue" 
            Id="jsTextbox"
            Label="Input cu JS" />

<button @onclick="FocusInput">Focus</button>
<button @onclick="SelectText">Selectează tot</button>

@code {
    private string jsValue = "";
    
    private async Task FocusInput()
    {
        await JS.InvokeVoidAsync("document.getElementById('jsTextbox').focus");
    }
    
    private async Task SelectText()
    {
        await JS.InvokeVoidAsync("document.getElementById('jsTextbox').select");
    }
}
```

## Limitări

- Nu are validare integrată cu EditForm
- Nu suportă mesaje de eroare localizate automat
- Nu are indicator de loading
- Nu are wrapper pentru layout consistent
- Necesită implementare manuală pentru funcții avansate

## Best Practices

1. **Folosiți pentru cazuri simple** - Nu complicați excesiv
2. **Adăugați validare când e nevoie** - Implementați manual
3. **Stilizare consistentă** - Folosiți clase CSS globale
4. **Accessibility** - Adăugați aria-label când lipsește Label
5. **Performanță** - Evitați re-renderări inutile

## Concluzie

FodTextbox este o componentă lightweight pentru input text, ideală pentru situații simple unde nu este necesară complexitatea completă a FODInputText. Oferă flexibilitate maximă cu overhead minim, fiind perfectă pentru formulare simple sau componente custom.