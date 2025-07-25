# FodRequestPayment

## Descriere

Reprezintă o plată efectuată pentru o cerere în sistemul FOD. Această entitate înregistrează detaliile plăților efectuate de cetățeni pentru serviciile solicitate, permițând tracking-ul complet al tranzacțiilor financiare asociate cu cererile.

## Proprietăți

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| Id | Guid | Identificator unic al plății | Primary Key |
| RequestId | Guid | ID-ul cererii pentru care s-a efectuat plata | Foreign Key către FodRequest |
| PaymentDate | DateTime | Data și ora efectuării plății | Obligatoriu |
| Amount | decimal | Suma plătită | Column: decimal(18,2), Obligatoriu |

## Relații

### Relații Many-to-One (Părinți)
- **Request** (`FodRequest`) - Cererea pentru care s-a efectuat plata (prin RequestId)

## Exemple de Utilizare

### Înregistrare Plată Nouă
```csharp
var payment = new FodRequestPayment
{
    RequestId = fodRequestId,
    PaymentDate = DateTime.UtcNow,
    Amount = 150.00m
};

context.FodRequestPayments.Add(payment);
await context.SaveChangesAsync();
```

### Calculare Total Plăți pentru Cerere
```csharp
var totalPaid = await context.FodRequestPayments
    .Where(p => p.RequestId == requestId)
    .SumAsync(p => p.Amount);
```

### Verificare Plăți Recente
```csharp
var recentPayments = await context.FodRequestPayments
    .Where(p => p.PaymentDate >= DateTime.UtcNow.AddDays(-7))
    .OrderByDescending(p => p.PaymentDate)
    .ToListAsync();
```

### Raport Plăți pe Perioadă
```csharp
var paymentReport = await context.FodRequestPayments
    .Where(p => p.PaymentDate >= startDate && p.PaymentDate <= endDate)
    .GroupBy(p => p.PaymentDate.Date)
    .Select(g => new 
    {
        Date = g.Key,
        TotalAmount = g.Sum(p => p.Amount),
        PaymentCount = g.Count()
    })
    .OrderBy(r => r.Date)
    .ToListAsync();
```

### Verificare Status Plată Completă
```csharp
// Verifică dacă cererea este plătită complet
var request = await context.FodRequests
    .Include(r => r.FodServiceRequests)
    .FirstOrDefaultAsync(r => r.Id == requestId);

var totalCost = request.FodServiceRequests.Sum(sr => sr.FinalCost);
var totalPaid = await context.FodRequestPayments
    .Where(p => p.RequestId == requestId)
    .SumAsync(p => p.Amount);

var isFullyPaid = totalPaid >= totalCost;
```

## Note

1. **Tracking Financiar**:
   - Permite înregistrarea plăților multiple pentru aceeași cerere
   - Util pentru plăți parțiale sau în rate
   - PaymentDate înregistrează momentul exact al tranzacției

2. **Integrare cu Sisteme de Plată**:
   - Deși entitatea este simplă, se integrează cu MPay și alte sisteme
   - Detaliile tranzacției (număr MPay, metodă) sunt în FodRequest
   - Această entitate păstrează doar esențialul pentru audit

3. **Considerații de Design**:
   - Amount folosește decimal(18,2) pentru precizie monetară
   - Nu stochează detalii sensibile ale cărților sau conturilor
   - Permite reconcilierea cu sistemele externe de plată

4. **Validări Recomandate**:
   - Amount trebuie să fie > 0
   - PaymentDate nu poate fi în viitor
   - Verifică că RequestId există înainte de inserare

5. **Best Practices**:
   - Folosește tranzacții când înregistrezi plăți
   - Actualizează FodRequest.PaidStatus după înregistrarea plății
   - Implementează audit trail pentru toate operațiunile

6. **Raportare și Reconciliere**:
   - Indexează PaymentDate pentru query-uri rapide pe perioade
   - Consideră view-uri materializate pentru rapoarte complexe
   - Păstrează log-uri detaliate pentru audit financiar