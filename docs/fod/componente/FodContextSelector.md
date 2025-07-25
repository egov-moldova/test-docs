# FodContextSelector

## Descriere Generală

Componenta `FodContextSelector` gestionează selectarea și schimbarea contextului utilizatorului în aplicațiile guvernamentale. Permite utilizatorilor să comute între diferite roluri (persoană fizică, organizație, operator CUPS) și afișează un modal de selecție când este necesar să aleagă un context.

Componenta suportă mai multe tipuri de contexte:
- **Individual** - Persoană fizică cu IDNP
- **Organization** - Persoană juridică cu IDNO
- **CUPSOperator** - Operator al Centrului Unic de Prestare a Serviciilor
- **System** - Context de sistem

## Ghid de Utilizare API

### Exemplu de bază

```razor
<FodContextSelector />
```

### Cu parametru cascading

```razor
<CascadingValue Name="ApplicationModel" Value="@appModel">
    <FodContextSelector />
</CascadingValue>

@code {
    private ApplicationModel appModel = new();
}
```

### Integrare în aplicație

```razor
@* În MainLayout.razor *@
@inherits LayoutComponentBase

<div class="page">
    <FodContextSelector />
    
    <div class="sidebar">
        <NavMenu />
    </div>

    <main>
        <FodHeader />
        
        <div class="content">
            @Body
        </div>
    </main>
</div>
```

### Declanșare manuală a schimbării contextului

```razor
@inject IContextService contextService

<FodButton OnClick="RequestContextChange">
    Schimbă Rolul
</FodButton>

<FodContextSelector />

@code {
    private void RequestContextChange()
    {
        // Declanșează evenimentul care va afișa selectorul
        contextService.RequestContextChange();
    }
}
```

## Atribute disponibile

| Atribut | Tip | Descriere |
|---------|-----|-----------|
| ApplicationModel | ApplicationModel | Model cascading cu datele aplicației |

## Evenimente

Componenta nu expune evenimente publice, dar ascultă evenimentul `ChangeContextRequested` din `IContextService`.

## Metode publice

Componenta nu expune metode publice.

## Componente asociate

- **FodModal** - Pentru afișarea selectorului de context
- **FodButton** - Pentru acțiunea de continuare
- **FodIcon** - Pentru iconițele tipurilor de context
- **FodText** - Pentru formatarea textului
- **IContextService** - Serviciul pentru gestionarea contextelor

## Stilizare

### Structura modalului

```
┌─────────────────────────────────────┐
│        [Icon]                       │
│     Ion Popescu                     │
│   Persoană fizică                   │
│   IDNP: 2000000000000              │
│                                     │
│     [Continuă]                      │
│                                     │
│   Alege alt rol:                    │
│ ┌─────────────────────────────────┐ │
│ │ [Icon] Compania SRL              │ │
│ │        IDNO: 1234567890          │ │
│ │        Administrator             │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Clase CSS utilizate

- `.profile-icon` - Container pentru iconița profilului curent
- `.select-context` - Text pentru secțiunea de selecție
- `.role` - Container pentru fiecare rol disponibil
- `.role-icon-container` - Container pentru iconița rolului
- `.role-icon` - Iconița specifică tipului de rol
- `.role-description` - Detaliile rolului
- `.role-name` - Numele entității
- `.role-idn` - IDNP/IDNO
- `.role-title` - Funcția/rolul

### Personalizare

```css
/* Stilizare container rol */
.role {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    margin: 0.5rem 0;
    cursor: pointer;
    transition: all 0.3s ease;
}

.role:hover {
    background-color: #f5f5f5;
    border-color: var(--fod-primary);
}

/* Iconițe pentru tipuri de context */
.role-icon {
    background-color: var(--fod-primary-light);
    border-radius: 50%;
    padding: 0.5rem;
}

/* Formatare informații rol */
.role-description {
    text-align: left;
    margin-left: 1rem;
}

.role-name {
    font-weight: bold;
    color: #333;
}

.role-idn {
    color: #666;
    font-size: 0.9rem;
}
```

## Note și observații

1. **Query parameter** - Suportă parametrul `outside-context` pentru setare externă
2. **Selecție obligatorie** - Se afișează automat când este necesară selecția
3. **Persistență** - Contextul selectat este salvat pentru sesiunea curentă
4. **Refresh la schimbare** - Pagina se reîncarcă după selectarea unui nou context
5. **Context exclus** - Contextul curent nu apare în lista de selecție

## Bune practici

1. **O singură instanță** - Includeți componenta o singură dată în aplicație
2. **Layout principal** - Plasați în MainLayout sau App.razor
3. **Servicii necesare** - Asigurați înregistrarea IContextService în DI
4. **Gestionare stări** - Tratați cazurile când nu există contexte disponibile
5. **Loading state** - Componenta gestionează automat starea de încărcare
6. **Deep linking** - Suportă setarea contextului prin URL

## Exemple avansate

### Verificare context curent

```razor
@inject IContextService contextService

@if (currentContext != null)
{
    <div class="current-context">
        <span>Context activ: @currentContext.ContextName</span>
        <span>Tip: @currentContext.ContextType</span>
    </div>
}

@code {
    private UserContext currentContext;

    protected override async Task OnInitializedAsync()
    {
        currentContext = await contextService.GetCurrent();
    }
}
```

### Forțare selecție context

```razor
@inject IContextService contextService

protected override async Task OnInitializedAsync()
{
    // Verifică dacă pagina necesită un context specific
    if (RequiresOrganizationContext())
    {
        var current = await contextService.GetCurrent();
        if (current?.ContextType != UserContextType.Organization)
        {
            contextService.RequestContextChange();
        }
    }
}
```

## Concluzie

FodContextSelector oferă o soluție completă pentru gestionarea contextelor multiple ale utilizatorilor. Cu suport pentru diferite tipuri de entități, interfață intuitivă și integrare perfectă cu serviciile de autentificare, componenta facilitează navigarea între roluri în aplicațiile guvernamentale complexe.