# Configurarea Serviciului MPass pentru Integrarea cu FOD

## 1. Certificatul Serviciului

Pentru a permite integrarea serviciului FOD cu MPass, este necesar un certificat de serviciu împreună cu parola acestuia. Acest certificat este utilizat pentru autentificare și semnare digitală în procesul de login.

Obținerea certificatului poate fi realizată de către persoana responsabilă sau administratorul serviciului în MPass. După obținere, certificatul trebuie configurat corespunzător în aplicația FOD.

## 2. Atributele Necesare pentru Autentificare

La autentificare, MPass poate furniza mai multe atribute către serviciul integrat. Componentele FOD sunt configurate să proceseze următoarele atribute primite de la MPass:

- **NameIdentifier** – ID-ul utilizatorului autentificat (IDNP-ul persoanei). _Sursa: MPass_
- **FirstName** – Prenumele utilizatorului autentificat. _Sursa: MPass_
- **LastName** – Numele de familie al utilizatorului autentificat. _Sursa: MPass_
- **MobilePhone** – Numărul de telefon al utilizatorului autentificat (dacă acesta și-a completat profilul în MNotify). _Sursa: MNotify_
- **EmailAddress** – Adresa de email a utilizatorului autentificat (dacă aceasta este setată în MNotify). _Sursa: MNotify_
- **AdministeredLegalEntity** _(Opțional)_ – Lista entităților juridice administrate de utilizator. _Sursa: MPass_
- **OperatorCUPS** _(Opțional)_ – Atribut specific pentru servicii prestate de un operator CUPS.

Dacă este necesar, pot fi adăugate și alte atribute, cum ar fi sexul, data nașterii etc. Acestea trebuie configurate de către administratorul serviciului în MPass.

## 3. Configurarea Certificatului de Serviciu

### 3.1. Adăugarea configurației în `appsettings.json`

```json
"Certificate": {
    "Path": "Files/Certificates/nume-certificat-receptionat.pfx",
    "Password": "parola"
}
```

### 3.2. Injectarea certificatului în aplicație

În `Program.cs`:

```csharp
builder.Services.AddSystemCertificate(builder.Configuration.GetSection("Certificate"));
```

## 4. Configurarea Endpoint-ului pentru Datele Utilizatorului

Endpoint-ul `/me` este utilizat pentru interogarea datelor utilizatorului autentificat.

### 4.1. Modificarea Middleware-urilor și Endpoint-urilor

În `Program.cs`:

```csharp
app.UseAuthentication();
app.UseAuthorization();
app.UseRouting();
app.UseEndpoints(endpoints =>
{
    endpoints.MapMPassSaml(options =>
    {
        // options.DefaultReturnUrl = "${BaseRoute.Url}/cerere";
    });
    app.MapRazorPages();
    app.MapControllers();
    app.MapFallbackToFile("index.html");
});
```

După repornirea aplicației, o cerere către `/me` va returna HTTP 204 dacă utilizatorul nu este autentificat.

## 5. Autentificare utilizând MPass

În `Program.cs`, adăugăm:

```csharp
builder.Services.AddAuthentication(sharedOptions =>
{
    sharedOptions.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    sharedOptions.DefaultChallengeScheme = MPassSamlDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.Cookie.Name = "auth";
    //options.Cookie.Path = BaseRoute.Url;
    options.LoginPath = "/account/login";
    options.LogoutPath = "/account/logout";
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
})
.AddMPassSaml(builder.Configuration.GetSection("MPass"), options =>
{
    //options.SignedOutRedirectUri = "${BaseRoute.Url}/cerere/GHID1";
});
```

### 5.1. Configurarea în `appsettings.json`

```json
"MPass": {
   "SamlRequestIssuer": "ghid-fod.localhost.egov.md",
   "IdentityProviderCertificatePath": "Files/Certificates/mpass.staging.egov.md.cer",
   "SamlLoginDestination": "https://mpass.staging.egov.md/login/saml",
   "SamlLogoutDestination": "https://mpass.staging.egov.md/logout/saml",
   "ServiceRootUrl": "http://localhost:5113"
}
```

Prin acești pași, aplicația FOD este configurată pentru a permite autentificarea utilizatorilor prin MPass și interogarea datelor acestora.

> În acest moment, dacă aplicația va fi repornită și vom analiza cererea către endpoint-ul `/me`, vom observa că este returnat un rezultat cu codul HTTP 204, ceea ce semnifică un răspuns gol, adică nu sunt date despre utilizator, respectiv nu este autentificat.

