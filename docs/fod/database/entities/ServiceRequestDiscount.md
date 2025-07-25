# ServiceRequestDiscount

## Descriere

Entitatea care gestionează reducerile aplicate asupra cererilor de servicii în sistemul Front Office Digital. Această entitate permite aplicarea de reduceri bazate pe diferite criterii precum statutul solicitantului (pensionar, persoană cu dizabilități), campanii promoționale sau alte motive de business.

## Proprietăți

### Identificare și Calcul

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| Id | Guid | Identificator unic al reducerii | Primary Key |
| ServiceRequestId | Guid | ID-ul cererii de serviciu | Foreign Key către FodServiceRequest |
| CalculatedDiscount | decimal | Suma calculată a reducerii în MDL | Valoare pozitivă |
| Percent | decimal | Procentul de reducere aplicat | Între 0 și 100 |
| Name | string? | Denumirea reducerii | Opțional |
| Reason | string? | Motivul acordării reducerii | Opțional |

## Relații

### Relații Many-to-One (Părinți)
- **ServiceRequest** (`FodServiceRequest`) - Cererea de serviciu căreia i se aplică reducerea

## Exemple de Utilizare

### Aplicare Reducere pentru Pensionari
```csharp
var discount = new ServiceRequestDiscount
{
    Id = Guid.NewGuid(),
    ServiceRequestId = serviceRequestId,
    Percent = 50,
    CalculatedDiscount = originalPrice * 0.5m,
    Name = "Reducere pensionari",
    Reason = "Solicitant pensionar cu limită de vârstă"
};

context.ServiceRequestDiscounts.Add(discount);
await context.SaveChangesAsync();
```

### Calculare Preț Final cu Reduceri
```csharp
var serviceRequest = await context.FodServiceRequests
    .Include(sr => sr.Discounts)
    .FirstOrDefaultAsync(sr => sr.Id == serviceRequestId);

var originalPrice = serviceRequest.Service.Price;
var totalDiscount = serviceRequest.Discounts.Sum(d => d.CalculatedDiscount);
var finalPrice = originalPrice - totalDiscount;

Console.WriteLine($"Preț original: {originalPrice} MDL");
Console.WriteLine($"Total reduceri: {totalDiscount} MDL");
Console.WriteLine($"Preț final: {finalPrice} MDL");
```

### Aplicare Reduceri Multiple
```csharp
// Reducere pentru persoană cu dizabilități
var disabilityDiscount = new ServiceRequestDiscount
{
    ServiceRequestId = serviceRequestId,
    Percent = 75,
    CalculatedDiscount = basePrice * 0.75m,
    Name = "Reducere persoane cu dizabilități",
    Reason = "Solicitant cu grad de dizabilitate"
};

// Reducere promoțională
var promoDiscount = new ServiceRequestDiscount
{
    ServiceRequestId = serviceRequestId,
    Percent = 10,
    CalculatedDiscount = (basePrice - disabilityDiscount.CalculatedDiscount) * 0.1m,
    Name = "Campanie promoțională",
    Reason = "Reducere 10% servicii online - Decembrie 2024"
};

context.ServiceRequestDiscounts.AddRange(disabilityDiscount, promoDiscount);
await context.SaveChangesAsync();
```

### Raport Reduceri Acordate
```csharp
var discountReport = await context.ServiceRequestDiscounts
    .Where(d => d.ServiceRequest.Request.SubmissionDate >= startDate
                && d.ServiceRequest.Request.SubmissionDate <= endDate)
    .GroupBy(d => d.Name)
    .Select(g => new
    {
        DiscountType = g.Key,
        TotalAmount = g.Sum(d => d.CalculatedDiscount),
        Count = g.Count(),
        AveragePercent = g.Average(d => d.Percent)
    })
    .OrderByDescending(r => r.TotalAmount)
    .ToListAsync();
```

## Tipuri Comune de Reduceri

1. **Reduceri Sociale**:
   - Pensionari (50%)
   - Persoane cu dizabilități (75%)
   - Veterani (100%)
   - Familii numeroase (30%)

2. **Reduceri Promoționale**:
   - Campanii sezoniere
   - Reduceri pentru servicii online
   - Prima utilizare a platformei

3. **Reduceri de Volum**:
   - Cereri multiple
   - Pachete de servicii

## Note Importante

1. **Calcul și Aplicare**:
   - CalculatedDiscount reprezintă suma absolută a reducerii
   - Percent este folosit pentru transparență și raportare
   - Reducerile multiple se pot cumula conform regulilor de business

2. **Validări de Business**:
   - Percent nu poate depăși 100%
   - CalculatedDiscount nu poate fi mai mare decât prețul serviciului
   - Unele reduceri pot fi exclusive (nu se cumulează)

3. **Audit și Transparență**:
   - Name și Reason oferă transparență asupra reducerilor acordate
   - Esențial pentru audit și verificări ulterioare
   - Ajută la generarea de documente justificative

4. **Integrare cu Facturare**:
   - Reducerile sunt reflectate în factura finală
   - Fiecare reducere apare ca linie separată
   - Total reduceri este evidențiat clar

5. **Reguli de Eligibilitate**:
   - Verificarea eligibilității se face înainte de aplicare
   - Documentele justificative pot fi cerute
   - Reducerile expirate sunt marcate sau eliminate


