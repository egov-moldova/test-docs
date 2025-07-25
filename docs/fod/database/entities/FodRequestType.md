# FodRequestType

## Descriere

Definește tipurile de cereri disponibile în sistemul FOD cu toate configurările și regulile specifice. Fiecare tip de cerere reprezintă o categorie de servicii (ex: acte de identitate, certificate, autorizații) cu setări proprii privind autentificarea, documentele necesare și modul de procesare.

## Proprietăți

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| Id | Guid | Identificator unic al tipului de cerere | Primary Key |
| Name | string | Denumirea tipului de cerere | Obligatoriu |
| Code | string | Codul unic al tipului de cerere | Obligatoriu, Unic |
| MPayCode | string? | Codul pentru integrare cu sistemul MPay | - |
| HideOnInitialPage | bool | Ascunde acest tip pe pagina inițială | Default: false |
| IsEnabled | bool | Indică dacă tipul este activ | Default: true |
| AllowMultipleServices | bool | Permite selectarea mai multor servicii | Default: false |
| PersonType | RequestPersonType? | Tipul de persoane care pot depune (fizic/juridic) | Enum: RequestPersonType |
| AuthentificationStatus | AuthentificationStatus? | Nivelul de autentificare necesar | Enum: AuthentificationStatus |
| AvailableMPowerAuthorization | bool | Disponibilitate autorizare MPower | Default: false |
| MPowerAuthorizationCodes | string[]? | Codurile de autorizare MPower permise | Array JSON |
| ServiceProviderId | Guid? | ID-ul furnizorului de servicii | Foreign Key către FodServiceProvider |
| AllowsElectronicDocument | bool | Permite documente electronice | Default: true |
| AllowsResponseOnPaper | bool | Permite răspuns pe hârtie | Default: false |
| AllowsDelivery | bool | Permite livrare la domiciliu | Default: false |
| AllowsPickup | bool | Permite ridicare de la ghișeu | Default: true |
| SaveBirthDate | bool | Salvează data nașterii solicitantului | Default: false |
| SaveResidence | bool | Salvează reședința solicitantului | Default: false |
| SaveLastPhoto | bool | Salvează ultima fotografie | Default: false |
| RequestTypePhone | string? | Telefon de contact specific tipului | - |
| RequestTypeEmail | string? | Email de contact specific tipului | - |
| RequestorPhoneRequired | bool | Telefon solicitant obligatoriu | Default: false |
| RequestorEmailRequired | bool | Email solicitant obligatoriu | Default: false |
| InformativeMessage | string? | Mesaj informativ pentru utilizatori | - |
| ReceptionModeType | ReceptionModeType | Modul de recepționare a răspunsului | Enum: ReceptionModeType |
| ReceptionModeStaticMessage | string? | Mesaj static pentru modul de recepționare | - |
| ShowRequestingAsType | bool | Afișează opțiunea "În numele cui" | Default: false |

## Relații

### Relații Many-to-One (Părinți)
- **ServiceProvider** (`FodServiceProvider`) - Furnizorul care procesează acest tip de cereri

### Relații One-to-Many (Copii)
- **Services** (`ICollection<FodRequestTypeService>`) - Serviciile disponibile pentru acest tip
- **TermsAndConditions** (`IList<FodTermsAndCondition>`) - Termenii și condițiile asociate
- **RequestorStatute** (`ICollection<FodRequestorStatute>`) - Statuturile speciale ale solicitanților
- **NotificationTypes** (`ICollection<FodNotificationType>`) - Tipurile de notificări configurate

## Exemple de Utilizare

### Creare Tip de Cerere Nou
```csharp
var requestType = new FodRequestType
{
    Name = "Eliberare certificate de stare civilă",
    Code = "CERT_STARE_CIVILA",
    MPayCode = "CSC001",
    ServiceProviderId = aspServiceProviderId,
    IsEnabled = true,
    AllowMultipleServices = true,
    PersonType = RequestPersonType.Physical,
    AuthentificationStatus = AuthentificationStatus.Required,
    AllowsElectronicDocument = true,
    AllowsDelivery = true,
    AllowsPickup = true,
    RequestorEmailRequired = true,
    InformativeMessage = "Certificatele se eliberează în termen de 3 zile lucrătoare"
};

context.FodRequestTypes.Add(requestType);
await context.SaveChangesAsync();
```

### Configurare Servicii pentru Tip
```csharp
// Adaugă servicii disponibile
var services = new List<FodRequestTypeService>
{
    new FodRequestTypeService 
    { 
        RequestTypeId = requestType.Id, 
        ServiceId = certificatNastereId 
    },
    new FodRequestTypeService 
    { 
        RequestTypeId = requestType.Id, 
        ServiceId = certificatCasatorieId 
    },
    new FodRequestTypeService 
    { 
        RequestTypeId = requestType.Id, 
        ServiceId = certificatDecesId 
    }
};

context.FodRequestTypeServices.AddRange(services);
await context.SaveChangesAsync();
```

### Listare Tipuri Active cu Servicii
```csharp
var activeTypes = await context.FodRequestTypes
    .Include(rt => rt.Services)
        .ThenInclude(rts => rts.Service)
    .Include(rt => rt.ServiceProvider)
    .Where(rt => rt.IsEnabled && !rt.HideOnInitialPage)
    .Select(rt => new
    {
        rt.Id,
        rt.Name,
        rt.Code,
        Provider = rt.ServiceProvider.Name,
        ServiceCount = rt.Services.Count(s => s.Service.Enabled),
        RequiresAuth = rt.AuthentificationStatus == AuthentificationStatus.Required
    })
    .OrderBy(rt => rt.Name)
    .ToListAsync();
```

### Verificare Permisiuni pentru Tip
```csharp
public bool CanUserAccessRequestType(FodRequestType requestType, UserContext user)
{
    // Verifică tipul de persoană
    if (requestType.PersonType.HasValue)
    {
        if (requestType.PersonType == RequestPersonType.Physical && user.IsCompany)
            return false;
        if (requestType.PersonType == RequestPersonType.Juridical && !user.IsCompany)
            return false;
    }
    
    // Verifică autentificarea
    if (requestType.AuthentificationStatus == AuthentificationStatus.Required && !user.IsAuthenticated)
        return false;
    
    // Verifică MPower dacă este necesar
    if (requestType.AvailableMPowerAuthorization && 
        requestType.MPowerAuthorizationCodes?.Any() == true)
    {
        return user.MPowerCodes.Any(code => 
            requestType.MPowerAuthorizationCodes.Contains(code));
    }
    
    return true;
}
```

### Adăugare Termeni și Condiții
```csharp
var termsAndConditions = new FodTermsAndCondition
{
    RequestTypeId = requestType.Id,
    Version = "1.0",
    Content = "Termenii și condițiile pentru serviciul...",
    EffectiveDate = DateTime.UtcNow,
    IsActive = true
};

context.FodTermsAndConditions.Add(termsAndConditions);
await context.SaveChangesAsync();
```

## Note

1. **Configurare și Activare**:
   - IsEnabled = false dezactivează complet tipul
   - HideOnInitialPage ascunde dar permite acces direct prin link
   - Verificați toate serviciile asociate înainte de dezactivare

2. **Autentificare și Autorizare**:
   - AuthentificationStatus determină necesitatea autentificării
   - PersonType restricționează accesul pe tip de persoană
   - MPower permite delegarea autorității

3. **Moduri de Livrare**:
   - AllowsElectronicDocument - descărcare online
   - AllowsResponseOnPaper - răspuns fizic
   - AllowsDelivery - livrare prin curier
   - AllowsPickup - ridicare de la ghișeu

4. **Date Adiționale**:
   - SaveBirthDate, SaveResidence, SaveLastPhoto - pentru servicii specifice
   - Folosite pentru pre-completare în cereri ulterioare
   - Respectați GDPR la colectare

5. **Comunicare**:
   - RequestTypePhone/Email - contact specific pentru tip
   - RequestorPhoneRequired/EmailRequired - validări obligatorii
   - InformativeMessage - informații importante pentru utilizatori

6. **Best Practices**:
   - Folosiți coduri descriptive și unice
   - Configurați corect toate opțiunile înainte de activare
   - Testați fluxul complet pentru fiecare tip nou
   - Documentați schimbările de configurare