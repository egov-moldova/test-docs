# FodFeedbackBadge

## Descriere Generală

Componenta `FodFeedbackBadge` afișează un badge vizual cu statisticile de feedback pentru un serviciu specific. Prezintă scorul mediu, numărul total de recenzii și opțional numele serviciului cu reprezentare vizuală prin stele. Componenta oferă două variante de afișare pentru a se potrivi diferitelor contexte de design.

## Ghid de Utilizare API

### Exemplu de bază

```razor
<FodFeedbackBadge ServiceInternalCode="SRV001" />
```

### Varianta 1 - Layout standard

```razor
<FodFeedbackBadge 
    ServiceInternalCode="@serviceCode"
    ShowStars="true"
    ShowServiceName="true"
    ShowBorder="true"
    ShowSecondVariant="false" />
```

### Varianta 2 - Layout cu scor evidențiat

```razor
<FodFeedbackBadge 
    ServiceInternalCode="@serviceCode"
    ShowSecondVariant="true"
    ShowStars="true"
    UseDefaultBackgroundColor="true" />
```

### Personalizare culori

```razor
<FodFeedbackBadge 
    ServiceInternalCode="@serviceCode"
    BadgeText="#FFFFFF"
    BadgeColor="#2196F3"
    InfoText="#333333"
    InfoBackgroundColor="#F5F5F5"
    UseDefaultBackgroundColor="false" />
```

### Exemplu complet cu toate opțiunile

```razor
<FodFeedbackBadge 
    ServiceInternalCode="MDOCS-001"
    ShowSecondVariant="true"
    ShowStars="true"
    ShowBorder="true"
    ShowServiceName="true"
    UseDefaultBackgroundColor="true" />

@code {
    // Badge-ul va afișa:
    // - Scorul mediu colorat dinamic
    // - Numele serviciului
    // - Reprezentare cu stele
    // - Numărul total de recenzii
}
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| ServiceInternalCode | string | null | Codul intern al serviciului (obligatoriu) |
| ShowStars | bool | false | Afișează reprezentarea cu stele |
| ShowBorder | bool | false | Adaugă bordură componentei |
| ShowServiceName | bool | false | Afișează numele serviciului |
| ShowSecondVariant | bool | false | Folosește varianta 2 de layout |
| UseDefaultBackgroundColor | bool | true | Folosește culori dinamice bazate pe scor |
| BadgeText | string | "#FFFFFF" | Culoarea textului pentru badge |
| BadgeColor | string | "#4382b4" | Culoarea de fundal pentru badge |
| InfoText | string | "#4382b4" | Culoarea textului pentru informații |
| InfoBackgroundColor | string | "#FFFFFF" | Culoarea de fundal pentru zona de informații |

## Evenimente

Componenta nu expune evenimente.

## Metode publice

Componenta nu expune metode publice.

## Componente asociate

- **FodIcon** - Pentru afișarea stelelor
- **FodText** - Pentru formatarea textului
- **IFeedbackComponentService** - Serviciu pentru obținerea datelor

## Stilizare

### Varianta 1 - Layout standard
```
┌────────────────────────────────┐
│ Nume Serviciu                  │
│ ★★★★☆ 4.2/5                    │
│ Bazat pe 150 recenzii          │
└────────────────────────────────┘
```

### Varianta 2 - Layout cu scor evidențiat
```
┌───┬────────────────────────────┐
│4.2│ Nume Serviciu              │
│   │ ★★★★☆                      │
│   │ Foarte bun • 150 recenzii  │
└───┴────────────────────────────┘
```

### Clase CSS generate

- `.star` - Dimensiune stele (25x25px)
- `.badge-text-color` - Culoare text badge
- `.badge-background-color` - Culoare fundal badge
- `.info-background-color` - Culoare fundal informații
- `.info-text-color` - Culoare text informații
- `.small-text` - Text de dimensiune mică

### Personalizare

```css
/* Modificarea dimensiunii stelelor */
.fod-feedback-badge .star {
    height: 30px;
    width: 30px;
}

/* Stilizare badge scor */
.fod-feedback-badge h3 {
    font-weight: bold;
    margin: 0.5rem;
}

/* Ajustare spațiere */
.fod-feedback-badge .row {
    gap: 0.5rem;
}
```

## Note și observații

1. **Culori dinamice** - Când `UseDefaultBackgroundColor` este true, culoarea se schimbă în funcție de scor:
   - 1 stea: Roșu (#d50000)
   - 2 stele: Portocaliu (#e16900)
   - 3 stele: Galben (#fcd002)
   - 4 stele: Verde deschis (#98bc25)
   - 5 stele: Verde închis (#56ab42)

2. **Încărcare asincronă** - Datele sunt încărcate automat la inițializare
3. **Refresh automat** - Datele se actualizează când se schimbă ServiceInternalCode
4. **Gestionare erori** - Afișează mesaj când nu există recenzii

## Bune practici

1. **Cod serviciu valid** - Asigurați-vă că ServiceInternalCode este corect
2. **Performanță** - Cache-uiți rezultatele pentru servicii frecvent accesate
3. **Responsive** - Testați ambele variante pe diferite dimensiuni de ecran
4. **Contrast** - Verificați contrastul culorilor personalizate
5. **Loading state** - Considerați afișarea unui placeholder în timpul încărcării

## Exemple de utilizare

### În lista de servicii

```razor
@foreach (var service in services)
{
    <div class="service-card">
        <h3>@service.Name</h3>
        <FodFeedbackBadge ServiceInternalCode="@service.Code" ShowStars="true" />
        <FodButton Href="@($"/service/{service.Code}")">Vezi detalii</FodButton>
    </div>
}
```

### În header serviciu

```razor
<div class="service-header">
    <h1>@serviceName</h1>
    <FodFeedbackBadge 
        ServiceInternalCode="@serviceCode" 
        ShowSecondVariant="true"
        ShowStars="true"
        ShowServiceName="false" />
</div>
```

## Concluzie

FodFeedbackBadge oferă o modalitate elegantă și informativă de a afișa statisticile de feedback. Cu două variante de layout, culori dinamice și personalizare flexibilă, componenta se integrează perfect în diverse contexte pentru a prezenta calitatea serviciilor bazată pe feedback-ul utilizatorilor.