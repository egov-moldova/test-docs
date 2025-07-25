# FodContextSelectorCard

## Documentație pentru componenta FodContextSelectorCard

### 1. Descriere Generală

`FodContextSelectorCard` este o componentă card specializată pentru selectarea contextului utilizatorului în aplicațiile guvernamentale. Permite utilizatorilor să comute între diferite roluri sau contexte (persoană fizică, organizație, operator CUPS, sistem) într-o interfață intuitivă de tip card.

Caracteristici principale:
- Afișare context curent în header
- Listă de contexte disponibile pentru comutare
- Iconițe distinctive pentru tipuri de context
- Integrare cu IContextService
- Reîncărcare automată după schimbare
- Suport pentru multiple tipuri de utilizatori
- Design card cu header și body personalizabile

### 2. Utilizare de Bază

#### Selector simplu de context
```razor
<FodContextSelectorCard />
```

#### Selector cu clase personalizate
```razor
<FodContextSelectorCard HeaderClass="custom-header" 
                        BodyClass="custom-body" />
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `HeaderClass` | `string` | Clase CSS pentru header | - |
| `BodyClass` | `string` | Clase CSS pentru body | - |

### 4. Tipuri de Context Suportate

#### Individual (Persoană fizică)
- Iconiță: Person
- Afișează: Nume, IDNP
- Rol: "Persoană fizică"

#### Organization (Persoană juridică)
- Iconiță: Business
- Afișează: Denumire organizație, IDNO
- Rol: Rol specific în organizație

#### CUPSOperator
- Iconiță: HowToReg
- Afișează: Nume operator
- Rol: "Operator CUPS"

#### System
- Iconiță: HowToReg
- Afișează: Nume sistem
- Rol: Rol în sistem

### 5. Exemple Avansate

#### Integrare în layout aplicație
```razor
@page "/dashboard"

<div class="container-fluid">
    <div class="row">
        <div class="col-lg-3">
            <FodContextSelectorCard />
        </div>
        <div class="col-lg-9">
            @if (currentContext != null)
            {
                <h3>Bun venit, @currentContext.ContextName!</h3>
                <!-- Conținut specific contextului -->
                @switch (currentContext.ContextType)
                {
                    case UserContextType.Individual:
                        <IndividualDashboard />
                        break;
                    case UserContextType.Organization:
                        <OrganizationDashboard />
                        break;
                    case UserContextType.CUPSOperator:
                        <OperatorDashboard />
                        break;
                }
            }
        </div>
    </div>
</div>

@code {
    [Inject] private IContextService contextService { get; set; }
    private UserContext currentContext;
    
    protected override async Task OnInitializedAsync()
    {
        currentContext = await contextService.GetCurrent();
        contextService.ContextChanged += OnContextChanged;
    }
    
    private void OnContextChanged(object sender, UserContext context)
    {
        currentContext = context;
        InvokeAsync(StateHasChanged);
    }
}
```

#### Declanșare schimbare context programatic
```razor
<FodButton OnClick="RequestContextChange">
    Schimbă contextul
</FodButton>

<FodContextSelectorCard @ref="contextSelector" />

@code {
    [Inject] private IContextService contextService { get; set; }
    private FodContextSelectorCard contextSelector;
    
    private void RequestContextChange()
    {
        // Declanșează evenimentul pentru afișarea selectorului
        contextService.RequestContextChangeCard();
    }
}
```

#### Personalizare vizuală
```razor
<FodContextSelectorCard HeaderClass="bg-primary text-white" 
                        BodyClass="p-4" />

<style>
    /* Header personalizat */
    .card-header-context.bg-primary {
        background: linear-gradient(135deg, 
            var(--fod-palette-primary-dark) 0%, 
            var(--fod-palette-primary-main) 100%) !important;
    }
    
    /* Body cu spacing mai mare */
    .card-body-context.p-4 {
        padding: 2rem !important;
    }
    
    /* Hover effect pentru roluri */
    .card-role {
        transition: all 0.3s ease;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 0.5rem;
    }
    
    .card-role:hover {
        background-color: rgba(var(--fod-palette-primary-rgb), 0.1);
        transform: translateX(5px);
        cursor: pointer;
    }
</style>
```

### 6. Integrare cu Servicii

#### Configurare IContextService
```csharp
// Program.cs sau Startup.cs
builder.Services.AddScoped<IContextService, ContextService>();

// Implementare serviciu
public class ContextService : IContextService
{
    public event EventHandler ChangeContextRequestedCard;
    public event EventHandler<UserContext> ContextChanged;
    
    public async Task<IEnumerable<UserContext>> Get()
    {
        // Returnează contextele disponibile pentru utilizator
        return await apiClient.GetUserContextsAsync();
    }
    
    public async Task<UserContext> GetCurrent()
    {
        // Returnează contextul curent activ
        return await sessionStorage.GetItemAsync<UserContext>("currentContext");
    }
    
    public async Task SetCurrent(UserContext context, bool persist)
    {
        await sessionStorage.SetItemAsync("currentContext", context);
        if (persist)
        {
            await apiClient.SetActiveContextAsync(context.ContextId);
        }
        ContextChanged?.Invoke(this, context);
    }
    
    public void RequestContextChangeCard()
    {
        ChangeContextRequestedCard?.Invoke(this, EventArgs.Empty);
    }
}
```

### 7. Stilizare CSS

```css
/* Card context selector */
.card-header-context {
    display: flex;
    align-items: center;
    padding: 1.5rem;
    background-color: var(--fod-palette-primary-light);
    color: var(--fod-palette-primary-contrastText);
}

.card-profile-icon {
    margin-right: 1rem;
}

.head-content .current-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
}

.head-content .current-role {
    font-size: 0.875rem;
    opacity: 0.8;
    margin: 0;
}

/* Body context selector */
.card-body-context {
    padding: 1.5rem;
}

.select-context {
    font-weight: 500;
    margin-bottom: 1rem;
    color: var(--fod-palette-text-secondary);
}

/* Card role item */
.card-role {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 1px solid var(--fod-palette-divider);
    border-radius: 4px;
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.card-role:hover {
    background-color: var(--fod-palette-action-hover);
    border-color: var(--fod-palette-primary-main);
}

.card-role-icon-container {
    margin-right: 1rem;
}

.card-role-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--fod-palette-grey-100);
    border-radius: 50%;
}

.card-role-description {
    flex: 1;
}

.card-role-name {
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.card-role-idn {
    font-size: 0.875rem;
    color: var(--fod-palette-text-secondary);
}

.card-role-idn span {
    font-weight: 500;
    margin-right: 0.5rem;
}
```

### 8. Scenarii de Utilizare

#### Dashboard multi-context
```razor
@page "/"
@layout MainLayout

<div class="dashboard-container">
    @if (showContextSelector)
    {
        <div class="context-selector-overlay" @onclick="HideContextSelector">
            <div class="context-selector-modal" @onclick:stopPropagation="true">
                <FodContextSelectorCard />
            </div>
        </div>
    }
    
    <div class="dashboard-header">
        <h1>Dashboard</h1>
        <FodButton Variant="FodVariant.Text" 
                   OnClick="ShowContextSelector">
            <FodIcon Icon="@FodIcons.Material.Filled.SwapHoriz" />
            Schimbă context
        </FodButton>
    </div>
    
    <!-- Conținut dashboard -->
</div>

@code {
    private bool showContextSelector = false;
    
    private void ShowContextSelector()
    {
        showContextSelector = true;
    }
    
    private void HideContextSelector()
    {
        showContextSelector = false;
    }
}
```

#### Validare context înainte de acțiuni
```razor
<FodContextSelectorCard @ref="contextSelector" />

<FodButton OnClick="PerformAction" Color="FodColor.Primary">
    Execută acțiune
</FodButton>

@code {
    [Inject] private IContextService contextService { get; set; }
    private FodContextSelectorCard contextSelector;
    
    private async Task PerformAction()
    {
        var currentContext = await contextService.GetCurrent();
        
        if (currentContext.ContextType != UserContextType.Organization)
        {
            ShowNotification("Această acțiune necesită context de organizație!", 
                           FodSeverity.Warning);
            
            // Solicită schimbarea contextului
            contextService.RequestContextChangeCard();
            return;
        }
        
        // Execută acțiunea
        await ExecuteBusinessAction();
    }
}
```

### 9. Best Practices

1. **Poziționare vizibilă** - Plasați în locuri ușor accesibile
2. **Feedback vizual** - Indicați clar contextul activ
3. **Validare context** - Verificați contextul înainte de acțiuni
4. **Persistență** - Salvați contextul selectat între sesiuni
5. **Loading states** - Afișați loading în timpul schimbării
6. **Error handling** - Tratați erorile de schimbare context

### 10. Performanță

- Cache-uiți lista de contexte disponibile
- Evitați reîncărcări frecvente ale paginii
- Folosiți lazy loading pentru date context-specifice
- Minimizați apelurile API la schimbare context

### 11. Accesibilitate

- Structură semantică cu heading-uri
- Suport pentru navigare cu tastatura
- ARIA labels pentru iconițe
- Focus management la schimbare context

### 12. Troubleshooting

#### Contextele nu apar
- Verificați IContextService registration
- Verificați că utilizatorul are contexte multiple
- Verificați permisiunile utilizatorului

#### Schimbarea nu se aplică
- Verificați că persist=true la SetCurrent
- Verificați navigare cu forceLoad
- Verificați event handlers

#### Stilizare nu se aplică
- Verificați ordinea CSS
- Folosiți !important pentru override
- Verificați clase CSS custom

### 13. Note despre FodContextProviderCard

`FodContextProviderCard` este un wrapper simplu care utilizează `FodContextSelectorCard`:

```razor
@namespace Fod.Components
<FodContextSelectorCard />
```

Folosiți direct `FodContextSelectorCard` pentru mai mult control.

### 14. Concluzie

`FodContextSelectorCard` oferă o interfață intuitivă pentru gestionarea contextelor multiple ale utilizatorilor în aplicațiile guvernamentale. Cu design card modern și integrare completă cu serviciile de context, componenta facilitează navigarea între diferite roluri și responsabilități ale utilizatorului.