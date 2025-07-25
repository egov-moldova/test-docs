# Data Transfer Objects (DTOs)

## Prezentare Generală

DTOs (Data Transfer Objects) sunt obiecte simple utilizate pentru transferul datelor între diferite straturi ale aplicației, în special între API și client. Acestea oferă o separare clară între modelele de domeniu și datele expuse extern.

## De ce să folosim DTOs?

### Beneficii

1. **Securitate** - Controlați exact ce date sunt expuse
2. **Performanță** - Transferați doar datele necesare
3. **Versionare API** - Modificați DTOs fără a afecta entitățile
4. **Validare** - Reguli de validare specifice pentru input
5. **Flexibilitate** - Structuri diferite pentru scenarii diferite

## Tipuri de DTOs

### 1. Request DTOs

```csharp
public class CreateUserDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; }
    
    [Required]
    [MinLength(8)]
    public string Password { get; set; }
    
    public List<int> RoleIds { get; set; }
}

public class UpdateUserDto
{
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; }
    
    public bool? IsActive { get; set; }
    
    public List<int> RoleIds { get; set; }
}
```

### 2. Response DTOs

```csharp
public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<RoleDto> Roles { get; set; }
}

public class UserSummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}
```

### 3. Nested DTOs

```csharp
public class OrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public CustomerDto Customer { get; set; }
    public List<OrderItemDto> Items { get; set; }
    public decimal TotalAmount { get; set; }
}

public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal => Quantity * UnitPrice;
}
```

## Mapping între Entități și DTOs

### 1. AutoMapper

```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Simple mapping
        CreateMap<User, UserDto>();
        
        // Custom mapping
        CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
            
        // Nested mapping
        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.TotalAmount, 
                opt => opt.MapFrom(src => src.Items.Sum(i => i.Quantity * i.UnitPrice)));
    }
}
```

### 2. Manual Mapping

```csharp
public static class UserMapper
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            Roles = user.UserRoles?.Select(ur => ur.Role.ToDto()).ToList()
        };
    }
    
    public static User ToEntity(this CreateUserDto dto)
    {
        return new User
        {
            Email = dto.Email,
            Name = dto.Name,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
    }
}
```

## Validare DTOs

### 1. Data Annotations

```csharp
public class ProductDto : IValidatableObject
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    
    [Range(0.01, 999999.99)]
    public decimal Price { get; set; }
    
    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
    
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Price <= 0 && Stock > 0)
        {
            yield return new ValidationResult(
                "Products with stock must have a price",
                new[] { nameof(Price) });
        }
    }
}
```

### 2. FluentValidation

```csharp
public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
{
    public CreateOrderDtoValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty()
            .WithMessage("Customer is required");
            
        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("Order must have at least one item");
            
        RuleForEach(x => x.Items).SetValidator(new OrderItemDtoValidator());
        
        RuleFor(x => x.DeliveryDate)
            .GreaterThan(DateTime.Now)
            .When(x => x.DeliveryDate.HasValue);
    }
}
```

## Paginare cu DTOs

```csharp
public class PagedRequest
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string SortBy { get; set; }
    public bool IsDescending { get; set; }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPrevious => PageNumber > 1;
    public bool HasNext => PageNumber < TotalPages;
}
```

## DTOs pentru Operațiuni Complexe

### 1. Bulk Operations

```csharp
public class BulkUpdateDto<T>
{
    public List<int> Ids { get; set; }
    public T Updates { get; set; }
}

public class BulkOperationResult
{
    public int SuccessCount { get; set; }
    public int FailureCount { get; set; }
    public List<string> Errors { get; set; }
}
```

### 2. Search și Filtrare

```csharp
public class SearchRequestDto
{
    public string SearchTerm { get; set; }
    public Dictionary<string, string> Filters { get; set; }
    public List<string> IncludeFields { get; set; }
    public PagedRequest Pagination { get; set; }
}
```

## Best Practices

### 1. **Naming Conventions**
- Suffix cu `Dto` pentru claritate
- `CreateXDto`, `UpdateXDto` pentru operațiuni
- `XSummaryDto`, `XDetailDto` pentru nivele de detaliu

### 2. **Granularitate**
- DTOs specifice pentru fiecare operațiune
- Nu reutilizați DTOs între Create/Update dacă au câmpuri diferite

### 3. **Imutabilitate**
```csharp
public class ImmutableUserDto
{
    public ImmutableUserDto(int id, string name, string email)
    {
        Id = id;
        Name = name;
        Email = email;
    }
    
    public int Id { get; }
    public string Name { get; }
    public string Email { get; }
}
```

### 4. **Null Safety**
```csharp
public class SafeUserDto
{
    public string Name { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
    public DateTime? LastLoginDate { get; set; }
}
```

## Concluzie

DTOs sunt esențiale pentru o arhitectură curată și scalabilă. Ele oferă flexibilitate, securitate și performanță, permițând evoluția independentă a diferitelor straturi ale aplicației.