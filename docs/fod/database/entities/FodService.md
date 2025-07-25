# FodService

## Descriere

Reprezintă un serviciu disponibil în sistemul FOD care poate fi solicitat de cetățeni. Această entitate definește caracteristicile serviciului, cerințele de autentificare, tipurile de documente necesare și configurările specifice pentru procesarea cererilor.

## Proprietăți

### Identificare și Informații de Bază

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| Id | Guid | Identificator unic al serviciului | Primary Key |
| Code | string | Codul unic al serviciului în sistemul FOD | Obligatoriu, Unic |
| Name | string | Denumirea serviciului | Obligatoriu |
| RsspaCode | string | Codul serviciului în Registrul de Stat al Serviciilor Publice Administrative | Obligatoriu |
| Enabled | bool | Indică dacă serviciul este activ și disponibil | Default: true |

### Configurare Comportament

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| AllowMultipleSelection | bool | Permite selectarea multiplă a acestui serviciu într-o cerere | Default: false |
| RequiresResponseDataFile | bool | Indică dacă răspunsul necesită un fișier atașat | Default: false |
| RequiresResponseDataFileSignature | bool | Indică dacă fișierul de răspuns necesită semnătură | Default: false |

### Autentificare și Autorizare

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| PersonType | RequestPersonType? | Tipul de persoană care poate solicita serviciul | Enum: RequestPersonType |
| AuthentificationStatus | AuthentificationStatus? | Nivelul de autentificare necesar | Enum: AuthentificationStatus |
| MPowerAuthorizationTypeCode | string? | Codul tipului de autorizare MPower necesar | - |
| MPowerAuthorizationTypeCustomFieldCode | string? | Codul câmpului personalizat pentru autorizare MPower | - |

## Relații

### Relații One-to-Many (Copii)
- **RequestTypes** (`ICollection<FodRequestTypeService>`) - Tipurile de cereri care pot include acest serviciu
- **ExecutionTerms** (`ICollection<FodExecutionTerm>`) - Termenii de execuție definiți pentru serviciu
- **DocumentTypes** (`ICollection<FodServiceDocumentType>`) - Tipurile de documente necesare pentru serviciu
- **AdditionalDatas** (`ICollection<FodServiceAdditionalData>`) - Datele adiționale specifice serviciului

## Exemple de Utilizare

### Definire Serviciu Nou
```csharp
var service = new FodService
{
    Code = "CERT_NASTERE",
    Name = "Certificat de naștere",
    RsspaCode = "RS001",
    Enabled = true,
    PersonType = RequestPersonType.Both,
    AuthentificationStatus = AuthentificationStatus.Required,
    RequiresResponseDataFile = true,
    RequiresResponseDataFileSignature = true
};
```

### Configurare Documente Necesare
```csharp
// Adaugă tipuri de documente necesare
service.DocumentTypes.Add(new FodServiceDocumentType
{
    ServiceId = service.Id,
    DocumentTypeId = buletinTypeId,
    IsMandatory = true,
    MaxFiles = 1
});
```

### Interogare Servicii Active cu Documente
```csharp
var activeServices = await context.FodServices
    .Include(s => s.DocumentTypes)
        .ThenInclude(dt => dt.DocumentType)
    .Include(s => s.AdditionalDatas)
    .Where(s => s.Enabled)
    .OrderBy(s => s.Name)
    .ToListAsync();
```

### Verificare Servicii care Necesită Autentificare
```csharp
var authenticatedServices = await context.FodServices
    .Where(s => s.AuthentificationStatus == AuthentificationStatus.Required)
    .Select(s => new { s.Code, s.Name, s.MPowerAuthorizationTypeCode })
    .ToListAsync();
```

### Servicii cu Selecție Multiplă
```csharp
var multiSelectServices = await context.FodServices
    .Where(s => s.AllowMultipleSelection && s.Enabled)
    .ToListAsync();
```

## Note

1. **Coduri și Identificare**:
   - `Code` este folosit intern în sistemul FOD
   - `RsspaCode` asigură compatibilitatea cu Registrul de Stat
   - Ambele coduri trebuie să fie unice

2. **Autentificare și Autorizare**:
   - `AuthentificationStatus` determină dacă utilizatorul trebuie să fie autentificat
   - `PersonType` restricționează cine poate solicita serviciul (fizic/juridic/ambele)
   - MPower fields permit delegarea autorizării

3. **Configurări Importante**:
   - `AllowMultipleSelection` = true permite solicitarea aceluiași serviciu de mai multe ori într-o cerere
   - `RequiresResponseDataFile` indică necesitatea unui document oficial ca răspuns
   - `RequiresResponseDataFileSignature` adaugă cerința de semnătură digitală

4. **Relații cu Alte Entități**:
   - Un serviciu poate fi inclus în multiple tipuri de cereri (FodRequestType)
   - Fiecare serviciu poate avea termene de execuție diferite
   - Documentele necesare sunt configurabile per serviciu

5. **Best Practices**:
   - Verificați întotdeauna `Enabled` înainte de a permite selectarea
   - Includeți relațiile necesare pentru a evita query-uri multiple
   - Folosiți proiecții pentru liste în UI pentru performanță optimă

6. **Validări Recomandate**:
   - Code și RsspaCode trebuie să fie unice
   - Dacă RequiresResponseDataFileSignature = true, atunci RequiresResponseDataFile trebuie să fie true
   - PersonType și AuthentificationStatus trebuie verificate la crearea cererii