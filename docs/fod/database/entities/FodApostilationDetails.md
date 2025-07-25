# FodApostilationDetails

## Descriere
Entitatea `FodApostilationDetails` stochează informații despre țările și detaliile necesare pentru procesul de apostilare a documentelor. Aceasta conține date despre acordurile bilaterale și excepțiile specifice fiecărei țări pentru validarea internațională a documentelor oficiale.

## Proprietăți

| Proprietate | Tip | Descriere |
|------------|-----|-----------|
| `CountryId` | `string` | Codul unic al țării (ISO sau intern) |
| `CountryName` | `string` | Numele oficial al țării |
| `CountryHasBilateralTreaty` | `bool` | Indică dacă există tratat bilateral cu țara respectivă |
| `CountryExceptDocuments` | `string?` | Lista documentelor exceptate de la apostilare pentru această țară |

## Relații
- **FodRequest** - Cererile care necesită apostilare pentru țara specificată
- **FodService** - Serviciile de apostilare disponibile pentru țară

## Utilizare

### Exemplu de verificare tratat bilateral
```csharp
public async Task<bool> VerificaTratatBilateral(string countryId)
{
    var detalii = await context.FodApostilationDetails
        .FirstOrDefaultAsync(ad => ad.CountryId == countryId);
    
    return detalii?.CountryHasBilateralTreaty ?? false;
}
```

### Exemplu de obținere țări cu tratate bilaterale
```csharp
public async Task<List<CountryInfo>> GetTariCuTratate()
{
    return await context.FodApostilationDetails
        .Where(ad => ad.CountryHasBilateralTreaty)
        .Select(ad => new CountryInfo
        {
            Id = ad.CountryId,
            Name = ad.CountryName,
            HasTreaty = true
        })
        .OrderBy(c => c.Name)
        .ToListAsync();
}
```

### Exemplu de verificare documente exceptate
```csharp
public bool EsteDocumentExceptat(FodApostilationDetails detalii, string tipDocument)
{
    if (string.IsNullOrEmpty(detalii.CountryExceptDocuments))
        return false;
    
    var documenteExceptate = detalii.CountryExceptDocuments
        .Split(',', StringSplitOptions.RemoveEmptyEntries)
        .Select(d => d.Trim());
    
    return documenteExceptate.Contains(tipDocument);
}
```

### Exemplu de procesare cerere apostilare
```csharp
public async Task<ApostilareResult> ProceseazaCerereApostilare(string countryId, string tipDocument)
{
    var detalii = await context.FodApostilationDetails
        .FirstOrDefaultAsync(ad => ad.CountryId == countryId);
    
    if (detalii == null)
        return new ApostilareResult { Success = false, Message = "Țara nu este configurată" };
    
    if (EsteDocumentExceptat(detalii, tipDocument))
        return new ApostilareResult { Success = false, Message = "Documentul este exceptat pentru această țară" };
    
    if (detalii.CountryHasBilateralTreaty)
    {
        return new ApostilareResult 
        { 
            Success = true, 
            RequiresApostille = false,
            Message = "Există tratat bilateral - nu este necesară apostila" 
        };
    }
    
    return new ApostilareResult 
    { 
        Success = true, 
        RequiresApostille = true,
        Message = "Apostila este necesară" 
    };
}
```

## Note importante
- Convenția de la Haga din 1961 reglementează apostilarea documentelor
- Țările cu tratate bilaterale pot avea proceduri simplificate
- Documentele exceptate variază în funcție de acordurile specifice
- Lista țărilor și excepțiilor trebuie actualizată periodic
- Codul țării trebuie să respecte standardele internaționale (ISO 3166)