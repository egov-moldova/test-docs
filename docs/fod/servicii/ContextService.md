# ContextService

## Descriere Generală

`ContextService` este un serviciu esențial pentru gestionarea contextelor utilizatorilor în aplicațiile FOD. Permite utilizatorilor să comute între contexte personale (Individual) și organizaționale, gestionând persistența selecției și oferind evenimente pentru schimbări de context. Este fundamental pentru aplicațiile care permit acțiuni atât în nume personal, cât și în numele organizațiilor.

## Înregistrare

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddScoped<IContextService, ContextService>();

// Servicii dependente necesare
builder.Services.AddScoped<ICurrentUserContextService, CurrentUserContextService>();
builder.Services.AddScoped<IApplicationModelLoader, ApplicationModelLoader>();
```

## Interfața IContextService

```csharp
public interface IContextService
{
    EventHandler<UserContext> ContextChanged { get; set; }
    EventHandler ChangeContextRequested { get; set; }
    EventHandler ChangeContextRequestedCard { get; set; }
    
    Task<IEnumerable<UserContext>> Get();
    Task<UserContext> GetCurrent();
    Task<UserContext> GetIndividualContext();
    Task<bool> HasCurrentContext();
    Task<bool> HasContexts();
    Task<bool> GetContextSelectionRequired();
    
    Task SetCurrent(UserContext context, bool selected = false);
    Task SetCurrent(string idn);
    Task ClearData();
    
    Task RequestContextChange();
    Task RequestContextChangeCard();
}
```

## Model UserContext

```csharp
public class UserContext
{
    public string ContextId { get; set; }
    public string ContextName { get; set; }
    public UserContextType ContextType { get; set; }
    public bool IsSelected { get; set; }
}

public enum UserContextType
{
    Individual,
    Organization
}
```

## Exemple de Utilizare

### Obținere Context Curent

```razor
@inject IContextService ContextService

<div class="current-context">
    @if (currentContext != null)
    {
        <p>Context activ: @currentContext.ContextName</p>
        <p>Tip: @currentContext.ContextType</p>
    }
    else
    {
        <p>Niciun context selectat</p>
    }
</div>

@code {
    private UserContext currentContext;
    
    protected override async Task OnInitializedAsync()
    {
        currentContext = await ContextService.GetCurrent();
        
        // Abonare la schimbări de context
        ContextService.ContextChanged += OnContextChanged;
    }
    
    private void OnContextChanged(object sender, UserContext newContext)
    {
        currentContext = newContext;
        InvokeAsync(StateHasChanged);
    }
    
    public void Dispose()
    {
        ContextService.ContextChanged -= OnContextChanged;
    }
}
```

### Selector de Context

```razor
@inject IContextService ContextService

<div class="context-selector">
    <h4>Selectați contextul de lucru:</h4>
    
    @if (contexts != null)
    {
        <div class="context-list">
            @foreach (var context in contexts)
            {
                <div class="context-item @(IsCurrentContext(context) ? "active" : "")"
                     @onclick="() => SelectContext(context)">
                    <FodIcon Icon="@GetContextIcon(context)" />
                    <span>@context.ContextName</span>
                    @if (IsCurrentContext(context))
                    {
                        <FodBadge Color="FodColor.Success">Activ</FodBadge>
                    }
                </div>
            }
        </div>
    }
</div>

@code {
    private IEnumerable<UserContext> contexts;
    private UserContext currentContext;
    
    protected override async Task OnInitializedAsync()
    {
        contexts = await ContextService.Get();
        currentContext = await ContextService.GetCurrent();
    }
    
    private async Task SelectContext(UserContext context)
    {
        await ContextService.SetCurrent(context, true);
        currentContext = context;
    }
    
    private bool IsCurrentContext(UserContext context)
    {
        return currentContext?.ContextId == context.ContextId;
    }
    
    private string GetContextIcon(UserContext context)
    {
        return context.ContextType == UserContextType.Individual 
            ? FodIcons.Material.Filled.Person 
            : FodIcons.Material.Filled.Business;
    }
}
```

### Verificare Selecție Context Necesară

```razor
@inject IContextService ContextService
@inject NavigationManager Navigation

@if (contextSelectionRequired)
{
    <div class="context-selection-required">
        <FodAlert Severity="FodSeverity.Warning">
            Vă rugăm selectați un context pentru a continua.
        </FodAlert>
        <FodButton @onclick="OpenContextSelector" Color="FodColor.Primary">
            Selectează Context
        </FodButton>
    </div>
}

@code {
    private bool contextSelectionRequired;
    
    protected override async Task OnInitializedAsync()
    {
        contextSelectionRequired = await ContextService.GetContextSelectionRequired();
        
        if (contextSelectionRequired)
        {
            // Redirecționează către pagina de selecție context
            Navigation.NavigateTo("/select-context");
        }
    }
    
    private void OpenContextSelector()
    {
        ContextService.RequestContextChange();
    }
}
```

### Context în Header-ul Aplicației

```razor
@inject IContextService ContextService

<div class="app-header">
    <div class="context-display">
        @if (currentContext != null)
        {
            <div class="context-info" @onclick="RequestContextChange">
                <FodIcon Icon="@GetIcon()" Size="FodSize.Small" />
                <span>@GetContextDisplayName()</span>
                <FodIcon Icon="@FodIcons.Material.Filled.ArrowDropDown" Size="FodSize.Small" />
            </div>
        }
    </div>
</div>

@code {
    private UserContext currentContext;
    
    protected override async Task OnInitializedAsync()
    {
        currentContext = await ContextService.GetCurrent();
        ContextService.ContextChanged += HandleContextChanged;
    }
    
    private void HandleContextChanged(object sender, UserContext context)
    {
        currentContext = context;
        InvokeAsync(StateHasChanged);
    }
    
    private string GetIcon()
    {
        return currentContext.ContextType == UserContextType.Individual
            ? FodIcons.Material.Filled.Person
            : FodIcons.Material.Filled.Business;
    }
    
    private string GetContextDisplayName()
    {
        if (currentContext.ContextType == UserContextType.Individual)
            return "Personal";
        return currentContext.ContextName;
    }
    
    private void RequestContextChange()
    {
        ContextService.RequestContextChange();
    }
}
```

### Context Switch cu Confirmare

```razor
@inject IContextService ContextService
@inject IFodNotificationService NotificationService

<div class="context-switcher">
    @foreach (var context in availableContexts)
    {
        <FodButton @onclick="() => SwitchContext(context)"
                   Disabled="@(IsCurrentContext(context))">
            Comută la @context.ContextName
        </FodButton>
    }
</div>

<FodModal @bind-Visible="showConfirmDialog" Title="Confirmare schimbare context">
    <BodyTemplate>
        <p>Sunteți sigur că doriți să schimbați contextul la <strong>@pendingContext?.ContextName</strong>?</p>
        <p class="text-muted">Această acțiune poate afecta datele afișate și operațiunile disponibile.</p>
    </BodyTemplate>
    <FooterTemplate>
        <FodButton @onclick="CancelSwitch">Anulează</FodButton>
        <FodButton Color="FodColor.Primary" @onclick="ConfirmSwitch">Confirmă</FodButton>
    </FooterTemplate>
</FodModal>

@code {
    private IEnumerable<UserContext> availableContexts = new List<UserContext>();
    private UserContext currentContext;
    private UserContext pendingContext;
    private bool showConfirmDialog;
    
    protected override async Task OnInitializedAsync()
    {
        availableContexts = await ContextService.Get();
        currentContext = await ContextService.GetCurrent();
    }
    
    private void SwitchContext(UserContext context)
    {
        if (IsCurrentContext(context)) return;
        
        pendingContext = context;
        showConfirmDialog = true;
    }
    
    private async Task ConfirmSwitch()
    {
        await ContextService.SetCurrent(pendingContext, true);
        NotificationService.Add($"Context schimbat la {pendingContext.ContextName}", FodSeverity.Success);
        
        currentContext = pendingContext;
        pendingContext = null;
        showConfirmDialog = false;
    }
    
    private void CancelSwitch()
    {
        pendingContext = null;
        showConfirmDialog = false;
    }
    
    private bool IsCurrentContext(UserContext context)
    {
        return currentContext?.ContextId == context.ContextId;
    }
}
```

### Context Card Display

```razor
@inject IContextService ContextService

<div class="context-cards">
    @foreach (var context in contexts)
    {
        <div class="context-card @(IsActive(context) ? "active" : "")"
             @onclick="() => SelectContext(context)">
            <div class="card-header">
                <FodIcon Icon="@GetIcon(context)" Size="FodSize.Large" />
            </div>
            <div class="card-body">
                <h5>@context.ContextName</h5>
                <p class="text-muted">
                    @(context.ContextType == UserContextType.Individual 
                        ? "Acțiuni personale" 
                        : "Acțiuni în numele organizației")
                </p>
            </div>
            @if (IsActive(context))
            {
                <div class="card-footer">
                    <FodBadge Color="FodColor.Success">Context Activ</FodBadge>
                </div>
            }
        </div>
    }
</div>

@code {
    private IEnumerable<UserContext> contexts;
    private UserContext activeContext;
    
    protected override async Task OnInitializedAsync()
    {
        contexts = await ContextService.Get();
        activeContext = await ContextService.GetCurrent();
        
        // Răspunde la cereri de schimbare card
        ContextService.ChangeContextRequestedCard += HandleCardChangeRequest;
    }
    
    private void HandleCardChangeRequest(object sender, EventArgs e)
    {
        // Afișează selector card-uri
        StateHasChanged();
    }
    
    private async Task SelectContext(UserContext context)
    {
        await ContextService.SetCurrent(context, true);
        activeContext = context;
    }
    
    private bool IsActive(UserContext context) => activeContext?.ContextId == context.ContextId;
    
    private string GetIcon(UserContext context)
    {
        return context.ContextType == UserContextType.Individual
            ? FodIcons.Material.Filled.AccountCircle
            : FodIcons.Material.Filled.CorporateFare;
    }
}
```

### Gestionare Context pentru Formulare

```razor
@inject IContextService ContextService

<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <div class="form-context-info">
        <FodAlert Severity="FodSeverity.Info">
            Completați formularul în contextul: <strong>@currentContext?.ContextName</strong>
        </FodAlert>
    </div>
    
    <!-- Câmpuri formular bazate pe context -->
    @if (currentContext?.ContextType == UserContextType.Individual)
    {
        <FODInputText @bind-Value="model.PersonalIdnp" Label="IDNP" />
        <FODInputText @bind-Value="model.PersonalName" Label="Nume și prenume" />
    }
    else
    {
        <FODInputText @bind-Value="model.OrganizationIdno" Label="IDNO" />
        <FODInputText @bind-Value="model.OrganizationName" Label="Denumire organizație" />
        <FODInputText @bind-Value="model.RepresentativeName" Label="Reprezentant" />
    }
    
    <FodButton Type="submit">Trimite</FodButton>
</EditForm>

@code {
    private FormModel model = new();
    private UserContext currentContext;
    
    protected override async Task OnInitializedAsync()
    {
        currentContext = await ContextService.GetCurrent();
        
        // Pre-populează date bazat pe context
        if (currentContext?.ContextType == UserContextType.Organization)
        {
            model.OrganizationIdno = currentContext.ContextId;
            model.OrganizationName = currentContext.ContextName;
        }
    }
}
```

## Evenimente

### ContextChanged

```csharp
ContextService.ContextChanged += (sender, newContext) =>
{
    // Reacționează la schimbarea contextului
    Console.WriteLine($"Context schimbat la: {newContext?.ContextName}");
};
```

### ChangeContextRequested

```csharp
ContextService.ChangeContextRequested += (sender, args) =>
{
    // Deschide UI pentru schimbare context
    ShowContextSelector();
};
```

### ChangeContextRequestedCard

```csharp
ContextService.ChangeContextRequestedCard += (sender, args) =>
{
    // Deschide selector tip card
    ShowContextCards();
};
```

## Persistență Context

Serviciul folosește `ICurrentUserContextService` pentru persistența selecției:

```csharp
// Salvare în localStorage/sessionStorage
await _currentUserContextService.Set(contextId, isSelected);

// Recuperare
var savedContext = await _currentUserContextService.GetSelectedContext();
```

## Integrare cu ApplicationModel

```csharp
// Contexte disponibile sunt încărcate din ApplicationModel
var contexts = (await _applicationModelLoader.Load())?.UserContexts;
```

## Cazuri Speciale

### Context Individual Implicit

Dacă nu există context selectat, serviciul selectează automat contextul Individual:

```csharp
if (string.IsNullOrEmpty(selectedContext?.ContextId))
{
    var individualContext = contexts.FirstOrDefault(c => c.ContextType == UserContextType.Individual);
    await SetCurrent(individualContext, contexts.Count() == 1);
    return individualContext;
}
```

### Clear Data

```csharp
// Șterge toate datele de context
await ContextService.ClearData();
```

## Best Practices

1. **Verificați context la inițializare** - Asigurați-vă că există un context valid
2. **Abonați-vă la evenimente** - Pentru a reacționa la schimbări
3. **Dezabonați-vă corect** - Preveniți memory leaks
4. **Validați contextul pentru operații** - Unele acțiuni pot fi restricționate pe context
5. **Oferiți feedback vizual** - Arătați clar contextul activ

## Troubleshooting

### Context nu se păstrează după refresh
- Verificați implementarea `ICurrentUserContextService`
- Asigurați-vă că localStorage/sessionStorage funcționează

### Evenimente nu se declanșează
- Verificați abonarea corectă la evenimente
- Folosiți `InvokeAsync(StateHasChanged)` în handler

### Context Individual nu apare
- Verificați că ApplicationModel conține contextul Individual
- Verificați permisiunile utilizatorului

## Concluzie

ContextService este fundamental pentru aplicațiile multi-context, oferind o gestionare completă a contextelor utilizator cu suport pentru persistență, evenimente și integrare ușoară în UI. Este esențial pentru aplicații care permit acțiuni atât personale cât și în numele organizațiilor.