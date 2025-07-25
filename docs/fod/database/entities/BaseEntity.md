# BaseEntity

## Descriere

Clasa de bază pentru majoritatea entităților din sistemul FOD. Oferă câmpuri comune de audit și tracking pentru toate entitățile care moștenesc din ea, asigurând o abordare consistentă pentru urmărirea modificărilor în sistem.

### Context de Business

BaseEntity implementează cerințele fundamentale de audit și conformitate pentru sistemele guvernamentale:
- **Trasabilitate Completă**: Conform cerințelor legale pentru sistemele publice, toate modificările trebuie să fie trasabile
- **Responsabilitate**: Identificarea clară a persoanelor responsabile pentru fiecare operațiune
- **Conformitate GDPR**: Suportă cerințele de audit pentru protecția datelor personale
- **Integritate Referențială**: Asigură că toate entitățile au identificatori unici globali

## Proprietăți

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| Id | Guid | Identificator unic universal pentru entitate | Primary Key |
| CreateDate | DateTime? | Data și ora când a fost creată înregistrarea | - |
| UpdateDate | DateTime? | Data și ora ultimei actualizări a înregistrării | - |
| CreateUserId | string? | ID-ul utilizatorului care a creat înregistrarea | - |
| UpdateUserId | string? | ID-ul utilizatorului care a făcut ultima actualizare | - |
| CreateUserName | string? | Numele utilizatorului care a creat înregistrarea | - |
| UpdateUserName | string? | Numele utilizatorului care a făcut ultima actualizare | - |

## Utilizare

BaseEntity este moștenită de majoritatea entităților care necesită audit trail:
- FodRequest
- FodServiceProvider
- File
- FileContent
- Și multe altele

## Exemple de Utilizare

### Moștenire în Entități
```csharp
public class FodRequest : BaseEntity
{
    // Proprietățile specifice ale cererii
    public string RequestNumber { get; set; }
    // ...alte proprietăți
}
```

### Populare Automată a Câmpurilor de Audit
```csharp
// În DbContext sau Repository
public override async Task<int> SaveChangesAsync()
{
    var entries = ChangeTracker.Entries<BaseEntity>();
    var currentUserId = GetCurrentUserId();
    var currentUserName = GetCurrentUserName();
    var now = DateTime.UtcNow;

    foreach (var entry in entries)
    {
        if (entry.State == EntityState.Added)
        {
            entry.Entity.CreateDate = now;
            entry.Entity.CreateUserId = currentUserId;
            entry.Entity.CreateUserName = currentUserName;
        }
        else if (entry.State == EntityState.Modified)
        {
            entry.Entity.UpdateDate = now;
            entry.Entity.UpdateUserId = currentUserId;
            entry.Entity.UpdateUserName = currentUserName;
        }
    }

    return await base.SaveChangesAsync();
}
```

### Query cu Informații de Audit
```csharp
var recentlyModified = await context.FodRequests
    .Where(r => r.UpdateDate >= DateTime.UtcNow.AddDays(-7))
    .OrderByDescending(r => r.UpdateDate)
    .Select(r => new 
    {
        r.RequestNumber,
        r.UpdateDate,
        r.UpdateUserName
    })
    .ToListAsync();
```

### Interogare Istoricul Complet de Audit
```csharp
public async Task<AuditHistory> GetAuditHistoryAsync(Guid entityId)
{
    var entity = await context.FodRequests
        .AsNoTracking()
        .FirstOrDefaultAsync(r => r.Id == entityId);
        
    if (entity == null) return null;
    
    return new AuditHistory
    {
        EntityId = entity.Id,
        CreatedBy = $"{entity.CreateUserName} ({entity.CreateUserId})",
        CreatedOn = entity.CreateDate,
        LastModifiedBy = $"{entity.UpdateUserName} ({entity.UpdateUserId})",
        LastModifiedOn = entity.UpdateDate,
        // Pentru istoric complet, folosiți Audit.NET sau EF Core Audit
    };
}
```

### Gestiunea Erorilor în Audit
```csharp
public override async Task<int> SaveChangesAsync()
{
    try
    {
        var entries = ChangeTracker.Entries<BaseEntity>();
        var currentUserId = GetCurrentUserId();
        
        if (string.IsNullOrEmpty(currentUserId))
        {
            throw new SecurityException("Utilizator neautentificat nu poate efectua modificări");
        }
        
        // Populare audit fields...
        
        return await base.SaveChangesAsync();
    }
    catch (DbUpdateException ex)
    {
        _logger.LogError(ex, "Eroare la salvarea modificărilor cu audit trail");
        throw new DataException("Nu s-au putut salva modificările. Verificați jurnalul pentru detalii.", ex);
    }
}
```

## Note

1. **Audit Trail Automat**:
   - Toate entitățile care moștenesc BaseEntity beneficiază automat de audit trail
   - Câmpurile sunt populate automat la SaveChanges
   - Păstrează istoricul complet al modificărilor
   - Pentru istoric detaliat, considerați implementarea Audit.NET sau EF Core Audit

2. **Identificare Unică**:
   - Folosește GUID pentru a asigura unicitate globală
   - Evită conflicte în scenarii de sincronizare sau import/export
   - Facilitează integrarea cu sisteme externe

3. **Best Practices**:
   - Nu modificați manual câmpurile de audit
   - Folosiți interceptori EF Core pentru populare automată
   - Considerați timezone-ul pentru datele de audit (UTC recomandat)
   - Implementați soft delete pentru păstrarea istoricului complet

4. **Performanță**:
   - Indexați UpdateDate pentru query-uri pe modificări recente
   - Considerați arhivarea pentru entități cu multe modificări
   - Folosiți proiecții pentru a exclude câmpurile de audit când nu sunt necesare
   - Recomandări de indexare:
     ```sql
     CREATE INDEX IX_BaseEntity_UpdateDate ON [TableName] (UpdateDate DESC);
     CREATE INDEX IX_BaseEntity_CreateUserId ON [TableName] (CreateUserId);
     ```

5. **Securitate**:
   - Câmpurile de audit nu trebuie expuse în API-uri publice pentru modificare
   - Validați că UserId și UserName corespund utilizatorului autentificat
   - Păstrați audit trail pentru conformitate și securitate
   - Implementați row-level security bazat pe CreateUserId pentru date sensibile

6. **Conformitate și Reglementări**:
   - Audit trail-ul satisface cerințele Legii 133/2011 privind protecția datelor cu caracter personal
   - Suportă cerințele de trasabilitate pentru HG 128/2024 privind serviciile publice electronice
   - Permite raportarea conformă cu standardele de audit guvernamental

7. **Migrare și Evoluție**:
   - La adăugarea BaseEntity la entități existente, populați câmpurile retroactiv
   - Păstrați compatibilitatea cu sistemele legacy prin nullable fields
   - Documentați orice schimbări în politica de audit