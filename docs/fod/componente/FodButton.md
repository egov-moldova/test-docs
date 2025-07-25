# Button

## Documentație pentru componenta FodButton

### 1. Descriere Generală
`FodButton` este o componentă Blazor utilizată pentru a crea butoane stilizate, care suportă diferite variante, culori, dimensiuni și comportamente interactive. Aceasta extinde componenta de bază `FodBaseButton`, permițând personalizări suplimentare.

Componenta suportă:
- Pictograme la început și la sfârșit
- Culori și dimensiuni personalizabile
- Opțiunea de a ocupa întreaga lățime
- Efect ripple (poate fi dezactivat)
- Control asupra ridicării (elevation)

### 2. Ghid de Utilizare API

#### Exemplu de utilizare
```razor
<FodButton Color="FodColor.Primary" Size="FodSize.Large" FullWidth="true">
    Click Me
</FodButton>
```

#### Filled Buttons
```razor
<FodButton Variant="FodVariant.Filled">Default</FodButton>
<FodButton Variant="FodVariant.Filled" Color="FodColor.Primary">Primary</FodButton>
<FodButton Variant="FodVariant.Filled" Color="FodColor.Secondary">Secondary</FodButton>
<FodButton Variant="FodVariant.Filled" Disabled="true">Disabled</FodButton>
```

#### Eliminarea ridicării (Elevation)
```razor
<FodButton Variant="FodVariant.Filled" DisableElevation="true" Color="FodColor.Primary">Fără ridicare</FodButton>
```

#### Text Buttons
```razor
<FodButton Variant="FodVariant.Text">Default</FodButton>
<FodButton Variant="FodVariant.Text" Color="FodColor.Primary">Primary</FodButton>
<FodButton Variant="FodVariant.Text" Color="FodColor.Secondary">Secondary</FodButton>
<FodButton Variant="FodVariant.Text" Disabled="true">Disabled</FodButton>
```

#### Outlined Buttons
```razor
<FodButton Variant="FodVariant.Outlined">Default</FodButton>
<FodButton Variant="FodVariant.Outlined" Color="FodColor.Primary">Primary</FodButton>
<FodButton Variant="FodVariant.Outlined" Color="FodColor.Secondary">Secondary</FodButton>
<FodButton Variant="FodVariant.Outlined" Disabled="true">Disabled</FodButton>
```

#### FullWidth
```razor
<FodButton Variant="FodVariant.Filled" Color="FodColor.Primary" FullWidth="true">Full Width Button</FodButton>
```

#### Icons și etichete
```razor
<FodButton Variant="FodVariant.Filled" StartIcon="@FodIcons.Material.Filled.Delete" Color="FodColor.Error">Delete</FodButton>
<FodButton Variant="FodVariant.Filled" EndIcon="@FodIcons.Material.Filled.Send" Color="FodColor.Primary">Send</FodButton>
<FodButton Variant="FodVariant.Filled" StartIcon="@FodIcons.Custom.Uncategorized.Radioactive" Color="FodColor.Warning">Warning</FodButton>
<FodButton Variant="FodVariant.Filled" StartIcon="@FodIcons.Material.Filled.Mic" Disabled="true">Talk</FodButton>
<FodButton Variant="FodVariant.Filled" StartIcon="@FodIcons.Material.Filled.Save" Color="FodColor.Info"  Size="FodSize.Small">Save</FodButton>
<FodButton Variant="FodVariant.Filled" StartIcon="@FodIcons.Material.Filled.Save" IconColor="FodColor.Secondary" Size="FodSize.Large">Save</FodButton>
```

#### Customized Buttons
```razor
<FodButton Variant="FodVariant.Filled" EndIcon="@FodIcons.Material.Filled.ArrowDownward" Style="background-color: yellowgreen; color: white; width: 200px; height: 60px;">
    Download Now
</FodButton>
```

#### Link Button
```razor
<FodButton Href="https://fod.live.egov.md"
           Target="_blank"
           Variant="FodVariant.Filled"
           EndIcon="@FodIcons.Custom.Brands.GitHub"
           Color="FodColor.Primary"
           Disabled=@disabled>
    Fod Home Page
</FodButton>

<FodButton Href="https://fod.live.egov.md"
           Target="_blank"
           Variant="FodVariant.Text"
           EndIcon="@FodIcons.Custom.Brands.GitHub"
           Color="FodColor.Secondary"
           Style="text-transform:none"
           Disabled=@disabled>
    Fod Home Page
</FodButton>

<FodButton Href="https://fod.live.egov.md"
           Target="_blank"
           Variant="FodVariant.Outlined"
           EndIcon="@FodIcons.Custom.Brands.GitHub"
           Color="FodColor.Tertiary"
           Disabled=@disabled>
    Fod Home Page
</FodButton>

<FodCheckBox2 Color="FodColor.Primary" @bind-Checked=@(disabled) Label="Disable" />

@code{
    bool disabled = false;
}
```

#### Custom Rel Content
```razor
<FodButton Href="https://fod.live.egov.md"
           Rel="nofollow"
           Variant="FodVariant.Filled"
           EndIcon="@FodIcons.Custom.Brands.GitHub"
           Color="FodColor.Primary">
    Fod Home Page
</FodButton>

<FodButton Href="https://fod.live.egov.md"
           Target="_blank"
           Rel="nofollow noopener"
           Variant="FodVariant.Outlined"
           EndIcon="@FodIcons.Custom.Brands.GitHub"
           Color="FodColor.Tertiary">
   Fod Home Page
</FodButton>
```

#### Loading Button
```razor
<FodButton Disabled="@_processing" OnClick="ProcessSomething" Variant="FodVariant.Filled" Color="FodColor.Primary">
    @if (_processing)
    {
        <FodLoadingCircular Class="ms-n1" Size="Size.Small" Indeterminate="true"/>
        <FodText Class="ms-2">Processing</FodText>
    }
    else
    {
        <FodText>Click me</FodText>
    }
</FodButton>

@code {
    private bool _processing = false;

    async Task ProcessSomething()
    {
        _processing = true;
        await Task.Delay(2000);
        _processing = false;
    }
}
```

### Atribute disponibile

| Proprietate   | Tip         | Descriere                                      |
|---------------|-------------|-------------------------------------------------|
| `StartIcon`   | `string`    | Pictogramă afișată înaintea textului.          |
| `EndIcon`     | `string`    | Pictogramă afișată după text.                 |
| `IconColor`   | `FodColor`  | Culoarea pictogramei.                          |
| `IconClass`   | `string`    | Clasa CSS pentru pictogramă.                  |
| `Color`       | `FodColor`  | Culoarea butonului.                            |
| `Size`        | `FodSize`   | Dimensiunea butonului.                         |
| `Variant`     | `FodVariant`| Varianta butonului.                            |
| `FullWidth`   | `bool`      | Dacă este `true`, butonul ocupă întreaga lățime.|
| `ChildContent`| `RenderFragment` | Conținutul afișat în buton.           |

### 3. Metode Publice și Protejate

- `OnClickHandler(MouseEventArgs ev)` _(Protejată)_ – Gestionează evenimentul de click al butonului și execută comanda asociată, dacă este definită.
- `FocusAsync()` _(Publică)_ – Permite focalizarea programatică a butonului (returnează `ValueTask`).
- `OnInitialized()` _(Protejată)_ – Este apelată la inițializarea componentei și setează valorile implicite.
- `OnParametersSet()` _(Protejată)_ – Este apelată când parametrii componentei sunt actualizați.
- `SetDefaultValues()` _(Privată)_ – Setează valorile implicite pentru `HtmlTag`, `Link`, și `Target`.

### 4. Concluzie
`FodButton` este o soluție flexibilă și reutilizabilă pentru crearea butoanelor în Blazor, oferind multiple opțiuni de personalizare pentru culori, dimensiuni și comportamente.

