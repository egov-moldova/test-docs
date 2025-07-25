# Select

## Documentație pentru componentele FodSelect și FodSelect1

### 1. Descriere Generală
`FodSelect` și `FodSelect1` sunt componente dropdown pentru selectarea unei opțiuni dintr-o listă. Oferă o experiență îmbunătățită față de elementul HTML select standard, cu suport pentru căutare, grupare, template-uri personalizate și multe alte funcționalități.

Componentele suportă:
- Selecție single și multiplă
- Căutare în opțiuni
- Grupare opțiuni
- Avatar-uri și pictograme în opțiuni
- Validare integrată
- Placeholder personalizabil
- Încărcare asincronă de date
- Template-uri pentru afișare personalizată

### 2. Ghid de Utilizare API

#### Select de bază
```razor
<FodSelect @bind-Value="selectedValue" Label="Selectați o opțiune">
    <FodSelectItem Value="1">Opțiunea 1</FodSelectItem>
    <FodSelectItem Value="2">Opțiunea 2</FodSelectItem>
    <FodSelectItem Value="3">Opțiunea 3</FodSelectItem>
</FodSelect>

@code {
    private string selectedValue = "";
}
```

#### Select cu placeholder și required
```razor
<EditForm Model="model">
    <FodSelect @bind-Value="model.Country" 
               Label="Țara" 
               Placeholder="Selectați țara"
               Required="true"
               HelperText="Selectați țara de reședință">
        <FodSelectItem Value="">Selectați...</FodSelectItem>
        <FodSelectItem Value="MD">Moldova</FodSelectItem>
        <FodSelectItem Value="RO">România</FodSelectItem>
        <FodSelectItem Value="UA">Ucraina</FodSelectItem>
        <FodSelectItem Value="RU">Rusia</FodSelectItem>
    </FodSelect>
</EditForm>
```

#### Select cu pictograme
```razor
<FodSelect @bind-Value="selectedPayment" Label="Metodă de plată">
    <FodSelectItem Value="card">
        <ItemTemplate>
            <div class="d-flex align-items-center">
                <FodIcon Icon="@FodIcons.Material.Filled.CreditCard" Class="me-2" />
                <span>Card bancar</span>
            </div>
        </ItemTemplate>
    </FodSelectItem>
    <FodSelectItem Value="cash">
        <ItemTemplate>
            <div class="d-flex align-items-center">
                <FodIcon Icon="@FodIcons.Material.Filled.Money" Class="me-2" />
                <span>Numerar</span>
            </div>
        </ItemTemplate>
    </FodSelectItem>
    <FodSelectItem Value="transfer">
        <ItemTemplate>
            <div class="d-flex align-items-center">
                <FodIcon Icon="@FodIcons.Material.Filled.AccountBalance" Class="me-2" />
                <span>Transfer bancar</span>
            </div>
        </ItemTemplate>
    </FodSelectItem>
</FodSelect>
```

#### Select cu căutare
```razor
<FodSelect @bind-Value="selectedUser" 
           Label="Utilizator"
           SearchBox="true"
           SearchBoxPlaceholder="Căutați utilizator...">
    @foreach (var user in users)
    {
        <FodSelectItem Value="@user.Id" Text="@user.Name">
            <ItemTemplate>
                <div class="d-flex align-items-center">
                    <div class="d-flex align-items-center justify-content-center me-2"
                         style="width: 32px; height: 32px; border-radius: 50%; background-color: #e3f2fd; color: #1976d2;">
                        <FodText Typo="Typo.button">@user.Name.Substring(0, 1)</FodText>
                    </div>
                    <div>
                        <div>@user.Name</div>
                        <div class="text-muted small">@user.Email</div>
                    </div>
                </div>
            </ItemTemplate>
        </FodSelectItem>
    }
</FodSelect>
```

#### Select cu grupare
```razor
<FodGroupSelect @bind-Value="selectedProduct" Label="Selectați produs">
    <FodSelectGroup Title="Electronice">
        <FodSelectItem Value="laptop">Laptop</FodSelectItem>
        <FodSelectItem Value="telefon">Telefon</FodSelectItem>
        <FodSelectItem Value="tableta">Tabletă</FodSelectItem>
    </FodSelectGroup>
    <FodSelectGroup Title="Electrocasnice">
        <FodSelectItem Value="frigider">Frigider</FodSelectItem>
        <FodSelectItem Value="masina-spalat">Mașină de spălat</FodSelectItem>
        <FodSelectItem Value="aspirator">Aspirator</FodSelectItem>
    </FodSelectGroup>
    <FodSelectGroup Title="Mobilier">
        <FodSelectItem Value="birou">Birou</FodSelectItem>
        <FodSelectItem Value="scaun">Scaun</FodSelectItem>
        <FodSelectItem Value="dulap">Dulap</FodSelectItem>
    </FodSelectGroup>
</FodGroupSelect>
```

#### Select cu selecție multiplă
```razor
<FodSelect @bind-SelectedValues="selectedRoles" 
           Label="Roluri utilizator"
           MultiSelection="true"
           Chips="true">
    <FodSelectItem Value="admin">Administrator</FodSelectItem>
    <FodSelectItem Value="editor">Editor</FodSelectItem>
    <FodSelectItem Value="moderator">Moderator</FodSelectItem>
    <FodSelectItem Value="user">Utilizator</FodSelectItem>
</FodSelect>

@code {
    private HashSet<string> selectedRoles = new() { "user" };
}
```

#### Select cu date din API
```razor
<FodSelect @bind-Value="selectedDepartment" 
           Label="Departament"
           Loading="@isLoading"
           Disabled="@(!departments.Any())">
    @if (isLoading)
    {
        <FodSelectItem Value="" Disabled="true">Se încarcă...</FodSelectItem>
    }
    else if (!departments.Any())
    {
        <FodSelectItem Value="" Disabled="true">Nu sunt departamente disponibile</FodSelectItem>
    }
    else
    {
        <FodSelectItem Value="">Selectați departamentul</FodSelectItem>
        @foreach (var dept in departments)
        {
            <FodSelectItem Value="@dept.Id">@dept.Name</FodSelectItem>
        }
    }
</FodSelect>

@code {
    private string selectedDepartment = "";
    private List<Department> departments = new();
    private bool isLoading = true;

    protected override async Task OnInitializedAsync()
    {
        isLoading = true;
        departments = await DepartmentService.GetAllAsync();
        isLoading = false;
    }
}
```

#### Select filtrat (FodInputFilteredSelect)
```razor
<FodInputFilteredSelect @bind-Value="selectedCity"
                        Label="Oraș"
                        Items="cities"
                        TextField="@(c => c.Name)"
                        ValueField="@(c => c.Id)"
                        FilterFunc="@((city, searchText) => 
                            city.Name.Contains(searchText, StringComparison.OrdinalIgnoreCase))"
                        Placeholder="Începeți să tastați pentru a căuta..."
                        MinCharacters="2"
                        MaxItems="10">
    <NoItemsTemplate>
        <div class="pa-2 text-muted">Niciun oraș găsit</div>
    </NoItemsTemplate>
</FodInputFilteredSelect>

@code {
    private string selectedCity = "";
    private List<City> cities = GetCities();
}
```

#### Select cu validare în formular
```razor
<EditForm Model="formModel" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodSelect @bind-Value="formModel.ServiceType" 
               Label="Tip serviciu"
               For="@(() => formModel.ServiceType)">
        <FodSelectItem Value="">Selectați serviciul</FodSelectItem>
        <FodSelectItem Value="apostila">Apostilă</FodSelectItem>
        <FodSelectItem Value="traducere">Traducere autorizată</FodSelectItem>
        <FodSelectItem Value="verificare">Verificare documente</FodSelectItem>
    </FodSelect>
    <ValidationMessage For="@(() => formModel.ServiceType)" />
    
    <FodButton Type="submit" Variant="FodVariant.Filled" Color="FodColor.Primary">
        Continuă
    </FodButton>
</EditForm>

@code {
    private FormModel formModel = new();
    
    public class FormModel
    {
        [Required(ErrorMessage = "Selectați un tip de serviciu")]
        public string ServiceType { get; set; } = "";
    }
    
    private void HandleSubmit()
    {
        // Procesare formular
    }
}
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `T` | Valoarea selectată | `default(T)` |
| `SelectedValues` | `IEnumerable<T>` | Valorile selectate (multi-selection) | `null` |
| `Label` | `string` | Eticheta select-ului | `null` |
| `Placeholder` | `string` | Text placeholder | `null` |
| `HelperText` | `string` | Text ajutător sub select | `null` |
| `Required` | `bool` | Marchează câmpul ca obligatoriu | `false` |
| `Disabled` | `bool` | Dezactivează select-ul | `false` |
| `ReadOnly` | `bool` | Mod doar citire | `false` |
| `Dense` | `bool` | Reduce padding-ul | `false` |
| `Variant` | `FodVariant` | Stilul select-ului (Filled, Outlined, Text) | `Outlined` |
| `MultiSelection` | `bool` | Permite selecție multiplă | `false` |
| `SearchBox` | `bool` | Afișează căutare în dropdown | `false` |
| `SearchBoxPlaceholder` | `string` | Placeholder pentru căutare | `"Căutați..."` |
| `Chips` | `bool` | Afișează selecțiile ca chip-uri | `false` |
| `MaxHeight` | `int` | Înălțimea maximă a dropdown-ului | `300` |
| `Loading` | `bool` | Afișează indicator de încărcare | `false` |
| `Items` | `IEnumerable<T>` | Lista de elemente (pentru data binding) | `null` |
| `TextField` | `Func<T, string>` | Funcție pentru extragere text | `null` |
| `ValueField` | `Func<T, object>` | Funcție pentru extragere valoare | `null` |
| `ItemTemplate` | `RenderFragment<T>` | Template pentru afișare item | `null` |
| `SelectedItemTemplate` | `RenderFragment<T>` | Template pentru item selectat | `null` |

### 4. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `ValueChanged` | `EventCallback<T>` | Se declanșează la schimbarea valorii |
| `SelectedValuesChanged` | `EventCallback<IEnumerable<T>>` | Pentru multi-selection |
| `OnOpen` | `EventCallback` | La deschiderea dropdown-ului |
| `OnClose` | `EventCallback` | La închiderea dropdown-ului |
| `OnSearch` | `EventCallback<string>` | La căutare (dacă SearchBox=true) |

### 5. Componente asociate

#### FodSelectItem
```razor
<FodSelectItem Value="value" 
               Text="Text afișat" 
               Disabled="false">
    <ItemTemplate>
        <!-- Conținut personalizat -->
    </ItemTemplate>
</FodSelectItem>
```

#### FodSelectGroup
```razor
<FodSelectGroup Title="Nume grup" 
                Disabled="false">
    <!-- FodSelectItem-uri -->
</FodSelectGroup>
```

### 6. Select avansat cu template-uri

```razor
<FodSelect @bind-Value="selectedEmployee" 
           Label="Angajat responsabil"
           Dense="true">
    <SelectedItemTemplate>
        @if (context != null)
        {
            <div class="d-flex align-items-center">
                <FodIcon Icon="@FodIcons.Material.Filled.Person" 
                         Size="Size.Small" 
                         Class="me-2" />
                <span>@context.Name</span>
            </div>
        }
    </SelectedItemTemplate>
    <ItemsTemplate>
        @foreach (var emp in employees)
        {
            <FodSelectItem Value="@emp.Id">
                <div class="d-flex align-items-center pa-2">
                    <FodIcon Icon="@FodIcons.Material.Filled.PersonOutline" 
                             Size="Size.Medium" 
                             Class="me-3" />
                    <div>
                        <div class="font-weight-bold">@emp.Name</div>
                        <div class="text-muted small">@emp.Department - @emp.Position</div>
                    </div>
                </div>
            </FodSelectItem>
        }
    </ItemsTemplate>
</FodSelect>
```

### 7. Integrare cu alte componente

#### În FodCard
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" Class="mb-3">Preferințe utilizator</FodText>
        
        <FodSelect @bind-Value="preferences.Theme" 
                   Label="Temă aplicație" 
                   Class="mb-3">
            <FodSelectItem Value="light">Luminoasă</FodSelectItem>
            <FodSelectItem Value="dark">Întunecată</FodSelectItem>
            <FodSelectItem Value="auto">Automată</FodSelectItem>
        </FodSelect>
        
        <FodSelect @bind-Value="preferences.Language" 
                   Label="Limbă interfață">
            <FodSelectItem Value="ro">Română</FodSelectItem>
            <FodSelectItem Value="ru">Русский</FodSelectItem>
            <FodSelectItem Value="en">English</FodSelectItem>
        </FodSelect>
    </FodCardContent>
</FodCard>
```

### 8. Performanță și virtualizare

```razor
<!-- Pentru liste mari, folosiți virtualizare -->
<FodSelect @bind-Value="selectedItem"
           Label="Selectați din lista mare"
           Virtualize="true"
           ItemHeight="48">
    @foreach (var item in largeDataSet)
    {
        <FodSelectItem Value="@item.Id">@item.Name</FodSelectItem>
    }
</FodSelect>
```

### 9. Stilizare

```razor
<FodSelect @bind-Value="selectedValue" 
           Label="Select stilizat"
           Class="custom-select"
           Style="min-width: 300px;">
    <!-- Opțiuni -->
</FodSelect>

<style>
    .custom-select {
        --fod-select-background: #f5f5f5;
        --fod-select-border-color: #2196f3;
        --fod-select-focus-color: #1976d2;
    }
    
    .custom-select .fod-select-dropdown {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
</style>
```

### 10. Note și observații

- Pentru liste cu peste 50 de elemente, activați SearchBox
- MultiSelection creează o colecție HashSet pentru performanță
- Folosiți Chips=true pentru a vizualiza clar selecțiile multiple
- Pentru date asincrone, afișați starea de încărcare
- Virtualizarea îmbunătățește performanța pentru liste mari

### 11. Accesibilitate

- Suport complet pentru navigare cu tastatura
- Atribute ARIA pentru screen readers
- Label asociat corect cu input-ul
- Anunțuri pentru schimbări de selecție

### 12. Bune practici

1. **Placeholder descriptiv** - Ajută utilizatorii să înțeleagă ce trebuie selectat
2. **Opțiune goală** - Includeți întotdeauna o opțiune de resetare
3. **Grupare logică** - Pentru liste lungi, grupați opțiunile
4. **Feedback vizual** - Afișați stări de încărcare și eroare
5. **Validare** - Integrați cu sistemul de validare Blazor
6. **Performanță** - Pentru >100 opțiuni, folosiți SearchBox sau virtualizare

### 13. Troubleshooting

#### Select-ul nu se actualizează
```razor
<!-- Asigurați-vă că folosiți @bind-Value corect -->
<FodSelect @bind-Value="selectedValue" @bind-Value:event="ValueChanged">
    <!-- Opțiuni -->
</FodSelect>
```

#### Probleme cu tipuri generice
```razor
<!-- Specificați explicit tipul dacă este necesar -->
<FodSelect T="int" @bind-Value="selectedId">
    <FodSelectItem Value="1">Opțiune 1</FodSelectItem>
</FodSelect>
```

### 14. Concluzie
`FodSelect` și componentele asociate oferă o soluție completă și flexibilă pentru selecții în aplicațiile Blazor, cu funcționalități avansate care depășesc cu mult un select HTML standard.