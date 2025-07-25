# Header

## Documentație pentru componenta FodHeader

### 1. Descriere Generală
`FodHeader` este o componentă de navigație responsivă pentru aplicații guvernamentale, care oferă un header consistent cu suport integrat pentru autentificare, selecție de limbă, meniu mobil responsive și branding organizațional.

Componenta suportă:
- Afișarea numelui și logo-ului organizației
- Autentificare cu afișarea informațiilor utilizatorului
- Selector de limbă pentru aplicații multilingve
- Meniu de navigație responsive cu hamburger menu pentru mobile
- Navigație secundară prin conținut copil
- Layout fluid sau cu container

### 2. Ghid de Utilizare API

#### Header de bază
```razor
<FodHeader OrganizationName="Agenția de Guvernare Electronică" />
```

#### Header cu autentificare
```razor
<FodHeader 
    OrganizationName="Agenția de Guvernare Electronică" 
    ShowAuthentication="true"
    ShowContextSelect="true"
    LoginReturnPath="/login" />
```

#### Header cu selector de limbă
```razor
<FodHeader 
    OrganizationName="Agenția de Guvernare Electronică" 
    ShowLanguages="true" />
```

#### Header cu meniu de navigație secundar
```razor
<FodHeader 
    OrganizationName="Agenția de Guvernare Electronică" 
    ShowLanguages="true"
    ShowAuthentication="true">
    <li class="nav-item">
        <FodLink Href="/servicii" Class="nav-link">Servicii</FodLink>
    </li>
    <li class="nav-item">
        <FodLink Href="/documente" Class="nav-link">Documente</FodLink>
    </li>
    <li class="nav-item">
        <FodLink Href="/ajutor" Class="nav-link">Ajutor</FodLink>
    </li>
    <li class="nav-item">
        <FodLink Href="/contact" Class="nav-link">Contact</FodLink>
    </li>
</FodHeader>
```

#### Header fluid (full width)
```razor
<FodHeader 
    OrganizationName="Agenția de Guvernare Electronică" 
    ShowLanguages="true"
    ShowAuthentication="true"
    IsContainered="false"
    Style="background-color: #1976d2;" />
```

#### Header cu logo personalizat
```razor
<FodHeader 
    OrganizationName="Organizația Mea"
    OrganizationLogo="/images/logo-organizatie.png"
    Logo="/images/logo-aplicatie.png"
    Title="Titlul Aplicației"
    ShowAuthentication="true"
    ShowLanguages="true" />
```

#### Header complet personalizat
```razor
<FodHeader 
    OrganizationName="Guvernul Republicii Moldova"
    ShowAuthentication="true"
    ShowContextSelect="true"
    ShowLanguages="true"
    LoginReturnPath="/auth/login"
    LogoutReturnUrl="/auth/logout"
    IsContainered="true">
    <!-- Meniu secundar -->
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
            Servicii
        </a>
        <div class="dropdown-menu">
            <FodLink Href="/servicii/apostila" Class="dropdown-item">Apostilă</FodLink>
            <FodLink Href="/servicii/traduceri" Class="dropdown-item">Traduceri</FodLink>
            <FodLink Href="/servicii/verificare" Class="dropdown-item">Verificare</FodLink>
        </div>
    </li>
</FodHeader>
```

### Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `OrganizationName` | `string` | Numele organizației afișat în header | `null` |
| `OrganizationLogo` | `string` | Calea către logo-ul organizației | `null` |
| `Logo` | `string` | Calea către logo-ul aplicației | `null` |
| `Title` | `string` | Titlul aplicației | `null` |
| `ShowLanguages` | `bool` | Afișează selectorul de limbă | `false` |
| `ShowAuthentication` | `bool` | Afișează controalele de autentificare | `false` |
| `ShowContextSelect` | `bool` | Afișează selectorul de context organizațional | `true` |
| `IsContainered` | `bool` | Aplică constrângeri de container la conținut | `true` |
| `LoginReturnPath` | `string` | Calea de retur după autentificare | `null` |
| `LogoutReturnUrl` | `string` | URL-ul de redirecționare după delogare | `null` |
| `ChildContent` | `RenderFragment` | Conținut pentru meniul de navigație secundar | `null` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri CSS inline | `null` |

### 3. Funcționalități speciale

#### Integrare cu ApplicationModel
Header-ul se integrează automat cu `ApplicationModel` pentru a prelua:
- Numele organizației (dacă nu este specificat explicit)
- Lista de limbi disponibile pentru selector
- Alte configurări globale ale aplicației

#### Responsive Design
- Pe ecrane mari: toate elementele sunt vizibile în linie
- Pe ecrane mici: meniu hamburger care deschide un modal fullscreen
- Navigația secundară se adaptează automat la dimensiunea ecranului

#### Autentificare
Când `ShowAuthentication="true"`, header-ul afișează:
- Informații despre utilizatorul autentificat
- Buton de delogare pentru utilizatori autentificați
- Integrare cu `FodUserInfo` pentru afișarea contextului

### 4. Integrare cu cascade parameters

```razor
<CascadingValue Name="ApplicationModel" Value="@applicationModel">
    <FodHeader ShowLanguages="true" ShowAuthentication="true" />
</CascadingValue>

@code {
    private ApplicationModel applicationModel = new ApplicationModel
    {
        Name = "Portal Guvernamental",
        Languages = new List<LanguageModel>
        {
            new LanguageModel { Name = "Română", Iso2 = "ro" },
            new LanguageModel { Name = "Русский", Iso2 = "ru" },
            new LanguageModel { Name = "English", Iso2 = "en" }
        }
    };
}
```

### 5. Note și observații

- Header-ul folosește Bootstrap pentru styling și responsive behavior
- Selectorul de limbă este populat automat din `ApplicationModel` sau poate fi configurat manual
- Pentru aplicații cu autentificare MPass, asigurați-vă că serviciile necesare sunt configurate
- Meniul mobil folosește `FodModal` pentru o experiență fullscreen pe dispozitive mici
- Header-ul trebuie plasat de obicei în layout-ul principal al aplicației

### 6. Concluzie
`FodHeader` oferă o soluție completă pentru navigația principală în aplicațiile guvernamentale, cu suport pentru toate funcționalitățile necesare: branding, autentificare, multilingvism și navigație responsivă.