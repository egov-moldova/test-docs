# FodAdditionalData

## Descriere
Entitatea `FodAdditionalData` definește câmpurile adiționale personalizabile pentru servicii și cereri. Aceasta permite extinderea dinamică a formularelor cu câmpuri specifice fiecărui serviciu, fără a modifica structura bazei de date.

## Proprietăți

| Proprietate | Tip | Descriere |
|------------|-----|-----------|
| `Name` | `string?` | Numele tehnic al câmpului adițional |
| `AdditionalInformation` | `string?` | Informații suplimentare sau descriere detaliată |
| `IsRequired` | `bool?` | Indică dacă câmpul este obligatoriu |
| `OrderNumber` | `decimal?` | Ordinea de afișare în formular |
| `Type` | `AdditionalDataType?` | Tipul de date (text, număr, dată, etc.) |
| `TypeValues` | `ICollection<FodAdditionalDataTypeValue>` | Valorile posibile pentru câmpuri de tip listă |

## Relații
- **FodAdditionalDataTypeValue** - Colecție de valori posibile pentru câmpuri de tip dropdown/select
- **FodService** - Serviciul pentru care se definește câmpul adițional
- **FodServiceAdditionalData** - Legătura many-to-many cu serviciile

## Enum AdditionalDataType
```csharp
public enum AdditionalDataType
{
    Text = 1,
    Number = 2,
    Date = 3,
    Boolean = 4,
    Select = 5,
    MultiSelect = 6,
    File = 7,
    Email = 8,
    Phone = 9
}
```

## Utilizare

### Exemplu de creare câmp text obligatoriu
```csharp
var campAdițional = new FodAdditionalData
{
    Name = "CNP",
    AdditionalInformation = "Codul numeric personal al solicitantului",
    IsRequired = true,
    OrderNumber = 1,
    Type = AdditionalDataType.Text
};
```

### Exemplu de creare câmp dropdown
```csharp
var campSelectie = new FodAdditionalData
{
    Name = "TipDocument",
    AdditionalInformation = "Selectați tipul de document solicitat",
    IsRequired = true,
    OrderNumber = 2,
    Type = AdditionalDataType.Select,
    TypeValues = new List<FodAdditionalDataTypeValue>
    {
        new() { Value = "CI", Label = "Carte de identitate" },
        new() { Value = "PS", Label = "Pașaport" },
        new() { Value = "PN", Label = "Permis de conducere" }
    }
};
```

### Exemplu de validare dinamică
```csharp
public bool ValidateAdditionalData(Dictionary<string, object> values)
{
    foreach (var field in additionalDataFields)
    {
        if (field.IsRequired == true && !values.ContainsKey(field.Name))
        {
            throw new ValidationException($"Câmpul '{field.Name}' este obligatoriu");
        }
        
        // Validare specifică pe tip
        if (values.TryGetValue(field.Name, out var value))
        {
            switch (field.Type)
            {
                case AdditionalDataType.Email:
                    if (!IsValidEmail(value.ToString()))
                        throw new ValidationException($"Email invalid pentru câmpul '{field.Name}'");
                    break;
                case AdditionalDataType.Phone:
                    if (!IsValidPhone(value.ToString()))
                        throw new ValidationException($"Telefon invalid pentru câmpul '{field.Name}'");
                    break;
            }
        }
    }
    return true;
}
```

## Note importante
- Câmpurile adiționale permit personalizarea formularelor fără modificări de cod
- Ordinea de afișare este controlată prin `OrderNumber`
- Pentru câmpuri de tip Select/MultiSelect, valorile sunt stocate în `TypeValues`
- Validarea trebuie implementată dinamic în funcție de tipul câmpului
- Numele câmpului trebuie să fie unic în cadrul unui serviciu