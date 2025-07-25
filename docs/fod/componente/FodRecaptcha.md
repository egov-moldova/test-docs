# Recaptcha

## Documentație pentru componenta FodRecaptcha

### 1. Descriere Generală
`FodRecaptcha` este componenta pentru integrarea Google reCAPTCHA în aplicații Blazor, oferind protecție împotriva spam-ului și automatizărilor abuzive. Componenta suportă reCAPTCHA v3 (invizibil) și include validare atât pe client cât și pe server.

Caracteristici principale:
- Integrare Google reCAPTCHA v3 (invizibil)
- Validare pe client și server
- Configurare flexibilă prin opțiuni
- Suport pentru utilizatori autentificați
- Gestionare automată a scripturilor
- Răspuns cu status detaliat
- Integrare ușoară în formulare
- Protecție împotriva atacurilor bot

### 2. Configurare inițială

#### Pasul 1: Obținerea cheilor Google reCAPTCHA
1. Accesați [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Înregistrați un nou site
3. Selectați reCAPTCHA v3
4. Copiați Site Key și Secret Key

#### Pasul 2: Configurare în appsettings.json
```json
{
  "ReCaptcha": {
    "SiteKey": "your-site-key-here",
    "SecretKey": "your-secret-key-here",
    "Version": "V3",
    "ValidateAuthenticated": false
  }
}
```

#### Pasul 3: Înregistrare servicii

##### Client-side (Program.cs)
```csharp
// Înregistrare serviciu recaptcha
builder.Services.AddScoped<IRecaptchaService, RecaptchaService>();

// Configurare opțiuni
builder.Services.Configure<ReCaptchaOptions>(
    builder.Configuration.GetSection("ReCaptcha"));
```

##### Server-side (Program.cs)
```csharp
// Înregistrare serviciu validare
builder.Services.AddScoped<IRecaptchaValidationService, RecaptchaValidationService>();

// Configurare opțiuni
builder.Services.Configure<ReCaptchaOptions>(
    builder.Configuration.GetSection("ReCaptcha"));
```

### 3. Ghid de Utilizare API

#### Integrare simplă în formular
```razor
@page "/contact"
@inject IRecaptchaService RecaptchaService
@inject HttpClient Http

<EditForm Model="@contactForm" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodTextField @bind-Value="contactForm.Name" 
                  Label="Nume" 
                  Required="true" />
    
    <FodTextField @bind-Value="contactForm.Email" 
                  Label="Email" 
                  Type="email"
                  Required="true" />
    
    <FodTextArea @bind-Value="contactForm.Message" 
                 Label="Mesaj"
                 Rows="5"
                 Required="true" />
    
    <!-- Componenta reCAPTCHA -->
    <FodRecaptcha />
    
    <FodButton Type="ButtonType.Submit" 
               Color="FodColor.Primary"
               Disabled="@isSubmitting">
        @if (isSubmitting)
        {
            <FodLoadingCircular Size="FodSize.Small" 
                                Indeterminate="true" 
                                Class="me-2" />
        }
        Trimite
    </FodButton>
</EditForm>

@if (!string.IsNullOrEmpty(statusMessage))
{
    <FodAlert Severity="@alertSeverity" Class="mt-3">
        @statusMessage
    </FodAlert>
}

@code {
    private ContactForm contactForm = new();
    private bool isSubmitting = false;
    private string statusMessage = "";
    private Severity alertSeverity = Severity.Info;
    
    private async Task HandleSubmit()
    {
        isSubmitting = true;
        statusMessage = "";
        
        try
        {
            // Execută validarea reCAPTCHA
            var token = await RecaptchaService.Execute();
            
            if (string.IsNullOrEmpty(token))
            {
                statusMessage = "Validare reCAPTCHA eșuată. Vă rugăm încercați din nou.";
                alertSeverity = Severity.Error;
                return;
            }
            
            // Trimite formularul cu token-ul
            var response = await Http.PostAsJsonAsync("/api/contact", new
            {
                contactForm.Name,
                contactForm.Email,
                contactForm.Message,
                RecaptchaToken = token
            });
            
            if (response.IsSuccessStatusCode)
            {
                statusMessage = "Mesaj trimis cu succes!";
                alertSeverity = Severity.Success;
                contactForm = new(); // Reset form
            }
            else
            {
                statusMessage = "Eroare la trimiterea mesajului.";
                alertSeverity = Severity.Error;
            }
        }
        catch (Exception ex)
        {
            statusMessage = $"Eroare: {ex.Message}";
            alertSeverity = Severity.Error;
        }
        finally
        {
            isSubmitting = false;
        }
    }
    
    public class ContactForm
    {
        [Required(ErrorMessage = "Numele este obligatoriu")]
        public string Name { get; set; }
        
        [Required(ErrorMessage = "Email-ul este obligatoriu")]
        [EmailAddress(ErrorMessage = "Email invalid")]
        public string Email { get; set; }
        
        [Required(ErrorMessage = "Mesajul este obligatoriu")]
        public string Message { get; set; }
    }
}
```

#### Validare server-side (Controller API)
```csharp
[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IRecaptchaValidationService _recaptchaService;
    private readonly IContactService _contactService;
    
    public ContactController(
        IRecaptchaValidationService recaptchaService,
        IContactService contactService)
    {
        _recaptchaService = recaptchaService;
        _contactService = contactService;
    }
    
    [HttpPost]
    public async Task<IActionResult> Submit(ContactRequest request)
    {
        // Validare model
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        // Validare reCAPTCHA
        var recaptchaResponse = await _recaptchaService.Validate(
            request.RecaptchaToken, 
            HttpContext);
        
        if (recaptchaResponse.Status != ReCaptchaResponseStatusEnum.Success)
        {
            return BadRequest(new 
            { 
                error = "Validare reCAPTCHA eșuată",
                message = recaptchaResponse.Message 
            });
        }
        
        // Procesare formular
        try
        {
            await _contactService.ProcessContactForm(request);
            return Ok(new { message = "Mesaj trimis cu succes" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Eroare server" });
        }
    }
}

public class ContactRequest
{
    [Required]
    public string Name { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    public string Message { get; set; }
    
    [Required]
    public string RecaptchaToken { get; set; }
}
```

#### Formular de înregistrare cu reCAPTCHA
```razor
@page "/register"
@inject IRecaptchaService RecaptchaService
@inject IAuthService AuthService
@inject NavigationManager Navigation

<FodCard Class="mx-auto" Style="max-width: 500px;">
    <FodCardContent>
        <FodText Typo="Typo.h4" GutterBottom="true" Align="Align.Center">
            Înregistrare cont nou
        </FodText>
        
        <EditForm Model="@registerModel" OnValidSubmit="HandleRegister">
            <DataAnnotationsValidator />
            
            <FodTextField @bind-Value="registerModel.Email" 
                          Label="Email" 
                          Type="email"
                          FullWidth="true"
                          Class="mb-3" />
            <ValidationMessage For="@(() => registerModel.Email)" />
            
            <FodTextField @bind-Value="registerModel.Password" 
                          Label="Parolă" 
                          Type="password"
                          FullWidth="true"
                          Class="mb-3" />
            <ValidationMessage For="@(() => registerModel.Password)" />
            
            <FodTextField @bind-Value="registerModel.ConfirmPassword" 
                          Label="Confirmă parola" 
                          Type="password"
                          FullWidth="true"
                          Class="mb-3" />
            <ValidationMessage For="@(() => registerModel.ConfirmPassword)" />
            
            <FodCheckbox @bind-Checked="registerModel.AcceptTerms" 
                         Class="mb-3">
                Accept <FodLink Href="/terms">termenii și condițiile</FodLink>
            </FodCheckbox>
            <ValidationMessage For="@(() => registerModel.AcceptTerms)" />
            
            <!-- reCAPTCHA pentru protecție -->
            <FodRecaptcha />
            
            <FodButton Type="ButtonType.Submit" 
                       Color="FodColor.Primary"
                       FullWidth="true"
                       Disabled="@isProcessing">
                @if (isProcessing)
                {
                    <FodLoadingCircular Size="FodSize.Small" 
                                        Indeterminate="true" 
                                        Class="me-2" />
                }
                Înregistrare
            </FodButton>
        </EditForm>
        
        @if (errors.Any())
        {
            <FodAlert Severity="Severity.Error" Class="mt-3">
                <ul class="mb-0">
                    @foreach (var error in errors)
                    {
                        <li>@error</li>
                    }
                </ul>
            </FodAlert>
        }
    </FodCardContent>
</FodCard>

@code {
    private RegisterModel registerModel = new();
    private bool isProcessing = false;
    private List<string> errors = new();
    
    private async Task HandleRegister()
    {
        isProcessing = true;
        errors.Clear();
        
        try
        {
            // Obține token reCAPTCHA
            var recaptchaToken = await RecaptchaService.Execute();
            
            if (string.IsNullOrEmpty(recaptchaToken))
            {
                errors.Add("Validare de securitate eșuată. Reîncărcați pagina.");
                return;
            }
            
            // Înregistrare utilizator
            var result = await AuthService.Register(
                registerModel.Email, 
                registerModel.Password,
                recaptchaToken);
            
            if (result.Succeeded)
            {
                Navigation.NavigateTo("/login?registered=true");
            }
            else
            {
                errors.AddRange(result.Errors);
            }
        }
        catch (Exception ex)
        {
            errors.Add("Eroare la înregistrare. Vă rugăm încercați din nou.");
        }
        finally
        {
            isProcessing = false;
        }
    }
}
```

#### Configurare pentru utilizatori autentificați
```razor
@* În componente unde utilizatorii autentificați nu necesită validare *@
@inject IAuthenticationStateProvider AuthStateProvider

@if (!isAuthenticated)
{
    <FodRecaptcha />
}

@code {
    private bool isAuthenticated = false;
    
    protected override async Task OnInitializedAsync()
    {
        var authState = await AuthStateProvider.GetAuthenticationStateAsync();
        isAuthenticated = authState.User.Identity?.IsAuthenticated ?? false;
    }
}
```

#### Validare manuală cu feedback vizual
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Verificare securitate
        </FodText>
        
        <FodRecaptcha />
        
        <FodButton Color="FodColor.Primary" 
                   OnClick="ValidateRecaptcha"
                   Class="mt-3">
            Verifică
        </FodButton>
        
        @if (validationResult != null)
        {
            <FodAlert Severity="@GetSeverity()" Class="mt-3">
                <FodAlertTitle>
                    @(validationResult.Success ? "Validare reușită" : "Validare eșuată")
                </FodAlertTitle>
                @validationResult.Message
            </FodAlert>
        }
    </FodCardContent>
</FodCard>

@code {
    private ReCaptchaResponse? validationResult;
    
    private async Task ValidateRecaptcha()
    {
        var token = await RecaptchaService.Execute();
        
        if (!string.IsNullOrEmpty(token))
        {
            var response = await Http.PostAsJsonAsync("/api/recaptcha/validate", 
                new { token });
            
            if (response.IsSuccessStatusCode)
            {
                validationResult = await response.Content
                    .ReadFromJsonAsync<ReCaptchaResponse>();
            }
        }
    }
    
    private Severity GetSeverity() => 
        validationResult?.Success == true ? Severity.Success : Severity.Error;
}
```

### 4. Model și configurare

#### ReCaptchaOptions
```csharp
public class ReCaptchaOptions
{
    public string SiteKey { get; set; }
    public string SecretKey { get; set; }
    public ReCaptchaVersion Version { get; set; } = ReCaptchaVersion.V3;
    public bool ValidateAuthenticated { get; set; } = false;
}

public enum ReCaptchaVersion
{
    V2,
    V2Invisible,
    V3
}
```

#### ReCaptchaResponse
```csharp
public class ReCaptchaResponse
{
    public ReCaptchaResponseStatusEnum Status { get; set; }
    public string Message { get; set; }
    public bool Success => Status == ReCaptchaResponseStatusEnum.Success;
}

public enum ReCaptchaResponseStatusEnum
{
    Failed,
    Success,
    Skipped
}
```

### 5. Servicii disponibile

#### IRecaptchaService (Client-side)
| Metodă | Descriere | Return |
|--------|-----------|--------|
| `Execute()` | Execută validarea și returnează token | `Task<string>` |

#### IRecaptchaValidationService (Server-side)
| Metodă | Descriere | Return |
|--------|-----------|--------|
| `Validate(string token, HttpContext context)` | Validează token-ul cu Google API | `Task<ReCaptchaResponse>` |

### 6. Integrare cu alte componente

#### În Wizard pentru formulare multi-step
```razor
<FodWizard>
    <Steps>
        <FodWizardStep Title="Date personale">
            <!-- Câmpuri formular -->
        </FodWizardStep>
        
        <FodWizardStep Title="Verificare">
            <!-- Rezumat date -->
            <FodRecaptcha />
        </FodWizardStep>
    </Steps>
</FodWizard>
```

#### În Modal pentru acțiuni critice
```razor
<FodModal Show="@showDeleteModal">
    <FodModalContent>
        <FodModalHeader>
            <FodText Typo="Typo.h6">Confirmare ștergere</FodText>
        </FodModalHeader>
        <FodModalBody>
            <FodText>Sunteți sigur că doriți să ștergeți acest element?</FodText>
            <FodRecaptcha />
        </FodModalBody>
        <FodModalFooter>
            <FodButton OnClick="DeleteWithRecaptcha" Color="FodColor.Error">
                Șterge
            </FodButton>
            <FodButton OnClick="@(() => showDeleteModal = false)">
                Anulează
            </FodButton>
        </FodModalFooter>
    </FodModalContent>
</FodModal>
```

### 7. Gestionarea erorilor

```razor
@code {
    private async Task<bool> ValidateWithRecaptcha()
    {
        try
        {
            var token = await RecaptchaService.Execute();
            
            if (string.IsNullOrEmpty(token))
            {
                // Token gol - posibil utilizator blocat
                await ShowError("Verificarea de securitate a eșuat. " +
                    "Vă rugăm reîncărcați pagina.");
                return false;
            }
            
            return true;
        }
        catch (JSException jsEx)
        {
            // Eroare JavaScript - script ne-încărcat
            await ShowError("Scriptul de securitate nu s-a încărcat. " +
                "Verificați conexiunea.");
            return false;
        }
        catch (TaskCanceledException)
        {
            // Timeout
            await ShowError("Verificarea a expirat. Încercați din nou.");
            return false;
        }
        catch (Exception ex)
        {
            // Altă eroare
            await ShowError("Eroare neașteptată la verificare.");
            return false;
        }
    }
}
```

### 8. Configurare avansată

#### Configurare cu environment variables
```csharp
// Program.cs
builder.Services.Configure<ReCaptchaOptions>(options =>
{
    options.SiteKey = builder.Configuration["RECAPTCHA_SITE_KEY"] 
        ?? builder.Configuration["ReCaptcha:SiteKey"];
    options.SecretKey = builder.Configuration["RECAPTCHA_SECRET_KEY"] 
        ?? builder.Configuration["ReCaptcha:SecretKey"];
    options.Version = Enum.Parse<ReCaptchaVersion>(
        builder.Configuration["ReCaptcha:Version"] ?? "V3");
});
```

#### Middleware pentru validare automată
```csharp
public class RecaptchaMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IRecaptchaValidationService _recaptchaService;
    
    public RecaptchaMiddleware(
        RequestDelegate next, 
        IRecaptchaValidationService recaptchaService)
    {
        _next = next;
        _recaptchaService = recaptchaService;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        // Verifică doar pentru anumite endpoint-uri
        if (ShouldValidateRecaptcha(context))
        {
            var token = context.Request.Headers["X-Recaptcha-Token"]
                .FirstOrDefault();
                
            if (string.IsNullOrEmpty(token))
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("reCAPTCHA token required");
                return;
            }
            
            var result = await _recaptchaService.Validate(token, context);
            if (!result.Success)
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("reCAPTCHA validation failed");
                return;
            }
        }
        
        await _next(context);
    }
    
    private bool ShouldValidateRecaptcha(HttpContext context)
    {
        // Logica pentru determinarea endpoint-urilor protejate
        return context.Request.Path.StartsWithSegments("/api/public");
    }
}
```

### 9. Testare

#### Mock pentru development
```csharp
public class MockRecaptchaService : IRecaptchaService
{
    public Task<string> Execute()
    {
        // În development, returnează întotdeauna un token valid
        return Task.FromResult("mock-recaptcha-token");
    }
}

// În Program.cs pentru development
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddScoped<IRecaptchaService, MockRecaptchaService>();
}
```

### 10. Monitorizare și analiză

```csharp
// Server-side logging
public class RecaptchaValidationService : IRecaptchaValidationService
{
    private readonly ILogger<RecaptchaValidationService> _logger;
    
    public async Task<ReCaptchaResponse> Validate(string token, HttpContext context)
    {
        // ... cod validare ...
        
        if (!googleResponse.Success)
        {
            _logger.LogWarning("reCAPTCHA validation failed for IP: {IP}, " +
                "Errors: {Errors}", 
                context.Connection.RemoteIpAddress,
                string.Join(", ", googleResponse.ErrorCodes));
        }
        
        // Metrici pentru monitorizare
        RecaptchaMetrics.RecordValidation(googleResponse.Success);
        
        return response;
    }
}
```

### 11. Bune practici

1. **Întotdeauna validați pe server** - Nu vă bazați doar pe validarea client
2. **Gestionați erori** - Oferiți feedback clar utilizatorilor
3. **Timeout-uri** - Setați timeout pentru cererile API
4. **Rate limiting** - Combinați cu rate limiting pentru protecție extra
5. **Monitorizare** - Urmăriți rata de succes/eșec
6. **Fallback** - Aveți o strategie pentru când serviciul nu e disponibil

### 12. Troubleshooting

#### reCAPTCHA nu se încarcă
- Verificați că site key este corect
- Verificați că domeniul este înregistrat în Google Console
- Verificați blocarea scripturilor în browser

#### Token invalid pe server
- Verificați că secret key este corect
- Verificați că token-ul nu a expirat (2 minute)
- Verificați că IP-ul match-uiește

#### Utilizatori blocați incorect
- Ajustați pragul de scor în Google Console
- Implementați logică de retry
- Oferiți metodă alternativă de verificare

### 13. Limitări

- Token-urile expiră după 2 minute
- Necesită conexiune internet
- Poate bloca utilizatori legitimi (false pozitive)
- Nu funcționează în browsere foarte vechi
- Limită de cereri per cheie

### 14. Concluzie
`FodRecaptcha` oferă o integrare simplă și eficientă a Google reCAPTCHA în aplicații Blazor. Cu suport pentru validare pe client și server, configurare flexibilă și gestionare automată a scripturilor, componenta asigură protecție robustă împotriva spam-ului și automatizărilor abuzive.