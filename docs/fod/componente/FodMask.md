# FodMask

## Descriere Generală

Componenta `FodMask` oferă funcționalitate avansată de mascare pentru câmpuri de input, permițând formatarea automată a textului introdus conform unor pattern-uri predefinite. Este ideală pentru formate standardizate precum numere de telefon, CNP-uri, IBAN-uri, coduri poștale și alte formate structurate.

Componenta suportă mai multe tipuri de măști:
- **PatternMask** - Pentru pattern-uri fixe
- **RegexMask** - Pentru validare cu expresii regulate
- **MultiMask** - Pentru pattern-uri multiple
- **BlockMask** - Pentru blocuri de caractere

## Ghid de Utilizare API

### Exemplu de bază - număr de telefon

```razor
<FodMask @bind-Value="phoneNumber" 
         Mask="@(new PatternMask("(000) 000-0000"))"
         Label="Număr telefon"
         Placeholder="(xxx) xxx-xxxx" />

@code {
    private string phoneNumber;
}
```

### CNP/IDNP cu pattern mask

```razor
<FodMask @bind-Value="cnp" 
         Mask="@(new PatternMask("0 000000 00000 0"))"
         Label="CNP"
         Clearable="true" />

@code {
    private string cnp;
}
```

### Card bancar cu block mask

```razor
<FodMask @bind-Value="cardNumber" 
         Mask="@(new BlockMask("0000 0000 0000 0000"))"
         Label="Număr card"
         Placeholder="0000 0000 0000 0000"
         AdornmentIcon="@FodIcons.Material.Filled.CreditCard"
         Adornment="Adornment.Start" />

@code {
    private string cardNumber;
}
```

### Data cu pattern personalizat

```razor
<FodMask @bind-Value="date" 
         Mask="@(new PatternMask("00/00/0000"))"
         Label="Data (LL/ZZ/AAAA)"
         HelperText="Format: lună/zi/an" />

@code {
    private string date;
}
```

### Multi-mask pentru diferite formate

```razor
<FodMask @bind-Value="identifier" 
         Mask="@multiMask"
         Label="CNP sau Pașaport"
         Placeholder="CNP sau nr. pașaport" />

@code {
    private string identifier;
    
    private MultiMask multiMask = new MultiMask("00000000000000|AA 0000000",
        new PatternMask("00000000000000"), // CNP
        new PatternMask("AA 0000000")       // Pașaport
    );
}
```

### Cu validare regex

```razor
<FodMask @bind-Value="ipAddress" 
         Mask="@(new RegexMask(@"^(\d{1,3}\.){3}\d{1,3}$", '0'))"
         Label="Adresă IP"
         Placeholder="192.168.1.1"
         OnClearButtonClick="@(() => ipAddress = string.Empty)" />

@code {
    private string ipAddress;
}
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| Mask | IMask | PatternMask("** **-** **") | Obiectul de mascare |
| Value | string | - | Valoarea curată (fără formatare) |
| Text | string | - | Textul formatat cu mască |
| InputType | InputType | Text | Tipul câmpului input |
| Clearable | bool | false | Afișează buton de ștergere |
| ClearIcon | string | Material.Filled.Clear | Iconița pentru butonul clear |
| Placeholder | string | - | Text placeholder |
| Label | string | - | Eticheta câmpului |
| HelperText | string | - | Text ajutător |
| Variant | FodVariant | Text | Varianta vizuală |
| Margin | Margin | None | Marginea componentei |
| Adornment | Adornment | None | Poziția adornment-ului |
| AdornmentIcon | string | - | Iconița pentru adornment |
| AdornmentText | string | - | Text pentru adornment |
| AdornmentColor | FodColor | Default | Culoarea adornment-ului |
| IconSize | FodSize | Medium | Dimensiunea iconiței |
| DisableUnderLine | bool | false | Dezactivează linia de subliniere |

## Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| ValueChanged | EventCallback<string> | Declanșat când valoarea se schimbă |
| OnClearButtonClick | EventCallback<MouseEventArgs> | Click pe butonul clear |
| OnBlur | EventCallback<FocusEventArgs> | Pierderea focusului |
| OnKeyDown | EventCallback<KeyboardEventArgs> | Tastă apăsată |

## Metode publice

| Metodă | Descriere |
|--------|-----------|
| Clear() | Șterge textul și valoarea |
| FocusAsync() | Setează focus pe input |
| SelectAsync() | Selectează tot textul |
| SelectRangeAsync(int pos1, int pos2) | Selectează un interval de text |

## Componente asociate

- **FodInputAdornment** - Pentru iconițe și text adițional
- **FodIconButton** - Pentru butonul de ștergere
- **IMask** - Interfața pentru obiectele de mascare

## Tipuri de măști

### PatternMask
```razor
// 0 - cifră obligatorie
// 9 - cifră opțională
// * - orice caracter
new PatternMask("(000) 000-0000")     // Telefon US
new PatternMask("00-00-0000")          // Dată
new PatternMask("AA 0000000")          // Pașaport
```

### BlockMask
```razor
// Pentru grupuri de caractere
new BlockMask("0000 0000 0000 0000")   // Card
new BlockMask("AA00 AA00")             // Cod produs
```

### RegexMask
```razor
// Validare cu regex
new RegexMask(@"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", '0')  // IP
new RegexMask(@"^[A-Z]{2}\d{6}$", '*')                         // ID
```

### MultiMask
```razor
// Măști multiple bazate pe input
new MultiMask("00000000000000|AA 0000000",
    new PatternMask("00000000000000"),
    new PatternMask("AA 0000000")
)
```

## Stilizare

Componenta moștenește stilurile de la FodInput cu clase adiționale pentru mascare.

### Personalizare

```css
/* Container principal */
.fod-mask .fod-input {
    font-family: monospace;
}

/* Input field */
.fod-mask .fod-input-slot {
    letter-spacing: 0.1em;
}

/* Clear button */
.fod-mask .fod-icon-button-edge-end {
    opacity: 0.7;
}

.fod-mask .fod-icon-button-edge-end:hover {
    opacity: 1;
}
```

## Note și observații

1. **Valoare vs Text** - `Value` conține textul curat, `Text` conține textul formatat
2. **Caret management** - Poziția cursorului este gestionată automat
3. **Copy/Paste** - Suportă operații clipboard cu formatare corectă
4. **Keyboard navigation** - Gestionează taste speciale (Backspace, Delete, etc.)
5. **JS Interop** - Folosește JS pentru gestionarea avansată a cursorului

## Bune practici

1. **Pattern clar** - Folosiți placeholder pentru a indica formatul așteptat
2. **Helper text** - Adăugați explicații pentru formate complexe
3. **Validare** - Combinați cu validatori pentru verificare completă
4. **Măști simple** - Preferați PatternMask pentru majoritatea cazurilor
5. **Performance** - Evitați regex-uri complexe în RegexMask

## Exemple avansate

### Formular complet cu măști

```razor
<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodMask @bind-Value="model.Phone" 
             Mask="@(new PatternMask("+00 (000) 000-000"))"
             Label="Telefon"
             Required="true" />
    
    <FodMask @bind-Value="model.CNP" 
             Mask="@(new PatternMask("0000000000000"))"
             Label="CNP"
             Required="true" />
    
    <FodMask @bind-Value="model.IBAN" 
             Mask="@(new PatternMask("AA00 AAAA 0000 0000 0000 0000"))"
             Label="IBAN"
             HelperText="Format: MD00 XXXX 0000 0000 0000 0000" />
    
    <FodButton Type="submit">Salvează</FodButton>
</EditForm>
```

### Mască dinamică

```razor
<FodSelect @bind-Value="maskType" Label="Tip document">
    <FodSelectItem Value="cnp">CNP</FodSelectItem>
    <FodSelectItem Value="passport">Pașaport</FodSelectItem>
</FodSelect>

<FodMask @bind-Value="documentNumber" 
         Mask="@GetMask()"
         Label="Număr document"
         Placeholder="@GetPlaceholder()" />

@code {
    private string maskType = "cnp";
    private string documentNumber;
    
    private IMask GetMask() => maskType switch
    {
        "cnp" => new PatternMask("0000000000000"),
        "passport" => new PatternMask("AA 0000000"),
        _ => new PatternMask("*********")
    };
    
    private string GetPlaceholder() => maskType switch
    {
        "cnp" => "1234567890123",
        "passport" => "AB 1234567",
        _ => ""
    };
}
```

## Concluzie

FodMask oferă o soluție completă pentru formatarea automată a input-urilor conform pattern-urilor predefinite. Cu suport pentru multiple tipuri de măști, gestionare inteligentă a cursorului și integrare perfectă cu formularele Blazor, componenta îmbunătățește semnificativ experiența utilizatorului pentru introducerea datelor structurate.