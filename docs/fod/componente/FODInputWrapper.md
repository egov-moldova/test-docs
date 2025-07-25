# FODInputWrapper

## Descriere Generală

`FODInputWrapper` este o componentă container care oferă un layout consistent pentru toate componentele de formular din biblioteca FOD. Gestionează afișarea etichetelor, indicatorilor de câmp obligatoriu, tooltip-urilor cu descrieri și stilizarea uniformă a formularelor.

## Utilizare de Bază

```razor
<!-- Wrapper pentru un input custom -->
<FODInputWrapper FormComponent="@this">
    <input type="text" class="form-control" />
</FODInputWrapper>

<!-- Wrapper cu toate opțiunile -->
<FODInputWrapper FormComponent="@myComponent"
                 LabelUpperCase="true"
                 BoldText="true"
                 RequiredLabel="true">
    <MyCustomInput />
</FODInputWrapper>
```

## Structura HTML Generată

```html
<div class="form-group position-relative">
    <!-- Secțiunea label (dacă RequiredLabel=true) -->
    <div class="d-flex align-items-center mt-2 gap-2">
        <label for="inputName" class="col-form-label mb-0">
            Label Text
            <span class="text-danger">*</span> <!-- Dacă e required -->
        </label>
        <!-- Tooltip dacă există descriere -->
        <Tooltip Text="Descriere câmp" />
    </div>
    
    <!-- Conținutul propriu-zis -->
    <div class="row">
        <div class="col">
            <!-- ChildContent -->
        </div>
    </div>
</div>
```

## Atribute și Parametri

| Parametru | Tip | Default | Descriere |
|-----------|-----|---------|-----------|
| FormComponent | IFODFormComponent | - | Componenta de formular asociată (obligatoriu) |
| ChildContent | RenderFragment | - | Conținutul care va fi wrapped |
| LabelUpperCase | bool | false | Transformă label-ul în majuscule |
| BoldText | bool | false | Face textul label-ului bold |
| RequiredLabel | bool | true | Afișează sau ascunde label-ul |

## Interfața IFODFormComponent

Pentru ca o componentă să funcționeze cu FODInputWrapper, trebuie să implementeze:

```csharp
public interface IFODFormComponent
{
    string GetName();        // Numele/ID-ul câmpului
    string GetLabel();       // Textul pentru label
    string GetDescription(); // Descrierea pentru tooltip
    bool IsRequired();       // Dacă e câmp obligatoriu
}
```

## Exemple de Utilizare

### Componentă Custom cu Wrapper

```razor
@implements IFODFormComponent

<FODInputWrapper FormComponent="@this">
    <div class="custom-input-container">
        <input type="text" 
               id="@GetName()" 
               class="form-control"
               @bind="Value" />
        @if (ShowCharCount)
        {
            <small class="text-muted">@Value.Length / @MaxLength</small>
        }
    </div>
</FODInputWrapper>

@code {
    [Parameter] public string Value { get; set; } = "";
    [Parameter] public string Label { get; set; } = "Custom Input";
    [Parameter] public string Description { get; set; }
    [Parameter] public bool Required { get; set; }
    [Parameter] public bool ShowCharCount { get; set; } = true;
    [Parameter] public int MaxLength { get; set; } = 100;
    
    // Implementare IFODFormComponent
    public string GetName() => $"custom-input-{GetHashCode()}";
    public string GetLabel() => Label;
    public string GetDescription() => Description;
    public bool IsRequired() => Required;
}
```

### Utilizare în Componente FOD

```razor
<!-- În FODInputText.razor -->
<FODInputWrapper LabelUpperCase="@LabelUpperCase" FormComponent="@this">
    <input class="form-control @CssClass" 
           value="@CurrentValueAsString" 
           name="@GetName()" 
           @onchange="OnChange" 
           disabled="@Readonly" 
           placeholder="@GetPlaceholder()" 
           type="text" />
    
    @if (IsLoading)
    {
        <FodLoadingLinear FodColor="FodColor.Primary" Indeterminate="true" />
    }
    <ValidationMessage For="ValueExpression"/>
</FODInputWrapper>
```

### Formular Complex cu Multiple Wrappers

```razor
<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />
    
    <!-- Input text cu label uppercase -->
    <FODInputWrapper FormComponent="@nameComponent" LabelUpperCase="true">
        <input @bind="model.Name" class="form-control" />
    </FODInputWrapper>
    
    <!-- Select cu label bold -->
    <FODInputWrapper FormComponent="@categoryComponent" BoldText="true">
        <select @bind="model.Category" class="form-select">
            <option value="">Selectați categoria</option>
            <option value="1">Categoria 1</option>
            <option value="2">Categoria 2</option>
        </select>
    </FODInputWrapper>
    
    <!-- Textarea fără label -->
    <FODInputWrapper FormComponent="@descriptionComponent" RequiredLabel="false">
        <textarea @bind="model.Description" class="form-control" rows="4"></textarea>
    </FODInputWrapper>
    
    <button type="submit" class="btn btn-primary">Salvează</button>
</EditForm>

@code {
    private FormModel model = new();
    
    // Componente care implementează IFODFormComponent
    private IFODFormComponent nameComponent;
    private IFODFormComponent categoryComponent;
    private IFODFormComponent descriptionComponent;
}
```

### Wrapper cu Stilizare Customizată

```razor
<style>
    .custom-wrapper .form-group {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }
    
    .custom-wrapper label {
        color: #495057;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    
    .custom-wrapper .text-danger {
        font-size: 1.2em;
        vertical-align: super;
    }
    
    .gradient-label label {
        background: linear-gradient(45deg, #007bff, #6610f2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: bold;
    }
</style>

<div class="custom-wrapper">
    <FODInputWrapper FormComponent="@component1">
        <input type="text" class="form-control" />
    </FODInputWrapper>
</div>

<div class="gradient-label">
    <FODInputWrapper FormComponent="@component2" BoldText="true">
        <input type="email" class="form-control" />
    </FODInputWrapper>
</div>
```

## Integrare cu Tooltip

Când componenta formular oferă o descriere, wrapper-ul afișează automat un tooltip:

```razor
@code {
    public string GetDescription() => "Acest câmp acceptă doar litere și cifre";
}

<!-- Rezultat HTML -->
<div class="d-flex align-items-center mt-2 gap-2">
    <label>Nume utilizator <span class="text-danger">*</span></label>
    <Tooltip Text="Acest câmp acceptă doar litere și cifre" />
</div>
```

## Responsive Design

```css
@media (max-width: 950px) {
    .row {
        margin: 0;
    }
    
    .col {
        margin-right: 10px;
        align-self: baseline;
    }
}
```

## Stiluri CSS

### Clase Generate

- `.form-group` - Container principal
- `.position-relative` - Pentru poziționare tooltip
- `.label-upper-case` - Aplicat când LabelUpperCase=true
- `.fw-bold` - Aplicat când BoldText=true
- `.col-form-label` - Stilizare label
- `.text-danger` - Pentru asteriscul de required

### Personalizare Globală

```css
/* Stilizare globală pentru toate wrapper-ele */
.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    font-size: 0.875rem;
    color: #6c757d;
    margin-bottom: 0.25rem;
}

.form-group .text-danger {
    margin-left: 2px;
}

/* Dark theme */
[data-theme="dark"] .form-group label {
    color: #adb5bd;
}
```

## Accesibilitate

1. **Label-uri asociate** - Folosește atributul `for` cu ID-ul corect
2. **Indicatori vizuali** - Asteriscul roșu pentru câmpuri obligatorii
3. **Descrieri accesibile** - Prin tooltip-uri
4. **Structură semantică** - Folosește elemente HTML corecte

## Best Practices

1. **Implementați IFODFormComponent corect** - Toate metodele trebuie implementate
2. **Folosiți descrieri utile** - Pentru a ajuta utilizatorii
3. **Consistență** - Folosiți wrapper-ul pentru toate câmpurile
4. **Nu duplicați label-uri** - Wrapper-ul le gestionează automat
5. **Validare** - Includeți ValidationMessage în ChildContent

## Integrare cu Componente Existente

Majoritatea componentelor FOD folosesc deja FODInputWrapper:
- FODInputText
- FODInputNumber  
- FODInputSelect
- FODInputRadioGroup
- FODInputFile
- Și altele...

## Avantaje

1. **Consistență vizuală** - Toate formularele arată la fel
2. **Cod DRY** - Nu repetați logica de afișare
3. **Maintenance ușor** - Schimbări într-un singur loc
4. **Accesibilitate** - Gestionată centralizat
5. **Flexibilitate** - Suportă orice tip de input

## Limitări

- Necesită implementarea IFODFormComponent
- Layout-ul este relativ fix
- Nu suportă label-uri inline
- Nu are suport pentru label-uri complexe (cu HTML)

## Concluzie

FODInputWrapper este componenta fundamentală pentru crearea unui sistem uniform de formulare în aplicațiile FOD. Prin centralizarea logicii de afișare și stilizare, asigură consistență și reduce duplicarea codului, fiind esențială pentru orice componentă de formular personalizată.