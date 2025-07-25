## `IRequestService<T>` (.cs)

```csharp
namespace: Fod.Components.Shared.Services
```

Interfață generică ce extinde `IRequestService`, utilizată pentru gestionarea solicitărilor de tip `FodRequestModel`. Aceasta definește operații uzuale asupra unei solicitări, inclusiv inițializare, validare, semnare și generare de chitanțe.

### Tipuri generice

* `T`: Un model care derivă din `FodRequestModel`.

### Metode

| Semnătură                                                                           | Descriere                                      |
| ----------------------------------------------------------------------------------- | ---------------------------------------------- |
| `Task<T> New(string requestTypeCode)`                                               | Creează o solicitare nouă de tipul specificat. |
| `Task<T> Get(Guid id, string requestTypeCode)`                                      | Obține o solicitare existentă după ID și tip.  |
| `Task<T> AddOrUpdate(T requestModel)`                                               | Adaugă sau actualizează o solicitare.          |
| `Task<VerifyRequestResponse> VerifyAndConfirm(T requestModel)`                      | Verifică și confirmă o solicitare.             |
| `Task<ValidateRequestResponse> Validate(T requestModel)`                            | Validează o solicitare.                        |
| `Task<SignRequestModel> Sign(T requestModel)`                                       | Pregătește solicitarea pentru semnare.         |
| `Task<string> RedirectToMSign(Guid requestId, string requestTypeCode)`              | Redirecționează către semnarea cu MSign.       |
| `Task<string> GetMSignUrl(Guid requestId, string requestTypeCode)`                  | Returnează URL-ul pentru semnarea cu MSign.    |
| `Task<string> VerifySignature(string signRequestId, string requestTypeCode)`        | Verifică semnătura unei solicitări.            |
| `Task<FodFile> GetReceipt(Guid id, string requestTypeCode)`                         | Obține chitanța pentru solicitare.             |
| `Task<FodFile> PrintReceipt(Guid id, string requestTypeCode, string baseHref = "")` | Generează un fișier printabil cu chitanța.     |
| `Task<FodRequestCostModel> CalculateCost(T requestModel)`                           | Calculează costul pentru solicitare.           |
| `Task<DateTime?> CalculateEstimateResolveDate(T requestModel)`                      | Estimează data de soluționare a solicitării.   |

---

## `IRequestService` (.cs)

```csharp
namespace: Fod.Components.Shared.Services
```

Interfață de bază care oferă funcționalitatea de obținere a opțiunilor pentru un anumit tip de solicitare.

### Metode

| Semnătură                                                         | Descriere                                                 |
| ----------------------------------------------------------------- | --------------------------------------------------------- |
| `Task<FodRequestOptionsModel> GetOptions(string requestTypeCode)` | Returnează modelul de opțiuni pentru tipul de solicitare. |

---

## `FodRequestOptionsModel` (.cs)

```csharp
namespace: Fod.Components.Shared.Models.Business
```

Model care conține opțiuni și metadate asociate unui tip de solicitare.

### Constructor

* Inițializează listele:

  * `MPowerAuthorization`
  * `ServiceOptions`
  * `PickupLocations`

### Proprietăți

| Nume                           | Tip                               | Descriere                                             |
| ------------------------------ | --------------------------------- | ----------------------------------------------------- |
| `IsUserAuthenticated`          | `bool`                            | Specifică dacă utilizatorul este autentificat.        |
| `AvailableMPowerAuthorization` | `bool`                            | Indică dacă autorizarea MPower este disponibilă.      |
| `ShowRequestingAsType`         | `bool`                            | Afișează opțiunea de alegere a tipului de solicitant. |
| `MPowerAuthorizationCodes`     | `string[]?`                       | Codurile autorizărilor MPower disponibile.            |
| `RequestorPhoneRequired`       | `bool`                            | Telefonul solicitantului este obligatoriu.            |
| `RequestorEmailRequired`       | `bool`                            | Email-ul solicitantului este obligatoriu.             |
| `InformativeMessage`           | `string`                          | Mesaj informativ pentru solicitant.                   |
| `ServiceProviderPhone`         | `string?`                         | Număr de telefon al furnizorului de servicii.         |
| `ServiceProviderEmail`         | `string?`                         | Email al furnizorului de servicii.                    |
| `PersonType`                   | `RequestPersonTypeModel?`         | Tipul persoanei solicitante (ex: fizică/juridică).    |
| `AuthentificationStatus`       | `AuthentificationStatusModel?`    | Starea autentificării utilizatorului.                 |
| `ServiceOptions`               | `IList<FodServiceOptionsModel>`   | Opțiunile de servicii disponibile.                    |
| `PickupLocations`              | `IList<FodPickupLocationModel>`   | Locuri de ridicare disponibile.                       |
| `ApostilaOptions`              | `FodApostilaOptionsModel?`        | Opțiuni specifice pentru apostilă.                    |
| `MPowerAuthorization`          | `List<MPowerAuthorization>`       | Lista detaliată a autorizărilor MPower.               |
| `ReceptionModeModel`           | `FodReceptionModeModel?`          | Model pentru modul de recepție.                       |
| `RequestorStatuteModels`       | `List<FodRequestorStatuteModel>?` | Lista de statute posibile pentru solicitant.          |
