# Button Group

## Documentație pentru componenta FodButtonGroup

### 1. Descriere Generală
`FodButtonGroup` este o componentă Blazor utilizată pentru a grupa mai multe butoane într-o singură unitate vizuală coerentă. Aceasta permite organizarea butoanelor fie pe orizontală, fie pe verticală, oferind în același timp suport pentru stiluri personalizate și variante de afișare.

Componenta suportă:
- Aliniere verticală sau orizontală
- Suprimarea efectului de ridicare (elevation)
- Personalizare prin culori și dimensiuni
- Suport pentru RTL (Right-to-Left)
- Posibilitatea de a suprascrie stilurile butoanelor individuale

### 2. Ghid de Utilizare API

#### Exemplu de utilizare
```razor
<FodButtonGroup Color="FodColor.Primary" Variant="FodVariant.Filled">
    <FodButton>Button 1</FodButton>
    <FodButton>Button 2</FodButton>
    <FodButton>Button 3</FodButton>
</FodButtonGroup>
```

#### Basic button group
```razor
<FodButtonGroup Color="FodColor.Primary" Variant="FodVariant.Outlined">
    <FodButton>One</FodButton>
    <FodButton>Two</FodButton>
    <FodButton>Three</FodButton>
</FodButtonGroup>
```

#### Sizes and colors
```razor
<FodButtonGroup Color="FodColor.Secondary" Size="FodSize.Medium" Variant="FodVariant.Outlined">
    <FodButton>One</FodButton>
    <FodButton>Two</FodButton>
    <FodButton>Three</FodButton>
</FodButtonGroup>
```

#### Vertical button group
```razor
<FodButtonGroup Color="FodColor.Primary" Variant="FodVariant.Outlined" VerticalAlign="true">
    <FodButton>One</FodButton>
    <FodButton>Two</FodButton>
    <FodButton>Three</FodButton>
</FodButtonGroup>
```

#### Icon buttons
```razor
<FodButtonGroup Color="FodColor.Primary" Variant="FodVariant.Outlined">
    <FodIconButton Icon="@FodIcons.Material.Filled.AccessAlarm"></FodIconButton>
    <FodButton StartIcon="@FodIcons.Material.Filled.AlarmAdd" IconColor="FodColor.Warning">Add alarm</FodButton>
</FodButtonGroup>
```

#### Disable elevation
```razor
<FodButtonGroup Color="FodColor.Primary" Variant="FodVariant.Filled" DisableElevation="@_disableElevation">
    <FodButton>One</FodButton>
    <FodButton>Two</FodButton>
    <FodButton>Three</FodButton>
</FodButtonGroup>

<FodCheckBox2 @bind-Checked="@_disableElevation" Label="Disable elevation" Color="FodColor.Primary" />

@code {
    private bool _disableElevation = true;
}
```

#### Custom styles
Utilizând proprietatea `OverrideStyles="false"`, `FodButtonGroup` nu va rescrie stilurile fiecărui buton în parte.

```razor
<FodButtonGroup Color="FodColor.Primary" Variant="FodVariant.Outlined" OverrideStyles="_overrideStyles">
    <FodButton Color="FodColor.Primary" Variant="FodVariant.Outlined">One</FodButton>
    <FodButton Color="FodColor.Warning" Variant="FodVariant.Outlined">Two</FodButton>
    <FodButton Color="FodColor.Secondary" Variant="FodVariant.Outlined">Three</FodButton>
</FodButtonGroup>

<FodCheckBox2 @bind-Checked="@_overrideStyles" Label="Override styles" Color="FodColor.Primary" />

@code {
    private bool _overrideStyles;
}
```

### Atribute disponibile

| Proprietate       | Tip             | Descriere                                                                 |
|-------------------|------------------|---------------------------------------------------------------------------|
| `OverrideStyles`  | `bool`           | Dacă este `true`, stilurile implicite ale butoanelor sunt suprascrise. Implicit `true`. |
| `VerticalAlign`   | `bool`           | Dacă este `true`, butoanele vor fi aliniate vertical. Implicit `false`.   |
| `DisableElevation`| `bool`           | Dacă este `true`, elimină efectul de ridicare (shadow). Implicit `false`. |
| `RightToLeft`     | `bool`           | Dacă este `true`, afișează butoanele în direcția RTL.                     |
| `Color`           | `FodColor`       | Culoarea grupului de butoane. Acceptă culorile temei.                     |
| `Size`            | `FodSize`        | Dimensiunea butoanelor din grup.                                          |
| `Variant`         | `FodVariant`     | Varianta de stil a butoanelor.                                            |
| `ChildContent`    | `RenderFragment` | Conținutul butonului (alte componente sau text).                          |

### 3. Metode Publice și Protejate

- `Classname()` _(Protejată)_ – Construiește și returnează clasa CSS corespunzătoare grupului de butoane, pe baza proprietăților setate.

### 4. Concluzie
`FodButtonGroup` permite organizarea și stilizarea eficientă a grupurilor de butoane, oferind flexibilitate și compatibilitate cu temele Blazor.

