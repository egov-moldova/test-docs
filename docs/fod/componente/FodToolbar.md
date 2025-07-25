# Toolbar

## Documentație pentru componenta FodToolbar

### 1. Descriere Generală
`FodToolbar` este o componentă container flexibilă pentru organizarea acțiunilor și controalelor într-o bară orizontală. Este ideală pentru crearea de bare de instrumente, antete de secțiuni sau grupări de butoane și controale.

Caracteristici principale:
- Layout flexibil cu suport pentru spacing
- Mod compact (dense) pentru economisirea spațiului
- Control asupra padding-ului lateral (gutters)
- Integrare perfectă cu FodSpacer pentru aliniere
- Container semantic pentru acțiuni grupate
- Design responsive
- Suport pentru orice tip de conținut

### 2. Ghid de Utilizare API

#### Toolbar simplu
```razor
<FodToolbar>
    <FodButton Variant="FodVariant.Text" StartIcon="@FodIcons.Material.Filled.Add">
        Adaugă
    </FodButton>
    <FodButton Variant="FodVariant.Text" StartIcon="@FodIcons.Material.Filled.Edit">
        Editează
    </FodButton>
    <FodButton Variant="FodVariant.Text" StartIcon="@FodIcons.Material.Filled.Delete">
        Șterge
    </FodButton>
</FodToolbar>
```

#### Toolbar cu spacer pentru aliniere
```razor
<FodToolbar>
    <FodIconButton Icon="@FodIcons.Material.Filled.Menu" />
    <FodText Typo="Typo.h6" Class="mx-3">
        Dashboard
    </FodText>
    <FodSpacer />
    <FodIconButton Icon="@FodIcons.Material.Filled.Notifications" />
    <FodIconButton Icon="@FodIcons.Material.Filled.AccountCircle" />
</FodToolbar>
```

#### Toolbar compact (dense)
```razor
<FodToolbar Dense="true">
    <FodButton Size="FodSize.Small">Salvează</FodButton>
    <FodButton Size="FodSize.Small">Anulează</FodButton>
    <FodSpacer />
    <FodButton Size="FodSize.Small" Color="FodColor.Error">
        Șterge
    </FodButton>
</FodToolbar>
```

#### Toolbar fără gutters
```razor
<FodToolbar DisableGutters="true">
    <FodButton Variant="FodVariant.Text" FullWidth="true">
        Opțiunea 1
    </FodButton>
    <FodButton Variant="FodVariant.Text" FullWidth="true">
        Opțiunea 2
    </FodButton>
    <FodButton Variant="FodVariant.Text" FullWidth="true">
        Opțiunea 3
    </FodButton>
</FodToolbar>
```

#### Toolbar pentru filtrare și căutare
```razor
<FodToolbar>
    <FodTextField T="string" 
                  Label="Caută" 
                  Variant="FodVariant.Outlined"
                  Margin="Margin.Dense"
                  AdornmentIcon="@FodIcons.Material.Filled.Search"
                  Adornment="Adornment.Start"
                  @bind-Value="searchText" />
    <FodSpacer />
    <FodSelect T="string" 
               Label="Sortează după" 
               Variant="FodVariant.Outlined"
               Margin="Margin.Dense"
               @bind-Value="sortBy"
               Style="min-width: 150px;">
        <FodSelectItem Value="name">Nume</FodSelectItem>
        <FodSelectItem Value="date">Dată</FodSelectItem>
        <FodSelectItem Value="size">Dimensiune</FodSelectItem>
    </FodSelect>
    <FodIconButton Icon="@FodIcons.Material.Filled.FilterList" 
                   Color="@(showFilters ? FodColor.Primary : FodColor.Default)"
                   OnClick="@(() => showFilters = !showFilters)" />
</FodToolbar>

@code {
    private string searchText = "";
    private string sortBy = "name";
    private bool showFilters = false;
}
```

#### Toolbar pentru navigare în pagini
```razor
<FodToolbar>
    <FodText Typo="Typo.body2">
        Afișare @startItem - @endItem din @totalItems
    </FodText>
    <FodSpacer />
    <FodIconButton Icon="@FodIcons.Material.Filled.FirstPage" 
                   Disabled="@(currentPage == 1)"
                   OnClick="GoToFirstPage" />
    <FodIconButton Icon="@FodIcons.Material.Filled.ChevronLeft" 
                   Disabled="@(currentPage == 1)"
                   OnClick="GoToPreviousPage" />
    <FodText Typo="Typo.body2" Class="mx-2">
        Pagina @currentPage din @totalPages
    </FodText>
    <FodIconButton Icon="@FodIcons.Material.Filled.ChevronRight" 
                   Disabled="@(currentPage == totalPages)"
                   OnClick="GoToNextPage" />
    <FodIconButton Icon="@FodIcons.Material.Filled.LastPage" 
                   Disabled="@(currentPage == totalPages)"
                   OnClick="GoToLastPage" />
</FodToolbar>

@code {
    private int currentPage = 1;
    private int totalPages = 10;
    private int itemsPerPage = 20;
    private int totalItems = 200;
    private int startItem => (currentPage - 1) * itemsPerPage + 1;
    private int endItem => Math.Min(currentPage * itemsPerPage, totalItems);
}
```

#### Toolbar pentru editor de text
```razor
<FodToolbar Dense="true">
    <FodButtonGroup Variant="FodVariant.Text" Size="FodSize.Small">
        <FodIconButton Icon="@FodIcons.Material.Filled.FormatBold" 
                       Color="@(isBold ? FodColor.Primary : FodColor.Default)"
                       OnClick="@(() => isBold = !isBold)" />
        <FodIconButton Icon="@FodIcons.Material.Filled.FormatItalic" 
                       Color="@(isItalic ? FodColor.Primary : FodColor.Default)"
                       OnClick="@(() => isItalic = !isItalic)" />
        <FodIconButton Icon="@FodIcons.Material.Filled.FormatUnderlined" 
                       Color="@(isUnderlined ? FodColor.Primary : FodColor.Default)"
                       OnClick="@(() => isUnderlined = !isUnderlined)" />
    </FodButtonGroup>
    
    <FodDivider Orientation="Orientation.Vertical" FlexItem="true" Class="mx-2" />
    
    <FodButtonGroup Variant="FodVariant.Text" Size="FodSize.Small">
        <FodIconButton Icon="@FodIcons.Material.Filled.FormatAlignLeft" />
        <FodIconButton Icon="@FodIcons.Material.Filled.FormatAlignCenter" />
        <FodIconButton Icon="@FodIcons.Material.Filled.FormatAlignRight" />
        <FodIconButton Icon="@FodIcons.Material.Filled.FormatAlignJustify" />
    </FodButtonGroup>
    
    <FodDivider Orientation="Orientation.Vertical" FlexItem="true" Class="mx-2" />
    
    <FodIconButton Icon="@FodIcons.Material.Filled.FormatListBulleted" Size="FodSize.Small" />
    <FodIconButton Icon="@FodIcons.Material.Filled.FormatListNumbered" Size="FodSize.Small" />
</FodToolbar>

@code {
    private bool isBold = false;
    private bool isItalic = false;
    private bool isUnderlined = false;
}
```

#### Toolbar pentru tabel
```razor
<FodToolbar>
    <FodText Typo="Typo.h6">Utilizatori</FodText>
    <FodSpacer />
    <FodButton Variant="FodVariant.Outlined" 
               StartIcon="@FodIcons.Material.Filled.FileDownload">
        Export
    </FodButton>
    <FodButton Variant="FodVariant.Filled" 
               Color="FodColor.Primary"
               StartIcon="@FodIcons.Material.Filled.Add">
        Adaugă utilizator
    </FodButton>
</FodToolbar>

<FodTable Items="@users" Class="mt-4">
    <!-- Conținut tabel -->
</FodTable>
```

#### Toolbar cu acțiuni contextuale
```razor
<FodToolbar>
    @if (selectedItems.Any())
    {
        <FodCheckbox Checked="@allSelected" 
                     CheckedChanged="ToggleSelectAll"
                     Color="FodColor.Primary" />
        <FodText Typo="Typo.body2" Class="mx-3">
            @selectedItems.Count selectate
        </FodText>
        <FodButton Variant="FodVariant.Text" 
                   StartIcon="@FodIcons.Material.Filled.Delete"
                   Color="FodColor.Error"
                   OnClick="DeleteSelected">
            Șterge
        </FodButton>
        <FodButton Variant="FodVariant.Text" 
                   StartIcon="@FodIcons.Material.Filled.Archive"
                   OnClick="ArchiveSelected">
            Arhivează
        </FodButton>
    }
    else
    {
        <FodText Typo="Typo.h6">Documente</FodText>
    }
    <FodSpacer />
    <FodIconButton Icon="@FodIcons.Material.Filled.ViewList" 
                   Color="@(viewMode == "list" ? FodColor.Primary : FodColor.Default)"
                   OnClick="@(() => viewMode = "list")" />
    <FodIconButton Icon="@FodIcons.Material.Filled.ViewModule" 
                   Color="@(viewMode == "grid" ? FodColor.Primary : FodColor.Default)"
                   OnClick="@(() => viewMode = "grid")" />
</FodToolbar>

@code {
    private List<int> selectedItems = new();
    private bool allSelected = false;
    private string viewMode = "list";
}
```

#### Toolbar responsive
```razor
<FodToolbar>
    <FodHidden Breakpoint="Breakpoint.SmAndUp">
        <FodIconButton Icon="@FodIcons.Material.Filled.Menu" 
                       OnClick="@(() => drawerOpen = true)" />
    </FodHidden>
    
    <FodText Typo="Typo.h6" Class="mx-3">
        Aplicația Mea
    </FodText>
    
    <FodHidden Breakpoint="Breakpoint.Xs">
        <FodButton Variant="FodVariant.Text">Acasă</FodButton>
        <FodButton Variant="FodVariant.Text">Despre</FodButton>
        <FodButton Variant="FodVariant.Text">Servicii</FodButton>
        <FodButton Variant="FodVariant.Text">Contact</FodButton>
    </FodHidden>
    
    <FodSpacer />
    
    <FodButton Variant="FodVariant.Filled" Color="FodColor.Primary">
        Înregistrare
    </FodButton>
</FodToolbar>
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Dense` | `bool` | Activează modul compact cu padding redus | `false` |
| `DisableGutters` | `bool` | Dezactivează padding-ul lateral | `false` |
| `ChildContent` | `RenderFragment` | Conținutul toolbar-ului | - |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |
| `UserAttributes` | `Dictionary<string, object>` | Atribute HTML adiționale | `null` |

### 4. Clase CSS generate

| Clasă | Condiție | Descriere |
|-------|----------|-----------|
| `fod-toolbar` | Întotdeauna | Clasa de bază |
| `fod-toolbar-dense` | `Dense="true"` | Mod compact |
| `fod-toolbar-gutters` | `DisableGutters="false"` | Padding lateral |

### 5. Stilizare și personalizare

```css
/* Toolbar cu înălțime personalizată */
.custom-height-toolbar {
    min-height: 48px;
}

/* Toolbar cu fundal gradient */
.gradient-toolbar {
    background: linear-gradient(45deg, #3f51b5, #2196f3);
    color: white;
}

.gradient-toolbar .fod-button {
    color: white;
}

/* Toolbar cu umbră */
.elevated-toolbar {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    background-color: white;
    border-radius: 4px;
    margin-bottom: 16px;
}

/* Toolbar sticky */
.sticky-toolbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: white;
    border-bottom: 1px solid rgba(0,0,0,0.12);
}

/* Toolbar cu separatoare vizuale */
.sectioned-toolbar > *:not(:last-child) {
    border-right: 1px solid rgba(0,0,0,0.12);
    padding-right: 16px;
    margin-right: 16px;
}

/* Toolbar transparent */
.transparent-toolbar {
    background-color: transparent;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}
```

### 6. Integrare cu alte componente

#### În AppBar
```razor
<FodAppBar>
    <FodToolbar>
        <FodIconButton Icon="@FodIcons.Material.Filled.Menu" 
                       Edge="Edge.Start"
                       Color="FodColor.Inherit" />
        <FodText Typo="Typo.h6">
            Aplicația Mea
        </FodText>
        <FodSpacer />
        <FodIconButton Icon="@FodIcons.Material.Filled.MoreVert" 
                       Edge="Edge.End"
                       Color="FodColor.Inherit" />
    </FodToolbar>
</FodAppBar>
```

#### În Card header
```razor
<FodCard>
    <FodToolbar Class="pa-2">
        <FodAvatar Size="FodSize.Small">
            <FodImage Src="user-avatar.jpg" />
        </FodAvatar>
        <div class="ml-3">
            <FodText Typo="Typo.subtitle1">John Doe</FodText>
            <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                Acum 2 ore
            </FodText>
        </div>
        <FodSpacer />
        <FodIconButton Icon="@FodIcons.Material.Filled.MoreVert" Size="FodSize.Small" />
    </FodToolbar>
    <FodCardContent>
        <!-- Conținut card -->
    </FodCardContent>
</FodCard>
```

#### În Dialog actions
```razor
<FodDialog Open="@dialogOpen">
    <FodDialogTitle>Confirmare</FodDialogTitle>
    <FodDialogContent>
        Sunteți sigur că doriți să ștergeți acest element?
    </FodDialogContent>
    <FodDialogActions>
        <FodToolbar DisableGutters="true">
            <FodCheckbox @bind-Checked="dontAskAgain" 
                         Label="Nu întreba din nou" />
            <FodSpacer />
            <FodButton OnClick="@(() => dialogOpen = false)">
                Anulează
            </FodButton>
            <FodButton Color="FodColor.Error" Variant="FodVariant.Filled">
                Șterge
            </FodButton>
        </FodToolbar>
    </FodDialogActions>
</FodDialog>
```

### 7. Patterns comune

#### Toolbar cu state
```razor
<FodToolbar>
    <FodChipSet @bind-SelectedChip="selectedFilter" Mandatory="true">
        <FodChip Value="all">Toate</FodChip>
        <FodChip Value="active">Active</FodChip>
        <FodChip Value="completed">Finalizate</FodChip>
        <FodChip Value="archived">Arhivate</FodChip>
    </FodChipSet>
    <FodSpacer />
    <FodBadge Content="@GetItemCount()" Color="FodColor.Primary" Overlap="false">
        <FodText Typo="Typo.body2">elemente</FodText>
    </FodBadge>
</FodToolbar>

@code {
    private object selectedFilter = "all";
    
    private int GetItemCount()
    {
        return selectedFilter switch
        {
            "all" => 156,
            "active" => 89,
            "completed" => 45,
            "archived" => 22,
            _ => 0
        };
    }
}
```

#### Toolbar cu acțiuni în grup
```razor
<FodToolbar>
    <FodMenu>
        <ActivatorContent>
            <FodButton Variant="FodVariant.Outlined" 
                       EndIcon="@FodIcons.Material.Filled.ArrowDropDown">
                Acțiuni
            </FodButton>
        </ActivatorContent>
        <ChildContent>
            <FodMenuItem OnClick="DuplicateItems">
                <FodIcon Icon="@FodIcons.Material.Filled.ContentCopy" Class="mr-2" />
                Duplică
            </FodMenuItem>
            <FodMenuItem OnClick="MoveItems">
                <FodIcon Icon="@FodIcons.Material.Filled.DriveFileMove" Class="mr-2" />
                Mută
            </FodMenuItem>
            <FodMenuItem OnClick="ExportItems">
                <FodIcon Icon="@FodIcons.Material.Filled.FileDownload" Class="mr-2" />
                Exportă
            </FodMenuItem>
        </ChildContent>
    </FodMenu>
    <FodSpacer />
    <FodButtonGroup Variant="FodVariant.Outlined">
        <FodButton StartIcon="@FodIcons.Material.Filled.ViewList">Listă</FodButton>
        <FodButton StartIcon="@FodIcons.Material.Filled.ViewModule">Grilă</FodButton>
    </FodButtonGroup>
</FodToolbar>
```

### 8. Accesibilitate

- Folosiți `role="toolbar"` pentru grupuri de controale
- Grupați butoanele înrudite cu `FodButtonGroup`
- Asigurați ordine logică de tab pentru navigare cu tastatura
- Folosiți etichete descriptive pentru screen readers

```razor
<FodToolbar UserAttributes="@(new Dictionary<string, object> { ["role"] = "toolbar" })">
    <FodButtonGroup Variant="FodVariant.Text" 
                    UserAttributes="@(new Dictionary<string, object> { ["aria-label"] = "Formatare text" })">
        <FodIconButton Icon="@FodIcons.Material.Filled.FormatBold" 
                       aria-label="Bold" />
        <FodIconButton Icon="@FodIcons.Material.Filled.FormatItalic" 
                       aria-label="Italic" />
    </FodButtonGroup>
</FodToolbar>
```

### 9. Performanță

1. **Layout flexibil** - Folosește CSS Flexbox pentru performanță
2. **Minimal re-renders** - Structură simplă fără state intern
3. **CSS classes** - Generate o singură dată la inițializare

### 10. Bune practici

1. **Grupare logică** - Grupați controalele înrudite
2. **Spacing consistent** - Folosiți FodSpacer pentru aliniere
3. **Dense pentru toolbars secundare** - Economisiți spațiu vertical
4. **Responsive design** - Ascundeți/afișați elemente pe diferite ecrane
5. **Visual hierarchy** - Diferențiați acțiunile principale de cele secundare

### 11. Limitări și considerații

- Nu are înălțime fixă implicită - se adaptează la conținut
- Nu oferă scroll orizontal automat pentru overflow
- Necesită styling manual pentru fundaluri colorate

### 12. Exemple avansate

#### Toolbar multi-linie
```razor
<div>
    <FodToolbar>
        <FodText Typo="Typo.h5">Rapoarte</FodText>
        <FodSpacer />
        <FodButton Variant="FodVariant.Outlined">Setări</FodButton>
    </FodToolbar>
    <FodToolbar Dense="true" Class="mt-2">
        <FodChipSet Filter="true" Mandatory="false" Multiple="true">
            <FodChip>Vânzări</FodChip>
            <FodChip>Marketing</FodChip>
            <FodChip>Financiar</FodChip>
            <FodChip>HR</FodChip>
        </FodChipSet>
        <FodSpacer />
        <FodText Typo="Typo.caption" Color="FodColor.Secondary">
            Actualizat: @DateTime.Now.ToString("HH:mm")
        </FodText>
    </FodToolbar>
</div>
```

#### Toolbar adaptiv cu collapse
```razor
<FodToolbar>
    <FodHidden Breakpoint="Breakpoint.MdAndUp" Invert="true">
        <!-- Desktop: toate opțiunile vizibile -->
        <FodButton Variant="FodVariant.Text">Opțiune 1</FodButton>
        <FodButton Variant="FodVariant.Text">Opțiune 2</FodButton>
        <FodButton Variant="FodVariant.Text">Opțiune 3</FodButton>
        <FodButton Variant="FodVariant.Text">Opțiune 4</FodButton>
    </FodHidden>
    <FodHidden Breakpoint="Breakpoint.MdAndUp">
        <!-- Mobile: meniu dropdown -->
        <FodMenu>
            <ActivatorContent>
                <FodIconButton Icon="@FodIcons.Material.Filled.MoreVert" />
            </ActivatorContent>
            <ChildContent>
                <FodMenuItem>Opțiune 1</FodMenuItem>
                <FodMenuItem>Opțiune 2</FodMenuItem>
                <FodMenuItem>Opțiune 3</FodMenuItem>
                <FodMenuItem>Opțiune 4</FodMenuItem>
            </ChildContent>
        </FodMenu>
    </FodHidden>
</FodToolbar>
```

### 13. Troubleshooting

#### Elementele nu se aliniază corect
- Verificați că folosiți `FodSpacer` pentru spacing
- Verificați că elementele au `display: flex` implicit

#### Toolbar-ul are prea mult spațiu
- Folosiți `Dense="true"` pentru padding redus
- Folosiți `DisableGutters="true"` pentru a elimina padding lateral

#### Overflow pe ecrane mici
- Implementați un design responsive cu `FodHidden`
- Folosiți meniuri dropdown pentru gruparea opțiunilor

### 14. Concluzie
`FodToolbar` este o componentă esențială pentru organizarea controalelor și acțiunilor în interfețe Blazor. Cu opțiuni flexibile pentru spacing și dimensiune, se integrează perfect în diverse contexte - de la bare de aplicație până la secțiuni de filtrare și controale pentru tabele. Simplitatea sa permite personalizare extensivă păstrând în același timp performanța optimă.