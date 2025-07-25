# Loading

## Documentație pentru componentele FodLoading

Biblioteca FOD oferă trei componente pentru indicarea încărcării și progresului:
- `FodLoadingLinear` - Bară de progres liniară
- `FodLoadingCircular` - Indicator circular de progres
- `FodLoading` - Wrapper simplu cu text și bară liniară

### 1. FodLoadingLinear

#### Descriere Generală
`FodLoadingLinear` este o componentă pentru afișarea progresului liniar, care poate funcționa atât în mod determinat (cu valoare specifică) cât și indeterminat (animație continuă). Suportă diferite stiluri vizuale și configurări.

Caracteristici principale:
- Mod determinat cu valoare între Min și Max
- Mod indeterminat cu animație continuă
- Buffer progress pentru încărcare în două etape
- Variante vizuale: normal, rounded, striped
- Orientare verticală opțională
- Dimensiuni multiple: Small, Medium, Large
- Integrare cu sistemul de culori FOD

#### Ghid de Utilizare API

##### Bară de progres simplă (indeterminată)
```razor
<FodLoadingLinear Indeterminate="true" />
```

##### Progres determinat cu valoare
```razor
<FodLoadingLinear Value="@progress" Min="0" Max="100" />

@code {
    private double progress = 45;
}
```

##### Progres cu buffer (încărcare în două etape)
```razor
<FodLoadingLinear Value="@downloadProgress" 
                  BufferValue="@bufferProgress"
                  Min="0" 
                  Max="100" />

@code {
    private double downloadProgress = 30;
    private double bufferProgress = 60;
}
```

##### Variante vizuale

###### Rounded (colțuri rotunjite)
```razor
<FodLoadingLinear Value="70" 
                  Rounded="true"
                  Color="FodColor.Primary" />
```

###### Striped (cu dungi)
```razor
<FodLoadingLinear Value="50" 
                  Striped="true"
                  Color="FodColor.Success" />
```

##### Dimensiuni diferite
```razor
<!-- Small -->
<FodLoadingLinear Value="60" Size="FodSize.Small" />

<!-- Medium (implicit) -->
<FodLoadingLinear Value="60" Size="FodSize.Medium" />

<!-- Large -->
<FodLoadingLinear Value="60" Size="FodSize.Large" />
```

##### Orientare verticală
```razor
<div style="height: 200px; display: flex;">
    <FodLoadingLinear Value="@progress" 
                      Vertical="true"
                      Color="FodColor.Primary" />
</div>
```

##### Încărcare fișier cu progres
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6">Încărcare fișier</FodText>
        <FodText Typo="Typo.body2" Color="FodColor.Secondary">
            @fileName
        </FodText>
        
        <div class="mt-3">
            <FodLoadingLinear Value="@uploadProgress" 
                              Min="0" 
                              Max="100"
                              Color="FodColor.Primary" />
            <FodText Typo="Typo.caption" Class="mt-1">
                @uploadProgress% - @GetUploadStatus()
            </FodText>
        </div>
    </FodCardContent>
</FodCard>

@code {
    private string fileName = "document.pdf";
    private double uploadProgress = 0;
    
    private string GetUploadStatus()
    {
        if (uploadProgress < 100)
            return $"{(uploadProgress * 1.5 / 100):F1} MB din 1.5 MB";
        return "Încărcare completă";
    }
}
```

#### Atribute FodLoadingLinear

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Indeterminate` | `bool` | Mod animație continuă | `false` |
| `Value` | `double` | Valoarea curentă | `0` |
| `Min` | `double` | Valoarea minimă | `0` |
| `Max` | `double` | Valoarea maximă | `100` |
| `BufferValue` | `double` | Valoarea buffer | `0` |
| `Rounded` | `bool` | Colțuri rotunjite | `false` |
| `Striped` | `bool` | Pattern cu dungi | `false` |
| `Vertical` | `bool` | Orientare verticală | `false` |
| `Color` | `FodColor` | Culoarea barei | `Primary` |
| `Size` | `FodSize` | Dimensiunea | `Medium` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |

### 2. FodLoadingCircular

#### Descriere Generală
`FodLoadingCircular` este o componentă pentru afișarea progresului circular, perfectă pentru indicarea stărilor de așteptare sau progres în spații compacte.

Caracteristici principale:
- Mod determinat cu progres vizibil
- Mod indeterminat cu rotație continuă
- Grosime ajustabilă pentru cerc
- Dimensiuni multiple
- Culori din paleta FOD
- Animații fluide

#### Ghid de Utilizare API

##### Indicator simplu de încărcare
```razor
<FodLoadingCircular Indeterminate="true" />
```

##### Progres circular determinat
```razor
<FodLoadingCircular Value="@progress" 
                    Min="0" 
                    Max="100" />

@code {
    private double progress = 75;
}
```

##### Dimensiuni și culori
```razor
<!-- Small cu culoare secundară -->
<FodLoadingCircular Indeterminate="true" 
                    Size="FodSize.Small"
                    Color="FodColor.Secondary" />

<!-- Large cu culoare success -->
<FodLoadingCircular Value="80" 
                    Size="FodSize.Large"
                    Color="FodColor.Success" />
```

##### Grosime personalizată
```razor
<FodLoadingCircular Value="@progress" 
                    StrokeWidth="8"
                    Size="FodSize.Large" />
```

##### Buton cu loading
```razor
<FodButton Disabled="@isLoading" 
           OnClick="HandleClick">
    @if (isLoading)
    {
        <FodLoadingCircular Size="FodSize.Small" 
                            Indeterminate="true"
                            Class="me-2" />
    }
    @buttonText
</FodButton>

@code {
    private bool isLoading = false;
    private string buttonText = "Salvează";
    
    private async Task HandleClick()
    {
        isLoading = true;
        buttonText = "Se salvează...";
        
        await SaveData();
        
        isLoading = false;
        buttonText = "Salvează";
    }
}
```

##### Card cu loading overlay
```razor
<FodCard Class="position-relative">
    <FodCardContent>
        <FodText Typo="Typo.h6">Date utilizator</FodText>
        <!-- Conținut card -->
    </FodCardContent>
    
    @if (isLoading)
    {
        <div class="position-absolute top-0 start-0 w-100 h-100 
                    d-flex align-items-center justify-content-center"
             style="background-color: rgba(255,255,255,0.8);">
            <FodLoadingCircular Indeterminate="true" 
                                Size="FodSize.Large" />
        </div>
    }
</FodCard>
```

#### Atribute FodLoadingCircular

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Indeterminate` | `bool` | Mod animație continuă | `false` |
| `Value` | `double` | Valoarea curentă | `0` |
| `Min` | `double` | Valoarea minimă | `0` |
| `Max` | `double` | Valoarea maximă | `100` |
| `StrokeWidth` | `int` | Grosimea cercului | `4` |
| `Color` | `FodColor` | Culoarea | `Primary` |
| `Size` | `FodSize` | Dimensiunea | `Medium` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |

### 3. FodLoading

#### Descriere Generală
`FodLoading` este o componentă wrapper simplă care combină text cu o bară de progres liniară indeterminată, utilă pentru mesaje de încărcare.

#### Ghid de Utilizare API

##### Loading simplu cu text
```razor
<FodLoading Text="Se încarcă datele..." />
```

##### Loading cu text personalizat
```razor
<FodLoading Text="Vă rugăm așteptați, procesăm cererea dvs..." 
            Color="FodColor.Primary" />
```

##### Loading în containere
```razor
@if (isLoading)
{
    <FodLoading Text="Se încarcă produsele..." />
}
else
{
    <!-- Afișare produse -->
}
```

#### Atribute FodLoading

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Text` | `string` | Textul afișat | - |
| `Color` | `FodColor` | Culoarea | `Primary` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |

### 4. Exemple complexe și pattern-uri

#### Tabel cu loading state
```razor
<FodDataTable Items="@items" Loading="@isLoading">
    <LoadingContent>
        <div class="text-center pa-8">
            <FodLoadingCircular Indeterminate="true" 
                                Size="FodSize.Large" />
            <FodText Typo="Typo.body2" Class="mt-3">
                Se încarcă datele...
            </FodText>
        </div>
    </LoadingContent>
    <HeaderContent>
        <!-- Header tabel -->
    </HeaderContent>
    <RowTemplate>
        <!-- Rânduri tabel -->
    </RowTemplate>
</FodDataTable>
```

#### Formular cu progres multi-step
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h5" GutterBottom="true">
            Înregistrare cont nou
        </FodText>
        
        <!-- Progress bar pentru pași -->
        <div class="mb-4">
            <FodLoadingLinear Value="@((currentStep - 1) * 33.33)" 
                              Min="0" 
                              Max="100"
                              Rounded="true"
                              Color="FodColor.Primary" />
            <div class="d-flex justify-content-between mt-2">
                <FodText Typo="Typo.caption" 
                         Color="@(currentStep >= 1 ? FodColor.Primary : FodColor.Secondary)">
                    Date personale
                </FodText>
                <FodText Typo="Typo.caption"
                         Color="@(currentStep >= 2 ? FodColor.Primary : FodColor.Secondary)">
                    Date cont
                </FodText>
                <FodText Typo="Typo.caption"
                         Color="@(currentStep >= 3 ? FodColor.Primary : FodColor.Secondary)">
                    Confirmare
                </FodText>
            </div>
        </div>
        
        <!-- Conținut formular bazat pe step -->
        @switch (currentStep)
        {
            case 1:
                <!-- Date personale -->
                break;
            case 2:
                <!-- Date cont -->
                break;
            case 3:
                <!-- Confirmare -->
                break;
        }
    </FodCardContent>
</FodCard>

@code {
    private int currentStep = 1;
}
```

#### Dashboard cu multiple loading states
```razor
<FodGrid Container="true" Spacing="3">
    <!-- Card statistici -->
    <FodGrid Item="true" xs="12" md="4">
        <FodCard>
            <FodCardContent>
                @if (statsLoading)
                {
                    <div class="text-center">
                        <FodLoadingCircular Indeterminate="true" />
                    </div>
                }
                else
                {
                    <FodText Typo="Typo.h4">@totalUsers</FodText>
                    <FodText Typo="Typo.body2" Color="FodColor.Secondary">
                        Total utilizatori
                    </FodText>
                }
            </FodCardContent>
        </FodCard>
    </FodGrid>
    
    <!-- Grafic -->
    <FodGrid Item="true" xs="12" md="8">
        <FodCard>
            <FodCardContent Style="height: 300px;">
                @if (chartLoading)
                {
                    <FodLoading Text="Se generează graficul..." />
                }
                else
                {
                    <!-- Afișare grafic -->
                }
            </FodCardContent>
        </FodCard>
    </FodGrid>
</FodGrid>
```

#### Upload multiplu cu progres individual
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Încărcare fișiere
        </FodText>
        
        @foreach (var file in uploadingFiles)
        {
            <div class="file-upload-item mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <FodText Typo="Typo.body2">@file.Name</FodText>
                    <FodText Typo="Typo.caption">
                        @file.Progress%
                    </FodText>
                </div>
                <FodLoadingLinear Value="@file.Progress" 
                                  Min="0" 
                                  Max="100"
                                  Size="FodSize.Small"
                                  Color="@GetProgressColor(file.Progress)" />
            </div>
        }
    </FodCardContent>
</FodCard>

@code {
    private List<UploadFile> uploadingFiles = new();
    
    private FodColor GetProgressColor(double progress)
    {
        if (progress < 30) return FodColor.Error;
        if (progress < 70) return FodColor.Warning;
        return FodColor.Success;
    }
}
```

### 5. Stilizare și personalizare

```css
/* Loading cu gradient personalizat */
.custom-loading .fod-loadinglinear-bar {
    background: linear-gradient(
        90deg, 
        var(--fod-palette-primary-main) 0%, 
        var(--fod-palette-secondary-main) 100%
    );
}

/* Loading circular cu umbră */
.shadow-loading .fod-loadingcircular {
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

/* Animație pulsare pentru loading text */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.pulsing-loading {
    animation: pulse 2s infinite;
}

/* Loading bar cu height custom */
.thick-loading .fod-loadinglinear {
    height: 8px !important;
}
```

### 6. Integrare cu alte componente

#### În Overlay
```razor
<FodOverlay Visible="@isProcessing">
    <div class="d-flex flex-column align-items-center">
        <FodLoadingCircular Indeterminate="true" 
                            Size="FodSize.Large"
                            Color="FodColor.Primary" />
        <FodText Typo="Typo.body1" Class="mt-3" Color="FodColor.White">
            Procesare în curs...
        </FodText>
    </div>
</FodOverlay>
```

#### În Button Group
```razor
<FodButtonGroup>
    <FodButton OnClick="Save" Disabled="@isSaving">
        @if (isSaving)
        {
            <FodLoadingCircular Size="FodSize.Small" 
                                Indeterminate="true"
                                Class="me-2" />
        }
        Salvează
    </FodButton>
    <FodButton OnClick="Cancel" 
               Variant="FodVariant.Text"
               Disabled="@isSaving">
        Anulează
    </FodButton>
</FodButtonGroup>
```

### 7. Performanță

- Animațiile folosesc CSS transforms pentru performanță optimă
- LoadingCircular folosește SVG pentru scalabilitate
- Evitați multiple loading indicators pe aceeași pagină

### 8. Accesibilitate

- Folosiți `aria-label` pentru screen readers
- Includeți text descriptiv pentru loading states
- Asigurați contrast suficient pentru vizibilitate

### 9. Bune practici

1. **Feedback imediat** - Afișați loading imediat la acțiuni
2. **Text descriptiv** - Explicați ce se încarcă
3. **Progres real** - Folosiți determinate când știți progresul
4. **Timeout handling** - Gestionați încărcări foarte lungi
5. **Skeleton screens** - Considerați alternative pentru UX mai bun

### 10. Troubleshooting

#### Loading nu se afișează
- Verificați că Indeterminate="true" sau Value are valoare
- Verificați că nu este ascuns de CSS

#### Animație sacadată
- Verificați că nu sunt prea multe re-render-uri
- Reduceți complexitatea paginii

#### Progres nu se actualizează
- Verificați că Value se schimbă
- Apelați StateHasChanged() dacă e necesar

### 11. Concluzie
Componentele de loading din FOD oferă soluții complete pentru indicarea stărilor de încărcare și progres. Cu suport pentru moduri determinate și indeterminate, multiple stiluri vizuale și dimensiuni, acestea acoperă majoritatea scenariilor de utilizare într-o aplicație web modernă.