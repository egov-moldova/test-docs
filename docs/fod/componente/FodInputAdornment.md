# FodInputAdornment

## Descriere Generală

`FodInputAdornment` este o componentă internă folosită pentru a adăuga text sau iconițe la începutul sau sfârșitul input-urilor. Face parte din namespace-ul `Fod.Components.Internal` și este utilizată de componente precum `FodInput`, `FodRangeInput` și altele pentru a oferi context vizual sau funcționalitate adițională.

## Utilizare de Bază

```razor
<!-- Adornment cu text -->
<FodInputAdornment Text="MDL" 
                   Edge="Edge.End" 
                   Color="FodColor.Default" />

<!-- Adornment cu icon -->
<FodInputAdornment Icon="@FodIcons.Material.Filled.Search" 
                   Edge="Edge.Start" />

<!-- Adornment cu icon clickable -->
<FodInputAdornment Icon="@FodIcons.Material.Filled.Visibility" 
                   Edge="Edge.End"
                   AdornmentClick="@TogglePasswordVisibility" />
```

## Atribute și Parametri

| Parametru | Tip | Default | Descriere |
|-----------|-----|---------|-----------|
| Text | string | null | Text de afișat |
| Icon | string | null | Icon de afișat |
| Edge | Edge | - | Poziția (Start/End) |
| Size | FodSize | Medium | Dimensiunea icon-ului |
| Color | FodColor | Default | Culoarea text/icon |
| AriaLabel | string | null | Label pentru accesibilitate |
| AdornmentClick | EventCallback | - | Handler pentru click |
| Class | string | null | Clase CSS adiționale |

## Logica de Afișare

Componenta afișează conținut bazat pe prioritate:
1. Dacă `Text` este setat - afișează text
2. Altfel, dacă `Icon` este setat:
   - Cu `AdornmentClick` - afișează `FodIconButton`
   - Fără `AdornmentClick` - afișează `FodIcon`

## Exemple de Utilizare în Componente

### În FodInput pentru Valută

```razor
<FodInput @bind-Value="amount"
          Label="Preț"
          InputType="InputType.Number"
          Adornment="Adornment.Start"
          AdornmentText="MDL" />

<!-- Rezultat intern -->
<div class="fod-input-adornment-start">
    <FodText Color="Default" tabindex="-1">MDL</FodText>
</div>
```

### În FodInput pentru Căutare

```razor
<FodInput @bind-Value="searchTerm"
          Placeholder="Căutați..."
          Adornment="Adornment.Start"
          AdornmentIcon="@FodIcons.Material.Filled.Search" />

<!-- Rezultat intern -->
<div class="fod-input-adornment-start">
    <FodIcon Icon="@FodIcons.Material.Filled.Search" 
             Size="Medium" 
             Color="Default" 
             aria-label="Icon" 
             tabindex="-1"/>
</div>
```

### În FodInput pentru Parolă

```razor
<FodInput @bind-Value="password"
          InputType="@passwordInputType"
          Label="Parolă"
          Adornment="Adornment.End"
          AdornmentIcon="@passwordIcon"
          OnAdornmentClick="@TogglePassword" />

@code {
    private string password;
    private InputType passwordInputType = InputType.Password;
    private string passwordIcon = FodIcons.Material.Filled.Visibility;
    
    private void TogglePassword()
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

<!-- Rezultat intern când are OnAdornmentClick -->
<div class="fod-input-adornment-end">
    <FodIconButton Icon="@passwordIcon" 
                   OnClick="@AdornmentClick" 
                   Edge="End" 
                   Size="Medium" 
                   Color="Default" 
                   aria-label="Icon Button" 
                   tabindex="-1"/>
</div>
```

### Exemple Complete de Input-uri cu Adornments

```razor
<!-- Email cu icon -->
<div class="form-group">
    <FodInput @bind-Value="email"
              Label="Email"
              InputType="InputType.Email"
              Adornment="Adornment.Start"
              AdornmentIcon="@FodIcons.Material.Filled.Email" />
</div>

<!-- Telefon cu prefix -->
<div class="form-group">
    <FodInput @bind-Value="phone"
              Label="Telefon"
              Adornment="Adornment.Start"
              AdornmentText="+373" />
</div>

<!-- URL cu buton de deschidere -->
<div class="form-group">
    <FodInput @bind-Value="website"
              Label="Website"
              InputType="InputType.Url"
              Adornment="Adornment.End"
              AdornmentIcon="@FodIcons.Material.Filled.OpenInNew"
              OnAdornmentClick="@OpenWebsite" />
</div>

<!-- Sumă cu unitate de măsură -->
<div class="form-group">
    <FodInput @bind-Value="weight"
              Label="Greutate"
              InputType="InputType.Number"
              Adornment="Adornment.End"
              AdornmentText="kg" />
</div>

@code {
    private string email, phone, website;
    private decimal weight;
    
    private async Task OpenWebsite()
    {
        if (!string.IsNullOrEmpty(website))
        {
            await JS.InvokeVoidAsync("window.open", website, "_blank");
        }
    }
}
```

## Stilizare prin Clase CSS

```css
/* Poziționare pentru Edge.Start */
.fod-input-adornment-start {
    display: flex;
    align-items: center;
    margin-right: 8px;
}

/* Poziționare pentru Edge.End */
.fod-input-adornment-end {
    display: flex;
    align-items: center;
    margin-left: 8px;
}

/* Text adornment */
.fod-input-adornment-start .fod-text,
.fod-input-adornment-end .fod-text {
    white-space: nowrap;
    color: #6c757d;
}

/* Icon adornment */
.fod-input-adornment-start .fod-icon,
.fod-input-adornment-end .fod-icon {
    color: #6c757d;
}

/* Icon button adornment */
.fod-input-adornment-start .fod-icon-button,
.fod-input-adornment-end .fod-icon-button {
    padding: 4px;
}
```

## Utilizare Customizată

```razor
<!-- Adornment complex cu tooltip -->
<div class="custom-input-wrapper">
    <FodInputAdornment Icon="@FodIcons.Material.Filled.Info" 
                       Edge="Edge.End"
                       Color="FodColor.Primary"
                       AriaLabel="Informații despre câmp"
                       Class="info-adornment" />
    <FodTooltip Text="Acest câmp acceptă doar litere și cifre">
        <div class="info-icon-wrapper">
            <FodIcon Icon="@FodIcons.Material.Filled.Info" />
        </div>
    </FodTooltip>
</div>

<!-- Adornment cu stare dinamică -->
<FodInputAdornment Icon="@GetValidationIcon()" 
                   Edge="Edge.End"
                   Color="@GetValidationColor()"
                   AriaLabel="@GetValidationMessage()" />

@code {
    private string GetValidationIcon()
    {
        return isValid ? FodIcons.Material.Filled.CheckCircle : FodIcons.Material.Filled.Error;
    }
    
    private FodColor GetValidationColor()
    {
        return isValid ? FodColor.Success : FodColor.Error;
    }
    
    private string GetValidationMessage()
    {
        return isValid ? "Câmp valid" : "Câmp invalid";
    }
}
```

## Accesibilitate

1. **tabindex="-1"** - Previne focus-ul pe elemente decorative
2. **AriaLabel** - Oferă context pentru screen readers
3. **Valori implicite** - "Icon" sau "Icon Button" când AriaLabel lipsește
4. **Semantică** - Folosește componente semantice (FodText, FodIcon)

## Integrare cu Edge

```csharp
public enum Edge
{
    Start,  // Stânga în LTR, dreapta în RTL
    End     // Dreapta în LTR, stânga în RTL
}
```

## Best Practices

1. **Un singur tip** - Folosiți fie Text, fie Icon, nu ambele
2. **AriaLabel pentru iconițe** - Întotdeauna pentru accesibilitate
3. **Click doar când necesar** - Nu toate iconițele necesită interacțiune
4. **Culori consistente** - Folosiți tema aplicației
5. **Dimensiuni potrivite** - Size să fie proporțional cu input-ul

## Cazuri de Utilizare Comune

### Unități de Măsură
```razor
AdornmentText="km"
AdornmentText="m²"
AdornmentText="%"
AdornmentText="°C"
```

### Iconițe Funcționale
```razor
AdornmentIcon="@FodIcons.Material.Filled.CalendarToday"  // Date picker
AdornmentIcon="@FodIcons.Material.Filled.AccessTime"     // Time picker
AdornmentIcon="@FodIcons.Material.Filled.AttachFile"     // File upload
AdornmentIcon="@FodIcons.Material.Filled.LocationOn"     // Location
```

### Prefixe/Sufixe
```razor
AdornmentText="https://"     // URL prefix
AdornmentText="@gmail.com"   // Email suffix
AdornmentText="#"            // Number prefix
```

## Limitări

- Nu suportă conținut complex (doar text sau icon)
- Nu poate avea atât text cât și icon simultan
- Nu suportă styling direct (folosește clase CSS)
- Componenta internă - nu pentru utilizare directă

## Concluzie

FodInputAdornment este o componentă esențială pentru îmbunătățirea UX-ului input-urilor, oferind context vizual și funcționalitate adițională. Deși este o componentă internă, înțelegerea funcționării sale ajută la utilizarea corectă a adornments în componentele de input FOD.