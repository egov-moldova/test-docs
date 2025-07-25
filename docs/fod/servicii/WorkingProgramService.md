# WorkingProgramService

## Documentație pentru serviciul WorkingProgramService

### 1. Descriere Generală

`IWorkingProgramService` este o interfață server-side care definește funcționalitățile pentru gestionarea programului de lucru în aplicațiile FOD. Serviciul permite verificarea orelor de lucru, obținerea orelor de deschidere/închidere și navigarea între zilele lucrătoare.

Implementări disponibile:
- **EightToFiveWorkingProgramService** - Program standard 8:00-17:00, luni-vineri
- **ConfigurationWorkingProgramService** - Program configurabil prin settings
- **FodWorkingProgramService** - Program bazat pe date din baza de date

Caracteristici principale:
- Verificare ore de lucru
- Determinare program zilnic
- Navigare între zile lucrătoare
- Suport pentru parametri personalizați
- Configurare flexibilă

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs (server-side)

// Înregistrare implementare simplă
builder.Services.AddScoped<IWorkingProgramService, EightToFiveWorkingProgramService>();

// Sau înregistrare implementare configurabilă
builder.Services.Configure<FodConfiguration>(configuration);
builder.Services.AddScoped<IWorkingProgramService, ConfigurationWorkingProgramService>();

// Înregistrare multiplă pentru EstimatedDateCalculator
builder.Services.AddScoped<IWorkingProgramService, EightToFiveWorkingProgramService>();
builder.Services.AddScoped<IWorkingProgramService, ConfigurationWorkingProgramService>();

// Configurare în appsettings.json
{
  "FodConfiguration": {
    "Services": {
      "UseEightToFiveWorkingProgramService": true,
      "ConfigurationWorkingProgramService": {
        "WorkingDays": [
          {
            "Day": "Monday",
            "OpenHours": 8,
            "OpenMinutes": 0,
            "CloseHours": 17,
            "CloseMinutes": 0
          },
          {
            "Day": "Tuesday",
            "OpenHours": 8,
            "OpenMinutes": 0,
            "CloseHours": 17,
            "CloseMinutes": 0
          },
          // ... alte zile
        ]
      }
    }
  }
}
```

### 3. Interfață

```csharp
public interface IWorkingProgramService
{
    bool IsInWorkingHours(DateTime dateTime, IDictionary<string, object>? @params = null);
    DateTime? GetCurrentWorkingDayOpening(DateTime dateTime, IDictionary<string, object>? @params = null);
    DateTime GetCurrentWorkingDayClosing(DateTime currentDate, IDictionary<string, object>? @params = null);
    DateTime GetNextWorkingDayOpening(DateTime currentDate, IDictionary<string, object>? @params = null);
}
```

### 4. Metode Disponibile

#### IsInWorkingHours
Verifică dacă o dată/oră se află în programul de lucru.

**Parametri:**
- `dateTime` (DateTime) - Data și ora de verificat
- `@params` (IDictionary<string, object>?, opțional) - Parametri personalizați

**Returnează:**
- `bool` - True dacă este în ore de lucru, false altfel

#### GetCurrentWorkingDayOpening
Obține ora de deschidere pentru ziua curentă.

**Parametri:**
- `dateTime` (DateTime) - Data pentru care se caută ora de deschidere
- `@params` (IDictionary<string, object>?, opțional) - Parametri personalizați

**Returnează:**
- `DateTime?` - Ora de deschidere sau null dacă nu este zi lucrătoare

#### GetCurrentWorkingDayClosing
Obține ora de închidere pentru ziua curentă.

**Parametri:**
- `currentDate` (DateTime) - Data pentru care se caută ora de închidere
- `@params` (IDictionary<string, object>?, opțional) - Parametri personalizați

**Returnează:**
- `DateTime` - Ora de închidere

#### GetNextWorkingDayOpening
Obține ora de deschidere pentru următoarea zi lucrătoare.

**Parametri:**
- `currentDate` (DateTime) - Data de la care se caută
- `@params` (IDictionary<string, object>?, opțional) - Parametri personalizați

**Returnează:**
- `DateTime` - Ora de deschidere a următoarei zile lucrătoare

### 5. Implementări Standard

#### EightToFiveWorkingProgramService
```csharp
public class BusinessHoursService
{
    private readonly IWorkingProgramService _workingProgram;
    
    public BusinessHoursService(IWorkingProgramService workingProgram)
    {
        _workingProgram = workingProgram;
    }
    
    public WorkingHoursInfo GetTodaySchedule()
    {
        var now = DateTime.Now;
        
        var opening = _workingProgram.GetCurrentWorkingDayOpening(now);
        if (!opening.HasValue)
        {
            return new WorkingHoursInfo
            {
                IsWorkingDay = false,
                Message = "Astăzi este zi nelucrătoare"
            };
        }
        
        var closing = _workingProgram.GetCurrentWorkingDayClosing(now);
        var isOpen = _workingProgram.IsInWorkingHours(now);
        
        return new WorkingHoursInfo
        {
            IsWorkingDay = true,
            OpeningTime = opening.Value,
            ClosingTime = closing,
            IsCurrentlyOpen = isOpen,
            Message = isOpen 
                ? $"Deschis până la {closing:HH:mm}" 
                : $"Închis. Program: {opening:HH:mm} - {closing:HH:mm}"
        };
    }
}
```

#### ConfigurationWorkingProgramService
```csharp
public class FlexibleScheduleService
{
    private readonly IWorkingProgramService _workingProgram;
    private readonly IConfiguration _configuration;
    
    public async Task<ScheduleResponse> GetDepartmentSchedule(
        string departmentId)
    {
        // Parametri pentru departament specific
        var parameters = new Dictionary<string, object>
        {
            ["DepartmentId"] = departmentId
        };
        
        var today = DateTime.Today;
        var schedule = new List<DaySchedule>();
        
        // Obține programul pentru următoarele 7 zile
        for (int i = 0; i < 7; i++)
        {
            var date = today.AddDays(i);
            var opening = _workingProgram.GetCurrentWorkingDayOpening(date, parameters);
            
            if (opening.HasValue)
            {
                var closing = _workingProgram.GetCurrentWorkingDayClosing(date, parameters);
                schedule.Add(new DaySchedule
                {
                    Date = date,
                    DayName = date.ToString("dddd"),
                    OpeningTime = opening.Value,
                    ClosingTime = closing,
                    IsWorkingDay = true
                });
            }
            else
            {
                schedule.Add(new DaySchedule
                {
                    Date = date,
                    DayName = date.ToString("dddd"),
                    IsWorkingDay = false
                });
            }
        }
        
        return new ScheduleResponse
        {
            DepartmentId = departmentId,
            Schedule = schedule
        };
    }
}
```

### 6. Verificare disponibilitate serviciu

```csharp
public class ServiceAvailabilityChecker
{
    private readonly IWorkingProgramService _workingProgram;
    private readonly ILogger<ServiceAvailabilityChecker> _logger;
    
    public ServiceAvailabilityResult CheckAvailability(
        DateTime requestedTime,
        TimeSpan serviceDuration)
    {
        // Verifică dacă este în ore de lucru
        if (!_workingProgram.IsInWorkingHours(requestedTime))
        {
            var nextOpening = _workingProgram.GetNextWorkingDayOpening(requestedTime);
            return new ServiceAvailabilityResult
            {
                IsAvailable = false,
                Reason = "În afara orelor de program",
                NextAvailableTime = nextOpening,
                Message = $"Serviciul poate fi solicitat începând cu {nextOpening:dddd, dd MMMM, HH:mm}"
            };
        }
        
        // Verifică dacă serviciul poate fi completat în aceeași zi
        var closing = _workingProgram.GetCurrentWorkingDayClosing(requestedTime);
        var endTime = requestedTime.Add(serviceDuration);
        
        if (endTime > closing)
        {
            return new ServiceAvailabilityResult
            {
                IsAvailable = false,
                Reason = "Timp insuficient în ziua curentă",
                NextAvailableTime = _workingProgram.GetNextWorkingDayOpening(requestedTime),
                Message = $"Serviciul necesită {serviceDuration.TotalHours:F1} ore și nu poate fi finalizat astăzi"
            };
        }
        
        return new ServiceAvailabilityResult
        {
            IsAvailable = true,
            EstimatedCompletionTime = endTime,
            Message = $"Serviciul poate fi finalizat până la {endTime:HH:mm}"
        };
    }
}
```

### 7. Calcul timp rămas de lucru

```csharp
public class WorkingTimeCalculator
{
    private readonly IWorkingProgramService _workingProgram;
    
    public TimeSpan GetRemainingWorkingTime(DateTime fromTime)
    {
        if (!_workingProgram.IsInWorkingHours(fromTime))
        {
            return TimeSpan.Zero;
        }
        
        var closing = _workingProgram.GetCurrentWorkingDayClosing(fromTime);
        var remaining = closing - fromTime;
        
        return remaining > TimeSpan.Zero ? remaining : TimeSpan.Zero;
    }
    
    public int GetWorkingDaysBetween(DateTime startDate, DateTime endDate)
    {
        var workingDays = 0;
        var current = startDate.Date;
        
        while (current <= endDate.Date)
        {
            var opening = _workingProgram.GetCurrentWorkingDayOpening(current);
            if (opening.HasValue)
            {
                workingDays++;
            }
            current = current.AddDays(1);
        }
        
        return workingDays;
    }
}
```

### 8. Implementare personalizată cu sărbători

```csharp
public class HolidayAwareWorkingProgramService : IWorkingProgramService
{
    private readonly IWorkingProgramService _baseService;
    private readonly IHolidayService _holidayService;
    
    public HolidayAwareWorkingProgramService(
        IWorkingProgramService baseService,
        IHolidayService holidayService)
    {
        _baseService = baseService;
        _holidayService = holidayService;
    }
    
    public bool IsInWorkingHours(DateTime dateTime, IDictionary<string, object>? @params = null)
    {
        // Verifică dacă este sărbătoare
        if (_holidayService.IsHoliday(dateTime.Date))
        {
            return false;
        }
        
        return _baseService.IsInWorkingHours(dateTime, @params);
    }
    
    public DateTime? GetCurrentWorkingDayOpening(DateTime dateTime, IDictionary<string, object>? @params = null)
    {
        if (_holidayService.IsHoliday(dateTime.Date))
        {
            return null;
        }
        
        return _baseService.GetCurrentWorkingDayOpening(dateTime, @params);
    }
    
    public DateTime GetCurrentWorkingDayClosing(DateTime currentDate, IDictionary<string, object>? @params = null)
    {
        return _baseService.GetCurrentWorkingDayClosing(currentDate, @params);
    }
    
    public DateTime GetNextWorkingDayOpening(DateTime currentDate, IDictionary<string, object>? @params = null)
    {
        var nextDate = currentDate.AddDays(1);
        
        // Sari peste sărbători
        while (_holidayService.IsHoliday(nextDate.Date))
        {
            nextDate = nextDate.AddDays(1);
        }
        
        var opening = _baseService.GetCurrentWorkingDayOpening(nextDate, @params);
        if (opening.HasValue)
        {
            return opening.Value;
        }
        
        // Dacă nu e zi lucrătoare, continuă căutarea
        return GetNextWorkingDayOpening(nextDate, @params);
    }
}
```

### 9. Notificări bazate pe program

```csharp
public class WorkingHoursNotificationService
{
    private readonly IWorkingProgramService _workingProgram;
    private readonly INotificationService _notifications;
    
    public async Task SendWorkingHoursReminder()
    {
        var now = DateTime.Now;
        var closing = _workingProgram.GetCurrentWorkingDayClosing(now);
        var timeUntilClosing = closing - now;
        
        if (timeUntilClosing.TotalMinutes <= 30 && timeUntilClosing.TotalMinutes > 0)
        {
            await _notifications.SendToAll(new Notification
            {
                Title = "Program de lucru",
                Message = $"Birourile se închid în {timeUntilClosing.TotalMinutes:F0} minute",
                Type = NotificationType.Info
            });
        }
    }
    
    public async Task NotifyNextOpeningTime(string userId)
    {
        var now = DateTime.Now;
        
        if (!_workingProgram.IsInWorkingHours(now))
        {
            var nextOpening = _workingProgram.GetNextWorkingDayOpening(now);
            
            await _notifications.SendToUser(userId, new Notification
            {
                Title = "În afara programului",
                Message = $"Reveniți {nextOpening:dddd, dd MMMM} la ora {nextOpening:HH:mm}",
                Type = NotificationType.Warning
            });
        }
    }
}
```

### 10. Dashboard ore de lucru

```csharp
public class WorkingHoursDashboard
{
    private readonly IWorkingProgramService _workingProgram;
    
    public DashboardData GetDashboardData()
    {
        var now = DateTime.Now;
        var data = new DashboardData
        {
            CurrentTime = now,
            IsWorkingHours = _workingProgram.IsInWorkingHours(now)
        };
        
        if (data.IsWorkingHours)
        {
            var closing = _workingProgram.GetCurrentWorkingDayClosing(now);
            data.TimeUntilClosing = closing - now;
            data.ClosingTime = closing;
            data.Status = "Deschis";
            data.StatusColor = "green";
        }
        else
        {
            var nextOpening = _workingProgram.GetNextWorkingDayOpening(now);
            data.TimeUntilOpening = nextOpening - now;
            data.NextOpeningTime = nextOpening;
            data.Status = "Închis";
            data.StatusColor = "red";
        }
        
        // Programul săptămânii
        data.WeekSchedule = GetWeekSchedule();
        
        return data;
    }
    
    private List<DaySchedule> GetWeekSchedule()
    {
        var schedule = new List<DaySchedule>();
        var startOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + 1);
        
        for (int i = 0; i < 7; i++)
        {
            var date = startOfWeek.AddDays(i);
            var opening = _workingProgram.GetCurrentWorkingDayOpening(date);
            
            schedule.Add(new DaySchedule
            {
                Date = date,
                DayName = date.ToString("dddd"),
                IsWorkingDay = opening.HasValue,
                OpeningTime = opening,
                ClosingTime = opening.HasValue 
                    ? _workingProgram.GetCurrentWorkingDayClosing(date) 
                    : null
            });
        }
        
        return schedule;
    }
}
```

### 11. Testing

```csharp
[TestClass]
public class WorkingProgramServiceTests
{
    private EightToFiveWorkingProgramService _service;
    
    [TestInitialize]
    public void Setup()
    {
        _service = new EightToFiveWorkingProgramService();
    }
    
    [TestMethod]
    public void IsInWorkingHours_DuringBusinessHours_ReturnsTrue()
    {
        // Arrange
        var tuesday10AM = new DateTime(2024, 6, 25, 10, 0, 0);
        
        // Act
        var result = _service.IsInWorkingHours(tuesday10AM);
        
        // Assert
        Assert.IsTrue(result);
    }
    
    [TestMethod]
    public void IsInWorkingHours_Weekend_ReturnsFalse()
    {
        // Arrange
        var saturday = new DateTime(2024, 6, 29, 10, 0, 0);
        
        // Act
        var result = _service.IsInWorkingHours(saturday);
        
        // Assert
        Assert.IsFalse(result);
    }
    
    [TestMethod]
    public void GetNextWorkingDayOpening_Friday_ReturnsMonday()
    {
        // Arrange
        var friday = new DateTime(2024, 6, 28, 16, 0, 0);
        
        // Act
        var result = _service.GetNextWorkingDayOpening(friday);
        
        // Assert
        Assert.AreEqual(DayOfWeek.Monday, result.DayOfWeek);
        Assert.AreEqual(8, result.Hour);
    }
}
```

### 12. Model de configurare

```csharp
public class ConfigurationWorkingProgramServiceOptions
{
    public List<WorkingDay> WorkingDays { get; set; } = new();
}

public class WorkingDay
{
    public DayOfWeek Day { get; set; }
    public int OpenHours { get; set; }
    public int OpenMinutes { get; set; }
    public int CloseHours { get; set; }
    public int CloseMinutes { get; set; }
}
```

### 13. Best Practices

1. **Timezone awareness**: Folosiți UTC pentru aplicații internaționale
2. **Caching**: Cache-uiți rezultatele pentru date fixe (sărbători, program standard)
3. **Parametri consistenți**: Folosiți aceiași parametri pentru calcule legate
4. **Validare**: Validați că ora de închidere > ora de deschidere
5. **Flexibilitate**: Permiteți override prin parametri pentru cazuri speciale
6. **Logging**: Logați deciziile importante pentru debugging

### 14. Concluzie

`IWorkingProgramService` oferă o abstractizare flexibilă pentru gestionarea programului de lucru în aplicațiile FOD. Cu implementări multiple disponibile și suport pentru parametri personalizați, serviciul poate fi adaptat la diverse scenarii de business, de la program standard 8-17 până la programe complexe cu excepții și sărbători.