# EstimatedDateCalculator

## Documentație pentru serviciul EstimatedDateCalculator

### 1. Descriere Generală

`EstimatedDateCalculator` este un serviciu server-side care calculează date estimate de finalizare pentru cereri, ținând cont de programul de lucru, zilele nelucrătoare și timpul necesar pentru procesare. Serviciul utilizează un algoritm recursiv pentru a calcula cu precizie timpul de lucru disponibil.

Caracteristici principale:
- Calcul date estimate bazat pe program de lucru
- Suport pentru zile calendaristice și zile lucrătoare
- Integrare cu serviciul de program de lucru
- Calcul recursiv pentru perioade mari de timp
- Configurare flexibilă prin FodConfiguration
- Suport pentru parametri personalizați

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs (server-side)
builder.Services.Configure<FodConfiguration>(configuration);
builder.Services.AddScoped<IWorkingProgramService, DefaultWorkingProgramService>();
builder.Services.AddScoped<IWorkingProgramService, EightToFiveWorkingProgramService>();
builder.Services.AddScoped<IEstimatedDateCalculator, EstimatedDateCalculator>();

// Configurare în appsettings.json
{
  "FodConfiguration": {
    "Services": {
      "UseEightToFiveWorkingProgramService": false
    }
  }
}
```

### 3. Interfață

```csharp
public interface IEstimatedDateCalculator
{
    DateTime Calculate(DateTime dataTime, double secondsToAdd, double secondFromOpening = 0, IDictionary<string, object>? @params = null);
    DateTime CalculateCalendarDays(DateTime startDate, int calendarDaysToAdd);
}
```

### 4. Metode Disponibile

#### Calculate
Calculează data estimată adăugând un număr de secunde la o dată de start, ținând cont de programul de lucru.

**Parametri:**
- `dataTime` (DateTime) - Data și ora de start
- `secondsToAdd` (double) - Numărul de secunde de adăugat (timp de lucru)
- `secondFromOpening` (double, opțional) - Număr minim de secunde de la deschidere
- `@params` (IDictionary<string, object>?, opțional) - Parametri personalizați pentru programul de lucru

**Returnează:**
- `DateTime` - Data și ora estimată de finalizare

#### CalculateCalendarDays
Adaugă un număr de zile calendaristice la o dată de start.

**Parametri:**
- `startDate` (DateTime) - Data de start
- `calendarDaysToAdd` (int) - Numărul de zile calendaristice de adăugat

**Returnează:**
- `DateTime` - Data rezultată

### 5. Exemple de Utilizare

#### Calcul simplu termen estimat
```csharp
public class ServiceRequestService
{
    private readonly IEstimatedDateCalculator _calculator;
    
    public ServiceRequestService(IEstimatedDateCalculator calculator)
    {
        _calculator = calculator;
    }
    
    public DateTime CalculateDeliveryDate(ServiceRequest request)
    {
        // 3 zile lucrătoare = 3 * 8 ore * 3600 secunde
        var workingSeconds = 3 * 8 * 3600;
        
        var estimatedDate = _calculator.Calculate(
            DateTime.Now, 
            workingSeconds
        );
        
        return estimatedDate;
    }
}
```

#### Calcul cu timp minim de la deschidere
```csharp
public class UrgentRequestService
{
    private readonly IEstimatedDateCalculator _calculator;
    
    public DateTime CalculateUrgentDelivery(UrgentRequest request)
    {
        // 4 ore de procesare
        var processingSeconds = 4 * 3600;
        
        // Minimum 30 minute de la deschiderea programului
        var minSecondsFromOpening = 30 * 60;
        
        var estimatedDate = _calculator.Calculate(
            request.SubmittedAt,
            processingSeconds,
            minSecondsFromOpening
        );
        
        return estimatedDate;
    }
}
```

#### Calcul pentru diferite tipuri de servicii
```csharp
public class EstimationService
{
    private readonly IEstimatedDateCalculator _calculator;
    private readonly IServiceRepository _serviceRepository;
    
    public async Task<ServiceEstimation> EstimateCompletion(
        string serviceId, 
        DateTime startDate)
    {
        var service = await _serviceRepository.GetById(serviceId);
        
        DateTime estimatedDate;
        
        if (service.UseCalendarDays)
        {
            // Pentru servicii care folosesc zile calendaristice
            estimatedDate = _calculator.CalculateCalendarDays(
                startDate, 
                service.EstimatedDays
            );
        }
        else
        {
            // Pentru servicii care folosesc ore lucrătoare
            var workingSeconds = service.EstimatedHours * 3600;
            estimatedDate = _calculator.Calculate(
                startDate, 
                workingSeconds
            );
        }
        
        return new ServiceEstimation
        {
            ServiceId = serviceId,
            StartDate = startDate,
            EstimatedCompletionDate = estimatedDate,
            WorkingDaysRequired = CalculateWorkingDays(startDate, estimatedDate)
        };
    }
}
```

### 6. Calcul complex cu parametri personalizați

```csharp
public class CustomWorkingHoursService
{
    private readonly IEstimatedDateCalculator _calculator;
    
    public DateTime CalculateWithCustomSchedule(
        DateTime startDate,
        double hoursRequired,
        string departmentId)
    {
        // Parametri personalizați pentru program de lucru specific
        var customParams = new Dictionary<string, object>
        {
            ["DepartmentId"] = departmentId,
            ["UseExtendedHours"] = true,
            ["IncludeSaturdays"] = true
        };
        
        var secondsRequired = hoursRequired * 3600;
        
        return _calculator.Calculate(
            startDate,
            secondsRequired,
            0,
            customParams
        );
    }
}
```

### 7. Integrare cu sistem de notificări

```csharp
public class DeadlineNotificationService
{
    private readonly IEstimatedDateCalculator _calculator;
    private readonly INotificationService _notificationService;
    
    public async Task ScheduleDeadlineNotifications(
        ServiceRequest request)
    {
        // Calculează deadline-ul
        var deadline = _calculator.Calculate(
            request.CreatedAt,
            request.EstimatedSeconds
        );
        
        // Notificare cu 24 ore înainte (în ore lucrătoare)
        var warningDate = _calculator.Calculate(
            deadline,
            -8 * 3600 // -8 ore lucrătoare
        );
        
        // Notificare cu 1 oră înainte
        var urgentDate = _calculator.Calculate(
            deadline,
            -3600 // -1 oră lucrătoare
        );
        
        // Programează notificările
        await _notificationService.Schedule(new[]
        {
            new ScheduledNotification
            {
                SendAt = warningDate,
                Type = NotificationType.DeadlineWarning,
                RequestId = request.Id,
                Message = $"Cererea {request.OrderNumber} trebuie finalizată până la {deadline:dd.MM.yyyy HH:mm}"
            },
            new ScheduledNotification
            {
                SendAt = urgentDate,
                Type = NotificationType.DeadlineUrgent,
                RequestId = request.Id,
                Message = $"URGENT: Cererea {request.OrderNumber} expiră în 1 oră!"
            }
        });
    }
}
```

### 8. Algoritm de calcul recursiv

Serviciul utilizează un algoritm recursiv pentru calculul precis:

```csharp
public class EstimationExampleService
{
    private readonly IEstimatedDateCalculator _calculator;
    
    public void DemonstrateAlgorithm()
    {
        // Exemplu: 20 ore de lucru începând de vineri la ora 15:00
        var startDate = new DateTime(2024, 6, 28, 15, 0, 0); // Vineri
        var hoursToAdd = 20;
        var secondsToAdd = hoursToAdd * 3600;
        
        var result = _calculator.Calculate(startDate, secondsToAdd);
        
        // Algoritmul va calcula astfel:
        // 1. Vineri 15:00-17:00 = 2 ore disponibile
        // 2. Luni 09:00-17:00 = 8 ore
        // 3. Marți 09:00-17:00 = 8 ore
        // 4. Miercuri 09:00-11:00 = 2 ore (total 20 ore)
        // Rezultat: Miercuri, 11:00
    }
}
```

### 9. Validare și tratare erori

```csharp
public class SafeEstimationService
{
    private readonly IEstimatedDateCalculator _calculator;
    private readonly ILogger<SafeEstimationService> _logger;
    
    public async Task<EstimationResult> SafeCalculateEstimation(
        EstimationRequest request)
    {
        try
        {
            // Validare input
            if (request.StartDate < DateTime.Now.AddYears(-1))
            {
                return new EstimationResult
                {
                    Success = false,
                    Error = "Data de start este prea veche"
                };
            }
            
            if (request.HoursRequired > 8760) // Mai mult de 1 an
            {
                return new EstimationResult
                {
                    Success = false,
                    Error = "Timpul solicitat depășește limita maximă"
                };
            }
            
            var estimatedDate = _calculator.Calculate(
                request.StartDate,
                request.HoursRequired * 3600
            );
            
            return new EstimationResult
            {
                Success = true,
                EstimatedDate = estimatedDate,
                WorkingDays = CalculateWorkingDays(request.StartDate, estimatedDate)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Eroare la calculul estimării");
            return new EstimationResult
            {
                Success = false,
                Error = "Eroare la calculul datei estimate"
            };
        }
    }
}
```

### 10. Testing

```csharp
[TestClass]
public class EstimatedDateCalculatorTests
{
    private IEstimatedDateCalculator _calculator;
    private Mock<IWorkingProgramService> _mockWorkingProgram;
    
    [TestInitialize]
    public void Setup()
    {
        _mockWorkingProgram = new Mock<IWorkingProgramService>();
        var config = Options.Create(new FodConfiguration
        {
            Services = new ServicesConfiguration
            {
                UseEightToFiveWorkingProgramService = false
            }
        });
        
        _calculator = new EstimatedDateCalculator(
            new[] { _mockWorkingProgram.Object },
            config
        );
    }
    
    [TestMethod]
    public void Calculate_WithinSameDay_ReturnsCorrectTime()
    {
        // Arrange
        var startDate = new DateTime(2024, 6, 30, 10, 0, 0);
        var secondsToAdd = 2 * 3600; // 2 ore
        
        _mockWorkingProgram.Setup(x => x.GetCurrentWorkingDayOpening(It.IsAny<DateTime>(), null))
            .Returns(new DateTime(2024, 6, 30, 9, 0, 0));
        _mockWorkingProgram.Setup(x => x.GetCurrentWorkingDayClosing(It.IsAny<DateTime>(), null))
            .Returns(new DateTime(2024, 6, 30, 17, 0, 0));
        
        // Act
        var result = _calculator.Calculate(startDate, secondsToAdd);
        
        // Assert
        Assert.AreEqual(new DateTime(2024, 6, 30, 12, 0, 0), result);
    }
    
    [TestMethod]
    public void CalculateCalendarDays_AddsCorrectly()
    {
        // Arrange
        var startDate = new DateTime(2024, 6, 28); // Vineri
        var daysToAdd = 5;
        
        // Act
        var result = _calculator.CalculateCalendarDays(startDate, daysToAdd);
        
        // Assert
        Assert.AreEqual(new DateTime(2024, 7, 3), result); // Miercuri
    }
}
```

### 11. Best Practices

1. **Cache rezultate**: Pentru calcule repetitive, considerați cache-uirea rezultatelor
2. **Parametri consistenți**: Folosiți aceiași parametri pentru calcule legate
3. **Validare input**: Validați întotdeauna datele de intrare
4. **Logging**: Logați calculele complexe pentru debugging
5. **Timezone**: Folosiți UTC pentru aplicații internaționale
6. **Testare**: Testați cu diferite scenarii de program de lucru

### 12. Configurare program de lucru personalizat

```csharp
public class CustomWorkingProgramService : IWorkingProgramService
{
    private readonly IConfiguration _configuration;
    
    public DateTime? GetCurrentWorkingDayOpening(
        DateTime date, 
        IDictionary<string, object>? @params)
    {
        // Implementare personalizată bazată pe parametri
        if (@params?.ContainsKey("UseExtendedHours") == true)
        {
            return date.Date.AddHours(7); // 07:00
        }
        
        return date.Date.AddHours(9); // 09:00 implicit
    }
    
    public DateTime? GetCurrentWorkingDayClosing(
        DateTime? date, 
        IDictionary<string, object>? @params)
    {
        if (@params?.ContainsKey("UseExtendedHours") == true)
        {
            return date?.Date.AddHours(20); // 20:00
        }
        
        return date?.Date.AddHours(17); // 17:00 implicit
    }
    
    public DateTime? GetNextWorkingDayOpening(
        DateTime date, 
        IDictionary<string, object>? @params)
    {
        // Logică pentru următoarea zi lucrătoare
        var nextDay = date.Date.AddDays(1);
        
        while (IsWeekend(nextDay) || IsHoliday(nextDay))
        {
            nextDay = nextDay.AddDays(1);
        }
        
        return GetCurrentWorkingDayOpening(nextDay, @params);
    }
}
```

### 13. Concluzie

`EstimatedDateCalculator` oferă un sistem robust pentru calculul datelor estimate în aplicațiile FOD, integrându-se perfect cu sistemul de program de lucru. Algoritmul recursiv asigură calcule precise chiar și pentru perioade lungi de timp, iar suportul pentru parametri personalizați permite adaptarea la diferite scenarii de business.