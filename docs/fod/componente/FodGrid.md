# Grid

## Documentație pentru componentele FodGrid și FodItem

### 1. Descriere Generală
`FodGrid` și `FodItem` formează un sistem de layout responsive bazat pe CSS Grid și Flexbox. Acest sistem permite crearea de layout-uri complexe care se adaptează automat la diferite dimensiuni de ecran.

Sistemul suportă:
- Grid cu 12 coloane
- Breakpoint-uri responsive (xs, sm, md, lg, xl)
- Spacing flexibil între elemente
- Aliniament orizontal și vertical
- Ordine personalizabilă a elementelor
- Suport pentru offset și dimensiuni fixe

### 2. Ghid de Utilizare API

#### Grid de bază
```razor
<FodGrid>
    <FodItem xs="12" sm="6" md="4">
        <FodPaper Class="pa-3">Coloană 1</FodPaper>
    </FodItem>
    <FodItem xs="12" sm="6" md="4">
        <FodPaper Class="pa-3">Coloană 2</FodPaper>
    </FodItem>
    <FodItem xs="12" sm="6" md="4">
        <FodPaper Class="pa-3">Coloană 3</FodPaper>
    </FodItem>
</FodGrid>
```

#### Grid cu spacing personalizat
```razor
<!-- Spacing uniform -->
<FodGrid Spacing="3">
    <FodItem xs="6">
        <FodPaper Class="pa-3">Element 1</FodPaper>
    </FodItem>
    <FodItem xs="6">
        <FodPaper Class="pa-3">Element 2</FodPaper>
    </FodItem>
</FodGrid>

<!-- Spacing diferit pe axe -->
<FodGrid SpacingX="4" SpacingY="2">
    <FodItem xs="6">
        <FodPaper Class="pa-3">Element 1</FodPaper>
    </FodItem>
    <FodItem xs="6">
        <FodPaper Class="pa-3">Element 2</FodPaper>
    </FodItem>
</FodGrid>
```

#### Layout responsive complet
```razor
<FodGrid>
    <!-- Full width pe mobile, jumătate pe tabletă, un sfert pe desktop -->
    <FodItem xs="12" sm="6" md="3" lg="3" xl="3">
        <FodCard>
            <FodCardContent>
                <FodText>Card 1</FodText>
            </FodCardContent>
        </FodCard>
    </FodItem>
    
    <!-- Dimensiuni diferite per breakpoint -->
    <FodItem xs="12" sm="6" md="3" lg="3" xl="3">
        <FodCard>
            <FodCardContent>
                <FodText>Card 2</FodText>
            </FodCardContent>
        </FodCard>
    </FodItem>
    
    <!-- Element care ocupă mai mult spațiu pe desktop -->
    <FodItem xs="12" sm="12" md="6" lg="6" xl="6">
        <FodCard>
            <FodCardContent>
                <FodText>Card mare</FodText>
            </FodCardContent>
        </FodCard>
    </FodItem>
</FodGrid>
```

#### Grid cu aliniament
```razor
<!-- Aliniament orizontal -->
<FodGrid Justify="FodJustify.Center">
    <FodItem xs="3">
        <FodPaper Class="pa-3">Centrat</FodPaper>
    </FodItem>
</FodGrid>

<!-- Aliniament vertical -->
<FodGrid AlignItems="FodAlignItems.Center" Style="height: 200px;">
    <FodItem xs="4">
        <FodPaper Class="pa-3">Aliniat vertical</FodPaper>
    </FodItem>
</FodGrid>

<!-- Distribuție spațiu -->
<FodGrid Justify="FodJustify.SpaceBetween">
    <FodItem xs="3">
        <FodPaper Class="pa-3">Stânga</FodPaper>
    </FodItem>
    <FodItem xs="3">
        <FodPaper Class="pa-3">Dreapta</FodPaper>
    </FodItem>
</FodGrid>
```

#### Grid cu offset
```razor
<FodGrid>
    <!-- Element cu offset -->
    <FodItem xs="6" xsOffset="3">
        <FodPaper Class="pa-3">Centrat cu offset</FodPaper>
    </FodItem>
    
    <!-- Offset responsive -->
    <FodItem xs="12" sm="6" smOffset="3" md="4" mdOffset="4">
        <FodPaper Class="pa-3">Offset responsive</FodPaper>
    </FodItem>
</FodGrid>
```

#### Formular cu Grid
```razor
<EditForm Model="model">
    <FodGrid Spacing="3">
        <FodItem xs="12" sm="6">
            <FODInputText Label="Nume" @bind-Value="model.FirstName" />
        </FodItem>
        <FodItem xs="12" sm="6">
            <FODInputText Label="Prenume" @bind-Value="model.LastName" />
        </FodItem>
        <FodItem xs="12">
            <FODInputText Label="Email" @bind-Value="model.Email" />
        </FodItem>
        <FodItem xs="12" sm="6">
            <FODInputText Label="Telefon" @bind-Value="model.Phone" />
        </FodItem>
        <FodItem xs="12" sm="6">
            <FODInputSelect Label="Țară" @bind-Value="model.Country">
                <option value="">Selectați...</option>
                <option value="MD">Moldova</option>
                <option value="RO">România</option>
            </FODInputSelect>
        </FodItem>
    </FodGrid>
</EditForm>
```

#### Grid imbricat
```razor
<FodGrid Spacing="2">
    <FodItem xs="12" md="8">
        <FodPaper Class="pa-3">
            <FodText Typo="Typo.h6">Conținut principal</FodText>
            <!-- Grid imbricat -->
            <FodGrid Spacing="2" Class="mt-3">
                <FodItem xs="6">
                    <FodPaper Class="pa-2">Sub-element 1</FodPaper>
                </FodItem>
                <FodItem xs="6">
                    <FodPaper Class="pa-2">Sub-element 2</FodPaper>
                </FodItem>
            </FodGrid>
        </FodPaper>
    </FodItem>
    <FodItem xs="12" md="4">
        <FodPaper Class="pa-3">
            <FodText Typo="Typo.h6">Sidebar</FodText>
        </FodPaper>
    </FodItem>
</FodGrid>
```

#### Grid pentru dashboard
```razor
<FodGrid Spacing="3">
    <!-- Statistici -->
    <FodItem xs="12" sm="6" md="3">
        <FodCard>
            <FodCardContent>
                <FodText Typo="Typo.h4" Color="FodColor.Primary">1,234</FodText>
                <FodText>Total utilizatori</FodText>
            </FodCardContent>
        </FodCard>
    </FodItem>
    <FodItem xs="12" sm="6" md="3">
        <FodCard>
            <FodCardContent>
                <FodText Typo="Typo.h4" Color="FodColor.Success">567</FodText>
                <FodText>Activi azi</FodText>
            </FodCardContent>
        </FodCard>
    </FodItem>
    <FodItem xs="12" sm="6" md="3">
        <FodCard>
            <FodCardContent>
                <FodText Typo="Typo.h4" Color="FodColor.Warning">89</FodText>
                <FodText>În așteptare</FodText>
            </FodCardContent>
        </FodCard>
    </FodItem>
    <FodItem xs="12" sm="6" md="3">
        <FodCard>
            <FodCardContent>
                <FodText Typo="Typo.h4" Color="FodColor.Error">12</FodText>
                <FodText>Erori</FodText>
            </FodCardContent>
        </FodCard>
    </FodItem>
    
    <!-- Grafic principal -->
    <FodItem xs="12" md="8">
        <FodCard>
            <FodCardContent>
                <FodText Typo="Typo.h6">Grafic activitate</FodText>
                <!-- Conținut grafic -->
            </FodCardContent>
        </FodCard>
    </FodItem>
    
    <!-- Lista laterală -->
    <FodItem xs="12" md="4">
        <FodCard>
            <FodCardContent>
                <FodText Typo="Typo.h6">Activitate recentă</FodText>
                <!-- Listă activități -->
            </FodCardContent>
        </FodCard>
    </FodItem>
</FodGrid>
```

### Atribute disponibile - FodGrid

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Spacing` | `int` | Spațiu uniform între elemente (0-10) | `0` |
| `SpacingX` | `int` | Spațiu orizontal între elemente | `Spacing` |
| `SpacingY` | `int` | Spațiu vertical între elemente | `Spacing` |
| `Justify` | `FodJustify` | Aliniament orizontal | `FodJustify.FlexStart` |
| `AlignItems` | `FodAlignItems` | Aliniament vertical | `FodAlignItems.Stretch` |
| `AlignContent` | `FodAlignContent` | Aliniament conținut multiplu | `FodAlignContent.Stretch` |
| `ChildContent` | `RenderFragment` | Elementele FodItem | - |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri CSS inline | `null` |

### Atribute disponibile - FodItem

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `xs` | `int?` | Coloane pe extra small (0-12 sau auto) | `null` |
| `sm` | `int?` | Coloane pe small | `null` |
| `md` | `int?` | Coloane pe medium | `null` |
| `lg` | `int?` | Coloane pe large | `null` |
| `xl` | `int?` | Coloane pe extra large | `null` |
| `xsOffset` | `int?` | Offset pe extra small | `null` |
| `smOffset` | `int?` | Offset pe small | `null` |
| `mdOffset` | `int?` | Offset pe medium | `null` |
| `lgOffset` | `int?` | Offset pe large | `null` |
| `xlOffset` | `int?` | Offset pe extra large | `null` |
| `Order` | `int?` | Ordine flex | `null` |
| `ChildContent` | `RenderFragment` | Conținutul elementului | - |

### 3. Breakpoint-uri

| Breakpoint | Prefix | Dimensiune minimă |
|------------|--------|-------------------|
| Extra small | xs | 0px |
| Small | sm | 600px |
| Medium | md | 960px |
| Large | lg | 1280px |
| Extra large | xl | 1920px |

### 4. Valori pentru aliniament

#### FodJustify
- `FlexStart` - Aliniere la început
- `Center` - Centrare
- `FlexEnd` - Aliniere la sfârșit
- `SpaceBetween` - Spațiu între elemente
- `SpaceAround` - Spațiu în jurul elementelor
- `SpaceEvenly` - Spațiu egal

#### FodAlignItems
- `FlexStart` - Aliniere sus
- `Center` - Centrare verticală
- `FlexEnd` - Aliniere jos
- `Stretch` - Întindere pe înălțime
- `Baseline` - Aliniere la baseline

### 5. Pattern-uri comune

#### Layout 2 coloane
```razor
<FodGrid Spacing="3">
    <FodItem xs="12" md="8">
        <!-- Conținut principal -->
    </FodItem>
    <FodItem xs="12" md="4">
        <!-- Sidebar -->
    </FodItem>
</FodGrid>
```

#### Layout 3 coloane egale
```razor
<FodGrid Spacing="2">
    <FodItem xs="12" sm="4">
        <!-- Coloană 1 -->
    </FodItem>
    <FodItem xs="12" sm="4">
        <!-- Coloană 2 -->
    </FodItem>
    <FodItem xs="12" sm="4">
        <!-- Coloană 3 -->
    </FodItem>
</FodGrid>
```

#### Layout asimetric
```razor
<FodGrid Spacing="3">
    <FodItem xs="12" md="3">
        <!-- Sidebar stânga -->
    </FodItem>
    <FodItem xs="12" md="6">
        <!-- Conținut principal -->
    </FodItem>
    <FodItem xs="12" md="3">
        <!-- Sidebar dreapta -->
    </FodItem>
</FodGrid>
```

### 6. Note și observații

- Sistemul folosește 12 coloane ca bază
- Valorile pentru dimensiuni trebuie să fie între 1-12
- `auto` poate fi folosit pentru dimensiuni care se ajustează la conținut
- Spacing-ul se aplică ca padding la FodItem și margin negativ la FodGrid
- Offset-urile mută elementul spre dreapta cu numărul specificat de coloane

### 7. Bune practici

1. **Mobile-first** - Începeți cu layout pentru mobile (xs) și adăugați pentru ecrane mai mari
2. **Testați responsive** - Verificați layout-ul pe toate dimensiunile de ecran
3. **Evitați imbricarea excesivă** - Limitați grid-urile imbricate la 2-3 nivele
4. **Spacing consistent** - Folosiți valori de spacing consistente în aplicație
5. **Semantică** - Folosiți Grid pentru layout, nu pentru spacing simplu
6. **Performance** - Pentru liste mari, considerați virtualizare

### 8. Troubleshooting

#### Elementele nu se aliniază corect
```razor
<!-- Verificați că suma coloanelor = 12 -->
<FodGrid>
    <FodItem xs="6">...</FodItem>
    <FodItem xs="6">...</FodItem> <!-- Total: 12 ✓ -->
</FodGrid>
```

#### Spacing inconsistent
```razor
<!-- Folosiți spacing uniform sau specificați X și Y separat -->
<FodGrid SpacingX="3" SpacingY="2">
    <!-- Conținut -->
</FodGrid>
```

### 9. Concluzie
`FodGrid` și `FodItem` oferă un sistem puternic și flexibil pentru crearea de layout-uri responsive în aplicațiile Blazor, cu control granular asupra poziționării și spacing-ului elementelor pe diferite dimensiuni de ecran.