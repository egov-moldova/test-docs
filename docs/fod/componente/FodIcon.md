# Icon

## Documentație pentru componenta FodIcon

### 1. Descriere Generală
`FodIcon` este componenta fundamentală pentru afișarea pictogramelor în aplicațiile FOD. Suportă atât pictograme SVG inline, cât și fonturi de pictograme (Material Icons, FontAwesome, etc.), oferind o interfață unificată pentru toate nevoile de iconografie.

Caracteristici principale:
- Suport dual: SVG inline și fonturi de pictograme
- Bibliotecă completă Material Icons (5 variante)
- Pictograme custom pentru branduri și formate de fișiere
- 5 dimensiuni predefinite
- Integrare completă cu sistemul de culori FOD
- Optimizat pentru performanță
- Suport pentru accesibilitate
- Utilizare consistentă în toate componentele FOD

### 2. Ghid de Utilizare API

#### Icon de bază
```razor
<FodIcon Icon="@FodIcons.Material.Filled.Home" />
```

#### Icon cu dimensiune și culoare
```razor
<!-- Icon mic cu culoare primară -->
<FodIcon Icon="@FodIcons.Material.Filled.Settings" 
         Size="FodSize.Small" 
         Color="FodColor.Primary" />

<!-- Icon mare cu culoare de succes -->
<FodIcon Icon="@FodIcons.Material.Filled.CheckCircle" 
         Size="FodSize.Large" 
         Color="FodColor.Success" />

<!-- Icon extra mare cu culoare de eroare -->
<FodIcon Icon="@FodIcons.Material.Filled.Error" 
         Size="FodSize.ExtraLarge" 
         Color="FodColor.Error" />
```

#### Variante Material Icons
```razor
<!-- Filled (umplut) -->
<FodIcon Icon="@FodIcons.Material.Filled.Favorite" />

<!-- Outlined (contur) -->
<FodIcon Icon="@FodIcons.Material.Outlined.FavoriteBorder" />

<!-- Rounded (rotunjit) -->
<FodIcon Icon="@FodIcons.Material.Rounded.Home" />

<!-- Sharp (ascuțit) -->
<FodIcon Icon="@FodIcons.Material.Sharp.Settings" />

<!-- TwoTone (două tonuri) -->
<FodIcon Icon="@FodIcons.Material.TwoTone.ShoppingCart" />
```

#### Pictograme pentru diferite contexte

##### Navigare și acțiuni
```razor
<div class="d-flex gap-3">
    <FodIcon Icon="@FodIcons.Material.Filled.Menu" Title="Meniu" />
    <FodIcon Icon="@FodIcons.Material.Filled.Search" Title="Căutare" />
    <FodIcon Icon="@FodIcons.Material.Filled.ArrowBack" Title="Înapoi" />
    <FodIcon Icon="@FodIcons.Material.Filled.ArrowForward" Title="Înainte" />
    <FodIcon Icon="@FodIcons.Material.Filled.Refresh" Title="Reîncarcă" />
    <FodIcon Icon="@FodIcons.Material.Filled.Close" Title="Închide" />
</div>
```

##### Stări și feedback
```razor
<!-- Succes -->
<FodIcon Icon="@FodIcons.Material.Filled.CheckCircle" 
         Color="FodColor.Success" 
         Title="Operațiune reușită" />

<!-- Avertisment -->
<FodIcon Icon="@FodIcons.Material.Filled.Warning" 
         Color="FodColor.Warning" 
         Title="Atenție" />

<!-- Eroare -->
<FodIcon Icon="@FodIcons.Material.Filled.Error" 
         Color="FodColor.Error" 
         Title="Eroare" />

<!-- Informație -->
<FodIcon Icon="@FodIcons.Material.Filled.Info" 
         Color="FodColor.Info" 
         Title="Informație" />
```

##### Pictograme pentru formulare
```razor
<div class="form-icons">
    <FodIcon Icon="@FodIcons.Material.Filled.Person" />
    <FodIcon Icon="@FodIcons.Material.Filled.Email" />
    <FodIcon Icon="@FodIcons.Material.Filled.Phone" />
    <FodIcon Icon="@FodIcons.Material.Filled.Lock" />
    <FodIcon Icon="@FodIcons.Material.Filled.DateRange" />
    <FodIcon Icon="@FodIcons.Material.Filled.AttachFile" />
</div>
```

#### Pictograme custom pentru branduri
```razor
<!-- Rețele sociale -->
<div class="social-icons d-flex gap-2">
    <FodIcon Icon="@FodIcons.Custom.Brands.Facebook" 
             Color="FodColor.Primary" />
    <FodIcon Icon="@FodIcons.Custom.Brands.Twitter" 
             Color="FodColor.Info" />
    <FodIcon Icon="@FodIcons.Custom.Brands.GitHub" 
             Color="FodColor.Dark" />
    <FodIcon Icon="@FodIcons.Custom.Brands.LinkedIn" 
             Color="FodColor.Primary" />
    <FodIcon Icon="@FodIcons.Custom.Brands.YouTube" 
             Color="FodColor.Error" />
</div>

<!-- Sisteme de operare și browsere -->
<div class="platform-icons">
    <FodIcon Icon="@FodIcons.Custom.Brands.Microsoft" />
    <FodIcon Icon="@FodIcons.Custom.Brands.Apple" />
    <FodIcon Icon="@FodIcons.Custom.Brands.Google" />
</div>
```

#### Pictograme pentru formate de fișiere
```razor
<div class="file-type-icons">
    <FodIcon Icon="@FodIcons.Material.Filled.PictureAsPdf" 
             Color="FodColor.Error" 
             Title="PDF" />
    <FodIcon Icon="@FodIcons.Material.Filled.Description" 
             Color="FodColor.Primary" 
             Title="Document" />
    <FodIcon Icon="@FodIcons.Material.Filled.Image" 
             Color="FodColor.Success" 
             Title="Imagine" />
    <FodIcon Icon="@FodIcons.Material.Filled.VideoFile" 
             Color="FodColor.Secondary" 
             Title="Video" />
    <FodIcon Icon="@FodIcons.Material.Filled.AudioFile" 
             Color="FodColor.Warning" 
             Title="Audio" />
</div>
```

#### Utilizare în componente complexe

##### În butoane
```razor
<FodButton StartIcon="@FodIcons.Material.Filled.Add" 
           Color="FodColor.Primary" 
           Variant="FodVariant.Filled">
    Adaugă element
</FodButton>

<FodButton EndIcon="@FodIcons.Material.Filled.Send" 
           Color="FodColor.Success" 
           Variant="FodVariant.Outlined">
    Trimite
</FodButton>

<FodIconButton Icon="@FodIcons.Material.Filled.Delete" 
               Color="FodColor.Error" 
               Size="FodSize.Small" 
               Title="Șterge" />
```

##### În liste
```razor
<FodList>
    <FodListItem>
        <FodListItemIcon>
            <FodIcon Icon="@FodIcons.Material.Filled.Inbox" />
        </FodListItemIcon>
        <FodListItemText Primary="Inbox" Secondary="5 mesaje noi" />
    </FodListItem>
    <FodListItem>
        <FodListItemIcon>
            <FodIcon Icon="@FodIcons.Material.Filled.Send" />
        </FodListItemIcon>
        <FodListItemText Primary="Trimise" />
    </FodListItem>
    <FodListItem>
        <FodListItemIcon>
            <FodIcon Icon="@FodIcons.Material.Filled.Drafts" />
        </FodListItemIcon>
        <FodListItemText Primary="Ciorne" Secondary="3 ciorne" />
    </FodListItem>
</FodList>
```

##### În notificări și alerte
```razor
<FodAlert Severity="FodSeverity.Success">
    <FodIcon Icon="@FodIcons.Material.Filled.CheckCircle" Class="me-2" />
    Operațiune finalizată cu succes!
</FodAlert>

<FodAlert Severity="FodSeverity.Error">
    <FodIcon Icon="@FodIcons.Material.Filled.Error" Class="me-2" />
    A apărut o eroare la procesare.
</FodAlert>
```

##### În câmpuri de formular
```razor
<FodTextField Label="Email" 
              Type="email"
              AdornmentIcon="@FodIcons.Material.Filled.Email"
              Adornment="Adornment.Start" />

<FodTextField Label="Parolă" 
              Type="password"
              AdornmentIcon="@FodIcons.Material.Filled.Lock"
              Adornment="Adornment.Start" />

<FodTextField Label="Căutare" 
              AdornmentIcon="@FodIcons.Material.Filled.Search"
              Adornment="Adornment.End" />
```

#### Animații și efecte
```razor
<!-- Icon cu rotație -->
<FodIcon Icon="@FodIcons.Material.Filled.Refresh" 
         Class="@(isLoading ? "rotating-icon" : "")" />

<!-- Icon cu pulsare -->
<FodIcon Icon="@FodIcons.Material.Filled.Favorite" 
         Color="FodColor.Error"
         Class="pulse-icon" />

<style>
    .rotating-icon {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .pulse-icon {
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
</style>
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Icon` | `string` | Conținut pictogramă (SVG sau clasă CSS) | - |
| `Title` | `string` | Titlu pentru accesibilitate | `null` |
| `Size` | `FodSize` | Dimensiunea pictogramei | `Medium` |
| `Color` | `FodColor` | Culoarea pictogramei | `Inherit` |
| `ViewBox` | `string` | Dimensiuni viewBox pentru SVG | `"0 0 24 24"` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |

### 4. Dimensiuni disponibile (FodSize)

| Dimensiune | Valoare CSS | Pixeli |
|------------|-------------|---------|
| `ExtraSmall` | 1rem | 16px |
| `Small` | 1.25rem | 20px |
| `Medium` | 1.5rem | 24px (implicit) |
| `Large` | 2.25rem | 36px |
| `ExtraLarge` | 3rem | 48px |

### 5. Categorii de pictograme disponibile

#### Material Icons
- **Filled**: Pictograme pline, aspect solid
- **Outlined**: Doar contur, aspect mai ușor
- **Rounded**: Colțuri rotunjite, aspect prietenos
- **Sharp**: Colțuri ascuțite, aspect profesional
- **TwoTone**: Două culori, accent pe detalii

#### Custom Icons
- **Brands**: Logo-uri companii (Facebook, Google, Apple, etc.)
- **FileFormats**: Tipuri de fișiere
- **Uncategorized**: Pictograme specifice aplicației

### 6. Stilizare și personalizare

```css
/* Personalizare dimensiuni */
.custom-icon-size {
    font-size: 32px !important;
    width: 32px !important;
    height: 32px !important;
}

/* Gradient pentru pictograme */
.gradient-icon {
    background: linear-gradient(45deg, #f06, #48f);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Shadow pentru pictograme */
.shadow-icon {
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
}

/* Pictograme cu fundal */
.icon-with-background {
    background-color: #f0f0f0;
    border-radius: 50%;
    padding: 8px;
}
```

### 7. Combinații comune

```razor
<!-- Icon cu text -->
<div class="d-flex align-items-center">
    <FodIcon Icon="@FodIcons.Material.Filled.Schedule" 
             Size="FodSize.Small" 
             Class="me-1" />
    <FodText Typo="Typo.body2">10:30 AM</FodText>
</div>

<!-- Badge cu icon -->
<FodBadge BadgeContent="5" Color="FodColor.Error">
    <FodIcon Icon="@FodIcons.Material.Filled.Notifications" />
</FodBadge>

<!-- Icon în chip -->
<FodChip Icon="@FodIcons.Material.Filled.Person" 
         Color="FodColor.Primary">
    Administrator
</FodChip>
```

### 8. Utilizare cu fonturi externe

```razor
<!-- FontAwesome -->
<FodIcon Icon="fas fa-user" />

<!-- Material Icons font -->
<FodIcon Icon="face" />

<!-- Custom icon font -->
<FodIcon Icon="custom-icon-class" />
```

### 9. Performanță

- Pictogramele SVG sunt stocate ca string-uri statice
- Nu se încarcă resurse externe pentru SVG
- Fonturile de pictograme se încarcă o singură dată
- Folosiți aceeași variantă pentru consistență

### 10. Accesibilitate

```razor
<!-- Pictogramă decorativă -->
<FodIcon Icon="@FodIcons.Material.Filled.Star" 
         Title="" />

<!-- Pictogramă cu semnificație -->
<FodIcon Icon="@FodIcons.Material.Filled.Warning" 
         Title="Avertisment: Acțiune ireversibilă" />

<!-- Pictogramă ca buton -->
<button aria-label="Șterge element">
    <FodIcon Icon="@FodIcons.Material.Filled.Delete" />
</button>
```

### 11. Note și observații

- Dimensiunea implicită este Medium (24px)
- Culoarea implicită este Inherit (moștenește de la părinte)
- SVG-urile folosesc currentColor pentru a prelua culoarea
- ViewBox implicit este optimizat pentru Material Icons

### 12. Bune practici

1. **Consistență** - Folosiți aceeași variantă în toată aplicația
2. **Semantică** - Alegeți pictograme intuitive pentru acțiuni
3. **Dimensiuni** - Folosiți dimensiuni predefinite pentru consistență
4. **Culori** - Folosiți culori semantice pentru feedback
5. **Accesibilitate** - Adăugați Title pentru pictograme importante
6. **Performanță** - Preferați pictogramele din bibliotecă

### 13. Troubleshooting

#### Pictograma nu apare
- Verificați că calea Icon este corectă
- Pentru fonturi, verificați că fontul este încărcat

#### Culoarea nu se aplică
- Verificați că folosiți FodColor validă
- Pentru SVG, verificați că folosește currentColor

#### Dimensiunea nu se schimbă
- Verificați că Size este din enum FodSize
- Pentru dimensiuni custom, folosiți Class sau Style

### 14. Concluzie
`FodIcon` oferă o soluție completă și flexibilă pentru afișarea pictogramelor în aplicații Blazor. Cu o bibliotecă bogată de pictograme Material Icons și suport pentru pictograme custom, acoperă toate nevoile de iconografie într-un mod consistent și performant.