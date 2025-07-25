# FodInput1

## Descriere Generală

`FodInput1<T>` este o componentă input generică avansată care extinde `FodBaseInput<T>`. Oferă suport complet pentru toate tipurile de input HTML5, inclusiv text simplu, textarea multi-linie, input-uri numerice cu butoane increment/decrement, și suport pentru adornments. Este o componentă de bază fundamentală în biblioteca FOD.

## Utilizare de Bază

```razor
<!-- Input text simplu -->
<FodInput1 @bind-Value="textValue" 
           Placeholder="Introduceți text..." />

<!-- Textarea multi-linie -->
<FodInput1 @bind-Value="description" 
           Lines="5"
           Placeholder="Descriere..." />

<!-- Input numeric cu butoane -->
<FodInput1 @bind-Value="quantity" 
           InputType="InputType.Number"
           HideSpinButtons="false" />

<!-- Input cu adornments -->
<FodInput1 @bind-Value="email" 
           InputType="InputType.Email"
           Adornment="Adornment.Start"
           AdornmentIcon="@FodIcons.Material.Filled.Email" />
```

## Atribute și Parametri

### Parametri Principali

| Parametru | Tip | Default | Descriere |
|-----------|-----|---------|-----------|
| InputType | InputType | Text | Tipul input-ului HTML5 |
| Lines | int | 1 | Număr rânduri pentru textarea |
| Placeholder | string | null | Text placeholder |
| Clearable | bool | false | Afișează buton clear |
| HideSpinButtons | bool | true | Ascunde butoane pentru numeric |
| MaxLength | int? | null | Lungime maximă text |
| Pattern | string | null | Pattern pentru validare |
| InputMode | InputMode | - | Mod tastatură mobilă |

### Parametri Adornment

| Parametru | Tip | Default | Descriere |
|-----------|-----|---------|-----------|
| Adornment | Adornment | None | Poziție adornment (Start/End) |
| AdornmentIcon | string | null | Icon pentru adornment |
| AdornmentText | string | null | Text pentru adornment |
| AdornmentColor | FodColor | Default | Culoare adornment |
| AdornmentAriaLabel | string | null | Label accesibilitate |
| OnAdornmentClick | EventCallback | - | Click handler pentru adornment |

### Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| OnIncrement | EventCallback | Click pe buton increment |
| OnDecrement | EventCallback | Click pe buton decrement |
| OnClearButtonClick | EventCallback<MouseEventArgs> | Click pe buton clear |
| OnMouseWheel | EventCallback<WheelEventArgs> | Scroll cu mouse wheel |
| OnPaste | EventCallback<ClipboardEventArgs> | Paste content |

## Exemple de Utilizare

### Input cu Validare în Timp Real

```razor
<div class="form-group">
    <FodInput1 @bind-Value="username" 
               Placeholder="Nume utilizator"
               Pattern="^[a-zA-Z0-9_]{3,20}$"
               Immediate="true"
               Clearable="true"
               @bind-Value:after="ValidateUsername" />
    
    @if (!string.IsNullOrEmpty(validationMessage))
    {
        <div class="validation-feedback @(isValid ? "valid" : "invalid")">
            @validationMessage
        </div>
    }
</div>

@code {
    private string username;
    private string validationMessage;
    private bool isValid;
    
    private void ValidateUsername()
    {
        if (string.IsNullOrEmpty(username))
        {
            validationMessage = "";
            return;
        }
        
        if (username.Length < 3)
        {
            validationMessage = "Minim 3 caractere";
            isValid = false;
        }
        else if (!System.Text.RegularExpressions.Regex.IsMatch(username, "^[a-zA-Z0-9_]+$"))
        {
            validationMessage = "Doar litere, cifre și underscore";
            isValid = false;
        }
        else
        {
            validationMessage = "✓ Nume utilizator valid";
            isValid = true;
        }
    }
}
```

### Textarea cu Contor de Caractere

```razor
<div class="textarea-container">
    <FodInput1 @bind-Value="comment" 
               Lines="4"
               MaxLength="500"
               Placeholder="Comentariul dvs..."
               @bind-Value:after="UpdateCharCount" />
    
    <div class="char-counter">
        @comment.Length / @maxLength caractere
        @if (comment.Length > maxLength * 0.9)
        {
            <span class="text-warning"> (aproape de limită)</span>
        }
    </div>
</div>

@code {
    private string comment = "";
    private int maxLength = 500;
    
    private void UpdateCharCount()
    {
        StateHasChanged();
    }
}
```

### Input Numeric cu Control Custom

```razor
<div class="quantity-control">
    <label>Cantitate:</label>
    <FodInput1 @bind-Value="quantity" 
               InputType="InputType.Number"
               HideSpinButtons="false"
               OnIncrement="IncrementQuantity"
               OnDecrement="DecrementQuantity"
               OnMouseWheel="HandleMouseWheel"
               min="1"
               max="@maxStock" />
    
    <div class="stock-info">
        Stoc disponibil: @maxStock unități
    </div>
</div>

@code {
    private int quantity = 1;
    private int maxStock = 100;
    
    private void IncrementQuantity()
    {
        if (quantity < maxStock)
            quantity++;
    }
    
    private void DecrementQuantity()
    {
        if (quantity > 1)
            quantity--;
    }
    
    private void HandleMouseWheel(WheelEventArgs e)
    {
        if (e.DeltaY < 0 && quantity < maxStock)
            quantity++;
        else if (e.DeltaY > 0 && quantity > 1)
            quantity--;
    }
}
```

### Input cu Adornments Funcționale

```razor
<!-- Parolă cu toggle vizibilitate -->
<div class="password-input">
    <FodInput1 @bind-Value="password" 
               InputType="@passwordType"
               Placeholder="Parolă"
               Adornment="Adornment.End"
               AdornmentIcon="@visibilityIcon"
               OnAdornmentClick="TogglePasswordVisibility"
               AdornmentAriaLabel="Toggle password visibility" />
</div>

<!-- Search cu clear -->
<div class="search-input">
    <FodInput1 @bind-Value="searchQuery" 
               Placeholder="Căutați..."
               Adornment="Adornment.Start"
               AdornmentIcon="@FodIcons.Material.Filled.Search"
               Clearable="true"
               OnClearButtonClick="ClearSearch"
               Immediate="true"
               @bind-Value:after="PerformSearch" />
</div>

<!-- URL cu buton deschidere -->
<div class="url-input">
    <FodInput1 @bind-Value="websiteUrl" 
               InputType="InputType.Url"
               Placeholder="https://example.com"
               Adornment="Adornment.End"
               AdornmentIcon="@FodIcons.Material.Filled.OpenInNew"
               OnAdornmentClick="OpenWebsite"
               AdornmentAriaLabel="Open in new window" />
</div>

@code {
    private string password;
    private InputType passwordType = InputType.Password;
    private string visibilityIcon = FodIcons.Material.Filled.Visibility;
    
    private string searchQuery;
    private string websiteUrl;
    
    private void TogglePasswordVisibility()
    {
        if (passwordType == InputType.Password)
        {
            passwordType = InputType.Text;
            visibilityIcon = FodIcons.Material.Filled.VisibilityOff;
        }
        else
        {
            passwordType = InputType.Password;
            visibilityIcon = FodIcons.Material.Filled.Visibility;
        }
    }
    
    private async Task ClearSearch(MouseEventArgs e)
    {
        searchQuery = "";
        await PerformSearch();
    }
    
    private async Task PerformSearch()
    {
        // Implementare căutare
        await Task.Delay(300); // Debounce
    }
    
    private async Task OpenWebsite()
    {
        if (!string.IsNullOrEmpty(websiteUrl))
        {
            await JS.InvokeVoidAsync("window.open", websiteUrl, "_blank");
        }
    }
}
```

### Input Complex cu ChildContent

```razor
<!-- Input hidden cu conținut custom -->
<FodInput1 @bind-Value="hiddenValue" 
           InputType="InputType.Hidden">
    <ChildContent>
        <div class="custom-display">
            <FodIcon Icon="@FodIcons.Material.Filled.Info" />
            <span>Valoare ascunsă: @hiddenValue</span>
        </div>
    </ChildContent>
</FodInput1>

<!-- Color picker cu preview -->
<div class="color-picker-container">
    <FodInput1 @bind-Value="selectedColor" 
               InputType="InputType.Color"
               Adornment="Adornment.End"
               AdornmentText="@selectedColor" />
    
    <div class="color-preview" style="background-color: @selectedColor;">
        Preview
    </div>
</div>

@code {
    private string hiddenValue = "secret-value";
    private string selectedColor = "#007bff";
}
```

## Stilizare

### Variante

```razor
<!-- Text variant (default) -->
<FodInput1 @bind-Value="value1" Variant="FodVariant.Text" />

<!-- Filled variant -->
<FodInput1 @bind-Value="value2" Variant="FodVariant.Filled" />

<!-- Outlined variant -->
<FodInput1 @bind-Value="value3" Variant="FodVariant.Outlined" />
```

### Clase CSS Generate

Componenta generează clase folosind `FodInputCssHelper`:

```csharp
protected string Classname => FodInputCssHelper.GetClassname(this, ...);
protected string InputClassname => FodInputCssHelper.GetInputClassname(this);
protected string AdornmentClassname => FodInputCssHelper.GetAdornmentClassname(this);
```

### CSS Personalizat

```css
/* Stilizare pentru clearable button */
.fod-input-clear-button {
    opacity: 0;
    transition: opacity 0.3s;
}

.fod-input:hover .fod-input-clear-button,
.fod-input:focus-within .fod-input-clear-button {
    opacity: 1;
}

/* Stilizare pentru spin buttons */
.fod-input-numeric-spin {
    display: flex;
    flex-direction: column;
    margin-left: -2rem;
}

.fod-input-numeric-spin button {
    height: 1rem;
    padding: 0;
    min-width: 1.5rem;
}

/* Stilizare pentru multi-line */
.fod-input textarea {
    resize: vertical;
    min-height: 4rem;
}
```

## Focus Management

```csharp
// Focus pe input
await inputRef.FocusAsync();

// Blur
await inputRef.BlurAsync();

// Selectare tot textul
await inputRef.SelectAsync();

// Selectare interval specific
await inputRef.SelectRangeAsync(0, 5);
```

## Text Update Suppression

Pentru Server-Side Blazor, componenta suportă suprimarea actualizărilor de text în timpul focus-ului:

```csharp
if (RuntimeLocation.IsServerSide && TextUpdateSuppression)
{
    if (!_isFocused || _forceTextUpdate)
        _internalText = Text;
}
```

## Accesibilitate

- ARIA attributes: `aria-invalid`, `aria-describedby`, `aria-label`
- Proper `tabindex` management
- Keyboard navigation support
- Screen reader friendly

## Input Types Native cu Placeholder

Anumite tipuri de input HTML5 au placeholder nativ:
- Color
- Date
- DateTimeLocal
- Month
- Time
- Week

## Best Practices

1. **Alegeți InputType corect** - Pentru experiență optimă pe mobil
2. **Folosiți Pattern pentru validare** - Validare client-side
3. **Clearable pentru căutări** - UX îmbunătățit
4. **Adornments pentru context** - Iconițe relevante
5. **MaxLength pentru limite** - Preveniți input excesiv

## Performanță

- Immediate mode: update la fiecare tastă
- Non-immediate: update doar la blur/enter
- Text suppression în SSR pentru performanță

## Limitări

- Nu suportă mask pentru input
- Spin buttons doar pentru type="number"
- ChildContent doar pentru type="hidden"

## Concluzie

FodInput1 este o componentă input extrem de flexibilă și puternică, oferind suport complet pentru toate scenariile de input din aplicații web moderne. Cu suport pentru multiple tipuri, adornments, validare și caracteristici avansate, este fundația perfectă pentru construirea de formulare complexe.