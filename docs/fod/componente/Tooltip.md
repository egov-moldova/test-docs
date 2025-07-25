# Tooltip

## Documentație pentru componenta Tooltip

### 1. Descriere Generală
`Tooltip` este o componentă care afișează text informativ când utilizatorii plasează cursorul deasupra unei pictograme info. Este utilă pentru a oferi context suplimentar, explicații sau ajutor fără a încărca interfața vizuală.

Componenta suportă:
- Text simplu sau conținut HTML
- Poziționare automată responsive
- Adaptare la diferite dimensiuni de ecran
- Integrare cu conținut copil opțional
- Stilizare personalizabilă

### 2. Ghid de Utilizare API

#### Tooltip de bază
```razor
<Tooltip Text="Acesta este un tooltip informativ care oferă context suplimentar." />
```

#### Tooltip cu text formatat HTML
```razor
<Tooltip Text="<b>Important:</b><br/>Toate câmpurile marcate cu * sunt obligatorii." />
```

#### Tooltip într-un context
```razor
<FodPaper Class="pa-4">
    <FodText>
        Faceți clic aici pentru mai multe informații 
        <Tooltip Text="Acest buton vă va redirecționa către pagina de ajutor unde veți găsi informații detaliate." />
    </FodText>
</FodPaper>
```

#### Tooltip cu conținut copil
```razor
<div class="d-flex align-items-center gap-2">
    <FodText>Taxa de serviciu: 250 MDL</FodText>
    <Tooltip Text="Această taxă include procesarea, verificarea și livrarea documentelor.">
        <FodBadge Color="FodColor.Info" Class="ms-2">Include TVA</FodBadge>
    </Tooltip>
</div>
```

#### Tooltip-uri multiple cu formatare complexă
```razor
<FodGrid>
    <FodItem xs="12" sm="6">
        <div class="mb-3">
            <FodText>Câmpuri obligatorii</FodText>
            <Tooltip Text="<b>Important:</b><br/>• Toate câmpurile marcate cu * sunt obligatorii<br/>• Email-ul trebuie să fie valid<br/>• Numărul de telefon trebuie să includă prefixul țării" />
        </div>
    </FodItem>
    
    <FodItem xs="12" sm="6">
        <div class="mb-3">
            <FodText>Timp de procesare</FodText>
            <Tooltip Text="<b>Procesare standard:</b> 3-5 zile lucrătoare<br/><b>Procesare expresă:</b> 1-2 zile lucrătoare<br/><i>Notă: Sărbătorile pot afecta timpii de procesare</i>" />
        </div>
    </FodItem>
</FodGrid>
```

#### Tooltip pentru explicarea statusurilor
```razor
<div class="d-flex align-items-center gap-2">
    <FodText>Status: În procesare</FodText>
    <Tooltip Text="Solicitarea dumneavoastră este în curs de procesare de către echipa noastră. Finalizare estimată: 2-3 zile lucrătoare.">
        <FodChip Color="FodColor.Warning" Size="FodSize.Small">În Progres</FodChip>
    </Tooltip>
</div>
```

#### Tooltip în formulare
```razor
<EditForm Model="model">
    <div class="mb-3">
        <label class="d-flex align-items-center gap-2">
            IDNP
            <Tooltip Text="Numărul de identificare personal format din 13 cifre" />
        </label>
        <FODInputText @bind-Value="model.Idnp" />
    </div>
    
    <div class="mb-3">
        <label class="d-flex align-items-center gap-2">
            Tip document
            <Tooltip Text="Selectați tipul de document pe care doriți să îl apostilați. Pentru documente educaționale, selectați 'Diplomă' sau 'Certificat de studii'." />
        </label>
        <FODInputSelect @bind-Value="model.DocumentType">
            <option value="">Selectați...</option>
            <option value="diploma">Diplomă</option>
            <option value="certificat">Certificat</option>
        </FODInputSelect>
    </div>
</EditForm>
```

### Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Text` | `string` | Textul afișat în tooltip. Suportă HTML. | `null` |
| `ChildContent` | `RenderFragment` | Conținut opțional care poate fi afișat alături de pictograma tooltip | `null` |
| `CssClass` | `string` | Clase CSS adiționale pentru stilizare personalizată | `string.Empty` |

### 3. Caracteristici speciale

#### Poziționare automată
- Tooltip-ul se poziționează automat deasupra pictogramei info
- Pe ecrane mici, poziția se ajustează pentru a rămâne vizibilă

#### Responsive Design
Tooltip-ul își adaptează dimensiunile în funcție de mărimea ecranului:
- **Mobile (< 480px)**: Lățime fixă de 200px
- **Tabletă (481-768px)**: Lățime maximă de 300px
- **Desktop (> 768px)**: Lățime maximă de 500px

#### Suport HTML
Textul tooltip-ului poate conține HTML pentru formatare avansată:
```razor
<Tooltip Text="<strong>Atenție!</strong><br/><ul><li>Primul punct</li><li>Al doilea punct</li></ul>" />
```

### 4. Stilizare

#### Stiluri implicite
- Pictogramă info: albastru (`#4b6ed2`)
- Fundal tooltip: gri închis (`#333`)
- Text: alb
- Border radius: 4px
- Font size: 13px (12px pe mobile)

#### Personalizare prin CSS
```razor
<Tooltip Text="Tooltip personalizat" CssClass="my-custom-tooltip" />

<style>
    .my-custom-tooltip .tooltip-color {
        color: #ff5722 !important;
    }
    
    .my-custom-tooltip .tooltip-text {
        background-color: #2196f3 !important;
        font-size: 14px !important;
    }
</style>
```

### 5. Integrare JavaScript
Componenta folosește JavaScript pentru inițializare și funcționalitate avansată:
- Inițializare automată după render
- Gestionare evenimente hover
- Calcul poziționare dinamică

### 6. Note și observații

- Tooltip-ul nu se afișează dacă proprietatea `Text` este goală sau null
- Pentru texte lungi, folosiți tag-uri HTML pentru o formatare mai bună
- Evitați tooltip-uri prea complexe - pentru informații extensive, considerați folosirea unui modal sau a unei secțiuni dedicate
- Tooltip-ul este accesibil doar cu mouse hover, nu cu tastatură sau touch - pentru accesibilitate completă, considerați alternative

### 7. Bune practici

1. **Concizie**: Păstrați textul tooltip-ului scurt și la obiect
2. **Claritate**: Folosiți un limbaj simplu și direct
3. **Formatare**: Utilizați HTML pentru a structura informații complexe
4. **Consistență**: Mențineți un stil consistent pentru toate tooltip-urile din aplicație
5. **Plasare**: Poziționați tooltip-ul lângă elementul relevant pentru context clar

### 8. Concluzie
`Tooltip` este o componentă utilă pentru îmbunătățirea experienței utilizatorului prin furnizarea de informații contextuale la cerere, fără a aglomera interfața. Este ideală pentru explicații scurte, definiții sau instrucțiuni suplimentare.