# Card

## Documentație pentru componenta FodCard

### 1. Descriere Generală
`FodCard` este o componentă container care afișează conținut într-o suprafață ridicată (elevated). Cardurile sunt utilizate pentru a grupa informații conexe și pentru a oferi un punct de intrare către informații mai detaliate.

Componenta suportă:
- Nivele de elevație personalizabile
- Conținut structurat (Header, Content, Actions, Media)
- Stiluri outlined și square
- Integrare cu alte componente Fod
- Layout flexibil și responsive

### 2. Ghid de Utilizare API

#### Card de bază
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h5">Titlu Card</FodText>
        <FodText>Acesta este conținutul cardului.</FodText>
    </FodCardContent>
</FodCard>
```

#### Card cu header și acțiuni
```razor
<FodCard>
    <FodCardHeader>
        <CardHeaderContent>
            <FodText Typo="Typo.h6">Titlu Document</FodText>
        </CardHeaderContent>
        <CardHeaderActions>
            <FodIconButton Icon="@FodIcons.Material.Filled.MoreVert" />
        </CardHeaderActions>
    </FodCardHeader>
    <FodCardContent>
        <FodText>
            Conținutul documentului este afișat aici. 
            Poate include text formatat, liste sau alte elemente.
        </FodText>
    </FodCardContent>
    <FodCardActions>
        <FodButton Variant="FodVariant.Text" Color="FodColor.Primary">Citește mai mult</FodButton>
        <FodButton Variant="FodVariant.Text" Color="FodColor.Primary">Partajează</FodButton>
    </FodCardActions>
</FodCard>
```

#### Card cu imagine
```razor
<FodCard>
    <FodCardMedia Image="images/service-banner.jpg" Height="200" />
    <FodCardContent>
        <FodText Typo="Typo.h5" GutterBottom="true">Serviciul de Apostilă</FodText>
        <FodText Typo="Typo.body2" Color="FodColor.TextSecondary">
            Obțineți apostila pentru documentele dumneavoastră într-un mod rapid și eficient.
        </FodText>
    </FodCardContent>
    <FodCardActions>
        <FodButton Variant="FodVariant.Filled" Color="FodColor.Primary">Aplică acum</FodButton>
    </FodCardActions>
</FodCard>
```

#### Card outlined (fără elevație)
```razor
<FodCard Outlined="true">
    <FodCardContent>
        <FodText Typo="Typo.subtitle1">Card cu chenar</FodText>
        <FodText>
            Acest card folosește un chenar în loc de umbră pentru delimitare.
        </FodText>
    </FodCardContent>
</FodCard>
```

#### Card cu elevație personalizată
```razor
<FodGrid>
    <FodItem xs="12" sm="4">
        <FodCard Elevation="0">
            <FodCardContent>
                <FodText>Fără elevație</FodText>
            </FodCardContent>
        </FodCard>
    </FodItem>
    <FodItem xs="12" sm="4">
        <FodCard Elevation="3">
            <FodCardContent>
                <FodText>Elevație medie</FodText>
            </FodCardContent>
        </FodCard>
    </FodItem>
    <FodItem xs="12" sm="4">
        <FodCard Elevation="12">
            <FodCardContent>
                <FodText>Elevație mare</FodText>
            </FodCardContent>
        </FodCard>
    </FodItem>
</FodGrid>
```

#### Card pentru profil utilizator
```razor
<FodCard>
    <FodCardHeader>
        <CardHeaderAvatar>
            <div class="d-flex align-items-center justify-content-center"
                 style="width: 40px; height: 40px; border-radius: 50%; background-color: var(--fod-palette-primary); color: white;">
                <FodText>IP</FodText>
            </div>
        </CardHeaderAvatar>
        <CardHeaderContent>
            <FodText Typo="Typo.h6">Ion Popescu</FodText>
            <FodText Typo="Typo.body2" Color="FodColor.TextSecondary">
                Administrator
            </FodText>
        </CardHeaderContent>
    </FodCardHeader>
    <FodCardContent>
        <FodText>Email: ion.popescu@example.md</FodText>
        <FodText>Telefon: +373 XX XXX XXX</FodText>
        <FodText>Departament: IT</FodText>
    </FodCardContent>
    <FodCardActions>
        <FodButton Variant="FodVariant.Text" StartIcon="@FodIcons.Material.Filled.Edit">
            Editează
        </FodButton>
        <FodButton Variant="FodVariant.Text" StartIcon="@FodIcons.Material.Filled.Delete" Color="FodColor.Error">
            Șterge
        </FodButton>
    </FodCardActions>
</FodCard>
```

#### Card pentru servicii
```razor
<FodCard>
    <FodCardContent>
        <div class="d-flex align-items-center mb-3">
            <FodIcon Icon="@FodIcons.Material.Filled.Description" 
                     Size="FodSize.Large" 
                     Color="FodColor.Primary" 
                     Class="me-3" />
            <FodText Typo="Typo.h5">Traduceri Autorizate</FodText>
        </div>
        <FodText Class="mb-3">
            Serviciu de traducere autorizată pentru documente oficiale în peste 20 de limbi.
        </FodText>
        <FodChipSet>
            <FodChip Size="FodSize.Small">Rapiditate</FodChip>
            <FodChip Size="FodSize.Small">Calitate</FodChip>
            <FodChip Size="FodSize.Small">Preț accesibil</FodChip>
        </FodChipSet>
    </FodCardContent>
    <FodCardActions>
        <FodSpacer />
        <FodButton Variant="FodVariant.Filled" Color="FodColor.Primary">
            Solicită serviciul
        </FodButton>
    </FodCardActions>
</FodCard>
```

#### Card cu formular
```razor
<FodCard>
    <FodCardHeader>
        <CardHeaderContent>
            <FodText Typo="Typo.h6">Formular de contact</FodText>
        </CardHeaderContent>
    </FodCardHeader>
    <FodCardContent>
        <EditForm Model="contactForm">
            <div class="mb-3">
                <FODInputText Label="Nume complet" @bind-Value="contactForm.Name" />
            </div>
            <div class="mb-3">
                <FODInputText Label="Email" @bind-Value="contactForm.Email" />
            </div>
            <div class="mb-3">
                <FodTextArea Label="Mesaj" @bind-Value="contactForm.Message" Rows="4" />
            </div>
        </EditForm>
    </FodCardContent>
    <FodCardActions>
        <FodButton Variant="FodVariant.Text">Anulează</FodButton>
        <FodButton Variant="FodVariant.Filled" Color="FodColor.Primary">Trimite</FodButton>
    </FodCardActions>
</FodCard>

@code {
    private ContactForm contactForm = new();
    
    public class ContactForm
    {
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Message { get; set; } = "";
    }
}
```

#### Card cu statistici
```razor
<FodCard>
    <FodCardContent>
        <FodGrid>
            <FodItem xs="6">
                <FodText Typo="Typo.h3" Color="FodColor.Primary">1,234</FodText>
                <FodText Typo="Typo.subtitle2" Color="FodColor.TextSecondary">
                    Solicitări procesate
                </FodText>
            </FodItem>
            <FodItem xs="6">
                <FodText Typo="Typo.h3" Color="FodColor.Success">98%</FodText>
                <FodText Typo="Typo.subtitle2" Color="FodColor.TextSecondary">
                    Rata de satisfacție
                </FodText>
            </FodItem>
        </FodGrid>
    </FodCardContent>
</FodCard>
```

### Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Elevation` | `int` | Nivelul de umbră/elevație (0-24) | `1` |
| `Square` | `bool` | Elimină border-radius pentru colțuri drepte | `false` |
| `Outlined` | `bool` | Folosește chenar în loc de umbră | `false` |
| `ChildContent` | `RenderFragment` | Conținutul cardului | `null` |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri CSS inline | `null` |

### 3. Componente asociate

#### FodCardHeader
Secțiunea de header a cardului:
- `CardHeaderAvatar` - Avatar în header
- `CardHeaderContent` - Conținut principal header
- `CardHeaderActions` - Acțiuni în header

#### FodCardContent
Container pentru conținutul principal al cardului cu padding standard.

#### FodCardActions
Container pentru butoane și acțiuni, cu alignment și spacing automat.

#### FodCardMedia
Afișează imagini sau media în card:
```razor
<FodCardMedia Image="image.jpg" Height="200" Title="Descriere imagine" />
```

### 4. Combinații cu alte componente

#### Card în Grid
```razor
<FodGrid>
    @foreach (var item in items)
    {
        <FodItem xs="12" sm="6" md="4">
            <FodCard>
                <FodCardContent>
                    <FodText Typo="Typo.h6">@item.Title</FodText>
                    <FodText>@item.Description</FodText>
                </FodCardContent>
            </FodCard>
        </FodItem>
    }
</FodGrid>
```

#### Card cu Expansion Panel
```razor
<FodCard>
    <FodCardContent>
        <FodExpansionPanels>
            <FodExpansionPanel>
                <TitleContent>Detalii adiționale</TitleContent>
                <ChildContent>
                    <FodText>Informații extinse despre subiect...</FodText>
                </ChildContent>
            </FodExpansionPanel>
        </FodExpansionPanels>
    </FodCardContent>
</FodCard>
```

### 5. Stilizare și teme

#### Card colorat
```razor
<FodCard Style="background-color: #e3f2fd;">
    <FodCardContent>
        <FodText>Card cu fundal personalizat</FodText>
    </FodCardContent>
</FodCard>
```

#### Card cu gradient
```razor
<FodCard Style="background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);">
    <FodCardContent>
        <FodText Style="color: white;">Card cu gradient</FodText>
    </FodCardContent>
</FodCard>
```

### 6. Note și observații

- Cardurile sunt containere flexibile care pot conține aproape orice tip de conținut
- Elevația implicită este 1, oferind o separare subtilă de fundal
- Pentru liste de carduri, folosiți FodGrid pentru layout responsive
- CardActions aplică automat spacing între butoane
- Outlined și Elevation sunt mutual exclusive

### 7. Bune practici

1. **Conținut concis** - Păstrați conținutul cardului focusat pe un singur subiect
2. **Acțiuni clare** - Limitați numărul de acțiuni la 2-3 per card
3. **Ierarhie vizuală** - Folosiți tipografie pentru a crea ierarhie clară
4. **Spacing consistent** - Folosiți componentele Card pentru spacing uniform
5. **Imagini optimizate** - Pentru CardMedia, folosiți imagini de dimensiuni adecvate
6. **Accesibilitate** - Asigurați-vă că toate acțiunile au etichete descriptive

### 8. Cazuri de utilizare avansate

#### Card cu loading state
```razor
<FodCard>
    @if (isLoading)
    {
        <FodCardContent>
            <div class="d-flex justify-content-center p-4">
                <FodLoadingCircular />
            </div>
        </FodCardContent>
    }
    else
    {
        <FodCardContent>
            <!-- Conținut actual -->
        </FodCardContent>
    }
</FodCard>
```

#### Card interactiv
```razor
<FodCard @onclick="HandleCardClick" Style="cursor: pointer;" 
         Class="@(isSelected ? "selected-card" : "")"
         Elevation="@(isHovered ? 8 : 2)"
         @onmouseenter="@(() => isHovered = true)"
         @onmouseleave="@(() => isHovered = false)">
    <FodCardContent>
        <FodText>Card selectabil</FodText>
    </FodCardContent>
</FodCard>

@code {
    private bool isSelected = false;
    private bool isHovered = false;
    
    private void HandleCardClick()
    {
        isSelected = !isSelected;
    }
}
```

### 9. Concluzie
`FodCard` este o componentă fundamentală pentru organizarea și prezentarea conținutului în aplicațiile Blazor, oferind flexibilitate maximă pentru diferite cazuri de utilizare, de la simple containere de informații până la interfețe complexe interactive.