# FodTooltip

## Documentație pentru componenta FodTooltip

### 1. Descriere Generală
`FodTooltip` este o componentă avansată pentru afișarea de informații contextuale când utilizatorii interacționează cu un element. Spre deosebire de componenta simplă `Tooltip`, FodTooltip oferă control complet asupra poziționării, stilizării și comportamentului, folosind sistemul FodPopover pentru randare.

Caracteristici principale:
- Afișare pe hover, focus sau click
- Poziționare flexibilă cu 6 opțiuni
- Suport pentru săgeată indicator
- Animații cu durată și întârziere configurabile
- Conținut text sau RenderFragment complex
- Integrare cu sistemul de culori FOD
- Suport RTL (Right-to-Left)
- Control programatic al vizibilității

### 2. Ghid de Utilizare API

#### Tooltip simplu cu text
```razor
<FodTooltip Text="Informație utilă despre acest element">
    <FodButton Variant="FodVariant.Filled">
        Hover pentru info
    </FodButton>
</FodTooltip>
```

#### Tooltip cu poziționare personalizată
```razor
<FodTooltip Text="Apare deasupra" Placement="Placement.Top">
    <FodIconButton Icon="@FodIcons.Material.Filled.Info" />
</FodTooltip>

<FodTooltip Text="Apare în dreapta" Placement="Placement.Right">
    <FodIconButton Icon="@FodIcons.Material.Filled.Help" />
</FodTooltip>

<FodTooltip Text="Apare în stânga" Placement="Placement.Left">
    <FodIconButton Icon="@FodIcons.Material.Filled.QuestionMark" />
</FodTooltip>
```

#### Tooltip cu săgeată și culoare
```razor
<FodTooltip Text="Tooltip cu săgeată colorată" 
            Arrow="true" 
            Color="FodColor.Primary">
    <FodChip Color="FodColor.Primary">
        Hover pentru detalii
    </FodChip>
</FodTooltip>

<FodTooltip Text="Avertizare importantă!" 
            Arrow="true" 
            Color="FodColor.Warning">
    <FodIcon Icon="@FodIcons.Material.Filled.Warning" 
             Color="FodColor.Warning" />
</FodTooltip>
```

#### Tooltip cu conținut complex
```razor
<FodTooltip>
    <ChildContent>
        <FodButton Variant="FodVariant.Outlined">
            Informații detaliate
        </FodButton>
    </ChildContent>
    <TooltipContent>
        <div style="max-width: 300px;">
            <FodText Typo="Typo.subtitle2" GutterBottom="true">
                Titlu tooltip
            </FodText>
            <FodText Typo="Typo.body2">
                Acesta este un tooltip cu conținut formatat care poate include:
            </FodText>
            <ul style="margin: 8px 0; padding-left: 20px;">
                <li>Liste cu puncte</li>
                <li>Text formatat</li>
                <li>Iconițe și imagini</li>
            </ul>
            <FodLink Href="/help" Color="FodColor.Primary" Underline="Underline.Always">
                Află mai multe
            </FodLink>
        </div>
    </TooltipContent>
</FodTooltip>
```

#### Tooltip cu întârziere
```razor
<FodTooltip Text="Apare după 1 secundă" 
            Delay="1000">
    <FodTextField Label="Câmp cu ajutor întârziat" />
</FodTooltip>

<FodTooltip Text="Apare instant dar dispare încet" 
            Delay="0"
            Duration="500">
    <FodButton>Hover rapid</FodButton>
</FodTooltip>
```

#### Tooltip declanșat pe click
```razor
<FodTooltip Text="Click pentru a afișa/ascunde" 
            ShowOnClick="true"
            ShowOnHover="false"
            ShowOnFocus="false">
    <FodIconButton Icon="@FodIcons.Material.Filled.MoreVert" />
</FodTooltip>
```

#### Tooltip controlat programatic
```razor
<FodTooltip @bind-IsVisible="tooltipVisible" 
            Text="Tooltip controlat din cod"
            ShowOnHover="false">
    <FodButton OnClick="ToggleTooltip">
        Toggle Tooltip
    </FodButton>
</FodTooltip>

<FodButton OnClick="@(() => tooltipVisible = true)" Class="ml-2">
    Arată Tooltip
</FodButton>

<FodButton OnClick="@(() => tooltipVisible = false)" Class="ml-2">
    Ascunde Tooltip
</FodButton>

@code {
    private bool tooltipVisible = false;
    
    private void ToggleTooltip()
    {
        tooltipVisible = !tooltipVisible;
    }
}
```

#### Tooltip pentru elemente disabled
```razor
<!-- Wrapper pentru elemente disabled -->
<FodTooltip Text="Acest buton este dezactivat temporar">
    <span>
        <FodButton Disabled="true" Style="pointer-events: none;">
            Buton dezactivat
        </FodButton>
    </span>
</FodTooltip>
```

#### Tooltip inline vs block
```razor
<FodText>
    Acest text conține un 
    <FodTooltip Text="Definiție: termen tehnic important" 
                Inline="true"
                Color="FodColor.Info">
        <span style="text-decoration: underline; cursor: help;">
            termen special
        </span>
    </FodTooltip>
    care necesită explicație.
</FodText>

<!-- Block tooltip pentru containere -->
<FodTooltip Text="Întreaga secțiune are informații adiționale" 
            Inline="false">
    <FodCard>
        <FodCardContent>
            Conținut card cu tooltip
        </FodCardContent>
    </FodCard>
</FodTooltip>
```

#### Tooltip-uri în formulare
```razor
<FodForm>
    <FodGrid Container="true" Spacing="2">
        <FodGrid Item="true" xs="12" sm="6">
            <FodTooltip Text="Numele complet așa cum apare în actul de identitate">
                <FodTextField Label="Nume complet *" 
                             Required="true"
                             FullWidth="true" />
            </FodTooltip>
        </FodGrid>
        
        <FodGrid Item="true" xs="12" sm="6">
            <FodTooltip>
                <ChildContent>
                    <FodTextField Label="CNP/IDNP *" 
                                 Required="true"
                                 FullWidth="true" />
                </ChildContent>
                <TooltipContent>
                    <div>
                        <FodText Typo="Typo.body2" GutterBottom="true">
                            Cod Numeric Personal format din 13 cifre
                        </FodText>
                        <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                            Exemplu: 1234567890123
                        </FodText>
                    </div>
                </TooltipContent>
            </FodTooltip>
        </FodGrid>
    </FodGrid>
</FodForm>
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Text` | `string` | Textul tooltip-ului | `string.Empty` |
| `TooltipContent` | `RenderFragment` | Conținut complex pentru tooltip | `null` |
| `ChildContent` | `RenderFragment` | Elementul care declanșează tooltip-ul | - |
| `Color` | `FodColor` | Culoarea tooltip-ului | `Default` |
| `Placement` | `Placement` | Poziția tooltip-ului | `Bottom` |
| `Arrow` | `bool` | Afișează săgeată indicator | `false` |
| `Duration` | `double` | Durata animației (ms) | `251` |
| `Delay` | `double` | Întârziere înainte de afișare (ms) | `0` |
| `ShowOnHover` | `bool` | Afișare la hover | `true` |
| `ShowOnFocus` | `bool` | Afișare la focus | `true` |
| `ShowOnClick` | `bool` | Afișare la click | `false` |
| `IsVisible` | `bool` | Control programatic vizibilitate | `false` |
| `IsVisibleChanged` | `EventCallback<bool>` | Eveniment schimbare vizibilitate | - |
| `Inline` | `bool` | Comportament inline | `true` |
| `RootClass` | `string` | Clase CSS pentru container | `null` |
| `RootStyle` | `string` | Stiluri pentru container | `null` |
| `Class` | `string` | Clase CSS pentru tooltip | `null` |
| `Style` | `string` | Stiluri inline pentru tooltip | `null` |

### 4. Enumerări

#### Placement
| Valoare | Descriere |
|---------|-----------|
| `Top` | Deasupra elementului |
| `Bottom` | Sub element |
| `Left` | În stânga elementului |
| `Right` | În dreapta elementului |
| `Start` | La început (stânga în LTR, dreapta în RTL) |
| `End` | La sfârșit (dreapta în LTR, stânga în RTL) |

### 5. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `IsVisibleChanged` | `EventCallback<bool>` | Se declanșează când se schimbă vizibilitatea |

### 6. Stilizare și personalizare

```css
/* Tooltip cu fundal gradient */
.custom-tooltip .fod-tooltip {
    background: linear-gradient(45deg, #3f51b5, #2196f3);
    color: white;
}

/* Tooltip cu umbră pronunțată */
.shadow-tooltip .fod-tooltip {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Săgeată personalizată */
.custom-arrow.fod-tooltip-arrow::after {
    border-width: 8px;
}

/* Tooltip cu border */
.bordered-tooltip .fod-tooltip {
    border: 2px solid var(--fod-palette-primary-main);
    background: white;
    color: var(--fod-palette-primary-main);
}

/* Animație personalizată */
.animated-tooltip {
    animation: tooltipPulse 2s infinite;
}

@keyframes tooltipPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

/* Tooltip responsiv */
@media (max-width: 600px) {
    .fod-tooltip {
        max-width: 90vw !important;
        font-size: 0.875rem;
    }
}
```

### 7. Integrare cu alte componente

#### În tabele
```razor
<FodTable>
    <HeaderContent>
        <FodTh>
            <FodTooltip Text="Sortează după nume">
                Nume
                <FodIcon Icon="@FodIcons.Material.Filled.ArrowUpward" 
                         Size="FodSize.Small" />
            </FodTooltip>
        </FodTh>
        <FodTh>
            <FodTooltip Text="Data ultimei actualizări">
                Modificat
                <FodIcon Icon="@FodIcons.Material.Filled.Info" 
                         Size="FodSize.Small" />
            </FodTooltip>
        </FodTh>
    </HeaderContent>
</FodTable>
```

#### În liste
```razor
<FodList>
    <FodListItem>
        <FodListItemIcon>
            <FodTooltip Text="Verificat și aprobat">
                <FodIcon Icon="@FodIcons.Material.Filled.CheckCircle" 
                         Color="FodColor.Success" />
            </FodTooltip>
        </FodListItemIcon>
        <FodListItemText Primary="Document aprobat" />
    </FodListItem>
    <FodListItem>
        <FodListItemIcon>
            <FodTooltip Text="În așteptarea verificării">
                <FodIcon Icon="@FodIcons.Material.Filled.Schedule" 
                         Color="FodColor.Warning" />
            </FodTooltip>
        </FodListItemIcon>
        <FodListItemText Primary="Document în procesare" />
    </FodListItem>
</FodList>
```

#### În toolbar
```razor
<FodToolbar>
    <FodTooltip Text="Salvează modificările">
        <FodIconButton Icon="@FodIcons.Material.Filled.Save" />
    </FodTooltip>
    <FodTooltip Text="Anulează modificările">
        <FodIconButton Icon="@FodIcons.Material.Filled.Undo" />
    </FodTooltip>
    <FodTooltip Text="Refă modificările">
        <FodIconButton Icon="@FodIcons.Material.Filled.Redo" />
    </FodTooltip>
    <FodSpacer />
    <FodTooltip Text="Șterge permanent">
        <FodIconButton Icon="@FodIcons.Material.Filled.Delete" 
                       Color="FodColor.Error" />
    </FodTooltip>
</FodToolbar>
```

### 8. Patterns comune

#### Help system integrat
```razor
@code {
    private bool showDetailedHelp = false;
}

<FodTooltip ShowOnClick="true" 
            ShowOnHover="false"
            @bind-IsVisible="showDetailedHelp">
    <ChildContent>
        <FodIconButton Icon="@FodIcons.Material.Filled.HelpOutline" 
                       Size="FodSize.Small" />
    </ChildContent>
    <TooltipContent>
        <div style="max-width: 400px; padding: 8px;">
            <FodText Typo="Typo.h6" GutterBottom="true">
                Ajutor - Completare formular
            </FodText>
            <FodText Typo="Typo.body2" GutterBottom="true">
                Pentru a completa corect acest formular:
            </FodText>
            <FodList Dense="true">
                <FodListItem>
                    <FodListItemText Primary="Completați toate câmpurile obligatorii (*)" />
                </FodListItem>
                <FodListItem>
                    <FodListItemText Primary="Verificați formatul datelor introduse" />
                </FodListItem>
                <FodListItem>
                    <FodListItemText Primary="Salvați periodic pentru a nu pierde datele" />
                </FodListItem>
            </FodList>
            <FodButton Color="FodColor.Primary" 
                       Size="FodSize.Small"
                       OnClick="@(() => showDetailedHelp = false)"
                       Class="mt-2">
                Am înțeles
            </FodButton>
        </div>
    </TooltipContent>
</FodTooltip>
```

#### Tooltip cu conținut dinamic
```razor
<FodTooltip>
    <ChildContent>
        <FodChip Color="@GetStatusColor(item.Status)">
            @item.Status
        </FodChip>
    </ChildContent>
    <TooltipContent>
        <div>
            <FodText Typo="Typo.subtitle2">
                Status: @item.Status
            </FodText>
            <FodText Typo="Typo.body2">
                Ultima actualizare: @item.LastUpdate.ToString("dd.MM.yyyy HH:mm")
            </FodText>
            <FodText Typo="Typo.body2">
                Responsabil: @item.AssignedTo
            </FodText>
            @if (!string.IsNullOrEmpty(item.Notes))
            {
                <FodText Typo="Typo.caption" Color="FodColor.Secondary" Class="mt-1">
                    Note: @item.Notes
                </FodText>
            }
        </div>
    </TooltipContent>
</FodTooltip>
```

### 9. Accesibilitate

- Tooltip-urile sunt citite de screen readers
- Suportă navigare cu tastatura (focus triggers)
- Folosiți `aria-label` sau `aria-describedby` pentru context suplimentar
- Evitați informații critice doar în tooltip

```razor
<FodTooltip Text="Format: +373 XX XXX XXX">
    <FodTextField Label="Telefon" 
                  aria-describedby="phone-format-hint" />
</FodTooltip>
<span id="phone-format-hint" class="sr-only">
    Format telefon: +373 urmat de 8 cifre
</span>
```

### 10. Performanță

1. **Lazy rendering** - Tooltip-ul este randat doar când devine vizibil
2. **Shared Popover** - Folosește sistemul FodPopover pentru eficiență
3. **Event delegation** - Evenimente gestionate eficient
4. **Debouncing** - Delay previne afișări/ascunderi rapide

### 11. Bune practici

1. **Text concis** - Păstrați mesajele scurte și clare
2. **Plasare consistentă** - Folosiți aceeași plasare în aplicație
3. **Culori semantice** - Folosiți culori pentru a transmite semnificație
4. **Evitați hover-only** - Oferiți alternative pentru touch devices
5. **Testare responsive** - Verificați pe diferite dimensiuni de ecran

### 12. Limitări și considerații

- Nu funcționează pe elemente cu `pointer-events: none`
- Necesită wrapper pentru elemente disabled
- Poziționarea poate fi afectată de overflow containers
- Pe mobil, hover devine tap

### 13. Troubleshooting

#### Tooltip-ul nu apare
- Verificați că elementul copil poate primi evenimente
- Verificați ShowOnHover/Focus/Click settings
- Verificați că FodPopoverProvider este prezent

#### Poziționare incorectă
- Verificați overflow pe container-ele părinte
- Considerați folosirea placement diferit
- Verificați z-index conflicts

#### Tooltip rămâne deschis
- Verificați event handlers
- Folosiți IsVisible pentru control manual
- Verificați console pentru erori JavaScript

### 14. Exemple avansate

#### Tooltip cu validare în timp real
```razor
<FodTooltip @bind-IsVisible="showValidationTooltip"
            Color="@(isValid ? FodColor.Success : FodColor.Error)"
            Arrow="true">
    <ChildContent>
        <FodTextField @bind-Value="email" 
                     @oninput="ValidateEmail"
                     Label="Email" />
    </ChildContent>
    <TooltipContent>
        @if (isValid)
        {
            <FodIcon Icon="@FodIcons.Material.Filled.Check" /> Email valid
        }
        else
        {
            <FodIcon Icon="@FodIcons.Material.Filled.Error" /> @validationMessage
        }
    </TooltipContent>
</FodTooltip>

@code {
    private string email = "";
    private bool isValid = false;
    private bool showValidationTooltip = false;
    private string validationMessage = "";
    
    private void ValidateEmail(ChangeEventArgs e)
    {
        email = e.Value?.ToString() ?? "";
        if (string.IsNullOrEmpty(email))
        {
            showValidationTooltip = false;
            return;
        }
        
        isValid = Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        validationMessage = isValid ? "" : "Format email invalid";
        showValidationTooltip = true;
    }
}
```

#### Tour interactiv cu tooltip-uri
```razor
@if (showTour)
{
    <FodTooltip IsVisible="@(tourStep == 1)"
                Placement="Placement.Bottom"
                Color="FodColor.Primary"
                Arrow="true">
        <ChildContent>
            <FodButton Id="tour-step-1">Buton principal</FodButton>
        </ChildContent>
        <TooltipContent>
            <div style="width: 250px;">
                <FodText Typo="Typo.subtitle2" Color="FodColor.White">
                    Pasul 1 din 3
                </FodText>
                <FodText Typo="Typo.body2" Color="FodColor.White">
                    Acesta este butonul principal pentru acțiuni.
                </FodText>
                <FodButton Size="FodSize.Small" 
                          Color="FodColor.White"
                          OnClick="NextTourStep"
                          Class="mt-2">
                    Următorul
                </FodButton>
            </div>
        </TooltipContent>
    </FodTooltip>
}

@code {
    private bool showTour = true;
    private int tourStep = 1;
    
    private void NextTourStep()
    {
        tourStep++;
        if (tourStep > 3)
        {
            showTour = false;
            tourStep = 1;
        }
    }
}
```

### 15. Concluzie
`FodTooltip` este o componentă esențială pentru îmbunătățirea experienței utilizatorului prin oferirea de informații contextuale. Cu suport pentru conținut complex, poziționare flexibilă și multiple moduri de declanșare, componenta acoperă toate scenariile comune de utilizare. Integrarea cu FodPopover asigură performanță optimă și consistență vizuală în aplicație.