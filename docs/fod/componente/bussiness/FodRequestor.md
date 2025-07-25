# FodRequestor Component Documentation

## Descriere Generală

`FodRequestor` este un component Razor care oferă un formular pentru completarea și validarea datelor referitoare la solicitant (persoană fizică sau juridică). Este folosit în aplicațiile FOD pentru colectarea detaliilor despre utilizatorul care inițiază o solicitare sau acționează în numele altuia. Componenta suportă scenarii precum:
- Completarea datelor pe baza IDNP/IDNO.
- Selectarea statutului solicitantului.
- Validarea automată a relațiilor de reprezentare.
- Personalizarea comportamentului prin diverse opțiuni.

---

## Proprietăți Publice

| Proprietate | Tip | Descriere |
|------------|-----|-----------|
| AuthorizationErrorMessage | `string` | Mesaj de eroare afișat în cazul unei autorizări eșuate. |
| HideOnBehalfOn | `bool` | Ascunde secțiunea "în numele altuia" din formular. |
| RequestorIdnpLoading | `bool` | Indică dacă datele pentru IDNP sunt în curs de încărcare. |
| VerifyEntityRelationship | `bool` | Specifică dacă trebuie verificat automat raportul dintre utilizator și entitate. |
| AutoPopulateNameByIdnp | `bool` | Activează completarea automată a numelui pe baza IDNP. |
| RequestorFirstNameLoading | `bool` | Indicator pentru încărcarea prenumelui solicitantului. |
| ShowRequestorIndividualDetails | `bool` | Afișează detalii specifice pentru persoană fizică. |
| OnRequestorFirstNameChanged | `EventCallback<string>` | Eveniment declanșat la modificarea prenumelui. |
| OnRequestorIdnoChanged | `EventCallback<string>` | Eveniment pentru schimbarea IDNO. |
| OnBehalfOnFirstOptionText | `string` | Text personalizat pentru prima opțiune "în numele altuia". |
| OnBehalfOfPosition | `LabelPosition` | Poziția etichetei pentru secțiunea "în numele altuia". |
| IsPhoneRequired | `bool` | Specifică dacă numărul de telefon este obligatoriu. |
| AutoPopulateOrganizationNameByIdno | `bool` | Completează automat numele organizației pe baza IDNO. |
| LoadFromContext | `bool` | Încarcă automat datele din contextul utilizatorului. |
| OnRequestorCompanyNameChanged | `EventCallback<string>` | Eveniment declanșat la modificarea denumirii companiei. |
| ShowOnBehalfOf | `bool` | Afișează opțiunea de a acționa în numele altuia. |
| ValidateNameByIdnp | `bool` | Activează validarea numelui pe baza IDNP. |
| DisableRequestorType | `bool` | Dezactivează selectarea tipului solicitantului. |
| DisableRequestorIdno | `bool` | Dezactivează editarea IDNO. |
| OnRequestorPhoneChanged | `EventCallback<string>` | Eveniment pentru schimbarea numărului de telefon. |
| LoadPersonTypeFromContext | `bool` | Încarcă tipul persoanei (fizică/juridică) din context. |
| RequestorCompanyNameLoading | `bool` | Indicator pentru încărcarea denumirii companiei. |
| IsReadonly | `bool` | Setează formularul ca doar pentru citire. |
| OnBehalfOnChanged | `EventCallback<OnBehalfOnEnum>` | Eveniment declanșat la schimbarea opțiunii "în numele altuia". |
| HideRequestorOrganisation | `bool` | Ascunde secțiunea pentru organizație. |
| OnRequestorIdnpChanged | `EventCallback<string>` | Eveniment pentru schimbarea IDNP. |
| isLoadingMPower | `bool` | Afișează indicatorul de încărcare pentru autorizațiile MPower. |
| HideRequestorIndividual | `bool` | Ascunde complet secțiunea pentru persoană fizică. |
| ConnectionExist | `bool` | Informație despre existența conexiunii cu entitatea. |
| Model | `IRequestor` | Modelul de date pentru solicitant. |
| OnBehalfOnSecondOptionText | `string` | Textul pentru a doua opțiune "în numele altuia". |
| RequestorLastNameLoading | `bool` | Indicator pentru încărcarea numelui de familie. |
| HideRequestorIdnp | `bool` | Ascunde câmpul IDNP din formular. |
| DisableReadOnlyOnInvalid | `bool` | Permite editarea chiar și în caz de date invalide. |
| HideAuthorization | `bool` | Ascunde secțiunea de autorizare MPower. |
| PhonePlaceholder | `string` | Textul afișat ca placeholder pentru câmpul de telefon. |
| OnRequestorLastNameChanged | `EventCallback<string>` | Eveniment pentru schimbarea numelui de familie. |
| RequestorEmailLoading | `bool` | Indicator pentru încărcarea emailului. |
| HideRequestorIndividualDetails | `bool` | Ascunde detaliile personale ale solicitantului. |
| OnChangeSelectedAuthorization | `EventCallback<MPowerAuthorization>` | Eveniment declanșat la selectarea unei autorizații MPower. |
| IsNameValidating | `bool` | Indicator pentru procesul de validare a numelui. |
| HideRequestorType | `bool` | Ascunde selectarea tipului solicitantului. |
| AdministratorIsInvalid | `bool` | Semnalizează o eroare pentru datele administratorului. |
| RequestorIdnoLoading | `bool` | Indicator pentru încărcarea IDNO. |
| OnEntityRelationshipVerified | `EventCallback<bool>` | Eveniment declanșat când relația este validată. |
| NameIsInvalid | `bool` | Semnalează o problemă de validare a numelui. |
| IsEmailRequired | `bool` | Specifică dacă emailul este obligatoriu. |
| OnRequestorTypeChanged | `EventCallback<PersonType>` | Eveniment la schimbarea tipului de persoană. |
| MPowerAuthorizations | `List<MPowerAuthorization>` | Lista autorizațiilor disponibile prin MPower. |
| OnChanged | `EventCallback` | Eveniment generic declanșat la orice schimbare din formular. |
| OnRequestorEmailChanged | `EventCallback<string>` | Eveniment pentru schimbarea emailului. |
| RequestorPhoneLoading | `bool` | Indicator pentru încărcarea telefonului. |
| HasMultipleRequestorStatute | `bool` | Specifică dacă există mai multe statute posibile. |
| DisableOnBehalfOn | `bool` | Dezactivează opțiunea "în numele altuia". |
| DisableRequestorCompanyName | `bool` | Dezactivează editarea denumirii companiei. |
| isInvalid | `bool` | Stare de validare globală pentru formular. |

---

## Metode Publice

| Semnătură | Descriere |
|-----------|-----------|
| `async void PersonTypeChanged(PersonType e)` | Declanșat la schimbarea tipului de persoană. |
| `async void MPowerOnChanged(MPowerAuthorization e)` | Gestionează schimbarea autorizației MPower. |
| `async Task RequestorFirstNameChanged(string e)` | Gestionează modificarea prenumelui. |
| `async Task OnInitializedAsync()` | Inițializează componenta la încărcare. |
| `async Task RequestorIdnpChanged(string e)` | Gestionează modificarea IDNP. |
| `async Task CheckEntityStatus()` | Verifică statutul entității din context. |
| `async Task RequestorStatuteChanged(FodRequestorStatuteModel value)` | Gestionează schimbarea statutului solicitantului. |
| `async Task RequestorLastNameChanged(string e)` | Gestionează modificarea numelui de familie. |
| `async void InitFromContext(object sender, UserContext currentContext)` | Inițializează componenta din contextul curent. |
| `async Task ValidateAdministrator()` | Validează datele administratorului. |
| `async void RequestorCompanyNameChanged(string e)` | Gestionează modificarea numelui companiei. |
| `async Task PopulateOrganizationName()` | Completează automat denumirea organizației. |
| `async Task RequestorIdnoChanged(string e)` | Gestionează modificarea IDNO. |
| `async void RequestorEmailChanged(string e)` | Gestionează modificarea emailului. |
| `async void RequestorPhoneChanged(string e)` | Gestionează modificarea telefonului. |
| `async Task PopulateName()` | Completează automat numele pe baza IDNP. |
| `async Task ValidateName()` | Validează datele introduse. |
| `async void BehalfOnChanged(OnBehalfOnEnum e)` | Gestionează schimbarea opțiunii "în numele altuia". |

---

## Evenimente / Callbacks

| Declanșator | Descriere |
|-------------|-----------|
| `OnValueChanged="RequestorFirstNameChanged"` | Când este modificat prenumele solicitantului. |
| `OnValueChanged="RequestorPhoneChanged"` | Când este modificat numărul de telefon. |
| `OnValueChanged="RequestorIdnoChanged"` | Când este modificat IDNO. |
| `OnValueChanged="PersonTypeChanged"` | Când este schimbat tipul persoanei. |
| `OnValueChanged="MPowerOnChanged"` | Când este modificată autorizația MPower. |
| `OnValueChanged="RequestorCompanyNameChanged"` | Când este modificat numele companiei. |
| `OnValueChanged="RequestorEmailChanged"` | Când este modificat emailul. |
| `OnValueChanged="(value) => RequestorStatuteChanged(value)"` | Când este selectat un nou statut. |
| `OnValueChanged="BehalfOnChanged"` | Când este schimbată opțiunea "în numele altuia". |
| `OnValueChanged="RequestorLastNameChanged"` | Când este modificat numele de familie. |
| `OnValueChanged="RequestorIdnpChanged"` | Când este modificat IDNP-ul. |

---

## Funcționalități Cheie

- **Validare automată a identității**: pe baza IDNP/IDNO se poate completa automat numele sau compania.
- **Control granular asupra afișării câmpurilor**: folosind proprietăți precum `HideRequestorType`, `ShowOnBehalfOf`, `DisableRequestorIdnp` etc.
- **Interacțiuni cu serviciile externe**: utilizarea `IRequestorComponentService` și `IContextService` pentru validări și inițializări.
- **Localizare**: mesaje și opțiuni localizate prin `IStringLocalizer`.

---

## Dependențe Injectate

| Serviciu | Descriere |
|----------|-----------|
| `IRequestorComponentService` | Pentru logica business legată de solicitant. |
| `IContextService` | Pentru accesarea contextului utilizatorului. |
| `INameService` | Pentru completarea automată a numelui prin IDNP. |
| `IStringLocalizer<>` | Pentru localizarea textelor și mesajelor. |

---

## Configurare `appsettings.json`

Pentru ca `FodRequestor` să funcționeze corect, este necesară configurarea fișierului `appsettings.json` cu următoarele opțiuni în secțiunea `Components:Requestor`:

| Cheie | Tip | Descriere |
|-------|-----|-----------|
| `AllowGetRequestorData` | `bool` | Permite extragerea automată a datelor solicitantului (nume, prenume) pe baza IDNP. |
| `AllowGetOrganizationData` | `bool` | Permite extragerea denumirii organizației pe baza IDNO. |
| `BlurName` | `bool` | Specifică dacă numele/prenumele să fie mascate parțial (ex. M*** în loc de Maria). |
| `AllowFullName` | `bool` | Dacă este activat, permite afișarea completă a numelui fără mascarea acestuia. |
| `MConnectReason` | `string` | Motivul transmis în cadrul cererii către serviciul MConnect, utilizat pentru audit. |

Exemplu:
```json
"Components": {
  "Requestor": {
    "AllowGetRequestorData": true,
    "AllowGetOrganizationData": true,
    "BlurName": true,
    "AllowFullName": false,
    "MConnectReason": "Extragerea datelor solicitantului, pentru prestarea serviciului 'Solicitare cazier judiciar, cazier contravențional și alte certificate'"
  }
}
```

## Observații

Această componentă este proiectată pentru reutilizare și poate fi personalizată extensiv prin parametrii și evenimentele disponibile. Recomandăm utilizarea acesteia în paginile de inițiere a solicitărilor sau completarea automată a informațiilor despre utilizatori sau entități juridice.

