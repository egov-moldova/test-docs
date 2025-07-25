# Image

## Documentație pentru componenta FodImage

### 1. Descriere Generală
`FodImage` este componenta pentru afișarea imaginilor în aplicații Blazor, oferind control asupra dimensiunilor, poziționării și modului de redimensionare. Componenta suportă imagini responsive și diferite moduri de încadrare în container.

Caracteristici principale:
- Imagini responsive cu layout fluid
- Control asupra modului de redimensionare (object-fit)
- Poziționare flexibilă în container (object-position)
- Sistem de elevație pentru umbre
- Dimensiuni fixe sau fluide
- Integrare cu sistemul de clase CSS FOD
- Suport pentru atribute HTML adiționale

### 2. Ghid de Utilizare API

#### Imagine de bază
```razor
<FodImage Src="/images/logo.png" Alt="Logo aplicație" />
```

#### Imagine responsivă (fluid)
```razor
<FodImage Src="/images/banner.jpg" 
          Alt="Banner principal" 
          Fluid="true" />
```

#### Imagine cu dimensiuni fixe
```razor
<FodImage Src="/images/product.jpg" 
          Alt="Produs" 
          Width="300" 
          Height="200" />
```

#### Imagine cu object-fit pentru păstrarea proporțiilor
```razor
<!-- Cover - acoperă tot containerul păstrând proporțiile -->
<FodImage Src="/images/landscape.jpg" 
          Alt="Peisaj" 
          Width="400" 
          Height="300"
          ObjectFit="ObjectFit.Cover" />

<!-- Contain - încadrează complet în container -->
<FodImage Src="/images/portrait.jpg" 
          Alt="Portret" 
          Width="200" 
          Height="300"
          ObjectFit="ObjectFit.Contain" />

<!-- Scale-down - cel mai mic dintre none sau contain -->
<FodImage Src="/images/icon.png" 
          Alt="Pictogramă" 
          Width="100" 
          Height="100"
          ObjectFit="ObjectFit.ScaleDown" />
```

#### Imagine cu poziționare personalizată
```razor
<!-- Poziționare sus -->
<FodImage Src="/images/tall-image.jpg" 
          Alt="Imagine înaltă" 
          Width="300" 
          Height="200"
          ObjectFit="ObjectFit.Cover"
          ObjectPosition="ObjectPosition.Top" />

<!-- Poziționare stânga-sus -->
<FodImage Src="/images/large-image.jpg" 
          Alt="Imagine mare" 
          Width="400" 
          Height="300"
          ObjectFit="ObjectFit.Cover"
          ObjectPosition="ObjectPosition.LeftTop" />
```

#### Imagine cu elevație (umbră)
```razor
<!-- Umbră mică -->
<FodImage Src="/images/card-image.jpg" 
          Alt="Imagine card" 
          Elevation="2"
          Fluid="true" />

<!-- Umbră medie -->
<FodImage Src="/images/featured.jpg" 
          Alt="Imagine promovată" 
          Elevation="8"
          Width="600"
          Height="400" />

<!-- Umbră mare pentru accent -->
<FodImage Src="/images/hero.jpg" 
          Alt="Imagine hero" 
          Elevation="16"
          Fluid="true" />
```

#### Galerie de imagini
```razor
<FodGrid Container="true" Spacing="3">
    @foreach (var image in galleryImages)
    {
        <FodGrid Item="true" xs="12" sm="6" md="4">
            <FodPaper Elevation="2" Class="overflow-hidden">
                <FodImage Src="@image.Url" 
                          Alt="@image.Description"
                          ObjectFit="ObjectFit.Cover"
                          Height="250"
                          Fluid="true" />
                <div class="pa-3">
                    <FodText Typo="Typo.subtitle2">@image.Title</FodText>
                    <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                        @image.Date.ToString("dd.MM.yyyy")
                    </FodText>
                </div>
            </FodPaper>
        </FodGrid>
    }
</FodGrid>
```

#### Card de produs cu imagine
```razor
<FodCard Class="product-card">
    <FodImage Src="@product.ImageUrl" 
              Alt="@product.Name"
              Height="200"
              ObjectFit="ObjectFit.Cover"
              Fluid="true" />
    <FodCardContent>
        <FodText Typo="Typo.h6">@product.Name</FodText>
        <FodText Typo="Typo.body2" Color="FodColor.Secondary" GutterBottom="true">
            @product.Description
        </FodText>
        <FodText Typo="Typo.h5" Color="FodColor.Primary">
            @product.Price.ToString("C")
        </FodText>
    </FodCardContent>
    <FodCardActions>
        <FodButton Color="FodColor.Primary">Vezi detalii</FodButton>
        <FodButton Color="FodColor.Secondary">Adaugă în coș</FodButton>
    </FodCardActions>
</FodCard>
```

#### Imagine profil utilizator
```razor
<div class="user-profile d-flex align-items-center">
    <FodPaper Class="overflow-hidden" 
              Style="border-radius: 50%; width: 80px; height: 80px;">
        <FodImage Src="@user.ProfileImageUrl" 
                  Alt="@($"Fotografie profil {user.Name}")"
                  Width="80"
                  Height="80"
                  ObjectFit="ObjectFit.Cover" />
    </FodPaper>
    <div class="ms-3">
        <FodText Typo="Typo.h6">@user.Name</FodText>
        <FodText Typo="Typo.caption" Color="FodColor.Secondary">
            @user.Email
        </FodText>
    </div>
</div>
```

#### Banner hero cu imagine de fundal
```razor
<div class="hero-section" style="position: relative; height: 400px; overflow: hidden;">
    <FodImage Src="/images/hero-background.jpg" 
              Alt=""
              Style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
              ObjectFit="ObjectFit.Cover"
              ObjectPosition="ObjectPosition.Center" />
    
    <div style="position: relative; z-index: 1;" class="pa-8 text-white">
        <FodText Typo="Typo.h1" Color="FodColor.White">
            Bine ați venit
        </FodText>
        <FodText Typo="Typo.h5" Color="FodColor.White">
            Descoperiți produsele noastre
        </FodText>
    </div>
</div>
```

#### Miniatură cu zoom la hover
```razor
<div class="thumbnail-container" 
     style="overflow: hidden; cursor: pointer;"
     @onmouseover="@(() => isHovered = true)"
     @onmouseout="@(() => isHovered = false)">
    <FodImage Src="/images/thumbnail.jpg" 
              Alt="Miniatură"
              Width="200"
              Height="150"
              ObjectFit="ObjectFit.Cover"
              Class="@(isHovered ? "zoom-effect" : "")"
              Style="transition: transform 0.3s ease;" />
</div>

@code {
    private bool isHovered = false;
}

<style>
    .zoom-effect {
        transform: scale(1.1);
    }
</style>
```

#### Imagine cu sursă dinamică
```razor
<FodImage Src="@GetImageUrl(category)" 
          Alt="@($"Imagine categorie {category.Name}")"
          Height="100"
          Width="100"
          ObjectFit="ObjectFit.Contain" />

@code {
    private string GetImageUrl(Category category)
    {
        return $"/api/images/categories/{category.Id}.jpg";
    }
}
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Src` | `string` | Calea către imagine | - |
| `Alt` | `string` | Text alternativ pentru accesibilitate | - |
| `Fluid` | `bool` | Face imaginea responsivă | `false` |
| `Width` | `int?` | Lățimea în pixeli | `null` |
| `Height` | `int?` | Înălțimea în pixeli | `null` |
| `Elevation` | `int` | Nivelul umbrei (0-25) | `0` |
| `ObjectFit` | `ObjectFit` | Modul de redimensionare | `Fill` |
| `ObjectPosition` | `ObjectPosition` | Poziționarea în container | `Center` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |
| `UserAttributes` | `Dictionary<string, object>` | Atribute HTML adiționale | `null` |

### 4. Enumerări

#### ObjectFit
| Valoare | Descriere |
|---------|-----------|
| `None` | Nu redimensionează imaginea |
| `Cover` | Acoperă containerul păstrând proporțiile |
| `Contain` | Se încadrează complet păstrând proporțiile |
| `Fill` | Umple containerul (poate deforma) |
| `ScaleDown` | Cel mai mic dintre none sau contain |

#### ObjectPosition
| Valoare | Descriere |
|---------|-----------|
| `Center` | Centrat (implicit) |
| `Top` | Sus centrat |
| `Bottom` | Jos centrat |
| `Left` | Stânga centrat |
| `Right` | Dreapta centrat |
| `LeftTop` | Stânga sus |
| `LeftBottom` | Stânga jos |
| `RightTop` | Dreapta sus |
| `RightBottom` | Dreapta jos |

### 5. Stilizare și personalizare

```css
/* Imagini cu colțuri rotunjite */
.rounded-image {
    border-radius: 8px;
    overflow: hidden;
}

/* Imagine circulară */
.circle-image {
    border-radius: 50%;
    overflow: hidden;
}

/* Efect de hover pentru galerii */
.gallery-image {
    transition: all 0.3s ease;
    cursor: pointer;
}

.gallery-image:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

/* Imagine cu overlay */
.image-with-overlay {
    position: relative;
}

.image-with-overlay::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%);
}

/* Placeholder pentru imagini care se încarcă */
.image-loading {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
```

### 6. Integrare cu alte componente

#### În Card
```razor
<FodCard>
    <FodImage Src="/images/card-header.jpg" 
              Alt="Header imagine"
              Height="200"
              ObjectFit="ObjectFit.Cover"
              Fluid="true" />
    <FodCardContent>
        <!-- Conținut card -->
    </FodCardContent>
</FodCard>
```

#### În Liste
```razor
<FodList>
    <FodListItem>
        <div class="d-flex align-items-center">
            <FodImage Src="/images/icon1.png" 
                      Alt="Icon"
                      Width="40"
                      Height="40"
                      Class="me-3" />
            <FodText>Element cu imagine</FodText>
        </div>
    </FodListItem>
</FodList>
```

#### În Modal pentru previzualizare
```razor
<FodModal Show="showImageModal" Size="Size.Large">
    <FodModalContent>
        <FodModalHeader>
            <FodText Typo="Typo.h6">Previzualizare imagine</FodText>
        </FodModalHeader>
        <FodModalBody Class="pa-0">
            <FodImage Src="@selectedImage" 
                      Alt="Imagine mărită"
                      Fluid="true"
                      ObjectFit="ObjectFit.Contain" />
        </FodModalBody>
    </FodModalContent>
</FodModal>
```

### 7. Patterns comune

#### Imagine cu fallback (manual)
```razor
<FodImage Src="@(string.IsNullOrEmpty(imageUrl) ? "/images/placeholder.jpg" : imageUrl)" 
          Alt="@altText"
          Fluid="true" />
```

#### Imagine lazy (atribut manual)
```razor
<FodImage Src="@imageSrc" 
          Alt="@imageAlt"
          Fluid="true"
          UserAttributes="@(new Dictionary<string, object> { { "loading", "lazy" } })" />
```

### 8. Performanță

- Folosiți `Fluid="true"` pentru imagini responsive
- Specificați Width și Height pentru a evita layout shift
- Pentru galerii mari, considerați paginare
- Optimizați imaginile înainte de încărcare
- Folosiți formate moderne (WebP) când este posibil

### 9. Accesibilitate

- **Întotdeauna** specificați atributul Alt
- Pentru imagini decorative, folosiți Alt=""
- Descrieri clare și concise în Alt
- Evitați "imagine de" sau "pictură cu" în Alt

### 10. Note și observații

- Nu există suport încorporat pentru lazy loading
- Nu există gestionare erori pentru imagini lipsă
- ObjectFit necesită suport browser modern
- Elevation funcționează doar cu imagini non-fluide

### 11. Bune practici

1. **Alt descriptiv** - Întotdeauna includeți text alternativ relevant
2. **Dimensiuni explicite** - Preveniți layout shift specificând dimensiuni
3. **Optimizare** - Folosiți imagini optimizate pentru web
4. **Responsive** - Folosiți Fluid pentru imagini adaptive
5. **Object-fit** - Alegeți metoda potrivită de încadrare
6. **Performanță** - Considerați lazy loading pentru imagini multe

### 12. Troubleshooting

#### Imaginea nu se afișează
- Verificați calea Src
- Verificați că fișierul există
- Verificați permisiunile de acces

#### Imaginea este deformată
- Folosiți ObjectFit="ObjectFit.Cover" sau "Contain"
- Verificați proporțiile Width/Height

#### Imaginea depășește containerul
- Adăugați Fluid="true"
- Folosiți clase CSS pentru overflow

### 13. Limitări cunoscute

- Fără suport pentru srcset/sizes
- Fără placeholder în timpul încărcării
- Fără gestionare automată a erorilor
- Fără suport pentru formate moderne automat

### 14. Concluzie
`FodImage` oferă funcționalitatea de bază pentru afișarea imaginilor cu control asupra dimensiunilor și poziționării. Deși lipsesc unele funcții moderne de performanță, componenta se integrează bine în ecosistemul FOD și acoperă majoritatea cazurilor comune de utilizare.