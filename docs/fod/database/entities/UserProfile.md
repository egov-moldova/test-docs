# UserProfile

## Descriere

Reprezintă profilul unui utilizator în sistemul FOD. Această entitate stochează informațiile de bază ale utilizatorilor care pot fi responsabili pentru procesarea cererilor, administratori de sistem sau alți angajați ai instituțiilor guvernamentale care interacționează cu sistemul.

## Proprietăți

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| Id | Guid | Identificator unic al profilului | Primary Key |
| Idnp | string | IDNP-ul utilizatorului | Obligatoriu, 13 caractere |
| FirstName | string? | Prenumele utilizatorului | - |
| LastName | string? | Numele utilizatorului | - |

## Relații

### Relații One-to-Many (Copii)
- **UserProfileRoles** (`ICollection<FodUserProfileRole>`) - Rolurile atribuite utilizatorului în sistem

### Relații Inverse (unde este referențiat)
- **FodRequest.ResponsibleUser** - Cererile pentru care utilizatorul este responsabil
- **FodUserProfileOrganization** - Organizațiile asociate cu utilizatorul

## Exemple de Utilizare

### Creare Profil Utilizator
```csharp
var userProfile = new UserProfile
{
    Idnp = "2000000000001",
    FirstName = "Maria",
    LastName = "Ionescu"
};
```

### Atribuire Roluri
```csharp
// Adaugă rol de operator
userProfile.UserProfileRoles.Add(new FodUserProfileRole
{
    UserProfileId = userProfile.Id,
    RoleId = operatorRoleId,
    AssignedDate = DateTime.UtcNow
});

// Adaugă rol de supervizor
userProfile.UserProfileRoles.Add(new FodUserProfileRole
{
    UserProfileId = userProfile.Id,
    RoleId = supervisorRoleId,
    AssignedDate = DateTime.UtcNow
});
```

### Interogare Utilizatori cu Roluri
```csharp
var usersWithRoles = await context.UserProfiles
    .Include(u => u.UserProfileRoles)
        .ThenInclude(r => r.Role)
    .OrderBy(u => u.LastName)
    .ThenBy(u => u.FirstName)
    .ToListAsync();
```

### Găsire Utilizatori Responsabili
```csharp
// Utilizatori cu cereri active
var activeResponsibles = await context.FodRequests
    .Where(r => r.FodStatus == FodRequestStatus.InProgress)
    .Select(r => r.ResponsibleUser)
    .Distinct()
    .ToListAsync();
```

### Verificare Rol Specific
```csharp
var hasAdminRole = await context.UserProfiles
    .Where(u => u.Id == userId)
    .SelectMany(u => u.UserProfileRoles)
    .AnyAsync(r => r.Role.Code == "ADMIN");
```

## Note

1. **Identificare și Autentificare**:
   - IDNP-ul este identificatorul principal pentru matching cu sistemele externe
   - Autentificarea efectivă se face prin sisteme externe (MPass, etc.)
   - UserProfile stochează doar datele necesare pentru operare în FOD

2. **Gestiunea Rolurilor**:
   - Un utilizator poate avea multiple roluri simultan
   - Rolurile determină permisiunile și acțiunile disponibile
   - Verificarea rolurilor se face prin UserProfileRoles

3. **Relația cu Cereri**:
   - Utilizatorii pot fi responsabili pentru procesarea cererilor
   - ResponsibleUserId în FodRequest face legătura
   - Permite tracking-ul și distribuirea sarcinilor

4. **Considerații de Design**:
   - Entitate simplă, păstrează doar datele esențiale
   - Detalii adiționale pot fi obținute din sistemele externe
   - Optimizat pentru query-uri frecvente de verificare permisiuni

5. **Best Practices**:
   - Cache profilurile utilizatorilor activi pentru performanță
   - Include rolurile când încarci profilul pentru a evita lazy loading
   - Verifică întotdeauna existența rolului înainte de a permite acțiuni

6. **Securitate**:
   - IDNP-ul trebuie protejat ca date personale
   - Audit trail pentru schimbări de roluri
   - Verificare periodică a rolurilor active vs. necesare