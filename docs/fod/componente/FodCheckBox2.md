# CheckBox2  
**Documentație pentru `FodCheckBox2`**

## Descriere generală
`FodCheckBox2` este o componentă Blazor care extinde `FodBooleanInput<T>`, utilizată pentru a afișa și gestiona un input de tip checkbox în cadrul unui formular. Componenta suportă:
- validare,
- stări de `readonly` și `disabled`,
- binding bidirecțional,
- propagarea configurabilă a evenimentelor.

---

## Ierarhie moștenire
```
FodCheckBox2
 └── FodBooleanInput<T>
      └── FodFormComponent<T, bool?>
```

---

## Proprietăți moștenite

| Proprietate          | Tip             | Descriere                                                                 |
|----------------------|------------------|---------------------------------------------------------------------------|
| Checked              | `T?`             | Valoarea curentă a checkbox-ului. Mapată intern în `bool?`.              |
| CheckedChanged       | `EventCallback<T?>` | Eveniment declanșat când `Checked` se modifică.                     |
| OnCheckedChanged     | `EventCallback`   | Eveniment suplimentar la modificarea stării bifate.                      |
| Disabled             | `bool`           | Dacă este `true`, componenta este dezactivată.                           |
| ReadOnly             | `bool`           | Dacă este `true`, componenta este doar pentru vizualizare.               |
| StopClickPropagation| `bool`           | Dacă este `true`, oprește propagarea evenimentului de click.            |
| Required             | `bool`           | Dacă este `true`, câmpul este obligatoriu.                               |
| RequiredError        | `string`         | Mesajul de eroare afișat dacă `Required` este `true` și nu e bifat.     |
| Error                | `bool`           | Indică dacă există o eroare afișată.                                     |
| ErrorText            | `string`         | Textul erorii afișate.                                                   |
| Validation           | `object`         | Logica de validare (sincronă sau asincronă).                             |

---

## Funcționalitate

### `SetBoolValueAsync(bool? value)`
Convertă valoarea primită în `T?`, setează `Checked`, declanșează evenimente și validare.

### `GetDisabledState()` / `GetReadOnlyState()`
Determină starea finală a componentului ținând cont și de părintele contextual (`ParentDisabled`, `ParentReadOnly`).

---

## Validare
Componenta consideră că are o valoare validă **doar dacă checkbox-ul este bifat** (adică valoarea este `true`).

```csharp
protected override bool HasValue(T? value)
{
    return (BoolValue == true);
}
```

---

## Exemplu de utilizare

```razor
<FodCheckBox2 @bind-Checked="model.IsAccepted"
              Required="true"
              RequiredError="Trebuie sa accepti termenii."
              OnCheckedChanged="@(() => Console.WriteLine(\"Checked!\"))" />
```

---

## Alte observații
- `FodCheckBox2` este potrivită pentru utilizare în formulare complexe cu validare integrată.  
- Se integrează complet cu `EditForm` din Blazor și suportă validări asincrone și personalizate.  
- Poate moșteni comportamente de la componente părinte (cum ar fi `Disabled` sau `ReadOnly`) prin `CascadingParameter`.
