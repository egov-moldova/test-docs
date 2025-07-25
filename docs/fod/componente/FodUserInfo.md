# FodUserInfo

## Descriere Generală

`FodUserInfo` este o componentă specializată pentru afișarea și gestionarea informațiilor utilizatorului curent în header-ul aplicației. Oferă funcționalități pentru afișarea contextului activ (personal/organizațional), schimbarea contextului și navigarea către autentificare pentru utilizatorii neautentificați.

## Caracteristici Principale

- **Afișare context** - Afișează contextul curent al utilizatorului
- **Schimbare context** - Permite comutarea între contexte disponibile
- **Autentificare** - Redirecționare către login pentru utilizatori neautentificați
- **Moduri de afișare** - Dropdown sau modal pentru schimbare context
- **Integrare AuthorizeView** - Afișează conținut diferit bazat pe starea de autentificare
- **Suport multi-context** - Gestionează contexte personale și organizaționale

## Utilizare de Bază

```razor
<!-- În header -->
<FodHeader>
    <div class="header-content">
        <h1>Aplicația Mea</h1>
        <FodUserInfo />
    </div>
</FodHeader>
```

## Atribute și Parametri

| Parametru | Tip | Valoare implicită | Descriere |
|-----------|-----|-------------------|-----------|
| `ShowContextSelect` | `bool` | `true` | Afișează dropdown pentru selectare context |
| `ShowContextProvider` | `bool` | `false` | Afișează buton pentru modal de selectare context |
| `ContextProviderClass` | `string` | - | Clase CSS pentru butonul context provider |
| `LoginReturnPath` | `string` | - | URL de redirecționare după autentificare |

## Exemple de Utilizare

### UserInfo Simplu în Header

```razor
<FodHeader Color="FodColor.Primary">
    <FodContainer>
        <div class="d-flex justify-content-between align-items-center">
            <FodText Typo="Typo.h6" Color="FodColor.White">
                Portal Servicii
            </FodText>
            <FodUserInfo />
        </div>
    </FodContainer>
</FodHeader>
```

### UserInfo cu Modal pentru Context

```razor
<FodHeader>
    <div class="header-wrapper">
        <div class="logo-section">
            <img src="/logo.png" alt="Logo" />
        </div>
        
        <div class="user-section">
            <FodUserInfo ShowContextProvider="true" 
                        ShowContextSelect="false"
                        ContextProviderClass="context-button-custom" />
        </div>
    </div>
</FodHeader>

<style>
    .context-button-custom {
        background-color: transparent;
        border: 1px solid white;
        color: white;
    }
</style>
```

### UserInfo cu Return Path Personalizat

```razor
<FodUserInfo LoginReturnPath="/dashboard" />
```

### Header Complet cu UserInfo

```razor
<FodHeader Color="FodColor.Primary" Fixed="true">
    <FodContainer>
        <div class="header-content">
            <!-- Logo și titlu -->
            <div class="brand">
                <FodIconButton Icon="@FodIcons.Material.Filled.Menu" 
                              Color="FodColor.Inherit"
                              OnClick="ToggleDrawer" />
                <FodText Typo="Typo.h6" Color="FodColor.White" Class="ms-3">
                    Sistemul Electronic
                </FodText>
            </div>
            
            <!-- Navigare -->
            <nav class="main-nav">
                <FodButton Color="FodColor.Inherit" Href="/servicii">
                    Servicii
                </FodButton>
                <FodButton Color="FodColor.Inherit" Href="/ajutor">
                    Ajutor
                </FodButton>
            </nav>
            
            <!-- User info -->
            <FodUserInfo />
        </div>
    </FodContainer>
</FodHeader>

@code {
    private void ToggleDrawer()
    {
        // Toggle drawer logic
    }
}
```

### UserInfo cu Context Dropdown Stilizat

```razor
<FodHeader Class="custom-header">
    <div class="header-container">
        <FodUserInfo ShowContextSelect="true" 
                    ShowContextProvider="false" />
    </div>
</FodHeader>

<style>
    /* Stilizare dropdown */
    :deep(.dropdown-xs) {
        min-width: 200px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    :deep(.text-white) {
        background-color: transparent;
        border: none;
    }
    
    :deep(.text-white:hover) {
        background-color: rgba(255, 255, 255, 0.1);
    }
</style>
```

### Integrare cu Sistem de Notificări

```razor
<FodHeader>
    <div class="header-actions">
        <!-- Notificări -->
        <FodIconButton Icon="@FodIcons.Material.Filled.Notifications"
                       Color="FodColor.Inherit">
            @if (unreadCount > 0)
            {
                <FodBadge Content="@unreadCount" 
                         Color="FodColor.Error"
                         Overlap="true">
                </FodBadge>
            }
        </FodIconButton>
        
        <!-- User Info -->
        <FodUserInfo Class="ms-2" />
    </div>
</FodHeader>

@code {
    private int unreadCount = 3;
}
```

## Comportament și Funcționalități

### Pentru Utilizatori Autentificați

1. **Afișare Context** - Afișează numele contextului curent (personal sau organizație)
2. **Schimbare Context** - Permite schimbarea între contexte disponibile
3. **Pictogramă Person** - Indică vizual prezența utilizatorului

### Pentru Utilizatori Neautentificați

1. **Buton Login** - Afișează buton pentru autentificare
2. **Redirecționare** - Salvează URL-ul curent pentru return după login
3. **Stil Consistent** - Menține aspectul vizual al header-ului

### Moduri de Schimbare Context

#### Dropdown Mode (`ShowContextSelect="true"`)
```razor
<FodUserInfo ShowContextSelect="true" ShowContextProvider="false" />
```
- Afișează un dropdown compact
- Click deschide card-uri de context
- Ideal pentru spații mici

#### Modal Mode (`ShowContextProvider="true"`)
```razor
<FodUserInfo ShowContextProvider="true" ShowContextSelect="false" />
```
- Afișează un buton care deschide modal
- Experiență mai amplă de selecție
- Ideal pentru aplicații complexe

## Evenimente și Integrări

### Ascultare Schimbare Context

```razor
@code {
    protected override void OnInitialized()
    {
        // Componenta ascultă automat la schimbări de context
        // prin _contextService.ContextChanged
    }
}
```

### Personalizare Navigare Login

```razor
<FodUserInfo LoginReturnPath="@GetReturnUrl()" />

@code {
    private string GetReturnUrl()
    {
        // Logică personalizată pentru URL de return
        var currentPath = NavigationManager.Uri;
        return currentPath.Contains("public") ? "/dashboard" : currentPath;
    }
}
```

## Stilizare

### Clase CSS Disponibile

```css
/* Buton header pentru login */
.fod-button-header

/* Culoare modal */
.modal-color

/* Text alb */
.text-white

/* Dropdown mic */
.dropdown-xs
```

### Personalizare Aspect

```css
/* Stil pentru buton context */
:deep(.context-provider-button) {
    border: 2px solid white;
    border-radius: 20px;
    padding: 0.5rem 1rem;
}

/* Stil pentru dropdown */
:deep(.dropdown-toggle) {
    background-color: transparent !important;
    border: none !important;
}

/* Hover effect */
:deep(.dropdown-toggle:hover) {
    background-color: rgba(255, 255, 255, 0.2) !important;
}
```

## Integrare cu Alte Componente

### Cu FodHeader

```razor
<FodHeader>
    <FodContainer Class="d-flex justify-content-between">
        <FodText Typo="Typo.h6">Logo</FodText>
        <FodUserInfo />
    </FodContainer>
</FodHeader>
```

### Cu FodContextSelector

Componenta integrează automat:
- `<FodContextSelector />` pentru modal de selecție
- `<FodContextProviderCard />` pentru dropdown

### Cu AuthorizeView

Folosește intern `AuthorizeView` pentru:
- Afișare condiționată bazată pe autentificare
- Conținut diferit pentru utilizatori autentificați/neautentificați

## Best Practices

1. **Plasare în Header** - Poziționați în colțul din dreapta sus
2. **Consistență vizuală** - Mențineți stilul consistent cu header-ul
3. **Return Path** - Setați întotdeauna pentru experiență mai bună
4. **Un singur mod** - Nu activați ambele moduri simultan
5. **Responsive** - Testați pe ecrane mici

## Dependențe

Componenta necesită:
- `IContextService` - Pentru gestionarea contextelor
- `NavigationManager` - Pentru navigare
- `IStringLocalizer` - Pentru localizare
- `AuthorizeView` - Pentru verificare autentificare

## Troubleshooting

### Contextul nu se afișează
- Verificați că `IContextService` este înregistrat
- Verificați că utilizatorul are contexte disponibile

### Butonul de login nu apare
- Verificați că utilizatorul nu este autentificat
- Verificați că AuthenticationStateProvider funcționează

### Dropdown-ul nu se deschide
- Verificați că Bootstrap CSS este încărcat
- Verificați conflicte CSS

## Concluzie

FodUserInfo este o componentă esențială pentru gestionarea identității utilizatorului în aplicații, oferind o interfață intuitivă pentru autentificare și schimbare de context. Integrarea sa perfectă cu sistemul de autentificare și contexte FOD o face indispensabilă pentru aplicații multi-context.