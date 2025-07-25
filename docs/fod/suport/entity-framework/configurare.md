# Configurare Entity Framework

## Prezentare Generală

Această pagină detaliază procesul de configurare a FOD.EntityFramework în aplicațiile dvs., incluzând setarea contextului bazei de date, configurarea conexiunii și opțiunile avansate.

## Configurare de Bază

### 1. Instalare Pachete

```bash
dotnet add package FOD.EntityFramework
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
```

### 2. Configurare DbContext

```csharp
public class ApplicationDbContext : FodDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets pentru entitățile dvs.
    public DbSet<FodRequest> Requests { get; set; }
    public DbSet<FodService> Services { get; set; }
    public DbSet<UserProfile> Users { get; set; }
}
```

### 3. Înregistrare în Program.cs

```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptions =>
        {
            sqlServerOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
            sqlServerOptions.CommandTimeout(30);
        });
    
    // Opțiuni pentru development
    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});
```

## Configurare Avansată

### Connection Resiliency

```csharp
options.UseSqlServer(connectionString, sqlOptions =>
{
    sqlOptions.EnableRetryOnFailure(
        maxRetryCount: 5,
        maxRetryDelay: TimeSpan.FromSeconds(30),
        errorNumbersToAdd: new[] { 2601, 2627, 547, 8152 });
});
```

### Query Tracking

```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString);
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTrackingWithIdentityResolution);
});
```

### Interceptors

```csharp
builder.Services.AddSingleton<AuditInterceptor>();
builder.Services.AddSingleton<PerformanceInterceptor>();

builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
{
    options.UseSqlServer(connectionString)
           .AddInterceptors(
               serviceProvider.GetRequiredService<AuditInterceptor>(),
               serviceProvider.GetRequiredService<PerformanceInterceptor>());
});
```

## Configurare pentru Diferite Medii

### Development

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=FodDb_Dev;Trusted_Connection=True;"
  }
}
```

### Production

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=prod-server;Database=FodDb;User Id=app_user;Password={secret};Encrypt=True;"
  }
}
```

### Utilizare Azure Key Vault

```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{builder.Configuration["KeyVaultName"]}.vault.azure.net/"),
    new DefaultAzureCredential());

var connectionString = builder.Configuration["ConnectionStrings:DefaultConnection"];
```

## Health Checks

```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>(
        name: "database",
        failureStatus: HealthStatus.Unhealthy,
        tags: new[] { "db", "sql", "sqlserver" });
```

## Logging și Monitoring

### Configurare Logging

```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString)
           .LogTo(Console.WriteLine, LogLevel.Information)
           .EnableServiceProviderCaching();
});
```

### Custom Log Filter

```csharp
options.LogTo(
    Console.WriteLine,
    (eventId, logLevel) => logLevel >= LogLevel.Warning || 
                           eventId.Id == RelationalEventId.CommandExecuted.Id,
    DbContextLoggerOptions.DefaultWithLocalTime);
```

## Multi-Tenancy

```csharp
public class TenantAwareDbContext : FodDbContext
{
    private readonly ITenantService _tenantService;
    
    public TenantAwareDbContext(
        DbContextOptions options,
        ITenantService tenantService) : base(options)
    {
        _tenantService = tenantService;
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Global query filter pentru tenant
        modelBuilder.Entity<BaseEntity>()
            .HasQueryFilter(e => e.TenantId == _tenantService.CurrentTenantId);
    }
}
```

## Performance Optimization

### Connection Pooling

```csharp
services.AddDbContextPool<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString);
}, poolSize: 128);
```

### Compiled Models

```csharp
// În proiectul dvs., rulați:
// dotnet ef dbcontext optimize -c ApplicationDbContext -o CompiledModels

options.UseModel(ApplicationDbContextModel.Instance);
```

## Troubleshooting

### Probleme Comune

1. **Connection Timeout**
   ```csharp
   sqlOptions.CommandTimeout(60); // 60 secunde
   ```

2. **Memory Leaks**
   ```csharp
   // Folosiți DbContextPool
   services.AddDbContextPool<ApplicationDbContext>(options => ...);
   ```

3. **Slow Queries**
   ```csharp
   options.ConfigureWarnings(warnings =>
       warnings.Log(RelationalEventId.QueryPossibleUnintendedUseOfEqualsWarning));
   ```

## Concluzie

Configurarea corectă a Entity Framework este esențială pentru performanța și fiabilitatea aplicației. Urmați aceste ghiduri pentru a asigura o configurare optimă pentru nevoile dvs. specifice.