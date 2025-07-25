# FodCustomMultipleGroupSelect

## Documentație pentru componenta FodCustomMultipleGroupSelect

### 1. Descriere Generală

`FodCustomMultipleGroupSelect<T>` este o componentă de selecție multiplă cu suport pentru grupare a opțiunilor. Permite utilizatorilor să selecteze mai multe elemente dintr-o listă organizată în grupuri, cu checkbox-uri pentru fiecare opțiune.

Caracteristici principale:
- Selecție multiplă cu checkbox-uri
- Grupare opțiuni cu etichete
- Afișare opțiuni selectate inline
- Suport pentru opțiuni dezactivate/ascunse
- Dropdown cu scroll pentru liste lungi
- Validare integrată cu EditForm
- Tipizare generică cu constrângere ICustomSelectItem
- Stilizare inclusă

### 2. Utilizare de Bază

#### Selecție multiplă simplă
```razor
<FodCustomMultipleGroupSelect T="CustomOption" 
                              @bind-Value="selectedOptions"
                              Source="optionGroups"
                              DefaultOptionText="Selectați opțiunile..." />

@code {
    private List<CustomOption> selectedOptions = new();
    private IEnumerable<CustomSelectItemGroup> optionGroups;
    
    protected override void OnInitialized()
    {
        optionGroups = new List<CustomSelectItemGroup>
        {
            new CustomSelectItemGroup
            {
                Label = "Opțiuni principale",
                Members = new List<CustomOption>
                {
                    new() { Value = "1", Label = "Opțiunea 1" },
                    new() { Value = "2", Label = "Opțiunea 2" }
                }
            }
        };
    }
    
    public class CustomOption : ICustomSelectItem
    {
        public string Value { get; set; }
        public string Label { get; set; }
        public bool Disabled { get; set; }
        public bool Hidden { get; set; }
        public bool isChecked { get; set; }
    }
}
```

#### Selecție cu grupuri multiple
```razor
<FodCustomMultipleGroupSelect T="PermissionItem" 
                              @bind-Value="selectedPermissions"
                              Source="permissionGroups" />

@code {
    private List<PermissionItem> selectedPermissions = new();
    
    private IEnumerable<CustomSelectItemGroup> permissionGroups = new[]
    {
        new CustomSelectItemGroup
        {
            Label = "Citire",
            Members = new List<PermissionItem>
            {
                new() { Value = "read_users", Label = "Citire utilizatori" },
                new() { Value = "read_reports", Label = "Citire rapoarte" },
                new() { Value = "read_settings", Label = "Citire setări" }
            }
        },
        new CustomSelectItemGroup
        {
            Label = "Scriere",
            Members = new List<PermissionItem>
            {
                new() { Value = "write_users", Label = "Modificare utilizatori" },
                new() { Value = "write_reports", Label = "Creare rapoarte" },
                new() { Value = "write_settings", Label = "Modificare setări" }
            }
        },
        new CustomSelectItemGroup
        {
            Label = "Administrare",
            Members = new List<PermissionItem>
            {
                new() { Value = "delete_users", Label = "Ștergere utilizatori", Disabled = true },
                new() { Value = "admin_system", Label = "Administrare sistem" }
            }
        }
    };
}
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `List<T>` | Lista elementelor selectate | `new List<T>()` |
| `Source` | `IEnumerable<CustomSelectItemGroup>` | Sursa de date cu grupuri | - |
| `DefaultOptionText` | `string` | Text afișat când nu există selecție | `"Select..."` |
| `DefaultOption` | `bool` | Afișează opțiunea implicită | `true` |
| `OnValueChanged` | `EventCallback<List<T>>` | Eveniment la schimbare selecție | - |
| `Readonly` | `bool` | Dezactivează componenta | `false` |

### 4. Interfețe și Modele

#### ICustomSelectItem
```csharp
public interface ICustomSelectItem
{
    string Value { get; set; }      // Valoarea unică
    string Label { get; set; }      // Textul afișat
    bool Disabled { get; set; }     // Dezactivat
    bool Hidden { get; set; }       // Ascuns
    bool isChecked { get; set; }    // Stare selecție
}
```

#### CustomSelectItemGroup
```csharp
public class CustomSelectItemGroup
{
    public string Label { get; set; }                    // Numele grupului
    public IEnumerable<ICustomSelectItem> Members { get; set; }  // Membrii grupului
}
```

### 5. Exemple Avansate

#### Selector de roluri și permisiuni
```razor
<EditForm Model="userModel" OnValidSubmit="SaveUser">
    <DataAnnotationsValidator />
    
    <FodCustomMultipleGroupSelect T="RolePermission" 
                                  @bind-Value="userModel.Permissions"
                                  Source="rolePermissionGroups"
                                  DefaultOptionText="Selectați rolurile și permisiunile..."
                                  OnValueChanged="UpdatePermissionSummary" />
    
    @if (selectedCount > 0)
    {
        <FodText Typo="Typo.caption" Color="FodColor.Secondary">
            @selectedCount permisiuni selectate
        </FodText>
    }
    
    <ValidationMessage For="@(() => userModel.Permissions)" />
    
    <FodButton Type="submit" Color="FodColor.Primary">
        Salvează utilizator
    </FodButton>
</EditForm>

@code {
    private UserModel userModel = new();
    private int selectedCount = 0;
    
    private IEnumerable<CustomSelectItemGroup> rolePermissionGroups = new[]
    {
        new CustomSelectItemGroup
        {
            Label = "Roluri standard",
            Members = new List<RolePermission>
            {
                new() { 
                    Value = "role_viewer", 
                    Label = "Vizualizator", 
                    Description = "Poate doar vizualiza date" 
                },
                new() { 
                    Value = "role_editor", 
                    Label = "Editor", 
                    Description = "Poate edita date existente" 
                },
                new() { 
                    Value = "role_creator", 
                    Label = "Creator", 
                    Description = "Poate crea date noi" 
                }
            }
        },
        new CustomSelectItemGroup
        {
            Label = "Permisiuni speciale",
            Members = new List<RolePermission>
            {
                new() { 
                    Value = "perm_export", 
                    Label = "Export date", 
                    RequiresApproval = true 
                },
                new() { 
                    Value = "perm_bulk_ops", 
                    Label = "Operații în masă", 
                    RequiresApproval = true 
                },
                new() { 
                    Value = "perm_api_access", 
                    Label = "Acces API", 
                    Disabled = !userModel.IsVerified 
                }
            }
        }
    };
    
    private void UpdatePermissionSummary(List<RolePermission> permissions)
    {
        selectedCount = permissions.Count;
        
        // Verifică permisiuni care necesită aprobare
        var requiresApproval = permissions.Any(p => p.RequiresApproval);
        if (requiresApproval)
        {
            ShowNotification("Unele permisiuni necesită aprobare suplimentară", 
                           FodSeverity.Warning);
        }
    }
    
    public class RolePermission : ICustomSelectItem
    {
        public string Value { get; set; }
        public string Label { get; set; }
        public bool Disabled { get; set; }
        public bool Hidden { get; set; }
        public bool isChecked { get; set; }
        
        // Proprietăți adiționale
        public string Description { get; set; }
        public bool RequiresApproval { get; set; }
    }
}
```

#### Selector de categorii cu subcategorii
```razor
<FodCustomMultipleGroupSelect T="CategoryItem" 
                              @bind-Value="selectedCategories"
                              Source="categoryGroups"
                              DefaultOptionText="Alegeți categoriile..." />

<div class="mt-3">
    <h5>Categorii selectate:</h5>
    @foreach (var category in selectedCategories)
    {
        <FodChip Color="FodColor.Primary" Size="FodSize.Small" Class="ma-1">
            @category.Label
        </FodChip>
    }
</div>

@code {
    private List<CategoryItem> selectedCategories = new();
    
    private IEnumerable<CustomSelectItemGroup> categoryGroups;
    
    protected override async Task OnInitializedAsync()
    {
        // Încarcă categoriile din API
        var categories = await CategoryService.GetCategoriesAsync();
        
        categoryGroups = categories
            .Where(c => c.ParentId == null)
            .Select(parent => new CustomSelectItemGroup
            {
                Label = parent.Name,
                Members = categories
                    .Where(c => c.ParentId == parent.Id)
                    .Select(child => new CategoryItem
                    {
                        Value = child.Id.ToString(),
                        Label = child.Name,
                        ParentCategory = parent.Name,
                        Icon = child.Icon
                    })
            });
    }
    
    public class CategoryItem : ICustomSelectItem
    {
        public string Value { get; set; }
        public string Label { get; set; }
        public bool Disabled { get; set; }
        public bool Hidden { get; set; }
        public bool isChecked { get; set; }
        
        public string ParentCategory { get; set; }
        public string Icon { get; set; }
    }
}
```

#### Selector dinamic cu filtrare
```razor
<div class="mb-3">
    <FodTextField @bind-Value="searchTerm" 
                  Label="Caută opțiuni"
                  Immediate="true"
                  DebounceInterval="300"
                  OnDebounceIntervalElapsed="FilterOptions" />
</div>

<FodCustomMultipleGroupSelect T="DynamicOption" 
                              @bind-Value="selectedOptions"
                              Source="filteredGroups"
                              DefaultOptionText="Selectați din rezultate..." />

@code {
    private List<DynamicOption> selectedOptions = new();
    private IEnumerable<CustomSelectItemGroup> allGroups;
    private IEnumerable<CustomSelectItemGroup> filteredGroups;
    private string searchTerm = "";
    
    protected override void OnInitialized()
    {
        allGroups = GenerateAllGroups();
        filteredGroups = allGroups;
    }
    
    private void FilterOptions()
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            filteredGroups = allGroups;
            return;
        }
        
        filteredGroups = allGroups
            .Select(group => new CustomSelectItemGroup
            {
                Label = group.Label,
                Members = group.Members
                    .Cast<DynamicOption>()
                    .Where(m => m.Label.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                               m.Tags.Any(t => t.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)))
            })
            .Where(g => g.Members.Any());
            
        StateHasChanged();
    }
    
    public class DynamicOption : ICustomSelectItem
    {
        public string Value { get; set; }
        public string Label { get; set; }
        public bool Disabled { get; set; }
        public bool Hidden { get; set; }
        public bool isChecked { get; set; }
        
        public List<string> Tags { get; set; } = new();
    }
}
```

### 6. Stilizare Personalizată

Componenta include stiluri inline, dar pot fi suprascrse:

```css
/* Override stiluri implicite */
.fod-custom-select .fod-dropdown {
    max-height: 300px; /* Mărime dropdown */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Grupuri cu culori diferite */
.fod-custom-select .fod-group:nth-child(odd) {
    background-color: #f8f9fa;
}

/* Opțiuni selectate evidențiate */
.fod-custom-select .fod-option input[type="checkbox"]:checked + label {
    font-weight: 600;
    color: var(--fod-palette-primary-main);
}

/* Chips pentru elemente selectate */
.fod-custom-select .selected-item {
    background-color: var(--fod-palette-primary-light);
    color: var(--fod-palette-primary-contrastText);
    font-size: 0.875rem;
}

/* Opțiuni dezactivate */
.fod-custom-select .fod-option[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
}
```

### 7. Integrare cu Validare

```razor
<EditForm Model="formModel">
    <DataAnnotationsValidator />
    
    <FodCustomMultipleGroupSelect T="SkillItem" 
                                  @bind-Value="formModel.RequiredSkills"
                                  Source="skillGroups" />
    
    <ValidationMessage For="@(() => formModel.RequiredSkills)" />
</EditForm>

@code {
    public class FormModel
    {
        [Required(ErrorMessage = "Selectați cel puțin o competență")]
        [MinLength(1, ErrorMessage = "Minim o competență necesară")]
        [MaxLength(5, ErrorMessage = "Maxim 5 competențe")]
        public List<SkillItem> RequiredSkills { get; set; } = new();
    }
}
```

### 8. Evenimente și Callback-uri

```razor
<FodCustomMultipleGroupSelect T="NotificationOption" 
                              @bind-Value="userNotifications"
                              Source="notificationGroups"
                              OnValueChanged="HandleNotificationChange" />

@code {
    private async Task HandleNotificationChange(List<NotificationOption> selected)
    {
        // Verifică combinații incompatibile
        if (selected.Any(n => n.Value == "email_all") && 
            selected.Any(n => n.Value.StartsWith("email_specific")))
        {
            ShowWarning("Nu puteți selecta 'Toate email-urile' împreună cu opțiuni specifice");
        }
        
        // Salvează preferințe
        await UserPreferencesService.SaveNotificationSettings(selected);
    }
}
```

### 9. Best Practices

1. **Implementare ICustomSelectItem** - Asigurați implementarea completă
2. **Grupare logică** - Organizați opțiunile în grupuri clare
3. **Limite de selecție** - Impuneți limite pentru UX mai bun
4. **Feedback vizual** - Afișați numărul de selecții
5. **Performanță** - Pentru liste mari, implementați virtualizare
6. **Accesibilitate** - Includeți etichete descriptive

### 10. Performanță

Pentru liste mari de opțiuni:

```razor
@code {
    private async Task<IEnumerable<CustomSelectItemGroup>> LoadOptionsAsync()
    {
        // Încarcă doar grupurile vizibile inițial
        var visibleGroups = await OptionService.GetTopGroupsAsync(10);
        
        // Încarcă restul asincron
        _ = Task.Run(async () =>
        {
            var allGroups = await OptionService.GetAllGroupsAsync();
            await InvokeAsync(() =>
            {
                optionGroups = allGroups;
                StateHasChanged();
            });
        });
        
        return visibleGroups;
    }
}
```

### 11. Troubleshooting

#### Selecțiile nu se păstrează
- Verificați că `Value` este unic pentru fiecare opțiune
- Verificați implementarea `isChecked` în model
- Asigurați-vă că lista Value este inițializată

#### Grupurile nu apar
- Verificați că `Source` conține date
- Verificați că `Members` nu este gol pentru fiecare grup
- Verificați că modelul implementează `ICustomSelectItem`

#### Dropdown nu se închide
- Adăugați handler pentru click în afara componentei
- Implementați `@onfocusout` pentru închidere automată

### 12. Concluzie

`FodCustomMultipleGroupSelect` oferă o soluție completă pentru selecții multiple organizate în grupuri. Cu suport pentru validare, personalizare și o interfață intuitivă cu checkbox-uri, componenta este ideală pentru scenarii complexe de selecție în aplicațiile FOD.