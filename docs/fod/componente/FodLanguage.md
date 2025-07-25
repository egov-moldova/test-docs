# FodLanguage

## Documentație pentru componenta FodLanguage

### 1. Descriere Generală

`FodLanguage` este o componentă specializată pentru selecția limbii aplicației. Oferă un dropdown pre-configurat cu limbile disponibile și integrare automată cu serviciul de cultură pentru schimbarea limbii în întreaga aplicație.

Caracteristici principale:
- Dropdown cu limbile disponibile
- Detectare automată a limbii curente
- Integrare cu ICultureService
- Iconița implicită pentru limbi
- Suport pentru variantă vizuală (text/outlined/filled)
- Actualizare automată a culturii aplicației
- Personalizare completă a listei de limbi

### 2. Utilizare de Bază

#### Selector simplu de limbă
```razor
<FodLanguage Languages="@availableLanguages" />

@code {
    private List<SelectItem> availableLanguages = new()
    {
        new SelectItem { Value = "ro", Label = "Română" },
        new SelectItem { Value = "ru", Label = "Русский" },
        new SelectItem { Value = "en", Label = "English" }
    };
}
```

#### În header-ul aplicației
```razor
<FodHeader>
    <ToolbarContent>
        <FodSpacer />
        <FodLanguage Languages="@languages" />
        <FodUserInfo />
    </ToolbarContent>
</FodHeader>

@code {
    private List<SelectItem> languages = new()
    {
        new SelectItem { Value = "ro-RO", Label = "Română" },
        new SelectItem { Value = "ru-RU", Label = "Русский" },
        new SelectItem { Value = "en-US", Label = "English" }
    };
}
```

### 3. Atribute și Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Languages` | `List<SelectItem>` | Lista limbilor disponibile | - |
| `StartIcon` | `string` | Iconița afișată | `FodIcons.Filled.Language` |
| `Variant` | `FodVariant` | Varianta vizuală | `Text` |
| `Class` | `string` | Clase CSS adiționale | - |

### 4. Exemple de Utilizare

#### Configurare completă cu steaguri
```razor
<FodLanguage Languages="@languagesWithFlags" Class="language-selector" />

@code {
    private List<SelectItem> languagesWithFlags = new()
    {
        new SelectItem { Value = "ro", Label = "🇷🇴 Română" },
        new SelectItem { Value = "ru", Label = "🇷🇺 Русский" },
        new SelectItem { Value = "en", Label = "🇬🇧 English" },
        new SelectItem { Value = "fr", Label = "🇫🇷 Français" }
    };
}
```

#### În toolbar cu alte controale
```razor
<FodToolbar>
    <FodText Typo="Typo.h6">Aplicația Mea</FodText>
    <FodSpacer />
    
    <!-- Selector temă -->
    <FodIconButton Icon="@FodIcons.Material.Filled.Brightness4" 
                   OnClick="ToggleTheme" />
    
    <!-- Selector limbă -->
    <FodLanguage Languages="@appLanguages" />
    
    <!-- Notificări -->
    <FodIconButton Icon="@FodIcons.Material.Filled.Notifications">
        <FodBadge Content="3" Color="FodColor.Error" />
    </FodIconButton>
</FodToolbar>

@code {
    private List<SelectItem> appLanguages = new()
    {
        new SelectItem { Value = "ro", Label = "RO" },
        new SelectItem { Value = "ru", Label = "RU" },
        new SelectItem { Value = "en", Label = "EN" }
    };
}
```

#### Variantă outlined în formular
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Preferințe utilizator
        </FodText>
        
        <FodGrid Container="true" Spacing="2">
            <FodGrid Item="true" xs="12" sm="6">
                <FodText Typo="Typo.body2" GutterBottom="true">
                    Limba aplicației
                </FodText>
                <FodLanguage Languages="@fullLanguageList" 
                             Variant="FodVariant.Outlined" />
            </FodGrid>
            
            <FodGrid Item="true" xs="12" sm="6">
                <FodText Typo="Typo.body2" GutterBottom="true">
                    Fus orar
                </FodText>
                <FodSelect Items="@timeZones" 
                           @bind-Value="selectedTimeZone"
                           Variant="FodVariant.Outlined" />
            </FodGrid>
        </FodGrid>
    </FodCardContent>
</FodCard>

@code {
    private List<SelectItem> fullLanguageList = new()
    {
        new SelectItem { Value = "ro-RO", Label = "Română (România)" },
        new SelectItem { Value = "ro-MD", Label = "Română (Moldova)" },
        new SelectItem { Value = "ru-RU", Label = "Русский (Россия)" },
        new SelectItem { Value = "ru-MD", Label = "Русский (Молдова)" },
        new SelectItem { Value = "en-US", Label = "English (US)" },
        new SelectItem { Value = "en-GB", Label = "English (UK)" }
    };
}
```

#### În drawer pentru setări mobile
```razor
<FodDrawer @bind-Open="settingsOpen" Anchor="Anchor.Right">
    <FodList>
        <FodListItem>
            <FodText Typo="Typo.subtitle1">Setări aplicație</FodText>
        </FodListItem>
        
        <FodDivider />
        
        <FodListItem>
            <div class="d-flex align-items-center justify-content-between w-100">
                <FodText>Limbă</FodText>
                <FodLanguage Languages="@mobileLanguages" />
            </div>
        </FodListItem>
        
        <FodListItem>
            <div class="d-flex align-items-center justify-content-between w-100">
                <FodText>Temă</FodText>
                <FodSwitch @bind-Checked="darkMode" />
            </div>
        </FodListItem>
    </FodList>
</FodDrawer>

@code {
    private bool settingsOpen = false;
    private bool darkMode = false;
    
    private List<SelectItem> mobileLanguages = new()
    {
        new SelectItem { Value = "ro", Label = "RO" },
        new SelectItem { Value = "ru", Label = "RU" },
        new SelectItem { Value = "en", Label = "EN" }
    };
}
```

#### Integrare cu localStorage pentru persistență
```razor
@inject ILocalStorageService LocalStorage
@inject ICultureService CultureService

<FodLanguage Languages="@persistentLanguages" />

@code {
    private List<SelectItem> persistentLanguages = new()
    {
        new SelectItem { Value = "ro", Label = "Română" },
        new SelectItem { Value = "ru", Label = "Русский" },
        new SelectItem { Value = "en", Label = "English" }
    };
    
    protected override async Task OnInitializedAsync()
    {
        // Restaurează limba salvată
        var savedLanguage = await LocalStorage.GetItemAsync<string>("app-language");
        if (!string.IsNullOrEmpty(savedLanguage))
        {
            CultureService.SetCulture(new CultureInfo(savedLanguage));
        }
    }
    
    // Hook în CultureService pentru salvare automată
    protected override void OnAfterRender(bool firstRender)
    {
        if (firstRender)
        {
            CultureService.OnCultureChanged += async (culture) =>
            {
                await LocalStorage.SetItemAsync("app-language", culture.Name);
            };
        }
    }
}
```

### 5. Integrare cu sistemul de localizare

#### Configurare în Program.cs
```csharp
var builder = WebApplication.CreateBuilder(args);

// Adaugă serviciile de localizare
builder.Services.AddLocalization();

// Configurează culturile suportate
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] { "ro", "ru", "en" };
    options.SetDefaultCulture(supportedCultures[0])
        .AddSupportedCultures(supportedCultures)
        .AddSupportedUICultures(supportedCultures);
});

// Înregistrează serviciul de cultură
builder.Services.AddScoped<ICultureService, CultureService>();
```

#### Utilizare cu resurse localizate
```razor
@inject IStringLocalizer<AppResources> Localizer

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6">@Localizer["Welcome"]</FodText>
        <FodText Typo="Typo.body2">@Localizer["SelectLanguage"]</FodText>
        
        <FodLanguage Languages="@localizedLanguages" />
    </FodCardContent>
</FodCard>

@code {
    private List<SelectItem> localizedLanguages = new()
    {
        new SelectItem { Value = "ro", Label = "Română" },
        new SelectItem { Value = "ru", Label = "Русский" },
        new SelectItem { Value = "en", Label = "English" }
    };
}
```

### 6. Stilizare

```css
/* Selector personalizat */
.language-selector .fod-dropdown-toggle {
    min-width: 120px;
}

/* Steaguri în dropdown */
.language-selector .fod-dropdown-item {
    font-size: 1.1rem;
}

/* Compact pentru mobile */
@media (max-width: 600px) {
    .language-selector .fod-dropdown-toggle {
        min-width: 60px;
    }
}

/* Evidențiere limbă activă */
.language-selector .fod-dropdown-item.active {
    background-color: var(--fod-palette-primary-light);
}
```

### 7. Best Practices

1. **Cod ISO standard** - Folosiți coduri ISO 639-1 pentru limbi (ro, en, ru)
2. **Nume native** - Afișați numele limbilor în limba respectivă
3. **Detectare automată** - Componenta detectează automat limba curentă
4. **Persistență** - Salvați preferința utilizatorului în localStorage
5. **Accesibilitate** - Includeți atributul lang pe elementul HTML root
6. **Fallback** - Definiți o limbă implicită pentru cazuri neprevăzute

### 8. Integrare cu alte componente

#### În pagina de login
```razor
<div class="login-page">
    <div class="language-corner">
        <FodLanguage Languages="@loginLanguages" />
    </div>
    
    <FodCard Class="login-card">
        <FodCardContent>
            <FodText Typo="Typo.h5" Align="Align.Center">
                @Localizer["LoginTitle"]
            </FodText>
            <!-- Formular login -->
        </FodCardContent>
    </FodCard>
</div>

@code {
    private List<SelectItem> loginLanguages = new()
    {
        new SelectItem { Value = "ro", Label = "Română" },
        new SelectItem { Value = "ru", Label = "Русский" },
        new SelectItem { Value = "en", Label = "English" }
    };
}
```

#### În footer
```razor
<FodFooter>
    <div class="footer-content">
        <div class="footer-section">
            <FodText Typo="Typo.caption">
                © 2024 Compania Mea
            </FodText>
        </div>
        
        <div class="footer-section">
            <FodLanguage Languages="@footerLanguages" 
                         Variant="FodVariant.Text" />
        </div>
    </div>
</FodFooter>
```

### 9. Troubleshooting

#### Limba nu se schimbă
- Verificați că ICultureService este înregistrat în DI
- Asigurați-vă că cultura este suportată în aplicație
- Verificați că resursele sunt disponibile pentru limba selectată

#### Dropdown nu afișează limba curentă
- Verificați că valorile din Languages corespund cu cultura curentă
- Componenta caută atât cultura părinte cât și cultura completă

### 10. Concluzie

`FodLanguage` oferă o soluție completă pentru selecția limbii în aplicațiile FOD. Cu detecție automată a limbii curente, integrare perfectă cu sistemul de localizare și design flexibil, componenta simplifică implementarea aplicațiilor multilingve pentru serviciile guvernamentale din Moldova.