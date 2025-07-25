# Rating

## Documentație pentru componenta FodRating

### 1. Descriere Generală
`FodRating` este componenta pentru selectarea unei evaluări sau rating în aplicații Blazor, oferind o interfață intuitivă cu stele sau alte iconițe personalizabile. Componenta suportă interacțiuni mouse și tastatură, stări diverse și personalizare completă.

Caracteristici principale:
- Evaluare cu 1-n stele (configurabil)
- Iconițe personalizabile pentru stări pline/goale
- Suport pentru hover cu preview
- Navigare cu tastatură (săgeți)
- Moduri readonly și disabled
- Culori și dimensiuni multiple
- Two-way data binding
- Animații fluide la interacțiune
- Accesibilitate completă

### 2. Ghid de Utilizare API

#### Rating de bază
```razor
<FodRating @bind-SelectedValue="rating" />

@code {
    private int rating = 3;
}
```

#### Rating cu număr diferit de stele
```razor
<!-- Rating 1-10 -->
<FodRating @bind-SelectedValue="rating" MaxValue="10" />

<!-- Rating 1-3 -->
<FodRating @bind-SelectedValue="rating" MaxValue="3" />
```

#### Rating cu feedback hover
```razor
<FodRating @bind-SelectedValue="rating" 
           @bind-HoveredValue="hoveredRating" />

<FodText Typo="Typo.body2" Class="mt-2">
    @if (hoveredRating > 0)
    {
        <text>Veți selecta: @hoveredRating stele</text>
    }
    else if (rating > 0)
    {
        <text>Ați selectat: @rating stele</text>
    }
    else
    {
        <text>Selectați o evaluare</text>
    }
</FodText>

@code {
    private int rating = 0;
    private int hoveredRating = 0;
}
```

#### Rating cu iconițe personalizate
```razor
<!-- Inimi în loc de stele -->
<FodRating @bind-SelectedValue="loveRating"
           FullIcon="@FodIcons.Material.Filled.Favorite"
           EmptyIcon="@FodIcons.Material.Outlined.FavoriteBorder"
           Color="FodColor.Error" />

<!-- Emoji-uri -->
<FodRating @bind-SelectedValue="moodRating"
           MaxValue="5"
           FullIcon="@FodIcons.Material.Filled.SentimentVerySatisfied"
           EmptyIcon="@FodIcons.Material.Outlined.SentimentVerySatisfied"
           Color="FodColor.Success" />

<!-- Thumbs up -->
<FodRating @bind-SelectedValue="likeRating"
           MaxValue="1"
           FullIcon="@FodIcons.Material.Filled.ThumbUp"
           EmptyIcon="@FodIcons.Material.Outlined.ThumbUp"
           Color="FodColor.Primary" />
```

#### Dimensiuni diferite
```razor
<!-- Small -->
<FodRating @bind-SelectedValue="rating" 
           Size="FodSize.Small" />

<!-- Medium (implicit) -->
<FodRating @bind-SelectedValue="rating" 
           Size="FodSize.Medium" />

<!-- Large -->
<FodRating @bind-SelectedValue="rating" 
           Size="FodSize.Large" />
```

#### Rating readonly
```razor
<!-- Afișare rating existent -->
<div class="product-rating">
    <FodRating SelectedValue="4" 
               ReadOnly="true" />
    <FodText Typo="Typo.body2" Class="ms-2">
        4.0 din 5 (123 recenzii)
    </FodText>
</div>
```

#### Rating dezactivat
```razor
<FodRating @bind-SelectedValue="rating" 
           Disabled="@(!canRate)" />

@code {
    private bool canRate = false;
    private int rating = 0;
}
```

#### Rating în formular
```razor
<EditForm Model="@review" OnValidSubmit="SubmitReview">
    <DataAnnotationsValidator />
    
    <FodTextField @bind-Value="review.Title" 
                  Label="Titlu recenzie" 
                  Required="true" />
    
    <div class="my-3">
        <FodText Typo="Typo.body1" GutterBottom="true">
            Evaluare generală
        </FodText>
        <FodRating @bind-SelectedValue="review.Rating" />
        <ValidationMessage For="@(() => review.Rating)" />
    </div>
    
    <FodTextArea @bind-Value="review.Comment" 
                 Label="Comentariu"
                 Rows="4" />
    
    <FodButton Type="ButtonType.Submit" 
               Color="FodColor.Primary">
        Trimite recenzia
    </FodButton>
</EditForm>

@code {
    private ProductReview review = new();
    
    public class ProductReview
    {
        public string Title { get; set; }
        
        [Required(ErrorMessage = "Vă rugăm selectați o evaluare")]
        [Range(1, 5, ErrorMessage = "Evaluarea trebuie să fie între 1 și 5")]
        public int Rating { get; set; }
        
        public string Comment { get; set; }
    }
}
```

#### Card produs cu rating
```razor
<FodCard>
    <FodCardMedia Image="@product.ImageUrl" 
                  Title="@product.Name" />
    <FodCardContent>
        <FodText Typo="Typo.h6">@product.Name</FodText>
        
        <div class="d-flex align-items-center my-2">
            <FodRating SelectedValue="@product.AverageRating" 
                       ReadOnly="true"
                       Size="FodSize.Small" />
            <FodText Typo="Typo.body2" Class="ms-2">
                @product.AverageRating.ToString("F1") 
                (@product.ReviewCount recenzii)
            </FodText>
        </div>
        
        <FodText Typo="Typo.h5" Color="FodColor.Primary">
            @product.Price.ToString("C")
        </FodText>
    </FodCardContent>
    <FodCardActions>
        <FodButton Color="FodColor.Primary">
            Adaugă în coș
        </FodButton>
    </FodCardActions>
</FodCard>
```

#### Sistem de feedback cu rating
```razor
<FodPaper Class="pa-4">
    <FodText Typo="Typo.h5" GutterBottom="true">
        Cum a fost experiența dvs?
    </FodText>
    
    <!-- Rating principal -->
    <div class="text-center my-4">
        <FodRating @bind-SelectedValue="overallRating"
                   @bind-HoveredValue="hoveredRating"
                   Size="FodSize.Large" />
        <FodText Typo="Typo.body1" Class="mt-2">
            @GetRatingText()
        </FodText>
    </div>
    
    <!-- Ratinguri detaliate -->
    @if (overallRating > 0)
    {
        <FodDivider Class="my-3" />
        
        <div class="detailed-ratings">
            <div class="rating-row">
                <FodText Class="rating-label">Calitate serviciu</FodText>
                <FodRating @bind-SelectedValue="serviceRating" 
                           Size="FodSize.Small" />
            </div>
            
            <div class="rating-row">
                <FodText Class="rating-label">Timp de răspuns</FodText>
                <FodRating @bind-SelectedValue="responseRating" 
                           Size="FodSize.Small" />
            </div>
            
            <div class="rating-row">
                <FodText Class="rating-label">Profesionalism</FodText>
                <FodRating @bind-SelectedValue="professionalRating" 
                           Size="FodSize.Small" />
            </div>
        </div>
        
        <FodTextArea @bind-Value="comments" 
                     Label="Comentarii adiționale"
                     Rows="3"
                     Class="mt-3" />
        
        <FodButton Color="FodColor.Primary" 
                   Class="mt-3"
                   OnClick="SubmitFeedback">
            Trimite feedback
        </FodButton>
    }
</FodPaper>

@code {
    private int overallRating = 0;
    private int hoveredRating = 0;
    private int serviceRating = 0;
    private int responseRating = 0;
    private int professionalRating = 0;
    private string comments = "";
    
    private string GetRatingText()
    {
        var rating = hoveredRating > 0 ? hoveredRating : overallRating;
        return rating switch
        {
            1 => "Foarte nemulțumit",
            2 => "Nemulțumit",
            3 => "Neutru",
            4 => "Mulțumit",
            5 => "Foarte mulțumit",
            _ => "Evaluați experiența"
        };
    }
}

<style>
    .rating-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .rating-label {
        min-width: 150px;
    }
</style>
```

#### Rating cu statistici
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Evaluări clienți
        </FodText>
        
        <!-- Rating mediu -->
        <div class="d-flex align-items-center mb-3">
            <FodText Typo="Typo.h2" Class="me-3">
                @averageRating.ToString("F1")
            </FodText>
            <div>
                <FodRating SelectedValue="@((int)Math.Round(averageRating))" 
                           ReadOnly="true" />
                <FodText Typo="Typo.body2" Color="FodColor.Secondary">
                    Bazat pe @totalReviews recenzii
                </FodText>
            </div>
        </div>
        
        <!-- Distribuție ratinguri -->
        @for (int stars = 5; stars >= 1; stars--)
        {
            var percentage = GetRatingPercentage(stars);
            <div class="rating-distribution">
                <FodRating SelectedValue="stars" 
                           ReadOnly="true"
                           Size="FodSize.Small" />
                <FodLoadingLinear Value="percentage" 
                                  Class="mx-2 flex-grow-1"
                                  Color="FodColor.Primary" />
                <FodText Typo="Typo.caption" Style="min-width: 40px;">
                    @percentage%
                </FodText>
            </div>
        }
    </FodCardContent>
</FodCard>

@code {
    private double averageRating = 4.3;
    private int totalReviews = 156;
    private Dictionary<int, int> ratingDistribution = new()
    {
        { 5, 85 },
        { 4, 45 },
        { 3, 15 },
        { 2, 8 },
        { 1, 3 }
    };
    
    private int GetRatingPercentage(int stars)
    {
        if (totalReviews == 0) return 0;
        return (int)Math.Round(ratingDistribution[stars] * 100.0 / totalReviews);
    }
}

<style>
    .rating-distribution {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }
</style>
```

#### Rating inline în tabel
```razor
<FodDataTable Items="@products">
    <HeaderContent>
        <FodTHeadRow>
            <FodTh>Produs</FodTh>
            <FodTh>Preț</FodTh>
            <FodTh>Evaluare</FodTh>
            <FodTh>Acțiuni</FodTh>
        </FodTHeadRow>
    </HeaderContent>
    <RowTemplate Context="product">
        <FodTr>
            <FodTd>@product.Name</FodTd>
            <FodTd>@product.Price.ToString("C")</FodTd>
            <FodTd>
                <div class="d-flex align-items-center">
                    <FodRating SelectedValue="@product.Rating" 
                               ReadOnly="true"
                               Size="FodSize.Small" />
                    <FodText Typo="Typo.caption" Class="ms-2">
                        (@product.ReviewCount)
                    </FodText>
                </div>
            </FodTd>
            <FodTd>
                <FodIconButton Icon="@FodIcons.Material.Filled.Edit"
                               Size="FodSize.Small"
                               OnClick="@(() => EditProduct(product))" />
            </FodTd>
        </FodTr>
    </RowTemplate>
</FodDataTable>
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `SelectedValue` | `int` | Valoarea selectată | `0` |
| `SelectedValueChanged` | `EventCallback<int>` | Eveniment la schimbare | - |
| `HoveredValue` | `int` | Valoarea hover | `0` |
| `HoveredValueChanged` | `EventCallback<int>` | Eveniment la hover | - |
| `MaxValue` | `int` | Număr maxim de stele | `5` |
| `FullIcon` | `string` | Iconița pentru stele pline | `Star` |
| `EmptyIcon` | `string` | Iconița pentru stele goale | `StarBorder` |
| `Color` | `FodColor` | Culoarea iconițelor | `Default` |
| `Size` | `FodSize` | Dimensiunea iconițelor | `Medium` |
| `Disabled` | `bool` | Dezactivează interacțiunile | `false` |
| `ReadOnly` | `bool` | Doar citire, fără interacțiuni | `false` |
| `DisableRipple` | `bool` | Dezactivează efectul ripple | `false` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |
| `UserAttributes` | `Dictionary<string, object>` | Atribute HTML adiționale | `null` |

### 4. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `SelectedValueChanged` | `EventCallback<int>` | Se declanșează la selectarea unei valori |
| `HoveredValueChanged` | `EventCallback<int>` | Se declanșează la hover pe o valoare |

### 5. Navigare cu tastatură

| Tastă | Acțiune |
|-------|---------|
| `Tab` | Focus pe componentă |
| `←/→` | Navighează între stele |
| `↑/↓` | Navighează între stele |
| `Shift + ←` | Prima stea |
| `Shift + →` | Ultima stea |
| `Space/Enter` | Selectează valoarea curentă |

### 6. Stilizare și personalizare

```css
/* Rating cu dimensiune custom */
.custom-rating .fod-rating-item .fod-icon-root {
    font-size: 2rem !important;
}

/* Rating cu spațiere între stele */
.spaced-rating .fod-rating-item {
    margin: 0 0.25rem;
}

/* Culori diferite pentru hover */
.hover-rating .fod-rating-item:hover .fod-icon-root {
    color: var(--fod-palette-warning-main);
}

/* Animație diferită */
.smooth-rating .fod-rating-item {
    transition: all 0.3s ease;
}

.smooth-rating .fod-rating-item.active {
    transform: scale(1.2) rotate(10deg);
}

/* Rating vertical */
.vertical-rating .fod-rating-root {
    flex-direction: column;
}

/* Gradient pentru stele selectate */
.gradient-rating .fod-rating-item.fod-rating-item-active .fod-icon-root {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

### 7. Integrare cu alte componente

#### În Card
```razor
<FodCard>
    <FodCardContent>
        <FodRating @bind-SelectedValue="rating" />
    </FodCardContent>
</FodCard>
```

#### În Dialog
```razor
<FodDialog Show="@showRatingDialog">
    <FodDialogTitle>Evaluați serviciul</FodDialogTitle>
    <FodDialogContent>
        <FodRating @bind-SelectedValue="serviceRating" 
                   Size="FodSize.Large" />
    </FodDialogContent>
    <FodDialogActions>
        <FodButton OnClick="SubmitRating">Trimite</FodButton>
    </FodDialogActions>
</FodDialog>
```

#### În Chip pentru afișare compactă
```razor
<FodChip Color="FodColor.Primary">
    <FodIcon Icon="@FodIcons.Material.Filled.Star" 
             Size="FodSize.Small" />
    @rating.ToString("F1")
</FodChip>
```

### 8. Validare în formulare

```razor
@using System.ComponentModel.DataAnnotations

<EditForm Model="@model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <InputRating @bind-Value="model.Rating" />
    <ValidationMessage For="@(() => model.Rating)" />
    
    <FodButton Type="ButtonType.Submit">Submit</FodButton>
</EditForm>

@code {
    public class RatingModel
    {
        [Required(ErrorMessage = "Rating este obligatoriu")]
        [Range(1, 5, ErrorMessage = "Rating trebuie să fie între 1 și 5")]
        public int Rating { get; set; }
    }
    
    private RatingModel model = new();
}

// Component wrapper pentru validare
@code {
    public class InputRating : InputBase<int>
    {
        protected override bool TryParseValueFromString(string value, 
            out int result, out string validationErrorMessage)
        {
            if (int.TryParse(value, out result))
            {
                validationErrorMessage = null;
                return true;
            }
            
            validationErrorMessage = "Valoare invalidă";
            return false;
        }
    }
}
```

### 9. Performanță

- Folosește un singur event handler pentru toate stelele
- Minimizează re-render prin CascadingValue
- Animațiile folosesc CSS transforms

### 10. Accesibilitate

- Radio inputs ascunse pentru screen readers
- Suport complet pentru navigare cu tastatură  
- ARIA labels pentru fiecare stea
- Focus vizibil pentru navigare

### 11. Bune practici

1. **Valoare inițială** - Setați 0 pentru "fără rating"
2. **Feedback vizual** - Folosiți HoveredValue pentru preview
3. **Readonly pentru afișare** - Nu disabled pentru date existente
4. **Dimensiuni responsive** - Size.Small pe mobile
5. **Validare** - Verificați rating > 0 înainte de submit
6. **Text descriptiv** - Adăugați text pentru claritate

### 12. Troubleshooting

#### Rating nu răspunde la click
- Verificați că nu este Disabled sau ReadOnly
- Verificați că SelectedValueChanged este conectat

#### Hover nu funcționează
- Verificați că HoveredValueChanged este setat
- Verificați CSS pentru pointer-events

#### Iconițe nu se afișează
- Verificați că iconițele există în FodIcons
- Verificați importul fonturilor de iconițe

### 13. Exemple avansate

#### Rating cu nivele și descrieri
```razor
<div class="rating-with-levels">
    <FodRating @bind-SelectedValue="satisfactionLevel"
               @bind-HoveredValue="hoveredLevel"
               MaxValue="5"
               Size="FodSize.Large" />
    
    <FodText Typo="Typo.h6" Class="mt-2 text-center">
        @GetLevelDescription()
    </FodText>
    
    @if (satisfactionLevel > 0)
    {
        <FodAlert Severity="@GetAlertSeverity()" Class="mt-3">
            @GetDetailedFeedback()
        </FodAlert>
    }
</div>

@code {
    private int satisfactionLevel = 0;
    private int hoveredLevel = 0;
    
    private string GetLevelDescription()
    {
        var level = hoveredLevel > 0 ? hoveredLevel : satisfactionLevel;
        return level switch
        {
            1 => "😞 Foarte nemulțumit",
            2 => "😟 Nemulțumit", 
            3 => "😐 Neutru",
            4 => "😊 Mulțumit",
            5 => "😄 Foarte mulțumit",
            _ => "Selectați nivelul de satisfacție"
        };
    }
    
    private Severity GetAlertSeverity() => satisfactionLevel switch
    {
        1 or 2 => Severity.Error,
        3 => Severity.Warning,
        4 or 5 => Severity.Success,
        _ => Severity.Info
    };
}
```

### 14. Concluzie
`FodRating` oferă o soluție completă și flexibilă pentru implementarea sistemelor de evaluare în aplicații. Cu suport pentru personalizare extensivă, accesibilitate completă și integrare ușoară, componenta acoperă toate cazurile comune de utilizare pentru rating și feedback.