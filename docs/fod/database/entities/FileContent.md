# FileContent

## Descriere

Entitate care stochează conținutul efectiv (binary) al fișierelor în sistemul FOD. Separată de metadatele fișierului pentru optimizarea performanței și pentru a permite încărcarea informațiilor despre fișiere fără a încărca conținutul lor în memorie.

### Context de Business

- **Optimizare Resurse**: Separarea permite listarea rapidă a documentelor fără încărcarea conținutului
- **Scalabilitate**: Design pregatit pentru migrare către soluții de stocare externă (blob storage)
- **Securitate**: Permite aplicarea diferită a politicilor de securitate pentru metadate vs. conținut
- **Performanță**: Reduce semnificativ memoria utilizată pentru operațiuni de listare și căutare

## Proprietăți

| Proprietate | Tip | Descriere | Constrângeri | Considerări Tehnice |
|------------|-----|-----------|--------------|---------------------|
| Id | Guid | Identificator unic al conținutului | Primary Key, moștenit din BaseEntity | - |
| File_Content | byte[] | Conținutul binar al fișierului | Obligatoriu | Max 2GB (limita varbinary(max)), recomandare: max 50MB |
| CreateDate | DateTime? | Data încărcării conținutului | Moștenit din BaseEntity | Folosit pentru politici de retenție |
| UpdateDate | DateTime? | Data ultimei modificări | Moștenit din BaseEntity | - |
| CreateUserId | string? | ID-ul utilizatorului care a încărcat | Moștenit din BaseEntity | - |
| UpdateUserId | string? | ID-ul utilizatorului care a modificat | Moștenit din BaseEntity | - |
| CreateUserName | string? | Numele utilizatorului care a încărcat | Moștenit din BaseEntity | - |
| UpdateUserName | string? | Numele utilizatorului care a modificat | Moștenit din BaseEntity | - |

## Relații

### Relații Inverse (unde este referențiat)
- **File** - Metadatele fișierelor care referențiază acest conținut

## Exemple de Utilizare

### Încărcare Fișier cu Conținut
```csharp
using (var stream = uploadedFile.OpenReadStream())
{
    var buffer = new byte[stream.Length];
    await stream.ReadAsync(buffer, 0, buffer.Length);
    
    var fileContent = new FileContent
    {
        File_Content = buffer
    };
    
    var file = new File
    {
        File_Name = uploadedFile.FileName,
        File_Type = uploadedFile.ContentType,
        FileContentId = fileContent.Id
    };
    
    context.FileContents.Add(fileContent);
    context.Files.Add(file);
    await context.SaveChangesAsync();
}
```

### Streaming pentru Fișiere Mari
```csharp
// Pentru fișiere mari, folosiți streaming în loc de încărcarea completă în memorie
public async Task<IActionResult> DownloadLargeFile(Guid fileId)
{
    var file = await context.Files
        .Where(f => f.Id == fileId)
        .Select(f => new { f.File_Name, f.File_Type, f.FileContentId })
        .FirstOrDefaultAsync();
    
    if (file == null) return NotFound();
    
    // Stream direct din baza de date
    var stream = new FileContentStream(context, file.FileContentId.Value);
    
    return File(stream, file.File_Type, file.File_Name);
}
```

### Ștergere Conținut Orfelinat
```csharp
// Găsește conținut fără referințe în File
var orphanedContent = await context.FileContents
    .Where(fc => !context.Files.Any(f => f.FileContentId == fc.Id))
    .ToListAsync();

context.FileContents.RemoveRange(orphanedContent);
await context.SaveChangesAsync();
```

### Compresie Conținut
```csharp
using System.IO.Compression;

// Compresie înainte de stocare
byte[] CompressContent(byte[] content)
{
    using (var output = new MemoryStream())
    {
        using (var gzip = new GZipStream(output, CompressionLevel.Optimal))
        {
            gzip.Write(content, 0, content.Length);
        }
        return output.ToArray();
    }
}

// Decompresie la citire
byte[] DecompressContent(byte[] compressedContent)
{
    using (var input = new MemoryStream(compressedContent))
    using (var gzip = new GZipStream(input, CompressionMode.Decompress))
    using (var output = new MemoryStream())
    {
        gzip.CopyTo(output);
        return output.ToArray();
    }
}
```

### Verificare Integritate cu Hash
```csharp
using System.Security.Cryptography;

public class SecureFileContent : FileContent
{
    public string ContentHash { get; set; }
    
    public void SetContentWithHash(byte[] content)
    {
        File_Content = content;
        
        // Calculare SHA256 hash
        using (var sha256 = SHA256.Create())
        {
            var hashBytes = sha256.ComputeHash(content);
            ContentHash = Convert.ToBase64String(hashBytes);
        }
    }
    
    public bool VerifyIntegrity()
    {
        using (var sha256 = SHA256.Create())
        {
            var currentHash = Convert.ToBase64String(
                sha256.ComputeHash(File_Content));
            return currentHash == ContentHash;
        }
    }
}
```

### Criptare Conținut Sensibil
```csharp
public class EncryptedFileContent
{
    private readonly IDataProtector _protector;
    
    public EncryptedFileContent(IDataProtectionProvider provider)
    {
        _protector = provider.CreateProtector("FileContent.Encryption");
    }
    
    public FileContent EncryptContent(byte[] plainContent)
    {
        var encryptedBytes = _protector.Protect(plainContent);
        return new FileContent { File_Content = encryptedBytes };
    }
    
    public byte[] DecryptContent(FileContent encrypted)
    {
        return _protector.Unprotect(encrypted.File_Content);
    }
}
```

## Note

1. **Design Pattern - Separare Metadate/Conținut**:
   - Permite query-uri rapide pe metadate fără încărcarea conținutului
   - Reduce utilizarea memoriei pentru operații de listare
   - Facilitează caching-ul separat pentru metadate și conținut

2. **Considerații de Stocare**:
   - Pentru fișiere > 1MB considerați stocare externă (Azure Blob, AWS S3)
   - Implementați compresie pentru tipuri de fișiere necomprimate
   - Monitorizați creșterea bazei de date

3. **Performanță**:
   - Folosiți lazy loading pentru FileContent
   - Implementați streaming pentru fișiere mari
   - Nu încărcați conținutul în query-uri de listare
   - Considerați partitionarea tabelei pentru volume mari

4. **Limite și Constrângeri**:
   - SQL Server: max 2GB per câmp varbinary(max)
   - Considerați chunking pentru fișiere foarte mari
   - Implementați limite de dimensiune la upload

5. **Securitate**:
   - Nu stocați fișiere executabile
   - Implementați scanare antivirus înainte de stocare
   - Criptați conținutul sensibil
   - Verificați integritatea folosind hash-uri

6. **Backup și Recovery**:
   - Conținutul fișierelor poate crește semnificativ dimensiunea backup-urilor
   - Considerați backup incremental sau diferențial
   - Testați periodic restaurarea fișierelor

7. **Migrare către Stocare Externă**:
   ```csharp
   // Exemplu migrare către blob storage
   public async Task MigrateToBlob(FileContent content)
   {
       var blobUrl = await blobService.UploadAsync(content.File_Content);
       
       // Înlocuiește conținutul cu referință blob
       content.File_Content = Encoding.UTF8.GetBytes(blobUrl);
       await context.SaveChangesAsync();
   }
   ```

8. **Politici de Retenție**:
   - **Documente temporare**: Ștergere automată după 24-48 ore
   - **Documente procesate**: Arhivare după 30 zile
   - **Documente oficiale**: Păstrare minim 5 ani conform legislației
   - **Date personale**: Ștergere conform GDPR la cerere

9. **Monitorizare și Alerte**:
   ```csharp
   public class FileContentMonitor
   {
       public async Task<StorageMetrics> GetMetricsAsync()
       {
           return new StorageMetrics
           {
               TotalFiles = await context.FileContents.CountAsync(),
               TotalSizeGB = await context.FileContents
                   .SumAsync(fc => fc.File_Content.Length) / (1024.0 * 1024 * 1024),
               LargeFiles = await context.FileContents
                   .CountAsync(fc => fc.File_Content.Length > 10 * 1024 * 1024),
               OldestFile = await context.FileContents
                   .MinAsync(fc => fc.CreateDate)
           };
       }
   }
   ```

10. **Optimizări pentru Entity Framework**:
    ```csharp
    // Configurare în DbContext
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FileContent>(entity =>
        {
            // Exclude din query-uri by default
            entity.Property(e => e.File_Content)
                .HasColumnType("varbinary(max)")
                .ValueGeneratedNever();
                
            // Index pentru cleanup
            entity.HasIndex(e => e.CreateDate)
                .HasDatabaseName("IX_FileContent_CreateDate");
        });
    }
    ```