# FodSelectItem

## Documentație pentru componenta FodSelectItem

### 1. Descriere Generală

`FodSelectItem<T>` reprezintă o opțiune individuală într-un `FodSelect` sau `FodMultiSelect`. Componenta gestionează automat afișarea, selecția și integrarea cu componenta părinte select, oferind suport pentru valori tipizate și afișare personalizată.

Caracteristici principale:
- Suport pentru tipuri generice
- Integrare automată cu FodSelect părinte
- Afișare checkbox pentru multi-select
- Conversie automată a valorilor pentru afișare
- Suport pentru conținut personalizat
- Gestionare automată a stării de selecție
- Suport pentru elemente dezactivate

### 2. Utilizare de Bază

#### Select simplu cu opțiuni
```razor
<FodSelect T="string" @bind-Value="selectedCountry" Label="Țară">
    <FodSelectItem Value="@("RO")">România</FodSelectItem>
    <FodSelectItem Value="@("MD")">Moldova</FodSelectItem>
    <FodSelectItem Value="@("BG")">Bulgaria</FodSelectItem>
    <FodSelectItem Value="@("UA")">Ucraina</FodSelectItem>
</FodSelect>

@code {
    private string selectedCountry = "RO";
}
```

#### Select cu valori numerice
```razor
<FodSelect T="int" @bind-Value="selectedPriority" Label="Prioritate">
    <FodSelectItem Value="1">Scăzută</FodSelectItem>
    <FodSelectItem Value="2">Normală</FodSelectItem>
    <FodSelectItem Value="3">Înaltă</FodSelectItem>
    <FodSelectItem Value="4">Urgentă</FodSelectItem>
</FodSelect>

@code {
    private int selectedPriority = 2;
}
```

#### Multi-select cu checkbox-uri
```razor
<FodSelect T="string" @bind-SelectedValues="selectedLanguages" 
           Label="Limbi vorbite" 
           MultiSelection="true">
    <FodSelectItem Value="@("ro")">Română</FodSelectItem>
    <FodSelectItem Value="@("en")">Engleză</FodSelectItem>
    <FodSelectItem Value="@("fr")">Franceză</FodSelectItem>
    <FodSelectItem Value="@("de")">Germană</FodSelectItem>
    <FodSelectItem Value="@("es")">Spaniolă</FodSelectItem>
</FodSelect>

@code {
    private IEnumerable<string> selectedLanguages = new[] { "ro", "en" };
}
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `T` | Valoarea asociată opțiunii | - |
| `Disabled` | `bool` | Dezactivează opțiunea | `false` |
| `ChildContent` | `RenderFragment` | Conținut personalizat de afișat | - |
| `Class` | `string` | Clase CSS adiționale | - |
| `Style` | `string` | Stiluri inline | - |

### 4. Proprietăți Calculate

| Proprietate | Tip | Descriere |
|-------------|-----|-----------|
| `MultiSelection` | `bool` | Reflectă starea multi-select a părintelui |
| `IsSelected` | `bool` | Starea de selecție (doar pentru multi-select) |
| `CheckBoxIcon` | `string` | Iconița checkbox bazată pe stare |
| `DisplayString` | `string` | Text afișat (folosind converter) |

### 5. Exemple Avansate

#### Select cu obiecte complexe
```razor
<FodSelect T="Department" @bind-Value="selectedDepartment" 
           ToStringFunc="@(dept => dept?.Name)"
           Label="Departament">
    @foreach (var dept in departments)
    {
        <FodSelectItem Value="@dept">
            <div class="d-flex align-items-center">
                <FodIcon Icon="@dept.Icon" Class="me-2" />
                <div>
                    <FodText Typo="Typo.body2">@dept.Name</FodText>
                    <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                        @dept.EmployeeCount angajați
                    </FodText>
                </div>
            </div>
        </FodSelectItem>
    }
</FodSelect>

@code {
    private Department selectedDepartment;
    private List<Department> departments = new()
    {
        new() { Id = 1, Name = "IT", Icon = FodIcons.Material.Filled.Computer, EmployeeCount = 25 },
        new() { Id = 2, Name = "HR", Icon = FodIcons.Material.Filled.People, EmployeeCount = 10 },
        new() { Id = 3, Name = "Vânzări", Icon = FodIcons.Material.Filled.Sell, EmployeeCount = 30 }
    };
    
    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public int EmployeeCount { get; set; }
    }
}
```

#### Select cu grupare vizuală
```razor
<FodSelect T="string" @bind-Value="selectedCity" Label="Oraș">
    <FodListSubheader>România</FodListSubheader>
    <FodSelectItem Value="@("BUC")">București</FodSelectItem>
    <FodSelectItem Value="@("CLJ")">Cluj-Napoca</FodSelectItem>
    <FodSelectItem Value="@("TMR")">Timișoara</FodSelectItem>
    
    <FodDivider />
    <FodListSubheader>Moldova</FodListSubheader>
    <FodSelectItem Value="@("CHI")">Chișinău</FodSelectItem>
    <FodSelectItem Value="@("BAL")">Bălți</FodSelectItem>
    
    <FodDivider />
    <FodListSubheader>Bulgaria</FodListSubheader>
    <FodSelectItem Value="@("SOF")">Sofia</FodSelectItem>
    <FodSelectItem Value="@("PLV")">Plovdiv</FodSelectItem>
</FodSelect>
```

#### Select cu opțiuni dezactivate condiționat
```razor
<FodSelect T="TimeSlot" @bind-Value="selectedSlot" 
           ToStringFunc="@(slot => slot?.DisplayTime)"
           Label="Interval orar">
    @foreach (var slot in timeSlots)
    {
        <FodSelectItem Value="@slot" 
                       Disabled="@(!slot.IsAvailable)">
            <div class="d-flex justify-content-between align-items-center">
                <span>@slot.DisplayTime</span>
                @if (!slot.IsAvailable)
                {
                    <FodChip Size="FodSize.Small" Color="FodColor.Error">
                        Ocupat
                    </FodChip>
                }
                else if (slot.RemainingSpots < 3)
                {
                    <FodChip Size="FodSize.Small" Color="FodColor.Warning">
                        @slot.RemainingSpots locuri
                    </FodChip>
                }
            </div>
        </FodSelectItem>
    }
</FodSelect>

@code {
    private TimeSlot selectedSlot;
    private List<TimeSlot> timeSlots = GenerateTimeSlots();
    
    public class TimeSlot
    {
        public int Hour { get; set; }
        public int Minute { get; set; }
        public bool IsAvailable { get; set; }
        public int RemainingSpots { get; set; }
        public string DisplayTime => $"{Hour:D2}:{Minute:D2}";
    }
}
```

#### Multi-select cu counter
```razor
<FodSelect T="string" @bind-SelectedValues="selectedTags" 
           Label="@($"Taguri ({selectedTags?.Count() ?? 0} selectate)")"
           MultiSelection="true"
           SelectAll="true"
           SelectAllText="Selectează toate">
    @foreach (var tag in availableTags)
    {
        <FodSelectItem Value="@tag.Id">
            <div class="d-flex align-items-center">
                <FodIcon Icon="@FodIcons.Material.Filled.Tag" 
                         Size="FodSize.Small" 
                         Color="@tag.Color" 
                         Class="me-2" />
                @tag.Name
                <FodText Typo="Typo.caption" Class="ms-auto">
                    (@tag.UsageCount)
                </FodText>
            </div>
        </FodSelectItem>
    }
</FodSelect>

@code {
    private IEnumerable<string> selectedTags = new List<string>();
    private List<Tag> availableTags = new()
    {
        new() { Id = "urgent", Name = "Urgent", Color = FodColor.Error, UsageCount = 45 },
        new() { Id = "bug", Name = "Bug", Color = FodColor.Warning, UsageCount = 123 },
        new() { Id = "feature", Name = "Feature", Color = FodColor.Success, UsageCount = 67 }
    };
}
```

### 6. Integrare cu Formulare

#### În EditForm
```razor
<EditForm Model="formModel">
    <DataAnnotationsValidator />
    
    <FodSelect T="int" @bind-Value="formModel.CategoryId" 
               Label="Categorie" 
               Required="true"
               Validation="@(() => formModel.CategoryId)">
        <FodSelectItem Value="0" Disabled="true">
            -- Selectați categoria --
        </FodSelectItem>
        @foreach (var category in categories)
        {
            <FodSelectItem Value="@category.Id">
                @category.Name
            </FodSelectItem>
        }
    </FodSelect>
    
    <ValidationSummary />
</EditForm>

@code {
    private FormModel formModel = new();
    
    public class FormModel
    {
        [Required(ErrorMessage = "Categoria este obligatorie")]
        [Range(1, int.MaxValue, ErrorMessage = "Selectați o categorie validă")]
        public int CategoryId { get; set; }
    }
}
```

### 7. Stilizare Personalizată

```css
/* Opțiuni cu hover special */
.custom-select .fod-list-item:hover {
    background-color: rgba(var(--fod-palette-primary-rgb), 0.1);
    font-weight: 500;
}

/* Opțiuni selectate cu stil distinct */
.custom-select .fod-selected-item {
    background-color: var(--fod-palette-primary-main);
    color: white;
}

/* Checkbox-uri colorate pentru multi-select */
.colorful-select .fod-list-item .fod-icon-root {
    color: var(--fod-palette-primary-main);
}

/* Opțiuni dezactivate cu stil special */
.custom-select .fod-list-item-disabled {
    opacity: 0.5;
    text-decoration: line-through;
}
```

### 8. Scenarii Comune

#### Select cu căutare
```razor
<FodSelect T="Product" @bind-Value="selectedProduct"
           Label="Produs"
           SearchFunc="@SearchProducts"
           ToStringFunc="@(p => p?.Name)">
    @if (isLoading)
    {
        <FodSelectItem Value="@null" Disabled="true">
            <FodLoadingLinear />
        </FodSelectItem>
    }
    else
    {
        @foreach (var product in filteredProducts)
        {
            <FodSelectItem Value="@product">
                <div class="d-flex justify-content-between">
                    <span>@product.Name</span>
                    <span class="text-muted">@product.Price.ToString("C")</span>
                </div>
            </FodSelectItem>
        }
    }
</FodSelect>

@code {
    private Product selectedProduct;
    private List<Product> allProducts = new();
    private List<Product> filteredProducts = new();
    private bool isLoading;
    
    private async Task<IEnumerable<Product>> SearchProducts(string searchText)
    {
        isLoading = true;
        StateHasChanged();
        
        await Task.Delay(500); // Simulare API call
        
        filteredProducts = string.IsNullOrWhiteSpace(searchText) 
            ? allProducts 
            : allProducts.Where(p => p.Name.Contains(searchText, StringComparison.OrdinalIgnoreCase)).ToList();
        
        isLoading = false;
        StateHasChanged();
        
        return filteredProducts;
    }
}
```

#### Select cu adăugare opțiune nouă
```razor
<FodSelect T="string" @bind-Value="selectedTag" Label="Tag">
    @foreach (var tag in tags)
    {
        <FodSelectItem Value="@tag">@tag</FodSelectItem>
    }
    <FodDivider />
    <FodListItem Icon="@FodIcons.Material.Filled.Add" 
                 OnClick="ShowAddDialog">
        Adaugă tag nou...
    </FodListItem>
</FodSelect>

<FodDialog @bind-Open="showAddDialog">
    <FodDialogTitle>Tag nou</FodDialogTitle>
    <FodDialogContent>
        <FodTextField @bind-Value="newTag" 
                      Label="Nume tag" 
                      Immediate="true" />
    </FodDialogContent>
    <FodDialogActions>
        <FodButton OnClick="@(() => showAddDialog = false)">
            Anulează
        </FodButton>
        <FodButton Color="FodColor.Primary" OnClick="AddNewTag">
            Adaugă
        </FodButton>
    </FodDialogActions>
</FodDialog>

@code {
    private string selectedTag;
    private List<string> tags = new() { "Important", "Arhivat", "În lucru" };
    private bool showAddDialog;
    private string newTag;
    
    private void AddNewTag()
    {
        if (!string.IsNullOrWhiteSpace(newTag) && !tags.Contains(newTag))
        {
            tags.Add(newTag);
            selectedTag = newTag;
        }
        showAddDialog = false;
        newTag = string.Empty;
    }
}
```

### 9. Best Practices

1. **Tipuri generice** - Folosiți tipuri clare și consistente pentru `T`
2. **ToStringFunc** - Definiți întotdeauna pentru obiecte complexe
3. **Valori unice** - Asigurați-vă că fiecare Value este unică
4. **Loading states** - Afișați feedback pentru încărcare asincronă
5. **Grupare logică** - Organizați opțiunile cu subheaders și dividers
6. **Accesibilitate** - Includeți opțiuni descriptive pentru screen readers

### 10. Performanță

- Pentru liste mari (>100 items), considerați virtualizare
- Folosiți `@key` în bucle pentru optimizare
- Evitați calcule complexe în DisplayString
- Cache-uiți rezultatele pentru SearchFunc

### 11. Troubleshooting

#### Opțiunea nu apare în select
- Verificați tipul generic T
- Verificați că Value este setată
- Verificați HideContent cascading parameter

#### Checkbox-urile nu apar
- Verificați că MultiSelection="true" pe FodSelect
- Verificați că FodSelect este de tip FodSelect1<T>

#### Conversia valorii nu funcționează
- Setați ToStringFunc pe componenta părinte
- Verificați că Converter este configurat corect

### 12. Concluzie

`FodSelectItem<T>` oferă o soluție flexibilă și tipizată pentru opțiunile din select-uri. Cu suport pentru conținut personalizat, multi-selecție și integrare automată cu componenta părinte, facilitează crearea de select-uri complexe și interactive în aplicațiile FOD.