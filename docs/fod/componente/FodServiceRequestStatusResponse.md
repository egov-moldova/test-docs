# FodServiceRequestStatusResponse

## Descriere Generală

Componenta `FodServiceRequestStatusResponse` este responsabilă pentru afișarea răspunsului primit în urma verificării statusului unei solicitări de serviciu. Afișează informații detaliate despre solicitare sau un mesaj de eroare dacă solicitarea nu a fost găsită.

Această componentă este utilizată în mod tipic împreună cu `FodServiceRequestStatus`, dar poate fi folosită și independent pentru afișarea rezultatelor pre-încărcate.

## Ghid de Utilizare API

### Exemplu de bază - solicitare găsită

```razor
<FodServiceRequestStatusResponse Model="@statusResponse" />

@code {
    private ServiceRequestStatusResponseModel statusResponse = new()
    {
        Found = true,
        OrderNumber = "SR-2024-001234",
        Status = "În procesare",
        SubmissionDate = DateTime.Now.AddDays(-5),
        EstimatedResolveDate = DateTime.Now.AddDays(10)
    };
}
```

### Exemplu - solicitare negăsită

```razor
<FodServiceRequestStatusResponse Model="@notFoundResponse" />

@code {
    private ServiceRequestStatusResponseModel notFoundResponse = new()
    {
        Found = false,
        OrderNumber = "SR-2024-999999"
    };
    // Va afișa mesaj de eroare localizat
}
```

### Integrare cu verificare status

```razor
<div class="status-check-container">
    @if (isChecking)
    {
        <FodLoadingLinear Indeterminate="true" />
    }
    else if (responseModel != null)
    {
        <FodServiceRequestStatusResponse Model="@responseModel" />
    }
</div>

@code {
    private bool isChecking = false;
    private ServiceRequestStatusResponseModel? responseModel;

    private async Task CheckStatus(string orderNumber)
    {
        isChecking = true;
        responseModel = await statusService.Check(orderNumber);
        isChecking = false;
    }
}
```

### Afișare condiționată

```razor
@if (hasStatusResult)
{
    <div class="mt-4">
        <h4>Rezultat verificare:</h4>
        <FodServiceRequestStatusResponse Model="@statusResult" />
    </div>
}
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| Model | ServiceRequestStatusResponseModel | null | Modelul cu datele răspunsului |

### Proprietăți ServiceRequestStatusResponseModel

| Proprietate | Tip | Descriere |
|-------------|-----|-----------|
| Found | bool | Indică dacă solicitarea a fost găsită |
| OrderNumber | string | Numărul de comandă verificat |
| Status | string | Statusul curent al solicitării |
| SubmissionDate | DateTime? | Data depunerii solicitării |
| EstimatedResolveDate | DateTime? | Data estimată de finalizare |

## Evenimente

Componenta nu expune evenimente.

## Metode publice

Componenta nu expune metode publice.

## Componente asociate

- **FodDisplay** - Pentru afișarea formatată a câmpurilor
- **FodServiceRequestStatus** - Componenta părinte pentru verificare status

## Stilizare

### Clase CSS

- `.service-request-status-response` - Container principal
- `.alert.alert-danger` - Pentru mesajul de eroare când solicitarea nu este găsită
- `.row` - Layout Bootstrap pentru afișarea câmpurilor

### Structura vizuală - solicitare găsită

```
┌─────────────────────────────────────────┐
│ Număr comandă: SR-2024-001234           │
│ Status: În procesare                     │
│ Data depunerii: 15.01.2024              │
│ Data estimată finalizare: 30.01.2024    │
└─────────────────────────────────────────┘
```

### Structura vizuală - solicitare negăsită

```
┌─────────────────────────────────────────┐
│ ⚠️ Solicitarea cu numărul SR-2024-999999│
│    nu a fost găsită                     │
└─────────────────────────────────────────┘
```

### Personalizare

```css
/* Container principal */
.service-request-status-response {
    padding: 1rem;
    border-radius: 0.25rem;
}

/* Mesaj de eroare personalizat */
.service-request-status-response .alert-danger {
    border-left: 4px solid #dc3545;
    background-color: #f8d7da;
}

/* Stilizare câmpuri */
.service-request-status-response dl.row {
    margin-bottom: 0;
}

/* Evidențiere status */
.service-request-status-response [data-field="Status"] {
    font-weight: bold;
    color: #0066cc;
}
```

## Note și observații

1. **Gestionare null** - Componenta verifică dacă Model este null înainte de randare
2. **Două moduri** - Afișează fie detalii complete, fie mesaj de eroare
3. **Localizare** - Mesajul de eroare folosește localizare cu parametru
4. **Layout responsive** - Folosește grid Bootstrap pentru afișare
5. **TitleWidth consistent** - Toate câmpurile folosesc TitleWidth="6" pentru aliniere

## Bune practici

1. **Validare model** - Verificați că modelul conține date valide
2. **Mesaje clare** - Asigurați-vă că mesajele de eroare sunt descriptive
3. **Format date** - Păstrați un format consistent pentru date
4. **Status descriptiv** - Folosiți termeni clari pentru status
5. **Tratare null** - Gestionați cazurile când proprietățile sunt null

## Concluzie

FodServiceRequestStatusResponse oferă o modalitate clară și consistentă de a afișa rezultatele verificării statusului. Cu suport pentru ambele scenarii (găsit/negăsit) și formatare automată, componenta simplifică afișarea informațiilor de status pentru utilizatori.