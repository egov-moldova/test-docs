# RecaptchaService

## Descriere Generală

`RecaptchaService` este serviciul responsabil pentru integrarea și executarea Google reCAPTCHA în aplicație. Serviciul gestionează logica de afișare a captcha-ului bazată pe starea de autentificare a utilizatorului și configurările aplicației, oferind protecție împotriva bot-urilor și spam-ului.

## Configurare

### Înregistrare în Dependency Injection

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddScoped<IRecaptchaService, RecaptchaService>();

// Asigurați-vă că dependențele sunt înregistrate
builder.Services.AddScoped<IConfigurationService, ConfigurationService>();
builder.Services.AddScoped<IUserService, UserService>();
```

### Configurare reCAPTCHA

```csharp
// În appsettings.json
{
  "ReCaptcha": {
    "SiteKey": "your-site-key-here",
    "SecretKey": "your-secret-key-here",
    "ValidateAuthenticated": false
  }
}
```

### Includere script Google reCAPTCHA

```html
<!-- În index.html sau _Host.cshtml -->
<script src="https://www.google.com/recaptcha/api.js?render=explicit" async defer></script>

<script>
    window.runCaptcha = (siteKey) => {
        return new Promise((resolve, reject) => {
            grecaptcha.ready(() => {
                grecaptcha.execute(siteKey, { action: 'submit' })
                    .then(token => resolve(token))
                    .catch(error => reject(error));
            });
        });
    };
</script>
```

## Interfața IRecaptchaService

```csharp
public interface IRecaptchaService
{
    Task<string> Execute();
}
```

## Metode disponibile

### Execute()

Execută verificarea reCAPTCHA și returnează token-ul.

**Parametri:** Niciun parametru

**Returnează:** `Task<string>` - Token-ul reCAPTCHA sau string gol dacă nu este necesar

**Comportament:**
- Obține configurarea reCAPTCHA prin IConfigurationService
- Verifică dacă utilizatorul este autentificat
- Dacă utilizatorul nu este autentificat SAU ValidateAuthenticated este true, execută captcha
- Dacă utilizatorul este autentificat și ValidateAuthenticated este false, returnează string gol
- Apelează funcția JavaScript pentru a obține token-ul

## Exemple de utilizare

### În formular de contact

```razor
@inject IRecaptchaService RecaptchaService

<EditForm Model="@contactModel" OnValidSubmit="@SubmitForm">
    <DataAnnotationsValidator />
    
    <div class="form-group">
        <label>Nume</label>
        <InputText @bind-Value="contactModel.Name" class="form-control" />
        <ValidationMessage For="@(() => contactModel.Name)" />
    </div>
    
    <div class="form-group">
        <label>Email</label>
        <InputText @bind-Value="contactModel.Email" class="form-control" />
        <ValidationMessage For="@(() => contactModel.Email)" />
    </div>
    
    <div class="form-group">
        <label>Mesaj</label>
        <InputTextArea @bind-Value="contactModel.Message" class="form-control" />
        <ValidationMessage For="@(() => contactModel.Message)" />
    </div>
    
    <FodButton Type="submit" Disabled="@isSubmitting">
        @if (isSubmitting)
        {
            <FodLoadingCircular Size="FodSize.Small" />
        }
        else
        {
            <text>Trimite</text>
        }
    </FodButton>
</EditForm>

@code {
    private ContactModel contactModel = new();
    private bool isSubmitting;

    private async Task SubmitForm()
    {
        isSubmitting = true;
        
        try
        {
            // Execută reCAPTCHA
            var captchaToken = await RecaptchaService.Execute();
            
            // Trimite formularul cu token-ul
            await SendContactForm(contactModel, captchaToken);
            
            // Success
            ShowSuccess("Mesaj trimis cu succes!");
            contactModel = new();
        }
        catch (Exception ex)
        {
            ShowError("Eroare la trimiterea mesajului");
        }
        finally
        {
            isSubmitting = false;
        }
    }
}
```

### În formular de înregistrare

```razor
@inject IRecaptchaService RecaptchaService
@inject IAuthService AuthService

<div class="registration-form">
    <h3>Înregistrare cont nou</h3>
    
    <EditForm Model="@registrationModel" OnValidSubmit="@Register">
        <DataAnnotationsValidator />
        <ValidationSummary />
        
        <FodInput @bind-Value="registrationModel.Email" 
                  Label="Email" 
                  Type="email" 
                  Required="true" />
        
        <FodInput @bind-Value="registrationModel.Password" 
                  Label="Parolă" 
                  Type="password" 
                  Required="true" />
        
        <FodInput @bind-Value="registrationModel.ConfirmPassword" 
                  Label="Confirmă parola" 
                  Type="password" 
                  Required="true" />
        
        <FodButton Type="submit" 
                   Color="FodColor.Primary" 
                   FullWidth="true"
                   Disabled="@isRegistering">
            Înregistrează-te
        </FodButton>
    </EditForm>
</div>

@code {
    private RegistrationModel registrationModel = new();
    private bool isRegistering;

    private async Task Register()
    {
        isRegistering = true;
        
        try
        {
            // Obține token reCAPTCHA
            var recaptchaToken = await RecaptchaService.Execute();
            
            if (string.IsNullOrEmpty(recaptchaToken))
            {
                // Pentru utilizatori autentificați când ValidateAuthenticated = false
                // Continuă fără verificare
            }
            
            // Înregistrare cu token
            var result = await AuthService.Register(registrationModel, recaptchaToken);
            
            if (result.Succeeded)
            {
                NavigationManager.NavigateTo("/login");
            }
        }
        catch (JSException)
        {
            ShowError("Eroare la verificarea reCAPTCHA. Reîncărcați pagina.");
        }
        finally
        {
            isRegistering = false;
        }
    }
}
```

### Cu componenta FodRecaptcha

```razor
<FodRecaptcha @ref="recaptchaComponent" />

<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <!-- Form fields -->
    
    <FodButton Type="submit">Trimite</FodButton>
</EditForm>

@code {
    private FodRecaptcha recaptchaComponent;

    private async Task HandleSubmit()
    {
        // FodRecaptcha folosește intern RecaptchaService
        var token = await recaptchaComponent.GetTokenAsync();
        
        if (!string.IsNullOrEmpty(token))
        {
            // Procesare cu token valid
        }
    }
}
```

## Integrare cu backend

### Validare token pe server

```csharp
[HttpPost]
public async Task<IActionResult> SubmitForm([FromBody] FormModel model)
{
    if (!string.IsNullOrEmpty(model.RecaptchaToken))
    {
        var isValid = await ValidateRecaptcha(model.RecaptchaToken);
        if (!isValid)
        {
            return BadRequest("Verificare reCAPTCHA eșuată");
        }
    }
    
    // Procesare formular
    return Ok();
}

private async Task<bool> ValidateRecaptcha(string token)
{
    var secretKey = Configuration["ReCaptcha:SecretKey"];
    var client = new HttpClient();
    
    var response = await client.PostAsync(
        $"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={token}",
        null);
    
    var json = await response.Content.ReadAsStringAsync();
    dynamic result = JsonSerializer.Deserialize<dynamic>(json);
    
    return result.success == true && result.score > 0.5;
}
```

## Tratare erori

### Service cu gestionare erori

```csharp
public class SafeRecaptchaService : IRecaptchaService
{
    private readonly RecaptchaService _innerService;
    private readonly ILogger<SafeRecaptchaService> _logger;

    public async Task<string> Execute()
    {
        try
        {
            return await _innerService.Execute();
        }
        catch (JSException jsEx)
        {
            _logger.LogError(jsEx, "Eroare JavaScript la executarea reCAPTCHA");
            throw new RecaptchaException("reCAPTCHA nu este disponibil", jsEx);
        }
        catch (TaskCanceledException)
        {
            _logger.LogWarning("Timeout la executarea reCAPTCHA");
            return string.Empty; // Permite continuarea fără captcha
        }
    }
}
```

### Fallback pentru erori

```razor
@code {
    private async Task<string> GetRecaptchaTokenSafe()
    {
        try
        {
            return await RecaptchaService.Execute();
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Eroare reCAPTCHA");
            
            // Afișează captcha alternativ sau permite continuarea
            var allowWithoutCaptcha = await ConfirmAsync(
                "Verificarea reCAPTCHA a eșuat. Continuați fără verificare?");
                
            return allowWithoutCaptcha ? "bypass" : throw;
        }
    }
}
```

## Note tehnice

1. **Conditional execution** - Execută doar pentru utilizatori neautentificați
2. **Configuration driven** - Comportament controlat prin configurare
3. **JS dependency** - Necesită funcția JavaScript `runCaptcha`
4. **Async operation** - Toate operațiile sunt asincrone
5. **Token expiration** - Token-urile expiră după 2 minute

## Configurări avansate

### Pentru diferite acțiuni

```javascript
window.runCaptcha = (siteKey, action = 'submit') => {
    return new Promise((resolve, reject) => {
        grecaptcha.ready(() => {
            grecaptcha.execute(siteKey, { action: action })
                .then(token => resolve(token))
                .catch(error => reject(error));
        });
    });
};
```

### Service extins

```csharp
public interface IExtendedRecaptchaService : IRecaptchaService
{
    Task<string> Execute(string action);
    Task<bool> ValidateScore(string token, double minScore = 0.5);
}
```

## Bune practici

1. **Lazy loading** - Încărcați scriptul reCAPTCHA doar când este necesar
2. **Error handling** - Gestionați cazurile când reCAPTCHA nu este disponibil
3. **Timeout handling** - Setați timeout pentru operațiuni JS
4. **Score validation** - Verificați scorul pe backend pentru reCAPTCHA v3
5. **Fallback mechanism** - Oferiți alternative când captcha eșuează
6. **Privacy compliance** - Informați utilizatorii despre folosirea reCAPTCHA

## Concluzie

RecaptchaService oferă o integrare simplă și flexibilă cu Google reCAPTCHA, protejând aplicația împotriva spam-ului și automatizărilor malițioase. Cu suport pentru excluderea utilizatorilor autentificați și configurare flexibilă, serviciul se adaptează ușor la diverse scenarii de utilizare.