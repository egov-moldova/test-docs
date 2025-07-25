# Group Select

## Documentație pentru componentele FodGroupSelect

Biblioteca FOD oferă trei componente pentru select-uri cu grupare:
- `FodGroupSelect` - Select standard cu grupuri de opțiuni
- `FodCustomGroupSelect` - Select stilizat cu grupuri
- `FodCustomMultipleGroupSelect` - Select stilizat cu selecție multiplă

### 1. FodGroupSelect

#### Descriere Generală
`FodGroupSelect` este o componentă dropdown care permite organizarea opțiunilor în grupuri logice folosind elementul HTML nativ `<optgroup>`. Este ideală pentru liste lungi de opțiuni care pot fi categorizate.

Caracteristici principale:
- Grupare nativă cu `<optgroup>`
- Suport pentru tipuri generice
- Opțiune implicită configurabilă
- Validare integrată
- Two-way data binding
- Localizare automată
- Accesibilitate completă

#### Ghid de Utilizare API

##### Select grupat de bază
```razor
<FodGroupSelect T="City" 
                @bind-Value="selectedCity"
                Source="@cityGroups" />

@code {
    private City? selectedCity;
    private List<SelectItemGroup> cityGroups = new();
    
    public class City : ISelectItem
    {
        public string Value { get; set; }
        public string Label { get; set; }
        public string County { get; set; }
    }
    
    protected override void OnInitialized()
    {
        cityGroups = new List<SelectItemGroup>
        {
            new SelectItemGroup
            {
                Label = "București",
                Members = new List<City>
                {
                    new() { Value = "sector1", Label = "Sector 1" },
                    new() { Value = "sector2", Label = "Sector 2" },
                    new() { Value = "sector3", Label = "Sector 3" }
                }
            },
            new SelectItemGroup
            {
                Label = "Transilvania",
                Members = new List<City>
                {
                    new() { Value = "cluj", Label = "Cluj-Napoca" },
                    new() { Value = "brasov", Label = "Brașov" },
                    new() { Value = "sibiu", Label = "Sibiu" }
                }
            },
            new SelectItemGroup
            {
                Label = "Moldova",
                Members = new List<City>
                {
                    new() { Value = "iasi", Label = "Iași" },
                    new() { Value = "bacau", Label = "Bacău" },
                    new() { Value = "suceava", Label = "Suceava" }
                }
            }
        };
    }
}
```

##### Select fără opțiune implicită
```razor
<FodGroupSelect T="Department" 
                @bind-Value="selectedDepartment"
                Source="@departmentGroups"
                DefaultOption="false" />
```

##### Select cu text personalizat pentru opțiunea implicită
```razor
<FodGroupSelect T="Product" 
                @bind-Value="selectedProduct"
                Source="@productGroups"
                DefaultOptionText="-- Alegeți un produs --" />
```

##### Formular cu validare
```razor
<EditForm Model="@orderForm" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <div class="mb-3">
        <FodGroupSelect T="Service" 
                        @bind-Value="orderForm.Service"
                        Source="@serviceGroups"
                        Label="Serviciu" />
        <ValidationMessage For="@(() => orderForm.Service)" />
    </div>
    
    <FodButton Type="ButtonType.Submit">Comandă</FodButton>
</EditForm>

@code {
    private OrderForm orderForm = new();
    private List<SelectItemGroup> serviceGroups = new();
    
    public class OrderForm
    {
        [Required(ErrorMessage = "Serviciul este obligatoriu")]
        public Service? Service { get; set; }
    }
    
    public class Service : ISelectItem
    {
        public string Value { get; set; }
        public string Label { get; set; }
        public decimal Price { get; set; }
    }
    
    protected override void OnInitialized()
    {
        serviceGroups = new List<SelectItemGroup>
        {
            new SelectItemGroup
            {
                Label = "Servicii IT",
                Members = new List<Service>
                {
                    new() { Value = "web-dev", Label = "Dezvoltare Web", Price = 500 },
                    new() { Value = "mobile-dev", Label = "Dezvoltare Mobile", Price = 800 },
                    new() { Value = "consulting", Label = "Consultanță IT", Price = 200 }
                }
            },
            new SelectItemGroup
            {
                Label = "Servicii Marketing",
                Members = new List<Service>
                {
                    new() { Value = "seo", Label = "Optimizare SEO", Price = 300 },
                    new() { Value = "social", Label = "Social Media", Price = 250 },
                    new() { Value = "content", Label = "Content Marketing", Price = 400 }
                }
            }
        };
    }
}
```

#### Atribute FodGroupSelect

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `T` | Valoarea selectată | `default(T)` |
| `ValueChanged` | `EventCallback<T>` | Eveniment la schimbarea valorii | - |
| `Source` | `IEnumerable<SelectItemGroup>` | Grupurile de opțiuni | - |
| `DefaultOption` | `bool` | Afișează opțiune implicită | `true` |
| `DefaultOptionText` | `string` | Text opțiune implicită | `"Select..."` |
| `Label` | `string` | Eticheta câmpului | `null` |
| `Disabled` | `bool` | Dezactivează componenta | `false` |
| `ReadOnly` | `bool` | Doar citire | `false` |
| `Required` | `bool` | Câmp obligatoriu | `false` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |

### 2. FodCustomGroupSelect

#### Descriere Generală
`FodCustomGroupSelect` oferă un select stilizat cu funcționalități extinse precum dezactivarea individuală a opțiunilor și design personalizat.

#### Ghid de Utilizare API

##### Select stilizat cu opțiuni dezactivate
```razor
<FodCustomGroupSelect T="Feature" 
                      @bind-Value="selectedFeature"
                      Source="@featureGroups" />

@code {
    private Feature? selectedFeature;
    private List<SelectItemGroup> featureGroups = new();
    
    public class Feature : ICustomSelectItem
    {
        public string Value { get; set; }
        public string Label { get; set; }
        public bool Disabled { get; set; }
        public bool Hidden { get; set; }
        public bool isChecked { get; set; }
        public bool IsPremium { get; set; }
    }
    
    protected override void OnInitialized()
    {
        featureGroups = new List<SelectItemGroup>
        {
            new SelectItemGroup
            {
                Label = "Funcții de bază",
                Members = new List<Feature>
                {
                    new() { Value = "basic1", Label = "Editor text" },
                    new() { Value = "basic2", Label = "Salvare automată" },
                    new() { Value = "basic3", Label = "Export PDF" }
                }
            },
            new SelectItemGroup
            {
                Label = "Funcții Premium",
                Members = new List<Feature>
                {
                    new() { Value = "premium1", Label = "Colaborare în timp real", 
                           Disabled = !userHasPremium, IsPremium = true },
                    new() { Value = "premium2", Label = "Istoric versiuni", 
                           Disabled = !userHasPremium, IsPremium = true },
                    new() { Value = "premium3", Label = "API Access", 
                           Disabled = !userHasPremium, IsPremium = true }
                }
            }
        };
    }
}
```

##### Select cu stilizare personalizată
```razor
<FodCustomGroupSelect T="Theme" 
                      @bind-Value="selectedTheme"
                      Source="@themeGroups"
                      Class="theme-selector"
                      Style="width: 300px;" />

<style>
    .theme-selector {
        --select-bg: #f5f5f5;
        --select-border: #ddd;
        --select-hover: #e0e0e0;
        --select-focus: #2196f3;
    }
    
    .theme-selector .select-header {
        background-color: var(--select-bg);
        border-color: var(--select-border);
    }
    
    .theme-selector .select-option:hover {
        background-color: var(--select-hover);
    }
</style>
```

#### Atribute FodCustomGroupSelect

Moștenește toate atributele de la FodGroupSelect plus:
- Suport pentru `ICustomSelectItem` cu proprietăți `Disabled` și `Hidden`
- Stilizare CSS customizată
- Animații pentru deschidere/închidere

### 3. FodCustomMultipleGroupSelect

#### Descriere Generală
`FodCustomMultipleGroupSelect` permite selecția multiplă a opțiunilor cu afișare tip tags și checkboxes.

#### Ghid de Utilizare API

##### Select multiplu de bază
```razor
<FodCustomMultipleGroupSelect T="Permission" 
                              @bind-Value="selectedPermissions"
                              Source="@permissionGroups" />

@code {
    private List<Permission> selectedPermissions = new();
    private List<SelectItemGroup> permissionGroups = new();
    
    public class Permission : ICustomSelectItem
    {
        public string Value { get; set; }
        public string Label { get; set; }
        public bool Disabled { get; set; }
        public bool Hidden { get; set; }
        public bool isChecked { get; set; }
        public string Category { get; set; }
    }
    
    protected override void OnInitialized()
    {
        permissionGroups = new List<SelectItemGroup>
        {
            new SelectItemGroup
            {
                Label = "Permisiuni citire",
                Members = new List<Permission>
                {
                    new() { Value = "read.users", Label = "Citire utilizatori" },
                    new() { Value = "read.reports", Label = "Citire rapoarte" },
                    new() { Value = "read.settings", Label = "Citire setări" }
                }
            },
            new SelectItemGroup
            {
                Label = "Permisiuni scriere",
                Members = new List<Permission>
                {
                    new() { Value = "write.users", Label = "Modificare utilizatori" },
                    new() { Value = "write.reports", Label = "Creare rapoarte" },
                    new() { Value = "write.settings", Label = "Modificare setări" }
                }
            },
            new SelectItemGroup
            {
                Label = "Permisiuni administrative",
                Members = new List<Permission>
                {
                    new() { Value = "admin.users", Label = "Ștergere utilizatori", 
                           Disabled = !isAdmin },
                    new() { Value = "admin.system", Label = "Configurare sistem", 
                           Disabled = !isAdmin }
                }
            }
        };
    }
}
```

##### Select multiplu cu limite
```razor
<FodCustomMultipleGroupSelect T="Tag" 
                              @bind-Value="selectedTags"
                              Source="@tagGroups"
                              MaxSelections="5"
                              OnSelectionChanged="@ValidateTagSelection" />

@if (selectedTags.Count >= 5)
{
    <FodAlert Severity="Severity.Info" Class="mt-2">
        Ați atins limita maximă de 5 tag-uri.
    </FodAlert>
}

@code {
    private List<Tag> selectedTags = new();
    private int MaxSelections = 5;
    
    private void ValidateTagSelection()
    {
        if (selectedTags.Count > MaxSelections)
        {
            selectedTags = selectedTags.Take(MaxSelections).ToList();
            StateHasChanged();
        }
    }
}
```

##### Select multiplu cu afișare personalizată
```razor
<FodCustomMultipleGroupSelect T="Skill" 
                              @bind-Value="selectedSkills"
                              Source="@skillGroups">
    <SelectedItemTemplate Context="skill">
        <FodChip Color="FodColor.Primary" 
                 Size="FodSize.Small"
                 OnClose="@(() => RemoveSkill(skill))">
            @skill.Label
        </FodChip>
    </SelectedItemTemplate>
</FodCustomMultipleGroupSelect>

<div class="mt-3">
    <FodText Typo="Typo.body2">
        Competențe selectate: @string.Join(", ", selectedSkills.Select(s => s.Label))
    </FodText>
</div>
```

#### Atribute FodCustomMultipleGroupSelect

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `List<T>` | Lista valorilor selectate | `new List<T>()` |
| `ValueChanged` | `EventCallback<List<T>>` | Eveniment la schimbare | - |
| `MaxSelections` | `int?` | Număr maxim selecții | `null` |
| `MinSelections` | `int?` | Număr minim selecții | `null` |
| `ShowSelectedCount` | `bool` | Afișează număr selectate | `true` |
| `SelectedItemTemplate` | `RenderFragment<T>` | Template pentru itemi selectați | - |

### 4. Model de date

#### ISelectItem
```csharp
public interface ISelectItem
{
    string Value { get; set; }
    string Label { get; set; }
}
```

#### SelectItemGroup
```csharp
public class SelectItemGroup
{
    public string Label { get; set; }
    public IEnumerable<ISelectItem> Members { get; set; }
}
```

#### ICustomSelectItem
```csharp
public interface ICustomSelectItem : ISelectItem
{
    bool Disabled { get; set; }
    bool Hidden { get; set; }
    bool isChecked { get; set; }
}
```

### 5. Exemple complexe

#### Dashboard cu filtre grupate
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Filtre raport
        </FodText>
        
        <FodGrid Container="true" Spacing="2">
            <FodGrid Item="true" xs="12" md="6">
                <FodGroupSelect T="ReportType" 
                                @bind-Value="filters.ReportType"
                                Source="@reportTypeGroups"
                                Label="Tip raport" />
            </FodGrid>
            
            <FodGrid Item="true" xs="12" md="6">
                <FodCustomMultipleGroupSelect T="Department" 
                                              @bind-Value="filters.Departments"
                                              Source="@departmentGroups"
                                              Label="Departamente" />
            </FodGrid>
        </FodGrid>
        
        <FodButton Color="FodColor.Primary" 
                   OnClick="GenerateReport"
                   Class="mt-3">
            Generează raport
        </FodButton>
    </FodCardContent>
</FodCard>

@code {
    private ReportFilters filters = new();
    
    public class ReportFilters
    {
        public ReportType? ReportType { get; set; }
        public List<Department> Departments { get; set; } = new();
    }
}
```

#### Formular de configurare roluri
```razor
<EditForm Model="@roleConfig" OnValidSubmit="SaveRoleConfiguration">
    <FodText Typo="Typo.h5" GutterBottom="true">
        Configurare rol: @role.Name
    </FodText>
    
    <div class="mb-4">
        <FodCustomMultipleGroupSelect T="Permission" 
                                      @bind-Value="roleConfig.Permissions"
                                      Source="@permissionGroups"
                                      Label="Permisiuni"
                                      Required="true" />
        <ValidationMessage For="@(() => roleConfig.Permissions)" />
    </div>
    
    <div class="mb-4">
        <FodGroupSelect T="AccessLevel" 
                        @bind-Value="roleConfig.AccessLevel"
                        Source="@accessLevelGroups"
                        Label="Nivel acces"
                        DefaultOption="false" />
    </div>
    
    <FodButton Type="ButtonType.Submit" Color="FodColor.Primary">
        Salvează configurația
    </FodButton>
</EditForm>
```

### 6. Stilizare și personalizare

```css
/* Stilizare pentru grup headers */
.fod-group-select optgroup {
    font-weight: bold;
    color: var(--fod-palette-primary-main);
}

/* Select custom cu teme */
.custom-select-dark {
    background-color: #2d2d2d;
    color: #ffffff;
}

.custom-select-dark .select-option:hover {
    background-color: #3d3d3d;
}

.custom-select-dark .group-label {
    color: #888;
    font-size: 0.85em;
    text-transform: uppercase;
}

/* Tags pentru multiple select */
.selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-height: 40px;
}

.selected-tag {
    background-color: var(--fod-palette-primary-light);
    color: var(--fod-palette-primary-contrastText);
    padding: 0.25rem 0.5rem;
    border-radius: 16px;
    font-size: 0.875rem;
}
```

### 7. Integrare cu alte componente

#### În Modal
```razor
<FodModal Show="@showAssignModal">
    <FodModalContent>
        <FodModalHeader>
            <FodText Typo="Typo.h6">Asignare task</FodText>
        </FodModalHeader>
        <FodModalBody>
            <FodCustomMultipleGroupSelect T="User" 
                                          @bind-Value="assignedUsers"
                                          Source="@userGroups"
                                          Label="Asignați către" />
        </FodModalBody>
        <FodModalFooter>
            <FodButton OnClick="AssignTask">Asignează</FodButton>
        </FodModalFooter>
    </FodModalContent>
</FodModal>
```

### 8. Validare

```razor
public class CustomValidator : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, 
        ValidationContext validationContext)
    {
        if (value is List<Permission> permissions)
        {
            if (permissions.Count == 0)
                return new ValidationResult("Selectați cel puțin o permisiune");
                
            if (permissions.Any(p => p.Value.StartsWith("admin")) && 
                !permissions.Any(p => p.Value.StartsWith("read")))
                return new ValidationResult(
                    "Permisiunile administrative necesită și permisiuni de citire");
        }
        
        return ValidationResult.Success;
    }
}
```

### 9. Performanță

- Pentru liste foarte mari (>1000 elemente), considerați paginare sau filtrare
- Folosiți `Hidden` pentru a ascunde temporar opțiuni în loc să le eliminați
- Implementați lazy loading pentru grupuri mari

### 10. Accesibilitate

- Folosiți labels descriptive pentru grupuri
- Asigurați contrast suficient pentru text
- Suport complet pentru navigare cu tastatură
- ARIA labels pentru screen readers

### 11. Bune practici

1. **Grupare logică** - Organizați opțiunile în categorii clare
2. **Limite rezonabile** - Nu depășiți 100-200 opțiuni totale
3. **Labels clare** - Folosiți denumiri descriptive pentru grupuri
4. **Validare** - Implementați validare pentru selecții multiple
5. **Feedback vizual** - Indicați clar opțiunile dezactivate
6. **Responsive** - Testați pe diferite dimensiuni de ecran

### 12. Troubleshooting

#### Opțiunile nu apar în grupuri
- Verificați că `SelectItemGroup.Label` este setat
- Verificați că `Members` conține elemente

#### Selecția multiplă nu funcționează
- Verificați că folosiți `FodCustomMultipleGroupSelect`
- Verificați că Value este de tip `List<T>`

#### Opțiuni dezactivate pot fi selectate
- Verificați că modelul implementează `ICustomSelectItem`
- Verificați logica de handling pentru `Disabled`

### 13. Concluzie
Componentele GroupSelect din FOD oferă soluții flexibile pentru organizarea opțiunilor în grupuri logice. De la select-ul nativ simplu până la variante stilizate cu selecție multiplă, acestea acoperă majoritatea scenariilor de utilizare pentru formulare complexe.