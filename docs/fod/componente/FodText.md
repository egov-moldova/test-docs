# Text (Typography)

## Documentație pentru componenta FodText

### 1. Descriere Generală
`FodText` este componenta de tipografie fundamentală din sistemul FOD Components, oferind un mod consistent și flexibil de afișare a textului. Componenta implementează un sistem complet de tipografie bazat pe Material Design, cu 14 variante predefinite și opțiuni extensive de stilizare.

Caracteristici principale:
- 14 variante de tipografie (h1-h6, body, subtitle, caption, etc.)
- Sistem de culori integrat cu tema
- Aliniere text flexibilă
- Suport RTL (Right-to-Left)
- Mapare automată la elemente HTML semantice
- Spațiere consistentă cu GutterBottom
- Mod inline pentru text în linie
- Personalizare completă prin clase CSS

### 2. Ghid de Utilizare API

#### Text de bază
```razor
<FodText>Text implicit cu stilul body1</FodText>
```

#### Titluri și subtitluri
```razor
<!-- Titluri principale -->
<FodText Typo="Typo.h1">Titlu Principal (H1)</FodText>
<FodText Typo="Typo.h2">Titlu Secundar (H2)</FodText>
<FodText Typo="Typo.h3">Titlu Terțiar (H3)</FodText>
<FodText Typo="Typo.h4">Titlu H4</FodText>
<FodText Typo="Typo.h5">Titlu H5</FodText>
<FodText Typo="Typo.h6">Titlu H6</FodText>

<!-- Subtitluri -->
<FodText Typo="Typo.subtitle1">Subtitlu mare pentru secțiuni</FodText>
<FodText Typo="Typo.subtitle2">Subtitlu mai mic pentru subsecțiuni</FodText>
```

#### Variante de text body
```razor
<!-- Text normal (implicit) -->
<FodText Typo="Typo.body1">
    Text body1 - utilizat pentru paragrafe normale și conținut principal.
    Este varianta implicită pentru FodText.
</FodText>

<!-- Text secundar -->
<FodText Typo="Typo.body2">
    Text body2 - utilizat pentru conținut secundar, note și descrieri mai mici.
</FodText>
```

#### Text specializat
```razor
<!-- Text pentru butoane -->
<FodText Typo="Typo.button">TEXT BUTON</FodText>

<!-- Text caption pentru imagini sau tabele -->
<FodText Typo="Typo.caption">
    Figura 1: Descriere imagine sau notă explicativă
</FodText>

<!-- Text overline pentru etichete -->
<FodText Typo="Typo.overline">ETICHETĂ SUPERIOARĂ</FodText>
```

#### Text cu culori
```razor
<!-- Culori principale -->
<FodText Color="FodColor.Primary">Text cu culoare primară</FodText>
<FodText Color="FodColor.Secondary">Text cu culoare secundară</FodText>

<!-- Culori semantice -->
<FodText Color="FodColor.Success">Operațiune reușită!</FodText>
<FodText Color="FodColor.Error">Mesaj de eroare</FodText>
<FodText Color="FodColor.Warning">Avertisment important</FodText>
<FodText Color="FodColor.Info">Notă informativă</FodText>

<!-- Alte culori -->
<FodText Color="FodColor.Dark">Text întunecat</FodText>
<FodText Color="FodColor.Inherit">Text care moștenește culoarea părintelui</FodText>
```

#### Aliniere text
```razor
<!-- Aliniere la stânga -->
<FodText Align="Align.Left">Text aliniat la stânga</FodText>

<!-- Aliniere centrată -->
<FodText Align="Align.Center">Text centrat</FodText>

<!-- Aliniere la dreapta -->
<FodText Align="Align.Right">Text aliniat la dreapta</FodText>

<!-- Aliniere justificată -->
<FodText Align="Align.Justify">
    Text justificat care se întinde uniform între marginile containerului.
    Util pentru paragrafe lungi în articole sau documente.
</FodText>

<!-- Aliniere responsivă (Start/End) -->
<FodText Align="Align.Start">Text aliniat la început (LTR: stânga, RTL: dreapta)</FodText>
<FodText Align="Align.End">Text aliniat la sfârșit (LTR: dreapta, RTL: stânga)</FodText>
```

#### Text cu spațiere
```razor
<!-- Cu spațiu inferior -->
<FodText Typo="Typo.h3" GutterBottom="true">
    Titlu cu spațiu inferior
</FodText>
<FodText>Text care urmează după titlu</FodText>

<!-- Fără spațiu inferior -->
<FodText Typo="Typo.h3" GutterBottom="false">
    Titlu fără spațiu inferior
</FodText>
<FodText>Text imediat după titlu</FodText>
```

#### Text inline vs block
```razor
<!-- Text inline -->
<FodText Inline="true">Text inline</FodText>
<FodText Inline="true" Color="FodColor.Primary"> care continuă</FodText>
<FodText Inline="true"> pe aceeași linie.</FodText>

<!-- Text block (implicit) -->
<FodText>Acest text</FodText>
<FodText>apare pe</FodText>
<FodText>linii separate.</FodText>
```

#### Exemple practice complexe

##### Card de produs
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h5" GutterBottom="true">
            Laptop Gaming ROG
        </FodText>
        <FodText Typo="Typo.subtitle2" Color="FodColor.Secondary" GutterBottom="true">
            ASUS ROG Strix G15
        </FodText>
        <FodText Typo="Typo.body2" GutterBottom="true">
            Procesor Intel Core i7, 16GB RAM, 512GB SSD, 
            NVIDIA RTX 3060 6GB, Display 15.6" FHD 144Hz
        </FodText>
        <FodText Typo="Typo.h4" Color="FodColor.Primary">
            4.999 lei
        </FodText>
        <FodText Typo="Typo.caption" Color="FodColor.Success">
            În stoc • Livrare gratuită
        </FodText>
    </FodCardContent>
</FodCard>
```

##### Secțiune hero
```razor
<div class="hero-section text-center py-12">
    <FodText Typo="Typo.h1" Color="FodColor.Primary" GutterBottom="true">
        Bine ați venit la FOD
    </FodText>
    <FodText Typo="Typo.h4" Color="FodColor.Secondary" GutterBottom="true">
        Platforma digitală pentru servicii publice
    </FodText>
    <FodText Typo="Typo.body1" Class="mx-auto" Style="max-width: 600px;">
        Accesați rapid și simplu serviciile publice de care aveți nevoie.
        Totul într-un singur loc, disponibil 24/7.
    </FodText>
</div>
```

##### Listă cu pictograme
```razor
<div class="features-list">
    <div class="d-flex align-items-start mb-3">
        <FodIcon Icon="@FodIcons.Material.Filled.Check" 
                 Color="FodColor.Success" 
                 Class="me-3" />
        <div>
            <FodText Typo="Typo.subtitle1" GutterBottom="true">
                Procesare rapidă
            </FodText>
            <FodText Typo="Typo.body2" Color="FodColor.Secondary">
                Solicitările dvs. sunt procesate în maximum 24 ore
            </FodText>
        </div>
    </div>
</div>
```

##### Mesaje de stare
```razor
@if (isLoading)
{
    <FodText Typo="Typo.body2" Color="FodColor.Info" Align="Align.Center">
        <FodIcon Icon="@FodIcons.Material.Filled.HourglassEmpty" Class="me-2" />
        Se încarcă datele...
    </FodText>
}
else if (hasError)
{
    <FodText Typo="Typo.body1" Color="FodColor.Error" Align="Align.Center">
        <FodIcon Icon="@FodIcons.Material.Filled.Error" Class="me-2" />
        A apărut o eroare. Vă rugăm încercați din nou.
    </FodText>
}
else
{
    <FodText Typo="Typo.body1" Color="FodColor.Success" Align="Align.Center">
        <FodIcon Icon="@FodIcons.Material.Filled.CheckCircle" Class="me-2" />
        Operațiune finalizată cu succes!
    </FodText>
}
```

### 3. Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Typo` | `Typo` | Varianta de tipografie | `Typo.body1` |
| `Color` | `FodColor` | Culoarea textului | `FodColor.Inherit` |
| `Align` | `Align` | Alinierea textului | `Align.Inherit` |
| `GutterBottom` | `bool` | Adaugă spațiu inferior (0.35em) | `false` |
| `Inline` | `bool` | Afișare inline în loc de block | `false` |
| `ChildContent` | `RenderFragment` | Conținutul text | - |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline | `null` |
| `UserAttributes` | `Dictionary<string, object>` | Atribute HTML adiționale | `null` |

### 4. Variante de tipografie (Typo)

| Variantă | Element HTML | Utilizare recomandată |
|----------|--------------|----------------------|
| `h1` | `<h1>` | Titlu principal pagină |
| `h2` | `<h2>` | Titluri secțiuni majore |
| `h3` | `<h3>` | Subsecțiuni |
| `h4` | `<h4>` | Titluri card-uri |
| `h5` | `<h5>` | Titluri mici |
| `h6` | `<h6>` | Cel mai mic titlu |
| `subtitle1` | `<h6>` | Subtitluri mari |
| `subtitle2` | `<h6>` | Subtitluri mici |
| `body1` | `<p>` | Text principal (implicit) |
| `body2` | `<p>` | Text secundar |
| `button` | `<span>` | Text în butoane |
| `caption` | `<span>` | Legende, note mici |
| `overline` | `<span>` | Etichete deasupra |
| `inherit` | `<span>` | Moștenește stilul |

### 5. Stilizare și personalizare

#### Variabile CSS pentru tipografie
```css
/* Personalizare globală pentru o variantă */
:root {
    --fod-typography-h1-size: 3rem;
    --fod-typography-h1-weight: 300;
    --fod-typography-h1-lineheight: 1.2;
    --fod-typography-h1-letterspacing: -0.01562em;
    
    --fod-typography-body1-size: 1rem;
    --fod-typography-body1-family: 'Roboto', sans-serif;
    --fod-typography-body1-weight: 400;
    --fod-typography-body1-lineheight: 1.5;
}

/* Clase CSS utilitare */
.fod-typography-nowrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.fod-typography-paragraph {
    margin-bottom: 16px;
}

/* Stiluri personalizate */
.custom-heading {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    background: linear-gradient(45deg, #1976d2, #42a5f5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

### 6. Integrare cu alte componente

#### În formulare
```razor
<div class="mb-3">
    <FodText Typo="Typo.subtitle2" GutterBottom="true">
        Date personale
    </FodText>
    <FodTextField Label="Nume complet" Required="true" />
</div>
```

#### În liste
```razor
<FodList>
    <FodListItem>
        <FodListItemText>
            <FodText Typo="Typo.subtitle1">Element principal</FodText>
            <FodText Typo="Typo.body2" Color="FodColor.Secondary">
                Descriere secundară
            </FodText>
        </FodListItemText>
    </FodListItem>
</FodList>
```

#### În alerte
```razor
<FodAlert Severity="FodSeverity.Info">
    <FodText Typo="Typo.subtitle2" Inline="true">Notă:</FodText>
    <FodText Typo="Typo.body2" Inline="true" Class="ms-1">
        Această funcționalitate este în dezvoltare.
    </FodText>
</FodAlert>
```

### 7. Suport RTL (Right-to-Left)

```razor
<CascadingValue Value="true" Name="RightToLeft">
    <FodText Align="Align.Start">
        Text care se aliniază la dreapta în modul RTL
    </FodText>
    <FodText Align="Align.End">
        Text care se aliniază la stânga în modul RTL
    </FodText>
</CascadingValue>
```

### 8. Combinații comune

```razor
<!-- Titlu de pagină -->
<FodText Typo="Typo.h1" 
         Color="FodColor.Primary" 
         Align="Align.Center" 
         GutterBottom="true">
    Titlu Principal
</FodText>

<!-- Text descriptiv -->
<FodText Typo="Typo.body2" 
         Color="FodColor.Secondary" 
         Align="Align.Justify">
    Descriere detaliată...
</FodText>

<!-- Etichetă -->
<FodText Typo="Typo.overline" 
         Color="FodColor.Info">
    CATEGORIE
</FodText>
```

### 9. Performanță

- FodText este o componentă lightweight
- Folosește elemente HTML semantice pentru SEO
- Stilurile sunt aplicate prin clase CSS, nu inline
- Reutilizați variante în loc de stiluri custom

### 10. Accesibilitate

- Folosește elemente HTML semantice (h1-h6, p)
- Menține ierarhia corectă a titlurilor
- Contrastul culorilor respectă WCAG 2.0
- Suportă screen readers prin structură semantică

### 11. Note și observații

- `Typo.body1` este varianta implicită
- `GutterBottom` adaugă doar 0.35em, nu 1em
- Elementele inline nu pot avea `GutterBottom`
- Culoarea `Inherit` preia culoarea părintelui

### 12. Bune practici

1. **Ierarhie** - Respectați ordinea h1 → h6
2. **Semantică** - Folosiți varianta potrivită pentru context
3. **Consistență** - Păstrați aceleași variante pentru elemente similare
4. **Culori** - Folosiți culori semantice pentru mesaje
5. **Spațiere** - Folosiți GutterBottom pentru titluri
6. **Performanță** - Evitați stiluri inline pentru text repetat

### 13. Troubleshooting

#### Textul nu se afișează cu stilul dorit
- Verificați că varianta Typo este corect specificată
- Verificați că tema include variabilele CSS necesare

#### Culoarea nu se aplică
- Verificați că FodColor este validă
- Pentru culori custom, folosiți Class sau Style

#### Alinierea nu funcționează
- Verificați lățimea containerului părinte
- Pentru centrat, containerul trebuie să aibă lățime definită

### 14. Concluzie
`FodText` este componenta fundamentală pentru afișarea textului în aplicațiile FOD, oferind un sistem complet și consistent de tipografie. Cu 14 variante predefinite și opțiuni extensive de personalizare, acoperă toate nevoile de afișare text, de la titluri la paragrafe și etichete specializate.