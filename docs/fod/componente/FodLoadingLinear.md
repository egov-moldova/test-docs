# FodLoadingLinear

## Documentație pentru componenta FodLoadingLinear

### 1. Descriere Generală

`FodLoadingLinear` este o componentă de încărcare liniară (progress bar) care afișează progresul într-o bară orizontală sau verticală. Suportă moduri determinate, indeterminate și buffer, cu opțiuni pentru stilizare avansată.

Caracteristici principale:
- Bară de progres orizontală/verticală
- Mod determinate cu procent
- Mod indeterminate cu animație
- Mod buffer pentru încărcare în două etape
- Striații opționale
- Colțuri rotunjite opționale
- Dimensiuni multiple
- Conținut personalizat
- Suport RTL

### 2. Utilizare de Bază

#### Progress simplu
```razor
<FodLoadingLinear Value="@progress" />

@code {
    private double progress = 35;
}
```

#### Loading indeterminate
```razor
<FodLoadingLinear Indeterminate="true" 
                  FodColor="FodColor.Primary" />
```

#### Progress cu buffer
```razor
<FodLoadingLinear Value="@downloadProgress" 
                  BufferValue="@bufferProgress"
                  Buffer="true" />

@code {
    private double downloadProgress = 30;
    private double bufferProgress = 50;
}
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `FodColor` | `FodColor` | Culoarea componentei | `FodColor.Default` |
| `FodSize` | `FodSize` | Dimensiunea barei | `FodSize.Small` |
| `Indeterminate` | `bool` | Animație continuă | `false` |
| `Buffer` | `bool` | Activează modul buffer | `false` |
| `Rounded` | `bool` | Colțuri rotunjite | `false` |
| `Striped` | `bool` | Adaugă striații | `false` |
| `Vertical` | `bool` | Orientare verticală | `false` |
| `Value` | `double` | Valoarea progresului | `0` |
| `BufferValue` | `double` | Valoarea buffer | `0` |
| `Min` | `double` | Valoare minimă | `0` |
| `Max` | `double` | Valoare maximă | `100` |
| `ChildContent` | `RenderFragment` | Conținut personalizat | - |

### 4. Exemple Avansate

#### Progress cu text și procent
```razor
<div class="position-relative">
    <FodLoadingLinear Value="@uploadProgress" 
                      FodColor="FodColor.Success"
                      FodSize="FodSize.Medium"
                      Rounded="true">
        <div class="position-absolute w-100 text-center">
            <FodText Typo="Typo.caption" Color="FodColor.Inherit">
                @($"{uploadProgress:F0}%")
            </FodText>
        </div>
    </FodLoadingLinear>
</div>

@code {
    private double uploadProgress = 67;
}
```

#### Multi-step progress
```razor
<div class="mb-4">
    <div class="d-flex justify-content-between mb-2">
        <FodText Typo="Typo.subtitle2">@currentStep.Name</FodText>
        <FodText Typo="Typo.caption">
            Pasul @currentStepIndex din @totalSteps
        </FodText>
    </div>
    
    <FodLoadingLinear Value="@overallProgress" 
                      FodColor="FodColor.Primary"
                      Rounded="true"
                      Striped="true" />
    
    <div class="mt-2">
        <FodLoadingLinear Value="@currentStep.Progress" 
                          FodColor="FodColor.Secondary"
                          FodSize="FodSize.Small" />
    </div>
</div>

@code {
    private int currentStepIndex = 2;
    private int totalSteps = 5;
    private double overallProgress => (currentStepIndex - 1) * 100.0 / totalSteps + 
                                      (currentStep.Progress / totalSteps);
    
    private StepInfo currentStep = new() 
    { 
        Name = "Procesare date", 
        Progress = 45 
    };
    
    public class StepInfo
    {
        public string Name { get; set; }
        public double Progress { get; set; }
    }
}
```

#### Download cu buffer
```razor
<FodCard>
    <FodCardContent>
        <div class="d-flex align-items-center mb-3">
            <FodIcon Icon="@FodIcons.Material.Filled.Download" 
                     Class="me-2" />
            <div class="flex-grow-1">
                <FodText>document.pdf</FodText>
                <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                    @FormatBytes(downloadedBytes) / @FormatBytes(totalBytes)
                </FodText>
            </div>
            <FodText>@downloadSpeed MB/s</FodText>
        </div>
        
        <FodLoadingLinear Value="@downloadPercent" 
                          BufferValue="@bufferPercent"
                          Buffer="true"
                          FodColor="FodColor.Info"
                          Rounded="true" />
    </FodCardContent>
</FodCard>

@code {
    private long downloadedBytes = 45_000_000;
    private long bufferedBytes = 67_000_000;
    private long totalBytes = 150_000_000;
    private double downloadSpeed = 2.5;
    
    private double downloadPercent => (double)downloadedBytes / totalBytes * 100;
    private double bufferPercent => (double)bufferedBytes / totalBytes * 100;
    
    private string FormatBytes(long bytes)
    {
        return $"{bytes / 1_000_000.0:F1} MB";
    }
}
```

#### Progress vertical pentru skills
```razor
<div class="d-flex gap-4">
    @foreach (var skill in skills)
    {
        <div class="text-center">
            <FodText Typo="Typo.caption" Class="mb-2">
                @skill.Name
            </FodText>
            <div style="height: 200px; position: relative;">
                <FodLoadingLinear Value="@skill.Level" 
                                  FodColor="@skill.Color"
                                  Vertical="true"
                                  Rounded="true"
                                  Class="h-100" />
                <div class="position-absolute bottom-0 w-100 text-center pb-2">
                    <FodText Typo="Typo.caption" Color="FodColor.OnPrimary">
                        @skill.Level%
                    </FodText>
                </div>
            </div>
        </div>
    }
</div>

@code {
    private List<Skill> skills = new()
    {
        new() { Name = "C#", Level = 90, Color = FodColor.Primary },
        new() { Name = "Blazor", Level = 85, Color = FodColor.Secondary },
        new() { Name = "SQL", Level = 75, Color = FodColor.Info },
        new() { Name = "JavaScript", Level = 70, Color = FodColor.Warning }
    };
    
    public class Skill
    {
        public string Name { get; set; }
        public double Level { get; set; }
        public FodColor Color { get; set; }
    }
}
```

#### Loading cu animație customizată
```razor
<div class="loading-container">
    @if (!isComplete)
    {
        <FodLoadingLinear @ref="progressBar"
                          Value="@progress" 
                          FodColor="FodColor.Primary"
                          FodSize="FodSize.Medium"
                          Rounded="true"
                          Striped="@(progress > 50)" />
        
        <div class="d-flex justify-content-between mt-2">
            <FodText Typo="Typo.caption">@statusMessage</FodText>
            <FodText Typo="Typo.caption">@timeRemaining</FodText>
        </div>
    }
    else
    {
        <FodAlert Severity="FodSeverity.Success">
            Proces finalizat cu succes!
        </FodAlert>
    }
</div>

@code {
    private FodLoadingLinear progressBar;
    private double progress = 0;
    private bool isComplete = false;
    private string statusMessage = "Inițializare...";
    private string timeRemaining = "Calculez...";
    
    protected override async Task OnInitializedAsync()
    {
        await SimulateProgress();
    }
    
    private async Task SimulateProgress()
    {
        var stages = new[]
        {
            ("Conectare la server...", 20),
            ("Descărcare date...", 40),
            ("Procesare...", 30),
            ("Finalizare...", 10)
        };
        
        foreach (var (message, duration) in stages)
        {
            statusMessage = message;
            var stageProgress = progress;
            var targetProgress = Math.Min(progress + duration, 100);
            
            while (progress < targetProgress)
            {
                await Task.Delay(100);
                progress += 1;
                
                var remaining = (100 - progress) * 0.1;
                timeRemaining = $"{remaining:F1} secunde rămase";
                
                StateHasChanged();
            }
        }
        
        isComplete = true;
        StateHasChanged();
    }
}
```

### 5. Stilizare și Variante

#### Toate dimensiunile
```razor
<div class="space-y-4">
    <div>
        <FodText Typo="Typo.caption">Small</FodText>
        <FodLoadingLinear Value="70" FodSize="FodSize.Small" />
    </div>
    <div>
        <FodText Typo="Typo.caption">Medium</FodText>
        <FodLoadingLinear Value="70" FodSize="FodSize.Medium" />
    </div>
    <div>
        <FodText Typo="Typo.caption">Large</FodText>
        <FodLoadingLinear Value="70" FodSize="FodSize.Large" />
    </div>
</div>
```

#### Variante stilizate
```razor
<div class="space-y-4">
    <FodLoadingLinear Value="60" 
                      FodColor="FodColor.Primary" />
    
    <FodLoadingLinear Value="60" 
                      FodColor="FodColor.Secondary"
                      Rounded="true" />
    
    <FodLoadingLinear Value="60" 
                      FodColor="FodColor.Success"
                      Striped="true" />
    
    <FodLoadingLinear Value="60" 
                      FodColor="FodColor.Warning"
                      Rounded="true"
                      Striped="true" />
</div>
```

### 6. Stilizare CSS Personalizată

```css
/* Progress cu gradient */
.gradient-progress .fod-progress-linear-bar {
    background: linear-gradient(90deg, 
        var(--fod-palette-primary-light) 0%, 
        var(--fod-palette-primary-dark) 100%);
}

/* Animație pentru striped */
@keyframes progress-striped {
    0% { background-position: 0 0; }
    100% { background-position: 40px 0; }
}

.animated-stripes .fod-progress-linear-striped .fod-progress-linear-bar {
    animation: progress-striped 1s linear infinite;
}

/* Progress cu glow */
.glow-progress .fod-progress-linear-bar {
    box-shadow: 0 0 10px var(--fod-palette-primary-main);
}

/* Dimensiune custom */
.thick-progress {
    height: 20px !important;
}

.thick-progress .fod-progress-linear-content {
    line-height: 20px;
}
```

### 7. Integrare cu Formulare

#### Upload fișiere
```razor
<InputFile OnChange="HandleFileSelected" multiple />

@if (uploadingFiles.Any())
{
    <div class="mt-3">
        @foreach (var file in uploadingFiles)
        {
            <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <FodText Typo="Typo.caption">@file.Name</FodText>
                    <FodText Typo="Typo.caption">@file.Progress%</FodText>
                </div>
                <FodLoadingLinear Value="@file.Progress" 
                                  FodColor="@(file.HasError ? FodColor.Error : FodColor.Primary)"
                                  FodSize="FodSize.Small" />
                @if (file.HasError)
                {
                    <FodText Color="FodColor.Error" Typo="Typo.caption">
                        @file.ErrorMessage
                    </FodText>
                }
            </div>
        }
    </div>
}

@code {
    private List<FileUploadInfo> uploadingFiles = new();
    
    private async Task HandleFileSelected(InputFileChangeEventArgs e)
    {
        foreach (var file in e.GetMultipleFiles())
        {
            var fileInfo = new FileUploadInfo { Name = file.Name };
            uploadingFiles.Add(fileInfo);
            
            _ = UploadFile(file, fileInfo);
        }
    }
    
    private async Task UploadFile(IBrowserFile file, FileUploadInfo info)
    {
        try
        {
            // Simulare upload
            while (info.Progress < 100)
            {
                await Task.Delay(100);
                info.Progress += Random.Shared.Next(5, 15);
                StateHasChanged();
            }
        }
        catch (Exception ex)
        {
            info.HasError = true;
            info.ErrorMessage = ex.Message;
        }
    }
}
```

### 8. Best Practices

1. **Feedback vizual** - Folosiți culori consistente pentru stări
2. **Valori clare** - Afișați procente sau text descriptiv
3. **Animații subtile** - Nu distrageți utilizatorul
4. **Buffer pentru streaming** - Folosiți pentru date în flux
5. **Indeterminate pentru necunoscut** - Când nu știți durata
6. **Accesibilitate** - Includeți aria labels

### 9. Performanță

- Animațiile CSS sunt optimizate
- Re-render doar la schimbarea valorilor
- Folosiți `Buffer` doar când e necesar
- Evitați actualizări prea frecvente

### 10. Accesibilitate

- Atribute ARIA incluse automat
- `role="progressbar"` setat
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Compatibil cu screen readers

### 11. Troubleshooting

#### Progress nu se actualizează
- Verificați că Value este între Min și Max
- Apelați StateHasChanged după actualizare
- Verificați că nu există erori în consolă

#### Animația indeterminate nu merge
- Verificați că Indeterminate="true"
- Verificați că CSS-ul este încărcat corect

#### Buffer nu apare
- Setați Buffer="true"
- Asigurați-vă că BufferValue > Value

### 12. Concluzie

`FodLoadingLinear` oferă o soluție versatilă pentru afișarea progresului în aplicațiile FOD. Cu multiple moduri de afișare și opțiuni de stilizare, componenta se adaptează perfect la orice context de încărcare sau procesare.