# FodVerifyDocument

## Descriere Generală

Componenta `FodVerifyDocument` oferă o interfață pentru verificarea autenticității și validității documentelor emise de instituțiile publice. Permite utilizatorilor să introducă numărul documentului și să verifice dacă acesta este valid, anulat sau inexistent în sistemul oficial.

Componenta suportă verificare prin număr de document și opțional prin ID MDocs Share pentru acces direct la document.

## Ghid de Utilizare API

### Exemplu de bază

```razor
<FodVerifyDocument />
```

### Cu număr de document predefinit

```razor
<FodVerifyDocument DocumentNumber="DOC-2024-001234" />

@code {
    // Componenta va pre-completa câmpul cu numărul furnizat
}
```

### Verificare automată cu MDocs Share ID

```razor
<FodVerifyDocument 
    DocumentNumber="DOC-2024-001234" 
    MDocsShareId="@shareId" />

@code {
    private Guid shareId = Guid.Parse("123e4567-e89b-12d3-a456-426614174000");
    // Va verifica automat documentul la încărcare
}
```

### Cu mesaje personalizate

```razor
<FodVerifyDocument 
    NotFoundMessage="Documentul căutat nu există în baza de date oficială"
    DownloadMessage="Puteți descărca documentul verificat de aici:" />
```

### Integrare în pagină dedicată

```razor
@page "/verifica-document"

<div class="container mt-4">
    <h2>Verificare Autenticitate Document</h2>
    <p>Introduceți numărul documentului pentru a verifica autenticitatea acestuia.</p>
    
    <FodVerifyDocument />
    
    <div class="mt-3">
        <FodAlert Severity="FodSeverity.Info">
            Verificarea se face în baza de date oficială a instituțiilor publice.
        </FodAlert>
    </div>
</div>
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| DocumentNumber | string | null | Numărul documentului pentru verificare |
| MDocsShareId | Guid? | null | ID-ul MDocs Share pentru acces direct |
| NotFoundMessage | string | null | Mesaj personalizat când documentul nu este găsit |
| DownloadMessage | string | null | Mesaj personalizat pentru descărcare document |
| Model | VerifyDocumentModel | null | Model pre-populat pentru verificare |
| Class | string | - | Clase CSS adiționale |
| Style | string | - | Stiluri inline |

## Evenimente

Componenta nu expune evenimente publice.

## Metode publice

Componenta nu expune metode publice.

## Componente asociate

- **FodVerifyDocumentResponse** - Afișează rezultatul verificării
- **FodCardWrapper** - Container pentru interfața de verificare
- **FODInputText** - Câmp pentru introducerea numărului documentului
- **FodButton** - Buton pentru declanșarea verificării
- **FodLoadingLinear** - Indicator de încărcare

## Stilizare

Componenta folosește stilurile standard FOD și Bootstrap pentru layout.

### Personalizare

```css
/* Container principal */
.fod-verify-document .fod-card-wrapper {
    max-width: 600px;
    margin: 0 auto;
}

/* Câmp input */
.fod-verify-document .fod-input-text {
    font-size: 1.1rem;
}

/* Buton verificare */
.fod-verify-document .fod-button {
    min-width: 120px;
}

/* Indicator încărcare */
.fod-verify-document .fod-loading-linear {
    margin: 1rem 0;
}
```

## Note și observații

1. **Serviciu obligatoriu** - Necesită injectarea `IVerifyDocumentService`
2. **Verificare automată** - Dacă sunt furnizate DocumentNumber și MDocsShareId, verificarea se face automat
3. **Validare** - Folosește EditContext și DataAnnotationsValidator pentru validare
4. **Loading states** - Afișează indicatori de încărcare separați pentru încărcare inițială și verificare
5. **Mesaje personalizabile** - Permite personalizarea mesajelor pentru diferite scenarii

## Bune practici

1. **Format număr** - Instruiți utilizatorii despre formatul corect al numărului de document
2. **Gestionare erori** - Implementați tratarea erorilor de rețea sau serviciu
3. **Feedback clar** - Folosiți mesaje clare pentru fiecare stare a documentului
4. **Securitate** - Nu expuneți informații sensibile în mesajele de eroare
5. **Cache rezultate** - Considerați cache-uirea rezultatelor pentru performanță

## Concluzie

FodVerifyDocument oferă o soluție completă pentru verificarea autenticității documentelor oficiale. Cu suport pentru verificare automată, mesaje personalizabile și integrare cu serviciul MDocs Share, componenta facilitează procesul de validare a documentelor pentru cetățeni și instituții.