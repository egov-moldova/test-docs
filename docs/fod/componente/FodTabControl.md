# Tab Control

## Documentație pentru componentele FODTabControl și FODTabPage

### 1. Descriere Generală
`FODTabControl` și `FODTabPage` sunt componente pentru crearea de interfețe cu tab-uri în aplicații Blazor. Permit organizarea conținutului în secțiuni separate accesibile prin butoane de navigare, oferind o experiență de utilizare familiară și intuitivă.

Caracteristici principale:
- Container pentru multiple tab-uri
- Navigare simplă între secțiuni
- Activare automată a primului tab
- Stilizare bazată pe Bootstrap
- Gestionare automată a stării active
- Suport pentru conținut dinamic
- Design responsive
- Integrare ușoară

### 2. Ghid de Utilizare API

#### Tab-uri simple
```razor
<FODTabControl>
    <FODTabPage Text="Informații generale">
        <FodText Typo="Typo.body1">
            Aceasta este secțiunea cu informații generale despre produsul nostru.
            Tab-urile permit organizarea conținutului în mod logic și accesibil.
        </FodText>
    </FODTabPage>
    
    <FODTabPage Text="Caracteristici">
        <FodList>
            <FodListItem>Performanță înaltă</FodListItem>
            <FodListItem>Design modern</FodListItem>
            <FodListItem>Ușor de utilizat</FodListItem>
            <FodListItem>Suport tehnic inclus</FodListItem>
        </FodList>
    </FODTabPage>
    
    <FODTabPage Text="Prețuri">
        <FodText Typo="Typo.h6">Plan Basic: 29€/lună</FodText>
        <FodText Typo="Typo.h6">Plan Pro: 59€/lună</FodText>
        <FodText Typo="Typo.h6">Plan Enterprise: Contactați-ne</FodText>
    </FODTabPage>
</FODTabControl>
```

#### Tab-uri cu formulare
```razor
<FODTabControl>
    <FODTabPage Text="Date personale">
        <EditForm Model="@personalData">
            <DataAnnotationsValidator />
            
            <FodTextField @bind-Value="personalData.FirstName" 
                          Label="Prenume" 
                          Required="true"
                          FullWidth="true"
                          Class="mb-3" />
            
            <FodTextField @bind-Value="personalData.LastName" 
                          Label="Nume" 
                          Required="true"
                          FullWidth="true"
                          Class="mb-3" />
            
            <FodDatePicker @bind-Value="personalData.BirthDate" 
                           Label="Data nașterii"
                           FullWidth="true"
                           Class="mb-3" />
        </EditForm>
    </FODTabPage>
    
    <FODTabPage Text="Contact">
        <EditForm Model="@contactData">
            <FodTextField @bind-Value="contactData.Email" 
                          Label="Email" 
                          Type="email"
                          Required="true"
                          FullWidth="true"
                          Class="mb-3" />
            
            <FodTextField @bind-Value="contactData.Phone" 
                          Label="Telefon"
                          FullWidth="true"
                          Class="mb-3" />
            
            <FodTextField @bind-Value="contactData.Address" 
                          Label="Adresă"
                          Multiline="true"
                          Rows="3"
                          FullWidth="true"
                          Class="mb-3" />
        </EditForm>
    </FODTabPage>
    
    <FODTabPage Text="Preferințe">
        <FodCheckbox @bind-Checked="preferences.Newsletter" Class="mb-2">
            Doresc să primesc newsletter
        </FodCheckbox>
        
        <FodCheckbox @bind-Checked="preferences.SMS" Class="mb-2">
            Accept notificări SMS
        </FodCheckbox>
        
        <FodCheckbox @bind-Checked="preferences.Marketing" Class="mb-2">
            Accept comunicări de marketing
        </FodCheckbox>
    </FODTabPage>
</FODTabControl>
```

#### Tab-uri cu cod și exemple
```razor
<FODTabControl>
    <FODTabPage Text="Exemplu">
        <FodCard>
            <FodCardContent>
                <FodText Typo="Typo.h6">Card de exemplu</FodText>
                <FodText Typo="Typo.body2">
                    Acesta este un exemplu de card cu conținut.
                </FodText>
                <FodButton Color="FodColor.Primary" Class="mt-2">
                    Acțiune
                </FodButton>
            </FodCardContent>
        </FodCard>
    </FODTabPage>
    
    <FODTabPage Text="Cod Razor">
        <pre><code class="language-razor">@(@"<FodCard>
    <FodCardContent>
        <FodText Typo=""Typo.h6"">Card de exemplu</FodText>
        <FodText Typo=""Typo.body2"">
            Acesta este un exemplu de card cu conținut.
        </FodText>
        <FodButton Color=""FodColor.Primary"" Class=""mt-2"">
            Acțiune
        </FodButton>
    </FodCardContent>
</FodCard>")</code></pre>
    </FODTabPage>
    
    <FODTabPage Text="Cod C#">
        <pre><code class="language-csharp">@(@"public class CardExample : ComponentBase
{
    private string title = ""Card de exemplu"";
    private string content = ""Acesta este un exemplu de card cu conținut."";
    
    private void HandleAction()
    {
        // Logică pentru acțiune
    }
}")</code></pre>
    </FODTabPage>
</FODTabControl>
```

#### Tab-uri dinamice din listă
```razor
<FODTabControl>
    @foreach (var category in productCategories)
    {
        <FODTabPage Text="@category.Name">
            <FodGrid Container="true" Spacing="2">
                @foreach (var product in category.Products)
                {
                    <FodGrid Item="true" xs="12" sm="6" md="4">
                        <FodCard>
                            <FodCardMedia Image="@product.ImageUrl" 
                                          Title="@product.Name" />
                            <FodCardContent>
                                <FodText Typo="Typo.h6">@product.Name</FodText>
                                <FodText Typo="Typo.body2" GutterBottom="true">
                                    @product.Description
                                </FodText>
                                <FodText Typo="Typo.h5" Color="FodColor.Primary">
                                    @product.Price.ToString("C")
                                </FodText>
                            </FodCardContent>
                            <FodCardActions>
                                <FodButton Size="FodSize.Small">Detalii</FodButton>
                                <FodButton Size="FodSize.Small" Color="FodColor.Primary">
                                    Adaugă în coș
                                </FodButton>
                            </FodCardActions>
                        </FodCard>
                    </FodGrid>
                }
            </FodGrid>
        </FODTabPage>
    }
</FODTabControl>

@code {
    private List<ProductCategory> productCategories = new();
    
    protected override async Task OnInitializedAsync()
    {
        productCategories = await ProductService.GetCategoriesWithProductsAsync();
    }
}
```

#### Tab-uri cu conținut asincron
```razor
<FODTabControl>
    <FODTabPage Text="Utilizatori">
        @if (isLoadingUsers)
        {
            <FodLoadingLinear Indeterminate="true" />
        }
        else
        {
            <FodDataTable Items="@users">
                <!-- Configurare tabel -->
            </FodDataTable>
        }
    </FODTabPage>
    
    <FODTabPage Text="Roluri">
        @if (isLoadingRoles)
        {
            <FodLoadingLinear Indeterminate="true" />
        }
        else
        {
            <FodList>
                @foreach (var role in roles)
                {
                    <FodListItem>
                        <FodText>@role.Name</FodText>
                        <FodText Typo="Typo.caption">
                            @role.Description
                        </FodText>
                    </FodListItem>
                }
            </FodList>
        }
    </FODTabPage>
    
    <FODTabPage Text="Permisiuni">
        @if (isLoadingPermissions)
        {
            <FodLoadingLinear Indeterminate="true" />
        }
        else
        {
            <FodChipSet>
                @foreach (var permission in permissions)
                {
                    <FodChip>@permission.Name</FodChip>
                }
            </FodChipSet>
        }
    </FODTabPage>
</FODTabControl>

@code {
    private bool isLoadingUsers = true;
    private bool isLoadingRoles = true;
    private bool isLoadingPermissions = true;
    
    private List<User> users = new();
    private List<Role> roles = new();
    private List<Permission> permissions = new();
    
    protected override async Task OnInitializedAsync()
    {
        // Încărcare paralelă
        var usersTask = LoadUsers();
        var rolesTask = LoadRoles();
        var permissionsTask = LoadPermissions();
        
        await Task.WhenAll(usersTask, rolesTask, permissionsTask);
    }
    
    private async Task LoadUsers()
    {
        users = await UserService.GetUsersAsync();
        isLoadingUsers = false;
        StateHasChanged();
    }
    
    private async Task LoadRoles()
    {
        roles = await RoleService.GetRolesAsync();
        isLoadingRoles = false;
        StateHasChanged();
    }
    
    private async Task LoadPermissions()
    {
        permissions = await PermissionService.GetPermissionsAsync();
        isLoadingPermissions = false;
        StateHasChanged();
    }
}
```

#### Tab-uri pentru setări
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h5" GutterBottom="true">
            Setări aplicație
        </FodText>
        
        <FODTabControl>
            <FODTabPage Text="General">
                <FodTextField Value="@settings.AppName" 
                              Label="Nume aplicație"
                              FullWidth="true"
                              Class="mb-3" />
                
                <FodTextField Value="@settings.AppDescription" 
                              Label="Descriere"
                              Multiline="true"
                              Rows="3"
                              FullWidth="true"
                              Class="mb-3" />
                
                <FodSelect @bind-Value="settings.Theme" 
                           Label="Temă"
                           FullWidth="true">
                    <FodSelectItem Value="light">Light</FodSelectItem>
                    <FodSelectItem Value="dark">Dark</FodSelectItem>
                    <FodSelectItem Value="auto">Auto</FodSelectItem>
                </FodSelect>
            </FODTabPage>
            
            <FODTabPage Text="Securitate">
                <FodCheckbox @bind-Checked="settings.RequireTwoFactor" Class="mb-3">
                    Necesită autentificare în doi pași
                </FodCheckbox>
                
                <FodCheckbox @bind-Checked="settings.SessionTimeout" Class="mb-3">
                    Deconectare automată după inactivitate
                </FodCheckbox>
                
                @if (settings.SessionTimeout)
                {
                    <FodSelect @bind-Value="settings.TimeoutMinutes" 
                               Label="Timp până la deconectare"
                               FullWidth="true">
                        <FodSelectItem Value="15">15 minute</FodSelectItem>
                        <FodSelectItem Value="30">30 minute</FodSelectItem>
                        <FodSelectItem Value="60">1 oră</FodSelectItem>
                        <FodSelectItem Value="120">2 ore</FodSelectItem>
                    </FodSelect>
                }
            </FODTabPage>
            
            <FODTabPage Text="Notificări">
                <FodText Typo="Typo.subtitle1" GutterBottom="true">
                    Notificări Email
                </FodText>
                
                <FodCheckbox @bind-Checked="settings.EmailOnLogin" Class="mb-2">
                    Alertă la autentificare nouă
                </FodCheckbox>
                
                <FodCheckbox @bind-Checked="settings.EmailOnChange" Class="mb-2">
                    Alertă la schimbare parolă
                </FodCheckbox>
                
                <FodCheckbox @bind-Checked="settings.EmailWeeklyReport" Class="mb-3">
                    Raport săptămânal
                </FodCheckbox>
                
                <FodDivider Class="my-3" />
                
                <FodText Typo="Typo.subtitle1" GutterBottom="true">
                    Notificări Push
                </FodText>
                
                <FodCheckbox @bind-Checked="settings.PushNotifications" Class="mb-2">
                    Activează notificări push
                </FodCheckbox>
            </FODTabPage>
        </FODTabControl>
        
        <div class="mt-4 d-flex justify-content-end gap-2">
            <FodButton Variant="FodVariant.Text">Anulează</FodButton>
            <FodButton Color="FodColor.Primary" OnClick="SaveSettings">
                Salvează setări
            </FodButton>
        </div>
    </FodCardContent>
</FodCard>
```

#### Tab-uri cu validare pe fiecare secțiune
```razor
<EditForm EditContext="@editContext" OnValidSubmit="HandleSubmit">
    <FODTabControl>
        <FODTabPage Text="@($"Informații de bază {GetValidationIcon(basicInfoValid)}")">
            <DataAnnotationsValidator />
            
            <FodTextField @bind-Value="model.CompanyName" 
                          Label="Nume companie"
                          Required="true"
                          @bind-Value:after="ValidateBasicInfo" />
            <ValidationMessage For="@(() => model.CompanyName)" />
            
            <FodTextField @bind-Value="model.RegistrationNumber" 
                          Label="CUI"
                          Required="true"
                          @bind-Value:after="ValidateBasicInfo" />
            <ValidationMessage For="@(() => model.RegistrationNumber)" />
        </FODTabPage>
        
        <FODTabPage Text="@($"Contact {GetValidationIcon(contactInfoValid)}")">
            <FodTextField @bind-Value="model.Email" 
                          Label="Email"
                          Type="email"
                          Required="true"
                          @bind-Value:after="ValidateContactInfo" />
            <ValidationMessage For="@(() => model.Email)" />
            
            <FodTextField @bind-Value="model.Phone" 
                          Label="Telefon"
                          Required="true"
                          @bind-Value:after="ValidateContactInfo" />
            <ValidationMessage For="@(() => model.Phone)" />
        </FODTabPage>
        
        <FODTabPage Text="@($"Finalizare {GetValidationIcon(allValid)}")">
            @if (allValid)
            {
                <FodAlert Severity="Severity.Success">
                    Toate informațiile sunt complete și valide.
                </FodAlert>
            }
            else
            {
                <FodAlert Severity="Severity.Warning">
                    Vă rugăm completați toate câmpurile obligatorii din tab-urile anterioare.
                </FodAlert>
            }
            
            <FodButton Type="ButtonType.Submit" 
                       Color="FodColor.Primary"
                       Disabled="@(!allValid)"
                       Class="mt-3">
                Trimite formularul
            </FodButton>
        </FODTabPage>
    </FODTabControl>
</EditForm>

@code {
    private EditContext editContext;
    private CompanyRegistrationModel model = new();
    private bool basicInfoValid = false;
    private bool contactInfoValid = false;
    private bool allValid => basicInfoValid && contactInfoValid;
    
    protected override void OnInitialized()
    {
        editContext = new EditContext(model);
    }
    
    private void ValidateBasicInfo()
    {
        var fields = new[] 
        { 
            nameof(model.CompanyName), 
            nameof(model.RegistrationNumber) 
        };
        basicInfoValid = !fields.Any(f => 
            editContext.GetValidationMessages(editContext.Field(f)).Any());
    }
    
    private void ValidateContactInfo()
    {
        var fields = new[] 
        { 
            nameof(model.Email), 
            nameof(model.Phone) 
        };
        contactInfoValid = !fields.Any(f => 
            editContext.GetValidationMessages(editContext.Field(f)).Any());
    }
    
    private string GetValidationIcon(bool isValid)
    {
        return isValid ? "✓" : "•";
    }
}
```

### 3. Atribute disponibile

#### FODTabControl
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `ChildContent` | `RenderFragment` | Conținutul (tab pages) | - |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |

#### FODTabPage
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Text` | `string` | Textul afișat pe butonul tab-ului | - |
| `ChildContent` | `RenderFragment` | Conținutul tab-ului | - |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |

### 4. Metode și proprietăți interne

Componentele folosesc următoarele mecanisme interne:
- `AddPage(FODTabPage page)` - Înregistrează un tab nou
- `ActivePage` - Tracking-ul tab-ului activ
- `pages` - Lista internă de tab-uri

### 5. Evenimente

Componentele nu expun evenimente publice în implementarea curentă, dar pot fi extinse pentru:
- `OnTabChanged`
- `OnBeforeTabChange`
- `OnAfterTabChange`

### 6. Stilizare și personalizare

```css
/* Tab-uri cu stil custom */
.custom-tabs .btn-group {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.custom-tabs .btn {
    border: none;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.custom-tabs .btn-primary {
    background-color: var(--fod-palette-primary-main);
    color: white;
}

.custom-tabs .btn-secondary {
    background-color: transparent;
    color: var(--fod-palette-text-primary);
}

.custom-tabs .btn-secondary:hover {
    background-color: var(--fod-palette-action-hover);
}

/* Tab-uri verticale */
.vertical-tabs .btn-group {
    flex-direction: column;
    width: 200px;
}

.vertical-tabs .btn {
    text-align: left;
    border-radius: 0;
}

/* Tab-uri cu iconițe */
.icon-tabs .btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.icon-tabs .material-icons {
    font-size: 1.2rem;
}

/* Tab-uri cu badge-uri */
.badge-tabs .btn {
    position: relative;
}

.badge-tabs .badge {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background-color: var(--fod-palette-error-main);
    color: white;
    border-radius: 10px;
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
}
```

### 7. Integrare cu alte componente

#### În Modal
```razor
<FodModal Show="@showModal" Size="Size.Large">
    <FodModalContent>
        <FodModalHeader>
            <FodText Typo="Typo.h6">Detalii comandă</FodText>
        </FodModalHeader>
        <FodModalBody>
            <FODTabControl>
                <FODTabPage Text="Produse">
                    <!-- Lista produse -->
                </FODTabPage>
                <FODTabPage Text="Livrare">
                    <!-- Informații livrare -->
                </FODTabPage>
                <FODTabPage Text="Plată">
                    <!-- Detalii plată -->
                </FODTabPage>
            </FODTabControl>
        </FodModalBody>
    </FodModalContent>
</FodModal>
```

#### În Card
```razor
<FodCard>
    <FodCardContent>
        <FODTabControl>
            <FODTabPage Text="Prezentare">
                <!-- Conținut prezentare -->
            </FODTabPage>
            <FODTabPage Text="Specificații">
                <!-- Specificații tehnice -->
            </FODTabPage>
            <FODTabPage Text="Recenzii">
                <!-- Recenzii utilizatori -->
            </FODTabPage>
        </FODTabControl>
    </FodCardContent>
</FodCard>
```

### 8. Patterns comune

#### Dashboard cu tab-uri
```razor
<div class="dashboard">
    <FodText Typo="Typo.h4" GutterBottom="true">
        Dashboard Administrator
    </FodText>
    
    <FODTabControl>
        <FODTabPage Text="Prezentare generală">
            <FodGrid Container="true" Spacing="3">
                <FodGrid Item="true" xs="12" md="3">
                    <StatCard Title="Utilizatori" Value="@totalUsers" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="3">
                    <StatCard Title="Comenzi" Value="@totalOrders" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="3">
                    <StatCard Title="Venituri" Value="@totalRevenue" />
                </FodGrid>
                <FodGrid Item="true" xs="12" md="3">
                    <StatCard Title="Produse" Value="@totalProducts" />
                </FodGrid>
            </FodGrid>
        </FODTabPage>
        
        <FODTabPage Text="Analiză">
            <ChartsComponent />
        </FODTabPage>
        
        <FODTabPage Text="Rapoarte">
            <ReportsComponent />
        </FODTabPage>
    </FODTabControl>
</div>
```

#### Tab-uri cu lazy loading
```razor
<FODTabControl>
    @foreach (var section in sections)
    {
        <FODTabPage Text="@section.Title">
            @if (loadedSections.Contains(section.Id))
            {
                <DynamicComponent Type="@section.ComponentType" />
            }
            else
            {
                <div class="text-center py-5">
                    <FodLoadingCircular Indeterminate="true" />
                    <FodText Typo="Typo.body2" Class="mt-2">
                        Se încarcă...
                    </FodText>
                </div>
            }
        </FODTabPage>
    }
</FODTabControl>

@code {
    private HashSet<string> loadedSections = new();
    
    // Încarcă conținutul când tab-ul devine activ
    private async Task OnTabActivated(string sectionId)
    {
        if (!loadedSections.Contains(sectionId))
        {
            await LoadSectionContent(sectionId);
            loadedSections.Add(sectionId);
        }
    }
}
```

### 9. Performanță

- Tab-urile inactive nu randează conținutul
- Folosiți `@key` pentru tab-uri generate dinamic
- Pentru conținut greu, considerați lazy loading
- Evitați re-render prin păstrarea referințelor stabile

### 10. Accesibilitate

- Folosiți texte descriptive pentru tab-uri
- Asigurați contrast suficient
- Tab-urile sunt navigabile cu tastatura
- Considerați ARIA labels pentru screen readers

### 11. Bune practici

1. **Texte concise** - Păstrați textele tab-urilor scurte și clare
2. **Număr rezonabil** - Nu depășiți 5-7 tab-uri
3. **Ordine logică** - Organizați tab-urile în ordine intuitivă
4. **Conținut relevant** - Fiecare tab trebuie să aibă scop clar
5. **Loading states** - Afișați indicatori pentru conținut asincron
6. **Responsive** - Testați pe diferite dimensiuni de ecran

### 12. Troubleshooting

#### Tab-urile nu se afișează
- Verificați că FODTabPage este în interiorul FODTabControl
- Verificați că parametrul Text este setat

#### Conținutul nu se schimbă la click
- Verificați consolă pentru erori JavaScript
- Verificați că Bootstrap CSS este încărcat

#### Stilizarea nu se aplică
- Verificați că clasele Bootstrap sunt disponibile
- Verificați specificitatea CSS-ului custom

### 13. Limitări cunoscute

- Nu suportă tab-uri dinamice (adăugare/ștergere runtime)
- Nu are evenimente publice
- Nu suportă tab-uri dezactivate
- Nu are animații de tranziție
- Bazat pe Bootstrap pentru stilizare

### 14. Exemple avansate

#### Tab-uri cu stare în URL
```razor
@page "/settings/{activeTab?}"
@inject NavigationManager Navigation

<FODTabControl>
    <FODTabPage Text="General">
        <!-- Conținut -->
    </FODTabPage>
    <FODTabPage Text="Security">
        <!-- Conținut -->
    </FODTabPage>
    <FODTabPage Text="Privacy">
        <!-- Conținut -->
    </FODTabPage>
</FODTabControl>

@code {
    [Parameter] public string? ActiveTab { get; set; }
    
    protected override void OnParametersSet()
    {
        // Activează tab-ul bazat pe URL
        // Necesită extinderea componentei pentru suport
    }
    
    private void OnTabChanged(string tabName)
    {
        Navigation.NavigateTo($"/settings/{tabName.ToLower()}");
    }
}
```

### 15. Concluzie
`FODTabControl` și `FODTabPage` oferă o soluție simplă și eficientă pentru organizarea conținutului în tab-uri. Cu integrare ușoară și design bazat pe Bootstrap, acestea sunt ideale pentru interfețe complexe care necesită navigare între secțiuni multiple de conținut.