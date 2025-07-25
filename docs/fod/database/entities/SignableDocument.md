# SignableDocument

## Descriere

Entitatea care gestionează documentele ce necesită semnătură electronică în sistemul Front Office Digital. Această entitate stochează documentele în format XML/JSON, urmărește procesul de semnare și păstrează semnătura digitală finală împreună cu hash-ul documentului pentru verificarea integrității.

## Proprietăți

### Identificare și Conținut

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| Id | Guid | Identificator unic al documentului semnabil | Primary Key |
| SignRequestId | string | ID-ul cererii de semnare | Obligatoriu, pentru tracking extern |
| Xml | string? | Conținutul documentului în format XML | Opțional |
| Json | string? | Conținutul documentului în format JSON | Opțional |
| Hash | byte[]? | Hash-ul documentului pentru verificarea integrității | Opțional, calculat automat |
| Type | DocumentTypeEnum | Tipul documentului | Enum: DocumentTypeEnum |

### Status Semnare

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| Status | SignRequestStatus | Statusul procesului de semnare | Enum: SignRequestStatus |
| Signature | byte[]? | Semnătura digitală a documentului | Populat după semnare |
| Message | string? | Mesaj asociat cu procesul de semnare | Pentru erori sau confirmări |
| ResponseDate | DateTime? | Data primirii răspunsului de semnare | - |

## Enum-uri Utilizate

### DocumentTypeEnum
Tipurile de documente semnabile:
- `Request` - Cerere
- `Contract` - Contract
- `Declaration` - Declarație
- `Certificate` - Certificat
- `Other` - Altele

### SignRequestStatus
Statusurile procesului de semnare:
- `Pending` - În așteptare
- `InProgress` - În proces de semnare
- `Signed` - Semnat cu succes
- `Failed` - Semnare eșuată
- `Cancelled` - Anulat
- `Expired` - Expirat

## Relații

### Relații One-to-One
- **FodRequest** - Cererea asociată (prin RequestSignableDocumentId în FodRequest)
- **FodServiceRequest** - Cererea de serviciu asociată (prin RequestSignableDocumentId în FodServiceRequest)

## Exemple de Utilizare

### Creare Document pentru Semnare
```csharp
var signableDoc = new SignableDocument
{
    Id = Guid.NewGuid(),
    SignRequestId = "SIGN-2024-000123",
    Type = DocumentTypeEnum.Request,
    Xml = xmlContent,
    Hash = ComputeHash(xmlContent),
    Status = SignRequestStatus.Pending
};

context.SignableDocuments.Add(signableDoc);
await context.SaveChangesAsync();
```

### Procesare Răspuns Semnare
```csharp
var document = await context.SignableDocuments
    .FirstOrDefaultAsync(d => d.SignRequestId == signRequestId);

if (document != null)
{
    document.Status = SignRequestStatus.Signed;
    document.Signature = signatureBytes;
    document.ResponseDate = DateTime.UtcNow;
    document.Message = "Document semnat cu succes";
    
    await context.SaveChangesAsync();
}
```

### Verificare Integritate Document
```csharp
var document = await context.SignableDocuments
    .FirstOrDefaultAsync(d => d.Id == documentId);

if (document != null && document.Hash != null)
{
    var currentHash = ComputeHash(document.Xml ?? document.Json);
    var isValid = currentHash.SequenceEqual(document.Hash);
    
    if (!isValid)
    {
        // Document modificat după creare
        throw new InvalidOperationException("Integritatea documentului compromisă");
    }
}
```

### Monitorizare Documente în Așteptare
```csharp
var pendingDocuments = await context.SignableDocuments
    .Where(d => d.Status == SignRequestStatus.Pending 
                && d.CreatedDate < DateTime.UtcNow.AddHours(-24))
    .Select(d => new
    {
        d.Id,
        d.SignRequestId,
        d.Type,
        Age = DateTime.UtcNow - d.CreatedDate
    })
    .ToListAsync();
```

## Note Importante

1. **Formate Suportate**:
   - Documentele pot fi stocate în format XML sau JSON
   - De obicei se folosește un singur format per document
   - Formatul depinde de cerințele sistemului de semnare electronică

2. **Securitate și Integritate**:
   - Hash-ul documentului asigură detectarea modificărilor neautorizate
   - Semnătura digitală garantează autenticitatea și non-repudierea
   - SignRequestId permite urmărirea în sistemul extern de semnare

3. **Ciclu de Viață**:
   - Document creat → Trimis pentru semnare → În proces → Semnat/Eșuat
   - Documentele expirate necesită retrimitere
   - Documentele anulate nu pot fi reactivate

4. **Integrare cu Servicii de Semnare**:
   - SignRequestId face legătura cu sistemul extern
   - ResponseDate marchează momentul primirii răspunsului
   - Message poate conține detalii despre erori sau validări

5. **Considerații de Stocare**:
   - Documentele XML/JSON pot fi mari - considerați compresie
   - Semnăturile digitale trebuie păstrate integral
   - Hash-urile sunt esențiale pentru audit și verificare


