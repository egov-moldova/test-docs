# FodTextField

## Descriere Generală

`FodTextField<T>` este o componentă avansată de input text în Blazor care extinde funcționalitățile standard cu suport pentru debouncing, măști de input, validare, adornments și multe alte caracteristici. Este componenta principală pentru majoritatea input-urilor text din aplicațiile FOD.

## Caracteristici Principale

- **Generică** - Suportă orice tip de date prin convertor
- **Debouncing** - Întârziere configurabilă pentru actualizarea valorii
- **Măști de input** - Suport pentru formatare automată (telefon, dată, etc.)
- **Validare integrată** - Cu suport pentru EditContext și DataAnnotations
- **Adornments** - Pictograme și text adițional
- **Multiple linii** - Poate funcționa ca textarea
- **Counter** - Afișare număr caractere
- **Clearable** - Buton pentru ștergere rapidă

## Utilizare de Bază

```razor
<FodTextField @bind-Value="userName" 
              Label="Nume utilizator" 
              Placeholder="Introduceți numele" />

@code {
    private string userName;
}
```

## Atribute și Parametri

| Parametru | Tip | Valoare implicită | Descriere |
|-----------|-----|-------------------|-----------|
| `Value` | `T` | - | Valoarea curentă |
| `ValueChanged` | `EventCallback<T>` | - | Eveniment pentru two-way binding |
| `Label` | `string` | - | Eticheta câmpului |
| `Placeholder` | `string` | - | Text placeholder |
| `HelperText` | `string` | - | Text ajutător sub câmp |
| `HelperTextOnFocus` | `bool` | `false` | Afișează helper text doar la focus |
| `Variant` | `Variant` | `Text` | Stilul vizual (Text, Filled, Outlined) |
| `Margin` | `Margin` | `None` | Spațiere margin |
| `InputType` | `InputType` | `Text` | Tipul HTML5 de input |
| `Lines` | `int` | `1` | Număr de linii pentru textarea |
| `MaxLength` | `int?` | - | Lungime maximă |
| `Counter` | `int?` | - | Afișează counter caractere |
| `Disabled` | `bool` | `false` | Dezactivează câmpul |
| `ReadOnly` | `bool` | `false` | Doar citire |
| `Required` | `bool` | `false` | Câmp obligatoriu |
| `Error` | `bool` | `false` | Stare de eroare |
| `ErrorText` | `string` | - | Mesaj de eroare |
| `Immediate` | `bool` | `false` | Actualizare imediată (la fiecare tastă) |
| `DebounceInterval` | `double` | `0` | Interval debounce în ms |
| `Clearable` | `bool` | `false` | Afișează buton de ștergere |
| `Mask` | `IMask` | - | Mască de formatare |
| `Pattern` | `string` | - | Pattern HTML5 pentru validare |
| `Adornment` | `Adornment` | `None` | Poziție adornment (Start/End) |
| `AdornmentIcon` | `string` | - | Pictogramă pentru adornment |
| `AdornmentText` | `string` | - | Text pentru adornment |
| `AdornmentColor` | `FodColor` | `Default` | Culoare adornment |
| `OnAdornmentClick` | `EventCallback` | - | Click pe adornment |
| `TextUpdateSuppression` | `bool` | `true` | Suprimă actualizarea în timpul tastării |
| `OnDebounceIntervalElapsed` | `EventCallback<string>` | - | Callback după debounce |

## Exemple de Utilizare

### Input Text Simplu

```razor
<FodTextField @bind-Value="firstName" 
              Label="Prenume" 
              Required="true" />

<FodTextField @bind-Value="lastName" 
              Label="Nume" 
              HelperText="Introduceți numele de familie" />

@code {
    private string firstName;
    private string lastName;
}
```

### Input cu Variantă și Margin

```razor
<FodTextField @bind-Value="email" 
              Label="Email" 
              Variant="Variant.Outlined"
              Margin="Margin.Dense"
              InputType="InputType.Email" />

<FodTextField @bind-Value="phone" 
              Label="Telefon" 
              Variant="Variant.Filled"
              Margin="Margin.Normal" />
```

### Textarea Multi-linie

```razor
<FodTextField @bind-Value="description" 
              Label="Descriere" 
              Lines="5"
              MaxLength="500"
              Counter="500"
              HelperText="Maxim 500 caractere" />

@code {
    private string description;
}
```

### Input cu Debouncing

```razor
<FodTextField @bind-Value="searchTerm" 
              Label="Căutare" 
              Placeholder="Introduceți termenii de căutare..."
              DebounceInterval="500"
              OnDebounceIntervalElapsed="@PerformSearch"
              Immediate="true" />

@code {
    private string searchTerm;
    
    private async Task PerformSearch(string value)
    {
        // Execută căutarea după 500ms de la ultima tastare
        await SearchService.SearchAsync(value);
    }
}
```

### Input cu Mască

```razor
<!-- Mască pentru telefon -->
<FodTextField @bind-Value="phoneNumber" 
              Label="Număr telefon" 
              Mask="@(new PatternMask("0000 000 000"))" />

<!-- Mască pentru dată -->
<FodTextField @bind-Value="birthDate" 
              Label="Data nașterii" 
              Mask="@(new DateMask("dd/MM/yyyy"))" />

<!-- Mască pentru card bancar -->
<FodTextField @bind-Value="cardNumber" 
              Label="Număr card" 
              Mask="@(new PatternMask("0000 0000 0000 0000"))" />

@code {
    private string phoneNumber;
    private string birthDate;
    private string cardNumber;
}
```

### Input cu Adornments

```razor
<!-- Adornment la început -->
<FodTextField @bind-Value="amount" 
              Label="Suma" 
              Adornment="Adornment.Start"
              AdornmentText="MDL" />

<!-- Adornment la sfârșit cu pictogramă -->
<FodTextField @bind-Value="password" 
              Label="Parolă" 
              InputType="@passwordInputType"
              Adornment="Adornment.End"
              AdornmentIcon="@passwordIcon"
              OnAdornmentClick="TogglePasswordVisibility" />

<!-- Adornment pentru căutare -->
<FodTextField @bind-Value="search" 
              Label="Căutare" 
              Adornment="Adornment.Start"
              AdornmentIcon="@FodIcons.Material.Filled.Search"
              AdornmentColor="FodColor.Primary" />

@code {
    private decimal amount;
    private string password;
    private string search;
    private InputType passwordInputType = InputType.Password;
    private string passwordIcon = FodIcons.Material.Filled.Visibility;
    
    private void TogglePasswordVisibility()
    {
        if (passwordInputType == InputType.Password)
        {
            passwordInputType = InputType.Text;
            passwordIcon = FodIcons.Material.Filled.VisibilityOff;
        }
        else
        {
            passwordInputType = InputType.Password;
            passwordIcon = FodIcons.Material.Filled.Visibility;
        }
    }
}
```

### Input cu Validare

```razor
<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodTextField @bind-Value="model.Email" 
                  Label="Email" 
                  Required="true"
                  InputType="InputType.Email" />
    
    <FodTextField @bind-Value="model.Username" 
                  Label="Nume utilizator" 
                  Pattern="^[a-zA-Z0-9_]{3,20}$"
                  HelperText="3-20 caractere, litere, cifre și _" />
    
    <FodTextField @bind-Value="model.Age" 
                  Label="Vârstă" 
                  InputType="InputType.Number" />
    
    <FodButton Type="ButtonType.Submit">Trimite</FodButton>
</EditForm>

@code {
    private UserModel model = new();
    
    public class UserModel
    {
        [Required(ErrorMessage = "Email-ul este obligatoriu")]
        [EmailAddress(ErrorMessage = "Email invalid")]
        public string Email { get; set; }
        
        [Required(ErrorMessage = "Username-ul este obligatoriu")]
        [RegularExpression("^[a-zA-Z0-9_]{3,20}$", 
            ErrorMessage = "Username invalid")]
        public string Username { get; set; }
        
        [Range(18, 120, ErrorMessage = "Vârsta trebuie să fie între 18 și 120")]
        public int Age { get; set; }
    }
}
```

### Input Clearable

```razor
<FodTextField @bind-Value="searchQuery" 
              Label="Căutare rapidă" 
              Clearable="true"
              OnClearButtonClick="@OnSearchCleared"
              Adornment="Adornment.Start"
              AdornmentIcon="@FodIcons.Material.Filled.Search" />

@code {
    private string searchQuery;
    
    private void OnSearchCleared(MouseEventArgs args)
    {
        // Logică adițională după ștergere
        Console.WriteLine("Căutarea a fost ștearsă");
    }
}
```

### Formular Complex

```razor
<FodGrid Container="true" Spacing="2">
    <FodGrid Item="true" xs="12" sm="6">
        <FodTextField @bind-Value="contact.FirstName" 
                      Label="Prenume" 
                      Required="true"
                      Variant="Variant.Outlined" />
    </FodGrid>
    
    <FodGrid Item="true" xs="12" sm="6">
        <FodTextField @bind-Value="contact.LastName" 
                      Label="Nume" 
                      Required="true"
                      Variant="Variant.Outlined" />
    </FodGrid>
    
    <FodGrid Item="true" xs="12">
        <FodTextField @bind-Value="contact.Email" 
                      Label="Email" 
                      InputType="InputType.Email"
                      Required="true"
                      Variant="Variant.Outlined"
                      HelperText="Vom folosi email-ul pentru confirmare" />
    </FodGrid>
    
    <FodGrid Item="true" xs="12" sm="6">
        <FodTextField @bind-Value="contact.Phone" 
                      Label="Telefon" 
                      Mask="@(new PatternMask("+373 00 000 000"))"
                      Variant="Variant.Outlined" />
    </FodGrid>
    
    <FodGrid Item="true" xs="12" sm="6">
        <FodTextField @bind-Value="contact.BirthDate" 
                      Label="Data nașterii" 
                      InputType="InputType.Date"
                      Variant="Variant.Outlined" />
    </FodGrid>
    
    <FodGrid Item="true" xs="12">
        <FodTextField @bind-Value="contact.Address" 
                      Label="Adresă" 
                      Lines="2"
                      Variant="Variant.Outlined" />
    </FodGrid>
    
    <FodGrid Item="true" xs="12">
        <FodTextField @bind-Value="contact.Notes" 
                      Label="Note adiționale" 
                      Lines="4"
                      MaxLength="1000"
                      Counter="1000"
                      Variant="Variant.Outlined"
                      HelperTextOnFocus="true"
                      HelperText="Introduceți orice informații relevante" />
    </FodGrid>
</FodGrid>
```

### Input cu Focus Programatic

```razor
<FodTextField @ref="nameField"
              @bind-Value="name" 
              Label="Nume complet" />

<FodButton OnClick="FocusNameField">
    Focus pe câmpul nume
</FodButton>

<FodButton OnClick="SelectAllText">
    Selectează tot textul
</FodButton>

@code {
    private FodTextField<string> nameField;
    private string name;
    
    private async Task FocusNameField()
    {
        await nameField.FocusAsync();
    }
    
    private async Task SelectAllText()
    {
        await nameField.SelectAsync();
    }
}
```

### Different Input Types

```razor
<!-- Numeric -->
<FodTextField @bind-Value="quantity" 
              Label="Cantitate" 
              InputType="InputType.Number" />

<!-- URL -->
<FodTextField @bind-Value="website" 
              Label="Website" 
              InputType="InputType.Url"
              HelperText="ex: https://example.com" />

<!-- Color -->
<FodTextField @bind-Value="themeColor" 
              Label="Culoare temă" 
              InputType="InputType.Color" />

<!-- Time -->
<FodTextField @bind-Value="meetingTime" 
              Label="Ora întâlnirii" 
              InputType="InputType.Time" />

<!-- Month -->
<FodTextField @bind-Value="selectedMonth" 
              Label="Luna" 
              InputType="InputType.Month" />
```

## Stilizare

### Clase CSS Generate

```css
.fod-textfield
.fod-input-control
.fod-input-control-margin-dense
.fod-input-control-margin-normal
.fod-input-control-margin-none
.fod-textfield-error
.fod-textfield-disabled
```

### Personalizare

```css
/* Input personalizat */
.custom-textfield .fod-input-input {
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
}

/* Helper text stilizat */
.custom-textfield .fod-input-helper-text {
    font-style: italic;
    color: var(--fod-palette-info-main);
}

/* Adornment personalizat */
.custom-textfield .fod-input-adornment {
    color: var(--fod-palette-primary-main);
    font-weight: bold;
}
```

## Funcționalități Avansate

### Conversie Automată de Tip

```razor
<!-- String la număr -->
<FodTextField @bind-Value="age" Label="Vârstă" />

<!-- String la dată -->
<FodTextField @bind-Value="birthDate" 
              Label="Data nașterii" 
              InputType="InputType.Date" />

<!-- String la boolean -->
<FodTextField @bind-Value="isActive" 
              Label="Activ (true/false)" />

@code {
    private int age;
    private DateTime birthDate;
    private bool isActive;
}
```

### Validare Customizată

```razor
<FodTextField @bind-Value="idnp" 
              Label="IDNP" 
              Validation="@ValidateIDNP"
              HelperText="13 cifre" />

@code {
    private string idnp;
    
    private IEnumerable<string> ValidateIDNP(string value)
    {
        if (string.IsNullOrEmpty(value))
            yield return "IDNP este obligatoriu";
        else if (value.Length != 13)
            yield return "IDNP trebuie să aibă 13 cifre";
        else if (!value.All(char.IsDigit))
            yield return "IDNP poate conține doar cifre";
    }
}
```

## Best Practices

1. **Folosiți Label descriptiv** - Ajută utilizatorii să înțeleagă ce să introducă
2. **Adăugați HelperText** - Pentru instrucțiuni suplimentare
3. **Validare clară** - Mesaje de eroare specifice
4. **Debouncing pentru căutare** - Evitați request-uri excesive
5. **Măști pentru formate specifice** - Telefoane, date, carduri
6. **Placeholder doar când necesar** - Nu duplicați Label-ul

## Accesibilitate

- Suport complet pentru screen readers
- Navigare cu tastatura
- ARIA labels automate
- Asociere label-input corectă

## Performanță

- Debouncing reduce re-render-urile
- TextUpdateSuppression optimizează actualizările
- Lazy loading pentru măști complexe

## Troubleshooting

### Valoarea nu se actualizează
- Verificați @bind-Value sintaxa
- Verificați tipul de date și conversia

### Masca nu funcționează
- Verificați formatul măștii
- Asigurați-vă că tipul este string

### Validarea nu apare
- Verificați că este într-un EditForm
- Adăugați DataAnnotationsValidator

## Concluzie

FodTextField este componenta fundamentală pentru input-uri text în aplicațiile FOD, oferind funcționalități complete pentru orice scenariu de colectare date text. Cu suport pentru validare, măști, debouncing și multe alte caracteristici, acoperă toate nevoile moderne de formulare web.