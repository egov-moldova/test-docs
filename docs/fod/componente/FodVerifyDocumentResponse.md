# FodVerifyDocumentResponse

## Descriere Generală

Componenta `FodVerifyDocumentResponse` afișează rezultatul verificării autenticității unui document. Prezintă informații despre validitatea documentului, detaliile acestuia și oferă opțiunea de descărcare când documentul este disponibil în sistemul MDocs Share.

Componenta gestionează trei stări principale: document negăsit, document anulat/invalid și document valid.

## Ghid de Utilizare API

### Exemplu - document valid

```razor
<FodVerifyDocumentResponse Model="@validDocument" />

@code {
    private VerifyDocumentResponseModel validDocument = new()
    {
        Found = true,
        ResponseDataStatus = ResponseDataStatusEnum.Valid,
        DocumentNumber = "DOC-2024-001234",
        DocumentName = "Certificat de naștere",
        DocumentIssueDate = DateTime.Now.AddDays(-30),
        MDocsShareFullLink = "https://mdocs.gov.md/share/123456"
    };
}
```

### Exemplu - document anulat

```razor
<FodVerifyDocumentResponse Model="@canceledDocument" />

@code {
    private VerifyDocumentResponseModel canceledDocument = new()
    {
        Found = true,
        ResponseDataStatus = ResponseDataStatusEnum.Invalid,
        DocumentNumber = "DOC-2023-999999",
        DocumentName = "Certificat vechi",
        DocumentIssueDate = DateTime.Now.AddYears(-2)
    };
}
```

### Exemplu - document negăsit

```razor
<FodVerifyDocumentResponse 
    Model="@notFoundDocument"
    NotFoundMessage="Documentul solicitat nu a fost găsit în registrul oficial" />

@code {
    private VerifyDocumentResponseModel notFoundDocument = new()
    {
        Found = false,
        DocumentNumber = "DOC-INVALID-000"
    };
}
```

### Cu mesaje personalizate

```razor
<FodVerifyDocumentResponse 
    Model="@documentModel"
    NotFoundMessage="Nu am găsit documentul în baza de date"
    DownloadMessage="Click aici pentru a descărca documentul verificat:" />
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| Model | VerifyDocumentResponseModel | null | Modelul cu rezultatul verificării |
| NotFoundMessage | string | null | Mesaj personalizat pentru document negăsit |
| DownloadMessage | string | null | Mesaj personalizat pentru link-ul de descărcare |

### Proprietăți VerifyDocumentResponseModel

| Proprietate | Tip | Descriere |
|-------------|-----|-----------|
| Found | bool | Indică dacă documentul a fost găsit |
| ResponseDataStatus | ResponseDataStatusEnum | Statusul documentului (Valid/Invalid) |
| DocumentNumber | string | Numărul documentului verificat |
| DocumentName | string | Numele/tipul documentului |
| DocumentIssueDate | DateTime? | Data emiterii documentului |
| MDocsShareFullLink | string | Link pentru descărcarea documentului |

## Evenimente

Componenta nu expune evenimente.

## Metode publice

Componenta nu expune metode publice.

## Componente asociate

- **FodDisplay** - Pentru afișarea formatată a detaliilor documentului
- **FodVerifyDocument** - Componenta părinte pentru verificare

## Stilizare

### Clase CSS utilizate

- `.service-request-status-response` - Container principal
- `.alert.alert-danger` - Pentru mesaje de eroare și documente anulate
- `.alert.alert-success` - Pentru documente valide
- `.text-center` - Pentru centrarea mesajelor
- `.text-black` - Pentru text negru pe fundal colorat

### Structura vizuală - document valid

```
┌─────────────────────────────────────────┐
│ ✅ Documentul este valid                │
├─────────────────────────────────────────┤
│ Număr document: DOC-2024-001234         │
│ Tip document: Certificat de naștere     │
│ Data emiterii: 15.01.2024               │
│                                         │
│ Puteți descărca documentul:             │
│ [Descarcă]                              │
└─────────────────────────────────────────┘
```

### Structura vizuală - document anulat

```
┌─────────────────────────────────────────┐
│ ❌ Document anulat                      │
├─────────────────────────────────────────┤
│ Număr document: DOC-2023-999999         │
│ Tip document: Certificat vechi          │
│ Data emiterii: 15.01.2022               │
└─────────────────────────────────────────┘
```

### Personalizare

```css
/* Mesaje de status */
.service-request-status-response .alert {
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
}

/* Link de descărcare */
.service-request-status-response a {
    font-weight: bold;
    text-decoration: none;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border-radius: 0.25rem;
    display: inline-block;
}

.service-request-status-response a:hover {
    background-color: #0056b3;
}

/* Detalii document */
.service-request-status-response dl.row {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 0.25rem;
}
```

## Note și observații

1. **Trei stări** - Gestionează document negăsit, anulat și valid
2. **Mesaje localizate** - Toate mesajele implicite sunt localizate
3. **Personalizare flexibilă** - Permite înlocuirea mesajelor standard
4. **Link securizat** - Descărcarea se deschide în tab nou (target="_blank")
5. **Layout responsive** - Se adaptează la diferite dimensiuni de ecran

## Bune practici

1. **Verificare null** - Verificați că Model nu este null înainte de utilizare
2. **Mesaje clare** - Folosiți mesaje descriptive pentru fiecare stare
3. **Securitate** - Nu expuneți informații sensibile în mesaje
4. **Accesibilitate** - Asigurați contrast suficient pentru mesaje
5. **Feedback vizual** - Folosiți culori și iconițe pentru claritate

## Concluzie

FodVerifyDocumentResponse oferă o interfață clară și intuitivă pentru afișarea rezultatelor verificării documentelor. Cu suport pentru multiple stări, mesaje personalizabile și opțiune de descărcare integrată, componenta facilitează comunicarea statusului documentelor către utilizatori.