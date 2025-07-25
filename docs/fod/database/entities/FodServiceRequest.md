# FodServiceRequest

## Descriere

Reprezintă o cerere individuală de serviciu în cadrul unei cereri principale (FodRequest). O cerere principală poate conține multiple cereri de servicii, fiecare reprezentând un serviciu specific solicitat de cetățean. Această entitate gestionează costurile, statusul și toate datele asociate cu prestarea unui serviciu individual.

## Proprietăți

### Identificare și Relații

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| Id | Guid | Identificator unic al cererii de serviciu | Primary Key |
| ServiceId | Guid | ID-ul serviciului solicitat | Foreign Key către FodService |
| RequestId | Guid? | ID-ul cererii principale | Foreign Key către FodRequest |
| Number | string? | Numărul unic al cererii de serviciu | Format specific serviciului |
| ServiceProviderNumber | string? | Numărul atribuit de furnizorul de servicii | - |
| ExternalBackofficeServiceRequestNumber | string? | Numărul din sistemul backoffice extern | - |

### Informații Serviciu

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| ServiceName | string? | Numele serviciului (copie locală pentru istoric) | - |
| Status | ServiceRequestStatus | Statusul cererii de serviciu | Enum: ServiceRequestStatus, Default: New |

### Costuri și Taxe

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| Cost | decimal | Costul serviciului | - |
| StateTax | decimal | Taxa de stat asociată | - |
| InitialCost | decimal | Costul inițial înainte de reduceri | Column: decimal(18,2) |
| FinalCost | decimal | Costul final după aplicarea reducerilor | Column: decimal(18,2) |
| HasDelayedPayment | bool | Indică dacă plata poate fi amânată | Default: false |
| HasDynamicFee | bool | Indică dacă taxa este dinamică | Default: false |

### Apostilare

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| ApostilationServiceRequestNumber | string? | Numărul cererii de apostilare | - |
| ApostilaStatus | FodServiceRequestStatus | Statusul apostilării | Enum: FodServiceRequestStatus |
| SentToApostillation | bool | Indică dacă a fost trimis la apostilare | Default: false |
| SentToApostillationDate | DateTime? | Data trimiterii la apostilare | - |

### Date Răspuns și Termene

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| ServiceRequestResponseDataId | Guid? | ID-ul datelor de răspuns principale | Foreign Key către FodServiceRequestResponseData |
| JsonResponseId | Guid? | ID-ul răspunsului JSON | Foreign Key către FodResponseJson |
| FodExecutionTermId | Guid? | ID-ul termenelor de execuție FOD | Foreign Key către FodExecutionTerm |
| RsspaExecutionTermsId | Guid? | ID-ul termenelor de execuție RSSPA | Foreign Key către RSSPAExecutionTerm |

## Relații

### Relații Many-to-One (Părinți)
- **Service** (`FodService`) - Serviciul solicitat prin ServiceId
- **Request** (`FodRequest`) - Cererea principală prin RequestId
- **ResponseData** (`FodServiceRequestResponseData`) - Datele de răspuns principale
- **JsonResponse** (`FodResponseJson`) - Răspunsul în format JSON
- **FodExecutionTerm** (`FodExecutionTerm`) - Termenii de execuție FOD
- **RsspaExecutionTerm** (`RSSPAExecutionTerm`) - Termenii de execuție RSSPA

### Relații One-to-Many (Copii)
- **ResponseDatas** (`ICollection<FodServiceRequestResponseData>`) - Toate datele de răspuns asociate
- **Discounts** (`ICollection<ServiceRequestDiscount>`) - Reducerile aplicate
- **Attachments** (`ICollection<FodServiceRequestFile>`) - Fișierele atașate
- **AdditionalDatas** (`ICollection<FodServiceRequestAdditionalData>`) - Date adiționale specifice serviciului

## Exemple de Utilizare

### Creare Cerere de Serviciu
```csharp
var serviceRequest = new FodServiceRequest
{
    ServiceId = serviceId,
    RequestId = fodRequestId,
    ServiceName = "Certificat de naștere",
    Cost = 100.00m,
    StateTax = 20.00m,
    InitialCost = 120.00m,
    FinalCost = 120.00m,
    Status = ServiceRequestStatus.New
};
```

### Aplicare Reduceri
```csharp
// Calculează costul final după reduceri
var totalDiscount = serviceRequest.Discounts.Sum(d => d.Amount);
serviceRequest.FinalCost = serviceRequest.InitialCost - totalDiscount;
```

### Interogare Cereri cu Date Adiționale
```csharp
var serviceRequests = await context.FodServiceRequests
    .Include(sr => sr.Service)
    .Include(sr => sr.AdditionalDatas)
        .ThenInclude(ad => ad.AdditionalData)
    .Include(sr => sr.Discounts)
    .Where(sr => sr.RequestId == requestId)
    .ToListAsync();
```

### Verificare Status Apostilare
```csharp
var apostilationPending = await context.FodServiceRequests
    .Where(sr => sr.SentToApostillation && 
                 sr.ApostilaStatus != FodServiceRequestStatus.Completed)
    .ToListAsync();
```

## Note

1. **Fluxul de Status**:
   - New → InProgress → WaitingPayment → Paid → Processing → Completed/Rejected
   - Pentru apostilare: se folosește ApostilaStatus separat

2. **Calculul Costurilor**:
   - InitialCost = Cost + StateTax
   - FinalCost = InitialCost - Sum(Discounts)
   - HasDynamicFee indică dacă costul poate varia în funcție de date adiționale

3. **Considerații de Design**:
   - ServiceName este stocat local pentru a păstra istoricul chiar dacă serviciul se modifică
   - Poate exista fără RequestId pentru cereri create în backoffice
   - ResponseDatas permite multiple răspunsuri (versiuni, actualizări)

4. **Performanță**:
   - Pentru liste mari de cereri, folosește paginare
   - Include selectiv relațiile necesare
   - Pentru raportare, consideră indexuri pe Status și ServiceId

5. **Integrare cu Sisteme Externe**:
   - ExternalBackofficeServiceRequestNumber pentru sincronizare cu sisteme legacy
   - ServiceProviderNumber pentru tracking la furnizori externi
   - ApostilationServiceRequestNumber pentru sistemul de apostilare