# FodMDocsDocumentShare

## Descriere
Entitatea `FodMDocsDocumentShare` gestionează partajarea documentelor prin sistemul MDocs, permițând schimbul securizat de documente între instituții și cetățeni. Aceasta facilitează accesul controlat la documente oficiale în format digital.

## Proprietăți

Această entitate nu expune proprietăți publice direct, funcționând ca o entitate de gestionare a partajărilor de documente.

## Relații
- **FodRequest** - Cererea asociată cu documentul partajat
- **FodUser** - Utilizatorul care partajează sau primește documentul
- **MDocsDocument** - Documentul din sistemul MDocs care este partajat
- **FodDepartment** - Departamentul care gestionează partajarea

## Utilizare

### Exemplu de creare partajare document
```csharp
public async Task<Guid> PartajeazaDocument(Guid documentId, string userIdDestinatar, int departmentId)
{
    var partajare = new FodMDocsDocumentShare
    {
        Id = Guid.NewGuid(),
        DocumentId = documentId,
        SharedWithUserId = userIdDestinatar,
        SharedByDepartmentId = departmentId,
        ShareDate = DateTime.UtcNow,
        ExpiryDate = DateTime.UtcNow.AddDays(30),
        IsActive = true
    };
    
    await context.FodMDocsDocumentShares.AddAsync(partajare);
    await context.SaveChangesAsync();
    
    return partajare.Id;
}
```

### Exemplu de verificare acces la document
```csharp
public async Task<bool> VerificaAccesDocument(Guid documentId, string userId)
{
    return await context.FodMDocsDocumentShares
        .AnyAsync(ds => ds.DocumentId == documentId 
                     && ds.SharedWithUserId == userId 
                     && ds.IsActive 
                     && ds.ExpiryDate > DateTime.UtcNow);
}
```

### Exemplu de revocare acces
```csharp
public async Task RevocaAcces(Guid shareId)
{
    var partajare = await context.FodMDocsDocumentShares
        .FirstOrDefaultAsync(ds => ds.Id == shareId);
    
    if (partajare != null)
    {
        partajare.IsActive = false;
        partajare.RevokedDate = DateTime.UtcNow;
        await context.SaveChangesAsync();
    }
}
```

### Exemplu de obținere documente partajate
```csharp
public async Task<List<SharedDocumentInfo>> GetDocumentePartajate(string userId)
{
    return await context.FodMDocsDocumentShares
        .Where(ds => ds.SharedWithUserId == userId 
                  && ds.IsActive 
                  && ds.ExpiryDate > DateTime.UtcNow)
        .Include(ds => ds.Document)
        .Include(ds => ds.SharedByDepartment)
        .Select(ds => new SharedDocumentInfo
        {
            DocumentName = ds.Document.Name,
            SharedBy = ds.SharedByDepartment.Name,
            ShareDate = ds.ShareDate,
            ExpiryDate = ds.ExpiryDate,
            DocumentType = ds.Document.Type
        })
        .OrderByDescending(d => d.ShareDate)
        .ToListAsync();
}
```

## Note importante
- Documentele partajate au o perioadă de valabilitate limitată
- Accesul poate fi revocat în orice moment
- Sistemul MDocs asigură autenticitatea și integritatea documentelor
- Partajarea este auditată pentru conformitate
- Suportă partajare între cetățeni și instituții guvernamentale