# ServiceRequestDelivery

## Descriere

Gestionează informațiile de livrare pentru documentele rezultate din procesarea cererilor. Această entitate urmărește statusul livrării, costurile asociate și integrarea cu serviciile de curierat pentru livrarea fizică a documentelor oficiale către solicitanți.

## Proprietăți

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| Id | Guid | Identificator unic al livrării | Primary Key |
| Status | DeliveryStatus | Statusul curent al livrării | Enum: DeliveryStatus |
| NotifyStatusChange | bool | Notifică la schimbarea statusului | Default: true |
| Cost | decimal | Costul serviciului de livrare | Column: decimal(18,2) |
| TrackingId | string? | Numărul de urmărire (AWB) de la curier | - |
| CarrierEstimatedDeliveryStart | DateTime? | Data estimată început livrare | - |
| CarrierEstimatedDeliveryEnd | DateTime? | Data estimată sfârșit livrare | - |
| CarrierName | string? | Numele companiei de curierat | - |

## Relații

### Relații One-to-Many (Copii)
- **Logs** (`ICollection<ServiceRequestDeliveryStatusLog>`) - Istoricul schimbărilor de status

### Relații Inverse (unde este referențiat)
- **FodRequest** - Cererea care solicită livrarea

## Exemple de Utilizare

### Creare Livrare Nouă
```csharp
var delivery = new ServiceRequestDelivery
{
    Status = DeliveryStatus.Pending,
    NotifyStatusChange = true,
    Cost = 25.00m,
    CarrierName = "Posta Moldovei"
};

context.ServiceRequestDeliveries.Add(delivery);
await context.SaveChangesAsync();

// Asociere cu cererea
fodRequest.DeliveryId = delivery.Id;
await context.SaveChangesAsync();
```

### Actualizare Status cu Tracking
```csharp
public async Task UpdateDeliveryStatus(Guid deliveryId, string trackingId, DeliveryStatus newStatus)
{
    var delivery = await context.ServiceRequestDeliveries
        .Include(d => d.Logs)
        .FirstOrDefaultAsync(d => d.Id == deliveryId);
    
    if (delivery == null) return;
    
    var oldStatus = delivery.Status;
    delivery.Status = newStatus;
    delivery.TrackingId = trackingId;
    
    // Adaugă log pentru schimbare
    var log = new ServiceRequestDeliveryStatusLog
    {
        DeliveryId = delivery.Id,
        Status = newStatus,
        Message = $"Status schimbat din {oldStatus} în {newStatus}",
        LogDate = DateTime.UtcNow
    };
    
    delivery.Logs.Add(log);
    await context.SaveChangesAsync();
    
    // Trimite notificare dacă este activată
    if (delivery.NotifyStatusChange)
    {
        await NotifyDeliveryStatusChange(delivery);
    }
}
```

### Integrare cu API Curier
```csharp
public async Task<bool> SendToCourier(ServiceRequestDelivery delivery, AddressInfo address)
{
    var courierRequest = new CourierShipmentRequest
    {
        SenderName = "Agenția Servicii Publice",
        SenderAddress = "str. Alexandr Pușkin 42",
        RecipientName = address.FullName,
        RecipientAddress = address.FullAddress,
        RecipientPhone = address.Phone,
        PackageWeight = 0.1m, // 100g pentru documente
        PackageType = "Document",
        CashOnDelivery = delivery.Cost
    };
    
    var response = await courierApi.CreateShipment(courierRequest);
    
    if (response.Success)
    {
        delivery.TrackingId = response.TrackingNumber;
        delivery.Status = DeliveryStatus.SentToCourier;
        delivery.CarrierEstimatedDeliveryStart = response.EstimatedDeliveryStart;
        delivery.CarrierEstimatedDeliveryEnd = response.EstimatedDeliveryEnd;
        
        await context.SaveChangesAsync();
        return true;
    }
    
    return false;
}
```

### Monitorizare Livrări Active
```csharp
var activeDeliveries = await context.ServiceRequestDeliveries
    .Include(d => d.Logs)
    .Where(d => d.Status != DeliveryStatus.Delivered && 
                d.Status != DeliveryStatus.Cancelled)
    .Select(d => new
    {
        d.Id,
        d.TrackingId,
        d.Status,
        d.CarrierName,
        DaysInTransit = (DateTime.UtcNow - d.Logs
            .Where(l => l.Status == DeliveryStatus.SentToCourier)
            .OrderBy(l => l.LogDate)
            .Select(l => l.LogDate)
            .FirstOrDefault()).TotalDays,
        LastUpdate = d.Logs.Max(l => l.LogDate)
    })
    .ToListAsync();
```

### Raport Costuri Livrare
```csharp
var deliveryReport = await context.ServiceRequestDeliveries
    .Where(d => d.Status == DeliveryStatus.Delivered)
    .GroupBy(d => new { d.CarrierName, Month = d.Logs
        .Where(l => l.Status == DeliveryStatus.Delivered)
        .Select(l => l.LogDate.Month)
        .FirstOrDefault() })
    .Select(g => new
    {
        Carrier = g.Key.CarrierName,
        Month = g.Key.Month,
        TotalDeliveries = g.Count(),
        TotalCost = g.Sum(d => d.Cost),
        AverageCost = g.Average(d => d.Cost)
    })
    .ToListAsync();
```

## Note

1. **Fluxul de Status**:
   - Pending → SentToCourier → InTransit → OutForDelivery → Delivered
   - Alternativ: → Returned → Cancelled
   - Fiecare schimbare generează un log

2. **Integrare Curieri**:
   - TrackingId permite urmărirea externă
   - CarrierName identifică compania
   - API-uri diferite per curier

3. **Notificări**:
   - NotifyStatusChange controlează notificările
   - SMS/Email la schimbări importante
   - Respectă preferințele utilizatorului

4. **Costuri**:
   - Cost poate include TVA
   - Poate fi 0 pentru livrare gratuită
   - Facturare separată sau inclusă în cerere

5. **Estimări de Livrare**:
   - CarrierEstimatedDeliveryStart/End - interval estimat
   - Actualizat de la curier prin API
   - Afișat utilizatorului pentru transparență

6. **Best Practices**:
   - Sincronizați statusul regulat cu curierul
   - Păstrați logs detaliate pentru dispute
   - Implementați retry pentru erori API
   - Monitorizați livrările blocate/întârziate