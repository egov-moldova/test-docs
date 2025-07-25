# ServiceRequestDeliveryStatusLog

## Descriere

Entitatea care înregistrează istoricul statusurilor de livrare pentru cererile de servicii. Această entitate permite urmărirea completă a procesului de livrare, înregistrând fiecare schimbare de status împreună cu mesaje detaliate și informații despre transportator.

## Proprietăți

### Informații Status

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| Id | Guid | Identificator unic al log-ului | Primary Key, moștenit din BaseEntity |
| Status | DeliveryStatus | Statusul livrării | Enum: DeliveryStatus |
| Message | string? | Mesaj descriptiv despre schimbarea statusului | Opțional |
| CarrierName | string? | Numele transportatorului/curierului | Opțional |
| TrackingId | string? | ID-ul de urmărire al livrării | Opțional |

### Metadate (moștenite din BaseEntity)

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| CreatedDate | DateTime | Data creării înregistrării | Setată automat |
| ModifiedDate | DateTime | Data ultimei modificări | Actualizată automat |
| CreatedBy | string? | Identificatorul utilizatorului care a creat înregistrarea | - |
| ModifiedBy | string? | Identificatorul utilizatorului care a modificat ultima dată | - |
| Version | byte[] | Versiunea înregistrării pentru concurrency control | Rowversion |
| TenantId | string? | ID-ul tenant-ului pentru multi-tenancy | - |

## Relații

### Relații Many-to-One (Părinți)
- **ServiceRequestDelivery** - Cererea de livrare părinte (relație implicită prin foreign key)

## Enum-uri Utilizate

### DeliveryStatus
Posibile valori pentru statusul livrării:
- `Pending` - În așteptare
- `Picked` - Ridicat de curier
- `InTransit` - În tranzit
- `Delivered` - Livrat
- `Failed` - Eșuat
- `Returned` - Returnat
- `Cancelled` - Anulat

## Exemple de Utilizare

### Înregistrare Status Nou
```csharp
var statusLog = new ServiceRequestDeliveryStatusLog
{
    Status = DeliveryStatus.Picked,
    Message = "Coletul a fost ridicat de la expeditor",
    CarrierName = "Posta Moldovei",
    TrackingId = "MD123456789",
    CreatedDate = DateTime.UtcNow
};

context.ServiceRequestDeliveryStatusLogs.Add(statusLog);
await context.SaveChangesAsync();
```

### Urmărire Istoric Livrare
```csharp
var deliveryHistory = await context.ServiceRequestDeliveryStatusLogs
    .Where(log => log.TrackingId == "MD123456789")
    .OrderBy(log => log.CreatedDate)
    .ToListAsync();

foreach (var log in deliveryHistory)
{
    Console.WriteLine($"{log.CreatedDate}: {log.Status} - {log.Message}");
}
```

### Verificare Status Curent
```csharp
var currentStatus = await context.ServiceRequestDeliveryStatusLogs
    .Where(log => log.TrackingId == trackingId)
    .OrderByDescending(log => log.CreatedDate)
    .FirstOrDefaultAsync();

if (currentStatus?.Status == DeliveryStatus.Delivered)
{
    // Procesare pentru livrare completă
}
```

## Note Importante

1. **Istoricul Complet**: Această entitate păstrează istoricul complet al statusurilor, nu doar statusul curent. Fiecare schimbare de status creează o nouă înregistrare.

2. **Tracking și Monitorizare**:
   - TrackingId permite urmărirea externă prin sistemele transportatorilor
   - CarrierName identifică transportatorul responsabil
   - Message oferă detalii specifice despre fiecare etapă

3. **Integrare cu Sisteme Externe**:
   - Poate fi populată automat prin webhook-uri de la transportatori
   - Permite sincronizare cu sisteme de tracking externe
   - Suportă multiple transportatori prin câmpul CarrierName

4. **Audit și Raportare**:
   - CreatedDate permite reconstituirea exactă a timeline-ului livrării
   - Util pentru generarea de rapoarte despre performanța livrărilor
   - Permite identificarea problemelor în procesul de livrare


