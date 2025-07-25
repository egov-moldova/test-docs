# ExceptionWorkingProgram

## Descriere
Entitatea `ExceptionWorkingProgram` reprezintă excepțiile de la programul de lucru standard, definind zile speciale cu orar diferit sau zile libere. Aceasta permite configurarea flexibilă a orarului pentru sărbători, evenimente speciale sau alte situații excepționale.

## Proprietăți

| Proprietate | Tip | Descriere |
|------------|-----|-----------|
| `Date` | `DateTime` | Data pentru care se aplică excepția |
| `OpenHours` | `int?` | Ora de deschidere (format 24h, nullable pentru zile închise) |
| `OpenMinutes` | `int?` | Minutele pentru ora de deschidere |
| `CloseHours` | `int?` | Ora de închidere (format 24h) |
| `CloseMinutes` | `int?` | Minutele pentru ora de închidere |

## Relații
- **WorkingProgram** - Program de lucru principal pentru care se definește excepția
- **Department** - Departamentul care aplică această excepție de orar

## Utilizare

### Exemplu de definire a unei zile libere
```csharp
var exceptie = new ExceptionWorkingProgram
{
    Date = new DateTime(2024, 12, 25), // Crăciun
    OpenHours = null,    // Închis
    OpenMinutes = null,
    CloseHours = null,
    CloseMinutes = null
};
```

### Exemplu de definire a unui orar special
```csharp
var exceptie = new ExceptionWorkingProgram
{
    Date = new DateTime(2024, 12, 24), // Ajun de Crăciun
    OpenHours = 9,
    OpenMinutes = 0,
    CloseHours = 14,     // Închidere devreme
    CloseMinutes = 0
};
```

## Note importante
- Valorile `null` pentru orele de deschidere indică o zi liberă
- Excepțiile au prioritate față de programul de lucru standard
- Este recomandat să se verifice existența excepțiilor înainte de afișarea orarului standard
- Data excepției trebuie să fie unică pentru fiecare program de lucru