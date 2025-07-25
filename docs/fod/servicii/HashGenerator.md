# HashGenerator

## Documentație pentru serviciul HashGenerator

### 1. Descriere Generală

`HashGenerator` este un serviciu server-side care oferă funcționalități de generare hash criptografic pentru aplicațiile FOD. În prezent, serviciul suportă generarea de hash-uri SHA-1 pentru diverse scopuri de securitate și integritate a datelor.

Caracteristici principale:
- Generare hash SHA-1
- Implementare asincronă
- Suport UTF-8 pentru caractere speciale
- Returnare rezultat ca array de bytes
- Utilizare în verificarea integrității datelor

**Notă importantă**: SHA-1 nu mai este considerat sigur pentru aplicații criptografice critice. Pentru aplicații noi, considerați SHA-256 sau SHA-512.

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs (server-side)
builder.Services.AddScoped<IHashGenerator, HashGenerator>();

// În modulul Server.ServicesSetup
public static IServiceCollection AddServerServices(this IServiceCollection services)
{
    services.AddScoped<IHashGenerator, HashGenerator>();
    return services;
}
```

### 3. Interfață

```csharp
public interface IHashGenerator
{
    Task<byte[]> GetSha1(string value);
}
```

### 4. Metodă Disponibilă

#### GetSha1
Generează un hash SHA-1 pentru valoarea string furnizată.

**Parametri:**
- `value` (string) - Șirul de caractere pentru care se generează hash-ul

**Returnează:**
- `Task<byte[]>` - Hash-ul SHA-1 ca array de bytes (20 bytes)

**Note:**
- Folosește encoding UTF-8 pentru conversia string-ului
- SHA-1 produce întotdeauna un hash de 160 biți (20 bytes)
- Metoda este deterministă - același input produce același hash

### 5. Exemple de Utilizare

#### Generare hash simplu
```csharp
public class DocumentService
{
    private readonly IHashGenerator _hashGenerator;
    
    public DocumentService(IHashGenerator hashGenerator)
    {
        _hashGenerator = hashGenerator;
    }
    
    public async Task<string> GenerateDocumentHash(string documentContent)
    {
        // Generare hash
        byte[] hashBytes = await _hashGenerator.GetSha1(documentContent);
        
        // Conversie la string hexadecimal
        string hashString = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        
        return hashString;
    }
}
```

#### Verificare integritate fișier
```csharp
public class FileIntegrityService
{
    private readonly IHashGenerator _hashGenerator;
    private readonly IFileRepository _fileRepository;
    
    public async Task<FileIntegrityResult> VerifyFileIntegrity(
        int fileId, 
        string expectedHash)
    {
        var file = await _fileRepository.GetById(fileId);
        if (file == null)
        {
            return new FileIntegrityResult 
            { 
                IsValid = false, 
                Message = "Fișierul nu a fost găsit" 
            };
        }
        
        // Calculează hash-ul actual
        var currentHashBytes = await _hashGenerator.GetSha1(file.Content);
        var currentHash = Convert.ToBase64String(currentHashBytes);
        
        // Compară cu hash-ul așteptat
        var isValid = currentHash == expectedHash;
        
        return new FileIntegrityResult
        {
            IsValid = isValid,
            CurrentHash = currentHash,
            ExpectedHash = expectedHash,
            Message = isValid 
                ? "Integritatea fișierului este validă" 
                : "Fișierul a fost modificat"
        };
    }
}
```

#### Generare token unic
```csharp
public class TokenService
{
    private readonly IHashGenerator _hashGenerator;
    
    public async Task<string> GenerateUniqueToken(string userId, DateTime timestamp)
    {
        // Combină mai multe elemente pentru unicitate
        var tokenData = $"{userId}|{timestamp:O}|{Guid.NewGuid()}";
        
        // Generează hash
        var hashBytes = await _hashGenerator.GetSha1(tokenData);
        
        // Conversie la Base64 pentru URL-safe token
        var token = Convert.ToBase64String(hashBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .TrimEnd('=');
        
        return token;
    }
}
```

### 6. Verificare parolă (exemplu educativ)

```csharp
public class PasswordVerificationService
{
    private readonly IHashGenerator _hashGenerator;
    
    // NOTĂ: Acesta este doar un exemplu. Pentru producție, folosiți 
    // algoritmi specializați pentru parole (bcrypt, scrypt, Argon2)
    public async Task<bool> VerifyPassword(
        string inputPassword, 
        string salt, 
        string storedHash)
    {
        // Combină parola cu salt
        var saltedPassword = $"{inputPassword}{salt}";
        
        // Generează hash
        var hashBytes = await _hashGenerator.GetSha1(saltedPassword);
        var inputHash = Convert.ToBase64String(hashBytes);
        
        // Compară hash-urile
        return inputHash == storedHash;
    }
    
    public async Task<(string hash, string salt)> HashPassword(string password)
    {
        // Generează salt aleatoriu
        var salt = Guid.NewGuid().ToString("N");
        
        // Hash cu salt
        var saltedPassword = $"{password}{salt}";
        var hashBytes = await _hashGenerator.GetSha1(saltedPassword);
        var hash = Convert.ToBase64String(hashBytes);
        
        return (hash, salt);
    }
}
```

### 7. Checksum pentru date

```csharp
public class DataChecksumService
{
    private readonly IHashGenerator _hashGenerator;
    
    public async Task<ChecksumResult> GenerateChecksum<T>(T data)
    {
        // Serializare date
        var json = JsonSerializer.Serialize(data);
        
        // Generare checksum
        var hashBytes = await _hashGenerator.GetSha1(json);
        
        return new ChecksumResult
        {
            Data = data,
            Checksum = Convert.ToBase64String(hashBytes),
            Algorithm = "SHA-1",
            GeneratedAt = DateTime.UtcNow
        };
    }
    
    public async Task<bool> ValidateChecksum<T>(T data, string expectedChecksum)
    {
        var result = await GenerateChecksum(data);
        return result.Checksum == expectedChecksum;
    }
}
```

### 8. Cache key generation

```csharp
public class CacheKeyService
{
    private readonly IHashGenerator _hashGenerator;
    private readonly IMemoryCache _cache;
    
    public async Task<string> GenerateCacheKey(params object[] keyComponents)
    {
        // Combină componentele cheii
        var keyData = string.Join("|", keyComponents.Select(c => c?.ToString() ?? "null"));
        
        // Generează hash pentru cheie scurtă și unică
        var hashBytes = await _hashGenerator.GetSha1(keyData);
        var shortHash = Convert.ToBase64String(hashBytes).Substring(0, 8);
        
        return $"cache_{shortHash}";
    }
    
    public async Task<T> GetOrCreateAsync<T>(
        string prefix,
        object[] keyComponents,
        Func<Task<T>> factory,
        TimeSpan expiration)
    {
        var cacheKey = await GenerateCacheKey(keyComponents);
        var fullKey = $"{prefix}_{cacheKey}";
        
        return await _cache.GetOrCreateAsync(fullKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = expiration;
            return await factory();
        });
    }
}
```

### 9. Deduplicare date

```csharp
public class DataDeduplicationService
{
    private readonly IHashGenerator _hashGenerator;
    private readonly IDataRepository _repository;
    
    public async Task<DeduplicationResult> CheckDuplicate(string content)
    {
        // Generează hash pentru conținut
        var hashBytes = await _hashGenerator.GetSha1(content);
        var contentHash = Convert.ToBase64String(hashBytes);
        
        // Caută duplicate în baza de date
        var existingRecord = await _repository.FindByHash(contentHash);
        
        if (existingRecord != null)
        {
            return new DeduplicationResult
            {
                IsDuplicate = true,
                ExistingRecordId = existingRecord.Id,
                Hash = contentHash,
                Message = "Conținut duplicat detectat"
            };
        }
        
        return new DeduplicationResult
        {
            IsDuplicate = false,
            Hash = contentHash,
            Message = "Conținut unic"
        };
    }
    
    public async Task<int> RemoveDuplicates(IEnumerable<DataRecord> records)
    {
        var uniqueRecords = new Dictionary<string, DataRecord>();
        var duplicatesRemoved = 0;
        
        foreach (var record in records)
        {
            var hashBytes = await _hashGenerator.GetSha1(record.Content);
            var hash = Convert.ToBase64String(hashBytes);
            
            if (!uniqueRecords.ContainsKey(hash))
            {
                uniqueRecords[hash] = record;
            }
            else
            {
                duplicatesRemoved++;
            }
        }
        
        return duplicatesRemoved;
    }
}
```

### 10. Implementare extinsă cu mai mulți algoritmi

```csharp
public interface IExtendedHashGenerator : IHashGenerator
{
    Task<byte[]> GetSha256(string value);
    Task<byte[]> GetSha512(string value);
    Task<byte[]> GetMd5(string value); // Doar pentru compatibilitate legacy
}

public class ExtendedHashGenerator : IExtendedHashGenerator
{
    public async Task<byte[]> GetSha1(string value)
    {
        return await Task.FromResult(
            SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(value))
        );
    }
    
    public async Task<byte[]> GetSha256(string value)
    {
        return await Task.FromResult(
            SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(value))
        );
    }
    
    public async Task<byte[]> GetSha512(string value)
    {
        return await Task.FromResult(
            SHA512.Create().ComputeHash(Encoding.UTF8.GetBytes(value))
        );
    }
    
    public async Task<byte[]> GetMd5(string value)
    {
        return await Task.FromResult(
            MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(value))
        );
    }
}
```

### 11. Testing

```csharp
[TestClass]
public class HashGeneratorTests
{
    private IHashGenerator _hashGenerator;
    
    [TestInitialize]
    public void Setup()
    {
        _hashGenerator = new HashGenerator();
    }
    
    [TestMethod]
    public async Task GetSha1_SameInput_ReturnsSameHash()
    {
        // Arrange
        var input = "test string";
        
        // Act
        var hash1 = await _hashGenerator.GetSha1(input);
        var hash2 = await _hashGenerator.GetSha1(input);
        
        // Assert
        CollectionAssert.AreEqual(hash1, hash2);
    }
    
    [TestMethod]
    public async Task GetSha1_DifferentInput_ReturnsDifferentHash()
    {
        // Arrange
        var input1 = "test string 1";
        var input2 = "test string 2";
        
        // Act
        var hash1 = await _hashGenerator.GetSha1(input1);
        var hash2 = await _hashGenerator.GetSha1(input2);
        
        // Assert
        CollectionAssert.AreNotEqual(hash1, hash2);
    }
    
    [TestMethod]
    public async Task GetSha1_ReturnsCorrectLength()
    {
        // Arrange
        var input = "test";
        
        // Act
        var hash = await _hashGenerator.GetSha1(input);
        
        // Assert
        Assert.AreEqual(20, hash.Length); // SHA-1 = 160 bits = 20 bytes
    }
    
    [TestMethod]
    public async Task GetSha1_KnownValue_ReturnsExpectedHash()
    {
        // Arrange
        var input = "hello world";
        var expectedHex = "2aae6c35c94fcfb415dbe95f408b9ce91ee846ed";
        
        // Act
        var hash = await _hashGenerator.GetSha1(input);
        var actualHex = BitConverter.ToString(hash).Replace("-", "").ToLower();
        
        // Assert
        Assert.AreEqual(expectedHex, actualHex);
    }
}
```

### 12. Best Practices

1. **Securitate**: SHA-1 nu mai este recomandat pentru aplicații criptografice. Folosiți SHA-256 sau SHA-512
2. **Salt pentru parole**: Întotdeauna folosiți salt pentru hash-uri de parole
3. **Algoritmi specializați**: Pentru parole, folosiți bcrypt, scrypt sau Argon2
4. **Comparare sigură**: Folosiți comparare constantă în timp pentru hash-uri
5. **Encoding consistent**: Folosiți întotdeauna același encoding (UTF-8)
6. **Stocare**: Stocați hash-urile ca Base64 sau hexadecimal pentru eficiență

### 13. Migrare la algoritmi mai siguri

```csharp
public class HashMigrationService
{
    private readonly IHashGenerator _oldHashGenerator;
    private readonly IExtendedHashGenerator _newHashGenerator;
    
    public async Task<MigrationResult> MigrateHash(
        string value, 
        string oldSha1Hash)
    {
        // Verifică hash-ul vechi
        var oldHashBytes = await _oldHashGenerator.GetSha1(value);
        var oldHash = Convert.ToBase64String(oldHashBytes);
        
        if (oldHash != oldSha1Hash)
        {
            return new MigrationResult 
            { 
                Success = false, 
                Error = "Hash vechi invalid" 
            };
        }
        
        // Generează hash nou
        var newHashBytes = await _newHashGenerator.GetSha256(value);
        var newHash = Convert.ToBase64String(newHashBytes);
        
        return new MigrationResult
        {
            Success = true,
            OldHash = oldHash,
            NewHash = newHash,
            Algorithm = "SHA-256"
        };
    }
}
```

### 14. Concluzie

`HashGenerator` oferă funcționalitate de bază pentru generarea hash-urilor SHA-1 în aplicațiile FOD. Deși simplu și eficient pentru verificarea integrității datelor non-critice, serviciul ar trebui extins cu algoritmi mai moderni pentru aplicații care necesită securitate sporită. Pentru aplicații noi, considerați implementarea SHA-256 sau SHA-512.