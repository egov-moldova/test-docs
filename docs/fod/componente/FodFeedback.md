# FodFeedback

## Descriere Generală

Componenta `FodFeedback` oferă un widget complet pentru colectarea feedback-ului de la utilizatori. Poate fi afișată ca un buton lateral fixat pe partea dreaptă a ecranului sau ca un modal overlay. Componenta include un flux multi-pas pentru colectarea rating-ului, mesajului și datelor opționale de contact.

Componenta suportă două moduri principale de afișare:
- **Stick Right** - Widget fixat pe partea dreaptă care se extinde lateral
- **Modal Overlay** - Fereastră modală centrată

## Ghid de Utilizare API

### Exemplu de bază - mod stick right

```razor
<FodFeedback 
    StickRight="true"
    Text="Feedback" />
```

### Exemplu - mod modal

```razor
<FodFeedback 
    StickRight="false"
    ShowHeader="true"
    ShowCloseButton="true" />

@code {
    // Componenta va afișa un buton care deschide modalul
}
```

### Cu parametri pentru serviciu

```razor
<FodFeedback 
    ServiceInternalCode="@serviceCode"
    TransactionId="@transactionId"
    Idno="@userIdno"
    OnSubmit="@HandleFeedbackSubmit" />

@code {
    private string serviceCode = "SRV001";
    private string transactionId = "TRX123456";
    private string userIdno = "2000000000000";

    private async Task HandleFeedbackSubmit()
    {
        // Logică după trimiterea feedback-ului
        Console.WriteLine("Feedback trimis!");
    }
}
```

### Configurare completă

```razor
<FodFeedback 
    StickRight="true"
    Text="Părerea ta"
    ShowRatingLabel="true"
    ShowCloseButton="true"
    ShowHeader="true"
    HideOnSubmit="true"
    IsButtonMode="true"
    Model="@feedbackModel" />

@code {
    private FeedbackComponentModel feedbackModel = new()
    {
        ServiceCode = "SRV001",
        Rating = 0
    };
}
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| Idno | string | null | IDNP-ul utilizatorului |
| ServiceInternalCode | string | null | Codul intern al serviciului |
| TransactionId | string | null | ID-ul tranzacției |
| ShowRatingLabel | bool | true | Afișează eticheta pentru rating |
| ShowCloseButton | bool | true | Afișează butonul de închidere |
| HideOnSubmit | bool | true | Ascunde widget-ul după trimitere |
| StickRight | bool | false | Fixează widget-ul pe partea dreaptă |
| ShowHeader | bool | true | Afișează header-ul componentei |
| Text | string | null | Textul pentru butonul de feedback |
| Model | FeedbackComponentModel | new() | Modelul de date pentru feedback |
| IsButtonMode | bool | true | Afișează butonul de activare |

## Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| OnSubmit | EventCallback | Declanșat la trimiterea feedback-ului |

## Metode publice

| Metodă | Descriere |
|--------|-----------|
| ShowOrHide() | Comută vizibilitatea widget-ului |

## Componente asociate

- **FodRating** - Pentru selectarea rating-ului
- **FodButton** - Butoane pentru acțiuni
- **FodOverlay** - Pentru modul overlay
- **FodCollapse** - Pentru tranziții între pași
- **FodLoadingLinear** - Indicator de încărcare
- **FodIcon** - Iconițe pentru interfață
- **FodText** - Afișare text formatat

## Stilizare

### Clase CSS principale

- `.rating-popup` - Container pentru modul stick right
- `.stickRight` - Poziționare fixă pe dreapta
- `.feedback-background` - Fundal pentru overlay
- `.smooth-shadow` - Umbră pentru container
- `.widget-max-width` - Lățime maximă (30rem)
- `.widget-min-height` - Înălțime minimă (7rem)

### Personalizare

```css
/* Modificarea culorii de fundal */
.feedback-background {
    background: rgba(67, 130, 180, 0.3) !important;
}

/* Ajustarea poziției stick right */
.stickRight {
    top: 50%; /* implicit 43% */
}

/* Stilizare buton feedback */
.stickRight .fod-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}

/* Animații personalizate */
.rating-popup {
    transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Note și observații

1. **Flux multi-pas** - Include 3 pași: rating, mesaj, date opționale
2. **Validare** - Mesajul este limitat la 500 caractere
3. **Autentificare** - Detectează automat utilizatorii autentificați
4. **Responsive** - Se adaptează pentru dispozitive mobile
5. **Animații** - Tranziții fluide între stări
6. **Localizare** - Toate textele sunt localizate
7. **Context** - Preia automat contextul utilizatorului curent

## Bune practici

1. **Plasare strategică** - Folosiți StickRight pentru pagini cu mult conținut
2. **Feedback contextual** - Furnizați ServiceInternalCode pentru feedback specific
3. **Mesaje clare** - Ghidați utilizatorii prin procesul de feedback
4. **Validare vizuală** - Afișați erori în timp real
5. **Confirmare** - Afișați întotdeauna mesaj de mulțumire
6. **Accesibilitate** - Asigurați navigare cu tastatura
7. **Performance** - Încărcați componenta doar când este necesară

## Exemple avansate

### Integrare cu servicii

```razor
<FodFeedback 
    ServiceInternalCode="@currentService.Code"
    TransactionId="@currentTransaction.Id"
    OnSubmit="@(async () => await LogFeedback())" />

@code {
    private async Task LogFeedback()
    {
        // Logare în sistem
        await analyticsService.TrackFeedback();
    }
}
```

### Control programatic

```razor
<FodFeedback @ref="feedbackWidget" StickRight="true" />

<FodButton OnClick="ShowFeedback">
    Solicită Feedback
</FodButton>

@code {
    private FodFeedback feedbackWidget;

    private async Task ShowFeedback()
    {
        await feedbackWidget.ShowOrHide();
    }
}
```

## Concluzie

FodFeedback oferă o soluție completă pentru colectarea feedback-ului de la utilizatori. Cu opțiuni flexibile de afișare, flux intuitiv multi-pas și integrare perfectă cu serviciile guvernamentale, componenta facilitează îmbunătățirea continuă a serviciilor digitale bazată pe părerea cetățenilor.