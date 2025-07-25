# Paper

## Documentație pentru componenta FodPaper

### 1. Descriere Generală
`FodPaper` este o componentă container fundamentală care oferă o suprafață elevată pentru conținut, urmând principiile Material Design. Servește ca bază pentru organizarea vizuală a conținutului prin crearea de secțiuni distincte cu umbre și borduri.

Caracteristici principale:
- Sistem de elevație cu 26 nivele (0-25)
- Suport pentru stilizare cu umbră sau bordură
- Control complet asupra dimensiunilor
- Colțuri rotunjite sau pătrate
- Integrare perfectă cu tema aplicației
- Componentă wrapper flexibilă
- Performanță optimizată

### 2. Ghid de Utilizare API

#### Paper de bază
```razor
<FodPaper Class="pa-4">
    <FodText>Conținut într-un container Paper simplu</FodText>
</FodPaper>
```

#### Paper cu diferite nivele de elevație
```razor
<!-- Fără elevație (plat) -->
<FodPaper Elevation="0" Class="pa-4 ma-2">
    <FodText>Suprafață plată - Elevație 0</FodText>
</FodPaper>

<!-- Elevație mică -->
<FodPaper Elevation="1" Class="pa-4 ma-2">
    <FodText>Elevație minimă - Nivel 1 (implicit)</FodText>
</FodPaper>

<!-- Elevație medie -->
<FodPaper Elevation="8" Class="pa-4 ma-2">
    <FodText>Elevație medie - Nivel 8</FodText>
</FodPaper>

<!-- Elevație mare -->
<FodPaper Elevation="16" Class="pa-4 ma-2">
    <FodText>Elevație înaltă - Nivel 16</FodText>
</FodPaper>

<!-- Elevație maximă -->
<FodPaper Elevation="25" Class="pa-4 ma-2">
    <FodText>Elevație maximă - Nivel 25</FodText>
</FodPaper>
```

#### Paper cu bordură (outlined)
```razor
<FodPaper Outlined="true" Class="pa-4">
    <FodText>Paper cu bordură în loc de umbră</FodText>
</FodPaper>

<!-- Combinație outlined și square -->
<FodPaper Outlined="true" Square="true" Class="pa-4">
    <FodText>Paper cu bordură și colțuri drepte</FodText>
</FodPaper>
```

#### Paper cu dimensiuni specifice
```razor
<!-- Dimensiuni fixe -->
<FodPaper Width="300px" Height="200px" Class="pa-4">
    <FodText>Paper cu dimensiuni fixe</FodText>
</FodPaper>

<!-- Dimensiuni responsive -->
<FodPaper Width="100%" MaxWidth="600px" MinHeight="150px" Class="pa-4">
    <FodText>Paper responsive cu limite</FodText>
</FodPaper>

<!-- Înălțime variabilă -->
<FodPaper MinHeight="200px" MaxHeight="400px" Class="pa-4" Style="overflow-y: auto;">
    <FodText>Paper cu scroll vertical când conținutul depășește limita</FodText>
    <!-- Conținut lung aici -->
</FodPaper>
```

#### Paper pentru formulare
```razor
<FodPaper Elevation="2" Class="pa-6 ma-4">
    <FodText Typo="Typo.h5" Class="mb-4">Formular înregistrare</FodText>
    
    <EditForm Model="model" OnValidSubmit="HandleSubmit">
        <FodTextField @bind-Value="model.Name" 
                      Label="Nume complet" 
                      Required="true" 
                      Class="mb-3" />
        
        <FodTextField @bind-Value="model.Email" 
                      Label="Email" 
                      Type="email" 
                      Required="true" 
                      Class="mb-3" />
        
        <FodButton Type="submit" 
                   Variant="FodVariant.Filled" 
                   Color="FodColor.Primary">
            Înregistrează-te
        </FodButton>
    </EditForm>
</FodPaper>
```

#### Paper pentru carduri de produs
```razor
<FodGrid Container="true" Spacing="3">
    @foreach (var product in products)
    {
        <FodGrid Item="true" xs="12" sm="6" md="4">
            <FodPaper Elevation="4" Class="pa-0" Style="height: 100%;">
                <img src="@product.ImageUrl" alt="@product.Name" 
                     style="width: 100%; height: 200px; object-fit: cover;" />
                
                <div class="pa-4">
                    <FodText Typo="Typo.h6">@product.Name</FodText>
                    <FodText Typo="Typo.body2" Class="text-muted">
                        @product.Description
                    </FodText>
                    <FodText Typo="Typo.h5" Class="mt-2">
                        @product.Price.ToString("C")
                    </FodText>
                </div>
            </FodPaper>
        </FodGrid>
    }
</FodGrid>
```

#### Paper pentru secțiuni dashboard
```razor
<FodGrid Container="true" Spacing="3">
    <!-- Statistici -->
    <FodGrid Item="true" xs="12" md="3">
        <FodPaper Elevation="2" Class="pa-4 text-center">
            <FodIcon Icon="@FodIcons.Material.Filled.People" 
                     Size="Size.Large" 
                     Color="FodColor.Primary" />
            <FodText Typo="Typo.h4">1,234</FodText>
            <FodText Typo="Typo.subtitle2">Utilizatori activi</FodText>
        </FodPaper>
    </FodGrid>
    
    <!-- Grafic -->
    <FodGrid Item="true" xs="12" md="9">
        <FodPaper Elevation="2" Class="pa-4" Height="300px">
            <FodText Typo="Typo.h6" Class="mb-3">Evoluție vânzări</FodText>
            <!-- Component grafic aici -->
        </FodPaper>
    </FodGrid>
</FodGrid>
```

#### Paper cu hover effect
```razor
<FodPaper Class="pa-4 hover-elevation" 
          Elevation="2" 
          Style="transition: all 0.3s ease; cursor: pointer;"
          @onmouseover="@(() => hoverElevation = 8)"
          @onmouseout="@(() => hoverElevation = 2)"
          Elevation="@hoverElevation">
    <FodText>Paper cu efect la hover</FodText>
</FodPaper>

@code {
    private int hoverElevation = 2;
}
```

#### Paper pentru notificări/alerte
```razor
<FodPaper Elevation="6" 
          Class="pa-4 ma-2" 
          Style="border-left: 4px solid var(--fod-palette-warning);">
    <div class="d-flex align-items-start">
        <FodIcon Icon="@FodIcons.Material.Filled.Warning" 
                 Color="FodColor.Warning" 
                 Class="me-3" />
        <div>
            <FodText Typo="Typo.subtitle1">Atenție!</FodText>
            <FodText Typo="Typo.body2">
                Sesiunea dvs. va expira în 5 minute.
            </FodText>
        </div>
    </div>
</FodPaper>
```

#### Paper pentru layout complex
```razor
<FodPaper Elevation="0" Class="d-flex" Height="400px">
    <!-- Sidebar -->
    <FodPaper Square="true" 
              Outlined="true" 
              Class="pa-4" 
              Width="200px"
              Style="border-right: 1px solid var(--fod-palette-lines-default);">
        <FodText Typo="Typo.h6">Meniu</FodText>
        <!-- Elemente meniu -->
    </FodPaper>
    
    <!-- Content -->
    <div class="flex-grow-1 pa-4">
        <FodText Typo="Typo.h5">Conținut principal</FodText>
        <!-- Conținut -->
    </div>
</FodPaper>
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Elevation` | `int` | Nivelul de elevație (0-25) | `1` |
| `Square` | `bool` | Elimină colțurile rotunjite | `false` |
| `Outlined` | `bool` | Folosește bordură în loc de umbră | `false` |
| `Height` | `string` | Înălțimea componentei | `null` |
| `Width` | `string` | Lățimea componentei | `null` |
| `MaxHeight` | `string` | Înălțimea maximă | `null` |
| `MaxWidth` | `string` | Lățimea maximă | `null` |
| `MinHeight` | `string` | Înălțimea minimă | `null` |
| `MinWidth` | `string` | Lățimea minimă | `null` |
| `ChildContent` | `RenderFragment` | Conținutul componentei | `null` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |
| `UserAttributes` | `Dictionary<string, object>` | Atribute HTML adiționale | `null` |

### 4. Nivele de elevație

| Nivel | Utilizare recomandată |
|-------|----------------------|
| 0 | Suprafețe plate, fără separare vizuală |
| 1-3 | Carduri simple, containere de bază |
| 4-6 | Carduri interactive, butoane ridicate |
| 8-12 | Dialoguri, modale, meniuri dropdown |
| 16-24 | Componente temporare deasupra conținutului |
| 25 | Elevație maximă pentru accent special |

### 5. Stilizare și personalizare

#### Variabile CSS disponibile
```css
/* Personalizare globală Paper */
:root {
    --fod-paper-background: #ffffff;
    --fod-paper-border-radius: 4px;
    --fod-paper-border-color: #e0e0e0;
}

/* Paper personalizat pentru dark mode */
.dark-theme .fod-paper {
    --fod-palette-surface: #1e1e1e;
    --fod-palette-lines-default: #333333;
}

/* Stiluri pentru diferite utilizări */
.info-paper {
    background-color: #e3f2fd !important;
    border-left: 4px solid #2196f3;
}

.success-paper {
    background-color: #e8f5e9 !important;
    border-left: 4px solid #4caf50;
}

/* Animații pentru interactivitate */
.interactive-paper {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-paper:hover {
    transform: translateY(-2px);
}
```

### 6. Integrare cu alte componente

#### Paper în Grid System
```razor
<FodGrid Container="true" Spacing="2">
    <FodGrid Item="true" xs="12" md="6">
        <FodPaper Elevation="2" Class="pa-4 h-100">
            <!-- Conținut coloană stânga -->
        </FodPaper>
    </FodGrid>
    <FodGrid Item="true" xs="12" md="6">
        <FodPaper Elevation="2" Class="pa-4 h-100">
            <!-- Conținut coloană dreapta -->
        </FodPaper>
    </FodGrid>
</FodGrid>
```

#### Paper ca fundal pentru tabele
```razor
<FodPaper Elevation="1" Class="pa-0">
    <FodDataTable Items="data" Dense="true">
        <!-- Configurație tabel -->
    </FodDataTable>
</FodPaper>
```

### 7. Patterns comune de utilizare

#### Container pentru secțiuni
```razor
<FodPaper Elevation="0" Outlined="true" Class="mb-4 pa-4">
    <FodText Typo="Typo.h6" Class="mb-3">Titlu secțiune</FodText>
    <!-- Conținut secțiune -->
</FodPaper>
```

#### Wrapper pentru componente complexe
```razor
<FodPaper Elevation="4" Class="overflow-hidden">
    <!-- Header -->
    <div class="pa-4 bg-primary text-white">
        <FodText Typo="Typo.h5">Header</FodText>
    </div>
    
    <!-- Body -->
    <div class="pa-4">
        <!-- Conținut -->
    </div>
    
    <!-- Footer -->
    <div class="pa-4 bg-grey-lighten-4">
        <!-- Acțiuni -->
    </div>
</FodPaper>
```

### 8. Performanță

- Paper este o componentă lightweight
- Umbra este aplicată prin CSS, nu imagini
- Folosiți `Elevation="0"` pentru suprafețe care nu necesită adâncime
- `Outlined="true"` este mai performant decât elevația pentru liste mari

### 9. Accesibilitate

- Paper acceptă toate atributele ARIA prin UserAttributes
- Folosiți role="region" și aria-label pentru secțiuni importante
- Asigurați contrast adecvat pentru conținutul din interior

### 10. Note și observații

- Elevația nu afectează z-index-ul, doar umbra vizuală
- Square elimină doar border-radius, nu afectează padding
- Outlined și Elevation sunt mutual exclusive (outlined are prioritate)
- Paper moștenește culoarea de fundal din temă

### 11. Bune practici

1. **Consistență** - Folosiți nivele de elevație consistente în aplicație
2. **Ierarhie** - Elevație mai mare = importanță mai mare
3. **Spațiere** - Folosiți clase de padding pentru spațiere internă
4. **Performanță** - Nu abuzați de elevații mari pentru elemente multe
5. **Semantică** - Paper este pentru organizare vizuală, nu structură

### 12. Troubleshooting

#### Paper nu afișează umbra
- Verificați că `Outlined` nu este `true`
- Verificați că `Elevation` este între 1-25
- Verificați că tema include variabilele de elevație

#### Colțurile nu sunt rotunjite
- Verificați că `Square` nu este `true`
- Verificați variabila `--fod-default-borderradius`

### 13. Concluzie
`FodPaper` este o componentă fundamentală pentru crearea de interfețe cu adâncime și organizare vizuală clară. Simplitatea și flexibilitatea sa o fac ideală pentru o varietate largă de scenarii, de la simple containere până la layout-uri complexe.