# Container

## Documentație pentru componenta FodContainer

### 1. Descriere Generală
`FodContainer` este o componentă de layout care oferă constrângeri responsive de lățime maximă și padding orizontal pentru conținutul site-ului. Containerul centrează conținutul orizontal și se adaptează la diferite dimensiuni de ecran, oferind o experiență consistentă pe toate dispozitivele.

Componenta suportă:
- Lățime maximă adaptivă bazată pe dimensiunea viewport-ului
- Mod fix pentru dimensiuni predefinite
- Diferite valori de lățime maximă (de la ExtraSmall la ExtraExtraLarge)
- Opțiunea de a dezactiva complet lățimea maximă

### 2. Ghid de Utilizare API

#### Exemplu de utilizare de bază
```razor
<FodContainer>
    <FodPaper Class="pa-4">
        <FodText>Conținut centrat cu lățime maximă responsive</FodText>
    </FodPaper>
</FodContainer>
```

#### Container cu lățime fixă
```razor
<FodContainer Fixed="true">
    <FodPaper Class="pa-4">
        <FodText>Container cu lățime fixă care se potrivește cu breakpoint-urile</FodText>
    </FodPaper>
</FodContainer>
```

#### Container cu diferite dimensiuni maxime
```razor
<!-- Container Extra Small -->
<FodContainer MaxWidth="MaxWidth.ExtraSmall">
    <FodPaper Class="pa-4">
        <FodText>Container foarte mic (xs)</FodText>
    </FodPaper>
</FodContainer>

<!-- Container Medium -->
<FodContainer MaxWidth="MaxWidth.Medium">
    <FodPaper Class="pa-4">
        <FodText>Container mediu (md)</FodText>
    </FodPaper>
</FodContainer>

<!-- Container Extra Large -->
<FodContainer MaxWidth="MaxWidth.ExtraLarge">
    <FodPaper Class="pa-4">
        <FodText>Container extra mare (xl)</FodText>
    </FodPaper>
</FodContainer>
```

#### Container fără constrângeri de lățime
```razor
<FodContainer MaxWidth="MaxWidth.False">
    <FodPaper Class="pa-4">
        <FodText>Container care ocupă toată lățimea disponibilă</FodText>
    </FodPaper>
</FodContainer>
```

#### Container cu conținut complex
```razor
<FodContainer MaxWidth="MaxWidth.Large">
    <FodGrid>
        <FodItem xs="12" sm="6" md="4">
            <FodCard>
                <FodCardContent>
                    <FodText>Card 1</FodText>
                </FodCardContent>
            </FodCard>
        </FodItem>
        <FodItem xs="12" sm="6" md="4">
            <FodCard>
                <FodCardContent>
                    <FodText>Card 2</FodText>
                </FodCardContent>
            </FodCard>
        </FodItem>
        <FodItem xs="12" sm="6" md="4">
            <FodCard>
                <FodCardContent>
                    <FodText>Card 3</FodText>
                </FodCardContent>
            </FodCard>
        </FodItem>
    </FodGrid>
</FodContainer>
```

### Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Fixed` | `bool` | Setează lățimea maximă să se potrivească cu lățimea minimă a breakpoint-ului curent. Util pentru design-uri cu dimensiuni fixe în loc de viewport complet fluid. | `false` |
| `MaxWidth` | `MaxWidth` | Determină lățimea maximă a containerului. Containerul crește odată cu dimensiunea ecranului. | `MaxWidth.Large` |
| `ChildContent` | `RenderFragment` | Conținutul copil al componentei. | `null` |
| `Class` | `string` | Clase CSS adiționale pentru container. | `null` |
| `Style` | `string` | Stiluri CSS inline pentru container. | `null` |

### 3. Valori disponibile pentru MaxWidth

| Valoare | Descriere | Breakpoint CSS |
|---------|-----------|----------------|
| `MaxWidth.ExtraSmall` | Container foarte mic | `xs` |
| `MaxWidth.Small` | Container mic | `sm` |
| `MaxWidth.Medium` | Container mediu | `md` |
| `MaxWidth.Large` | Container mare (implicit) | `lg` |
| `MaxWidth.ExtraLarge` | Container extra mare | `xl` |
| `MaxWidth.ExtraExtraLarge` | Container foarte mare | `xxl` |
| `MaxWidth.False` | Fără limită de lățime | - |

### 4. Note și observații

- Containerul este fluid în mod implicit, adaptându-se smooth la schimbările de dimensiune ale viewport-ului
- Când `Fixed="true"`, containerul folosește lățimi fixe predefinite care se schimbă la anumite breakpoint-uri
- Pentru layout-uri full-width, folosiți `MaxWidth="MaxWidth.False"`
- Containerul adaugă automat padding orizontal pentru a preveni lipirea conținutului de marginile ecranului
- Se recomandă utilizarea unui singur container principal per pagină, cu containere imbricate doar când este necesar

### 5. Concluzie
`FodContainer` este o componentă esențială pentru crearea layout-urilor responsive în aplicațiile Blazor, oferind un control precis asupra lățimii maxime a conținutului și asigurând o experiență vizuală consistentă pe toate dispozitivele.