# FodWizardLoadingCircle

## Documentație pentru componenta FodWizardLoadingCircle

### 1. Descriere Generală

`FodWizardLoadingCircle` este o componentă specializată pentru afișarea progresului circular cu valoare procentuală în centru. Este optimizată pentru utilizare în wizard-uri și procese multi-pas, oferind feedback vizual clar despre progresul curent.

Caracteristici principale:
- Indicator circular de progres cu SVG
- Afișare procent în centru
- Suport pentru moduri determinate și indeterminate
- Dimensiuni configurabile
- Grosime linie ajustabilă
- Integrare perfectă cu FodWizardSteps
- Animații fluide pentru tranziții

### 2. Utilizare de Bază

#### Indicator progres simplu
```razor
<FodWizardLoadingCircle Value="75" />
```

#### Indicator cu personalizare
```razor
<FodWizardLoadingCircle Value="@progressValue" 
                        FodSize="FodSize.Large"
                        FodColor="primary"
                        StrokeWidth="5" />

@code {
    private double progressValue = 33;
}
```

### 3. Parametri

| Parametru | Tip | Descriere | Valoare Implicită |
|-----------|-----|-----------|-------------------|
| `Value` | `double` | Valoarea progresului (0-100) | `0` |
| `FodColor` | `string` | Culoarea indicatorului | - |
| `FodSize` | `FodSize` | Dimensiunea componentei | `Medium` |
| `Indeterminate` | `bool` | Mod progres nedeterminat | `false` |
| `Min` | `double` | Valoare minimă | `0.0` |
| `Max` | `double` | Valoare maximă | `100.0` |
| `StrokeWidth` | `int` | Grosimea liniei cercului | `3` |

### 4. Calcul și Randare SVG

Componenta folosește SVG pentru randare cu:
- ViewBox: `22 22 44 44`
- Rază cerc: `20`
- Circumferință: `126` (magic number)
- Stroke-dasharray și stroke-dashoffset pentru progres

### 5. Exemple Avansate

#### Progress tracker pentru upload
```razor
<div class="upload-progress-container">
    <FodWizardLoadingCircle Value="@uploadProgress" 
                            FodSize="FodSize.Largest"
                            FodColor="success"
                            StrokeWidth="4" />
    
    <FodText Typo="Typo.h6" Align="FodAlign.Center" Class="mt-3">
        @if (uploadProgress < 100)
        {
            <span>Se încarcă: @currentFileName</span>
        }
        else
        {
            <span class="text-success">Încărcare completă!</span>
        }
    </FodText>
    
    <FodText Typo="Typo.body2" Align="FodAlign.Center">
        @uploadedFiles fișiere din @totalFiles
    </FodText>
</div>

@code {
    private double uploadProgress = 0;
    private string currentFileName = "";
    private int uploadedFiles = 0;
    private int totalFiles = 0;
    
    private async Task UploadFiles(List<IBrowserFile> files)
    {
        totalFiles = files.Count;
        
        for (int i = 0; i < files.Count; i++)
        {
            currentFileName = files[i].Name;
            uploadProgress = (double)(i * 100) / totalFiles;
            StateHasChanged();
            
            await UploadFile(files[i]);
            
            uploadedFiles = i + 1;
            uploadProgress = (double)(uploadedFiles * 100) / totalFiles;
            StateHasChanged();
        }
    }
}
```

#### Dashboard cu multiple indicatoare
```razor
<FodGrid container spacing="3" justifyContent="Center">
    @foreach (var metric in performanceMetrics)
    {
        <FodGrid item xs="6" sm="4" md="3">
            <FodCard>
                <FodCardContent Class="text-center">
                    <FodWizardLoadingCircle Value="@metric.Value" 
                                            FodColor="@GetColorForValue(metric.Value)"
                                            FodSize="FodSize.Large"
                                            StrokeWidth="5" />
                    <FodText Typo="Typo.h6" Class="mt-2">
                        @metric.Name
                    </FodText>
                    <FodText Typo="Typo.body2" Color="FodColor.TextSecondary">
                        @metric.Description
                    </FodText>
                </FodCardContent>
            </FodCard>
        </FodGrid>
    }
</FodGrid>

@code {
    private List<PerformanceMetric> performanceMetrics = new()
    {
        new() { Name = "CPU", Value = 45, Description = "Utilizare procesor" },
        new() { Name = "RAM", Value = 78, Description = "Memorie utilizată" },
        new() { Name = "Disk", Value = 92, Description = "Spațiu ocupat" },
        new() { Name = "Network", Value = 23, Description = "Trafic rețea" }
    };
    
    private string GetColorForValue(double value)
    {
        return value switch
        {
            < 50 => "success",
            < 80 => "warning",
            _ => "error"
        };
    }
}
```

#### Animație progres cu tranziții
```razor
<div class="animated-progress">
    <FodWizardLoadingCircle @ref="progressCircle"
                            Value="@animatedValue" 
                            FodSize="FodSize.Largest"
                            FodColor="primary"
                            StrokeWidth="6" />
    
    <div class="progress-controls mt-4">
        <FodButton Color="FodColor.Primary" 
                   OnClick="() => AnimateToValue(0)">0%</FodButton>
        <FodButton Color="FodColor.Primary" 
                   OnClick="() => AnimateToValue(25)">25%</FodButton>
        <FodButton Color="FodColor.Primary" 
                   OnClick="() => AnimateToValue(50)">50%</FodButton>
        <FodButton Color="FodColor.Primary" 
                   OnClick="() => AnimateToValue(75)">75%</FodButton>
        <FodButton Color="FodColor.Primary" 
                   OnClick="() => AnimateToValue(100)">100%</FodButton>
    </div>
</div>

@code {
    private FodWizardLoadingCircle progressCircle;
    private double animatedValue = 0;
    private System.Timers.Timer animationTimer;
    
    private void AnimateToValue(double targetValue)
    {
        animationTimer?.Dispose();
        animationTimer = new System.Timers.Timer(10);
        
        animationTimer.Elapsed += (sender, e) =>
        {
            InvokeAsync(() =>
            {
                var diff = targetValue - animatedValue;
                if (Math.Abs(diff) < 1)
                {
                    animatedValue = targetValue;
                    animationTimer.Dispose();
                }
                else
                {
                    animatedValue += diff * 0.1;
                }
                StateHasChanged();
            });
        };
        
        animationTimer.Start();
    }
    
    public void Dispose()
    {
        animationTimer?.Dispose();
    }
}
```

### 6. Stilizare CSS

```css
/* Container principal */
.fod-progress-circular {
    display: inline-flex;
    position: relative;
}

/* Dimensiuni predefinite */
.fod-progress-small {
    width: 32px;
    height: 32px;
}

.fod-progress-medium {
    width: 48px;
    height: 48px;
}

.fod-progress-large {
    width: 64px;
    height: 64px;
}

.fod-progress-largest {
    width: 96px;
    height: 96px;
}

/* SVG styling */
.fod-progress-circular-svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
}

/* Circle animations */
.fod-progress-circular-circle {
    transition: stroke-dashoffset 0.3s ease-in-out;
}

.fod-progress-indeterminate {
    animation: progress-circular-rotate 1.4s linear infinite;
}

@keyframes progress-circular-rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* Text styling */
.fod-progress-circular text {
    font-weight: 600;
    user-select: none;
}

/* Color variants */
.fod-primary-text .fod-progress-circular-circle {
    stroke: var(--fod-palette-primary-main);
}

.fod-success-text .fod-progress-circular-circle {
    stroke: var(--fod-palette-success-main);
}

.fod-warning-text .fod-progress-circular-circle {
    stroke: var(--fod-palette-warning-main);
}

.fod-error-text .fod-progress-circular-circle {
    stroke: var(--fod-palette-error-main);
}

/* Background circle */
.fod-progress-circular-circle::before {
    content: "";
    position: absolute;
    stroke: currentColor;
    opacity: 0.1;
    stroke-dasharray: 126;
    stroke-dashoffset: 0;
}
```

### 7. Integrare cu FodWizardSteps

```razor
<FodWizardSteps ShowProgress="true">
    <!-- Componenta FodWizardLoadingCircle este inclusă automat -->
    <!-- și actualizată pe baza progresului prin pași -->
</FodWizardSteps>
```

### 8. Scenarii de Utilizare

#### Timer countdown
```razor
<div class="countdown-timer text-center">
    <FodWizardLoadingCircle Value="@timeRemaining" 
                            FodSize="FodSize.Largest"
                            FodColor="@GetTimerColor()"
                            StrokeWidth="8" />
    
    <FodText Typo="Typo.h5" Class="mt-3">
        Timp rămas: @FormatTime(secondsRemaining)
    </FodText>
</div>

@code {
    private int totalSeconds = 300; // 5 minute
    private int secondsRemaining = 300;
    private double timeRemaining => (double)secondsRemaining / totalSeconds * 100;
    private System.Timers.Timer countdownTimer;
    
    protected override void OnInitialized()
    {
        countdownTimer = new System.Timers.Timer(1000);
        countdownTimer.Elapsed += (s, e) => 
        {
            InvokeAsync(() => 
            {
                if (secondsRemaining > 0)
                {
                    secondsRemaining--;
                    StateHasChanged();
                }
                else
                {
                    countdownTimer.Stop();
                    OnTimerComplete();
                }
            });
        };
        countdownTimer.Start();
    }
    
    private string GetTimerColor()
    {
        return timeRemaining switch
        {
            > 50 => "success",
            > 20 => "warning",
            _ => "error"
        };
    }
    
    private string FormatTime(int seconds)
    {
        var minutes = seconds / 60;
        var secs = seconds % 60;
        return $"{minutes:00}:{secs:00}";
    }
}
```

### 9. Best Practices

1. **Valori în range** - Asigurați că Value este între Min și Max
2. **Dimensiuni apropriate** - Alegeți FodSize potrivit contextului
3. **Culori semnificative** - Folosiți culori care indică starea
4. **StrokeWidth proporțional** - Ajustați grosimea cu dimensiunea
5. **Actualizări fluide** - Evitați salturi bruște în valori

### 10. Performanță

- SVG rendering eficient
- Tranziții CSS pentru animații fluide
- Evitați actualizări prea frecvente (< 10ms)
- Re-rendare minimă prin change detection

### 11. Accesibilitate

- Role `progressbar` pentru screen readers
- `aria-valuenow` actualizat dinamic
- Text procent vizibil pentru claritate
- Contrast adecvat pentru text

### 12. Comparație cu alte Loading

| Caracteristică | FodWizardLoadingCircle | FodLoadingCircular | FodLoadingLinear |
|----------------|------------------------|-------------------|------------------|
| Formă | Circular cu % | Circular | Linear |
| Afișare valoare | Da | Nu | Nu |
| Use case | Progress tracking | Loading state | Progress bar |
| Personalizare | Mare | Medie | Medie |

### 13. Troubleshooting

#### Procentul nu se actualizează
- Verificați că Value se schimbă
- Verificați StateHasChanged()
- Verificați range-ul Min/Max

#### Cercul nu apare complet
- Verificați StrokeWidth nu e prea mare
- Verificați CSS pentru overflow
- Verificați viewBox SVG

### 14. Exemple CodePen/JSFiddle

Pentru a testa comportamentul SVG:
```html
<svg viewBox="22 22 44 44" width="96" height="96">
    <circle cx="44" cy="44" r="20" 
            fill="none" 
            stroke="blue" 
            stroke-width="3"
            stroke-dasharray="126"
            stroke-dashoffset="31.5"
            transform="rotate(-90 44 44)" />
</svg>
<!-- stroke-dashoffset="31.5" = 75% progress -->
```

### 15. Concluzie

`FodWizardLoadingCircle` oferă o modalitate elegantă și intuitivă de a afișa progresul în aplicații. Cu design clar și personalizare flexibilă, componenta este ideală pentru wizard-uri, procese de încărcare și orice scenariu care necesită feedback vizual despre progres.