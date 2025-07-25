# FodExecutionTerm

## Descriere

Definește termenii de execuție pentru serviciile din sistemul FOD, inclusiv costurile, taxele de stat și timpul necesar pentru procesare. Această entitate permite configurarea flexibilă a termenelor în funcție de tipul de persoană și specificul serviciului.

## Proprietăți

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|--------------|
| Id | Guid | Identificator unic al termenului de execuție | Primary Key |
| Text | string | Descrierea termenului de execuție | Obligatoriu |
| Cost | decimal? | Costul serviciului | Column: decimal(18,2) |
| HoursValue | int? | Numărul de ore necesare pentru execuție | - |
| PersonType | PersonType? | Tipul de persoană (fizică/juridică) | Enum: PersonType |
| StateTax | decimal? | Taxa de stat aplicabilă | Column: decimal(18,2) |
| ServiceId | Guid? | ID-ul serviciului asociat | Foreign Key către FodService |

## Relații

### Relații Many-to-One (Părinți)
- **Service** (`FodService`) - Serviciul pentru care se aplică acest termen

### Relații Inverse (unde este referențiat)
- **FodRequest** - Cererile care folosesc acest termen de execuție
- **FodServiceRequest** - Cererile de serviciu cu acest termen

## Exemple de Utilizare

### Definire Termeni pentru Serviciu
```csharp
// Termen standard
var termenStandard = new FodExecutionTerm
{
    ServiceId = certificatNastereId,
    Text = "Eliberare în termen de 5 zile lucrătoare",
    Cost = 100.00m,
    StateTax = 20.00m,
    HoursValue = 120, // 5 zile * 24 ore
    PersonType = PersonType.Physical
};

// Termen urgent
var termenUrgent = new FodExecutionTerm
{
    ServiceId = certificatNastereId,
    Text = "Eliberare urgentă în 24 ore",
    Cost = 200.00m,
    StateTax = 40.00m,
    HoursValue = 24,
    PersonType = PersonType.Physical
};

context.FodExecutionTerms.AddRange(termenStandard, termenUrgent);
await context.SaveChangesAsync();
```

### Calcul Cost Total
```csharp
public decimal CalculateTotalCost(FodExecutionTerm term)
{
    return (term.Cost ?? 0) + (term.StateTax ?? 0);
}

// Aplicare reduceri pentru anumite categorii
public decimal CalculateFinalCost(FodExecutionTerm term, bool isPensioner, bool hasDisability)
{
    var totalCost = CalculateTotalCost(term);
    
    // 50% reducere pentru pensionari
    if (isPensioner)
        totalCost *= 0.5m;
    
    // Scutire completă pentru persoane cu dizabilități
    if (hasDisability)
        totalCost = 0;
    
    return totalCost;
}
```

### Obținere Termeni Disponibili
```csharp
var availableTerms = await context.FodExecutionTerms
    .Where(et => et.ServiceId == serviceId &&
                 (et.PersonType == null || et.PersonType == requestorType))
    .OrderBy(et => et.Cost)
    .Select(et => new
    {
        et.Id,
        et.Text,
        TotalCost = (et.Cost ?? 0) + (et.StateTax ?? 0),
        WorkingDays = et.HoursValue.HasValue ? et.HoursValue.Value / 24 : 0,
        IsUrgent = et.HoursValue <= 24
    })
    .ToListAsync();
```

### Calcul Dată Estimată Finalizare
```csharp
public DateTime CalculateEstimatedCompletionDate(FodExecutionTerm term, DateTime startDate)
{
    if (!term.HoursValue.HasValue)
        return startDate.AddDays(30); // Default 30 zile
    
    var hours = term.HoursValue.Value;
    var endDate = startDate;
    
    // Convertește ore în zile lucrătoare (8 ore/zi)
    var workingDays = Math.Ceiling(hours / 8.0);
    
    // Adaugă zile lucrătoare, sărind weekend-urile
    while (workingDays > 0)
    {
        endDate = endDate.AddDays(1);
        if (endDate.DayOfWeek != DayOfWeek.Saturday && 
            endDate.DayOfWeek != DayOfWeek.Sunday)
        {
            workingDays--;
        }
    }
    
    return endDate;
}
```

### Raport Termeni Populari
```csharp
var popularTerms = await context.FodServiceRequests
    .Include(sr => sr.FodExecutionTerm)
    .Where(sr => sr.FodExecutionTermId != null)
    .GroupBy(sr => new 
    { 
        sr.FodExecutionTermId,
        sr.FodExecutionTerm.Text,
        sr.FodExecutionTerm.Cost
    })
    .Select(g => new
    {
        TermId = g.Key.FodExecutionTermId,
        Description = g.Key.Text,
        Cost = g.Key.Cost,
        UsageCount = g.Count(),
        TotalRevenue = g.Sum(sr => sr.FinalCost)
    })
    .OrderByDescending(t => t.UsageCount)
    .ToListAsync();
```

## Note

1. **Structura Costurilor**:
   - Cost = tariful serviciului
   - StateTax = taxa de stat obligatorie
   - Cost total = Cost + StateTax

2. **Timp de Execuție**:
   - HoursValue pentru calcule precise
   - Considerat în ore pentru flexibilitate
   - Convertit în zile lucrătoare pentru afișare

3. **Personalizare per Tip Persoană**:
   - PersonType permite tarife diferențiate
   - null = aplicabil pentru toate tipurile
   - Verificați întotdeauna compatibilitatea

4. **Termeni Speciali**:
   - Urgent: HoursValue <= 24
   - Express: HoursValue <= 48
   - Standard: HoursValue > 48

5. **Validări Recomandate**:
   - Cost >= 0 (poate fi 0 pentru servicii gratuite)
   - StateTax >= 0
   - HoursValue > 0 când specificat
   - Text să fie descriptiv și clar

6. **Best Practices**:
   - Definiți termeni clari și distincti
   - Evitați suprapuneri de condiții
   - Actualizați Text când modificați termenii
   - Păstrați istoric pentru audit financiar