# FodAdditionalRequest

## Descriere
Entitatea `FodAdditionalRequest` reprezintă o cerere suplimentară asociată unei cereri principale. Aceasta permite atașarea de cereri adiționale sau documente complementare la o cerere existentă, facilitând gestionarea cererilor complexe care necesită mai multe etape sau documente.

## Proprietăți

Această entitate nu expune proprietăți publice direct, funcționând ca o entitate de legătură între cererea principală și cererile adiționale asociate.

## Relații
- **FodRequest** - Cererea principală la care se atașează cererea adițională
- **FodService** - Serviciul pentru care se face cererea adițională
- **FodRequestStatus** - Statusul cererii adiționale

## Utilizare

### Exemplu de adăugare cerere adițională
```csharp
public async Task AdaugaCerereAditionala(int requestId, int serviceId)
{
    var cerereAditionala = new FodAdditionalRequest
    {
        RequestId = requestId,
        ServiceId = serviceId,
        Status = RequestStatus.InAsteptare,
        CreatedDate = DateTime.Now
    };
    
    await context.FodAdditionalRequests.AddAsync(cerereAditionala);
    await context.SaveChangesAsync();
}
```

### Exemplu de verificare cereri adiționale
```csharp
public async Task<bool> AreCereriAditionale(int requestId)
{
    return await context.FodAdditionalRequests
        .AnyAsync(ar => ar.RequestId == requestId);
}
```

### Exemplu de obținere cereri adiționale cu detalii
```csharp
public async Task<List<AdditionalRequestInfo>> GetCereriAditionale(int requestId)
{
    return await context.FodAdditionalRequests
        .Where(ar => ar.RequestId == requestId)
        .Include(ar => ar.Service)
        .Include(ar => ar.Status)
        .Select(ar => new AdditionalRequestInfo
        {
            ServiceName = ar.Service.Name,
            Status = ar.Status.Name,
            CreatedDate = ar.CreatedDate
        })
        .ToListAsync();
}
```

## Note importante
- Cererea adițională moștenește contextul cererii principale
- Poate avea propriul flux de aprobare independent
- Statusul cererii principale poate depinde de finalizarea cererilor adiționale
- Folosită frecvent pentru cereri care necesită documente de la alte instituții