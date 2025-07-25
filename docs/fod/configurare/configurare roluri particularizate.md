## Configurare roluri și contexte particularizate

### Descriere
FOD oferă un model dinamic pentru generarea contextelor utilizatorului, permițând personalizarea acestora în funcție de cerințele aplicației. Prin implementarea interfeței `IUserContextProvider`, dezvoltatorii pot adapta informațiile utilizatorilor pentru a respecta diferite scenarii operaționale, cum ar fi administrarea tehnică, gestionarea organizațiilor și rolurile de execuție.

### Implementare

#### 1. Crearea clasei `CustomUserContextProvider`
Pentru a personaliza contextul utilizatorului în FOD, este necesară crearea unei clase care implementează `IUserContextProvider`. Aceasta trebuie să definească metoda asincronă:

```csharp
Task<IEnumerable<UserContext>> Get();
```

Mai jos este un exemplu de implementare a acestei interfețe într-o clasă numită `CustomUserContextProvider`, care extrage contextul utilizatorului pe baza revendicărilor (Claims) disponibile în `HttpContext`.

```csharp
public class CustomUserContextProvider : IUserContextProvider
{
    private readonly string ORGANIZATION_EXECUTOR_TYPE = "Executor";
    private readonly string ORGANIZATION_PA_ADMINISTRATOR_TYPE = "Administrator Autoritate Publica";
    private const int IDNO_LENGTH = 13;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CustomUserContextProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<IEnumerable<UserContext>> Get()
    {
        var user = _httpContextAccessor?.HttpContext?.User;
        var result = new List<UserContext>();
        result.AddRange(ExtractTechnicalAdministrator(user));
        result.AddRange(ExtractPAAdministrators(user));
        result.AddRange(ExtractExecutors(user));
        return await Task.FromResult(result);
    }

    private IEnumerable<UserContext> ExtractExecutors(ClaimsPrincipal principal)
    {
        var organizationClaims = principal.Claims.Where(sr => sr.Type == ORGANIZATION_EXECUTOR_TYPE || sr.Type == "Executor AP");
        return organizationClaims.Select(sr =>
        {
            var organization = ExtractOrganizationIDNO(sr.Value);
            var userContext = new UserContext()
            {
                ContextId = organization.IDNO + "_Executor",
                ContextType = UserContextType.System,
                ContextName = organization.Organization,
                ContextRole = "Executor",
                UserId = principal.FindFirst("Username")?.Value,
                UserFirstName = principal.FindFirst("FirstName")?.Value,
                UserLastName = principal.FindFirst("LastName")?.Value,
                Role = "Executor"
            };
            userContext.Attributes.Add(new KeyValuePair<string, string>("IDNO", organization.IDNO));
            userContext.Attributes.Add(new KeyValuePair<string, string>("OrganizationName", organization.Organization));
            return userContext;
        });
    }

    private IEnumerable<UserContext> ExtractTechnicalAdministrator(ClaimsPrincipal principal)
    {
        var organizationClaims = principal.Claims.Where(sr => sr.Type == "Role" && sr.Value == "AdministratorTehnic");
        return organizationClaims.Select(sr =>
        {
            return new UserContext()
            {
                ContextId = "AdministratorTehnic",
                ContextType = UserContextType.System,
                ContextName = "Administrator Tehnic",
                ContextRole = "Administrator Tehnic",
                UserId = principal.FindFirst("Username")?.Value,
                UserFirstName = principal.FindFirst("FirstName")?.Value,
                UserLastName = principal.FindFirst("LastName")?.Value,
                Role = "AdministratorTehnic"
            };
        });
    }

    private IEnumerable<UserContext> ExtractPAAdministrators(ClaimsPrincipal principal)
    {
        var organizationClaims = principal.Claims.Where(sr => sr.Type == ORGANIZATION_PA_ADMINISTRATOR_TYPE || sr.Type == "Administrator AP");
        return organizationClaims.Select(sr =>
        {
            var organization = ExtractOrganizationIDNO(sr.Value);
            var userContext = new UserContext()
            {
                ContextId = organization.IDNO + "_Administrator",
                ContextType = UserContextType.System,
                ContextName = organization.Organization,
                ContextRole = "Administrator Autoritate Publica",
                UserId = principal.FindFirst("Username")?.Value,
                UserFirstName = principal.FindFirst("FirstName")?.Value,
                UserLastName = principal.FindFirst("LastName")?.Value,
                Role = "AdministratorAP"
            };
            userContext.Attributes.Add(new KeyValuePair<string, string>("IDNO", organization.IDNO));
            userContext.Attributes.Add(new KeyValuePair<string, string>("OrganizationName", organization.Organization));
            return userContext;
        });
    }

    private (string Organization, string IDNO) ExtractOrganizationIDNO(string claimValue)
    {
        if (claimValue.Contains(":"))
        {
            var arr = claimValue.Split(":");
            return (arr[1], arr[0]);
        }
        var organization = claimValue.Substring(0, claimValue.Length - IDNO_LENGTH - 1);
        var idno = claimValue.Substring(claimValue.Length - IDNO_LENGTH);
        return (organization, idno);
    }
}
```

#### 2. Înregistrarea `CustomUserContextProvider` în containerul de dependențe

În `Startup.cs` sau în configurarea serviciilor aplicației, trebuie înregistrată implementarea `IUserContextProvider`:

```csharp
services.AddScoped<IUserContextProvider, CustomUserContextProvider>();
```

### Concluzie
Prin implementarea unui `IUserContextProvider` personalizat, aplicația poate genera și gestiona contexte variate ale utilizatorilor în mod flexibil, asigurând integrarea acestora în ecosistemul FOD. Această soluție permite personalizarea accesului și gestionarea rolurilor utilizatorilor într-un mod scalabil și eficient.

