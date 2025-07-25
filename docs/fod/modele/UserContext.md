# UserContext
**Documentație pentru `UserContext`**

---

## Descriere generală
Această clasă este utilizată și pentru a genera **roluri și contexte personalizate** ale utilizatorului, fiind baza logicii dinamice de construire a permisiunilor și a vizibilității funcționalităților în cadrul aplicației.

---

## Proprietăți

| Proprietate     | Tip                                  | Descriere                                                                 |
|-----------------|----------------------------------------|---------------------------------------------------------------------------|
| UserId          | `string?`                             | ID-ul unic al utilizatorului.                                             |
| UserFirstName   | `string?`                             | Prenumele utilizatorului.                                                 |
| UserLastName    | `string?`                             | Numele de familie al utilizatorului.                                      |
| ContextName     | `string?`                             | Numele contextului activ.                                                 |
| ContextId       | `string?`                             | ID-ul contextului activ.                                                  |
| ContextRole     | `string?`                             | Rolul utilizatorului în contextul activ.                                  |
| Role            | `string?`                             | Rolul global al utilizatorului.                                           |
| RoleName        | `string?`                             | Numele complet al rolului.                                                |
| Attributes      | `List<KeyValuePair<string, string>>`  | Listă de atribute suplimentare legate de utilizator (ex: email, departament). |
| ContextType     | `UserContextType`                     | Tipul contextului activ (ex: `Individual`, `Organization`).               |

---

## Enum: `UserContextType`
`UserContextType` este un enum care indică tipul contextului activ:

```csharp
public enum UserContextType
{
    Individual,
    Organization,
    CUPSOperator,
    System
}
```

---

## Utilizare
Acest model este esențial în aplicațiile multi-contextuale, permițând:
- afișarea de informații relevante despre utilizator;
- aplicarea permisiunilor și rolurilor;
- personalizarea experienței utilizatorului în funcție de context.

---

## Exemplu de utilizare

```csharp
UserContext? context = await contextService.GetUserContext();
if (context?.ContextType == UserContextType.Organization)
{
    Console.WriteLine($"Organizația curentă: {context.ContextName}");
}
