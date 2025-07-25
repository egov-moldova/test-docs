# FodAdditionalDataTypeValue

## Descriere
Entitatea `FodAdditionalDataTypeValue` stochează valorile posibile pentru câmpurile adiționale de tip listă (dropdown, select multiplu). Aceasta permite definirea opțiunilor disponibile pentru câmpurile de selecție în mod dinamic.

## Proprietăți

| Proprietate | Tip | Descriere |
|------------|-----|-----------|
| `Value` | `string?` | Valoarea tehnică/internă a opțiunii |
| `Label` | `string?` | Eticheta afișată utilizatorului |

## Relații
- **FodAdditionalData** - Câmpul adițional părinte pentru care se definesc valorile

## Utilizare

### Exemplu de definire valori pentru dropdown
```csharp
var valoriTipDocument = new List<FodAdditionalDataTypeValue>
{
    new FodAdditionalDataTypeValue { Value = "CI", Label = "Carte de identitate" },
    new FodAdditionalDataTypeValue { Value = "PS", Label = "Pașaport" },
    new FodAdditionalDataTypeValue { Value = "PN", Label = "Permis de conducere" },
    new FodAdditionalDataTypeValue { Value = "CN", Label = "Certificat de naștere" }
};
```

### Exemplu de utilizare în formular
```razor
<FodSelect @bind-Value="selectedValue" Label="Tip document">
    @foreach (var option in additionalData.TypeValues)
    {
        <FodSelectItem Value="@option.Value">@option.Label</FodSelectItem>
    }
</FodSelect>
```

### Exemplu de adăugare valori dinamice
```csharp
public void AddTypeValue(FodAdditionalData field, string value, string label)
{
    if (field.Type != AdditionalDataType.Select && 
        field.Type != AdditionalDataType.MultiSelect)
    {
        throw new InvalidOperationException("Valorile pot fi adăugate doar pentru câmpuri de tip Select");
    }
    
    field.TypeValues.Add(new FodAdditionalDataTypeValue
    {
        Value = value,
        Label = label
    });
}
```

## Note importante
- Folosit exclusiv pentru câmpuri de tip Select sau MultiSelect
- Valoarea tehnică (`Value`) este cea stocată în baza de date
- Eticheta (`Label`) este cea afișată utilizatorului
- Permite traducerea etichetelor fără a afecta valorile stocate
- Ordinea valorilor este determinată de ordinea din colecție