# Repository Pattern în Fod.Data

## Prezentare Generală

Repository Pattern oferă o abstractizare între logica de business și stratul de acces la date, permițând testare ușoară și schimbarea sursei de date fără a afecta logica aplicației.

## Concepte de Bază

### Generic Repository

```csharp
public interface IRepository<TEntity> where TEntity : class
{
    Task<TEntity> GetByIdAsync(int id);
    Task<IReadOnlyList<TEntity>> ListAllAsync();
    Task<TEntity> AddAsync(TEntity entity);
    Task UpdateAsync(TEntity entity);
    Task DeleteAsync(TEntity entity);
}
```

### Implementare de Bază

```csharp
public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
{
    protected readonly DbContext _context;
    
    public Repository(DbContext context)
    {
        _context = context;
    }
    
    public virtual async Task<TEntity> GetByIdAsync(int id)
    {
        return await _context.Set<TEntity>().FindAsync(id);
    }
    
    public async Task<IReadOnlyList<TEntity>> ListAllAsync()
    {
        return await _context.Set<TEntity>().ToListAsync();
    }
}
```

## Repository Specializate

### Repository cu Specifications

```csharp
public interface ISpecificationRepository<T> : IRepository<T> where T : class
{
    Task<T> GetBySpecAsync(ISpecification<T> spec);
    Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
    Task<int> CountAsync(ISpecification<T> spec);
}
```

### Repository pentru Entități Specifice

```csharp
public interface IUserRepository : IRepository<User>
{
    Task<User> GetByEmailAsync(string email);
    Task<IReadOnlyList<User>> GetActiveUsersAsync();
    Task<bool> EmailExistsAsync(string email);
}

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context) { }
    
    public async Task<User> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Email == email);
    }
}
```

## Utilizare în Servicii

```csharp
public class UserService
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    
    public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Email = dto.Email,
            Name = dto.Name
        };
        
        await _userRepository.AddAsync(user);
        await _unitOfWork.CompleteAsync();
        
        return _mapper.Map<UserDto>(user);
    }
}
```

## Best Practices

1. **Nu expuneți IQueryable** - Returnați întotdeauna liste concrete
2. **Folosiți Specifications** - Pentru query-uri complexe
3. **Async peste tot** - Pentru operațiuni I/O
4. **Repository per Aggregate Root** - Nu pentru fiecare entitate

## Concluzie

Repository Pattern oferă o abstractizare puternică pentru accesul la date, facilitând testarea și mentenanța codului.