# CaptchaCallbackService

## Documentație pentru serviciul CaptchaCallbackService

### 1. Descriere Generală

`CaptchaCallbackService` este un serviciu care gestionează callback-urile pentru componentele reCAPTCHA, permițând altor componente să se aboneze la evenimentele de succes sau expirare ale validării captcha. Deși înregistrat în DI, implementarea actuală folosește `RecaptchaService` pentru validare directă.

Caracteristici principale:
- Gestionare evenimente captcha succes/expirare
- Pattern Observer pentru notificări globale
- Integrare cu Google reCAPTCHA v2
- Suport pentru multiple componente captcha
- Decuplare între componente și logica captcha

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs

// Înregistrare automată prin AddFodComponents
builder.Services.AddFodComponents(configuration);

// Sau înregistrare manuală
builder.Services.AddScoped<ICaptchaCallBackService, CaptchaCallbackService>();
```

### 3. Interfața ICaptchaCallBackService

```csharp
namespace FOD.Components.Services
{
    public interface ICaptchaCallBackService
    {
        EventHandler<CaptchaSuccessEventArgs> SuccessCallBack { get; set; }
        EventHandler<CaptchaTimeOutEventArgs> TimeOutCallBack { get; set; }
    }
}
```

### 4. Evenimente și Modele

#### CaptchaSuccessEventArgs
```csharp
public class CaptchaSuccessEventArgs : EventArgs
{
    public string Response { get; set; }
    
    public CaptchaSuccessEventArgs(string response)
    {
        Response = response;
    }
}
```

#### CaptchaTimeOutEventArgs
```csharp
public class CaptchaTimeOutEventArgs : EventArgs
{
    public DateTime ExpiredAt { get; set; }
    
    public CaptchaTimeOutEventArgs()
    {
        ExpiredAt = DateTime.Now;
    }
}
```

### 5. Exemple de Utilizare

#### Utilizare basic cu callback
```razor
@page "/formular-cu-captcha"
@inject ICaptchaCallBackService CaptchaCallbackService
@inject IFodNotificationService NotificationService
@implements IDisposable

<FodContainer>
    <FodCard>
        <FodCardContent>
            <FodText Typo="Typo.h6" GutterBottom="true">
                Formular cu Protecție Captcha
            </FodText>
            
            <form @onsubmit="HandleSubmit" @onsubmit:preventDefault="true">
                <!-- Câmpuri formular -->
                <FodGrid Container="true" Spacing="3">
                    <FodGrid Item="true" xs="12">
                        <FodInput @bind-Value="model.Name" 
                                  Label="Nume complet"
                                  Required="true" />
                    </FodGrid>
                    <FodGrid Item="true" xs="12">
                        <FodInput @bind-Value="model.Email" 
                                  Label="Email"
                                  Type="email"
                                  Required="true" />
                    </FodGrid>
                    <FodGrid Item="true" xs="12">
                        <FodTextArea @bind-Value="model.Message" 
                                     Label="Mesaj"
                                     Rows="4"
                                     Required="true" />
                    </FodGrid>
                </FodGrid>
                
                <!-- Componenta reCAPTCHA -->
                <div class="mt-3">
                    <FodRecaptcha @ref="recaptcha" />
                </div>
                
                <!-- Buton submit -->
                <FodButton Type="submit" 
                           Color="FodColor.Primary"
                           Class="mt-3"
                           Disabled="@(!isCaptchaValid || isSubmitting)">
                    @if (isSubmitting)
                    {
                        <FodLoadingButton />
                    }
                    else
                    {
                        <text>Trimite</text>
                    }
                </FodButton>
            </form>
            
            @if (!string.IsNullOrEmpty(captchaToken))
            {
                <FodAlert Severity="FodSeverity.Success" Class="mt-3">
                    Captcha validat cu succes!
                </FodAlert>
            }
        </FodCardContent>
    </FodCard>
</FodContainer>

@code {
    private ContactFormModel model = new();
    private FodRecaptcha recaptcha;
    private string captchaToken;
    private bool isCaptchaValid;
    private bool isSubmitting;
    
    protected override void OnInitialized()
    {
        // Abonare la evenimente captcha
        CaptchaCallbackService.SuccessCallBack += OnCaptchaSuccess;
        CaptchaCallbackService.TimeOutCallBack += OnCaptchaTimeout;
    }
    
    private void OnCaptchaSuccess(object sender, CaptchaSuccessEventArgs e)
    {
        captchaToken = e.Response;
        isCaptchaValid = true;
        NotificationService.Success("Captcha validat cu succes!");
        StateHasChanged();
    }
    
    private void OnCaptchaTimeout(object sender, CaptchaTimeOutEventArgs e)
    {
        captchaToken = null;
        isCaptchaValid = false;
        NotificationService.Warning("Captcha a expirat. Vă rugăm să reîncercați.");
        StateHasChanged();
    }
    
    private async Task HandleSubmit()
    {
        if (!isCaptchaValid || string.IsNullOrEmpty(captchaToken))
        {
            NotificationService.Error("Vă rugăm completați captcha!");
            return;
        }
        
        isSubmitting = true;
        
        try
        {
            // Trimite formularul cu token captcha
            await ContactService.SendMessage(model, captchaToken);
            NotificationService.Success("Mesaj trimis cu succes!");
            
            // Reset formular
            model = new();
            captchaToken = null;
            isCaptchaValid = false;
            await recaptcha.ResetAsync();
        }
        catch (Exception ex)
        {
            NotificationService.Error($"Eroare: {ex.Message}");
        }
        finally
        {
            isSubmitting = false;
        }
    }
    
    public void Dispose()
    {
        // Dezabonare de la evenimente
        CaptchaCallbackService.SuccessCallBack -= OnCaptchaSuccess;
        CaptchaCallbackService.TimeOutCallBack -= OnCaptchaTimeout;
    }
}
```

#### Manager global pentru captcha
```csharp
public class CaptchaManager
{
    private readonly ICaptchaCallBackService _captchaCallbackService;
    private readonly ILogger<CaptchaManager> _logger;
    private readonly List<CaptchaSubscriber> _subscribers = new();
    private string _currentToken;
    private DateTime? _tokenExpiry;
    
    public CaptchaManager(ICaptchaCallBackService captchaCallbackService, 
                         ILogger<CaptchaManager> logger)
    {
        _captchaCallbackService = captchaCallbackService;
        _logger = logger;
        
        // Configurare handlers globali
        _captchaCallbackService.SuccessCallBack += OnGlobalCaptchaSuccess;
        _captchaCallbackService.TimeOutCallBack += OnGlobalCaptchaTimeout;
    }
    
    public string CurrentToken => _currentToken;
    public bool IsTokenValid => !string.IsNullOrEmpty(_currentToken) && 
                                _tokenExpiry > DateTime.Now;
    
    public void Subscribe(string componentId, Action<string> onSuccess, 
                         Action onTimeout = null)
    {
        _subscribers.Add(new CaptchaSubscriber
        {
            ComponentId = componentId,
            OnSuccess = onSuccess,
            OnTimeout = onTimeout
        });
    }
    
    public void Unsubscribe(string componentId)
    {
        _subscribers.RemoveAll(s => s.ComponentId == componentId);
    }
    
    private void OnGlobalCaptchaSuccess(object sender, CaptchaSuccessEventArgs e)
    {
        _currentToken = e.Response;
        _tokenExpiry = DateTime.Now.AddMinutes(2); // reCAPTCHA token valid 2 minute
        
        _logger.LogInformation("Captcha token received and cached");
        
        // Notifică toți subscriberii
        foreach (var subscriber in _subscribers)
        {
            try
            {
                subscriber.OnSuccess?.Invoke(e.Response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying subscriber {ComponentId}", 
                    subscriber.ComponentId);
            }
        }
    }
    
    private void OnGlobalCaptchaTimeout(object sender, CaptchaTimeOutEventArgs e)
    {
        _currentToken = null;
        _tokenExpiry = null;
        
        _logger.LogWarning("Captcha token expired at {ExpiredAt}", e.ExpiredAt);
        
        // Notifică toți subscriberii
        foreach (var subscriber in _subscribers)
        {
            try
            {
                subscriber.OnTimeout?.Invoke();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying subscriber {ComponentId} of timeout", 
                    subscriber.ComponentId);
            }
        }
    }
    
    private class CaptchaSubscriber
    {
        public string ComponentId { get; set; }
        public Action<string> OnSuccess { get; set; }
        public Action OnTimeout { get; set; }
    }
}
```

#### Implementare alternativă cu RecaptchaService
```razor
@* Implementarea actuală folosește RecaptchaService direct *@
@inject IRecaptchaService RecaptchaService

<FodCard>
    <FodCardContent>
        <FodRecaptcha @ref="recaptcha" />
        
        <FodButton OnClick="ValidateCaptcha" 
                   Color="FodColor.Primary"
                   Class="mt-3">
            Validează
        </FodButton>
        
        @if (!string.IsNullOrEmpty(token))
        {
            <FodAlert Severity="FodSeverity.Success" Class="mt-3">
                Token obținut: @token.Substring(0, 20)...
            </FodAlert>
        }
    </FodCardContent>
</FodCard>

@code {
    private FodRecaptcha recaptcha;
    private string token;
    
    private async Task ValidateCaptcha()
    {
        try
        {
            // Metodă directă fără callback
            token = await RecaptchaService.Execute();
            
            if (!string.IsNullOrEmpty(token))
            {
                NotificationService.Success("Captcha validat!");
                // Procesare token
            }
        }
        catch (Exception ex)
        {
            NotificationService.Error($"Eroare captcha: {ex.Message}");
        }
    }
}
```

### 6. Integrare cu componente multiple

```razor
@* Pagină cu multiple formulare protejate *@
@inject ICaptchaCallBackService CaptchaCallbackService
@inject CaptchaManager CaptchaManager

<FodContainer>
    <FodGrid Container="true" Spacing="3">
        <!-- Formular 1 -->
        <FodGrid Item="true" xs="12" md="6">
            <ContactForm Id="contact-form" />
        </FodGrid>
        
        <!-- Formular 2 -->
        <FodGrid Item="true" xs="12" md="6">
            <FeedbackForm Id="feedback-form" />
        </FodGrid>
    </FodGrid>
    
    <!-- Captcha centralizat -->
    <FodCard Class="mt-4">
        <FodCardContent>
            <FodText Typo="Typo.h6" GutterBottom="true">
                Verificare Securitate
            </FodText>
            <FodText Typo="Typo.body2" GutterBottom="true">
                Completați captcha pentru a activa formularele
            </FodText>
            <FodRecaptcha />
            
            @if (CaptchaManager.IsTokenValid)
            {
                <FodChip Color="FodColor.Success" 
                         Icon="@FodIcons.Material.Filled.CheckCircle"
                         Class="mt-2">
                    Verificare completă - formularele sunt active
                </FodChip>
            }
        </FodCardContent>
    </FodCard>
</FodContainer>
```

### 7. Wrapper pentru captcha invisible

```csharp
public class InvisibleCaptchaService
{
    private readonly ICaptchaCallBackService _callbackService;
    private readonly IJSRuntime _jsRuntime;
    private TaskCompletionSource<string> _pendingValidation;
    
    public InvisibleCaptchaService(ICaptchaCallBackService callbackService, 
                                  IJSRuntime jsRuntime)
    {
        _callbackService = callbackService;
        _jsRuntime = jsRuntime;
        
        _callbackService.SuccessCallBack += OnCaptchaSuccess;
        _callbackService.TimeOutCallBack += OnCaptchaTimeout;
    }
    
    public async Task<string> ExecuteAsync(string action = "submit")
    {
        _pendingValidation = new TaskCompletionSource<string>();
        
        // Declanșează captcha invisible
        await _jsRuntime.InvokeVoidAsync("executeInvisibleCaptcha", action);
        
        // Așteaptă callback cu timeout
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
        cts.Token.Register(() => _pendingValidation.TrySetCanceled());
        
        return await _pendingValidation.Task;
    }
    
    private void OnCaptchaSuccess(object sender, CaptchaSuccessEventArgs e)
    {
        _pendingValidation?.TrySetResult(e.Response);
    }
    
    private void OnCaptchaTimeout(object sender, CaptchaTimeOutEventArgs e)
    {
        _pendingValidation?.TrySetException(
            new TimeoutException("Captcha validation timed out"));
    }
}
```

### 8. Monitorizare și metrici

```csharp
public class MonitoredCaptchaCallbackService : ICaptchaCallBackService
{
    private readonly CaptchaCallbackService _innerService;
    private readonly IMetricsCollector _metrics;
    private readonly ILogger<MonitoredCaptchaCallbackService> _logger;
    
    public EventHandler<CaptchaSuccessEventArgs> SuccessCallBack
    {
        get => _innerService.SuccessCallBack;
        set
        {
            _innerService.SuccessCallBack = value;
            _innerService.SuccessCallBack += OnSuccessCallback;
        }
    }
    
    public EventHandler<CaptchaTimeOutEventArgs> TimeOutCallBack
    {
        get => _innerService.TimeOutCallBack;
        set
        {
            _innerService.TimeOutCallBack = value;
            _innerService.TimeOutCallBack += OnTimeoutCallback;
        }
    }
    
    private void OnSuccessCallback(object sender, CaptchaSuccessEventArgs e)
    {
        _metrics.RecordCounter("captcha_success_total", 1);
        _logger.LogInformation("Captcha validation successful");
    }
    
    private void OnTimeoutCallback(object sender, CaptchaTimeOutEventArgs e)
    {
        _metrics.RecordCounter("captcha_timeout_total", 1);
        _logger.LogWarning("Captcha timeout at {ExpiredAt}", e.ExpiredAt);
    }
}
```

### 9. Testare

```csharp
[TestClass]
public class CaptchaCallbackServiceTests
{
    private ICaptchaCallBackService _service;
    private bool _successCallbackInvoked;
    private bool _timeoutCallbackInvoked;
    private string _receivedToken;
    
    [TestInitialize]
    public void Setup()
    {
        _service = new CaptchaCallbackService();
        _successCallbackInvoked = false;
        _timeoutCallbackInvoked = false;
        _receivedToken = null;
        
        _service.SuccessCallBack += (sender, e) =>
        {
            _successCallbackInvoked = true;
            _receivedToken = e.Response;
        };
        
        _service.TimeOutCallBack += (sender, e) =>
        {
            _timeoutCallbackInvoked = true;
        };
    }
    
    [TestMethod]
    public void SuccessCallback_WhenInvoked_NotifiesSubscribers()
    {
        // Arrange
        var token = "test-captcha-token";
        var args = new CaptchaSuccessEventArgs(token);
        
        // Act
        _service.SuccessCallBack?.Invoke(this, args);
        
        // Assert
        Assert.IsTrue(_successCallbackInvoked);
        Assert.AreEqual(token, _receivedToken);
    }
    
    [TestMethod]
    public void TimeoutCallback_WhenInvoked_NotifiesSubscribers()
    {
        // Arrange
        var args = new CaptchaTimeOutEventArgs();
        
        // Act
        _service.TimeOutCallBack?.Invoke(this, args);
        
        // Assert
        Assert.IsTrue(_timeoutCallbackInvoked);
        Assert.IsFalse(_successCallbackInvoked);
    }
}
```

### 10. JavaScript Integration

```javascript
// ReCaptcha.js - Integrare cu callback service
window.fodCaptcha = {
    dotNetRef: null,
    
    init: function(dotNetReference) {
        this.dotNetRef = dotNetReference;
    },
    
    onSuccess: function(token) {
        if (this.dotNetRef) {
            this.dotNetRef.invokeMethodAsync('CallbackOnSuccess', token)
                .catch(err => console.error('Error invoking success callback:', err));
        }
    },
    
    onExpired: function() {
        if (this.dotNetRef) {
            this.dotNetRef.invokeMethodAsync('CallbackOnExpired')
                .catch(err => console.error('Error invoking timeout callback:', err));
        }
    },
    
    executeInvisible: function(action) {
        grecaptcha.execute(window.fodRecaptchaSiteKey, { action: action });
    }
};
```

### 11. Best Practices

1. **Dezabonare obligatorie** - Întotdeauna dezabonați-vă în Dispose()
2. **Validare token** - Verificați întotdeauna validitatea token-ului
3. **Timeout handling** - Gestionați expirarea token-ului (2 minute)
4. **Error handling** - Tratați erorile de callback
5. **Centralizare** - Folosiți un manager pentru multiple componente
6. **Logging** - Înregistrați toate evenimentele captcha
7. **Fallback** - Aveți strategie alternativă la eșec

### 12. Concluzie

`CaptchaCallbackService` oferă un mecanism flexibil pentru gestionarea evenimentelor reCAPTCHA în aplicațiile Blazor. Deși implementarea curentă folosește `RecaptchaService` pentru validare directă, serviciul de callback permite scenarii mai complexe cu notificări globale și gestionare centralizată a validării captcha pentru multiple componente.