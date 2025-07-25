# Configurare MPass

## Prezentare Generală

Această pagină detaliază procesul complet de configurare a integrării MPass în aplicațiile FOD, incluzând înregistrarea aplicației, configurarea parametrilor și setările de securitate.

## Înregistrare Aplicație

### 1. Obținere Credențiale

Pentru a integra MPass, trebuie să obțineți credențialele de la administratorul MPass:

1. Accesați portalul de administrare MPass
2. Creați o aplicație nouă
3. Obțineți:
   - Client ID
   - Client Secret
   - Redirect URIs permise

### 2. Configurare Redirect URIs

```
https://yourdomain.com/signin-mpass
https://yourdomain.com/signout-callback-mpass
https://localhost:5000/signin-mpass (pentru development)
```

## Configurare Aplicație

### 1. AppSettings.json

```json
{
  "MPass": {
    "Authority": "https://mpass.gov.md",
    "ClientId": "your-client-id",
    "ClientSecret": "your-client-secret",
    "ResponseType": "code",
    "SaveTokens": true,
    "GetClaimsFromUserInfoEndpoint": true,
    "RequireHttpsMetadata": true,
    "CallbackPath": "/signin-mpass",
    "SignedOutCallbackPath": "/signout-callback-mpass",
    "RemoteSignOutPath": "/signout-mpass",
    "Scope": [
      "openid",
      "profile",
      "email",
      "phone",
      "idnp"
    ],
    "Events": {
      "OnRemoteFailure": {
        "RedirectPath": "/authentication/error"
      }
    }
  }
}
```

### 2. Configurare pentru Medii Multiple

```json
// appsettings.Development.json
{
  "MPass": {
    "Authority": "https://test-mpass.gov.md",
    "RequireHttpsMetadata": false,
    "ValidateIssuer": false
  }
}

// appsettings.Production.json
{
  "MPass": {
    "Authority": "https://mpass.gov.md",
    "RequireHttpsMetadata": true,
    "ValidateIssuer": true
  }
}
```

## Configurare în Program.cs

### 1. Configurare de Bază

```csharp
using Fod.Integrations.MPass;

var builder = WebApplication.CreateBuilder(args);

// Configurare autentificare
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = MPassDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
    options.SlidingExpiration = true;
})
.AddMPass(options =>
{
    builder.Configuration.GetSection("MPass").Bind(options);
});

// Adaugă serviciile MPass
builder.Services.AddMPassServices();
```

### 2. Configurare Avansată

```csharp
.AddMPass(options =>
{
    // Configurări de bază
    options.ClientId = configuration["MPass:ClientId"];
    options.ClientSecret = configuration["MPass:ClientSecret"];
    options.Authority = configuration["MPass:Authority"];
    
    // Configurări de securitate
    options.RequireHttpsMetadata = !environment.IsDevelopment();
    options.SaveTokens = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = "name",
        RoleClaimType = "role",
        ValidateIssuer = true,
        ValidIssuer = configuration["MPass:Authority"]
    };
    
    // Configurare events
    options.Events = new OpenIdConnectEvents
    {
        OnTokenValidated = async context =>
        {
            var userService = context.HttpContext.RequestServices
                .GetRequiredService<IUserService>();
            
            await userService.SyncUserFromMPassAsync(context.Principal);
        },
        
        OnRemoteFailure = context =>
        {
            context.Response.Redirect("/authentication/error");
            context.HandleResponse();
            return Task.CompletedTask;
        },
        
        OnRedirectToIdentityProvider = context =>
        {
            // Adaugă parametri custom
            context.ProtocolMessage.SetParameter("ui_locales", "ro");
            return Task.CompletedTask;
        }
    };
    
    // Claim mappings
    options.ClaimActions.MapJsonKey("idnp", "idnp");
    options.ClaimActions.MapJsonKey("phone", "phone_number");
    options.ClaimActions.MapJsonKey("organization", "organization");
});
```

## Configurare Claim Transformation

### 1. Custom Claims Transformation

```csharp
public class MPassClaimsTransformation : IClaimsTransformation
{
    private readonly IUserService _userService;
    
    public MPassClaimsTransformation(IUserService userService)
    {
        _userService = userService;
    }
    
    public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        var claimsIdentity = principal.Identity as ClaimsIdentity;
        
        if (claimsIdentity?.IsAuthenticated ?? false)
        {
            var idnp = principal.FindFirst("idnp")?.Value;
            
            if (!string.IsNullOrEmpty(idnp))
            {
                // Adaugă roluri din baza de date locală
                var user = await _userService.GetUserByIdnpAsync(idnp);
                
                foreach (var role in user.Roles)
                {
                    claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, role));
                }
                
                // Adaugă claim-uri custom
                claimsIdentity.AddClaim(new Claim("department", user.Department));
                claimsIdentity.AddClaim(new Claim("employee_id", user.EmployeeId));
            }
        }
        
        return principal;
    }
}

// Înregistrare în Program.cs
builder.Services.AddScoped<IClaimsTransformation, MPassClaimsTransformation>();
```

## Configurare CORS

Pentru aplicații SPA sau API-uri:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("MPassPolicy", policy =>
    {
        policy.WithOrigins(
                "https://mpass.gov.md",
                "https://test-mpass.gov.md"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

app.UseCors("MPassPolicy");
```

## Configurare pentru Blazor

### 1. Blazor Server

```csharp
// Program.cs
builder.Services.AddServerSideBlazor();
builder.Services.AddHttpContextAccessor();

// Adaugă AuthenticationStateProvider custom
builder.Services.AddScoped<AuthenticationStateProvider, MPassAuthenticationStateProvider>();
```

### 2. Blazor WebAssembly

```csharp
// Program.cs (Client)
builder.Services.AddOidcAuthentication(options =>
{
    builder.Configuration.Bind("MPass", options.ProviderOptions);
    options.ProviderOptions.ResponseType = "code";
});

// Program.cs (Server)
builder.Services.AddAuthentication()
    .AddIdentityServerJwt();
```

## Configurare Proxy și Firewall

### 1. Configurare pentru Proxy

```csharp
builder.Services.Configure<MPassOptions>(options =>
{
    options.BackchannelHttpHandler = new HttpClientHandler
    {
        Proxy = new WebProxy("http://proxy.company.com:8080")
        {
            Credentials = new NetworkCredential("user", "password")
        },
        UseProxy = true
    };
});
```

### 2. Liste Albe pentru Firewall

Adrese IP care trebuie permise:
- Production: `185.181.229.0/24`
- Test: `185.181.230.0/24`

Porturi necesare:
- HTTPS: 443
- HTTP: 80 (doar pentru redirect)

## Monitorizare și Logging

### 1. Configurare Logging Detaliat

```csharp
builder.Services.Configure<MPassOptions>(options =>
{
    options.Events = new OpenIdConnectEvents
    {
        OnAuthenticationFailed = context =>
        {
            var logger = context.HttpContext.RequestServices
                .GetRequiredService<ILogger<Program>>();
            
            logger.LogError(context.Exception, 
                "Authentication failed for user {User}", 
                context.Principal?.Identity?.Name);
            
            return Task.CompletedTask;
        },
        
        OnTokenResponseReceived = context =>
        {
            var logger = context.HttpContext.RequestServices
                .GetRequiredService<ILogger<Program>>();
            
            logger.LogInformation(
                "Token received for user {User}", 
                context.Principal?.FindFirst("sub")?.Value);
            
            return Task.CompletedTask;
        }
    };
});
```

### 2. Health Checks

```csharp
builder.Services.AddHealthChecks()
    .AddUrlGroup(
        new Uri($"{configuration["MPass:Authority"]}/.well-known/openid-configuration"),
        name: "mpass",
        failureStatus: HealthStatus.Degraded);
```

## Securitate Adițională

### 1. Anti-Forgery Token

```csharp
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-XSRF-TOKEN";
    options.Cookie.Name = "XSRF-TOKEN";
    options.Cookie.HttpOnly = false;
});
```

### 2. Content Security Policy

```csharp
app.Use(async (context, next) =>
{
    context.Response.Headers.Add(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "connect-src 'self' https://mpass.gov.md; " +
        "frame-src 'self' https://mpass.gov.md;");
    
    await next();
});
```

## Troubleshooting Configurare

### Probleme Comune

1. **"Invalid redirect_uri"**
   - Verificați că URI-ul este înregistrat exact în MPass
   - Verificați majuscule/minuscule și trailing slash

2. **"Unable to obtain configuration"**
   - Verificați conectivitatea la MPass
   - Verificați setările proxy/firewall
   - Validați Authority URL

3. **Certificate errors**
   ```csharp
   // Doar pentru development!
   options.BackchannelHttpHandler = new HttpClientHandler
   {
       ServerCertificateCustomValidationCallback = 
           HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
   };
   ```

## Concluzie

Configurarea corectă a MPass este esențială pentru securitatea și funcționalitatea aplicației. Urmați aceste ghiduri și adaptați configurările la nevoile specifice ale aplicației dvs.