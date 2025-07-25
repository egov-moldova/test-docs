# FodSelect1

## Documentație pentru componenta FodSelect1

### 1. Descriere Generală

`FodSelect1` este o variantă alternativă a componentei de selecție dropdown care extinde `FodBaseInput<T>`. Oferă funcționalități avansate pentru selecție simplă sau multiplă cu suport pentru validare strictă, afișare personalizată și integrare cu FodPopover.

Caracteristici principale:
- Componentă generică pentru orice tip de date
- Suport pentru selecție simplă și multiplă
- Mod strict cu validare listă
- Integrare cu FodPopover pentru afișare dropdown
- Suport pentru "Select All" în modul multi-selecție
- Clearable - ștergere selecție
- Integrare completă cu sistemul de formulare
- Suport pentru afișare personalizată valori

### 2. Utilizare de Bază

#### Select simplu
```razor
<FodSelect1 T="string" @bind-Value="selectedCountry" Label="Țară">
    <FodSelectItem Value="@("RO")">România</FodSelectItem>
    <FodSelectItem Value="@("MD")">Moldova</FodSelectItem>
    <FodSelectItem Value="@("BG")">Bulgaria</FodSelectItem>
</FodSelect1>

@code {
    private string selectedCountry = "RO";
}
```

#### Select cu multi-selecție
```razor
<FodSelect1 T="string" @bind-SelectedValues="selectedLanguages" 
            Label="Limbi vorbite"
            MultiSelection="true"
            SelectAll="true"
            SelectAllText="Selectează toate">
    <FodSelectItem Value="@("ro")">Română</FodSelectItem>
    <FodSelectItem Value="@("ru")">Rusă</FodSelectItem>
    <FodSelectItem Value="@("en")">Engleză</FodSelectItem>
    <FodSelectItem Value="@("fr")">Franceză</FodSelectItem>
</FodSelect1>

@code {
    private HashSet<string> selectedLanguages = new() { "ro" };
}
```

### 3. Parametri

| Parametru | Tip | Descriere | Valoare Implicită |
|-----------|-----|-----------|-------------------|
| `T` | `Type` | Tipul generic al valorilor | - |
| `Value` | `T` | Valoarea selectată (single) | - |
| `SelectedValues` | `IEnumerable<T>` | Valorile selectate (multi) | - |
| `Label` | `string` | Eticheta dropdown-ului | - |
| `Placeholder` | `string` | Text placeholder | - |
| `MultiSelection` | `bool` | Activează selecția multiplă | `false` |
| `SelectAll` | `bool` | Afișează opțiunea "Select All" | `false` |
| `SelectAllText` | `string` | Textul pentru "Select All" | - |
| `Clearable` | `bool` | Permite ștergerea selecției | `false` |
| `Strict` | `bool` | Validare strictă a valorilor | `false` |
| `Dense` | `bool` | Mod compact pentru listă | `false` |
| `DisableUnderLine` | `bool` | Dezactivează linia de subliniere | `false` |
| `MaxHeight` | `int` | Înălțimea maximă a listei | `300` |
| `CanRenderValue` | `bool` | Permite randare custom valoare | `false` |
| `LockScroll` | `bool` | Blochează scroll când e deschis | `true` |

### 4. Evenimente

- `ValueChanged` - La schimbarea valorii (single)
- `SelectedValuesChanged` - La schimbarea valorilor (multi)
- `OnClearButtonClick` - La apăsarea butonului clear

### 5. Exemple Avansate

#### Select cu obiecte complexe
```razor
<FodSelect1 T="Department" @bind-Value="selectedDept"
            Label="Departament"
            ToStringFunc="@(dept => dept?.Name)">
    @foreach (var dept in departments)
    {
        <FodSelectItem Value="@dept">
            <div class="d-flex justify-content-between">
                <span>@dept.Name</span>
                <FodChip Size="FodSize.Small">@dept.EmployeeCount angajați</FodChip>
            </div>
        </FodSelectItem>
    }
</FodSelect1>

@code {
    private Department selectedDept;
    private List<Department> departments;
    
    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int EmployeeCount { get; set; }
    }
}
```

#### Select cu validare strictă
```razor
<EditForm Model="@model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodSelect1 T="string" @bind-Value="model.Category"
                Label="Categorie"
                Strict="true"
                Required="true"
                Error="@(context.GetValidationMessages(() => model.Category).Any())"
                ErrorText="@(context.GetValidationMessages(() => model.Category).FirstOrDefault())">
        <FodSelectItem Value="@("electronics")">Electronice</FodSelectItem>
        <FodSelectItem Value="@("clothing")">Îmbrăcăminte</FodSelectItem>
        <FodSelectItem Value="@("food")">Alimente</FodSelectItem>
    </FodSelect1>
    
    <FodButton Type="submit">Salvează</FodButton>
</EditForm>

@code {
    private ProductModel model = new();
    
    public class ProductModel
    {
        [Required(ErrorMessage = "Categoria este obligatorie")]
        public string Category { get; set; }
    }
}
```

#### Select cu grupare și icoane
```razor
<FodSelect1 T="MenuItem" @bind-Value="selectedMenuItem"
            Label="Meniu navigare"
            CanRenderValue="true">
    @foreach (var group in menuGroups)
    {
        <FodListSubheader>@group.Name</FodListSubheader>
        @foreach (var item in group.Items)
        {
            <FodSelectItem Value="@item">
                <div class="d-flex align-items-center gap-2">
                    <FodIcon Icon="@item.Icon" />
                    <span>@item.Label</span>
                    @if (item.IsBeta)
                    {
                        <FodChip Color="FodColor.Warning" Size="FodSize.Small">Beta</FodChip>
                    }
                </div>
            </FodSelectItem>
        }
    }
</FodSelect1>

@code {
    private MenuItem selectedMenuItem;
    private List<MenuGroup> menuGroups;
    
    public class MenuItem
    {
        public string Label { get; set; }
        public string Icon { get; set; }
        public string Route { get; set; }
        public bool IsBeta { get; set; }
    }
}
```

### 6. Integrare cu Formulare

#### Multi-select cu conversie tip
```razor
<FodSelect1 T="int" @bind-SelectedValues="selectedRoleIds"
            Label="Roluri utilizator"
            MultiSelection="true"
            SelectAll="true"
            Clearable="true">
    @foreach (var role in availableRoles)
    {
        <FodSelectItem Value="@role.Id" Disabled="@(!role.IsActive)">
            <div class="d-flex justify-content-between w-100">
                <span>@role.Name</span>
                @if (!role.IsActive)
                {
                    <FodText Typo="Typo.caption" Color="FodColor.TextSecondary">
                        (Inactiv)
                    </FodText>
                }
            </div>
        </FodSelectItem>
    }
</FodSelect1>

<FodText Class="mt-2">
    Roluri selectate: @string.Join(", ", GetSelectedRoleNames())
</FodText>

@code {
    private HashSet<int> selectedRoleIds = new();
    private List<Role> availableRoles;
    
    private IEnumerable<string> GetSelectedRoleNames()
    {
        return availableRoles
            .Where(r => selectedRoleIds.Contains(r.Id))
            .Select(r => r.Name);
    }
}
```

### 7. Stilizare și Personalizare

#### Select cu template personalizat
```razor
<FodSelect1 T="User" @bind-Value="assignedUser"
            Label="Asignat către"
            CanRenderValue="true"
            PopoverClass="user-select-popover"
            ListClass="user-select-list">
    @if (assignedUser != null)
    {
        <SelectedTemplate>
            <div class="d-flex align-items-center gap-2">
                <FodAvatar Size="FodSize.Small">
                    @assignedUser.Initials
                </FodAvatar>
                <span>@assignedUser.FullName</span>
            </div>
        </SelectedTemplate>
    }
    
    @foreach (var user in users)
    {
        <FodSelectItem Value="@user">
            <div class="user-item">
                <FodAvatar>@user.Initials</FodAvatar>
                <div class="user-info">
                    <div class="user-name">@user.FullName</div>
                    <div class="user-role">@user.Department - @user.Role</div>
                </div>
                @if (user.IsOnline)
                {
                    <FodIcon Icon="@FodIcons.Material.Filled.Circle" 
                             Color="FodColor.Success" 
                             Size="FodSize.Small" />
                }
            </div>
        </FodSelectItem>
    }
</FodSelect1>

<style>
    .user-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
    }
    
    .user-info {
        flex: 1;
    }
    
    .user-name {
        font-weight: 500;
    }
    
    .user-role {
        font-size: 0.875rem;
        color: var(--fod-palette-text-secondary);
    }
</style>
```

### 8. Cazuri Speciale

#### Select cu încărcare asincronă
```razor
<FodSelect1 T="string" @bind-Value="selectedCityId"
            Label="Oraș"
            Disabled="@(isLoadingCities || !selectedRegion.HasValue)">
    @if (isLoadingCities)
    {
        <FodSelectItem Value="@("")" Disabled="true">
            <FodLoadingCircular Size="FodSize.Small" /> Se încarcă orașele...
        </FodSelectItem>
    }
    else
    {
        @foreach (var city in cities)
        {
            <FodSelectItem Value="@city.Id">@city.Name</FodSelectItem>
        }
    }
</FodSelect1>

@code {
    private string selectedCityId;
    private int? selectedRegion;
    private List<City> cities = new();
    private bool isLoadingCities;
    
    private async Task OnRegionChanged(int? regionId)
    {
        selectedRegion = regionId;
        selectedCityId = null;
        
        if (regionId.HasValue)
        {
            isLoadingCities = true;
            cities = await CityService.GetCitiesByRegion(regionId.Value);
            isLoadingCities = false;
        }
        else
        {
            cities.Clear();
        }
    }
}
```

### 9. Best Practices

1. **Tipuri generice** - Folosiți tipuri potrivite pentru T
2. **Validare** - Combinați cu DataAnnotationsValidator
3. **Performance** - Pentru liste mari, implementați virtualizare
4. **Accessibility** - Adăugați Label descriptiv
5. **Error handling** - Afișați erori de validare clar
6. **Loading states** - Indicați când datele se încarcă

### 10. Diferențe față de FodSelect

- `FodSelect1` oferă mai mult control asupra afișării
- Suport pentru `CanRenderValue` pentru template-uri custom
- Integrare mai strânsă cu `FodPopover`
- Validare strictă opțională cu `Strict`

### 11. Troubleshooting

#### Valoarea nu se actualizează
- Verificați că `T` implementează corect egalitatea
- Pentru obiecte complexe, override `Equals` și `GetHashCode`
- Verificați că `@bind-Value` este configurat corect

#### Lista nu se deschide
- Verificați că nu există erori JavaScript în consolă
- Verificați z-index pentru overlay
- Asigurați-vă că `Disabled` nu este `true`

### 12. Performanță

Pentru liste mari:
```razor
<FodSelect1 T="string" @bind-Value="selected"
            MaxHeight="400"
            Dense="true">
    <FodVirtualize Items="@largeList" Context="item">
        <FodSelectItem Value="@item">@item</FodSelectItem>
    </FodVirtualize>
</FodSelect1>
```

### 13. Accesibilitate

- Suportă navigare cu tastatură
- ARIA labels pentru screen readers
- Focus management automat
- Anunță schimbările de selecție

### 14. Concluzie

`FodSelect1` este o alternativă robustă la componenta standard FodSelect, oferind funcționalități avansate pentru scenarii complexe de selecție. Cu suport pentru validare strictă, afișare personalizată și multi-selecție, componenta acoperă majoritatea necesităților pentru dropdown-uri în aplicații enterprise.