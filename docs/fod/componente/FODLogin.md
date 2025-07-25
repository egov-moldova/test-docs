# FODLogin

## Documentație pentru componenta FODLogin

### 1. Descriere Generală

`FODLogin` este o componentă de bază pentru autentificare care oferă un formular simplu de login cu câmpuri pentru email și parolă. Componenta folosește stiluri Bootstrap și oferă o interfață standard pentru autentificare.

**Notă**: Aceasta pare a fi o componentă de bază/demo. Pentru producție, se recomandă integrarea cu servicii de autentificare precum MPass.

Caracteristici principale:
- Formular de login cu email și parolă
- Checkbox "Remember password"
- Design card cu umbră
- Autocompletare dezactivată pentru securitate
- Stilizare Bootstrap
- Text helper pentru câmpuri

### 2. Utilizare de Bază

#### Login simplu
```razor
<FODLogin />
```

#### Integrare în pagină de autentificare
```razor
@page "/login"
@layout EmptyLayout

<div class="login-container d-flex align-items-center justify-content-center min-vh-100">
    <div class="login-wrapper" style="max-width: 400px; width: 100%;">
        <FodText Typo="Typo.h4" Align="FodAlign.Center" GutterBottom="true">
            Autentificare
        </FodText>
        
        <FODLogin />
        
        <div class="mt-3 text-center">
            <FodLink Href="/forgot-password">Ați uitat parola?</FodLink>
        </div>
    </div>
</div>
```

### 3. Limitări Actuale

Componenta actuală este o implementare de bază fără:
- Event handlers pentru submit
- Binding pentru câmpuri
- Validare
- Integrare cu servicii de autentificare

### 4. Exemple de Extindere

#### Componentă login funcțională
```razor
@inherits FODLogin

<div class="card shadow">
    <div class="card-body">
        <EditForm Model="@loginModel" OnValidSubmit="HandleLogin">
            <DataAnnotationsValidator />
            
            <div class="form-group">
                <label>Email</label>
                <InputText @bind-Value="loginModel.Email" 
                           class="form-control" 
                           placeholder="Introduceți email-ul" />
                <ValidationMessage For="@(() => loginModel.Email)" />
            </div>
            
            <div class="form-group">
                <label>Parolă</label>
                <InputText @bind-Value="loginModel.Password" 
                           type="password"
                           class="form-control" 
                           placeholder="Introduceți parola" />
                <ValidationMessage For="@(() => loginModel.Password)" />
            </div>
            
            <div class="form-group">
                <InputCheckbox @bind-Value="loginModel.RememberMe" 
                               class="form-check-input" 
                               id="rememberMe" />
                <label class="form-check-label" for="rememberMe">
                    Păstrează-mă autentificat
                </label>
            </div>
            
            <button type="submit" class="btn btn-primary ml-auto" 
                    disabled="@isLoading">
                @if (isLoading)
                {
                    <span class="spinner-border spinner-border-sm mr-2"></span>
                }
                Autentificare
            </button>
            
            @if (!string.IsNullOrEmpty(errorMessage))
            {
                <FodAlert Severity="FodSeverity.Error" Class="mt-3">
                    @errorMessage
                </FodAlert>
            }
        </EditForm>
    </div>
</div>

@code {
    private LoginModel loginModel = new();
    private bool isLoading;
    private string errorMessage;
    
    [Inject] private IAuthenticationService AuthService { get; set; }
    [Inject] private NavigationManager Navigation { get; set; }
    
    private async Task HandleLogin()
    {
        isLoading = true;
        errorMessage = null;
        
        try
        {
            var result = await AuthService.Login(loginModel);
            if (result.Success)
            {
                Navigation.NavigateTo("/", true);
            }
            else
            {
                errorMessage = result.ErrorMessage;
            }
        }
        catch (Exception ex)
        {
            errorMessage = "Eroare la autentificare. Vă rugăm încercați din nou.";
        }
        finally
        {
            isLoading = false;
        }
    }
    
    public class LoginModel
    {
        [Required(ErrorMessage = "Email-ul este obligatoriu")]
        [EmailAddress(ErrorMessage = "Format email invalid")]
        public string Email { get; set; }
        
        [Required(ErrorMessage = "Parola este obligatorie")]
        [MinLength(6, ErrorMessage = "Parola trebuie să aibă minim 6 caractere")]
        public string Password { get; set; }
        
        public bool RememberMe { get; set; }
    }
}
```

#### Login cu MPass
```razor
@page "/login"
@inject NavigationManager Navigation

<div class="login-options">
    <FodCard>
        <FodCardContent>
            <FodText Typo="Typo.h5" GutterBottom="true">
                Alegeți metoda de autentificare
            </FodText>
            
            <div class="d-grid gap-2">
                <FodButton Color="FodColor.Primary" 
                           Size="FodSize.Large"
                           StartIcon="@FodIcons.Material.Filled.Key"
                           OnClick="LoginWithMPass">
                    Autentificare cu MPass
                </FodButton>
                
                <FodButton Color="FodColor.Secondary" 
                           Variant="FodVariant.Outlined"
                           Size="FodSize.Large"
                           OnClick="ShowClassicLogin">
                    Autentificare clasică
                </FodButton>
            </div>
        </FodCardContent>
    </FodCard>
    
    @if (showClassicLogin)
    {
        <div class="mt-3">
            <FODLogin />
        </div>
    }
</div>

@code {
    private bool showClassicLogin;
    
    private void LoginWithMPass()
    {
        Navigation.NavigateTo("/auth/mpass", true);
    }
    
    private void ShowClassicLogin()
    {
        showClassicLogin = true;
    }
}
```

### 5. Stilizare Modernă

```razor
<style>
    /* Modern login styling */
    .modern-login .card {
        border: none;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .modern-login .card-body {
        padding: 2rem;
    }
    
    .modern-login .form-group {
        margin-bottom: 1.5rem;
    }
    
    .modern-login label {
        font-weight: 600;
        color: var(--fod-palette-text-secondary);
        margin-bottom: 0.5rem;
    }
    
    .modern-login .form-control {
        border-radius: 8px;
        padding: 0.75rem 1rem;
        border: 2px solid var(--fod-palette-divider);
        transition: border-color 0.3s;
    }
    
    .modern-login .form-control:focus {
        border-color: var(--fod-palette-primary-main);
        box-shadow: 0 0 0 0.2rem rgba(var(--fod-palette-primary-rgb), 0.25);
    }
    
    .modern-login .btn-primary {
        width: 100%;
        padding: 0.75rem;
        font-weight: 600;
        border-radius: 8px;
        background: var(--fod-palette-primary-main);
        border: none;
        transition: all 0.3s;
    }
    
    .modern-login .btn-primary:hover {
        background: var(--fod-palette-primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
</style>

<div class="modern-login">
    <FODLogin />
</div>
```

### 6. Integrare cu Servicii

#### Login cu rate limiting
```razor
<ExtendedLogin MaxAttempts="3" 
               LockoutDuration="300"
               OnLoginSuccess="HandleLoginSuccess"
               OnLoginFailed="HandleLoginFailed" />

@code {
    private void HandleLoginSuccess(LoginResult result)
    {
        Navigation.NavigateTo(result.RedirectUrl ?? "/dashboard");
    }
    
    private void HandleLoginFailed(LoginError error)
    {
        if (error.IsLockedOut)
        {
            ShowNotification($"Cont blocat pentru {error.RemainingLockoutTime} secunde");
        }
        else
        {
            ShowNotification($"Autentificare eșuată. Mai aveți {error.RemainingAttempts} încercări.");
        }
    }
}
```

### 7. Scenarii de Utilizare

#### Login cu 2FA
```razor
<TwoFactorLogin>
    <FirstStep>
        <FODLogin />
    </FirstStep>
    <SecondStep>
        <div class="card shadow">
            <div class="card-body">
                <h5>Verificare în doi pași</h5>
                <p>Introduceți codul primit pe telefon</p>
                <FodInput @bind-Value="twoFactorCode" 
                          Mask="000-000"
                          Placeholder="XXX-XXX" />
                <FodButton Color="FodColor.Primary">
                    Verifică
                </FodButton>
            </div>
        </div>
    </SecondStep>
</TwoFactorLogin>
```

### 8. Best Practices

1. **Securitate**:
   - Folosiți HTTPS întotdeauna
   - Implementați rate limiting
   - Nu stocați parole în plain text
   - Folosiți token-uri sicure

2. **UX**:
   - Afișați feedback pentru erori
   - Indicați starea de încărcare
   - Oferiți opțiuni de recuperare parolă
   - Validare în timp real

3. **Accesibilitate**:
   - Labels pentru toate câmpurile
   - Mesaje de eroare descriptive
   - Suport pentru navigare cu tastatura
   - ARIA attributes

### 9. Migrare către Soluții Moderne

Pentru producție, considerați:
1. **MPass Integration** - Pentru cetățeni
2. **Azure AD B2C** - Pentru aplicații enterprise
3. **IdentityServer** - Pentru SSO
4. **JWT Authentication** - Pentru API-uri

### 10. Troubleshooting

#### Formularul nu trimite date
- Componenta actuală nu are binding
- Implementați o versiune extinsă cu EditForm

#### Stiluri Bootstrap lipsesc
- Asigurați-vă că Bootstrap este inclus
- Verificați ordinea CSS imports

### 11. Alternative Recomandate

Pentru producție, folosiți:
```razor
<!-- MPass Login -->
<FodMPassLogin ClientId="@clientId" 
               RedirectUri="@redirectUri"
               Scope="@scope" />

<!-- Sau componentă custom completă -->
<FodAuthenticationForm Provider="MPass|Classic|AzureAD"
                       ShowRememberMe="true"
                       ShowForgotPassword="true"
                       ShowRegisterLink="true" />
```

### 12. Concluzie

`FODLogin` oferă o structură de bază pentru formulare de autentificare, dar necesită extindere pentru utilizare în producție. Pentru aplicații reale, integrați cu servicii de autentificare robuste și adăugați funcționalități precum validare, error handling și securitate avansată.