# ConfigurationService

## Descriere Generală

`ConfigurationService` este un serviciu esențial pentru gestionarea configurațiilor client-side în aplicațiile FOD. Oferă acces centralizat la configurările aplicației, inclusiv setări pentru ReCAPTCHA, dimensiuni maxime pentru atașamente, numele aplicației și logo-ul organizației. Serviciul implementează caching pentru optimizarea performanței.

## Înregistrare

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddHttpClient<IConfigurationService, ConfigurationService>(client =>
{
    client.BaseAddress = new Uri(builder.HostEnvironment.BaseAddress);
});

// Sau cu configurare personalizată
builder.Services.AddScoped<IConfigurationService, ConfigurationService>();
```

## Interfața IConfigurationService

```csharp
public interface IConfigurationService
{
    Task<FodClientConfiguration> Get(bool force = true);
}
```

## Model FodClientConfiguration

```csharp
public class FodClientConfiguration
{
    public ReCaptchaOptions ReCaptcha { set; get; }
    public long AttachmentSize { set; get; }
    public string ApplicationName { set; get; }
    public string OrganizationLogo { set; get; }
}

public class ReCaptchaOptions
{
    public string SiteKey { set; get; }
    public ReCaptchaVersion Version { set; get; }
    public bool ValidateAuthenticated { set; get; }
}
```

## Utilizare de Bază

```razor
@inject IConfigurationService ConfigurationService

@code {
    private FodClientConfiguration configuration;
    
    protected override async Task OnInitializedAsync()
    {
        configuration = await ConfigurationService.Get();
    }
}
```

## Exemple de Utilizare

### Obținere Configurație

```razor
@inject IConfigurationService ConfigurationService

<div class="app-header">
    @if (configuration != null)
    {
        <img src="@configuration.OrganizationLogo" alt="Logo" />
        <h1>@configuration.ApplicationName</h1>
    }
</div>

@code {
    private FodClientConfiguration configuration;
    
    protected override async Task OnInitializedAsync()
    {
        // Obține configurația cu cache
        configuration = await ConfigurationService.Get();
    }
}
```

### Reîncărcare Forțată a Configurației

```razor
@inject IConfigurationService ConfigurationService

<FodButton @onclick="ReloadConfiguration">
    Reîncarcă Configurația
</FodButton>

@code {
    private FodClientConfiguration configuration;
    
    private async Task ReloadConfiguration()
    {
        // Forțează reîncărcarea, ignorând cache-ul
        configuration = await ConfigurationService.Get(force: true);
        StateHasChanged();
    }
}
```

### Verificare Dimensiune Atașamente

```razor
@inject IConfigurationService ConfigurationService

<FodInputFile OnChange="@HandleFileSelected" />

@if (!string.IsNullOrEmpty(errorMessage))
{
    <FodAlert Severity="FodSeverity.Error">@errorMessage</FodAlert>
}

@code {
    private FodClientConfiguration configuration;
    private string errorMessage;
    
    protected override async Task OnInitializedAsync()
    {
        configuration = await ConfigurationService.Get();
    }
    
    private async Task HandleFileSelected(InputFileChangeEventArgs e)
    {
        var file = e.File;
        
        if (file.Size > configuration.AttachmentSize)
        {
            errorMessage = $"Fișierul depășește dimensiunea maximă permisă de {FormatFileSize(configuration.AttachmentSize)}";
            return;
        }
        
        // Procesează fișierul
        await ProcessFile(file);
    }
    
    private string FormatFileSize(long bytes)
    {
        string[] sizes = { "B", "KB", "MB", "GB" };
        double len = bytes;
        int order = 0;
        while (len >= 1024 && order < sizes.Length - 1)
        {
            order++;
            len = len / 1024;
        }
        return $"{len:0.##} {sizes[order]}";
    }
}
```

### Configurare ReCAPTCHA

```razor
@inject IConfigurationService ConfigurationService

@if (showRecaptcha)
{
    <FodRecaptcha SiteKey="@configuration?.ReCaptcha?.SiteKey"
                  Version="@(configuration?.ReCaptcha?.Version ?? ReCaptchaVersion.V2)"
                  OnCallback="@HandleRecaptchaCallback" />
}

@code {
    private FodClientConfiguration configuration;
    private bool showRecaptcha;
    
    protected override async Task OnInitializedAsync()
    {
        configuration = await ConfigurationService.Get();
        
        // Afișează ReCAPTCHA doar dacă e configurat
        showRecaptcha = !string.IsNullOrEmpty(configuration?.ReCaptcha?.SiteKey);
        
        // Verifică dacă trebuie validat pentru utilizatori autentificați
        if (showRecaptcha && IsAuthenticated && !configuration.ReCaptcha.ValidateAuthenticated)
        {
            showRecaptcha = false;
        }
    }
    
    private void HandleRecaptchaCallback(string token)
    {
        // Procesează token-ul ReCAPTCHA
    }
}
```

### Component Header Personalizat

```razor
@inject IConfigurationService ConfigurationService

<div class="custom-header">
    <div class="logo-section">
        @if (!string.IsNullOrEmpty(configuration?.OrganizationLogo))
        {
            <img src="@configuration.OrganizationLogo" 
                 alt="@configuration?.ApplicationName" 
                 class="org-logo" />
        }
        else
        {
            <FodIcon Icon="@FodIcons.Material.Filled.Business" Size="FodSize.Large" />
        }
    </div>
    
    <div class="title-section">
        <h1>@(configuration?.ApplicationName ?? "Aplicație FOD")</h1>
    </div>
</div>

@code {
    private FodClientConfiguration configuration;
    
    protected override async Task OnInitializedAsync()
    {
        configuration = await ConfigurationService.Get();
    }
}
```

### Manager de Încărcare Fișiere

```razor
@inject IConfigurationService ConfigurationService
@inject IFodNotificationService NotificationService

<div class="file-uploader">
    <FodInputFile Multiple="true" OnChange="@HandleFilesSelected" />
    
    <div class="file-info">
        <p>Dimensiune maximă per fișier: @FormatFileSize(maxSize)</p>
    </div>
    
    @if (files.Any())
    {
        <div class="file-list">
            @foreach (var file in files)
            {
                <div class="file-item">
                    <span>@file.Name</span>
                    <span>@FormatFileSize(file.Size)</span>
                    @if (file.Size > maxSize)
                    {
                        <FodBadge Color="FodColor.Error">Prea mare</FodBadge>
                    }
                </div>
            }
        </div>
    }
</div>

@code {
    private FodClientConfiguration configuration;
    private long maxSize;
    private List<IBrowserFile> files = new();
    
    protected override async Task OnInitializedAsync()
    {
        configuration = await ConfigurationService.Get();
        maxSize = configuration?.AttachmentSize ?? 10485760; // 10MB implicit
    }
    
    private void HandleFilesSelected(InputFileChangeEventArgs e)
    {
        files.Clear();
        var oversizedFiles = new List<string>();
        
        foreach (var file in e.GetMultipleFiles())
        {
            files.Add(file);
            
            if (file.Size > maxSize)
            {
                oversizedFiles.Add(file.Name);
            }
        }
        
        if (oversizedFiles.Any())
        {
            NotificationService.Add(
                $"Următoarele fișiere depășesc limita: {string.Join(", ", oversizedFiles)}", 
                FodSeverity.Warning
            );
        }
    }
    
    private string FormatFileSize(long bytes)
    {
        string[] sizes = { "B", "KB", "MB", "GB" };
        double len = bytes;
        int order = 0;
        while (len >= 1024 && order < sizes.Length - 1)
        {
            order++;
            len = len / 1024;
        }
        return $"{len:0.##} {sizes[order]}";
    }
}
```

### Configurare Condiționată

```razor
@inject IConfigurationService ConfigurationService
@inject AuthenticationStateProvider AuthenticationStateProvider

<div class="conditional-features">
    @if (HasRecaptcha())
    {
        <div class="recaptcha-section">
            @if (ShouldShowRecaptcha())
            {
                <FodRecaptcha SiteKey="@configuration.ReCaptcha.SiteKey"
                            Version="@configuration.ReCaptcha.Version" />
            }
            else
            {
                <p class="text-muted">ReCAPTCHA nu este necesar pentru utilizatori autentificați.</p>
            }
        </div>
    }
</div>

@code {
    private FodClientConfiguration configuration;
    private bool isAuthenticated;
    
    protected override async Task OnInitializedAsync()
    {
        configuration = await ConfigurationService.Get();
        
        var authState = await AuthenticationStateProvider.GetAuthenticationStateAsync();
        isAuthenticated = authState.User.Identity?.IsAuthenticated ?? false;
    }
    
    private bool HasRecaptcha()
    {
        return configuration?.ReCaptcha != null && 
               !string.IsNullOrEmpty(configuration.ReCaptcha.SiteKey);
    }
    
    private bool ShouldShowRecaptcha()
    {
        if (!HasRecaptcha()) return false;
        
        // Verifică dacă trebuie afișat pentru utilizatori autentificați
        if (isAuthenticated && !configuration.ReCaptcha.ValidateAuthenticated)
        {
            return false;
        }
        
        return true;
    }
}
```

### Provider Global de Configurație

```razor
@* În App.razor sau un component de nivel înalt *@
@inject IConfigurationService ConfigurationService

<CascadingValue Value="@configuration" Name="AppConfiguration">
    @ChildContent
</CascadingValue>

@code {
    [Parameter] public RenderFragment ChildContent { get; set; }
    
    private FodClientConfiguration configuration;
    
    protected override async Task OnInitializedAsync()
    {
        configuration = await ConfigurationService.Get();
    }
}

@* În componente copil *@
<div class="child-component">
    <h2>@AppConfig?.ApplicationName</h2>
</div>

@code {
    [CascadingParameter(Name = "AppConfiguration")] 
    public FodClientConfiguration AppConfig { get; set; }
}
```

## Gestionare Erori

```razor
@inject IConfigurationService ConfigurationService
@inject ILogger<MyComponent> Logger

@if (loadError)
{
    <FodAlert Severity="FodSeverity.Error">
        Nu s-a putut încărca configurația. Folosim valori implicite.
    </FodAlert>
}

@code {
    private FodClientConfiguration configuration;
    private bool loadError;
    
    protected override async Task OnInitializedAsync()
    {
        try
        {
            configuration = await ConfigurationService.Get();
        }
        catch (HttpRequestException ex)
        {
            Logger.LogError(ex, "Eroare la încărcarea configurației");
            loadError = true;
            
            // Folosește configurație implicită
            configuration = new FodClientConfiguration
            {
                ApplicationName = "Aplicație FOD",
                AttachmentSize = 10485760, // 10MB
                ReCaptcha = null
            };
        }
    }
}
```

## Caching și Performanță

Serviciul implementează caching intern pentru a evita apeluri repetate la server:

```csharp
// Prima apelare - face request la server
var config1 = await ConfigurationService.Get();

// Apelări ulterioare - returnează din cache
var config2 = await ConfigurationService.Get();

// Forțează reîncărcarea de la server
var config3 = await ConfigurationService.Get(force: true);
```

## Endpoint API

Serviciul face request la:
```
GET /api/fod/configuration
```

Răspunsuri posibile:
- **200 OK** - Returnează configurația
- **204 No Content** - Returnează configurație goală

## Best Practices

1. **Cache configurația** - Încărcați o singură dată la inițializare
2. **Gestionați erori** - Tratați cazul când configurația nu e disponibilă
3. **Valori implicite** - Aveți valori de fallback pentru setări critice
4. **Validare** - Verificați valorile înainte de utilizare
5. **Cascading values** - Pentru aplicații mari, distribuiți configurația prin CascadingValue

## Integrare cu Alte Servicii

```csharp
public class FileUploadService
{
    private readonly IConfigurationService _configService;
    
    public FileUploadService(IConfigurationService configService)
    {
        _configService = configService;
    }
    
    public async Task<bool> ValidateFileSize(long fileSize)
    {
        var config = await _configService.Get();
        return fileSize <= config.AttachmentSize;
    }
}
```

## Troubleshooting

### Configurația nu se încarcă
- Verificați că endpoint-ul `/api/fod/configuration` este accesibil
- Verificați configurarea HttpClient cu BaseAddress corect

### Cache-ul nu se actualizează
- Folosiți parametrul `force: true` pentru reîncărcare
- Verificați că serviciul este înregistrat ca Scoped, nu Singleton

### Valori null în configurație
- Implementați valori implicite pentru proprietăți critice
- Validați configurația după încărcare

## Concluzie

ConfigurationService oferă un mecanism centralizat și eficient pentru gestionarea configurațiilor client-side în aplicațiile FOD. Cu suport pentru caching, gestionare erori și integrare ușoară, este esențial pentru aplicații care necesită configurări dinamice.