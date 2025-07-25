# Fod Request Cost  
**Documentație pentru `FodRequestCost`**

## Descriere generală
`FodRequestCost` este o componentă Blazor utilizată pentru afișarea și gestionarea costurilor asociate unei cereri de servicii. Componenta interacționează cu un model de tip `FodRequestCostModel`, care la rândul său conține o listă de submodele de tip `FodServiceRequestCostModel`.

## Funcționalități principale
- Afișarea unei secțiuni cu costuri pentru servicii cerute.  
- Posibilitatea de a afișa un mesaj personalizat când nu există costuri (`NoCostMessage`).  
- Suport pentru localizarea dinamică a etichetelor asociate fiecărui cost prin intermediul atributului `[Display]` și `IStringLocalizerFactory`.

---

## Proprietăți

| Proprietate      | Tip                   | Descriere                                                |
|------------------|------------------------|-----------------------------------------------------------|
| Model            | `FodRequestCostModel`  | Modelul principal care conține lista de costuri.         |
| NoCostMessage    | `string`              | Mesajul afișat când nu există costuri disponibile.       |

---

## Funcționalități interne

### `GetLabel(submodel)`
- Verifică dacă proprietatea corespunzătoare `ServiceName` din `FodServiceRequestCostModel` are atributul `[Display]`.
- Dacă există, afișează valoarea din `ResourceType`, localizată prin `IStringLocalizerFactory`.

### `HasAttribute<TAttribute>(submodel)`
- Verifică dacă o proprietate specificată are un anumit atribut (ex: `DisplayAttribute`).

### `GetLocalizedString(Type, string)`
- Utilizează `IStringLocalizerFactory` pentru a accesa și returna un string localizat dintr-un resource file.

---

## Exemplu de utilizare

```razor
@using Fod.Components.Shared.Models.Business
@using Fod.Components.Shared.Models.Business.Discount

<FodRequestCost Model="Exemple"></FodRequestCost>

@code {
    public FodRequestCostModel Exemple = new FodRequestCostModel()
    {
        ServiceRequestCosts = new List<FodServiceRequestCostModel>()
        {
            new FodServiceRequestCostModel()
            {
                InitialCost = 330,
                Reason = ServiceCostReasonEnum.Calculated,
                ServiceName = "Extras din registrul unităților de drept",
                Options = new List<ServiceRequestCostOptionModel>
                {
                    new ServiceRequestCostOptionModel{
                        Title = "Termenul de execuție",
                        Value = "3 zile"
                    },
                    new ServiceRequestCostOptionModel{
                        Title = "Pentru idno",
                        Value = "1000000000001",
                        Options = new List<ServiceRequestCostOptionModel>
                        {
                            new ServiceRequestCostOptionModel{
                                Value = "Destinația: la solicitare",
                            }
                        }
                    }
                },
                Discounts = new List<FodDiscountModel>()
                {
                    new FodDiscountModel()
                    {
                        CalculatedDiscount = 66,
                        DiscountPercent = 20,
                        Reason = "Redurecere pentru pesionari"
                    },
                    new FodDiscountModel()
                    {
                        CalculatedDiscount = 33,
                        DiscountPercent = 10,
                        Reason = "Format electronic"
                    }
                },
                Taxes = new List<FodTaxModel>
                {
                    new FodTaxModel()
                    {
                        Tax = 10,
                        Reason = "Taxa de stat"
                    }
                }
            },
            new FodServiceRequestCostModel()
            {
                InitialCost = 50,
                Reason = ServiceCostReasonEnum.Calculated,
                ServiceName = "Livrare prin intermediul MDelivery (Fan Curier)."
            }
        }
    };
}
```

---

## Modele asociate

### `FodRequestCostModel`
Modelul `FodRequestCostModel` este utilizat pentru a reprezenta costurile totale asociate unei cereri de servicii.

| Proprietate           | Tip                                | Descriere                                                       |
|------------------------|-------------------------------------|------------------------------------------------------------------|
| ServiceRequestCosts    | `IList<FodServiceRequestCostModel>` | Lista costurilor asociate serviciilor incluse în cerere.         |
| Cost                  | `decimal`                           | Costul final calculat al întregii cereri, însumând toate serviciile. |

### `FodServiceRequestCostModel`
Modelul `FodServiceRequestCostModel` conține detalii despre costurile unui anumit serviciu solicitat.

| Proprietate  | Tip                                | Descriere                                                       |
|--------------|-------------------------------------|------------------------------------------------------------------|
| InitialCost  | `decimal`                          | Costul inițial al serviciului înainte de reduceri sau taxe.      |
| Cost         | `decimal`                          | Costul final calculat (`InitialCost – Discounts + Taxes`).       |
| Discounts    | `IList<FodDiscountModel>`          | Lista de reduceri aplicate serviciului.                          |
| Taxes        | `IList<FodTaxModel>`               | Lista de taxe aplicate serviciului.                              |
| Options      | `IList<ServiceRequestCostOptionModel>` | Opțiuni suplimentare pentru costul serviciului.              |
| Reason       | `ServiceCostReasonEnum`            | Motivul definirii costului serviciului.                          |
| ServiceName  | `string`                           | Numele serviciului (utilizat și pentru localizare).              |

### `ServiceRequestCostOptionModel`
Modelul `ServiceRequestCostOptionModel` reprezintă opțiuni de configurare pentru costuri individuale.

| Proprietate | Tip                                 | Descriere                                                   |
|-------------|--------------------------------------|--------------------------------------------------------------|
| Title       | `string`                            | Titlul opțiunii.                                             |
| Value       | `string`                            | Valoarea opțiunii.                                           |
| Options     | `IList<ServiceRequestCostOptionModel>` | Subopțiuni pentru structuri ierarhice complexe.        |

---

## Observații
- Componenta este parțială și folosește un fișier `code-behind` (`FodRequestCost.razor.cs`) pentru logică.  
- Este compatibilă cu infrastructura de localizare a Blazor și .NET prin `DisplayAttribute` și `ResourceType`.  
- Necesită ca numele serviciului (`ServiceName`) din fiecare submodel să corespundă cu o proprietate validată prin reflecție.
