# FodAdditionalServiceRequest

## Descriere
Entitatea `FodAdditionalServiceRequest` reprezintă legătura dintre servicii și cererile adiționale asociate. Aceasta permite definirea serviciilor suplimentare care pot fi solicitate în contextul unei cereri principale, facilitând procesarea cererilor complexe care necesită servicii complementare.

## Proprietăți

Această entitate funcționează ca o tabelă de legătură many-to-many și nu expune proprietăți publice direct.

## Relații
- **FodService** - Serviciul principal care poate avea cereri adiționale
- **FodAdditionalService** - Serviciul adițional care poate fi solicitat
- **FodRequest** - Cererea în care se folosesc serviciile adiționale

## Utilizare

### Exemplu de configurare servicii adiționale
```csharp
public async Task ConfigureazaServiciiAditionale(int servicePrincipalId, List<int> serviciiAditionale)
{
    foreach (var serviceAdditionalId in serviciiAditionale)
    {
        var legatura = new FodAdditionalServiceRequest
        {
            ServiceId = servicePrincipalId,
            AdditionalServiceId = serviceAdditionalId,
            IsOptional = true,
            DisplayOrder = 1
        };
        
        await context.FodAdditionalServiceRequests.AddAsync(legatura);
    }
    
    await context.SaveChangesAsync();
}
```

### Exemplu de obținere servicii adiționale disponibile
```csharp
public async Task<List<ServiceInfo>> GetServiciiAditionaleDisponibile(int serviceId)
{
    return await context.FodAdditionalServiceRequests
        .Where(asr => asr.ServiceId == serviceId)
        .Include(asr => asr.AdditionalService)
        .Select(asr => new ServiceInfo
        {
            ServiceId = asr.AdditionalServiceId,
            ServiceName = asr.AdditionalService.Name,
            IsOptional = asr.IsOptional,
            Price = asr.AdditionalService.Price
        })
        .OrderBy(s => s.DisplayOrder)
        .ToListAsync();
}
```

### Exemplu de validare servicii adiționale selectate
```csharp
public async Task<bool> ValidateServiciiAditionale(int serviceId, List<int> selectedServices)
{
    var serviciiObligatorii = await context.FodAdditionalServiceRequests
        .Where(asr => asr.ServiceId == serviceId && !asr.IsOptional)
        .Select(asr => asr.AdditionalServiceId)
        .ToListAsync();
    
    // Verifică dacă toate serviciile obligatorii sunt selectate
    return serviciiObligatorii.All(so => selectedServices.Contains(so));
}
```

## Note importante
- Permite definirea serviciilor opționale și obligatorii
- Ordinea de afișare poate fi controlată pentru o experiență utilizator optimă
- Serviciile adiționale pot avea propriile tarife și condiții
- Validarea trebuie să țină cont de serviciile obligatorii
- Poate fi folosită pentru pachete de servicii sau servicii complementare