# FodServiceProvider

## Descriere

Reprezintă furnizorii de servicii publice - instituțiile guvernamentale care procesează și oferă serviciile solicitate prin sistemul FOD. Aceștia pot fi ministere, agenții, primării sau alte instituții publice care prestează servicii pentru cetățeni.

## Proprietăți

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| Id | Guid | Identificator unic al furnizorului | Primary Key, moștenit din BaseEntity |
| Idno | string? | Codul fiscal (IDNO) al instituției | Unic când specificat |
| Name | string? | Denumirea oficială a instituției | - |
| Enabled | bool | Indică dacă furnizorul este activ în sistem | Default: true |
| BankAccount | string? | Contul bancar pentru încasarea plăților | Format IBAN |
| BankCode | string? | Codul băncii | - |
| Phone | string? | Număr de telefon de contact | - |
| Email | string? | Adresa de email oficială | Format email valid |
| CreateDate | DateTime? | Data înregistrării în sistem | Moștenit din BaseEntity |
| UpdateDate | DateTime? | Data ultimei actualizări | Moștenit din BaseEntity |
| CreateUserId | string? | ID-ul utilizatorului care a înregistrat | Moștenit din BaseEntity |
| UpdateUserId | string? | ID-ul utilizatorului care a actualizat | Moștenit din BaseEntity |
| CreateUserName | string? | Numele utilizatorului care a înregistrat | Moștenit din BaseEntity |
| UpdateUserName | string? | Numele utilizatorului care a actualizat | Moștenit din BaseEntity |

## Relații

### Relații Inverse (unde este referențiat)
- **FodRequestType** - Tipurile de cereri asociate cu acest furnizor
- **WorkingProgram** - Programul de lucru al furnizorului
- **ExceptionWorkingProgram** - Excepțiile de la programul normal

## Exemple de Utilizare

### Înregistrare Furnizor Nou
```csharp
var serviceProvider = new FodServiceProvider
{
    Idno = "1003600000000",
    Name = "Agenția Servicii Publice",
    Enabled = true,
    BankAccount = "MD00XX000000000000000000",
    BankCode = "AGRNMD2X",
    Phone = "+373 22 123456",
    Email = "contact@asp.gov.md"
};

context.FodServiceProviders.Add(serviceProvider);
await context.SaveChangesAsync();
```

### Asociere cu Tip de Cerere
```csharp
var requestType = new FodRequestType
{
    Name = "Eliberare acte de identitate",
    Code = "ACTE_IDENTITATE",
    ServiceProviderId = serviceProvider.Id,
    IsEnabled = true
};

context.FodRequestTypes.Add(requestType);
await context.SaveChangesAsync();
```

### Listare Furnizori Activi
```csharp
var activeProviders = await context.FodServiceProviders
    .Where(sp => sp.Enabled)
    .OrderBy(sp => sp.Name)
    .Select(sp => new
    {
        sp.Id,
        sp.Name,
        sp.Email,
        sp.Phone,
        RequestTypesCount = context.FodRequestTypes
            .Count(rt => rt.ServiceProviderId == sp.Id && rt.IsEnabled)
    })
    .ToListAsync();
```

### Configurare Program de Lucru
```csharp
// Program standard luni-vineri
for (int day = 1; day <= 5; day++)
{
    context.WorkingPrograms.Add(new WorkingProgram
    {
        ServiceProviderId = serviceProvider.Id,
        DayOfWeek = day,
        StartTime = new TimeSpan(8, 0, 0),
        EndTime = new TimeSpan(17, 0, 0),
        IsWorkingDay = true
    });
}

// Weekend - închis
for (int day = 6; day <= 7; day++)
{
    context.WorkingPrograms.Add(new WorkingProgram
    {
        ServiceProviderId = serviceProvider.Id,
        DayOfWeek = day,
        IsWorkingDay = false
    });
}
```

### Raport Plăți per Furnizor
```csharp
var paymentReport = await context.FodRequests
    .Include(r => r.Type)
    .Where(r => r.Type.ServiceProviderId == providerId && 
                r.PaidStatus == PaymentStatus.Paid)
    .GroupBy(r => new { r.PaymentDate.Value.Year, r.PaymentDate.Value.Month })
    .Select(g => new
    {
        Year = g.Key.Year,
        Month = g.Key.Month,
        TotalAmount = g.Sum(r => r.Cost ?? 0),
        RequestCount = g.Count()
    })
    .OrderByDescending(r => r.Year)
    .ThenByDescending(r => r.Month)
    .ToListAsync();
```

## Note

1. **Identificare și Validare**:
   - IDNO este codul fiscal unic al instituției
   - Verificați validitatea IDNO conform standardelor naționale
   - Numele trebuie să corespundă cu denumirea oficială din registre

2. **Informații Bancare**:
   - BankAccount trebuie să fie un IBAN valid
   - Folosit pentru virarea taxelor colectate
   - Actualizați periodic pentru a evita erori de plată

3. **Status și Disponibilitate**:
   - Enabled = false dezactivează toate serviciile furnizorului
   - Verificați impactul înainte de dezactivare
   - Păstrați istoric pentru audit

4. **Integrare cu Servicii**:
   - Un furnizor poate oferi multiple tipuri de cereri
   - Fiecare tip de cerere are un singur furnizor
   - Serviciile sunt configurate separat per tip de cerere

5. **Program de Lucru**:
   - Gestionat prin entitățile WorkingProgram și ExceptionWorkingProgram
   - Afectează disponibilitatea serviciilor online
   - Important pentru calculul termenelor de procesare

6. **Best Practices**:
   - Mențineți datele de contact actualizate
   - Implementați notificări pentru schimbări importante
   - Verificați periodic furnizorii inactivi
   - Arhivați în loc să ștergeți pentru păstrarea istoricului