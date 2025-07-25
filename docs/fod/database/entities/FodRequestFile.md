# FodRequestFile

## Descriere

Entitatea de legătură care asociază fișierele atașate cu cererile din sistemul Front Office Digital. Această entitate implementează relația many-to-many între cereri și fișiere, permițând atașarea de documente justificative, acte de identitate, procuri și alte documente necesare procesării cererii.

## Proprietăți

### Chei de Legătură

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| FileId | Guid | ID-ul fișierului atașat | Primary Key (parte), Foreign Key către File |
| RequestId | Guid | ID-ul cererii asociate | Primary Key (parte), Foreign Key către FodRequest |

## Relații

### Relații Many-to-One (Părinți)
- **File** (`File`) - Fișierul atașat prin FileId
- **Request** (`FodRequest`) - Cererea la care este atașat fișierul prin RequestId

## Exemple de Utilizare

### Atașare Fișier la Cerere
```csharp
// Mai întâi salvăm fișierul
var file = new File
{
    Id = Guid.NewGuid(),
    FileName = "buletin_identitate.pdf",
    ContentType = "application/pdf",
    Size = fileBytes.Length,
    Content = fileBytes
};
context.Files.Add(file);

// Apoi creăm asocierea
var requestFile = new FodRequestFile
{
    FileId = file.Id,
    RequestId = requestId
};
context.FodRequestFiles.Add(requestFile);

await context.SaveChangesAsync();
```

### Obținere Fișiere pentru o Cerere
```csharp
var requestFiles = await context.FodRequestFiles
    .Include(rf => rf.File)
    .Where(rf => rf.RequestId == requestId)
    .Select(rf => new
    {
        rf.File.FileName,
        rf.File.ContentType,
        rf.File.Size,
        rf.FileId,
        UploadDate = rf.File.CreatedDate
    })
    .OrderBy(f => f.UploadDate)
    .ToListAsync();
```

### Verificare Documente Obligatorii
```csharp
var request = await context.FodRequests
    .Include(r => r.Attachments)
        .ThenInclude(a => a.File)
    .FirstOrDefaultAsync(r => r.Id == requestId);

var hasIdentityDocument = request.Attachments
    .Any(a => a.File.FileName.Contains("buletin") || 
              a.File.FileName.Contains("pasaport"));

var hasPowerOfAttorney = request.Attachments
    .Any(a => a.File.FileName.Contains("procura"));

if (!hasIdentityDocument)
{
    errors.Add("Lipsește documentul de identitate");
}

if (request.OnBehalfOn == OnBehalfOnEnum.Other && !hasPowerOfAttorney)
{
    errors.Add("Lipsește procura pentru reprezentare");
}
```

### Ștergere Atașament
```csharp
var requestFile = await context.FodRequestFiles
    .FirstOrDefaultAsync(rf => rf.RequestId == requestId && rf.FileId == fileId);

if (requestFile != null)
{
    context.FodRequestFiles.Remove(requestFile);
    
    // Opțional: ștergem și fișierul dacă nu mai e folosit
    var fileUsedElsewhere = await context.FodRequestFiles
        .AnyAsync(rf => rf.FileId == fileId && rf.RequestId != requestId);
    
    if (!fileUsedElsewhere)
    {
        var file = await context.Files.FindAsync(fileId);
        if (file != null)
            context.Files.Remove(file);
    }
    
    await context.SaveChangesAsync();
}
```

## Tipuri Comune de Atașamente

1. **Documente de Identitate**:
   - Buletin de identitate
   - Pașaport
   - Permis de ședere

2. **Documente de Reprezentare**:
   - Procură notarială
   - Delegație
   - Ordin de numire

3. **Documente Justificative**:
   - Certificate (naștere, căsătorie, deces)
   - Diplome și atestate
   - Contracte și acte de proprietate

4. **Documente Speciale**:
   - Certificat de dizabilitate
   - Legitimație de pensionar
   - Carnet de veteran

## Note Importante

1. **Chei Compuse**:
   - Entitatea folosește o cheie primară compusă din (FileId, RequestId)
   - Aceasta previne atașarea aceluiași fișier de mai multe ori la aceeași cerere

2. **Gestionarea Fișierelor**:
   - Fișierele pot fi partajate între mai multe cereri
   - Ștergerea unei asocieri nu șterge automat fișierul
   - Implementați logică de curățare pentru fișiere orfane

3. **Validări și Limite**:
   - Verificați tipul și dimensiunea fișierelor înainte de atașare
   - Implementați limite pentru numărul de atașamente per cerere
   - Validați formatul fișierelor (PDF, JPG, PNG, etc.)

4. **Securitate**:
   - Verificați permisiunile înainte de a permite accesul la fișiere
   - Fișierele conțin date personale sensibile
   - Implementați audit trail pentru acces și modificări

5. **Performanță**:
   - Pentru liste mari de atașamente, folosiți paginare
   - Considerați stocarea fișierelor în blob storage pentru scalabilitate
   - Implementați caching pentru metadate frecvent accesate


