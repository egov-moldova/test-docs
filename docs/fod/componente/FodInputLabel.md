# FodInputLabel

## Descriere Generală

`FodInputLabel` este o componentă specializată pentru etichetele input-urilor care extinde `FodComponent`. Oferă stilizare consistentă, animații și suport pentru diferite variante vizuale. Este optimizată pentru accesibilitate prin atributul `for` și integrare cu sistemul de stiluri FOD.

## Utilizare de Bază

```razor
<!-- Label simplu -->
<FodInputLabel ForId="username-input">
    Nume utilizator
</FodInputLabel>
<input id="username-input" type="text" />

<!-- Label cu stare de eroare -->
<FodInputLabel ForId="email-input" Error="true">
    Email
</FodInputLabel>
<input id="email-input" type="email" />

<!-- Label dezactivat -->
<FodInputLabel ForId="disabled-input" Disabled="true">
    Câmp dezactivat
</FodInputLabel>
<input id="disabled-input" type="text" disabled />
```

## Atribute și Parametri

| Parametru | Tip | Default | Descriere |
|-----------|-----|---------|-----------|
| ChildContent | RenderFragment | - | Conținutul label-ului |
| ForId | string | "" | ID-ul input-ului asociat (pentru WCAG) |
| Disabled | bool | false | Stare dezactivată |
| Error | bool | false | Stare de eroare |
| Variant | FodVariant | Text | Varianta vizuală |
| Margin | Margin | None | Spațiere verticală |
| Class | string | null | Clase CSS adiționale |
| Style | string | null | Stiluri inline |

## Clase CSS Generate

Componenta generează următoarele clase:
- `fod-input-label` - Clasa de bază
- `fod-input-label-animated` - Pentru animații
- `fod-input-label-{variant}` - Bazat pe variant
- `fod-input-label-margin-{margin}` - Pentru spațiere
- `fod-disabled` - Când e dezactivat
- `fod-input-error` - Pentru stare de eroare

## Exemple de Utilizare

### Formular cu Label-uri Complete

```razor
<EditForm Model="@model">
    <div class="form-group">
        <FodInputLabel ForId="name" Margin="Margin.Dense">
            Nume complet <span class="required">*</span>
        </FodInputLabel>
        <input id="name" @bind="model.Name" class="form-control" />
    </div>
    
    <div class="form-group">
        <FodInputLabel ForId="email" 
                       Error="@(!IsEmailValid())"
                       Margin="Margin.Normal">
            Adresă email
        </FodInputLabel>
        <input id="email" @bind="model.Email" type="email" class="form-control" />
        @if (!IsEmailValid())
        {
            <span class="error-message">Email invalid</span>
        }
    </div>
    
    <div class="form-group">
        <FodInputLabel ForId="phone" 
                       Disabled="@model.IsInternational"
                       Margin="Margin.Normal">
            Telefon local
        </FodInputLabel>
        <input id="phone" 
               @bind="model.Phone" 
               disabled="@model.IsInternational" 
               class="form-control" />
    </div>
</EditForm>

@code {
    private UserModel model = new();
    
    private bool IsEmailValid()
    {
        return string.IsNullOrEmpty(model.Email) || 
               model.Email.Contains("@");
    }
}
```

### Label-uri cu Variante

```razor
<!-- Text variant (default) -->
<FodInputLabel ForId="text-input" Variant="FodVariant.Text">
    Text Label
</FodInputLabel>

<!-- Filled variant -->
<FodInputLabel ForId="filled-input" Variant="FodVariant.Filled">
    Filled Label
</FodInputLabel>

<!-- Outlined variant -->
<FodInputLabel ForId="outlined-input" Variant="FodVariant.Outlined">
    Outlined Label
</FodInputLabel>

<style>
    .fod-input-label-text {
        color: #495057;
        font-weight: normal;
    }
    
    .fod-input-label-filled {
        background-color: #f8f9fa;
        padding: 4px 8px;
        border-radius: 4px 4px 0 0;
    }
    
    .fod-input-label-outlined {
        background-color: white;
        padding: 0 4px;
        position: absolute;
        top: -10px;
        left: 12px;
    }
</style>
```

### Label Animat (Floating Label)

```razor
<div class="floating-label-container">
    <input id="floating-input" 
           type="text" 
           placeholder=" "
           @bind="floatingValue" />
    <FodInputLabel ForId="floating-input" 
                   Class="floating-label">
        Label animat
    </FodInputLabel>
</div>

<style>
    .floating-label-container {
        position: relative;
        margin-top: 1rem;
    }
    
    .floating-label-container input {
        padding: 1rem 0.75rem 0.5rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        width: 100%;
    }
    
    .floating-label {
        position: absolute;
        top: 50%;
        left: 0.75rem;
        transform: translateY(-50%);
        transition: all 0.3s ease;
        pointer-events: none;
        background: white;
        padding: 0 0.25rem;
    }
    
    .floating-label-container input:focus + .floating-label,
    .floating-label-container input:not(:placeholder-shown) + .floating-label {
        top: 0;
        font-size: 0.875rem;
        color: #007bff;
    }
</style>

@code {
    private string floatingValue;
}
```

### Label cu Tooltip și Iconițe

```razor
<div class="label-with-info">
    <FodInputLabel ForId="complex-input" Class="d-flex align-items-center">
        <span>Câmp complex</span>
        <FodTooltip Text="Acest câmp necesită informații speciale">
            <FodIcon Icon="@FodIcons.Material.Filled.Info" 
                     Size="FodSize.Small" 
                     Class="ms-1" />
        </FodTooltip>
    </FodInputLabel>
    <input id="complex-input" type="text" class="form-control" />
</div>

<div class="label-with-badge">
    <FodInputLabel ForId="premium-input" Class="d-flex align-items-center">
        <span>Funcție Premium</span>
        <FodBadge Color="FodColor.Warning" Class="ms-2">
            PRO
        </FodBadge>
    </FodInputLabel>
    <input id="premium-input" type="text" class="form-control" />
</div>
```

### Label-uri Condiționate

```razor
<div class="conditional-labels">
    @foreach (var field in dynamicFields)
    {
        <div class="form-group">
            <FodInputLabel ForId="@($"field-{field.Id}")"
                           Error="@field.HasError"
                           Disabled="@(!field.IsEditable)"
                           Margin="Margin.Normal">
                @field.Label
                @if (field.IsRequired)
                {
                    <span class="text-danger">*</span>
                }
            </FodInputLabel>
            
            <input id="@($"field-{field.Id}")"
                   type="@field.Type"
                   disabled="@(!field.IsEditable)"
                   class="form-control @(field.HasError ? "is-invalid" : "")" />
        </div>
    }
</div>

@code {
    private List<DynamicField> dynamicFields = new()
    {
        new() { Id = 1, Label = "Nume", Type = "text", IsRequired = true, IsEditable = true },
        new() { Id = 2, Label = "Email", Type = "email", IsRequired = true, IsEditable = true },
        new() { Id = 3, Label = "Cod", Type = "text", IsRequired = false, IsEditable = false }
    };
    
    public class DynamicField
    {
        public int Id { get; set; }
        public string Label { get; set; }
        public string Type { get; set; }
        public bool IsRequired { get; set; }
        public bool IsEditable { get; set; }
        public bool HasError { get; set; }
    }
}
```

### Label cu Stări Multiple

```razor
<div class="multi-state-example">
    <FodInputLabel ForId="state-input"
                   @ref="labelRef"
                   Error="@hasError"
                   Disabled="@isDisabled"
                   Class="@GetLabelClass()">
        @GetLabelText()
    </FodInputLabel>
    
    <input id="state-input" 
           @bind="stateValue"
           @oninput="ValidateInput"
           disabled="@isDisabled" />
    
    <div class="controls mt-2">
        <FodButton @onclick="ToggleDisabled">Toggle Disabled</FodButton>
        <FodButton @onclick="SimulateError">Simulate Error</FodButton>
    </div>
</div>

@code {
    private FodInputLabel labelRef;
    private string stateValue;
    private bool hasError;
    private bool isDisabled;
    
    private string GetLabelText()
    {
        if (hasError) return "Câmp cu eroare";
        if (isDisabled) return "Câmp dezactivat";
        if (!string.IsNullOrEmpty(stateValue)) return "Câmp completat";
        return "Câmp normal";
    }
    
    private string GetLabelClass()
    {
        if (hasError) return "error-state";
        if (isDisabled) return "disabled-state";
        if (!string.IsNullOrEmpty(stateValue)) return "filled-state";
        return "normal-state";
    }
    
    private void ValidateInput(ChangeEventArgs e)
    {
        stateValue = e.Value?.ToString();
        hasError = stateValue?.Length < 3;
    }
    
    private void ToggleDisabled() => isDisabled = !isDisabled;
    private void SimulateError() => hasError = !hasError;
}
```

## Stilizare

### Stiluri pentru Animații

```css
.fod-input-label-animated {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fod-input-label-animated:hover {
    color: #007bff;
}

/* Animație pentru focus */
.form-control:focus ~ .fod-input-label-animated {
    color: #007bff;
    transform: scale(0.9);
}
```

### Stiluri pentru Stări

```css
/* Eroare */
.fod-input-error {
    color: #dc3545 !important;
}

/* Dezactivat */
.fod-disabled {
    color: #6c757d !important;
    cursor: not-allowed;
    opacity: 0.6;
}

/* Margin-uri */
.fod-input-label-margin-dense {
    margin-bottom: 0.25rem;
}

.fod-input-label-margin-normal {
    margin-bottom: 0.5rem;
}

.fod-input-label-margin-none {
    margin-bottom: 0;
}
```

## Accesibilitate

### Asociere Corectă

```razor
<!-- Corect - folosește ForId -->
<FodInputLabel ForId="accessible-input">
    Câmp accesibil
</FodInputLabel>
<input id="accessible-input" type="text" />

<!-- Alternativă - wrap input -->
<label class="fod-input-label">
    Câmp accesibil
    <input type="text" />
</label>
```

### ARIA Labels

```razor
<FodInputLabel ForId="aria-input" 
               UserAttributes="@(new Dictionary<string, object> 
               { 
                   ["aria-describedby"] = "help-text" 
               })">
    Câmp cu ajutor
</FodInputLabel>
<input id="aria-input" type="text" aria-describedby="help-text" />
<small id="help-text">Text de ajutor pentru acest câmp</small>
```

## Best Practices

1. **Folosiți întotdeauna ForId** - Pentru accesibilitate
2. **Indicați câmpurile obligatorii** - Cu * sau (obligatoriu)
3. **Stilizare consistentă** - Folosiți variantele FOD
4. **Feedback vizual** - Pentru erori și stări
5. **Text clar și concis** - Evitați label-uri lungi

## Integrare cu Componente FOD

```razor
<!-- Cu FodInput -->
<FodInputLabel ForId="fod-input">Email</FodInputLabel>
<FodInput Id="fod-input" @bind-Value="email" InputType="InputType.Email" />

<!-- Cu FODInputWrapper -->
<FODInputWrapper FormComponent="@this">
    <FodInputLabel ForId="@GetName()">@GetLabel()</FodInputLabel>
    <input id="@GetName()" />
</FODInputWrapper>
```

## Performanță

- Component lightweight fără logică complexă
- Re-renderare doar la schimbarea parametrilor
- CSS classes cached prin CssBuilder

## Limitări

- Nu suportă poziționare automată (floating labels necesită CSS custom)
- Nu are animații built-in complexe
- Nu gestionează automat asocierea cu input-uri

## Concluzie

FodInputLabel oferă o soluție simplă dar puternică pentru etichetarea input-urilor, cu suport complet pentru accesibilitate, stări vizuale și integrare în sistemul de design FOD. Este componenta ideală pentru a asigura consistență vizuală și experiență utilizator optimă în formulare.