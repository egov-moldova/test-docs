# FodRequest

## Descriere

Entitatea principală care reprezintă o cerere depusă în sistemul Front Office Digital. Această entitate conține toate informațiile despre solicitant, tipul cererii, statusul procesării și legăturile către serviciile solicitate.

### Context de Business

- **Punct Central de Interacțiune**: Reprezintă cererea cetățeanului pentru servicii publice electronice
- **Conformitate Legală**: Implementează cerințele HG 128/2024 privind prestarea serviciilor publice prin intermediul Portalului Serviciilor Publice
- **Integrare Multi-Sistem**: Asigură conexiunea între cetățean, instituțiile publice și sistemele de plată/livrare
- **Trasabilitate Completă**: Oferă istoric complet al interacțiunilor pentru audit și analiză

## Proprietăți

### Identificare și Tipologie

| Proprietate | Tip | Descriere | Constrângeri | Validări |
| Id | Guid | Identificator unic al cererii | Primary Key, moștenit din BaseEntity | - |
| FodRequestTypeId | Guid | ID-ul tipului de cerere | Foreign Key către FodRequestType | Obligatoriu |
| RequestNumber | string? | Numărul unic al cererii generat de sistem | Format: FOD-YYYY-NNNNNN | Generat automat, unic |
| ServiceProviderNumber | string? | Numărul cererii primit de la furnizorul de servicii | - | Max 50 caractere |

### Date Solicitant

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| RequestorType | PersonType | Tipul solicitantului (fizic/juridic) | Enum: PersonType |
| RequestorFirstName | string | Prenumele solicitantului | Obligatoriu |
| RequestorLastName | string | Numele solicitantului | Obligatoriu |
| RequestorCompanyName | string? | Denumirea companiei (pentru persoane juridice) | - |
| RequestorIdnp | string | IDNP-ul solicitantului | Obligatoriu, 13 caractere | Validare algoritm IDNP |
| RequestorIdno | string? | IDNO pentru persoane juridice | - |
| RequestorRole | string? | Rolul solicitantului în cadrul organizației | - |
| RequestorEmail | string? | Email-ul solicitantului | Format email valid | Regex: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$ |
| RequestorPhone | string? | Telefonul solicitantului | - |
| RequestorBirthDate | DateTime? | Data nașterii solicitantului | - |
| RequestorResidence | string? | Reședința solicitantului | - |
| NonRezidentDocumentNumber | string? | Numărul documentului pentru nerezidenți | - |
| RequestorIsAuthenticated | bool | Indică dacă solicitantul s-a autentificat | Default: false |

### Autorizare MPower

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| RequestorMPowerAuthorization | string? | Codul de autorizare MPower | - |
| MPowerAuthorizationCode | string? | Codul de autorizare MPower | - |
| MPowerAuthorizingPartyName | string? | Numele părții care autorizează | - |
| MPowerAuthorizingIdn | string? | IDNP-ul părții care autorizează | - |
| MPowerFullName | string? | Numele complet din MPower | - |
| AuthorizingPartyType | int? | Tipul părții care autorizează | - |
| OnBehalfOn | OnBehalfOnEnum | În numele cui se depune cererea | Enum: OnBehalfOnEnum |

### CUPS (Centrul Unic de Prestare a Serviciilor)

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| IsCups | bool | Indică dacă cererea este depusă prin CUPS | Default: false |
| CupsIdn | string? | IDNP-ul reprezentantului CUPS | - |
| CupsFirstName | string? | Prenumele reprezentantului CUPS | - |
| CupsLastName | string? | Numele reprezentantului CUPS | - |
| CupsMPowerNumber | string? | Numărul MPower al reprezentantului CUPS | - |

### Status și Procesare

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| Status | RequestStatus | Status-ul vechi al cererii | Obsolete, folosește FodStatus |
| FodStatus | FodRequestStatus? | Status-ul actual al cererii | Enum: FodRequestStatus |
| SubmissionDate | DateTime? | Data depunerii cererii | - |
| ProcessingDate | DateTime? | Data procesării cererii | - |
| EstimatedResolveDate | DateTime? | Data estimată de rezolvare pentru serviciile primare | - |
| FinalEstimatedResolveDate | DateTime? | Data finală estimată inclusiv apostilare/livrare | - |
| IsFromBackOffice | bool | Indică dacă cererea vine din back-office | Default: false |

### Plăți

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| PaidStatus | PaymentStatus | Status-ul plății | Enum: PaymentStatus |
| PaymentDate | DateTime? | Data efectuării plății | - |
| PaymentConfirmDate | DateTime? | Data confirmării plății | - |
| PaymentInvoiceId | string? | ID-ul facturii de plată | - |
| PaymentMethod | string? | Metoda de plată utilizată | - |
| Cost | decimal? | Costul total al cererii | - |
| MPayServiceId | string? | ID-ul serviciului MPay | - |
| MPayNumber | string? | Numărul tranzacției MPay | - |

### Livrare și Ridicare

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| RequiresDelivery | bool | Indică dacă necesită livrare | Default: false |
| DeliveryId | Guid? | ID-ul detaliilor de livrare | Foreign Key către ServiceRequestDelivery |
| FodPickupLocationId | string? | ID-ul locației de ridicare | - |
| FodPickupLocationName | string? | Numele locației de ridicare | - |
| FodPickupLocationAdress | string? | Adresa locației de ridicare | - |

### Apostilare și Documente

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| RequiresApostilation | bool | Indică dacă necesită apostilare | Default: false |
| ApostilationDetailsId | Guid? | ID-ul detaliilor de apostilare | Foreign Key către FodApostilationDetails |
| RequiresResponseOnPaper | bool | Indică dacă răspunsul este solicitat pe hârtie | Default: false |
| RequestSignableDocumentId | Guid? | ID-ul documentului semnabil al cererii | Foreign Key către SignableDocument |

### Alte Proprietăți

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| JsonId | Guid? | ID-ul datelor JSON asociate | Foreign Key către FodRequestJson |
| ExecutionTermsId | Guid? | ID-ul termenilor de execuție | Foreign Key către FodExecutionTerm |
| ResponsibleUserId | Guid? | ID-ul utilizatorului responsabil | Foreign Key către UserProfile |
| FodResponsibleDivision | string? | Divizia responsabilă | - |
| TermsAndConditionsAccepted | bool | Acceptarea termenilor și condițiilor | Default: false |
| RetireeWithAnAgeLimit | bool | Indică dacă solicitantul este pensionar cu limită de vârstă | Default: false |
| PersonWithDisability | bool | Indică dacă solicitantul are dizabilități | Default: false |
| RequestorStatuteId | Guid? | ID-ul statutului solicitantului | Foreign Key către FodRequestorStatute |
| PictureId | Guid? | ID-ul pozei asociate | Foreign Key către FodPictures |
| ReasonCancel | ReasonCancelEnum? | Motivul anulării cererii | Enum: ReasonCancelEnum |

## Relații

### Relații One-to-Many (Copii)
- **FodServiceRequests** (`IList<FodServiceRequest>`) - Lista cererilor de servicii asociate acestei cereri principale
- **FodAdditionalInvoices** (`IList<FodAdditionalInvoice>`) - Facturile adiționale asociate cererii
- **AdditionalRequests** (`ICollection<FodAdditionalRequest>`) - Cererile adiționale asociate
- **Attachments** (`ICollection<FodRequestFile>`) - Fișierele atașate la cerere

### Relații Many-to-One (Părinți)
- **Type** (`FodRequestType`) - Tipul cererii prin FodRequestTypeId
- **Delivery** (`ServiceRequestDelivery`) - Detaliile de livrare prin DeliveryId
- **ResponsibleUser** (`UserProfile`) - Utilizatorul responsabil prin ResponsibleUserId
- **RequestSignableDocument** (`SignableDocument`) - Documentul semnabil al cererii
- **Json** (`FodRequestJson`) - Datele JSON asociate prin JsonId
- **ApostilationDetails** (`FodApostilationDetails`) - Detaliile de apostilare
- **ExecutionTerms** (`FodExecutionTerm`) - Termenii de execuție
- **RequestorStatute** (`FodRequestorStatute`) - Statutul solicitantului
- **Picture** (`FodPictures`) - Poza asociată

## Exemple de Utilizare

### Creare Cerere Nouă
```csharp
var fodRequest = new FodRequest
{
    FodRequestTypeId = requestTypeId,
    RequestorType = PersonType.Physical,
    RequestorFirstName = "Ion",
    RequestorLastName = "Popescu",
    RequestorIdnp = "2000000000001",
    RequestorEmail = "ion.popescu@email.md",
    FodStatus = FodRequestStatus.Draft,
    SubmissionDate = DateTime.UtcNow,
    TermsAndConditionsAccepted = true
};
```

### Interogare Cereri cu Servicii
```csharp
var requestsWithServices = await context.FodRequests
    .Include(r => r.FodServiceRequests)
        .ThenInclude(sr => sr.Service)
    .Include(r => r.Type)
    .Where(r => r.FodStatus == FodRequestStatus.InProgress)
    .ToListAsync();
```

### Verificare Status Plată
```csharp
var paidRequests = await context.FodRequests
    .Where(r => r.PaidStatus == PaymentStatus.Paid)
    .OrderByDescending(r => r.PaymentDate)
    .ToListAsync();
```

### Procesare Cereri CUPS
```csharp
public async Task<FodRequest> CreateCupsRequestAsync(CupsRequestDto dto)
{
    var request = new FodRequest
    {
        // Date solicitant
        RequestorType = dto.RequestorType,
        RequestorFirstName = dto.RequestorFirstName,
        RequestorLastName = dto.RequestorLastName,
        RequestorIdnp = dto.RequestorIdnp,
        
        // Marcare ca cerere CUPS
        IsCups = true,
        CupsIdn = dto.CupsRepresentativeIdnp,
        CupsFirstName = dto.CupsRepresentativeFirstName,
        CupsLastName = dto.CupsRepresentativeLastName,
        CupsMPowerNumber = dto.CupsMPowerNumber,
        
        // Autorizare MPower pentru reprezentant
        MPowerAuthorizationCode = dto.MPowerAuthCode,
        OnBehalfOn = OnBehalfOnEnum.Individual,
        
        FodStatus = FodRequestStatus.Submitted,
        SubmissionDate = DateTime.UtcNow
    };
    
    context.FodRequests.Add(request);
    await context.SaveChangesAsync();
    
    // Generare număr cerere
    request.RequestNumber = $"FOD-{DateTime.Now.Year}-{request.Id.ToString("N").Substring(0, 6).ToUpper()}";
    await context.SaveChangesAsync();
    
    return request;
}
```

### Calcul Termen Final cu Apostilare și Livrare
```csharp
public async Task UpdateFinalEstimatedDateAsync(Guid requestId)
{
    var request = await context.FodRequests
        .Include(r => r.FodServiceRequests)
            .ThenInclude(sr => sr.Service)
        .Include(r => r.ExecutionTerms)
        .FirstOrDefaultAsync(r => r.Id == requestId);
        
    if (request == null) return;
    
    // Calcul termen maxim servicii
    var maxServiceDays = request.FodServiceRequests
        .Max(sr => sr.Service.ExecutionDays ?? 0);
        
    // Adăugare zile pentru apostilare
    if (request.RequiresApostilation)
        maxServiceDays += 5; // 5 zile lucrătoare pentru apostilare
        
    // Adăugare zile pentru livrare
    if (request.RequiresDelivery)
        maxServiceDays += 3; // 3 zile lucrătoare pentru livrare
        
    // Calcul dată finală (exclus weekenduri)
    request.FinalEstimatedResolveDate = CalculateWorkingDays(
        request.SubmissionDate ?? DateTime.Now, 
        maxServiceDays);
        
    await context.SaveChangesAsync();
}

private DateTime CalculateWorkingDays(DateTime startDate, int workingDays)
{
    var date = startDate;
    while (workingDays > 0)
    {
        date = date.AddDays(1);
        if (date.DayOfWeek != DayOfWeek.Saturday && 
            date.DayOfWeek != DayOfWeek.Sunday)
        {
            workingDays--;
        }
    }
    return date;
}
```

## Note

1. **Validări Importante**:
   - IDNP-ul trebuie să fie valid (13 caractere cu validare algoritm)
   - Email-ul trebuie să aibă format valid
   - RequestorFirstName și RequestorLastName sunt obligatorii
   - Pentru persoane juridice, RequestorCompanyName devine obligatoriu
   - Validare IDNP:
     ```csharp
     public static bool ValidateIdnp(string idnp)
     {
         if (string.IsNullOrEmpty(idnp) || idnp.Length != 13)
             return false;
             
         // Algoritm de validare IDNP Moldova
         int[] weights = {7, 3, 1, 7, 3, 1, 7, 3, 1, 7, 3, 1};
         int sum = 0;
         
         for (int i = 0; i < 12; i++)
         {
             if (!char.IsDigit(idnp[i])) return false;
             sum += (idnp[i] - '0') * weights[i];
         }
         
         int checkDigit = (sum % 10 == 0) ? 0 : 10 - (sum % 10);
         return checkDigit == (idnp[12] - '0');
     }
     ```

2. **Fluxul de Status**:
   - Draft → Submitted → InProgress → Completed/Rejected/Cancelled
   - Statusul vechi (RequestStatus) este deprecat, folosește FodStatus
   - Diagrama de tranziție:
     ```
     Draft ----[Submit]----> Submitted
       |                          |
       +------[Cancel]-----+      v
                           |   InProgress
                           |      |
                           v      +---[Complete]---> Completed
                        Cancelled |                      |
                                  +---[Reject]-----> Rejected
     ```

3. **Considerații de Performanță**:
   - Pentru listări mari, folosește paginare
   - Include doar relațiile necesare pentru a evita over-fetching
   - Pentru rapoarte, consideră folosirea de view-uri sau stored procedures
   - Indexare recomandată:
     ```sql
     CREATE INDEX IX_FodRequest_FodStatus ON FodRequests (FodStatus);
     CREATE INDEX IX_FodRequest_SubmissionDate ON FodRequests (SubmissionDate DESC);
     CREATE INDEX IX_FodRequest_RequestorIdnp ON FodRequests (RequestorIdnp);
     CREATE INDEX IX_FodRequest_RequestNumber ON FodRequests (RequestNumber);
     ```

4. **Securitate**:
   - Datele personale (IDNP, email, telefon) trebuie protejate
   - Implementează audit trail pentru modificări
   - Verifică permisiunile înainte de a permite modificări
   - Criptează datele sensibile în repaus

5. **Integrare cu Sisteme Externe**:
   - **MPower**: Autentificare și autorizare pentru acțiuni în numele altcuiva
   - **MPay**: Procesare plăți electronice guvernamentale
   - **MDelivery**: Livrare documente prin Poșta Moldovei
   - **RSSP**: Sincronizare cu Registrul de Stat al Serviciilor Publice

6. **Enum-uri Utilizate**:
   ```csharp
   public enum PersonType 
   {
       Physical = 1,
       Juridical = 2
   }
   
   public enum FodRequestStatus
   {
       Draft = 1,
       Submitted = 2,
       InProgress = 3,
       Completed = 4,
       Rejected = 5,
       Cancelled = 6
   }
   
   public enum PaymentStatus
   {
       NotRequired = 0,
       Pending = 1,
       Paid = 2,
       Failed = 3
   }
   
   public enum OnBehalfOnEnum
   {
       Self = 1,
       Individual = 2,
       Company = 3
   }
   
   public enum ReasonCancelEnum
   {
       UserRequest = 1,
       PaymentTimeout = 2,
       DocumentsIncomplete = 3,
       SystemError = 4
   }
   ```

7. **Gestiunea Erorilor**:
   ```csharp
   public class FodRequestValidator
   {
       public ValidationResult Validate(FodRequest request)
       {
           var errors = new List<string>();
           
           if (!ValidateIdnp(request.RequestorIdnp))
               errors.Add("IDNP invalid");
               
           if (!string.IsNullOrEmpty(request.RequestorEmail) && 
               !Regex.IsMatch(request.RequestorEmail, @"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"))
               errors.Add("Format email invalid");
               
           if (request.RequestorType == PersonType.Juridical && 
               string.IsNullOrEmpty(request.RequestorCompanyName))
               errors.Add("Denumirea companiei este obligatorie pentru persoane juridice");
               
           return new ValidationResult { IsValid = errors.Count == 0, Errors = errors };
       }
   }
   ```

8. **Migrare și Evoluție**:
   - Câmpul `Status` este deprecat, utilizați `FodStatus`
   - La migrări, asigurați maparea corectă între vechile și noile valori de status
   - Păstrați compatibilitatea cu sistemele legacy prin API versioning


