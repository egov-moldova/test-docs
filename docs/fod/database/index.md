# Baza de Date FOD

## Prezentare Generală

Sistemul FOD (Front Office Digital) utilizează Entity Framework Core pentru gestionarea datelor. Baza de date este structurată pentru a suporta procesarea cererilor digitale pentru serviciile guvernamentale din Moldova.

## Arhitectura

### Context Principal
- **FodDbContext** - Context-ul principal Entity Framework care gestionează toate entitățile
- **IFodDbContext** - Interfața pentru dependency injection și testare

### Entitate de Bază
Toate entitățile moștenesc din **BaseEntity** care oferă câmpuri comune de audit:
- `Id` (Guid) - Identificator unic
- `CreateDate` - Data creării
- `UpdateDate` - Data ultimei actualizări
- `CreateUserId` - ID utilizator care a creat înregistrarea
- `UpdateUserId` - ID utilizator care a actualizat ultima dată
- `CreateUserName` - Nume utilizator creator
- `UpdateUserName` - Nume utilizator actualizator

## Categorii de Entități

### 1. Entități Principale de Cereri
- [**FodRequest**](entities/FodRequest.md) - Cererea principală depusă de cetățean
- [**FodServiceRequest**](entities/FodServiceRequest.md) - Cereri individuale de servicii în cadrul unei cereri principale
- [**FodRequestType**](entities/FodRequestType.md) - Tipuri de cereri disponibile
- [**FodAdditionalRequest**](entities/FodAdditionalRequest.md) - Cereri adiționale

### 2. Entități de Servicii
- [**FodService**](entities/FodService.md) - Serviciile disponibile în sistem
- [**FodServiceProvider**](entities/FodServiceProvider.md) - Furnizorii de servicii
- [**FodServiceDocumentType**](entities/FodServiceDocumentType.md) - Tipuri de documente necesare per serviciu

### 3. Entități de Utilizatori și Profile
- [**UserProfile**](entities/UserProfile.md) - Profiluri de utilizatori
- [**FodUserProfileOrganization**](entities/FodUserProfileOrganization.md) - Asocieri utilizator-organizație
- [**FodUserProfileRole**](entities/FodUserProfileRole.md) - Roluri utilizatori

### 4. Entități de Documente
- [**File**](entities/File.md) - Metadate fișiere
- [**FileContent**](entities/FileContent.md) - Conținut fișiere
- [**SignableDocument**](entities/SignableDocument.md) - Documente ce pot fi semnate
- [**FodResponseDocument**](entities/FodResponseDocument.md) - Documente răspuns

### 5. Entități de Plăți
- [**FodRequestPayment**](entities/FodRequestPayment.md) - Plăți pentru cereri
- [**FodAdditionalInvoice**](entities/FodAdditionalInvoice.md) - Facturi adiționale
- [**ServiceRequestDiscount**](entities/ServiceRequestDiscount.md) - Reduceri aplicate

### 6. Entități de Livrare
- [**ServiceRequestDelivery**](entities/ServiceRequestDelivery.md) - Detalii livrare
- [**ServiceRequestDeliveryStatusLog**](entities/ServiceRequestDeliveryStatusLog.md) - Istoric status livrare
- [**FodPickupLocation**](entities/FodPickupLocation.md) - Locații de ridicare

### 7. Entități de Semnături
- [**FodSignature**](entities/FodSignature.md) - Semnături digitale
- [**FodUserSignature**](entities/FodUserSignature.md) - Semnături utilizatori
- [**FodRequestJsonSignature**](entities/FodRequestJsonSignature.md) - Semnături JSON

### 8. Entități de Date Adiționale
- [**FodAdditionalData**](entities/FodAdditionalData.md) - Date adiționale generice
- [**FodAdditionalDataTypeValue**](entities/FodAdditionalDataTypeValue.md) - Valori pentru tipuri de date
- [**JsonSchema**](entities/JsonSchema.md) - Scheme JSON pentru validare

### 9. Entități Specializate
- [**FodApostilationDetails**](entities/FodApostilationDetails.md) - Detalii apostilare
- [**FodNotificationType**](entities/FodNotificationType.md) - Tipuri de notificări
- [**WorkingProgram**](entities/WorkingProgram.md) - Program de lucru
- [**ExceptionWorkingProgram**](entities/ExceptionWorkingProgram.md) - Excepții program lucru

## Diagrama Relațiilor Principale

```
FodRequest (Cerere Principală)
    │
    ├── FodServiceRequest (Cereri de Servicii)
    │   ├── FodService (Serviciu)
    │   ├── FodServiceProvider (Furnizor)
    │   └── FodResponseDocument (Documente Răspuns)
    │
    ├── FodRequestPayment (Plăți)
    │   └── FodAdditionalInvoice (Facturi)
    │
    ├── ServiceRequestDelivery (Livrare)
    │   └── ServiceRequestDeliveryStatusLog (Istoric)
    │
    └── FodRequestFile (Fișiere Atașate)
        └── File (Metadate)
            └── FileContent (Conținut)
```

## Enumerări Importante

### Status-uri Cereri
- **FodRequestStatus** - Status-uri pentru cererea principală
- **FodServiceRequestStatus** - Status-uri pentru cereri de servicii
- **PaymentStatus** - Status-uri plăți
- **DeliveryStatus** - Status-uri livrare

### Tipuri
- **PersonType** - Tip persoană (fizică/juridică)
- **OnBehalfOnEnum** - În numele cui se depune cererea
- **AdditionalDataType** - Tipuri de date adiționale
- **DocumentTypeEnum** - Tipuri de documente

## Convenții și Bune Practici

1. **Naming Convention**
   - Entitățile încep cu prefix `Fod` pentru entități specifice FOD
   - Proprietățile folosesc PascalCase
   - Foreign Key-urile se termină cu `Id`

2. **Relații**
   - Folosește atribute `[ForeignKey]` pentru relații explicite
   - Colecțiile folosesc `IList` sau `ICollection`
   - Navigare bidirecțională unde este necesar

3. **Audit Trail**
   - Toate entitățile moștenesc din `BaseEntity`
   - Câmpurile de audit sunt populate automat

4. **Validare**
   - Validarea se face la nivel de aplicație
   - Constrângerile de bază sunt definite în entități

## Migrații

Migrațiile Entity Framework nu sunt stocate în repository. Pentru actualizări de schemă:
1. Generează migrări local folosind `dotnet ef migrations add`
2. Aplică migrările în mediile de deployment
3. Documentează schimbările majore de schemă

## Performanță

Pentru optimizare:
- Folosește `Include()` pentru eager loading
- Implementează paginare pentru liste mari
- Folosește proiecții pentru query-uri read-only
- Indexează câmpurile folosite frecvent în filtrări

## Securitate

- Nu expune direct entitățile în API-uri
- Folosește DTO-uri pentru transfer de date
- Implementează row-level security unde este necesar
- Auditează toate operațiile CRUD