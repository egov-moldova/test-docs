# Icon Button

## Descriere
`FodIconButton` este o variantă a `FodButton`, dar optimizată pentru afișarea de icoane. Aceasta oferă suport pentru diferite variante, culori și dimensiuni.

> Pentru mai multe informații despre utilizarea icoanelor, vizitează pagina dedicată **Icons**.

## Proprietăți

| Nume         | Tip             | Descriere                                                                          | Valoare Implicită     |
|--------------|------------------|------------------------------------------------------------------------------------|------------------------|
| `Icon`       | `string`         | Specifică iconul care va fi afișat în componentă.                                 | `null`                 |
| `Title`      | `string`         | Titlul iconului pentru accesibilitate (atribut `title`).                          | `null`                 |
| `Color`      | `FodColor`       | Specifică culoarea butonului, suportând culorile definite în temă.               | `FodColor.Default`     |
| `Size`       | `FodSize`        | Definește dimensiunea butonului.                                                  | `FodSize.Medium`       |
| `Edge`       | `Edge`           | Aplică un margin negativ dacă este setat.                                         | `Edge.False`           |
| `ChildContent` | `RenderFragment` | Conținutul copil al componentei, afișat doar dacă `Icon` este null sau gol.       | `null`                 |
| `Variant`    | `FodVariant`     | Definește varianta butonului (`Text`, `Outlined`, `Contained` etc.).             | `FodVariant.Text`      |

## Exemple de utilizare

### 1. Butoane cu icoane simple
Utilizând librăria de icoane preîncărcată:

```razor
<FodIconButton Icon="@FodIcons.Material.Filled.Delete" aria-label="delete"></FodIconButton>
<FodIconButton Icon="@FodIcons.Custom.Brands.GitHub" Color="FodColor.Primary" aria-label="github"></FodIconButton>
<FodIconButton Icon="@FodIcons.Material.Filled.Favorite" Color="FodColor.Secondary" aria-label="add to favorite"></FodIconButton>
<FodIconButton Icon="@FodIcons.Material.Filled.Share" Disabled="true" aria-label="share"></FodIconButton>
```

### 2. Utilizarea font icons (FontAwesome)
În acest exemplu, se folosesc clasele Font Awesome:

```html
<link href="https://use.fontawesome.com/releases/v5.14.0/css/all.css" rel="stylesheet">
```

```razor
<FodIconButton Icon="fas fa-atom" Color="FodColor.Error"></FodIconButton>
<FodIconButton Icon="fas fa-fighter-jet" Color="FodColor.Dark"></FodIconButton>
<FodIconButton Icon="fas fa-globe-europe" Color="FodColor.Tertiary"></FodIconButton>
<FodIconButton Icon="fas fa-bug" Disabled="true"></FodIconButton>
```

### 3. Variante diferite pentru IconButton
Se poate aplica stilul unui buton text utilizând parametrul `Variant`:

```razor
<FodIconButton Icon="@FodIcons.Material.Filled.Delete" Variant="FodVariant.Outlined" Color="FodColor.Primary" Size="FodSize.Small" />
<FodIconButton Icon="@FodIcons.Material.Filled.Delete" Variant="FodVariant.Outlined" Color="FodColor.Primary" Size="FodSize.Medium" />
<FodIconButton Icon="@FodIcons.Material.Filled.Delete" Variant="FodVariant.Outlined" Color="FodColor.Primary" Size="FodSize.Large" />

<FodIconButton Icon="@FodIcons.Material.Filled.Delete" Variant="FodVariant.Filled" Color="FodColor.Primary" Size="FodSize.Large" />
<FodIconButton Icon="@FodIcons.Material.Filled.Delete" Variant="FodVariant.Filled" Color="FodColor.Primary" Size="FodSize.Medium" />
<FodIconButton Icon="@FodIcons.Material.Filled.Delete" Variant="FodVariant.Filled" Color="FodColor.Primary" Size="FodSize.Small" />
```

