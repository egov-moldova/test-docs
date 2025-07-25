# OrderNumberGenerator

## Documentație pentru serviciul OrderNumberGenerator

### 1. Descriere Generală

`OrderNumberGenerator` este un serviciu server-side care generează numere unice de comandă pentru cererile de servicii. Serviciul combină ID-ul serviciului, timestamp-ul curent și un număr aleatoriu pentru a crea identificatori unici și cronologici.

Caracteristici principale:
- Generare numere unice de comandă
- Încorporare timestamp pentru sortare cronologică
- Component aleatoriu pentru unicitate
- Format predictibil și consistent
- Utilizare `RandomNumberGenerator` criptografic sigur

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs (server-side)
builder.Services.AddScoped<IOrderNumberGenerator, OrderNumberGenerator>();

// În modulul Server.ServicesSetup
public static IServiceCollection AddServerServices(this IServiceCollection services)
{
    services.AddScoped<IOrderNumberGenerator, OrderNumberGenerator>();
    return services;
}
```

### 3. Interfață

```csharp
public interface IOrderNumberGenerator
{
    string Generate(string serviceId);
}
```

### 4. Metodă Disponibilă

#### Generate
Generează un număr unic de comandă bazat pe ID-ul serviciului.

**Parametri:**
- `serviceId` (string) - Identificatorul serviciului pentru care se generează numărul

**Returnează:**
- `string` - Număr de comandă în format: `{serviceId}{yyMMddHHmmss}{randomNumber}`

**Format număr generat:**
- Prefix: ID-ul serviciului (ex: "SR001")
- Timestamp: An(2)+Lună+Zi+Oră+Minut+Secundă (12 caractere)
- Sufix: Număr aleatoriu între 100-999 (3 caractere)

### 5. Exemple de Utilizare

#### Generare număr comandă simplu
```csharp
public class ServiceRequestController : ControllerBase
{
    private readonly IOrderNumberGenerator _orderNumberGenerator;
    
    public ServiceRequestController(IOrderNumberGenerator orderNumberGenerator)
    {
        _orderNumberGenerator = orderNumberGenerator;
    }
    
    [HttpPost("create")]
    public IActionResult CreateServiceRequest(ServiceRequestDto request)
    {
        // Generare număr comandă
        var orderNumber = _orderNumberGenerator.Generate(request.ServiceId);
        
        // Exemplu rezultat: "SR001240630143025487"
        // Unde: SR001 = serviceId
        //       240630 = 2024-06-30
        //       143025 = 14:30:25
        //       487 = număr aleatoriu
        
        var serviceRequest = new ServiceRequest
        {
            OrderNumber = orderNumber,
            ServiceId = request.ServiceId,
            CreatedAt = DateTime.Now
            // alte proprietăți...
        };
        
        _repository.Add(serviceRequest);
        
        return Ok(new { orderNumber });
    }
}
```

#### Generare pentru diferite servicii
```csharp
public class OrderService
{
    private readonly IOrderNumberGenerator _generator;
    
    public OrderService(IOrderNumberGenerator generator)
    {
        _generator = generator;
    }
    
    public void GenerateOrdersExample()
    {
        // Apostilă
        var apostillaOrder = _generator.Generate("APOST");
        // Rezultat: "APOST240630143025123"
        
        // Certificat
        var certificateOrder = _generator.Generate("CERT");
        // Rezultat: "CERT240630143025456"
        
        // Traducere
        var translationOrder = _generator.Generate("TRAD");
        // Rezultat: "TRAD240630143025789"
        
        // Serviciu personalizat
        var customOrder = _generator.Generate("CUSTOM-001");
        // Rezultat: "CUSTOM-001240630143025234"
    }
}
```

#### Batch generation cu garantare unicitate
```csharp
public class BatchOrderService
{
    private readonly IOrderNumberGenerator _generator;
    private readonly ILogger<BatchOrderService> _logger;
    
    public async Task<List<string>> GenerateBatchOrders(
        string serviceId, 
        int count)
    {
        var orders = new HashSet<string>();
        var attempts = 0;
        var maxAttempts = count * 10; // Protecție împotriva buclei infinite
        
        while (orders.Count < count && attempts < maxAttempts)
        {
            var orderNumber = _generator.Generate(serviceId);
            
            if (orders.Add(orderNumber))
            {
                _logger.LogInformation(
                    "Generated order number: {OrderNumber}", 
                    orderNumber);
            }
            else
            {
                // Foarte puțin probabil datorită componentei aleatorii
                _logger.LogWarning(
                    "Duplicate order number detected: {OrderNumber}", 
                    orderNumber);
            }
            
            attempts++;
            
            // Delay minim pentru a evita coliziuni de timestamp
            if (orders.Count < count)
            {
                await Task.Delay(1);
            }
        }
        
        return orders.ToList();
    }
}
```

### 6. Integrare cu alte servicii

#### Cu serviciul de cereri
```csharp
public class ServiceRequestService
{
    private readonly IOrderNumberGenerator _orderGenerator;
    private readonly IServiceRequestRepository _repository;
    private readonly INotificationService _notificationService;
    
    public ServiceRequestService(
        IOrderNumberGenerator orderGenerator,
        IServiceRequestRepository repository,
        INotificationService notificationService)
    {
        _orderGenerator = orderGenerator;
        _repository = repository;
        _notificationService = notificationService;
    }
    
    public async Task<ServiceRequestResult> CreateRequest(
        CreateServiceRequestDto dto)
    {
        // Generare număr comandă
        var orderNumber = _orderGenerator.Generate(dto.ServiceId);
        
        var request = new ServiceRequest
        {
            OrderNumber = orderNumber,
            ServiceId = dto.ServiceId,
            UserId = dto.UserId,
            Status = ServiceRequestStatus.New,
            CreatedAt = DateTime.UtcNow,
            Data = dto.Data
        };
        
        await _repository.AddAsync(request);
        
        // Notificare cu numărul de comandă
        await _notificationService.SendAsync(new Notification
        {
            UserId = dto.UserId,
            Subject = "Cerere înregistrată",
            Message = $"Cererea dvs. a fost înregistrată cu numărul: {orderNumber}"
        });
        
        return new ServiceRequestResult
        {
            Success = true,
            OrderNumber = orderNumber,
            RequestId = request.Id
        };
    }
}
```

#### Cu audit și tracking
```csharp
public class AuditableOrderService
{
    private readonly IOrderNumberGenerator _generator;
    private readonly IAuditService _auditService;
    
    public async Task<string> GenerateAuditedOrder(
        string serviceId, 
        string userId,
        Dictionary<string, object> metadata = null)
    {
        var orderNumber = _generator.Generate(serviceId);
        
        // Înregistrare audit
        await _auditService.LogAsync(new AuditEntry
        {
            Action = "OrderGenerated",
            EntityType = "ServiceRequest",
            EntityId = orderNumber,
            UserId = userId,
            Timestamp = DateTime.UtcNow,
            Details = new
            {
                ServiceId = serviceId,
                OrderNumber = orderNumber,
                Metadata = metadata
            }
        });
        
        return orderNumber;
    }
}
```

### 7. Parsare și validare numere generate

```csharp
public class OrderNumberParser
{
    public OrderNumberInfo Parse(string orderNumber)
    {
        if (string.IsNullOrEmpty(orderNumber) || orderNumber.Length < 15)
        {
            throw new ArgumentException("Invalid order number format");
        }
        
        // Extrage componentele
        var timestampStart = orderNumber.Length - 15; // 12 timestamp + 3 random
        var serviceId = orderNumber.Substring(0, timestampStart);
        var timestamp = orderNumber.Substring(timestampStart, 12);
        var randomPart = orderNumber.Substring(orderNumber.Length - 3);
        
        // Parsare timestamp
        var year = 2000 + int.Parse(timestamp.Substring(0, 2));
        var month = int.Parse(timestamp.Substring(2, 2));
        var day = int.Parse(timestamp.Substring(4, 2));
        var hour = int.Parse(timestamp.Substring(6, 2));
        var minute = int.Parse(timestamp.Substring(8, 2));
        var second = int.Parse(timestamp.Substring(10, 2));
        
        var dateTime = new DateTime(year, month, day, hour, minute, second);
        
        return new OrderNumberInfo
        {
            ServiceId = serviceId,
            GeneratedAt = dateTime,
            RandomComponent = randomPart,
            FullOrderNumber = orderNumber
        };
    }
}

public class OrderNumberInfo
{
    public string ServiceId { get; set; }
    public DateTime GeneratedAt { get; set; }
    public string RandomComponent { get; set; }
    public string FullOrderNumber { get; set; }
}
```

### 8. Implementare personalizată

```csharp
public class CustomOrderNumberGenerator : IOrderNumberGenerator
{
    private readonly IConfiguration _configuration;
    private readonly ISystemClock _clock;
    
    public CustomOrderNumberGenerator(
        IConfiguration configuration,
        ISystemClock clock)
    {
        _configuration = configuration;
        _clock = clock;
    }
    
    public string Generate(string serviceId)
    {
        var prefix = _configuration["OrderNumber:Prefix"] ?? "";
        var separator = _configuration["OrderNumber:Separator"] ?? "-";
        var includeMilliseconds = _configuration.GetValue<bool>("OrderNumber:IncludeMilliseconds");
        
        var now = _clock.UtcNow;
        var timestamp = includeMilliseconds 
            ? now.ToString("yyMMddHHmmssfff")
            : now.ToString("yyMMddHHmmss");
        
        var random = GenerateSecureRandom();
        
        return $"{prefix}{serviceId}{separator}{timestamp}{separator}{random}";
    }
    
    private string GenerateSecureRandom()
    {
        // Folosește 4 cifre pentru mai multă unicitate
        return RandomNumberGenerator.GetInt32(1000, 9999).ToString();
    }
}
```

### 9. Best Practices

1. **Unicitate**: Deși generatorul include o componentă aleatorie, pentru aplicații critice considerați verificarea unicității în baza de date
2. **Timezone**: Utilizați UTC pentru aplicații internaționale
3. **Format consistent**: Păstrați același format pentru toate serviciile pentru a facilita parsarea
4. **Stocare**: Indexați câmpul orderNumber în baza de date pentru căutări rapide
5. **Validare**: Implementați validare pentru a detecta numere de comandă invalide sau modificate

### 10. Testing

```csharp
[TestClass]
public class OrderNumberGeneratorTests
{
    private readonly IOrderNumberGenerator _generator = new OrderNumberGenerator();
    
    [TestMethod]
    public void Generate_ReturnsCorrectFormat()
    {
        // Arrange
        var serviceId = "TEST";
        
        // Act
        var result = _generator.Generate(serviceId);
        
        // Assert
        Assert.IsTrue(result.StartsWith(serviceId));
        Assert.AreEqual(serviceId.Length + 15, result.Length);
        
        // Verificare componentă numerică
        var numericPart = result.Substring(serviceId.Length);
        Assert.IsTrue(long.TryParse(numericPart, out _));
    }
    
    [TestMethod]
    public void Generate_ProducesUniqueNumbers()
    {
        // Arrange
        var serviceId = "TEST";
        var numbers = new HashSet<string>();
        
        // Act
        for (int i = 0; i < 100; i++)
        {
            var number = _generator.Generate(serviceId);
            numbers.Add(number);
            Thread.Sleep(1); // Asigură timestamp diferit
        }
        
        // Assert
        Assert.AreEqual(100, numbers.Count);
    }
}
```

### 11. Concluzie

`OrderNumberGenerator` oferă o soluție simplă și eficientă pentru generarea de numere unice de comandă în aplicațiile FOD. Cu format predictibil care include informații despre timp și serviciu, facilitează atât identificarea unică cât și sortarea cronologică a cererilor. Componenta aleatorie criptografic sigură asigură unicitate chiar și pentru cereri generate în același moment.