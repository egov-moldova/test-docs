# Expansion Panels

## Documentație pentru componentele FodExpansionPanels și FodExpansionPanel

### 1. Descriere Generală
`FodExpansionPanels` și `FodExpansionPanel` sunt componente pentru crearea de panouri expandabile (accordion) în aplicații Blazor. Permit organizarea conținutului în secțiuni care pot fi extinse sau restrânse pentru a economisi spațiu și îmbunătăți experiența utilizatorului.

Caracteristici principale:
- Container pentru multiple panouri expandabile
- Mod single sau multi-expansion
- Animații fluide la expandare/restrângere
- Iconițe indicator pentru starea panoului
- Integrare cu Bootstrap accordion
- Gestionare centralizată a stării
- Suport pentru conținut dinamic
- Design responsive

### 2. Ghid de Utilizare API

#### Accordion simplu (single expansion)
```razor
<FodExpansionPanels>
    <FodExpansionPanel Text="Informații generale" Id="info">
        <FodText Typo="Typo.body1">
            Aici puteți găsi informații generale despre serviciul nostru.
            Panoul se poate extinde pentru a afișa mai multe detalii.
        </FodText>
    </FodExpansionPanel>
    
    <FodExpansionPanel Text="Întrebări frecvente" Id="faq">
        <FodText Typo="Typo.body1">
            Secțiune cu întrebări frecvente și răspunsurile aferente.
        </FodText>
    </FodExpansionPanel>
    
    <FodExpansionPanel Text="Contact" Id="contact">
        <FodText Typo="Typo.body1">
            Informații de contact și formular de comunicare.
        </FodText>
    </FodExpansionPanel>
</FodExpansionPanels>
```

#### Multi-expansion (mai multe panouri deschise simultan)
```razor
<FodExpansionPanels MultiExpansion="true">
    <FodExpansionPanel Text="Secțiunea 1" Id="section1" IsExpanded="true">
        <FodText>Conținut pentru prima secțiune - inițial expandată</FodText>
    </FodExpansionPanel>
    
    <FodExpansionPanel Text="Secțiunea 2" Id="section2">
        <FodText>Conținut pentru a doua secțiune</FodText>
    </FodExpansionPanel>
    
    <FodExpansionPanel Text="Secțiunea 3" Id="section3" IsExpanded="true">
        <FodText>Conținut pentru a treia secțiune - și aceasta expandată</FodText>
    </FodExpansionPanel>
</FodExpansionPanels>
```

#### Panouri cu conținut complex
```razor
<FodExpansionPanels>
    <FodExpansionPanel Text="Date personale" Id="personal-data">
        <EditForm Model="@personalData">
            <FodTextField @bind-Value="personalData.FirstName" 
                          Label="Prenume" 
                          FullWidth="true" />
            <FodTextField @bind-Value="personalData.LastName" 
                          Label="Nume" 
                          FullWidth="true" />
            <FodTextField @bind-Value="personalData.Email" 
                          Label="Email" 
                          Type="email"
                          FullWidth="true" />
        </EditForm>
    </FodExpansionPanel>
    
    <FodExpansionPanel Text="Adresă" Id="address">
        <EditForm Model="@addressData">
            <FodTextField @bind-Value="addressData.Street" 
                          Label="Stradă" 
                          FullWidth="true" />
            <FodTextField @bind-Value="addressData.City" 
                          Label="Oraș" 
                          FullWidth="true" />
            <FodTextField @bind-Value="addressData.PostalCode" 
                          Label="Cod poștal" 
                          FullWidth="true" />
        </EditForm>
    </FodExpansionPanel>
    
    <FodExpansionPanel Text="Preferințe" Id="preferences">
        <FodCheckbox @bind-Checked="preferences.Newsletter">
            Doresc să primesc newsletter
        </FodCheckbox>
        <FodCheckbox @bind-Checked="preferences.Notifications">
            Activează notificările
        </FodCheckbox>
    </FodExpansionPanel>
</FodExpansionPanels>
```

#### Panouri dinamice din listă
```razor
<FodExpansionPanels MultiExpansion="true">
    @foreach (var category in productCategories)
    {
        <FodExpansionPanel Text="@category.Name" 
                           Id="@($"category-{category.Id}")"
                           IsExpanded="@category.IsPopular">
            <FodGrid Container="true" Spacing="2">
                @foreach (var product in category.Products)
                {
                    <FodGrid Item="true" xs="12" sm="6" md="4">
                        <FodCard>
                            <FodCardContent>
                                <FodText Typo="Typo.h6">@product.Name</FodText>
                                <FodText Typo="Typo.body2">@product.Description</FodText>
                                <FodText Typo="Typo.h5" Color="FodColor.Primary">
                                    @product.Price.ToString("C")
                                </FodText>
                            </FodCardContent>
                        </FodCard>
                    </FodGrid>
                }
            </FodGrid>
        </FodExpansionPanel>
    }
</FodExpansionPanels>

@code {
    private List<ProductCategory> productCategories = new();
    
    protected override async Task OnInitializedAsync()
    {
        productCategories = await ProductService.GetCategoriesWithProductsAsync();
    }
}
```

#### FAQ cu căutare
```razor
<FodTextField @bind-Value="searchTerm" 
              Label="Căutați în întrebări frecvente"
              FullWidth="true"
              Class="mb-4" />

<FodExpansionPanels>
    @foreach (var faq in FilteredFAQs)
    {
        <FodExpansionPanel Text="@faq.Question" Id="@($"faq-{faq.Id}")">
            <FodText Typo="Typo.body1" Class="mb-3">
                @faq.Answer
            </FodText>
            
            @if (!string.IsNullOrEmpty(faq.AdditionalInfo))
            {
                <FodAlert Severity="Severity.Info">
                    <FodAlertTitle>Informații suplimentare</FodAlertTitle>
                    @faq.AdditionalInfo
                </FodAlert>
            }
            
            <div class="mt-3">
                <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                    Ultima actualizare: @faq.LastUpdated.ToString("dd.MM.yyyy")
                </FodText>
            </div>
        </FodExpansionPanel>
    }
</FodExpansionPanels>

@if (!FilteredFAQs.Any())
{
    <FodAlert Severity="Severity.Warning">
        Nu am găsit întrebări care să corespundă căutării dvs.
    </FodAlert>
}

@code {
    private string searchTerm = "";
    private List<FAQ> allFAQs = new();
    
    private IEnumerable<FAQ> FilteredFAQs => string.IsNullOrWhiteSpace(searchTerm)
        ? allFAQs
        : allFAQs.Where(f => 
            f.Question.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
            f.Answer.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));
}
```

#### Panouri cu acțiuni
```razor
<FodExpansionPanels>
    @foreach (var order in userOrders)
    {
        <FodExpansionPanel Text="@($"Comandă #{order.Number} - {order.Date:dd.MM.yyyy}")" 
                           Id="@($"order-{order.Id}")">
            <div class="order-details">
                <FodText Typo="Typo.subtitle1" GutterBottom="true">
                    Produse comandate
                </FodText>
                
                <FodList>
                    @foreach (var item in order.Items)
                    {
                        <FodListItem>
                            <div class="d-flex justify-content-between">
                                <FodText>@item.ProductName x @item.Quantity</FodText>
                                <FodText>@item.TotalPrice.ToString("C")</FodText>
                            </div>
                        </FodListItem>
                    }
                </FodList>
                
                <FodDivider Class="my-3" />
                
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <FodText Typo="Typo.h6">
                            Total: @order.TotalAmount.ToString("C")
                        </FodText>
                        <FodChip Color="@GetStatusColor(order.Status)" Size="FodSize.Small">
                            @order.Status
                        </FodChip>
                    </div>
                    
                    <div>
                        <FodButton Variant="FodVariant.Text" 
                                   OnClick="@(() => ViewOrderDetails(order))">
                            Vezi detalii
                        </FodButton>
                        @if (order.Status == "În procesare")
                        {
                            <FodButton Color="FodColor.Error" 
                                       Variant="FodVariant.Text"
                                       OnClick="@(() => CancelOrder(order))">
                                Anulează
                            </FodButton>
                        }
                    </div>
                </div>
            </div>
        </FodExpansionPanel>
    }
</FodExpansionPanels>
```

#### Formular step-by-step cu validare
```razor
<EditForm Model="@applicationForm" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodExpansionPanels>
        <FodExpansionPanel Text="Pasul 1: Date personale" 
                           Id="step1" 
                           IsExpanded="true">
            <FodTextField @bind-Value="applicationForm.FirstName" 
                          Label="Prenume" 
                          Required="true" />
            <ValidationMessage For="@(() => applicationForm.FirstName)" />
            
            <FodTextField @bind-Value="applicationForm.LastName" 
                          Label="Nume" 
                          Required="true" />
            <ValidationMessage For="@(() => applicationForm.LastName)" />
            
            <FodButton Color="FodColor.Primary" 
                       OnClick="@(() => ExpandNextPanel("step2"))">
                Continuă
            </FodButton>
        </FodExpansionPanel>
        
        <FodExpansionPanel Text="Pasul 2: Date de contact" 
                           Id="step2">
            <FodTextField @bind-Value="applicationForm.Email" 
                          Label="Email" 
                          Type="email"
                          Required="true" />
            <ValidationMessage For="@(() => applicationForm.Email)" />
            
            <FodTextField @bind-Value="applicationForm.Phone" 
                          Label="Telefon" 
                          Required="true" />
            <ValidationMessage For="@(() => applicationForm.Phone)" />
            
            <div class="d-flex gap-2">
                <FodButton Variant="FodVariant.Text"
                           OnClick="@(() => ExpandNextPanel("step1"))">
                    Înapoi
                </FodButton>
                <FodButton Color="FodColor.Primary" 
                           OnClick="@(() => ExpandNextPanel("step3"))">
                    Continuă
                </FodButton>
            </div>
        </FodExpansionPanel>
        
        <FodExpansionPanel Text="Pasul 3: Confirmare" 
                           Id="step3">
            <FodAlert Severity="Severity.Info" Class="mb-3">
                Vă rugăm verificați datele introduse înainte de trimitere.
            </FodAlert>
            
            <div class="summary">
                <FodText><strong>Nume:</strong> @applicationForm.FullName</FodText>
                <FodText><strong>Email:</strong> @applicationForm.Email</FodText>
                <FodText><strong>Telefon:</strong> @applicationForm.Phone</FodText>
            </div>
            
            <div class="d-flex gap-2 mt-3">
                <FodButton Variant="FodVariant.Text"
                           OnClick="@(() => ExpandNextPanel("step2"))">
                    Înapoi
                </FodButton>
                <FodButton Type="ButtonType.Submit" 
                           Color="FodColor.Primary">
                    Trimite aplicația
                </FodButton>
            </div>
        </FodExpansionPanel>
    </FodExpansionPanels>
</EditForm>

@code {
    private ApplicationForm applicationForm = new();
    [CascadingParameter] private FodExpansionPanels? ExpansionPanels { get; set; }
    
    private void ExpandNextPanel(string panelId)
    {
        // Logică pentru a expanda următorul panou
        ExpansionPanels?.TogglePanel(panelId);
    }
}
```

### 3. Atribute disponibile

#### FodExpansionPanels
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `MultiExpansion` | `bool` | Permite expandarea simultană a mai multor panouri | `false` |
| `ChildContent` | `RenderFragment` | Conținutul (panourile) | - |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |

#### FodExpansionPanel
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Text` | `string` | Textul afișat în header | - |
| `Id` | `string` | Identificator unic pentru panou | - |
| `IsExpanded` | `bool` | Starea inițială expandată | `false` |
| `ChildContent` | `RenderFragment` | Conținutul panoului | - |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |

### 4. Metode publice

#### FodExpansionPanels
| Metodă | Descriere | Parametri | Return |
|--------|-----------|-----------|--------|
| `TogglePanel` | Comută starea unui panou | `string panelId` | `void` |
| `ExpandPanel` | Expandează un panou specific | `string panelId` | `void` |
| `CollapsePanel` | Restrânge un panou specific | `string panelId` | `void` |
| `CollapseAll` | Restrânge toate panourile | - | `void` |

### 5. Evenimente

Componentele nu expun evenimente publice direct, dar pot fi extinse pentru a adăuga:
- `OnPanelExpanded`
- `OnPanelCollapsed`
- `OnPanelToggled`

### 6. Stilizare și personalizare

```css
/* Stilizare header personalizată */
.custom-expansion .card-header {
    background-color: var(--fod-palette-primary-light);
    border-bottom: 2px solid var(--fod-palette-primary-main);
}

.custom-expansion .card-header:hover {
    background-color: var(--fod-palette-primary-main);
    color: white;
}

/* Iconițe personalizate */
.custom-expansion .expansion-icon {
    transition: transform 0.3s ease;
}

.custom-expansion .expanded .expansion-icon {
    transform: rotate(180deg);
}

/* Animație smooth pentru conținut */
.custom-expansion .collapse {
    transition: height 0.35s ease;
}

/* Panouri cu margini rotunjite */
.rounded-panels .card {
    border-radius: 12px;
    margin-bottom: 1rem;
    overflow: hidden;
}

/* Stil minimalist */
.minimal-expansion .card {
    border: none;
    box-shadow: none;
}

.minimal-expansion .card-header {
    background: transparent;
    border-bottom: 1px solid #e0e0e0;
    padding: 1rem 0;
}

/* Numerotare automată */
.numbered-expansion {
    counter-reset: panel-counter;
}

.numbered-expansion .card-header::before {
    counter-increment: panel-counter;
    content: counter(panel-counter) ". ";
    font-weight: bold;
    margin-right: 0.5rem;
}
```

### 7. Integrare cu alte componente

#### În Card pentru organizare
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h5" GutterBottom="true">
            Setări cont
        </FodText>
        
        <FodExpansionPanels>
            <FodExpansionPanel Text="Profil" Id="profile">
                <!-- Setări profil -->
            </FodExpansionPanel>
            <FodExpansionPanel Text="Securitate" Id="security">
                <!-- Setări securitate -->
            </FodExpansionPanel>
            <FodExpansionPanel Text="Notificări" Id="notifications">
                <!-- Setări notificări -->
            </FodExpansionPanel>
        </FodExpansionPanels>
    </FodCardContent>
</FodCard>
```

#### În Modal pentru detalii
```razor
<FodModal Show="@showDetailsModal" Size="Size.Large">
    <FodModalContent>
        <FodModalHeader>
            <FodText Typo="Typo.h6">Detalii produs</FodText>
        </FodModalHeader>
        <FodModalBody>
            <FodExpansionPanels MultiExpansion="true">
                <FodExpansionPanel Text="Specificații" Id="specs" IsExpanded="true">
                    <!-- Specificații tehnice -->
                </FodExpansionPanel>
                <FodExpansionPanel Text="Recenzii" Id="reviews">
                    <!-- Recenzii utilizatori -->
                </FodExpansionPanel>
                <FodExpansionPanel Text="Întrebări" Id="qa">
                    <!-- Q&A -->
                </FodExpansionPanel>
            </FodExpansionPanels>
        </FodModalBody>
    </FodModalContent>
</FodModal>
```

### 8. Patterns comune

#### Accordion pentru navigare laterală
```razor
<div class="sidebar">
    <FodExpansionPanels>
        @foreach (var menuSection in menuSections)
        {
            <FodExpansionPanel Text="@menuSection.Title" 
                               Id="@menuSection.Id"
                               IsExpanded="@(menuSection.Id == activeSection)">
                <FodList>
                    @foreach (var item in menuSection.Items)
                    {
                        <FodListItem OnClick="@(() => NavigateTo(item.Url))"
                                     Selected="@(currentUrl == item.Url)">
                            <FodIcon Icon="@item.Icon" Class="me-2" />
                            @item.Label
                        </FodListItem>
                    }
                </FodList>
            </FodExpansionPanel>
        }
    </FodExpansionPanels>
</div>
```

#### Timeline cu expansion panels
```razor
<FodExpansionPanels MultiExpansion="true">
    @foreach (var timelineItem in timeline.OrderByDescending(t => t.Date))
    {
        <FodExpansionPanel Text="@($"{timelineItem.Date:dd.MM.yyyy} - {timelineItem.Title}")" 
                           Id="@($"timeline-{timelineItem.Id}")">
            <div class="timeline-content">
                <FodText Typo="Typo.body1" GutterBottom="true">
                    @timelineItem.Description
                </FodText>
                
                @if (timelineItem.Attachments.Any())
                {
                    <FodText Typo="Typo.subtitle2">Atașamente:</FodText>
                    <FodList>
                        @foreach (var attachment in timelineItem.Attachments)
                        {
                            <FodListItem>
                                <FodIcon Icon="@FodIcons.Material.Filled.AttachFile" />
                                <FodLink Href="@attachment.Url">@attachment.Name</FodLink>
                            </FodListItem>
                        }
                    </FodList>
                }
            </div>
        </FodExpansionPanel>
    }
</FodExpansionPanels>
```

### 9. Performanță

- Folosiți `@key` pentru panouri generate dinamic
- Evitați re-render inutile păstrând referințe stabile
- Pentru liste foarte mari, considerați virtualizare
- Încărcați conținut lazy pentru panouri grele

```razor
<FodExpansionPanel Text="Date complexe" Id="complex-data">
    @if (isPanelExpanded)
    {
        <ComplexDataComponent />
    }
    else
    {
        <FodText>Click pentru a încărca datele...</FodText>
    }
</FodExpansionPanel>
```

### 10. Accesibilitate

- Folosiți ID-uri descriptive pentru panouri
- Asigurați contrast suficient pentru text
- Suport pentru navigare cu tastatură
- ARIA labels sunt generate automat
- Focus management corect

### 11. Bune practici

1. **ID-uri unice** - Asigurați-vă că fiecare panou are un ID unic
2. **Titluri clare** - Folosiți texte descriptive pentru headers
3. **Conținut organizat** - Grupați logic informațiile
4. **Loading states** - Afișați indicatori pentru conținut dinamic
5. **Responsive** - Testați pe diferite dimensiuni de ecran
6. **Limite rezonabile** - Nu depășiți 10-15 panouri într-un container

### 12. Troubleshooting

#### Panourile nu se expandează
- Verificați că ID-urile sunt unice
- Verificați că panourile sunt în interiorul FodExpansionPanels
- Verificați consolă pentru erori JavaScript

#### Animația nu funcționează smooth
- Verificați că Bootstrap CSS este încărcat
- Evitați schimbări de înălțime în timpul animației

#### MultiExpansion nu funcționează
- Verificați că ați setat `MultiExpansion="true"` pe container
- Verificați că nu aveți logică custom care interferează

### 13. Limitări cunoscute

- Dependență de Bootstrap pentru stiluri
- Nu suportă animații custom native
- Nu are evenimente publice built-in
- Nu suportă lazy loading nativ

### 14. Exemple avansate

#### Expansion panels cu stare persistentă
```razor
@inject ILocalStorageService LocalStorage

<FodExpansionPanels MultiExpansion="true">
    @foreach (var section in sections)
    {
        <FodExpansionPanel Text="@section.Title" 
                           Id="@section.Id"
                           IsExpanded="@IsExpanded(section.Id)">
            @section.Content
        </FodExpansionPanel>
    }
</FodExpansionPanels>

@code {
    private HashSet<string> expandedPanels = new();
    
    protected override async Task OnInitializedAsync()
    {
        var saved = await LocalStorage.GetItemAsync<string[]>("expandedPanels");
        if (saved != null)
        {
            expandedPanels = new HashSet<string>(saved);
        }
    }
    
    private bool IsExpanded(string panelId) => expandedPanels.Contains(panelId);
    
    private async Task TogglePanel(string panelId)
    {
        if (expandedPanels.Contains(panelId))
            expandedPanels.Remove(panelId);
        else
            expandedPanels.Add(panelId);
            
        await LocalStorage.SetItemAsync("expandedPanels", expandedPanels.ToArray());
    }
}
```

### 15. Concluzie
`FodExpansionPanels` și `FodExpansionPanel` oferă o soluție elegantă pentru organizarea conținutului în secțiuni expandabile. Cu suport pentru single și multi-expansion, integrare ușoară și design responsive, acestea sunt ideale pentru formulare complexe, setări, FAQ-uri și multe alte scenarii de utilizare.