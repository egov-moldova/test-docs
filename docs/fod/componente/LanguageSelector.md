# LanguageSelector

## Descriere Generală

Componenta `LanguageSelector` oferă o interfață dropdown pentru schimbarea limbii/culturii aplicației. Permite utilizatorilor să comute între limbile suportate (Română, Engleză, Rusă) cu actualizare automată a întregii aplicații. Componenta folosește JavaScript interop pentru persistarea selecției și reîncarcă pagina pentru a aplica noua cultură.

## Ghid de Utilizare API

### Exemplu de bază

```razor
<LanguageSelector />
```

### În header-ul aplicației

```razor
<FodHeader>
    <div class="header-actions">
        <LanguageSelector />
        <UserMenu />
    </div>
</FodHeader>
```

### În meniul de navigare

```razor
<nav class="navbar">
    <div class="navbar-brand">
        <img src="logo.png" alt="Logo" />
    </div>
    <div class="navbar-menu">
        <NavLink href="/">Acasă</NavLink>
        <NavLink href="/services">Servicii</NavLink>
    </div>
    <div class="navbar-tools">
        <LanguageSelector />
    </div>
</nav>
```

### Cu stilizare personalizată

```razor
<div class="custom-language-selector">
    <LanguageSelector />
</div>

<style>
    .custom-language-selector .nav-link {
        background-color: transparent;
        border: 1px solid white;
        border-radius: 4px;
        padding: 0.5rem 1rem;
    }
    
    .custom-language-selector .dropdown-menu {
        min-width: 200px;
    }
</style>
```

## Atribute disponibile

Componenta nu expune parametri publici. Limbile suportate sunt definite intern.

## Limbi suportate

| Cod cultură | Limba | DisplayName |
|-------------|-------|-------------|
| ro-md | Română | Română (Republica Moldova) |
| en-us | Engleză | English (United States) |
| ru-ru | Rusă | Русский (Россия) |

## Evenimente

Componenta nu expune evenimente publice. Schimbarea limbii declanșează o reîncărcare completă a paginii.

## Metode publice

Componenta nu expune metode publice, dar conține metoda internă `changeLanguage` pentru gestionarea schimbării.

## Componente asociate

- Folosește JSInterop pentru persistarea culturii
- NavigationManager pentru reîncărcarea paginii

## Stilizare

### Structura HTML

```html
<a class="nav-link dropdown-toggle text-white">
    <i class="fas fa-globe mr-2"></i> Română (Republica Moldova)
    <div class="dropdown-menu">
        <button>Română (Republica Moldova)</button>
        <button>English (United States)</button>
        <button>Русский (Россия)</button>
    </div>
</a>
```

### Clase CSS utilizate

- `.nav-link` - Link-ul principal
- `.dropdown-toggle` - Indicator dropdown
- `.text-white` - Text alb
- `.fas.fa-globe` - Iconița glob
- `.dropdown-menu` - Meniul dropdown
- `.mr-2` - Margin dreapta pentru iconiță

### Personalizare

```css
/* Container selector */
.language-selector-wrapper .nav-link {
    color: #333 !important;
    font-weight: 500;
}

/* Iconiță personalizată */
.language-selector-wrapper .fa-globe {
    color: var(--primary-color);
}

/* Dropdown menu */
.language-selector-wrapper .dropdown-menu {
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Butoane în dropdown */
.language-selector-wrapper .dropdown-menu button {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
}

.language-selector-wrapper .dropdown-menu button:hover {
    background-color: #f5f5f5;
}
```

## Note și observații

1. **Page reload** - Schimbarea limbii forțează reîncărcarea completă a paginii
2. **JS dependency** - Necesită funcția JavaScript `blazorCulture.set`
3. **IJSInProcessRuntime** - Folosește runtime sincron pentru JS
4. **Culture persistence** - Cultura este salvată și restaurată la reîncărcare
5. **Dropdown nefuncțional** - Click handler pe butoane nu este conectat

## Probleme cunoscute

1. **Event handler lipsă** - Butoanele din dropdown nu au `@onclick` handler
2. **Dropdown control** - Nu există logică pentru afișare/ascundere dropdown
3. **Culture property** - Proprietatea `Culture` setter nu este folosită

## Implementare corectată

```razor
@using System.Globalization
@using Microsoft.JSInterop
@inject IJSRuntime JSRuntime
@inject NavigationManager Nav

<div class="language-selector">
    <a href="javascript:void(0)" 
       class="nav-link dropdown-toggle text-white"
       @onclick="ToggleDropdown">
        <i class="fas fa-globe mr-2"></i> @CultureInfo.CurrentCulture.DisplayName
    </a>
    
    @if (isDropdownOpen)
    {
        <div class="dropdown-menu show">
            @foreach (var culture in supportedCultures)
            {
                <button @onclick="() => ChangeLanguage(culture)">
                    @culture.DisplayName
                </button>
            }
        </div>
    }
</div>

@code {
    private bool isDropdownOpen = false;
    
    private CultureInfo[] supportedCultures = new[]
    {
        new CultureInfo("ro-MD"),
        new CultureInfo("en-US"),
        new CultureInfo("ru-RU"),
    };

    private void ToggleDropdown()
    {
        isDropdownOpen = !isDropdownOpen;
    }

    private async Task ChangeLanguage(CultureInfo culture)
    {
        if (CultureInfo.CurrentCulture != culture)
        {
            await JSRuntime.InvokeVoidAsync("blazorCulture.set", culture.Name);
            Nav.NavigateTo(Nav.Uri, forceLoad: true);
        }
    }
}
```

## Bune practici

1. **Loading state** - Afișați un indicator în timpul schimbării limbii
2. **Confirmation** - Pentru date nesalvate, cereți confirmare înainte de schimbare
3. **Accessibility** - Adăugați atribute ARIA pentru screen readers
4. **Keyboard navigation** - Suportați navigare cu tastatura
5. **Mobile friendly** - Asigurați funcționare corectă pe dispozitive mobile

## Concluzie

LanguageSelector oferă funcționalitate de bază pentru schimbarea limbii, dar implementarea actuală necesită îmbunătățiri pentru a fi complet funcțională. Cu ajustările sugerate, componenta poate oferi o experiență completă de selecție a limbii pentru aplicațiile multilingve.