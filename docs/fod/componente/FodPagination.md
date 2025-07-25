# Pagination

## Documentație pentru componenta FodPagination

### 1. Descriere Generală
`FodPagination` este componenta pentru navigarea între pagini în aplicații Blazor, oferind o interfață intuitivă pentru parcurgerea seturilor mari de date. Componenta suportă diferite stiluri vizuale, dimensiuni și configurări pentru butoanele de navigare.

Caracteristici principale:
- Navigare rapidă cu butoane First/Previous/Next/Last
- Afișare inteligentă a numerelor de pagină cu ellipsis (...)
- Trei variante vizuale: Text, Filled, Outlined
- Trei dimensiuni: Small, Medium, Large
- Forme rectangulare sau rotunjite
- Suport pentru RTL (Right-to-Left)
- Design responsive pentru dispozitive mobile
- Accesibilitate completă cu ARIA labels
- Personalizare iconițe navigare

### 2. Ghid de Utilizare API

#### Paginare de bază
```razor
<FodPagination Count="10" 
               Selected="@currentPage"
               SelectedChanged="@((page) => currentPage = page)" />

@code {
    private int currentPage = 1;
}
```

#### Paginare cu toate butoanele de navigare
```razor
<FodPagination Count="20" 
               Selected="@currentPage"
               SelectedChanged="@((page) => currentPage = page)"
               ShowFirstButton="true"
               ShowLastButton="true"
               ShowPreviousButton="true"
               ShowNextButton="true" />
```

#### Variante vizuale

##### Variant Text (implicit)
```razor
<FodPagination Count="15" 
               Selected="@currentPage"
               SelectedChanged="@HandlePageChange"
               Variant="FodVariant.Text" />
```

##### Variant Filled
```razor
<FodPagination Count="15" 
               Selected="@currentPage"
               SelectedChanged="@HandlePageChange"
               Variant="FodVariant.Filled"
               Color="FodColor.Primary" />
```

##### Variant Outlined
```razor
<FodPagination Count="15" 
               Selected="@currentPage"
               SelectedChanged="@HandlePageChange"
               Variant="FodVariant.Outlined"
               Color="FodColor.Secondary" />
```

#### Dimensiuni diferite

##### Small
```razor
<FodPagination Count="10" 
               Selected="@currentPage"
               SelectedChanged="@HandlePageChange"
               Size="FodSize.Small" />
```

##### Medium (implicit)
```razor
<FodPagination Count="10" 
               Selected="@currentPage"
               SelectedChanged="@HandlePageChange"
               Size="FodSize.Medium" />
```

##### Large
```razor
<FodPagination Count="10" 
               Selected="@currentPage"
               SelectedChanged="@HandlePageChange"
               Size="FodSize.Large" />
```

#### Formă rectangulară
```razor
<FodPagination Count="12" 
               Selected="@currentPage"
               SelectedChanged="@HandlePageChange"
               Rectangular="true"
               Variant="FodVariant.Filled" />
```

#### Control asupra afișării paginilor
```razor
<!-- Afișează mai multe pagini la margini -->
<FodPagination Count="50" 
               Selected="@currentPage"
               SelectedChanged="@HandlePageChange"
               BoundaryCount="3"
               MiddleCount="5" />

<!-- Afișare minimă pentru spațiu redus -->
<FodPagination Count="100" 
               Selected="@currentPage"
               SelectedChanged="@HandlePageChange"
               BoundaryCount="1"
               MiddleCount="1" />
```

#### Paginare cu iconițe personalizate
```razor
<FodPagination Count="20" 
               Selected="@currentPage"
               SelectedChanged="@HandlePageChange"
               ShowFirstButton="true"
               ShowLastButton="true"
               FirstIcon="@FodIcons.Material.Filled.SkipPrevious"
               PreviousIcon="@FodIcons.Material.Filled.KeyboardArrowLeft"
               NextIcon="@FodIcons.Material.Filled.KeyboardArrowRight"
               LastIcon="@FodIcons.Material.Filled.SkipNext" />
```

#### Integrare cu tabel de date
```razor
<FodDataTable Items="@products" Context="product">
    <HeaderContent>
        <FodTHeadRow>
            <FodTh>Nume</FodTh>
            <FodTh>Preț</FodTh>
            <FodTh>Stoc</FodTh>
        </FodTHeadRow>
    </HeaderContent>
    <RowTemplate>
        <FodTr>
            <FodTd>@product.Name</FodTd>
            <FodTd>@product.Price.ToString("C")</FodTd>
            <FodTd>@product.Stock</FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>

<div class="mt-4 d-flex justify-content-center">
    <FodPagination Count="@totalPages" 
                   Selected="@currentPage"
                   SelectedChanged="@LoadPage"
                   Variant="FodVariant.Filled"
                   ShowFirstButton="true"
                   ShowLastButton="true" />
</div>

@code {
    private List<Product> products = new();
    private int currentPage = 1;
    private int pageSize = 10;
    private int totalPages;
    private int totalItems;

    protected override async Task OnInitializedAsync()
    {
        await LoadPage(1);
    }

    private async Task LoadPage(int page)
    {
        currentPage = page;
        var result = await ProductService.GetProductsAsync(page, pageSize);
        products = result.Items;
        totalItems = result.TotalCount;
        totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
    }
}
```

#### Paginare în card
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">Lista utilizatori</FodText>
        
        @foreach (var user in currentPageUsers)
        {
            <div class="user-item pa-2">
                <FodText>@user.Name - @user.Email</FodText>
            </div>
        }
    </FodCardContent>
    <FodCardActions Class="justify-content-center">
        <FodPagination Count="@totalPages" 
                       Selected="@currentPage"
                       SelectedChanged="@ChangePage"
                       Size="FodSize.Small"
                       Variant="FodVariant.Text" />
    </FodCardActions>
</FodCard>
```

#### Paginare cu informații despre rezultate
```razor
<div class="results-container">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <FodText Typo="Typo.body2" Color="FodColor.Secondary">
            Afișare @startItem - @endItem din @totalItems rezultate
        </FodText>
        <FodPagination Count="@totalPages" 
                       Selected="@currentPage"
                       SelectedChanged="@HandlePageChange"
                       Size="FodSize.Small" />
    </div>
    
    <!-- Rezultate -->
    <div class="results">
        @foreach (var item in currentResults)
        {
            <!-- Afișare rezultat -->
        }
    </div>
</div>

@code {
    private int startItem => (currentPage - 1) * pageSize + 1;
    private int endItem => Math.Min(currentPage * pageSize, totalItems);
}
```

#### Paginare dezactivată
```razor
<FodPagination Count="10" 
               Selected="@currentPage"
               SelectedChanged="@HandlePageChange"
               Disabled="@isLoading" />

@code {
    private bool isLoading = false;
    
    private async Task HandlePageChange(int page)
    {
        isLoading = true;
        currentPage = page;
        await LoadData(page);
        isLoading = false;
    }
}
```

#### Paginare într-un modal
```razor
<FodModal Show="@showModal">
    <FodModalContent>
        <FodModalHeader>
            <FodText Typo="Typo.h6">Selectați un element</FodText>
        </FodModalHeader>
        <FodModalBody>
            <FodList>
                @foreach (var item in modalItems)
                {
                    <FodListItem Text="@item.Name" 
                                 OnClick="@(() => SelectItem(item))" />
                }
            </FodList>
        </FodModalBody>
        <FodModalFooter>
            <FodPagination Count="@modalTotalPages" 
                           Selected="@modalCurrentPage"
                           SelectedChanged="@LoadModalPage"
                           Size="FodSize.Small"
                           Variant="FodVariant.Text" />
        </FodModalFooter>
    </FodModalContent>
</FodModal>
```

#### Paginare cu state management
```razor
@implements IDisposable
@inject NavigationManager Navigation

<FodPagination Count="@totalPages" 
               Selected="@currentPage"
               SelectedChanged="@NavigateToPage" />

@code {
    protected override void OnInitialized()
    {
        // Extrage pagina din URL
        var uri = new Uri(Navigation.Uri);
        var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
        if (int.TryParse(query["page"], out int page))
        {
            currentPage = page;
        }
    }

    private void NavigateToPage(int page)
    {
        currentPage = page;
        var uri = Navigation.GetUriWithQueryParameter("page", page);
        Navigation.NavigateTo(uri);
    }
}
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Count` | `int` | Numărul total de pagini | - |
| `Selected` | `int` | Pagina curent selectată | - |
| `SelectedChanged` | `EventCallback<int>` | Eveniment la schimbarea paginii | - |
| `BoundaryCount` | `int` | Număr pagini afișate la început/sfârșit | `2` |
| `MiddleCount` | `int` | Număr pagini afișate în jurul celei selectate | `3` |
| `Variant` | `FodVariant` | Stilul vizual (Text/Filled/Outlined) | `Text` |
| `Color` | `FodColor` | Culoarea temei | `Primary` |
| `Size` | `FodSize` | Dimensiunea componentei | `Medium` |
| `Rectangular` | `bool` | Colțuri drepte în loc de rotunjite | `false` |
| `Disabled` | `bool` | Dezactivează toate interacțiunile | `false` |
| `ShowFirstButton` | `bool` | Afișează butonul First | `false` |
| `ShowLastButton` | `bool` | Afișează butonul Last | `false` |
| `ShowPreviousButton` | `bool` | Afișează butonul Previous | `true` |
| `ShowNextButton` | `bool` | Afișează butonul Next | `true` |
| `DisableElevation` | `bool` | Elimină umbra (pentru Filled) | `false` |
| `FirstIcon` | `string` | Iconița pentru First | `ChevronDoubleLeft` |
| `PreviousIcon` | `string` | Iconița pentru Previous | `ChevronLeft` |
| `NextIcon` | `string` | Iconița pentru Next | `ChevronRight` |
| `LastIcon` | `string` | Iconița pentru Last | `ChevronDoubleRight` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |
| `UserAttributes` | `Dictionary<string, object>` | Atribute HTML adiționale | `null` |

### 4. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `SelectedChanged` | `EventCallback<int>` | Se declanșează când utilizatorul selectează o pagină |

### 5. Metode private

Componenta nu expune metode publice, toate interacțiunile se fac prin evenimente.

### 6. Stilizare și personalizare

```css
/* Paginare cu spațiere customizată */
.custom-pagination {
    gap: 1rem;
}

.custom-pagination .fod-pagination-item {
    min-width: 48px;
    height: 48px;
}

/* Paginare compactă pentru mobile */
@media (max-width: 600px) {
    .mobile-pagination .fod-pagination-item-first,
    .mobile-pagination .fod-pagination-item-last {
        display: none;
    }
    
    .mobile-pagination .fod-pagination-item {
        min-width: 36px;
        height: 36px;
        font-size: 0.875rem;
    }
}

/* Stilizare pentru dark mode */
.dark-theme .fod-pagination-item {
    background-color: var(--fod-palette-background-paper);
    color: var(--fod-palette-text-primary);
}

.dark-theme .fod-pagination-item:hover {
    background-color: var(--fod-palette-action-hover);
}

/* Paginare cu accent diferit */
.accent-pagination .fod-pagination-item.selected {
    background-color: var(--fod-palette-secondary-main);
    color: var(--fod-palette-secondary-contrastText);
}
```

### 7. Integrare cu alte componente

#### Cu FodDataTable
```razor
<FodDataTable Items="@items" 
              ShowPagination="true"
              PageSize="20">
    <!-- Conținut tabel -->
</FodDataTable>
```

#### Cu liste infinite
```razor
<div class="infinite-list">
    <FodList>
        @foreach (var item in visibleItems)
        {
            <FodListItem Text="@item.Name" />
        }
    </FodList>
    
    @if (hasMorePages)
    {
        <div class="text-center pa-4">
            <FodButton OnClick="LoadMore" 
                       Variant="FodVariant.Text">
                Încarcă mai multe
            </FodButton>
        </div>
    }
    
    <FodPagination Count="@totalPages" 
                   Selected="@currentPage"
                   SelectedChanged="@GoToPage"
                   Size="FodSize.Small" />
</div>
```

### 8. Patterns comune

#### Paginare cu loading state
```razor
<div class="@(isLoading ? "loading-overlay" : "")">
    <FodPagination Count="@totalPages" 
                   Selected="@currentPage"
                   SelectedChanged="@HandlePageChange"
                   Disabled="@isLoading" />
</div>

@if (isLoading)
{
    <FodProgress Indeterminate="true" />
}
```

#### Paginare cu dimensiune pagină selectabilă
```razor
<div class="d-flex justify-content-between align-items-center">
    <FodSelect @bind-Value="pageSize" 
               Label="Rezultate per pagină"
               Style="width: 120px;">
        <FodSelectItem Value="10">10</FodSelectItem>
        <FodSelectItem Value="25">25</FodSelectItem>
        <FodSelectItem Value="50">50</FodSelectItem>
        <FodSelectItem Value="100">100</FodSelectItem>
    </FodSelect>
    
    <FodPagination Count="@totalPages" 
                   Selected="@currentPage"
                   SelectedChanged="@HandlePageChange" />
</div>
```

### 9. Performanță

- Componenta calculează eficient paginile vizibile
- Folosește `@key` pentru optimizarea randării
- Minimizează re-randările prin memorarea stării
- Responsive prin CSS, nu JavaScript

### 10. Accesibilitate

- Atribute ARIA pentru screen readers
- `aria-label` descriptiv pentru fiecare buton
- `aria-current="page"` pentru pagina selectată
- Navigare cu tastatură completă
- Focus vizibil pentru navigare

### 11. Note tehnice

- Calculul ellipsis-ului este inteligent și adaptiv
- Suportă până la 999999 pagini
- Funcționează corect cu RTL
- Responsive fără JavaScript adițional

### 12. Bune practici

1. **Păstrați starea în URL** - Pentru navigare înapoi/înainte
2. **Loading states** - Dezactivați în timpul încărcării
3. **Dimensiune pagină** - Oferiți opțiuni utilizatorului
4. **Mobile first** - Folosiți Size.Small pe mobile
5. **Feedback vizual** - Indicați clar pagina curentă
6. **Limite rezonabile** - Nu afișați mii de pagini

### 13. Troubleshooting

#### Paginarea nu răspunde la click
- Verificați că SelectedChanged este conectat
- Verificați că nu este Disabled
- Verificați că Selected este în intervalul 1-Count

#### Layout-ul se strică pe mobile
- Folosiți Size="FodSize.Small"
- Reduceți BoundaryCount și MiddleCount
- Considerați ascunderea First/Last buttons

#### Performanță slabă cu multe pagini
- Verificați că nu re-randați excesiv
- Folosiți paginare virtuală pentru seturi foarte mari
- Considerați lazy loading

### 14. Exemple complexe

#### Sistem complet de paginare
```razor
@page "/products"
@inject IProductService ProductService

<FodContainer>
    <FodText Typo="Typo.h4" GutterBottom="true">
        Catalog Produse
    </FodText>
    
    <!-- Filtre și sortare -->
    <FodPaper Class="pa-3 mb-4">
        <FodGrid Container="true" Spacing="2">
            <FodGrid Item="true" xs="12" sm="6" md="3">
                <FodSelect @bind-Value="sortBy" Label="Sortare">
                    <FodSelectItem Value="name">Nume</FodSelectItem>
                    <FodSelectItem Value="price">Preț</FodSelectItem>
                    <FodSelectItem Value="date">Dată</FodSelectItem>
                </FodSelect>
            </FodGrid>
            <FodGrid Item="true" xs="12" sm="6" md="3">
                <FodSelect @bind-Value="pageSize" 
                           Label="Produse per pagină"
                           SelectedValuesChanged="@(() => LoadProducts(1))">
                    <FodSelectItem Value="12">12</FodSelectItem>
                    <FodSelectItem Value="24">24</FodSelectItem>
                    <FodSelectItem Value="48">48</FodSelectItem>
                </FodSelect>
            </FodGrid>
        </FodGrid>
    </FodPaper>
    
    <!-- Grid produse -->
    @if (isLoading)
    {
        <FodProgress Indeterminate="true" />
    }
    else
    {
        <FodGrid Container="true" Spacing="3">
            @foreach (var product in products)
            {
                <FodGrid Item="true" xs="12" sm="6" md="4" lg="3">
                    <ProductCard Product="@product" />
                </FodGrid>
            }
        </FodGrid>
        
        <!-- Paginare -->
        <div class="mt-5 d-flex flex-column align-items-center">
            <FodText Typo="Typo.body2" Color="FodColor.Secondary" GutterBottom="true">
                Afișare @startItem - @endItem din @totalItems produse
            </FodText>
            <FodPagination Count="@totalPages" 
                           Selected="@currentPage"
                           SelectedChanged="@LoadProducts"
                           Variant="FodVariant.Filled"
                           ShowFirstButton="@(totalPages > 10)"
                           ShowLastButton="@(totalPages > 10)"
                           BoundaryCount="@(IsMobile ? 1 : 2)"
                           MiddleCount="@(IsMobile ? 1 : 3)"
                           Size="@(IsMobile ? FodSize.Small : FodSize.Medium)" />
        </div>
    }
</FodContainer>

@code {
    private List<Product> products = new();
    private int currentPage = 1;
    private int pageSize = 24;
    private int totalPages;
    private int totalItems;
    private string sortBy = "name";
    private bool isLoading;
    
    private int startItem => (currentPage - 1) * pageSize + 1;
    private int endItem => Math.Min(currentPage * pageSize, totalItems);
    private bool IsMobile => /* logica pentru detectare mobile */;
    
    protected override async Task OnInitializedAsync()
    {
        // Restaurează din query string
        var uri = new Uri(Navigation.Uri);
        var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
        
        if (int.TryParse(query["page"], out int page))
            currentPage = page;
        if (int.TryParse(query["size"], out int size))
            pageSize = size;
        if (!string.IsNullOrEmpty(query["sort"]))
            sortBy = query["sort"];
            
        await LoadProducts(currentPage);
    }
    
    private async Task LoadProducts(int page)
    {
        isLoading = true;
        StateHasChanged();
        
        try
        {
            currentPage = page;
            
            // Actualizează URL
            var uri = Navigation.GetUriWithQueryParameters(new Dictionary<string, object>
            {
                ["page"] = page,
                ["size"] = pageSize,
                ["sort"] = sortBy
            });
            Navigation.NavigateTo(uri, replace: true);
            
            // Încarcă date
            var result = await ProductService.GetProductsAsync(
                page: page,
                pageSize: pageSize,
                sortBy: sortBy
            );
            
            products = result.Items;
            totalItems = result.TotalCount;
            totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
        }
        finally
        {
            isLoading = false;
            StateHasChanged();
        }
    }
}
```

### 15. Concluzie
`FodPagination` oferă o soluție completă pentru navigarea între pagini, cu suport pentru diferite stiluri vizuale, dimensiuni și configurări. Componenta este optimizată pentru performanță, accesibilitate și responsive design, făcând-o ideală pentru orice aplicație care necesită paginare.