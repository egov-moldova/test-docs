# FodServiceRequestFile

## Descriere

Entitatea de legătură care asociază fișierele cu cererile de servicii din sistemul Front Office Digital. Această entitate permite atașarea de documente specifice fiecărui serviciu solicitat, cum ar fi rezultate ale procesării, certificate generate, sau alte documente produse de furnizorul de servicii.

## Proprietăți

### Identificare și Relații

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| FileId | Guid | ID-ul fișierului atașat | Primary Key, Foreign Key către File |
| ServiceRequestId | Guid | ID-ul cererii de serviciu asociate | Primary Key (implicit), Foreign Key către FodServiceRequest |

### Metadate (moștenite din BaseEntity - dacă aplicabil)

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| CreatedDate | DateTime | Data atașării fișierului | Setată automat |
| ModifiedDate | DateTime | Data ultimei modificări | Actualizată automat |
| CreatedBy | string? | Utilizatorul care a atașat fișierul | - |
| ModifiedBy | string? | Utilizatorul care a modificat ultima dată | - |

## Relații

### Relații Many-to-One (Părinți)
- **File** (`File`) - Fișierul atașat prin FileId
- **ServiceRequest** (`FodServiceRequest`) - Cererea de serviciu asociată (relație implicită)

## Exemple de Utilizare

### Atașare Document Rezultat
```csharp
// Salvare fișier rezultat
var resultFile = new File
{
    Id = Guid.NewGuid(),
    FileName = "certificat_nastere_12345.pdf",
    ContentType = "application/pdf",
    Size = pdfBytes.Length,
    Content = pdfBytes
};
context.Files.Add(resultFile);

// Creare asociere cu cererea de serviciu
var serviceRequestFile = new FodServiceRequestFile
{
    FileId = resultFile.Id,
    ServiceRequestId = serviceRequestId,
    CreatedDate = DateTime.UtcNow,
    CreatedBy = currentUserId
};
context.FodServiceRequestFiles.Add(serviceRequestFile);

await context.SaveChangesAsync();
```

### Obținere Documente Generate pentru un Serviciu
```csharp
var serviceFiles = await context.FodServiceRequestFiles
    .Include(srf => srf.File)
    .Where(srf => srf.ServiceRequestId == serviceRequestId)
    .Select(srf => new
    {
        srf.File.FileName,
        srf.File.ContentType,
        srf.File.Size,
        srf.FileId,
        srf.CreatedDate,
        IsResult = srf.File.FileName.Contains("certificat") || 
                   srf.File.FileName.Contains("extras")
    })
    .OrderByDescending(f => f.CreatedDate)
    .ToListAsync();
```

### Verificare Completare Serviciu
```csharp
var serviceRequest = await context.FodServiceRequests
    .Include(sr => sr.Files)
        .ThenInclude(f => f.File)
    .FirstOrDefaultAsync(sr => sr.Id == serviceRequestId);

var hasResultDocument = serviceRequest.Files
    .Any(f => f.File.ContentType == "application/pdf" && 
              f.CreatedDate >= serviceRequest.ProcessingStartDate);

if (hasResultDocument)
{
    serviceRequest.Status = ServiceRequestStatus.Completed;
    await context.SaveChangesAsync();
}
```

### Arhivare Documente Serviciu
```csharp
var documentsToArchive = await context.FodServiceRequestFiles
    .Include(srf => srf.File)
    .Include(srf => srf.ServiceRequest)
    .Where(srf => srf.ServiceRequest.CompletionDate < DateTime.UtcNow.AddYears(-1))
    .ToListAsync();

foreach (var doc in documentsToArchive)
{
    // Mutare în arhivă
    var archivedFile = new ArchivedFile
    {
        OriginalFileId = doc.FileId,
        FileName = doc.File.FileName,
        ArchivedDate = DateTime.UtcNow,
        ServiceRequestNumber = doc.ServiceRequest.Request.RequestNumber
    };
    
    context.ArchivedFiles.Add(archivedFile);
}

await context.SaveChangesAsync();
```

## Tipuri de Fișiere Asociate

1. **Documente Rezultat**:
   - Certificate emise
   - Extrase oficiale
   - Adeverințe
   - Rapoarte generate

2. **Documente Intermediare**:
   - Confirmări de procesare
   - Notificări de status
   - Documente de verificare

3. **Documente Suport**:
   - Instrucțiuni de ridicare
   - Chitanțe de plată
   - Confirmări de livrare

## Note Importante

1. **Diferența față de FodRequestFile**:
   - FodRequestFile: documente încărcate de solicitant
   - FodServiceRequestFile: documente generate de sistem/furnizor
   - Această separare permite gestionarea clară a fluxului documentelor

2. **Ciclu de Viață**:
   - Documentele sunt generate după procesarea serviciului
   - Pot fi actualizate în cazul corecțiilor
   - Necesită arhivare conform politicilor de retenție

3. **Securitate și Acces**:
   - Accesul la documente necesită verificarea permisiunilor
   - Documentele conțin date personale protejate
   - Implementați watermarking pentru documente oficiale

4. **Integrare cu Furnizori**:
   - Documentele pot fi primite prin API de la furnizori
   - Formatul și structura depind de tipul serviciului
   - Validați integritatea documentelor primite

5. **Optimizare Stocare**:
   - Considerați compresie pentru documente mari
   - Implementați politici de arhivare pentru documente vechi
   - Folosiți CDN pentru distribuție eficientă


