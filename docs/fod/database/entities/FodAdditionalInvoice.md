# FodAdditionalInvoice

## Descriere

Entitatea care gestionează facturile adiționale asociate unei cereri în sistemul Front Office Digital. Această entitate permite adăugarea de costuri suplimentare care apar în timpul procesării unei cereri, cum ar fi taxe pentru servicii expres, apostilare, livrare sau alte servicii opționale.

## Proprietăți

### Identificare și Detalii

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| Id | Guid | Identificator unic al facturii adiționale | Primary Key |
| RequestNumber | string | Numărul cererii asociate | Obligatoriu, referință pentru tracking |
| Amount | decimal | Suma facturii adiționale | Obligatoriu, valoare pozitivă |
| Title | string? | Titlul/Descrierea facturii | Opțional, descrie serviciul facturat |
| RequestId | Guid | ID-ul cererii principale | Foreign Key către FodRequest |

## Relații

### Relații Many-to-One (Părinți)
- **Request** (`FodRequest`) - Cererea principală căreia îi aparține această factură adițională

## Exemple de Utilizare

### Adăugare Factură Adițională
```csharp
var additionalInvoice = new FodAdditionalInvoice
{
    Id = Guid.NewGuid(),
    RequestId = requestId,
    RequestNumber = "FOD-2024-000123",
    Amount = 150.00m,
    Title = "Taxă urgență - procesare în 24 ore"
};

context.FodAdditionalInvoices.Add(additionalInvoice);
await context.SaveChangesAsync();
```

### Calculare Cost Total cu Facturi Adiționale
```csharp
var request = await context.FodRequests
    .Include(r => r.FodAdditionalInvoices)
    .FirstOrDefaultAsync(r => r.Id == requestId);

var baseCost = request.Cost ?? 0;
var additionalCosts = request.FodAdditionalInvoices.Sum(ai => ai.Amount);
var totalCost = baseCost + additionalCosts;

Console.WriteLine($"Cost de bază: {baseCost} MDL");
Console.WriteLine($"Costuri adiționale: {additionalCosts} MDL");
Console.WriteLine($"Cost total: {totalCost} MDL");
```

### Listare Facturi Adiționale pentru o Cerere
```csharp
var additionalInvoices = await context.FodAdditionalInvoices
    .Where(ai => ai.RequestId == requestId)
    .Select(ai => new
    {
        ai.Id,
        ai.Title,
        ai.Amount,
        ai.RequestNumber
    })
    .OrderBy(ai => ai.Title)
    .ToListAsync();
```

### Raport Venituri din Servicii Adiționale
```csharp
var revenueReport = await context.FodAdditionalInvoices
    .Where(ai => ai.Request.PaymentDate >= startDate 
                 && ai.Request.PaymentDate <= endDate)
    .GroupBy(ai => ai.Title)
    .Select(g => new
    {
        ServiceType = g.Key,
        TotalAmount = g.Sum(ai => ai.Amount),
        Count = g.Count()
    })
    .OrderByDescending(r => r.TotalAmount)
    .ToListAsync();
```

## Tipuri Comune de Facturi Adiționale

1. **Taxe de Urgență**:
   - Procesare expresă (24-48 ore)
   - Procesare super-urgentă (în aceeași zi)

2. **Servicii de Livrare**:
   - Livrare standard
   - Livrare expresă
   - Livrare internațională

3. **Servicii de Apostilare**:
   - Apostilare standard
   - Apostilare urgentă

4. **Alte Servicii**:
   - Copii suplimentare
   - Traduceri autorizate
   - Legalizări notariale

## Note Importante

1. **Transparență Financiară**:
   - Toate costurile adiționale trebuie comunicate clar solicitantului
   - Titlul facturii trebuie să descrie clar serviciul oferit
   - Suma trebuie să corespundă tarifelor oficiale

2. **Relație cu Plata Principală**:
   - Facturile adiționale se plătesc împreună cu costul principal
   - RequestNumber permite identificarea rapidă în sistemele de plată
   - Statutul plății se urmărește prin cererea principală

3. **Audit și Raportare**:
   - Toate facturile adiționale sunt incluse în rapoartele financiare
   - Permit analiza veniturilor pe tipuri de servicii
   - Esențiale pentru reconciliere cu sistemele contabile

4. **Validări de Business**:
   - Amount trebuie să fie pozitiv
   - Nu se permit facturi adiționale după finalizarea cererii
   - Modificările necesită aprobare și audit trail

5. **Integrare cu MPay**:
   - Facturile adiționale sunt incluse în totalul trimis către MPay
   - Se generează o singură tranzacție pentru toate costurile
   - Detaliile sunt disponibile în extrasul de plată


