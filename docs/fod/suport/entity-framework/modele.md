# Modele Entity Framework

## Prezentare Generală

Modelele Entity Framework în FOD.Components urmează o structură standardizată care asigură consistență, auditabilitate și ușurință în întreținere. Această pagină descrie convențiile și pattern-urile utilizate pentru definirea entităților.

## Entitatea de Bază

### BaseEntity

Toate entitățile din sistem moștenesc din `BaseEntity`:

```csharp
public abstract class BaseEntity
{
    public int Id { get; set; }
    
    // Audit fields
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string UpdatedBy { get; set; }
    
    // Soft delete
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string DeletedBy { get; set; }
    
    // Concurrency control
    [Timestamp]
    public byte[] RowVersion { get; set; }
}
```

## Tipuri de Entități

### 1. Entități de Domeniu

```csharp
public class FodRequest : BaseEntity
{
    // Primary data
    public string RequestNumber { get; set; }
    public RequestStatus Status { get; set; }
    public DateTime SubmittedAt { get; set; }
    
    // Foreign keys
    public int ServiceId { get; set; }
    public int UserId { get; set; }
    
    // Navigation properties
    public virtual FodService Service { get; set; }
    public virtual UserProfile User { get; set; }
    public virtual ICollection<FodRequestFile> Files { get; set; }
    
    // Computed properties
    [NotMapped]
    public bool IsExpired => SubmittedAt.AddDays(30) < DateTime.UtcNow;
}
```

### 2. Entități de Relație (Many-to-Many)

```csharp
public class UserRole : BaseEntity
{
    public int UserId { get; set; }
    public int RoleId { get; set; }
    public DateTime AssignedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    
    public virtual UserProfile User { get; set; }
    public virtual Role Role { get; set; }
}
```

### 3. Entități de Configurare

```csharp
public class SystemConfiguration : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Key { get; set; }
    
    [Required]
    public string Value { get; set; }
    
    [MaxLength(500)]
    public string Description { get; set; }
    
    public ConfigurationScope Scope { get; set; }
    public bool IsEncrypted { get; set; }
}
```

## Value Objects

### 1. Embedded Objects

```csharp
[Owned]
public class Address
{
    public string Street { get; set; }
    public string City { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
    
    public string FullAddress => $"{Street}, {City} {PostalCode}, {Country}";
}

public class UserProfile : BaseEntity
{
    public string Name { get; set; }
    public Address HomeAddress { get; set; } // Owned type
    public Address WorkAddress { get; set; }
}
```

### 2. Complex Types

```csharp
[ComplexType]
public class Money
{
    public decimal Amount { get; set; }
    public string Currency { get; set; }
    
    public static Money operator +(Money a, Money b)
    {
        if (a.Currency != b.Currency)
            throw new InvalidOperationException("Cannot add different currencies");
            
        return new Money { Amount = a.Amount + b.Amount, Currency = a.Currency };
    }
}
```

## Configurare Entități

### 1. Fluent API Configuration

```csharp
public class FodRequestConfiguration : IEntityTypeConfiguration<FodRequest>
{
    public void Configure(EntityTypeBuilder<FodRequest> builder)
    {
        // Table mapping
        builder.ToTable("FodRequests", "dbo");
        
        // Primary key
        builder.HasKey(e => e.Id);
        
        // Properties
        builder.Property(e => e.RequestNumber)
            .IsRequired()
            .HasMaxLength(50)
            .HasColumnType("varchar(50)");
            
        builder.Property(e => e.Status)
            .HasConversion<string>()
            .HasMaxLength(20);
            
        // Indexes
        builder.HasIndex(e => e.RequestNumber)
            .IsUnique()
            .HasDatabaseName("IX_FodRequests_RequestNumber");
            
        builder.HasIndex(e => new { e.ServiceId, e.Status })
            .HasDatabaseName("IX_FodRequests_ServiceId_Status");
            
        // Relationships
        builder.HasOne(e => e.Service)
            .WithMany(s => s.Requests)
            .HasForeignKey(e => e.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);
            
        // Query filters
        builder.HasQueryFilter(e => !e.IsDeleted);
    }
}
```

### 2. Data Annotations

```csharp
[Table("Services", Schema = "fod")]
public class FodService : BaseEntity
{
    [Required]
    [StringLength(100)]
    [Column("ServiceName")]
    public string Name { get; set; }
    
    [StringLength(500)]
    public string Description { get; set; }
    
    [Required]
    [Range(0, 99999.99)]
    [Column(TypeName = "decimal(7,2)")]
    public decimal BaseCost { get; set; }
    
    [ConcurrencyCheck]
    public int Version { get; set; }
}
```

## Enumerații și Tipuri

### 1. Enumerații Simple

```csharp
public enum RequestStatus
{
    [Display(Name = "În așteptare")]
    Pending = 1,
    
    [Display(Name = "În procesare")]
    Processing = 2,
    
    [Display(Name = "Aprobat")]
    Approved = 3,
    
    [Display(Name = "Respins")]
    Rejected = 4,
    
    [Display(Name = "Finalizat")]
    Completed = 5,
    
    [Display(Name = "Anulat")]
    Cancelled = 6
}
```

### 2. Enum Converters

```csharp
public class RequestStatusConverter : ValueConverter<RequestStatus, string>
{
    public RequestStatusConverter() 
        : base(
            v => v.ToString(),
            v => (RequestStatus)Enum.Parse(typeof(RequestStatus), v))
    {
    }
}

// În configurare
builder.Property(e => e.Status)
    .HasConversion(new RequestStatusConverter());
```

## Relații

### 1. One-to-Many

```csharp
public class Department : BaseEntity
{
    public string Name { get; set; }
    
    // One department has many employees
    public virtual ICollection<Employee> Employees { get; set; }
}

public class Employee : BaseEntity
{
    public string Name { get; set; }
    
    // Foreign key
    public int DepartmentId { get; set; }
    
    // Many employees belong to one department
    public virtual Department Department { get; set; }
}
```

### 2. Many-to-Many

```csharp
public class Student : BaseEntity
{
    public string Name { get; set; }
    public virtual ICollection<StudentCourse> StudentCourses { get; set; }
}

public class Course : BaseEntity
{
    public string Title { get; set; }
    public virtual ICollection<StudentCourse> StudentCourses { get; set; }
}

public class StudentCourse
{
    public int StudentId { get; set; }
    public int CourseId { get; set; }
    public DateTime EnrolledDate { get; set; }
    public decimal? Grade { get; set; }
    
    public virtual Student Student { get; set; }
    public virtual Course Course { get; set; }
}
```

### 3. One-to-One

```csharp
public class User : BaseEntity
{
    public string Email { get; set; }
    public virtual UserProfile Profile { get; set; }
}

public class UserProfile : BaseEntity
{
    public int UserId { get; set; }
    public string FullName { get; set; }
    public DateTime? DateOfBirth { get; set; }
    
    public virtual User User { get; set; }
}

// Configuration
builder.HasOne(u => u.Profile)
    .WithOne(p => p.User)
    .HasForeignKey<UserProfile>(p => p.UserId);
```

## Inheritance Strategies

### 1. Table per Hierarchy (TPH)

```csharp
public abstract class Payment : BaseEntity
{
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string Discriminator { get; set; }
}

public class CreditCardPayment : Payment
{
    public string CardNumber { get; set; }
    public string CardHolderName { get; set; }
}

public class BankTransferPayment : Payment
{
    public string AccountNumber { get; set; }
    public string BankName { get; set; }
}

// Configuration
modelBuilder.Entity<Payment>()
    .HasDiscriminator<string>("Discriminator")
    .HasValue<CreditCardPayment>("CreditCard")
    .HasValue<BankTransferPayment>("BankTransfer");
```

### 2. Table per Type (TPT)

```csharp
[Table("Vehicles")]
public abstract class Vehicle : BaseEntity
{
    public string Manufacturer { get; set; }
    public string Model { get; set; }
}

[Table("Cars")]
public class Car : Vehicle
{
    public int NumberOfDoors { get; set; }
    public FuelType FuelType { get; set; }
}

[Table("Motorcycles")]
public class Motorcycle : Vehicle
{
    public int EngineCC { get; set; }
    public bool HasSidecar { get; set; }
}
```

## Validare

### 1. Validation Attributes

```csharp
public class ContactForm : BaseEntity
{
    [Required(ErrorMessage = "Numele este obligatoriu")]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; }
    
    [Required]
    [EmailAddress(ErrorMessage = "Email invalid")]
    public string Email { get; set; }
    
    [Phone(ErrorMessage = "Număr de telefon invalid")]
    public string Phone { get; set; }
    
    [Required]
    [StringLength(1000, MinimumLength = 10)]
    public string Message { get; set; }
}
```

### 2. Custom Validation

```csharp
public class FutureDate : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value is DateTime date && date <= DateTime.Now)
        {
            return new ValidationResult("Data trebuie să fie în viitor");
        }
        
        return ValidationResult.Success;
    }
}

public class Appointment : BaseEntity
{
    [FutureDate]
    public DateTime ScheduledDate { get; set; }
}
```

## Best Practices

### 1. Naming Conventions

- Folosiți PascalCase pentru numele claselor și proprietăților
- Folosiți substantive la singular pentru entități
- Folosiți substantive la plural pentru colecții
- Prefixați cu "I" pentru interfețe

### 2. Navigation Properties

- Marcați întotdeauna ca `virtual` pentru lazy loading
- Inițializați colecțiile în constructor
- Folosiți `ICollection<T>` pentru colecții

### 3. Performance

- Evitați proprietățile calculate complexe
- Folosiți indexuri pentru câmpurile frecvent interogate
- Considerați denormalizarea pentru query-uri complexe

## Concluzie

Modelele bine structurate sunt fundamentul unei aplicații robuste. Urmând aceste convenții și pattern-uri, veți crea o bază de cod consistentă și ușor de întreținut.