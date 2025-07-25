# FodNavGroup

## Descriere Generală

`FodNavGroup` este o componentă pentru crearea grupurilor de navigare colapsibile în meniuri și bare laterale. Permite organizarea elementelor de navigare în categorii care pot fi extinse sau colapsate, oferind o experiență de navigare mai organizată și eficientă în aplicațiile complexe.

## Caracteristici Principale

- **Grupare ierarhică** - Organizează elementele de navigare în categorii
- **Colapsibil** - Poate fi extins/colapsibil pentru economisire spațiu
- **Two-way binding** - Suport pentru `@bind-Expanded`
- **Pictograme** - Suport pentru pictograme personalizabile
- **Animații fluide** - Tranziții smooth la extindere/colapsare
- **Accesibilitate** - Suport complet pentru navigare cu tastatura

## Utilizare de Bază

```razor
<FodNavGroup Title="Administrare" Icon="@FodIcons.Material.Filled.Settings">
    <FodNavLink Href="/admin/utilizatori">Utilizatori</FodNavLink>
    <FodNavLink Href="/admin/roluri">Roluri</FodNavLink>
    <FodNavLink Href="/admin/permisiuni">Permisiuni</FodNavLink>
</FodNavGroup>
```

## Atribute și Parametri

| Parametru | Tip | Valoare implicită | Descriere |
|-----------|-----|-------------------|-----------|
| `Title` | `string` | - | Titlul grupului de navigare |
| `Icon` | `string` | - | Pictograma afișată lângă titlu |
| `IconColor` | `FodColor` | `Default` | Culoarea pictogramei |
| `Expanded` | `bool` | `false` | Starea extinsă/colapsată |
| `ExpandedChanged` | `EventCallback<bool>` | - | Eveniment pentru two-way binding |
| `ExpandIcon` | `string` | `ArrowDropDown` | Pictograma pentru expand/collapse |
| `HideExpandIcon` | `bool` | `false` | Ascunde pictograma de expand |
| `MaxHeight` | `int?` | - | Înălțimea maximă pentru collapse |
| `Disabled` | `bool` | `false` | Dezactivează grupul |
| `DisableRipple` | `bool` | `false` | Dezactivează efectul ripple |
| `ChildContent` | `RenderFragment` | - | Conținutul grupului (link-uri) |
| `Class` | `string` | - | Clase CSS adiționale |
| `Style` | `string` | - | Stiluri inline |
| `UserAttributes` | `Dictionary<string, object>` | - | Atribute HTML adiționale |

## Exemple de Utilizare

### Meniu cu Grupuri Simple

```razor
<FodNavMenu>
    <FodNavGroup Title="Dashboard" Icon="@FodIcons.Material.Filled.Dashboard">
        <FodNavLink Href="/dashboard/overview">Prezentare generală</FodNavLink>
        <FodNavLink Href="/dashboard/analytics">Analize</FodNavLink>
        <FodNavLink Href="/dashboard/reports">Rapoarte</FodNavLink>
    </FodNavGroup>
    
    <FodNavGroup Title="Utilizatori" Icon="@FodIcons.Material.Filled.People">
        <FodNavLink Href="/users/list">Listă utilizatori</FodNavLink>
        <FodNavLink Href="/users/roles">Roluri</FodNavLink>
        <FodNavLink Href="/users/permissions">Permisiuni</FodNavLink>
    </FodNavGroup>
</FodNavMenu>
```

### Grup cu Control Two-Way Binding

```razor
<FodNavGroup Title="Setări" 
             Icon="@FodIcons.Material.Filled.Settings"
             @bind-Expanded="settingsExpanded">
    <FodNavLink Href="/settings/general">Generale</FodNavLink>
    <FodNavLink Href="/settings/security">Securitate</FodNavLink>
    <FodNavLink Href="/settings/notifications">Notificări</FodNavLink>
</FodNavGroup>

<FodButton OnClick="@(() => settingsExpanded = !settingsExpanded)">
    Toggle Setări
</FodButton>

@code {
    private bool settingsExpanded = false;
}
```

### Grupuri cu Culori Diferite pentru Pictograme

```razor
<FodNavMenu>
    <FodNavGroup Title="Activ" 
                 Icon="@FodIcons.Material.Filled.CheckCircle"
                 IconColor="FodColor.Success">
        <FodNavLink Href="/active/services">Servicii active</FodNavLink>
        <FodNavLink Href="/active/users">Utilizatori activi</FodNavLink>
    </FodNavGroup>
    
    <FodNavGroup Title="Avertizări" 
                 Icon="@FodIcons.Material.Filled.Warning"
                 IconColor="FodColor.Warning">
        <FodNavLink Href="/warnings/system">Sistem</FodNavLink>
        <FodNavLink Href="/warnings/security">Securitate</FodNavLink>
    </FodNavGroup>
    
    <FodNavGroup Title="Erori" 
                 Icon="@FodIcons.Material.Filled.Error"
                 IconColor="FodColor.Error">
        <FodNavLink Href="/errors/recent">Recente</FodNavLink>
        <FodNavLink Href="/errors/critical">Critice</FodNavLink>
    </FodNavGroup>
</FodNavMenu>
```

### Grupuri Imbricate

```razor
<FodNavMenu>
    <FodNavGroup Title="Servicii" Icon="@FodIcons.Material.Filled.Work">
        <FodNavLink Href="/services/all">Toate serviciile</FodNavLink>
        
        <FodNavGroup Title="Documente" Icon="@FodIcons.Material.Filled.Description">
            <FodNavLink Href="/services/docs/identity">Acte identitate</FodNavLink>
            <FodNavLink Href="/services/docs/property">Acte proprietate</FodNavLink>
            <FodNavLink Href="/services/docs/education">Acte studii</FodNavLink>
        </FodNavGroup>
        
        <FodNavGroup Title="Licențe" Icon="@FodIcons.Material.Filled.CardMembership">
            <FodNavLink Href="/services/licenses/driving">Permis conducere</FodNavLink>
            <FodNavLink Href="/services/licenses/business">Licențe afaceri</FodNavLink>
        </FodNavGroup>
    </FodNavGroup>
</FodNavMenu>
```

### Grup cu Pictogramă Expand Personalizată

```razor
<FodNavGroup Title="Opțiuni avansate" 
             Icon="@FodIcons.Material.Filled.Tune"
             ExpandIcon="@FodIcons.Material.Filled.ExpandMore"
             @bind-Expanded="advancedExpanded">
    <FodNavLink Href="/advanced/api">Configurare API</FodNavLink>
    <FodNavLink Href="/advanced/webhooks">Webhooks</FodNavLink>
    <FodNavLink Href="/advanced/integrations">Integrări</FodNavLink>
</FodNavGroup>
```

### Grup fără Pictogramă Expand

```razor
<FodNavGroup Title="Acțiuni rapide" 
             Icon="@FodIcons.Material.Filled.FlashOn"
             HideExpandIcon="true"
             Expanded="true">
    <FodNavLink Href="/quick/new">Creează nou</FodNavLink>
    <FodNavLink Href="/quick/import">Importă</FodNavLink>
    <FodNavLink Href="/quick/export">Exportă</FodNavLink>
</FodNavGroup>
```

### Grup cu Înălțime Maximă Personalizată

```razor
<FodNavGroup Title="Categorii" 
             Icon="@FodIcons.Material.Filled.Category"
             MaxHeight="300"
             Expanded="true">
    @foreach (var category in categories)
    {
        <FodNavLink Href="@($"/categories/{category.Id}")">
            @category.Name
        </FodNavLink>
    }
</FodNavGroup>

@code {
    private List<Category> categories = GenerateCategories(20);
}
```

### Meniu Complex cu Multiple Grupuri

```razor
<FodNavMenu>
    <!-- Meniu Principal -->
    <FodNavLink Href="/" Icon="@FodIcons.Material.Filled.Home">
        Acasă
    </FodNavLink>
    
    <!-- Servicii Publice -->
    <FodNavGroup Title="Servicii Publice" 
                 Icon="@FodIcons.Material.Filled.Public"
                 @bind-Expanded="publicServicesExpanded">
        <FodNavLink Href="/services/documents">Documente</FodNavLink>
        <FodNavLink Href="/services/certificates">Certificate</FodNavLink>
        <FodNavLink Href="/services/permits">Autorizații</FodNavLink>
    </FodNavGroup>
    
    <!-- Administrare -->
    @if (hasAdminAccess)
    {
        <FodNavGroup Title="Administrare" 
                     Icon="@FodIcons.Material.Filled.AdminPanelSettings"
                     IconColor="FodColor.Warning">
            <FodNavLink Href="/admin/users">Utilizatori</FodNavLink>
            <FodNavLink Href="/admin/audit">Audit</FodNavLink>
            <FodNavLink Href="/admin/settings">Setări sistem</FodNavLink>
        </FodNavGroup>
    }
    
    <!-- Rapoarte -->
    <FodNavGroup Title="Rapoarte" 
                 Icon="@FodIcons.Material.Filled.Assessment"
                 Disabled="@(!hasReportsAccess)">
        <FodNavLink Href="/reports/statistics">Statistici</FodNavLink>
        <FodNavLink Href="/reports/financial">Financiar</FodNavLink>
        <FodNavLink Href="/reports/custom">Personalizate</FodNavLink>
    </FodNavGroup>
    
    <!-- Ajutor -->
    <FodNavGroup Title="Ajutor" 
                 Icon="@FodIcons.Material.Filled.Help"
                 Expanded="false">
        <FodNavLink Href="/help/documentation">Documentație</FodNavLink>
        <FodNavLink Href="/help/faq">Întrebări frecvente</FodNavLink>
        <FodNavLink Href="/help/support">Suport tehnic</FodNavLink>
    </FodNavGroup>
</FodNavMenu>

@code {
    private bool publicServicesExpanded = true;
    private bool hasAdminAccess = true;
    private bool hasReportsAccess = false;
}
```

### Grup Dezactivat Condiționat

```razor
<FodNavGroup Title="Funcții Premium" 
             Icon="@FodIcons.Material.Filled.Star"
             IconColor="FodColor.Secondary"
             Disabled="@(!isPremiumUser)">
    <FodNavLink Href="/premium/analytics">Analize avansate</FodNavLink>
    <FodNavLink Href="/premium/export">Export nelimitat</FodNavLink>
    <FodNavLink Href="/premium/api">Acces API</FodNavLink>
</FodNavGroup>

@if (!isPremiumUser)
{
    <FodAlert Severity="FodSeverity.Info" Class="ma-2">
        Actualizați la Premium pentru acces
    </FodAlert>
}

@code {
    private bool isPremiumUser = false;
}
```

## Stilizare

### Clase CSS Generate

```css
/* Container principal */
.fod-nav-group

/* Buton pentru expand/collapse */
.fod-nav-link
.fod-nav-link.fod-expanded /* Când grupul este extins */
.fod-ripple /* Efect ripple activat */

/* Pictogramă principală */
.fod-nav-link-icon
.fod-nav-link-icon-default

/* Text titlu */
.fod-nav-link-text

/* Pictogramă expand */
.fod-nav-link-expand-icon
.fod-nav-link-expand-icon.fod-transform /* Rotire când extins */

/* Container collapse */
.fod-navgroup-collapse
```

### Personalizare CSS

```css
/* Stil pentru grup activ */
.fod-nav-group.active {
    background-color: rgba(var(--fod-palette-primary-rgb), 0.1);
}

/* Hover effect pentru buton */
.fod-nav-group .fod-nav-link:hover {
    background-color: rgba(0, 0, 0, 0.04);
}

/* Indentare pentru sub-elemente */
.fod-navgroup-collapse .fod-nav-link {
    padding-left: 3rem;
}

/* Animație pentru pictograma expand */
.fod-nav-link-expand-icon {
    transition: transform 0.3s ease;
}

.fod-nav-link-expand-icon.fod-transform {
    transform: rotate(180deg);
}

/* Separator între grupuri */
.fod-nav-group + .fod-nav-group {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    margin-top: 0.5rem;
    padding-top: 0.5rem;
}
```

## Comportament și Interacțiuni

### Expand/Collapse

- Click pe header toggle starea expanded
- Animație smooth prin FodCollapse
- Pictograma se rotește 180° când este extins

### Keyboard Navigation

- `Tab` - Navighează între grupuri
- `Enter/Space` - Toggle expand/collapse
- Suport complet pentru screen readers

### State Management

```razor
@code {
    // Păstrează starea între navigări
    private Dictionary<string, bool> groupStates = new();
    
    private bool GetGroupState(string groupName)
    {
        return groupStates.GetValueOrDefault(groupName, false);
    }
    
    private void SetGroupState(string groupName, bool expanded)
    {
        groupStates[groupName] = expanded;
        // Salvează în localStorage pentru persistență
        localStorage.SetItem($"navgroup_{groupName}", expanded.ToString());
    }
}
```

## Best Practices

1. **Titluri descriptive** - Folosiți titluri clare pentru categorii
2. **Pictograme relevante** - Alegeți pictograme care reprezintă categoria
3. **Organizare logică** - Grupați elementele similare împreună
4. **Evitați imbricarea excesivă** - Maxim 2-3 nivele de adâncime
5. **State management** - Păstrați starea expanded între sesiuni pentru UX mai bun
6. **Feedback vizual** - Indicați clar grupurile dezactivate

## Integrare cu Alte Componente

### Cu FodNavMenu

```razor
<FodNavMenu>
    <FodNavGroup Title="Secțiune 1">
        <FodNavLink Href="/section1/page1">Pagina 1</FodNavLink>
    </FodNavGroup>
</FodNavMenu>
```

### Cu FodDrawer

```razor
<FodDrawer @bind-Open="drawerOpen">
    <FodNavMenu>
        <FodNavGroup Title="Meniu">
            <!-- Conținut -->
        </FodNavGroup>
    </FodNavMenu>
</FodDrawer>
```

## Accesibilitate

- Atribute ARIA pentru screen readers
- Focus management corect
- Suport pentru navigare doar cu tastatura
- Indicatori vizuali pentru stare (expanded/collapsed)

## Troubleshooting

### Grupul nu se extinde/colapsează
- Verificați că `Expanded` nu este setat hard-coded
- Verificați că grupul nu este `Disabled`

### Animația nu funcționează
- Verificați că FodCollapse este prezent
- Verificați CSS-ul pentru tranziții

### Pictogramele nu apar
- Verificați că FodIcons este disponibil
- Verificați valorile pentru `Icon` și `ExpandIcon`

## Concluzie

FodNavGroup este esențială pentru organizarea meniurilor complexe în aplicații Blazor, oferind o modalitate intuitivă de a grupa și gestiona elementele de navigare. Cu suport pentru personalizare extensivă și integrare perfectă cu alte componente FOD, permite crearea de interfețe de navigare profesionale și ușor de utilizat.