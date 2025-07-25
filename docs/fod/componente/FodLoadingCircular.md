# FodLoadingCircular

## Documentație pentru componenta FodLoadingCircular

### 1. Descriere Generală

`FodLoadingCircular` este o componentă de încărcare circulară care afișează progresul sau o animație de așteptare. Suportă atât modul determinate (cu valoare specifică) cât și indeterminate (animație continuă).

Caracteristici principale:
- Indicator circular SVG
- Mod determinate cu procent
- Mod indeterminate cu animație
- Dimensiuni multiple (Small, Medium, Large)
- Culori din tema aplicației
- Grosime ajustabilă
- Performanță optimizată
- Accesibilitate cu ARIA

### 2. Utilizare de Bază

#### Loading indeterminate
```razor
<FodLoadingCircular Indeterminate="true" />
```

#### Loading cu progres
```razor
<FodLoadingCircular Value="@progress" 
                    Min="0" 
                    Max="100" />

@code {
    private double progress = 45;
}
```

#### Loading colorat și dimensionat
```razor
<FodLoadingCircular Indeterminate="true" 
                    FodColor="FodColor.Primary" 
                    FodSize="FodSize.Large" />
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `FodColor` | `FodColor` | Culoarea componentei | `FodColor.Default` |
| `FodSize` | `FodSize` | Dimensiunea (Small, Medium, Large) | `FodSize.Medium` |
| `Indeterminate` | `bool` | Animație continuă fără valoare | `false` |
| `Value` | `double` | Valoarea curentă a progresului | `0` |
| `Min` | `double` | Valoarea minimă | `0` |
| `Max` | `double` | Valoarea maximă | `100` |
| `StrokeWidth` | `int` | Grosimea liniei cercului | `3` |

### 4. Exemple Avansate

#### Loading cu progres și text
```razor
<div class="text-center">
    <FodLoadingCircular Value="@uploadProgress" 
                        FodColor="FodColor.Primary" 
                        FodSize="FodSize.Large" />
    <FodText Typo="Typo.caption" Class="mt-2">
        @($"{uploadProgress:F0}% încărcat")
    </FodText>
</div>

@code {
    private double uploadProgress = 0;
    
    protected override async Task OnInitializedAsync()
    {
        // Simulare încărcare
        while (uploadProgress < 100)
        {
            await Task.Delay(100);
            uploadProgress += Random.Shared.Next(1, 10);
            StateHasChanged();
        }
    }
}
```

#### Loading în buton
```razor
<FodButton Disabled="@isLoading" 
           Color="FodColor.Primary">
    @if (isLoading)
    {
        <FodLoadingCircular Indeterminate="true" 
                            FodSize="FodSize.Small" 
                            FodColor="FodColor.Inherit" 
                            Class="me-2" />
    }
    @buttonText
</FodButton>

@code {
    private bool isLoading = false;
    private string buttonText = "Salvează";
    
    private async Task Save()
    {
        isLoading = true;
        buttonText = "Se salvează...";
        
        await SaveDataAsync();
        
        isLoading = false;
        buttonText = "Salvează";
    }
}
```

#### Loading overlay
```razor
<div class="position-relative">
    <FodCard>
        <FodCardContent>
            <!-- Conținut card -->
        </FodCardContent>
    </FodCard>
    
    @if (isLoadingData)
    {
        <div class="loading-overlay">
            <FodLoadingCircular Indeterminate="true" 
                                FodColor="FodColor.Primary" 
                                FodSize="FodSize.Large" />
        </div>
    }
</div>

<style>
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }
</style>
```

#### Loading cu etape multiple
```razor
<div class="d-flex flex-column align-items-center">
    @foreach (var step in loadingSteps)
    {
        <div class="d-flex align-items-center mb-2">
            @if (step.IsCompleted)
            {
                <FodIcon Icon="@FodIcons.Material.Filled.CheckCircle" 
                         Color="FodColor.Success" />
            }
            else if (step.IsActive)
            {
                <FodLoadingCircular Indeterminate="true" 
                                    FodSize="FodSize.Small" 
                                    FodColor="FodColor.Primary" />
            }
            else
            {
                <FodIcon Icon="@FodIcons.Material.Outlined.Circle" 
                         Color="FodColor.Disabled" />
            }
            <FodText Class="ms-2">@step.Name</FodText>
        </div>
    }
</div>

@code {
    private List<LoadingStep> loadingSteps = new()
    {
        new() { Name = "Validare date", IsActive = true },
        new() { Name = "Procesare cerere" },
        new() { Name = "Generare documente" },
        new() { Name = "Finalizare" }
    };
    
    public class LoadingStep
    {
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public bool IsCompleted { get; set; }
    }
}
```

#### Progress circular pentru statistici
```razor
<div class="d-flex justify-content-around">
    @foreach (var stat in statistics)
    {
        <div class="text-center">
            <div class="position-relative d-inline-block">
                <FodLoadingCircular Value="@stat.Value" 
                                    Max="@stat.Max" 
                                    FodColor="@stat.Color" 
                                    StrokeWidth="5" />
                <div class="position-absolute top-50 start-50 translate-middle">
                    <FodText Typo="Typo.h6">@stat.Value</FodText>
                </div>
            </div>
            <FodText Typo="Typo.caption" Class="mt-2">
                @stat.Label
            </FodText>
        </div>
    }
</div>

@code {
    private List<Statistic> statistics = new()
    {
        new() { Label = "Completate", Value = 75, Max = 100, Color = FodColor.Success },
        new() { Label = "În lucru", Value = 15, Max = 100, Color = FodColor.Warning },
        new() { Label = "Respinse", Value = 10, Max = 100, Color = FodColor.Error }
    };
    
    public class Statistic
    {
        public string Label { get; set; }
        public double Value { get; set; }
        public double Max { get; set; }
        public FodColor Color { get; set; }
    }
}
```

### 5. Stilizare și Dimensiuni

#### Dimensiuni predefinite
```razor
<div class="d-flex gap-3 align-items-center">
    <div>
        <FodLoadingCircular Indeterminate="true" FodSize="FodSize.Small" />
        <FodText Typo="Typo.caption">Small</FodText>
    </div>
    <div>
        <FodLoadingCircular Indeterminate="true" FodSize="FodSize.Medium" />
        <FodText Typo="Typo.caption">Medium</FodText>
    </div>
    <div>
        <FodLoadingCircular Indeterminate="true" FodSize="FodSize.Large" />
        <FodText Typo="Typo.caption">Large</FodText>
    </div>
</div>
```

#### Culori disponibile
```razor
<div class="d-flex flex-wrap gap-3">
    @foreach (FodColor color in Enum.GetValues<FodColor>())
    {
        <div class="text-center">
            <FodLoadingCircular Indeterminate="true" 
                                FodColor="@color" />
            <FodText Typo="Typo.caption">@color</FodText>
        </div>
    }
</div>
```

### 6. Stilizare CSS Personalizată

```css
/* Loading cu dimensiune custom */
.custom-loading .fod-progress-circular {
    width: 100px !important;
    height: 100px !important;
}

/* Animație personalizată */
.smooth-loading .fod-progress-circular-circle {
    transition: stroke-dashoffset 0.5s ease-in-out;
}

/* Loading cu fundal */
.loading-with-bg {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    padding: 10px;
}

/* Pulsație pentru indeterminate */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.pulsing-loader .fod-progress-circular {
    animation: pulse 2s ease-in-out infinite;
}
```

### 7. Integrare cu componente

#### În DataTable
```razor
<FodDataTable Items="@items" T="Item">
    @if (isLoadingData)
    {
        <LoadingContent>
            <div class="text-center p-4">
                <FodLoadingCircular Indeterminate="true" 
                                    FodColor="FodColor.Primary" />
                <FodText Class="mt-2">Se încarcă datele...</FodText>
            </div>
        </LoadingContent>
    }
    <!-- Coloane -->
</FodDataTable>
```

#### În Card
```razor
<FodCard>
    <FodCardContent>
        @if (isProcessing)
        {
            <div class="d-flex align-items-center">
                <FodLoadingCircular Indeterminate="true" 
                                    FodSize="FodSize.Small" 
                                    Class="me-3" />
                <div>
                    <FodText>Procesare în curs...</FodText>
                    <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                        Acest proces poate dura câteva minute
                    </FodText>
                </div>
            </div>
        }
    </FodCardContent>
</FodCard>
```

### 8. Best Practices

1. **Feedback clar** - Folosiți text descriptiv împreună cu loader
2. **Dimensiune adecvată** - Adaptați dimensiunea la context
3. **Culori consistente** - Folosiți culori din tema aplicației
4. **Indeterminate vs Determinate** - Folosiți determinate când știți progresul
5. **Poziționare** - Centrați în containerul părinte
6. **Overlay** - Pentru încărcare full-screen folosiți overlay

### 9. Performanță

- SVG este optimizat pentru performanță
- Animația CSS nu blochează thread-ul principal
- Re-render doar la schimbarea valorii
- Folosiți `Indeterminate` pentru animație continuă

### 10. Accesibilitate

- Atribut `role="progressbar"` inclus
- `aria-valuenow` actualizat automat
- Compatibil cu screen readers
- Contrast adecvat pentru culori

### 11. Troubleshooting

#### Animația nu funcționează
- Verificați că `Indeterminate="true"`
- Verificați că CSS-ul este încărcat
- Verificați consolă pentru erori JS

#### Valoarea nu se actualizează
- Verificați că Value este între Min și Max
- Verificați că StateHasChanged este apelat
- Folosiți @bind-Value pentru two-way binding

#### Dimensiunea nu se schimbă
- Verificați că FodSize este setat corect
- Verificați că nu există CSS care suprascrie
- Folosiți Class pentru dimensiuni custom

### 12. Concluzie

`FodLoadingCircular` oferă o soluție elegantă și flexibilă pentru indicarea stării de încărcare în aplicațiile FOD. Cu suport pentru progres determinat și animație continuă, componenta se integrează perfect în orice context de UI.