# FodInput

## Descriere Generală

`FodInput` este componenta principală pentru câmpuri de input în FOD.Components. Oferă suport complet pentru diverse tipuri de input HTML5, validare, adornments (icoane/text), și integrare completă cu formulare Blazor. Componenta moștenește din `FodBaseInput<T>` și suportă binding bidirecțional cu tipuri generice.

## Utilizare de Bază

```razor
<!-- Input text simplu -->
<FodInput @bind-Value="nume" Label="Nume" />

<!-- Input cu placeholder -->
<FodInput @bind-Value="email" 
          Label="Email" 
          Placeholder="exemplu@email.com" />

<!-- Input număr -->
<FodInput @bind-Value="varsta" 
          Label="Vârstă" 
          InputType="InputType.Number" />

<!-- Input cu validare -->
<FodInput @bind-Value="telefon" 
          Label="Telefon"
          Pattern="[0-9]{10}"
          HelperText="Introduceți 10 cifre" />
```

## Atribute Disponibile

### Proprietăți de Bază

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Value | T | - | Valoarea input-ului (generic) |
| Text | string | - | Reprezentarea text a valorii |
| Label | string | - | Eticheta câmpului |
| Placeholder | string | - | Text placeholder |
| HelperText | string | - | Text ajutător sub câmp |
| HelperTextOnFocus | bool | false | Arată helper doar la focus |
| Required | bool | false | Câmp obligatoriu |
| RequiredError | string | "Required" | Mesaj eroare câmp obligatoriu |
| Error | bool | false | Stare de eroare |
| ErrorText | string | - | Text eroare personalizat |
| ErrorId | string | - | ID pentru aria-describedby |

### Proprietăți Input

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| InputType | InputType | Text | Tipul input-ului HTML5 |
| Pattern | string | - | Pattern regex pentru validare |
| MaxLength | int? | - | Lungime maximă caractere |
| Lines | int | 1 | Număr linii (pentru textarea) |
| InputMode | InputMode | text | Mod tastatură mobilă |
| Format | string | - | Format pentru afișare valoare |
| Culture | CultureInfo | - | Cultura pentru formatare |

### Stare și Comportament

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Disabled | bool | false | Dezactivează input-ul |
| ReadOnly | bool | false | Doar citire |
| Immediate | bool | false | Actualizare imediată la tastare |
| Debounce | int | 0 | Întârziere actualizare (ms) |
| OnlyValidateIfDirty | bool | false | Validează doar după modificare |
| TextUpdateSuppression | bool | true | Suprimă actualizări text în server |

### Aspect și Stil

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Variant | FodVariant | Text | Stil vizual (Text, Filled, Outlined) |
| Margin | Margin | None | Spațiere (None, Dense, Normal) |
| FullWidth | bool | false | Ocupă lățimea container-ului |
| DisableUnderLine | bool | false | Ascunde linia de sub câmp |
| Class | string | - | Clase CSS adiționale |
| Style | string | - | Stiluri CSS inline |

### Adornments

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Adornment | Adornment | None | Poziție adornment (Start/End) |
| AdornmentIcon | string | - | Iconița pentru adornment |
| AdornmentText | string | - | Text pentru adornment |
| AdornmentColor | FodColor | Default | Culoare adornment |
| AdornmentAriaLabel | string | - | Aria label pentru adornment |
| IconSize | FodSize | Medium | Dimensiune iconiță |

### Funcționalități Numerice

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| HideSpinButtons | bool | true | Ascunde butoane increment/decrement |
| NumericUpIcon | string | KeyboardArrowUp | Iconiță increment |
| NumericDownIcon | string | KeyboardArrowDown | Iconiță decrement |

### Clear Button

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Clearable | bool | false | Afișează buton ștergere |
| ClearIcon | string | Clear | Iconiță pentru ștergere |

## Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| ValueChanged | EventCallback<T> | Declanșat la schimbarea valorii |
| TextChanged | EventCallback<string> | Declanșat la schimbarea textului |
| OnBlur | EventCallback<FocusEventArgs> | La pierderea focus-ului |
| OnInternalInputChanged | EventCallback<ChangeEventArgs> | La schimbarea internă |
| KeyDown | EventCallback<KeyboardEventArgs> | La apăsare tastă |
| KeyPress | EventCallback<KeyboardEventArgs> | La tastare caracter |
| KeyUp | EventCallback<KeyboardEventArgs> | La eliberare tastă |
| OnAdornmentClick | EventCallback<MouseEventArgs> | Click pe adornment |
| OnClearButtonClick | EventCallback<MouseEventArgs> | Click pe buton ștergere |
| OnIncrement | EventCallback | Click increment (numeric) |
| OnDecrement | EventCallback | Click decrement (numeric) |
| OnMouseWheel | EventCallback<WheelEventArgs> | Scroll mouse wheel |

## Metode Publice

| Metodă | Returnează | Descriere |
|--------|------------|-----------|
| FocusAsync() | ValueTask | Setează focus pe input |
| BlurAsync() | ValueTask | Elimină focus de pe input |
| SelectAsync() | ValueTask | Selectează tot textul |
| SelectRangeAsync(int, int) | ValueTask | Selectează interval text |
| SetText(string) | Task | Setează text programatic |
| ResetAsync() | Task | Resetează la valoare inițială |
| ResetValidation() | Task | Resetează starea de validare |
| Validate() | Task | Forțează validarea |

## Tipuri de Input Suportate

```csharp
public enum InputType
{
    Text,         // Text standard
    Password,     // Parolă
    Email,        // Email cu validare
    Number,       // Număr
    Date,         // Dată
    DateTimeLocal,// Dată și oră locală
    Month,        // Lună
    Time,         // Oră
    Week,         // Săptămână
    Search,       // Căutare
    Tel,          // Telefon
    Url,          // URL
    Color,        // Selector culoare
    Hidden        // Ascuns
}
```

## Exemple Avansate

### Input cu Validare Personalizată

```razor
<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodInput @bind-Value="model.Email" 
              Label="Email"
              InputType="InputType.Email"
              Required="true"
              RequiredError="Email-ul este obligatoriu"
              HelperText="Introduceți o adresă validă"
              Validation="@ValidateEmail" />
    
    <FodInput @bind-Value="model.Password"
              Label="Parolă"
              InputType="InputType.Password"
              Required="true"
              Pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
              HelperText="Minim 8 caractere, o majusculă, o minusculă și o cifră" />
              
    <FodButton Type="submit">Înregistrare</FodButton>
</EditForm>

@code {
    private UserModel model = new();
    
    private string ValidateEmail(string email)
    {
        if (string.IsNullOrEmpty(email))
            return "Email-ul este obligatoriu";
        
        if (!email.Contains("@"))
            return "Email invalid";
            
        return null; // Valid
    }
}
```

### Input cu Adornments

```razor
<!-- Câmp sumă cu simbol monedă -->
<FodInput @bind-Value="amount"
          Label="Sumă"
          InputType="InputType.Number"
          Adornment="Adornment.Start"
          AdornmentText="MDL"
          Placeholder="0.00" />

<!-- Câmp căutare cu iconiță -->
<FodInput @bind-Value="searchTerm"
          Label="Căutare"
          InputType="InputType.Search"
          Adornment="Adornment.Start"
          AdornmentIcon="@FodIcons.Material.Filled.Search"
          Immediate="true"
          DebounceInterval="300" />

<!-- Câmp parolă cu toggle vizibilitate -->
<FodInput @bind-Value="password"
          Label="Parolă"
          InputType="@passwordInputType"
          Adornment="Adornment.End"
          AdornmentIcon="@passwordIcon"
          OnAdornmentClick="TogglePasswordVisibility" />

@code {
    private string password;
    private InputType passwordInputType = InputType.Password;
    private string passwordIcon = FodIcons.Material.Filled.VisibilityOff;
    
    private void TogglePasswordVisibility()
    {
        if (passwordInputType == InputType.Password)
        {
            passwordInputType = InputType.Text;
            passwordIcon = FodIcons.Material.Filled.Visibility;
        }
        else
        {
            passwordInputType = InputType.Password;
            passwordIcon = FodIcons.Material.Filled.VisibilityOff;
        }
    }
}
```

### Input Numeric cu Formatare

```razor
<!-- Preț cu formatare -->
<FodInput @bind-Value="price"
          Label="Preț"
          InputType="InputType.Number"
          Format="C2"
          Culture="@(new CultureInfo("ro-RO"))"
          Adornment="Adornment.Start"
          AdornmentText="MDL" />

<!-- Procent cu spin buttons -->
<FodInput @bind-Value="percentage"
          Label="Procent"
          InputType="InputType.Number"
          HideSpinButtons="false"
          Adornment="Adornment.End"
          AdornmentText="%"
          OnIncrement="@(() => percentage = Math.Min(100, percentage + 1))"
          OnDecrement="@(() => percentage = Math.Max(0, percentage - 1))" />
```

### Input cu Debounce

```razor
<FodInput @bind-Value="searchQuery"
          Label="Căutare produse"
          Immediate="true"
          DebounceInterval="500"
          Clearable="true"
          OnDebounceIntervalElapsed="@PerformSearch" />

@code {
    private string searchQuery;
    
    private async Task PerformSearch()
    {
        if (!string.IsNullOrWhiteSpace(searchQuery))
        {
            // Execută căutarea
            await LoadSearchResults(searchQuery);
        }
    }
}
```

### Textarea Multi-linie

```razor
<FodInput @bind-Value="description"
          Label="Descriere"
          Lines="5"
          MaxLength="500"
          HelperText="@($"{description?.Length ?? 0}/500 caractere")"
          FullWidth="true" />
```

### Input cu Validare în Timp Real

```razor
<FodInput @bind-Value="username"
          Label="Nume utilizator"
          Immediate="true"
          OnlyValidateIfDirty="true"
          Validation="@ValidateUsername"
          HelperTextOnFocus="true"
          HelperText="Minim 3 caractere, fără spații" />

@code {
    private string username;
    
    private async Task<string> ValidateUsername(string value)
    {
        if (string.IsNullOrEmpty(value))
            return "Numele de utilizator este obligatoriu";
            
        if (value.Length < 3)
            return "Minim 3 caractere";
            
        if (value.Contains(" "))
            return "Nu sunt permise spații";
            
        // Verificare disponibilitate
        var isAvailable = await CheckUsernameAvailability(value);
        if (!isAvailable)
            return "Numele de utilizator este deja folosit";
            
        return null;
    }
}
```

## Variante de Stil

```razor
<!-- Variant Text (default) -->
<FodInput @bind-Value="text1" Label="Text" Variant="FodVariant.Text" />

<!-- Variant Filled -->
<FodInput @bind-Value="text2" Label="Filled" Variant="FodVariant.Filled" />

<!-- Variant Outlined -->
<FodInput @bind-Value="text3" Label="Outlined" Variant="FodVariant.Outlined" />

<!-- Dense margin -->
<FodInput @bind-Value="text4" Label="Dense" Margin="Margin.Dense" />

<!-- Full width -->
<FodInput @bind-Value="text5" Label="Full Width" FullWidth="true" />
```

## Integrare cu Formulare

```razor
<EditForm Model="@formModel" OnValidSubmit="@HandleValidSubmit">
    <FodForm>
        <FodItem xs="12" sm="6">
            <FodInput @bind-Value="formModel.FirstName"
                      For="@(() => formModel.FirstName)"
                      Label="Prenume" />
        </FodItem>
        
        <FodItem xs="12" sm="6">
            <FodInput @bind-Value="formModel.LastName"
                      For="@(() => formModel.LastName)"
                      Label="Nume" />
        </FodItem>
        
        <FodItem xs="12">
            <FodInput @bind-Value="formModel.Email"
                      For="@(() => formModel.Email)"
                      Label="Email"
                      InputType="InputType.Email" />
        </FodItem>
    </FodForm>
</EditForm>
```

## Componente Asociate

- `FodInputAdornment` - Pentru icoane și text adițional
- `FodInputLabel` - Label floating pentru input
- `FodInputControl` - Container pentru input cu label și helper
- `FodForm` - Container pentru formulare
- `FodNumericField<T>` - Input numeric specializat

## Stilizare

### Clase CSS

```css
.fod-input
.fod-input-root
.fod-input-text
.fod-input-filled
.fod-input-outlined
.fod-input-fullwidth
.fod-input-disabled
.fod-input-error
.fod-input-multiline
.fod-input-adorned-start
.fod-input-adorned-end
.fod-input-margin-dense
.fod-input-margin-normal
.fod-input-underline
.fod-shrink
.fod-disabled
.fod-input-input-adorned-start
.fod-input-input-adorned-end
```

### Variabile CSS

```css
--fod-input-underline-color
--fod-input-underline-hover-color  
--fod-input-underline-focus-color
--fod-input-error-color
--fod-input-disabled-color
--fod-input-filled-background
--fod-input-outlined-border
```

## Note și Observații

1. **Generics** - Componenta suportă orice tip T care poate fi convertit din/în string
2. **Validare** - Suportă atât DataAnnotations cât și validare personalizată
3. **Performance** - Folosiți `TextUpdateSuppression` pe server pentru performanță
4. **Accessibility** - Include suport complet ARIA pentru screen readers
5. **Mobile** - `InputMode` controlează tastatura pe dispozitive mobile
6. **Debounce** - Util pentru căutări sau validări costisitoare

## Bune Practici

1. Folosiți `Label` întotdeauna pentru accesibilitate
2. Adăugați `HelperText` pentru ghidare utilizator
3. Folosiți `Immediate="false"` pentru formulare mari
4. Setați `InputType` corect pentru validare browser
5. Folosiți `Debounce` pentru operații costisitoare
6. Preferați `For` pentru integrare cu EditForm
7. Folosiți `Pattern` pentru validare rapidă client-side

## Concluzie

FodInput este componenta fundamentală pentru lucrul cu date de intrare în aplicații FOD. Cu suport pentru toate tipurile HTML5, validare puternică, și numeroase opțiuni de personalizare, oferă flexibilitatea necesară pentru aproape orice scenariu de formular.