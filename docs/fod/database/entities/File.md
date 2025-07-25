# File

## Descriere

Entitate care stochează metadatele fișierelor încărcate în sistemul FOD. Separă informațiile despre fișier (nume, tip, etc.) de conținutul efectiv, permițând o gestionare eficientă a documentelor atașate la cereri și răspunsuri.

### Context de Business

- **Documentație Legală**: Stochează documentele justificative necesare pentru serviciile publice electronice
- **Optimizare Performanță**: Separarea metadatelor de conținut permite încărcarea rapidă a listelor de documente
- **Integrare RSSP**: Sincronizare cu Registrul de Stat al Serviciilor Publice pentru documentele oficiale
- **Conformitate GDPR**: Suportă ștergerea selectivă și controlul accesului la documente cu date personale

## Proprietăți

| Proprietate | Tip | Descriere | Constrângeri | Validări |
|------------|-----|-----------|--------------|----------|
| Id | Guid | Identificator unic al fișierului | Primary Key, moștenit din BaseEntity | - |
| File_Name | string | Numele original al fișierului | Obligatoriu | Max 255 caractere, caractere valide pentru sistem de fișiere |
| File_Type | string | Tipul MIME al fișierului (ex: application/pdf) | Obligatoriu | Trebuie să fie din lista tipurilor acceptate |
| FileContentId | Guid? | Referință către conținutul efectiv al fișierului | Foreign Key către FileContent | - |
| RSSPS_Title | string? | Titlul documentului în Registrul de Stat al Serviciilor Publice | - | Max 500 caractere |
| CreateDate | DateTime? | Data încărcării fișierului | Moștenit din BaseEntity | - |
| UpdateDate | DateTime? | Data ultimei modificări | Moștenit din BaseEntity | - |
| CreateUserId | string? | ID-ul utilizatorului care a încărcat fișierul | Moștenit din BaseEntity | - |
| UpdateUserId | string? | ID-ul utilizatorului care a modificat ultima dată | Moștenit din BaseEntity | - |
| CreateUserName | string? | Numele utilizatorului care a încărcat | Moștenit din BaseEntity | - |
| UpdateUserName | string? | Numele utilizatorului care a modificat | Moștenit din BaseEntity | - |

## Relații

### Relații Many-to-One (Părinți)
- **FileContent** (`FileContent`) - Conținutul efectiv al fișierului prin FileContentId

### Relații Inverse (unde este referențiat)
- **FodRequestFile** - Asocierea cu cererile principale
- **FodServiceRequestFile** - Asocierea cu cererile de servicii
- **FodServiceRequestResponseData** - Fișiere în răspunsuri
- **FodResponseDocument** - Documente generate ca răspuns

## Exemple de Utilizare

### Încărcare Fișier Nou
```csharp
// Creare conținut fișier
var fileContent = new FileContent
{
    File_Content = fileBytes // byte array cu conținutul
};

// Creare metadate fișier
var file = new File
{
    File_Name = "cerere_identitate.pdf",
    File_Type = "application/pdf",
    FileContentId = fileContent.Id,
    RSSPS_Title = "Cerere eliberare act de identitate"
};

context.FileContents.Add(fileContent);
context.Files.Add(file);
await context.SaveChangesAsync();
```

### Atașare Fișier la Cerere
```csharp
var requestFile = new FodRequestFile
{
    RequestId = fodRequestId,
    FileId = file.Id,
    DocumentTypeId = documentTypeId
};

context.FodRequestFiles.Add(requestFile);
await context.SaveChangesAsync();
```

### Descărcare Fișier
```csharp
var fileData = await context.Files
    .Include(f => f.FileContent)
    .Where(f => f.Id == fileId)
    .Select(f => new 
    {
        FileName = f.File_Name,
        ContentType = f.File_Type,
        Content = f.FileContent.File_Content
    })
    .FirstOrDefaultAsync();

// Returnare fișier în controller
return File(fileData.Content, fileData.ContentType, fileData.FileName);
```

### Listare Fișiere pentru Cerere
```csharp
var requestFiles = await context.FodRequestFiles
    .Include(rf => rf.File)
    .Include(rf => rf.DocumentType)
    .Where(rf => rf.RequestId == requestId)
    .Select(rf => new 
    {
        FileId = rf.File.Id,
        FileName = rf.File.File_Name,
        FileType = rf.File.File_Type,
        DocumentType = rf.DocumentType.Name,
        UploadDate = rf.File.CreateDate,
        UploadedBy = rf.File.CreateUserName
    })
    .ToListAsync();
```

### Validare și Upload Securizat
```csharp
public async Task<File> UploadFileAsync(IFormFile formFile, string userId)
{
    // Validări de securitate
    var allowedTypes = new[] { "application/pdf", "image/jpeg", "image/png" };
    if (!allowedTypes.Contains(formFile.ContentType))
    {
        throw new ValidationException($"Tipul de fișier {formFile.ContentType} nu este permis");
    }
    
    if (formFile.Length > 10 * 1024 * 1024) // 10MB
    {
        throw new ValidationException("Fișierul depășește limita de 10MB");
    }
    
    // Validare nume fișier
    var fileName = Path.GetFileNameWithoutExtension(formFile.FileName);
    var fileExtension = Path.GetExtension(formFile.FileName);
    var safeFileName = $"{Regex.Replace(fileName, @"[^\w\d-]", "_")}{fileExtension}";
    
    // Citire conținut
    using var memoryStream = new MemoryStream();
    await formFile.CopyToAsync(memoryStream);
    
    // Scanare antivirus (exemplu)
    if (!await _antivirusService.ScanFileAsync(memoryStream.ToArray()))
    {
        throw new SecurityException("Fișierul nu a trecut verificarea de securitate");
    }
    
    // Salvare în baza de date
    var fileContent = new FileContent { File_Content = memoryStream.ToArray() };
    var file = new File
    {
        File_Name = safeFileName,
        File_Type = formFile.ContentType,
        FileContentId = fileContent.Id
    };
    
    context.FileContents.Add(fileContent);
    context.Files.Add(file);
    await context.SaveChangesAsync();
    
    return file;
}
```

### Ștergere Conformă GDPR
```csharp
public async Task DeleteFileWithGDPRAsync(Guid fileId, string reason)
{
    var file = await context.Files
        .Include(f => f.FileContent)
        .FirstOrDefaultAsync(f => f.Id == fileId);
        
    if (file != null)
    {
        // Audit pentru GDPR
        _logger.LogInformation(
            "GDPR Delete: FileId={FileId}, FileName={FileName}, Reason={Reason}, DeletedBy={User}",
            fileId, file.File_Name, reason, _currentUser.Id);
            
        // Ștergere conținut
        if (file.FileContent != null)
        {
            context.FileContents.Remove(file.FileContent);
        }
        
        // Ștergere metadate
        context.Files.Remove(file);
        
        await context.SaveChangesAsync();
    }
}
```

## Note

1. **Separarea Metadate/Conținut**:
   - Design pattern pentru optimizare performanță
   - Permite încărcarea metadatelor fără conținut
   - Reduce memoria pentru listări

2. **Tipuri de Fișiere Suportate**:
   - PDF pentru documente oficiale
   - JPEG/PNG pentru imagini (fotografii, copii acte)
   - DOCX/DOC pentru template-uri editabile
   - XML/JSON pentru date structurate

3. **Validări Recomandate**:
   - Verificare tip MIME vs. extensie fișier
   - Limitare dimensiune fișier
   - Scanare antivirus înainte de stocare
   - Validare format pentru documente oficiale

4. **Performanță**:
   - Nu încărcați FileContent pentru listări
   - Folosiți streaming pentru fișiere mari
   - Considerați stocare externă (blob storage) pentru scalabilitate
   - Implementați cache pentru fișiere accesate frecvent

5. **Securitate**:
   - Validați permisiuni înainte de download
   - Nu expuneți path-uri reale în API
   - Implementați rate limiting pentru download
   - Loggați toate accesările pentru audit

6. **RSSPS Integration**:
   - RSSPS_Title folosit pentru sincronizare cu Registrul de Stat
   - Permite mapping între documentele FOD și cele din registrul național
   - Facilitează schimbul de documente între instituții publice

7. **Tipuri MIME Acceptate**:
   ```csharp
   public static class AllowedFileTypes
   {
       public static readonly Dictionary<string, string[]> MimeTypes = new()
       {
           ["application/pdf"] = new[] { ".pdf" },
           ["image/jpeg"] = new[] { ".jpg", ".jpeg" },
           ["image/png"] = new[] { ".png" },
           ["application/msword"] = new[] { ".doc" },
           ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] = new[] { ".docx" },
           ["application/xml"] = new[] { ".xml" },
           ["application/json"] = new[] { ".json" }
       };
   }
   ```

8. **Strategii de Stocare**:
   - **Sub 1MB**: Stocare directă în baza de date
   - **1-10MB**: Considerați compresie înainte de stocare
   - **Peste 10MB**: Recomandăm Azure Blob Storage sau similar
   - **Documente temporare**: Implementați cleanup automat după 24 ore

9. **Indexare Recomandată**:
   ```sql
   CREATE INDEX IX_File_CreateDate ON Files (CreateDate DESC);
   CREATE INDEX IX_File_FileType ON Files (File_Type);
   CREATE INDEX IX_File_RSSPS_Title ON Files (RSSPS_Title) WHERE RSSPS_Title IS NOT NULL;
   ```