# Chip  
**Documentație – FodChip**

## Descriere  
`FodChip` sunt elemente compacte care permit utilizatorilor să introducă informații, să selecteze o opțiune, să filtreze conținutul sau să declanșeze o acțiune.  
Pentru mai multe informații despre seturi de chips, vezi `ChipSet`.

---

## Proprietăți

| Nume       | Tip              | Descriere                                              | Valoare Implicită     |
|------------|------------------|--------------------------------------------------------|------------------------|
| Color      | `FodColor`       | Definește culoarea chip-ului.                         | `FodColor.Default`     |
| Variant    | `FodVariant`     | Definește stilul chip-ului (Filled, Text, Outlined).  | `FodVariant.Filled`    |
| Disabled   | `bool`           | Dezactivează componenta.                              | `false`                |
| OnClose    | `EventCallback<FodChip>` | Eveniment declanșat la închiderea chip-ului. | `null`                 |
| CloseIcon  | `string`         | Icon personalizat pentru butonul de închidere.        | `null`                 |
| Icon       | `string`         | Icon-ul afișat în interiorul chip-ului.               | `null`                 |
| IconColor  | `FodColor`       | Culoarea icon-ului afișat.                            | `null`                 |
| Label      | `bool`           | Setează chip-ul ca etichetă rotunjită.                | `false`                |
| Size       | `FodSize`        | Definește dimensiunea chip-ului (Small, Medium, Large)| `FodSize.Medium`       |

---

## Exemple de utilizare

### 1. Chips cu stil `Filled`

```razor
<FodChip>Default</FodChip>
<FodChip Color="FodColor.Primary">Primary</FodChip>
<FodChip Color="FodColor.Secondary">Secondary</FodChip>
<FodChip Color="FodColor.Warning">Warning</FodChip>
<FodChip Disabled="true">Disabled</FodChip>
```

---

### 2. Chips cu stil `Text`

```razor
<FodChip Variant="FodVariant.Text">Default</FodChip>
<FodChip Variant="FodVariant.Text" Color="FodColor.Primary">Primary</FodChip>
<FodChip Variant="FodVariant.Text" Disabled="true">Disabled</FodChip>
```

---

### 3. Chips cu stil `Outlined`

```razor
<FodChip Variant="FodVariant.Outlined">Default</FodChip>
<FodChip Variant="FodVariant.Outlined" Color="FodColor.Info">Info</FodChip>
<FodChip Variant="FodVariant.Outlined" Disabled="true">Disabled</FodChip>
```

---

### 4. Chips care pot fi închise

```razor
<FodChip Color="FodColor.Default" OnClose="Closed">Closable</FodChip>
<FodChip Color="FodColor.Primary" OnClose="Closed" CloseIcon="@FodIcons.Material.Filled.AlarmAdd">Closable</FodChip>

@code {
    void Closed(FodChip chip) {
        // react to chip closed
    }
}
```

---

### 5. Chips cu icoane

```razor
<FodChip Icon="@FodIcons.Material.Filled.Dangerous" IconColor="FodColor.Error">Error</FodChip>
<FodChip Icon="@FodIcons.Material.Filled.Person" Color="FodColor.Primary">Account</FodChip>
```

---

### 6. Chips cu etichete (Labels)

```razor
<FodChip Label="true">Default</FodChip>
<FodChip Icon="@FodIcons.Custom.Brands.GitHub" Label="true" Color="FodColor.Primary">GitHub</FodChip>
<FodChip Icon="@FodIcons.Custom.Brands.Twitter" Label="true" Color="FodColor.Info" OnClose="CloseChip">New Tweets</FodChip>

@code {
    void CloseChip() {
        // Code..
    }
}
```

---

### 7. Dimensiuni diferite

```razor
<FodChip Size="FodSize.Small">Small</FodChip>
<FodChip Size="FodSize.Medium">Medium</FodChip>
<FodChip Size="FodSize.Large">Large</FodChip>
