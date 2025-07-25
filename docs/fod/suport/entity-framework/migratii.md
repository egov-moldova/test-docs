# Migrații Entity Framework

## Prezentare Generală

Migrațiile Entity Framework Core permit versionarea și actualizarea schemei bazei de date în mod controlat și reproductibil. Această pagină documentează procesul de lucru cu migrații în contextul FOD.Components.

## Concepte de Bază

### Ce sunt Migrațiile?

Migrațiile sunt un mod de a păstra schema bazei de date sincronizată cu modelul EF Core, păstrând în același timp datele existente. Fiecare migrație reprezintă o versiune a schemei bazei de date.

### Structura unei Migrații

```csharp
public partial class AddUserTable : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Modificări pentru upgrade
    }
    
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // Modificări pentru rollback
    }
}
```

## Comenzi pentru Migrații

### 1. Creare Migrație Nouă

```bash
# Package Manager Console
Add-Migration InitialCreate -Context ApplicationDbContext

# .NET CLI
dotnet ef migrations add InitialCreate --context ApplicationDbContext

# Cu output directory specific
dotnet ef migrations add AddUserRoles --context ApplicationDbContext --output-dir Data/Migrations
```

### 2. Actualizare Bază de Date

```bash
# Aplică toate migrațiile în așteptare
dotnet ef database update

# Aplică până la o migrație specifică
dotnet ef database update AddUserRoles

# Rollback la o migrație anterioară
dotnet ef database update PreviousMigration
```

### 3. Eliminare Ultimă Migrație

```bash
# Elimină ultima migrație (doar dacă nu a fost aplicată)
dotnet ef migrations remove

# Forțează eliminarea
dotnet ef migrations remove --force
```

### 4. Generare Script SQL

```bash
# Script pentru toate migrațiile
dotnet ef migrations script

# Script între două migrații
dotnet ef migrations script AddUserTable AddUserRoles

# Script idempotent
dotnet ef migrations script --idempotent --output migrations.sql
```

## Exemple Practice

### 1. Adăugare Tabel Nou

```csharp
public partial class AddDepartmentTable : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Departments",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Name = table.Column<string>(maxLength: 100, nullable: false),
                Code = table.Column<string>(maxLength: 10, nullable: false),
                Description = table.Column<string>(maxLength: 500, nullable: true),
                IsActive = table.Column<bool>(nullable: false, defaultValue: true),
                CreatedAt = table.Column<DateTime>(nullable: false, defaultValueSql: "GETUTCDATE()"),
                CreatedBy = table.Column<string>(maxLength: 100, nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Departments", x => x.Id);
            });
            
        migrationBuilder.CreateIndex(
            name: "IX_Departments_Code",
            table: "Departments",
            column: "Code",
            unique: true);
    }
    
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Departments");
    }
}
```

### 2. Modificare Coloană

```csharp
public partial class ModifyUserEmailColumn : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Mărește lungimea maximă
        migrationBuilder.AlterColumn<string>(
            name: "Email",
            table: "Users",
            maxLength: 256,
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(100)",
            oldMaxLength: 100);
            
        // Adaugă index unic
        migrationBuilder.CreateIndex(
            name: "IX_Users_Email",
            table: "Users",
            column: "Email",
            unique: true);
    }
    
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_Users_Email",
            table: "Users");
            
        migrationBuilder.AlterColumn<string>(
            name: "Email",
            table: "Users",
            type: "nvarchar(100)",
            maxLength: 100,
            nullable: false,
            oldClrType: typeof(string),
            oldMaxLength: 256);
    }
}
```

### 3. Adăugare Foreign Key

```csharp
public partial class AddDepartmentToEmployee : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<int>(
            name: "DepartmentId",
            table: "Employees",
            nullable: false,
            defaultValue: 1); // Departament implicit
            
        migrationBuilder.CreateIndex(
            name: "IX_Employees_DepartmentId",
            table: "Employees",
            column: "DepartmentId");
            
        migrationBuilder.AddForeignKey(
            name: "FK_Employees_Departments_DepartmentId",
            table: "Employees",
            column: "DepartmentId",
            principalTable: "Departments",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }
    
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Employees_Departments_DepartmentId",
            table: "Employees");
            
        migrationBuilder.DropIndex(
            name: "IX_Employees_DepartmentId",
            table: "Employees");
            
        migrationBuilder.DropColumn(
            name: "DepartmentId",
            table: "Employees");
    }
}
```

## Migrații cu Date (Seed Data)

### 1. Date Inițiale

```csharp
public partial class SeedInitialData : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Insert roles
        migrationBuilder.InsertData(
            table: "Roles",
            columns: new[] { "Id", "Name", "Description", "CreatedAt", "CreatedBy" },
            values: new object[,]
            {
                { 1, "Administrator", "Full system access", new DateTime(2024, 1, 1), "System" },
                { 2, "Manager", "Department management", new DateTime(2024, 1, 1), "System" },
                { 3, "User", "Standard user access", new DateTime(2024, 1, 1), "System" }
            });
            
        // Insert departments
        migrationBuilder.InsertData(
            table: "Departments",
            columns: new[] { "Id", "Name", "Code", "IsActive" },
            values: new object[,]
            {
                { 1, "IT", "IT", true },
                { 2, "HR", "HR", true },
                { 3, "Finance", "FIN", true }
            });
    }
    
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DeleteData(table: "Roles", keyColumn: "Id", keyValue: 1);
        migrationBuilder.DeleteData(table: "Roles", keyColumn: "Id", keyValue: 2);
        migrationBuilder.DeleteData(table: "Roles", keyColumn: "Id", keyValue: 3);
        
        migrationBuilder.DeleteData(table: "Departments", keyColumn: "Id", keyValue: 1);
        migrationBuilder.DeleteData(table: "Departments", keyColumn: "Id", keyValue: 2);
        migrationBuilder.DeleteData(table: "Departments", keyColumn: "Id", keyValue: 3);
    }
}
```

### 2. Migrare Date Existente

```csharp
public partial class MigrateUserData : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Adaugă coloană nouă
        migrationBuilder.AddColumn<string>(
            name: "FullName",
            table: "Users",
            maxLength: 200,
            nullable: true);
            
        // Migrează datele
        migrationBuilder.Sql(@"
            UPDATE Users 
            SET FullName = FirstName + ' ' + LastName
            WHERE FirstName IS NOT NULL AND LastName IS NOT NULL
        ");
        
        // Fă coloana required după migrare
        migrationBuilder.AlterColumn<string>(
            name: "FullName",
            table: "Users",
            maxLength: 200,
            nullable: false,
            defaultValue: "");
            
        // Elimină coloanele vechi
        migrationBuilder.DropColumn(name: "FirstName", table: "Users");
        migrationBuilder.DropColumn(name: "LastName", table: "Users");
    }
}
```

## Strategii de Deployment

### 1. Automatic Migration

```csharp
public class Program
{
    public static async Task Main(string[] args)
    {
        var host = CreateHostBuilder(args).Build();
        
        using (var scope = host.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            try
            {
                await context.Database.MigrateAsync();
                await SeedDatabase(context);
            }
            catch (Exception ex)
            {
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred while migrating the database.");
                throw;
            }
        }
        
        await host.RunAsync();
    }
}
```

### 2. Manual Migration cu Verificare

```csharp
public class MigrationService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<MigrationService> _logger;
    
    public async Task<bool> ApplyMigrationsAsync()
    {
        try
        {
            var pendingMigrations = await _context.Database.GetPendingMigrationsAsync();
            
            if (pendingMigrations.Any())
            {
                _logger.LogInformation($"Applying {pendingMigrations.Count()} migrations...");
                
                await _context.Database.MigrateAsync();
                
                _logger.LogInformation("Migrations applied successfully.");
                return true;
            }
            
            _logger.LogInformation("No pending migrations.");
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to apply migrations.");
            throw;
        }
    }
}
```

### 3. Script-Based Deployment

```bash
# Generare script pentru production
dotnet ef migrations script --idempotent --output ./scripts/update-database.sql

# Aplicare cu sqlcmd
sqlcmd -S server -d database -U user -P password -i update-database.sql
```

## Best Practices

### 1. Convenții de Numire

```bash
# Folosiți nume descriptive
Add-Migration AddUserAuthenticationFields
Add-Migration CreateInvoiceTable
Add-Migration AddIndexToOrderNumber
```

### 2. Migrații Atomice

```csharp
// ✅ Bine - O singură responsabilitate
public partial class AddEmailToUser : Migration { }

// ❌ Evitați - Multiple responsabilități
public partial class AddEmailToUserAndCreateProductTableAndModifyOrders : Migration { }
```

### 3. Testare Migrații

```csharp
[TestClass]
public class MigrationTests
{
    [TestMethod]
    public async Task AllMigrations_ShouldApplySuccessfully()
    {
        using var context = new TestDbContext();
        
        // Drop și recreează baza de date
        await context.Database.EnsureDeletedAsync();
        await context.Database.MigrateAsync();
        
        // Verifică că toate tabelele există
        var tables = await context.Database.SqlQuery<string>(
            $"SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
        ).ToListAsync();
        
        Assert.IsTrue(tables.Contains("Users"));
        Assert.IsTrue(tables.Contains("Departments"));
    }
}
```

## Troubleshooting

### Probleme Comune

1. **"The migration has already been applied"**
   ```bash
   # Verificați migrațiile aplicate
   dotnet ef migrations list
   
   # Resetați la o migrație anterioară
   dotnet ef database update PreviousMigration
   ```

2. **"Cannot drop table because it is referenced by a FOREIGN KEY"**
   ```csharp
   // Eliminați mai întâi foreign key
   migrationBuilder.DropForeignKey(name: "FK_Orders_Users_UserId", table: "Orders");
   // Apoi eliminați tabelul
   migrationBuilder.DropTable(name: "Users");
   ```

3. **Conflicte de migrații în echipă**
   ```bash
   # Rezolvați conflictele manual
   # Re-generați migrația
   dotnet ef migrations remove
   dotnet ef migrations add ResolvedMigration
   ```

## Concluzie

Migrațiile sunt un instrument esențial pentru gestionarea evoluției schemei bazei de date. Urmând best practices și înțelegând comenzile disponibile, puteți gestiona eficient schimbările în baza de date pe parcursul ciclului de viață al aplicației.